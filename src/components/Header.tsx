import React, { useState } from 'react';
import { Phone, Menu, X, Star } from 'lucide-react';
import { useCallModal } from '../contexts/CallModalContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openModal } = useCallModal();

  const handleCallClick = () => {
    openModal('Заказ звонка!');
  };

  return (
    <header className="bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-900 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-xl mr-4">
              <span className="text-2xl font-bold">А</span>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                АТЛАНТ МЕТАЛЛ
              </h1>
              <p className="text-sm text-blue-200 hidden sm:block">
                Металлопрокат из России
              </p>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-yellow-400 text-sm font-semibold">4.9</span>
                <span className="text-blue-200 text-sm ml-1">(112+ отзывов)</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#products" className="text-white hover:text-orange-300 font-medium transition-colors">
              Продукция
            </a>
            <a href="#calculator" className="text-white hover:text-orange-300 font-medium transition-colors">
              Калькулятор
            </a>
            <a href="#about" className="text-white hover:text-orange-300 font-medium transition-colors">
              Как работаем
            </a>
            <a href="#contact" className="text-white hover:text-orange-300 font-medium transition-colors">
              Контакты
            </a>
          </nav>

          {/* Contact Info & CTA */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <div className="text-xl font-bold text-white">
                +7 (747) 219-93-69
              </div>
              <div className="text-sm text-blue-200">
                Звонок бесплатный
              </div>
            </div>
            
            <button
              onClick={handleCallClick}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 lg:px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Заказать звонок</span>
              <span className="sm:hidden">Звонок</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-white hover:text-orange-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-blue-700 py-4">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#products" 
                className="text-white hover:text-orange-300 font-medium transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Продукция
              </a>
              <a 
                href="#calculator" 
                className="text-white hover:text-orange-300 font-medium transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Калькулятор
              </a>
              <a 
                href="#about" 
                className="text-white hover:text-orange-300 font-medium transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Как работаем
              </a>
              <a 
                href="#contact" 
                className="text-white hover:text-orange-300 font-medium transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Контакты
              </a>
              <div className="md:hidden pt-4 border-t border-blue-700">
                <div className="text-xl font-bold text-white mb-1">
                  +7 (747) 219-93-69
                </div>
                <div className="text-sm text-blue-200">
                  Звонок бесплатный
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;