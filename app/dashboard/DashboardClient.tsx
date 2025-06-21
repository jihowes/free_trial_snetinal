'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { User } from '@supabase/supabase-js'
import { LogoIcon } from '@/components/ui/Logo'
import { LogOut, Plus, Search, Filter } from 'lucide-react'
import FantasyBackgroundWrapper from '@/components/FantasyBackgroundWrapper'
import { DashboardHeader } from '@/components/DashboardHeader'
import { TrialCard } from '@/components/TrialCard'
import { EmptyState } from '@/components/EmptyState'

interface Trial {
  id: string
  service_name: string
  end_date: string
}

interface DashboardClientProps {
  trials: Trial[]
  user: User
}

export default function DashboardClient({ trials, user }: DashboardClientProps) {
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'expiry' | 'name'>('expiry')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

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

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // Filter and sort trials
  const filteredAndSortedTrials = trials
    .filter(trial => 
      trial.service_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'expiry') {
        return new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
      } else {
        return a.service_name.localeCompare(b.service_name)
      }
    })

  // Get next expiring trial for header
  const nextExpiringTrial = trials.length > 0 ? (() => {
    const sorted = [...trials].sort((a, b) => 
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

  return (
    <FantasyBackgroundWrapper showEmbers={true} showEyeGlow={true} showFloatingEye={true}>
      <div className="min-h-screen bg-gradient-to-br from-fantasy-obsidian via-fantasy-charcoal to-fantasy-shadow">
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
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
              totalTrials={trials.length}
              nextExpiringTrial={nextExpiringTrial}
            />

            {/* Search and Sort Controls */}
            {trials.length > 0 && (
              <motion.div 
                variants={itemVariants}
                className="mb-6 flex flex-col sm:flex-row gap-4"
              >
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
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'expiry' | 'name')}
                  className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fantasy-crimson/50 focus:border-fantasy-crimson/50"
                >
                  <option value="expiry">Sort by Expiry</option>
                  <option value="name">Sort by Name</option>
                </select>
              </motion.div>
            )}

            {/* Main Content */}
            <main>
              <AnimatePresence mode="wait">
                {trials.length === 0 ? (
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
                      <p>Try adjusting your search terms</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="trials-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    <AnimatePresence>
                      {filteredAndSortedTrials.map((trial, index) => (
                        <TrialCard
                          key={trial.id}
                          id={trial.id}
                          service_name={trial.service_name}
                          end_date={trial.end_date}
                          onDelete={handleDeleteTrial}
                          index={index}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
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
    </FantasyBackgroundWrapper>
  )
} 