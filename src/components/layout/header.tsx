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

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/login', label: 'Login' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/chat', label: 'Chat with Kai' },
];

export function Header() {
  return (
    <header className="glassmorphism fixed top-0 w-full z-50 px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
            <Logo className="w-7 h-7 text-white" />
          </div>
          <span className="gradient-text font-bold text-xl font-headline hidden sm:inline">Kai Wellness</span>
        </Link>
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Button key={link.href} variant="link" asChild className="text-foreground/80 hover:text-primary transition-colors text-base p-0">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <ThemeToggle />
        </nav>
        <div className="md:hidden">
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
                <div className="pt-4">
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
