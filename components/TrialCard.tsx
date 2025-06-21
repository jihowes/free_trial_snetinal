'use client'

import { motion } from 'framer-motion'
import { Trash2, Calendar, AlertTriangle } from 'lucide-react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { CountdownBadge } from './CountdownBadge'
import { useEffect, useState } from 'react'

interface TrialCardProps {
  id: string
  service_name: string
  end_date: string
  onDelete: (id: string) => void
  index: number
}

export function TrialCard({ id, service_name, end_date, onDelete, index }: TrialCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const endDate = new Date(end_date)
  const now = new Date()
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  const isUrgent = daysLeft <= 1
  const isWarning = daysLeft <= 7 && daysLeft > 1

  if (!mounted) {
    return (
      <div className="w-full">
        <Card className="relative overflow-hidden border-0 shadow-lg transition-all duration-300 bg-slate-800/20 border-slate-600/30 shadow-slate-500/10">
          <div className="relative p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-500/20 text-slate-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {service_name}
                    </h3>
                    <p className="text-sm text-slate-400">
                      Loading...
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-500/20 border border-slate-500/30 text-slate-300">
                  <span>Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -2, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="w-full"
    >
      <Card className={`
        relative overflow-hidden border-0 shadow-lg transition-all duration-300
        ${isUrgent 
          ? 'bg-gradient-to-r from-red-900/20 to-red-800/20 border-red-500/30 shadow-red-500/10' 
          : isWarning 
            ? 'bg-gradient-to-r from-amber-900/20 to-orange-800/20 border-amber-500/30 shadow-amber-500/10'
            : 'bg-gradient-to-r from-slate-800/20 to-slate-700/20 border-slate-600/30 shadow-slate-500/10'
        }
        hover:shadow-xl hover:shadow-fantasy-crimson/20
      `}>
        {/* Animated background glow */}
        <div className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
          ${isUrgent ? 'bg-red-500/5' : isWarning ? 'bg-amber-500/5' : 'bg-slate-500/5'}
        `} />
        
        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${isUrgent 
                    ? 'bg-red-500/20 text-red-400' 
                    : isWarning 
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-500/20 text-slate-400'
                  }
                `}>
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {service_name}
                  </h3>
                  <p className="text-sm text-slate-400">
                    Expires {endDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <CountdownBadge daysLeft={daysLeft} isUrgent={isUrgent} isWarning={isWarning} />
            </div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onDelete(id)}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${isUrgent 
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20' 
                    : isWarning 
                      ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/20'
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-500/20'
                  }
                `}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
          
          {/* Urgency indicator */}
          {isUrgent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 flex items-center space-x-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20"
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400 font-medium">
                Trial expires today!
              </span>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  )
} 