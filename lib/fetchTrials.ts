import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export interface CuratedTrial {
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

export interface TrialFilters {
  category?: string
  geo?: string
  minScore?: number
  maxPrice?: number
}

export async function fetchCuratedTrials(filters?: TrialFilters): Promise<CuratedTrial[]> {
  const supabase = createServerComponentClient({ cookies })
  
  let query = supabase
    .from('curated_trials')
    .select('*')
    .eq('is_active', true)
    .order('sentinel_score', { ascending: false })

  // Apply filters
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.geo) {
    query = query.contains('geo_availability', [filters.geo])
  }

  if (filters?.minScore) {
    query = query.gte('sentinel_score', filters.minScore)
  }

  if (filters?.maxPrice) {
    query = query.lte('monthly_price', filters.maxPrice)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching curated trials:', error)
    return []
  }

  return data || []
}

export async function getTrialCategories(): Promise<string[]> {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('curated_trials')
    .select('category')
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  // Get unique categories
  const categories = Array.from(new Set(data?.map(trial => trial.category) || []))
  return categories.sort()
} 