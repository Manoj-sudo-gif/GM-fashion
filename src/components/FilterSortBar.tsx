import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ArrowUpDown, 
  ChevronDown, 
  Filter, 
  X, 
  Check, 
  RotateCcw, 
  Layers, 
  Users, 
  Tag, 
  Banknote, 
  Palette, 
  Ruler, 
  Shirt, 
  Sparkles,
  SlidersHorizontal,
  BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterState {
  sort: string; // 'relevance' | 'new_arrivals' | 'price_low_high' | 'price_high_low' | 'rating' | 'discount'
  mainCategory: string; // '' | 'Top Wear' | 'Bottom Wear' | 'Inner Wear' | 'Traditional Wear'
  gender: string; // '' | 'Men' | 'Boys' | 'Kids'
  subCategories: string[]; // ['shirt', 't-shirt', 'pant', 'track pant', 'shorts', 'vest', 'gym vest', 'brief', 'trunk', 'white shirt', 'dhoti', 'set dhoti']
  advGenders: string[]; // ['Mens', 'Boys', 'Kids']
  colors: string[];
  fabrics: string[]; // ['Cotton', 'Linen', 'Polyester', 'Blend', 'Silk', 'Denim', 'Rayon']
  fits: string[]; // ['Slim', 'Regular', 'Relaxed', 'Oversized']
  patterns: string[]; // ['Solid', 'Printed', 'Striped', 'Checkered']
  sizes: string[]; // ['S', 'M', 'L', 'XL', 'XXL']
  minPrice: number;
  maxPrice: number;
  brands: string[];
}

export const initialFilterState: FilterState = {
  sort: 'relevance',
  mainCategory: '',
  gender: '',
  subCategories: [],
  advGenders: [],
  colors: [],
  fabrics: [],
  fits: [],
  patterns: [],
  sizes: [],
  minPrice: 0,
  maxPrice: 25000,
  brands: [],
};

interface FilterSortBarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  totalProductsCount: number;
}

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'new_arrivals', label: 'New Arrivals' },
  { id: 'price_low_high', label: 'Price (Low to High)' },
  { id: 'price_high_low', label: 'Price (High to Low)' },
  { id: 'rating', label: 'Rating' },
  { id: 'discount', label: 'Discount' },
];

const MAIN_CATEGORIES = [
  'Top Wear',
  'Bottom Wear',
  'Inner Wear',
  'Traditional Wear'
];

const GENDER_OPTIONS = [
  'Men',
  'Boys',
  'Kids'
];

const SUB_CATEGORIES = [
  'shirt', 't-shirt', 'pant', 'track pant', 'shorts', 
  'vest', 'gym vest', 'brief', 'trunk', 'white shirt', 'dhoti', 'set dhoti'
];

const COLOR_OPTIONS = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Black', hex: '#0f172a' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Olive', hex: '#3f6212' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Beige', hex: '#f5f5dc' },
  { name: 'Grey', hex: '#64748b' },
  { name: 'Green', hex: '#16a34a' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Cream', hex: '#fffdd0' },
  { name: 'Brown', hex: '#78350f' },
  { name: 'Gold', hex: '#d97706' }
];

const FABRIC_OPTIONS = ['Cotton', 'Linen', 'Polyester', 'Blend', 'Silk', 'Denim', 'Rayon', 'Viscose', 'Lycra', 'Modal', 'Fleece'];
const FIT_OPTIONS = ['Slim', 'Regular', 'Relaxed', 'Oversized', 'Athletic', 'Skinny'];
const PATTERN_OPTIONS = ['Solid', 'Printed', 'Striped', 'Checkered', 'Graphic', 'Floral', 'Self-Design'];
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
const BRAND_OPTIONS = ['GM Fashions', 'GM Signature', 'GM Reserve', 'GM Kids', 'GM Club', 'GM Traditional', 'GM Athleisure'];

