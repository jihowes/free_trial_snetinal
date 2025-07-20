'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Logo } from '@/components/ui/Logo'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import FantasyBackgroundWrapper from '@/components/FantasyBackgroundWrapper'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [linkExpired, setLinkExpired] = useState(false)
  const [requestingNewLink, setRequestingNewLink] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Check for expired link errors
    const urlError = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (urlError === 'access_denied' && errorDescription?.includes('expired')) {
      setLinkExpired(true)
      setError('Your password reset link has expired. Please request a new one.')
      return
    }

    // Check if we have a code parameter and authenticate the user
    const authenticateUser = async () => {
      const code = searchParams.get('code')
      if (code) {
        try {
          // For password reset, we need to use the recovery token
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: code,
            type: 'recovery'
          })
          
          if (error) {
            console.error('Password reset verification error:', error)
            setError('Invalid or expired reset link. Please request a new password reset.')
            setLinkExpired(true)
          } else if (data.session) {
            // User is now authenticated, can proceed with password reset
            console.log('User authenticated for password reset')
          }
        } catch (error) {
          console.error('Password reset error:', error)
          setError('Invalid or expired reset link. Please request a new password reset.')
          setLinkExpired(true)
        }
      } else {
        // No code provided, check if user is already authenticated
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setError('No valid reset link found. Please request a new password reset.')
          setLinkExpired(true)
        }
      }
    }
    
    authenticateUser()
  }, [supabase.auth, searchParams])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate passwords
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestNewLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setRequestingNewLink(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setLinkExpired(false)
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setRequestingNewLink(false)
    }
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
                  {success ? 'Reset Link Sent!' : linkExpired ? 'Link Expired' : 'Set New Password'}
                </h1>
                <p className="text-slate-300 mt-2">
                  {success 
                    ? 'Check your email for a password reset link.'
                    : linkExpired
                      ? 'Your password reset link has expired. Request a new one below.'
                      : 'Enter your new password below.'
                  }
                </p>
              </div>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20 mb-6">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-green-500 font-medium">Password reset link sent!</p>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">Check your email and click the reset link.</p>
                  <Button
                    onClick={() => {
                      setSuccess(false)
                      setLinkExpired(false)
                      setEmail('')
                    }}
                    className="bg-gradient-to-r from-fantasy-crimson to-fantasy-molten hover:from-fantasy-molten hover:to-fantasy-crimson text-white"
                  >
                    Send Another Link
                  </Button>
                </motion.div>
              ) : linkExpired ? (
                <form onSubmit={handleRequestNewLink} className="space-y-6">
                  {/* Email Input for New Link */}
                  <div>
                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center space-x-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                    >
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <p className="text-sm text-destructive">{error}</p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={requestingNewLink}
                    className="w-full bg-gradient-to-r from-fantasy-crimson to-fantasy-molten hover:from-fantasy-molten hover:to-fantasy-crimson text-white font-semibold py-3"
                  >
                    {requestingNewLink ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      'Send New Reset Link'
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  {/* New Password */}
                  <div className="relative">
                    <Input
                      label="New Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-11 text-slate-400 hover:text-white transition-colors z-10"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <Input
                      label="Confirm New Password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-11 text-slate-400 hover:text-white transition-colors z-10"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center space-x-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                    >
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <p className="text-sm text-destructive">{error}</p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-fantasy-crimson to-fantasy-molten hover:from-fantasy-molten hover:to-fantasy-crimson text-white font-semibold py-3"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </FantasyBackgroundWrapper>
  )
} 