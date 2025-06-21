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
    if (daysLeft < 0) return { text: 'Expired', color: 'text-red-400' }
    if (daysLeft === 0) return { text: 'Expires today', color: 'text-red-400' }
    if (daysLeft === 1) return { text: '1 day left', color: 'text-red-400' }
    return { text: `${daysLeft} days left`, color: 'text-slate-300' }
  }

  const { text, color } = getBadgeContent()

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
        inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium
        ${isUrgent 
          ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
          : isWarning 
            ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
            : 'bg-slate-500/20 border border-slate-500/30 text-slate-300'
        }
      `}
      animate={isUrgent ? {
        scale: [1, 1.05, 1],
        boxShadow: [
          '0 0 0 0 rgba(239, 68, 68, 0)',
          '0 0 0 4px rgba(239, 68, 68, 0.3)',
          '0 0 0 0 rgba(239, 68, 68, 0)'
        ]
      } : {}}
      transition={isUrgent ? {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
    >
      <Clock className="w-3 h-3" />
      <span>{text}</span>
    </motion.div>
  )
} 