
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';

const firebaseConfig = {
  "projectId": "studio-5455551154-a5d2e",
  "appId": "1:901983621273:web:852f22e2b3921e03dc2808",
  "apiKey": "AIzaSyAMn8ElSQn1Zbu6bY2vJNdck8VnBH2Og4c",
  "authDomain": "studio-5455551154-a5d2e.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "901983621273"
};

type AuthResult = {
  success: boolean;
  message: string;
};

interface User {
  name: string | null;
  email: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const protectedRoutes = ['/home', '/dashboard', '/chat', '/voice-chat', '/video-chat'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  const isAuthenticated = !!user;

  useEffect(() => {
    let firebaseApp: FirebaseApp;
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApps()[0];
    }
    const authInstance = getAuth(firebaseApp);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ name: firebaseUser.displayName, email: firebaseUser.email });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
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
    if (!auth) return { success: false, message: "Authentication not ready." };
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      setUser({ name: name, email: email });
      router.push('/home');
      return { success: true, message: `Welcome, ${name}!` };
    } catch (error: any) {
      return { success: false, message: error.message || "Sign-up failed." };
    }
  }, [router, auth]);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!auth) return { success: false, message: "Authentication not ready." };
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home');
      return { success: true, message: "Welcome back!" };
    } catch (error: any) {
      return { success: false, message: "Invalid email or password." };
    }
  }, [router, auth]);
  
  const loginWithGoogle = useCallback(async (): Promise<AuthResult> => {
    if (!auth) return { success: false, message: "Authentication not ready." };
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        router.push('/home');
        return { success: true, message: "Signed in with Google successfully!" };
    } catch (error: any) {
        return { success: false, message: error.message || "Google Sign-In failed." };
    }
  }, [router, auth]);

  const logout = useCallback(() => {
    if (!auth) return;
    signOut(auth).then(() => {
      setUser(null);
      router.push('/');
    });
  }, [router, auth]);

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
