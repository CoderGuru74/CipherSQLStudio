// SQL Query Validation Utilities
export interface ValidationResult {
  valid: boolean;
  error?: string;
  severity?: 'low' | 'medium' | 'high';
}

export class SQLValidator {
  private static readonly DANGEROUS_KEYWORDS = [
    'DROP', 'DELETE', 'INSERT', 'UPDATE', 'CREATE', 'ALTER',
    'TRUNCATE', 'GRANT', 'REVOKE', 'COMMIT', 'ROLLBACK',
    'SAVEPOINT', 'RELEASE', 'LOCK', 'UNLOCK', 'CALL',
    'EXEC', 'EXECUTE', 'LOAD_FILE', 'INTO OUTFILE', 'COPY',
    'VACUUM', 'ANALYZE', 'REINDEX', 'CLUSTER'
  ];

  private static readonly ALLOWED_STATEMENTS = [
    'SELECT', 'WITH', 'VALUES'
  ];

  private static readonly SUSPICIOUS_PATTERNS = [
    /--/g,                    // SQL comments
    /\/\*[\s\S]*?\*\//g,     // Multi-line comments
    /;/g,                      // Multiple statements
    /\b(UNION|INTERSECT|EXCEPT)\b/gi, // Set operations (might be allowed in some cases)
    /\b(CASE|WHEN|THEN|ELSE|END)\b/gi, // Case statements (complex logic)
  ];

  private static readonly INJECTION_PATTERNS = [
    /\b(OR|AND)\s+\d+\s*=\s*\d+/gi,     // OR 1=1
    /\b(OR|AND)\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?/gi, // OR 'x'='x'
    /\b(UNION|SELECT)\s+(ALL|DISTINCT)?\s*SELECT/gi, // SQL injection pattern
    /\b(INSERT|UPDATE|DELETE)\s+INTO|SET|FROM/gi, // DML injection attempts
  ];

  static validateQuery(query: string): ValidationResult {
    const trimmedQuery = query.trim();
    
    // Basic checks
    if (!trimmedQuery) {
      return {
        valid: false,
        error: 'Query cannot be empty',
        severity: 'high'
      };
    }

    // Check for dangerous keywords
    for (const keyword of this.DANGEROUS_KEYWORDS) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (regex.test(trimmedQuery)) {
        return {
          valid: false,
          error: `Query contains forbidden keyword: ${keyword.toUpperCase()}`,
          severity: 'high'
        };
      }
    }

    // Check if query starts with allowed statements
    const firstWord = trimmedQuery.split(/\s+/)[0].toUpperCase();
    if (!this.ALLOWED_STATEMENTS.includes(firstWord)) {
      return {
        valid: false,
        error: `Only ${this.ALLOWED_STATEMENTS.join(', ')} statements are allowed`,
        severity: 'high'
      };
    }

    // Check for suspicious patterns
    for (const pattern of this.SUSPICIOUS_PATTERNS) {
      if (pattern.test(trimmedQuery)) {
        return {
          valid: false,
          error: 'Query contains suspicious content',
          severity: 'medium'
        };
      }
    }

    // Check for injection patterns
    for (const pattern of this.INJECTION_PATTERNS) {
      if (pattern.test(trimmedQuery)) {
        return {
        valid: false,
        error: 'Potential SQL injection detected',
          severity: 'high'
        };
      }
    }

    // Check for multiple statements (allow one semicolon at the end)
    const semicolonCount = (trimmedQuery.match(/;/g) || []).length;
    if (semicolonCount > 1) {
      return {
        valid: false,
        error: 'Multiple statements are not allowed',
        severity: 'high'
      };
    }

    // Check query length
    if (trimmedQuery.length > 10000) {
      return {
        valid: false,
        error: 'Query too long (maximum 10,000 characters)',
        severity: 'medium'
      };
    }

    // Check for nested queries (might be too complex)
    const nestedQueryDepth = this.calculateNestedQueryDepth(trimmedQuery);
    if (nestedQueryDepth > 5) {
      return {
        valid: false,
        error: 'Query too complex (maximum nesting depth is 5)',
        severity: 'medium'
      };
    }

    return { valid: true };
  }

  private static calculateNestedQueryDepth(query: string): number {
    let depth = 0;
    let maxDepth = 0;
    
    for (const char of query) {
      if (char === '(') {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
      } else if (char === ')') {
        depth--;
      }
    }
    
    return maxDepth;
  }

  static sanitizeQuery(query: string): string {
    // Basic sanitization for logging purposes
    return query
      .replace(/--.*$/gm, '') // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  static extractTables(query: string): string[] {
    const tableRegex = /\bFROM\s+(\w+)|\bJOIN\s+(\w+)/gi;
    const matches = query.match(tableRegex) || [];
    const tables = new Set<string>();
    
    matches.forEach(match => {
      const table = match.replace(/\b(FROM|JOIN)\s+/i, '');
      tables.add(table.toLowerCase());
    });
    
    return Array.from(tables);
  }

  static extractColumns(query: string): string[] {
    const selectRegex = /\bSELECT\s+(.*?)\s+FROM/i;
    const match = query.match(selectRegex);
    
    if (!match) return [];
    
    const selectPart = match[1];
    if (selectPart === '*') return ['*'];
    
    return selectPart
      .split(',')
      .map(col => col.trim().replace(/^(.+?)\s+AS\s+(\w+)$/i, '$1'))
      .filter(col => col && !col.includes('(')); // Filter out functions
  }
}

export default SQLValidator;
