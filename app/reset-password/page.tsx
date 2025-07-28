'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent } from '@/components/ui/Card'
import { Logo } from '@/components/ui/Logo'
import { AlertCircle, Loader2 } from 'lucide-react'
import FantasyBackgroundWrapper from '@/components/FantasyBackgroundWrapper'
import ResetPasswordForm from '../../components/ResetPasswordForm'

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading')
  const [error, setError] = useState('')
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const processResetLink = async () => {
      try {
        console.log('Processing reset link...')
        
        // Get hash parameters
        const hash = window.location.hash
        console.log('Hash:', hash)
        
        if (!hash) {
          console.error('No hash found in URL')
          setError('Invalid reset link. Please request a new password reset link.')
          setStatus('invalid')
          return
        }

        // Parse hash parameters
        const hashParams = new URLSearchParams(hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const type = hashParams.get('type')
        
        console.log('Parsed params:', { 
          hasAccessToken: !!accessToken, 
          accessTokenValue: accessToken || 'null',
          type,
          accessTokenLength: accessToken ? accessToken.length : 0
        })

        // Validate required parameters
        if (!accessToken || accessToken.trim() === '') {
          console.error('Access token is missing or empty:', { accessToken: accessToken || 'null' })
          setError('Invalid reset link: Access token is missing. Please request a new password reset link.')
          setStatus('invalid')
          return
        }

        if (type !== 'recovery') {
          console.error('Invalid type parameter:', { type })
          setError('Invalid reset link: Wrong link type. Please request a new password reset link.')
          setStatus('invalid')
          return
        }

        // For password reset with token hash, we need to use a different approach
        // The token hash is not a JWT, so we can't use setSession directly
        console.log('Token hash detected, using auth state change listener...')
        
        // Set up auth state change listener for password recovery
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session ? 'Session present' : 'No session')
            
            if (event === 'PASSWORD_RECOVERY') {
              if (session) {
                console.log('Password recovery session established')
                setStatus('valid')
              } else {
                console.log('No session in password recovery')
                setError('Unable to establish session from reset link.')
                setStatus('invalid')
              }
            }
          }
        )

        // Try to trigger the password recovery flow
        // For token hash, we might need to use a different method
        console.log('Attempting to verify password reset token...')
        
        // Try using verifyOtp for password recovery
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: accessToken,
          type: 'recovery'
        })

        if (verifyError) {
          console.error('Verify OTP error:', verifyError)
          // Don't immediately fail, wait for auth state change
          console.log('Verify error, but waiting for auth state change...')
        } else if (data.session) {
          console.log('Session established through verify OTP')
          setStatus('valid')
        } else {
          console.log('No session from verify OTP, waiting for auth state change...')
        }

        // Cleanup subscription on unmount
        return () => subscription.unsubscribe()

      } catch (error) {
        console.error('Unexpected error:', error)
        setError('An unexpected error occurred.')
        setStatus('invalid')
      }
    }

    processResetLink()
  }, [supabase.auth])

  if (status === 'loading') {
    return (
      <FantasyBackgroundWrapper showEmbers={true} showEyeGlow={true}>
        <div className="min-h-screen flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card className="border-0 shadow-xl bg-fantasy-ash/80 backdrop-blur-sm border border-fantasy-gold/20">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <Logo size="lg" containerSize="lg" className="mx-auto mb-4" />
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin text-fantasy-crimson" />
                    <span className="text-slate-300">Processing reset link...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </FantasyBackgroundWrapper>
    )
  }

  if (status === 'invalid') {
    return (
      <FantasyBackgroundWrapper showEmbers={true} showEyeGlow={true}>
        <div className="min-h-screen flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card className="border-0 shadow-xl bg-fantasy-ash/80 backdrop-blur-sm border border-fantasy-gold/20">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <Logo size="lg" containerSize="lg" className="mx-auto mb-4" />
                  <div className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <p className="text-destructive font-medium">Reset Link Invalid</p>
                  </div>
                  <p className="text-slate-300">
                    {error || 'Your password reset link is invalid or has expired. Please request a new one from the login page.'}
                  </p>
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full bg-gradient-to-r from-fantasy-crimson to-fantasy-molten hover:from-fantasy-molten hover:to-fantasy-crimson text-white font-semibold py-3 rounded-lg transition-all duration-300"
                  >
                    Return to Login
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </FantasyBackgroundWrapper>
    )
  }

  return (
    <FantasyBackgroundWrapper showEmbers={true} showEyeGlow={true}>
      <div className="min-h-screen flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-xl bg-fantasy-ash/80 backdrop-blur-sm border border-fantasy-gold/20">
            <CardContent className="p-8">
              {/* Logo and Title */}
              <div className="text-center mb-6">
                <Logo size="lg" containerSize="lg" className="mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-white font-outfit">
                  Set New Password
                </h1>
                <p className="text-slate-300 mt-2">
                  Enter your new password below.
                </p>
              </div>

              <ResetPasswordForm />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </FantasyBackgroundWrapper>
  )
} 