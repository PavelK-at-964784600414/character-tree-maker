import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only show this in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  return NextResponse.json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Missing',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Missing',
    NODE_ENV: process.env.NODE_ENV,
    // Show first few characters of client ID for verification
    CLIENT_ID_PREVIEW: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...',
  });
}
