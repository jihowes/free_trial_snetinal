'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Logo } from '@/components/ui/Logo'
import { Mail, Lock, AlertCircle, CheckCircle, Shield, Zap, Clock } from 'lucide-react'
import FantasyBackgroundWrapper from '@/components/FantasyBackgroundWrapper'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [emailExists, setEmailExists] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    setEmailExists(false)

    try {
      // Proceed directly with signup - let Supabase handle email existence
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email for the confirmation link!')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleLoginInstead = () => {
    // Store the email in localStorage so it can be pre-filled on login page
    if (typeof window !== 'undefined') {
      localStorage.setItem('prefillEmail', email)
    }
    router.push('/login')
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
        ease: "easeOut"
      }
    }
  }

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  return (
    <FantasyBackgroundWrapper showEmbers={true} showEyeGlow={true} showFloatingEye={true}>
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
            className="relative z-10 text-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Logo size="xl" containerSize="xl" className="mx-auto mb-6" />
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-4">
              <p className="text-xl text-slate-300 max-w-md">
                Start protecting your free trials today. Never lose track of important deadlines again.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 text-left">
                <motion.div variants={featureVariants} className="flex items-center space-x-3 text-slate-300">
                  <div className="w-10 h-10 bg-fantasy-crimson/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-fantasy-crimson" />
                  </div>
                  <div>
                    <p className="font-medium">Smart Protection</p>
                    <p className="text-sm text-slate-400">Automated trial monitoring</p>
                  </div>
                </motion.div>
                
                <motion.div variants={featureVariants} className="flex items-center space-x-3 text-slate-300">
                  <div className="w-10 h-10 bg-fantasy-molten/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-fantasy-molten" />
                  </div>
                  <div>
                    <p className="font-medium">Instant Alerts</p>
                    <p className="text-sm text-slate-400">Real-time notifications</p>
                  </div>
                </motion.div>
                
                <motion.div variants={featureVariants} className="flex items-center space-x-3 text-slate-300">
                  <div className="w-10 h-10 bg-fantasy-gold/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-fantasy-gold" />
                  </div>
                  <div>
                    <p className="font-medium">Time Management</p>
                    <p className="text-sm text-slate-400">Never miss a deadline</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Column - Signup Form */}
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
                Create your account
              </h2>
            </motion.div>

            {/* Desktop Title */}
            <motion.div variants={itemVariants} className="hidden lg:block">
              <h2 className="text-3xl font-bold text-white font-outfit mb-2">
                Create your account
              </h2>
              <p className="text-slate-300">
                Enter your details to start protecting your trials
              </p>
            </motion.div>

            {/* Signup Form */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-xl bg-fantasy-ash/80 backdrop-blur-sm border border-fantasy-gold/20 shadow-fantasy-crimson/10">
                <CardContent className="p-8 pt-8 pb-6">
                  <form onSubmit={handleSignup} className="space-y-6">
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
                        onChange={(e) => {
                          setEmail(e.target.value)
                          // Clear email exists error when user starts typing
                          if (emailExists) {
                            setEmailExists(false)
                            setError('')
                          }
                        }}
                        required
                        icon={<Mail className="w-4 h-4" />}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Input
                        label="Password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        icon={<Lock className="w-4 h-4" />}
                      />
                    </motion.div>
                    
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-lg border ${
                          emailExists 
                            ? 'bg-orange-500/10 border-orange-500/20' 
                            : 'bg-destructive/10 border-destructive/20'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            emailExists ? 'text-orange-600' : 'text-destructive'
                          }`} />
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              emailExists ? 'text-orange-600' : 'text-destructive'
                            }`}>{error}</p>
                            {emailExists && (
                              <div className="mt-3 pt-3 border-t border-orange-500/20">
                                <p className="text-sm text-slate-300 mb-3">
                                  It looks like you already have an account. Would you like to:
                                </p>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={handleLoginInstead}
                                  className="w-full bg-fantasy-ash hover:bg-fantasy-charcoal text-white"
                                >
                                  Sign in with this email
                                </Button>
                                <p className="text-xs text-slate-400 text-center mt-2">
                                  Or try a different email address
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {message && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-lg bg-green-500/10 border border-green-500/20"
                      >
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-green-600 font-medium">{message}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              Please check your email and click the confirmation link to activate your account.
                            </p>
                          </div>
                        </div>
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
                          'Create account'
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
                    Already have an account?{' '}
                    <Link 
                      href="/login" 
                      className="text-fantasy-crimson hover:text-fantasy-molten transition-colors duration-200 font-medium"
                    >
                      Sign in
                    </Link>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </FantasyBackgroundWrapper>
  )
} 