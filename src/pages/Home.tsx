import React, { useState, useEffect, useRef } from 'react';
import { Plus, ShoppingBag, Sparkles, Flame, ChevronLeft, ChevronRight, Clock, Eye, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { allProducts } from '../data/products';

const heroSlides = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/15444673/pexels-photo-15444673.jpeg',
    tag: 'BIGGEST SALE OF THE YEAR',
    title: 'FLAT 50%\nOFF.',
    layout: 'justify-center items-start',
    textAlign: 'text-left',
    gradient: 'bg-gradient-to-r from-black/60 via-black/10 to-transparent'
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/8381632/pexels-photo-8381632.jpeg',
    tag: 'FESTIVE OFFERS',
    title: 'BUY 1 GET 1\nFREE.',
    layout: 'justify-center items-start',
    textAlign: 'text-left',
    gradient: 'bg-gradient-to-r from-black/60 via-black/10 to-transparent'
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/8979069/pexels-photo-8979069.jpeg',
    tag: 'LIMITED TIME ONLY',
    title: 'EXTRA 20%\nON CARDS.',
    layout: 'justify-start pt-32 md:pt-40 items-end',
    textAlign: 'text-right flex flex-col items-end',
    gradient: 'bg-gradient-to-l from-black/60 via-black/10 to-transparent'
  }
];

const track1Brands = [
  'AIM', 'SMART', 'FOCUS', 'PRIME', 'ULTRA', 'ULTRA LINEN RICH', 
  'ULTRA 100% LINEN', 'EASYCARE', 'EASYCARE PLUS', 'WARRIOR', 
  'COMMANDER', 'MINISTER', 'KING'
];

const track2Brands = [
  'GURU', 'RAJAGURU', 'PRINCE', 'PENTA', 'HEXA', 'THREE STAR', 
  'FIVE STAR', 'TOP STAR ECO', 'TOP STAR PRO', 'BERLIN', 
  'BRISTOL', 'VAIBHAVAM REGULAR', 'VAIBHAVAM EMBOSS'
];

