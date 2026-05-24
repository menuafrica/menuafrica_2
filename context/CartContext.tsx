"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from '@/components/ui/uicomponents';

type MenuItem = { id: string; price: number; variants?: any[]; [key: string]: any; };

export interface CartItem extends MenuItem {
  cartItemId: string;
  quantity: number;
  selectedVariantId?: string;
  selectedVariantName?: string;
  finalPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, quantity: number, variantId?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('menuafrica_cart');
        if (savedCart) {
        try {
            setItems(JSON.parse(savedCart));
        } catch (e) {
            console.error("Erreur lecture panier", e);
        }
        }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('menuafrica_cart', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (product: MenuItem, quantity: number, variantId?: string) => {
    let finalPrice = product.price;
    let variantName = undefined;

    if (variantId && product.variants) {
      const variant = product.variants.find(v => v.id === variantId);
      if (variant) {
        finalPrice += variant.price_modifier;
        variantName = variant.name_fr;
      }
    }

    setItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.id === product.id && i.selectedVariantId === variantId
      );

      if (existingIndex >= 0) {
        const newItems = [...prev];
        newItems[existingIndex].quantity += quantity;
        toast.success("Quantité mise à jour !");
        return newItems;
      } else {
        const newItem: CartItem = {
          ...product,
          cartItemId: `${product.id}-${variantId || 'base'}-${Date.now()}`,
          quantity,
          selectedVariantId: variantId,
          selectedVariantName: variantName,
          finalPrice
        };
        toast.success("Ajouté au panier !");
        return [...prev, newItem];
      }
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).addToCartGlobal = (item: any) => {
        addItem(item, item.quantity || 1);
      };
    }
  }, [items]);

  const removeItem = (cartItemId: string) => {
    setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(i => i.quantity > 0));
  };

  const clearCart = () => {
    setItems([]);
    if (typeof window !== 'undefined') localStorage.removeItem('menuafrica_cart');
  };

  const total = items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, addItem, removeItem, updateQuantity, clearCart, 
      total, itemCount, isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
};
