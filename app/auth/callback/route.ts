import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')
  const type = requestUrl.searchParams.get('type')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  console.log('Auth callback debug:', { code: !!code, next, type, error, errorDescription, fullUrl: requestUrl.toString() })

  // Handle errors (expired links, etc.)
  if (error) {
    console.log('Auth callback error detected:', error)
    if (next === '/reset-password') {
      // Password reset link expired, redirect to reset-password with error
      return NextResponse.redirect(new URL(`/reset-password?error=${error}&error_description=${errorDescription}`, requestUrl.origin))
    } else {
      // Other auth error, redirect to login
      return NextResponse.redirect(new URL(`/login?error=${error}&error_description=${errorDescription}`, requestUrl.origin))
    }
  }

  // If this is a password reset request, redirect directly to reset-password
  if (type === 'recovery' || next === '/reset-password') {
    console.log('Password reset detected, redirecting to reset-password')
    return NextResponse.redirect(new URL(`/reset-password?code=${code}`, requestUrl.origin))
  }

  // If we have a code, try to exchange it for a session (for regular auth)
  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('Auth exchange result:', { hasData: !!data, hasError: !!error, error: error?.message })
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/login?error=auth_error', requestUrl.origin))
    }

    // Regular auth success, redirect to dashboard or specified next
    const redirectUrl = next || '/dashboard'
    console.log('Regular auth success, redirecting to:', redirectUrl)
    return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin))
  }

  // No code provided
  console.log('No code provided, redirecting to login')
  return NextResponse.redirect(new URL('/login?error=no_code', requestUrl.origin))
} 