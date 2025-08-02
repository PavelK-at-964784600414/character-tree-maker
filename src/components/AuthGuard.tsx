"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoggedIn, isGuest, loading } = useAuth();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!loading) {
      // If user is authenticated or in guest mode, allow access
      if (isLoggedIn || isGuest) {
        setShouldRedirect(false);
        return;
      }
      
      // If no authentication and not guest, redirect to sign-in
      setShouldRedirect(true);
    }
  }, [isLoggedIn, isGuest, loading]);

  // Redirect to sign-in if needed
  useEffect(() => {
    if (shouldRedirect && !loading) {
      router.push('/auth/signin');
    }
  }, [shouldRedirect, router, loading]);

  // Show loading while determining auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated (either via Google OAuth or guest), show the app
  if (isLoggedIn || isGuest) {
    return <>{children}</>;
  }

  // Fallback loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Redirecting to sign in...</p>
      </div>
    </div>
  );
}
