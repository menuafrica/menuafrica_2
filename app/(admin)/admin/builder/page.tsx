"use client";
import React, { useState, useEffect, useActionState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button, Input, Label, Dialog, toast } from '@/components/ui/uicomponents';
import { Plus, Loader2, LayoutGrid, Edit3, ArrowRight, Settings } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { StudioV2 } from '@/components/studio-v2/StudioV2';
import { Menu } from '@/types';
import { DEMO_MENUS } from '@/lib/demoData';

export default function MavadaBuilder() {
  const { restaurant, loading: authLoading, isDemo } = useAuth();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const selectedMenuId = searchParams?.get('menuId') || null;
  const setSelectedMenuId = (id: string | null) => {
    if (id) {
      router.push(`/admin/builder?menuId=${id}`);
    } else {
      router.push(`/admin/builder`);
    }
  };
  
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');

  const [state, createAction, isCreating] = useActionState(async (prevState: any, formData: FormData) => {
    const menuName = formData.get('menuName') as string;
    if (!menuName?.trim()) return { error: "Nom requis" };

    const slug = menuName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newMenuObj = {
        name: menuName,
        slug: slug,
        restaurant_id: restaurant?.id || 'demo',
        is_active: true,
        is_default: menus.length === 0,
        visual_config: {}
    };

    try {
        let createdId = '';

        if (isSupabaseConfigured && restaurant?.id) {
            const { data, error } = await supabase.from('menus').insert([newMenuObj]).select('id, restaurant_id, name, slug, is_active, is_default, created_at').single();
            if (error) throw error;
            if (data) {
                const newList = [data, ...menus];
                const uniqueList = newList.filter((menu, index, self) =>
                    index === self.findIndex((m) => m.id === menu.id)
                );
                setMenus(uniqueList);
                createdId = data.id;
            }
        } else {
            createdId = `new-${Date.now()}`;
            const mockNew = { ...newMenuObj, id: createdId };
            setMenus([mockNew as any, ...menus]);
        }

        toast.success("Design créé !");
        setIsModalOpen(false);
        setNewMenuName('');
        setSelectedMenuId(createdId);
        return { success: true };
    } catch (e: any) {
        toast.error("Erreur création: " + e.message);
        return { error: e.message };
    }
  }, { success: false });

  const loadMenus = async (isMounted: boolean = true) => {
      if (authLoading) return;

      if (isDemo) {
          if (isMounted) {
              setMenus(DEMO_MENUS);
              setIsLoading(false);
          }
          return;
      }

      if (!restaurant?.id && isSupabaseConfigured) {
          if (isMounted) setIsLoading(false);
          return;
      }

      if (isMounted) setIsLoading(true);
      
      try {
          if (isSupabaseConfigured && restaurant?.id) {
              const { data, error } = await supabase
                .from('menus')
                .select('id, restaurant_id, name, slug, is_active, is_default, created_at') 
                .eq('restaurant_id', restaurant.id)
                .order('created_at', { ascending: false });
              
              if (error) throw error;
              if (isMounted) {
                  const uniqueData = (data || []).filter((menu, index, self) =>
                      index === self.findIndex((m) => m.id === menu.id)
                  );
                  setMenus(uniqueData);
              }
          } else {
              const saved = localStorage.getItem('local_menus_data');
              if (isMounted) {
                  setMenus(saved ? JSON.parse(saved) : []);
              }
          }
      } catch (e) {
          console.error("Erreur chargement menus:", e);
          toast.error("Impossible de charger les menus.");
      } finally {
          if (isMounted) setIsLoading(false);
      }
  };

  useEffect(() => {
      let isMounted = true;
      loadMenus(isMounted);
      return () => { isMounted = false; };
  }, [restaurant?.id, authLoading]);

  useEffect(() => {
    if (selectedMenuId === null) {
      loadMenus();
    }
  }, [selectedMenuId]);

  if (selectedMenuId) {
      return (
        <StudioV2 
            menuId={selectedMenuId} 
            onBack={() => setSelectedMenuId(null)} 
        />
      );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2rem] animate-fade-in flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        {!isSupabaseConfigured && (
            <div className="max-w-6xl mx-auto w-full mb-6">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 text-amber-800 shadow-sm">
                    <div className="bg-amber-100 p-2 rounded-xl">
                        <Settings className="text-amber-600" size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold">{t('missingSupabaseConfig')}</p>
                        <p className="text-xs opacity-80">{t('demoModeWarningText')}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.push('/admin/test-connection')} className="border-amber-200 hover:bg-amber-100 text-amber-700">
                            {t('tester')}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => router.push('/admin/settings')} className="border-amber-200 hover:bg-amber-100 text-amber-700">
                            {t('configurer')}
                        </Button>
                    </div>
                </div>
            </div>
        )}
        <div className="max-w-6xl mx-auto space-y-10 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="text-3xl">🤭</span> {t('mavadaStudio')}
                        {isDemo && (
                          <span className="bg-orange-100 text-[#c25e00] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            Mode Démo
                          </span>
                        )}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                        {t('mavadaDesc')}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => router.push('/admin/mavada-settings')} className="px-6 py-6 text-lg rounded-2xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Settings className="mr-2" /> {t('settings')}
                    </Button>
                    <Button onClick={() => setIsModalOpen(true)} className="bg-[#c25e00] hover:bg-[#a04e00] text-white shadow-lg shadow-orange-500/20 px-8 py-6 text-lg rounded-2xl">
                        <Plus className="mr-2" /> {t('newDesign')}
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="animate-spin text-[#c25e00]" size={48} />
                    <p className="text-slate-400 font-medium">{t('loading')}</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="group border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-[#c25e00] hover:bg-orange-50 dark:hover:bg-slate-800 transition-all min-h-[250px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#c25e00] group-hover:scale-110 transition-transform">
                            <Plus size={32} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-600 dark:text-slate-300 group-hover:text-[#c25e00]">{t('createMenu')}</h3>
                        </div>
                    </button>

                    {menus.map(menu => (
                        <div 
                            key={menu.id}
                            className="bg-white dark:bg-slate-800 rounded-[2rem] p-1 shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700 flex flex-col group relative overflow-hidden h-full"
                        >
                            <div className="h-40 bg-slate-100 dark:bg-slate-900 rounded-t-[1.8rem] flex items-center justify-center relative overflow-hidden">
                                <LayoutGrid size={64} className="text-slate-200 dark:text-slate-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                    <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Edit3 size={14}/> {t('edit')}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6 flex flex-col gap-4 flex-1">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-[#c25e00] transition-colors line-clamp-1">
                                            {menu.name}
                                        </h3>
                                        {menu.is_default && (
                                            <span className="shrink-0 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                                {t('default')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-400 font-mono">/{menu.slug}</p>
                                </div>
                                
                                <div className="mt-auto pt-4">
                                    <Button 
                                        onClick={() => setSelectedMenuId(menu.id)}
                                        className="w-full bg-slate-900 dark:bg-slate-700 text-white hover:bg-[#c25e00] rounded-xl h-12 shadow-none group-hover:shadow-lg transition-all"
                                    >
                                        {t('openStudio')} <ArrowRight size={16} className="ml-2"/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} title={t('newMenu')}>
            <form action={createAction} className="space-y-6 mt-4">
                <div className="space-y-2">
                    <Label>{t('menuName')}</Label>
                    <Input 
                        name="menuName"
                        autoFocus
                        placeholder="Ex: Carte des Vins, Menu Été..." 
                        value={newMenuName}
                        onChange={e => setNewMenuName(e.target.value)}
                        required
                        className="h-12 rounded-xl text-lg"
                    />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>{t('cancel')}</Button>
                    <Button type="submit" isLoading={isCreating} className="bg-[#c25e00] hover:bg-[#a04e00] text-white">
                        {t('createAndEdit')}
                    </Button>
                </div>
            </form>
        </Dialog>
    </div>
  );
}
