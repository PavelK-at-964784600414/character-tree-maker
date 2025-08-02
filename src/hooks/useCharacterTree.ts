'use client';

import { useState, useEffect } from 'react';
import { Character, CharacterTree, RelationshipType, CharacterGroup } from '@/types/character';
import { StorageManager } from '@/utils/storage';
import { CharacterGroupingManager } from '@/utils/characterGrouping';
import { v4 as uuidv4 } from 'uuid';

export const useCharacterTree = (treeId?: string) => {
  const [currentTree, setCurrentTree] = useState<CharacterTree | null>(null);
  const [trees, setTrees] = useState<CharacterTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<CharacterGroup[]>([]);
  const [isGroupingEnabled, setIsGroupingEnabled] = useState(false);

  useEffect(() => {
    const loadTrees = () => {
      const savedTrees = StorageManager.getAllTrees();
      setTrees(savedTrees);
      
      if (treeId) {
        const tree = savedTrees.find(t => t.id === treeId);
        setCurrentTree(tree || null);
      }
      
      setLoading(false);
    };

    loadTrees();
  }, [treeId]);

  const createTree = (name: string): CharacterTree => {
    const newTree: CharacterTree = {
      id: uuidv4(),
      name,
      characters: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    StorageManager.saveTree(newTree);
    setTrees(prev => [...prev, newTree]);
    setCurrentTree(newTree);
    
    return newTree;
  };

  const updateTree = (tree: CharacterTree) => {
    const updatedTree = {
      ...tree,
      updatedAt: new Date()
    };
    
    StorageManager.saveTree(updatedTree);
    setTrees(prev => prev.map(t => t.id === tree.id ? updatedTree : t));
    setCurrentTree(updatedTree);
  };

  const deleteTree = (treeId: string) => {
    StorageManager.deleteTree(treeId);
    setTrees(prev => prev.filter(t => t.id !== treeId));
    if (currentTree?.id === treeId) {
      setCurrentTree(null);
    }
  };

  const addCharacter = (character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentTree) return;

    const newCharacter: Character = {
      ...character,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedTree = {
      ...currentTree,
      characters: [...currentTree.characters, newCharacter],
      updatedAt: new Date()
    };

    updateTree(updatedTree);
  };

  const updateCharacter = (characterId: string, updates: Partial<Character>) => {
    if (!currentTree) return;

    const updatedTree = {
      ...currentTree,
      characters: currentTree.characters.map(char =>
        char.id === characterId
          ? { ...char, ...updates, updatedAt: new Date() }
          : char
      ),
      updatedAt: new Date()
    };

    updateTree(updatedTree);
  };

  const deleteCharacter = (characterId: string) => {
    if (!currentTree) return;

    const updatedTree = {
      ...currentTree,
      characters: currentTree.characters.filter(char => char.id !== characterId),
      updatedAt: new Date()
    };

    updateTree(updatedTree);
  };

  const addRelationship = (sourceCharacterId: string, targetCharacterId: string, type: RelationshipType, description?: string) => {
    if (!currentTree) return;

    const relationshipId = uuidv4();
    const updatedTree = {
      ...currentTree,
      characters: currentTree.characters.map(char =>
        char.id === sourceCharacterId
          ? {
              ...char,
              relationships: [
                ...char.relationships,
                {
                  id: relationshipId,
                  targetCharacterId,
                  type,
                  ...(description && { description })
                }
              ],
              updatedAt: new Date()
            }
          : char
      ),
      updatedAt: new Date()
    };

    updateTree(updatedTree);
  };

  const updateRelationship = (sourceCharacterId: string, relationshipId: string, type: RelationshipType, description?: string) => {
    if (!currentTree) return;

    const updatedTree = {
      ...currentTree,
      characters: currentTree.characters.map(char =>
        char.id === sourceCharacterId
          ? {
              ...char,
              relationships: char.relationships.map(rel =>
                rel.id === relationshipId
                  ? { ...rel, type, ...(description !== undefined && { description }) }
                  : rel
              ),
              updatedAt: new Date()
            }
          : char
      ),
      updatedAt: new Date()
    };

    updateTree(updatedTree);
  };

  const deleteRelationship = (sourceCharacterId: string, relationshipId: string) => {
    if (!currentTree) return;

    const updatedTree = {
      ...currentTree,
      characters: currentTree.characters.map(char =>
        char.id === sourceCharacterId
          ? {
              ...char,
              relationships: char.relationships.filter(rel => rel.id !== relationshipId),
              updatedAt: new Date()
            }
          : char
      ),
      updatedAt: new Date()
    };

    updateTree(updatedTree);
  };

  const getCharacterById = (id: string): Character | undefined => {
    return currentTree?.characters.find(char => char.id === id);
  };

  // Grouping functions
  const enableGrouping = () => {
    if (!currentTree) return;
    
    const { groups: newGroups } = CharacterGroupingManager.analyzeAndGroup(currentTree.characters);
    
    // Position characters in groups
    let updatedCharacters = [...currentTree.characters];
    newGroups.forEach(group => {
      updatedCharacters = CharacterGroupingManager.positionCharactersInGroup(group, updatedCharacters);
    });

    // Position ungrouped characters
    const finalUngroupedCharacters = updatedCharacters.filter(char => 
      !newGroups.some(group => group.characterIds.includes(char.id))
    );
    
    const positionedUngroupedCharacters = CharacterGroupingManager.positionUngroupedCharacters(
      finalUngroupedCharacters,
      newGroups
    );

    // Update all character positions
    updatedCharacters = updatedCharacters.map(char => {
      const positioned = positionedUngroupedCharacters.find(positioned => positioned.id === char.id);
      return positioned || char;
    });

    setGroups(newGroups);
    setIsGroupingEnabled(true);
    
    // Update the tree with new positions
    const updatedTree = {
      ...currentTree,
      characters: updatedCharacters,
      updatedAt: new Date()
    };
    updateTree(updatedTree);
  };

  const disableGrouping = () => {
    setGroups([]);
    setIsGroupingEnabled(false);
  };

  const toggleGrouping = () => {
    if (isGroupingEnabled) {
      disableGrouping();
    } else {
      enableGrouping();
    }
  };

  const updateGroupPosition = (groupId: string, newPosition: { x: number; y: number }) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, position: newPosition }
        : group
    ));
  };

  return {
    currentTree,
    trees,
    loading,
    createTree,
    updateTree,
    deleteTree,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addRelationship,
    updateRelationship,
    deleteRelationship,
    getCharacterById,
    groups,
    isGroupingEnabled,
    enableGrouping,
    disableGrouping,
    toggleGrouping,
    updateGroupPosition
  };
};
