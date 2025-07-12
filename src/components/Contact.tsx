import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from 'lucide-react';
import { useCallModal } from '../contexts/CallModalContext';

const Contact: React.FC = () => {
  const { openModal } = useCallModal();

  return (
    <section id="contact" className="py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-8 py-4 mb-8">
            <Phone className="h-7 w-7 text-orange-400 mr-3" />
            <span className="text-orange-300 font-bold text-xl">Свяжитесь с нами</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Готовы ответить
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
              на все вопросы! 📞
            </span>
          </h2>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Наши специалисты помогут подобрать оптимальное решение для вашего проекта 
            и рассчитают точную стоимость с доставкой
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h3 className="text-3xl font-bold mb-8">Контактная информация</h3>
            
            <div className="space-y-8">
              {/* Phone */}
              <div className="flex items-start space-x-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-2">Телефон</h4>
                  <a 
                    href="tel:+77472199369" 
                    className="text-3xl font-bold text-orange-300 hover:text-orange-200 transition-colors block mb-2"
                  >
                    +7 (747) 219-93-69
                  </a>
                  <p className="text-blue-200">Звоните с 9:00 до 18:00 (пн-пт)</p>
                  <p className="text-blue-200">Консультации и заказы</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-2">Email</h4>
                  <a 
                    href="mailto:info@atlantmetal.kz" 
                    className="text-xl text-orange-300 hover:text-orange-200 transition-colors block mb-2"
                  >
                    info@atlantmetal.kz
                  </a>
                  <p className="text-blue-200">Коммерческие предложения</p>
                  <p className="text-blue-200">Техническая поддержка</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-2">Адрес</h4>
                  <p className="text-xl text-blue-100 mb-2">
                    г. Алматы, ул. Промышленная, 15
                  </p>
                  <p className="text-blue-200">Офис и склад</p>
                  <p className="text-blue-200">Самовывоз возможен</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start space-x-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-2">Режим работы</h4>
                  <p className="text-xl text-blue-100 mb-2">
                    Пн-Пт: 9:00 - 18:00
                  </p>
                  <p className="text-xl text-blue-100 mb-2">
                    Сб: 10:00 - 16:00
                  </p>
                  <p className="text-blue-200">Воскресенье - выходной</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-12 space-y-4">
              <button
                onClick={() => openModal('Заказать звонок')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <Phone className="h-6 w-6 mr-3" />
                Заказать обратный звонок
              </button>
              
              <button
                onClick={() => openModal('Получить коммерческое предложение')}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <Send className="h-6 w-6 mr-3" />
                Получить коммерческое предложение
              </button>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-3xl">
            <h3 className="text-3xl font-bold mb-8 text-center">Быстрая связь</h3>
            
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl text-center">
                <MessageSquare className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-4">Нужна консультация?</h4>
                <p className="text-blue-200 mb-6">
                  Оставьте заявку и наш специалист свяжется с вами в течение 15 минут
                </p>
                <button
                  onClick={() => openModal('Консультация специалиста')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Получить консультацию
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl text-center">
                <Phone className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-4">Срочный заказ?</h4>
                <p className="text-blue-200 mb-6">
                  Позвоните нам прямо сейчас для оформления срочного заказа
                </p>
                <a
                  href="tel:+77777777777"
                  className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all text-center"
                >
                  Позвонить сейчас
                </a>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl text-center">
                <Mail className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-4">Техническая поддержка</h4>
                <p className="text-blue-200 mb-6">
                  Вопросы по техническим характеристикам и подбору материалов
                </p>
                <button
                  onClick={() => openModal('Техническая поддержка')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Задать вопрос
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-3xl p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              🚀 Готовы начать сотрудничество?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Получите персональное предложение с учетом специфики вашего проекта
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openModal('Получить персональное предложение')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                📋 Получить предложение
              </button>
              <a
                href="#calculator"
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all"
              >
                🧮 Рассчитать стоимость
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;