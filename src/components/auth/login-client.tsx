

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '../icons/logo';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

type AuthMode = 'signin' | 'signup';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.618-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
t-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.618-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083L43.595,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.012,35.245,44,30.028,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


export function LoginClient() {
  const { login, signup, loginWithGoogle, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleEmailAuthAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsActionLoading(true);

    let result;
    if (mode === 'signin') {
      result = await login(email, password);
    } else { // Signup
      result = await signup(name, email, password);
    }

    setIsActionLoading(false);

    if (result.success) {
      toast({ 
        title: mode === 'signin' ? 'Login Successful' : 'Sign-up Successful',
        description: result.message 
      });
    } else {
      toast({ 
        variant: "destructive", 
        title: mode === 'signin' ? 'Login Failed' : 'Sign-up Failed',
        description: result.message 
      });
    }
  };

  const handleGoogleAuth = async () => {
    setIsActionLoading(true);
    const result = await loginWithGoogle();
    
    // With redirect, this part might not be reached if the redirect is successful.
    // It's here to catch immediate errors.
    if (result && !result.success) {
      setIsActionLoading(false);
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: result.message,
      });
    }
    // No need to set isActionLoading to false if redirecting, as the page will change.
  }

  const toggleMode = () => {
    setMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setName('');
    setEmail('');
    setPassword('');
  }
  
  // isAuthLoading now also represents the loading state after a redirect
  const isLoading = isAuthLoading || isActionLoading;

  if (isAuthLoading) {
    return (
       <div className="glassmorphism rounded-2xl p-8 flex flex-col items-center justify-center h-96">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="mt-4 text-foreground/70 dark:text-foreground/60">Checking authentication...</p>
       </div>
    );
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

      <form onSubmit={handleEmailAuthAction} className="space-y-6">
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
              disabled={isLoading}
            />
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            required 
            placeholder="your@email.com"
            className="mt-2 bg-background/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            required 
            placeholder="Your password"
            className="mt-2 bg-background/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg transition-all transform hover:scale-105">
          {isLoading ? <Loader2 className="animate-spin" /> : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
        </Button>
      </form>
      
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

      <Button variant="outline" className="w-full bg-background/50" onClick={handleGoogleAuth} disabled={isLoading}>
        {isActionLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <GoogleIcon className="mr-2 h-5 w-5" />}
        {isActionLoading ? 'Redirecting...' : 'Sign in with Google'}
      </Button>

      <div className="mt-6 text-center">
        <p className="text-sm text-foreground/70 dark:text-foreground/60">
          {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
          <Button variant="link" onClick={toggleMode} disabled={isLoading} className="font-semibold text-primary pl-1">
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </Button>
        </p>
      </div>
    </div>
  );
}
