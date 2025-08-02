"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';

export default function UserProfile() {
  const { isLoggedIn, isGuest, userEmail, userName, userImage, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isLoggedIn && !isGuest) {
    return null;
  }

  const handleSignOut = async () => {
    await logout();
    window.location.href = '/auth/signin';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {userImage ? (
          <Image
            src={userImage}
            alt={userName || 'User'}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {userName || (isGuest ? 'Guest User' : 'User')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isGuest ? 'Guest Mode' : userEmail}
          </p>
        </div>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-2">
            <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {userName || (isGuest ? 'Guest User' : 'User')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isGuest ? 'Local storage only' : userEmail}
              </p>
            </div>
            
            <button
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isGuest ? 'Exit Guest Mode' : 'Sign Out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
