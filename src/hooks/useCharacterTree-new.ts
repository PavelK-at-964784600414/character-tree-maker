'use client';

import { useState, useEffect, useContext } from 'react';
import { Character, CharacterTree, RelationshipType, CharacterGroup } from '@/types/character';
import { getTreeService } from '@/utils/treeService';
import { CharacterGroupingManager } from '@/utils/characterGrouping';
import { AuthContext } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

export const useCharacterTree = (treeId?: string) => {
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext?.isLoggedIn || false;
  const [currentTree, setCurrentTree] = useState<CharacterTree | null>(null);
  const [trees, setTrees] = useState<CharacterTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<CharacterGroup[]>([]);
  const [isGroupingEnabled, setIsGroupingEnabled] = useState(false);

  const treeService = getTreeService(isLoggedIn);

  useEffect(() => {
    const loadTrees = async () => {
      try {
        setLoading(true);
        setError(null);
        const savedTrees = await treeService.getAllTrees();
        setTrees(savedTrees);
        
        if (treeId) {
          try {
            const tree = await treeService.getTree(treeId);
            setCurrentTree(tree);
          } catch (err) {
            console.error('Error loading specific tree:', err);
            setError('Failed to load tree');
          }
        }
      } catch (err) {
        console.error('Error loading trees:', err);
        setError('Failed to load trees');
      } finally {
        setLoading(false);
      }
    };

    loadTrees();
  }, [treeId, isLoggedIn]);

  const createTree = async (name: string, description?: string): Promise<CharacterTree> => {
    try {
      setError(null);
      const newTree = await treeService.createTree(name, description);
      setTrees(prev => [...prev, newTree]);
      setCurrentTree(newTree);
      return newTree;
    } catch (err) {
      console.error('Error creating tree:', err);
      setError('Failed to create tree');
      throw err;
    }
  };

  const updateTree = async (tree: CharacterTree) => {
    try {
      setError(null);
      const updatedTree = await treeService.updateTree(tree);
      
      setTrees(prev => prev.map(t => t.id === updatedTree.id ? updatedTree : t));
      if (currentTree?.id === updatedTree.id) {
        setCurrentTree(updatedTree);
      }
      
      return updatedTree;
    } catch (err) {
      console.error('Error updating tree:', err);
      setError('Failed to update tree');
      throw err;
    }
  };

  const deleteTree = async (treeId: string) => {
    try {
      setError(null);
      await treeService.deleteTree(treeId);
      setTrees(prev => prev.filter(t => t.id !== treeId));
      if (currentTree?.id === treeId) {
        setCurrentTree(null);
      }
    } catch (err) {
      console.error('Error deleting tree:', err);
      setError('Failed to delete tree');
      throw err;
    }
  };

  const addCharacter = async (character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => {
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

    await updateTree(updatedTree);
  };

  const updateCharacter = async (characterId: string, updates: Partial<Character>) => {
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

    await updateTree(updatedTree);
  };

  const deleteCharacter = async (characterId: string) => {
    if (!currentTree) return;

    const updatedTree = {
      ...currentTree,
      characters: currentTree.characters
        .filter(char => char.id !== characterId)
        .map(char => ({
          ...char,
          relationships: char.relationships.filter(rel => rel.targetCharacterId !== characterId)
        })),
      updatedAt: new Date()
    };

    await updateTree(updatedTree);
  };

  const addRelationship = async (characterId: string, relationship: Omit<Character['relationships'][0], 'id'>) => {
    if (!currentTree) return;

    const newRelationship = {
      ...relationship,
      id: uuidv4()
    };

    const updatedTree = {
      ...currentTree,
      characters: currentTree.characters.map(char =>
        char.id === characterId
          ? {
              ...char,
              relationships: [...char.relationships, newRelationship],
              updatedAt: new Date()
            }
          : char
      ),
      updatedAt: new Date()
    };

    await updateTree(updatedTree);
  };

  const removeRelationship = async (characterId: string, relationshipId: string) => {
    if (!currentTree) return;

    const updatedTree = {
      ...currentTree,
      characters: currentTree.characters.map(char =>
        char.id === characterId
          ? {
              ...char,
              relationships: char.relationships.filter(rel => rel.id !== relationshipId),
              updatedAt: new Date()
            }
          : char
      ),
      updatedAt: new Date()
    };

    await updateTree(updatedTree);
  };

  const updateCharacterPosition = async (characterId: string, position: { x: number; y: number }) => {
    if (!currentTree) return;

    const updatedTree = {
      ...currentTree,
      characters: currentTree.characters.map(char =>
        char.id === characterId
          ? { ...char, position, updatedAt: new Date() }
          : char
      ),
      updatedAt: new Date()
    };

    await updateTree(updatedTree);
  };

  // Group management functions
  const enableGrouping = () => {
    if (!currentTree) return;

    const result = CharacterGroupingManager.analyzeAndGroup(currentTree.characters);
    setGroups(result.groups);
    setIsGroupingEnabled(true);
  };

  const disableGrouping = () => {
    setGroups([]);
    setIsGroupingEnabled(false);
  };

  const addGroup = (group: Omit<CharacterGroup, 'id'>) => {
    const newGroup: CharacterGroup = {
      ...group,
      id: uuidv4()
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const updateGroup = (groupId: string, updates: Partial<CharacterGroup>) => {
    setGroups(prev => prev.map(group =>
      group.id === groupId ? { ...group, ...updates } : group
    ));
  };

  const removeGroup = (groupId: string) => {
    setGroups(prev => prev.filter(group => group.id !== groupId));
  };

  const addCharacterToGroup = (groupId: string, characterId: string) => {
    setGroups(prev => prev.map(group =>
      group.id === groupId
        ? { ...group, characterIds: [...group.characterIds, characterId] }
        : group
    ));
  };

  const removeCharacterFromGroup = (groupId: string, characterId: string) => {
    setGroups(prev => prev.map(group =>
      group.id === groupId
        ? { ...group, characterIds: group.characterIds.filter(id => id !== characterId) }
        : group
    ));
  };

  const moveCharacterToGroup = (characterId: string, fromGroupId: string, toGroupId: string) => {
    removeCharacterFromGroup(fromGroupId, characterId);
    addCharacterToGroup(toGroupId, characterId);
  };

  return {
    // Tree management
    currentTree,
    trees,
    loading,
    error,
    createTree,
    updateTree,
    deleteTree,
    
    // Character management
    addCharacter,
    updateCharacter,
    deleteCharacter,
    updateCharacterPosition,
    
    // Relationship management
    addRelationship,
    removeRelationship,
    
    // Group management
    groups,
    isGroupingEnabled,
    enableGrouping,
    disableGrouping,
    addGroup,
    updateGroup,
    removeGroup,
    addCharacterToGroup,
    removeCharacterFromGroup,
    moveCharacterToGroup
  };
};
