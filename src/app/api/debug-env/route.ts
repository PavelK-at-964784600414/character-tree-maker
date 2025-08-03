import { NextResponse } from 'next/server';

export async function GET() {
  // Only show this in development for security
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ 
      error: 'Debug endpoint disabled in production',
      environment: process.env.NODE_ENV,
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasRedirectUri: !!process.env.GOOGLE_REDIRECT_URI,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    });
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET', 
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'NOT SET',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
  });
}
