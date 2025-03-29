
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

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
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

// Mock users for demonstration purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@malpinoh.com',
    name: 'Admin User',
    isAdmin: true,
    emailVerified: true,
    balance: 0
  },
  {
    id: '2',
    email: 'artist@example.com',
    name: 'Demo Artist',
    isAdmin: false,
    emailVerified: true,
    balance: 120.50
  }
];

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('malpinohUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user', error);
        localStorage.removeItem('malpinohUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login validation
      const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, you'd validate the password here
      
      setUser(foundUser);
      localStorage.setItem('malpinohUser', JSON.stringify(foundUser));
      toast.success(`Welcome back, ${foundUser.name}!`);
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already in use');
      }
      
      // In a real app, you'd create a user in your database here
      const newUser: User = {
        id: String(MOCK_USERS.length + 1),
        email,
        name,
        isAdmin: false,
        emailVerified: false,
        balance: 0
      };
      
      // For demo purposes, we'll just set the user as logged in
      setUser(newUser);
      localStorage.setItem('malpinohUser', JSON.stringify(newUser));
      toast.success('Welcome to MalpinohDistro!', {
        description: 'Check your email for a verification link.'
      });
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('malpinohUser');
    toast.info('You have been logged out');
  };

  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!foundUser) {
        // Don't reveal if the email exists or not for security reasons
        toast.success('If your email is registered, you will receive password reset instructions.');
        return;
      }
      
      // In a real app, you'd send a password reset email here
      toast.success('Password reset instructions sent to your email');
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
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you'd validate the token and update the user's password
      toast.success('Password reset successfully');
    } catch (error: any) {
      toast.error(error.message || 'Password reset failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    setLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you'd validate the token and mark the user's email as verified
      if (user) {
        const updatedUser = { ...user, emailVerified: true };
        setUser(updatedUser);
        localStorage.setItem('malpinohUser', JSON.stringify(updatedUser));
        toast.success('Email verified successfully');
      }
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
