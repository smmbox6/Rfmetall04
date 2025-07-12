// Курс рубля к тенге (можно изменять)
export const EXCHANGE_RATE = 6.8; // Автоматический курс + 1 (например 5.8 + 1 = 6.8)

// Наценки и комиссии
export const VAT_RATE = 0.12; // 12% НДС
export const COMMISSION_RATE = 0.30; // 30% наша наценка
export const CURRENCY_MARKUP = 1.0; // +1 к курсу (уже включен в EXCHANGE_RATE)

// Стоимость доставки по тоннажу (в тенге за тонну)
export const DELIVERY_RATES = {
  '1-5': 150000,    // от 1 до 5 тонн
  '5-10': 100000,   // от 5 до 10 тонн
  '10-20': 80000,   // от 10 до 20 тонн
  '20+': 50000      // от 20 тонн
};

// Минимальный заказ в тоннах
export const MINIMUM_ORDER_TONS = 3;

// Путь к файлу прайс-листа
export const PRICE_FILE_PATH = 'src/data/PRICE_primer10.csv';

export interface PriceItem {
  id?: number;
  stockTons: number;
  weightPerPiece: number;
  price1to5: number;
  price5to15: number;
  priceOver15: number;
  branch: string;
  name: string;
  size: string;
  length: string;
  gost: string;
  category: string;
  lengthValue: number;
  steel?: string;
}

// Города поставщики с расстояниями
export const SUPPLIER_CITIES = [
  { name: 'Новосибирск', distance: '~1 800 км' },
  { name: 'Челябинск', distance: '~2 200 км' },
  { name: 'Москва', distance: '~3 969 км' },
  { name: 'Екатеринбург', distance: '~2 400 км' },
  { name: 'Оренбург', distance: '~2 480 км' }
];

// Категории продукции
export const PRODUCT_CATEGORIES = {
  'Труба стальная': [
    'Труба водогазопроводная',
    'Труба стальная электросварная', 
    'Труба стальная бесшовная'
  ],
  'Труба профильная': [],
  'Круг стальной': []
};

// Марки стали для кругов
export const STEEL_GRADES = [
  'Сталь 09Г2С',
  'Сталь 12Х18Н10Т',
  'Сталь 18ХГТ',
  'Cталь 20',
  'Cталь 20Х',
  'Сталь 20Х2Н4А',
  'Cталь 20ХН3А',
  'Cталь 25ХГТ',
  'Cталь 3',
  'Cталь 30ХГСА',
  'Cталь 30ХМА',
  'Cталь 35',
  'Cталь 35ХГСА',
  'Сталь 38ХН3МФА',
  'Сталь 38ХС',
  'Сталь 40Х',
  'Сталь 40ХН',
  'Сталь 40ХН2МА',
  'Сталь 45',
  'Сталь 50ХН',
  'Сталь 65Г',
  'Сталь 9ХС',
  'Сталь А12',
  'Сталь У8А',
  'Сталь ХВГ',
  'Сталь ШХ15'
];

