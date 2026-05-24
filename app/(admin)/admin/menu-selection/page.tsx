"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/uicomponents';
import { Zap, ArrowRight } from 'lucide-react';

export default function MenuModeSelection() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12 pt-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">Éditeur de Menu</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Gérez votre carte simplement et efficacement.</p>
      </div>

      <div className="flex justify-center h-[450px]">
        {/* OPTION 1: QUICK BUILDER (Standard) - Centered and full featured */}
        <div 
          onClick={() => router.push('/admin/menus')}
          className="group cursor-pointer w-full max-w-md h-full"
        >
          <Card className="h-full border-2 border-transparent hover:border-orange-200 hover:shadow-2xl transition-all duration-500 overflow-hidden relative bg-white dark:bg-slate-800 flex flex-col">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600" />
            <CardContent className="p-10 flex flex-col items-center text-center h-full">
              <div className="w-24 h-24 rounded-3xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <Zap size={48} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Mode Rapide</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-lg">
                L'outil essentiel pour la gestion quotidienne. Ajoutez des plats, ajustez les prix et organisez vos catégories avec une interface fluide.
              </p>
              <div className="mt-auto flex items-center text-orange-600 dark:text-orange-400 font-bold text-lg group-hover:gap-3 transition-all">
                Accéder au constructeur <ArrowRight size={20} className="ml-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
