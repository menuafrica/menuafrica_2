import React, { createContext, useContext, useState } from 'react';

export interface LibraryImage {
  id: string;
  url: string;
  category: string;
  title: string;
}

const PRESET_IMAGES: LibraryImage[] = [
  { id: '1', title: 'Thiéboudienne', category: 'Plat', url: 'https://images.unsplash.com/photo-1604423043492-4130279f7271?q=80&w=400' },
  { id: '2', title: 'Yassa Poulet', category: 'Plat', url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f33?q=80&w=400' },
  { id: '3', title: 'Bissap', category: 'Boisson', url: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=400' },
  { id: '4', title: 'Pastels de Poisson', category: 'Entrée', url: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=400' },
  { id: '5', title: 'Mafé', category: 'Plat', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400' },
  { id: '6', title: 'Beignets', category: 'Dessert', url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400' }
];

interface LibraryContextType {
  images: LibraryImage[];
  addImage: (title: string, category: string, base64: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<LibraryImage[]>(PRESET_IMAGES);

  const addImage = (title: string, category: string, base64: string) => {
    const newImg: LibraryImage = {
      id: `${Date.now()}`,
      title,
      category,
      url: base64
    };
    setImages(prev => [newImg, ...prev]);
  };

  return (
    <LibraryContext.Provider value={{ images, addImage }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used inside LibraryProvider');
  return ctx;
};
