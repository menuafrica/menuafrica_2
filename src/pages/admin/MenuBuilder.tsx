import React, { useState, useEffect } from 'react';
import { useMenuBuilder } from '../../hooks/useMenuBuilder';
import { Plus, LayoutTemplate, Save, Clock, CheckCircle, Search, Edit2, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { toast } from '../../components/ui/UiComponents';

export const MenuBuilder: React.FC = () => {
  const restaurantId = 'r1'; 

  const {
    menus,
    categories,
    items,
    activeMenuId,
    setActiveMenuId,
    viewMode,
    setViewMode,
    loading,
    initBuilder,
    saveItem,
    createCategory
  } = useMenuBuilder({ restaurantId });

  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    initBuilder();
  }, [initBuilder]);

  return (
    <div className="space-y-6 pt-2 animate-fade-in max-w-7xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 shrink-0">
        <div>
          <h2 className="text-3xl font-playfair font-black text-slate-800 tracking-tight">Studio Menu</h2>
          <p className="text-sm text-slate-500 mt-1">Créez et organisez vos cartes interactives.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl">
             <button
               onClick={() => setViewMode('BUILDER')}
               className={clsx(
                 "px-4 py-2 text-sm font-bold rounded-lg transition-all",
                 viewMode === 'BUILDER' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
               )}
             >
               Structure
             </button>
             <button
               onClick={() => setViewMode('LIBRARY')}
               className={clsx(
                 "px-4 py-2 text-sm font-bold rounded-lg transition-all",
                 viewMode === 'LIBRARY' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
               )}
             >
               Catalogue
             </button>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <select 
              value={activeMenuId || ''} 
              onChange={(e) => setActiveMenuId(e.target.value)}
              className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/20 transition-all min-w-[150px]"
            >
              {menus.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            <button 
               onClick={() => toast.success('Menu enregistré avec succès !')}
               className="h-11 px-6 bg-[#D97706] hover:bg-[#B46002] rounded-xl font-bold text-sm text-white transition-colors shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Enregistrer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden pt-2">
        
        {/* Left Sidebar - Structure/Tools */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-6 overflow-y-auto pr-2 pb-8">
           
           {/* Add Category */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                Nouvelle Catégorie
              </h3>
              <div className="flex gap-2">
                 <input 
                   type="text"
                   value={newCatName}
                   onChange={(e) => setNewCatName(e.target.value)}
                   placeholder="Ex: Desserts..."
                   className="flex-1 h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#D97706] transition-all"
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && newCatName) {
                       createCategory(newCatName);
                       setNewCatName('');
                     }
                   }}
                 />
                 <button 
                   onClick={() => { if(newCatName) { createCategory(newCatName); setNewCatName(''); } }}
                   className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors shrink-0"
                 >
                   <Plus className="w-4 h-4" />
                 </button>
              </div>
           </div>

           {/* Quick Navigation (Categories) */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex-1">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Sections</h3>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{categories.length}</span>
             </div>
             
             <div className="space-y-1">
                {categories.map(cat => (
                  <button key={cat.id} className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 hover:bg-orange-50 hover:text-[#D97706] rounded-lg transition-colors font-medium text-left">
                     <span className="truncate pr-2">{cat.name_fr}</span>
                     <span className="text-xs font-mono text-slate-400">
                       {items.filter(i => i.category_id === cat.id).length}
                     </span>
                  </button>
                ))}
             </div>
           </div>

        </div>

        {/* Right Canvas - Menu Items */}
        <div className="flex-1 bg-slate-50/50 rounded-3xl border border-slate-100 shadow-inner overflow-y-auto p-4 sm:p-6 lg:p-8">
           {loading ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                <Clock className="w-8 h-8 animate-spin text-[#D97706]" />
                <span className="text-sm font-bold uppercase tracking-widest">Chargement...</span>
             </div>
           ) : categories.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                <LayoutTemplate className="w-12 h-12 text-slate-200" />
                <span className="text-sm font-bold">Aucune catégorie. Commencez par en créer une à gauche.</span>
             </div>
           ) : (
             <div className="space-y-8 pb-10">
                {categories.map(cat => {
                  const catItems = items.filter(i => i.category_id === cat.id);
                  return (
                    <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                       <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <h3 className="font-playfair font-black text-xl text-slate-800">{cat.name_fr}</h3>
                           <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-500 rounded-md text-[10px] font-bold font-mono">
                             {catItems.length}
                           </span>
                         </div>
                         <button className="text-sm font-bold text-[#D97706] hover:text-[#B46002] flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-lg transition-colors">
                           <Plus className="w-4 h-4" /> Plat
                         </button>
                       </div>

                       <div className="p-6">
                         {catItems.length === 0 ? (
                           <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium">
                             Déposez des plats ici pour enrichir la catégorie "{cat.name_fr}"
                           </div>
                         ) : (
                           <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                             {catItems.map(item => (
                               <div key={item.id} className="group flex gap-4 p-3 bg-white border border-slate-100 rounded-2xl hover:border-[#D97706]/30 hover:shadow-md transition-all cursor-pointer relative pr-12">
                                  <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                    {item.image_url ? (
                                      <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <LayoutTemplate className="w-6 h-6" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 py-1">
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">{item.name_fr}</h4>
                                    <p className="text-xs text-slate-500 line-clamp-1 mb-2">{item.description_fr || 'Sans description'}</p>
                                    <div className="text-[#D97706] font-black font-mono text-sm">{item.price.toLocaleString('fr-FR')} XOF</div>
                                  </div>

                                  {/* Quick Actions Hover */}
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-orange-100 hover:text-[#D97706] transition-colors">
                                       <Edit2 className="w-4 h-4" />
                                     </button>
                                     <button className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-rose-100 hover:text-rose-600 transition-colors">
                                       <Trash2 className="w-4 h-4" />
                                     </button>
                                  </div>
                               </div>
                             ))}
                           </div>
                         )}
                       </div>
                    </div>
                  );
                })}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

