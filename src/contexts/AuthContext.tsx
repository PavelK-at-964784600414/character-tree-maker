"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface AuthContextType {
  isLoggedIn: boolean;
  isGuest: boolean;
  userEmail?: string;
  userName?: string;
  userImage?: string;
  continueAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const guestMode = localStorage.getItem('guestMode');
    if (guestMode === 'true') {
      setIsGuest(true);
    }
  }, []);

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('guestMode', 'true');
  };

  const logout = () => {
    setIsGuest(false);
    localStorage.removeItem('guestMode');
  };

  const value = {
    isLoggedIn: !!session,
    isGuest,
    userEmail: session?.user?.email || undefined,
    userName: session?.user?.name || undefined,
    userImage: session?.user?.image || undefined,
    continueAsGuest,
    logout,
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
