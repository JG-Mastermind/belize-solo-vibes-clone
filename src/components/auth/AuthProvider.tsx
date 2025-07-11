
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<{ data?: any; error?: any }>;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signInWithOAuth: (provider: Provider, options?: { redirectTo?: string }) => Promise<{ data?: any; error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data?: any; error?: any }>;
  updatePassword: (password: string) => Promise<{ data?: any; error?: any }>;
  resendConfirmation: (email: string) => Promise<{ data?: any; error?: any }>;
  getUserRole: () => string | null;
  updateUserRole: (role: string) => Promise<{ data?: any; error?: any }>;
  isDeviceIOS: () => boolean;
  rememberSignInMethod: (method: string) => void;
  getPreferredSignInMethod: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the hook for external use
export { useAuth as default };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithOAuth = async (provider: Provider, options?: { redirectTo?: string }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: options?.redirectTo || `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    return { data, error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { data, error };
  };

  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    return { data, error };
  };

  const resendConfirmation = async (email: string) => {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    return { data, error };
  };

  const getUserRole = () => {
    return user?.user_metadata?.role || null;
  };

  const updateUserRole = async (role: string) => {
    const { data, error } = await supabase.auth.updateUser({
      data: { role }
    });
    return { data, error };
  };

  const isDeviceIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.maxTouchPoints > 1 && navigator.userAgent.includes('Mac'));
  };

  const rememberSignInMethod = (method: string) => {
    localStorage.setItem('preferredSignInMethod', method);
  };

  const getPreferredSignInMethod = () => {
    return localStorage.getItem('preferredSignInMethod');
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmation,
    getUserRole,
    updateUserRole,
    isDeviceIOS,
    rememberSignInMethod,
    getPreferredSignInMethod
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
