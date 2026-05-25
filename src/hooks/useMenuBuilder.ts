import { useState, useCallback, useRef, useEffect } from 'react';
import { Menu, Category, MenuItem } from '../lib/types';
import { mockDb } from '../lib/mockDatabase';

interface UseMenuBuilderProps {
  restaurantId?: string;
  initialMenuId?: string | null;
}

export const useMenuBuilder = ({ restaurantId, initialMenuId }: UseMenuBuilderProps) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(initialMenuId || null);
  const [viewMode, setViewMode] = useState<'BUILDER' | 'LIBRARY'>('BUILDER');

  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Cache en mémoire pour réduire les appels réseaux simulés
  const cache = useRef<{ [key: string]: { categories: Category[], items: MenuItem[] } }>({});

  const initBuilder = useCallback(async () => {
    if (!restaurantId) return;
    setIsInitializing(true);
    try {
      const fetchedMenus = await mockDb.getMenusByRestaurant(restaurantId);
      setMenus(fetchedMenus);
      
      if (!activeMenuId && fetchedMenus.length > 0) {
        const target = fetchedMenus.find(m => m.id === initialMenuId) || fetchedMenus[0];
        setActiveMenuId(target.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsInitializing(false);
    }
  }, [restaurantId, activeMenuId, initialMenuId]);

  const loadMenuContent = useCallback(async (menuId: string) => {
    if (!menuId) return;

    if (cache.current[menuId]) {
      setCategories(cache.current[menuId].categories);
      setItems(cache.current[menuId].items);
      return;
    }

    setLoading(true);
    try {
      const cats = await mockDb.getCategoriesByMenu(menuId);
      const its = await mockDb.getMenuItemsByCategories(cats.map(c => c.id));
      
      cache.current[menuId] = { categories: cats, items: its };
      
      setCategories(cats);
      setItems(its);
    } catch (e) {
       console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeMenuId && !isInitializing) {
      loadMenuContent(activeMenuId);
    }
  }, [activeMenuId, loadMenuContent, isInitializing]);

  // --- Optimistic Updates ---
  const saveItem = async (item: Partial<MenuItem>, isNew: boolean) => {
    try {
      const saved = isNew 
        ? await mockDb.addItem(item as any)
        : await mockDb.updateItem(item.id!, item);
        
      setItems(prev => {
        const newList = isNew ? [...prev, saved] : prev.map(i => i.id === saved.id ? saved : i);
        if (activeMenuId && cache.current[activeMenuId]) {
          cache.current[activeMenuId].items = newList;
        }
        return newList;
      });
      return saved;
    } catch (e) {
      throw e;
    }
  };

  const createCategory = async (name_fr: string) => {
    const targetMenuId = activeMenuId || menus[0]?.id;
    if (!targetMenuId) return null;
    
    try {
      const maxOrder = categories.length > 0 ? Math.max(...categories.map(c => c.sort_order)) : 0;
      const newCat = await mockDb.addCategory({
        menu_id: targetMenuId,
        name_fr,
        sort_order: maxOrder + 1,
        is_active: true
      });
      
      setCategories(prev => {
        const newList = [...prev, newCat];
        if (cache.current[targetMenuId]) {
          cache.current[targetMenuId].categories = newList;
        }
        return newList;
      });
      return newCat;
    } catch (e) {
      throw e;
    }
  };

  return {
    menus,
    categories,
    items,
    activeMenuId,
    setActiveMenuId,
    viewMode,
    setViewMode,
    loading,
    isInitializing,
    initBuilder,
    saveItem,
    createCategory
  };
};
