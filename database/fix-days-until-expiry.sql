-- Fix the days_until_expiry calculation for all trials
-- This will ensure the email function can find trials that are actually expiring soon

-- Update all active trials with correct days_until_expiry
UPDATE trials 
SET days_until_expiry = CASE 
  WHEN end_date::date = current_date THEN 0
  WHEN end_date::date = current_date + 1 THEN 1
  WHEN end_date::date = current_date + 2 THEN 2
  WHEN end_date::date = current_date + 3 THEN 3
  WHEN end_date::date = current_date + 4 THEN 4
  WHEN end_date::date = current_date + 5 THEN 5
  WHEN end_date::date = current_date + 6 THEN 6
  WHEN end_date::date = current_date + 7 THEN 7
  ELSE (end_date::date - current_date)
END
WHERE outcome = 'active';

-- Verify the fix worked
SELECT 
  id,
  service_name,
  end_date,
  days_until_expiry,
  CASE 
    WHEN days_until_expiry = 2 THEN 'SHOULD GET EMAIL TOMORROW'
    WHEN days_until_expiry <= 2 THEN 'EXPIRING SOON'
    ELSE 'NOT EXPIRING SOON'
  END as email_status
FROM trials 
WHERE outcome = 'active'
ORDER BY days_until_expiry ASC; 