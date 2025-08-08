'use client';

import { Handle, Position } from '@xyflow/react';
import { User, MapPin } from 'lucide-react';
import { Character } from '@/types/character';

interface CharacterNodeProps {
  data: {
    character: Character;
  };
}

export function CharacterNode({ data }: CharacterNodeProps) {
  const { character } = data;

  // Generate a consistent color based on character name
  const getCharacterColor = (name: string) => {
    const colors = [
      'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200',
      'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-200',
      'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-600 text-purple-800 dark:text-purple-200',
      'bg-pink-100 dark:bg-pink-900/40 border-pink-300 dark:border-pink-600 text-pink-800 dark:text-pink-200',
      'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200',
      'bg-orange-100 dark:bg-orange-900/40 border-orange-300 dark:border-orange-600 text-orange-800 dark:text-orange-200',
      'bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-600 text-red-800 dark:text-red-200',
      'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-600 text-indigo-800 dark:text-indigo-200',
      'bg-teal-100 dark:bg-teal-900/40 border-teal-300 dark:border-teal-600 text-teal-800 dark:text-teal-200',
      'bg-cyan-100 dark:bg-cyan-900/40 border-cyan-300 dark:border-cyan-600 text-cyan-800 dark:text-cyan-200',
    ];
    
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const colorClass = getCharacterColor(character.name);

  return (
    <div className="relative">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-6 h-6 bg-amber-600 dark:bg-amber-500 border-2 border-amber-800 dark:border-amber-600 rounded-full"
      />
      
      {/* Leaf-shaped character node */}
      <div className={`
        relative min-w-[220px] max-w-[280px] p-4 
        ${colorClass}
        border-2 shadow-lg hover:shadow-xl transition-all duration-300
        transform hover:scale-105
        rounded-tl-[60px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[60px]
        before:absolute before:top-0 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1
        before:w-1 before:h-4 before:bg-amber-700 before:rounded-full
      `}>
        
        {/* Character info */}
        <div className="space-y-2">
          {/* Name with icon */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="bg-white bg-opacity-70 p-1.5 rounded-full">
              <User className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm leading-tight">{character.name}</h3>
          </div>

          {/* Age and occupation in a compact row */}
          <div className="flex items-center space-x-3 text-xs opacity-80">
            {character.age && (
              <span className="bg-white bg-opacity-50 px-2 py-1 rounded-full">
                Age: {character.age}
              </span>
            )}
            {character.occupation && (
              <span className="bg-white bg-opacity-50 px-2 py-1 rounded-full">
                {character.occupation}
              </span>
            )}
          </div>

          {/* Description - truncated */}
          {character.description && (
            <div className="text-xs opacity-90 line-clamp-2 leading-relaxed">
              {character.description}
            </div>
          )}

          {/* Traits as small dots */}
          {character.traits.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {character.traits.slice(0, 4).map((trait, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-white bg-opacity-60 text-xs rounded-full font-medium"
                  title={trait}
                >
                  {trait.length > 8 ? trait.substring(0, 8) + '...' : trait}
                </span>
              ))}
              {character.traits.length > 4 && (
                <span className="px-2 py-0.5 bg-white dark:bg-gray-700 bg-opacity-60 dark:bg-opacity-80 text-xs rounded-full font-medium">
                  +{character.traits.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Relationships count */}
          {character.relationships.length > 0 && (
            <div className="text-xs opacity-70 flex items-center mt-2">
              <MapPin className="w-3 h-3 mr-1" />
              {character.relationships.length} connections
            </div>
          )}
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-6 h-6 bg-amber-600 dark:bg-amber-500 border-2 border-amber-800 dark:border-amber-600 rounded-full"
      />
    </div>
  );
}
