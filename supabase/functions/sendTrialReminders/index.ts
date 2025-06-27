import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Array of rotating email message variants
const messageVariants = [
  "A charge is coming soon — unless you say otherwise. The Sentinel has your back.",
  "You're on the clock. Cancel now, thank yourself later.",
  "Time’s ticking on this trial — and your wallet is watching 👀",
  "Your free trial is almost up. Still want it? No judgment. Just don’t forget.",
  "You’re the kind of person who doesn’t get caught off guard. Right?",
  "Tick tock. Don’t let this trial sneak into your next billing cycle.",
  "You’re about to become a paying customer — unless you don’t want to be.",
  "Friendly reminder: You control your trials. Don’t let them control your bank account.",
  "Another trial is about to end. What’s the play, strategist?",
  "You didn’t sign up for ‘forever’. Cancel before it flips the switch.",
  "Time to decide: Keep it or cut it. Either way, you're in control.",
  "A quick cancel now could save future-you a whole hassle.",
  "This trial ends soon. Don’t let it turn into another ‘oops’ moment.",
  "Don’t forget: The cancel button exists for a reason. You’ve got this.",
  "This is your reminder — because the service won't send one. 😉"
];

// Helper function to get rotating message variant
function getRotatingMessageVariant(userVariantIndex: number): { message: string, nextIndex: number } {
  const index = userVariantIndex || 0
  const message = messageVariants[index % messageVariants.length]
  const nextIndex = (index + 1) % messageVariants.length
  return { message, nextIndex }
}

// Helper function to calculate days left consistently with the main app
function calculateDaysLeft(endDate: string): number {
  const now = new Date()
  const end = new Date(endDate)
  
  // Use the exact same logic as the local app
  // Strip time components and calculate based on date only
  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth()
  const nowDay = now.getDate()
  
  const endYear = end.getFullYear()
  const endMonth = end.getMonth()
  const endDay = end.getDate()
  
  // Create date objects with time set to midnight
  const nowDate = new Date(nowYear, nowMonth, nowDay)
  const endDateOnly = new Date(endYear, endMonth, endDay)
  
  // Calculate difference in days
  const timeDiff = endDateOnly.getTime() - nowDate.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
  
  return daysDiff
}

