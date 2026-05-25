import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbInstance } from '../lib/virtual_db';

interface AuthContextType {
  user: any;
  profile: any;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (name: string, slug: string, email: string, pass: string, phone?: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updatedData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const cachedUser = dbInstance.currentUser;
    if (cachedUser) {
      setUser(cachedUser);
      setProfile(dbInstance.getProfile());
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const logged = dbInstance.login(email);
      setUser(logged);
      const prof = dbInstance.getProfile();
      setProfile(prof);
      return { success: true, user: logged };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, slug: string, email: string, pass: string, phone?: string) => {
    setLoading(true);
    try {
      const res = dbInstance.signup(name, slug, email, phone);
      setUser(res.user);
      setProfile(dbInstance.getProfile());
      return { success: true, ...res };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      dbInstance.currentUser = null;
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData: any) => {
    const fresh = { ...dbInstance.getProfile() };
    const merged = {
      ...fresh,
      restaurant: {
        ...fresh.restaurant,
        ...updatedData
      }
    };
    
    // Write back to mock DB
    const list = dbInstance.restaurants;
    const index = list.findIndex(r => r.id === fresh.restaurant.id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedData };
      dbInstance.restaurants = [...list];
    }
    setProfile(merged);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAuthenticated: !!user,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
