'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function TestSupabasePage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testSupabase = async () => {
    setLoading(true)
    setResults([])
    
    try {
      // Test 1: Environment variables
      addResult(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET'}`)
      addResult(`Supabase Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}`)
      
      // Test 2: Get user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      addResult(`User: ${user ? user.id : 'NO USER'}`)
      if (userError) addResult(`User Error: ${userError.message}`)
      
      // Test 3: Test table access
      const { data: tableData, error: tableError } = await supabase
        .from('trials')
        .select('count')
        .limit(1)
      
      addResult(`Table access: ${tableError ? 'FAILED' : 'SUCCESS'}`)
      if (tableError) addResult(`Table Error: ${JSON.stringify(tableError)}`)
      
      // Test 4: Try insert
      if (user) {
        const { data: insertData, error: insertError } = await supabase
          .from('trials')
          .insert({
            user_id: user.id,
            service_name: 'Test Service',
            end_date: '2025-06-20'
          })
          .select()
        
        addResult(`Insert: ${insertError ? 'FAILED' : 'SUCCESS'}`)
        if (insertError) {
          addResult(`Insert Error: ${JSON.stringify(insertError)}`)
        } else {
          addResult(`Inserted ID: ${insertData?.[0]?.id}`)
        }
      }
      
    } catch (error) {
      addResult(`Exception: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Supabase Test Page</h1>
        
        <button 
          onClick={testSupabase}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
        >
          {loading ? 'Testing...' : 'Run Tests'}
        </button>
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Results:</h2>
          {results.map((result, index) => (
            <div key={index} className="text-sm font-mono mb-1">
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 