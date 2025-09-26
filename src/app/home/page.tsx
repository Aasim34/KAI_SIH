
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, Mic, Video } from 'lucide-react';
import Link from 'next/link';

const navOptions = [
  { href: '/dashboard', title: 'Dashboard', description: 'View your progress and stats', icon: <Bot className="w-6 h-6 text-primary" /> },
  { href: '/chat', title: 'Chat with Kai', description: 'Talk about what\'s on your mind', icon: <Bot className="w-6 h-6 text-primary" /> },
  { href: '/voice-chat', title: 'Voice Chat', description: 'Analyze your vocal tone', icon: <Mic className="w-6 h-6 text-primary" /> },
  { href: '/video-chat', title: 'Video Chat', description: 'Get visual feedback', icon: <Video className="w-6 h-6 text-primary" /> },
];

export default function HomePage() {
  return (
    <div className="pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="gradient-text text-4xl md:text-5xl font-bold mb-4 font-headline">
            Welcome Home
          </h1>
          <p className="text-xl text-foreground/70 dark:text-foreground/60 max-w-2xl mx-auto">
            Your wellness journey continues here. What would you like to do today?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {navOptions.map(item => (
            <Link href={item.href} key={item.href} className="group">
              <Card className="glassmorphism h-full hover:border-primary/50 transition-all transform hover:scale-[1.02]">
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
