"use client";
import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { supabase, isSupabaseConfigured, AuthService } from '@/lib/supabase';
import { toast } from '@/components/ui/uicomponents';
import { DEMO_USER_PROFILE } from '@/lib/demoData';

type UserRole = 'owner' | 'admin' | 'staff' | 'user';
interface Organization { id: string; name: string; slug: string; billing_plan: string; created_at: string; }
interface Restaurant { id: string; organization_id: string; name: string; subdomain: string; description: string; address: string; phone: string; email: string; logo_url: string; hero_image_url: string; primary_color: string; created_at: string; }

interface UserContextType {
  user: any | null;
  organization: Organization | null;
  role: UserRole | null;
  restaurant: Restaurant | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, restaurantName: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  startDemo: () => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
  isDemo: boolean;
}

const AuthContext = createContext<UserContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  
  const lastFetchedUserId = useRef<string | null>(null);

  const clearAuth = () => {
    setUser(null);
    setOrganization(null);
    setRestaurant(null);
    setRole(null);
    setIsDemo(false);
    lastFetchedUserId.current = null;
    
    if (typeof window !== 'undefined') {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('sb-') || key.includes('auth-token'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } catch (e) {
        console.error("[Auth] Erreur nettoyage localStorage:", e);
      }
    }
  };

 const startDemo = () => {
    setIsDemo(true);
    setUser({ id: 'demo-user', email: 'demo@menuafrica.com', user_metadata: { full_name: 'Demo User' } } as any);
    setRole(DEMO_USER_PROFILE.role as UserRole);
    setOrganization(DEMO_USER_PROFILE.organization as Organization);
    setRestaurant(DEMO_USER_PROFILE.restaurant as unknown as Restaurant);
    setLoading(false);
  };

  const loadProfileData = async (userId: string, force: boolean = false) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        console.warn("[Auth] Pas de connexion réseau. Chargement profil reporté.");
        toast.info("Mode Hors Ligne activé.");
        return;
    }

    if (!force && lastFetchedUserId.current === userId) {
        return;
    }
    lastFetchedUserId.current = userId;

    try {
      const profile = await AuthService.getFullProfile(userId);
      if (profile) {
        setRole(profile.role);
        setOrganization((Array.isArray(profile.organization) ? profile.organization[0] : profile.organization) as Organization | null);
        setRestaurant((Array.isArray(profile.restaurant) ? profile.restaurant[0] : profile.restaurant) as Restaurant | null);
      } else {
        console.warn("[Auth] Profil métier introuvable.");
      }
    } catch (e) {
      console.error("[Auth] Erreur chargement profil:", e);
      lastFetchedUserId.current = null;
    }
  };

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      const timeout = setTimeout(() => {
        if (mounted) {
          console.warn("[Auth] Initialisation trop longue (>6s), déblocage forcé.");
          setLoading(false);
        }
      }, 6000);

      try {
        if (!isSupabaseConfigured) {
           console.warn("[Auth] Mode hors ligne/Démo. Démarrage de la démo automatiquement.");
           clearTimeout(timeout);
           if (mounted) {
             startDemo();
           }
           return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        clearTimeout(timeout);

        if (error) {
            console.error("[Auth] Erreur session initiale:", error);
            if (error.message?.toLowerCase().includes("refresh_token") || 
                error.message?.toLowerCase().includes("refresh token") ||
                error.message?.toLowerCase().includes("not found")) {
                console.warn("[Auth] Session corrompue détectée, nettoyage...");
                clearAuth();
                await supabase.auth.signOut().catch(() => {});
                toast.error("Votre session a expiré. Veuillez vous reconnecter.");
            }
        } else if (session?.user) {
            setUser(session.user);
            if (session.user.user_metadata?.preferred_language) {
               localStorage.setItem('app_language', session.user.user_metadata.preferred_language);
            }
            await loadProfileData(session.user.id);
        }
      } catch (error: any) {
        clearTimeout(timeout);
        console.error("[Auth] Crash Initialisation:", error);
        if (error.message?.toLowerCase().includes("refresh token")) {
          clearAuth();
        }
      } finally {
        clearTimeout(timeout);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      console.log(`[Auth] Event: ${event}`);

      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        if (session.user.user_metadata?.preferred_language) {
           localStorage.setItem('app_language', session.user.user_metadata.preferred_language);
        }
        await loadProfileData(session.user.id);
      } else if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        if (event === 'SIGNED_OUT') {
          clearAuth();
        }
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("[Auth] Token rafraîchi avec succès.");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true); 
    try {
      if (!isSupabaseConfigured) {
        throw new Error("Supabase n'est pas configuré. Veuillez vérifier vos clés d'API.");
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      
      if (data.user) {
          setUser(data.user);
          if (data.user.user_metadata?.preferred_language) {
             localStorage.setItem('app_language', data.user.user_metadata.preferred_language);
          }
          await loadProfileData(data.user.id, true);
      }
    } catch (error: any) {
      console.error("[Auth] Erreur Connexion:", error);
      if (error.message?.toLowerCase().includes("refresh token")) {
        clearAuth();
      }
      const msg = error.message?.includes("Invalid login") 
        ? "Identifiants incorrects." 
        : error.message;
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, restaurantName: string): Promise<boolean> => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        throw new Error("Supabase n'est pas configuré. Veuillez vérifier vos clés d'API.");
      }
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { full_name: restaurantName } }
      });
      
      if (authError) throw authError;

      if (authData.user) {
        if (!authData.session) {
            toast.success("Veuillez vérifier votre boîte mail pour confirmer votre compte.");
            return false;
        }

        setUser(authData.user);
        
        const slug = restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random()*1000);
        await AuthService.createRestaurantAccount(restaurantName, slug, email);
        
        await loadProfileData(authData.user.id, true);
        toast.success("Compte créé avec succès !");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("[Auth] Signup Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
        console.error("Erreur deconnexion", error);
    } finally {
        clearAuth();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      organization, 
      restaurant, 
      role, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      startDemo,
      clearAuth,
      isAuthenticated: !!user,
      isDemo
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
