import { supabase } from '../lib/supabase'

export interface LearningModule {
  id: string
  title: string
  description: string
  difficulty: string
  xp_reward: number
  created_at?: string
  updated_at?: string
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  content: string
  order_index?: number
  created_at?: string
  updated_at?: string
}

export interface Quiz {
  id: string
  module_id: string
  title: string
  passing_score?: number
  created_at?: string
  updated_at?: string
}

type ServiceResult<T> = Promise<{ data: T | null; error: string | null }>

const mapError = (error: unknown): string =>
  error instanceof Error ? error.message : 'An unexpected error occurred.'

// Fetches every learning module for the home page module list.
export const getAllModules = async (): ServiceResult<LearningModule[]> => {
  try {
    const { data, error } = await supabase
      .from('learning_modules')
      .select('*')
      .order('created_at', { ascending: false })

    return { data: data ?? [], error: error ? error.message : null }
  } catch (error) {
    return { data: null, error: mapError(error) }
  }
}

// Fetches a single module by id for the module details page.
export const getModuleById = async (moduleId: string): ServiceResult<LearningModule> => {
  try {
    const { data, error } = await supabase
      .from('learning_modules')
      .select('*')
      .eq('id', moduleId)
      .single()

    return { data: data ?? null, error: error ? error.message : null }
  } catch (error) {
    return { data: null, error: mapError(error) }
  }
}

// Fetches all lessons that belong to a module.
export const getModuleLessons = async (moduleId: string): ServiceResult<Lesson[]> => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index', { ascending: true })

    return { data: data ?? [], error: error ? error.message : null }
  } catch (error) {
    return { data: null, error: mapError(error) }
  }
}

// Fetches all quizzes that belong to a module.
export const getModuleQuizzes = async (moduleId: string): ServiceResult<Quiz[]> => {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('module_id', moduleId)
      .order('created_at', { ascending: false })

    return { data: data ?? [], error: error ? error.message : null }
  } catch (error) {
    return { data: null, error: mapError(error) }
  }
}