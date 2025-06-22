-- Test script for refresh mechanism and date calculations
-- This script helps verify that trials are updating correctly as time passes

-- Check current trial dates and their status
SELECT 
  id,
  service_name,
  end_date,
  outcome,
  CASE 
    WHEN end_date > NOW() THEN 'Active'
    WHEN end_date <= NOW() THEN 'Expired'
  END as current_status,
  CASE 
    WHEN end_date > NOW() THEN 
      CEIL((end_date - NOW()) / INTERVAL '1 day')
    ELSE 
      CEIL((NOW() - end_date) / INTERVAL '1 day')
  END as days_difference,
  NOW() as current_time
FROM trials 
ORDER BY end_date DESC
LIMIT 10;

-- Check trials that should be showing as "expires today"
SELECT 
  id,
  service_name,
  end_date,
  outcome,
  CASE 
    WHEN DATE(end_date) = CURRENT_DATE THEN 'Expires Today'
    WHEN DATE(end_date) = CURRENT_DATE + INTERVAL '1 day' THEN 'Expires Tomorrow'
    WHEN DATE(end_date) < CURRENT_DATE THEN 'Already Expired'
    ELSE 'Future Date'
  END as expiry_status
FROM trials 
WHERE DATE(end_date) <= CURRENT_DATE + INTERVAL '1 day'
ORDER BY end_date;

-- Test creating a trial that expires "today" (for testing)
-- (Uncomment and modify as needed for testing)
/*
INSERT INTO trials (user_id, service_name, end_date, outcome) 
VALUES (
  'your-user-id-here',
  'Test Trial - Expires Today',
  (CURRENT_DATE + INTERVAL '23 hours 59 minutes 59 seconds')::timestamptz,
  'active'
);
*/

-- Check if any trials need outcome updates (expired but still marked as active)
SELECT 
  id,
  service_name,
  end_date,
  outcome,
  NOW() - end_date as time_since_expiry
FROM trials 
WHERE end_date < NOW() AND outcome = 'active'
ORDER BY end_date; 