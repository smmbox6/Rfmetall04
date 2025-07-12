import React, { useState, useEffect } from 'react';
import { 
  Calculator, Package, Truck, Clock, CheckCircle, Zap, Star, Award, Target,
  Search, Filter, MapPin, Factory, TrendingUp, DollarSign, Gauge,
  ShoppingCart, AlertCircle, Info, ArrowRight, Building, Sliders,
  ChevronDown, ChevronUp, Settings, Layers, BarChart3, Plus, Minus
} from 'lucide-react';
import { 
  priceData, 
  PriceItem, 
  getPriceByVolume, 
  calculateFinalPrice,
  calculateFinalPriceRub,
  getAllPrices,
  calculateDeliveryPrice,
  getCategories, 
  getBranches,
  getSteelGrades,
  filterItems,
  EXCHANGE_RATE,
  MINIMUM_ORDER_TONS,
  SUPPLIER_CITIES
} from '../data/priceData';
import { useCallModal } from '../contexts/CallModalContext';
import { useCart } from '../contexts/CartContext';

interface CalculatorResult {
  selectedItem: PriceItem;
  quantityTons: number;
  quantityPieces: number;
  quantityMeters: number;
  pricePerTonTenge: number;
  pricePerTonRub: number;
  totalPriceRub: number;
  totalPriceTenge: number;
  deliveryPrice: number;
  totalWithDelivery: number;
  deliveryTime: string;
  priceCategory: string;
}

