-- Check what tables exist in your database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check what RLS policies exist
SELECT policyname, tablename, cmd 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check what indexes exist
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public';

-- Check if RLS is enabled on trials table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'trials';

-- Check the structure of the trials table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'trials' 
ORDER BY ordinal_position; 