function BrandLogo({ name }: { name: string }) {
  switch (name) {
    case 'AIM':
      return (
        <div className="flex items-center gap-2 px-5 py-2.5 bg-zinc-950 text-white rounded-xl border border-zinc-800 shadow-sm">
          <span className="text-emerald-400 font-bold text-xs">▲</span>
          <span className="text-sm font-extrabold tracking-[0.25em] font-headline">AIM</span>
        </div>
      );
    case 'SMART':
      return (
        <div className="flex items-center gap-2 px-5 py-2.5 bg-sky-50 border border-sky-200 rounded-xl shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
          <span className="text-sm font-black text-sky-700 tracking-wider font-sans uppercase">SMART</span>
        </div>
      );
    case 'FOCUS':
      return (
        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-orange-50/40 border border-orange-200 rounded-full shadow-xs">
          <span className="w-4 h-4 rounded-full border-2 border-orange-500 flex items-center justify-center text-[9px] font-black text-orange-600 font-headline">F</span>
          <span className="text-xs font-bold text-orange-700 tracking-[0.2em] font-sans uppercase">FOCUS</span>
        </div>
      );
    case 'PRIME':
      return (
        <div className="flex items-center gap-1 px-5 py-2.5 bg-white border border-zinc-200 rounded-xl shadow-xs">
          <span className="text-amber-500 font-bold font-serif text-sm">✦</span>
          <span className="text-xs font-black text-zinc-900 tracking-[0.3em] font-serif uppercase">PRIME</span>
          <span className="text-amber-500 font-bold font-serif text-sm">✦</span>
        </div>
      );
    case 'ULTRA':
      return (
        <div className="px-5 py-2.5 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white rounded-xl font-mono font-black text-xs tracking-[0.15em] uppercase shadow-sm transform -skew-x-3 hover:scale-105 transition-transform">
          ULTRA
        </div>
      );
    case 'ULTRA LINEN RICH':
      return (
        <div className="flex flex-col items-center justify-center px-5 py-2.5 border border-amber-300 bg-amber-50/25 rounded-xl shadow-xs">
          <span className="text-xs font-black tracking-[0.2em] text-amber-950 font-headline leading-none">ULTRA</span>
          <span className="text-[7px] tracking-[0.3em] uppercase font-bold text-amber-700 mt-1">Linen Rich</span>
        </div>
      );
    case 'ULTRA 100% LINEN':
      return (
        <div className="flex items-center gap-2 px-5 py-2.5 bg-stone-100/50 border border-stone-200 rounded-xl shadow-xs">
          <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">100%</span>
          <span className="text-xs font-extrabold tracking-[0.15em] text-stone-900 font-body uppercase">ULTRA LINEN</span>
        </div>
      );
    case 'EASYCARE':
      return (
        <div className="px-5 py-2.5 bg-teal-50 border border-teal-200 rounded-full text-teal-800 font-sans font-bold text-xs tracking-wider uppercase shadow-xs">
          ✨ EasyCare
        </div>
      );
    case 'EASYCARE PLUS':
      return (
        <div className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-full shadow-xs">
          <span className="text-xs font-bold font-sans tracking-wide">EasyCare</span>
          <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full leading-none">+</span>
        </div>
      );
    case 'WARRIOR':
      return (
        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-zinc-950 text-white border-l-[6px] border-red-600 rounded-r-xl font-headline font-black text-xs tracking-[0.2em] uppercase shadow-sm">
          WARRIOR
        </div>
      );
    case 'COMMANDER':
      return (
        <div className="flex items-center gap-2 px-5 py-2.5 text-emerald-950 bg-emerald-50 border border-emerald-300 rounded-xl font-serif font-black text-xs tracking-widest uppercase shadow-xs">
          🎖️ COMMANDER
        </div>
      );
    case 'MINISTER':
      return (
        <div className="px-5 py-2 bg-white border-b-2 border-zinc-950 text-zinc-950 text-xs font-black tracking-[0.3em] font-serif uppercase">
          MINISTER
        </div>
      );
    case 'KING':
      return (
        <div className="flex items-center gap-2 px-5 py-2.5 bg-indigo-950 text-amber-300 rounded-xl border border-amber-500/30 text-xs font-extrabold uppercase tracking-widest font-headline shadow-sm">
          👑 KING
        </div>
      );
    case 'GURU':
      return (
        <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 border border-amber-400/20 text-amber-800 font-sans text-xs font-black tracking-[0.25em] uppercase rounded-xl shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          GURU
        </div>
      );
    case 'RAJAGURU':
      return (
        <div className="flex flex-col items-center px-5 py-2 bg-gradient-to-b from-amber-50/50 to-orange-50 border border-amber-300 rounded-xl shadow-xs">
          <span className="text-[7px] text-amber-700 font-extrabold tracking-[0.4em] uppercase leading-none">Raja</span>
          <span className="text-xs font-black text-zinc-900 tracking-widest uppercase font-serif mt-0.5">GURU</span>
        </div>
      );
    case 'PRINCE':
      return (
        <div className="flex items-center gap-2 px-5 py-2.5 border border-purple-200 bg-purple-50 rounded-xl shadow-xs">
          <span className="text-purple-600">⚜️</span>
          <span className="text-xs font-extrabold tracking-widest text-purple-950 uppercase font-serif">PRINCE</span>
        </div>
      );
    case 'PENTA':
      return (
        <div className="px-5 py-2.5 border border-cyan-400/40 bg-cyan-950/5 text-cyan-800 font-headline font-black text-xs tracking-widest uppercase rounded-xl">
          P E N T A
        </div>
      );
    case 'HEXA':
      return (
        <div className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-lime-400 border border-zinc-800 rounded-xl font-mono text-xs font-bold uppercase tracking-widest shadow-xs">
          <span className="text-lime-400 font-black">⬡</span> HEXA
        </div>
      );
    case 'THREE STAR':
      return (
        <div className="flex items-center gap-1.5 px-5 py-2.5 border border-zinc-300 rounded-xl text-xs font-extrabold tracking-wider text-zinc-700 bg-white shadow-xs">
          <span className="text-yellow-500 text-xs">★★★</span>
          <span className="font-headline tracking-widest text-[10px]">THREE STAR</span>
        </div>
      );
    case 'FIVE STAR':
      return (
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-yellow-50/80 border border-yellow-200 rounded-xl text-xs font-black tracking-widest text-yellow-950 shadow-xs">
          <span className="text-yellow-500 text-xs">★★★★★</span>
          <span className="font-headline text-[10px] tracking-widest">FIVE STAR</span>
        </div>
      );
    case 'TOP STAR ECO':
      return (
        <div className="flex flex-col items-center justify-center px-5 py-2.5 border border-emerald-300 bg-emerald-50/30 rounded-xl shadow-xs">
          <div className="flex items-center gap-1 leading-none">
            <span className="text-emerald-500 text-xs leading-none">★</span>
            <span className="text-[10px] font-black text-emerald-950 tracking-wider font-headline leading-none">TOP STAR</span>
          </div>
          <span className="text-[7px] text-emerald-600 font-extrabold uppercase tracking-[0.25em] leading-none mt-1">ECO</span>
        </div>
      );
    case 'TOP STAR PRO':
      return (
        <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl font-headline font-black text-xs tracking-wider uppercase shadow-sm">
          <span>★</span>
          <span>TOP STAR PRO</span>
        </div>
      );
    case 'BERLIN':
      return (
        <div className="flex items-center gap-2 px-5 py-2.5 text-zinc-950 bg-white border border-zinc-950 rounded-xl text-xs font-black tracking-[0.25em] uppercase shadow-xs">
          BERLIN
        </div>
      );
    case 'BRISTOL':
      return (
        <div className="px-5 py-2.5 bg-zinc-50 border border-zinc-300 text-zinc-900 rounded-xl font-serif font-black text-xs tracking-widest uppercase shadow-xs">
          BRISTOL
        </div>
      );
    case 'VAIBHAVAM REGULAR':
      return (
        <div className="flex flex-col items-center px-5 py-2.5 border border-rose-200 bg-rose-50/20 rounded-xl shadow-xs">
          <span className="text-xs font-black tracking-widest text-rose-900 font-headline leading-none">VAIBHAVAM</span>
          <span className="text-[7px] tracking-[0.25em] uppercase font-bold text-rose-600 mt-1">REGULAR</span>
        </div>
      );
    case 'VAIBHAVAM EMBOSS':
      return (
        <div className="flex flex-col items-center px-5 py-2 bg-gradient-to-tr from-rose-900 to-rose-950 text-amber-100 rounded-xl shadow-sm border border-rose-800">
          <span className="text-xs font-black tracking-widest text-amber-200 font-headline leading-none drop-shadow-sm">VAIBHAVAM</span>
          <span className="text-[7px] tracking-[0.3em] uppercase font-extrabold text-amber-400 mt-1">EMBOSS</span>
        </div>
      );
    default:
      return (
        <div className="px-5 py-2.5 bg-zinc-100 text-zinc-900 font-bold text-xs rounded-xl uppercase tracking-widest shadow-xs">
          {name}
        </div>
      );
  }
}

