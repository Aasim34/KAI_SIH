"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';

export function MindGames() {
    const { toast } = useToast();
    const [moodFeedback, setMoodFeedback] = useState('');
    const [reframeOutput, setReframeOutput] = useState('');
    const [breathingTimer, setBreathingTimer] = useState(60);
    const [isBreathing, setIsBreathing] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isBreathing && breathingTimer > 0) {
            interval = setInterval(() => {
                setBreathingTimer(timer => timer - 1);
            }, 1000);
        } else if (isBreathing && breathingTimer === 0) {
            setIsBreathing(false);
            setBreathingTimer(60);
            toast({ title: 'Breathing Complete!', description: "Great job focusing on your breath." });
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isBreathing, breathingTimer, toast]);

    const selectMood = (mood: number) => {
        const messages: { [key: number]: string } = {
            1: "I'm here for you. Let's work through this together.",
            2: "It's okay to have tough days. You're not alone.",
            3: "Neutral is perfectly fine. How can I help brighten your day?",
            4: "Great to hear you're doing well! Keep it up!",
            5: "Wonderful! Your positive energy is contagious!"
        };
        setMoodFeedback(messages[mood]);
    };

    const reframeWorry = () => {
        const reframes = [
            "This challenge is an opportunity for growth and learning.",
            "I have overcome difficulties before, and I can do it again.",
            "This situation is temporary and will pass.",
            "I can focus on what I can control and let go of what I can't.",
        ];
        setReframeOutput(reframes[Math.floor(Math.random() * reframes.length)]);
    };
    
    return (
        <div>
            <h3 className="text-xl font-bold mb-4 font-headline">Mind Relaxing Games</h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="glassmorphism p-6 rounded-xl">
                    <h4 className="font-semibold mb-3 font-headline">🤔 Random Reflection</h4>
                    <p className="text-sm text-foreground/70 dark:text-foreground/60 mb-3">What's one thing you're grateful for today?</p>
                    <Textarea className="bg-background/50" rows={3} placeholder="Share your thoughts..." />
                    <Button onClick={() => toast({ title: "Reflection Saved" })} className="mt-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm">Reflect</Button>
                </div>
                <div className="glassmorphism p-6 rounded-xl">
                    <h4 className="font-semibold mb-3 font-headline">🫁 60s Breathing</h4>
                    <div className="text-center">
                        <div className="breathing-circle mx-auto mb-4"></div>
                        <div className="text-2xl font-bold mb-2">{isBreathing ? breathingTimer : '60'}</div>
                        <Button onClick={() => setIsBreathing(true)} disabled={isBreathing} className="bg-green-500 hover:bg-green-600 text-white text-sm">{isBreathing ? 'Breathing...' : 'Start'}</Button>
                    </div>
                </div>
                <div className="glassmorphism p-6 rounded-xl">
                    <h4 className="font-semibold mb-3 font-headline">😊 Mood Check-in</h4>
                    <p className="text-sm text-foreground/70 dark:text-foreground/60 mb-3">How are you feeling right now?</p>
                    <div className="flex justify-between">
                        <button onClick={() => selectMood(1)} className="text-3xl hover:scale-125 transition-transform">😢</button>
                        <button onClick={() => selectMood(2)} className="text-3xl hover:scale-125 transition-transform">😕</button>
                        <button onClick={() => selectMood(3)} className="text-3xl hover:scale-125 transition-transform">😐</button>
                        <button onClick={() => selectMood(4)} className="text-3xl hover:scale-125 transition-transform">😊</button>
                        <button onClick={() => selectMood(5)} className="text-3xl hover:scale-125 transition-transform">😄</button>
                    </div>
                    {moodFeedback && <div className="mt-3 text-sm text-center text-primary font-semibold">{moodFeedback}</div>}
                </div>
                <div className="glassmorphism p-6 rounded-xl">
                    <h4 className="font-semibold mb-3 font-headline">🔄 Positive Reframe</h4>
                    <Input id="worry-input" placeholder="What's worrying you?" className="bg-background/50 mb-3" />
                    <Button onClick={reframeWorry} className="bg-orange-500 hover:bg-orange-600 text-white text-sm mb-3">Reframe</Button>
                    {reframeOutput && <div className="text-sm text-green-600 dark:text-green-400 italic">{reframeOutput}</div>}
                </div>
                <div className="glassmorphism p-6 rounded-xl md:col-span-2">
                    <h4 className="font-semibold mb-3 font-headline">🙏 Gratitude Trio</h4>
                    <p className="text-sm text-foreground/70 dark:text-foreground/60 mb-3">Name three things you're grateful for:</p>
                    <div className="grid sm:grid-cols-3 gap-3">
                        <Input placeholder="Gratitude #1" className="bg-background/50" />
                        <Input placeholder="Gratitude #2" className="bg-background/50" />
                        <Input placeholder="Gratitude #3" className="bg-background/50" />
                    </div>
                    <Button onClick={() => toast({ title: "Gratitude Saved", description: "Thanks for practicing gratitude!" })} className="mt-3 bg-pink-500 hover:bg-pink-600 text-white text-sm">Save Gratitude</Button>
                </div>
            </div>
        </div>
    );
}
