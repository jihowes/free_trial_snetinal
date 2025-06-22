'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function DebugAuthPage() {
  const [authInfo, setAuthInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        setAuthInfo({
          user,
          session,
          supabaseUrl: supabase.supabaseUrl,
          userError,
          sessionError
        })
      } catch (error) {
        setAuthInfo({ error: error })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Auth Debug Info</h1>
        
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="font-bold mb-2">Current Supabase Project:</h2>
          <p className="font-mono text-sm">{authInfo?.supabaseUrl}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="font-bold mb-2">Current User:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(authInfo?.user, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="font-bold mb-2">Session:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(authInfo?.session, null, 2)}
          </pre>
        </div>

        {authInfo?.user && (
          <button 
            onClick={signOut}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  )
} 