import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TopNavBar from './components/TopNavBar';
import Footer from './components/Footer';
import BottomNavBar from './components/BottomNavBar';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import CategoryDirectory from './pages/CategoryDirectory';
import Orders from './pages/Orders';
import Account from './pages/Account';
import EffectsCanvas from './components/EffectsCanvas';
import OnboardingModal from './components/OnboardingModal';
import { LanguageProvider } from './context/LanguageContext';

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isCheckout = location.pathname.startsWith('/checkout');
  const isOrders = location.pathname.startsWith('/orders') || location.pathname.startsWith('/my-orders');
  const isAccount = location.pathname.startsWith('/account');
  const isHideBottomNav = isCheckout || isOrders || isAccount;

  return (
    <div className={`min-h-screen bg-white text-zinc-900 font-body selection:bg-blue-600/20 selection:text-blue-600 antialiased overflow-x-clip flex flex-col ${isHideBottomNav ? '' : 'pb-16 md:pb-0'}`}>
      <ScrollToTop />
      {!isCheckout && <TopNavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/category" element={<CategoryDirectory />} />
        <Route path="/category/:gender" element={<CategoryDirectory />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/my-orders" element={<Orders />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      {!isCheckout && <Footer />}
      {!isCheckout && <BottomNavBar />}
      <EffectsCanvas />
      <OnboardingModal />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

