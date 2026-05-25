import React from 'react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export const CartDrawer: React.FC = () => {
  const { cart, isOpen, setIsOpen, increaseQty, decreaseQty, removeFromCart, getCartTotal, getCartCount } = useCart();
  const { translate } = useLanguage();

  if (!isOpen) return null;

  const handleWhatsAppCheckout = () => {
    // Construct pre-filled message
    let msg = `Bonjour ! 🦁 Je souhaite commander chez Menu Africa (Teranga) :\n\n`;
    cart.forEach(item => {
      msg += `• ${item.item.name_fr} (x${item.quantity}) - ${(item.item.price * item.quantity).toLocaleString()} XOF\n`;
    });
    msg += `\n*TOTAL : ${getCartTotal().toLocaleString()} XOF*`;
    
    const url = `https://wa.me/221775556677?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        id="cart-backdrop"
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Slide out Panel */}
      <div 
        id="cart-panel"
        className="relative w-full max-w-md h-full bg-gray-900 border-l border-gray-800 flex flex-col shadow-2xl animate-slide-left"
      >
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛒</span>
            <h2 className="text-lg font-bold font-sans tracking-tight">
              {translate('Votre Panier', 'Your Cart')}
            </h2>
            <span className="bg-orange-500/20 text-orange-400 text-xs px-2.5 py-1 rounded-full font-bold">
              {getCartCount()}
            </span>
          </div>
          <button 
            id="cart-close-btn"
            onClick={() => setIsOpen(false)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
              <span className="text-5xl">🥺</span>
              <p className="text-sm">{translate('Votre panier est encore vide.', 'Your cart is empty.')}</p>
            </div>
          ) : (
            cart.map(item => (
              <div 
                key={item.id} 
                id={`cart-item-${item.id}`}
                className="flex gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-800 relative group animate-fade-in"
              >
                <img 
                  src={item.item.image_url} 
                  alt={item.item.name_fr}
                  className="w-16 h-16 rounded-lg object-cover bg-gray-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate text-white font-sans">
                    {translate(item.item.name_fr, item.item.name_en)}
                  </h4>
                  <p className="text-xs text-orange-400 font-mono mt-1 font-bold">
                    {item.item.price.toLocaleString()} XOF
                  </p>
                  
                  {/* Quantity Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      id={`cart-qty-dec-${item.id}`}
                      onClick={() => decreaseQty(item.id)}
                      className="h-8 w-8 rounded-lg bg-gray-800 flex items-center justify-center text-white font-bold hover:bg-gray-700 active:scale-95 transition-all min-h-[32px]"
                    >
                      -
                    </button>
                    <span className="text-sm font-mono font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      id={`cart-qty-inc-${item.id}`}
                      onClick={() => increaseQty(item.id)}
                      className="h-8 w-8 rounded-lg bg-gray-800 flex items-center justify-center text-white font-bold hover:bg-gray-700 active:scale-95 transition-all min-h-[32px]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  id={`cart-remove-${item.id}`}
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-4 right-4 text-xs text-gray-500 hover:text-red-400 h-8 px-2 rounded-lg bg-gray-800/20 hover:bg-red-500/10 active:scale-95 transition-all flex items-center justify-center"
                >
                  Supprimer
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-800 bg-gray-900/80 backdrop-blur-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{translate('Sous-total', 'Subtotal')}</span>
              <span className="text-lg font-bold font-mono text-white">
                {getCartTotal().toLocaleString()} XOF
              </span>
            </div>
            <button
              id="whatsapp-checkout-btn"
              onClick={handleWhatsAppCheckout}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all font-semibold text-white flex items-center justify-center gap-2 font-sans shadow-lg shadow-emerald-950/20 min-h-[48px]"
            >
              <span>💬</span> Modèle WhatsApp ({getCartTotal().toLocaleString()} XOF)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
