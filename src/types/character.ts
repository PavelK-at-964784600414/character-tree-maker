export interface Character {
  id: string;
  name: string;
  description: string;
  age?: number;
  occupation?: string;
  traits: string[];
  relationships: Relationship[];
  parentId?: string;
  position: { x: number; y: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface Relationship {
  id: string;
  targetCharacterId: string;
  type: RelationshipType;
  description: string;
}

export enum RelationshipType {
  PARENT = 'parent',
  CHILD = 'child',
  SIBLING = 'sibling',
  SPOUSE = 'spouse',
  FRIEND = 'friend',
  ENEMY = 'enemy',
  COLLEAGUE = 'colleague',
  MENTOR = 'mentor',
  STUDENT = 'student',
  OTHER = 'other'
}

export interface CharacterTree {
  id: string;
  name: string;
  characters: Character[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TreePosition {
  x: number;
  y: number;
}

export interface TreeNode {
  id: string;
  data: Character;
  position: TreePosition;
  type: 'character';
}

export interface TreeEdge {
  id: string;
  source: string;
  target: string;
  type: 'smoothstep';
  label: string;
}
