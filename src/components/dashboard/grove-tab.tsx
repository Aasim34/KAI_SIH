import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

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
                <Button size="icon" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full w-12 h-12">
                    <Play className="w-6 h-6 fill-white" />
                </Button>
                <div className="flex-1">
                    <div className="font-semibold font-headline">Peaceful Forest Sounds</div>
                    <div className="text-sm text-foreground/70 dark:text-foreground/60">Relaxing nature ambience</div>
                </div>
                <div className="text-sm text-foreground/70 dark:text-foreground/60">3:45</div>
            </div>
        </div>
    </div>
  );
}
