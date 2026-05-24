"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Library, Palette, QrCode, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/uicomponents';
import { motion, AnimatePresence } from 'motion/react';

export const DemoBanner: React.FC = () => {
  const { isDemo, clearAuth } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  if (!isDemo || !isVisible) return null;

  const steps = [
    {
      path: '/admin',
      title: "Bienvenue dans la Démo !",
      desc: "Vous êtes actuellement en mode démo. Explorez l'interface comme si vous étiez un vrai restaurateur.",
      icon: <Sparkles className="text-yellow-400" />,
      nextPath: '/admin/menu-builder',
      nextLabel: "Voir le Menu Builder"
    },
    {
      path: '/admin/menu-builder',
      title: "Gérez votre Carte",
      desc: "Ici, vous pouvez ajouter des plats, créer des catégories et utiliser l'IA pour importer vos menus.",
      icon: <Library className="text-blue-400" />,
      nextPath: '/admin/mavada',
      nextLabel: "Personnaliser le Design"
    },
    {
      path: '/admin/mavada',
      title: "Mavada Studio",
      desc: "Créez un design unique pour votre menu digital avec nos blocs intelligents.",
      icon: <Palette className="text-purple-400" />,
      nextPath: '/admin/qr-code',
      nextLabel: "Générer un QR Code"
    },
    {
      path: '/admin/qr-code',
      title: "QR Code Intelligent",
      desc: "Générez et personnalisez votre QR Code pour que vos clients accèdent à votre menu.",
      icon: <QrCode className="text-green-400" />,
      nextPath: '/admin',
      nextLabel: "Retour au Dashboard"
    }
  ];

  const currentStepIndex = steps.findIndex(s => pathname === s.path);
  const currentStep = currentStepIndex !== -1 ? steps[currentStepIndex] : steps[0];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl"
      >
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-700 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#c25e00]/20 blur-3xl rounded-full"></div>
          
          <div className="flex-shrink-0 w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl">
            {currentStep.icon}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-lg flex items-center justify-center md:justify-start gap-2">
              {currentStep.title}
              <span className="bg-[#c25e00] text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter">Mode Démo</span>
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              {currentStep.desc}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              onClick={() => {
                clearAuth();
                router.push('/auth');
              }}
              className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl px-4 py-2 h-auto text-xs font-bold"
            >
              Quitter la Démo
            </Button>
            <Button 
              onClick={() => router.push(currentStep.nextPath)}
              className="bg-[#c25e00] hover:bg-[#a04e00] text-white rounded-xl px-6 py-2 h-auto font-bold flex items-center gap-2 whitespace-nowrap"
            >
              {currentStep.nextLabel} <ArrowRight size={16} />
            </Button>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
