"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '../icons/logo';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export function LoginClient() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      if (email === 'user@kai.com' && password === '12345') {
        login();
        toast({ title: "Login Successful", description: "Welcome back!" });
      } else {
        toast({ variant: "destructive", title: "Login Failed", description: "Invalid email or password." });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="glassmorphism rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/20">
          <Logo className="w-9 h-9 text-white" />
        </div>
        <h1 className="gradient-text text-3xl font-bold mb-2 font-headline">Welcome to Kai</h1>
        <p className="text-foreground/70 dark:text-foreground/60">Sign in to begin</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            required 
            placeholder="user@kai.com" 
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
            placeholder="12345" 
            className="mt-2 bg-background/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg transition-all transform hover:scale-105">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}
