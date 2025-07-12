import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ChevronDown, Plus, Minus, ShoppingCart, X, Package } from 'lucide-react';
import { 
  priceData, 
  PriceItem, 
  getCategories, 
  getBranches, 
  getSteelGrades,
  filterItems,
  getPriceByVolume,
  calculateDeliveryPrice,
  MINIMUM_ORDER_TONS
} from '../data/priceData';
import { useCallModal } from '../contexts/CallModalContext';
import { useCart } from '../contexts/CartContext';

const Calculator: React.FC = () => {
  const { openModal } = useCallModal();
  const { addToCart } = useCart();
  
  // Состояния фильтров для каждой категории
  const [categoryFilters, setCategoryFilters] = useState<Record<string, {
    branch: string;
    steel: string;
    diameter: string;
    search: string;
  }>>({});
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<PriceItem | null>(null);
  const [quantity, setQuantity] = useState({
    tons: 1,
    pieces: 0,
    meters: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const itemsPerPage = 20;

  // Получаем текущие фильтры для выбранной категории
  const currentFilters = categoryFilters[selectedCategory] || {
    branch: '',
    steel: '',
    diameter: '',
    search: ''
  };

  // Обновляем фильтры для текущей категории
  const updateCategoryFilter = (key: string, value: string) => {
    setCategoryFilters(prev => ({
      ...prev,
      [selectedCategory]: {
        ...currentFilters,
        [key]: value
      }
    }));
    setCurrentPage(1);
  };

  // Фильтрованные товары
  const filteredItems = useMemo(() => {
    if (!selectedCategory) return [];
    
    return filterItems({
      category: selectedCategory,
      branch: currentFilters.branch || undefined,
      steel: currentFilters.steel || undefined,
      size: currentFilters.diameter || undefined,
      search: currentFilters.search || undefined
    });
  }, [selectedCategory, currentFilters]);

  // Пагинация
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Получаем уникальные диаметры для выбранной категории
  const availableDiameters = useMemo(() => {
    if (!selectedCategory) return [];
    const categoryItems = priceData.filter(item => item.category === selectedCategory);
    return [...new Set(categoryItems.map(item => item.size))].sort();
  }, [selectedCategory]);

  // Расчет количества при изменении тонн
  useEffect(() => {
    if (selectedItem && quantity.tons > 0) {
      setIsCalculating(true);
      const timer = setTimeout(() => {
        const pieces = Math.round(quantity.tons * 1000 / selectedItem.weightPerPiece);
        const meters = pieces * selectedItem.lengthValue;
        
        setQuantity(prev => ({
          ...prev,
          pieces,
          meters
        }));
        setIsCalculating(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [selectedItem, quantity.tons]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedItem(null);
    setCurrentPage(1);
    setQuantity({ tons: 1, pieces: 0, meters: 0 });
  };

  const handleItemSelect = (item: PriceItem) => {
    setSelectedItem(item);
    const pieces = Math.round(1000 / item.weightPerPiece);
    const meters = pieces * item.lengthValue;
    setQuantity({
      tons: 1,
      pieces,
      meters
    });
  };

  const handleTonsChange = (newTons: number) => {
    if (newTons < 0.1) newTons = 0.1;
    if (newTons > 1000) newTons = 1000;
    setQuantity(prev => ({ ...prev, tons: newTons }));
  };

  const adjustTons = (delta: number) => {
    const currentTons = quantity.tons;
    let increment = 1;
    
    // Если текущее значение не целое, используем меньший инкремент
    if (currentTons % 1 !== 0) {
      increment = 0.5;
    }
    
    const newTons = Math.max(0.1, currentTons + (delta * increment));
    handleTonsChange(newTons);
  };

  const handleOrder = () => {
    if (!selectedItem) return;

    const prices = getPriceByVolume(selectedItem, quantity.tons);
    const totalPrice = prices.tenge * quantity.tons;
    const deliveryPrice = calculateDeliveryPrice(quantity.tons);

    const productData = {
      item: selectedItem,
      quantity: quantity.pieces,
      totalWeight: quantity.tons,
      totalPrice: totalPrice,
      deliveryPrice: deliveryPrice,
      totalWithDelivery: totalPrice + deliveryPrice,
      selectedFilters: currentFilters
    };

    openModal('Заказать металлопрокат', productData);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const prices = getPriceByVolume(selectedItem, quantity.tons);
    const totalPrice = prices.tenge * quantity.tons;

    addToCart(
      selectedItem,
      quantity.tons,
      quantity.pieces,
      quantity.meters,
      prices.tenge,
      totalPrice
    );

    // Показываем уведомление
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
    notification.textContent = '✅ Товар добавлен в корзину!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const clearFilters = () => {
    setCategoryFilters(prev => ({
      ...prev,
      [selectedCategory]: {
        branch: '',
        steel: '',
        diameter: '',
        search: ''
      }
    }));
    setCurrentPage(1);
  };

  return (
    <section id="calculator" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-8 py-4 mb-8">
            <Package className="h-7 w-7 text-orange-600 mr-3" />
            <span className="text-orange-700 font-bold text-xl">Калькулятор цен</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
              Рассчитайте стоимость
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
              за 30 секунд! 🧮
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Более 4824 позиций металлопроката в наличии. Выберите категорию, 
            укажите количество и получите точную стоимость с доставкой
          </p>
        </div>

        {/* Category Selection */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Выберите категорию товара</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {getCategories().map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="text-4xl mb-4">
                  {category === 'Круг стальной' ? '⚪' : 
                   category === 'Труба стальная' ? '🔧' : '⬜'}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{category}</h4>
                <p className="text-gray-600 text-sm">
                  {priceData.filter(item => item.category === category).length} позиций
                </p>
              </button>
            ))}
          </div>
        </div>

        {selectedCategory && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 lg:mb-0">
                  Фильтры для категории: {selectedCategory}
                </h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center text-blue-600 font-semibold"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
                  <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={currentFilters.search}
                    onChange={(e) => updateCategoryFilter('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Branch Filter */}
                <select
                  value={currentFilters.branch}
                  onChange={(e) => updateCategoryFilter('branch', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Все филиалы</option>
                  {getBranches().map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>

                {/* Steel Grade Filter */}
                <select
                  value={currentFilters.steel}
                  onChange={(e) => updateCategoryFilter('steel', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Все марки стали</option>
                  {getSteelGrades().map(steel => (
                    <option key={steel} value={steel}>{steel}</option>
                  ))}
                </select>

                {/* Diameter Filter */}
                <select
                  value={currentFilters.diameter}
                  onChange={(e) => updateCategoryFilter('diameter', e.target.value)}
                  disabled={!selectedCategory}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    !selectedCategory ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Все размеры</option>
                  {availableDiameters.map(diameter => (
                    <option key={diameter} value={diameter}>{diameter}</option>
                  ))}
                </select>
              </div>

              {(currentFilters.branch || currentFilters.steel || currentFilters.diameter || currentFilters.search) && (
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Найдено: {filteredItems.length} товаров
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700 font-semibold text-sm"
                  >
                    Очистить фильтры
                  </button>
                </div>
              )}
            </div>

            {/* Results */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Товары не найдены</h3>
                <p className="text-gray-600 mb-6">
                  Попробуйте изменить фильтры или выбрать другую категорию
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Очистить фильтры
                </button>
              </div>
            ) : (
              <>
                {/* Items Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {currentItems.map((item) => {
                    const prices = getPriceByVolume(item, 1);
                    const prices5 = getPriceByVolume(item, 5);
                    const prices15 = getPriceByVolume(item, 15);
                    
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleItemSelect(item)}
                        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 transform hover:scale-105 ${
                          selectedItem?.id === item.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                        }`}
                      >
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-lg mb-2 leading-tight">
                                {item.name}
                              </h4>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                  {item.size}
                                </span>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                  {item.branch}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemSelect(item);
                                handleAddToCart();
                              }}
                              className="bg-orange-100 hover:bg-orange-200 text-orange-600 p-2 rounded-lg transition-all"
                              title="Добавить в корзину"
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Details */}
                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex justify-between">
                              <span>На складе:</span>
                              <span className="font-semibold">{item.stockTons} т</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Вес 1 шт:</span>
                              <span className="font-semibold">{item.weightPerPiece} кг</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Длина 1 шт:</span>
                              <span className="font-semibold">{item.lengthValue} м</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              {item.gost}
                            </div>
                          </div>

                          {/* Prices */}
                          <div className="space-y-2">
                            <div className="text-lg font-bold text-blue-600">
                              Цена 1 - 5 т: {Math.round(prices.tenge).toLocaleString()} ₸/т
                            </div>
                            <div className="text-xs text-gray-500">
                              (базовая: {Math.round(prices.rub).toLocaleString()} ₽/т)
                            </div>
                            
                            <div className="text-sm text-gray-600">
                              Цена 5 - 15 т: {Math.round(prices5.tenge).toLocaleString()} ₸/т
                            </div>
                            
                            <div className="text-sm text-gray-600">
                              Цена > 15 т: {Math.round(prices15.tenge).toLocaleString()} ₸/т
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mb-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Назад
                    </button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Вперед
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Calculator */}
            {selectedItem && (
              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left Column - Item Info */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      {selectedItem.name} {selectedItem.size} / {selectedItem.gost}
                    </h3>
                    
                    <div className="bg-gray-50 p-6 rounded-xl mb-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Наименование:</span>
                          <div className="font-semibold">{selectedItem.name}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Размер:</span>
                          <div className="font-semibold">{selectedItem.size}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Длина:</span>
                          <div className="font-semibold">{selectedItem.lengthValue} м</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Доп. информация:</span>
                          <div className="font-semibold text-xs">{selectedItem.gost}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Вес 1 шт./кг:</span>
                          <div className="font-semibold">{selectedItem.weightPerPiece}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">На складе (тонн):</span>
                          <div className="font-semibold">{selectedItem.stockTons}</div>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Филиал:</span>
                          <div className="font-semibold">{selectedItem.branch}</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                      На складе: {selectedItem.stockTons} т. / Вес 1 шт: {selectedItem.weightPerPiece} кг / Длина 1 шт: {selectedItem.lengthValue} м
                    </div>
                  </div>

                  {/* Right Column - Calculator */}
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-6">Расчет стоимости</h4>
                    
                    {/* Quantity Input */}
                    <div className="mb-6">
                      <label className="block text-gray-700 font-semibold mb-3">Кол-во, т:</label>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => adjustTons(-1)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                        <input
                          type="number"
                          min="0.1"
                          max="1000"
                          step="0.1"
                          value={quantity.tons}
                          onChange={(e) => handleTonsChange(parseFloat(e.target.value) || 0.1)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-center text-xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={() => adjustTons(1)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Calculated Values */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Кол-во, шт:</span>
                        <span className="font-bold text-lg">
                          {isCalculating ? '...' : quantity.pieces}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Кол-во метров:</span>
                        <span className="font-bold text-lg">
                          {isCalculating ? '...' : quantity.meters}
                        </span>
                      </div>
                      
                      {(() => {
                        const prices = getPriceByVolume(selectedItem, quantity.tons);
                        const totalPrice = prices.tenge * quantity.tons;
                        const deliveryPrice = calculateDeliveryPrice(quantity.tons);
                        
                        return (
                          <>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                              <span className="text-gray-600">Цена за т.:</span>
                              <span className="font-bold text-lg text-blue-600">
                                {Math.round(prices.tenge).toLocaleString()} ₸
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                              <span className="text-gray-600">Сумма:</span>
                              <span className="font-bold text-xl text-blue-600">
                                {Math.round(totalPrice).toLocaleString()} ₸
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                              <span className="text-gray-600">Доставка:</span>
                              <span className="font-bold text-lg text-orange-600">
                                {Math.round(deliveryPrice).toLocaleString()} ₸
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-3 bg-blue-50 px-4 rounded-lg">
                              <span className="text-gray-900 font-bold">Итого с доставкой:</span>
                              <span className="font-bold text-2xl text-blue-600">
                                {Math.round(totalPrice + deliveryPrice).toLocaleString()} ₸
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={handleAddToCart}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Добавить в корзину
                      </button>
                      
                      <button
                        onClick={handleOrder}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all"
                      >
                        Заказать сейчас
                      </button>
                      
                      <button
                        onClick={() => setSelectedItem(null)}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-all"
                      >
                        Отменить
                      </button>
                    </div>

                    {quantity.tons < MINIMUM_ORDER_TONS && (
                      <div className="mt-4 bg-yellow-100 border border-yellow-300 p-4 rounded-lg">
                        <p className="text-yellow-800 text-sm font-medium">
                          ⚠️ Минимальный заказ: {MINIMUM_ORDER_TONS} тонн
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Price Disclaimer */}
                <div className="mt-6 bg-yellow-100 border border-yellow-300 p-4 rounded-lg">
                  <p className="text-yellow-800 text-sm font-medium text-center">
                    ⚠️ Актуальность цен уточняйте у менеджера
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Calculator;