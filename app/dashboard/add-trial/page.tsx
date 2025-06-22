'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { OctopusMascot, FloatingOctopus } from '@/components/ui/OctopusMascot'
import { ArrowLeft, Plus, Shield, Clock, Zap } from 'lucide-react'

export default function AddTrialPage() {
  const [serviceName, setServiceName] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('Form submitted:', { serviceName, endDate })
    
    // Test environment variables
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      console.log('User check:', { user, userError })

      if (userError) {
        console.error('User error:', userError)
        setError('Authentication error: ' + userError.message)
        return
      }

      if (!user) {
        console.log('No user found, redirecting to login')
        router.push('/login')
        return
      }

      console.log('Inserting trial for user:', user.id)

      // Insert the trial
      const { data, error } = await supabase.from('trials').insert({
        user_id: user.id,
        service_name: serviceName,
        end_date: endDate,
      })

      if (error) {
        setError(error.message || 'Database error occurred')
      } else {
        // Refresh the dashboard data and redirect
        router.refresh()
        // Small delay to ensure refresh completes
        setTimeout(() => {
          router.push('/dashboard')
        }, 100)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setError('An unexpected error occurred: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
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
        ease: "easeOut" as const
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Floating background octopuses */}
      <FloatingOctopus className="top-20 right-20 opacity-20" />
      <FloatingOctopus className="bottom-40 left-10 opacity-15" />
      <FloatingOctopus className="top-1/2 left-1/3 opacity-10" />

      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back button */}
        <motion.div variants={itemVariants} className="mb-6">
          <Button
            variant="secondary"
            onClick={() => router.push('/dashboard')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-4 text-center">
              <div className="flex justify-center mb-4">
                <OctopusMascot size="lg" variant="excited" />
              </div>
              <CardTitle className="text-2xl font-outfit">Add New Trial</CardTitle>
              <CardDescription>
                Let your octopus guardian watch over this trial for you! 🐙✨
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Input
                    label="Service Name"
                    type="text"
                    placeholder="e.g., Netflix, Spotify, Adobe Creative Suite"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Input
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                  >
                    <p className="text-sm text-destructive">{error}</p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3"
                >
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => router.push('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-neon-green to-emerald-500 hover:from-emerald-500 hover:to-neon-green text-white" 
                    disabled={loading}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Trial
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature highlights */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 grid grid-cols-1 gap-4"
        >
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-800/30 border border-border/50">
            <div className="w-10 h-10 bg-neon-green/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <p className="font-medium text-sm">Smart Protection</p>
              <p className="text-xs text-muted-foreground">Automated monitoring and alerts</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-800/30 border border-border/50">
            <div className="w-10 h-10 bg-neon-blue/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-neon-blue" />
            </div>
            <div>
              <p className="font-medium text-sm">Timely Reminders</p>
              <p className="text-xs text-muted-foreground">Never miss an expiration date</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-800/30 border border-border/50">
            <div className="w-10 h-10 bg-neon-purple/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-neon-purple" />
            </div>
            <div>
              <p className="font-medium text-sm">Instant Notifications</p>
              <p className="text-xs text-muted-foreground">Real-time updates and alerts</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 