-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create trials table
CREATE TABLE trials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_name TEXT NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  outcome VARCHAR(20) DEFAULT 'active' CHECK (outcome IN ('active', 'kept', 'cancelled', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_notified TIMESTAMPTZ NULL
);

-- Create RLS policies
ALTER TABLE trials ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see only their own trials
CREATE POLICY "Users can view own trials" ON trials
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own trials
CREATE POLICY "Users can insert own trials" ON trials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own trials
CREATE POLICY "Users can update own trials" ON trials
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow users to delete their own trials
CREATE POLICY "Users can delete own trials" ON trials
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_trials_user_id ON trials(user_id);
CREATE INDEX idx_trials_end_date ON trials(end_date);
CREATE INDEX idx_trials_last_notified ON trials(last_notified);
CREATE INDEX idx_trials_outcome ON trials(outcome); 