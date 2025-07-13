'use client';

import { Plus } from 'lucide-react';

interface AddCharacterButtonProps {
  data: {
    onAdd: () => void;
  };
}

export function AddCharacterButton({ data }: AddCharacterButtonProps) {
  const { onAdd } = data;

  return (
    <button
      onClick={onAdd}
      className="
        relative w-16 h-16 
        bg-gradient-to-br from-green-400 to-emerald-600 
        hover:from-green-500 hover:to-emerald-700
        text-white rounded-full shadow-lg hover:shadow-xl 
        transition-all duration-300 transform hover:scale-110
        flex items-center justify-center
        border-4 border-green-200 hover:border-green-300
        before:absolute before:inset-0 before:rounded-full before:bg-white before:opacity-20
        group
      "
      title="Add New Character"
    >
      <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
      
      {/* Decorative elements to make it look more organic */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-60"></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-lime-400 rounded-full opacity-60"></div>
    </button>
  );
}
