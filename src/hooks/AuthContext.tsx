import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { signIn as authSignIn, signOut as authSignOut, type user as AuthUser } from '../services/authService';
import { getUserProfile, type UserProfile } from '../services/userService';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await getUserProfile(userId);
    setProfile(data);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        const u: AuthUser = {
          id: s.user.id,
          name: String(s.user.user_metadata?.name ?? ''),
          email: s.user.email ?? '',
          avatar_url: String(s.user.user_metadata?.avatar_url ?? ''),
          x_points: Number(s.user.user_metadata?.x_points ?? 0),
          level: Number(s.user.user_metadata?.level ?? 0),
          streak: Number(s.user.user_metadata?.streak ?? 0),
          created_at: s.user.created_at,
        };
        setUser(u);
        fetchProfile(s.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        const u: AuthUser = {
          id: s.user.id,
          name: String(s.user.user_metadata?.name ?? ''),
          email: s.user.email ?? '',
          avatar_url: String(s.user.user_metadata?.avatar_url ?? ''),
          x_points: Number(s.user.user_metadata?.x_points ?? 0),
          level: Number(s.user.user_metadata?.level ?? 0),
          streak: Number(s.user.user_metadata?.streak ?? 0),
          created_at: s.user.created_at,
        };
        setUser(u);
        fetchProfile(s.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    const result = await authSignIn({ email, password });
    if (result) {
      setUser(result);
      await fetchProfile(result.id);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, x_points: 0, level: 1, streak: 0 } },
    });
    if (error) throw error;
    if (data.user) {
      const u: AuthUser = {
        id: data.user.id,
        name,
        email: data.user.email ?? '',
        avatar_url: '',
        x_points: 0,
        level: 1,
        streak: 0,
        created_at: data.user.created_at,
      };
      setUser(u);
    }
  };

  const signOutFn = async () => {
    await authSignOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signIn, signUp, signOut: signOutFn, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
