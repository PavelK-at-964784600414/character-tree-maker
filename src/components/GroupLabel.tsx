'use client';

import React from 'react';
import { CharacterGroup, RelationshipType } from '@/types/character';

interface GroupLabelProps {
  group: CharacterGroup;
  onClick?: (group: CharacterGroup) => void;
}

export function GroupLabel({ group, onClick }: GroupLabelProps) {
  const getGroupColor = (type: RelationshipType): string => {
    const colors: Record<RelationshipType, string> = {
      [RelationshipType.PARENT]: 'bg-blue-100 border-blue-300 text-blue-800',
      [RelationshipType.CHILD]: 'bg-green-100 border-green-300 text-green-800',
      [RelationshipType.SIBLING]: 'bg-purple-100 border-purple-300 text-purple-800',
      [RelationshipType.SPOUSE]: 'bg-pink-100 border-pink-300 text-pink-800',
      [RelationshipType.FRIEND]: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      [RelationshipType.ENEMY]: 'bg-red-100 border-red-300 text-red-800',
      [RelationshipType.COLLEAGUE]: 'bg-indigo-100 border-indigo-300 text-indigo-800',
      [RelationshipType.MENTOR]: 'bg-orange-100 border-orange-300 text-orange-800',
      [RelationshipType.STUDENT]: 'bg-teal-100 border-teal-300 text-teal-800',
      [RelationshipType.OTHER]: 'bg-gray-100 border-gray-300 text-gray-800',
    };
    return colors[type] || colors[RelationshipType.OTHER];
  };

  const getGroupIcon = (type: RelationshipType): string => {
    const icons: Record<RelationshipType, string> = {
      [RelationshipType.PARENT]: '👨‍👩‍👧‍👦',
      [RelationshipType.CHILD]: '🧒',
      [RelationshipType.SIBLING]: '👫',
      [RelationshipType.SPOUSE]: '💑',
      [RelationshipType.FRIEND]: '👥',
      [RelationshipType.ENEMY]: '⚔️',
      [RelationshipType.COLLEAGUE]: '💼',
      [RelationshipType.MENTOR]: '🎓',
      [RelationshipType.STUDENT]: '📚',
      [RelationshipType.OTHER]: '🔗',
    };
    return icons[type] || icons[RelationshipType.OTHER];
  };

  return (
    <div
      className={`
        absolute pointer-events-auto
        px-4 py-2 rounded-t-lg border-b-2 shadow-sm
        transform -translate-x-1/2
        font-bold text-sm backdrop-blur-sm
        ${getGroupColor(group.relationshipType)}
        border-b-current
      `}
      style={{
        left: group.position.x,
        top: group.position.y - 10,
        zIndex: 1000,
        minWidth: '120px',
        textAlign: 'center'
      }}
      onClick={() => onClick?.(group)}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-base">{getGroupIcon(group.relationshipType)}</span>
        <span>{group.label}</span>
      </div>
    </div>
  );
}
