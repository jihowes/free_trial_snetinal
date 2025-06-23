'use client'

import { motion } from 'framer-motion'
import { Clock, AlertTriangle, CheckCircle, DollarSign, XCircle, Calendar, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Trial {
  id: string
  service_name: string
  end_date: string
  cost?: number | null
  billing_frequency?: 'weekly' | 'fortnightly' | 'monthly' | 'yearly'
  outcome?: 'active' | 'kept' | 'cancelled' | 'expired'
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

  useEffect(() => {
    setMounted(true)
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

  // Get encouraging message
  const getEncouragingMessage = () => {
    const expiringSoon = trials.filter(trial => {
      const daysLeft = Math.ceil((new Date(trial.end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      // Only count active trials (not actioned ones)
      const isActive = trial.outcome === 'active' || trial.outcome === null || trial.outcome === undefined
      return daysLeft <= 7 && daysLeft > 0 && isActive
    }).length

    if (expiringSoon === 0 && activeTrials > 0) {
      if (potentialSavings.potentialSavings > 0) {
        return `You're all clear! No trials expiring this week. You could save $${potentialSavings.potentialSavings.toFixed(2)}/month by cancelling current trials.`
      }
      return "You're all clear! No trials expiring this week."
    } else if (expiringSoon > 0) {
      return `Warning: ${expiringSoon} trial${expiringSoon > 1 ? 's' : ''} expire${expiringSoon > 1 ? '' : 's'} in the next 7 days.`
    } else if (cancelledTrials > 0 || expiredTrials > 0) {
      if (moneySaved.totalSaved > 0) {
        return `Excellent work! You've saved $${moneySaved.totalSaved.toFixed(2)} by avoiding auto-charges.`
      } else {
        return `Great job managing your trials! Add costs to see your exact savings.`
      }
    } else {
      return `Welcome to Sentinel, ${userName}! The all-seeing eye is ready to watch over your free trials. Start adding them to never miss a deadline again.`
    }
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
      {/* Money Saved and Potential Savings Banners */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Money Saved Banner */}
        {(cancelledTrials > 0 || expiredTrials > 0) && (
          <div className="p-6 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-green-500/30">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">
                  Money Saved
                </h2>
                <p className="text-green-300 text-sm">
                  {moneySaved.hasRealCosts 
                    ? `Based on ${cancelledTrials + expiredTrials} avoided charges`
                    : `Estimated savings from ${cancelledTrials + expiredTrials} avoided trials`
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">
                  ${moneySaved.totalSaved.toFixed(2)}
                </div>
                <div className="text-xs text-green-300">
                  {moneySaved.hasRealCosts ? 'Real costs' : 'Estimate'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Potential Savings Banner */}
        {potentialSavings.potentialSavings > 0 && (
          <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-blue-500/30">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">
                  Potential Savings
                </h2>
                <p className="text-blue-300 text-sm">
                  {potentialSavings.trialsWithCost > 0 
                    ? `From ${potentialSavings.trialsWithCost} active trials with costs`
                    : `From ${potentialSavings.totalActiveTrials} active trials`
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-400">
                  ${potentialSavings.potentialSavings.toFixed(2)}
                </div>
                <div className="text-xs text-blue-300">
                  {potentialSavings.trialsWithCost > 0 ? 'Real costs' : 'Estimate'}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-6"
      >
        {/* Encouraging Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
        >
          <p className="text-slate-300 text-sm md:text-base">
            {getEncouragingMessage()}
          </p>
        </motion.div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
            className={`
              p-4 rounded-lg border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm
              hover:bg-slate-800/50 transition-all duration-300 hover:scale-105
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className={`font-semibold ${stat.color}`}>
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