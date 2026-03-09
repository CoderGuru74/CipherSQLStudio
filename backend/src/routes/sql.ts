import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

const router = Router();

// PostgreSQL connection pool - READ ONLY USER
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ciphersql_studio',
  user: process.env.DB_READONLY_USER || 'ciphersql_readonly',
  password: process.env.DB_READONLY_PASSWORD || 'readonly_password',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
});

// Query validation and sanitization
const validateQuery = (query: string): { valid: boolean; error?: string } => {
  const trimmedQuery = query.trim().toLowerCase();
  
  // Block dangerous SQL keywords
  const dangerousKeywords = [
    'drop', 'delete', 'insert', 'update', 'create', 'alter',
    'truncate', 'grant', 'revoke', 'commit', 'rollback',
    'savepoint', 'release', 'lock', 'unlock', 'call',
    'exec', 'execute', 'load_file', 'into outfile'
  ];
  
  for (const keyword of dangerousKeywords) {
    if (trimmedQuery.includes(keyword)) {
      return {
        valid: false,
        error: `Query contains forbidden keyword: ${keyword.toUpperCase()}`
      };
    }
  }
  
  // Only allow SELECT statements
  if (!trimmedQuery.startsWith('select') && !trimmedQuery.startsWith('with')) {
    return {
      valid: false,
      error: 'Only SELECT and WITH (CTE) queries are allowed'
    };
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /--/, // SQL comments
    /\/\*[\s\S]*?\*\//, // Multi-line comments
    /;/g, // Multiple statements (allow one semicolon at the end)
  ];
  
  const semicolonCount = (query.match(/;/g) || []).length;
  if (semicolonCount > 1) {
    return {
      valid: false,
      error: 'Multiple statements are not allowed'
    };
  }
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(query) && pattern !== /;$/) {
      return {
        valid: false,
        error: 'Query contains suspicious content'
      };
    }
  }
  
  return { valid: true };
};

// POST /api/sql/execute - Execute SQL query
router.post('/execute', async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const { query, assignmentId } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: 'Invalid query',
        message: 'Query is required and must be a string',
      });
    }
    
    // Validate query
    const validation = validateQuery(query);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Query validation failed',
        message: validation.error,
      });
    }
    
    // Execute query with read-only user
    const client = await pool.connect();
    
    try {
      // Set transaction to read-only for additional security
      await client.query('BEGIN READ ONLY');
      
      const result = await client.query(query);
      
      await client.query('COMMIT');
      
      const executionTime = Date.now() - startTime;
      
      // Transform results to a more client-friendly format
      const columns = result.fields.map((field: any) => field.name);
      const rows = result.rows.map((row: any) => 
        columns.map((col: string) => row[col])
      );
      
      res.json({
        success: true,
        columns,
        rows,
        rowCount: result.rowCount,
        executionTime: `${executionTime}ms`,
        assignmentId,
      });
      
    } catch (queryError: any) {
      await client.query('ROLLBACK');
      
      const executionTime = Date.now() - startTime;
      
      // Log the error for debugging
      console.error('SQL Query Error:', {
        query,
        error: queryError.message,
        code: queryError.code,
        assignmentId,
        timestamp: new Date().toISOString(),
      });
      
      res.status(400).json({
        success: false,
        error: 'SQL execution failed',
        message: queryError.message,
        code: queryError.code,
        executionTime: `${executionTime}ms`,
        assignmentId,
      });
      
    } finally {
      client.release();
    }
    
  } catch (error: any) {
    console.error('Database connection error:', error);
    res.status(500).json({
      error: 'Database connection failed',
      message: 'Unable to connect to the database',
    });
  }
});

// GET /api/sql/schema - Get database schema
router.get('/schema', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    
    try {
      // Get table information
      const tablesQuery = `
        SELECT 
          table_name,
          table_type
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `;
      
      const tablesResult = await client.query(tablesQuery);
      
      const tables = [];
      
      for (const table of tablesResult.rows) {
        // Get column information for each table
        const columnsQuery = `
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default,
            character_maximum_length,
            numeric_precision,
            numeric_scale
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = $1
          ORDER BY ordinal_position;
        `;
        
        const columnsResult = await client.query(columnsQuery, [table.table_name]);
        
        // Get primary key information
        const primaryKeyQuery = `
          SELECT a.attname
          FROM pg_index i
          JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
          WHERE i.indrelid = 'public.${table.table_name}'::regclass
          AND i.indisprimary;
        `;
        
        const primaryKeyResult = await client.query(primaryKeyQuery);
        const primaryKeys = primaryKeyResult.rows.map((row: any) => row.attname);
        
        // Get sample data (limited to 3 rows)
        const sampleDataQuery = `SELECT * FROM public.${table.table_name} LIMIT 3;`;
        const sampleDataResult = await client.query(sampleDataQuery);
        
        const columns = columnsResult.rows.map((col: any) => ({
          name: col.column_name,
          type: col.data_type,
          constraints: [
            ...(col.is_nullable === 'NO' ? ['NOT NULL'] : []),
            ...(primaryKeys.includes(col.column_name) ? ['PRIMARY KEY'] : []),
            ...(col.column_default ? ['DEFAULT'] : []),
          ],
        }));
        
        tables.push({
          name: table.table_name,
          columns,
          sampleData: sampleDataResult.rows,
        });
      }
      
      res.json({
        tables,
        timestamp: new Date().toISOString(),
      });
      
    } finally {
      client.release();
    }
    
  } catch (error: any) {
    console.error('Error fetching schema:', error);
    res.status(500).json({
      error: 'Failed to fetch database schema',
      message: error.message,
    });
  }
});

// Health check for database connection
router.get('/health', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    
    try {
      await client.query('SELECT 1');
      res.json({
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
      });
    } finally {
      client.release();
    }
    
  } catch (error: any) {
    console.error('Database health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
