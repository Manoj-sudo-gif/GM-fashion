import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  discount: string;
  image: string;
  badge: string;
  subCategoryTarget?: string;
  ctaText: string;
  gradient: string;
}

const DEPARTMENT_SLIDES: Record<string, Slide[]> = {
  Men: [
    {
      id: 1,
      tag: "SUMMER SPECIAL",
      title: "PREMIUM LINEN & CASUAL SHIRTS",
      subtitle: "Crafted for maximum comfort & breathable elegance",
      discount: "FLAT 40% OFF",
      image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=1200",
      badge: "BESTSELLER",
      subCategoryTarget: "Shirt",
      ctaText: "SHOP SHIRTS",
      gradient: "from-black/80 via-black/40 to-transparent"
    },
    {
      id: 2,
      tag: "ETHNIC & FESTIVE EDITION",
      title: "VAIBHAVAM DHOTI & KURTA SETS",
      subtitle: "Traditional South Indian heritage wear with velcro ease",
      discount: "BUY 1 GET 1 FREE",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1200",
      badge: "FESTIVE DEAL",
      subCategoryTarget: "Set Dhoti",
      ctaText: "EXPLORE TRADITIONAL",
      gradient: "from-amber-950/85 via-black/40 to-transparent"
    },
    {
      id: 3,
      tag: "NEW ARRIVALS 2026",
      title: "STREETWEAR TEES & DENIM JEANS",
      subtitle: "Heavyweight cotton graphic tees & flex fit denims",
      discount: "UNDER ₹799",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200",
      badge: "TRENDING NOW",
      subCategoryTarget: "T-Shirt",
      ctaText: "UPGRADE STYLE",
      gradient: "from-slate-950/85 via-black/40 to-transparent"
    }
  ],
  Boys: [
    {
      id: 1,
      tag: "JUNIOR STYLE FEST",
      title: "COOL GRAPHIC TEES & HOODIES",
      subtitle: "Vibrant colors, durable fabrics for active play",
      discount: "MIN 40% OFF",
      image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=1200",
      badge: "KIDS FAVORITE",
      subCategoryTarget: "T-Shirt",
      ctaText: "SHOP BOYS TEES",
      gradient: "from-blue-950/85 via-black/40 to-transparent"
    },
    {
      id: 2,
      tag: "LITTLE CHAMP TRADITIONAL",
      title: "BOYS ETHNIC DHOTI & KURTAS",
      subtitle: "Perfect festive outfits for poojas & celebrations",
      discount: "FLAT 30% OFF",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1200",
      badge: "FESTIVE COLLECTION",
      subCategoryTarget: "Set Dhoti",
      ctaText: "VIEW ETHNIC WEAR",
      gradient: "from-emerald-950/85 via-black/40 to-transparent"
    },
    {
      id: 3,
      tag: "PLAYTIME READY",
      title: "CARGO SHORTS & TRACK PANTS",
      subtitle: "All-day soft stretch cotton bottoms",
      discount: "BUY 2 FOR ₹699",
      image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=1200",
      badge: "HOT DEAL",
      subCategoryTarget: "Shorts",
      ctaText: "DISCOVER BOTTOMS",
      gradient: "from-zinc-950/85 via-black/40 to-transparent"
    }
  ],
  Kids: [
    {
      id: 1,
      tag: "BABY & TODDLER CARE",
      title: "ORGANIC COTTON ONESIES & ROMPERS",
      subtitle: "100% hypo-allergenic soft baby garments",
      discount: "UP TO 50% OFF",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200",
      badge: "NEWBORN ESSENTIAL",
      subCategoryTarget: "Rompers & Onesies",
      ctaText: "SHOP BABY WEAR",
      gradient: "from-rose-950/85 via-black/40 to-transparent"
    },
    {
      id: 2,
      tag: "CUTE MINI FESTIVE",
      title: "TRADITIONAL KIDS DHOTI & KURTAS",
      subtitle: "Adorable heritage festive wear for toddlers",
      discount: "SPECIAL OFFERS",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1200",
      badge: "VERY POPULAR",
      subCategoryTarget: "Kids Dhoti",
      ctaText: "EXPLORE ETHNIC",
      gradient: "from-purple-950/85 via-black/40 to-transparent"
    },
    {
      id: 3,
      tag: "NIGHT & PLAYTIME",
      title: "SOFT COTTON SLEEPWEAR & SOCKS",
      subtitle: "Cozy sleep suits & grip socks for toddlers",
      discount: "BUY 3 GET 1 FREE",
      image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=1200",
      badge: "COMFO CHOICE",
      subCategoryTarget: "Soft Pants",
      ctaText: "SHOP SLEEPWEAR",
      gradient: "from-indigo-950/85 via-black/40 to-transparent"
    }
  ],
  Accessories: [
    {
      id: 1,
      tag: "LUXURY FRAGRANCE",
      title: "LONG-LASTING EAU DE PARFUMS & SPRAYS",
      subtitle: "Signature woody, oceanic & spicy masculine scents",
      discount: "FLAT 35% OFF",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200",
      badge: "TOP SELLER",
      subCategoryTarget: "Perfume & Cologne",
      ctaText: "SHOP PERFUMES",
      gradient: "from-amber-950/90 via-black/50 to-transparent"
    },
    {
      id: 2,
      tag: "GENUINE LEATHER",
      title: "HANDCRAFTED WALLETS, BELTS & CARDS",
      subtitle: "100% genuine top-grain leather accessories",
      discount: "SPECIAL COMBO @ ₹899",
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=1200",
      badge: "PREMIUM QUALITY",
      subCategoryTarget: "Men Wallets",
      ctaText: "SHOP WALLETS & BELTS",
      gradient: "from-stone-950/90 via-black/50 to-transparent"
    },
    {
      id: 3,
      tag: "FORMAL ESSENTIALS",
      title: "COTTON KERCHIEFS, TIES & CUFFLINKS",
      subtitle: "Soft woven cotton handkerchiefs & executive details",
      discount: "BUY 1 GET 1 FREE",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1200",
      badge: "ESSENTIAL",
      subCategoryTarget: "Kerchiefs & Handkerchiefs",
      ctaText: "EXPLORE ACCESSORIES",
      gradient: "from-cyan-950/90 via-black/50 to-transparent"
    }
  ]
};

