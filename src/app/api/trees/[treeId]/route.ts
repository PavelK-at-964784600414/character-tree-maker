import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/session';

interface Params {
  treeId: string;
}

// GET /api/trees/[treeId] - Get a specific tree
export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const tree = await prisma.characterTree.findFirst({
      where: {
        id: params.treeId,
        userId: user.id
      },
      include: {
        characters: {
          include: {
            relationships: true
          }
        }
      }
    });

    if (!tree) {
      return NextResponse.json({ error: 'Tree not found' }, { status: 404 });
    }

    return NextResponse.json({ tree });
  } catch (error) {
    console.error('Error fetching tree:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tree' },
      { status: 500 }
    );
  }
}

// PUT /api/trees/[treeId] - Update a tree
export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, characters } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify tree ownership
    const existingTree = await prisma.characterTree.findFirst({
      where: {
        id: params.treeId,
        userId: user.id
      }
    });

    if (!existingTree) {
      return NextResponse.json({ error: 'Tree not found' }, { status: 404 });
    }

    // Update tree in a transaction
    const updatedTree = await prisma.$transaction(async (tx) => {
      // Update tree basic info
      const tree = await tx.characterTree.update({
        where: { id: params.treeId },
        data: {
          name,
          description,
          updatedAt: new Date(),
        }
      });

      if (characters) {
        // Delete existing characters and relationships
        await tx.relationship.deleteMany({
          where: {
            character: {
              treeId: params.treeId
            }
          }
        });

        await tx.character.deleteMany({
          where: { treeId: params.treeId }
        });

        // Create new characters
        for (const character of characters) {
          const createdChar = await tx.character.create({
            data: {
              id: character.id,
              name: character.name,
              description: character.description,
              age: character.age,
              role: character.occupation,
              background: character.traits?.join(', '),
              positionX: character.position?.x || 0,
              positionY: character.position?.y || 0,
              treeId: params.treeId,
            }
          });

          // Create relationships for this character
          if (character.relationships) {
            for (const relationship of character.relationships) {
              await tx.relationship.create({
                data: {
                  id: relationship.id,
                  type: relationship.type,
                  description: relationship.description,
                  relatedToId: relationship.targetCharacterId,
                  characterId: createdChar.id,
                }
              });
            }
          }
        }
      }

      // Return updated tree with all data
      return await tx.characterTree.findUnique({
        where: { id: params.treeId },
        include: {
          characters: {
            include: {
              relationships: true
            }
          }
        }
      });
    });

    return NextResponse.json({ tree: updatedTree });
  } catch (error) {
    console.error('Error updating tree:', error);
    return NextResponse.json(
      { error: 'Failed to update tree' },
      { status: 500 }
    );
  }
}

// DELETE /api/trees/[treeId] - Delete a tree
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify tree ownership and delete
    const deletedTree = await prisma.characterTree.deleteMany({
      where: {
        id: params.treeId,
        userId: user.id
      }
    });

    if (deletedTree.count === 0) {
      return NextResponse.json({ error: 'Tree not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tree:', error);
    return NextResponse.json(
      { error: 'Failed to delete tree' },
      { status: 500 }
    );
  }
}
