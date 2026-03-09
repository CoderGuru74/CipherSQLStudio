-- Create Read-Only User for CipherSQL Studio
-- This script creates a secure read-only user for SQL execution
-- Run this as a database administrator

-- Drop existing read-only user if it exists (for re-runs)
DROP USER IF EXISTS ciphersql_readonly;

-- Create the read-only user with a secure password
-- CHANGE THIS PASSWORD IN PRODUCTION!
CREATE USER ciphersql_readonly WITH PASSWORD 'readonly_password';

-- Grant basic connection permissions
GRANT CONNECT ON DATABASE ciphersql_studio TO ciphersql_readonly;
GRANT USAGE ON SCHEMA public TO ciphersql_readonly;

-- Grant read-only access to all existing tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ciphersql_readonly;

-- Grant read-only access to all existing sequences
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO ciphersql_readonly;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ciphersql_readonly;

-- Create a function to automatically grant SELECT on new tables
CREATE OR REPLACE FUNCTION grant_select_on_new_tables()
RETURNS event_trigger AS $$
BEGIN
    IF TG_OP = 'CREATE TABLE' THEN
        EXECUTE format('GRANT SELECT ON TABLE %I TO ciphersql_readonly', TG_TABLE_NAME);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically grant permissions on new tables
DROP TRIGGER IF EXISTS auto_grant_select_trigger ON public;
CREATE CONSTRAINT TRIGGER auto_grant_select_trigger
    AFTER CREATE ON SCHEMA public
    FOR EACH STATEMENT
    EXECUTE FUNCTION grant_select_on_new_tables();

-- Revoke all dangerous permissions
REVOKE ALL ON SCHEMA public FROM ciphersql_readonly;
REVOKE ALL ON DATABASE ciphersql_studio FROM ciphersql_readonly;

-- Revoke create, update, delete permissions on all tables
REVOKE CREATE, TEMPORARY, CONNECT ON DATABASE ciphersql_studio FROM ciphersql_readonly;
GRANT CONNECT ON DATABASE ciphersql_studio TO ciphersql_readonly;

-- Ensure the user cannot create new objects
REVOKE CREATE ON SCHEMA public FROM ciphersql_readonly;

-- Set the user's search path to public only
ALTER USER ciphersql_readonly SET search_path TO public;

-- Output confirmation
SELECT 'Read-only user ciphersql_readonly created successfully' AS status;
