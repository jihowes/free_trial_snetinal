-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'trials';

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'trials';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own trials" ON trials;
DROP POLICY IF EXISTS "Users can insert own trials" ON trials;
DROP POLICY IF EXISTS "Users can update own trials" ON trials;
DROP POLICY IF EXISTS "Users can delete own trials" ON trials;

-- Recreate policies with proper syntax
CREATE POLICY "Users can view own trials" ON trials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trials" ON trials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trials" ON trials
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trials" ON trials
  FOR DELETE USING (auth.uid() = user_id);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'trials'; 