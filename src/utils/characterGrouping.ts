'use client';

import { Character, RelationshipType, CharacterGroup } from '@/types/character';

interface GroupingResult {
  groups: CharacterGroup[];
  ungroupedCharacters: Character[];
}

export class CharacterGroupingManager {
  private static readonly MIN_GROUP_SIZE = 2;
  private static readonly GROUP_SPACING = 500; // Increased spacing between groups
  private static readonly CHARACTER_SPACING = 150; // Increased spacing between characters in a group

  /**
   * Automatically groups characters based on their relationship types
   */
  static analyzeAndGroup(characters: Character[]): GroupingResult {
    const relationshipMap = new Map<RelationshipType, Set<string>>();
    const characterMap = new Map<string, Character>();

    // Build character map for quick lookup
    characters.forEach(char => {
      characterMap.set(char.id, char);
    });

    // Analyze relationships and group characters by relationship type
    characters.forEach(character => {
      character.relationships.forEach(relationship => {
        const { type, targetCharacterId } = relationship;
        
        if (!relationshipMap.has(type)) {
          relationshipMap.set(type, new Set());
        }
        
        // Add both characters to the relationship group
        relationshipMap.get(type)!.add(character.id);
        relationshipMap.get(type)!.add(targetCharacterId);
      });
    });

    // Create groups for relationship types with enough members
    const groups: CharacterGroup[] = [];
    const groupedCharacterIds = new Set<string>();

    relationshipMap.forEach((characterIds, relationshipType) => {
      if (characterIds.size >= this.MIN_GROUP_SIZE) {
        // Find common connections - characters that share this relationship type
        const characterArray = Array.from(characterIds);
        const validCharacters = characterArray.filter(id => characterMap.has(id));
        
        if (validCharacters.length >= this.MIN_GROUP_SIZE) {
          const group = this.createGroup(
            relationshipType,
            validCharacters,
            characterMap,
            groups.length
          );
          
          groups.push(group);
          validCharacters.forEach(id => groupedCharacterIds.add(id));
        }
      }
    });

    // Get ungrouped characters
    const ungroupedCharacters = characters.filter(char => 
      !groupedCharacterIds.has(char.id)
    );

    return { groups, ungroupedCharacters };
  }

  /**
   * Creates a character group with optimized positioning
   */
  private static createGroup(
    relationshipType: RelationshipType,
    characterIds: string[],
    characterMap: Map<string, Character>,
    groupIndex: number
  ): CharacterGroup {
    // Calculate group center position with better spacing
    const groupX = 200 + (groupIndex % 3) * this.GROUP_SPACING; // 3 groups per row
    const groupY = 200 + Math.floor(groupIndex / 3) * (this.GROUP_SPACING + 150); // More vertical spacing

    // Generate label based on relationship type
    const label = this.generateGroupLabel(relationshipType, characterIds.length);

    return {
      id: `group-${relationshipType}-${Date.now()}`,
      relationshipType,
      characterIds,
      position: { x: groupX, y: groupY },
      label
    };
  }

  /**
   * Positions characters within a group in a horizontal line
   */
  static positionCharactersInGroup(
    group: CharacterGroup,
    characters: Character[]
  ): Character[] {
    const { characterIds, position } = group;
    const memberCount = characterIds.length;
    
    // Calculate horizontal positioning for characters
    const totalWidth = (memberCount - 1) * this.CHARACTER_SPACING;
    const startX = position.x - totalWidth / 2;
    
    return characters.map(character => {
      const charIndex = characterIds.indexOf(character.id);
      if (charIndex === -1) return character;

      // Position characters in a horizontal line below the group label
      const x = startX + charIndex * this.CHARACTER_SPACING;
      const y = position.y + 80; // More space below the group label

      return {
        ...character,
        position: { x, y }
      };
    });
  }

  /**
   * Generates appropriate group labels
   */
  private static generateGroupLabel(
    relationshipType: RelationshipType,
    memberCount: number
  ): string {
    const typeLabels: Record<RelationshipType, string> = {
      [RelationshipType.PARENT]: 'Parents',
      [RelationshipType.CHILD]: 'Children',
      [RelationshipType.SIBLING]: 'Siblings',
      [RelationshipType.SPOUSE]: 'Spouses',
      [RelationshipType.FRIEND]: 'Friends',
      [RelationshipType.ENEMY]: 'Enemies',
      [RelationshipType.COLLEAGUE]: 'Colleagues',
      [RelationshipType.MENTOR]: 'Mentors',
      [RelationshipType.STUDENT]: 'Students',
      [RelationshipType.OTHER]: 'Related'
    };

    const baseLabel = typeLabels[relationshipType] || 'Group';
    return `${baseLabel} (${memberCount})`;
  }

  /**
   * Positions ungrouped characters to avoid overlapping with groups
   */
  static positionUngroupedCharacters(
    ungroupedCharacters: Character[],
    groups: CharacterGroup[]
  ): Character[] {
    // Define occupied areas for each group (including space for their characters)
    const occupiedAreas = groups.map(group => ({
      x: group.position.x - 300, // More padding
      y: group.position.y - 50,
      width: 600, // Wider area
      height: 200 // Taller area
    }));

    return ungroupedCharacters.map((character, index) => {
      let x = 800 + (index % 3) * this.CHARACTER_SPACING; // Start further right
      let y = 150 + Math.floor(index / 3) * this.CHARACTER_SPACING;

      // Check for overlaps and adjust position if needed
      while (this.isPositionOccupied(x, y, occupiedAreas)) {
        x += this.CHARACTER_SPACING;
        if (x > 1200) { // Extend the boundary
          x = 800;
          y += this.CHARACTER_SPACING;
        }
      }

      return {
        ...character,
        position: { x, y }
      };
    });
  }

  /**
   * Checks if a position overlaps with existing groups
   */
  private static isPositionOccupied(
    x: number,
    y: number,
    occupiedAreas: Array<{ x: number; y: number; width: number; height: number }>
  ): boolean {
    return occupiedAreas.some(area => 
      x >= area.x && 
      x <= area.x + area.width && 
      y >= area.y && 
      y <= area.y + area.height
    );
  }
}
