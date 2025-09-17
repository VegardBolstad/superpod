import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    defaultSources: string[];
    aiSettings: {
      enableNarration: boolean;
      voiceStyle: string;
      speakingSpeed: number;
    };
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token on mount
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Validate token and get user info
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      // This would be an API call to validate the token
      // For now, we'll simulate it
      setLoading(false);
    } catch (error) {
      localStorage.removeItem('auth_token');
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      localStorage.setItem('auth_token', response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      localStorage.removeItem('auth_token');
      setUser(null);
    } catch (error) {
      // Even if logout fails, clear local state
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
