import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to generate welcome email HTML
function generateWelcomeEmailHTML(userEmail: string, userName?: string): string {
  const dashboardUrl = 'https://freetrialsentinel.com/dashboard/add-trial'
  const greeting = userName ? `Hi ${userName},` : `Hi ${userEmail.split('@')[0]},`
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Free Trial Sentinel</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #f97316, #dc2626); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .tagline {
          font-size: 16px;
          opacity: 0.9;
        }
        .content { 
          padding: 40px 30px; 
        }
        .greeting {
          font-size: 24px;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 20px;
        }
        .welcome-text {
          font-size: 16px;
          color: #475569;
          margin-bottom: 30px;
        }
        .features {
          background: #f8fafc;
          padding: 25px;
          border-radius: 8px;
          margin: 25px 0;
        }
        .feature {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          font-size: 16px;
          color: #374151;
        }
        .feature:last-child {
          margin-bottom: 0;
        }
        .feature-icon {
          margin-right: 12px;
          font-size: 18px;
        }
        .cta-button { 
          display: inline-block; 
          background: linear-gradient(135deg, #f97316, #dc2626); 
          color: white; 
          padding: 16px 32px; 
          text-decoration: none; 
          border-radius: 8px; 
          font-weight: bold; 
          font-size: 16px;
          margin: 25px 0; 
          text-align: center;
        }
        .footer { 
          margin-top: 30px; 
          padding-top: 20px; 
          border-top: 1px solid #e2e8f0; 
          font-size: 14px; 
          color: #64748b; 
          text-align: center;
        }
        .social-links {
          margin-top: 15px;
        }
        .social-links a {
          color: #64748b;
          text-decoration: none;
          margin: 0 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🛡️ Free Trial Sentinel</div>
          <div class="tagline">Never pay for forgotten trials again</div>
        </div>
        
        <div class="content">
          <div class="greeting">${greeting}</div>
          
          <div class="welcome-text">
            Welcome to Free Trial Sentinel! You've just joined thousands of smart users who never pay for forgotten trials again.
          </div>
          
          <div class="features">
            <div class="feature">
              <span class="feature-icon">✅</span>
              <strong>Smart Protection</strong> – Automated trial monitoring
            </div>
            <div class="feature">
              <span class="feature-icon">🔔</span>
              <strong>Instant Alerts</strong> – Real-time notifications
            </div>
            <div class="feature">
              <span class="feature-icon">⏰</span>
              <strong>Time Management</strong> – Never miss a deadline
            </div>
          </div>
          
          <a href="${dashboardUrl}" class="cta-button">Add Your First Trial</a>
          
          <div class="welcome-text">
            <strong>Getting Started:</strong><br>
            1. Add your first trial subscription<br>
            2. Set the end date and cost<br>
            3. Get notified before you're charged<br>
            4. Cancel in time and save money!
          </div>
          
          <div class="footer">
            <p>This email was sent by <strong>Free Trial Sentinel</strong></p>
            <p>Questions? Reply to this email for support</p>
            <div class="social-links">
              <a href="https://freetrialsentinel.com">Website</a> |
              <a href="mailto:support@freetrialsentinel.com">Support</a>
            </div>
          </div>
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

    // Get request body
    const { user_id, email, user_metadata } = await req.json()

    if (!user_id || !email) {
      throw new Error('user_id and email are required')
    }

    // Check if welcome email was already sent
    const { data: existingLog } = await supabase
      .from('email_logs')
      .select('id')
      .eq('user_id', user_id)
      .eq('email_type', 'welcome')
      .single()

    if (existingLog) {
      console.log(`Welcome email already sent for user ${user_id}`)
      return new Response(
        JSON.stringify({ message: 'Welcome email already sent' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Create email log entry
    const { data: emailLog, error: logError } = await supabase
      .from('email_logs')
      .insert({
        user_id,
        email_type: 'welcome',
        recipient_email: email,
        subject: 'Welcome to Free Trial Sentinel 🎉',
        status: 'pending'
      })
      .select()
      .single()

    if (logError) {
      console.error('Failed to create email log:', logError)
      throw logError
    }

    // Generate email content
    const userName = user_metadata?.full_name || user_metadata?.name
    const emailHtml = generateWelcomeEmailHTML(email, userName)
    const subject = 'Welcome to Free Trial Sentinel 🎉'

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'noreply@freetrialsentinel.com',
      to: email,
      subject: subject,
      html: emailHtml,
    })

    if (emailError) {
      console.error('Failed to send welcome email:', emailError)
      
      // Update email log with error
      await supabase
        .from('email_logs')
        .update({
          status: 'failed',
          error_message: emailError.message,
          retry_count: 1
        })
        .eq('id', emailLog.id)

      throw emailError
    }

    // Update email log with success
    await supabase
      .from('email_logs')
      .update({
        status: 'sent',
        resend_id: emailData?.id,
        sent_at: new Date().toISOString()
      })
      .eq('id', emailLog.id)

    console.log(`Welcome email sent successfully to ${email}`)

    return new Response(
      JSON.stringify({
        message: 'Welcome email sent successfully',
        email_id: emailData?.id,
        log_id: emailLog.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Welcome email function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 