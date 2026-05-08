import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export type user = {
  id: string
  name: string
  email: string
  avatar_url: string
  x_points: number
  level: number
  streak: number
  created_at: string
}

type SignInInput = {
  email: string
  password: string
}

type EditUserInput = Partial<Pick<user, 'name' | 'avatar_url' | 'x_points' | 'level' | 'streak'>>

const toUser = (authUser: User): user => ({
  id: authUser.id,
  name: String(authUser.user_metadata?.name ?? ''),
  email: authUser.email ?? '',
  avatar_url: String(authUser.user_metadata?.avatar_url ?? ''),
  x_points: Number(authUser.user_metadata?.x_points ?? 0),
  level: Number(authUser.user_metadata?.level ?? 0),
  streak: Number(authUser.user_metadata?.streak ?? 0),
  created_at: authUser.created_at,
})

export const signIn = async ({ email, password }: SignInInput) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data.user ? toUser(data.user) : null
}

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  })

  if (error) {
    throw error
  }

  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return data.user ? toUser(data.user) : null
}

export const editUser = async (updates: EditUserInput) => {
  const { data: currentUserData, error: currentUserError } = await supabase.auth.getUser()

  if (currentUserError) {
    throw currentUserError
  }

  if (!currentUserData.user) {
    throw new Error('No authenticated user found.')
  }

  const { data, error } = await supabase.auth.updateUser({
    data: {
      ...currentUserData.user.user_metadata,
      ...updates,
    },
  })

  if (error) {
    throw error
  }

  return data.user ? toUser(data.user) : null
}
