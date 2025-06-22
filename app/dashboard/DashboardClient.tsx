'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { User } from '@supabase/supabase-js'
import { LogoIcon } from '@/components/ui/Logo'
import { LogOut, Plus, Search, Filter, RefreshCw, Trash2 } from 'lucide-react'
import FantasyBackgroundWrapper from '@/components/FantasyBackgroundWrapper'
import { DashboardHeader } from '@/components/DashboardHeader'
import { TrialCard } from '@/components/TrialCard'
import { EmptyState } from '@/components/EmptyState'
import { TrialOutcomeModal } from '@/components/TrialOutcomeModal'

interface Trial {
  id: string
  service_name: string
  end_date: string
  outcome?: 'active' | 'kept' | 'cancelled' | 'expired'
}

interface DashboardClientProps {
  trials: Trial[]
  user: User
}

export default function DashboardClient({ trials, user }: DashboardClientProps) {
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState<'all' | 'expiring'>('all')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showOutcomeModal, setShowOutcomeModal] = useState(false)
  const [expiredTrial, setExpiredTrial] = useState<Trial | null>(null)
  const [processedTrials, setProcessedTrials] = useState<Set<string>>(new Set())
  const [currentTrials, setCurrentTrials] = useState<Trial[]>(trials)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [refreshing, setRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Refresh trial data periodically and when date changes
  useEffect(() => {
    const refreshTrials = async () => {
      try {
        setRefreshing(true)
        const { data: freshTrials, error } = await supabase
          .from('trials')
          .select('*')
          .eq('user_id', user.id)
          .order('end_date', { ascending: true })
        
        if (!error && freshTrials) {
          setCurrentTrials(freshTrials)
          setLastUpdated(new Date())
        }
      } catch (error) {
        console.error('Error refreshing trials:', error)
      } finally {
        setRefreshing(false)
      }
    }

    // Refresh immediately
    refreshTrials()

    // Set up periodic refresh (every 2 minutes for more frequent updates)
    const interval = setInterval(refreshTrials, 2 * 60 * 1000)

    // Set up daily refresh at midnight
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const timeUntilMidnight = tomorrow.getTime() - now.getTime()

    const midnightTimeout = setTimeout(() => {
      refreshTrials()
      // After first midnight refresh, set up daily interval
      setInterval(refreshTrials, 24 * 60 * 60 * 1000)
    }, timeUntilMidnight)

    return () => {
      clearInterval(interval)
      clearTimeout(midnightTimeout)
    }
  }, [user.id, supabase])

  // Update currentTrials when props change
  useEffect(() => {
    setCurrentTrials(trials)
  }, [trials])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleDeleteTrial = async (trialId: string) => {
    setLoading(true)
    setDeletingId(trialId)
    try {
      await supabase.from('trials').delete().eq('id', trialId)
      router.refresh()
      showToastMessage('Trial deleted successfully!')
    } catch (error) {
      console.error('Error deleting trial:', error)
      showToastMessage('Failed to delete trial. Please try again.')
    } finally {
      setLoading(false)
      setDeletingId(null)
    }
  }

  const handleDeleteFromGraveyard = async (trialId: string) => {
    setLoading(true)
    setDeletingId(trialId)
    try {
      await supabase.from('trials').delete().eq('id', trialId)
      router.refresh()
      showToastMessage('Trial permanently deleted!')
    } catch (error) {
      console.error('Error deleting trial:', error)
      showToastMessage('Failed to delete trial. Please try again.')
    } finally {
      setLoading(false)
      setDeletingId(null)
    }
  }

  const handleActionTrial = async (trialId: string, action: 'kept' | 'cancelled') => {
    setLoading(true)
    try {
      await supabase
        .from('trials')
        .update({ outcome: action })
        .eq('id', trialId)
      
      showToastMessage(`Trial marked as ${action}`)
      
      // Refresh after a short delay
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (error) {
      console.error('Error updating trial outcome:', error)
      showToastMessage('Failed to update trial outcome. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // Check for expired trials that need outcome input
  useEffect(() => {
    try {
      const now = new Date()
      const expiredTrials = currentTrials.filter(trial => {
        const endDate = new Date(trial.end_date)
        return endDate < now && trial.outcome === 'active' && !processedTrials.has(trial.id)
      })
      
      // Only show modal if we have expired trials, modal is not currently open, and we don't already have an expired trial set
      if (expiredTrials.length > 0 && !showOutcomeModal && !expiredTrial) {
        console.log('Found expired trial:', expiredTrials[0])
        setExpiredTrial(expiredTrials[0])
        setShowOutcomeModal(true)
      }
    } catch (error) {
      console.error('Error in expired trials check:', error)
    }
  }, [currentTrials, showOutcomeModal, expiredTrial, processedTrials])

  const handleOutcomeSelect = async (trialId: string, outcome: 'kept' | 'cancelled' | 'expired') => {
    try {
      await supabase
        .from('trials')
        .update({ outcome })
        .eq('id', trialId)
      
      // Add trial to processed set to prevent modal from showing again
      setProcessedTrials(prev => new Set([...Array.from(prev), trialId]))
      
      // Close the modal immediately
      setShowOutcomeModal(false)
      setExpiredTrial(null)
      
      showToastMessage(`Trial marked as ${outcome}`)
      
      // Refresh after a short delay to avoid modal reappearing
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (error) {
      console.error('Error updating trial outcome:', error)
      showToastMessage('Failed to update trial outcome. Please try again.')
    }
  }

  // Filter and sort trials
  const filteredAndSortedTrials = currentTrials
    .filter(trial => {
      // Only show active trials (not actioned ones)
      const isActive = trial.outcome === 'active' || trial.outcome === null || trial.outcome === undefined
      if (!isActive) return false
      
      // Search filter
      const matchesSearch = trial.service_name.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Status filter
      let matchesFilter = true
      const now = new Date()
      const daysLeft = Math.ceil((new Date(trial.end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      switch (filterBy) {
        case 'expiring':
          matchesFilter = daysLeft <= 7 && daysLeft > 0
          break
        case 'all':
        default:
          matchesFilter = true
          break
      }
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      // Always sort by days to expiry (soonest first)
      const now = new Date()
      const daysLeftA = Math.ceil((new Date(a.end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const daysLeftB = Math.ceil((new Date(b.end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysLeftA - daysLeftB
    })

  // Get next expiring trial for header
  const nextExpiringTrial = currentTrials.length > 0 ? (() => {
    const sorted = [...currentTrials].sort((a, b) => 
      new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
    )
    const next = sorted[0]
    const daysLeft = Math.ceil(
      (new Date(next.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    return { service_name: next.service_name, daysLeft }
  })() : undefined

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  }

  // Manual refresh function
  const handleManualRefresh = async () => {
    try {
      setRefreshing(true)
      const { data: freshTrials, error } = await supabase
        .from('trials')
        .select('*')
        .eq('user_id', user.id)
        .order('end_date', { ascending: true })
      
      if (!error && freshTrials) {
        setCurrentTrials(freshTrials)
        setLastUpdated(new Date())
        showToastMessage('Trials refreshed!')
      }
    } catch (error) {
      console.error('Error refreshing trials:', error)
      showToastMessage('Failed to refresh trials')
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <FantasyBackgroundWrapper showEmbers={true} showEyeGlow={true} showFloatingEye={true}>
      <div className="min-h-screen bg-gradient-to-br from-fantasy-obsidian via-fantasy-charcoal to-fantasy-shadow">
        <div className="w-full max-w-[1400px] mx-auto p-4 md:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.header variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-3 border-b border-slate-700/50 mt-2">
              <div className="flex items-center gap-4 mb-3 md:mb-0">
                <LogoIcon size="xl" />
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => router.push('/dashboard/add-trial')}
                  className="bg-gradient-to-r from-fantasy-crimson to-fantasy-molten hover:from-fantasy-molten hover:to-fantasy-crimson text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-fantasy-crimson/25"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Trial
                </Button>
                <Button 
                  variant="secondary"
                  onClick={handleManualRefresh}
                  disabled={refreshing}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </motion.header>

            {/* Dashboard Header with greeting and stats */}
            <DashboardHeader 
              userName={user.email?.split('@')[0] || 'User'}
              totalTrials={currentTrials.length}
              trials={currentTrials}
              nextExpiringTrial={nextExpiringTrial}
            />

            {/* Search and Sort Controls */}
            {currentTrials.length > 0 && (
              <motion.div 
                variants={itemVariants}
                className="mb-6 space-y-4"
              >
                {/* Filter Toggle */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'expiring', label: 'Expiring Soon' }
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setFilterBy(filter.key as any)}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${filterBy === filter.key 
                          ? 'bg-fantasy-crimson text-white shadow-lg' 
                          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white border border-slate-700/50'
                        }
                      `}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search trials..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fantasy-crimson/50 focus:border-fantasy-crimson/50"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Main Content */}
            <main className="space-y-8">
              <AnimatePresence mode="wait">
                {currentTrials.length === 0 ? (
                  <EmptyState key="empty" />
                ) : filteredAndSortedTrials.length === 0 ? (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-16"
                  >
                    <div className="text-slate-400 mb-4">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold text-white mb-2">No trials found</h3>
                      <p>Try adjusting your search terms or filters</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="trials-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                  >
                    <AnimatePresence>
                      {filteredAndSortedTrials.map((trial, index) => (
                        <TrialCard
                          key={trial.id}
                          id={trial.id}
                          service_name={trial.service_name}
                          end_date={trial.end_date}
                          onDelete={handleDeleteTrial}
                          onAction={handleActionTrial}
                          index={index}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trial Outcome History (Graveyard) */}
              {(() => {
                const actionedTrials = currentTrials.filter(trial => 
                  trial.outcome === 'kept' || trial.outcome === 'cancelled' || trial.outcome === 'expired'
                )
                
                if (actionedTrials.length > 0) {
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="border-t border-slate-700/50 pt-8"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                          <span>🪦</span>
                          Trial Graveyard
                        </h2>
                        <span className="text-slate-400 text-sm">
                          {actionedTrials.length} actioned trial{actionedTrials.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {actionedTrials.map((trial, index) => {
                          const status = trial.outcome || 'unknown'
                          const statusConfig = {
                            active: { icon: '⏳', label: 'Active', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
                            cancelled: { icon: '✅', label: 'Cancelled', color: 'text-green-400', bgColor: 'bg-green-500/20' },
                            expired: { icon: '⏰', label: 'Past Expiry', color: 'text-red-400', bgColor: 'bg-red-500/20' },
                            kept: { icon: '💰', label: 'Kept', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
                            unknown: { icon: '❓', label: 'Unknown', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' }
                          }
                          const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unknown
                          
                          return (
                            <motion.div
                              key={trial.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1, duration: 0.4 }}
                              className="p-4 rounded-lg border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-white text-sm">{trial.service_name}</h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{config.icon}</span>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleDeleteFromGraveyard(trial.id)}
                                    className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                    title="Permanently delete trial"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs px-2 py-1 rounded-full ${config.bgColor} ${config.color}`}>
                                  {config.label}
                                </span>
                                <span className="text-xs text-slate-400">
                                  {new Date(trial.end_date).toLocaleDateString()}
                                </span>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )
                }
                return null
              })()}

              {/* Coming Soon Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="border-t border-slate-700/50 pt-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span>🚀</span>
                    Coming Soon
                  </h2>
                  <span className="text-slate-400 text-sm">Future Enhancements</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: '📧', title: 'Gmail Inbox Sync', description: 'Auto-detect trial emails' },
                    { icon: '📅', title: 'Calendar Reminders', description: 'Smart notification system' },
                    { icon: '🧠', title: 'Smart Suggestions', description: 'AI-powered recommendations' },
                    { icon: '🤖', title: 'Auto-Cancel Assist', description: 'One-click trial cancellation' }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                      className="p-4 rounded-lg border border-slate-700/50 bg-slate-800/20 backdrop-blur-sm hover:bg-slate-800/40 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{feature.icon}</span>
                        <div>
                          <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                          <span className="text-xs text-slate-400">{feature.description}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 rounded-full bg-fantasy-crimson/20 text-fantasy-crimson">
                          Coming Soon
                        </span>
                        <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                          🔒
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </main>
          </motion.div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 shadow-lg z-50"
          >
            <p className="text-white text-sm">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trial Outcome Modal */}
      {expiredTrial && expiredTrial.id && expiredTrial.service_name && expiredTrial.end_date && (
        <TrialOutcomeModal
          isOpen={showOutcomeModal}
          onClose={() => {
            setShowOutcomeModal(false)
            setExpiredTrial(null)
          }}
          trial={expiredTrial}
          onOutcomeSelect={handleOutcomeSelect}
        />
      )}
    </FantasyBackgroundWrapper>
  )
} 