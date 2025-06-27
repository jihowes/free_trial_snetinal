# Welcome Email Function

This Supabase Edge Function sends personalized welcome emails to new users when they sign up.

## Features

- ✅ **Personalized Greeting**: Uses user's name or email prefix
- ✅ **Branded Design**: Beautiful HTML email with Free Trial Sentinel branding
- ✅ **Value Props**: Highlights key features (Smart Protection, Instant Alerts, Time Management)
- ✅ **Clear CTA**: Direct link to add first trial
- ✅ **Duplicate Prevention**: Only sends once per user
- ✅ **Email Logging**: Tracks all email operations in `email_logs` table
- ✅ **Error Handling**: Graceful failure handling and retry logic

## Setup

### 1. Database Setup

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type VARCHAR(50) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  error_message TEXT,
  resend_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0
);

-- Add email_variant_index to users table (for rotating messages)
ALTER TABLE users ADD COLUMN email_variant_index INTEGER DEFAULT 0;
```

### 2. Environment Variables

Ensure these environment variables are set in your Supabase project:

- `RESEND_API_KEY`: Your Resend API key
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

### 3. Deploy the Function

```bash
# Deploy to Supabase
supabase functions deploy sendWelcomeEmail
```

### 4. Set Up the Trigger (Optional)

For automatic welcome emails on signup, run this SQL:

```sql
-- Create trigger function
CREATE OR REPLACE FUNCTION handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://your-project.supabase.co/functions/v1/sendWelcomeEmail',
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

-- Create the trigger
CREATE TRIGGER trigger_send_welcome_email
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_signup();
```

## Usage

### Manual Trigger

You can also trigger welcome emails manually by calling the function:

```bash
curl -X POST https://your-project.supabase.co/functions/v1/sendWelcomeEmail \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid",
    "email": "user@example.com",
    "user_metadata": {"full_name": "John Doe"}
  }'
```

### From Next.js

```typescript
// Call the API route
const response = await fetch('/api/send-welcome-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: user.id,
    email: user.email,
    user_metadata: user.user_metadata
  })
})
```

## Email Template

The welcome email includes:

- 🛡️ **Branded Header**: Free Trial Sentinel logo and tagline
- 👋 **Personalized Greeting**: Uses name or email prefix
- ✅ **Feature Highlights**: Smart Protection, Instant Alerts, Time Management
- 🎯 **Clear CTA**: "Add Your First Trial" button
- 📋 **Getting Started Guide**: Step-by-step instructions
- 📧 **Support Links**: Website and support email

## Monitoring

Check the `email_logs` table to monitor email delivery:

```sql
-- View recent welcome emails
SELECT 
  recipient_email,
  status,
  created_at,
  sent_at,
  error_message
FROM email_logs 
WHERE email_type = 'welcome'
ORDER BY created_at DESC;
```

## Troubleshooting

### Common Issues

1. **Email not sending**: Check `RESEND_API_KEY` environment variable
2. **Duplicate emails**: Function checks `email_logs` table to prevent duplicates
3. **Trigger not working**: Ensure the database trigger is properly set up
4. **Permission errors**: Verify service role key has proper permissions

### Debug Logs

Check Supabase function logs in the dashboard:
1. Go to Edge Functions in Supabase dashboard
2. Click on `sendWelcomeEmail`
3. View logs for debugging information

## Customization

### Modify Email Content

Edit the `generateWelcomeEmailHTML` function in `index.ts` to customize:
- Email styling and colors
- Content and messaging
- CTA button text and links
- Branding elements

### Add More Features

- A/B testing different email variants
- Dynamic content based on user metadata
- Follow-up emails after first trial added
- Integration with analytics tracking 