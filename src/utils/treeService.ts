import { CharacterTree, Character, Relationship } from '@/types/character';

// Database service for authenticated users
export class DatabaseTreeService {
  async getAllTrees(): Promise<CharacterTree[]> {
    const response = await fetch('/api/trees');
    if (!response.ok) {
      throw new Error('Failed to fetch trees');
    }
    const data = await response.json();
    return this.transformDatabaseTrees(data.trees);
  }

  async getTree(treeId: string): Promise<CharacterTree> {
    const response = await fetch(`/api/trees/${treeId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tree');
    }
    const data = await response.json();
    return this.transformDatabaseTree(data.tree);
  }

  async createTree(name: string, description?: string): Promise<CharacterTree> {
    const response = await fetch('/api/trees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });
    if (!response.ok) {
      throw new Error('Failed to create tree');
    }
    const data = await response.json();
    return this.transformDatabaseTree(data.tree);
  }

  async updateTree(tree: CharacterTree): Promise<CharacterTree> {
    const response = await fetch(`/api/trees/${tree.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: tree.name,
        description: tree.description,
        characters: tree.characters,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to update tree');
    }
    const data = await response.json();
    return this.transformDatabaseTree(data.tree);
  }

  async deleteTree(treeId: string): Promise<void> {
    const response = await fetch(`/api/trees/${treeId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete tree');
    }
  }

  // Transform database objects to frontend types
  private transformDatabaseTrees(dbTrees: any[]): CharacterTree[] {
    return dbTrees.map(tree => this.transformDatabaseTree(tree));
  }

  private transformDatabaseTree(dbTree: any): CharacterTree {
    return {
      id: dbTree.id,
      name: dbTree.name,
      description: dbTree.description,
      characters: dbTree.characters.map((char: any) => this.transformDatabaseCharacter(char)),
      createdAt: new Date(dbTree.createdAt),
      updatedAt: new Date(dbTree.updatedAt),
    };
  }

  private transformDatabaseCharacter(dbChar: any): Character {
    return {
      id: dbChar.id,
      name: dbChar.name,
      description: dbChar.description,
      age: dbChar.age,
      occupation: dbChar.role,
      traits: dbChar.background ? dbChar.background.split(', ').filter(Boolean) : [],
      relationships: dbChar.relationships.map((rel: any) => ({
        id: rel.id,
        targetCharacterId: rel.relatedToId,
        type: rel.type,
        description: rel.description,
      })),
      position: {
        x: dbChar.positionX,
        y: dbChar.positionY,
      },
      createdAt: new Date(dbChar.createdAt),
      updatedAt: new Date(dbChar.updatedAt),
    };
  }
}

// Local storage service for guests
export class LocalStorageTreeService {
  private readonly STORAGE_KEY = 'character-trees';

  async getAllTrees(): Promise<CharacterTree[]> {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const trees = JSON.parse(stored);
      return trees.map((tree: any) => ({
        ...tree,
        createdAt: new Date(tree.createdAt),
        updatedAt: new Date(tree.updatedAt),
        characters: tree.characters.map((char: any) => ({
          ...char,
          createdAt: new Date(char.createdAt),
          updatedAt: new Date(char.updatedAt),
        })),
      }));
    } catch (error) {
      console.error('Error parsing stored trees:', error);
      return [];
    }
  }

  async getTree(treeId: string): Promise<CharacterTree> {
    const trees = await this.getAllTrees();
    const tree = trees.find(t => t.id === treeId);
    if (!tree) {
      throw new Error('Tree not found');
    }
    return tree;
  }

  async createTree(name: string, description?: string): Promise<CharacterTree> {
    const newTree: CharacterTree = {
      id: crypto.randomUUID(),
      name,
      description,
      characters: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const trees = await this.getAllTrees();
    trees.push(newTree);
    this.saveTrees(trees);
    
    return newTree;
  }

  async updateTree(tree: CharacterTree): Promise<CharacterTree> {
    const trees = await this.getAllTrees();
    const index = trees.findIndex(t => t.id === tree.id);
    
    if (index === -1) {
      throw new Error('Tree not found');
    }

    const updatedTree = {
      ...tree,
      updatedAt: new Date(),
    };
    
    trees[index] = updatedTree;
    this.saveTrees(trees);
    
    return updatedTree;
  }

  async deleteTree(treeId: string): Promise<void> {
    const trees = await this.getAllTrees();
    const filteredTrees = trees.filter(t => t.id !== treeId);
    this.saveTrees(filteredTrees);
  }

  private saveTrees(trees: CharacterTree[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trees));
  }
}

// Factory function to get the appropriate service
export function getTreeService(isAuthenticated: boolean) {
  return isAuthenticated ? new DatabaseTreeService() : new LocalStorageTreeService();
}
