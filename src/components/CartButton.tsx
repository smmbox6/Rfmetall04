import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import Cart from './Cart';

const CartButton: React.FC = () => {
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = getTotalItems();

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all transform hover:scale-110 z-30"
      >
        <div className="relative">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {totalItems > 99 ? '99+' : totalItems}
            </div>
          )}
        </div>
      </button>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default CartButton;