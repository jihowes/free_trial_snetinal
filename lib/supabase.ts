import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      trials: {
        Row: {
          id: string
          user_id: string
          service_name: string
          end_date: string
          outcome: string
          created_at: string
          last_notified: string | null
        }
        Insert: {
          id?: string
          user_id: string
          service_name: string
          end_date: string
          outcome?: string
          created_at?: string
          last_notified?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          service_name?: string
          end_date?: string
          outcome?: string
          created_at?: string
          last_notified?: string | null
        }
      }
    }
  }
} 