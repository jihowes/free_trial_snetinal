'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Logo } from '@/components/ui/Logo'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/Dialog'
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import FantasyBackgroundWrapper from '@/components/FantasyBackgroundWrapper'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetMessage, setResetMessage] = useState('')
  const [resetError, setResetError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const wittyMessages = [
    "Because 'Oops, I forgot to cancel' gets expensive",
    "Subscription traps? Consider them neutralized",
    "Smarter than a subscription manager. Funnier too.",
    "Because forgetting = paying. And paying sucks.",
    "Save money by doing... not much.",
    "Your wallet just exhaled.",
    "Free trials should be free - we keep them that way.",
    "Cancel anxiety? Gone.",
    "You relax, we remind.",
    "Because forgetting = paying. And paying sucks."
  ]

  // Check for pre-filled email when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefillEmail = localStorage.getItem('prefillEmail')
      if (prefillEmail) {
        setEmail(prefillEmail)
        setResetEmail(prefillEmail)
        localStorage.removeItem('prefillEmail')
      }
    }
  }, [])

  // Handle password reset code parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const next = urlParams.get('next')
      
      if (code) {
        // This is a password reset link, redirect to reset-password page
        router.replace(`/reset-password?code=${code}`)
      } else if (next === '/reset-password') {
        // This is a redirect to reset-password without code, go there directly
        router.replace('/reset-password')
      }
    }
  }, [router])

  // Rotate through witty messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % wittyMessages.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [wittyMessages.length])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    setResetError('')
    setResetMessage('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${location.origin}/auth/callback?next=/reset-password`,
      })

      if (error) {
        setResetError(error.message)
      } else {
        setResetMessage('Password reset link sent! Check your email.')
        setTimeout(() => {
          setDialogOpen(false)
          setResetMessage('')
        }, 3000)
      }
    } catch (error) {
      setResetError('An unexpected error occurred')
    } finally {
      setResetLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <FantasyBackgroundWrapper showEmbers={true} showEyeGlow={true}>
      <div className="min-h-screen flex">
        {/* Left Column - Branding */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-fantasy-obsidian via-fantasy-charcoal to-fantasy-shadow flex-col items-center justify-center p-12 relative overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-fantasy-crimson rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-fantasy-molten rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-fantasy-gold rounded-full blur-lg animate-pulse delay-500"></div>
          </div>

          <motion.div 
            className="relative z-10 space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Logo size="xl" containerSize="xl" className="mx-auto mb-6" />
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-4 pl-8">
              <h1 className="text-4xl font-bold text-white font-outfit text-left">
                Welcome to Sentinel
              </h1>
              <div className="text-xl text-slate-300 text-left space-y-2">
                <p>Your intelligent guardian against trial expiration.</p>
                <p>Never miss a deadline again.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4 pl-24">
              <div className="text-slate-400">
                <span className="text-sm italic">
                  {wittyMessages[currentMessageIndex]}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Column - Login Form */}
        <motion.div 
          className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-fantasy-obsidian via-fantasy-charcoal to-fantasy-shadow"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <motion.div 
            className="w-full max-w-md space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Mobile Logo */}
            <motion.div variants={itemVariants} className="lg:hidden text-center">
              <Logo size="xl" containerSize="xl" className="mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white font-outfit">
                Welcome back
              </h2>
              <div className="mt-4">
                <Link 
                  href="/explore" 
                  className="text-orange-400 hover:text-orange-300 text-sm underline"
                >
                  Explore Free Trials →
                </Link>
              </div>
            </motion.div>

            {/* Desktop Title */}
            <motion.div variants={itemVariants} className="hidden lg:block">
              <h2 className="text-3xl font-bold text-white font-outfit mb-2">
                Welcome back
              </h2>
              <p className="text-slate-300">
                Sign in to your Sentinel account
              </p>
              <div className="mt-4">
                <Link 
                  href="/explore" 
                  className="text-orange-400 hover:text-orange-300 text-sm underline"
                >
                  Explore Free Trials →
                </Link>
              </div>
            </motion.div>

            {/* Login Form */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-xl bg-fantasy-ash/80 backdrop-blur-sm border border-fantasy-gold/20 shadow-fantasy-crimson/10">
                <CardContent className="p-8 pt-8 pb-6">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="relative"
                    >
                      <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
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
                    </motion.div>

                    {/* Forgot Password Link */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="text-right"
                    >
                      <button
                        type="button"
                        onClick={() => setDialogOpen(true)}
                        className="text-sm text-slate-400 hover:text-fantasy-crimson transition-colors duration-200"
                      >
                        Forgot your password?
                      </button>
                    </motion.div>

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

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-fantasy-crimson to-fantasy-molten hover:from-fantasy-molten hover:to-fantasy-crimson text-white font-semibold py-3 text-base transition-all duration-300 shadow-lg hover:shadow-fantasy-crimson/25" 
                        disabled={loading}
                      >
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          'Sign in'
                        )}
                      </Button>
                    </motion.div>
                  </form>
                  
                  <motion.div 
                    className="mt-6 text-center text-sm text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Don't have an account?{' '}
                    <Link 
                      href="/signup" 
                      className="text-fantasy-crimson hover:text-fantasy-molten transition-colors duration-200 font-medium"
                    >
                      Sign up
                    </Link>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-fantasy-ash/95 backdrop-blur-sm border border-fantasy-gold/20">
          <DialogHeader>
            <DialogTitle className="text-white font-outfit">Reset Your Password</DialogTitle>
            <DialogDescription className="text-slate-300">
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            
            {resetError && (
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <p className="text-sm text-destructive">{resetError}</p>
              </div>
            )}
            
            {resetMessage && (
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <p className="text-sm text-green-500">{resetMessage}</p>
              </div>
            )}
            
            <div className="flex space-x-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setDialogOpen(false)}
                className="flex-1 border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={resetLoading}
                className="flex-1 bg-gradient-to-r from-fantasy-crimson to-fantasy-molten hover:from-fantasy-molten hover:to-fantasy-crimson text-white"
              >
                {resetLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </FantasyBackgroundWrapper>
  )
} 
