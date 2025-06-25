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
      curated_trials: {
        Row: {
          id: string
          service_name: string
          trial_length_days: number
          category: string
          geo_availability: string[]
          affiliate_link: string
          sentinel_score: number
          description: string | null
          monthly_price: number | null
          billing_frequency: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_name: string
          trial_length_days: number
          category: string
          geo_availability?: string[]
          affiliate_link: string
          sentinel_score?: number
          description?: string | null
          monthly_price?: number | null
          billing_frequency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_name?: string
          trial_length_days?: number
          category?: string
          geo_availability?: string[]
          affiliate_link?: string
          sentinel_score?: number
          description?: string | null
          monthly_price?: number | null
          billing_frequency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      trial_clicks: {
        Row: {
          id: string
          trial_id: string
          user_id: string | null
          session_id: string
          timestamp: string
          user_agent: string | null
          ip_address: string | null
        }
        Insert: {
          id?: string
          trial_id: string
          user_id?: string | null
          session_id: string
          timestamp?: string
          user_agent?: string | null
          ip_address?: string | null
        }
        Update: {
          id?: string
          trial_id?: string
          user_id?: string | null
          session_id?: string
          timestamp?: string
          user_agent?: string | null
          ip_address?: string | null
        }
      }
    }
  }
} 