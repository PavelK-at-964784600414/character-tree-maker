import { NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/google-oauth';

export async function GET() {
  try {
    console.log('Google OAuth signin attempt started');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Has Client ID:', !!process.env.GOOGLE_CLIENT_ID);
    console.log('Has Client Secret:', !!process.env.GOOGLE_CLIENT_SECRET);
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
    
    const authUrl = getAuthUrl();
    console.log('Generated auth URL successfully');
    
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error in Google OAuth signin:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate auth URL',
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env.NODE_ENV,
        hasClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      },
      { status: 500 }
    );
  }
}
