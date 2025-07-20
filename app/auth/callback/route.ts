import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const type = requestUrl.searchParams.get('type')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/login?error=auth_error', requestUrl.origin))
    }

    // Check if this is a password reset by looking for the recovery type
    if (type === 'recovery' && data.session?.user?.aud === 'authenticated') {
      // This is a password reset, redirect to reset password page
      return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
    }
  }

  // If no code but we have a next parameter pointing to reset-password, redirect there
  if (!code && next === '/reset-password') {
    return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
} 