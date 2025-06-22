-- Temporarily disable RLS to test insertion
ALTER TABLE trials DISABLE ROW LEVEL SECURITY;

-- Test insert (you can run this manually in SQL editor)
-- INSERT INTO trials (user_id, service_name, end_date) 
-- VALUES ('e54ca231-eb0f-4c68-b836-7b05172d2aaa', 'Test Service', '2025-06-20');

-- Re-enable RLS after testing
-- ALTER TABLE trials ENABLE ROW LEVEL SECURITY; 