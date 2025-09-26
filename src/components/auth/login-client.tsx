
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '../icons/logo';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

type AuthMode = 'signin' | 'signup';

export function LoginClient() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, signup } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthAction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      if (mode === 'signin') {
        if (email === 'user@kai.com' && password === '12345') {
          login();
          toast({ title: "Login Successful", description: "Welcome back!" });
        } else {
          toast({ variant: "destructive", title: "Login Failed", description: "Invalid email or password." });
        }
      } else { // Signup
        if (name && email && password) {
          signup();
          toast({ title: "Sign-up Successful", description: `Welcome, ${name}!` });
        } else {
          toast({ variant: "destructive", title: "Sign-up Failed", description: "Please fill out all fields." });
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  const toggleMode = () => {
    setMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setName('');
    setEmail('');
    setPassword('');
  }

  return (
    <div className="glassmorphism rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/20">
          <Logo className="w-9 h-9 text-white" />
        </div>
        <h1 className="gradient-text text-3xl font-bold mb-2 font-headline">{mode === 'signin' ? 'Welcome to Kai' : 'Create Your Account'}</h1>
        <p className="text-foreground/70 dark:text-foreground/60">{mode === 'signin' ? 'Sign in to begin' : 'Get started with your wellness journey'}</p>
      </div>

      <form onSubmit={handleAuthAction} className="space-y-6">
        {mode === 'signup' && (
          <div>
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              type="text" 
              required 
              placeholder="Your Name" 
              className="mt-2 bg-background/50"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            required 
            placeholder={mode === 'signin' ? "user@kai.com" : "your@email.com"}
            className="mt-2 bg-background/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            required 
            placeholder={mode === 'signin' ? "12345" : "Create a password"}
            className="mt-2 bg-background/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg transition-all transform hover:scale-105">
          {isLoading ? (mode === 'signin' ? 'Signing in...' : 'Creating account...') : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-foreground/70 dark:text-foreground/60">
          {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
          <Button variant="link" onClick={toggleMode} className="font-semibold text-primary pl-1">
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </Button>
        </p>
      </div>
    </div>
  );
}
