"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { signOut } from '@/lib/client-session';

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isGuest: boolean;
  user?: User;
  userEmail?: string;
  userName?: string;
  userImage?: string;
  continueAsGuest: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(undefined);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    };

    // Check guest mode
    const guestMode = localStorage.getItem('guestMode');
    if (guestMode === 'true') {
      setIsGuest(true);
    }

    checkSession();
  }, []);

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('guestMode', 'true');
  };

  const logout = async () => {
    setIsGuest(false);
    localStorage.removeItem('guestMode');
    
    if (user) {
      await signOut();
      setUser(undefined);
    }
  };

  const value = {
    isLoggedIn: !!user,
    isGuest,
    user,
    userEmail: user?.email,
    userName: user?.name,
    userImage: user?.picture,
    continueAsGuest,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
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
