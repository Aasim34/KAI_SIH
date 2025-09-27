
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';
import { EmojiMemoryGame } from './emoji-memory-game';
import { WellnessWordHunt } from './wellness-word-hunt';

type PlayerSymbol = 'X' | 'O';
type BoardState = (PlayerSymbol | null)[];

const initialBoard = Array(9).fill(null);

const calculateWinner = (squares: BoardState): { winner: PlayerSymbol | null; line: number[] | null } => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
};

const Square = ({ value, onClick, isWinning, index }: { value: PlayerSymbol | null, onClick: () => void, isWinning: boolean, index: number }) => {
  const borderClasses = [
      "border-b-2 border-r-2", // 0
      "border-b-2 border-r-2", // 1
      "border-b-2",             // 2
      "border-b-2 border-r-2", // 3
      "border-b-2 border-r-2", // 4
      "border-b-2",             // 5
      "border-r-2",             // 6
      "border-r-2",             // 7
      "",                       // 8
  ];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-20 h-20 md:w-24 md:h-24 bg-white/10 flex items-center justify-center text-4xl md:text-5xl font-bold transition-all duration-200 ease-in-out transform hover:scale-105 hover:bg-white/20 border-primary/20",
        value === 'X' ? 'text-primary' : 'text-green-400',
        isWinning && 'bg-primary/30',
        borderClasses[index]
      )}
    >
      {value}
    </button>
  );
};


export function ActivitiesTab() {
  const [board, setBoard] = useState<BoardState>(initialBoard);
  const [turn, setTurn] = useState<PlayerSymbol>('X'); // X is human, O is computer
  const [gameResult, setGameResult] = useState<{ winner: PlayerSymbol | 'draw' | null; line: number[] | null }>({ winner: null, line: null });

  const computerMove = (currentBoard: BoardState): number => {
    const availableSpots = currentBoard
        .map((spot, index) => (spot === null ? index : null))
        .filter(index => index !== null) as number[];

    if (availableSpots.length > 0) {
        return availableSpots[Math.floor(Math.random() * availableSpots.length)];
    }

    return -1; // Should not happen if game is not over
  };
  
  useEffect(() => {
    if (turn === 'O' && !gameResult.winner) {
        const timeoutId = setTimeout(() => {
            const bestMove = computerMove(board);
            if (bestMove !== -1) {
                handleClick(bestMove, 'O');
            }
        }, 600); // Add a small delay for computer move
        return () => clearTimeout(timeoutId);
    }
  }, [turn, board, gameResult.winner]);


  const handleClick = (i: number, player: PlayerSymbol) => {
    if (gameResult.winner || board[i] || player !== turn) {
      return;
    }

    const newBoard = [...board];
    newBoard[i] = player;
    setBoard(newBoard);

    const { winner, line } = calculateWinner(newBoard);
    if (winner) {
      setGameResult({ winner, line });
    } else if (newBoard.every(square => square !== null)) {
      setGameResult({ winner: 'draw', line: null });
    } else {
      setTurn(player === 'X' ? 'O' : 'X');
    }
  };

  const handleReset = () => {
    setBoard(initialBoard);
    setTurn('X');
    setGameResult({ winner: null, line: null });
  };

  let status;
  if (gameResult.winner) {
    if (gameResult.winner === 'draw') {
      status = "It's a Draw!";
    } else {
      status = gameResult.winner === 'X' ? 'Congratulations, you win!' : 'Good game! Better luck next time.';
    }
  } else {
    status = `${turn === 'X' ? 'Your Turn' : "Computer's Turn"}`;
  }

  return (
    <div className="space-y-8">
        <Card className="w-full max-w-md mx-auto glassmorphism border-2 border-primary/20 shadow-2xl shadow-primary/10">
            <CardHeader>
                <CardTitle className="text-center font-headline gradient-text text-2xl">Mindful Tic-Tac-Toe</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
                <div className="flex gap-4 text-sm text-center">
                    <p className="text-foreground/80 dark:text-foreground/70">You are <span className="font-bold text-primary">'X'</span> and the computer is <span className="font-bold text-green-400">'O'</span>.</p>
                </div>

                <div className="p-2 bg-background/30 rounded-lg border-2 border-primary/20 shadow-inner grid grid-cols-3">
                  {board.map((square, i) => (
                      <Square 
                          key={i}
                          index={i}
                          value={square} 
                          onClick={() => handleClick(i, 'X')} 
                          isWinning={gameResult.line?.includes(i) ?? false}
                      />
                  ))}
                </div>
                <div className="text-xl font-semibold text-foreground/80 dark:text-foreground/70 h-8">
                    {status}
                </div>
                <div className="flex gap-4">
                   <Button onClick={handleReset} variant="outline" className="gap-2 bg-background/50 hover:bg-primary/10 hover:border-primary/50 transition-colors">
                        <RotateCcw className="w-4 h-4" />
                        Reset Game
                    </Button>
                </div>
            </CardContent>
        </Card>
        
        <EmojiMemoryGame />

        <WellnessWordHunt />
    </div>
  );
}
