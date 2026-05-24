"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button, toast } from '@/components/ui/uicomponents';
import { Settings, ArrowLeft, Loader2, Save } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function MavadaSettingsPage() {
    const { restaurant } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [config, setConfig] = useState({
        intentionGateActive: true,
        intentionGateBlur: 'blur-xl',
        intentionGateSkipText: 'Passer et voir toute la carte',
        intentionTitle: 'Bienvenue !',
        intentionSubtitle: 'Quelle est votre envie du moment ?',
        categoryNavActive: true,
        cartShow: true,
    });

    useEffect(() => {
        if (!restaurant?.id) {
            setIsLoading(false);
            return;
        }

        const fetchSettings = async () => {
            if (!isSupabaseConfigured) {
                const localStr = localStorage.getItem(`mavada_settings_${restaurant.id}`);
                if (localStr) {
                    setConfig({ ...config, ...JSON.parse(localStr) });
                }
                setIsLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('restaurants')
                    .select('theme_settings')
                    .eq('id', restaurant.id)
                    .single();

                if (error) throw error;
                if (data?.theme_settings?.public_config) {
                    setConfig({ ...config, ...data.theme_settings.public_config });
                }
            } catch (err: any) {
                console.error("Fetch settings error", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, [restaurant?.id]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (!isSupabaseConfigured) {
                localStorage.setItem(`mavada_settings_${restaurant?.id}`, JSON.stringify(config));
                toast.success('Paramètres sauvegardés (Local)');
                setIsSaving(false);
                return;
            }
            
            const { data: currentData } = await supabase
                .from('restaurants')
                .select('theme_settings')
                .eq('id', restaurant!.id)
                .single();
                
            const newThemeSettings = {
                ...(currentData?.theme_settings || {}),
                public_config: config
            };

            const { error } = await supabase
                .from('restaurants')
                .update({ theme_settings: newThemeSettings })
                .eq('id', restaurant!.id);

            if (error) throw error;
            toast.success('Paramètres sauvegardés avec succès');
        } catch (error: any) {
            console.error("Save settings error", error);
            toast.error(error.message || 'Erreur lors de la sauvegarde');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col flex-1 items-center justify-center">
                <Loader2 className="animate-spin text-orange-500 mb-4" size={32} />
                <p className="text-slate-500">Chargement des paramètres...</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-900 p-4 md:p-8 rounded-[2rem] flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
                <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
                    <button 
                        onClick={() => router.push('/admin/builder')}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Settings className="text-orange-500" /> Paramètres du Menu Public
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">Gérez le comportement et la logique de votre menu côté client.</p>
                    </div>
                </div>

                <div className="grid gap-8">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Écran de Bienvenue (Intention Gate)</h2>
                            <p className="text-sm text-slate-500">Demande au client ce qu'il souhaite (Manger, Boire, etc.) en arrivant sur le menu.</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Activer l'écran de bienvenue</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={config.intentionGateActive} onChange={e => setConfig({...config, intentionGateActive: e.target.checked})} />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                            </label>
                        </div>

                        {config.intentionGateActive && (
                            <>
                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Titre Principal</label>
                                        <input 
                                            type="text"
                                            value={config.intentionTitle || 'Bienvenue !'}
                                            onChange={e => setConfig({...config, intentionTitle: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3"
                                            placeholder="Ex: Bienvenue !"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Sous-titre (Question)</label>
                                        <input 
                                            type="text"
                                            value={config.intentionSubtitle || 'Quelle est votre envie du moment ?'}
                                            onChange={e => setConfig({...config, intentionSubtitle: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3"
                                            placeholder="Ex: Petite faim ou Faim de loup ?"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Floutage de l'arrière-plan</label>
                                        <select 
                                            value={config.intentionGateBlur}
                                            onChange={e => setConfig({...config, intentionGateBlur: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3"
                                        >
                                            <option value="blur-none">Pas de flou</option>
                                            <option value="blur-sm">Peu flouté</option>
                                            <option value="blur-md">Moyennement flouté</option>
                                            <option value="blur-xl">Très flouté</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Texte du bouton "Passer"</label>
                                    <input 
                                        type="text"
                                        value={config.intentionGateSkipText}
                                        onChange={e => setConfig({...config, intentionGateSkipText: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3"
                                        placeholder="Ex: Passer et voir toute la carte"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Navigation & Filtres</h2>
                            <p className="text-sm text-slate-500">Barre de navigation par catégorie.</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Afficher la barre de catégories</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={config.categoryNavActive} onChange={e => setConfig({...config, categoryNavActive: e.target.checked})} />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                            </label>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Fonctionnalité Panier</h2>
                            <p className="text-sm text-slate-500">Afficher ou masquer les boutons d'ajout au panier.</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Activer le Panier Client</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={config.cartShow} onChange={e => setConfig({...config, cartShow: e.target.checked})} />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            isLoading={isSaving}
                            className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8 h-12"
                        >
                            <Save className="mr-2" size={20} /> Enregistrer
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
