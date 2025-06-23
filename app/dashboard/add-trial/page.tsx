'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { ArrowLeft, Plus, Calendar, Clock, Shield, Zap, Sparkles, Eye, Bell, CheckCircle, DollarSign } from 'lucide-react'
import FantasyBackgroundWrapper from '@/components/FantasyBackgroundWrapper'
import { Logo, LogoIcon } from '@/components/ui/Logo'

export default function AddTrialPage() {
  const [serviceName, setServiceName] = useState('')
  const [endDate, setEndDate] = useState('')
  const [cost, setCost] = useState('')
  const [billingFrequency, setBillingFrequency] = useState<'weekly' | 'fortnightly' | 'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Use a longer delay to ensure hydration is completely finished
    const timer = setTimeout(() => {
      setMounted(true)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  // Quick date presets
  const getQuickDates = () => {
    const today = new Date()
    const sevenDays = new Date(today)
    sevenDays.setDate(today.getDate() + 7)
    const fourteenDays = new Date(today)
    fourteenDays.setDate(today.getDate() + 14)
    const oneMonth = new Date(today)
    oneMonth.setMonth(today.getMonth() + 1)
    const oneYear = new Date(today)
    oneYear.setFullYear(today.getFullYear() + 1)

    return [
      { label: '7 Days', date: sevenDays.toISOString().split('T')[0] },
      { label: '14 Days', date: fourteenDays.toISOString().split('T')[0] },
      { label: '1 Month', date: oneMonth.toISOString().split('T')[0] },
      { label: '1 Year', date: oneYear.toISOString().split('T')[0] }
    ]
  }

  // Quick price presets
  const getQuickPrices = () => {
    return [
      { label: '$9.99', price: '9.99' },
      { label: '$14.99', price: '14.99' },
      { label: '$19.99', price: '19.99' },
      { label: '$29.99', price: '29.99' },
      { label: '$49.99', price: '49.99' }
    ]
  }

  const validateForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!serviceName.trim()) {
      errors.serviceName = 'Service name is required'
    } else if (serviceName.trim().length < 2) {
      errors.serviceName = 'Service name must be at least 2 characters'
    }
    
    if (!endDate) {
      errors.endDate = 'End date is required'
    } else {
      const selectedDate = new Date(endDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        errors.endDate = 'End date cannot be in the past'
      }
    }
    
    // Validate cost if provided
    if (cost.trim()) {
      const price = parseFloat(cost)
      if (isNaN(price) || price < 0) {
        errors.cost = 'Please enter a valid cost (e.g., 9.99)'
      } else if (price > 999999.99) {
        errors.cost = 'Cost cannot exceed $999,999.99'
      }
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError) {
        setError('Authentication error: ' + userError.message)
        return
      }

      if (!user) {
        router.push('/login')
        return
      }

      // Set the end date to the end of the selected day (23:59:59)
      const endOfDay = new Date(endDate)
      endOfDay.setHours(23, 59, 59, 999)
      const endDateWithTime = endOfDay.toISOString()

      // Insert the trial
      const { data, error } = await supabase.from('trials').insert({
        user_id: user.id,
        service_name: serviceName.trim(),
        end_date: endDateWithTime,
        cost: cost.trim() ? parseFloat(cost) : null,
        billing_frequency: billingFrequency,
      })

      if (error) {
        setError(error.message || 'Database error occurred')
      } else {
        // Refresh the dashboard data and redirect
        router.refresh()
        setTimeout(() => {
        router.push('/dashboard')
        }, 100)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setError('An unexpected error occurred: ' + (error as Error).message)
    } finally {
      setLoading(false)
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
    <FantasyBackgroundWrapper showFloatingEye={false}>
      <div className="min-h-screen flex items-center justify-center p-4 relative">
      <motion.div
          className="w-full max-w-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back button */}
        <motion.div variants={itemVariants} className="mb-6">
          <Button
            variant="secondary"
            onClick={() => router.push('/dashboard')}
              className="text-muted-foreground hover:text-foreground bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-700/50">
              <CardHeader className="space-y-1 text-center pb-2">
                <div className="flex justify-center mb-1">
                  <div className="w-20 h-20 relative flex items-center justify-center sentinel-logo" suppressHydrationWarning>
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
                      <defs>
                        <radialGradient id="eye-fire-large" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#ffee00" />
                          <stop offset="60%" stopColor="#ff8c00" />
                          <stop offset="100%" stopColor="#ff4500" />
                        </radialGradient>
                      </defs>

                      {/* Larger Fiery Eye of Sentinel - Centered */}
                      <g className={mounted ? 'sauron-eye' : ''}>
                        <path d="M65 100 C 85 75, 115 75, 135 100 C 115 125, 85 125, 65 100 Z" fill="url(#eye-fire-large)" />
                        <ellipse cx="100" cy="100" rx="6" ry="22" fill="#0d1117" stroke="#111" strokeWidth="2"/>
                      </g>
                    </svg>
                  </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
                <form onSubmit={handleSubmit} className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Input
                    label="Service Name"
                    type="text"
                    placeholder="e.g., Netflix, Spotify, Adobe Creative Suite"
                    value={serviceName}
                    onChange={(e) => {
                      setServiceName(e.target.value)
                      if (validationErrors.serviceName) {
                        setValidationErrors(prev => ({ ...prev, serviceName: '' }))
                      }
                    }}
                    error={validationErrors.serviceName}
                    className="bg-blue-50 border-slate-300 text-slate-900 placeholder:text-slate-500 shadow-sm focus-visible:ring-2 focus-visible:ring-offset-0"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Input
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value)
                      if (validationErrors.endDate) {
                        setValidationErrors(prev => ({ ...prev, endDate: '' }))
                      }
                    }}
                    error={validationErrors.endDate}
                    className="bg-blue-50 border-slate-300 text-slate-900 placeholder:text-slate-500 shadow-sm focus-visible:ring-2 focus-visible:ring-offset-0"
                    required
                  />
                    <p className="text-xs text-slate-400 mt-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      End date assumes the trial expires at 11:59 PM on the selected date
                    </p>
                    
                    {/* Common date presets */}
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-slate-400 font-medium">Common Dates:</p>
                      <div className="flex gap-2 flex-wrap">
                        {getQuickDates().map((preset, index) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setEndDate(preset.date)
                              if (validationErrors.endDate) {
                                setValidationErrors(prev => ({ ...prev, endDate: '' }))
                              }
                            }}
                            className="px-3 py-1 text-xs bg-slate-800/50 border border-slate-600/50 rounded-md text-slate-300 hover:bg-slate-700/50 hover:border-red-400/50 transition-colors"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Cost Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Input
                      label="Cost (Optional)"
                      type="number"
                      step="0.01"
                      min="0"
                      max="999999.99"
                      placeholder="0.00"
                      value={cost}
                      onChange={(e) => {
                        setCost(e.target.value)
                        if (validationErrors.cost) {
                          setValidationErrors(prev => ({ ...prev, cost: '' }))
                        }
                      }}
                      error={validationErrors.cost}
                      className="bg-blue-50 border-slate-300 text-slate-900 placeholder:text-slate-500 shadow-sm focus-visible:ring-2 focus-visible:ring-offset-0"
                    />
                    
                    {/* Billing Frequency Selector */}
                    <div className="mt-2">
                      <label className="block text-xs text-slate-400 mb-1">Billing Frequency:</label>
                      <div className="flex gap-2 flex-wrap">
                        {[
                          { value: 'weekly', label: 'Weekly' },
                          { value: 'fortnightly', label: 'Fortnightly' },
                          { value: 'monthly', label: 'Monthly' },
                          { value: 'yearly', label: 'Yearly' }
                        ].map((freq) => (
                          <button
                            key={freq.value}
                            type="button"
                            onClick={() => setBillingFrequency(freq.value as any)}
                            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                              billingFrequency === freq.value
                                ? 'bg-slate-700/50 border-green-400/50 text-green-300'
                                : 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50'
                            }`}
                          >
                            {freq.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-400 mt-2 flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Used to calculate money saved when trials are cancelled
                    </p>
                    
                    {/* Common price presets */}
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-slate-400 font-medium">Common Costs:</p>
                      <div className="flex gap-2 flex-wrap">
                        {getQuickPrices().map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setCost(preset.price)
                              if (validationErrors.cost) {
                                setValidationErrors(prev => ({ ...prev, cost: '' }))
                              }
                            }}
                            className="px-3 py-1 text-xs bg-slate-800/50 border border-slate-600/50 rounded-md text-slate-300 hover:bg-slate-700/50 hover:border-green-400/50 transition-colors"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                      className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                  >
                      <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                    className="flex gap-3 pt-1"
                >
                  <Button
                    type="button"
                    variant="secondary"
                      className="flex-1 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-slate-300"
                    onClick={() => router.push('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                      className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg" 
                    disabled={loading}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Trial
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

          {/* What happens next */}
        <motion.div 
          variants={itemVariants}
            className="mt-4 grid grid-cols-1 gap-3"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-red-400" />
            </div>
            <div>
                <p className="font-medium text-sm text-slate-200">Constant Monitoring</p>
                <p className="text-xs text-slate-400">Your trial will be tracked on the dashboard</p>
              </div>
          </div>
          
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-400" />
            </div>
            <div>
                <p className="font-medium text-sm text-slate-200">Smart Alerts</p>
                <p className="text-xs text-slate-400">Get notified when trials are expiring soon</p>
              </div>
          </div>
          
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
                <p className="font-medium text-sm text-slate-200">Track Outcomes</p>
                <p className="text-xs text-slate-400">Mark trials as kept, cancelled, or expired</p>
              </div>
            </div>
          </motion.div>
      </motion.div>
    </div>
    </FantasyBackgroundWrapper>
  )
} 