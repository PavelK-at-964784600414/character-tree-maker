'use client';

import { X, Calendar, Users, Trash2 } from 'lucide-react';
import { CharacterTree } from '@/types/character';
import { useCharacterTree } from '@/hooks/useCharacterTree';

interface TreeSelectorProps {
  trees: CharacterTree[];
  onClose: () => void;
}

export function TreeSelector({ trees, onClose }: TreeSelectorProps) {
  const { deleteTree } = useCharacterTree();

  const handleSelectTree = (treeId: string) => {
    // Use Next.js router or simple redirect
    const url = new URL(window.location.href);
    url.searchParams.set('tree', treeId);
    window.location.href = url.toString();
  };

  const handleDeleteTree = (treeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this tree? This action cannot be undone.')) {
      deleteTree(treeId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Select a Character Tree</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {trees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No character trees found. Create your first tree to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {trees.map((tree) => (
                <div
                  key={tree.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 border-gray-200`}
                  onClick={() => handleSelectTree(tree.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{tree.name}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {tree.characters.length} characters
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {tree.updatedAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteTree(tree.id, e)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                      title="Delete tree"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
