"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DEMO_CATEGORIES, DEMO_ITEMS } from '@/lib/demoData';

interface LibraryContextType {
  availableDishes: any[];
  availableCategories: any[];
  isLoading: boolean;
  refreshLibrary: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType>({
  availableDishes: [],
  availableCategories: [],
  isLoading: false,
  refreshLibrary: async () => {},
});

export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, restaurant } = useAuth();
  const [availableDishes, setAvailableDishes] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLibrary = async () => {
    if (!isSupabaseConfigured) {
      setAvailableCategories(DEMO_CATEGORIES);
      setAvailableDishes(DEMO_ITEMS);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const restId = restaurant?.id || user?.id;
      
      if (!restId) {
        setIsLoading(false);
        return;
      }

      const { data: menus } = await supabase.from('menus').select('id').eq('restaurant_id', restId);
      
      let cats: any[] = [];
      if (menus && menus.length > 0) {
        const { data: foundCats } = await supabase.from('categories').select('*').in('menu_id', menus.map(m => m.id));
        if (foundCats) {
          cats = foundCats;
          setAvailableCategories(cats);
        }
      }

      let itemsQuery = supabase.from('menu_items').select('*');
      
      if (cats.length > 0) {
        itemsQuery = itemsQuery.or(`restaurant_id.eq.${restId},category_id.in.(${cats.map(c => c.id).join(',')})`);
      } else {
        itemsQuery = itemsQuery.eq('restaurant_id', restId);
      }

      const { data: items } = await itemsQuery;
      
      if (items) {
        const uniqueItems = items.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
        setAvailableDishes(uniqueItems);
      }

    } catch (error) {
      console.error('Error fetching library:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [user?.id, restaurant?.id]);

  return (
    <LibraryContext.Provider value={{ availableDishes, availableCategories, isLoading, refreshLibrary: fetchLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
};
