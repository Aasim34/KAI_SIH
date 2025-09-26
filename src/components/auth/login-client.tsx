"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Logo } from '../icons/logo';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export function LoginClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoginLoading(true);
    setTimeout(() => {
      setIsLoginLoading(false);
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push('/landing');
    }, 1500);
  };

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSignupLoading(true);
    setTimeout(() => {
      setIsSignupLoading(false);
      setIsSignupOpen(false);
      toast({ title: "Account Created!", description: "Welcome to Kai Wellness!" });
      router.push('/landing');
    }, 1500);
  };
  
  const handleSocialLogin = (provider: string) => {
    toast({ title: `Simulating ${provider} login...`, description: "Redirecting to home." });
    setTimeout(() => {
        router.push('/landing');
    }, 1000);
  }

  return (
    <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
      <div className="glassmorphism rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/20">
            <Logo className="w-9 h-9 text-white" />
          </div>
          <h1 className="gradient-text text-3xl font-bold mb-2 font-headline">Welcome Back</h1>
          <p className="text-foreground/70 dark:text-foreground/60">Sign in to continue your wellness journey</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="Enter your email" className="mt-2 bg-background/50" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required placeholder="Enter your password" className="mt-2 bg-background/50" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember-me" />
              <Label htmlFor="remember-me" className="text-sm font-normal">Remember me</Label>
            </div>
            <Button variant="link" type="button" className="p-0 h-auto text-sm text-primary">Forgot password?</Button>
          </div>
          <Button type="submit" disabled={isLoginLoading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg transition-all transform hover:scale-105">
            {isLoginLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="my-6 flex items-center">
          <Separator className="flex-1" />
          <span className="px-4 text-sm text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <div className="space-y-3">
           <Button onClick={() => handleSocialLogin('Google')} variant="outline" className="w-full gap-3 justify-center h-11 bg-background/50">
              <span className="text-xl">🔍</span>
              <span className="font-medium">Continue with Google</span>
          </Button>
          <Button onClick={() => handleSocialLogin('Microsoft')} variant="outline" className="w-full gap-3 justify-center h-11 bg-background/50">
              <span className="text-xl">🪟</span>
              <span className="font-medium">Continue with Microsoft</span>
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <DialogTrigger asChild>
               <Button variant="link" className="p-0 h-auto font-medium text-primary">Sign up</Button>
            </DialogTrigger>
          </p>
        </div>
        
        <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-center">
            <p className="text-sm text-blue-600 dark:text-blue-300 mb-2">Want to try Kai first?</p>
            <Button variant="link" asChild className="text-blue-600 dark:text-blue-400 font-medium text-sm underline h-auto p-0">
                <Link href="/dashboard">Access Demo Dashboard</Link>
            </Button>
        </div>
      </div>

      <DialogContent className="glassmorphism max-w-md w-full rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl font-bold font-headline">Create Account</DialogTitle>
          <DialogDescription>
            Join Kai Wellness to start your personalized wellness journey.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" required placeholder="John" className="mt-1 bg-background/50" />
            </div>
            <div>
              <Label htmlFor="last-name">Last Name</Label>              <Input id="last-name" required placeholder="Doe" className="mt-1 bg-background/50" />
            </div>
          </div>
          <div>
            <Label htmlFor="signup-email">Email</Label>
            <Input id="signup-email" type="email" required placeholder="john@example.com" className="mt-1 bg-background/50" />
          </div>
          <div>
            <Label htmlFor="signup-password">Password</Label>
            <Input id="signup-password" type="password" required placeholder="Create a strong password" className="mt-1 bg-background/50" />
          </div>
          <div>
            <Label>Student Status</Label>
            <Select>
              <SelectTrigger className="w-full mt-1 bg-background/50">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="graduate">Graduate</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
              I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </Label>
          </div>
          <Button type="submit" disabled={isSignupLoading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold">
            {isSignupLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
