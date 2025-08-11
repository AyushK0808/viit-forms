import React from 'react';
import { Save, Check, AlertCircle } from 'lucide-react';

interface AutoSaveStatusProps {
  status: 'saving' | 'saved' | 'error' | 'idle';
  lastSavedTime?: string;
}

const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({ status, lastSavedTime }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'saving':
        return <Save className="w-4 h-4 animate-pulse text-yellow-400" />;
      case 'saved':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return lastSavedTime ? `Saved ${lastSavedTime}` : 'Saved';
      case 'error':
        return 'Save failed';
      default:
        return '';
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'saving':
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-900/20';
      case 'saved':
        return 'text-green-400 border-green-400/30 bg-green-900/20';
      case 'error':
        return 'text-red-400 border-red-400/30 bg-red-900/20';
      default:
        return 'text-gray-400 border-gray-400/30 bg-gray-900/20';
    }
  };

  if (status === 'idle') return <div className="h-8 w-0"></div>; // Invisible placeholder to maintain height

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border backdrop-blur-sm ${getStatusClass()}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
};

export default AutoSaveStatus;
