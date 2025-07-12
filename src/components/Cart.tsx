import React, { useState } from 'react';
import { X, ShoppingCart, Trash2, Phone, User, MessageSquare, Package, Minus, Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useCallModal } from '../contexts/CallModalContext';
import { calculateDeliveryPrice } from '../data/priceData';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, clearCart, getTotalPrice, getTotalWeight } = useCart();
  const { openModal } = useCallModal();
  const [showQuickOrder, setShowQuickOrder] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: ''
  });

  const deliveryPrice = calculateDeliveryPrice(getTotalWeight());
  const totalWithDelivery = getTotalPrice() + deliveryPrice;

  const handleQuickOrder = () => {
    if (items.length === 0) return;

    const cartData = {
      items: items,
      totalWeight: getTotalWeight(),
      totalPrice: getTotalPrice(),
      deliveryPrice: deliveryPrice,
      totalWithDelivery: totalWithDelivery
    };

    openModal('Заказ из корзины', { cartData });
    onClose();
  };

  const handleQuickOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Заполните имя и телефон');
      return;
    }

    const cartData = {
      items: items,
      totalWeight: getTotalWeight(),
      totalPrice: getTotalPrice(),
      deliveryPrice: deliveryPrice,
      totalWithDelivery: totalWithDelivery,
      quickOrderData: formData
    };

    openModal('Быстрый заказ из корзины', { cartData });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 flex justify-between items-center">
          <div className="flex items-center">
            <ShoppingCart className="h-6 sm:h-8 w-6 sm:w-8 mr-3" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Корзина</h2>
              <p className="text-blue-100 text-sm sm:text-base">
                {items.length} {items.length === 1 ? 'товар' : items.length < 5 ? 'товара' : 'товаров'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full max-h-[calc(95vh-120px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">Корзина пуста</h3>
                <p className="text-gray-500">Добавьте товары из калькулятора</p>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="space-y-4">
                  {items.map((cartItem) => (
                    <div key={cartItem.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
                            {cartItem.item.name}
                          </h4>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                              {cartItem.item.size}
                            </span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                              {cartItem.item.branch}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs sm:text-sm">{cartItem.item.gost}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(cartItem.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs sm:text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">Вес</p>
                          <p className="font-bold">{cartItem.quantityTons.toFixed(2)} т</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Штук</p>
                          <p className="font-bold">{cartItem.quantityPieces}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Метров</p>
                          <p className="font-bold">{cartItem.quantityMeters}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Сумма</p>
                          <p className="font-bold text-blue-600">
                            {Math.round(cartItem.totalPrice).toLocaleString()} ₸
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Общий вес:</span>
                    <span className="font-bold">{getTotalWeight().toFixed(2)} т</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Стоимость товаров:</span>
                    <span className="font-bold">{Math.round(getTotalPrice()).toLocaleString()} ₸</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Доставка:</span>
                    <span className="font-bold">{Math.round(deliveryPrice).toLocaleString()} ₸</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg sm:text-xl font-bold text-blue-600">
                    <span>Итого:</span>
                    <span>{Math.round(totalWithDelivery).toLocaleString()} ₸</span>
                  </div>
                </div>

                {/* Price Disclaimer */}
                <div className="bg-yellow-100 border border-yellow-300 p-3 rounded-lg mb-4">
                  <p className="text-yellow-800 text-xs sm:text-sm font-medium text-center">
                    ⚠️ Актуальность цен уточняйте у менеджера
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleQuickOrder}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    📞 Заказать всё ({Math.round(totalWithDelivery).toLocaleString()} ₸)
                  </button>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowQuickOrder(!showQuickOrder)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all"
                    >
                      Быстрый заказ
                    </button>
                    <button
                      onClick={clearCart}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all"
                    >
                      Очистить корзину
                    </button>
                  </div>
                </div>

                {/* Quick Order Form */}
                {showQuickOrder && (
                  <form onSubmit={handleQuickOrderSubmit} className="mt-4 space-y-3 bg-white p-4 rounded-xl border">
                    <h4 className="font-bold text-gray-900 mb-3">Быстрый заказ</h4>
                    
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Ваше имя"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="+7 (777) 777-77-77"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        required
                      />
                    </div>

                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <textarea
                        placeholder="Комментарий (необязательно)"
                        value={formData.comment}
                        onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                        rows={2}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold text-sm transition-all"
                    >
                      Отправить заказ
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;