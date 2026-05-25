import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { toast } from '../../components/ui/UiComponents';
import { Sparkles, Palette, MonitorSmartphone, LayoutTemplate, Box, GalleryHorizontalEnd } from 'lucide-react';
import clsx from 'clsx';

export const MavadaBuilder: React.FC = () => {
  const { selectedMenu, saveMenuConfig } = useBuilder();
  const [template, setTemplate] = useState(selectedMenu?.template_id || 'modern-feast');
  const [accent, setAccent] = useState('#D97706');

  const templatesList = [
    { id: 'modern-feast', icon: <MonitorSmartphone className="w-8 h-8" />, name: 'Modern Feast', tagline: 'Sensationnel, Grand format', desc: 'Idéal pour valoriser chaque plat individuellement de manière immersive avec des photos pleine largeur.' },
    { id: 'minimal-grid', icon: <Box className="w-8 h-8" />, name: 'Minimalist Grid', tagline: 'Épuré, Design suisse', desc: 'Une grille compacte de photographies haut de gamme avec alignement précis pour une lecture rapide.' },
    { id: 'luxury-list', icon: <GalleryHorizontalEnd className="w-8 h-8" />, name: 'Luxury Traditional', tagline: 'Chic, Prestige Noir', desc: 'Idéal pour les restaurants bistronomiques ou salons lounges gastronomiques souhaitant un style classique.' }
  ];

  const handleApply = (id: string) => {
    setTemplate(id);
    saveMenuConfig({ template_id: id, primary_color: accent });
    toast.success(`Le template "${id}" a été appliqué à votre carte en ligne.`);
  };

  return (
    <div className="space-y-6 pt-4 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-playfair font-black text-slate-800 tracking-tight flex items-center gap-3">
            Mavada Studio <Sparkles className="w-6 h-6 text-[#D97706]" />
          </h2>
          <p className="text-sm text-slate-500 mt-1">Personnalisez instantanément l'esthétique et l'expérience de votre menu.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Controls Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
               <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#D97706] flex items-center justify-center">
                 <Palette className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="font-bold text-slate-800">Identité Visuelle</h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Couleur Primaire</p>
               </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-600">Choisissez votre couleur d'accent</label>
              <div className="flex items-center gap-4 border border-slate-200 p-2 rounded-xl bg-slate-50">
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="h-10 w-10 p-0 rounded-lg cursor-pointer bg-white border border-slate-200 outline-none"
                />
                <input 
                  type="text" 
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="flex-1 bg-transparent border-none text-sm font-mono font-bold text-slate-700 outline-none uppercase" 
                />
              </div>

              <div className="flex gap-2 pt-2">
                 {['#D97706', '#10B981', '#3B82F6', '#E11D48', '#0F172A'].map(color => (
                   <button 
                     key={color} 
                     className="w-6 h-6 rounded-full shadow-sm border border-black/10 ring-2 ring-transparent transition-all" 
                     style={{ cursor: 'pointer', backgroundColor: color, ringColor: accent === color ? color : 'transparent' }} 
                     onClick={() => setAccent(color)}
                   />
                 ))}
              </div>
            </div>

            <button
              onClick={() => {
                saveMenuConfig({ template_id: template, primary_color: accent });
                toast.success('Couleur accentuée sauvegardée avec succès.');
              }}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-sm font-bold rounded-xl text-white transition-colors shadow-sm"
            >
              Appliquer la couleur
            </button>
          </div>
        </div>

        {/* Templates Select Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <LayoutTemplate className="w-5 h-5 text-slate-400" />
             <h3 className="font-bold text-slate-800">Modèles Visuels Disponibles</h3>
          </div>
          
          <div className="grid gap-4">
            {templatesList.map(t => (
              <div
                key={t.id}
                className={clsx(
                  "p-6 rounded-3xl border-2 transition-all flex flex-col sm:flex-row gap-6 relative overflow-hidden group cursor-pointer",
                  template === t.id
                    ? "bg-[#FFF8F3] border-[#D97706] shadow-sm"
                    : "bg-white border-slate-100 hover:border-slate-300"
                )}
                onClick={() => handleApply(t.id)}
              >
                {/* Icon Container */}
                <div className={clsx(
                   "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border",
                   template === t.id ? "bg-white text-[#D97706] border-[#D97706]/20" : "bg-slate-50 text-slate-400 border-slate-100 group-hover:text-[#D97706]"
                )}>
                   {t.icon}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                     <div>
                       <h4 className="font-playfair text-xl font-black text-slate-800">{t.name}</h4>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mt-0.5">{t.tagline}</span>
                     </div>
                     
                     <div className="shrink-0 mt-2 sm:mt-0">
                       <button
                         className={clsx(
                           "h-10 px-6 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center w-full sm:w-auto",
                           template === t.id
                             ? "bg-[#D97706] text-white"
                             : "bg-white border border-slate-200 text-slate-600 group-hover:bg-slate-50"
                         )}
                       >
                         {template === t.id ? 'Activé ✓' : 'Choisir ce modèle'}
                       </button>
                     </div>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-lg mt-3">{t.desc}</p>
                </div>

                {template === t.id && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D97706]/5 rounded-bl-[100px] pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
