"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/uicomponents';
import { Button, Switch, Dialog, Input, Label, toast } from '@/components/ui/uicomponents';
import { QrCode, Edit2, Copy, Trash2, MoreVertical, Star, Plus, Eye, Loader2, AlertTriangle, ExternalLink, Link as LinkIcon, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { mockMenus } from '@/lib/mockData';

export default function MenusPage() {
  const router = useRouter();
  const { user, restaurant } = useAuth();
  const { t } = useLanguage(); 
  
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMenuPickerOpen, setIsMenuPickerOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);
  
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [menuForm, setMenuForm] = useState({ name: '', slug: '' });
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchMenus = async () => {
    if (!restaurant?.id) {
        if (!isLoading) setIsLoading(false);
        return;
    }
    
    setIsLoading(true);

    try {
        if (isSupabaseConfigured) {
            const { data, error } = await supabase
                .from('menus')
                .select('id, restaurant_id, name, slug, is_active, is_default, template_id, created_at')
                .eq('restaurant_id', restaurant.id) 
                .order('is_default', { ascending: false })
                .order('created_at', { ascending: true });

            if (error) throw error;
            
            const uniqueData = (data || []).filter((menu, index, self) =>
                index === self.findIndex((m) => m.id === menu.id)
            );
            setMenus(uniqueData as Menu[]);
        } else {
            throw new Error("Mode Demo");
        }
    } catch (error) {
        const savedMenus = localStorage.getItem('local_menus_data');
        if (savedMenus) {
            setMenus(JSON.parse(savedMenus));
        } else {
            setMenus(mockMenus as Menu[]);
            localStorage.setItem('local_menus_data', JSON.stringify(mockMenus));
        }
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => { fetchMenus(); }, [restaurant]); 

  const saveToLocal = (updatedMenus: Menu[]) => {
      localStorage.setItem('local_menus_data', JSON.stringify(updatedMenus));
  };

  const copyMenuLink = (slug: string) => {
    const url = `${window.location.origin}/menu/${restaurant?.subdomain || 'demo'}/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success(t('saved')); 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenCreate = () => {
    setEditingMenu(null);
    setMenuForm({ name: '', slug: '' });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setMenuForm({ name: menu.name, slug: menu.slug });
    setIsFormOpen(true);
    setActiveDropdownId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuForm.name.trim() || !restaurant?.id) {
        toast.error("Erreur: Restaurant non identifié");
        return;
    }
    setIsSubmitting(true);

    const slug = menuForm.slug.trim() || menuForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
        let updatedList = [...menus];

        if (editingMenu) {
            if (isSupabaseConfigured) {
                await supabase
                  .from('menus')
                  .update({ name: menuForm.name, slug })
                  .eq('id', editingMenu.id);
            }
            updatedList = menus.map(m => m.id === editingMenu.id ? { ...m, name: menuForm.name, slug } : m);
            toast.success(t('saved'));
        } else {
            const newMenuObj: any = {
                restaurant_id: restaurant.id, 
                name: menuForm.name,
                slug: slug,
                is_active: true,
                is_default: menus.length === 0
            };

            if (isSupabaseConfigured) {
                const { data, error } = await supabase.from('menus').insert([newMenuObj]).select('id, restaurant_id, name, slug, is_active, is_default, template_id, created_at').single();
                if (error) throw error;
                if (data) {
                    const newList = [...menus, data as Menu];
                    updatedList = newList.filter((m, index, self) => 
                        index === self.findIndex((t) => t.id === m.id)
                    );
                }
            } else {
                newMenuObj.id = Math.random().toString(36).substr(2, 9);
                updatedList = [...menus, newMenuObj];
            }
            toast.success(t('saved'));
        }

        setMenus(updatedList);
        saveToLocal(updatedList);
        setIsFormOpen(false);
    } catch (err: any) {
        console.error(err);
        toast.error(t('error') + ": " + err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const confirmDelete = (menu: Menu, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdownId(null);
    setMenuToDelete(menu);
  };

  const performDelete = async () => {
    if (!menuToDelete) return;
    setIsSubmitting(true);
    try {
        if (isSupabaseConfigured) {
            await supabase.from('menus').delete().eq('id', menuToDelete.id);
        }
        const updatedList = menus.filter(m => m.id !== menuToDelete.id);
        setMenus(updatedList);
        saveToLocal(updatedList);
        toast.success(t('saved'));
        setMenuToDelete(null);
    } catch (err) {
        toast.error(t('error'));
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDuplicate = async (menu: Menu) => {
      setActiveDropdownId(null);
      try {
          const newName = `${menu.name} (Copy)`;
          const newSlug = `${menu.slug}-copy-${Math.floor(Math.random() * 1000)}`;
          let updatedList = [...menus];
          
          if (isSupabaseConfigured) {
              const { data, error } = await supabase.from('menus').insert([{
                  restaurant_id: restaurant?.id,
                  name: newName,
                  slug: newSlug,
                  is_active: false,
                  is_default: false
              }]).select('id, restaurant_id, name, slug, is_active, is_default, template_id, created_at').single();
              
              if (!error && data) {
                  const newList = [...menus, data as Menu];
                  updatedList = newList.filter((m, index, self) => 
                      index === self.findIndex((t) => t.id === m.id)
                  );
              } else {
                  throw new Error(error?.message);
              }
          } else {
              throw new Error("Local Mode");
          }
          
          setMenus(updatedList);
          saveToLocal(updatedList);
          toast.success(t('saved'));
      } catch (err: any) {
          toast.error("Erreur duplication: " + err.message);
      }
  };

  const handleToggleStatus = async (menu: Menu, checked: boolean) => {
    if (isSupabaseConfigured) {
        supabase.from('menus').update({ is_active: checked }).eq('id', menu.id).then(() => {});
    }
    const updatedList = menus.map(m => m.id === menu.id ? { ...m, is_active: checked } : m);
    setMenus(updatedList);
    saveToLocal(updatedList);
    toast.success(t('saved'));
  };

  const filteredMenus = menus.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 w-full animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">{t('menusTitle')}</h1>
           <p className="text-gray-500 dark:text-gray-400">{t('menusDesc')}</p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" className="rounded-full border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" onClick={() => setIsMenuPickerOpen(true)}>
                <Eye className="mr-2 h-4 w-4" /> {t('viewPublicMenu')}
            </Button>
            <Button onClick={handleOpenCreate} className="bg-[#f97316] hover:bg-[#ea580c] shadow-lg shadow-orange-500/20 rounded-full px-8 border-none text-white">
                <Plus className="mr-2 h-4 w-4" /> {t('newMenu')}
            </Button>
        </div>
      </div>

      <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder={t('search')} 
            className="w-full h-12 pl-12 pr-4 rounded-2xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all text-sm shadow-sm dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>

      {isLoading ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredMenus.map((menu) => (
            <Card key={menu.id} className="group border-none shadow-sm hover:shadow-2xl transition-all bg-white dark:bg-gray-800 flex flex-col relative overflow-visible rounded-[2.5rem]">
                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-[#c25e00] dark:text-orange-400 flex items-center justify-center border border-orange-100 dark:border-orange-900 shadow-sm">
                            <QrCode className="h-7 w-7" />
                        </div>
                        
                        <div className="flex items-center gap-2 relative">
                            {menu.is_default && (
                                <div className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1.5 rounded-full border border-yellow-100 dark:border-yellow-900 shadow-sm">
                                    <Star size={10} fill="currentColor" /> {t('mainMenu')}
                                </div>
                            )}
                            
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdownId(activeDropdownId === menu.id ? null : menu.id);
                                }}
                                className={cn(
                                    "p-2.5 rounded-full transition-all dark:text-gray-300",
                                    activeDropdownId === menu.id ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                )}
                            >
                                <MoreVertical size={22} />
                            </button>

                            {activeDropdownId === menu.id && (
                                <div ref={dropdownRef} className="absolute top-12 right-0 w-60 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-[100] animate-scale-in origin-top-right overflow-hidden py-2">
                                    <button onClick={() => handleOpenEdit(menu)} className="w-full text-left px-5 py-3.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 font-semibold transition-colors">
                                        <Edit2 size={16} className="text-gray-400" /> {t('edit')}
                                    </button>
                                    <button onClick={() => { router.push(`/admin/builder?menuId=${menu.id}`); setActiveDropdownId(null); }} className="w-full text-left px-5 py-3.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 font-semibold transition-colors">
                                        <QrCode size={16} className="text-gray-400" /> {t('builderTitle')}
                                    </button>
                                    <button onClick={() => handleDuplicate(menu)} className="w-full text-left px-5 py-3.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 font-semibold transition-colors">
                                        <Copy size={16} className="text-gray-400" /> {t('duplicate')}
                                    </button>
                                    <div className="h-px bg-gray-100 dark:bg-gray-700 mx-3 my-1" />
                                    <button 
                                        onClick={(e) => confirmDelete(menu, e)} 
                                        className="w-full text-left px-5 py-3.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 font-bold transition-colors"
                                    >
                                        <Trash2 size={16} /> {t('delete')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-1">{menu.name}</h3>
                        <p className="text-sm text-gray-400 font-mono tracking-tighter">/{menu.slug}</p>
                    </div>

                    <div className="flex items-center justify-between mb-8 p-5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{t('activeStatus')}</span>
                        <Switch checked={menu.is_active} onCheckedChange={(c) => handleToggleStatus(menu, c)} />
                    </div>

                    <div className="flex gap-4 mt-auto">
                        <Button variant="outline" className="flex-1 h-14 rounded-2xl text-xs font-bold border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" onClick={() => router.push('/admin/qrcode')}>
                            QR Code
                        </Button>
                        <Button className="flex-1 bg-[#f97316] hover:bg-[#ea580c] h-14 rounded-2xl text-xs font-bold shadow-orange-500/10 shadow-lg border-none text-white" onClick={() => router.push(`/admin/builder?menuId=${menu.id}`)}>
                            <Edit2 size={14} className="mr-2" /> {t('edit')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            ))}
            
            {filteredMenus.length === 0 && (
                <div className="col-span-full py-24 text-center bg-white/50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[3rem] animate-pulse">
                    <Plus className="mx-auto text-gray-300 mb-4" size={56} />
                    <p className="text-gray-500 font-bold text-lg">{menus.length === 0 ? t('emptyMenuDesc') : 'Aucun menu trouvé.'}</p>
                </div>
            )}
        </div>
      )}

      {menuToDelete && (
          <Dialog open={!!menuToDelete} onOpenChange={() => setMenuToDelete(null)} title="Supprimer le menu ?">
              <div className="mt-4 space-y-4">
                  <p className="text-slate-600 dark:text-slate-300">
                      Êtes-vous sûr de vouloir supprimer <strong>{menuToDelete.name}</strong> ? Cette action est irréversible.
                  </p>
                  <div className="flex justify-end gap-3 pt-4">
                      <Button variant="ghost" onClick={() => setMenuToDelete(null)}>{t('cancel')}</Button>
                      <Button variant="destructive" isLoading={isSubmitting} onClick={performDelete}>{t('delete')}</Button>
                  </div>
              </div>
          </Dialog>
      )}

      <Dialog open={isMenuPickerOpen} onOpenChange={setIsMenuPickerOpen} title={t('viewPublicMenu')}>
         <div className="space-y-3 mt-4">
            {menus.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Aucun menu actif.</p>
            ) : (
              menus.map(menu => (
                <div key={menu.id} className={cn("flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-transparent transition-all", menu.is_active ? "hover:border-gray-200 dark:hover:border-gray-500 hover:bg-white dark:hover:bg-gray-600" : "opacity-60 grayscale")}>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-600 shadow-sm"><QrCode size={18} className="text-[#f97316]" /></div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{menu.name}</p>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">/{menu.slug}</span>
                            {!menu.is_active && <span className="text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">{t('inactive')}</span>}
                        </div>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => copyMenuLink(menu.slug)} className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 shadow-sm" title="Copier"><LinkIcon size={16} /></button>
                      <Link 
                        href={`/menu/${restaurant?.subdomain || 'demo'}/${menu.slug}`} 
                        className="p-2 bg-gray-900 text-white hover:bg-[#f97316] rounded-lg transition-all shadow-sm flex items-center justify-center" 
                        title="Ouvrir"
                        onClick={() => setIsMenuPickerOpen(false)}
                      >
                        <ExternalLink size={16} />
                      </Link>
                   </div>
                </div>
              ))
            )}
         </div>
         <div className="flex justify-end pt-4">
             <Button variant="ghost" className="dark:text-white" onClick={() => setIsMenuPickerOpen(false)}>{t('cancel')}</Button>
         </div>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen} title={editingMenu ? t('edit') : t('newMenu')}>
        <form onSubmit={handleSave} className="space-y-6 mt-6">
           <div className="space-y-2">
             <Label>{t('menuName')}</Label>
             <Input 
                placeholder="Ex: Carte du Soir..." 
                value={menuForm.name} 
                onChange={(e) => {
                    setMenuForm({ ...menuForm, name: e.target.value, slug: editingMenu ? menuForm.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
                }} 
                required 
                autoFocus 
                className="h-14 rounded-2xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
             />
           </div>
           <div className="space-y-2">
              <Label>{t('menuSlug')}</Label>
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 border border-gray-200 dark:border-gray-600 focus-within:bg-white dark:focus-within:bg-gray-600 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="text-gray-400 text-xs font-mono mr-2">/menu/</span>
                <Input 
                    className="bg-transparent border-none shadow-none px-0 h-14 text-sm font-mono dark:text-white" 
                    value={menuForm.slug} 
                    onChange={(e) => setMenuForm({ ...menuForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} 
                    required
                />
              </div>
           </div>
           <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
             <Button type="button" variant="ghost" className="rounded-xl dark:text-white" onClick={() => setIsFormOpen(false)}>{t('cancel')}</Button>
             <Button type="submit" isLoading={isSubmitting} className="bg-primary text-white px-10 rounded-xl shadow-lg shadow-orange-500/20">
                {t('save')}
             </Button>
           </div>
        </form>
      </Dialog>
    </div>
  );
}
