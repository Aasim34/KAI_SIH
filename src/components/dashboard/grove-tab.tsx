
"use client";

import { Progress } from "@/components/ui/progress";

const gardenStages = [
    { icon: '🌱', name: 'Seedling', unlocked: true },
    { icon: '🌿', name: 'Sprout', unlocked: true },
    { icon: '🌳', name: 'Tree', unlocked: true },
    { icon: '🌸', name: 'Blossom', unlocked: false },
    { icon: '🌺', name: 'Flower', unlocked: false },
    { icon: '🌻', name: 'Sunflower', unlocked: false },
];

const audioSrc = "https://drive.google.com/uc?export=download&id=1GslP_W98m9hLJ_1DUMhtzPJp8W1KLfxx"; 

export function GroveTab() {
  return (
    <div className="space-y-8">
        <h3 className="text-xl font-bold font-headline">Your Mindful Grove</h3>
        <div className="glassmorphism p-6 rounded-xl mb-6">
            <h4 className="font-semibold mb-4 font-headline">Virtual Garden</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                {gardenStages.map(stage => (
                    <div key={stage.name} className={`text-center transition-opacity ${stage.unlocked ? 'opacity-100' : 'opacity-40'}`}>
                        <div className="text-5xl mb-2 flex items-center justify-center">{stage.icon}</div>
                        <div className="text-xs text-foreground/80 dark:text-foreground/70">{stage.name}</div>
                    </div>
                ))}
            </div>
            <div className="text-center">
                <p className="text-sm text-foreground/70 dark:text-foreground/60 mb-2">Grove Level 3 - Keep growing! 🌱</p>
                <Progress value={60} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-emerald-500" />
            </div>
        </div>
        
        <div className="glassmorphism p-6 rounded-xl">
            <h4 className="font-semibold mb-4 font-headline">🎵 Music Mood Lift</h4>
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <div className="font-semibold font-headline">Lofi Chill</div>
                    <div className="text-sm text-foreground/70 dark:text-foreground/60">Relaxing instrumental music</div>
                </div>
            </div>
            <div className="mt-4">
                <audio controls className="w-full">
                  <source src={audioSrc} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    </div>
  );
}
