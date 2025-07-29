'use client';

import { RelationshipType } from '@/types/character';

interface GroupLabelNodeProps {
  data: {
    groupType: RelationshipType;
    characterCount: number;
  };
}

export function GroupLabelNode({ data }: GroupLabelNodeProps) {
  const { groupType, characterCount } = data;

  const getGroupColor = (type: RelationshipType) => {
    switch (type) {
      case RelationshipType.PARENT:
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case RelationshipType.CHILD:
        return 'bg-green-100 text-green-800 border-green-300';
      case RelationshipType.SIBLING:
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case RelationshipType.SPOUSE:
        return 'bg-pink-100 text-pink-800 border-pink-300';
      case RelationshipType.FRIEND:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case RelationshipType.ENEMY:
        return 'bg-red-100 text-red-800 border-red-300';
      case RelationshipType.COLLEAGUE:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case RelationshipType.MENTOR:
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case RelationshipType.STUDENT:
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatLabel = (type: RelationshipType) => {
    switch (type) {
      case RelationshipType.PARENT:
        return 'Parents';
      case RelationshipType.CHILD:
        return 'Children';
      case RelationshipType.SIBLING:
        return 'Siblings';
      case RelationshipType.SPOUSE:
        return 'Spouses/Partners';
      case RelationshipType.FRIEND:
        return 'Friends';
      case RelationshipType.ENEMY:
        return 'Enemies';
      case RelationshipType.COLLEAGUE:
        return 'Colleagues';
      case RelationshipType.MENTOR:
        return 'Mentors';
      case RelationshipType.STUDENT:
        return 'Students';
      default:
        return 'Others';
    }
  };

  return (
    <div className={`px-3 py-1 rounded-md border text-sm font-medium ${getGroupColor(groupType)}`}>
      {formatLabel(groupType)} ({characterCount})
    </div>
  );
}
