"use client";

import Link from 'next/link';
import { Logo } from '../icons/logo';
import { Button } from '../ui/button';
import { ThemeToggle } from '../theme-toggle';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = isAuthenticated ? [
    { href: '/home', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/chat', label: 'Chat' },
    { href: '/voice-chat', label: 'Voice' },
    { href: '/video-chat', label: 'Video' },
  ] : [];

  if (pathname === '/') {
    return null; // Don't show header on login page
  }

  return (
    <header className="glassmorphism fixed top-0 w-full z-50 px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/home" className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
            <Logo className="w-7 h-7 text-white" />
          </div>
          <span className="gradient-text font-bold text-xl font-headline hidden sm:inline">Kai Wellness</span>
        </Link>
        <nav className="hidden md:flex space-x-1 items-center">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" asChild className="text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors text-base px-3 py-2 font-medium">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          {isAuthenticated && (
             <Button variant="ghost" onClick={logout} className="text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors text-base px-3 py-2 font-medium">
              Sign Out
            </Button>
          )}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] glassmorphism border-none">
              <div className="flex flex-col space-y-4 pt-10">
                {navLinks.map((link) => (
                  <Button key={link.href} variant="link" asChild className="text-foreground/80 hover:text-primary transition-colors text-lg p-0 justify-start">
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
                 {isAuthenticated && (
                  <Button variant="link" onClick={logout} className="text-foreground/80 hover:text-primary transition-colors text-lg p-0 justify-start">
                    Sign Out
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
