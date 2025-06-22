'use client'

import { motion } from 'framer-motion'
import { MoreHorizontal, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { CountdownBadge } from './CountdownBadge'
import { useEffect, useState } from 'react'

interface TrialCardProps {
  id: string
  service_name: string
  end_date: string
  onDelete: (id: string) => void
  onAction: (id: string, action: 'kept' | 'cancelled') => void
  index: number
}

export function TrialCard({ id, service_name, end_date, onDelete, onAction, index }: TrialCardProps) {
  const [mounted, setMounted] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showDropdown])

  const endDate = new Date(end_date)
  const now = new Date()
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  const isUrgent = daysLeft <= 1
  const isWarning = daysLeft <= 7 && daysLeft > 1
  const isExpired = daysLeft < 0

  // Pulse if expiring in next 3 days or expired in last 7 days
  const shouldPulse = (daysLeft >= 0 && daysLeft <= 2) || (daysLeft < 0 && daysLeft >= -7)

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
                    {daysLeft < 0 ? 'Expired' : 'Expires'} {endDate.toLocaleDateString('en-US', { 
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
              {isExpired ? (
                // Show delete button for expired trials
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onDelete(id)}
                  className="p-2 rounded-lg transition-all duration-200 text-slate-400 hover:text-slate-300 hover:bg-slate-500/20"
                  title="Delete trial"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              ) : (
                // Show action dropdown for active trials
                <div className="relative">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`
                      p-2 rounded-lg transition-all duration-200
                      ${isUrgent 
                        ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20' 
                        : isWarning 
                          ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/20'
                          : 'text-slate-400 hover:text-slate-300 hover:bg-slate-500/20'
                      }
                    `}
                    title="Action trial"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  
                  {/* Custom Dropdown */}
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-50">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            console.log('Marking trial as kept:', id)
                            onAction(id, 'kept')
                            setShowDropdown(false)
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-green-400 hover:text-green-300 hover:bg-green-500/20 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Kept
                        </button>
                        <button
                          onClick={() => {
                            console.log('Marking trial as cancelled:', id)
                            onAction(id, 'cancelled')
                            setShowDropdown(false)
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Mark as Cancelled
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
} 