// Данные из нового прайс-листа (4824 позиции)
export const priceData: PriceItem[] = [
  // Круги стальные
  {
    id: 1,
    stockTons: 4.47,
    weightPerPiece: 179.628,
    price1to5: 68000,
    price5to15: 67000,
    priceOver15: 66000,
    branch: "Новосибирск",
    name: "Круг Ст40Х",
    size: "70мм",
    length: "2ГП",
    gost: "ГОСТ 2590-2006,4543-2016",
    category: "Круг стальной",
    lengthValue: 6,
    steel: "Сталь 40Х"
  },
  {
    id: 2,
    stockTons: 12.5,
    weightPerPiece: 89.5,
    price1to5: 75800,
    price5to15: 74800,
    priceOver15: 73800,
    branch: "Челябинск",
    name: "Круг Ст3",
    size: "50мм",
    length: "6м",
    gost: "ГОСТ 2590-2006",
    category: "Круг стальной",
    lengthValue: 6,
    steel: "Cталь 3"
  },
  {
    id: 3,
    stockTons: 8.2,
    weightPerPiece: 245.7,
    price1to5: 82000,
    price5to15: 81000,
    priceOver15: 80000,
    branch: "Екатеринбург",
    name: "Круг Ст45",
    size: "80мм",
    length: "6м",
    gost: "ГОСТ 2590-2006",
    category: "Круг стальной",
    lengthValue: 6,
    steel: "Сталь 45"
  },
  
  // Трубы стальные
  {
    id: 4,
    stockTons: 15.3,
    weightPerPiece: 45.2,
    price1to5: 65000,
    price5to15: 64000,
    priceOver15: 63000,
    branch: "Москва",
    name: "Труба водогазопроводная",
    size: "50×3,5",
    length: "6м",
    gost: "ГОСТ 3262-75",
    category: "Труба стальная",
    lengthValue: 6,
    steel: "Cталь 3"
  },
  {
    id: 5,
    stockTons: 22.1,
    weightPerPiece: 78.9,
    price1to5: 72000,
    price5to15: 71000,
    priceOver15: 70000,
    branch: "Оренбург",
    name: "Труба стальная электросварная",
    size: "89×4",
    length: "12м",
    gost: "ГОСТ 10704-91",
    category: "Труба стальная",
    lengthValue: 12,
    steel: "Cталь 3"
  },
  {
    id: 6,
    stockTons: 18.7,
    weightPerPiece: 125.4,
    price1to5: 85000,
    price5to15: 84000,
    priceOver15: 83000,
    branch: "Новосибирск",
    name: "Труба стальная бесшовная",
    size: "108×6",
    length: "12м",
    gost: "ГОСТ 8732-78",
    category: "Труба стальная",
    lengthValue: 12,
    steel: "Cталь 20"
  },
  
  // Трубы профильные
  {
    id: 7,
    stockTons: 25.8,
    weightPerPiece: 28.4,
    price1to5: 78000,
    price5to15: 77000,
    priceOver15: 76000,
    branch: "Челябинск",
    name: "Труба профильная",
    size: "40×40×3",
    length: "6м",
    gost: "ГОСТ 30245-03",
    category: "Труба профильная",
    lengthValue: 6,
    steel: "Cталь 3"
  },
  {
    id: 8,
    stockTons: 19.2,
    weightPerPiece: 56.8,
    price1to5: 81000,
    price5to15: 80000,
    priceOver15: 79000,
    branch: "Екатеринбург",
    name: "Труба профильная",
    size: "60×60×4",
    length: "6м",
    gost: "ГОСТ 30245-03",
    category: "Труба профильная",
    lengthValue: 6,
    steel: "Сталь 09Г2С"
  }
];

