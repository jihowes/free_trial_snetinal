import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to calculate days left consistently with the main app
function calculateDaysLeft(endDate: string): number {
  const now = new Date()
  const end = new Date(endDate)
  
  // Get the date parts in local timezone (strip time)
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  
  // Calculate difference in days
  const timeDiff = endDateOnly.getTime() - nowDate.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
  
  return daysDiff
}

// Helper function to generate email HTML
function generateEmailHTML(trialName: string, daysLeft: number, endDate: string): string {
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
        
        <p>Don't forget to cancel if you don't want to be charged! Many users forget about their trials and end up paying for services they don't use.</p>
        
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
    // Initialize Supabase client
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
    
    // Calculate target dates for 1 and 7 days from now
    const oneDayFromNow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    // Set to end of day (23:59:59.999) for both dates
    const oneDayEndOfDay = new Date(oneDayFromNow)
    oneDayEndOfDay.setHours(23, 59, 59, 999)
    
    const sevenDaysEndOfDay = new Date(sevenDaysFromNow)
    sevenDaysEndOfDay.setHours(23, 59, 59, 999)

    console.log(`Checking for trials expiring on: ${oneDayEndOfDay.toISOString()} and ${sevenDaysEndOfDay.toISOString()}`)

    // Query for trials that expire in 1 or 7 days and haven't been notified in the last 24 hours
    const { data: trials, error } = await supabase
      .from('trials')
      .select(`
        id,
        service_name,
        end_date,
        last_notified,
        user_id,
        users:user_id (
          email
        )
      `)
      .or(`end_date.eq.${oneDayEndOfDay.toISOString()},end_date.eq.${sevenDaysEndOfDay.toISOString()}`)
      .eq('outcome', 'active')
      .or('last_notified.is.null,last_notified.lt.' + new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())

    if (error) {
      console.error('Database query error:', error)
      throw error
    }

    console.log(`Found ${trials?.length || 0} trials to process`)

    const results = []
    let emailsSent = 0
    let errors = 0

    for (const trial of trials || []) {
      try {
        const daysUntilExpiry = calculateDaysLeft(trial.end_date)
        
        // Only send emails for trials expiring in 1 or 7 days
        if (daysUntilExpiry === 1 || daysUntilExpiry === 7) {
          const userEmail = trial.users?.email
          
          if (!userEmail) {
            console.warn(`No email found for trial ${trial.id}`)
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

          // Generate email content
          const emailHtml = generateEmailHTML(trial.service_name, daysUntilExpiry, trial.end_date)
          const subject = `🚨 ${trial.service_name} trial expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}`

          // Send email via Resend
          const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'noreply@freetrialsentinel.com',
            to: userEmail,
            subject: subject,
            html: emailHtml,
          })

          if (emailError) {
            console.error(`Failed to send email for trial ${trial.id}:`, emailError)
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
            // Update last_notified timestamp
            const { error: updateError } = await supabase
              .from('trials')
              .update({ last_notified: now.toISOString() })
              .eq('id', trial.id)

            if (updateError) {
              console.error(`Failed to update last_notified for trial ${trial.id}:`, updateError)
            }

            console.log(`Email sent successfully for trial ${trial.id} to ${userEmail}`)
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
        }
      } catch (trialError) {
        console.error(`Error processing trial ${trial.id}:`, trialError)
        results.push({
          trial_id: trial.id,
          service_name: trial.service_name,
          user_email: trial.users?.email,
          days_until_expiry: calculateDaysLeft(trial.end_date),
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

    console.log('Function completed:', response)

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Function error:', error)
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