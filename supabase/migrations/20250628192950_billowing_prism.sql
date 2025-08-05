-- Initialize the SkillGlide database
-- This file is automatically executed when the PostgreSQL container starts

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE skillglide_db TO skillglide_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO skillglide_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO skillglide_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO skillglide_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO skillglide_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO skillglide_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO skillglide_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO skillglide_user;