export default function FilterSortBar({ filters, onChange, totalProductsCount }: FilterSortBarProps) {
  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<'sort' | 'category' | null>(null);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<'category' | 'gender' | 'colour' | 'fabric' | 'fit' | 'pattern' | 'size' | 'price' | 'brand'>('category');

  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: 'sort' | 'category') => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  // Toggle helpers
  const toggleArrayItem = (key: keyof FilterState, item: string) => {
    const currentList = (filters[key] as string[]) || [];
    const updated = currentList.includes(item)
      ? currentList.filter(i => i !== item)
      : [...currentList, item];
    onChange({ ...filters, [key]: updated });
  };

  // Count active filters for badge
  const activeAdvancedCount = 
    filters.subCategories.length +
    filters.advGenders.length +
    filters.colors.length +
    filters.fabrics.length +
    filters.fits.length +
    filters.patterns.length +
    filters.sizes.length +
    filters.brands.length +
    (filters.minPrice > 0 || filters.maxPrice < 25000 ? 1 : 0);

  const totalActiveCount = 
    activeAdvancedCount + 
    (filters.mainCategory ? 1 : 0) + 
    (filters.gender ? 1 : 0) +
    (filters.sort !== 'relevance' ? 1 : 0);

  const handleClearAll = () => {
    onChange(initialFilterState);
  };

  return (
    <div ref={navRef} className="sticky top-[52px] md:top-[60px] z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-2xs transition-all w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5">
        
        {/* Main Bar with 3 Options Fixed Inside a Framed Box */}
        <div className="flex items-center justify-center w-full py-0.5">
          
          {/* Fixed Framed Container for the 3 Main Options */}
          <div className="grid grid-cols-3 w-full max-w-md p-1 bg-zinc-100/90 border border-zinc-200/90 rounded-2xl shadow-2xs gap-1 sm:gap-1.5">
            {/* 1. SORT BUTTON */}
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => toggleDropdown('sort')}
                className={`w-full flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-2 sm:px-3 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold font-headline uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  filters.sort !== 'relevance' || openDropdown === 'sort'
                    ? 'bg-zinc-950 text-white shadow-sm'
                    : 'bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200/80 hover:border-zinc-300'
                }`}
              >
                <ArrowUpDown size={13} className="shrink-0" />
                <span className="truncate">
                  Sort{filters.sort !== 'relevance' ? `: ${SORT_OPTIONS.find(s => s.id === filters.sort)?.label.split(' ')[0]}` : ''}
                </span>
                <ChevronDown size={13} className={`shrink-0 transition-transform duration-200 ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
              </button>

              {/* Sort Dropdown Menu */}
              <AnimatePresence>
                {openDropdown === 'sort' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-56 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 p-2 overflow-hidden"
                  >
                    <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest px-3 py-1.5 border-b border-zinc-100">
                      Sort Products By
                    </div>
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          onChange({ ...filters, sort: opt.id });
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                          filters.sort === opt.id
                            ? 'bg-zinc-900 text-white font-bold'
                            : 'text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {filters.sort === opt.id && <Check size={14} className="text-white shrink-0" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. CATEGORY BUTTON */}
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => toggleDropdown('category')}
                className={`w-full flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-2 sm:px-3 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold font-headline uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  filters.mainCategory || openDropdown === 'category'
                    ? 'bg-zinc-950 text-white shadow-sm'
                    : 'bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200/80 hover:border-zinc-300'
                }`}
              >
                <Layers size={13} className="shrink-0" />
                <span className="truncate">{filters.mainCategory ? filters.mainCategory : 'Category'}</span>
                <ChevronDown size={13} className={`shrink-0 transition-transform duration-200 ${openDropdown === 'category' ? 'rotate-180' : ''}`} />
              </button>

              {/* Category Dropdown Menu */}
              <AnimatePresence>
                {openDropdown === 'category' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 p-2 overflow-hidden"
                  >
                    <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest px-3 py-1.5 border-b border-zinc-100">
                      Clothing Categories
                    </div>
                    <button
                      onClick={() => {
                        onChange({ ...filters, mainCategory: '' });
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                        !filters.mainCategory ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      <span>All Categories</span>
                      {!filters.mainCategory && <Check size={14} />}
                    </button>
                    {MAIN_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          onChange({ ...filters, mainCategory: cat });
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                          filters.mainCategory === cat
                            ? 'bg-zinc-900 text-white font-bold'
                            : 'text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        <span>{cat}</span>
                        {filters.mainCategory === cat && <Check size={14} className="text-white shrink-0" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. ADVANCED FILTER BUTTON */}
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => {
                  setOpenDropdown(null);
                  setIsAdvancedFilterOpen(true);
                }}
                className={`w-full flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-2 sm:px-3 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold font-headline uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeAdvancedCount > 0
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                }`}
              >
                <SlidersHorizontal size={13} className="shrink-0" />
                <span>Filter</span>
                {activeAdvancedCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-blue-600 text-[10px] font-black flex items-center justify-center shrink-0">
                    {activeAdvancedCount}
                  </span>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Active Filter Chips Row */}
        {totalActiveCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 mt-2 border-t border-zinc-100 text-xs">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold tracking-wider mr-1">Active:</span>

            {filters.sort !== 'relevance' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[11px] font-medium border border-zinc-200">
                Sort: {SORT_OPTIONS.find(s => s.id === filters.sort)?.label}
                <button onClick={() => onChange({ ...filters, sort: 'relevance' })} className="hover:text-zinc-950 cursor-pointer"><X size={12} /></button>
              </span>
            )}

            {filters.mainCategory && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[11px] font-medium border border-zinc-200">
                Cat: {filters.mainCategory}
                <button onClick={() => onChange({ ...filters, mainCategory: '' })} className="hover:text-zinc-950 cursor-pointer"><X size={12} /></button>
              </span>
            )}

            {filters.gender && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[11px] font-medium border border-zinc-200">
                Shop For: {filters.gender}
                <button onClick={() => onChange({ ...filters, gender: '' })} className="hover:text-zinc-950 cursor-pointer"><X size={12} /></button>
              </span>
            )}

            {filters.subCategories.map(sub => (
              <span key={sub} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-900 text-[11px] font-medium border border-blue-200">
                {sub}
                <button onClick={() => toggleArrayItem('subCategories', sub)} className="hover:text-blue-950 cursor-pointer"><X size={12} /></button>
              </span>
            ))}

            {filters.colors.map(color => (
              <span key={color} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[11px] font-medium border border-zinc-200">
                Color: {color}
                <button onClick={() => toggleArrayItem('colors', color)} className="hover:text-zinc-950 cursor-pointer"><X size={12} /></button>
              </span>
            ))}

            {filters.fabrics.map(fab => (
              <span key={fab} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[11px] font-medium border border-zinc-200">
                {fab}
                <button onClick={() => toggleArrayItem('fabrics', fab)} className="hover:text-zinc-950 cursor-pointer"><X size={12} /></button>
              </span>
            ))}

            {filters.fits.map(fit => (
              <span key={fit} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[11px] font-medium border border-zinc-200">
                Fit: {fit}
                <button onClick={() => toggleArrayItem('fits', fit)} className="hover:text-zinc-950 cursor-pointer"><X size={12} /></button>
              </span>
            ))}

            {filters.patterns.map(pat => (
              <span key={pat} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[11px] font-medium border border-zinc-200">
                Pattern: {pat}
                <button onClick={() => toggleArrayItem('patterns', pat)} className="hover:text-zinc-950 cursor-pointer"><X size={12} /></button>
              </span>
            ))}

            {filters.sizes.map(sz => (
              <span key={sz} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-900 text-white text-[10px] font-bold border border-zinc-900">
                Size {sz}
                <button onClick={() => toggleArrayItem('sizes', sz)} className="hover:text-zinc-300 cursor-pointer"><X size={12} /></button>
              </span>
            ))}

            {(filters.minPrice > 0 || filters.maxPrice < 25000) && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[11px] font-medium border border-zinc-200">
                ₹{filters.minPrice} - ₹{filters.maxPrice}
                <button onClick={() => onChange({ ...filters, minPrice: 0, maxPrice: 25000 })} className="hover:text-zinc-950 cursor-pointer"><X size={12} /></button>
              </span>
            )}

            <button
              onClick={handleClearAll}
              className="text-[10px] font-bold uppercase tracking-wider text-rose-600 hover:underline ml-1 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

      </div>

      {/* Advanced Filter Full Screen Page View / Overlay */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isAdvancedFilterOpen && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-0 w-full h-full h-[100dvh] max-h-[100dvh] bg-white z-[9999] flex flex-col overflow-hidden"
            >
            {/* Full Page Header */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-900 text-white shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAdvancedFilterOpen(false)}
                  className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center justify-center text-zinc-100 cursor-pointer"
                  title="Close Filter Page"
                >
                  <X size={18} />
                </button>
                <div>
                  <h2 className="text-base sm:text-lg font-black font-headline uppercase tracking-tight text-white flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-blue-400" />
                    <span>Filter & Refine</span>
                  </h2>
                  <p className="text-[10px] sm:text-xs text-zinc-300 font-medium">Refine products by category, size, color, fit & budget</p>
                </div>
              </div>

              {totalActiveCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw size={13} />
                  <span>Reset All ({totalActiveCount})</span>
                </button>
              )}
            </div>

            {/* Two Column Layout: Left Filter Category Sidebar | Right Sub-Filter Options */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* LEFT SIDEBAR TABS */}
              <div className="w-36 sm:w-52 md:w-60 bg-zinc-100/90 border-r border-zinc-200 flex flex-col shrink-0 overflow-y-auto no-scrollbar py-2">
                {[
                  { id: 'category', label: 'Category', icon: Tag, count: filters.subCategories.length },
                  { id: 'gender', label: 'Shop For', icon: Users, count: filters.advGenders.length },
                  { id: 'colour', label: 'Colour', icon: Palette, count: filters.colors.length },
                  { id: 'fabric', label: 'Fabric', icon: Shirt, count: filters.fabrics.length },
                  { id: 'fit', label: 'Fit', icon: Sparkles, count: filters.fits.length },
                  { id: 'pattern', label: 'Pattern', icon: Layers, count: filters.patterns.length },
                  { id: 'size', label: 'Size', icon: Ruler, count: filters.sizes.length },
                  { id: 'price', label: 'Price', icon: Banknote, count: (filters.minPrice > 0 || filters.maxPrice < 25000) ? 1 : 0 },
                  { id: 'brand', label: 'Brand', icon: BadgeCheck, count: filters.brands.length },
                ].map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeFilterTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveFilterTab(tab.id as any)}
                      className={`w-full flex items-center justify-between px-3.5 sm:px-5 py-3.5 text-xs sm:text-sm font-bold font-headline transition-all cursor-pointer text-left ${
                        isActive
                          ? 'bg-white text-zinc-950 font-black border-l-4 border-zinc-950 shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <IconComp size={16} className={isActive ? 'text-blue-600' : 'text-zinc-500'} />
                        <span className="truncate">{tab.label}</span>
                      </div>
                      {tab.count > 0 && (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 ml-1 shadow-2xs">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* RIGHT SUB-FILTER CONTENT PANEL */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-12 sm:pb-12 bg-white no-scrollbar">

                {/* 1. CATEGORY SUB-FILTERS */}
                {activeFilterTab === 'category' && (
                  <div className="flex flex-col gap-5 max-w-3xl">
                    <div className="border-b border-zinc-200 pb-3">
                      <h3 className="text-sm sm:text-base font-black font-headline text-zinc-900 uppercase tracking-wider">Sub Category Options</h3>
                      <p className="text-xs text-zinc-500">Filter by specific clothing type</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {SUB_CATEGORIES.map(sub => {
                        const isSelected = filters.subCategories.includes(sub);
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => toggleArrayItem('subCategories', sub)}
                            className={`px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all cursor-pointer border flex items-center justify-between ${
                              isSelected
                                ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                                : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                            }`}
                          >
                            <span>{sub}</span>
                            {isSelected && <Check size={14} className="text-white shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. SHOP FOR SUB-FILTERS */}
                {activeFilterTab === 'gender' && (
                  <div className="flex flex-col gap-5 max-w-xl">
                    <div className="border-b border-zinc-200 pb-3">
                      <h3 className="text-sm sm:text-base font-black font-headline text-zinc-900 uppercase tracking-wider">Shop For</h3>
                      <p className="text-xs text-zinc-500">Select target demographic</p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {['Mens', 'Boys', 'Kids'].map(g => {
                        const isSelected = filters.advGenders.includes(g);
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => toggleArrayItem('advGenders', g)}
                            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                                : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                            }`}
                          >
                            <span>{g}</span>
                            {isSelected && <Check size={16} className="text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. COLOUR SUB-FILTERS */}
                {activeFilterTab === 'colour' && (
                  <div className="flex flex-col gap-5 max-w-3xl">
                    <div className="border-b border-zinc-200 pb-3">
                      <h3 className="text-sm sm:text-base font-black font-headline text-zinc-900 uppercase tracking-wider">Clothing Colours</h3>
                      <p className="text-xs text-zinc-500">Select one or more available shades</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {COLOR_OPTIONS.map(c => {
                        const isSelected = filters.colors.includes(c.name);
                        return (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => toggleArrayItem('colors', c.name)}
                            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                                : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                            }`}
                          >
                            <span
                              className="w-4 h-4 rounded-full border border-zinc-300 shrink-0 shadow-2xs"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span className="truncate">{c.name}</span>
                            {isSelected && <Check size={14} className="ml-auto text-white shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. FABRIC SUB-FILTERS */}
                {activeFilterTab === 'fabric' && (
                  <div className="flex flex-col gap-5 max-w-3xl">
                    <div className="border-b border-zinc-200 pb-3">
                      <h3 className="text-sm sm:text-base font-black font-headline text-zinc-900 uppercase tracking-wider">Fabric Type</h3>
                      <p className="text-xs text-zinc-500">Select material composition</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {FABRIC_OPTIONS.map(fab => {
                        const isSelected = filters.fabrics.includes(fab);
                        return (
                          <button
                            key={fab}
                            type="button"
                            onClick={() => toggleArrayItem('fabrics', fab)}
                            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border flex items-center justify-between ${
                              isSelected
                                ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                                : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                            }`}
                          >
                            <span>{fab}</span>
                            {isSelected && <Check size={14} className="text-white shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. FIT SUB-FILTERS */}
                {activeFilterTab === 'fit' && (
                  <div className="flex flex-col gap-5 max-w-xl">
                    <div className="border-b border-zinc-200 pb-3">
                      <h3 className="text-sm sm:text-base font-black font-headline text-zinc-900 uppercase tracking-wider">Fit Type</h3>
                      <p className="text-xs text-zinc-500">Choose your silhouette preference</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {FIT_OPTIONS.map(fit => {
                        const isSelected = filters.fits.includes(fit);
                        return (
                          <button
                            key={fit}
                            type="button"
                            onClick={() => toggleArrayItem('fits', fit)}
                            className={`px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border text-center flex items-center justify-between ${
                              isSelected
                                ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                                : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                            }`}
                          >
                            <span>{fit}</span>
                            {isSelected && <Check size={14} className="text-white shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 6. PATTERN SUB-FILTERS */}
                {activeFilterTab === 'pattern' && (
                  <div className="flex flex-col gap-5 max-w-xl">
                    <div className="border-b border-zinc-200 pb-3">
                      <h3 className="text-sm sm:text-base font-black font-headline text-zinc-900 uppercase tracking-wider">Pattern</h3>
                      <p className="text-xs text-zinc-500">Filter by print design</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {PATTERN_OPTIONS.map(pat => {
                        const isSelected = filters.patterns.includes(pat);
                        return (
                          <button
                            key={pat}
                            type="button"
                            onClick={() => toggleArrayItem('patterns', pat)}
                            className={`px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border flex items-center justify-between ${
                              isSelected
                                ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                                : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                            }`}
                          >
                            <span>{pat}</span>
                            {isSelected && <Check size={14} className="text-white shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 7. SIZE SUB-FILTERS */}
                {activeFilterTab === 'size' && (
                  <div className="flex flex-col gap-5 max-w-xl">
                    <div className="border-b border-zinc-200 pb-3">
                      <h3 className="text-sm sm:text-base font-black font-headline text-zinc-900 uppercase tracking-wider">Available Sizes</h3>
                      <p className="text-xs text-zinc-500">Select standard apparel sizes</p>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {SIZE_OPTIONS.map(sz => {
                        const isSelected = filters.sizes.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => toggleArrayItem('sizes', sz)}
                            className={`h-12 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer border flex items-center justify-center ${
                              isSelected
                                ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                                : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 8. PRICE SUB-FILTERS */}
                {activeFilterTab === 'price' && (
                  <div className="flex flex-col gap-6 max-w-xl">
                    <div className="border-b border-zinc-200 pb-3">
                      <h3 className="text-sm sm:text-base font-black font-headline text-zinc-900 uppercase tracking-wider">Price Range</h3>
                      <p className="text-xs text-zinc-500">Filter within budget limits</p>
                    </div>

                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-500 uppercase">Selected Range:</span>
                        <span className="text-sm font-mono font-black text-blue-600">
                          ₹{filters.minPrice} - ₹{filters.maxPrice}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="text-[10px] font-mono text-zinc-400 block mb-1 uppercase">Min Price (₹)</label>
                          <input
                            type="number"
                            min={0}
                            max={filters.maxPrice}
                            step={100}
                            value={filters.minPrice}
                            onChange={(e) => onChange({ ...filters, minPrice: Number(e.target.value) || 0 })}
                            className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs sm:text-sm font-mono font-bold focus:outline-none focus:border-zinc-900"
                          />
                        </div>
                        <span className="text-zinc-400 font-mono mt-5">-</span>
                        <div className="flex-1">
                          <label className="text-[10px] font-mono text-zinc-400 block mb-1 uppercase">Max Price (₹)</label>
                          <input
                            type="number"
                            min={filters.minPrice}
                            max={50000}
                            step={100}
                            value={filters.maxPrice}
                            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) || 25000 })}
                            className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs sm:text-sm font-mono font-bold focus:outline-none focus:border-zinc-900"
                          />
                        </div>
                      </div>

                      {/* Interactive Range Slider */}
                      <div className="pt-2">
                        <input
                          type="range"
                          min={0}
                          max={25000}
                          step={250}
                          value={filters.maxPrice}
                          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
                          className="w-full accent-zinc-950 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-1">
                          <span>₹0</span>
                          <span>₹25,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. BRAND SUB-FILTERS */}
                {activeFilterTab === 'brand' && (
                  <div className="flex flex-col gap-5 max-w-xl">
                    <div className="border-b border-zinc-200 pb-3">
                      <h3 className="text-sm sm:text-base font-black font-headline text-zinc-900 uppercase tracking-wider">Brand / Collection</h3>
                      <p className="text-xs text-zinc-500">Filter by GM Fashions collections</p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {BRAND_OPTIONS.map(br => {
                        const isSelected = filters.brands.includes(br);
                        return (
                          <button
                            key={br}
                            type="button"
                            onClick={() => toggleArrayItem('brands', br)}
                            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                                : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                            }`}
                          >
                            <span>{br}</span>
                            {isSelected && <Check size={16} className="text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Bottom Sticky Action Footer */}
            <div className="p-4 pt-3.5 pb-6 sm:px-8 sm:py-4 border-t-2 border-purple-100 bg-white flex items-center justify-between gap-3 sm:gap-4 shrink-0 shadow-[0_-8px_25px_rgba(0,0,0,0.12)] z-20">
              <button
                type="button"
                onClick={handleClearAll}
                className="py-3 px-4 sm:px-6 rounded-xl border-2 border-zinc-300 hover:border-zinc-800 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 text-xs sm:text-sm font-black font-headline uppercase tracking-wider transition-all cursor-pointer text-center shrink-0 active:scale-95"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setIsAdvancedFilterOpen(false)}
                className="flex-1 sm:flex-initial sm:min-w-[280px] py-3.5 px-6 sm:px-8 rounded-xl bg-[#7e22ce] hover:bg-[#6b21a8] text-white text-xs sm:text-sm font-black font-headline uppercase tracking-wider transition-all cursor-pointer text-center shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95"
              >
                <span>APPLY FILTERS</span>
                <span className="bg-white/20 text-white text-[11px] px-2.5 py-0.5 rounded-full font-headline font-black tracking-wide">
                  {totalProductsCount} Products
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}

    </div>
  );
}
