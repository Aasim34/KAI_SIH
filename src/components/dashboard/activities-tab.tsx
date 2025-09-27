
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RotateCcw, User, Users } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const GAME_ROOM_ID = "tic-tac-toe-lobby"; // Static room for this example

type PlayerSymbol = 'X' | 'O';
type BoardState = (PlayerSymbol | null)[];

interface GameState {
  board: BoardState;
  turn: PlayerSymbol;
  players: {
    X: string | null; // UID of player X
    O: string | null; // UID of player O
  };
  status: 'waiting' | 'playing' | 'finished';
  winner: PlayerSymbol | 'draw' | null;
}

const initialBoard = Array(9).fill(null);
const initialGameState: GameState = {
  board: initialBoard,
  turn: 'X',
  players: { X: null, O: null },
  status: 'waiting',
  winner: null,
};

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [playerSymbol, setPlayerSymbol] = useState<PlayerSymbol | null>(null);
  
  const gameRef = doc(db, "games", GAME_ROOM_ID);

  useEffect(() => {
    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as GameState;
        setGameState(data);
      } else {
        // If the game room doesn't exist, create it.
        setDoc(gameRef, initialGameState);
      }
    });

    return () => unsubscribe();
  }, [gameRef]);
  
  useEffect(() => {
    if (user && gameState.players) {
        if (gameState.players.X === user.uid) {
            setPlayerSymbol('X');
        } else if (gameState.players.O === user.uid) {
            setPlayerSymbol('O');
        } else {
            setPlayerSymbol(null);
        }
    }
  }, [user, gameState.players]);


  const handleJoinGame = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: "Authentication required" });
        return;
    }

    const docSnap = await getDoc(gameRef);
    if (!docSnap.exists()) {
        await setDoc(gameRef, initialGameState);
    }
    const currentGameSate = docSnap.data() as GameState || initialGameState;

    let symbol: PlayerSymbol | null = null;
    const newPlayers = { ...currentGameSate.players };

    if (!newPlayers.X) {
      newPlayers.X = user.uid;
      symbol = 'X';
    } else if (!newPlayers.O && newPlayers.X !== user.uid) {
      newPlayers.O = user.uid;
      symbol = 'O';
    } else if (newPlayers.X === user.uid) {
        symbol = 'X';
    } else if (newPlayers.O === user.uid) {
        symbol = 'O';
    } else {
        toast({ title: "Room is full", description: "You are spectating."});
        return;
    }

    setPlayerSymbol(symbol);
    const newStatus = newPlayers.X && newPlayers.O ? 'playing' : 'waiting';
    await updateDoc(gameRef, { players: newPlayers, status: newStatus });
    toast({ title: `You are player ${symbol}`});
  };


  const handleClick = async (i: number) => {
    if (!user || !playerSymbol) {
        toast({ variant: 'destructive', title: 'Not in game', description: 'Please join the game to play.' });
        return;
    }
    if (gameState.status !== 'playing') {
        toast({ variant: 'destructive', title: 'Game not active' });
        return;
    }
    if (gameState.winner || gameState.board[i]) {
      return;
    }
    if (gameState.turn !== playerSymbol) {
        toast({ variant: 'destructive', title: 'Not your turn' });
        return;
    }

    const newBoard = gameState.board.slice();
    newBoard[i] = playerSymbol;
    
    const winner = calculateWinner(newBoard);
    const isBoardFull = newBoard.every(square => square !== null);

    const newGameState: Partial<GameState> = {
        board: newBoard,
        turn: gameState.turn === 'X' ? 'O' : 'X',
    };

    if (winner) {
        newGameState.winner = winner;
        newGameState.status = 'finished';
    } else if (isBoardFull) {
        newGameState.winner = 'draw';
        newGameState.status = 'finished';
    }

    await updateDoc(gameRef, newGameState);
  };

  const handleReset = async () => {
    await setDoc(gameRef, initialGameState);
  };

  let status;
  if (gameState.status === 'waiting') {
    status = 'Waiting for opponent...';
  } else if (gameState.status === 'finished') {
      if (gameState.winner === 'draw') {
        status = "It's a Draw!";
      } else {
        status = `Winner: ${gameState.winner}`;
      }
  } else {
      status = `Next player: ${gameState.turn}`;
  }

  const canPlay = playerSymbol && gameState.status === 'playing';

  return (
    <div className="space-y-8 flex flex-col items-center">
        <h3 className="text-xl font-bold font-headline">Real-Time Tic-Tac-Toe</h3>
        
        {!user && <Alert variant="destructive"><AlertTitle>Please Sign In</AlertTitle><AlertDescription>You must be signed in to play.</AlertDescription></Alert>}

        <Card className="w-full max-w-md glassmorphism">
            <CardHeader>
                <CardTitle className="text-center font-headline gradient-text">Tic-Tac-Toe</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
                {gameState.status === 'waiting' && !playerSymbol && (
                    <Button onClick={handleJoinGame} disabled={!user}>Join Game</Button>
                )}

                <div className="flex gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" /> Player X: {gameState.players.X ? 'Joined' : '...'}
                    </div>
                     <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-green-500" /> Player O: {gameState.players.O ? 'Joined' : '...'}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {gameState.board.map((_, i) => (
                        <Square 
                            key={i} 
                            value={gameState.board[i]} 
                            onClick={() => handleClick(i)} 
                            isWinning={false} // Add logic for winning line highlight later
                        />
                    ))}
                </div>
                <div className="text-lg font-semibold text-foreground/80 dark:text-foreground/70 h-8">
                    {status}
                </div>
                <div className="flex gap-4">
                  {(playerSymbol || !canPlay) && <Button onClick={handleJoinGame} variant="secondary" className="gap-2 bg-background/50">
                        {playerSymbol ? `Joined as ${playerSymbol}` : 'Join Game'}
                    </Button> }
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

