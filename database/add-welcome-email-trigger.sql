-- Create a function to handle new user signups and send welcome emails
CREATE OR REPLACE FUNCTION handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the welcome email Edge Function
  PERFORM
    net.http_post(
      url := 'https://xhyealiadhzupycetiwd.supabase.co/functions/v1/sendWelcomeEmail',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object(
        'user_id', NEW.id,
        'email', NEW.email,
        'user_metadata', NEW.raw_user_meta_data
      )
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users table
DROP TRIGGER IF EXISTS trigger_send_welcome_email ON auth.users;
CREATE TRIGGER trigger_send_welcome_email
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_signup();

-- Add a comment to document the trigger
COMMENT ON TRIGGER trigger_send_welcome_email ON auth.users IS 'Sends welcome email to new users via Edge Function'; 