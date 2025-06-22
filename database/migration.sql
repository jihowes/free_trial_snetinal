-- Migration: Add outcome column to trials table
-- Run this after updating the schema.sql

-- Add outcome column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trials' AND column_name = 'outcome') THEN
        ALTER TABLE trials ADD COLUMN outcome VARCHAR(20) DEFAULT 'active';
    END IF;
END $$;

-- Add check constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                   WHERE constraint_name = 'trials_outcome_check') THEN
        ALTER TABLE trials ADD CONSTRAINT trials_outcome_check 
        CHECK (outcome IN ('active', 'kept', 'cancelled', 'expired'));
    END IF;
END $$;

-- Update existing trials that have passed their end date
UPDATE trials 
SET outcome = 'expired' 
WHERE end_date < NOW() AND (outcome IS NULL OR outcome = 'active');

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_trials_outcome ON trials(outcome); 