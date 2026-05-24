"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';

export type MenuState = 'INITIALIZATION' | 'BROWSING' | 'WAITING' | 'CHECKOUT_INTENT' | 'COMPLETED';
export type UserProfile = 'petite_faim' | 'grosse_faim' | null;

interface PublicMenuMachineState {
  currentState: MenuState;
  userProfile: UserProfile;
  quizPoints: number;
  setProfile: (profile: UserProfile) => void;
  transitionTo: (newState: MenuState) => void;
  addQuizPoints: (points: number) => void;
  resetMachine: () => void;
}

const PublicMenuMachineContext = createContext<PublicMenuMachineState | undefined>(undefined);

export const PublicMenuMachineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentState, setCurrentState] = useState<MenuState>('INITIALIZATION');
  const [userProfile, setUserProfile] = useState<UserProfile>(null);
  const [quizPoints, setQuizPoints] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedState = sessionStorage.getItem('menuafrica_machine_state');
        if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            if (parsed.currentState) setCurrentState(parsed.currentState);
            if (parsed.userProfile) setUserProfile(parsed.userProfile);
            if (parsed.quizPoints) setQuizPoints(parsed.quizPoints);
        } catch (e) {
            console.error("Erreur lecture cerveau menu", e);
        }
        }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      sessionStorage.setItem('menuafrica_machine_state', JSON.stringify({
        currentState,
        userProfile,
        quizPoints
      }));
    }
  }, [currentState, userProfile, quizPoints, isInitialized]);

  const setProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    transitionTo('BROWSING');
  };

  const transitionTo = (newState: MenuState) => {
    setCurrentState(newState);
  };

  const addQuizPoints = (points: number) => {
    setQuizPoints(prev => prev + points);
  };

  const resetMachine = () => {
    setCurrentState('INITIALIZATION');
    setUserProfile(null);
    setQuizPoints(0);
    if (typeof window !== 'undefined') sessionStorage.removeItem('menuafrica_machine_state');
  };

  return (
    <PublicMenuMachineContext.Provider value={{
      currentState, userProfile, quizPoints,
      setProfile, transitionTo, addQuizPoints, resetMachine
    }}>
      {children}
    </PublicMenuMachineContext.Provider>
  );
};

export const usePublicMenuMachine = () => {
  const context = useContext(PublicMenuMachineContext);
  if (context === undefined) {
    throw new Error('usePublicMenuMachine doit être utilisé à l\'intérieur d\'un PublicMenuMachineProvider');
  }
  return context;
};
