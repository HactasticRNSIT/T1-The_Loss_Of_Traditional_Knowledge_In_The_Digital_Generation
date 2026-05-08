import { supabase } from '../lib/supabase'

export interface Quiz {
  id: string
  module_id: string
  title: string
  passing_score?: number
  created_at?: string
  updated_at?: string
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question: string
  options?: string[] | null
  correct_answer?: string
  order_index?: number
  created_at?: string
  updated_at?: string
}

export interface QuizResult {
  id?: string
  user_id: string
  quiz_id: string
  score: number
  total_questions: number
  passed: boolean
  created_at?: string
  updated_at?: string
}

type ServiceResult<T> = Promise<{ data: T | null; error: string | null }>

const mapError = (error: unknown): string =>
  error instanceof Error ? error.message : 'An unexpected error occurred.'

// Fetches the quiz record attached to a module.
export const getQuizByModule = async (moduleId: string): ServiceResult<Quiz> => {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('module_id', moduleId)
      .single()

    return { data: data ?? null, error: error ? error.message : null }
  } catch (error) {
    return { data: null, error: mapError(error) }
  }
}

// Fetches the questions for a quiz in display order.
export const getQuizQuestions = async (quizId: string): ServiceResult<QuizQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order_index', { ascending: true })

    return { data: data ?? [], error: error ? error.message : null }
  } catch (error) {
    return { data: null, error: mapError(error) }
  }
}

// Stores a quiz attempt and whether the user passed.
export const submitQuizResult = async (
  result: QuizResult,
): ServiceResult<QuizResult> => {
  try {
    const { data, error } = await supabase
      .from('user_quiz_results')
      .insert(result)
      .select('*')
      .single()

    return { data: data ?? null, error: error ? error.message : null }
  } catch (error) {
    return { data: null, error: mapError(error) }
  }
}