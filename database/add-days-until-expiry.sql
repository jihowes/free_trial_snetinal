-- Add a computed column to calculate days until expiry
-- This will be consistent across all timezones and calculations

-- First, let's create a function to calculate days until expiry
CREATE OR REPLACE FUNCTION calculate_days_until_expiry(end_date TIMESTAMPTZ)
RETURNS INTEGER AS $$
BEGIN
  -- Calculate the difference in days between end_date and current date
  -- Using date truncation to ignore time components and CEIL to match frontend logic
  RETURN CEIL(DATE_PART('day', DATE_TRUNC('day', end_date) - DATE_TRUNC('day', NOW())));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add a computed column to the trials table
ALTER TABLE trials 
ADD COLUMN days_until_expiry INTEGER GENERATED ALWAYS AS (
  calculate_days_until_expiry(end_date)
) STORED;

-- Create an index on the computed column for better performance
CREATE INDEX idx_trials_days_until_expiry ON trials(days_until_expiry);

-- Add a comment to document the column
COMMENT ON COLUMN trials.days_until_expiry IS 'Computed column showing days until trial expiry (0 = today, 1 = tomorrow, etc.)'; 