import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PriceItem } from '../data/priceData';

export interface CartItem {
  id: string;
  item: PriceItem;
  quantityTons: number;
  quantityPieces: number;
  quantityMeters: number;
  pricePerTon: number;
  totalPrice: number;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: PriceItem, quantityTons: number, quantityPieces: number, quantityMeters: number, pricePerTon: number, totalPrice: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalWeight: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Загружаем корзину из localStorage при инициализации
  useEffect(() => {
    const savedCart = localStorage.getItem('atlantmetal_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        })));
      } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
      }
    }
  }, []);

  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('atlantmetal_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (
    item: PriceItem, 
    quantityTons: number, 
    quantityPieces: number, 
    quantityMeters: number, 
    pricePerTon: number, 
    totalPrice: number
  ) => {
    const cartItem: CartItem = {
      id: `${item.id}_${Date.now()}_${Math.random()}`,
      item,
      quantityTons,
      quantityPieces,
      quantityMeters,
      pricePerTon,
      totalPrice,
      addedAt: new Date()
    };

    setItems(prev => [...prev, cartItem]);
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.length;
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getTotalWeight = () => {
    return items.reduce((total, item) => total + item.quantityTons, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getTotalWeight
    }}>
      {children}
    </CartContext.Provider>
  );
};