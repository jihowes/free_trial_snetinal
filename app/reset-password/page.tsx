'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Logo } from '@/components/ui/Logo'
import { Eye, EyeOff, AlertCircle, CheckCircle, Lock } from 'lucide-react'
import FantasyBackgroundWrapper from '@/components/FantasyBackgroundWrapper'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Check if we have a valid session (user clicked reset link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsValidToken(true)
      } else {
        setError('Invalid or expired reset link. Please request a new password reset.')
      }
    }
    
    checkSession()
  }, [supabase.auth])

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
                  {success ? 'Password Updated!' : 'Set New Password'}
                </h1>
                <p className="text-slate-300 mt-2">
                  {success 
                    ? 'Your password has been successfully updated.'
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
                    <p className="text-green-500 font-medium">Password successfully updated!</p>
                  </div>
                  <p className="text-slate-400 text-sm">Redirecting to dashboard...</p>
                </motion.div>
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