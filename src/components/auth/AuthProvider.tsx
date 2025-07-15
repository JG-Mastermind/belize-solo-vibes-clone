
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string; user_type?: string }) => Promise<{ data?: unknown; error?: unknown }>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ data?: unknown; error?: unknown }>;
  signInWithOAuth: (provider: Provider, options?: { redirectTo?: string }) => Promise<{ data?: unknown; error?: unknown }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data?: unknown; error?: unknown }>;
  updatePassword: (password: string) => Promise<{ data?: unknown; error?: unknown }>;
  resendConfirmation: (email: string) => Promise<{ data?: unknown; error?: unknown }>;
  getUserRole: () => string | null;
  updateUserRole: (role: string) => Promise<{ data?: unknown; error?: unknown }>;
  isDeviceIOS: () => boolean;
  rememberSignInMethod: (method: string) => void;
  getPreferredSignInMethod: () => string | null;
  updateUserProfile: (updates: Record<string, unknown>) => Promise<{ data?: unknown; error?: unknown }>;
  getUserAvatar: () => string | null;
  syncUserProfileWithSocial: () => Promise<void>;
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

  // Sync user profile when user changes
  useEffect(() => {
    if (user) {
      syncUserProfileWithSocial();
    }
  }, [user]);

  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string; user_type?: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    // If signup successful and user_type provided, update the users table
    if (data.user && !error && metadata?.user_type) {
      try {
        const { error: updateError } = await supabase
          .from('users')
          .update({ user_type: metadata.user_type })
          .eq('id', data.user.id);
        
        if (updateError) {
          console.error('Error updating user type:', updateError);
        }
      } catch (updateError) {
        console.error('Error updating user type:', updateError);
      }
    }
    
    return { data, error };
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    // Handle remember me functionality
    if (data.session && rememberMe) {
      // Store session persistence preference
      localStorage.setItem('supabase_remember_me', 'true');
      localStorage.setItem('supabase_session', JSON.stringify(data.session));
    } else {
      localStorage.removeItem('supabase_remember_me');
      localStorage.removeItem('supabase_session');
    }
    
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    // Clear remember me data on sign out
    localStorage.removeItem('supabase_remember_me');
    localStorage.removeItem('supabase_session');
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
    
    // For social logins, we'll handle remember me after successful callback
    if (data && provider) {
      localStorage.setItem('supabase_remember_me', 'true');
      localStorage.setItem('oauth_provider', provider);
    }
    
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
    // Try to get role from user metadata first, then fallback to database query if needed
    return user?.user_metadata?.role || user?.user_metadata?.user_type || null;
  };

  const updateUserRole = async (role: string) => {
    // Update user metadata
    const { data, error } = await supabase.auth.updateUser({
      data: { role, user_type: role }
    });
    
    // Also update the users table if user exists
    if (user && !error) {
      try {
        const { error: updateError } = await supabase
          .from('users')
          .update({ user_type: role })
          .eq('id', user.id);
        
        if (updateError) {
          console.error('Error updating user type in database:', updateError);
        }
      } catch (updateError) {
        console.error('Error updating user type in database:', updateError);
      }
    }
    
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

  const updateUserProfile = async (updates: Record<string, unknown>) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });
    return { data, error };
  };

  const getUserAvatar = () => {
    return user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  };

  const syncUserProfileWithSocial = async () => {
    if (!user) return;
    
    const avatarUrl = getUserAvatar();
    const provider = localStorage.getItem('oauth_provider');
    
    if (avatarUrl && provider) {
      // Update user profile with social avatar
      try {
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim(),
            avatar_url: avatarUrl,
            provider: provider,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });
        
        if (error) {
          console.error('Error syncing user profile:', error);
        }
      } catch (error) {
        console.error('Error syncing user profile:', error);
      }
    }
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
    getPreferredSignInMethod,
    updateUserProfile,
    getUserAvatar,
    syncUserProfileWithSocial
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
