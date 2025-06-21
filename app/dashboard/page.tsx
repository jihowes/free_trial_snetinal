import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: trials } = await supabase
    .from('trials')
    .select('*')
    .eq('user_id', user.id)
    .order('end_date', { ascending: true })

  return <DashboardClient trials={trials || []} user={user} />
} 