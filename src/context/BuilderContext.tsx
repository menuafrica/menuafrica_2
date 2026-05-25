import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbInstance, Menu, Category, MenuItem } from '../lib/virtual_db';
import { useAuth } from './AuthContext';

interface BuilderContextType {
  menus: Menu[];
  selectedMenu: Menu | null;
  categories: Category[];
  items: MenuItem[];
  selectMenu: (menuId: string) => void;
  addCategory: (nameFr: string, nameEn?: string) => void;
  addItem: (itemData: Partial<MenuItem>) => void;
  updateItem: (id: string, itemData: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
  saveMenuConfig: (config: any) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);

  // Synchronize on profile changes
  useEffect(() => {
    if (profile?.restaurant?.id) {
      const filteredMenus = dbInstance.menus.filter(m => m.restaurant_id === profile.restaurant.id);
      setMenus(filteredMenus);
      
      const defaultOrFirst = filteredMenus.find(m => m.is_default) || filteredMenus[0] || null;
      setSelectedMenu(defaultOrFirst);
      
      if (defaultOrFirst) {
        setCategories(dbInstance.categories.filter(c => c.menu_id === defaultOrFirst.id));
        setItems(dbInstance.items.filter(i => i.restaurant_id === profile.restaurant.id));
      } else {
        setCategories([]);
        setItems([]);
      }
    } else {
      setMenus([]);
      setSelectedMenu(null);
      setCategories([]);
      setItems([]);
    }
  }, [profile]);

  const selectMenu = (menuId: string) => {
    const found = menus.find(m => m.id === menuId);
    if (found) {
      setSelectedMenu(found);
      setCategories(dbInstance.categories.filter(c => c.menu_id === found.id));
    }
  };

  const addCategory = (nameFr: string, nameEn?: string) => {
    if (!selectedMenu) return;
    const cat: Category = {
      id: `cat_${Math.random().toString(36).substr(2, 9)}`,
      menu_id: selectedMenu.id,
      name_fr: nameFr,
      name_en: nameEn || '',
      description_fr: '',
      sort_order: categories.length + 1,
      is_active: true,
      created_at: new Date().toISOString()
    };
    dbInstance.categories = [...dbInstance.categories, cat];
    setCategories(dbInstance.categories.filter(c => c.menu_id === selectedMenu.id));
  };

  const addItem = (itemData: Partial<MenuItem>) => {
    if (!profile?.restaurant?.id) return;
    const newItem: MenuItem = {
      id: `item_${Math.random().toString(36).substr(2, 9)}`,
      category_id: itemData.category_id || '',
      name_fr: itemData.name_fr || '',
      name_en: itemData.name_en || '',
      description_fr: itemData.description_fr || '',
      description_en: itemData.description_en || '',
      price: itemData.price || 0,
      image_url: itemData.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      is_vegetarian: !!itemData.is_vegetarian,
      is_spicy: !!itemData.is_spicy,
      is_popular: !!itemData.is_popular,
      is_available: true,
      sort_order: items.length + 1,
      views: 0,
      likes: 0,
      created_at: new Date().toISOString(),
      restaurant_id: profile.restaurant.id,
      currency: 'XOF',
      tags: itemData.tags || [],
      ingredients: itemData.ingredients || []
    };
    dbInstance.items = [...dbInstance.items, newItem];
    setItems(dbInstance.items.filter(i => i.restaurant_id === profile.restaurant.id));
  };

  const updateItem = (id: string, itemData: Partial<MenuItem>) => {
    if (!profile?.restaurant?.id) return;
    const list = dbInstance.items;
    const index = list.findIndex(i => i.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...itemData };
      dbInstance.items = [...list];
      setItems(dbInstance.items.filter(i => i.restaurant_id === profile.restaurant.id));
    }
  };

  const deleteItem = (id: string) => {
    if (!profile?.restaurant?.id) return;
    dbInstance.items = dbInstance.items.filter(i => i.id !== id);
    setItems(dbInstance.items.filter(i => i.restaurant_id === profile.restaurant.id));
  };

  const saveMenuConfig = (config: any) => {
    if (!selectedMenu || !profile?.restaurant?.id) return;
    const list = dbInstance.menus;
    const index = list.findIndex(m => m.id === selectedMenu.id);
    if (index !== -1) {
      list[index] = { ...list[index], visual_config: config };
      dbInstance.menus = [...list];
      setMenus(dbInstance.menus.filter(m => m.restaurant_id === profile.restaurant.id));
      setSelectedMenu(list[index]);
    }
  };

  return (
    <BuilderContext.Provider value={{
      menus,
      selectedMenu,
      categories,
      items,
      selectMenu,
      addCategory,
      addItem,
      updateItem,
      deleteItem,
      saveMenuConfig
    }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used inside BuilderProvider');
  return ctx;
};
