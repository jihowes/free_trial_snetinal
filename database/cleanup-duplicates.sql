-- Clean up duplicates and remove Grammarly and Postman
-- Run this in your Supabase SQL Editor

-- First, let's see what we have
SELECT service_name, COUNT(*) as count 
FROM curated_trials 
GROUP BY service_name 
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Remove duplicates by keeping only the first occurrence of each service
-- Using ROW_NUMBER() to identify duplicates
DELETE FROM curated_trials 
WHERE id IN (
  SELECT id FROM (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY service_name ORDER BY created_at) as rn
    FROM curated_trials
  ) t 
  WHERE t.rn > 1
);

-- Remove Grammarly and Postman completely
DELETE FROM curated_trials 
WHERE service_name IN ('Grammarly Premium', 'Postman');

-- Verify the cleanup
SELECT service_name, trial_length_days, category 
FROM curated_trials 
ORDER BY service_name; 