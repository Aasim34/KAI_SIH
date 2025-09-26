
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type AuthResult = {
  success: boolean;
  message: string;
};

interface User {
  name: string;
  email: string;
  password?: string; // Password should not be stored in JWT or client state long-term
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const protectedRoutes = ['/home', '/dashboard', '/chat', '/voice-chat', '/video-chat'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      const userData = localStorage.getItem('kai-user');
      if (authStatus && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.error("Could not parse auth data from localStorage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      return; 
    }

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !isAuthenticated) {
      router.push('/');
    }

    if (isAuthenticated && pathname === '/') {
      router.push('/home');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
    if (!name || !email || !password) {
      return { success: false, message: "Please fill out all fields." };
    }
    
    const usersJSON = localStorage.getItem('kai-users');
    const users = usersJSON ? JSON.parse(usersJSON) : [];
    const existingUser = users.find((u: User) => u.email === email);

    if (existingUser) {
      return { success: false, message: "An account with this email already exists." };
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('kai-users', JSON.stringify(users));
    
    const currentUser = { name, email };
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('kai-user', JSON.stringify(currentUser));
    
    setIsAuthenticated(true);
    setUser(currentUser);
    
    router.push('/home');
    return { success: true, message: `Welcome, ${name}!` };
  }, [router]);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const usersJSON = localStorage.getItem('kai-users');
    const users = usersJSON ? JSON.parse(usersJSON) : [];
    const foundUser = users.find((u: any) => u.email === email);

    if (foundUser && foundUser.password === password) {
      const currentUser = { name: foundUser.name, email: foundUser.email };
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('kai-user', JSON.stringify(currentUser));

      setIsAuthenticated(true);
      setUser(currentUser);
      
      router.push('/home');
      return { success: true, message: "Welcome back!" };
    }

    return { success: false, message: "Invalid email or password." };
  }, [router]);


  const logout = useCallback(() => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('kai-user');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/');
  }, [router]);

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signup, login, logout }}>
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
