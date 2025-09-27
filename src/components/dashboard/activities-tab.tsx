
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';

const Square = ({ value, onClick }: { value: string | null, onClick: () => void }) => {
  return (
    <button 
      onClick={onClick} 
      className={cn(
        "w-20 h-20 md:w-24 md:h-24 bg-background/50 rounded-lg flex items-center justify-center text-4xl md:text-5xl font-bold transition-all duration-200 ease-in-out transform hover:scale-105",
        value === 'X' ? 'text-primary' : 'text-green-500'
      )}
    >
      {value}
    </button>
  );
};

const calculateWinner = (squares: (string | null)[]) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export function ActivitiesTab() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  
  const winner = calculateWinner(board);
  const isBoardFull = board.every(square => square !== null);

  const handleClick = (i: number) => {
    if (winner || board[i]) {
      return;
    }
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isBoardFull) {
    status = 'It\'s a Draw!';
  } else {
    status = `Next player: ${isXNext ? 'X' : 'O'}`;
  }

  return (
    <div className="space-y-8 flex flex-col items-center">
        <h3 className="text-xl font-bold font-headline">Activities & Games</h3>
        
        <Card className="w-full max-w-md glassmorphism">
            <CardHeader>
                <CardTitle className="text-center font-headline gradient-text">Tic-Tac-Toe</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    {board.map((_, i) => (
                        <Square key={i} value={board[i]} onClick={() => handleClick(i)} />
                    ))}
                </div>
                <div className="text-lg font-semibold text-foreground/80 dark:text-foreground/70 h-8">
                    {status}
                </div>
                <Button onClick={handleReset} variant="outline" className="gap-2 bg-background/50">
                    <RotateCcw className="w-4 h-4" />
                    Reset Game
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
