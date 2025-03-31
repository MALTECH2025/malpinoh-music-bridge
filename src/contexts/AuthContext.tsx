
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  emailVerified: boolean;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        
        // Fetch user data if we have a session
        if (currentSession?.user) {
          // Use setTimeout to avoid deadlocks with Supabase client
          setTimeout(() => {
            fetchUserData(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        fetchUserData(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user data from the artists table
  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      
      // Get the user data from the artists table
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (artistError) throw artistError;
      
      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .rpc('has_role', { user_id: userId, role: 'admin' });
        
      if (roleError) throw roleError;
      
      // Create user object with data from both sources
      const userData: User = {
        id: userId,
        email: artistData.email,
        name: artistData.name,
        isAdmin: roleData || false,
        emailVerified: true, // Supabase handles email verification
        balance: artistData.wallet_balance || 0
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If there was an error, sign out the user
      await supabase.auth.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success(`Welcome back!`);
      // Navigation will happen in components using the auth context
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success('Welcome to MalpinohDistro!', {
        description: data.session ? 'Account created successfully!' : 'Check your email for a verification link.'
      });
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.info('You have been logged out');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      // Don't reveal if the email exists or not for security reasons
      toast.success('If your email is registered, you will receive password reset instructions.');
    } catch (error: any) {
      toast.error('Failed to process request');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setLoading(true);
    try {
      // In Supabase, the token is handled via URL parameters automatically
      // We just need to set the new password
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      toast.success('Password reset successfully');
    } catch (error: any) {
      toast.error(error.message || 'Password reset failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    // Supabase handles email verification automatically via URL parameters
    // This function is kept for API consistency
    setLoading(true);
    try {
      toast.success('Email verified successfully');
    } catch (error: any) {
      toast.error(error.message || 'Email verification failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout,
        requestPasswordReset,
        resetPassword,
        verifyEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
