import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "All session cookies cleared"
    });

    // Clear all possible NextAuth session cookies
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('__Host-next-auth.csrf-token');
    response.cookies.delete('next-auth.state');
    response.cookies.delete('next-auth.pkce.code_verifier');

    return response;
  } catch (error) {
    console.error('Clear cookies error:', error);
    return NextResponse.json({ 
      error: 'Failed to clear cookies',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
