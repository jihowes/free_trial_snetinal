-- Debug script to check trial status and understand why emails aren't being sent

-- Check all trials and their current status
SELECT 
  t.id,
  t.service_name,
  t.end_date,
  t.days_until_expiry,
  t.outcome,
  t.last_notified,
  u.email,
  CASE 
    WHEN t.outcome = 'active' AND t.days_until_expiry = 2 THEN 'SHOULD SEND EMAIL'
    WHEN t.outcome = 'active' AND t.days_until_expiry <= 2 THEN 'EXPIRING SOON'
    WHEN t.outcome = 'active' THEN 'ACTIVE - NOT EXPIRING SOON'
    ELSE 'NOT ACTIVE'
  END as email_status
FROM trials t
JOIN auth.users u ON t.user_id = u.id
ORDER BY t.days_until_expiry ASC, t.outcome;

-- Check specifically for trials that should trigger emails
SELECT 
  t.id,
  t.service_name,
  t.end_date,
  t.days_until_expiry,
  t.last_notified,
  u.email,
  CASE 
    WHEN t.last_notified IS NULL THEN 'NEVER NOTIFIED'
    WHEN t.last_notified < now() - interval '24 hours' THEN 'CAN NOTIFY AGAIN'
    ELSE 'NOTIFIED RECENTLY'
  END as notification_status
FROM trials t
JOIN auth.users u ON t.user_id = u.id
WHERE t.outcome = 'active'
  AND t.days_until_expiry <= 2
ORDER BY t.days_until_expiry ASC;

-- Check if the days_until_expiry field is being calculated correctly
SELECT 
  t.id,
  t.service_name,
  t.end_date,
  t.days_until_expiry,
  -- Manual calculation for comparison
  CASE 
    WHEN t.end_date::date = current_date THEN 0
    WHEN t.end_date::date = current_date + 1 THEN 1
    WHEN t.end_date::date = current_date + 2 THEN 2
    ELSE (t.end_date::date - current_date)
  END as manual_days_calc
FROM trials t
WHERE t.outcome = 'active'
ORDER BY t.days_until_expiry ASC; 