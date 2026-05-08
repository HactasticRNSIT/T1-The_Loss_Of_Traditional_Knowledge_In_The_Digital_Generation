import { supabase } from '../lib/supabase'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar_url?: string | null
  xp_points: number
  level: number
  streak?: number
  created_at?: string
  updated_at?: string
}

type ServiceResult<T> = Promise<{ data: T | null; error: string | null }>

const mapError = (error: unknown): string =>
  error instanceof Error ? error.message : 'An unexpected error occurred.'

// Fetches a user profile by id.
export const getUserProfile = async (userId: string): ServiceResult<UserProfile> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    return { data: data ?? null, error: error ? error.message : null }
  } catch (error) {
    return { data: null, error: mapError(error) }
  }
}

// Adds XP to a user profile and returns the updated row.
export const updateXP = async (
  userId: string,
  xpDelta: number,
): ServiceResult<UserProfile> => {
  try {
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('id, xp_points')
      .eq('id', userId)
      .single()

    if (fetchError) {
      return { data: null, error: fetchError.message }
    }

    const nextXpPoints = (currentUser?.xp_points ?? 0) + xpDelta

    const { data, error } = await supabase
      .from('users')
      .update({ xp_points: nextXpPoints })
      .eq('id', userId)
      .select('*')
      .single()

    return { data: data ?? null, error: error ? error.message : null }
  } catch (error) {
    return { data: null, error: mapError(error) }
  }
}