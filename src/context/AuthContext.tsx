import React, { useEffect, useState, createContext, useContext, memo } from 'react';
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'premium';
  memoriesThisWeek: number;
  timelinesThisMonth: number;
}
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('memora_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      plan: 'free',
      memoriesThisWeek: 3,
      timelinesThisMonth: 0
    };
    setUser(mockUser);
    localStorage.setItem('memora_user', JSON.stringify(mockUser));
  };
  const register = async (name: string, email: string, password: string) => {
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      plan: 'free',
      memoriesThisWeek: 0,
      timelinesThisMonth: 0
    };
    setUser(mockUser);
    localStorage.setItem('memora_user', JSON.stringify(mockUser));
  };
  const googleLogin = async () => {
    // Mock Google OAuth flow - in a real app integrate Google SDK
    await new Promise(resolve => setTimeout(resolve, 600));
    const mockUser: User = {
      id: 'google-' + Date.now().toString(),
      name: 'Google User',
      email: 'google.user@example.com',
      plan: 'free',
      memoriesThisWeek: 0,
      timelinesThisMonth: 0
    };
    setUser(mockUser);
    localStorage.setItem('memora_user', JSON.stringify(mockUser));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('memora_user');
    window.location.href = '/login';
  };
  return <AuthContext.Provider value={{
    user,
    login,
    register,
    googleLogin,
    logout,
    isLoading
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}