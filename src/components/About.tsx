import React from 'react';
import { Award, Users, MapPin, Clock, Shield, TrendingUp, Star, CheckCircle } from 'lucide-react';
import { useCallModal } from '../contexts/CallModalContext';

const About: React.FC = () => {
  const { openModal } = useCallModal();

  return (
    <section id="about" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-8 py-4 mb-8">
            <Award className="h-7 w-7 text-blue-600 mr-3" />
            <span className="text-blue-700 font-bold text-xl">О компании</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
              АТЛАНТ МЕТАЛЛ
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Ваш надежный партнер
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Более 5 лет мы специализируемся на поставках качественного металлопроката из России в Казахстан. 
            Наша миссия — обеспечить строительную отрасль Казахстана надежными материалами по выгодным ценам.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Left Content */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Почему нам доверяют строители по всему Казахстану?
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Гарантия качества</h4>
                  <p className="text-gray-600">
                    Вся продукция сертифицирована и соответствует российским и казахстанским стандартам качества. 
                    Работаем только с проверенными заводами-производителями.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Выгодные цены</h4>
                  <p className="text-gray-600">
                    Прямые поставки от заводов позволяют нам предлагать цены до 50% ниже рыночных. 
                    Никаких посредников — только честные и прозрачные условия.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Быстрая доставка</h4>
                  <p className="text-gray-600">
                    Налаженная логистика позволяет доставлять металлопрокат в любую точку Казахстана 
                    за 5-10 дней. Собственный автопарк и проверенные партнеры.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Профессиональная команда</h4>
                  <p className="text-gray-600">
                    Опытные специалисты помогут подобрать оптимальные материалы для вашего проекта 
                    и проконсультируют по всем техническим вопросам.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Наши достижения
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">800+</div>
                <div className="text-gray-600">позиций металлопроката</div>
              </div>
              
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-gray-600">довольных клиентов</div>
              </div>
              
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                <div className="text-4xl font-bold text-orange-600 mb-2">5000+</div>
                <div className="text-gray-600">тонн поставлено</div>
              </div>
              
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                <div className="text-4xl font-bold text-purple-600 mb-2">99%</div>
                <div className="text-gray-600">довольных клиентов</div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => openModal('Узнать больше о компании')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                Узнать больше
              </button>
            </div>
          </div>
        </div>

        {/* Our Products */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Наша продукция
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl border border-blue-200 text-center">
              <div className="text-6xl mb-6">🔧</div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Трубы стальные</h4>
              <p className="text-gray-600 mb-6">
                Бесшовные и электросварные трубы различных диаметров для строительства и промышленности
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ГОСТ 8732-78, 10704-91
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Диаметры от 32 до 530 мм
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Длина 6-12 метров
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl border border-green-200 text-center">
              <div className="text-6xl mb-6">⬜</div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Трубы профильные</h4>
              <p className="text-gray-600 mb-6">
                Квадратные и прямоугольные профильные трубы для металлоконструкций и каркасов
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ГОСТ 30245-03
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Размеры от 15×15 до 200×200
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Толщина стенки 1,5-8 мм
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-3xl border border-orange-200 text-center">
              <div className="text-6xl mb-6">⚪</div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Круги стальные</h4>
              <p className="text-gray-600 mb-6">
                Горячекатаные круги из различных марок стали для машиностроения и производства
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ГОСТ 2590-2006
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Диаметры от 10 до 500 мм
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Марки стали: Ст3, Ст20, Ст40Х, Ст45
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Geography */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 lg:p-12 rounded-3xl border border-gray-200">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-blue-600 mr-3" />
              География поставок
            </h3>
            <p className="text-xl text-gray-600">
              Доставляем металлопрокат во все регионы Казахстана
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              'Алматы и область',
              'Нур-Султан и область',
              'Шымкент и область',
              'Караганда и область',
              'Актобе и область',
              'Павлодар и область',
              'Усть-Каменогорск',
              'Атырау и область'
            ].map((city, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="text-2xl mb-3">🏢</div>
                <div className="font-bold text-gray-900">{city}</div>
                <div className="text-sm text-gray-600 mt-2">5-10 дней доставки</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => openModal('Узнать стоимость доставки')}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              Узнать стоимость доставки
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;