import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { toast } from '../../components/ui/UiComponents';
import { Plus, Copy, Globe, Search, MoreVertical, Edit2, LayoutTemplate } from 'lucide-react';
import clsx from 'clsx';

export const MenusPage: React.FC = () => {
  const { menus, selectedMenu, selectMenu } = useBuilder();
  const [activeTab, setActiveTab] = useState<'all' | 'published'>('all');

  const handleDuplicate = (menuName: string) => {
    toast.success(`Le menu "${menuName}" a été dupliqué avec succès.`);
  };

  const handlePublish = (menuName: string) => {
    toast.success(`Félicitations ! Le menu "${menuName}" est publié en ligne.`);
  };

  return (
    <div className="space-y-6 pt-4 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-playfair font-black text-slate-800 tracking-tight">Vos Menus et Cartes</h2>
          <p className="text-sm text-slate-500 mt-1">Gérez, éditez ou publiez vos cartes interactives en temps réel.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="pl-9 pr-4 h-11 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/20 w-64 transition-all"
            />
          </div>
          <button
            onClick={() => toast.info('Création de nouveau menu : disponible dans le forfait PRO.')}
            className="h-11 px-6 bg-[#D97706] hover:bg-[#B46002] rounded-xl font-bold text-sm text-white transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau Menu
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-100 mt-8">
         <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>Tous ({menus.length})</TabButton>
         <TabButton active={activeTab === 'published'} onClick={() => setActiveTab('published')}>Publiés (1)</TabButton>
      </div>

      {/* Menu Cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {menus.map(m => (
          <div
            key={m.id}
            className={clsx(
              "group p-6 rounded-3xl border-2 flex flex-col justify-between h-56 transition-all relative overflow-hidden bg-white hover:shadow-lg",
              selectedMenu?.id === m.id
                ? "border-[#D97706] shadow-md ring-4 ring-[#D97706]/10"
                : "border-slate-100 hover:border-slate-200"
            )}
          >
            {m.is_default && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D97706]/10 rounded-bl-[100px] -z-0"></div>
            )}

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={clsx(
                  "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5",
                  m.is_default ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                )}>
                  {m.is_default && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                  {m.is_default ? 'En Ligne' : 'Brouillon'}
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1">
                   <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-xl font-playfair font-black text-slate-800 line-clamp-1">{m.name}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-2">
                <LayoutTemplate className="w-4 h-4" />
                Template: <span className="text-slate-700 font-bold">{m.template_id}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 relative z-10">
              <button
                onClick={() => {
                  selectMenu(m.id);
                  toast.success(`Menu "${m.name}" sélectionné.`);
                }}
                className={clsx(
                  "flex-1 h-10 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2",
                  selectedMenu?.id === m.id
                    ? "bg-[#D97706] text-white hover:bg-[#B46002]"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                <Edit2 className="w-4 h-4" />
                Éditer
              </button>
              {m.is_default ? (
                <button
                  onClick={() => toast.success('Lien copié dans le presse-papier')}
                  className="h-10 px-4 rounded-xl bg-orange-50 text-[#D97706] hover:bg-orange-100 text-sm font-semibold transition-colors flex items-center justify-center"
                  title="Copier le lien"
                >
                  <Globe className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handlePublish(m.name)}
                  className="h-10 px-4 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 text-sm font-semibold transition-colors flex items-center justify-center"
                  title="Publier"
                >
                  Publier
                </button>
              )}
              <button
                onClick={() => handleDuplicate(m.name)}
                className="h-10 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors flex items-center justify-center"
                title="Dupliquer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TabButton = ({ active, children, onClick }: { active?: boolean, children: React.ReactNode, onClick: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "px-6 py-4 text-sm font-bold transition-all relative",
        active ? "text-[#D97706]" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl"
      )}
    >
      {children}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706]"></div>
      )}
    </button>
  );
};
