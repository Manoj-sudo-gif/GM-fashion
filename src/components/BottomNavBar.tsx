import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, Package, User, X, ChevronRight, ShoppingBag, MapPin, Wallet, ArrowRight, Heart, PhoneCall, Trash2, Check, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import shopkeeperImg from '../assets/images/mens_fashion_empty_orders_illustration_1784884242598.jpg';

interface OrderItem {
  id: number;
  name: string;
  price: string;
  priceVal: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Order Placed' | 'Shipped' | 'In Transit' | 'Delivered';
  address: string;
}

export default function BottomNavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  // State for slide-up drawers
  const [activeDrawer, setActiveDrawer] = useState<'categories' | 'orders' | 'account' | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Selected category state inside the drawer
  const [selectedMainCat, setSelectedMainCat] = useState<'men' | 'boys' | 'kids' | 'accessories'>('men');

  // Load orders from localStorage
  const loadOrders = () => {
    try {
      const saved = localStorage.getItem('orders');
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [activeDrawer]);

  // Sync navigation active state
  const currentPath = location.pathname;
  const isHomeActive = currentPath === '/' && activeDrawer === null;
  const isCategoriesActive = activeDrawer === 'categories';
  const isOrdersActive = currentPath === '/orders' || currentPath === '/my-orders' || activeDrawer === 'orders';
  const isAccountActive = activeDrawer === 'account';

  // Helper to handle tab clicks
  const handleTabClick = (tab: 'home' | 'categories' | 'orders' | 'account') => {
    if (tab === 'home') {
      setActiveDrawer(null);
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'orders') {
      setActiveDrawer(null);
      navigate('/orders');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (activeDrawer === tab) {
        setActiveDrawer(null); // Toggle off
      } else {
        setActiveDrawer(tab);
      }
    }
  };

  // Close all drawers
  const closeDrawer = () => {
    setActiveDrawer(null);
  };

  // Clear orders handler (for debug/testing)
  const handleClearOrders = () => {
    if (window.confirm("Are you sure you want to clear your order history?")) {
      localStorage.removeItem('orders');
      setOrders([]);
    }
  };

  // Format currency in Indian Rupees
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Category data for the bottom sheet
  const categoriesList = {
    men: [
      { name: 'Shirts', url: '/products?category=Men', img: 'https://styleunion.in/cdn/shop/files/SMYS00049DARKOLIVE_1.webp?v=1783502402&width=1100' },
      { name: 'Trousers & Pants', url: '/products?category=Men', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80' },
      { name: 'Kurta & Ethnic', url: '/products?category=Men', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80' },
      { name: 'Jeans & Denim', url: '/products?category=Men', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80' }
    ],
    boys: [
      { name: 'Casual Shirts', url: '/products?category=Boys', img: 'https://cdn.shopify.com/s/files/1/0583/4820/8201/files/UntitledSession2999.jpg' },
      { name: 'Polo & Tees', url: '/products?category=Boys', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=400&q=80' },
      { name: 'Denims & Shorts', url: '/products?category=Boys', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=400&q=80' }
    ],
    kids: [
      { name: 'Frock & Gowns', url: '/products?category=Kids', img: 'https://www.mumkins.in/cdn/shop/files/1_acb25f3d-7de5-4d76-a9a0-108592db9e9a.webp?v=1778479117&width=1080' },
      { name: 'Boys Suits', url: '/products?category=Kids', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80' },
      { name: 'Tees & Sets', url: '/products?category=Kids', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80' }
    ],
    accessories: [
      { name: 'Dhotis', url: '/products?category=Accessories', img: 'https://m.media-amazon.com/images/I/71sQIeakXfL._AC_UY1100_.jpg' },
      { name: 'Footwear & Juttis', url: '/products?category=Accessories', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80' },
      { name: 'Belts & Wallets', url: '/products?category=Accessories', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80' }
    ]
  };

  // Mock static orders if there is none in history
  const mockPastOrders: Order[] = [
    {
      id: "GMF-482931",
      date: "14 Jul 2026",
      items: [
        {
          id: 101,
          name: 'ROYAL LINEN DHOTI',
          price: '₹ 1,850',
          priceVal: 1850,
          image: 'https://m.media-amazon.com/images/I/71sQIeakXfL._AC_UY1100_.jpg',
          color: '#ffffff',
          size: 'Free Size',
          quantity: 1
        },
        {
          id: 102,
          name: 'AIM COTTON SLIM SHIRT',
          price: '₹ 2,400',
          priceVal: 2400,
          image: 'https://styleunion.in/cdn/shop/files/SMYS00049DARKOLIVE_1.webp?v=1783502402&width=1100',
          color: '#556b2f',
          size: 'L',
          quantity: 1
        }
      ],
      total: 4250,
      status: 'Delivered',
      address: '12, MG Road, Bengaluru, Karnataka - 560001'
    }
  ];

  const displayedOrders = orders;

  return (
    <>
      {/* BOTTOM NAVIGATION BAR: Sticky, high-performance, purely customized - ONLY VISIBLE ON MOBILE */}
      <div id="bottom-nav-bar" className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] z-[99] flex items-center justify-around px-2 select-none pb-safe h-16">
        {/* Tab 1: Home */}
        <button
          onClick={() => handleTabClick('home')}
          className="flex flex-col items-center justify-center w-16 h-12 gap-1 relative cursor-pointer group"
          style={{ minWidth: '48px', minHeight: '48px' }}
        >
          <Home 
            size={20} 
            strokeWidth={isHomeActive ? 2.5 : 1.75} 
            className={`transition-all duration-300 transform group-hover:scale-105 ${
              isHomeActive ? 'text-blue-600' : 'text-zinc-400'
            }`} 
          />
          <span className={`text-[10px] font-black tracking-wider uppercase transition-colors duration-300 ${
            isHomeActive ? 'text-blue-600 font-extrabold' : 'text-zinc-400 font-bold'
          }`}>
            Home
          </span>
          {isHomeActive && (
            <motion.div 
              layoutId="bottom-nav-active-dot" 
              className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-600"
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          )}
        </button>

        {/* Tab 2: Categories */}
        <button
          onClick={() => handleTabClick('categories')}
          className="flex flex-col items-center justify-center w-16 h-12 gap-1 relative cursor-pointer group"
          style={{ minWidth: '48px', minHeight: '48px' }}
        >
          <LayoutGrid 
            size={20} 
            strokeWidth={isCategoriesActive ? 2.5 : 1.75} 
            className={`transition-all duration-300 transform group-hover:scale-105 ${
              isCategoriesActive ? 'text-blue-600' : 'text-zinc-400'
            }`} 
          />
          <span className={`text-[10px] font-black tracking-wider uppercase transition-colors duration-300 ${
            isCategoriesActive ? 'text-blue-600 font-extrabold' : 'text-zinc-400 font-bold'
          }`}>
            Categories
          </span>
          {isCategoriesActive && (
            <motion.div 
              layoutId="bottom-nav-active-dot" 
              className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-600"
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          )}
        </button>

        {/* Tab 3: My Orders */}
        <button
          onClick={() => handleTabClick('orders')}
          className="flex flex-col items-center justify-center w-16 h-12 gap-1 relative cursor-pointer group"
          style={{ minWidth: '48px', minHeight: '48px' }}
        >
          <Package 
            size={20} 
            strokeWidth={isOrdersActive ? 2.5 : 1.75} 
            className={`transition-all duration-300 transform group-hover:scale-105 ${
              isOrdersActive ? 'text-blue-600' : 'text-zinc-400'
            }`} 
          />
          <span className={`text-[10px] font-black tracking-wider uppercase transition-colors duration-300 ${
            isOrdersActive ? 'text-blue-600 font-extrabold' : 'text-zinc-400 font-bold'
          }`}>
            Orders
          </span>
          {orders.length > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
          )}
          {isOrdersActive && (
            <motion.div 
              layoutId="bottom-nav-active-dot" 
              className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-600"
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          )}
        </button>

        {/* Tab 4: Account */}
        <button
          onClick={() => handleTabClick('account')}
          className="flex flex-col items-center justify-center w-16 h-12 gap-1 relative cursor-pointer group"
          style={{ minWidth: '48px', minHeight: '48px' }}
        >
          <User 
            size={20} 
            strokeWidth={isAccountActive ? 2.5 : 1.75} 
            className={`transition-all duration-300 transform group-hover:scale-105 ${
              isAccountActive ? 'text-blue-600' : 'text-zinc-400'
            }`} 
          />
          <span className={`text-[10px] font-black tracking-wider uppercase transition-colors duration-300 ${
            isAccountActive ? 'text-blue-600 font-extrabold' : 'text-zinc-400 font-bold'
          }`}>
            Account
          </span>
          {isAccountActive && (
            <motion.div 
              layoutId="bottom-nav-active-dot" 
              className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-600"
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          )}
        </button>
      </div>

      {/* DRAWERS: Absolute slide-up bottom sheets with premium overlay experience */}
      <AnimatePresence>
        {activeDrawer !== null && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[90] md:hidden"
              onClick={closeDrawer}
            />

            {/* Slide-Up Bottom Sheet Drawer Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.15)] z-[95] flex flex-col max-h-[82vh] overflow-hidden pb-16 border-t border-zinc-100 md:hidden"
            >
              {/* Swipe/Drag Indicator Bar */}
              <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto my-3 cursor-pointer" onClick={closeDrawer} />

              {/* SHEET 1: CATEGORIES DRAWER */}
              {activeDrawer === 'categories' && (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="flex justify-between items-center px-6 pb-4 border-b border-zinc-100">
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-zinc-900 font-headline uppercase">Browse Departments</h3>
                      <p className="text-[11px] text-zinc-400 font-medium">Select a category to browse luxury fashion</p>
                    </div>
                    <button onClick={closeDrawer} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors">
                      <X size={18} />
                    </button>
                  </div>

                  {/* Main Grid Content split layout: Left side menu, Right side list */}
                  <div className="flex flex-grow h-[55vh] overflow-hidden">
                    {/* Left Sidebar selectors */}
                    <div className="w-1/3 bg-zinc-50 border-r border-zinc-100 overflow-y-auto py-2">
                      {(['men', 'boys', 'kids', 'accessories'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedMainCat(cat)}
                          className={`w-full py-4 px-3 text-left font-headline text-[11px] font-black uppercase tracking-wider transition-all border-l-4 ${
                            selectedMainCat === cat 
                              ? 'bg-white border-blue-600 text-blue-600' 
                              : 'border-transparent text-zinc-500'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Right side subcategory contents */}
                    <div className="w-2/3 p-4 overflow-y-auto flex flex-col gap-4">
                      {/* Premium Department Shortcut */}
                      {selectedMainCat !== 'accessories' && (
                        <button
                          onClick={() => {
                            closeDrawer();
                            const routeGender = selectedMainCat === 'men' ? 'Men' : selectedMainCat === 'boys' ? 'Boys' : 'Kids';
                            navigate(`/category/${routeGender}`);
                          }}
                          className="w-full bg-zinc-950 text-white text-[10px] font-black uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-between shadow-sm cursor-pointer hover:bg-zinc-800 transition-colors"
                        >
                          <span>Explore {selectedMainCat}'s Hub</span>
                          <ArrowRight size={12} className="text-blue-400" />
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-3 pb-4">
                        {categoriesList[selectedMainCat].map((sub, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              closeDrawer();
                              navigate(sub.url);
                            }}
                            className="flex flex-col items-center bg-zinc-50/50 hover:bg-zinc-50 border border-zinc-100 rounded-xl p-2.5 text-center cursor-pointer group transition-all"
                          >
                            <div className="w-14 h-14 rounded-full overflow-hidden border border-zinc-200 shadow-xs mb-2 bg-white">
                              <img 
                                src={sub.img} 
                                alt={sub.name} 
                                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300" 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-800 font-headline uppercase tracking-wide leading-tight line-clamp-1">{sub.name}</span>
                          </div>
                        ))}
                      </div>

                      {/* Promoted collection box */}
                      <div 
                        onClick={() => {
                          closeDrawer();
                          navigate('/products');
                        }}
                        className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-blue-100/60 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <h4 className="text-[10px] font-black uppercase text-blue-800 tracking-wider font-headline">GM Exclusive Autumn 26</h4>
                          <p className="text-[9px] text-blue-600 font-medium font-body">Browse 120+ curated articles</p>
                        </div>
                        <ChevronRight size={14} className="text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SHEET 2: MY ORDERS DRAWER */}
              {activeDrawer === 'orders' && (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="flex justify-between items-center px-6 pb-4 border-b border-zinc-100">
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-zinc-900 font-headline uppercase">MY ORDERS</h3>
                      <p className="text-[11px] text-zinc-400 font-medium">Track shipping and browse previous receipts</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {orders.length > 0 && (
                        <button 
                          onClick={handleClearOrders}
                          className="p-2 text-zinc-400 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-colors"
                          title="Clear order history"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <button onClick={closeDrawer} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors">
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Orders List viewport container */}
                  <div className="p-6 overflow-y-auto space-y-4 h-[55vh]">
                    {displayedOrders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-4 my-auto">
                        <img 
                          src={shopkeeperImg} 
                          alt="No Orders Yet" 
                          className="w-52 h-auto object-contain mx-auto mb-4" 
                          referrerPolicy="no-referrer"
                        />
                        <h4 className="text-sm font-bold text-zinc-900 font-headline mb-1">You haven't placed any orders</h4>
                        <p className="text-xs text-zinc-500 mb-5">All your orders will appear here</p>
                        <button
                          onClick={() => {
                            closeDrawer();
                            navigate('/products');
                          }}
                          className="bg-[#8e24aa] hover:bg-[#7b1fa2] text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-md transition-all cursor-pointer uppercase tracking-wider font-headline"
                        >
                          View Products
                        </button>
                      </div>
                    ) : (
                      displayedOrders.map((order) => (
                        <div key={order.id} className="border border-zinc-150 rounded-2xl bg-zinc-50/20 overflow-hidden shadow-xs hover:border-zinc-300 transition-colors">
                          {/* Header banner of card */}
                          <div className="bg-zinc-50 border-b border-zinc-100 px-4 py-3 flex justify-between items-center">
                            <div>
                              <span className="text-[9px] uppercase tracking-widest font-extrabold text-zinc-400">Order Reference</span>
                              <h4 className="text-xs font-black text-zinc-900 font-headline leading-tight mt-0.5">{order.id}</h4>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] uppercase tracking-widest font-extrabold text-zinc-400">Placed Date</span>
                              <p className="text-xs font-semibold text-zinc-800 leading-tight mt-0.5">{order.date}</p>
                            </div>
                          </div>

                          {/* Status timeline indicator bar */}
                          <div className="px-4 py-3.5 bg-white border-b border-zinc-100/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-500' : 'bg-blue-600 animate-pulse'}`}></div>
                              <span className="text-[11px] font-black uppercase tracking-wider font-headline text-zinc-800">{order.status}</span>
                            </div>
                            <div className="text-[10px] text-zinc-500 font-semibold font-body">
                              Estimated delivery: <span className="font-extrabold text-zinc-900">3-4 business days</span>
                            </div>
                          </div>

                          {/* Sub items inside order */}
                          <div className="p-4 space-y-3.5 bg-white">
                            {order.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex gap-3">
                                <div className="w-12 h-14 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-100 flex-shrink-0">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
                                </div>
                                <div className="flex-grow flex flex-col justify-center min-w-0">
                                  <h5 className="text-[10px] font-black tracking-tight text-zinc-900 uppercase font-headline leading-snug line-clamp-1">{item.name}</h5>
                                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Size: {item.size} • Qty: {item.quantity}</p>
                                  <span className="text-xs font-bold text-zinc-800 mt-1">{item.price}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Address & Total Invoice footer summary */}
                          <div className="p-4 bg-zinc-50/60 border-t border-zinc-100 flex flex-col gap-1.5 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-zinc-500 font-semibold">Total Invoice value:</span>
                              <span className="font-black text-zinc-900 font-headline">{formatCurrency(order.total)}</span>
                            </div>
                            <div className="flex items-start gap-1 text-[10px] text-zinc-400 font-medium leading-relaxed mt-1">
                              <MapPin size={11} className="shrink-0 text-zinc-400 mt-0.5" />
                              <span className="line-clamp-1">Deliver to: {order.address}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SHEET 3: MY ACCOUNT DRAWER */}
              {activeDrawer === 'account' && (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="flex justify-between items-center px-6 pb-4 border-b border-zinc-100">
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-zinc-900 font-headline uppercase">User Workspace</h3>
                      <p className="text-[11px] text-zinc-400 font-medium">GM Premium Privilege account profile</p>
                    </div>
                    <button onClick={closeDrawer} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors">
                      <X size={18} />
                    </button>
                  </div>

                  {/* Profile contents viewport */}
                  <div className="p-6 overflow-y-auto space-y-5 h-[55vh]">
                    {/* Premium Profile Badge */}
                    <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white rounded-2xl p-5 shadow-lg border border-zinc-800 relative overflow-hidden">
                      {/* Ambient background accent */}
                      <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                      
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white border-2 border-white/20 flex items-center justify-center font-headline text-lg font-black uppercase">
                          KS
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-black uppercase tracking-wider font-headline">KARUR SPARK</h4>
                            <span className="bg-blue-500/20 text-blue-300 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border border-blue-400/20 flex items-center gap-0.5">
                              <Award size={8} /> Elite
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 font-body font-medium">karurspark06@gmail.com</p>
                        </div>
                      </div>
                      
                      {/* Loyalty info footer inside profile box */}
                      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex justify-between items-center text-[10px] font-headline">
                        <span className="text-zinc-400 uppercase tracking-widest font-extrabold">GM VIP Rewards Level</span>
                        <span className="text-blue-400 font-black tracking-wide">1,820 Credits Available</span>
                      </div>
                    </div>

                    {/* Quick status wallets and benefits */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-zinc-150 rounded-xl p-3 bg-zinc-50/50 flex flex-col gap-1 shadow-2xs">
                        <Wallet size={16} className="text-blue-600" />
                        <span className="text-[9px] uppercase tracking-wider font-black text-zinc-400 font-headline mt-1">GMF Pay Balance</span>
                        <span className="text-sm font-black text-zinc-900 font-headline">₹ 1,500.00</span>
                      </div>
                      <div className="border border-zinc-150 rounded-xl p-3 bg-zinc-50/50 flex flex-col gap-1 shadow-2xs">
                        <Award size={16} className="text-emerald-500" />
                        <span className="text-[9px] uppercase tracking-wider font-black text-zinc-400 font-headline mt-1">Exclusive Coupons</span>
                        <span className="text-sm font-black text-zinc-900 font-headline">3 Active</span>
                      </div>
                    </div>

                    {/* List items settings options */}
                    <div className="space-y-1.5 border-t border-zinc-100 pt-4">
                      {/* Item 1 */}
                      <div className="flex items-center justify-between p-3.5 bg-white hover:bg-zinc-50 border border-zinc-150/70 rounded-xl cursor-pointer transition-colors shadow-2xs">
                        <div className="flex items-center gap-3">
                          <MapPin size={16} className="text-zinc-400" />
                          <div>
                            <h5 className="text-[11px] font-black tracking-tight text-zinc-800 uppercase font-headline">Saved Shipments Addresses</h5>
                            <p className="text-[9px] text-zinc-400 font-semibold font-body leading-none mt-0.5">1 address set as default</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-zinc-400" />
                      </div>

                      {/* Item 2 */}
                      <div className="flex items-center justify-between p-3.5 bg-white hover:bg-zinc-50 border border-zinc-150/70 rounded-xl cursor-pointer transition-colors shadow-2xs">
                        <div className="flex items-center gap-3">
                          <PhoneCall size={16} className="text-zinc-400" />
                          <div>
                            <h5 className="text-[11px] font-black tracking-tight text-zinc-800 uppercase font-headline">WhatsApp Customer Support</h5>
                            <p className="text-[9px] text-zinc-400 font-semibold font-body leading-none mt-0.5">Instant human help 24/7 online</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-zinc-400" />
                      </div>
                    </div>

                    {/* Developer notes / Credit stamp */}
                    <div className="text-center space-y-1 py-2">
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest font-headline">GM FASHION MOBILE V2.0.4</p>
                      <p className="text-[8px] text-zinc-400 font-medium font-body">Crafted for premium user responsiveness</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
