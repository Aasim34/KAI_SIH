"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, LayoutDashboard, Mic, Video } from 'lucide-react';
import Link from 'next/link';

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

export default function HomePage() {
  return (
    <div className="pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="gradient-text text-4xl md:text-5xl font-bold mb-4 font-headline">
            Welcome to Kai
          </h1>
          <p className="text-xl text-foreground/70 dark:text-foreground/60 max-w-3xl mx-auto">
            Your personal AI companion for student wellness. Kai is here to listen, support, and guide you with a friendly ear and evidence-based techniques.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6" style={{ perspective: '1000px' }}>
          {navOptions.map(item => (
            <Link href={item.href} key={item.href} className="group">
              <Card className="glassmorphism h-full hover:border-primary/50 transition-all transform hover:[transform:rotateY(-5deg)_rotateX(10deg)_scale(1.05)] duration-300">
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
