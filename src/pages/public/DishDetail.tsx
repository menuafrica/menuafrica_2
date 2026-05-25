import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbInstance, MenuItem, Restaurant } from '../../lib/virtual_db';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export const DishDetail: React.FC = () => {
  const { subdomain, itemId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { translate } = useLanguage();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [qty, setQty] = useState<number>(1);

  useEffect(() => {
    const freshRes = dbInstance.restaurants.find(r => r.subdomain === subdomain) || dbInstance.restaurants[0];
    if (freshRes) {
      setRestaurant(freshRes);
      const freshItem = dbInstance.items.find(i => i.id === itemId);
      if (freshItem) {
        setItem(freshItem);
      }
    }
  }, [subdomain, itemId]);

  if (!item || !restaurant) {
    return (
      <div id="no-item-screen" className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <span className="text-4xl mb-2">😿</span>
        <h3 className="text-sm font-bold font-sans">Plat Introuvable</h3>
        <button id="no-item-back" onClick={() => navigate(`/menu/${subdomain || 'la-teranga'}`)} className="mt-4 h-10 px-4 bg-orange-600 rounded-lg text-xs font-semibold">Retour au Carte</button>
      </div>
    );
  }

  return (
    <div id="dish-detail-page" className="min-h-screen bg-gray-950 text-white flex flex-col font-sans pb-32">
      {/* Immersive Photo stretch frame */}
      <div id="detail-photo-frame" className="relative h-64 sm:h-96 md:h-[400px] bg-gray-900 border-b border-gray-850">
        <img
          src={item.image_url}
          alt={item.name_fr}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
        
        {/* Floating Back Key button */}
        <button
          id="detail-back-btn"
          onClick={() => navigate(`/menu/${subdomain}`)}
          className="absolute top-6 left-6 h-11 w-11 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center hover:bg-black/80 active:scale-95 transition-all text-white text-base font-bold"
        >
          ←
        </button>
      </div>

      {/* Main product card details */}
      <div id="detail-desc-card" className="px-6 py-6 max-w-2xl mx-auto w-full space-y-6">
        <div className="space-y-2">
          {/* Tags hierarchy */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] font-black uppercase text-orange-400 font-mono tracking-widest bg-orange-500/10 px-2.5 py-1 rounded-sm">
              Signature Royale
            </span>
            {item.is_popular && <span className="text-[9px] font-black uppercase text-amber-400 font-mono tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-sm">★ Populaire</span>}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight">{translate(item.name_fr, item.name_en)}</h1>
          
          <span className="inline-block text-lg font-black font-mono text-orange-400 pt-1">
            {item.price.toLocaleString()} XOF
          </span>
        </div>

        {/* Long technical culinary details */}
        <div className="space-y-4 pt-4 border-t border-gray-900">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 font-mono">Description Culinaire</h3>
          <p className="text-sm text-gray-300 leading-relaxed font-medium">
            {translate(item.description_fr, item.description_en)}
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            *Nos plats de la Teranga sont préparés de manière artisanale à la commande à partir de produits frais directement issus de partenariats maraîchers locaux sénégalais. Les temps de cuisson respectent la tradition culinaire Teranga.
          </p>
        </div>

        {/* Quantities Add section */}
        <div className="pt-6 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-gray-900 p-1.5 rounded-xl border border-gray-800">
            <button
              id="detail-qty-dec"
              onClick={() => setQty(prev => prev > 1 ? prev - 1 : 1)}
              className="h-10 w-10 flex items-center justify-center font-bold bg-gray-800 rounded-lg hover:bg-gray-750 active:scale-90 transition-all text-base min-h-[40px]"
            >
              -
            </button>
            <span className="text-base font-bold font-mono w-8 text-center">{qty}</span>
            <button
              id="detail-qty-inc"
              onClick={() => setQty(prev => prev + 1)}
              className="h-10 w-10 flex items-center justify-center font-bold bg-gray-800 rounded-lg hover:bg-gray-750 active:scale-90 transition-all text-base min-h-[40px]"
            >
              +
            </button>
          </div>

          <button
            id="detail-add-cart-btn"
            onClick={() => {
              addToCart(item, qty);
              navigate(`/menu/${subdomain}`);
            }}
            className="w-full sm:w-auto flex-1 h-13 rounded-xl bg-orange-600 hover:bg-orange-500 font-bold text-sm text-white transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-orange-950/25 min-h-[48px]"
          >
            <span>🛒</span> Ajouter au panier ({(item.price * qty).toLocaleString()} XOF)
          </button>
        </div>
      </div>
    </div>
  );
};
