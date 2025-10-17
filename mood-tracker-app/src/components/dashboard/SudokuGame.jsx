// src/components/dashboard/SudokuGame.jsx
import React, { useState, useEffect } from 'react';
import { Grid3x3, RotateCcw, Lightbulb, Trophy, Sparkles } from 'lucide-react';

const SudokuGame = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [difficulty, setDifficulty] = useState('easy');
  const [grid, setGrid] = useState([]);
  const [initialGrid, setInitialGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [errors, setErrors] = useState(0);
  const [hints, setHints] = useState(3);
  const [completed, setCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Générer un sudoku basique
  const generateSudoku = (level) => {
    // Grille solution complète basique
    const baseGrid = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    const cellsToRemove = level === 'easy' ? 30 : level === 'medium' ? 45 : 55;
    const newGrid = baseGrid.map(row => [...row]);
    const initial = baseGrid.map(row => [...row]);

    // Retirer des cellules aléatoirement
    let removed = 0;
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (initial[row][col] !== 0) {
        initial[row][col] = 0;
        removed++;
      }
    }

    return { grid: newGrid, initial };
  };

  const startNewGame = (level) => {
    const { grid: newGrid, initial } = generateSudoku(level);
    setGrid(initial.map(row => [...row]));
    setInitialGrid(initial.map(row => [...row]));
    setDifficulty(level);
    setErrors(0);
    setHints(3);
    setCompleted(false);
    setSelectedCell(null);
    setTimer(0);
    setIsRunning(true);
    setShowSplash(false);
  };

  useEffect(() => {
    // Ne pas lancer automatiquement, attendre le splash screen
  }, []);

  // Timer
  useEffect(() => {
    let interval;
    if (isRunning && !completed) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, completed]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isValid = (grid, row, col, num) => {
    // Vérifier ligne
    for (let x = 0; x < 9; x++) {
      if (x !== col && grid[row][x] === num) return false;
    }
    // Vérifier colonne
    for (let x = 0; x < 9; x++) {
      if (x !== row && grid[x][col] === num) return false;
    }
    // Vérifier carré 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const r = startRow + i;
        const c = startCol + j;
        if ((r !== row || c !== col) && grid[r][c] === num) return false;
      }
    }
    return true;
  };

  const handleCellClick = (row, col) => {
    if (initialGrid[row][col] === 0 && !completed) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberClick = (num) => {
    if (!selectedCell || completed) return;
    const { row, col } = selectedCell;
    
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = num;

    if (!isValid(newGrid, row, col, num)) {
      setErrors(prev => prev + 1);
    }

    setGrid(newGrid);
    setSelectedCell(null);

    // Vérifier victoire
    checkWin(newGrid);
  };

  const checkWin = (currentGrid) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentGrid[i][j] === 0 || !isValid(currentGrid, i, j, currentGrid[i][j])) {
          return;
        }
      }
    }
    setCompleted(true);
    setIsRunning(false);
  };

  const handleHint = () => {
    if (hints === 0 || completed) return;
    
    // Trouver une cellule vide
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] === 0 && initialGrid[i][j] === 0) {
          const newGrid = grid.map(r => [...r]);
          // Résoudre cette cellule (simplification)
          for (let num = 1; num <= 9; num++) {
            if (isValid(newGrid, i, j, num)) {
              newGrid[i][j] = num;
              setGrid(newGrid);
              setHints(prev => prev - 1);
              return;
            }
          }
        }
      }
    }
  };

  const handleErase = () => {
    if (!selectedCell || completed) return;
    const { row, col } = selectedCell;
    if (initialGrid[row][col] === 0) {
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = 0;
      setGrid(newGrid);
    }
  };

  return (
    <div className="card h-full flex flex-col">
      {showSplash ? (
        // Splash Screen Simple
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center">
            <div className="text-8xl mb-6 animate-bounce">🎲</div>
            <h2 className="text-5xl font-bold text-amber-900 mb-8">Sudoku</h2>
            
            <button
              onClick={() => startNewGame('easy')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:scale-110 transition-transform shadow-2xl"
            >
              Jouer
            </button>
          </div>
        </div>
      ) : (
        // Jeu Sudoku
        <>
      {/* Header */}
      <div className="card-header justify-between">
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-5 h-5" />
          <span className="font-semibold">Sudoku</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded-full font-bold">
            ⏱️ {formatTime(timer)}
          </span>
          <span className="bg-orange-200 text-orange-700 px-2 py-1 rounded-full font-bold">
            ❌ {errors}
          </span>
          <span className="bg-yellow-200 text-yellow-700 px-2 py-1 rounded-full font-bold">
            💡 {hints}
          </span>
        </div>
      </div>

      {/* Difficulté */}
      <div className="flex gap-2 mb-4">
        {['easy', 'medium', 'hard'].map(level => (
          <button
            key={level}
            onClick={() => startNewGame(level)}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
              difficulty === level
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            {level === 'easy' ? '😊 Facile' : level === 'medium' ? '😐 Moyen' : '😤 Difficile'}
          </button>
        ))}
      </div>

      {/* Grille Sudoku */}
      <div className="flex-1 flex items-center justify-center mb-4">
        <div className="grid grid-cols-9 gap-0 bg-amber-900 p-1 rounded-lg shadow-xl">
          {grid.map((row, i) =>
            row.map((cell, j) => {
              const isInitial = initialGrid[i][j] !== 0;
              const isSelected = selectedCell?.row === i && selectedCell?.col === j;
              const isInvalid = cell !== 0 && !isValid(grid, i, j, cell);
              const isRightEdge = (j + 1) % 3 === 0 && j !== 8;
              const isBottomEdge = (i + 1) % 3 === 0 && i !== 8;

              return (
                <button
                  key={`${i}-${j}`}
                  onClick={() => handleCellClick(i, j)}
                  disabled={isInitial || completed}
                  className={`
                    w-8 h-8 flex items-center justify-center font-bold text-sm
                    ${isInitial ? 'bg-amber-200 text-amber-900 cursor-default' : 'bg-white text-amber-900 cursor-pointer hover:bg-blue-100'}
                    ${isSelected ? 'bg-blue-300 ring-2 ring-blue-500' : ''}
                    ${isInvalid ? 'bg-red-200 text-red-700' : ''}
                    ${isRightEdge ? 'border-r-2 border-amber-900' : ''}
                    ${isBottomEdge ? 'border-b-2 border-amber-900' : ''}
                    transition-all
                  `}
                >
                  {cell !== 0 ? cell : ''}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Contrôles - Chiffres */}
      {selectedCell && !completed && (
        <div className="grid grid-cols-5 gap-2 mb-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold py-2 rounded-lg hover:scale-105 transition-transform shadow-md"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleErase}
            className="bg-amber-300 text-amber-900 font-bold py-2 rounded-lg hover:scale-105 transition-transform shadow-md"
          >
            ❌
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => startNewGame(difficulty)}
          className="flex-1 bg-gradient-to-r from-orange-400 to-amber-500 text-white py-2 rounded-lg font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Nouveau
        </button>
        <button
          onClick={handleHint}
          disabled={hints === 0 || completed}
          className={`flex-1 py-2 rounded-lg font-semibold transition-transform shadow-md flex items-center justify-center gap-2 ${
            hints > 0 && !completed
              ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          Indice
        </button>
      </div>

      {/* Message de victoire */}
      {completed && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl text-center border-2 border-green-300 animate-in">
          <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="font-bold text-green-700 text-lg mb-1">🎉 Bravo !</p>
          <p className="text-sm text-green-600">Temps: {formatTime(timer)}</p>
          <p className="text-xs text-green-600 mt-1">Erreurs: {errors}</p>
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default SudokuGame;
