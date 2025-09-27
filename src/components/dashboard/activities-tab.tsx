
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type PlayerSymbol = 'X' | 'O';
type BoardState = (PlayerSymbol | null)[];

const initialBoard = Array(9).fill(null);

const calculateWinner = (squares: BoardState) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const Square = ({ value, onClick, isWinning }: { value: string | null, onClick: () => void, isWinning: boolean }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-20 h-20 md:w-24 md:h-24 bg-background/50 rounded-lg flex items-center justify-center text-4xl md:text-5xl font-bold transition-all duration-200 ease-in-out transform hover:scale-105",
        value === 'X' ? 'text-primary' : 'text-green-500',
        isWinning && 'bg-yellow-400/50'
      )}
    >
      {value}
    </button>
  );
};


export function ActivitiesTab() {
  const { toast } = useToast();
  const [board, setBoard] = useState<BoardState>(initialBoard);
  const [turn, setTurn] = useState<PlayerSymbol>('X'); // X is human, O is computer
  const [winner, setWinner] = useState<PlayerSymbol | 'draw' | null>(null);

  const computerMove = (currentBoard: BoardState) => {
    // 1. Check if computer can win
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const newBoard = [...currentBoard];
        newBoard[i] = 'O';
        if (calculateWinner(newBoard) === 'O') {
          return i;
        }
      }
    }

    // 2. Check if player can win and block
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const newBoard = [...currentBoard];
        newBoard[i] = 'X';
        if (calculateWinner(newBoard) === 'X') {
          return i;
        }
      }
    }

    // 3. Take center if available
    if (!currentBoard[4]) {
      return 4;
    }

    // 4. Take a random corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !currentBoard[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // 5. Take a random side
    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter(i => !currentBoard[i]);
    if (availableSides.length > 0) {
      return availableSides[Math.floor(Math.random() * availableSides.length)];
    }

    // Should not happen in a normal game
    return currentBoard.findIndex(sq => sq === null);
  };
  
  useEffect(() => {
    if (turn === 'O' && !winner) {
        const timeoutId = setTimeout(() => {
            const bestMove = computerMove(board);
            if (bestMove !== -1) {
                handleClick(bestMove, 'O');
            }
        }, 500); // Add a small delay for computer move
        return () => clearTimeout(timeoutId);
    }
  }, [turn, board, winner]);


  const handleClick = (i: number, player: PlayerSymbol) => {
    if (winner || board[i] || player !== turn) {
      return;
    }

    const newBoard = [...board];
    newBoard[i] = player;
    setBoard(newBoard);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else if (newBoard.every(square => square !== null)) {
      setWinner('draw');
    } else {
      setTurn(player === 'X' ? 'O' : 'X');
    }
  };

  const handleReset = () => {
    setBoard(initialBoard);
    setTurn('X');
    setWinner(null);
  };

  let status;
  if (winner) {
    if (winner === 'draw') {
      status = "It's a Draw!";
    } else {
      status = `Winner: ${winner === 'X' ? 'You' : 'Computer'}`;
    }
  } else {
    status = `Turn: ${turn === 'X' ? 'Your' : 'Computer'}`;
  }

  return (
    <div className="space-y-8 flex flex-col items-center">
        <h3 className="text-xl font-bold font-headline">Mindful Tic-Tac-Toe</h3>
        
        <Card className="w-full max-w-md glassmorphism">
            <CardHeader>
                <CardTitle className="text-center font-headline gradient-text">Tic-Tac-Toe</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
                <div className="flex gap-4 mb-4 text-sm">
                    <p className="text-foreground/80 dark:text-foreground/70">You are <span className="font-bold text-primary">'X'</span> and the computer is <span className="font-bold text-green-500">'O'</span>.</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {board.map((square, i) => (
                        <Square 
                            key={i} 
                            value={square} 
                            onClick={() => handleClick(i, 'X')} 
                            isWinning={false} // Add logic for winning line highlight later
                        />
                    ))}
                </div>
                <div className="text-lg font-semibold text-foreground/80 dark:text-foreground/70 h-8">
                    {status}
                </div>
                <div className="flex gap-4">
                   <Button onClick={handleReset} variant="outline" className="gap-2 bg-background/50">
                        <RotateCcw className="w-4 h-4" />
                        Reset Game
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
