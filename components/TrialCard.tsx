'use client'

import { motion } from 'framer-motion'
import { MoreHorizontal, Calendar, CheckCircle, XCircle, Edit } from 'lucide-react'
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
  onEdit: (id: string, updates: { service_name?: string; end_date?: string; cost?: number | null; billing_frequency?: string }) => void
  index: number
}

export function TrialCard({ id, service_name, end_date, cost, billing_frequency, onDelete, onAction, onEdit, index }: TrialCardProps) {
  const [mounted, setMounted] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const dropdownButtonRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null)
  const { formatCurrency } = useCurrency()

  // Edit form state
  const [editForm, setEditForm] = useState({
    service_name: service_name,
    end_date: new Date(end_date).toISOString().split('T')[0], // Format for date input
    cost: cost?.toString() || '',
    billing_frequency: billing_frequency || 'monthly'
  })
  const [editErrors, setEditErrors] = useState<{[key: string]: string}>({})
  const [editLoading, setEditLoading] = useState(false)

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

    const handleScroll = () => {
      if (showDropdown) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside)
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
        document.removeEventListener('click', handleClickOutside)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [showDropdown])

  // When showing dropdown, calculate position
  useEffect(() => {
    if (showDropdown && dropdownButtonRef.current) {
      const rect = dropdownButtonRef.current.getBoundingClientRect()
      const dropdownWidth = 192 // w-48 = 12rem = 192px
      const dropdownHeight = 120 // Increased height for 3 menu items
      
      // Check if dropdown would go off the right edge
      let left = rect.left
      if (left + dropdownWidth > window.innerWidth) {
        left = window.innerWidth - dropdownWidth - 8
      }
      
      // Check if dropdown would go off the bottom edge
      let top = rect.bottom + 8
      if (top + dropdownHeight > window.innerHeight) {
        // Position above the button instead
        top = rect.top - dropdownHeight - 8
      }
      
      setDropdownPosition({
        top: Math.max(8, top), // Ensure it doesn't go off the top
        left: Math.max(8, left), // Ensure it doesn't go off the left
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

  // Edit form validation
  const validateEditForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!editForm.service_name.trim()) {
      errors.service_name = 'Service name is required'
    }
    
    if (!editForm.end_date) {
      errors.end_date = 'End date is required'
    } else {
      const selectedDate = new Date(editForm.end_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        errors.end_date = 'End date cannot be in the past'
      }
    }
    
    if (editForm.cost && parseFloat(editForm.cost) < 0) {
      errors.cost = 'Cost cannot be negative'
    }
    
    setEditErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle edit form submission
  const handleEditSubmit = async () => {
    if (!validateEditForm()) return
    
    setEditLoading(true)
    try {
      const updates = {
        service_name: editForm.service_name.trim(),
        end_date: new Date(editForm.end_date).toISOString(),
        cost: editForm.cost ? parseFloat(editForm.cost) : null,
        billing_frequency: editForm.billing_frequency
      }
      
      await onEdit(id, updates)
      setShowEditModal(false)
      setShowDropdown(false)
    } catch (error) {
      console.error('Error updating trial:', error)
    } finally {
      setEditLoading(false)
    }
  }

  // Reset edit form when modal opens
  const handleEditClick = () => {
    setEditForm({
      service_name: service_name,
      end_date: new Date(end_date).toISOString().split('T')[0],
      cost: cost?.toString() || '',
      billing_frequency: billing_frequency || 'monthly'
    })
    setEditErrors({})
    setShowEditModal(true)
    setShowDropdown(false)
  }

  if (!mounted) {
    return (
      <div className="w-full">
        <Card className="relative overflow-hidden border-0 shadow-lg transition-all duration-300 bg-slate-800/20 border-slate-600/30 shadow-slate-500/10">
          <div className="relative p-3 md:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center bg-slate-500/20 text-slate-400 flex-shrink-0">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-semibold text-white truncate">
                      {service_name}
                    </h3>
                      <p className="text-xs md:text-sm text-slate-400">
                      Loading...
                    </p>
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center space-x-1.5 md:space-x-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium bg-slate-500/20 border border-slate-500/30 text-slate-300">
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
        
        <div className="relative p-3 md:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                  <div className={`
                    w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isUrgent 
                      ? 'bg-red-500/20 text-red-400' 
                      : isWarning 
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }
                  `}>
                    <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-white truncate">
                      {service_name}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400">
                      {daysLeft < 0 ? 'Expired' : 'Expires'} {(() => {
                        const date = new Date(endDate)
                        const options: Intl.DateTimeFormatOptions = {
                          weekday: daysLeft <= 7 ? 'short' : 'long', 
                          year: 'numeric', 
                          month: daysLeft <= 7 ? 'short' : 'long', 
                          day: 'numeric',
                          timeZone: 'UTC' // Use UTC to ensure consistency
                        }
                        return date.toLocaleDateString('en-US', options)
                      })()}
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
                
                {/* Action button moved to right side */}
                <div className="flex-shrink-0 ml-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
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
                                onClick={handleEditClick}
                                className="w-full flex items-center px-4 py-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Trial
                              </button>
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
                </div>
              </div>
              
              <CountdownBadge daysLeft={daysLeft} isUrgent={isUrgent} isWarning={isWarning} />
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Modal */}
      {showEditModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100001] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-slate-600 rounded-xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Edit Trial</h3>
              
              <div className="space-y-4">
                {/* Service Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={editForm.service_name}
                    onChange={(e) => {
                      setEditForm(prev => ({ ...prev, service_name: e.target.value }))
                      if (editErrors.service_name) {
                        setEditErrors(prev => ({ ...prev, service_name: '' }))
                      }
                    }}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      editErrors.service_name ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="Enter service name"
                  />
                  {editErrors.service_name && (
                    <p className="text-red-400 text-sm mt-1">{editErrors.service_name}</p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={editForm.end_date}
                    onChange={(e) => {
                      setEditForm(prev => ({ ...prev, end_date: e.target.value }))
                      if (editErrors.end_date) {
                        setEditErrors(prev => ({ ...prev, end_date: '' }))
                      }
                    }}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      editErrors.end_date ? 'border-red-500' : 'border-slate-600'
                    }`}
                  />
                  {editErrors.end_date && (
                    <p className="text-red-400 text-sm mt-1">{editErrors.end_date}</p>
                  )}
                </div>

                {/* Cost */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Monthly Cost (optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.cost}
                    onChange={(e) => {
                      setEditForm(prev => ({ ...prev, cost: e.target.value }))
                      if (editErrors.cost) {
                        setEditErrors(prev => ({ ...prev, cost: '' }))
                      }
                    }}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      editErrors.cost ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="0.00"
                  />
                  {editErrors.cost && (
                    <p className="text-red-400 text-sm mt-1">{editErrors.cost}</p>
                  )}
                </div>

                {/* Billing Frequency */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Billing Frequency
                  </label>
                  <select
                    value={editForm.billing_frequency}
                    onChange={(e) => {
                      setEditForm(prev => ({ ...prev, billing_frequency: e.target.value as 'weekly' | 'fortnightly' | 'monthly' | 'yearly' }))
                      if (editErrors.billing_frequency) {
                        setEditErrors(prev => ({ ...prev, billing_frequency: '' }))
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="fortnightly">Fortnightly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                  disabled={editLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  disabled={editLoading}
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </motion.div>
  )
} 