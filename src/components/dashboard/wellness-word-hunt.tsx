
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RotateCcw, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const words = [
  { word: "HOPE", found: false },
  { word: "CALM", found: false },
  { word: "PEACE", found: false },
  { word: "FOCUS", found: false },
  { word: "JOY", found: false },
];

const gridSize = 10;

// Function to place words in the grid
const generateGrid = () => {
    let grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    let localWords = words.map(w => ({ ...w, found: false }));

    localWords.forEach(({ word }) => {
        let placed = false;
        while (!placed) {
            const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);

            if (direction === 'horizontal' && col + word.length <= gridSize) {
                let canPlace = true;
                for (let i = 0; i < word.length; i++) {
                    if (grid[row][col + i] !== '') canPlace = false;
                }
                if (canPlace) {
                    for (let i = 0; i < word.length; i++) {
                        grid[row][col + i] = word[i];
                    }
                    placed = true;
                }
            } else if (direction === 'vertical' && row + word.length <= gridSize) {
                let canPlace = true;
                for (let i = 0; i < word.length; i++) {
                    if (grid[row + i][col] !== '') canPlace = false;
                }
                if (canPlace) {
                    for (let i = 0; i < word.length; i++) {
                        grid[row + i][col] = word[i];
                    }
                    placed = true;
                }
            }
        }
    });

    // Fill remaining spots with random letters
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
            }
        }
    }
    return { grid, localWords };
};

export function WellnessWordHunt() {
  const { toast } = useToast();
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordList, setWordList] = useState(words);
  const [selectedCells, setSelectedCells] = useState<{ r: number; c: number }[]>([]);
  const [isWon, setIsWon] = useState(false);

  const newGame = useCallback(() => {
    const { grid: newGrid, localWords } = generateGrid();
    setGrid(newGrid);
    setWordList(localWords);
    setSelectedCells([]);
    setIsWon(false);
  }, []);

  useEffect(() => {
    newGame();
  }, [newGame]);

  useEffect(() => {
    if (wordList.length > 0 && wordList.every(w => w.found)) {
      setIsWon(true);
      toast({
        title: "Congratulations!",
        description: "You've found all the wellness words!",
        action: <div className="p-2 bg-green-500 rounded-full"><CheckCircle className="text-white" /></div>,
      });
    }
  }, [wordList, toast]);

  const handleCellClick = (r: number, c: number) => {
    if (isWon) return;

    const newSelectedCells = [...selectedCells, { r, c }];
    setSelectedCells(newSelectedCells);

    const selectedWord = newSelectedCells.map(({ r, c }) => grid[r][c]).join('');
    const foundWord = wordList.find(w => w.word === selectedWord && !w.found);

    if (foundWord) {
      setWordList(prev => prev.map(w => w.word === foundWord.word ? { ...w, found: true } : w));
      toast({ title: `You found "${foundWord.word}"!`, className: 'bg-primary/20 border-primary/30' });
      setSelectedCells([]);
    } else {
      // Check if current selection is a prefix of any word
      const isPrefix = wordList.some(w => w.word.startsWith(selectedWord));
      if (!isPrefix) {
        setTimeout(() => setSelectedCells([]), 300);
      }
    }
  };
  
  const isCellSelected = (r: number, c: number) => selectedCells.some(cell => cell.r === r && cell.c === c);

  return (
    <Card className="w-full max-w-lg mx-auto glassmorphism border-2 border-primary/20 shadow-2xl shadow-primary/10">
      <CardHeader>
        <CardTitle className="text-center font-headline gradient-text text-2xl">Wellness Word Hunt</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="p-2 bg-background/30 rounded-lg border-2 border-primary/20 shadow-inner">
            <div className={`grid grid-cols-10 gap-1`}>
            {grid.map((row, r) =>
                row.map((letter, c) => (
                <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={cn(
                    "w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-sm md:text-base font-bold rounded-md transition-colors duration-150",
                    isCellSelected(r, c) ? "bg-primary text-primary-foreground scale-110" : "bg-white/10 hover:bg-white/20"
                    )}
                >
                    {letter}
                </button>
                ))
            )}
            </div>
        </div>
        
        <div className="w-full space-y-3">
            <h4 className="text-center font-semibold text-foreground/80">Words to Find:</h4>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {wordList.map(({ word, found }) => (
                    <span key={word} className={cn("text-lg font-medium transition-colors", found ? "line-through text-green-500" : "text-foreground")}>
                    {word}
                    </span>
                ))}
            </div>
        </div>

        <div className="flex justify-center">
            <Button onClick={newGame} variant="outline" className="gap-2 bg-background/50 hover:bg-primary/10 hover:border-primary/50 transition-colors">
                <RotateCcw className="w-4 h-4" />
                New Game
            </Button>
        </div>

        {isWon && (
            <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="font-bold text-green-600 dark:text-green-400">You found all the words! Well done.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
