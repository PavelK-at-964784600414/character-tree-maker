'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Character } from '@/types/character';

interface CharacterFormData {
  name: string;
  description: string;
  age?: number;
  occupation: string;
  traits: string[];
}

interface CharacterModalProps {
  character: Character | null;
  onSave: (character: CharacterFormData) => void;
  onDelete?: (characterId: string) => void;
  onClose: () => void;
}

export function CharacterModal({ character, onSave, onDelete, onClose }: CharacterModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    age: '',
    occupation: '',
    traits: [] as string[],
  });

  const [newTrait, setNewTrait] = useState('');

  useEffect(() => {
    if (character) {
      setFormData({
        name: character.name,
        description: character.description,
        age: character.age?.toString() || '',
        occupation: character.occupation || '',
        traits: [...character.traits],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        age: '',
        occupation: '',
        traits: [],
      });
    }
  }, [character]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Character name is required');
      return;
    }

    const characterData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined,
    };

    onSave(characterData);
  };

  const handleAddTrait = () => {
    if (newTrait.trim() && !formData.traits.includes(newTrait.trim())) {
      setFormData(prev => ({
        ...prev,
        traits: [...prev.traits, newTrait.trim()]
      }));
      setNewTrait('');
    }
  };

  const handleRemoveTrait = (traitToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      traits: prev.traits.filter(trait => trait !== traitToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTrait();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {character ? 'Edit Character' : 'Add New Character'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe this character..."
              />
            </div>

            {/* Age and Occupation */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Knight, Wizard, Merchant"
                />
              </div>
            </div>

            {/* Traits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Character Traits
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newTrait}
                  onChange={(e) => setNewTrait(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a trait..."
                />
                <button
                  type="button"
                  onClick={handleAddTrait}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.traits.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-sm rounded-full"
                    >
                      {trait}
                      <button
                        type="button"
                        onClick={() => handleRemoveTrait(trait)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t mt-6">
            <div>
              {character && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(character.id)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              )}
            </div>
            <div className="flex space-x-3">
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
                {character ? 'Update' : 'Create'} Character
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
