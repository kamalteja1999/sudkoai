import React from 'react';

interface NumberPadProps {
  onNumberSelect: (num: number) => void;
  onClear: () => void;
  darkMode: boolean;
}

export const NumberPad: React.FC<NumberPadProps> = ({ onNumberSelect, onClear, darkMode }) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          onClick={() => onNumberSelect(num)}
          className={`aspect-square flex items-center justify-center text-2xl font-medium rounded-lg shadow-lg transition-all duration-200 ${
            darkMode 
              ? 'bg-gray-800/70 text-white hover:bg-gray-700/70' 
              : 'bg-white text-gray-800 hover:bg-blue-50'
          } backdrop-blur-sm`}
        >
          {num}
        </button>
      ))}
      <button
        onClick={onClear}
        className={`aspect-square flex items-center justify-center text-2xl font-medium rounded-lg shadow-lg transition-all duration-200 ${
          darkMode 
            ? 'bg-red-900/70 text-red-300 hover:bg-red-800/70' 
            : 'bg-red-100 text-red-600 hover:bg-red-200'
        } backdrop-blur-sm`}
      >
        ⌫
      </button>
    </div>
  );
};