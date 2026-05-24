"use client";
import React, { useState, useEffect } from 'react';
import { Utensils, Heart, Sparkles, Quote, ChefHat } from 'lucide-react';
import { cn } from '@/components/ui/uicomponents';

interface ImmersiveLoaderProps {
  mode?: 'signin' | 'signup' | 'default';
  className?: string;
}

const FUN_FACTS = [
  "Le Thieboudienne (Sénégal) est classé au patrimoine de l'UNESCO depuis 2021.",
  "L'Attiéké est une semoule de manioc dont la fermentation dure 3 jours.",
  "Le Yassa est né d'un mariage de saveurs entre Casamance et influences coloniales.",
  "L'Afrique compte plus de 2000 variétés de céréales et tubercules locaux.",
  "Un menu avec de belles photos peut augmenter les ventes de 30%.",
  "Le QR Code est devenu l'outil favori des restaurateurs en 2025."
];

const MESSAGES = {
  signin: ["On rallume les fourneaux de votre Dashboard...", "Le chef vérifie vos dernières statistiques...", "On met la table pour votre prochaine session..."],
  signup: ["On prépare votre tablier MenuAfrica...", "Construction de votre identité culinaire...", "Mise en place de votre espace de succès..."],
  default: ["Chargement de MenuAfrica...", "Préparation des saveurs digitales...", "Un instant, on peaufine la carte..."]
};

export const ImmersiveLoader: React.FC<ImmersiveLoaderProps> = ({ mode = 'default', className }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const currentMessages = MESSAGES[mode] || MESSAGES.default;

  useEffect(() => {
    const msgInterval = setInterval(() => { setMsgIndex((prev) => (prev + 1) % currentMessages.length); }, 2500);
    const factInterval = setInterval(() => { setFactIndex((prev) => (prev + 1) % FUN_FACTS.length); }, 6000);

    return () => { clearInterval(msgInterval); clearInterval(factInterval); };
  }, [currentMessages]);

  return (
    <div className={cn("fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#020617] overflow-hidden", className)}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
          <div className="grid grid-cols-6 gap-20 p-20">
              {Array.from({length: 24}).map((_, i) => (
                  <Utensils key={i} size={80} className={cn(i % 2 === 0 ? "rotate-45" : "-rotate-12")} />
              ))}
          </div>
      </div>
      <div className="relative flex flex-col items-center max-w-sm w-full px-6 text-center">
        <div className="relative mb-12">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl animate-pulse scale-150"></div>
            <div className="absolute inset-0 border-4 border-red-500/10 rounded-full animate-ping"></div>
            <div className="relative w-32 h-32 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl flex items-center justify-center border-4 border-red-50/50 dark:border-gray-800 rotate-3 animate-float">
                <Heart size={64} className="text-red-600 fill-red-600 animate-pulse" />
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-2 rounded-xl shadow-lg animate-bounce"><Sparkles size={16} /></div>
            </div>
            <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] -rotate-90">
                <circle cx="50%" cy="50%" r="70" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="440" strokeDashoffset="330" className="text-red-200 opacity-20" />
                <circle cx="50%" cy="50%" r="70" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="440" strokeDashoffset="110" className="text-red-500 animate-[spin_3s_linear_infinite]" />
            </svg>
        </div>
        <div className="h-14 mb-8">
            <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white transition-all duration-500 animate-fade-in key={msgIndex}">{currentMessages[msgIndex]}</h2>
        </div>
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50 p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform"><Quote size={40} /></div>
            <div className="flex items-start gap-4 text-left">
                <div className="mt-1 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-orange-600"><ChefHat size={18} /></div>
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600/60 mb-1 block">Le saviez-vous ?</span>
                    <p className="text-sm text-orange-950 dark:text-orange-100 font-medium leading-relaxed animate-fade-in key={factIndex}">{FUN_FACTS[factIndex]}</p>
                </div>
            </div>
        </div>
        <div className="mt-12 flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (<div key={i} className={cn("h-1 rounded-full transition-all duration-700", msgIndex === i ? "w-8 bg-orange-500" : "w-2 bg-gray-200 dark:bg-gray-800")} />))}
        </div>
      </div>
    </div>
  );
};
