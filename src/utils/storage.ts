import { CharacterTree } from '@/types/character';

const STORAGE_KEY = 'character-trees';

export class StorageManager {
  static getAllTrees(): CharacterTree[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const trees = JSON.parse(data) as CharacterTree[];
      return trees.map((tree: CharacterTree) => ({
        ...tree,
        createdAt: new Date(tree.createdAt),
        updatedAt: new Date(tree.updatedAt),
        characters: tree.characters.map((char) => ({
          ...char,
          createdAt: new Date(char.createdAt),
          updatedAt: new Date(char.updatedAt)
        }))
      }));
    } catch (error) {
      console.error('Error loading trees from localStorage:', error);
      return [];
    }
  }

  static saveTree(tree: CharacterTree): void {
    try {
      const trees = this.getAllTrees();
      const existingIndex = trees.findIndex(t => t.id === tree.id);
      
      if (existingIndex >= 0) {
        trees[existingIndex] = tree;
      } else {
        trees.push(tree);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trees));
    } catch (error) {
      console.error('Error saving tree to localStorage:', error);
    }
  }

  static deleteTree(treeId: string): void {
    try {
      const trees = this.getAllTrees();
      const filteredTrees = trees.filter(t => t.id !== treeId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTrees));
    } catch (error) {
      console.error('Error deleting tree from localStorage:', error);
    }
  }

  static getTree(treeId: string): CharacterTree | null {
    const trees = this.getAllTrees();
    return trees.find(t => t.id === treeId) || null;
  }

  static exportTrees(): string {
    return JSON.stringify(this.getAllTrees(), null, 2);
  }

  static importTrees(jsonData: string): void {
    try {
      const trees = JSON.parse(jsonData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trees));
    } catch (error) {
      console.error('Error importing trees:', error);
      throw new Error('Invalid JSON format');
    }
  }
}
