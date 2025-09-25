"use client";

import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { Progress } from '../ui/progress';

export function VoiceChatClient() {
  
  return (
    <div className="glassmorphism rounded-2xl overflow-hidden h-full flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🎙️</span>
            </div>
            <div>
                <h3 className="font-semibold font-headline">Voice Check-in</h3>
                <p className="text-sm opacity-90">Share your feelings through voice</p>
            </div>
            </div>
        </div>
      
        <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md space-y-6 text-center">
                    <div className="relative w-48 h-48 mx-auto">
                        <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse"></div>
                        <div className="absolute inset-2 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="absolute inset-4 flex items-center justify-center">
                            <Button size="lg" className="gap-2 h-24 w-24 rounded-full text-white bg-gradient-to-r from-purple-600 to-blue-600">
                                <Mic className="h-10 w-10"/>
                            </Button>
                        </div>
                    </div>
                    <p className="text-muted-foreground">Press the button and start speaking</p>
                     <Button size="lg" className="h-12 px-6 text-base">
                        Start Voice Analysis
                    </Button>
                </div>
            </div>

            <div className="w-80 border-l border-border p-4 space-y-4 hidden md:block shrink-0 overflow-y-auto">
                <h4 className="font-semibold font-headline">Real-time Analysis</h4>
                <div className="glassmorphism p-3 rounded-xl">
                    <h5 className="font-semibold text-sm mb-2">Voice Analysis</h5>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between items-center text-xs mb-1"><span>Volume</span><span className="font-medium">--%</span></div>
                            <Progress value={0} className="h-1"/>
                        </div>
                        <div>
                            <div className="flex justify-between items-center text-xs mb-1"><span>Clarity</span><span className="font-medium">--%</span></div>
                            <Progress value={0} className="h-1"/>
                        </div>
                        <div>
                            <div className="flex justify-between items-center text-xs mb-1"><span>Pace</span><span className="font-medium">-- wpm</span></div>
                            <Progress value={0} className="h-1"/>
                        </div>
                    </div>
                </div>
                <div className="glassmorphism p-3 rounded-xl">
                    <h5 className="font-semibold text-sm mb-2">Emotional Tone</h5>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Joy</span><span className="text-muted-foreground">Low</span></div>
                        <div className="flex justify-between"><span>Sadness</span><span className="text-muted-foreground">Low</span></div>
                        <div className="flex justify-between"><span>Anger</span><span className="text-muted-foreground">Low</span></div>
                    </div>
                </div>
                 <div className="glassmorphism p-3 rounded-xl text-center">
                    <h5 className="font-semibold text-sm mb-2">Breathing Guide</h5>
                    <div className="breathing-circle mx-auto mb-2" style={{ width: '60px', height: '60px' }}></div>
                    <p className="text-xs text-muted-foreground">Follow the circle</p>
                </div>
            </div>
        </div>
    </div>
  );
}
