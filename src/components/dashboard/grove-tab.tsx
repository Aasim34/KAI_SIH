
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

export function GroveTab() {
  return (
    <div className="space-y-8">
        <h3 className="text-xl font-bold font-headline">Your Mindful Grove</h3>
        
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="glassmorphism p-6 rounded-xl">
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
                <iframe 
                    width="100%" 
                    height="166" 
                    scrolling="no" 
                    frameBorder="no" 
                    allow="autoplay" 
                    src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/209919652&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
                </iframe>
            </div>
        </div>
    </div>
  );
}
