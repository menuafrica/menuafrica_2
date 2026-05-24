"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

type Language = 'Français' | 'Anglais';

const translations: Record<Language, any> = {
  'Français': {
    // Nav & Common
    dashboard: 'Tableau de bord',
    myMenus: 'Mes Menus',
    menuBuilder: 'Menu Builder',
    stats: 'Statistiques',
    qrStudio: 'QR Studio',
    brand: 'Identité Visuelle',
    settings: 'Paramètres',
    helpContact: 'Aide & Contact',
    logout: 'Se déconnecter',
    planFree: 'Plan Gratuit',
    connected: 'Connecté',
    offline: 'Hors Ligne',
    save: 'Enregistrer',
    saved: 'Sauvegardé',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Éditer',
    view: 'Voir',
    create: 'Créer',
    search: 'Rechercher...',
    loading: 'Chargement...',
    error: 'Erreur',
    all: 'Tous',
    inactive: 'Inactif',
    export: 'Exporter',
    actions: 'Actions',
    
    // ... we will trim some just for space if needed, keeping them all now
    mediaManagerTitle: 'Gestionnaire de Médias',
    mediaManagerDesc: 'Ajoutez, gérez et utilisez vos photos et vidéos.',
    uploadMedia: 'Uploader Média',
    storageUsed: 'Stockage Utilisé',
    noMedia: 'Aucun média trouvé. Uploadez-en un !',
    mediaDeleted: 'Média supprimé',
    mediaCopied: 'Lien copié dans le presse-papier !',
    storageFull: 'Espace insuffisant pour ce fichier.',
    fileTooLarge: 'Fichier trop volumineux',

    mavadaDesc: 'Gérez vos designs avec notre système de blocs intelligents.',
    newDesign: 'Nouveau Design',
    createMenu: 'Créer un menu',
    default: 'Défaut',
    openStudio: 'Ouvrir le Studio',
    newMenu: 'Nouveau Menu',
    menuName: 'Nom du menu',
    createAndEdit: 'Créer & Éditer',
    active: 'Actif',
    publicPreview: 'Aperçu Public',
    saving: 'Enregistrement...',
    missingSupabaseConfig: 'Configuration Supabase manquante',
    tester: 'Tester',
    configurer: 'Configurer',
    
    bibinAI: 'Bibin AI',
    mavadaStudio: 'Mavada Studio',
    subscription: 'Abonnement',
    team: 'Équipe',
    superAdmin: 'Super Admin',
  },
  'Anglais': {
    dashboard: 'Dashboard',
    myMenus: 'My Menus',
    menuBuilder: 'Menu Builder',
    stats: 'Analytics',
    qrStudio: 'QR Studio',
    brand: 'Brand Identity',
    settings: 'Settings',
    helpContact: 'Help & Contact',
    logout: 'Logout',
    planFree: 'Free Plan',
    connected: 'Online',
    offline: 'Offline',
    save: 'Save',
    saved: 'Saved',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    create: 'Create',
    search: 'Search...',
    loading: 'Loading...',
    error: 'Error',
    all: 'All',
    inactive: 'Inactive',
    export: 'Export',
    actions: 'Actions',
    
    bibinAI: 'Bibin AI',
    mavadaStudio: 'Mavada Studio',
    subscription: 'Subscription',
    team: 'Team',
    superAdmin: 'Super Admin',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, any>) => string;
  translateContent: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('app_language');
        return (saved === 'Français' || saved === 'Anglais') ? saved : 'Français';
    }
    return 'Français';
  });

  useEffect(() => {
    if (user?.user_metadata?.preferred_language) {
      const dbLang = user.user_metadata.preferred_language as Language;
      if (dbLang === 'Français' || dbLang === 'Anglais') {
        setLanguageState(dbLang);
        localStorage.setItem('app_language', dbLang);
      }
    }
  }, [user?.user_metadata?.preferred_language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string, options?: Record<string, any>) => {
    let translation = translations[language]?.[key] || translations['Anglais']?.[key] || key;
    
    if (options) {
      Object.keys(options).forEach(optKey => {
        translation = translation.replace(`{{${optKey}}}`, options[optKey]);
      });
    }
    
    return translation;
  };

  const translateContent = async (text: string): Promise<string> => {
    if (!text || text.trim() === '') return text;
    
    try {
      const { getGeminiClient } = await import('@/lib/aiService');
      const ai = getGeminiClient(true);
      const targetLang = language === 'Français' ? 'French' : 'English';
      
      const prompt = `Translate the following text into ${targetLang}. Return ONLY the translated text, no explanation.
      Text: "${text}"`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      return response.text?.trim() || text;
    } catch (error) {
      console.warn("Translation failed, falling back to original text:", error);
      return text;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateContent }}>
      <div dir={'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
