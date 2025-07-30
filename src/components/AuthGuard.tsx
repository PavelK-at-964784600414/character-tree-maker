"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoggedIn, isGuest } = useAuth();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    console.log('AuthGuard status:', { status, isLoggedIn, isGuest, session });
    
    // Wait a bit for session to load
    const timer = setTimeout(() => {
      if (status === 'loading') {
        return; // Still loading, don't redirect yet
      }
      
      if (!isLoggedIn && !isGuest && status === 'unauthenticated') {
        console.log('No authentication found, showing login');
        setShowAuth(true);
      } else {
        setShowAuth(false);
      }
    }, 1000); // Give NextAuth some time to resolve

    return () => clearTimeout(timer);
  }, [isLoggedIn, isGuest, status, session]);

  // If we need authentication, redirect to sign-in
  useEffect(() => {
    if (showAuth) {
      router.push('/auth/signin');
    }
  }, [showAuth, router]);

  // Show loading while determining auth state
  if (status === 'loading' || (!isLoggedIn && !isGuest && !showAuth)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated (either logged in or guest), show the app
  if (isLoggedIn || isGuest) {
    return <>{children}</>;
  }

  // Fallback loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Checking authentication...</p>
      </div>
    </div>
  );
}
