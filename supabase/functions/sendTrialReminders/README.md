# sendTrialReminders Edge Function

This Supabase Edge Function sends email reminders for trials that are expiring in 1 or 7 days.

## Features

- Sends transactional emails using Resend
- Checks for trials expiring in 1 or 7 days
- Prevents duplicate emails using `last_notified` timestamp
- Beautiful HTML email templates
- Comprehensive error handling and logging

## Setup

### 1. Environment Variables

Set these environment variables in your Supabase project:

```bash
RESEND_API_KEY=your_resend_api_key_here
```

### 2. Deploy the Function

```bash
supabase functions deploy sendTrialReminders
```

### 3. Schedule the Function

The function is scheduled to run daily at 9:00 AM UTC via the cron configuration in `supabase/config.toml`:

```toml
[cron]
sendTrialReminders = "0 9 * * *"
```

## Email Template

The function sends beautifully formatted HTML emails that include:

- Trial name and expiration date
- Days remaining until expiry
- Call-to-action button to view dashboard
- Responsive design for mobile devices

## Database Requirements

The function expects a `trials` table with the following structure:

```sql
CREATE TABLE trials (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  service_name TEXT NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  outcome VARCHAR(20) DEFAULT 'active',
  last_notified TIMESTAMPTZ NULL,
  -- other fields...
);
```

## Function Behavior

1. **Query Trials**: Finds trials expiring in 1 or 7 days that are still active
2. **Check Notifications**: Only sends emails if `last_notified` is null or older than 24 hours
3. **Send Emails**: Uses Resend to send transactional emails from `noreply@freetrialsentinel.com`
4. **Update Timestamps**: Updates `last_notified` field to prevent duplicate emails
5. **Log Results**: Returns detailed results of the operation

## Response Format

```json
{
  "message": "Trial reminder processing completed",
  "processed_trials": 5,
  "emails_sent": 4,
  "errors": 1,
  "timestamp": "2024-01-01T09:00:00.000Z",
  "results": [
    {
      "trial_id": "uuid",
      "service_name": "Netflix",
      "user_email": "user@example.com",
      "days_until_expiry": 1,
      "email_sent": true,
      "email_id": "resend_email_id"
    }
  ]
}
```

## Testing

You can test the function manually by calling it directly:

```bash
curl -X POST https://your-project.supabase.co/functions/v1/sendTrialReminders \
  -H "Authorization: Bearer your-anon-key"
```

## Error Handling

The function includes comprehensive error handling for:

- Missing environment variables
- Database connection issues
- Email sending failures
- Invalid trial data
- Network timeouts

All errors are logged and included in the response for debugging. 