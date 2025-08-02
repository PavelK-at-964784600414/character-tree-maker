import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null, authenticated: false });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (new Date(sessionData.expires) < new Date()) {
      return NextResponse.json({ user: null, authenticated: false });
    }

    return NextResponse.json({
      user: sessionData.user,
      authenticated: true,
      expires: sessionData.expires,
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null, authenticated: false });
  }
}
