import React, { useState } from 'react';
import { Restaurant, Category, MenuItem } from '../../lib/types';
import { Menu as MenuIcon, X, Search, Globe, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useMenuSearch } from '../../hooks/useMenuSearch';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useDishData } from '../../hooks/useDishData';

// --- STYLING MACROS ---
const HEADER_HEIGHT = 'h-64'; // Header with cover image
const FOOTER_HEIGHT = 'h-20';

interface PublicMenuProps {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
}

export const PublicMenu: React.FC<PublicMenuProps> = ({ restaurant, categories, items }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);

  // Search logic
  const { query, setQuery, results, isSearching } = useMenuSearch({ items, categories });

  // Intersection Observer for category active state
  const categoryIds = categories.map(c => `category-${c.id}`);
  const activeCategoryId = useIntersectionObserver(categoryIds, {
    rootMargin: '-256px 0px -40% 0px', // Adjusted for header height
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* 1. HEADER (z-[100]) */}
      <header className={`fixed top-0 left-0 right-0 z-[100] bg-white shadow-md ${HEADER_HEIGHT} flex flex-col`}>
        {/* Cover Image */}
        <div 
          className="h-32 w-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${restaurant.hero_image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5'})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Info & Navigation */}
        <div className="flex-1 px-4 py-2 relative flex items-center justify-between">
          {/* Logo overlapping cover */}
          <div className="absolute -top-12 left-4 w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-sm">
            {restaurant.logo_url ? (
              <img src={restaurant.logo_url} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-xl font-bold">
                {restaurant.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="ml-28 flex flex-col justify-center">
            <h1 className="text-xl font-black truncate">{restaurant.name}</h1>
            <div className="flex gap-2 text-gray-500 mt-1">
              {restaurant.facebook && <a href={`https://facebook.com/${restaurant.facebook}`} className="hover:text-blue-600"><Facebook size={16} /></a>}
              {restaurant.instagram && <a href={`https://instagram.com/${restaurant.instagram}`} className="hover:text-pink-600"><Instagram size={16} /></a>}
              {restaurant.whatsapp && <a href={`https://wa.me/${restaurant.whatsapp}`} className="hover:text-green-600"><MessageCircle size={16} /></a>}
            </div>
          </div>
          
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden p-2 bg-gray-100 rounded-full text-gray-700"
          >
            {showSidebar ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {/* Sticky Categories Bar (Mobile mostly, or Desktop if sidebar hidden) */}
        <div className="h-14 bg-white border-t border-gray-100 flex items-center px-4 overflow-x-auto gap-2 scrollbar-hide shrink-0">
          {categories.map(cat => (
            <a
              key={cat.id}
              href={`#category-${cat.id}`}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeCategoryId === `category-${cat.id}` 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={activeCategoryId === `category-${cat.id}` ? { backgroundColor: restaurant.primary_color } : {}}
            >
              {cat.name_fr}
            </a>
          ))}
        </div>
      </header>

      {/* 2. SAFE ZONE CONTENT */}
      {/* pt-[16rem] = padding-top: 256px corresponding to HEADER_HEIGHT */}
      {/* pb-[5rem] = padding-bottom: 80px corresponding to FOOTER_HEIGHT */}
      <main className="pt-[16rem] pb-[5rem] flex flex-col md:flex-row">
        
        {/* Sidebar (Categories & Search) - Desktop */}
        <aside className={`fixed md:sticky top-[16rem] md:top-[16rem] h-[calc(100vh-21rem)] w-64 bg-white shadow-lg md:shadow-none border-r border-gray-200 p-4 transition-transform z-50 md:z-0
          ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Rechercher un plat..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <nav className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</h3>
            {categories.map(cat => (
              <a
                key={`side-${cat.id}`}
                href={`#category-${cat.id}`}
                onClick={() => setShowSidebar(false)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeCategoryId === `category-${cat.id}`
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={activeCategoryId === `category-${cat.id}` ? { color: restaurant.primary_color } : {}}
              >
                {cat.name_fr}
              </a>
            ))}
          </nav>
        </aside>

        {/* Dish Grid */}
        <div className="flex-1 p-4 lg:p-8">
          {isSearching ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Résultats pour "{query}"</h2>
              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {results.map(({ item, score }) => (
                    <DishCard key={item.id} item={item} color={restaurant.primary_color} onClick={() => setSelectedDishId(item.id)} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucun résultat trouvé.</p>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map(cat => {
                const catItems = items.filter(i => i.category_id === cat.id);
                if (catItems.length === 0) return null;
                return (
                  <section key={cat.id} id={`category-${cat.id}`} className="scroll-mt-[17rem]">
                    <h2 className="text-2xl font-black mb-6 text-gray-900 border-b border-gray-200 pb-2">{cat.name_fr}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {catItems.map(item => (
                        <DishCard key={item.id} item={item} color={restaurant.primary_color} onClick={() => setSelectedDishId(item.id)} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* 3. FOOTER (z-[100]) */}
      <footer className={`fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 ${FOOTER_HEIGHT} flex items-center justify-between px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]`}>
        <div className="text-sm font-medium text-gray-600">
          <Globe size={16} className="inline mr-2" />
          {restaurant.subdomain}.menuafrica.com
        </div>
        <div className="text-sm font-bold opacity-80" style={{ color: restaurant.primary_color }}>
          Propulsé par MenuAfrica
        </div>
      </footer>

      {/* Dish Detail Modal (z-50) */}
      {selectedDishId && (
        <DishDetailModal 
          dishId={selectedDishId} 
          onClose={() => setSelectedDishId(null)} 
          color={restaurant.primary_color} 
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const DishCard = ({ item, color, onClick }: { item: MenuItem, color: string, onClick: () => void }) => (
  <div onClick={onClick} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer overflow-hidden group hover:shadow-md transition-shadow relative flex flex-col md:flex-row gap-4">
    {item.is_popular && (
      <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-black uppercase px-2 py-1 rounded shadow-sm z-10">
        Populaire
      </span>
    )}
    <div className="h-40 md:h-28 w-full md:w-28 rounded-xl bg-gray-100 overflow-hidden shrink-0">
      {item.image_url ? (
        <img src={item.image_url} alt={item.name_fr} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      ) : (
        <div className="w-full h-full bg-gray-200"></div>
      )}
    </div>
    <div className="flex-1 flex flex-col justify-between py-1">
      <div>
        <h3 className="font-bold text-gray-900 leading-tight">{item.name_fr}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description_fr}</p>
      </div>
      <div className="mt-3 font-black text-lg" style={{ color }}>
        {item.price.toLocaleString('fr-FR')} FCFA
      </div>
    </div>
  </div>
);

const DishDetailModal = ({ dishId, onClose, color }: { dishId: string, onClose: () => void, color: string }) => {
  const { dish, loading, error } = useDishData(dishId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/80">
          <X size={20} />
        </button>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : dish ? (
          <div className="overflow-y-auto">
            <div className="h-64 bg-gray-200 w-full relative">
               {dish.image_url && <img src={dish.image_url} alt={dish.name_fr} className="w-full h-full object-cover" />}
            </div>
            <div className="p-6">
              <h2 className="text-3xl font-black text-gray-900 mb-2">{dish.name_fr}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {dish.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                {dish.description_fr}
              </p>
              
              {dish.ingredients && dish.ingredients.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Ingrédients principaux</h4>
                  <p className="text-gray-700">{dish.ingredients.join(', ')}</p>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <span className="text-gray-500 font-bold uppercase text-sm">Prix unitaire</span>
                <span className="text-2xl font-black" style={{ color }}>{dish.price.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
