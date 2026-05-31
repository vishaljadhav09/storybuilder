import React, { useState, useEffect } from 'react';

export default function TicTacToePOC() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // true = Human (X), false = AI (O)
  const [level, setLevel] = useState(1); // 1 = Easy, 2 = Medium, 3 = Impossible
  const [winner, setWinner] = useState(null); // 'X', 'O', 'Tie', or null

  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  // --- GAME LOGIC HELPERS ---

  const checkWinner = (currentBoard) => {
    for (let line of winningLines) {
      const [a, b, c] = line;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    if (!currentBoard.includes(null)) return 'Tie';
    return null;
  };

  // --- AI ENGINES ---

  // Level 1: Random Choice
  const getRandomMove = (currentBoard) => {
    const openSpaces = currentBoard.map((val, idx) => val === null ? idx : null).filter(v => v !== null);
    return openSpaces[Math.floor(Math.random() * openSpaces.length)];
  };

  // Level 2: Smart Blocker / Opportunist
  const getMediumMove = (currentBoard) => {
    function findCrucialCell(player) {
      for (let line of winningLines) {
        const markers = line.map(index => currentBoard[index]);
        const playerCount = markers.filter(m => m === player).length;
        const nullCount = markers.filter(m => m === null).length;
        if (playerCount === 2 && nullCount === 1) {
          return line[markers.indexOf(null)];
        }
      }
      return null;
    }

    // 1. Can AI win right now?
    let move = findCrucialCell('O');
    if (move !== null) return move;

    // 2. Is Human about to win? Block them.
    move = findCrucialCell('X');
    if (move !== null) return move;

    // 3. Otherwise, pick randomly
    return getRandomMove(currentBoard);
  };

  // Level 3: Unbeatable Minimax
  const getBestMoveMinimax = (currentBoard) => {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        currentBoard[i] = 'O';
        let score = minimax(currentBoard, 0, false);
        currentBoard[i] = null; // Backtrack
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const minimax = (tempBoard, depth, isMaximizing) => {
    const result = checkWinner(tempBoard);
    if (result === 'O') return 10 - depth; // Prioritize winning faster
    if (result === 'X') return depth - 10; // Prioritize delaying human win
    if (result === 'Tie') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (tempBoard[i] === null) {
          tempBoard[i] = 'O';
          let score = minimax(tempBoard, depth + 1, false);
          tempBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (tempBoard[i] === null) {
          tempBoard[i] = 'X';
          let score = minimax(tempBoard, depth + 1, true);
          tempBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  // --- GAME INTERACTION FLOW ---

  // Trigger AI move when it's AI's turn
  useEffect(() => {
    if (!isXNext && !winner) {
      // Small intentional delay so the AI feels natural, not instant
      const timer = setTimeout(() => {
        let aiMove;
        if (level === 1) aiMove = getRandomMove(board);
        else if (level === 2) aiMove = getMediumMove(board);
        else aiMove = getBestMoveMinimax(board);

        if (aiMove !== undefined && aiMove !== null) {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);
          
          const gameResult = checkWinner(newBoard);
          if (gameResult) {
            setWinner(gameResult);
          } else {
            setIsXNext(true);
          }
        }
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [isXNext, board, level, winner]);

  // Handle Human Click
  const handleClick = (index) => {
    if (board[index] || !isXNext || winner) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
    } else {
      setIsXNext(false); // Give turn to AI
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-100 p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-700">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent mb-6">
          Tic-Tac-Toe 
        </h1>

        {/* Level Controls */}
        <div className="flex justify-between bg-slate-950 p-1.5 rounded-xl mb-6 border border-slate-800">
          {[1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              onClick={() => { setLevel(lvl); resetGame(); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                level === lvl 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl === 1 ? 'Easy' : lvl === 2 ? 'Medium' : 'Impossible'}
            </button>
          ))}
        </div>

        {/* Status Messaging */}
        <div className="text-center h-8 mb-4 font-medium text-lg">
          {winner ? (
            winner === 'Tie' ? (
              <span className="text-amber-400">It's a Draw! 🤝</span>
            ) : (
              <span className={winner === 'X' ? 'text-blue-400' : 'text-pink-400'}>
                {winner === 'X' ? 'You Won! 🎉' : 'AI Won! 🤖'}
              </span>
            )
          ) : (
            <span className="text-slate-400">
              {isXNext ? 'Your turn (X)' : 'AI thinking... (O)'}
            </span>
          )}
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 aspect-square">
          {board.map((cell, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              disabled={cell !== null || !isXNext || !!winner}
              className={`aspect-square text-4xl font-black rounded-lg transition-all duration-150 flex items-center justify-center select-none
                ${!cell && isXNext && !winner ? 'bg-slate-800 hover:bg-slate-700 cursor-pointer' : 'bg-slate-900'}
                ${cell === 'X' ? 'text-blue-400' : 'text-pink-400'}
              `}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Reset Button */}
        <button
          onClick={resetGame}
          className="mt-6 w-full py-3 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white font-bold rounded-xl transition-colors tracking-wide shadow"
        >
          Reset Match
        </button>
      </div>
    </div>
  );
}
