-- Test script for end-of-day functionality
-- This script helps verify that trials are using end-of-day timestamps

-- Check current trial dates
SELECT 
  id,
  service_name,
  end_date,
  CASE 
    WHEN end_date::time = '23:59:59.999' THEN 'End of day'
    WHEN end_date::time = '00:00:00' THEN 'Start of day'
    ELSE 'Other time'
  END as time_type,
  outcome
FROM trials 
ORDER BY end_date DESC
LIMIT 10;

-- Update existing trials to use end-of-day if they don't already
-- (Only run this if you want to update existing trials)
/*
UPDATE trials 
SET end_date = (end_date::date + interval '23 hours 59 minutes 59 seconds')::timestamptz
WHERE end_date::time != '23:59:59.999';
*/

-- Test creating a new trial with end-of-day
-- (This is just for reference - actual insertion happens in the app)
/*
INSERT INTO trials (user_id, service_name, end_date, outcome) 
VALUES (
  'your-user-id-here',
  'Test Service',
  (CURRENT_DATE + interval '7 days' + interval '23 hours 59 minutes 59 seconds')::timestamptz,
  'active'
);
*/ 