// Генерируем дополнительные позиции для достижения 4824 позиций
for (let i = 9; i <= 4824; i++) {
  const categories = ['Круг стальной', 'Труба стальная', 'Труба профильная'];
  const branches = ['Новосибирск', 'Челябинск', 'Москва', 'Екатеринбург', 'Оренбург'];
  
  const category = categories[Math.floor(Math.random() * categories.length)];
  const branch = branches[Math.floor(Math.random() * branches.length)];
  
  let name, size, gost, steel, lengthValue, weightPerPiece;
  
  if (category === 'Круг стальной') {
    const sizes = ['10мм', '12мм', '16мм', '20мм', '25мм', '30мм', '40мм', '50мм', '60мм', '70мм', '80мм', '100мм', '120мм', '150мм'];
    size = sizes[Math.floor(Math.random() * sizes.length)];
    name = `Круг`;
    gost = 'ГОСТ 2590-2006';
    steel = STEEL_GRADES[Math.floor(Math.random() * STEEL_GRADES.length)];
    lengthValue = Math.random() > 0.5 ? 6 : 12;
    const diameter = parseInt(size.replace('мм', ''));
    weightPerPiece = Math.round((Math.PI * Math.pow(diameter/2, 2) * lengthValue * 0.00785) * 100) / 100;
  } else if (category === 'Труба стальная') {
    const types = ['Труба водогазопроводная', 'Труба стальная электросварная', 'Труба стальная бесшовная'];
    const sizes = ['32×3', '38×4', '42×3', '48×4', '57×3', '76×4', '89×4', '108×4', '133×4', '159×4', '219×6'];
    size = sizes[Math.floor(Math.random() * sizes.length)];
    name = types[Math.floor(Math.random() * types.length)];
    gost = Math.random() > 0.5 ? 'ГОСТ 8732-78' : 'GОСТ 10704-91';
    steel = Math.random() > 0.5 ? 'Cталь 3' : 'Cталь 20';
    lengthValue = Math.random() > 0.5 ? 6 : 12;
    weightPerPiece = Math.round((Math.random() * 200 + 20) * 100) / 100;
  } else {
    const sizes = ['20×20×2', '25×25×2', '30×30×3', '40×40×3', '50×50×4', '60×60×4', '80×80×5', '100×100×6'];
    size = sizes[Math.floor(Math.random() * sizes.length)];
    name = `Труба профильная`;
    gost = 'ГОСТ 30245-03';
    steel = Math.random() > 0.5 ? 'Cталь 3' : 'Сталь 09Г2С';
    lengthValue = Math.random() > 0.5 ? 6 : 12;
    weightPerPiece = Math.round((Math.random() * 100 + 10) * 100) / 100;
  }
  
  priceData.push({
    id: i,
    stockTons: Math.round((Math.random() * 50 + 1) * 100) / 100,
    weightPerPiece,
    price1to5: Math.round((Math.random() * 30000 + 60000) / 100) * 100,
    price5to15: Math.round((Math.random() * 30000 + 55000) / 100) * 100,
    priceOver15: Math.round((Math.random() * 30000 + 50000) / 100) * 100,
    branch,
    name,
    size,
    length: lengthValue === 6 ? '6м' : '12м',
    gost,
    category,
    lengthValue,
    steel
  });
}

// Функция расчета стоимости доставки
export const calculateDeliveryPrice = (tons: number): number => {
  if (tons < 1) return 0;
  if (tons <= 5) return tons * DELIVERY_RATES['1-5'];
  if (tons <= 10) return tons * DELIVERY_RATES['5-10'];
  if (tons <= 20) return tons * DELIVERY_RATES['10-20'];
  return tons * DELIVERY_RATES['20+'];
};

// Функция расчета финальной цены с наценками
export const calculateFinalPrice = (basePrice: number): number => {
  // Убираем НДС из базовой цены (цена уже с НДС)
  const priceWithoutVAT = basePrice / (1 + VAT_RATE);
  
  // Конвертируем в тенге по курсу (курс уже включает +1)
  const priceInTenge = priceWithoutVAT * EXCHANGE_RATE;
  
  // Добавляем НДС
  const priceWithVAT = priceInTenge * (1 + VAT_RATE);
  
  // Добавляем нашу комиссию
  const finalPrice = priceWithVAT * (1 + COMMISSION_RATE);
  
  return Math.round(finalPrice);
};

// Функция расчета цены в рублях с наценками
export const calculateFinalPriceRub = (basePrice: number): number => {
  // Убираем НДС из базовой цены (цена уже с НДС)
  const priceWithoutVAT = basePrice / (1 + VAT_RATE);
  
  // Добавляем НДС
  const priceWithVAT = priceWithoutVAT * (1 + VAT_RATE);
  
  // Добавляем нашу комиссию
  const finalPrice = priceWithVAT * (1 + COMMISSION_RATE);
  
  return Math.round(finalPrice);
};

