'use client';

import { useState, useEffect } from 'react';
import { Plus, FolderOpen, Download, Upload } from 'lucide-react';
import { useCharacterTree } from '@/hooks/useCharacterTree';
import { CharacterTreeView } from '@/components/CharacterTreeView';
import { TreeSelector } from '@/components/TreeSelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StorageManager } from '@/utils/storage';

export default function Home() {
  const [treeId, setTreeId] = useState<string | null>(null);
  
  // Get tree ID from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const treeParam = urlParams.get('tree');
    setTreeId(treeParam);
  }, []);

  const { currentTree, trees, loading, createTree } = useCharacterTree(treeId || undefined);
  const [showTreeSelector, setShowTreeSelector] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTreeName, setNewTreeName] = useState('');

  const handleCreateTree = () => {
    if (newTreeName.trim()) {
      createTree(newTreeName.trim());
      setNewTreeName('');
      setShowCreateDialog(false);
    }
  };

  const handleExportData = () => {
    const data = StorageManager.exportTrees();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'character-trees.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = e.target?.result as string;
          StorageManager.importTrees(jsonData);
          window.location.reload(); // Refresh to load new data
        } catch {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Character Tree Maker</h1>
              {currentTree && (
                <span className="ml-4 text-lg text-gray-600 dark:text-gray-300">- {currentTree.name}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              <button
                onClick={() => setShowTreeSelector(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Select Tree
              </button>
              
              <button
                onClick={() => setShowCreateDialog(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Tree
              </button>
              
              <button
                onClick={handleExportData}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Download className="w-4 h-4" />
              </button>
              
              <label className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTree ? (
          <CharacterTreeView tree={currentTree} />
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-6 w-24 h-24 mx-auto flex items-center justify-center mb-6">
                <Plus className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Create Your First Character Tree
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Start building your character relationships and stories with our intuitive tree maker.
              </p>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Tree
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Tree Selector Modal */}
      {showTreeSelector && (
        <TreeSelector
          trees={trees}
          onClose={() => setShowTreeSelector(false)}
        />
      )}

      {/* Create Tree Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New Tree</h2>
            <input
              type="text"
              value={newTreeName}
              onChange={(e) => setNewTreeName(e.target.value)}
              placeholder="Enter tree name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTree}
                disabled={!newTreeName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
