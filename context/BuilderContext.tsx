"use client";
import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from '@/components/ui/uicomponents';
import { arrayMove } from '@dnd-kit/sortable';

// Types simplified for context
export type SelectionType = 'hero' | 'category' | 'item' | 'footer' | null;
export type MenuItem = { id: string; name: string; price: number; category_id?: string; [key: string]: any; };
export type MenuBlueprint = { id: string; globalStyle: any; layout: any; content: { categories: any[] } };

interface BuilderContextType {
  blueprint: MenuBlueprint | null;
  isLoading: boolean;
  isSaving: boolean;
  selectedId: string | null;
  selectedType: SelectionType;
  heatmapMode: boolean;
  toggleHeatmap: () => void;
  loadMenu: (menuId: string) => Promise<void>;
  changeTemplate: (templateId: string) => void;
  updateGlobalStyle: (key: string, value: string) => void;
  updateHero: (updates: any) => void;
  updateLayout: (updates: any) => void;
  addCategory: (name: string) => void;
  updateCategory: (id: string, updates: any) => void;
  deleteCategory: (id: string) => void;
  moveCategory: (activeId: string, overId: string) => void;
  addItem: (categoryId: string, item: Partial<MenuItem>) => void;
  updateItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
  moveItem: (activeId: string, overId: string) => void;
  moveItemUp: (itemId: string) => void;
  moveItemDown: (itemId: string) => void;
  getItem: (id: string) => MenuItem | undefined;
  getAllItems: () => MenuItem[];
  selectElement: (type: SelectionType, id?: string | null) => void;
  save: () => Promise<void>;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

// Define a simple dbToBlueprint mock since it wasn't fully provided
const dbToBlueprint = (menu: any, restaurant: any, categories: any[], items: any[]): MenuBlueprint => {
    return {
        id: menu.template_id || 'default',
        globalStyle: menu.visual_config?.globalTheme || { primaryColor: '#000', backgroundColor: '#fff', font: 'sans', borderRadius: 'rounded-2xl' },
        layout: menu.visual_config?.layout || { heroSection: {} },
        content: {
            categories: categories.map(c => ({
                ...c,
                items: items.filter(i => i.category_id === c.id)
            }))
        }
    };
};

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blueprint, setBlueprint] = useState<MenuBlueprint | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  const useMavadaV2 = useMemo(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('useMavadaV2') === 'true';
    }
    return false;
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<SelectionType>(null);
  const [heatmapMode, setHeatmapMode] = useState(false);

  const loadMenu = useCallback(async (menuId: string) => {
    setIsLoading(true);
    setActiveMenuId(menuId);
    try {
      if (isSupabaseConfigured) {
        const { data: menu } = await supabase.from('menus').select('*').eq('id', menuId).single();
        if (!menu) throw new Error("Menu introuvable");

        const { data: restaurant } = await supabase.from('restaurants').select('*').eq('id', menu.restaurant_id).single();
        const { data: categories } = await supabase.from('categories').select('*').eq('menu_id', menuId).order('sort_order');
        
        let items: MenuItem[] = [];
        if (categories && categories.length > 0) {
           const catIds = categories.map((c: any) => c.id);
           const { data: menuItems } = await supabase.from('menu_items').select('*').in('category_id', catIds).order('sort_order');
           items = menuItems || [];
        }

        const initialBlueprint = dbToBlueprint(menu, restaurant, categories || [], items);
        setBlueprint(initialBlueprint);
      } else {
        await new Promise(r => setTimeout(r, 600));
        setBlueprint({
            id: 'mock',
            globalStyle: { primaryColor: '#c25e00', backgroundColor: '#fff', font: 'sans' },
            layout: { heroSection: {} },
            content: { categories: []}
        }); 
      }
    } catch (e) {
      console.error("Error loading menu for builder:", e);
      toast.error("Erreur de chargement du menu.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectElement = (type: SelectionType, id: string | null = null) => {
    setSelectedType(type);
    setSelectedId(id);
  };

  const changeTemplate = (templateId: string) => {
    if (!blueprint) return;
    setBlueprint(prev => prev ? { ...prev, id: templateId } : null);
  };

  const toggleHeatmap = () => setHeatmapMode(prev => !prev);

  const updateGlobalStyle = (key: string, value: string) => {
    setBlueprint(prev => prev ? ({ ...prev, globalStyle: { ...prev.globalStyle, [key]: value } }) : null);
  };

  const updateHero = (updates: any) => {
    setBlueprint(prev => prev ? { ...prev, layout: { ...prev.layout, heroSection: { ...prev.layout.heroSection, ...updates } } } : null);
  };

  const updateLayout = (updates: any) => {
    setBlueprint(prev => prev ? { ...prev, layout: { ...prev.layout, ...updates } } : null);
  };

  const moveCategory = (activeId: string, overId: string) => {
    setBlueprint(prev => {
      if (!prev) return null;
      const oldIndex = prev.content.categories.findIndex(c => c.id === activeId);
      const newIndex = prev.content.categories.findIndex(c => c.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        return { ...prev, content: { ...prev.content, categories: arrayMove(prev.content.categories, oldIndex, newIndex) } };
      }
      return prev;
    });
  };

  const updateCategory = (id: string, updates: any) => {
    setBlueprint(prev => prev ? ({ ...prev, content: { ...prev.content, categories: prev.content.categories.map(c => c.id === id ? { ...c, ...updates } : c) } }) : null);
  };

  const addCategory = (name: string) => {
    if (useMavadaV2) return toast.info("Utilisez Mavada Studio V2");
    toast.info("Ajout de catégorie : À implémenter dans Builder V1");
  };

  const deleteCategory = (id: string) => {
    if (useMavadaV2) return toast.info("Utilisez Mavada Studio V2");
    toast.info("Suppression catégorie : À implémenter");
  };

  const updateItem = (id: string, updates: Partial<MenuItem>) => {
    setBlueprint(prev => {
        if (!prev) return null;
        const newCategories = prev.content.categories.map(cat => ({
            ...cat,
            items: cat.items.map((item: any) => item.id === id ? { ...item, ...updates } : item)
        }));
        return { ...prev, content: { ...prev.content, categories: newCategories } };
    });
  };

  const addItem = (categoryId: string, item: Partial<MenuItem>) => {
    if (useMavadaV2) return toast.info("Utilisez Mavada Studio V2");
  };

  const deleteItem = (id: string) => {
    if (useMavadaV2) return toast.info("Utilisez Mavada Studio V2");
  };

  const moveItem = (activeId: string, overId: string) => {
    // simplified implementation for context
  };
  const moveItemUp = (itemId: string) => {};
  const moveItemDown = (itemId: string) => {};
  
  const getItem = (id: string) => {
    if (!blueprint) return undefined;
    for (const cat of blueprint.content.categories) {
      const item = cat.items.find((i: any) => i.id === id);
      if (item) return item;
    }
    return undefined;
  };

  const getAllItems = () => {
      if (!blueprint) return [];
      return blueprint.content.categories.flatMap((c: any) => c.items);
  };

  const save = async () => {
    setIsSaving(true);
    try {
        if (!blueprint || !activeMenuId) return;
        if (isSupabaseConfigured) {
            const visualConfig = {
                templateId: blueprint.id,
                globalTheme: {
                    primaryColor: blueprint.globalStyle.primaryColor,
                    backgroundColor: blueprint.globalStyle.backgroundColor,
                    fontFamily: blueprint.globalStyle.font,
                    roundedCorners: blueprint.globalStyle.borderRadius === 'rounded-2xl' ? '24px' : '0px',
                },
                layout: blueprint.layout
            };
            await supabase.from('menus').update({ visual_config: visualConfig, template_id: blueprint.id }).eq('id', activeMenuId);
            toast.success("Menu sauvegardé !");
        } else {
            await new Promise(r => setTimeout(r, 1000));
            toast.success("Sauvegardé (Mode Local)");
        }
    } catch (e) {
        toast.error("Erreur lors de la sauvegarde.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <BuilderContext.Provider value={{
      blueprint, isLoading, isSaving, selectedId, selectedType,
      loadMenu, changeTemplate,
      updateGlobalStyle, updateHero, updateLayout,
      addCategory, updateCategory, deleteCategory, moveCategory,
      addItem, updateItem, deleteItem, moveItem, moveItemUp, moveItemDown, getItem, getAllItems,
      selectElement, save, heatmapMode, toggleHeatmap
    }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (context === undefined) throw new Error('useBuilder must be used within a BuilderProvider');
  return context;
};

export const useOptionalBuilder = () => {
  const context = useContext(BuilderContext);
  return context || null;
};
