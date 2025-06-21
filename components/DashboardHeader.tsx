'use client'

import { motion } from 'framer-motion'
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DashboardHeaderProps {
  userName: string
  totalTrials: number
  nextExpiringTrial?: {
    service_name: string
    daysLeft: number
  }
}

export function DashboardHeader({ userName, totalTrials, nextExpiringTrial }: DashboardHeaderProps) {
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
        greetingText = 'Good morning'
      } else if (hour < 17) {
        greetingText = 'Good afternoon'
      } else {
        greetingText = 'Good evening'
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

  const stats = [
    {
      label: 'Active Trials',
      value: totalTrials,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    ...(nextExpiringTrial ? [{
      label: 'Next to Expire',
      value: `${nextExpiringTrial.service_name} in ${nextExpiringTrial.daysLeft} days`,
      icon: AlertTriangle,
      color: nextExpiringTrial.daysLeft <= 7 ? 'text-amber-400' : 'text-slate-400',
      bgColor: nextExpiringTrial.daysLeft <= 7 ? 'bg-amber-500/20' : 'bg-slate-500/20'
    }] : [])
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
        <h1 className="text-3xl font-bold text-white mb-2">
          {mounted ? `${greeting}, ${userName} 👋` : `Welcome, ${userName} 👋`}
        </h1>
        <p className="text-slate-400 flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>
            {mounted && currentTime 
              ? currentTime.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })
              : '--:-- --'
            }
          </span>
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
            className={`
              p-4 rounded-lg border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm
              hover:bg-slate-800/50 transition-all duration-300
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