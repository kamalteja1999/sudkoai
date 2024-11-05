import React from 'react';
import { Lightbulb } from 'lucide-react';

interface HintsProps {
  possibilities: number[];
  onHintSelect: (num: number) => void;
  darkMode: boolean;
}

export const Hints: React.FC<HintsProps> = ({ possibilities, onHintSelect, darkMode }) => {
  if (possibilities.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <Lightbulb size={24} className={darkMode ? 'text-yellow-300' : 'text-yellow-500'} />
        <span className="text-lg font-medium">Possible numbers:</span>
      </div>
      <div className="flex gap-2">
        {possibilities.map((num) => (
          <button
            key={num}
            onClick={() => onHintSelect(num)}
            className={`w-10 h-10 flex items-center justify-center text-lg font-medium rounded-lg transition-all duration-200 ${
              darkMode 
                ? 'bg-yellow-900/50 text-yellow-300 hover:bg-yellow-800/50' 
                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
            } backdrop-blur-sm`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};