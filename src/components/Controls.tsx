import React from 'react';
import { RefreshCw, RotateCcw, Settings } from 'lucide-react';

interface ControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  currentDifficulty: 'easy' | 'medium' | 'hard';
  darkMode: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  onNewGame,
  onUndo,
  onDifficultyChange,
  currentDifficulty,
  darkMode,
}) => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex gap-3">
        <button
          onClick={onNewGame}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 text-lg ${
            darkMode 
              ? 'bg-blue-500/80 text-white hover:bg-blue-600/80' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } backdrop-blur-sm`}
        >
          <RefreshCw size={24} /> New Game
        </button>
        <button
          onClick={onUndo}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 text-lg ${
            darkMode 
              ? 'bg-gray-700/80 text-white hover:bg-gray-600/80' 
              : 'bg-gray-500 text-white hover:bg-gray-600'
          } backdrop-blur-sm`}
        >
          <RotateCcw size={24} /> Undo
        </button>
      </div>
      <div className="flex items-center gap-3">
        <Settings size={24} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
        <select
          value={currentDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 text-lg ${
            darkMode 
              ? 'bg-gray-800/80 text-white border-gray-700 focus:ring-blue-500/50' 
              : 'bg-white border-gray-300 focus:ring-blue-500'
          } border focus:outline-none focus:ring-2 backdrop-blur-sm`}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>
  );
};