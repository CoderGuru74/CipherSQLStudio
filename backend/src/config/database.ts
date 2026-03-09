import { Pool } from 'pg';

// Database configuration for different environments
const getDatabaseConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  const baseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'ciphersql_studio',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 10, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
  };

  switch (env) {
    case 'production':
      return {
        ...baseConfig,
        user: process.env.DB_READONLY_USER || 'ciphersql_readonly',
        password: process.env.DB_READONLY_PASSWORD || '',
        application_name: 'ciphersql-studio-prod',
      };
      
    case 'test':
      return {
        ...baseConfig,
        user: process.env_DB_USER || 'ciphersql_readonly',
        password: process.env.DB_PASSWORD || 'test_password',
        database: process.env.DB_NAME || 'ciphersql_studio_test',
        application_name: 'ciphersql-studio-test',
      };
      
    default: // development
      return {
        ...baseConfig,
        user: process.env.DB_READONLY_USER || 'ciphersql_readonly',
        password: process.env.DB_READONLY_PASSWORD || 'readonly_password',
        application_name: 'ciphersql-studio-dev',
      };
  }
};

// Create connection pool
export const dbPool = new Pool(getDatabaseConfig());

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const client = await dbPool.connect();
    try {
      await client.query('SELECT 1');
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Graceful shutdown
export const closeDatabasePool = async (): Promise<void> => {
  try {
    await dbPool.end();
    console.log('Database pool closed successfully');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing database pool...');
  await closeDatabasePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing database pool...');
  await closeDatabasePool();
  process.exit(0);
});

export default dbPool;
