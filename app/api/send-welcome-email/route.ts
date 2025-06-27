import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Create service role client for database operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
              <span class="feature-icon">💰</span>
              <strong>Save Money Automatically</strong> – Avoid paying for subscriptions you forgot to cancel
            </div>
            <div class="feature">
              <span class="feature-icon">🔔</span>
              <strong>Get Reminded Before You Pay</strong> – Smart alerts help you cancel on time — before it's too late
            </div>
            <div class="feature">
              <span class="feature-icon">📊</span>
              <strong>Track All Your Free Trials in One Place</strong> – From Netflix to Notion, stay organized with a central dashboard
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

export async function POST(request: NextRequest) {
  try {
    // Debug environment variables
    console.log('Environment variables check:')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set')
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set')
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Not set')

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing required environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const { user_id, email, user_metadata } = await request.json()

    if (!user_id || !email) {
      return NextResponse.json(
        { error: 'user_id and email are required' },
        { status: 400 }
      )
    }

    // Check if welcome email was already sent
    const { data: existingLog } = await supabaseAdmin
      .from('email_logs')
      .select('id')
      .eq('user_id', user_id)
      .eq('email_type', 'welcome')
      .single()

    if (existingLog) {
      return NextResponse.json(
        { message: 'Welcome email already sent' },
        { status: 200 }
      )
    }

    // Create email log entry
    const { data: emailLog, error: logError } = await supabaseAdmin
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
      return NextResponse.json(
        { error: 'Failed to create email log' },
        { status: 500 }
      )
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
      await supabaseAdmin
        .from('email_logs')
        .update({
          status: 'failed',
          error_message: emailError.message,
          retry_count: 1
        })
        .eq('id', emailLog.id)

      return NextResponse.json(
        { error: 'Failed to send welcome email' },
        { status: 500 }
      )
    }

    // Update email log with success
    await supabaseAdmin
      .from('email_logs')
      .update({
        status: 'sent',
        resend_id: emailData?.id,
        sent_at: new Date().toISOString()
      })
      .eq('id', emailLog.id)

    console.log(`Welcome email sent successfully to ${email}`)

    return NextResponse.json({
      message: 'Welcome email sent successfully',
      email_id: emailData?.id,
      log_id: emailLog.id
    })

  } catch (error) {
    console.error('Welcome email API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 