import { supabase } from '../lib/supabase'

export interface Achievement {
  id: string
  title: string
  description: string
  xp_reward?: number
  created_at?: string
  updated_at?: string
}

export interface UserAchievement {
  id?: string
  user_id: string
  achievement_id: string
  unlocked_at: string
  created_at?: string
  updated_at?: string
}

type ServiceResult<T> = Promise<{ data: T | null; error: string | null }>

const mapError = (error: unknown): string =>
  error instanceof Error ? error.message : 'An unexpected error occurred.'

// Fetches all available achievements for the gamification layer.
export const getAchievements = async (): ServiceResult<Achievement[]> => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: false })

    return { data: data ?? [], error: error ? error.message : null }
  } catch (error) {
    return { data: null, error: mapError(error) }
  }
}

// Unlocks an achievement for a user and stores the unlock timestamp.
export const unlockAchievement = async (
  userAchievement: Omit<UserAchievement, 'unlocked_at'>,
): ServiceResult<UserAchievement> => {
  try {
    const payload: UserAchievement = {
      ...userAchievement,
      unlocked_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('user_achievements')
      .insert(payload)
      .select('*')
      .single()

    return { data: data ?? null, error: error ? error.message : null }
  } catch (error) {
    return { data: null, error: mapError(error) }
  }
}