
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Award, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EMOJIS = ['☀️', '🌊', '🌸', '🐦', '🦋', '⭐'];

type CardState = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const createBoard = (): CardState[] => {
  const duplicatedEmojis = [...EMOJIS, ...EMOJIS];
  const shuffledEmojis = duplicatedEmojis.sort(() => Math.random() - 0.5);
  return shuffledEmojis.map((emoji, index) => ({
    id: index,
    emoji: emoji,
    isFlipped: false,
    isMatched: false,
  }));
};

const GameCard = ({ card, onCardClick }: { card: CardState; onCardClick: (id: number) => void; }) => {
  return (
    <div 
        className="aspect-square perspective-[1000px] cursor-pointer"
        onClick={() => onCardClick(card.id)}
    >
      <div 
        className={cn(
            "w-full h-full relative preserve-3d transition-transform duration-500",
            card.isFlipped && "rotate-y-180"
        )}
      >
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-primary/10 rounded-lg border-2 border-primary/20">
          <span className="text-3xl">❓</span>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center bg-background rounded-lg border-2 border-primary/50">
          <span className="text-4xl">{card.emoji}</span>
        </div>
      </div>
    </div>
  );
};


export function EmojiMemoryGame() {
  const { toast } = useToast();
  const [board, setBoard] = useState<CardState[]>(createBoard());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCardId, secondCardId] = flippedCards;
      const firstCard = board.find(c => c.id === firstCardId)!;
      const secondCard = board.find(c => c.id === secondCardId)!;

      if (firstCard.emoji === secondCard.emoji) {
        // Match
        setBoard(prevBoard =>
          prevBoard.map(card =>
            card.emoji === firstCard.emoji ? { ...card, isMatched: true } : card
          )
        );
        setFlippedCards([]);
      } else {
        // No match
        setTimeout(() => {
          setBoard(prevBoard =>
            prevBoard.map(card =>
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, board]);

  useEffect(() => {
    const allMatched = board.every(card => card.isMatched);
    if (allMatched && board.length > 0) {
      setIsWon(true);
      toast({
        title: "Congratulations! You won!",
        description: "You've earned a wellness badge!",
        action: <div className="p-2 bg-yellow-400 rounded-full"><Award className="text-white" /></div>,
      });
    }
  }, [board, toast]);

  const handleCardClick = (id: number) => {
    if (isWon || flippedCards.length === 2) return;

    const card = board.find(c => c.id === id)!;
    if (card.isFlipped) return;

    setBoard(prevBoard =>
      prevBoard.map(c =>
        c.id === id ? { ...c, isFlipped: true } : c
      )
    );
    setFlippedCards(prev => [...prev, id]);
  };

  const handleReset = () => {
    setBoard(createBoard());
    setFlippedCards([]);
    setMoves(0);
    setIsWon(false);
  };

  return (
     <Card className="w-full max-w-md mx-auto glassmorphism border-2 border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader>
            <CardTitle className="text-center font-headline gradient-text text-2xl">Emoji Memory Match</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
            <div className="grid grid-cols-4 gap-3 w-full">
              {board.map(card => (
                  <GameCard key={card.id} card={card} onCardClick={handleCardClick} />
              ))}
            </div>
            
            <div className="flex justify-between items-center w-full">
                <div className="text-lg font-semibold text-foreground/80">Moves: <span className="font-bold text-primary">{moves}</span></div>
                <Button onClick={handleReset} variant="outline" className="gap-2 bg-background/50 hover:bg-primary/10 hover:border-primary/50 transition-colors">
                    <RotateCcw className="w-4 h-4" />
                    Reset Game
                </Button>
            </div>

            {isWon && (
                <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="font-bold text-green-600 dark:text-green-400">You won! Great job focusing your mind.</p>
                </div>
            )}
        </CardContent>
    </Card>
  );
}
