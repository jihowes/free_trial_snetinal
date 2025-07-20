import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  console.log('Auth callback debug:', { code: !!code, next, error, errorDescription, fullUrl: requestUrl.toString() })

  // Handle errors (expired links, etc.)
  if (error) {
    console.log('Auth callback error detected:', error)
    return NextResponse.redirect(new URL(`/login?error=${error}&error_description=${errorDescription}`, requestUrl.origin))
  }

  // If we have a code, try to exchange it for a session
  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('Auth exchange result:', { hasData: !!data, hasError: !!error, error: error?.message })
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/login?error=auth_error', requestUrl.origin))
    }

    // Auth success, redirect to dashboard or specified next
    const redirectUrl = next || '/dashboard'
    console.log('Auth success, redirecting to:', redirectUrl)
    return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin))
  }

  // No code provided
  console.log('No code provided, redirecting to login')
  return NextResponse.redirect(new URL('/login?error=no_code', requestUrl.origin))
} 