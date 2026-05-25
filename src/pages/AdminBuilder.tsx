import React, { useState, useEffect } from 'react';
import { useMenuBuilder } from '../hooks/useMenuBuilder';
import { Plus, LayoutTemplate, Save, CheckCircle, Clock } from 'lucide-react';
import { mockDb } from '../lib/mockDatabase';

export const AdminBuilder: React.FC = () => {
  // Hardcoded for demo
  const restaurantId = 'demo-restaurant-id'; 

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

  // Initial load
  useEffect(() => {
    initBuilder();
  }, [initBuilder]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* HEADER Z-100 */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-[100] shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">BreadStudio</h1>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('BUILDER')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${viewMode === 'BUILDER' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              BUILDER
            </button>
            <button 
              onClick={() => setViewMode('LIBRARY')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${viewMode === 'LIBRARY' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              LIBRARY
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={activeMenuId || ''} 
            onChange={(e) => setActiveMenuId(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-sm font-medium rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {menus.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center gap-2">
            <Save size={16} /> Publier
          </button>
        </div>
      </header>

      {/* WORKSPACE */}
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Controls */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <LayoutTemplate size={18} /> Paramètres
            </h3>
            <p className="text-sm text-gray-500 mb-4">Ajustez l'apparence de votre menu.</p>
            <button className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold transition-colors">
              Changer le thème
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-4">Ajouter une catégorie</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newCatName} 
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Ex: Boissons"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <button 
                onClick={() => { if(newCatName) { createCategory(newCatName); setNewCatName(''); } }}
                className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Builder Canvas */}
        <div className="flex-1">
          {loading ? (
             <div className="flex items-center justify-center h-64 text-gray-400">
               <Clock size={24} className="animate-spin" />
             </div>
          ) : (
            <div className="space-y-8">
              {categories.map(cat => {
                const catItems = items.filter(i => i.category_id === cat.id);
                return (
                  <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                      <h2 className="font-bold text-lg text-gray-900">{cat.name_fr}</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded-md">{catItems.length} plats</span>
                        <button className="text-orange-600 hover:text-orange-700 text-sm font-bold flex items-center gap-1">
                          <Plus size={16} /> Plat
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      {catItems.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm font-medium">
                          Aucun plat dans cette catégorie.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                          {catItems.map(item => (
                            <div key={item.id} className="flex gap-4 p-3 border border-gray-100 rounded-xl hover:border-orange-200 hover:shadow-sm transition-all group">
                              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                {item.image_url && <img src={item.image_url} alt="" className="w-full h-full object-cover" />}
                              </div>
                              <div className="flex-1 flex flex-col justify-center">
                                <h4 className="font-bold text-gray-900">{item.name_fr}</h4>
                                <p className="text-orange-600 font-bold text-sm mt-1">{item.price.toLocaleString('fr-FR')} FCFA</p>
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

      </main>

    </div>
  );
};
