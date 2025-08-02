import { cookies } from 'next/headers';

export interface UserSession {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  sessionToken: string;
}

// Server-side session function
export async function getServerSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const userSessionCookie = cookieStore.get('user-session');
    
    if (!userSessionCookie) {
      return null;
    }

    const userSession = JSON.parse(userSessionCookie.value);
    return userSession;
  } catch (error) {
    console.error('Error getting server session:', error);
    return null;
  }
}

// Client-side session functions
export function getClientSession(): UserSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const sessionData = document.cookie
      .split('; ')
      .find(row => row.startsWith('user-session='));
    
    if (!sessionData) {
      return null;
    }

    const sessionValue = sessionData.split('=')[1];
    return JSON.parse(decodeURIComponent(sessionValue));
  } catch (error) {
    console.error('Error getting client session:', error);
    return null;
  }
}
