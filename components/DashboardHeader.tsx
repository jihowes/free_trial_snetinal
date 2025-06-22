'use client'

import { motion } from 'framer-motion'
import { Clock, AlertTriangle, CheckCircle, DollarSign, XCircle, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Trial {
  id: string
  service_name: string
  end_date: string
  status?: 'active' | 'cancelled' | 'missed'
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

  // Calculate stats
  const now = new Date()
  const activeTrials = trials.filter(trial => new Date(trial.end_date) > now && trial.outcome === 'active').length
  const keptTrials = trials.filter(trial => trial.outcome === 'kept').length
  const cancelledTrials = trials.filter(trial => trial.outcome === 'cancelled').length
  const expiredTrials = trials.filter(trial => trial.outcome === 'expired').length
  const estimatedSavings = (cancelledTrials + expiredTrials) * 10 // $10 per trial

  // Get encouraging message
  const getEncouragingMessage = () => {
    const expiringSoon = trials.filter(trial => {
      const daysLeft = Math.ceil((new Date(trial.end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysLeft <= 7 && daysLeft > 0
    }).length

    if (expiringSoon === 0 && activeTrials > 0) {
      return "You're all clear! No trials expiring this week."
    } else if (expiringSoon > 0) {
      return `Warning: ${expiringSoon} trial${expiringSoon > 1 ? 's' : ''} expire${expiringSoon > 1 ? '' : 's'} in the next 7 days.`
    } else if (cancelledTrials > 0 || expiredTrials > 0) {
      return `Nice work — you've avoided $${estimatedSavings} in auto-charges so far!`
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
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20'
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