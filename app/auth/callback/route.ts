import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')
  const type = requestUrl.searchParams.get('type')

  // If this is a password reset request (either with code or next parameter)
  if (type === 'recovery' || next === '/reset-password') {
    if (code) {
      const supabase = createRouteHandlerClient({ cookies })
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(new URL('/login?error=auth_error', requestUrl.origin))
      }

      if (data.session?.user?.aud === 'authenticated') {
        return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
      }
    } else {
      // No code but password reset request, redirect to reset-password
      return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
    }
  }

  // Handle regular auth with code
  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/login?error=auth_error', requestUrl.origin))
    }

    // Successful auth, redirect to dashboard or specified next
    const redirectUrl = next || '/dashboard'
    return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin))
  }

  // No code and no valid request, redirect to login
  return NextResponse.redirect(new URL('/login?error=invalid_request', requestUrl.origin))
} 