const hotSaleItems = [
  {
    id: 1001,
    name: 'Buy 3 Premium Cotton T-Shirts',
    subtext: 'Stack of premium Navy, Olive & Black crewnecks.',
    badge: '33% OFF',
    mrp: 750,
    price: 499,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    color: 'Navy, Olive, Black',
    size: 'L',
    bgColor: 'from-amber-500/10 to-orange-500/10',
    btnColor: 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
  },
  {
    id: 1004,
    name: 'Ultimate Cozy Hoodies Duo',
    subtext: 'Get 2 premium fleece pull-overs (Slate Grey & Jet Black).',
    badge: '40% OFF',
    mrp: 1499,
    price: 899,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    color: 'Slate Grey, Jet Black',
    size: 'XL',
    bgColor: 'from-purple-500/10 to-indigo-500/10',
    btnColor: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
  },
  {
    id: 1005,
    name: 'Dry-Fit Activewear Trio',
    subtext: 'Three high-performance athletic tees for the gym.',
    badge: '45% OFF',
    mrp: 1099,
    price: 599,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800',
    color: 'Neon Blue, Charcoal, Red',
    size: 'M',
    bgColor: 'from-teal-500/10 to-emerald-500/10',
    btnColor: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
  },
  {
    id: 1006,
    name: 'Chino Trousers Weekend Set',
    subtext: 'Double pack of smart slim-fit stretch chinos (Beige & Khaki).',
    badge: '50% OFF',
    mrp: 1999,
    price: 999,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
    color: 'Beige, Khaki',
    size: '32',
    bgColor: 'from-sky-500/10 to-blue-500/10',
    btnColor: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
  }
];

