import React, { createContext, useContext, useState } from 'react';

interface PublicMenuMachineContextType {
  activeCategory: string;
  setActiveCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilters: string[];
  toggleFilter: (filter: string) => void;
}

const PublicMenuMachineContext = createContext<PublicMenuMachineContextType | undefined>(undefined);

export const PublicMenuMachineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  return (
    <PublicMenuMachineContext.Provider value={{
      activeCategory,
      setActiveCategory,
      searchQuery,
      setSearchQuery,
      selectedFilters,
      toggleFilter
    }}>
      {children}
    </PublicMenuMachineContext.Provider>
  );
};

export const usePublicMenuMachine = () => {
  const ctx = useContext(PublicMenuMachineContext);
  if (!ctx) throw new Error('usePublicMenuMachine must be used inside PublicMenuMachineProvider');
  return ctx;
};
