import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNavBar from './components/TopNavBar';
import Footer from './components/Footer';
import BottomNavBar from './components/BottomNavBar';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import CategoryDirectory from './pages/CategoryDirectory';
import EffectsCanvas from './components/EffectsCanvas';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-zinc-900 font-body selection:bg-blue-600/20 selection:text-blue-600 antialiased overflow-x-clip flex flex-col pb-16 md:pb-0">
        <TopNavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/category/:gender" element={<CategoryDirectory />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer />
        <BottomNavBar />
        <EffectsCanvas />
      </div>
    </Router>
  );
}
