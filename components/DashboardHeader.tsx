'use client'

import { motion } from 'framer-motion'
import { Clock, AlertTriangle, CheckCircle, DollarSign, XCircle, Calendar, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCurrency } from './CurrencyContext'

interface Trial {
  id: string
  service_name: string
  end_date: string
  cost?: number | null
  billing_frequency?: 'weekly' | 'fortnightly' | 'monthly' | 'yearly'
  outcome?: 'active' | 'kept' | 'cancelled' | 'expired'
  liked?: boolean
}

interface DashboardHeaderProps {
  userName: string
  totalTrials: number
  trials: Trial[]
  nextExpiringTrial?: {
    service_name: string
    daysLeft: number
  }
}

export function DashboardHeader({ userName, totalTrials, trials, nextExpiringTrial }: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState('')
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true)
  const { formatCurrency } = useCurrency()

  useEffect(() => {
    setMounted(true)
    
    // Check if user has dismissed the welcome message
    const dismissed = localStorage.getItem('welcomeMessageDismissed')
    if (dismissed) {
      setShowWelcomeMessage(false)
    }
    
    const updateGreeting = () => {
      const now = new Date()
      const hour = now.getHours()
      let greetingText = ''
      
      if (hour < 12) {
        greetingText = 'Greetings, Guardian'
      } else if (hour < 17) {
        greetingText = 'Salutations, Sentinel'
      } else {
        greetingText = 'Evening watch, Protector'
      }
      
      setGreeting(greetingText)
      setCurrentTime(now)
    }

    updateGreeting()
    
    const interval = setInterval(() => {
      updateGreeting()
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const handleDismissWelcome = () => {
    setShowWelcomeMessage(false)
    localStorage.setItem('welcomeMessageDismissed', 'true')
  }

  // Calculate money saved based on actual costs
  const calculateMoneySaved = () => {
    const now = new Date()
    let totalSaved = 0
    let cancelledTrialsWithCost = 0
    let expiredTrialsWithCost = 0
    let trialsWithoutCost = 0

    // Calculate savings from cancelled trials
    const cancelledTrials = trials.filter(trial => trial.outcome === 'cancelled')
    cancelledTrials.forEach(trial => {
      if (trial.cost && trial.cost > 0) {
        totalSaved += trial.cost
        cancelledTrialsWithCost++
      } else {
        trialsWithoutCost++
      }
    })

    // Calculate savings from expired trials (assuming they would have been charged)
    const expiredTrials = trials.filter(trial => trial.outcome === 'expired')
    expiredTrials.forEach(trial => {
      if (trial.cost && trial.cost > 0) {
        totalSaved += trial.cost
        expiredTrialsWithCost++
      } else {
        trialsWithoutCost++
      }
    })

    // Add estimated savings for trials without costs ($10 per trial as fallback)
    const estimatedSavings = trialsWithoutCost * 10
    totalSaved += estimatedSavings

    return {
      totalSaved: Math.round(totalSaved * 100) / 100, // Round to 2 decimal places
      cancelledTrialsWithCost,
      expiredTrialsWithCost,
      trialsWithoutCost,
      estimatedSavings,
      hasRealCosts: cancelledTrialsWithCost > 0 || expiredTrialsWithCost > 0
    }
  }

  // Calculate potential savings from active trials
  const calculatePotentialSavings = () => {
    const activeTrials = trials.filter(trial => {
      const isActive = trial.outcome === 'active' || trial.outcome === null || trial.outcome === undefined
      return new Date(trial.end_date) > new Date() && isActive
    })
    
    const potentialSavings = activeTrials.reduce((total, trial) => {
      return total + (trial.cost || 0)
    }, 0)
    
    const trialsWithCost = activeTrials.filter(trial => trial.cost && trial.cost > 0).length
    
    return {
      potentialSavings: Math.round(potentialSavings * 100) / 100,
      trialsWithCost,
      totalActiveTrials: activeTrials.length
    }
  }

  // Calculate stats
  const now = new Date()
  const activeTrials = trials.filter(trial => {
    const isActive = trial.outcome === 'active' || trial.outcome === null || trial.outcome === undefined
    return new Date(trial.end_date) > now && isActive
  }).length
  const keptTrials = trials.filter(trial => trial.outcome === 'kept').length
  const cancelledTrials = trials.filter(trial => trial.outcome === 'cancelled').length
  const expiredTrials = trials.filter(trial => trial.outcome === 'expired').length
  
  const moneySaved = calculateMoneySaved()
  const potentialSavings = calculatePotentialSavings()

  // Get dynamic welcome/encouraging message
  const getWelcomeMessage = () => {
    const displayName = userName || 'User'
    
    // New users (no trials at all)
    if (totalTrials === 0) {
      return `Welcome, ${displayName}! Did you know nearly 1 in 2 households unknowingly pay for unused subscriptions? Track your first trial here - your wallet will thank you in a few weeks!`
    }
    
    // Users with savings (have cancelled/expired trials)
    if (cancelledTrials > 0 || expiredTrials > 0) {
      if (moneySaved.totalSaved > 0) {
        return `Great to see you, ${displayName}! You've already cancelled ${cancelledTrials + expiredTrials} trial${cancelledTrials + expiredTrials === 1 ? '' : 's'} on time and saved about ${formatCurrency(moneySaved.totalSaved)} - well done! Did you know the average American wastes $32 monthly on unused subscriptions? You're beating the average!`
      } else {
        return `Great to see you, ${displayName}! You've already cancelled ${cancelledTrials + expiredTrials} trial${cancelledTrials + expiredTrials === 1 ? '' : 's'} on time - well done! Did you know the average American wastes $32 monthly on unused subscriptions? You're beating the average!`
      }
    }
    
    // Users with active trials but no savings yet
    if (activeTrials > 0) {
      return `Welcome back, ${displayName}! You've made a smart choice - nearly half of all households carry forgotten subscriptions that cost about £14/month or $33/month on average. By tracking your trials, you're saving money that most people lose without even realizing it. Nice work - your Sentinel is on guard!`
    }
    
    // Fallback
    return `Welcome to Sentinel, ${displayName}! The all-seeing eye is ready to watch over your free trials. Start adding them to never miss a deadline again.`
  }

  const stats = [
    {
      label: 'Active Trials',
      value: activeTrials,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      label: 'Kept',
      value: keptTrials,
      icon: DollarSign,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      label: 'Cancelled',
      value: cancelledTrials,
      icon: XCircle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      label: 'Past Expiry',
      value: expiredTrials,
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      {/* Welcome Message */}
      {showWelcomeMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-6 relative"
        >
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
            <button
              onClick={handleDismissWelcome}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-300 transition-colors"
              title="Dismiss message"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="text-slate-300 text-sm md:text-base pr-6">
              {getWelcomeMessage()}
            </p>
          </div>
        </motion.div>
      )}

      {/* Money Saved and Potential Savings Banners */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
      >
        {/* Money Saved Banner */}
        <div className="p-3 md:p-6 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex-shrink-0 p-2 md:p-3 rounded-lg bg-green-500/30">
              <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-xl font-bold text-white mb-1">
                Money Saved
              </h2>
              <p className="text-green-300 text-xs md:text-sm leading-relaxed">
                {cancelledTrials > 0 || expiredTrials > 0
                  ? (moneySaved.hasRealCosts 
                      ? `Based on ${cancelledTrials + expiredTrials} avoided charge${cancelledTrials + expiredTrials === 1 ? '' : 's'}`
                      : `Estimated savings from ${cancelledTrials + expiredTrials} avoided trial${cancelledTrials + expiredTrials === 1 ? '' : 's'}`
                    )
                  : `Haven't dodged any charges yet - stay sharp, Sentinel.`
                }
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-lg md:text-2xl font-bold text-green-400">
                {formatCurrency(moneySaved.totalSaved)}
              </div>
            </div>
          </div>
        </div>

        {/* Potential Savings Banner */}
        <div className="p-3 md:p-6 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex-shrink-0 p-2 md:p-3 rounded-lg bg-blue-500/30">
              <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-xl font-bold text-white mb-1">
                Potential Savings
              </h2>
              <p className="text-blue-300 text-xs md:text-sm leading-relaxed">
                {potentialSavings.potentialSavings > 0
                  ? (potentialSavings.trialsWithCost > 0 
                      ? `From ${potentialSavings.trialsWithCost} active trial${potentialSavings.trialsWithCost === 1 ? '' : 's'} with costs`
                      : `From ${potentialSavings.totalActiveTrials} active trial${potentialSavings.totalActiveTrials === 1 ? '' : 's'}`
                    )
                  : `No cost-tracked trials yet - add one to estimate potential savings.`
                }
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-lg md:text-2xl font-bold text-blue-400">
                {formatCurrency(potentialSavings.potentialSavings)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
            className={`
              p-3 md:p-4 rounded-lg border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm
              hover:bg-slate-800/50 transition-all duration-300 hover:scale-105
            `}
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className={`p-1.5 md:p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs md:text-sm text-slate-400">{stat.label}</p>
                <p className={`text-sm md:text-base font-semibold ${stat.color}`}>
                  {typeof stat.value === 'number' ? stat.value : stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
} 