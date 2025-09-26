import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { KaiAvatar } from '@/components/icons/kai-avatar';
import { Lock, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const features = [
  { icon: '🤖', title: 'AI Companion Kai', description: '24/7 empathetic AI support tailored to student life' },
  { icon: '📊', title: 'Proactive Stress Detection', description: 'Real-time monitoring and early intervention' },
  { icon: '🎤', title: 'Vocal Biomarker Analysis', description: 'Voice-based emotional state detection' },
  { icon: '👁️', title: 'Visual Sentiment Sensing', description: 'Camera-based mood and stress analysis' },
  { icon: '🎵', title: 'Adaptive Audioscape', description: 'Personalized soundscapes for relaxation' },
  { icon: '🌱', title: 'Mindful Grove', description: 'Gamified wellness activities and progress tracking' },
];

const howItWorks = [
  { step: 1, title: 'Connect with Kai', description: 'Start chatting with your AI wellness companion' },
  { step: 2, title: 'Share Your Feelings', description: 'Express yourself through voice, text, or visual cues' },
  { step: 3, title: 'Get Personalized Support', description: 'Receive tailored wellness activities and guidance' },
  { step: 4, title: 'Grow Your Grove', description: 'Track progress and unlock new wellness achievements' },
];

const testimonials = [
  {
    quote: "Kai helped me manage my exam stress better than any other app I've tried. The breathing exercises are amazing!",
    name: 'Sarah M.',
    role: 'Psychology Student',
  },
  {
    quote: "The Mindful Grove feature makes wellness feel like a game. I actually look forward to my daily check-ins!",
    name: 'Alex T.',
    role: 'Engineering Student',
  },
  {
    quote: "Having 24/7 support that understands student life has been a game-changer for my mental health.",
    name: 'Maya L.',
    role: 'Medical Student',
  },
];

export default function LandingPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="gradient-text text-5xl md:text-7xl font-bold mb-6 font-headline">
          Meet Kai - Your AI Friend for Student Wellness
        </h1>
        <div className="mb-8 flex justify-center">
            <div className="relative group w-48 h-48 flex items-center justify-center">
              {/* Pulsing background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 via-blue-500/50 to-indigo-500/50 rounded-full animate-breathe group-hover:scale-110 transition-transform duration-500 ease-in-out"></div>
              
              {/* Avatar container */}
              <div className="relative w-40 h-40 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                <KaiAvatar className="w-24 h-24 text-white" />
              </div>

              {/* Orbiting elements */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-400 rounded-full opacity-80"></div>
                <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-3 h-3 bg-pink-400 rounded-full opacity-80"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full opacity-80"></div>
              </div>
            </div>
        </div>
        <p className="text-xl text-foreground/70 dark:text-foreground/60 mb-8 max-w-2xl mx-auto">
          Your Mind Speaks, We Listen. Your Peace Starts Here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg" className="font-semibold text-base bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg transition-all transform hover:scale-105">
            <Link href="/dashboard">Start Your Wellness Journey</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-semibold text-base border-2 border-primary text-primary hover:bg-primary/10 transition-all">
            <Link href="/chat">Try Demo Chat</Link>
          </Button>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-sm text-foreground/70 dark:text-foreground/60">
          <div className="flex items-center gap-2">
            <Lock className="text-green-500" size={16} />
            <span>Privacy First</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="text-blue-500" size={16} />
            <span>10,000+ Students</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="text-yellow-500" size={16} />
            <span>4.9/5 Rating</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="gradient-text text-4xl font-bold text-center mb-16 font-headline">Comprehensive Wellness Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="glassmorphism p-8 rounded-2xl text-center hover:shadow-lg transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 font-headline">{feature.title}</h3>
              <p className="text-foreground/70 dark:text-foreground/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="gradient-text text-4xl font-bold text-center mb-16 font-headline">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl font-headline">{item.step}</div>
              <h3 className="font-bold mb-2 font-headline">{item.title}</h3>
              <p className="text-foreground/70 dark:text-foreground/60 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="gradient-text text-4xl font-bold text-center mb-16 font-headline">What Students Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glassmorphism p-6 rounded-2xl border-none">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  <span className="text-yellow-400">{'⭐'.repeat(5)}</span>
                </div>
                <p className="text-foreground mb-4 dark:text-foreground/80">"{testimonial.quote}"</p>
                <div className="font-semibold font-headline">{testimonial.name}</div>
                <div className="text-sm text-foreground/70 dark:text-foreground/60">{testimonial.role}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
