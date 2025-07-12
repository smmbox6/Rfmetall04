import React, { useState } from 'react';
import { Package, ChevronDown } from 'lucide-react';
import { useCallModal } from '../contexts/CallModalContext';

const ProductsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('circles');
  const { openModal } = useCallModal();

  const handleOrderClick = (productType: string) => {
    openModal(`Заказать ${productType}`);
  };

  return (
    <section id="products" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
            Металлопрокат <span className="text-blue-600">любой сложности</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-4">
            Работаем с более чем <span className="font-bold">15 ведущими заводами России</span>. Найдем и доставим
          </p>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            любой металлопрокат, даже если его нет на рынке Казахстана. <span className="text-blue-600 font-bold">Гарантируем качество и сроки!</span>
          </p>
        </div>

        {/* Product Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('circles')}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
              activeTab === 'circles'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Стальные круги
          </button>
          <button
            onClick={() => setActiveTab('pipes')}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
              activeTab === 'pipes'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Стальные трубы
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Профильные трубы
          </button>
        </div>

        {/* Product Content */}
        {activeTab === 'circles' && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 lg:p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-8">
                  <Package className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                  Стальные круги
                </h3>
                <p className="text-xl text-blue-100 mb-6">
                  Диаметры от 6 до 350 мм • 32 марки стали
                </p>
                <p className="text-blue-100 mb-8">
                  Самый широкий ассортимент стальных кругов в Казахстане. Привозим редкие марки стали, которых нет на местном рынке. Каждая партия проходит строжайший контроль качества на российских заводах.
                </p>
                <button
                  onClick={() => handleOrderClick('стальные круги')}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Заказать круги
                </button>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-2xl font-bold mb-6">Последние поставки:</h4>
                
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">Круг 350 мм ст.09Г2С — 180 метров</span>
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">2.1 млн ₸</span>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <span className="mr-4">📍 Алматы</span>
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 py-1 rounded text-xs">Доставлено</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30 p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">Круг ст. 38ХС ф280 — 19.5 тонн</span>
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-bold">8.7 млн ₸</span>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <span className="mr-4">📍 Шымкент</span>
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-2 py-1 rounded text-xs">Доставлено</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pipes' && (
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 lg:p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-8">
                  <Package className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                  Стальные трубы
                </h3>
                <p className="text-xl text-green-100 mb-6">
                  Диаметры от 32 до 530 мм • Бесшовные и электросварные
                </p>
                <p className="text-green-100 mb-8">
                  Полный ассортимент стальных труб для любых задач. Бесшовные трубы для высокого давления, электросварные для строительства. Все трубы соответствуют ГОСТ стандартам.
                </p>
                <button
                  onClick={() => handleOrderClick('стальные трубы')}
                  className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Заказать трубы
                </button>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-2xl font-bold mb-6">Популярные размеры:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {['32×3', '38×4', '57×3', '76×4', '89×4', '108×4', '133×4', '159×4'].map((size, index) => (
                    <div key={size} className={`backdrop-blur-sm border p-3 sm:p-4 rounded-xl text-center transition-all hover:scale-105 cursor-pointer ${
                      index % 4 === 0 ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/30 hover:from-red-500/30 hover:to-pink-500/30' :
                      index % 4 === 1 ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 hover:from-blue-500/30 hover:to-cyan-500/30' :
                      index % 4 === 2 ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-500/30 hover:from-purple-500/30 hover:to-indigo-500/30' :
                      'bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-orange-500/30 hover:from-orange-500/30 hover:to-yellow-500/30'
                    }`}>
                      <div className="font-bold text-base sm:text-lg mb-1">{size}</div>
                      <div className="text-green-200 text-xs sm:text-sm">В наличии</div>
                      <div className="text-green-100 text-xs mt-1">от 63 000 ₸/т</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 lg:p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-8">
                  <Package className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                  Профильные трубы
                </h3>
                <p className="text-xl text-orange-100 mb-6">
                  Квадратные и прямоугольные • От 15×15 до 200×200
                </p>
                <p className="text-orange-100 mb-8">
                  Идеальное решение для металлоконструкций и каркасов. Высокое качество сварки, точные геометрические размеры. Подходят для любых строительных и производственных задач.
                </p>
                <button
                  onClick={() => handleOrderClick('профильные трубы')}
                  className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Заказать профиль
                </button>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-2xl font-bold mb-6">Популярные размеры:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {['20×20×2', '25×25×2', '30×30×3', '40×40×3', '50×50×4', '60×60×4', '80×80×5', '100×100×6'].map((size, index) => (
                    <div key={size} className={`backdrop-blur-sm border p-3 sm:p-4 rounded-xl text-center transition-all hover:scale-105 cursor-pointer ${
                      index % 4 === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 hover:from-yellow-500/30 hover:to-orange-500/30' :
                      index % 4 === 1 ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30' :
                      index % 4 === 2 ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 hover:from-blue-500/30 hover:to-cyan-500/30' :
                      'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30'
                    }`}>
                      <div className="font-bold text-base sm:text-lg mb-1">{size}</div>
                      <div className="text-orange-200 text-xs sm:text-sm">В наличии</div>
                      <div className="text-orange-100 text-xs mt-1">от 76 000 ₸/т</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;