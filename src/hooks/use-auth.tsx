
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Correctly import from your new firebase.ts

type AuthResult = {
  success: boolean;
  message: string;
};

interface User {
  uid: string;
  name: string | null;
  email: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string, dateOfBirth?: Date) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const protectedRoutes = ['/home', '/dashboard', '/chat', '/voice-chat', '/video-chat'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  const isAuthenticated = !!user;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        setUser({ uid: firebaseUser.uid, name: firebaseUser.displayName, email: firebaseUser.email });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (!isAuthenticated && isProtectedRoute) {
      router.push('/');
    }
    if (isAuthenticated && pathname === '/') {
      router.push('/home');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const signup = useCallback(async (name: string, email: string, password: string, dateOfBirth?: Date): Promise<AuthResult> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      setUser({ uid: userCredential.user.uid, name: userCredential.user.displayName, email: userCredential.user.email });
      return { success: true, message: `Welcome, ${name}!` };
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, message: 'This email address is already in use.' };
      }
      return { success: false, message: error.message || "Sign-up failed." };
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser({ uid: userCredential.user.uid, name: userCredential.user.displayName, email: userCredential.user.email });
      return { success: true, message: "Welcome back!" };
    } catch (error: any) {
      return { success: false, message: "Invalid email or password." };
    }
  }, []);
  
  const loginWithGoogle = useCallback(async (): Promise<AuthResult> => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      setUser({ uid: userCredential.user.uid, name: userCredential.user.displayName, email: userCredential.user.email });
      return { success: true, message: "Signed in with Google successfully!" };
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Sign-in cancelled.' };
      }
      return { success: false, message: error.message || "Google Sign-In failed." };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [router]);

  const value = { isAuthenticated, user, isLoading, signup, login, loginWithGoogle, logout };

  return (
    <AuthContext.Provider value={value}>
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
