-- Enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Create a function to call the Edge Function
CREATE OR REPLACE FUNCTION call_trial_reminder_function()
RETURNS void AS $$
BEGIN
  -- Call the trial reminder Edge Function
  PERFORM
    net.http_post(
      url := 'https://xhyealiadhzupycetiwd.supabase.co/functions/v1/sendTrialReminders',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object(
        'timestamp', now()::text
      )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule the cron job to run daily at 9:00 AM UTC
-- This will check for trials expiring in 2 days and send reminders
SELECT cron.schedule(
  'trial-reminder-daily',
  '0 9 * * *',  -- Daily at 9:00 AM UTC
  'SELECT call_trial_reminder_function();'
);

-- Add a comment to document the cron job
COMMENT ON FUNCTION call_trial_reminder_function() IS 'Calls the trial reminder Edge Function to send email notifications for expiring trials';

-- Verify the cron job was created
SELECT * FROM cron.job WHERE jobname = 'trial-reminder-daily'; 