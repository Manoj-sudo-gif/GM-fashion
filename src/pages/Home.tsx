import React, { useState, useEffect, useRef } from 'react';
import { Star, ArrowRight, Tag, Flame, Award, RotateCcw, Truck, ChevronRight, ChevronLeft, Shirt, Moon, Sparkles, Layers, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { allProducts } from '../data/products';

import priceWise299 from '../assets/images/pricewise_mens_299_1785321194896.jpg';
import priceWise399 from '../assets/images/pricewise_boys_399_1785321213107.jpg';
import priceWise599 from '../assets/images/pricewise_shirt_599_1785321232137.jpg';
import priceWise799 from '../assets/images/pricewise_kids_799_1785321246925.jpg';

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

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const archScrollRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollArch = (direction: 'left' | 'right') => {
    if (archScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      archScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollCategory = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="pt-0">
      {/* Hero Containerized Rounded Rectangle Carousel Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 mb-8 sm:mb-12">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:max-h-[520px] rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-black shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-zinc-100">
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



      {/* PRICE-WISE COOL COLLECTIONS (Mens, Boys & Kids Budget Curation) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-5 sm:my-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2a0845] via-[#3b0764] to-[#1a002c] p-4 sm:p-7 rounded-2xl sm:rounded-[2.2rem] border-2 border-purple-500/30 shadow-xl">
          {/* Decorative Corner Glows */}
          <div className="absolute -top-12 -left-12 w-44 h-44 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="relative z-10 text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/95 hover:bg-amber-100 text-[#3b0764] font-black text-[10px] sm:text-xs tracking-widest uppercase mb-2 shadow-md border border-amber-200 font-headline transition-all">
              <Flame size={14} className="text-[#3b0764] shrink-0 fill-[#3b0764]" />
              <span>SUPER BUDGET DEALS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase font-headline drop-shadow-sm">
              PRICE-WISE
            </h2>
            <p className="text-[10px] sm:text-xs font-black tracking-[0.25em] text-amber-300 uppercase mt-0.5">
              ✦ COOL COLLECTIONS ✦
            </p>
          </div>

          {/* 2x2 Grid on Mobile, 4-Column on Desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            
            {/* Card 1: UNDER 299 - Men's Oversized Casuals */}
            <Link 
              to="/products?category=Mens"
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 aspect-[4/4.5] bg-amber-100 flex flex-col justify-between border border-white/60"
            >
              <img 
                src={priceWise299} 
                alt="Men's Casual Wear Under 299" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
              
              {/* Badge Overlay */}
              <div className="relative z-10 p-2.5 sm:p-3.5">
                <div className="inline-block bg-white/95 backdrop-blur-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-xl shadow-md border border-white/80">
                  <span className="block text-[8px] sm:text-[10px] font-black uppercase text-amber-800 tracking-wider">
                    UNDER
                  </span>
                  <span className="block text-lg sm:text-2xl font-black text-[#8a1c84] font-headline leading-none">
                    ₹299
                  </span>
                </div>
              </div>

              {/* Bottom Arrow Action Pill */}
              <div className="relative z-10 p-2.5 sm:p-3 flex justify-between items-end">
                <span className="text-white text-[9px] sm:text-xs font-black uppercase tracking-wider drop-shadow-md">
                  MEN'S CASUALS
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-md group-hover:bg-[#8a1c84] group-hover:text-white transition-colors">
                  <ArrowRight size={15} strokeWidth={2.5} />
                </div>
              </div>
            </Link>

            {/* Card 2: UNDER 399 - Boys & Teens Trendwear */}
            <Link 
              to="/products?category=Boys"
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 aspect-[4/4.5] bg-pink-100 flex flex-col justify-between border border-white/60"
            >
              <img 
                src={priceWise399} 
                alt="Boys Fashion Under 399" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
              
              {/* Badge Overlay */}
              <div className="relative z-10 p-2.5 sm:p-3.5">
                <div className="inline-block bg-white/95 backdrop-blur-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-xl shadow-md border border-white/80">
                  <span className="block text-[8px] sm:text-[10px] font-black uppercase text-rose-800 tracking-wider">
                    UNDER
                  </span>
                  <span className="block text-lg sm:text-2xl font-black text-rose-600 font-headline leading-none">
                    ₹399
                  </span>
                </div>
              </div>

              {/* Bottom Arrow Action Pill */}
              <div className="relative z-10 p-2.5 sm:p-3 flex justify-between items-end">
                <span className="text-white text-[9px] sm:text-xs font-black uppercase tracking-wider drop-shadow-md">
                  BOYS TRENDS
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-md group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <ArrowRight size={15} strokeWidth={2.5} />
                </div>
              </div>
            </Link>

            {/* Card 3: UNDER 599 - Printed & Festive Shirts */}
            <Link 
              to="/products?category=Mens"
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 aspect-[4/4.5] bg-purple-100 flex flex-col justify-between border border-white/60"
            >
              <img 
                src={priceWise599} 
                alt="Printed Shirts Under 599" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
              
              {/* Badge Overlay */}
              <div className="relative z-10 p-2.5 sm:p-3.5">
                <div className="inline-block bg-white/95 backdrop-blur-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-xl shadow-md border border-white/80">
                  <span className="block text-[8px] sm:text-[10px] font-black uppercase text-purple-900 tracking-wider">
                    UNDER
                  </span>
                  <span className="block text-lg sm:text-2xl font-black text-purple-700 font-headline leading-none">
                    ₹599
                  </span>
                </div>
              </div>

              {/* Bottom Arrow Action Pill */}
              <div className="relative z-10 p-2.5 sm:p-3 flex justify-between items-end">
                <span className="text-white text-[9px] sm:text-xs font-black uppercase tracking-wider drop-shadow-md">
                  PRINTED SHIRTS
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-md group-hover:bg-purple-700 group-hover:text-white transition-colors">
                  <ArrowRight size={15} strokeWidth={2.5} />
                </div>
              </div>
            </Link>

            {/* Card 4: UNDER 799 - Kids & Polos Combos */}
            <Link 
              to="/products?category=Kids"
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 aspect-[4/4.5] bg-amber-50 flex flex-col justify-between border border-white/60"
            >
              <img 
                src={priceWise799} 
                alt="Kids & Polos Combos Under 799" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
              
              {/* Badge Overlay */}
              <div className="relative z-10 p-2.5 sm:p-3.5">
                <div className="inline-block bg-white/95 backdrop-blur-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-xl shadow-md border border-white/80">
                  <span className="block text-[8px] sm:text-[10px] font-black uppercase text-amber-900 tracking-wider">
                    UNDER
                  </span>
                  <span className="block text-lg sm:text-2xl font-black text-amber-700 font-headline leading-none">
                    ₹799
                  </span>
                </div>
              </div>

              {/* Bottom Arrow Action Pill */}
              <div className="relative z-10 p-2.5 sm:p-3 flex justify-between items-end">
                <span className="text-white text-[9px] sm:text-xs font-black uppercase tracking-wider drop-shadow-md">
                  KIDS & POLO COMBOS
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-md group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <ArrowRight size={15} strokeWidth={2.5} />
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* SLANTED TOP COLLECTION CAROUSEL (Above NEW COLLECTION) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-6 sm:my-10">
        <div className="mb-4 sm:mb-6 px-1 flex items-end justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] text-[#8a1c84] uppercase block mb-0.5">
              ✦ EXCLUSIVE STYLES ✦
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950 font-headline uppercase tracking-tight">
              TOP <span className="text-[#8a1c84]">COLLECTION</span>
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollCategory('left')}
              className="w-8 h-8 rounded-full bg-white text-zinc-800 border border-zinc-200 shadow-xs flex items-center justify-center hover:bg-[#8a1c84] hover:text-white hover:border-[#8a1c84] transition-all cursor-pointer"
              aria-label="Scroll left categories"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => scrollCategory('right')}
              className="w-8 h-8 rounded-full bg-white text-zinc-800 border border-zinc-200 shadow-xs flex items-center justify-center hover:bg-[#8a1c84] hover:text-white hover:border-[#8a1c84] transition-all cursor-pointer"
              aria-label="Scroll right categories"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Slanted Horizontal Track */}
        <div className="relative group">
          <div
            ref={categoryScrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-3 no-scrollbar scroll-smooth px-2 touch-pan-x"
          >
            {[
              {
                title: 'Shirt',
                tag: 'TOP WEAR',
                subTitle: 'Top Wear',
                bgColor: 'bg-gradient-to-b from-[#fff5ee] to-[#f7eae0]',
                borderColor: 'border-orange-200/90',
                badgeBg: 'bg-orange-500 text-white',
                image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600',
                link: '/products?search=shirt'
              },
              {
                title: 'Track Pant',
                tag: 'ACTIVEWEAR',
                subTitle: 'Activewear',
                bgColor: 'bg-gradient-to-b from-[#f3eefb] to-[#ebe3f8]',
                borderColor: 'border-purple-200/90',
                badgeBg: 'bg-[#8a1c84] text-white',
                image: 'https://images.unsplash.com/photo-1517438476312-10d79c07750d?auto=format&fit=crop&q=80&w=600',
                link: '/products?search=track'
              },
              {
                title: 'Cargo',
                tag: 'UTILITY',
                subTitle: 'Utility Pants',
                bgColor: 'bg-gradient-to-b from-[#faf6f0] to-[#f5efe6]',
                borderColor: 'border-amber-200/90',
                badgeBg: 'bg-amber-600 text-white',
                image: 'https://images.unsplash.com/photo-1517438476312-10d79c07750d?auto=format&fit=crop&q=80&w=600',
                link: '/products?search=cargo'
              },
              {
                title: 'Jeans',
                tag: 'DENIM',
                subTitle: 'Denim Wear',
                bgColor: 'bg-gradient-to-b from-[#f0f9ff] to-[#e0f2fe]',
                borderColor: 'border-sky-200/90',
                badgeBg: 'bg-sky-600 text-white',
                image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600',
                link: '/products?search=jean'
              },
              {
                title: 'T-Shirt',
                tag: 'CASUAL',
                subTitle: 'Casual Tops',
                bgColor: 'bg-gradient-to-b from-[#f0fdf4] to-[#dcfce7]',
                borderColor: 'border-emerald-200/90',
                badgeBg: 'bg-emerald-600 text-white',
                image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
                link: '/products?search=t-shirt'
              },
              {
                title: 'Ethnic',
                tag: 'TRADITIONAL',
                subTitle: 'Silk & Dhotis',
                bgColor: 'bg-gradient-to-b from-[#fdf2f8] to-[#fce7f3]',
                borderColor: 'border-pink-200/90',
                badgeBg: 'bg-rose-600 text-white',
                image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600',
                link: '/products?search=traditional'
              },
              {
                title: 'Inner Wear',
                tag: 'COMFORT',
                subTitle: 'Comfort Fits',
                bgColor: 'bg-gradient-to-b from-[#fefce8] to-[#fef3c7]',
                borderColor: 'border-yellow-200/90',
                badgeBg: 'bg-amber-500 text-white',
                image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600',
                link: '/products?search=inner'
              },
              {
                title: 'Kids Wear',
                tag: 'BOYS & KIDS',
                subTitle: 'Boys & Kids',
                bgColor: 'bg-gradient-to-b from-[#fff7ed] to-[#ffedd5]',
                borderColor: 'border-orange-200/90',
                badgeBg: 'bg-orange-600 text-white',
                image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=600',
                link: '/products?category=Kids'
              }
            ].map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                className="group/card shrink-0 w-[125px] sm:w-[150px] md:w-[165px] cursor-pointer"
              >
                {/* Slanted Card Frame Container */}
                <div 
                  className={`relative h-[180px] sm:h-[210px] md:h-[225px] rounded-[1.4rem] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 transform -skew-x-[6deg] group-hover/card:-translate-y-1 border border-zinc-200/80 hover:border-[#8a1c84] ${cat.bgColor}`}
                >
                  {/* Unskewed inner frame to display photo upright */}
                  <div className="absolute inset-0 transform skew-x-[6deg] scale-[1.12] flex flex-col justify-between h-full">
                    
                    {/* Model Image */}
                    <div className="relative flex-1 w-full overflow-hidden flex items-end justify-center pt-2">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover object-top group-hover/card:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Bottom Floating Card with clean readable font */}
                    <div className="p-1.5 sm:p-2 relative z-10">
                      <div className="bg-white/95 backdrop-blur-xs rounded-xl py-1.5 px-2 shadow-xs border border-zinc-100 flex items-center justify-center group-hover/card:bg-white transition-all text-center">
                        <h4 className="text-xs sm:text-sm font-bold font-sans text-zinc-900 uppercase tracking-wide group-hover/card:text-[#8a1c84] transition-colors leading-tight truncate">
                          {cat.title}
                        </h4>
                      </div>
                    </div>

                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Floating Scroll Arrow Button for Mobile */}
          <button
            onClick={() => scrollCategory('right')}
            className="sm:hidden absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white text-purple-950 border border-purple-200/80 shadow-lg flex items-center justify-center hover:bg-[#8a1c84] hover:text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Scroll right categories"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </section>

      {/* 3-COLUMN GRID EVERYDAY COMFORT SECTION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-6 sm:my-10">
        <div className="mb-4 sm:mb-6 px-1 flex items-end justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] text-[#8a1c84] uppercase block mb-0.5">
              ✦ DAILY ESSENTIALS ✦
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950 font-headline uppercase tracking-tight flex items-center gap-2">
              EVERYDAY <span className="text-[#8a1c84]">COMFORT</span>
              <span className="text-amber-500 text-lg sm:text-2xl select-none"></span>
            </h3>
          </div>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-5">
          {[
            {
              type: "BRIEF",
              brands: "Milan • Manila • Miami",
              forWho: "Men's Briefs",
              discount: "Min. 40% Off",
              bgGradient: "from-sky-100/80 via-blue-50 to-indigo-100/60",
              image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600",
              link: "/products?search=brief"
            },
            {
              type: "TRUNK",
              brands: "Seoul • Rio • Riga • Suez • Sydney",
              forWho: "Men's Trunks",
              discount: "Min. 40% Off",
              bgGradient: "from-purple-100/80 via-fuchsia-50 to-pink-100/60",
              image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600",
              link: "/products?search=trunk"
            },
            {
              type: "VEST",
              brands: "Lyon • Lakewood",
              forWho: "Men's Vests",
              discount: "Min. 35% Off",
              bgGradient: "from-amber-100/80 via-orange-50 to-amber-50",
              image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600",
              link: "/products?search=vest"
            },
            {
              type: "GYM VEST",
              brands: "Lima • Luxor • Archery",
              forWho: "Men's Active Gym Vests",
              discount: "Min. 50% Off",
              bgGradient: "from-emerald-100/80 via-teal-50 to-green-100/60",
              image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600",
              link: "/products?search=gym"
            },
            {
              type: "BOYS BRIEF",
              brands: "Milan Jr • Manila Kids",
              forWho: "Boys Briefs",
              discount: "Under ₹299",
              bgGradient: "from-rose-100/80 via-pink-50 to-rose-50",
              image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=600",
              link: "/products?category=Kids"
            },
            {
              type: "BOYS TRUNK",
              brands: "Seoul Jr • Rio Kids • Sydney Jr",
              forWho: "Boys Trunks",
              discount: "Under ₹349",
              bgGradient: "from-cyan-100/80 via-sky-50 to-blue-100/60",
              image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&q=80&w=600",
              link: "/products?category=Kids"
            },
            {
              type: "BOYS VEST",
              brands: "Lyon Kids • Lakewood Jr",
              forWho: "Boys Vests",
              discount: "Under ₹199",
              bgGradient: "from-lime-100/80 via-emerald-50 to-lime-50",
              image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&q=80&w=600",
              link: "/products?category=Kids"
            },
            {
              type: "BOYS GYM VEST",
              brands: "Lima Jr • Luxor Sports",
              forWho: "Boys Gym Vests",
              discount: "Under ₹249",
              bgGradient: "from-indigo-100/80 via-purple-50 to-blue-100/60",
              image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600",
              link: "/products?category=Kids"
            },
            {
              type: "THERMAL WEAR",
              brands: "Suez Warm • Polar Fits",
              forWho: "Winter Thermals",
              discount: "Min. 30% Off",
              bgGradient: "from-slate-100/80 via-zinc-50 to-stone-100/60",
              image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=600",
              link: "/products?search=thermal"
            }
          ].map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="w-full group block cursor-pointer"
            >
              {/* Card Frame */}
              <div className={`relative w-full aspect-[3/4.2] rounded-2xl sm:rounded-[22px] overflow-hidden bg-gradient-to-b ${item.bgGradient} shadow-xs group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 border border-zinc-200/80`}>
                
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.type}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Bottom Overlay Area with White Pill Box & Discount Text */}
                <div className="absolute inset-x-0 bottom-0 pt-8 sm:pt-12 pb-2 sm:pb-3 px-1.5 sm:px-2.5 flex flex-col items-center justify-end bg-gradient-to-t from-black/75 via-black/35 to-transparent">
                  
                  {/* Floating White Pill Box */}
                  <div className="bg-white/95 backdrop-blur-xs w-full py-1 sm:py-1.5 px-1 sm:px-2 rounded-lg sm:rounded-xl shadow-md text-center border border-white/80 transition-transform group-hover:scale-[1.02]">
                    <h4 className="font-black text-[10px] sm:text-xs md:text-sm text-zinc-950 uppercase tracking-tight leading-tight truncate">
                      {item.type}
                    </h4>
                    <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-[#8a1c84] truncate mt-0.5 tracking-tight w-full">
                      {item.brands}
                    </p>
                  </div>

                  {/* Bold Discount text below pill box */}
                  <span className="text-white font-black text-[10px] sm:text-xs md:text-sm tracking-wide mt-1 sm:mt-1.5 drop-shadow-md text-center">
                    {item.discount}
                  </span>

                </div>

              </div>
            </Link>
          ))}
        </div>
      </section>



      {/* Fashion Video Background */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:my-12">
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

      {/* TRADITIONAL & FESTIVE COLLECTION - 3-COLUMN BOUTIQUE FRAME MODEL */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-8 sm:my-14">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-10">
          <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] text-[#8a1c84] uppercase block mb-1">
            ✦ HERITAGE & FESTIVE SPECIALS ✦
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 font-headline uppercase tracking-tight">
            TRADITIONAL <span className="text-[#8a1c84]">ESSENTIALS</span>
          </h3>
          <p className="text-zinc-600 font-medium text-xs sm:text-sm max-w-md mx-auto mt-1.5">
            Handcrafted dhotis, pure silk shirts & traditional festive collections
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 via-[#8a1c84] to-amber-400 mx-auto mt-2.5 rounded-full" />
        </div>

        {/* 3-Column Vertical Boutique Grid Layout */}
        <div className="grid grid-cols-3 gap-3 sm:gap-5 md:gap-6">
          {[
            {
              title: "DHOTI",
              subtitle: "Pure Cotton • Everyday Comfort",
              tag: "BESTSELLER",
              tagBg: "bg-amber-500",
              offer: "Min. 40% Off",
              image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
              link: "/products?search=dhoti"
            },
            {
              title: "SET DHOTI",
              subtitle: "Wedding Pair • Festive Ready",
              tag: "WEDDING SPECIAL",
              tagBg: "bg-[#8a1c84]",
              offer: "Min. 35% Off",
              image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
              link: "/products?search=dhoti"
            },
            {
              title: "WHITE SHIRT",
              subtitle: "Crisp Silk & Cotton • Formal",
              tag: "MUST HAVE",
              tagBg: "bg-blue-600",
              offer: "Under ₹499",
              image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800",
              link: "/products?search=shirt"
            },
            {
              title: "POLITICAL DHOTI",
              subtitle: "Tricolor Border • Leadership",
              tag: "TRICOLOR BORDER",
              tagBg: "bg-emerald-600",
              offer: "Min. 50% Off",
              image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
              link: "/products?search=dhoti"
            },
            {
              title: "SILK SHIRTS",
              subtitle: "Royal Lustre • Festive Wear",
              tag: "PURE SILK",
              tagBg: "bg-purple-700",
              offer: "Under ₹799",
              image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800",
              link: "/products?search=silk"
            },
            {
              title: "PURE ZARI DHOTI",
              subtitle: "Handwoven Gold • Zari Border",
              tag: "GOLD ZARI",
              tagBg: "bg-amber-600",
              offer: "Min. 45% Off",
              image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=800",
              link: "/products?search=dhoti"
            },
            {
              title: "SILK KURTA",
              subtitle: "Ethnic Royal • Grand Fit",
              tag: "ROYAL FIT",
              tagBg: "bg-indigo-600",
              offer: "Min. 40% Off",
              image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=800",
              link: "/products?search=kurta"
            },
            {
              title: "CASUAL SHIRTS",
              subtitle: "Soft Linen • Trend Setter",
              tag: "TRENDING",
              tagBg: "bg-rose-600",
              offer: "Under ₹399",
              image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
              link: "/products?search=shirt"
            },
            {
              title: "KIDS DHOTI",
              subtitle: "Kids Set • Little Champs",
              tag: "KIDS SPECIAL",
              tagBg: "bg-orange-500",
              offer: "Under ₹299",
              image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&q=80&w=800",
              link: "/products?category=Kids"
            }
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="group block bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-3 border border-amber-200/80 hover:border-[#8a1c84] shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Frame with Badge Tag */}
              <div className="relative w-full aspect-[3/3.8] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                
                {/* Top Badge Tag */}
                <div className="absolute top-2 left-2">
                  <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-white ${item.tagBg} px-2 py-0.5 rounded-md shadow-xs font-headline`}>
                    {item.tag}
                  </span>
                </div>

                {/* Offer Pill Floating on Bottom Right of Image */}
                <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs text-zinc-950 font-black text-[9px] sm:text-xs px-2 py-0.5 rounded-full shadow-sm border border-amber-300/80">
                  {item.offer}
                </div>
              </div>

              {/* Bottom Details Section */}
              <div className="pt-2.5 pb-1 px-1 flex flex-col justify-between flex-grow text-center">
                <div>
                  <h4 className="font-headline font-black text-xs sm:text-base md:text-lg text-zinc-950 group-hover:text-[#8a1c84] transition-colors uppercase tracking-tight leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[9px] sm:text-xs text-zinc-500 font-medium tracking-tight truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                {/* Shop Action Button */}
                <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-center gap-1 text-[10px] sm:text-xs font-black text-[#8a1c84] uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
                  <span>SHOP NOW</span>
                  <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TOP 3 SERVICE BADGES (BELOW FASHION VIDEO) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-6 mb-2 sm:mb-3">
        <div className="relative bg-[#f7f2fd] rounded-xl sm:rounded-2xl border border-purple-200/90 py-3 px-3 sm:py-4 sm:px-6 shadow-xs overflow-hidden">
          {/* Animated Moving Lavender Border Segment */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-xl sm:rounded-2xl overflow-visible">
            <defs>
              <linearGradient id="lavenderMovingBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8a1c84" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
            <rect
              x="1"
              y="1"
              width="calc(100% - 2px)"
              height="calc(100% - 2px)"
              rx="14"
              fill="none"
              stroke="url(#lavenderMovingBeam)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-border-dash"
            />
          </svg>

          {/* Badges Grid */}
          <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-4 items-center">
            {/* Badge 1 */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-1.5 sm:gap-3 p-1">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white text-[#60359b] flex items-center justify-center shrink-0 shadow-2xs border border-purple-100 animate-gentle-shake">
                <Award size={18} className="sm:w-5 sm:h-5 text-[#60359b]" />
              </div>
              <div>
                <h4 className="text-[10px] sm:text-xs font-black text-zinc-900 tracking-tight font-headline uppercase leading-tight">
                  BEST QUALITY
                </h4>
                <p className="text-[8px] sm:text-[11px] text-purple-900/70 font-medium leading-none mt-0.5">Premium Fashion</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-1.5 sm:gap-3 p-1">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white text-[#d97706] flex items-center justify-center shrink-0 shadow-2xs border border-purple-100 animate-gentle-shake-delayed-1">
                <Tag size={18} className="sm:w-5 sm:h-5 text-[#d97706]" />
              </div>
              <div>
                <h4 className="text-[10px] sm:text-xs font-black text-zinc-900 tracking-tight font-headline uppercase leading-tight">
                  AFFORDABLE PRICES
                </h4>
                <p className="text-[8px] sm:text-[11px] text-purple-900/70 font-medium leading-none mt-0.5">Best Deals for You</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-1.5 sm:gap-3 p-1">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white text-[#059669] flex items-center justify-center shrink-0 shadow-2xs border border-purple-100 animate-gentle-shake-delayed-2">
                <RotateCcw size={18} className="sm:w-5 sm:h-5 text-[#059669]" />
              </div>
              <div>
                <h4 className="text-[10px] sm:text-xs font-black text-zinc-900 tracking-tight font-headline uppercase leading-tight">
                  EASY RETURNS
                </h4>
                <p className="text-[8px] sm:text-[11px] text-purple-900/70 font-medium leading-none mt-0.5">Hassle Free</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now - Clean Minimal Card Grid matching user's image */}
      <section className="pt-2 pb-6 sm:pt-4 sm:pb-10 px-3 sm:px-6 lg:px-8 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto">
          {/* Header - Simple Clean Title */}
          <div className="mb-4 sm:mb-6 pb-2 border-b border-zinc-200">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-zinc-900 font-headline uppercase">
              Trending Now
            </h2>
          </div>

          {/* Product Grid - Clean rounded images with subtext */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {allProducts.slice(0, 6).map((product) => {
              const badgeText = (() => {
                const tagsUpper = (product.tags || []).map((t: string) => t.toUpperCase());
                if (tagsUpper.includes('EDITORIAL') || tagsUpper.includes('COLLECTIONS')) return 'PREMIUM';
                if (tagsUpper.includes('NEW ARRIVALS') || tagsUpper.includes('NEW ARRIVAL')) return 'NEW';
                if (product.id % 2 === 0) return 'TREND';
                return 'PREMIUM';
              })();

              const categorySubtext = `${(product.gender || 'MEN').toUpperCase()} • ${(product.category || 'FASHION').toUpperCase()}`;

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group block cursor-pointer"
                >
                  {/* Image Container with rounded corners & top badge */}
                  <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 shadow-2xs">
                    {/* Top Left White Pill Badge */}
                    <span className="absolute top-2 left-2 z-10 bg-white text-zinc-900 text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded shadow-2xs uppercase tracking-wider">
                      {badgeText}
                    </span>

                    {/* Product Main Image */}
                    <img 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      alt={product.name} 
                      src={product.image}
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Product Details below Image */}
                  <div className="pt-2 sm:pt-2.5">
                    {/* Product Name (Uppercase, bold) */}
                    <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 uppercase tracking-tight truncate font-sans group-hover:text-[#60359b] transition-colors">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <p className="text-xs sm:text-sm font-semibold text-zinc-600 mt-0.5">
                      {product.price}
                    </p>

                    {/* Gender • Category Subtitle */}
                    <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 tracking-wider uppercase mt-0.5">
                      {categorySubtext}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Call to Action Button */}
          <div className="mt-8 flex justify-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-[#8a1c84] text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer group active:scale-95"
            >
              <span>EXPLORE MORE COLLECTIONS</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
