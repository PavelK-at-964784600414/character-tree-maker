'use client';

import React, { useState } from 'react';
import { useCharacterTree } from '@/hooks/useCharacterTree-new';

export default function TreeManager() {
  const {
    trees,
    currentTree,
    loading,
    error,
    createTree,
    deleteTree,
  } = useCharacterTree();

  const [newTreeName, setNewTreeName] = useState('');
  const [newTreeDescription, setNewTreeDescription] = useState('');

  const handleCreateTree = async () => {
    if (!newTreeName.trim()) return;
    
    try {
      await createTree(newTreeName, newTreeDescription);
      setNewTreeName('');
      setNewTreeDescription('');
    } catch (err) {
      console.error('Failed to create tree:', err);
    }
  };

  const handleDeleteTree = async (treeId: string) => {
    if (confirm('Are you sure you want to delete this tree?')) {
      try {
        await deleteTree(treeId);
      } catch (err) {
        console.error('Failed to delete tree:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading trees...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Character Trees</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Create New Tree */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Tree</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Tree name"
            value={newTreeName}
            onChange={(e) => setNewTreeName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-gray-900"
          />
          <textarea
            placeholder="Description (optional)"
            value={newTreeDescription}
            onChange={(e) => setNewTreeDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded h-20 text-gray-900"
          />
          <button
            onClick={handleCreateTree}
            disabled={!newTreeName.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Create Tree
          </button>
        </div>
      </div>

      {/* Current Tree */}
      {currentTree && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Current Tree</h2>
          <div>
            <strong>{currentTree.name}</strong>
            {currentTree.description && (
              <p className="text-gray-600 mt-1">{currentTree.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {currentTree.characters.length} characters
            </p>
          </div>
        </div>
      )}

      {/* Trees List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Trees</h2>
        {trees.length === 0 ? (
          <p className="text-gray-500">No trees created yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trees.map((tree) => (
              <div
                key={tree.id}
                className="border border-gray-200 p-4 rounded-lg"
              >
                <h3 className="font-semibold text-lg mb-2">{tree.name}</h3>
                {tree.description && (
                  <p className="text-gray-600 text-sm mb-2">{tree.description}</p>
                )}
                <p className="text-sm text-gray-500 mb-3">
                  {tree.characters.length} characters
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Created: {tree.createdAt.toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.location.href = `/tree/${tree.id}`}
                    className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleDeleteTree(tree.id)}
                    className="bg-red-500 text-white px-3 py-1 text-sm rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
