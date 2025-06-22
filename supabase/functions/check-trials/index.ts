import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get current date and calculate target dates
    const now = new Date()
    
    // Calculate end of day for tomorrow and 7 days from now
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    // Set to end of day (23:59:59.999)
    const tomorrowEndOfDay = new Date(tomorrow)
    tomorrowEndOfDay.setHours(23, 59, 59, 999)
    
    const sevenDaysEndOfDay = new Date(sevenDaysFromNow)
    sevenDaysEndOfDay.setHours(23, 59, 59, 999)

    // Query for trials that expire in 1 or 7 days and haven't been notified recently
    const { data: trials, error } = await supabase
      .from('trials')
      .select(`
        *,
        users:user_id (
          email
        )
      `)
      .or(`end_date.eq.${tomorrowEndOfDay.toISOString()},end_date.eq.${sevenDaysEndOfDay.toISOString()}`)
      .or('last_notified.is.null,last_notified.lt.' + new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())

    if (error) {
      throw error
    }

    const results = []

    for (const trial of trials || []) {
      const endDate = new Date(trial.end_date)
      const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      // Only send emails for trials expiring in 1 or 7 days
      if (daysUntilExpiry === 1 || daysUntilExpiry === 7) {
        const userEmail = trial.users?.email
        
        if (userEmail) {
          // Send email using Supabase's built-in email functionality
          const { error: emailError } = await supabase.auth.admin.sendRawEmail({
            to: userEmail,
            subject: `Trial Reminder: ${trial.service_name}`,
            html: `
              <h2>Trial Reminder</h2>
              <p>Your <strong>${trial.service_name}</strong> trial ends in <strong>${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}</strong>.</p>
              <p>Don't forget to cancel if you don't want to be charged!</p>
              <p>End date: ${endDate.toLocaleDateString()}</p>
            `,
          })

          if (!emailError) {
            // Update last_notified timestamp
            await supabase
              .from('trials')
              .update({ last_notified: now.toISOString() })
              .eq('id', trial.id)

            results.push({
              trial_id: trial.id,
              service_name: trial.service_name,
              user_email: userEmail,
              days_until_expiry: daysUntilExpiry,
              email_sent: true,
            })
          } else {
            results.push({
              trial_id: trial.id,
              service_name: trial.service_name,
              user_email: userEmail,
              days_until_expiry: daysUntilExpiry,
              email_sent: false,
              error: emailError.message,
            })
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Trial check completed',
        processed_trials: results.length,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 