interface DepartmentHeroSliderProps {
  department: string;
  onSelectSubCategory?: (parentGroup: string, subCategory: string) => void;
}

export default function DepartmentHeroSlider({ department, onSelectSubCategory }: DepartmentHeroSliderProps) {
  const slides = DEPARTMENT_SLIDES[department] || DEPARTMENT_SLIDES.Men;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide every 4 seconds
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    // Reset index on department change
    setCurrentIndex(0);
  }, [department]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const currentSlide = slides[currentIndex];

  return (
    <div 
      className="relative w-full rounded-2xl overflow-hidden shadow-md group border border-zinc-200/80 my-2 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Aspect Ratio Container (16:9 on mobile, slightly wider on desktop) */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] bg-zinc-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${department}-${currentSlide.id}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image */}
            <img 
              src={currentSlide.image} 
              alt={currentSlide.title} 
              className="w-full h-full object-cover object-center"
            />

            {/* Gradient Overlay for Text Legibility */}
            <div className={`absolute inset-0 bg-gradient-to-r ${currentSlide.gradient} flex flex-col justify-end p-4 sm:p-6 md:p-8`} />

            {/* Slide Content */}
            <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-center items-start z-10 max-w-xl">
              {/* Badge & Offer Tag */}
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                  <Sparkles size={11} />
                  {currentSlide.badge}
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950">
                  <Tag size={11} />
                  {currentSlide.discount}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-sm sm:text-lg md:text-2xl font-black font-headline text-white tracking-wide uppercase leading-tight drop-shadow-sm">
                {currentSlide.title}
              </h2>

              {/* Subtitle */}
              <p className="text-[10px] sm:text-xs md:text-sm text-zinc-200 mt-1 line-clamp-1 font-medium">
                {currentSlide.subtitle}
              </p>

              {/* CTA Button */}
              {currentSlide.subCategoryTarget && onSelectSubCategory && (
                <button
                  onClick={() => onSelectSubCategory('Top Wear', currentSlide.subCategoryTarget!)}
                  className="mt-2.5 sm:mt-4 inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 bg-white hover:bg-zinc-100 text-zinc-950 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                >
                  {currentSlide.ctaText}
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-20 border border-white/20"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-20 border border-white/20"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Slide Pagination Dots */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
