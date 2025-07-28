# Supabase Password Reset Configuration Check

## The Core Problem
Password reset links are expiring too quickly due to PKCE (Proof Key for Code Exchange) configuration issues.

## Critical Settings to Check

### 1. Authentication Settings
Go to your Supabase project dashboard → Authentication → Settings

**Check these settings:**
- **Site URL**: Should be `http://localhost:3000`
- **Redirect URLs**: Should include `http://localhost:3000/reset-password`
- **Password Recovery**: Look for any PKCE-related settings

### 2. Email Templates
Go to Authentication → Email Templates → Password Reset

**Check the template:**
- Make sure it uses `{{ .ConfirmationURL }}` in the link
- The template should look like:
```html
<h2>Reset Password</h2>
<p>Follow this link to reset the password for your user:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

### 3. Auth Settings
Look for these specific settings:

**PKCE Settings:**
- **Enable PKCE**: Try disabling this if available
- **PKCE Method**: Should be set to `S256` if enabled

**Password Recovery Settings:**
- **Token Expiry**: Check if this is set too low (should be at least 3600 seconds/1 hour)
- **Secure Email Change**: Should be enabled

### 4. Alternative Solution: Disable PKCE
If you can't find PKCE settings in the UI, try this:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Look for **Auth Settings** or **Authentication Configuration**
4. Check if there's an option to disable PKCE for password recovery

### 5. Manual Configuration via SQL
If the UI doesn't have the option, you might need to run SQL:

```sql
-- Check current auth settings
SELECT * FROM auth.config;

-- Update auth settings to disable PKCE (if possible)
UPDATE auth.config SET 
  enable_signup = true,
  enable_confirmations = false,
  enable_recoveries = true;
```

## Immediate Test
1. **Request a new password reset email**
2. **Click the link IMMEDIATELY** (within 30 seconds)
3. **Check the console** for any different errors

## If Still Failing
The issue might be that Supabase's password reset flow is fundamentally incompatible with your setup. In that case, we need to implement a **custom password reset flow** that doesn't rely on Supabase's built-in PKCE system.

## Next Steps
1. Check your Supabase project settings using the guide above
2. Look for any PKCE-related settings and try disabling them
3. If you can't find these settings, let me know and we'll implement a custom solution 