const MetalCalculator: React.FC = () => {
  const { openModal } = useCallModal();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedSteel, setSelectedSteel] = useState<string>('');
  const [selectedDiameter, setSelectedDiameter] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<PriceItem | null>(null);
  const [quantityTons, setQuantityTons] = useState<number>(MINIMUM_ORDER_TONS);
  const [quantityPieces, setQuantityPieces] = useState<number>(1);
  const [quantityMeters, setQuantityMeters] = useState<number>(6);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [calculatorResult, setCalculatorResult] = useState<CalculatorResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;
  
  // Состояние для сохранения фильтров по категориям
  const [categoryFilters, setCategoryFilters] = useState<Record<string, {
    branch: string;
    steel: string;
    diameter: string;
  }>>({});

  const categories = getCategories();
  const branches = getBranches();
  const steelGrades = getSteelGrades();
  const [filteredItems, setFilteredItems] = useState<PriceItem[]>([]);
  const [availableDiameters, setAvailableDiameters] = useState<string[]>([]);

  // Восстанавливаем фильтры при смене категории
  useEffect(() => {
    if (selectedCategory && categoryFilters[selectedCategory]) {
      const savedFilters = categoryFilters[selectedCategory];
      setSelectedBranch(savedFilters.branch);
      setSelectedSteel(savedFilters.steel);
      setSelectedDiameter(savedFilters.diameter);
    } else if (selectedCategory) {
      // Сбрасываем фильтры для новой категории
      setSelectedBranch('');
      setSelectedSteel('');
      setSelectedDiameter('');
    }
  }, [selectedCategory]);

  // Сохраняем фильтры при их изменении
  useEffect(() => {
    if (selectedCategory) {
      setCategoryFilters(prev => ({
        ...prev,
        [selectedCategory]: {
          branch: selectedBranch,
          steel: selectedSteel,
          diameter: selectedDiameter
        }
      }));
    }
  }, [selectedCategory, selectedBranch, selectedSteel, selectedDiameter]);

  useEffect(() => {
    const filters = {
      category: selectedCategory || undefined,
      branch: selectedBranch || undefined,
      steel: selectedSteel || undefined,
      size: selectedDiameter || undefined,
      search: searchQuery || undefined
    };

    const filtered = filterItems(filters);
    setFilteredItems(filtered);
    setCurrentPage(1);

    // Обновляем доступные диаметры
    if (selectedCategory) {
      const categoryItems = filterItems({ category: selectedCategory });
      setAvailableDiameters([...new Set(categoryItems.map(item => item.size))].sort());
    } else {
      setAvailableDiameters([]);
    }
  }, [selectedCategory, selectedBranch, selectedSteel, selectedDiameter, searchQuery]);

  useEffect(() => {
    if (selectedItem) {
      // Автоматический пересчет при изменении тонн
      const newPieces = Math.max(1, Math.round((quantityTons * 1000) / selectedItem.weightPerPiece));
      const newMeters = Math.round(newPieces * selectedItem.lengthValue * 100) / 100;
      
      setQuantityPieces(newPieces);
      setQuantityMeters(newMeters);
      
      calculatePrice();
    }
  }, [selectedItem, quantityTons]);

  useEffect(() => {
    if (selectedItem) {
      // Автоматический пересчет при изменении штук
      const newTons = Math.max(MINIMUM_ORDER_TONS, (quantityPieces * selectedItem.weightPerPiece) / 1000);
      const newMeters = Math.round(quantityPieces * selectedItem.lengthValue * 100) / 100;
      
      setQuantityTons(newTons);
      setQuantityMeters(newMeters);
      
      calculatePrice();
    }
  }, [quantityPieces]);

  const calculatePrice = () => {
    if (!selectedItem) return;

    setIsCalculating(true);
    
    setTimeout(() => {
      const actualTons = Math.max(MINIMUM_ORDER_TONS, quantityTons);
      const prices = getPriceByVolume(selectedItem, actualTons);
      const totalPriceTenge = prices.tenge * actualTons;
      const totalPriceRub = prices.rub * actualTons;
      const deliveryPrice = calculateDeliveryPrice(actualTons);
      const totalWithDelivery = totalPriceTenge + deliveryPrice;
      
      const priceCategory = actualTons >= 15 ? 'Оптовая цена (>15т)' : 
                           actualTons >= 5 ? 'Средний опт (5-15т)' : 
                           'Розничная цена (1-5т)';
      
      const deliveryTime = actualTons > 10 ? '7-10 дней' : '5-7 дней';

      setCalculatorResult({
        selectedItem,
        quantityTons: actualTons,
        quantityPieces,
        quantityMeters,
        pricePerTonTenge: prices.tenge,
        pricePerTonRub: prices.rub,
        totalPriceRub,
        totalPriceTenge,
        deliveryPrice,
        totalWithDelivery,
        deliveryTime,
        priceCategory
      });
      setIsCalculating(false);
    }, 500);
  };

  const handleAddToCart = () => {
    if (calculatorResult) {
      addToCart(
        calculatorResult.selectedItem,
        calculatorResult.quantityTons,
        calculatorResult.quantityPieces,
        calculatorResult.quantityMeters,
        calculatorResult.pricePerTonTenge,
        calculatorResult.totalWithDelivery
      );
      
      // Показываем уведомление
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
      notification.textContent = '✅ Товар добавлен в корзину!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  const handleOrderClick = () => {
    if (calculatorResult) {
      openModal('Заказать металлопрокат', {
        item: calculatorResult.selectedItem,
        quantity: calculatorResult.quantityPieces,
        totalWeight: calculatorResult.quantityTons,
        totalPrice: calculatorResult.totalWithDelivery,
        priceCategory: calculatorResult.priceCategory,
        branch: calculatorResult.selectedItem.branch,
        diameter: calculatorResult.selectedItem.size,
        steel: calculatorResult.selectedItem.steel
      });
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBranch('');
    setSelectedSteel('');
    setSelectedDiameter('');
    setSearchQuery('');
    setSelectedItem(null);
    setCategoryFilters({});
  };

  const handleTonsChange = (newValue: number) => {
    const actualValue = Math.max(MINIMUM_ORDER_TONS, newValue);
    setQuantityTons(actualValue);
  };

  const handleTonsIncrement = () => {
    const increment = quantityTons % 1 === 0 ? 1 : 0.5; // Если целое число - добавляем 1, иначе 0.5
    handleTonsChange(quantityTons + increment);
  };

  const handleTonsDecrement = () => {
    const decrement = quantityTons % 1 === 0 ? 1 : 0.5; // Если целое число - убираем 1, иначе 0.5
    handleTonsChange(quantityTons - decrement);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Труба стальная': return '🔧';
      case 'Труба профильная': return '⬜';
      case 'Круг стальной': return '⚪';
      default: return '📦';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Труба стальная': return 'from-blue-600 to-blue-700';
      case 'Труба профильная': return 'from-green-600 to-green-700';
      case 'Круг стальной': return 'from-orange-600 to-orange-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  // Пагинация
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  return (
    <section id="calculator" className="py-8 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-orange-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 mb-6 sm:mb-8">
            <Calculator className="h-5 sm:h-6 lg:h-7 w-5 sm:w-6 lg:w-7 text-orange-400 mr-2 sm:mr-3" />
            <span className="text-orange-300 font-bold text-sm sm:text-lg lg:text-xl">Калькулятор металлопроката</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Точная стоимость
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
              за 30 секунд! 🚀
            </span>
          </h2>
          
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div className="flex flex-col items-center space-y-2">
                <BarChart3 className="h-6 sm:h-8 w-6 sm:w-8 text-green-400" />
                <div>
                  <p className="text-green-300 font-bold text-lg sm:text-xl">{priceData.length}+</p>
                  <p className="text-blue-200 text-sm sm:text-base">позиций в наличии</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <DollarSign className="h-6 sm:h-8 w-6 sm:w-8 text-orange-400" />
                <div>
                  <p className="text-orange-300 font-bold text-lg sm:text-xl">{EXCHANGE_RATE} ₸/₽</p>
                  <p className="text-blue-200 text-sm sm:text-base">актуальный курс</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2 sm:col-span-2 md:col-span-1">
                <Zap className="h-6 sm:h-8 w-6 sm:w-8 text-yellow-400" />
                <div>
                  <p className="text-yellow-300 font-bold text-lg sm:text-xl">Мин. {MINIMUM_ORDER_TONS}т</p>
                  <p className="text-blue-200 text-sm sm:text-base">минимальный заказ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 lg:p-12 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20">
          {/* Search Bar */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 lg:left-6 top-1/2 transform -translate-y-1/2 h-5 sm:h-6 lg:h-7 w-5 sm:w-6 lg:w-7 text-gray-400" />
              <input
                type="text"
                placeholder="🔍 Поиск по названию, размеру, филиалу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 lg:pl-16 pr-4 sm:pr-6 py-3 sm:py-4 lg:py-6 border-2 sm:border-3 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 text-sm sm:text-lg lg:text-xl font-medium transition-all placeholder-gray-400"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8 gap-4">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                <Filter className="h-5 sm:h-6 lg:h-8 w-5 sm:w-6 lg:w-8 text-blue-600 mr-2 sm:mr-3" />
                ФИЛЬТРЫ:
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 transition-all text-sm sm:text-base"
                >
                  <Settings className="h-4 sm:h-5 w-4 sm:w-5" />
                  <span>{showFilters ? 'Скрыть' : 'Показать'}</span>
                  {showFilters ? <ChevronUp className="h-4 sm:h-5 w-4 sm:w-5" /> : <ChevronDown className="h-4 sm:h-5 w-4 sm:w-5" />}
                </button>
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-red-50 transition-all text-sm sm:text-base"
                >
                  Очистить
                </button>
              </div>
            </div>
            
            {showFilters && (
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Dropdown Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Филиал */}
                  <div>
                    <label className="block text-sm sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Выбор филиала:</label>
                    <div className="relative">
                      <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 text-sm sm:text-lg font-medium appearance-none bg-white"
                      >
                        <option value="">Все филиалы</option>
                        {branches.map((branch) => (
                          <option key={branch} value={branch}>{branch}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 h-5 sm:h-6 w-5 sm:w-6 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Диаметр */}
                  <div>
                    <label className="block text-sm sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Выбор диаметра:</label>
                    <div className="relative">
                      <select
                        value={selectedDiameter}
                        onChange={(e) => setSelectedDiameter(e.target.value)}
                        className={`w-full p-3 sm:p-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 text-sm sm:text-lg font-medium appearance-none ${
                          !selectedCategory 
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-white border-gray-300'
                        }`}
                        disabled={!selectedCategory}
                      >
                        <option value="">{!selectedCategory ? 'Сначала выберите категорию' : 'Все диаметры'}</option>
                        {availableDiameters.map((diameter) => (
                          <option key={diameter} value={diameter}>{diameter}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 h-5 sm:h-6 w-5 sm:w-6 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Марка стали */}
                  <div>
                    <label className="block text-sm sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Марка стали:</label>
                    <div className="relative">
                      <select
                        value={selectedSteel}
                        onChange={(e) => setSelectedSteel(e.target.value)}
                        className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 text-sm sm:text-lg font-medium appearance-none bg-white"
                      >
                        <option value="">Все марки</option>
                        {steelGrades.map((steel) => (
                          <option key={steel} value={steel}>{steel}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 h-5 sm:h-6 w-5 sm:w-6 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Заказ звонка */}
                  <div>
                    <label className="block text-sm sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Нужна помощь?</label>
                    <button
                      onClick={() => openModal('Консультация по выбору металлопроката', {
                        selectedFilters: {
                          branch: selectedBranch,
                          diameter: selectedDiameter,
                          steel: selectedSteel,
                          category: selectedCategory
                        }
                      })}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white p-3 sm:p-4 rounded-xl font-bold text-sm sm:text-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                      📞 Заказать звонок
                    </button>
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Категория:</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                        selectedCategory === ''
                          ? 'border-gray-500 bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-md'
                      }`}
                    >
                      <div className="text-2xl sm:text-3xl lg:text-4xl mb-2">📦</div>
                      <div className="font-bold text-sm sm:text-base lg:text-lg">Все категории</div>
                      <div className="text-xs sm:text-sm text-gray-500 mt-1">{priceData.length} позиций</div>
                    </button>
                    {categories.map((category) => {
                      const itemCount = priceData.filter(item => item.category === category).length;
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                            selectedCategory === category
                              ? `border-blue-500 bg-gradient-to-r ${getCategoryColor(category)} text-white shadow-lg`
                              : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:shadow-md'
                          }`}
                        >
                          <div className="text-2xl sm:text-3xl lg:text-4xl mb-2">{getCategoryIcon(category)}</div>
                          <div className="font-bold text-sm sm:text-base lg:text-lg">{category}</div>
                          <div className="text-xs sm:text-sm mt-1">{itemCount} позиций</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Header */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="flex items-center">
                <Package className="h-5 sm:h-6 lg:h-8 w-5 sm:w-6 lg:w-8 text-purple-600 mr-2 sm:mr-3" />
                РЕЗУЛЬТАТЫ:
              </span>
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 sm:px-4 lg:px-6 py-2 lg:py-3 rounded-full text-sm sm:text-lg lg:text-xl">
                {filteredItems.length} позиций
              </span>
            </h3>
          </div>

          {/* Products Grid */}
          <div className="mb-6 sm:mb-8">
            {currentItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {currentItems.map((item, index) => {
                  const allPrices = getAllPrices(item);
                  const isInStock = item.stockTons > 5;
                  const isLowStock = item.stockTons > 0 && item.stockTons <= 5;
                  
                  return (
                    <div
                      key={item.id || index}
                      onClick={() => setSelectedItem(item)}
                      className={`relative p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-3xl border-2 lg:border-3 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        selectedItem === item
                          ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-2xl'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:shadow-xl'
                      }`}
                    >
                      {/* Stock Status */}
                      {isInStock && (
                        <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                          В НАЛИЧИИ ✅
                        </div>
                      )}
                      {isLowStock && (
                        <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                          МАЛО! ⚠️
                        </div>
                      )}
                      
                      <div className="mb-3 sm:mb-4 lg:mb-6">
                        <h4 className="font-bold text-sm sm:text-base lg:text-lg mb-2 leading-tight">
                          {item.name} {item.steel && `${item.steel}`}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                          <span className={`text-lg sm:text-xl lg:text-2xl font-bold ${selectedItem === item ? 'text-orange-200' : 'text-blue-600'}`}>
                            {item.size}
                          </span>
                          {item.length && (
                            <span className={`text-xs px-2 py-1 rounded-full ${selectedItem === item ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>
                              {item.length}
                            </span>
                          )}
                          {item.steel && (
                            <span className={`text-xs px-2 py-1 rounded-full ${selectedItem === item ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                              {item.steel}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs ${selectedItem === item ? 'text-purple-200' : 'text-gray-500'}`}>
                          {item.gost}
                        </p>
                      </div>

                      <div className="space-y-2 lg:space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium flex items-center">
                            <Package className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                            Вес 1 шт:
                          </span>
                          <span className="font-bold text-xs sm:text-sm">{item.weightPerPiece.toFixed(1)} кг</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium flex items-center">
                            <Building className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                            Длина 1 шт:
                          </span>
                          <span className="font-bold text-xs sm:text-sm">{item.lengthValue} м</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium flex items-center">
                            <Gauge className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                            На складе:
                          </span>
                          <span className="font-bold text-xs sm:text-sm">{item.stockTons.toFixed(1)} т</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium flex items-center">
                            <MapPin className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                            Филиал:
                          </span>
                          <span className="font-bold text-xs">{item.branch}</span>
                        </div>
                        
                        <div className="border-t pt-2 sm:pt-3">
                          <div className="text-center space-y-1">
                            {/* Основная цена */}
                            <div className={`font-bold mb-1 ${
                              quantityTons >= 15 ? 'text-lg sm:text-xl lg:text-2xl' : 
                              quantityTons >= 5 ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                            }`}>
                              Цена {quantityTons >= 15 ? '> 15' : quantityTons >= 5 ? '5-15' : '1-5'} т: {Math.round(
                                quantityTons >= 15 ? allPrices.priceOver15.tenge : 
                                quantityTons >= 5 ? allPrices.price5to15.tenge : 
                                allPrices.price1to5.tenge
                              ).toLocaleString()} ₸/т
                            </div>
                            <div className={`text-xs ${selectedItem === item ? 'text-purple-200' : 'text-gray-500'}`}>
                              (базовая: {Math.round(
                                quantityTons >= 15 ? item.priceOver15 : 
                                quantityTons >= 5 ? item.price5to15 : 
                                item.price1to5
                              ).toLocaleString()} ₽/т)
                            </div>
                            
                            {/* Дополнительные цены */}
                            {quantityTons < 5 && (
                              <div className="text-xs text-gray-500">
                                Цена 5-15 т: {Math.round(allPrices.price5to15.tenge).toLocaleString()} ₸/т
                              </div>
                            )}
                            {quantityTons < 15 && (
                              <div className="text-xs text-gray-500">
                                Цена > 15 т: {Math.round(allPrices.priceOver15.tenge).toLocaleString()} ₸/т
                              </div>
                            )}
                          </div>
                          
                          {/* Кнопка добавления в корзину */}
                          <div className="mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                                // Добавляем небольшую задержку для расчета
                                setTimeout(() => {
                                  if (calculatorResult) {
                                    handleAddToCart();
                                  }
                                }, 100);
                              }}
                              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-2 py-1 rounded-lg text-xs font-medium transition-all transform hover:scale-105"
                            >
                              + В корзину
                            </button>
                          </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <AlertCircle className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-600 mb-2">Товары не найдены</h3>
                <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mb-6 sm:mb-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Назад
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + Math.max(1, currentPage - 2);
                if (page > totalPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Вперед
              </button>
            </div>
          )}

          {/* Quantity Selection */}
          {selectedItem && (
            <div className="mb-6 sm:mb-8 lg:mb-12">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="flex items-center">
                  <ShoppingCart className="h-5 sm:h-6 lg:h-8 w-5 sm:w-6 lg:w-8 text-green-600 mr-2 sm:mr-3" />
                  КОЛИЧЕСТВО:
                </span>
              </h3>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-green-200">
                {/* Quantity Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {/* Тонны */}
                  <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                    <label className="block text-sm sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Кол-во, т:</label>
                    <div className="flex items-center space-x-2 sm:space-x-4 mb-3 sm:mb-4">
                      <button
                        onClick={handleTonsDecrement}
                        className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg sm:rounded-xl text-lg sm:text-2xl font-bold transition-all transform hover:scale-110 shadow-lg flex items-center justify-center"
                      >
                        <Minus className="h-4 sm:h-6 w-4 sm:w-6" />
                      </button>
                      <input
                        type="number"
                        value={quantityTons}
                        onChange={(e) => handleTonsChange(parseFloat(e.target.value) || MINIMUM_ORDER_TONS)}
                        className="flex-1 h-8 sm:h-12 text-center border-2 border-green-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-green-500/50 focus:border-green-500 text-sm sm:text-xl font-bold"
                        min={MINIMUM_ORDER_TONS}
                        step="0.1"
                      />
                      <button
                        onClick={handleTonsIncrement}
                        className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg sm:rounded-xl text-lg sm:text-2xl font-bold transition-all transform hover:scale-110 shadow-lg flex items-center justify-center"
                      >
                        <Plus className="h-4 sm:h-6 w-4 sm:w-6" />
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Минимум: {MINIMUM_ORDER_TONS} т</p>
                  </div>

                  {/* Штуки */}
                  <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                    <label className="block text-sm sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Кол-во, шт:</label>
                    <div className="flex items-center space-x-2 sm:space-x-4 mb-3 sm:mb-4">
                      <button
                        onClick={() => setQuantityPieces(Math.max(1, quantityPieces - 1))}
                        className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg sm:rounded-xl text-lg sm:text-2xl font-bold transition-all transform hover:scale-110 shadow-lg flex items-center justify-center"
                      >
                        <Minus className="h-4 sm:h-6 w-4 sm:w-6" />
                      </button>
                      <input
                        type="number"
                        value={quantityPieces}
                        onChange={(e) => setQuantityPieces(Math.max(1, parseInt(e.target.value) || 1))}
                        className="flex-1 h-8 sm:h-12 text-center border-2 border-green-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-green-500/50 focus:border-green-500 text-sm sm:text-xl font-bold"
                        min="1"
                      />
                      <button
                        onClick={() => setQuantityPieces(quantityPieces + 1)}
                        className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg sm:rounded-xl text-lg sm:text-2xl font-bold transition-all transform hover:scale-110 shadow-lg flex items-center justify-center"
                      >
                        <Plus className="h-4 sm:h-6 w-4 sm:w-6" />
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Автоматический расчет</p>
                  </div>

                  {/* Метры */}
                  <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                    <label className="block text-sm sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Кол-во метров:</label>
                    <div className="text-center">
                      <div className="text-2xl sm:text-4xl font-bold text-blue-700 mb-2">{quantityMeters}</div>
                      <p className="text-xs sm:text-sm text-gray-600">Автоматический расчет</p>
                    </div>
                  </div>
                </div>

                {/* Item Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 text-center">
                  <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                    <Package className="h-6 sm:h-8 lg:h-10 w-6 sm:w-8 lg:w-10 text-blue-600 mx-auto mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Вес 1 шт:</p>
                    <p className="text-sm sm:text-xl lg:text-2xl font-bold text-blue-700">{selectedItem.weightPerPiece.toFixed(3)} кг</p>
                  </div>
                  <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                    <Building className="h-6 sm:h-8 lg:h-10 w-6 sm:w-8 lg:w-10 text-orange-600 mx-auto mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Длина 1 шт:</p>
                    <p className="text-sm sm:text-xl lg:text-2xl font-bold text-orange-700">{selectedItem.lengthValue} м</p>
                  </div>
                  <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                    <MapPin className="h-6 sm:h-8 lg:h-10 w-6 sm:w-8 lg:w-10 text-purple-600 mx-auto mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Склад:</p>
                    <p className="text-xs sm:text-lg lg:text-xl font-bold text-purple-700">{selectedItem.branch}</p>
                  </div>
                  <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                    <Gauge className="h-6 sm:h-8 lg:h-10 w-6 sm:w-8 lg:w-10 text-green-600 mx-auto mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">На складе:</p>
                    <p className="text-sm sm:text-lg lg:text-2xl font-bold text-green-700">
                      {selectedItem.stockTons.toFixed(1)} т
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {calculatorResult && (
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-12 rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-blue-200 shadow-2xl">
              <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 sm:px-6 lg:px-10 py-2 sm:py-3 lg:py-5 rounded-full font-bold text-sm sm:text-lg lg:text-2xl mb-4 sm:mb-6 lg:mb-8">
                  <CheckCircle className="h-5 sm:h-6 lg:h-8 w-5 sm:w-6 lg:w-8 mr-2 sm:mr-4" />
                  РАСЧЕТ ЗАВЕРШЕН! 🎉
                </div>
                
                <h3 className="text-lg sm:text-2xl lg:text-4xl font-bold text-blue-800 mb-4 sm:mb-6 lg:mb-8">
                  {calculatorResult.selectedItem.name} • {calculatorResult.selectedItem.size}
                </h3>
                
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8 lg:mb-10">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 sm:px-4 lg:px-8 py-1 sm:py-2 lg:py-4 rounded-full font-bold text-xs sm:text-sm lg:text-lg">
                    {calculatorResult.priceCategory}
                  </span>
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 sm:px-4 lg:px-8 py-1 sm:py-2 lg:py-4 rounded-full font-bold text-xs sm:text-sm lg:text-lg">
                    Общий вес: {calculatorResult.quantityTons.toFixed(2)} т
                  </span>
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 sm:px-4 lg:px-8 py-1 sm:py-2 lg:py-4 rounded-full font-bold text-xs sm:text-sm lg:text-lg">
                    Склад: {calculatorResult.selectedItem.branch}
                  </span>
                </div>
              </div>

              {/* Price Display */}
              <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                <div className="relative inline-block">
                  <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white px-6 sm:px-12 lg:px-20 py-6 sm:py-8 lg:py-12 rounded-2xl sm:rounded-3xl shadow-2xl transform hover:scale-105 transition-all">
                    {isCalculating ? (
                      <div className="flex items-center space-x-4 sm:space-x-6">
                        <div className="animate-spin rounded-full h-6 sm:h-8 lg:h-12 w-6 sm:w-8 lg:w-12 border-b-4 border-white"></div>
                        <span className="text-lg sm:text-2xl lg:text-4xl font-bold">Расчет стоимости...</span>
                      </div>
                    ) : (
                      <div>
                        <div className="text-2xl sm:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4">
                          {Math.round(calculatorResult.totalWithDelivery).toLocaleString()} ₸
                        </div>
                        <div className="text-sm sm:text-lg lg:text-2xl opacity-90 mb-2 sm:mb-3">
                          Товар: {Math.round(calculatorResult.totalPriceTenge).toLocaleString()} ₸
                        </div>
                        <div className="text-sm sm:text-lg lg:text-2xl opacity-90 mb-2 sm:mb-3">
                          Доставка: {Math.round(calculatorResult.deliveryPrice).toLocaleString()} ₸
                        </div>
                        <div className="text-sm sm:text-base lg:text-xl text-green-300 font-semibold">
                          🚚 Доставка: {calculatorResult.deliveryTime}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-2 sm:-top-4 lg:-top-6 -right-2 sm:-right-4 lg:-right-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 sm:px-4 lg:px-6 py-1 sm:py-2 lg:py-3 rounded-full text-xs sm:text-sm lg:text-lg font-bold animate-bounce">
                    ЗАКАЗАТЬ СЕЙЧАС! 🚀
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8 mb-6 sm:mb-8 lg:mb-12">
                <div className="text-center p-3 sm:p-4 lg:p-8 bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-xl transition-all">
                  <DollarSign className="h-8 sm:h-12 lg:h-16 w-8 sm:w-12 lg:w-16 text-blue-600 mx-auto mb-2 sm:mb-4" />
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-blue-700 mb-1 sm:mb-2">
                    {Math.round(calculatorResult.pricePerTonTenge).toLocaleString()} ₸
                  </p>
                  <p className="text-gray-600 font-medium text-xs sm:text-sm">за тонну</p>
                  <p className="text-gray-500 text-xs">
                    ({Math.round(calculatorResult.pricePerTonRub).toLocaleString()} ₽/т)
                  </p>
                </div>
                <div className="text-center p-3 sm:p-4 lg:p-8 bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-xl transition-all">
                  <Truck className="h-8 sm:h-12 lg:h-16 w-8 sm:w-12 lg:w-16 text-green-600 mx-auto mb-2 sm:mb-4" />
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-700 mb-1 sm:mb-2">{calculatorResult.deliveryTime}</p>
                  <p className="text-gray-600 font-medium text-xs sm:text-sm">доставка</p>
                </div>
                <div className="text-center p-3 sm:p-4 lg:p-8 bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-xl transition-all">
                  <Factory className="h-8 sm:h-12 lg:h-16 w-8 sm:w-12 lg:w-16 text-orange-600 mx-auto mb-2 sm:mb-4" />
                  <p className="text-sm sm:text-lg lg:text-2xl font-bold text-orange-700 mb-1 sm:mb-2">{calculatorResult.selectedItem.branch}</p>
                  <p className="text-gray-600 font-medium text-xs sm:text-sm">склад поставщика</p>
                </div>
                <div className="text-center p-3 sm:p-4 lg:p-8 bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-xl transition-all">
                  <Gauge className="h-8 sm:h-12 lg:h-16 w-8 sm:w-12 lg:w-16 text-purple-600 mx-auto mb-2 sm:mb-4" />
                  <p className="text-sm sm:text-lg lg:text-2xl font-bold text-purple-700 mb-1 sm:mb-2">
                    {calculatorResult.selectedItem.stockTons.toFixed(1)} т
                  </p>
                  <p className="text-gray-600 font-medium text-xs sm:text-sm">в наличии</p>
                </div>
              </div>

              {/* Technical Info */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 lg:mb-10">
                <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                  <Info className="h-5 sm:h-6 lg:h-7 w-5 sm:w-6 lg:w-7 text-blue-600 mr-2 sm:mr-3" />
                  Техническая информация:
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 text-sm sm:text-base lg:text-lg text-gray-700">
                  <div className="space-y-2 sm:space-y-3">
                    <p><strong>Наименование:</strong> {calculatorResult.selectedItem.name} {calculatorResult.selectedItem.steel}</p>
                    <p><strong>Размер:</strong> {calculatorResult.selectedItem.size}</p>
                    <p><strong>Длина 1 шт:</strong> {calculatorResult.selectedItem.lengthValue} м</p>
                    <p><strong>ГОСТ:</strong> {calculatorResult.selectedItem.gost}</p>
                    <p><strong>Вес 1 шт:</strong> {calculatorResult.selectedItem.weightPerPiece.toFixed(3)} кг</p>
                    <p><strong>На складе:</strong> {calculatorResult.selectedItem.stockTons.toFixed(1)} т</p>
                    <p><strong>Филиал:</strong> {calculatorResult.selectedItem.branch}</p>
                    <p><strong>Категория:</strong> {calculatorResult.selectedItem.category}</p>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <p><strong>Количество:</strong> {calculatorResult.quantityPieces} шт.</p>
                    <p><strong>Общий вес:</strong> {calculatorResult.quantityTons.toFixed(3)} т</p>
                    <p><strong>Общая длина:</strong> {calculatorResult.quantityMeters} м</p>
                    <p><strong>Курс валют:</strong> {EXCHANGE_RATE} ₸/₽</p>
                    <p><strong>Цена за тонну:</strong> {Math.round(calculatorResult.pricePerTonTenge).toLocaleString()} ₸</p>
                    <p><strong>Цена за тонну (₽):</strong> {Math.round(calculatorResult.pricePerTonRub).toLocaleString()} ₽</p>
                  </div>
                </div>
              </div>

              {/* Order Button */}
              <div className="text-center">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
                  <button 
                    onClick={handleOrderClick}
                    className="flex-1 group bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 hover:from-orange-700 hover:via-red-700 hover:to-orange-700 text-white px-4 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 rounded-xl sm:rounded-2xl text-base sm:text-lg lg:text-2xl font-bold transition-all transform hover:scale-105 shadow-2xl"
                  >
                    <span className="flex items-center justify-center">
                      📞 Заказать за {Math.round(calculatorResult.totalWithDelivery).toLocaleString()} ₸
                      <ArrowRight className="ml-2 sm:ml-3 lg:ml-4 h-4 sm:h-6 lg:h-8 w-4 sm:w-6 lg:w-8 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </button>
                  
                  <button 
                    onClick={handleAddToCart}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 sm:px-8 py-3 sm:py-4 lg:py-6 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold transition-all transform hover:scale-105 shadow-lg"
                  >
                    🛒 Добавить в корзину
                  </button>
                </div>
                
                <div className="bg-yellow-100 border border-yellow-300 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl">
                  <p className="text-sm sm:text-base lg:text-lg text-gray-700 font-medium">
                    ⚠️ <strong>Актуальность цен уточняйте у менеджера</strong>
                    <br />
                    📞 Звоните прямо сейчас: <span className="font-bold text-blue-600 text-base sm:text-lg lg:text-xl">+7 (747) 219-93-69</span>
                    <br />
                    🚚 Доставка по всему Казахстану • 💯 Гарантия качества • 📦 Минимальный заказ: {MINIMUM_ORDER_TONS} т • 💰 Экономия до 50%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MetalCalculator;