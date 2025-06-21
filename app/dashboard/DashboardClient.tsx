'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format, differenceInDays } from 'date-fns'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { User } from '@supabase/supabase-js'
import { LogoIcon } from '@/components/ui/Logo'
import { OctopusMascot, OctopusWithMessage, FloatingOctopus } from '@/components/ui/OctopusMascot'
import { Trash2, PlusCircle, LogOut, AlertTriangle, CheckCircle, Clock, Sparkles } from 'lucide-react'

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
    } catch (error) {
      console.error('Error deleting trial:', error)
    } finally {
      setLoading(false)
      setDeletingId(null)
    }
  }

  const getTrialStatus = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const daysLeft = differenceInDays(end, now)

    if (daysLeft < 0) {
      return { text: 'Expired', color: 'text-gray-500', icon: <AlertTriangle className="h-4 w-4 mr-2" /> }
    }
    if (daysLeft <= 1) {
      return { text: 'Expires Today', color: 'text-red-500', icon: <AlertTriangle className="h-4 w-4 mr-2" /> }
    }
    if (daysLeft <= 7) {
      return { text: `Expires in ${daysLeft} days`, color: 'text-yellow-500', icon: <Clock className="h-4 w-4 mr-2" /> }
    }
    return { text: `Expires in ${daysLeft} days`, color: 'text-green-500', icon: <CheckCircle className="h-4 w-4 mr-2" /> }
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning! Ready to protect your trials?"
    if (hour < 18) return "Good afternoon! How are your trials doing?"
    return "Good evening! Time to check on your trials!"
  }

  const getOctopusVariant = () => {
    const urgentTrials = trials.filter(trial => {
      const end = new Date(trial.end_date)
      const now = new Date()
      const daysLeft = differenceInDays(end, now)
      return daysLeft <= 7 && daysLeft >= 0
    }).length

    if (urgentTrials > 0) return 'excited'
    if (trials.length === 0) return 'sleepy'
    return 'happy'
  }

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
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 relative overflow-hidden">
      {/* Floating background octopuses */}
      <FloatingOctopus className="top-20 right-20 opacity-20" />
      <FloatingOctopus className="bottom-40 left-10 opacity-15" />
      <FloatingOctopus className="top-1/2 left-1/3 opacity-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header variants={itemVariants} className="flex justify-between items-center mb-8 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <LogoIcon size="sm" />
            <h1 className="text-2xl font-bold text-white font-outfit">Trial Sentinel</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => router.push('/dashboard/add-trial')}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Trial
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.header>

        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-6 border border-border/50">
            <div className="flex items-center space-x-4">
              <OctopusMascot size="lg" variant={getOctopusVariant()} />
              <div>
                <h2 className="text-xl font-semibold text-white font-outfit">
                  Welcome back, {user.email?.split('@')[0]}! 🎉
                </h2>
                <p className="text-muted-foreground">{getWelcomeMessage()}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-neon-green">{trials.length}</div>
              <div className="text-sm text-muted-foreground">Active Trials</div>
            </div>
          </div>
        </motion.div>

        <main>
          {trials.length === 0 ? (
            <motion.div variants={itemVariants}>
              <Card className="text-center py-20 bg-card/50 border-0 shadow-xl">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <OctopusMascot size="xl" variant="sleepy" />
                  </div>
                  <h2 className="text-2xl font-semibold font-outfit">No Trials Found</h2>
                  <p className="text-muted-foreground mt-2">
                    Your octopus guardian is ready to protect your trials! Add your first one to get started.
                  </p>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => router.push('/dashboard/add-trial')}
                    className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First Trial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {trials.map((trial, index) => {
                const status = getTrialStatus(trial.end_date)
                return (
                  <motion.div
                    key={trial.id}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="flex flex-col justify-between h-full border-0 shadow-xl bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="font-outfit">{trial.service_name}</CardTitle>
                          <OctopusMascot size="sm" variant="default" animated={false} />
                        </div>
                        <CardDescription>
                          Ends on {format(new Date(trial.end_date), 'PPP')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className={`flex items-center text-sm font-medium ${status.color}`}>
                          {status.icon}
                          <span>{status.text}</span>
                        </div>
                      </CardContent>
                      <div className="p-6 pt-0">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => handleDeleteTrial(trial.id)}
                          disabled={loading && deletingId === trial.id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {loading && deletingId === trial.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </main>

        {/* Bottom encouragement */}
        {trials.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <OctopusWithMessage 
              message="Your trials are safe with me! 🐙✨" 
              size="md"
              className="justify-center"
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  )
} 