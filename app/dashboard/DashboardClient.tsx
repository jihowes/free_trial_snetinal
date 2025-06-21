'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format, differenceInDays } from 'date-fns'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { User } from '@supabase/supabase-js'
import { LogoIcon } from '@/components/ui/Logo'
import { Trash2, PlusCircle, LogOut, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

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

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <LogoIcon size="sm" />
          <h1 className="text-2xl font-bold text-white">Trial Sentinel</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => router.push('/dashboard/add-trial')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Trial
          </Button>
          <Button variant="secondary" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main>
        {trials.length === 0 ? (
          <Card className="text-center py-20 bg-card/50">
            <CardHeader>
              <h2 className="text-2xl font-semibold">No Trials Found</h2>
              <p className="text-muted-foreground mt-2">
                You haven't added any trials yet. Get started by adding your first one.
              </p>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/dashboard/add-trial')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your First Trial
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trials.map((trial) => {
              const status = getTrialStatus(trial.end_date)
              return (
                <Card key={trial.id} className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle>{trial.service_name}</CardTitle>
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
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
} 