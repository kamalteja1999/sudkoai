import React from 'react';
import { Cell } from './Cell';

interface BoardProps {
  board: number[][];
  initialBoard: number[][];
  selectedCell: { row: number; col: number } | null;
  errors: Set<string>;
  onCellClick: (row: number, col: number) => void;
  darkMode: boolean;
}

export const Board: React.FC<BoardProps> = ({
  board,
  initialBoard,
  selectedCell,
  errors,
  onCellClick,
  darkMode,
}) => {
  const isHighlighted = (row: number, col: number) => {
    if (!selectedCell) return false;
    return (
      row === selectedCell.row ||
      col === selectedCell.col ||
      (Math.floor(row / 3) === Math.floor(selectedCell.row / 3) &&
        Math.floor(col / 3) === Math.floor(selectedCell.col / 3))
    );
  };

  return (
    <div className={`grid grid-cols-9 gap-[1px] p-[1px] rounded-lg shadow-xl transition-all duration-300 ${
      darkMode ? 'bg-gray-600/30' : 'bg-gray-300'
    } backdrop-blur-sm`}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`aspect-square ${
              colIndex % 3 === 2 && colIndex !== 8 
                ? darkMode ? 'border-r-2 border-gray-600/50' : 'border-r-2 border-gray-400' 
                : ''
            } ${
              rowIndex % 3 === 2 && rowIndex !== 8 
                ? darkMode ? 'border-b-2 border-gray-600/50' : 'border-b-2 border-gray-400'
                : ''
            }`}
          >
            <Cell
              value={cell}
              isInitial={initialBoard[rowIndex][colIndex] !== 0}
              isSelected={
                selectedCell?.row === rowIndex && selectedCell?.col === colIndex
              }
              isHighlighted={isHighlighted(rowIndex, colIndex)}
              hasError={errors.has(`${rowIndex}-${colIndex}`)}
              onClick={() => onCellClick(rowIndex, colIndex)}
              darkMode={darkMode}
            />
          </div>
        ))
      )}
    </div>
  );
};