import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustedCompanies from './components/TrustedCompanies';
import ProductsSection from './components/ProductsSection';
import Features from './components/Features';
import Calculator from './components/Calculator';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CallModal from './components/CallModal';
import CartButton from './components/CartButton';
import { CallModalProvider } from './contexts/CallModalContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <CartProvider>
      <CallModalProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <Hero />
          <TrustedCompanies />
          <ProductsSection />
          <Features />
          <Calculator />
          <About />
          <Contact />
          <Footer />
          <CallModal />
          <CartButton />
        </div>
      </CallModalProvider>
    </CartProvider>
  );
}

export default App;