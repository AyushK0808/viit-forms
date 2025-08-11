import React from 'react';
import { Save, Clock } from 'lucide-react';

interface RestoreDialogProps {
  isOpen: boolean;
  onRestore: () => void;
  onDiscard: () => void;
  lastSavedTime: string;
}

const RestoreDialog: React.FC<RestoreDialogProps> = ({
  isOpen,
  onRestore,
  onDiscard,
  lastSavedTime
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-purple-500/30 shadow-2xl">
        <div className="flex items-center mb-4">
          <Save className="w-6 h-6 text-purple-400 mr-3" />
          <h3 className="text-xl font-semibold text-white">Saved Progress Found</h3>
        </div>
        
        <p className="text-gray-300 mb-4">
          Would you like to continue where you left off?
        </p>
        
        <div className="flex items-center text-sm text-gray-400 mb-6">
          <Clock className="w-4 h-4 mr-2" />
          <span>Last saved: {lastSavedTime}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onDiscard}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-gray-600/30"
          >
            Start Fresh
          </button>
          <button
            onClick={onRestore}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-purple-500/30"
          >
            Continue Previous
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreDialog;
