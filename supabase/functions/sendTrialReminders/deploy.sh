#!/bin/bash

# Deploy script for sendTrialReminders function

echo "🚀 Deploying sendTrialReminders function..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first."
    exit 1
fi

# Deploy the function
echo "📦 Deploying function..."
supabase functions deploy sendTrialReminders

if [ $? -eq 0 ]; then
    echo "✅ Function deployed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set the RESEND_API_KEY environment variable in your Supabase project"
    echo "2. Verify the cron schedule is set to run daily at 9:00 AM UTC"
    echo "3. Test the function manually if needed"
    echo ""
    echo "🔗 Function URL: https://your-project.supabase.co/functions/v1/sendTrialReminders"
else
    echo "❌ Deployment failed!"
    exit 1
fi 