// Helper function to generate email HTML with rotating messages
function generateEmailHTML(trialName: string, daysLeft: number, endDate: string, messageVariant: string): string {
  const dashboardUrl = 'https://freetrialsentinel.com/dashboard'
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Trial Reminder - ${trialName}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
        }
        .header { 
          background: linear-gradient(135deg, #f97316, #dc2626); 
          color: white; 
          padding: 30px; 
          text-align: center; 
          border-radius: 12px 12px 0 0; 
        }
        .content { 
          background: #f8fafc; 
          padding: 30px; 
          border-radius: 0 0 12px 12px; 
          border: 1px solid #e2e8f0; 
        }
        .trial-name { 
          font-size: 24px; 
          font-weight: bold; 
          color: #1e293b; 
          margin-bottom: 10px; 
        }
        .days-left { 
          font-size: 18px; 
          color: #dc2626; 
          font-weight: bold; 
          margin-bottom: 20px; 
        }
        .message-variant {
          font-style: italic;
          color: #64748b;
          margin: 15px 0;
          padding: 10px;
          background: #f1f5f9;
          border-left: 3px solid #f97316;
          border-radius: 4px;
        }
        .cta-button { 
          display: inline-block; 
          background: linear-gradient(135deg, #f97316, #dc2626); 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 8px; 
          font-weight: bold; 
          margin: 20px 0; 
        }
        .footer { 
          margin-top: 30px; 
          padding-top: 20px; 
          border-top: 1px solid #e2e8f0; 
          font-size: 14px; 
          color: #64748b; 
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚨 Trial Reminder</h1>
      </div>
      <div class="content">
        <div class="trial-name">${trialName}</div>
        <div class="days-left">⚠️ Expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}</div>
        
        <p>Your <strong>${trialName}</strong> trial is ending soon on <strong>${new Date(endDate).toLocaleDateString()}</strong>.</p>
        
        <div class="message-variant">💬 ${messageVariant}</div>
        
        <a href="${dashboardUrl}" class="cta-button">View My Trials</a>
        
        <div class="footer">
          <p>This reminder was sent by <strong>Free Trial Sentinel</strong> to help you avoid unwanted charges.</p>
          <p>End date: ${new Date(endDate).toLocaleDateString()}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Initialize Resend client
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is required')
    }
    const resend = new Resend(resendApiKey)

    // Get current date in UTC
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    // Calculate target date for 1 day from now
    const oneDayFromNow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    
    // Set to end of day (23:59:59.999)
    const oneDayEndOfDay = new Date(oneDayFromNow)
    oneDayEndOfDay.setHours(23, 59, 59, 999)

    console.log(`Checking for trials expiring on: ${oneDayEndOfDay.toISOString()}`)

    // Query for trials expiring in 1 day using database-calculated field
    const { data: allTrials, error } = await supabase
      .from('trials')
      .select('id, service_name, end_date, last_notified, user_id, days_until_expiry')
      .eq('outcome', 'active')
      .or('last_notified.is.null,last_notified.lt.' + new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())

    if (error) {
      console.error('[sendTrialReminders] Database query error:', error)
      throw error
    }

    console.log(`[sendTrialReminders] Found ${allTrials?.length || 0} active trials`)

    const results = []
    let emailsSent = 0
    let errors = 0

    // Filter trials that expire in 2 days only
    const targetTrials = allTrials?.filter(trial => {
      const daysUntilExpiry = trial.days_until_expiry
      const shouldNotify = (daysUntilExpiry === 2)
      return shouldNotify
    }) || []

    console.log(`Found ${targetTrials.length} trials to process for email reminders`)

    for (const trial of targetTrials) {
      try {
        const daysUntilExpiry = trial.days_until_expiry
        
        // Get user email separately using admin API
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(trial.user_id)
        
        if (userError || !userData.user) {
          console.warn(`[sendTrialReminders] No user found for trial ${trial.id}:`, userError)
          results.push({
            trial_id: trial.id,
            service_name: trial.service_name,
            user_email: null,
            days_until_expiry: daysUntilExpiry,
            email_sent: false,
            error: 'No user found'
          })
          errors++
          continue
        }

        const userEmail = userData.user.email
        
        if (!userEmail) {
          console.warn(`[sendTrialReminders] No email found for trial ${trial.id}`)
          results.push({
            trial_id: trial.id,
            service_name: trial.service_name,
            user_email: null,
            days_until_expiry: daysUntilExpiry,
            email_sent: false,
            error: 'No user email found'
          })
          errors++
          continue
        }

        // Get user's email variant index from users table
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('email_variant_index')
          .eq('id', trial.user_id)
          .single()

        if (profileError) {
          console.warn(`[sendTrialReminders] Could not get user profile for trial ${trial.id}:`, profileError)
        }

        const userVariantIndex = userProfile?.email_variant_index || 0

        // Generate email content with rotating message
        const { message, nextIndex } = getRotatingMessageVariant(userVariantIndex)
        const emailHtml = generateEmailHTML(trial.service_name, daysUntilExpiry, trial.end_date, message)
        const subject = daysUntilExpiry === 0 
          ? `🚨 ${trial.service_name} trial expires TODAY!`
          : `🚨 ${trial.service_name} trial expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}`

        // Send email via Resend
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: 'noreply@freetrialsentinel.com',
          to: userEmail,
          subject: subject,
          html: emailHtml,
        })

        if (emailError) {
          console.error(`[sendTrialReminders] Failed to send email for trial ${trial.id}:`, emailError)
          results.push({
            trial_id: trial.id,
            service_name: trial.service_name,
            user_email: userEmail,
            days_until_expiry: daysUntilExpiry,
            email_sent: false,
            error: emailError.message
          })
          errors++
        } else {
          // Update last_notified timestamp in trials table
          const { error: updateError } = await supabase
            .from('trials')
            .update({ last_notified: now.toISOString() })
            .eq('id', trial.id)

          if (updateError) {
            console.error(`[sendTrialReminders] Failed to update last_notified for trial ${trial.id}:`, updateError)
          }

          // Update email_variant_index in users table
          const { error: variantUpdateError } = await supabase
            .from('users')
            .update({ email_variant_index: nextIndex })
            .eq('id', trial.user_id)

          if (variantUpdateError) {
            console.error(`[sendTrialReminders] Failed to update email_variant_index for user ${trial.user_id}:`, variantUpdateError)
          }

          console.log(`[sendTrialReminders] Email sent successfully for ${trial.service_name} to ${userEmail}`)
          results.push({
            trial_id: trial.id,
            service_name: trial.service_name,
            user_email: userEmail,
            days_until_expiry: daysUntilExpiry,
            email_sent: true,
            email_id: emailData?.id
          })
          emailsSent++
        }
      } catch (trialError) {
        console.error(`[sendTrialReminders] Error processing trial ${trial.id}:`, trialError)
        results.push({
          trial_id: trial.id,
          service_name: trial.service_name,
          user_email: null,
          days_until_expiry: trial.days_until_expiry,
          email_sent: false,
          error: trialError.message
        })
        errors++
      }
    }

    const response = {
      message: 'Trial reminder processing completed',
      processed_trials: results.length,
      emails_sent: emailsSent,
      errors: errors,
      timestamp: now.toISOString(),
      results
    }

    console.log(`[sendTrialReminders] Completed: ${emailsSent} emails sent, ${errors} errors`)

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('[sendTrialReminders] Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})