import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './supabase'

export const createServerSupabaseClient = () =>
  createServerComponentClient<Database>({ cookies })

export const createClientSupabaseClient = () => {
  const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs')
  return createClientComponentClient<Database>()
} 