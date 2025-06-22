'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CountdownBadgeProps {
  daysLeft: number
  isUrgent: boolean
  isWarning: boolean
}

export function CountdownBadge({ daysLeft, isUrgent, isWarning }: CountdownBadgeProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getBadgeContent = () => {
    if (daysLeft < 0) return { text: `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'} ago`, color: 'text-red-400' }
    if (daysLeft === 0) return { text: 'Expires today', color: 'text-red-400' }
    if (daysLeft === 1) return { text: '1 day left', color: 'text-red-400' }
    return { text: `${daysLeft} days left`, color: 'text-slate-300' }
  }

  const { text, color } = getBadgeContent()

  // Only pulse if expiring in next 3 days or expired in last 7 days
  const shouldPulse = (daysLeft >= 0 && daysLeft <= 2) || (daysLeft < 0 && daysLeft >= -7)

  if (!mounted) {
    return (
      <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-500/20 border border-slate-500/30 text-slate-300">
        <Clock className="w-3 h-3" />
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <motion.div
      className={`
        inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
        ${isUrgent 
          ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
          : isWarning 
            ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
            : 'bg-slate-500/20 border border-slate-500/30 text-slate-300'
        }
      `}
      animate={shouldPulse ? {
        boxShadow: [
          '0 0 0 0 rgba(239, 68, 68, 0)',
          '0 0 0 6px rgba(239, 68, 68, 0.2)',
          '0 0 0 0 rgba(239, 68, 68, 0)'
        ],
        opacity: [1, 0.9, 1]
      } : {}}
      transition={shouldPulse ? {
        duration: 1.5,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1],
        times: [0, 0.5, 1]
      } : {}}
    >
      <Clock className="w-3 h-3 flex-shrink-0" />
      <span className="flex-shrink-0">{text}</span>
    </motion.div>
  )
} 