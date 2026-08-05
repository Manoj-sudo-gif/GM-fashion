import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Star, Sparkles, Flame, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { allProducts, Product } from '../data/products';
import DepartmentHeroSlider from '../components/DepartmentHeroSlider';

// The requested 20 categories for Men's 2-row horizontal scroll layout
const MEN_CATEGORIES_GRID = [
  { name: 'Shirt', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=300' },
  { name: 'T-Shirt', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=300' },
  { name: 'T-Shirt Combo', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=300' },
  { name: 'Track Pant', img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=300' },
  { name: 'Shorts', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=300' },
  { name: 'Jeans', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=300' },
  { name: 'Cotton Pant', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=300' },
  { name: 'Formal Pant', img: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=300' },
  { name: 'Vest', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=300' },
  { name: 'Gym Vest', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300' },
  { name: 'Brief', img: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80&w=300' },
  { name: 'Trunk', img: 'https://images.unsplash.com/photo-1608228079938-c6250f2aa74f?auto=format&fit=crop&q=80&w=300' },
  { name: 'Printed Brief', img: 'https://images.unsplash.com/photo-1506629082925-2368c4b2b000?auto=format&fit=crop&q=80&w=300' },
  { name: 'Printed Trunk', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=300' },
  { name: 'Colour Vest', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=300' },
  { name: 'White Shirt', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=300' },
  { name: 'Dhoti', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300' },
  { name: 'Lungi', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=300' },
  { name: 'Set Dhoti', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=300' },
  { name: 'Political Dhoti', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300' }
];

// Boys Department 2-Row Category Grid
const BOYS_CATEGORIES_GRID = [
  { name: 'Boys Shirt', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=300' },
  { name: 'Graphic Tee', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=300' },
  { name: 'Polo T-Shirt', img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=300' },
  { name: 'Track Pant', img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=300' },
  { name: 'Boys Shorts', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=300' },
  { name: 'Denim Jeans', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=300' },
  { name: 'Cotton Pant', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=300' },
  { name: 'Boys Dhoti', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300' },
  { name: 'Kurta Set', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=300' },
  { name: 'Inner Vest', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=300' },
  { name: 'Boys Brief', img: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80&w=300' },
  { name: 'Boys Trunk', img: 'https://images.unsplash.com/photo-1608228079938-c6250f2aa74f?auto=format&fit=crop&q=80&w=300' },
  { name: 'Hoodies', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=300' },
  { name: 'Nightwear', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=300' }
];

// Kids Department 2-Row Category Grid
const KIDS_CATEGORIES_GRID = [
  { name: 'Kids Tee', img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=300' },
  { name: 'Rompers', img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=300' },
  { name: 'Onesies', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=300' },
  { name: 'Soft Pants', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=300' },
  { name: 'Kids Shorts', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=300' },
  { name: 'Kids Dhoti', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300' },
  { name: 'Sleepwear', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=300' },
  { name: 'Baby Vest', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=300' },
  { name: 'Kids Socks', img: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80&w=300' },
  { name: 'Cotton Sets', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=300' },
  { name: 'Cute Caps', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=300' },
  { name: 'Dungarees', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=300' }
];

export default function CategoryDirectory() {
  const { gender } = useParams<{ gender: string }>();
  const navigate = useNavigate();

  // Map initial department from URL parameter
  const initialDept = useMemo(() => {
    if (!gender) return 'Men';
    const lower = gender.toLowerCase();
    if (lower === 'boys' || lower === 'boy') return 'Boys';
    if (lower === 'kids' || lower === 'kid') return 'Kids';
    if (lower === 'accessories' || lower === 'accessory') return 'Accessories';
    return 'Men';
  }, [gender]);

  const [activeDept, setActiveDept] = useState<string>(initialDept);
  const [selectedSubCategoryFilter, setSelectedSubCategoryFilter] = useState<string | null>(null);

  // Dynamic Categories Grid for Men, Boys, Kids (and null for Accessories)
  const currentDepartmentCategories = useMemo(() => {
    if (activeDept === 'Boys') return BOYS_CATEGORIES_GRID;
    if (activeDept === 'Kids') return KIDS_CATEGORIES_GRID;
    if (activeDept === 'Accessories') return null;
    return MEN_CATEGORIES_GRID;
  }, [activeDept]);

  useEffect(() => {
    setActiveDept(initialDept);
    setSelectedSubCategoryFilter(null);
  }, [initialDept]);

  // Wishlist and Cart synchronization
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('wishlist') || '[]';
      return JSON.parse(saved).map((p: any) => p.id);
    } catch {
      return [];
    }
  });

  const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updatedList = [...wishlist];
    let savedItems = JSON.parse(localStorage.getItem('wishlist') || '[]');

    if (wishlist.includes(product.id)) {
      updatedList = updatedList.filter(id => id !== product.id);
      savedItems = savedItems.filter((item: any) => item.id !== product.id);
    } else {
      updatedList.push(product.id);
      savedItems.push(product);
    }

    setWishlist(updatedList);
    localStorage.setItem('wishlist', JSON.stringify(savedItems));
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find((item: any) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          priceVal: product.priceVal,
          image: product.image,
          color: product.colors[0] || '#000000',
          size: product.sizes[0] || 'M',
          quantity: 1,
          brand: 'The Goodlly'
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }
  };

  // Filter products matching dynamic activeDepartment + selected Category square
  const displayProducts = useMemo(() => {
    const menBase = allProducts.filter(p => {
      const g = p.gender.toLowerCase();
      if (activeDept === 'Boys') return g === 'boy';
      if (activeDept === 'Kids') return g === 'kids' || g === 'boy' || g === 'girl';
      if (activeDept === 'Accessories') return p.category.toLowerCase().includes('accessory') || p.category.toLowerCase().includes('watch') || p.category.toLowerCase().includes('belt') || p.category.toLowerCase().includes('perfume');
      return g === 'men' || g === 'unisex' || g === 'boy';
    });

    if (!selectedSubCategoryFilter) return menBase;

    const lower = selectedSubCategoryFilter.toLowerCase();
    const matched = menBase.filter(p => {
      const pCat = p.category.toLowerCase();
      const pName = p.name.toLowerCase();
      const pTags = p.tags ? p.tags.map(t => t.toLowerCase()) : [];

      if (pCat.includes(lower) || pName.includes(lower) || pTags.some(t => t.includes(lower))) return true;

      if (lower === 'shirt' && pName.includes('shirt') && !pName.includes('t-shirt') && !pName.includes('tee')) return true;
      if (lower === 't-shirt' && (pName.includes('t-shirt') || pName.includes('tee') || pCat.includes('t-shirt'))) return true;
      if (lower === 't-shirt combo' && (pName.includes('combo') || pName.includes('pack') || pName.includes('t-shirt'))) return true;
      if (lower === 'white shirt' && (pName.includes('white') || pName.includes('shirt'))) return true;
      if (lower === 'track pant' && (pCat.includes('track') || pName.includes('jogger') || pName.includes('track'))) return true;
      if (lower === 'shorts' && (pCat.includes('short') || pName.includes('short'))) return true;
      if (lower === 'jeans' && (pName.includes('jean') || pName.includes('denim'))) return true;
      if ((lower === 'cotton pant' || lower === 'formal pant') && (pCat.includes('pant') || pName.includes('pant') || pName.includes('trouser') || pName.includes('chino'))) return true;
      if ((lower === 'vest' || lower === 'gym vest' || lower === 'colour vest') && (pCat.includes('vest') || pName.includes('vest') || pName.includes('inner'))) return true;
      if ((lower.includes('brief') || lower.includes('trunk')) && (pCat.includes('brief') || pCat.includes('trunk') || pName.includes('brief') || pName.includes('trunk') || pName.includes('inner'))) return true;
      if ((lower.includes('dhoti') || lower.includes('lungi')) && (pCat.includes('dhoti') || pName.includes('dhoti') || pName.includes('traditional'))) return true;

      return false;
    });

    return matched.length > 0 ? matched : menBase;
  }, [activeDept, selectedSubCategoryFilter]);

  // Trending items subset for horizontal frame
  const trendingProducts = useMemo(() => {
    return displayProducts.slice(0, 10);
  }, [displayProducts]);

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between pt-0">
      
      {/* Main Work Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 md:px-8 py-0 flex flex-col">
        
        {/* 1. Modern Swiping Hero Banner Slider */}
        <DepartmentHeroSlider 
          department={activeDept} 
          onSelectSubCategory={(_, subCat) => navigate(`/products?search=${encodeURIComponent(subCat)}`)} 
        />

        {/* 2. 2-Row Horizontal Scroll Grid of 1:1 Aspect Ratio Square Cards with light curve corners (5.5 items visible on mobile) */}
        {currentDepartmentCategories && (
          <div className="w-full my-3">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-900 font-headline">
                Categories
              </span>
            </div>

            <div 
              className="overflow-x-auto no-scrollbar py-1 w-full -mx-3 px-3 sm:mx-0 sm:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="grid grid-rows-2 grid-flow-col auto-cols-[calc((100vw-3.2rem)/5.5)] sm:auto-cols-[82px] md:auto-cols-[92px] gap-x-2.5 sm:gap-x-3 gap-y-2.5 sm:gap-y-3 pb-2">
                {currentDepartmentCategories.map((cat) => {
                  return (
                    <button
                      key={cat.name}
                      onClick={() => {
                        navigate(`/products?search=${encodeURIComponent(cat.name)}`);
                      }}
                      className="group flex flex-col items-center cursor-pointer text-center select-none"
                    >
                      {/* Strict 1:1 Aspect Ratio Square Frame with light curved corners */}
                      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 transition-all duration-200 border border-zinc-200/80 hover:border-zinc-950 shadow-2xs group-hover:shadow-md group-hover:scale-102">
                        <img 
                          src={cat.img} 
                          alt={cat.name} 
                          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-300 pointer-events-none"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      {/* Category Name Label */}
                      <span className="text-[10px] sm:text-[11px] font-bold mt-1 max-w-full leading-tight truncate px-0.5 text-zinc-800 group-hover:text-zinc-950 group-hover:underline font-headline">
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. Trending Collection (Gen Z Fashion Style Frame matching reference image) */}
        <div className="mt-6 pt-5 border-t border-zinc-200/80">
          <div className="mb-3.5 px-1">
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight font-headline">
              Trending Collection
            </h3>
          </div>

          {/* Horizontal Scroll Cards */}
          <div 
            className="overflow-x-auto no-scrollbar flex gap-3.5 sm:gap-4 py-1 -mx-3 px-3 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingProducts.map((product, idx) => {
              const isFavorited = wishlist.includes(product.id);
              const discountPercent = [50, 60, 40, 55, 65, 45, 70][idx % 7];
              const offerText = idx % 2 === 0 ? `Min. ${discountPercent}% Off` : `From ${product.price}`;

              return (
                <Link
                  key={`trending-${product.id}`}
                  to={`/product/${product.id}`}
                  className="group flex flex-col cursor-pointer rounded-[18px] bg-gradient-to-b from-amber-200/90 via-sky-200/70 to-sky-300 p-[2px] shadow-2xs hover:shadow-md transition-all duration-300 min-w-[125px] sm:min-w-[150px] max-w-[160px] shrink-0"
                >
                  <div className="bg-white rounded-[16px] overflow-hidden flex flex-col h-full">
                    {/* Top Product Image */}
                    <div className="relative aspect-[1/1] w-full overflow-hidden bg-zinc-100">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        onClick={(e) => handleToggleWishlist(product, e)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs shadow-xs flex items-center justify-center text-zinc-800 hover:bg-white hover:scale-105 transition-all cursor-pointer z-10"
                        title="Add to Wishlist"
                      >
                        <Heart size={11} className={isFavorited ? 'text-rose-500 fill-rose-500' : 'text-zinc-600'} />
                      </button>
                    </div>

                    {/* Title Banner (White Box) */}
                    <div className="bg-white px-2 py-1.5 text-center border-t border-zinc-100">
                      <h4 className="text-[11px] sm:text-xs font-semibold text-zinc-900 truncate tracking-tight font-body">
                        {product.name}
                      </h4>
                    </div>

                    {/* Bottom Offer Banner (Sky Blue / Cyan Banner matching reference image) */}
                    <div className="bg-gradient-to-r from-sky-200 via-sky-300 to-sky-200 py-1.5 px-2 text-center">
                      <span className="text-[11px] sm:text-xs font-black text-sky-950 tracking-tight font-headline block truncate">
                        {offerText}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 4. Our Collection Section (Vertical Products Grid) */}
        <div className="mt-8 pt-5 border-t border-zinc-200/80 flex-1">
          <div className="text-center mb-6 px-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium uppercase tracking-widest text-zinc-950 font-editorial">
              OUR COLLECTION
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 pb-12">
            {displayProducts.map((product) => {
              const isFavorited = wishlist.includes(product.id);

              return (
                <Link 
                  key={`foryou-${product.id}`} 
                  to={`/product/${product.id}`} 
                  className="group flex flex-col gap-2 cursor-pointer bg-white p-2 rounded-2xl border border-zinc-100 shadow-2xs hover:shadow-md transition-all duration-300"
                >
                  {/* Square image card */}
                  <div className="relative aspect-square w-full overflow-hidden bg-zinc-50 rounded-xl border border-zinc-200/50">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleToggleWishlist(product, e)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs shadow-xs flex items-center justify-center text-zinc-800 hover:bg-white hover:scale-105 transition-all cursor-pointer z-10"
                    >
                      <Heart 
                        size={13} 
                        className={isFavorited ? 'text-rose-500 fill-rose-500' : 'text-zinc-600'} 
                      />
                    </button>

                    {/* Tag badge */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                      <span className="bg-zinc-950/90 text-white text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded shadow-xs">
                        GM Fashions
                      </span>
                    </div>

                    {/* Quick Add overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        className="bg-zinc-950 text-white px-3.5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-zinc-800 cursor-pointer flex items-center gap-1"
                      >
                        <ShoppingBag size={11} /> Add to Bag
                      </button>
                    </div>
                  </div>

                  {/* Product details */}
                  <div className="flex flex-col gap-0.5 min-w-0 px-1 pt-1">
                    <div className="flex justify-between items-center gap-1">
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-wider truncate">
                        {product.brand || 'GM Fashions'}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500 text-[9px] font-bold">
                        <Star size={9} className="fill-amber-500 text-amber-500" />
                        <span>4.8</span>
                      </div>
                    </div>
                    <h4 className="text-xs font-black text-zinc-900 tracking-tight font-headline uppercase truncate group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-black text-zinc-950">
                        {product.price}
                      </span>
                      <span className="text-[9px] text-zinc-400 line-through font-medium">
                        ₹{product.priceVal ? Math.round(product.priceVal * 1.5) : 1999}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Explore More Button */}
          <div className="mt-10 mb-12 text-center flex justify-center">
            <button
              onClick={() => {
                const targetCategory = selectedSubCategoryFilter || activeDept.toLowerCase();
                navigate(`/products?category=${encodeURIComponent(targetCategory)}`);
              }}
              className="group bg-zinc-950 hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-headline font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 cursor-pointer flex items-center justify-center gap-2.5 border border-zinc-800 hover:border-blue-500"
            >
              <span>Explore More</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

      </div>

    </main>
  );
}
