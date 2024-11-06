import React from 'react';
import { RefreshCw, RotateCcw, Settings, Lightbulb } from 'lucide-react';

interface ControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  currentDifficulty: 'easy' | 'medium' | 'hard';
  darkMode: boolean;
  onHintClick: () => void;
  hintsRemaining: number;
}

export const Controls: React.FC<ControlsProps> = ({
  onNewGame,
  onUndo,
  onDifficultyChange,
  currentDifficulty,
  darkMode,
  onHintClick,
  hintsRemaining,
}) => {
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={onNewGame}
          className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-lg transition-all duration-200 text-base md:text-lg ${
            darkMode 
              ? 'bg-blue-500/80 text-white hover:bg-blue-600/80' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } backdrop-blur-sm`}
        >
          <RefreshCw size={20} /> New Game
        </button>
        <button
          onClick={onUndo}
          className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-lg transition-all duration-200 text-base md:text-lg ${
            darkMode 
              ? 'bg-gray-700/80 text-white hover:bg-gray-600/80' 
              : 'bg-gray-500 text-white hover:bg-gray-600'
          } backdrop-blur-sm`}
        >
          <RotateCcw size={20} /> Undo
        </button>
        <button
          onClick={onHintClick}
          disabled={hintsRemaining === 0}
          className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-lg transition-all duration-200 text-base md:text-lg ${
            darkMode 
              ? hintsRemaining > 0 
                ? 'bg-yellow-600/80 text-white hover:bg-yellow-700/80' 
                : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
              : hintsRemaining > 0
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } backdrop-blur-sm`}
        >
          <Lightbulb size={20} /> Hints ({hintsRemaining})
        </button>
      </div>
      <div className="flex items-center gap-3">
        <Settings size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
        <select
          value={currentDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 text-base md:text-lg ${
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