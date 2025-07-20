'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Logo } from '@/components/ui/Logo'
import { AlertCircle, CheckCircle } from 'lucide-react'
import FantasyBackgroundWrapper from '@/components/FantasyBackgroundWrapper'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // For password reset, we don't need to verify the token immediately
    // The user can enter their email and we'll send a new reset link
    setIsValidToken(true)
  }, [])

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setResetEmailSent(true)
        setSuccess(true)
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!isValidToken && !error) {
    return (
      <FantasyBackgroundWrapper showEmbers={true} showEyeGlow={true}>
        <div className="min-h-screen flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card className="border-0 shadow-xl bg-fantasy-ash/80 backdrop-blur-sm border border-fantasy-gold/20">
              <CardContent className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-fantasy-crimson border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-300">Verifying reset link...</p>
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
                  {success ? 'Reset Link Sent!' : 'Reset Your Password'}
                </h1>
                <p className="text-slate-300 mt-2">
                  {success 
                    ? 'Check your email for a password reset link.'
                    : 'Enter your email address to receive a password reset link.'
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
                      setResetEmailSent(false)
                      setEmail('')
                    }}
                    className="bg-gradient-to-r from-fantasy-crimson to-fantasy-molten hover:from-fantasy-molten hover:to-fantasy-crimson text-white"
                  >
                    Send Another Link
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleRequestReset} className="space-y-6">
                  {/* Email Input */}
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
                      'Send Reset Link'
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