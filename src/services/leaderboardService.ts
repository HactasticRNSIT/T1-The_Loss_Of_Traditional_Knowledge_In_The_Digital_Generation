import { supabase } from '../lib/supabase'

export interface LeaderboardEntry {
  id: string
  name: string
  avatar_url?: string | null
  xp_points: number
  level?: number
  streak?: number
}

type ServiceResult<T> = Promise<{ data: T | null; error: string | null }>

const mapError = (error: unknown): string =>
  error instanceof Error ? error.message : 'An unexpected error occurred.'

// Fetches the leaderboard ordered by the highest XP totals.
export const getLeaderboard = async (): ServiceResult<LeaderboardEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, avatar_url, xp_points, level, streak')
      .order('xp_points', { ascending: false })
      .order('level', { ascending: false })

    return { data: data ?? [], error: error ? error.message : null }
  } catch (error) {
    return { data: null, error: mapError(error) }
  }
}