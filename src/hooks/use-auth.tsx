"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const protectedRoutes = ['/home', '/dashboard', '/chat', '/voice-chat', '/video-chat'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // On initial load, check localStorage for auth status
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) {
      return; // Wait until the initial auth check is complete
    }

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // If the user is on a protected route and is not authenticated, redirect to login
    if (isProtectedRoute && !isAuthenticated) {
      router.push('/');
    }

    // If the user is authenticated and tries to access the login page, redirect to home
    if (isAuthenticated && pathname === '/') {
      router.push('/home');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const login = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    // The useEffect hook will handle the redirection to '/home'
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    router.push('/'); // Redirect to login page on logout
  };

  // While loading, don't render children to prevent flicker or showing wrong content
  if (isLoading) {
    return null; // Or you can return a global loading spinner component
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
