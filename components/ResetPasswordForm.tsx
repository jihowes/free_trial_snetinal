'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Validate passwords match
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match')
        setIsSubmitting(false)
        return
      }

      // Validate password strength
      const passwordError = validatePassword(newPassword)
      if (passwordError) {
        setError(passwordError)
        setIsSubmitting(false)
        return
      }

      // Update user password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) {
        console.error('Password update error:', updateError)
        setError(updateError.message || 'Failed to update password')
        setIsSubmitting(false)
        return
      }

      // Success!
      setSuccess(true)
      setIsSubmitting(false)
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login?message=password-reset-success')
      }, 2000)

    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-green-500 font-medium">Password Updated Successfully!</p>
        </div>
        <p className="text-slate-300">
          Your password has been updated. Redirecting you to the login page...
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-fantasy-crimson" />
          <span className="text-slate-400 text-sm">Redirecting...</span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20"
        >
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-destructive text-sm">{error}</p>
        </motion.div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-slate-400 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-8 text-slate-400 hover:text-slate-300 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-xs text-slate-400 space-y-1">
          <p>Password requirements:</p>
          <ul className="list-disc list-inside space-y-1">
            <li className={newPassword.length >= 8 ? 'text-green-400' : ''}>
              At least 8 characters long
            </li>
            <li className={/(?=.*[a-z])/.test(newPassword) ? 'text-green-400' : ''}>
              Contains at least one lowercase letter
            </li>
            <li className={/(?=.*[A-Z])/.test(newPassword) ? 'text-green-400' : ''}>
              Contains at least one uppercase letter
            </li>
            <li className={/(?=.*\d)/.test(newPassword) ? 'text-green-400' : ''}>
              Contains at least one number
            </li>
          </ul>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !newPassword || !confirmPassword}
          className="w-full bg-gradient-to-r from-fantasy-crimson to-fantasy-molten hover:from-fantasy-molten hover:to-fantasy-crimson text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Password...</span>
            </div>
          ) : (
            'Update Password'
          )}
        </Button>
      </div>
    </motion.form>
  )
} 