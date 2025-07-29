'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  Connection,
  Edge,
  BackgroundVariant,
  Node,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../styles/vine-edges.css';

import { CharacterTree } from '@/types/character';
import { CharacterNode } from './CharacterNode';
import { AddCharacterButton } from './AddCharacterButton';
import { GroupLabelNode } from './GroupLabelNode';
import { CharacterModal } from './CharacterModal';
import { RelationshipModal } from './RelationshipModal';
import { RelationshipEditModal } from './RelationshipEditModal';
import { VineEdge } from './VineEdge';
import { useCharacterTree } from '@/hooks/useCharacterTree';
import { RelationshipType, Relationship } from '@/types/character';

const nodeTypes = {
  character: CharacterNode,
  addButton: AddCharacterButton,
  groupLabel: GroupLabelNode,
};

const edgeTypes = {
  vine: VineEdge,
};

interface CharacterTreeViewProps {
  tree: CharacterTree;
}

export function CharacterTreeView({ tree }: CharacterTreeViewProps) {
  const { 
    updateCharacter, 
    addCharacter, 
    deleteCharacter, 
    addRelationship, 
    updateRelationship, 
    deleteRelationship, 
    currentTree,
    groups,
    isGroupingEnabled,
    toggleGrouping,
    updateGroupPosition
  } = useCharacterTree(tree.id);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [showRelationshipEditModal, setShowRelationshipEditModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<{
    relationship: Relationship;
    sourceCharacterId: string;
  } | null>(null);
  const [pendingConnection, setPendingConnection] = useState<{
    source: string;
    target: string;
  } | null>(null);

  // Use currentTree from hook instead of prop to get real-time updates
  const activeTree = currentTree || tree;

  // Convert characters to nodes
  const initialNodes: Node[] = useMemo(() => {
    console.log('Generating nodes from characters:', activeTree.characters);
    const characterNodes = activeTree.characters.map((character) => ({
      id: character.id,
      type: 'character',
      position: character.position,
      data: { character },
    }));

    // Add group label nodes if grouping is enabled
    const groupLabelNodes = isGroupingEnabled ? groups.map((group) => ({
      id: `group-${group.relationshipType}`,
      type: 'groupLabel',
      position: { x: group.position.x, y: group.position.y },
      data: { 
        groupType: group.relationshipType,
        characterCount: group.characterIds.length 
      },
      draggable: true, // Make group labels draggable
    })) : [];

    // Add button for adding new characters
    const addButtonNode = {
      id: 'add-button',
      type: 'addButton',
      position: { x: 50, y: 50 },
      data: { onAdd: () => setShowCharacterModal(true) },
    };

    return [addButtonNode, ...characterNodes, ...groupLabelNodes];
  }, [activeTree.characters, groups, isGroupingEnabled]);

  // Convert relationships to edges
  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    
    activeTree.characters.forEach((character) => {
      character.relationships.forEach((relationship) => {
        edges.push({
          id: `${character.id}-${relationship.targetCharacterId}`,
          source: character.id,
          target: relationship.targetCharacterId,
          type: 'vine', // Use custom vine edge for leaf decorations
          label: relationship.type, // Use relationship type as primary label
          animated: true,
          style: { 
            stroke: '#16a34a', 
            strokeWidth: 5,
            strokeDasharray: '0',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          },
          markerEnd: {
            type: MarkerType.Arrow,
            color: '#16a34a',
            width: 20,
            height: 20,
          },
          labelStyle: { 
            fontSize: '11px', 
            fontWeight: '600',
            fill: '#15803d',
            backgroundColor: '#dcfce7',
            padding: '4px 8px',
            borderRadius: '12px',
            border: '1px solid #22c55e'
          },
        });
      });
    });

    return edges;
  }, [activeTree.characters]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target && params.source !== params.target) {
        setPendingConnection({
          source: params.source,
          target: params.target
        });
        setShowRelationshipModal(true);
      }
    },
    []
  );

  // Handle node position changes
  const handleNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'character') {
      updateCharacter(node.id, {
        position: node.position
      });
    } else if (node.type === 'groupLabel' && isGroupingEnabled) {
      // When group label is moved, move all characters in the group
      const groupId = node.id.replace('group-', '');
      const group = groups.find(g => g.relationshipType === groupId);
      
      if (group) {
        const deltaX = node.position.x - group.position.x;
        const deltaY = node.position.y - group.position.y;
        
        // Update group position
        updateGroupPosition(group.id, { x: node.position.x, y: node.position.y });
        
        // Update character positions relative to the group
        group.characterIds.forEach(characterId => {
          const character = activeTree.characters.find(c => c.id === characterId);
          if (character) {
            updateCharacter(characterId, {
              position: {
                x: character.position.x + deltaX,
                y: character.position.y + deltaY
              }
            });
          }
        });
      }
    }
  }, [updateCharacter, updateGroupPosition, isGroupingEnabled, groups, activeTree.characters]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'character') {
      setSelectedCharacter(node.id);
      setShowCharacterModal(true);
    }
  }, []);

  const handleSaveCharacter = useCallback((characterData: {
    name: string;
    description: string;
    age?: number;
    occupation: string;
    traits: string[];
  }) => {
    if (selectedCharacter) {
      // Update existing character
      updateCharacter(selectedCharacter, characterData);
    } else {
      // Add new character with stable positioning
      const existingCharacters = activeTree.characters.length;
      const newPosition = {
        x: 200 + (existingCharacters * 150), // Spread horizontally
        y: 200 + (existingCharacters % 3) * 100, // Stagger vertically
      };
      
      console.log('Adding new character:', { ...characterData, position: newPosition });
      
      addCharacter({
        ...characterData,
        position: newPosition,
        relationships: [],
      });
    }
    
    setShowCharacterModal(false);
    setSelectedCharacter(null);
  }, [selectedCharacter, updateCharacter, addCharacter, activeTree.characters.length]);

  const handleDeleteCharacter = useCallback((characterId: string) => {
    deleteCharacter(characterId);
    setShowCharacterModal(false);
    setSelectedCharacter(null);
  }, [deleteCharacter]);

  const handleSaveRelationship = useCallback((type: RelationshipType, description?: string) => {
    if (pendingConnection) {
      addRelationship(pendingConnection.source, pendingConnection.target, type, description);
      setShowRelationshipModal(false);
      setPendingConnection(null);
    }
  }, [pendingConnection, addRelationship]);

  const handleCloseRelationshipModal = useCallback(() => {
    setShowRelationshipModal(false);
    setPendingConnection(null);
  }, []);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    
    // Find the relationship data
    const sourceCharacterId = edge.source;
    const targetCharacterId = edge.target;
    
    const sourceCharacter = activeTree.characters.find(c => c.id === sourceCharacterId);
    if (sourceCharacter) {
      const relationship = sourceCharacter.relationships.find(rel => 
        rel.targetCharacterId === targetCharacterId
      );
      
      if (relationship) {
        setSelectedRelationship({
          relationship,
          sourceCharacterId
        });
        setShowRelationshipEditModal(true);
      }
    }
  }, [activeTree.characters]);

  const handleUpdateRelationship = useCallback((relationshipId: string, type: RelationshipType, description?: string) => {
    if (selectedRelationship) {
      updateRelationship(selectedRelationship.sourceCharacterId, relationshipId, type, description);
      setShowRelationshipEditModal(false);
      setSelectedRelationship(null);
    }
  }, [selectedRelationship, updateRelationship]);

  const handleDeleteRelationship = useCallback((relationshipId: string) => {
    if (selectedRelationship) {
      deleteRelationship(selectedRelationship.sourceCharacterId, relationshipId);
      setShowRelationshipEditModal(false);
      setSelectedRelationship(null);
    }
  }, [selectedRelationship, deleteRelationship]);

  const handleCloseRelationshipEditModal = useCallback(() => {
    setShowRelationshipEditModal(false);
    setSelectedRelationship(null);
  }, []);

  // Update nodes when characters change
  React.useEffect(() => {
    console.log('Updating nodes, activeTree characters:', activeTree.characters.length);
    setNodes(initialNodes);
  }, [initialNodes, setNodes, activeTree.characters.length]);

  // Update edges when relationships change
  React.useEffect(() => {
    console.log('Updating edges, total relationships:', activeTree.characters.reduce((sum, char) => sum + char.relationships.length, 0));
    setEdges(initialEdges);
  }, [initialEdges, setEdges, activeTree.characters]);

  return (
    <div className="w-full h-[600px] border-2 border-green-200 dark:border-green-700 rounded-lg bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 overflow-hidden relative">
      {/* Grouping Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleGrouping}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all duration-200
            ${isGroupingEnabled 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border-2 border-green-600 dark:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
            }
          `}
        >
          {isGroupingEnabled ? '🔗 Grouped' : '📊 Group'}
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDragStop={handleNodeDragStop}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="top-right"
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        defaultEdgeOptions={{
          type: 'vine',
          style: { 
            stroke: '#16a34a', 
            strokeWidth: 5,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          },
          markerEnd: {
            type: MarkerType.Arrow,
            color: '#16a34a',
            width: 20,
            height: 20,
          }
        }}
        connectionLineStyle={{
          stroke: '#16a34a',
          strokeWidth: 3,
          strokeDasharray: '5,5',
        }}
      >
        <MiniMap 
          nodeStrokeColor={(n) => {
            if (n.type === 'character') return '#059669';
            return '#10b981';
          }}
          nodeColor={(n) => {
            if (n.type === 'character') return '#d1fae5';
            return '#6ee7b7';
          }}
          maskColor="rgba(16, 185, 129, 0.1)"
          style={{
            backgroundColor: '#f0fdf4',
            border: '2px solid #bbf7d0',
            borderRadius: '8px',
          }}
        />
        <Controls 
          style={{
            backgroundColor: '#f0fdf4',
            border: '2px solid #bbf7d0',
            borderRadius: '8px',
          }}
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={2} 
          color="#bbf7d0"
          style={{
            backgroundColor: 'transparent'
          }}
        />
      </ReactFlow>

      {showCharacterModal && (
        <CharacterModal
          character={selectedCharacter ? activeTree.characters.find(c => c.id === selectedCharacter) || null : null}
          onSave={handleSaveCharacter}
          onDelete={selectedCharacter ? handleDeleteCharacter : undefined}
          onClose={() => {
            setShowCharacterModal(false);
            setSelectedCharacter(null);
          }}
        />
      )}

      {showRelationshipModal && pendingConnection && (
        <RelationshipModal
          sourceCharacterName={
            activeTree.characters.find(c => c.id === pendingConnection.source)?.name || 'Unknown'
          }
          targetCharacterName={
            activeTree.characters.find(c => c.id === pendingConnection.target)?.name || 'Unknown'
          }
          onSave={handleSaveRelationship}
          onClose={handleCloseRelationshipModal}
        />
      )}

      {showRelationshipEditModal && selectedRelationship && (
        <RelationshipEditModal
          relationship={selectedRelationship.relationship}
          sourceCharacterName={
            activeTree.characters.find(c => c.id === selectedRelationship.sourceCharacterId)?.name || 'Unknown'
          }
          targetCharacterName={
            activeTree.characters.find(c => c.id === selectedRelationship.relationship.targetCharacterId)?.name || 'Unknown'
          }
          onUpdate={handleUpdateRelationship}
          onDelete={handleDeleteRelationship}
          onClose={handleCloseRelationshipEditModal}
        />
      )}
    </div>
  );
}