const peopleAlsoViewedItems = [
  {
    id: 1002,
    name: '4 Premium Formal Shirts Combo',
    description: 'Crisp White, Light Blue, Checked & Striped professional shirts.',
    badge: 'FLASH SALE',
    price: '₹999',
    priceVal: 999,
    mrp: '₹2000',
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=400',
    category: 'Shirts Combo'
  },
  {
    id: 1007,
    name: 'Premium Breathable Innerwear Pack',
    description: 'Pack of 5 cotton stretch trunks with active odor-control.',
    badge: 'DAILY COMFORT',
    price: '₹399',
    priceVal: 399,
    mrp: '₹799',
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80&w=400',
    category: 'Innerwear'
  },
  {
    id: 1008,
    name: 'Pro-Athletic Sportswear Combo',
    description: 'Super stretch joggers paired with sweat-wicking dry-fit tee.',
    badge: 'BEST SELLER',
    price: '₹799',
    priceVal: 799,
    mrp: '₹1499',
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577076?auto=format&fit=crop&q=80&w=400',
    category: 'Sportswear'
  },
  {
    id: 1009,
    name: 'Relaxed Loungewear Set',
    description: 'Ultra comfort drop-shoulder oversized tee and soft fleece shorts.',
    badge: 'COMBO PACK',
    price: '₹699',
    priceVal: 699,
    mrp: '₹1200',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=400',
    category: 'Loungewear'
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hotSaleSlide, setHotSaleSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 45 * 60 + 10); // 2 hours, 45 mins, 10 secs
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerConfettiEffect = (e: React.MouseEvent) => {
    window.dispatchEvent(new CustomEvent('trigger-confetti', {
      detail: { x: e.clientX, y: e.clientY }
    }));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHotSaleSlide((prev) => (prev + 1) % hotSaleItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 2 * 3600 + 45 * 60 + 10));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddDealToCart = (deal: { id: number; name: string; price: string; priceVal: number; image: string; color: string; size: string }) => {
    const savedCart = localStorage.getItem('cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    
    const existingIndex = cart.findIndex((item: any) => item.id === deal.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        ...deal,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    
    setToastMessage(`🎉 Added "${deal.name}" to Bag successfully!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <main className="pt-0">
      {/* Toast Notification Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-11/12 max-w-md bg-zinc-900/95 text-white px-6 py-4 rounded-2xl shadow-2xl border border-zinc-800 flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-sm">
              ✓
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold font-body">{toastMessage}</p>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-zinc-400 hover:text-white transition-colors text-[10px] font-bold px-2 py-1 uppercase tracking-widest cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Containerized Rounded Rectangle Carousel Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 mb-8 sm:mb-12">
        <div className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-black shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-zinc-100">
          {heroSlides.map((slide, index) => (
            <motion.img 
              key={slide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ 
                opacity: index === currentSlide ? 1 : 0, 
                scale: index === currentSlide ? 1 : 1.05,
                zIndex: index === currentSlide ? 10 : 0
              }}
              transition={{ 
                duration: 1.2, 
                ease: "easeInOut",
                opacity: { 
                  duration: 1.2,
                  ease: "easeInOut",
                  delay: index === currentSlide ? 0 : 1.2 
                }
              }}
              className="absolute inset-0 w-full h-full object-cover" 
              alt={`Hero Background ${slide.id}`} 
              src={slide.image}
              referrerPolicy="no-referrer"
            />
          ))}


          {/* Subtle Gradient for Text Readability without ruining the image quality */}
          <AnimatePresence>
            <motion.div
              key={`grad-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className={`absolute inset-0 ${heroSlides[currentSlide].gradient} z-[5] pointer-events-none`}
            />
          </AnimatePresence>

          {/* Clean, Minimalist Text Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <AnimatePresence>
              <motion.div
                key={`text-${currentSlide}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className={`absolute inset-0 flex flex-col ${heroSlides[currentSlide].layout.includes('justify-center') ? 'justify-center' : 'justify-center sm:justify-start sm:pt-32 md:pt-40'} px-6 sm:px-12 md:px-24`}
              >
                <div className={`max-w-2xl pointer-events-auto ${heroSlides[currentSlide].textAlign}`}>
                  <p className="text-white/80 font-label tracking-[0.2em] uppercase text-[8px] xs:text-[10px] sm:text-xs mb-2 sm:mb-4">
                    {heroSlides[currentSlide].tag}
                  </p>
                  <h1 className="text-white text-lg xs:text-2xl sm:text-4xl md:text-[4rem] lg:text-[4.5rem] font-black tracking-tighter leading-[0.95] mb-3 sm:mb-8 font-headline whitespace-pre-line drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <Link to="/products?category=Collections" className="inline-block border text-center border-white/80 text-white px-4 py-2 sm:px-8 sm:py-4 text-[8px] xs:text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-colors duration-300 pointer-events-auto">
                    Shop The Sale
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 flex gap-3 sm:gap-4 z-10">
            {heroSlides.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-12 h-[3px] transition-all duration-500 cursor-pointer ${
                  index === currentSlide ? 'bg-white' : 'bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Brand Logo Carousel Section (Brand Master Strip) */}
      <section className="relative w-full py-8 bg-gradient-to-br from-zinc-50 via-stone-50/70 to-zinc-100/90 border-y border-zinc-200 overflow-hidden shadow-xs">
        <style>{`
          @keyframes marquee-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee-left-track {
            display: flex;
            width: max-content;
            gap: 2rem;
            animation: marquee-left 35s linear infinite;
          }
          .animate-marquee-right-track {
            display: flex;
            width: max-content;
            gap: 2rem;
            animation: marquee-right 35s linear infinite;
          }
          .marquee-container:hover .animate-marquee-left-track,
          .marquee-container:hover .animate-marquee-right-track {
            animation-play-state: paused;
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
            <h3 className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase font-headline">GM Fashions • Brand Master</h3>
          </div>
          <span className="text-[9px] text-zinc-400 font-medium font-body uppercase tracking-wider hidden sm:inline-block">Endless curation of premium apparel</span>
        </div>

        {/* Superimposed/adjacent horizontal tracks scrolling independently */}
        <div className="marquee-container flex flex-col gap-5 w-full overflow-hidden">
          {/* Upper Track (Right to Left) */}
          <div className="relative flex w-full overflow-hidden py-1">
            <div className="animate-marquee-left-track">
              {/* Render first half of brands */}
              {track1Brands.map((brand, i) => (
                <div key={`track1-${i}`} className="inline-flex items-center justify-center">
                  <BrandLogo name={brand} />
                </div>
              ))}
              {/* Duplicate for seamless infinite scroll */}
              {track1Brands.map((brand, i) => (
                <div key={`track1-dup-${i}`} className="inline-flex items-center justify-center" aria-hidden="true">
                  <BrandLogo name={brand} />
                </div>
              ))}
            </div>
          </div>

          {/* Lower Track (Left to Right) */}
          <div className="relative flex w-full overflow-hidden py-1">
            <div className="animate-marquee-right-track">
              {/* Render second half of brands */}
              {track2Brands.map((brand, i) => (
                <div key={`track2-${i}`} className="inline-flex items-center justify-center">
                  <BrandLogo name={brand} />
                </div>
              ))}
              {/* Duplicate for seamless infinite scroll */}
              {track2Brands.map((brand, i) => (
                <div key={`track2-dup-${i}`} className="inline-flex items-center justify-center" aria-hidden="true">
                  <BrandLogo name={brand} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Curated Hot Deals Section - Three Premium Vertically Stacked Cards */}
      <section className="py-16 sm:py-24 bg-zinc-50/50 border-b border-zinc-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950 text-white rounded-full font-bold text-[10px] tracking-widest uppercase mb-4 shadow-sm">
              <Flame size={12} className="animate-pulse fill-rose-500 text-rose-500" /> Limited Time Combo Offer Busters
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 font-headline uppercase">FESTIVE DEALS EXCLUSIVE</h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-3 max-w-xl mx-auto font-body font-light">
              Premium, vertically stacked 16:9 visual modules styled with energetic magic border frames, highlighting active deals and unmatched value.
            </p>
          </div>

          <div className="flex flex-col gap-16 md:gap-20">
            
            {/* CARD 1: HOT SALE */}
            <div className="max-w-4xl mx-auto w-full">
              {/* Card Label and Title outside the border */}
              <div className="flex items-baseline justify-between mb-4 px-2">
                <h3 className="text-xl sm:text-2xl font-black tracking-tighter text-zinc-900 font-headline uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  HOT SALE
                </h3>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                  AUTO-PLAYING HERO SLIDER
                </span>
              </div>

              {/* Magic Border Wrapper */}
              <div 
                className="relative p-[2px] rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_15px_45px_rgba(0,0,0,0.08)] overflow-hidden"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #10b981, #f59e0b, #ec4899)',
                  backgroundSize: '200% auto',
                  animation: 'borderShine 4s linear infinite'
                }}
              >
                {/* 16:9 Inner Container */}
                <div className="relative aspect-[16/9] w-full bg-white rounded-[calc(1.5rem-2px)] sm:rounded-[calc(2rem-2px)] overflow-hidden flex flex-col">
                  
                  {/* Slider Logic */}
                  <div className="relative w-full h-full flex overflow-hidden">
                    <AnimatePresence mode="wait">
                      {hotSaleItems.map((slide, index) => {
                        if (index !== hotSaleSlide) return null;
                        return (
                          <motion.div
                            key={slide.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 w-full h-full flex flex-col md:flex-row"
                          >
                            {/* Left Side: Product Photography */}
                            <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-zinc-100 flex items-center justify-center p-3 sm:p-4">
                              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-50 to-zinc-200/50 z-0" />
                              
                              {/* Badge Overlay */}
                              <span className="absolute top-2.5 left-2.5 z-20 bg-rose-600 text-white font-black px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                                <Sparkles size={10} className="fill-white" /> {slide.badge}
                              </span>
                              
                              <img 
                                className="w-full h-full object-contain relative z-10 drop-shadow-[0_6px_12px_rgba(0,0,0,0.05)]"
                                src={slide.image}
                                alt={slide.name}
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            
                            {/* Right Side: Details and Cart action */}
                            <div className="w-full md:w-1/2 h-1/2 md:h-full p-3 sm:p-5 md:p-8 flex flex-col justify-between bg-zinc-900 text-white relative">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl z-0 pointer-events-none" />
                              
                              <div className="relative z-10 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-amber-400">🔥 BEST DEALS</span>
                                  <span className="text-[6px] sm:text-[8px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest">Active Combo</span>
                                </div>
                                <h4 className="text-xs sm:text-lg md:text-xl lg:text-2xl font-black tracking-tight mt-0.5 sm:mt-1.5 text-white leading-tight truncate md:whitespace-normal">
                                  {slide.name}
                                </h4>
                                <p className="text-zinc-400 text-[8px] sm:text-xs md:text-sm mt-0.5 sm:mt-2 font-body font-light leading-snug max-w-md hidden sm:block">
                                  {slide.subtext}
                                </p>
                              </div>
                              
                              <div className="relative z-10">
                                <div className="flex items-baseline gap-2 sm:gap-4 mb-1.5 sm:mb-3">
                                  <span className="text-zinc-500 line-through text-[8px] sm:text-xs font-medium">MRP: ₹{slide.mrp}</span>
                                  <div className="flex flex-col">
                                    <span className="text-[6px] sm:text-[8px] font-bold text-amber-400 uppercase tracking-widest">Special Price</span>
                                    <span className="text-sm sm:text-lg md:text-xl font-black text-amber-400 leading-none">₹{slide.price}</span>
                                  </div>
                                </div>
                                
                                <button
                                  onClick={(e) => {
                                    triggerConfettiEffect(e);
                                    handleAddDealToCart({
                                      id: slide.id,
                                      name: slide.name,
                                      price: `₹ ${slide.price}`,
                                      priceVal: slide.price,
                                      image: slide.image,
                                      color: slide.color,
                                      size: slide.size
                                    });
                                  }}
                                  className="w-full py-2 sm:py-3 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-black text-[8px] sm:text-xs uppercase tracking-[0.12em] rounded-xl transition-all duration-300 shadow-lg shadow-amber-400/10 flex items-center justify-center gap-1 sm:gap-2 cursor-pointer"
                                >
                                  <ShoppingBag size={12} strokeWidth={2.5} /> Add to Bag
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    
                    {/* Slide Navigation */}
                    <button 
                      onClick={() => setHotSaleSlide(prev => (prev - 1 + hotSaleItems.length) % hotSaleItems.length)}
                      className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 z-30 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-xs text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Previous Slide"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button 
                      onClick={() => setHotSaleSlide(prev => (prev + 1) % hotSaleItems.length)}
                      className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 z-30 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-xs text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Next Slide"
                    >
                      <ChevronRight size={14} />
                    </button>
                    
                    {/* Carousel Bullet Dots */}
                    <div className="absolute bottom-1.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1 sm:gap-1.5">
                      {hotSaleItems.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setHotSaleSlide(i)}
                          className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300 ${i === hotSaleSlide ? 'bg-amber-400 w-3' : 'bg-white/40 hover:bg-white/60'}`}
                        />
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* CARD 2: PEOPLE ALSO VIEWED */}
            <div className="max-w-4xl mx-auto w-full">
              {/* Card Label and Title outside the border */}
              <div className="flex items-baseline justify-between mb-4 px-2">
                <h3 className="text-xl sm:text-2xl font-black tracking-tighter text-zinc-900 font-headline uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                  PEOPLE ALSO VIEWED
                </h3>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                  VERTICAL COMBO LIST
                </span>
              </div>

              {/* Magic Border Wrapper */}
              <div 
                className="relative p-[2px] rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_15px_45px_rgba(0,0,0,0.08)] overflow-hidden"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #10b981, #f59e0b, #ec4899)',
                  backgroundSize: '200% auto',
                  animation: 'borderShine 4s linear infinite'
                }}
              >
                {/* 16:9 Inner Container with Dual Pane layout */}
                <div className="relative aspect-[16/9] w-full bg-white rounded-[calc(1.5rem-2px)] sm:rounded-[calc(2rem-2px)] overflow-hidden flex flex-row">
                  
                  {/* Left Static Editorial Banner */}
                  <div className="hidden md:flex md:w-1/3 h-full relative overflow-hidden bg-zinc-950 p-6 flex-col justify-between text-white">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/15 to-blue-500/20" />
                    
                    <div className="relative z-10">
                      <span className="text-[8px] font-black uppercase tracking-[0.25em] text-purple-400">Recommends</span>
                      <h4 className="text-base font-black tracking-tight mt-1 font-headline leading-tight">TRENDING FOR YOU</h4>
                      <p className="text-zinc-400 text-[10px] mt-2 font-body font-light leading-relaxed">
                        Combos other smart shoppers are currently viewing and adding to their bags right now.
                      </p>
                    </div>
                    
                    <div className="relative z-10 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-purple-400">
                      <Eye size={12} /> Live tracking
                    </div>
                  </div>
                  
                  {/* Right Vertical product list inside the card */}
                  <div className="w-full md:w-2/3 h-full bg-white p-2.5 sm:p-4 md:p-5 flex flex-col justify-between overflow-hidden">
                    <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 flex items-center justify-between px-1">
                      <span>MOST POPULAR COMBOS</span>
                      <span className="text-purple-600 font-bold animate-pulse">• SELLING FAST</span>
                    </div>
                    
                    {/* Scrollable listing content */}
                    <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 no-scrollbar">
                      {peopleAlsoViewedItems.map((item) => (
                        <div 
                          key={item.id}
                          className="flex items-center gap-2.5 p-1.5 sm:p-2 bg-zinc-50 hover:bg-zinc-100/70 border border-zinc-100 rounded-xl transition-all duration-300 group"
                        >
                          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-zinc-200 overflow-hidden shrink-0 flex items-center justify-center p-1 relative">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[6px] sm:text-[8px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-1 py-0.5 rounded">
                                {item.badge}
                              </span>
                              <span className="text-[7px] font-bold text-zinc-400 font-mono hidden sm:inline">{item.category}</span>
                            </div>
                            <h5 className="text-[9px] sm:text-xs font-black text-zinc-900 truncate mt-0.5">{item.name}</h5>
                            <p className="text-[8px] sm:text-[10px] text-zinc-400 truncate font-light hidden sm:block">{item.description}</p>
                          </div>
                          
                          <div className="text-right shrink-0 flex flex-col items-end gap-1">
                            <div className="flex items-baseline gap-1">
                              <span className="text-[7px] sm:text-[9px] text-zinc-400 line-through font-body">{item.mrp}</span>
                              <span className="text-[10px] sm:text-sm font-black text-zinc-950 font-headline">{item.price}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                triggerConfettiEffect(e);
                                handleAddDealToCart({
                                  id: item.id,
                                  name: item.name,
                                  price: item.price,
                                  priceVal: item.priceVal,
                                  image: item.image,
                                  color: 'Assorted Combo',
                                  size: 'L'
                                });
                              }}
                              className="px-2 py-1 sm:px-3 sm:py-1.5 bg-zinc-900 hover:bg-purple-600 text-white font-extrabold text-[8px] sm:text-[9px] uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={10} strokeWidth={2.5} /> Grab
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* CARD 3: DAMAL OFFER */}
            <div className="max-w-4xl mx-auto w-full">
              {/* Card Label and Title outside the border */}
              <div className="flex items-baseline justify-between mb-4 px-2">
                <h3 className="text-xl sm:text-2xl font-black tracking-tighter text-zinc-900 font-headline uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  DAMAL OFFER
                </h3>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  FESTIVE MEGA BLOWER
                </span>
              </div>

              {/* Magic Border Wrapper */}
              <div 
                className="relative p-[2px] rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_15px_45px_rgba(0,0,0,0.08)] overflow-hidden"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #10b981, #f59e0b, #ec4899)',
                  backgroundSize: '200% auto',
                  animation: 'borderShine 4s linear infinite'
                }}
              >
                {/* 16:9 Inner Container */}
                <div className="relative aspect-[16/9] w-full bg-white rounded-[calc(1.5rem-2px)] sm:rounded-[calc(2rem-2px)] overflow-hidden flex flex-col justify-between">
                  
                  {/* Top Split Area (70% height) */}
                  <div className="flex-1 grid grid-cols-2 overflow-hidden border-b border-zinc-100">
                    
                    {/* Left Kids Tees Split */}
                    <div className="relative h-full w-full flex items-center justify-center p-2 sm:p-4 border-r border-zinc-200">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-rose-400/10 z-0" />
                      <span className="absolute top-2 left-2 z-20 bg-amber-400 text-zinc-900 font-extrabold text-[7px] sm:text-[9px] px-2 py-0.5 rounded shadow-sm">
                        4 Kids Tees • ₹499
                      </span>
                      <img 
                        className="h-full max-h-[85%] object-contain relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:scale-105 transition-transform duration-500" 
                        alt="Four kids colorful cotton t-shirts in various designs and patterns under pure white light" 
                        src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=400"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    {/* Right Kids Pants Split */}
                    <div className="relative h-full w-full flex items-center justify-center p-2 sm:p-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-400/5 to-blue-400/10 z-0" />
                      <span className="absolute top-2 right-2 z-20 bg-blue-500 text-white font-extrabold text-[7px] sm:text-[9px] px-2 py-0.5 rounded shadow-sm">
                        4 Kids Pants • ₹499
                      </span>
                      <img 
                        className="h-full max-h-[85%] object-contain relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:scale-105 transition-transform duration-500" 
                        alt="Four kids premium comfortable track pants in assorted vivid colors laid neatly on plain backdrop" 
                        src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=400"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                  </div>

                  {/* Bottom Checkout & Pricing Action (30% height) */}
                  <div className="h-[30%] bg-zinc-950 text-white px-3 sm:px-6 md:px-8 py-2 flex items-center justify-between gap-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-rose-950/20 pointer-events-none" />
                    
                    {/* Pricing */}
                    <div className="relative z-10 flex flex-col justify-center min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[6px] sm:text-[8px] bg-emerald-500 text-zinc-950 font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse leading-none">
                          DAMAL SAVINGS
                        </span>
                        <span className="text-zinc-500 line-through text-[8px] sm:text-xs">MRP: ₹1600</span>
                      </div>
                      <h4 className="text-[9px] sm:text-sm md:text-base font-black text-white truncate mt-0.5 font-headline">
                        DIWALI BLAST: <span className="text-emerald-400">₹499</span> <span className="text-zinc-400 text-[7px] sm:text-[9px] font-normal">for All 8 Pcs</span>
                      </h4>
                    </div>

                    {/* Countdown */}
                    <div className="hidden lg:flex items-center gap-2 text-zinc-400 text-xs shrink-0 font-mono bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
                      <Clock size={12} className="text-rose-500 animate-spin" style={{ animationDuration: '4s' }} />
                      <span>Ends in: {formatTime(timeLeft)}</span>
                    </div>

                    {/* Shop Button */}
                    <button 
                      id="shop-kids-combo-3"
                      onClick={(e) => {
                        triggerConfettiEffect(e);
                        handleAddDealToCart({ 
                          id: 1003, 
                          name: 'Diwali Kids Blast - 8 Pcs (4 Tees + 4 Pants)', 
                          price: '₹ 499', 
                          priceVal: 499, 
                          image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800', 
                          color: 'Assorted Kids Prints', 
                          size: 'Kids Free Size' 
                        });
                      }}
                      className="relative z-10 px-3 py-1.5 sm:px-5 sm:py-2.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-extrabold text-[8px] sm:text-xs uppercase tracking-[0.12em] rounded-xl transition-all duration-300 shadow-md shadow-emerald-500/20 shrink-0 flex items-center gap-1 sm:gap-2 cursor-pointer"
                    >
                      <Sparkles size={11} className="fill-zinc-950" />
                      <span className="hidden xs:inline">Shop Kids Collection</span>
                      <span className="xs:hidden">Shop Combo</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Fashion Video Background */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 sm:my-20">
        <div className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-black shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-zinc-100">
          <video 
            className="absolute inset-0 w-full h-full object-cover"
            src="https://www.pexels.com/download/video/7872847/"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
            <div className="text-center px-4 sm:px-6 max-w-3xl mx-auto flex flex-col items-center justify-center h-full">
              <h2 className="text-white text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-2 sm:mb-6 font-headline">ART OF DRAPE</h2>
              <p className="text-white/95 text-[10px] sm:text-sm md:text-lg leading-relaxed text-center font-body font-light max-w-2xl">
                Experience the convergence of architectural silhouettes and fluid fabrics. 
                Our latest collection reimagines everyday elegance through meticulous tailoring, 
                bringing a refined luxury that speaks louder than words.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now - Flipkart-style responsive grid */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-zinc-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.25em] font-bold">Hot Curation</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 font-headline uppercase mt-1">Trending Now</h2>
            </div>
            <p className="text-zinc-500 text-xs mt-2 sm:mt-0 font-light">
              Premium essentials curated for modern fashion statements
            </p>
          </div>

          {/* Flipkart-Style 2-Column Grid on Mobile, 6-Column on Desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
            {allProducts.slice(0, 6).map((product) => {
              // Calculate a dynamic mock discount/mrp based on priceVal for realistic visuals
              const mrpValue = Math.round(product.priceVal * 2);
              const discountPercentage = 50; // Flat 50% as requested on the site design

              return (
                <div 
                  key={product.id}
                  className="group relative bg-white border border-zinc-200/80 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image Container with links to PDP */}
                  <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-zinc-50">
                    {/* Badge */}
                    <span className="absolute top-2 left-2 z-10 bg-zinc-900 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {discountPercentage}% OFF
                    </span>

                    {/* Star Rating Badge overlay */}
                    <span className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-xs text-zinc-900 text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                      4.5 <Star size={8} className="fill-amber-400 text-amber-400" />
                    </span>

                    {/* Product Main Image */}
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={product.name} 
                      src={product.image}
                      referrerPolicy="no-referrer"
                    />
                  </Link>

                  {/* Product Details Content */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Brand Label */}
                      <span className="text-[9px] font-black tracking-widest text-zinc-400 uppercase">
                        {product.brand || 'GM Fashion'}
                      </span>
                      {/* Product Name */}
                      <Link to={`/product/${product.id}`} className="block mt-0.5">
                        <h3 className="text-xs font-semibold text-zinc-800 hover:text-zinc-950 font-sans line-clamp-2 min-h-[2rem]">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    {/* Pricing, Category & Bag Action */}
                    <div className="mt-2.5 pt-2 border-t border-zinc-100 flex flex-col gap-2">
                      <div className="flex items-baseline flex-wrap gap-x-2">
                        <span className="text-sm font-black text-zinc-900 font-headline">
                          {product.price}
                        </span>
                        <span className="text-[10px] text-zinc-400 line-through font-light">
                          ₹{mrpValue}
                        </span>
                      </div>

                      {/* Add to Bag and View Buttons */}
                      <div className="grid grid-cols-1 gap-1">
                        <Link 
                          to={`/product/${product.id}`}
                          className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
