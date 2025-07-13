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
      'bg-emerald-100 border-emerald-300 text-emerald-800',
      'bg-blue-100 border-blue-300 text-blue-800',
      'bg-purple-100 border-purple-300 text-purple-800',
      'bg-pink-100 border-pink-300 text-pink-800',
      'bg-yellow-100 border-yellow-300 text-yellow-800',
      'bg-orange-100 border-orange-300 text-orange-800',
      'bg-red-100 border-red-300 text-red-800',
      'bg-indigo-100 border-indigo-300 text-indigo-800',
      'bg-teal-100 border-teal-300 text-teal-800',
      'bg-cyan-100 border-cyan-300 text-cyan-800',
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
        className="w-3 h-3 bg-amber-600 border-2 border-amber-800 rounded-full"
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
                <span className="px-2 py-0.5 bg-white bg-opacity-60 text-xs rounded-full font-medium">
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
        className="w-3 h-3 bg-amber-600 border-2 border-amber-800 rounded-full"
      />
    </div>
  );
}
