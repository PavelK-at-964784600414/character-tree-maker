export interface UserSession {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export function getClientSession(): UserSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const sessionData = document.cookie
      .split('; ')
      .find(row => row.startsWith('session='));
    
    if (!sessionData) {
      return null;
    }

    const sessionValue = sessionData.split('=')[1];
    const parsedSession = JSON.parse(decodeURIComponent(sessionValue));
    
    // Check if session is expired
    if (new Date(parsedSession.expires) < new Date()) {
      return null;
    }
    
    return parsedSession.user;
  } catch (error) {
    console.error('Error getting client session:', error);
    return null;
  }
}

export async function signOut() {
  try {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
    });
    
    if (response.ok) {
      // Clear the cookie on client side as well
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/auth/signin';
    }
  } catch (error) {
    console.error('Error signing out:', error);
  }
}
