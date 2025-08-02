import { NextRequest, NextResponse } from 'next/server';
import { getTokens, getUserInfo } from '@/lib/google-oauth';
import { serialize } from 'cookie';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/signin?error=OAuthCallback`);
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/signin?error=NoCode`);
  }

  try {
    // Exchange code for tokens
    const tokens = await getTokens(code);
    
    if (!tokens.access_token) {
      throw new Error('No access token received');
    }

    // Get user information
    const userInfo = await getUserInfo(tokens.access_token);
    
    if (!userInfo.email || !userInfo.id) {
      throw new Error('Failed to get user information');
    }

    // Create session data
    const sessionData = {
      user: {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        image: userInfo.picture,
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };

    // Set session cookie
    const sessionCookie = serialize('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/`);
    response.headers.set('Set-Cookie', sessionCookie);
    
    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/signin?error=Callback`);
  }
}
