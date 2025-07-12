import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useCallModal } from '../contexts/CallModalContext';

const Footer: React.FC = () => {
  const { openModal } = useCallModal();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-xl mr-4">
                <span className="text-2xl font-bold">А</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">АТЛАНТ МЕТАЛЛ</h3>
                <p className="text-gray-400">Поставка металлопроката из России</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Надежный поставщик качественного металлопроката из России в Казахстан. 
              Более 5 лет успешной работы, 4824+ позиций в наличии, доставка по всему Казахстану за 5-10 дней.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-pink-600 hover:bg-pink-700 p-3 rounded-lg transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-blue-800 hover:bg-blue-900 p-3 rounded-lg transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Быстрые ссылки</h4>
            <ul className="space-y-3">
              <li>
                <a href="#calculator" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Калькулятор цен
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Преимущества
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-orange-400 transition-colors">
                  О компании
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Контакты
                </a>
              </li>
              <li>
                <button 
                  onClick={() => openModal('Получить прайс-лист')}
                  className="text-gray-300 hover:text-orange-400 transition-colors text-left"
                >
                  Прайс-лист
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6">Контакты</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <div>
                  <a href="tel:+77777777777" className="text-white hover:text-orange-400 transition-colors font-semibold">
                    +7 (747) 219-93-69
                  </a>
                  <p className="text-gray-400 text-sm">Звоните с 9:00 до 18:00</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <div>
                  <a href="mailto:info@atlantsnabcity.kz" className="text-white hover:text-orange-400 transition-colors">
                    info@atlantmetal.kz
                  </a>
                  <p className="text-gray-400 text-sm">Коммерческие вопросы</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white">г. Алматы, ул. Промышленная, 15</p>
                  <p className="text-gray-400 text-sm">Офис и склад</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <div>
                  <p className="text-white">Пн-Пт: 9:00 - 18:00</p>
                  <p className="text-gray-400 text-sm">Сб: 10:00 - 16:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 ТОО "АТЛАНТ МЕТАЛЛ". Все права защищены.
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <button 
                onClick={() => openModal('Политика конфиденциальности')}
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                Политика конфиденциальности
              </button>
              <button 
                onClick={() => openModal('Условия использования')}
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                Условия использования
              </button>
              <button 
                onClick={() => openModal('Публичная оферта')}
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                Публичная оферта
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => openModal('Заказать звонок')}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              📞 Заказать звонок прямо сейчас
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;