"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Button, Label, toast, Input } from '@/components/ui/uicomponents';
import { Download, UploadCloud, Printer, FileText, Layers, Check, Palette } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import QRCodeStyling from 'qr-code-styling';
import { cn } from '@/lib/utils';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Menu } from '@/types';
import { mockMenus } from '@/lib/mockData';
import { DEMO_MENUS } from '@/lib/demoData';
import { useLanguage } from '@/context/LanguageContext';

export default function QRCodePage() {
  const { user, organization, restaurant, isDemo } = useAuth();
  const { t } = useLanguage();
  const qrRef = useRef<HTMLDivElement>(null);
  
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mode, setMode] = useState<'single' | 'fusion'>('single');
  const [selectedMenuId, setSelectedMenuId] = useState<string>('');
  const [selectedFusionIds, setSelectedFusionIds] = useState<string[]>([]);
  
  const [options, setOptions] = useState({
    color: '#c25e00',
    bgColor: '#ffffff',
    size: 300,
    showLogo: true,
    dotsType: 'rounded' as const,
    cornerSquareType: 'extra-rounded' as const
  });

  const [qrCode] = useState(new QRCodeStyling({
    width: options.size,
    height: options.size,
    type: 'svg',
    imageOptions: { crossOrigin: 'anonymous', margin: 10 }
  }));

  useEffect(() => {
    const fetchMenus = async () => {
        if (!restaurant?.id && !isDemo) return;
        setLoading(true);
        if (isDemo) {
            setMenus(DEMO_MENUS as Menu[]);
            if (DEMO_MENUS.length > 0) setSelectedMenuId(DEMO_MENUS[0].id);
            setLoading(false);
            return;
        }
        if (isSupabaseConfigured && restaurant?.id) {
            const { data } = await supabase.from('menus').select('*').eq('restaurant_id', restaurant.id).eq('is_active', true);
            setMenus((data || []) as Menu[]);
            if (data && data.length > 0) setSelectedMenuId(data[0].id);
        } else {
            setMenus(mockMenus as Menu[]);
            if (mockMenus.length > 0) setSelectedMenuId(mockMenus[0].id);
        }
        setLoading(false);
    };
    fetchMenus();
  }, [restaurant, isDemo]);

  const getQrUrl = () => {
    const baseUrl = `${window.location.origin}/menu/${restaurant?.subdomain || 'demo'}`;
    if (mode === 'single') {
        const menu = menus.find(m => m.id === selectedMenuId);
        return menu ? `${baseUrl}/${menu.slug}` : baseUrl;
    }
    if (selectedFusionIds.length > 0) {
        const slugs = menus.filter(m => selectedFusionIds.includes(m.id)).map(m => m.slug).join(',');
        return `${baseUrl}?menus=${slugs}`;
    }
    return baseUrl;
  };

  useEffect(() => {
    if (qrRef.current) {
        qrRef.current.innerHTML = '';
        qrCode.append(qrRef.current);
        qrCode.update({
            data: getQrUrl(),
            width: options.size,
            height: options.size,
            dotsOptions: { color: options.color, type: options.dotsType },
            backgroundOptions: { color: options.bgColor },
            cornersSquareOptions: { type: options.cornerSquareType, color: options.color },
            image: options.showLogo ? restaurant?.logo_url : undefined
        });
    }
  }, [options, restaurant, mode, selectedMenuId, selectedFusionIds]);

  const handleDownload = (ext: 'png' | 'svg') => {
    qrCode.download({ name: 'menu-qr', extension: ext });
    toast.success(`${t('saved')} (${ext.toUpperCase()})`);
  };

  const handleSaveToCloud = async () => {
    if (!isSupabaseConfigured) {
        toast.info(t('onlySupabase') || "Disponible uniquement en mode connecté (Supabase).");
        return;
    }
    
    setIsSaving(true);
    try {
        const blob = await qrCode.getRawData('png');
        if (blob && organization?.id) {
            const fileName = `${organization.id}/qr-${selectedMenuId || 'global'}-${Date.now()}.png`;

            const { error } = await supabase.storage
                .from('menuafrica-qr-codes')
                .upload(fileName, blob, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;
            toast.success(t('qrSavedCloud') || "QR Code sauvegardé dans le Cloud !");
        } else {
            throw new Error("Impossible de générer le fichier image ou Organisation inconnue.");
        }
    } catch (e: any) {
        console.error(e);
        toast.error((t('saveError') || "Erreur de sauvegarde : ") + e.message);
    } finally {
        setIsSaving(false);
    }
  };

  const toggleFusionMenu = (id: string) => {
      setSelectedFusionIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12 dark:text-slate-100">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
            <h1 className="text-3xl font-serif font-bold dark:text-white flex items-center gap-3">
                {t('qrTitle')}
                {isDemo && (
                  <span className="bg-orange-100 text-[#c25e00] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    {t('demoMode') || 'Mode Démo'}
                  </span>
                )}
            </h1>
            <p className="text-slate-500">{t('qrDesc')}</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleDownload('png')} className="dark:bg-slate-800 dark:text-white dark:border-slate-700">
                <Download size={16} className="mr-2" /> PNG
            </Button>
            
            <Button 
                onClick={handleSaveToCloud} 
                isLoading={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
            >
                <UploadCloud size={16} className="mr-2" /> {t('saveCloud')}
            </Button>

            <Button className="bg-[#c25e00] text-white hover:bg-[#a04e00] shadow-lg shadow-orange-500/20">
                <Printer size={16} className="mr-2" /> PDF
            </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
           
           <Card className="border-none shadow-md bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden">
               <div className="flex border-b border-slate-100 dark:border-slate-700">
                   <button onClick={() => setMode('single')} className={cn("flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors", mode === 'single' ? "bg-orange-50 dark:bg-orange-900/20 text-[#c25e00]" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700")}>
                       <FileText size={16} /> {t('singleMenu')}
                   </button>
                   <button onClick={() => setMode('fusion')} className={cn("flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors", mode === 'fusion' ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700")}>
                       <Layers size={16} /> {t('fusionPro')}
                   </button>
               </div>
               
               <CardContent className="p-6">
                   {mode === 'single' ? (
                       <div className="space-y-3">
                           <Label>{t('selectMenu')}</Label>
                           <select value={selectedMenuId} onChange={(e) => setSelectedMenuId(e.target.value)} className="w-full h-12 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#c25e00]/20">
                               {menus.map(menu => <option key={menu.id} value={menu.id}>{menu.name}</option>)}
                           </select>
                       </div>
                   ) : (
                       <div className="space-y-3">
                           <Label>{t('combineMenus')}</Label>
                           <div className="grid gap-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                               {menus.map(menu => (
                                   <div key={menu.id} onClick={() => toggleFusionMenu(menu.id)} className={cn("flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all", selectedFusionIds.includes(menu.id) ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-500/50" : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700")}>
                                       <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{menu.name}</span>
                                       {selectedFusionIds.includes(menu.id) && <Check size={12} className="text-purple-600 dark:text-purple-400"/>}
                                   </div>
                               ))}
                           </div>
                       </div>
                   )}
               </CardContent>
           </Card>

           <Card className="border-none shadow-md bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden">
               <div className="p-4 border-b border-slate-100 dark:border-slate-700 font-bold flex items-center gap-2 text-slate-700 dark:text-white">
                    <Palette size={16} /> {t('visualCustom')}
               </div>
               <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('dotsColor')}</Label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={options.color} onChange={(e) => setOptions({...options, color: e.target.value})} className="h-10 w-10 rounded cursor-pointer border-none" />
                                <Input value={options.color} onChange={(e) => setOptions({...options, color: e.target.value})} className="uppercase" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>{t('bgColor')}</Label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={options.bgColor} onChange={(e) => setOptions({...options, bgColor: e.target.value})} className="h-10 w-10 rounded cursor-pointer border-none" />
                                <Input value={options.bgColor} onChange={(e) => setOptions({...options, bgColor: e.target.value})} className="uppercase" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>{t('dotsStyle') || 'Style des points'}</Label>
                        <select 
                            value={options.dotsType} 
                            onChange={(e) => setOptions({...options, dotsType: e.target.value as any})}
                            className="w-full h-10 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 text-slate-900 dark:text-white outline-none"
                        >
                            <option value="rounded">{t('patternRounded') || 'Arrondi (Standard)'}</option>
                            <option value="dots">{t('patternDots') || 'Points'}</option>
                            <option value="classy">{t('patternClassy') || 'Classy'}</option>
                            <option value="classy-rounded">{t('patternClassyRounded') || 'Classy Rounded'}</option>
                            <option value="square">{t('patternSquare') || 'Carré'}</option>
                            <option value="extra-rounded">{t('patternExtraRounded') || 'Extra Arrondi'}</option>
                        </select>
                    </div>
               </CardContent>
           </Card>
        </div>

        <div className="lg:col-span-7">
           <div className="bg-slate-100 dark:bg-slate-900 rounded-[3rem] p-12 flex items-center justify-center min-h-[600px] border border-slate-200 dark:border-slate-800 sticky top-24">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-[8px] border-white flex flex-col items-center transform transition-transform hover:scale-105 duration-500">
                  <h3 className="font-serif font-bold text-2xl mb-6 text-slate-900">{restaurant?.name || 'Restaurant'}</h3>
                  <div ref={qrRef} className="qr-container bg-white rounded-xl overflow-hidden" />
                  <div className="mt-8 text-center bg-slate-50 px-6 py-2 rounded-full border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">{t('scanToDiscover') || 'Scannez pour découvrir'}</p>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
