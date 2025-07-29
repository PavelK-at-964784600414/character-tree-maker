'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { RelationshipType } from '@/types/character';

interface RelationshipModalProps {
  sourceCharacterName: string;
  targetCharacterName: string;
  onSave: (type: RelationshipType, description?: string) => void;
  onClose: () => void;
}

export function RelationshipModal({ 
  sourceCharacterName, 
  targetCharacterName, 
  onSave, 
  onClose 
}: RelationshipModalProps) {
  const [relationshipType, setRelationshipType] = useState<RelationshipType>(RelationshipType.FRIEND);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Description is now optional - we can save with just the relationship type
    onSave(relationshipType, description.trim() || undefined);
  };

  const relationshipOptions = [
    { value: RelationshipType.PARENT, label: 'Parent' },
    { value: RelationshipType.CHILD, label: 'Child' },
    { value: RelationshipType.SIBLING, label: 'Sibling' },
    { value: RelationshipType.SPOUSE, label: 'Spouse/Partner' },
    { value: RelationshipType.FRIEND, label: 'Friend' },
    { value: RelationshipType.ENEMY, label: 'Enemy' },
    { value: RelationshipType.COLLEAGUE, label: 'Colleague' },
    { value: RelationshipType.MENTOR, label: 'Mentor' },
    { value: RelationshipType.STUDENT, label: 'Student' },
    { value: RelationshipType.OTHER, label: 'Other' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add Relationship</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <strong>{sourceCharacterName}</strong> is connected to <strong>{targetCharacterName}</strong>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship Type
              </label>
              <select
                value={relationshipType}
                onChange={(e) => setRelationshipType(e.target.value as RelationshipType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {relationshipOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add additional details about this relationship..."
              />
              <p className="text-xs text-gray-500 mt-1">
                The relationship type will be used for grouping and connections.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Create Relationship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
