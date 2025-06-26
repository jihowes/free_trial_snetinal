'use client'

import { motion } from 'framer-motion'
import { MoreHorizontal, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { CountdownBadge } from './CountdownBadge'
import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useCurrency } from './CurrencyContext'
import { calculateDaysLeft } from '@/lib/dateUtils'

interface TrialCardProps {
  id: string
  service_name: string
  end_date: string
  cost?: number | null
  billing_frequency?: 'weekly' | 'fortnightly' | 'monthly' | 'yearly'
  onDelete: (id: string) => void
  onAction: (id: string, action: 'kept' | 'cancelled') => void
  index: number
}

export function TrialCard({ id, service_name, end_date, cost, billing_frequency, onDelete, onAction, index }: TrialCardProps) {
  const [mounted, setMounted] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownButtonRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null)
  const { formatCurrency } = useCurrency()

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

  // When showing dropdown, calculate position
  useEffect(() => {
    if (showDropdown && dropdownButtonRef.current) {
      const rect = dropdownButtonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px margin
        left: rect.left + window.scrollX,
      })
    }
  }, [showDropdown])

  const endDate = new Date(end_date)
  const daysLeft = calculateDaysLeft(end_date)
  
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
        relative overflow-hidden border-0 shadow-lg transition-all duration-300 z-0
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
                <div className="flex flex-col items-center justify-center mr-2 min-w-[40px]">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="mb-1"
                  >
                    {isExpired ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onDelete(id)}
                        className="p-1 rounded-full transition-all duration-200 text-slate-400 hover:text-slate-300 hover:bg-slate-500/20 bg-slate-800/80 border border-slate-600/50"
                        title="Delete trial"
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    ) : (
                      <div ref={dropdownButtonRef} className="relative">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowDropdown(!showDropdown)}
                          className={`
                            p-1 rounded-full transition-all duration-200 bg-slate-800/80 border border-slate-600/50
                            ${isUrgent 
                              ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20' 
                              : isWarning 
                                ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/20'
                                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-500/20'
                            }
                          `}
                          title="Action trial"
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                        {/* Dropdown rendered via portal */}
                        {showDropdown && dropdownPosition && createPortal(
                          <div
                            className="fixed w-48 bg-slate-900 bg-opacity-100 border-2 border-slate-600 rounded-lg shadow-2xl z-[100000]"
                            style={{
                              top: dropdownPosition.top,
                              left: dropdownPosition.left,
                              backgroundColor: '#0f172a',
                              opacity: 1,
                            }}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => {
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
                                  onAction(id, 'cancelled')
                                  setShowDropdown(false)
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Mark as Cancelled
                              </button>
                            </div>
                          </div>,
                          document.body
                        )}
                      </div>
                    )}
                  </motion.div>
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
                  {/* Potential savings indicator */}
                  {cost && cost > 0 && daysLeft >= 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-slate-500">
                        {typeof formatCurrency === 'function' ? formatCurrency(cost) : `$${cost.toFixed(2)}`}/{billing_frequency || 'month'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <CountdownBadge daysLeft={daysLeft} isUrgent={isUrgent} isWarning={isWarning} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
} 