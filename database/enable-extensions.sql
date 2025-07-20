-- Enable necessary extensions for cron jobs and HTTP calls
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;

-- Grant permissions for the extensions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;
GRANT USAGE ON SCHEMA http TO postgres;

-- Verify extensions are enabled
SELECT 
  extname, 
  extversion 
FROM pg_extension 
WHERE extname IN ('pg_cron', 'http'); 