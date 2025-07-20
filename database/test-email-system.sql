-- Test script to manually trigger the trial reminder function
-- This can be run to test if the email system is working

-- First, let's check if there are any trials that should trigger emails
SELECT 
  t.id,
  t.service_name,
  t.end_date,
  t.days_until_expiry,
  t.last_notified,
  u.email,
  t.outcome
FROM trials t
JOIN auth.users u ON t.user_id = u.id
WHERE t.outcome = 'active'
  AND t.days_until_expiry <= 2
  AND (t.last_notified IS NULL OR t.last_notified < now() - interval '24 hours')
ORDER BY t.days_until_expiry ASC;

-- Manually call the trial reminder function
SELECT call_trial_reminder_function();

-- Check the results after running
SELECT 
  t.id,
  t.service_name,
  t.end_date,
  t.days_until_expiry,
  t.last_notified,
  u.email,
  t.outcome
FROM trials t
JOIN auth.users u ON t.user_id = u.id
WHERE t.outcome = 'active'
  AND t.days_until_expiry <= 2
ORDER BY t.days_until_expiry ASC; 