import React, { useState, useCallback, useEffect } from 'react';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { NumberPad } from './components/NumberPad';
import { Hints } from './components/Hints';
import { generateSudoku, isValid, getPossibleNumbers } from './utils/sudoku';
import { Trophy, Moon, Sun } from 'lucide-react';

function App() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [board, setBoard] = useState<number[][]>([]);
  const [initialBoard, setInitialBoard] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<number[][][]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [possibilities, setPossibilities] = useState<number[]>([]);
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
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      setPossibilities(getPossibleNumbers(board, row, col));
    } else {
      setPossibilities([]);
    }
  }, [selectedCell, board]);

  const handleCellClick = (row: number, col: number) => {
    if (initialBoard[row][col] === 0) {
      setSelectedCell({ row, col });
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative py-12 px-4">
        <div className="w-[70vw] mx-auto flex flex-col items-center gap-8">
          <div className="flex items-center justify-between w-full max-w-[min(70vh,800px)]">
            <h1 className={`text-5xl font-bold transition-colors duration-300 ${
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
            onNewGame={startNewGame}
            onUndo={handleUndo}
            onDifficultyChange={setDifficulty}
            currentDifficulty={difficulty}
            darkMode={darkMode}
          />
          
          <div className="w-full max-w-[min(70vh,800px)] animate-fade-in">
            <Board
              board={board}
              initialBoard={initialBoard}
              selectedCell={selectedCell}
              errors={errors}
              onCellClick={handleCellClick}
              darkMode={darkMode}
            />
          </div>
          
          <Hints 
            possibilities={possibilities}
            onHintSelect={handleNumberSelect}
            darkMode={darkMode}
          />
          
          <div className="w-full max-w-[min(70vh,800px)]">
            <NumberPad
              onNumberSelect={handleNumberSelect}
              onClear={handleClear}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;