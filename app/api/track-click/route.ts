import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    const { trial_id } = body
    
    if (!trial_id) {
      return NextResponse.json({ error: 'trial_id is required' }, { status: 400 })
    }

    // Get user if authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get or create session ID from cookies
    let sessionId = request.cookies.get('session_id')?.value
    if (!sessionId) {
      sessionId = randomUUID()
    }

    // Get user agent and IP
    const userAgent = request.headers.get('user-agent') || ''
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.ip || ''

    // Insert click record
    const { error } = await supabase
      .from('trial_clicks')
      .insert({
        trial_id,
        user_id: user?.id || null,
        session_id: sessionId,
        user_agent: userAgent,
        ip_address: ip
      })

    if (error) {
      console.error('Error tracking click:', error)
      return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
    }

    // Set session ID cookie if not already set
    const response = NextResponse.json({ success: true })
    if (!request.cookies.get('session_id') && sessionId) {
      response.cookies.set('session_id', sessionId, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }

    return response

  } catch (error) {
    console.error('Error in track-click API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 