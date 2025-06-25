-- Add liked field to trials table for affiliate marketing data
ALTER TABLE trials ADD COLUMN liked BOOLEAN DEFAULT FALSE;

-- Create index for better query performance on liked field
CREATE INDEX idx_trials_liked ON trials(liked);

-- Update RLS policies to include liked field
-- (existing policies should work as they use auth.uid() = user_id) 