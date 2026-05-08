import { supabase } from '../lib/supabase'

export interface UserModuleProgress {
  id?: string
  user_id: string
  module_id: string
  progress_percentage: number
  completed_lessons_count?: number
  total_lessons_count?: number
  completed_at?: string | null
  updated_at?: string
  created_at?: string
}

type ServiceResult<T> = Promise<{ data: T | null; error: string | null }>

const mapError = (error: unknown): string =>
  error instanceof Error ? error.message : 'An unexpected error occurred.'

// Returns the current progress for a user on a module.
export const getUserModuleProgress = async (
  userId: string,
  moduleId: string,
): ServiceResult<UserModuleProgress> => {
  try {
    const { data, error } = await supabase
      .from('user_module_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .single()

    return { data: data ?? null, error: error ? error.message : null }
  } catch (error) {
    return { data: null, error: mapError(error) }
  }
}

// Creates or updates the module progress percentage for a user.
export const updateModuleProgress = async (
  progress: UserModuleProgress,
): ServiceResult<UserModuleProgress> => {
  try {
    const { data, error } = await supabase
      .from('user_module_progress')
      .upsert(progress, { onConflict: 'user_id,module_id' })
      .select('*')
      .single()

    return { data: data ?? null, error: error ? error.message : null }
  } catch (error) {
    return { data: null, error: mapError(error) }
  }
}