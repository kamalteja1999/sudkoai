// Sudoku game logic
export const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num && x !== col) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num && x !== row) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3), startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num && 
          (i + startRow !== row || j + startCol !== col)) return false;
    }
  }

  return true;
};

export const getPossibleNumbers = (board: number[][], row: number, col: number): number[] => {
  if (board[row][col] !== 0) return [];
  
  const possibilities: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      possibilities.push(num);
    }
  }
  return possibilities;
};

export const generateSudoku = (difficulty: 'easy' | 'medium' | 'hard'): number[][] => {
  const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
  
  // Fill diagonal boxes first
  for (let box = 0; box < 9; box += 3) {
    fillBox(board, box, box);
  }
  
  // Fill remaining cells
  solveSudoku(board);
  
  // Remove numbers based on difficulty
  const cellsToRemove = {
    easy: 30,
    medium: 40,
    hard: 50
  }[difficulty];
  
  return removeNumbers(board, cellsToRemove);
};

const fillBox = (board: number[][], row: number, col: number): void => {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const randomIndex = Math.floor(Math.random() * nums.length);
      board[row + i][col + j] = nums[randomIndex];
      nums.splice(randomIndex, 1);
    }
  }
};

const solveSudoku = (board: number[][]): boolean => {
  let row = 0, col = 0, isEmpty = false;
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        row = i;
        col = j;
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) break;
  }
  
  if (!isEmpty) return true;
  
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudoku(board)) return true;
      board[row][col] = 0;
    }
  }
  
  return false;
};

const removeNumbers = (board: number[][], count: number): number[][] => {
  const result = board.map(row => [...row]);
  let removed = 0;
  
  while (removed < count) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (result[row][col] !== 0) {
      result[row][col] = 0;
      removed++;
    }
  }
  
  return result;
};