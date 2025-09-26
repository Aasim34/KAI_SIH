"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, LayoutDashboard, Mic, Video, Share, BrainCircuit, Sparkles, Carrot } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const navOptions = [
  {
    href: '/dashboard',
    title: 'Your Dashboard',
    description: 'Track your progress, review insights, and manage your wellness journey.',
    icon: <LayoutDashboard className="w-6 h-6 text-primary" />,
  },
  {
    href: '/chat',
    title: 'Chat with Kai',
    description: "Talk about what's on your mind and get empathetic, AI-powered support.",
    icon: <Bot className="w-6 h-6 text-primary" />,
  },
  {
    href: '/voice-chat',
    title: 'Voice Check-in',
    description: 'Analyze your vocal tone for emotional insights and receive verbal feedback from Kai.',
    icon: <Mic className="w-6 h-6 text-primary" />,
  },
  {
    href: '/video-chat',
    title: 'Video Analysis',
    description: 'Record a short video to get visual feedback on your emotional state.',
    icon: <Video className="w-6 h-6 text-primary" />,
  },
];

const flowSteps = [
    {
        icon: <Share className="w-8 h-8 text-primary" />,
        title: "1. Share Your Feelings",
        description: "Check in through text, voice, or video. Express yourself in the way that feels most comfortable.",
    },
    {
        icon: <BrainCircuit className="w-8 h-8 text-primary" />,
        title: "2. AI-Powered Analysis",
        description: "Kai's advanced AI analyzes your input for emotional, vocal, and facial cues to understand your state.",
    },
    {
        icon: <Sparkles className="w-8 h-8 text-primary" />,
        title: "3. Personalized Insights",
        description: "Receive empathetic feedback and actionable recommendations tailored specifically to you.",
    },
    {
        icon: <Carrot className="w-8 h-8 text-primary" />,
        title: "4. Engage & Grow",
        description: "Use mindful games, track your progress, and watch your virtual 'Mindful Grove' flourish.",
    },
];

export default function HomePage() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const timers = navOptions.map((_, index) => 
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index]);
      }, index * 150)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="gradient-text text-4xl md:text-5xl font-bold mb-4 font-headline">
            Welcome to Kai
          </h1>
          <p className="text-xl text-foreground/70 dark:text-foreground/60 max-w-3xl mx-auto">
            Your personal AI companion for student wellness. Kai is here to listen, support, and guide you with a friendly ear and evidence-based techniques.
          </p>
        </div>

        <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 gradient-text font-headline">How Kai Helps You</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {flowSteps.map((step, index) => (
                    <div key={index} className="relative">
                        <Card className="glassmorphism h-full text-center p-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                {step.icon}
                            </div>
                            <h3 className="text-lg font-bold mb-2 font-headline">{step.title}</h3>
                            <p className="text-sm text-foreground/70 dark:text-foreground/60">{step.description}</p>
                        </Card>
                        {index < flowSteps.length - 1 && (
                            <ArrowRight className="absolute top-1/2 -right-3 h-6 w-6 text-primary/30 hidden lg:block" />
                        )}
                    </div>
                ))}
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6" style={{ perspective: '1000px' }}>
          {navOptions.map((item, index) => (
            <Link href={item.href} key={item.href} className="group">
              <Card 
                className={cn(
                  "glassmorphism h-full hover:border-primary/50 transition-all transform hover:[transform:rotateY(-5deg)_rotateX(10deg)_scale(1.05)] duration-300 opacity-0",
                  {
                    'animate-slide-in-from-left': visibleCards.includes(index) && index % 2 === 0,
                    'animate-slide-in-from-right': visibleCards.includes(index) && index % 2 !== 0,
                  }
                )}
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-bold font-headline">{item.title}</CardTitle>
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 dark:text-foreground/60">{item.description}</p>
                  <div className="flex items-center text-sm font-semibold text-primary mt-4 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
