'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Logo } from '@/components/ui/Logo'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [emailExists, setEmailExists] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const checkIfEmailExists = async (email: string) => {
    try {
      // Try to sign in with the email to see if it exists
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // This prevents creating a new user
        }
      })
      
      // If we get a specific error about user not found, the email doesn't exist
      if (error && error.message.includes('user not found')) {
        return false
      }
      
      // If no error or different error, the email likely exists
      return true
    } catch (error) {
      // If there's an error, assume the email exists to be safe
      return true
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    setEmailExists(false)

    try {
      // First check if the email already exists
      const emailAlreadyExists = await checkIfEmailExists(email)
      
      if (emailAlreadyExists) {
        setEmailExists(true)
        setError('An account with this email already exists.')
        setLoading(false)
        return
      }

      // If email doesn't exist, proceed with signup
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo Section */}
        <div className="text-center">
          <Logo size="lg" className="mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">
            Start protecting your free trials today
          </p>
        </div>

        {/* Signup Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
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
              />
              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              {error && (
                <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                  <p className="text-sm text-amber-700 dark:text-amber-400">{error}</p>
                  {emailExists && (
                    <div className="mt-2 pt-2 border-t border-amber-500/20">
                      <p className="text-sm text-muted-foreground mb-2">
                        It looks like you already have an account. Would you like to:
                      </p>
                      <div className="space-y-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={handleLoginInstead}
                          className="w-full"
                        >
                          Sign in with this email
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          Or try a different email address
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {message && (
                <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-green-600">{message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please check your email and click the confirmation link to activate your account.
                  </p>
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 