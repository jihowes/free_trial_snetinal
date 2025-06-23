-- Add monthly_price column to trials table
-- This allows tracking the monthly subscription cost for money saved calculations

ALTER TABLE public.trials
ADD COLUMN monthly_price numeric(10,2);

-- Add comment to document the column
COMMENT ON COLUMN public.trials.monthly_price IS 'Monthly subscription price in dollars (e.g., 9.99). Used for calculating money saved when trials are cancelled.';

-- Create index for better query performance on monthly_price
CREATE INDEX idx_trials_monthly_price ON trials(monthly_price); 