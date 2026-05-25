import React, { createContext, useContext, useState } from 'react';
import { MenuItem } from '../lib/virtual_db';

export interface CartItem {
  id: string;
  item: MenuItem;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (item: MenuItem, qty?: number) => void;
  removeFromCart: (itemId: string) => void;
  increaseQty: (itemId: string) => void;
  decreaseQty: (itemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const addToCart = (item: MenuItem, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + qty } : p);
      }
      return [...prev, { id: item.id, item, quantity: qty }];
    });
    setIsOpen(true); // Open cart drawer for instant touch tactical action feedback
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(p => p.id !== itemId));
  };

  const increaseQty = (itemId: string) => {
    setCart(prev => prev.map(p => p.id === itemId ? { ...p, quantity: p.quantity + 1 } : p));
  };

  const decreaseQty = (itemId: string) => {
    setCart(prev => prev.map(p => {
      if (p.id === itemId) {
        const nextQty = p.quantity - 1;
        return nextQty > 0 ? { ...p, quantity: nextQty } : null;
      }
      return p;
    }).filter(Boolean) as CartItem[]);
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((acc, curr) => acc + curr.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      isOpen,
      setIsOpen,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
