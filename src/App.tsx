import React, { useState, useCallback, useEffect } from 'react';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { NumberPad } from './components/NumberPad';
import { Hints } from './components/Hints';
import { generateSudoku, isValid, getPossibleNumbers } from './utils/sudoku';
import { Trophy, Moon, Sun } from 'lucide-react';
import { ConfirmDialog } from './components/ConfirmDialog';

function App() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [board, setBoard] = useState<number[][]>([]);
  const [initialBoard, setInitialBoard] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<number[][][]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [possibilities, setPossibilities] = useState<number[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(12);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const startNewGame = useCallback(() => {
    const newBoard = generateSudoku(difficulty);
    setBoard(newBoard.map(row => [...row]));
    setInitialBoard(newBoard.map(row => [...row]));
    setSelectedCell(null);
    setErrors(new Set());
    setHistory([]);
    setIsComplete(false);
    setPossibilities([]);
    setShowHints(false);
    setHintsRemaining(difficulty === 'easy' ? 12 : difficulty === 'medium' ? 7 : 5);
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (selectedCell && showHints && hintsRemaining > 0) {
      const { row, col } = selectedCell;
      setPossibilities(getPossibleNumbers(board, row, col));
    } else {
      setPossibilities([]);
    }
  }, [selectedCell, board, showHints, hintsRemaining]);

  const handleCellClick = (row: number, col: number) => {
    if (initialBoard[row][col] === 0) {
      setSelectedCell({ row, col });
      setShowHints(false);
    }
  };

  const handleNumberSelect = (num: number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    
    if (initialBoard[row][col] !== 0) return;
    
    setHistory(prev => [...prev, board.map(row => [...row])]);
    
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = num;
    
    const newErrors = new Set(errors);
    if (!isValid(newBoard, row, col, num)) {
      newErrors.add(`${row}-${col}`);
    } else {
      newErrors.delete(`${row}-${col}`);
    }
    
    setBoard(newBoard);
    setErrors(newErrors);
    
    const isCompleted = newBoard.every((row, i) =>
      row.every((cell, j) => cell !== 0 && !newErrors.has(`${i}-${j}`))
    );
    setIsComplete(isCompleted);
  };

  const handleClear = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    
    if (initialBoard[row][col] !== 0) return;
    
    setHistory(prev => [...prev, board.map(row => [...row])]);
    
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = 0;
    
    const newErrors = new Set(errors);
    newErrors.delete(`${row}-${col}`);
    
    setBoard(newBoard);
    setErrors(newErrors);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    
    const previousBoard = history[history.length - 1];
    setBoard(previousBoard);
    setHistory(prev => prev.slice(0, -1));
    
    const newErrors = new Set<string>();
    previousBoard.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell !== 0 && !isValid(previousBoard, i, j, cell)) {
          newErrors.add(`${i}-${j}`);
        }
      });
    });
    setErrors(newErrors);
  };

  const handleHintClick = () => {
    if (hintsRemaining > 0 && selectedCell) {
      setShowHints(true);
      setHintsRemaining(prev => prev - 1);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative py-6 px-4 max-w-[min(95vw,800px)] mx-auto">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-between w-full">
            <h1 className={`text-3xl md:text-5xl font-bold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>Sudoku</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full transition-colors duration-300 ${
                darkMode 
                  ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
          
          {isComplete && (
            <div className="animate-bounce-slow flex items-center gap-2 p-4 bg-green-500/90 backdrop-blur-sm text-white rounded-lg text-lg">
              <Trophy className="w-7 h-7" />
              <span className="font-medium">Congratulations! Puzzle completed!</span>
            </div>
          )}
          
          <Controls
            onNewGame={() => setShowConfirmDialog(true)}
            onUndo={handleUndo}
            onDifficultyChange={setDifficulty}
            currentDifficulty={difficulty}
            darkMode={darkMode}
            onHintClick={handleHintClick}
            hintsRemaining={hintsRemaining}
          />
          
          <div className="w-full">
            <Board
              board={board}
              initialBoard={initialBoard}
              selectedCell={selectedCell}
              errors={errors}
              onCellClick={handleCellClick}
              darkMode={darkMode}
            />
          </div>
          
          {showHints && (
            <Hints 
              possibilities={possibilities}
              onHintSelect={handleNumberSelect}
              darkMode={darkMode}
            />
          )}
          
          <div className="w-full">
            <NumberPad
              onNumberSelect={handleNumberSelect}
              onClear={handleClear}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          startNewGame();
          setShowConfirmDialog(false);
        }}
        darkMode={darkMode}
      />
    </div>
  );
}

export default App;