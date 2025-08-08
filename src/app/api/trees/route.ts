import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/session';

// GET /api/trees - Get all trees for the current user
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email: session.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.email,
          name: session.name,
          image: session.picture,
        }
      });
    }

    const trees = await prisma.characterTree.findMany({
      where: { userId: user.id },
      include: {
        characters: {
          include: {
            relationships: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ trees });
  } catch (error) {
    console.error('Error fetching trees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trees' },
      { status: 500 }
    );
  }
}

// POST /api/trees - Create a new tree
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Tree name is required' },
        { status: 400 }
      );
    }

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email: session.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.email,
          name: session.name,
          image: session.picture,
        }
      });
    }

    const tree = await prisma.characterTree.create({
      data: {
        name,
        description,
        userId: user.id,
      },
      include: {
        characters: {
          include: {
            relationships: true
          }
        }
      }
    });

    return NextResponse.json({ tree });
  } catch (error) {
    console.error('Error creating tree:', error);
    return NextResponse.json(
      { error: 'Failed to create tree' },
      { status: 500 }
    );
  }
}