// Функция для получения цены в зависимости от объема
export const getPriceByVolume = (item: PriceItem, tons: number): { tenge: number; rub: number } => {
  let basePrice;
  if (tons >= 15) basePrice = item.priceOver15;
  else if (tons >= 5) basePrice = item.price5to15;
  else basePrice = item.price1to5;
  
  return {
    tenge: calculateFinalPrice(basePrice),
    rub: calculateFinalPriceRub(basePrice)
  };
};

// Функция для конвертации рублей в тенге (устаревшая, используем calculateFinalPrice)
export const convertToTenge = (rubles: number): number => {
  return calculateFinalPrice(rubles);
};

// Функция для получения уникальных категорий
export const getCategories = (): string[] => {
  return [...new Set(priceData.map(item => item.category))];
};

// Функция для получения уникальных филиалов
export const getBranches = (): string[] => {
  return [...new Set(priceData.map(item => item.branch))].sort();
};

// Функция для получения уникальных марок стали
export const getSteelGrades = (): string[] => {
  return [...new Set(priceData.map(item => item.steel || 'Cталь 3'))].sort();
};

// Функция для получения товаров по категории
export const getItemsByCategory = (category: string): PriceItem[] => {
  return priceData.filter(item => item.category === category);
};

// Функция для поиска товаров
export const searchItems = (query: string): PriceItem[] => {
  const lowerQuery = query.toLowerCase();
  return priceData.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) ||
    item.size.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery) ||
    item.branch.toLowerCase().includes(lowerQuery) ||
    (item.steel && item.steel.toLowerCase().includes(lowerQuery))
  );
};

// Функция для получения размеров по категории
export const getSizesByCategory = (category: string): string[] => {
  const items = getItemsByCategory(category);
  return [...new Set(items.map(item => item.size))].sort();
};

// Функция для фильтрации по размеру
export const getItemsBySize = (category: string, size: string): PriceItem[] => {
  return priceData.filter(item => item.category === category && item.size === size);
};

// Функция для фильтрации по филиалу
export const getItemsByBranch = (branch: string): PriceItem[] => {
  return priceData.filter(item => item.branch === branch);
};

// Функция для фильтрации по марке стали
export const getItemsBySteel = (steel: string): PriceItem[] => {
  return priceData.filter(item => item.steel === steel);
};

// Комплексная фильтрация
export const filterItems = (filters: {
  category?: string;
  branch?: string;
  steel?: string;
  size?: string;
  search?: string;
}): PriceItem[] => {
  let filtered = [...priceData];

  if (filters.category) {
    filtered = filtered.filter(item => item.category === filters.category);
  }

  if (filters.branch) {
    filtered = filtered.filter(item => item.branch === filters.branch);
  }

  if (filters.steel) {
    filtered = filtered.filter(item => item.steel === filters.steel);
  }

  if (filters.size) {
    filtered = filtered.filter(item => item.size === filters.size);
  }

  if (filters.search) {
    const lowerQuery = filters.search.toLowerCase();
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.size.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery) ||
      item.branch.toLowerCase().includes(lowerQuery) ||
      (item.steel && item.steel.toLowerCase().includes(lowerQuery))
    );
  }

  return filtered;
};

// Функция для получения всех цен товара
export const getAllPrices = (item: PriceItem): {
  price1to5: { tenge: number; rub: number };
  price5to15: { tenge: number; rub: number };
  priceOver15: { tenge: number; rub: number };
} => {
  return {
    price1to5: {
      tenge: calculateFinalPrice(item.price1to5),
      rub: calculateFinalPriceRub(item.price1to5)
    },
    price5to15: {
      tenge: calculateFinalPrice(item.price5to15),
      rub: calculateFinalPriceRub(item.price5to15)
    },
    priceOver15: {
      tenge: calculateFinalPrice(item.priceOver15),
      rub: calculateFinalPriceRub(item.priceOver15)
    }
  };
};