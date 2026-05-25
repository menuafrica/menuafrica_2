import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbInstance, Restaurant, Menu, Category, MenuItem } from '../../lib/virtual_db';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useMenuSearch } from '../../hooks/useMenuSearch';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Menu as MenuIcon, X, Search, Globe } from 'lucide-react';

export const PublicMenu: React.FC = () => {
  const { subdomain } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsOpen, getCartCount, getCartTotal } = useCart();
  const { translate } = useLanguage();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const freshRes = dbInstance.restaurants.find(r => r.subdomain === subdomain) || dbInstance.restaurants[0]; 
    if (freshRes) {
      setRestaurant(freshRes);
      const activeMenu = dbInstance.menus.find(m => m.restaurant_id === freshRes.id && m.is_active);
      if (activeMenu) {
        setMenu(activeMenu);
        setCategories(dbInstance.categories.filter(c => c.menu_id === activeMenu.id && c.is_active));
        setItems(dbInstance.items.filter(i => i.restaurant_id === freshRes.id && i.is_available));
      }
    }
  }, [subdomain]);

  const { query, setQuery, results, isSearching } = useMenuSearch({ items, categories });

  const categoryIds = categories.map(c => `category-${c.id}`);
  const activeCategoryId = useIntersectionObserver(categoryIds, {
    rootMargin: '-256px 0px -40% 0px', 
  });

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
        <span className="text-5xl mb-4">😿</span>
        <h2 className="text-xl font-bold">Restaurant Introuvable</h2>
        <button onClick={() => navigate('/')} className="mt-6 px-5 py-2 bg-orange-600 rounded-lg">Retour au site</button>
      </div>
    );
  }

  // Items by category
  const renderItems = (itemsToRender: MenuItem[]) => {
    if (itemsToRender.length === 0) {
      return <div className="text-gray-500 py-8 text-center text-sm">Aucun plat disponible.</div>;
    }

    return itemsToRender.map(item => (
      <div
        key={item.id}
        className="p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row gap-4 cursor-pointer relative"
        onClick={() => navigate(`/menu/${subdomain}/item/${item.id}`)}
      >
        <img
          src={item.image_url}
          alt={item.name_fr}
          className="w-full h-40 md:w-24 md:h-24 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100"
        />
        
        <div className="flex-1 min-w-0 pr-12 pb-8 md:pb-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-base font-bold text-gray-900 truncate">
              {translate(item.name_fr, item.name_en)}
            </h4>
            {item.is_popular && <span className="bg-yellow-100 text-yellow-800 text-[10px] uppercase font-black px-1.5 py-0.5 rounded-sm">Populaire</span>}
          </div>

          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {translate(item.description_fr, item.description_en)}
          </p>

          <div className="flex items-center gap-2 mt-2">
            {item.is_spicy && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">🌶️ Épicé</span>}
            {item.is_vegetarian && <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded font-bold">🍃 Veggie</span>}
          </div>
        </div>

        <div className="absolute right-4 bottom-4 flex flex-col md:items-end justify-between" onClick={(e) => e.stopPropagation()}>
          <span className="text-sm font-black text-orange-600 mb-2 md:mb-0">
            {item.price.toLocaleString()} FCFA
          </span>
          <button
            onClick={() => addToCart(item, 1)}
            className="md:mt-2 h-8 w-8 bg-gray-900 hover:bg-orange-600 text-white rounded-full flex items-center justify-center font-bold shadow-md transition-colors"
          >
            +
          </button>
        </div>
      </div>
    ));
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
      
      {/* 1. SECTION EN-TÊTE FIXE (HEADER Z-[100]) */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white shadow-sm flex flex-col border-b border-gray-100">
        
        {/* Cover Image & Toggle Menu */}
        <div className="h-32 md:h-40 relative w-full overflow-hidden bg-gray-100">
           <img
              src={restaurant.hero_image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5'}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-md text-white p-2 border border-white/30 rounded-xl hover:bg-white/40 transition"
            >
              <MenuIcon size={20} />
            </button>
        </div>

        {/* Identity & Social */}
        <div className="px-4 pb-4 md:px-8 relative flex items-start gap-4 -mt-8">
          <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-2xl bg-white p-1 shadow-md border border-gray-100 relative z-10">
             {restaurant.logo_url ? (
               <img src={restaurant.logo_url} alt="Logo" className="w-full h-full object-cover rounded-xl" />
             ) : (
                <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center font-bold text-gray-400">
                  {restaurant.name.charAt(0)}
                </div>
             )}
          </div>
          
          <div className="pt-10 flex-1 flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-none">{restaurant.name}</h1>
              <p className="text-xs text-gray-500 mt-1 max-w-sm truncate">{restaurant.description || restaurant.address}</p>
            </div>
            
            <div className="flex gap-3 mt-3 md:mt-0 opacity-80 text-xs">
              {restaurant.facebook && <a href={`https://facebook.com/${restaurant.facebook}`} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-600 font-bold">Facebook</a>}
              {restaurant.instagram && <a href={`https://instagram.com/${restaurant.instagram}`} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-pink-600 font-bold">Instagram</a>}
              {restaurant.whatsapp && <a href={`https://wa.me/${restaurant.whatsapp}`} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-green-500 font-bold">WhatsApp</a>}
            </div>
          </div>
        </div>

        {/* Sticky Mobile Categories Bar (Visible only when sidebar is hidden) */}
        {!showSidebar && (
          <div className="h-12 bg-white flex items-center px-4 overflow-x-auto gap-2 scrollbar-none border-t border-gray-50 w-full shrink-0">
             {categories.map(cat => (
              <a
                key={`top-${cat.id}`}
                href={`#category-${cat.id}`}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-bold transition-colors ${
                  activeCategoryId === `category-${cat.id}`
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {translate(cat.name_fr, cat.name_en)}
              </a>
            ))}
          </div>
        )}
      </header>


      {/* 2. SAFE ZONE CONTENEUR (pt compensation) */}
      <main className="pt-[19rem] md:pt-[20rem] pb-[100px] flex gap-6 px-4 md:px-8 max-w-7xl mx-auto w-full relative">
        
        {/* Barre Latérale (Catégories) - Affichée/Masquée */}
        <aside className={`fixed md:sticky top-[19rem] md:top-[20rem] left-0 h-[calc(100vh-23rem)] w-64 bg-white md:bg-transparent shadow-xl md:shadow-none border-r border-gray-100 md:border-none p-4 md:p-0 z-[50] md:z-10 transition-transform ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-48'} md:block shrink-0 overflow-y-auto`}>
          <div className="md:hidden flex justify-end mb-4">
            <button onClick={() => setShowSidebar(false)} className="p-2 bg-gray-100 rounded-full"><X size={16} /></button>
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Rechercher..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white md:bg-gray-100 border border-gray-200 md:border-transparent rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Notre Menu</h3>
          <nav className="flex flex-col gap-1">
            {categories.map(cat => (
              <a
                key={`side-${cat.id}`}
                href={`#category-${cat.id}`}
                onClick={() => setShowSidebar(false)}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeCategoryId === `category-${cat.id}`
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white'
                }`}
              >
                {translate(cat.name_fr, cat.name_en)}
              </a>
            ))}
          </nav>
        </aside>

        {/* Cœur du contenu (Plats) */}
        <div className="flex-1 min-w-0 pb-12">
          {isSearching ? (
             <div>
               <h2 className="text-xl font-bold mb-6">Recherche: "{query}"</h2>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {renderItems(results.map(r => r.item))}
               </div>
             </div>
          ) : (
            <div className="space-y-10">
              {categories.map(cat => {
                const catItems = items.filter(i => i.category_id === cat.id);
                if (catItems.length === 0) return null;
                return (
                  <section key={cat.id} id={`category-${cat.id}`} className="scroll-mt-[20rem]">
                    <h2 className="text-xl font-black mb-4 text-gray-900 border-b border-gray-200 pb-2 flex items-center justify-between">
                      {translate(cat.name_fr, cat.name_en)}
                      <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{catItems.length}</span>
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {renderItems(catItems)}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Cart Float Button Z-20 - En bas à droite */}
      {getCartCount() > 0 && (
         <div className="fixed bottom-24 right-4 z-[20]">
           <button 
             onClick={() => setIsOpen(true)}
             className="bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-2xl shadow-xl shadow-gray-900/20 font-bold flex items-center justify-between gap-4 transition-transform active:scale-95"
           >
             <span className="flex items-center gap-2">
               <span>🛍️</span> Panier
             </span>
             <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
               {getCartCount()}
             </span>
           </button>
         </div>
      )}

      {/* 3. SECTION PIED DE PAGE FIXE (FOOTER Z-[100]) */}
      <footer className="fixed bottom-0 left-0 right-0 z-[100] h-16 bg-white border-t border-gray-200 flex items-center justify-between px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] text-xs font-medium text-gray-500">
         <div className="flex items-center gap-2">
            <Globe size={14} />
            <span>{restaurant.subdomain}.menuafrica.com</span>
         </div>
         <div className="font-bold text-gray-900">
            Propulsé par MenuAfrica
         </div>
      </footer>

    </div>
  );
};
