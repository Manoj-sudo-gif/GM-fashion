import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Package, ArrowLeft, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Sparkles, AlertCircle, Share2, Ruler, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { allProducts } from '../data/products';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find product dynamically from default and custom products
  const product = React.useMemo(() => {
    const custom = JSON.parse(localStorage.getItem('custom_products') || '[]');
    const merged = [...allProducts, ...custom];
    return merged.find(p => p.id === Number(id)) || allProducts[0];
  }, [id]);

  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '#000000');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'cart' | 'buy' | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isHeartBouncing, setIsHeartBouncing] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping'>('details');

  // List of high-res fallback images if product.images is empty
  const imagesFeed = product.images && product.images.length > 0 
    ? product.images 
    : [product.image, product.image, product.image];

  // Derive premium brand name
  const brandName = React.useMemo(() => {
    const shopBrands = ['AIM', 'ULTRA', 'PRIME ULTRA LINEN', 'EASY CARE', 'WARRIOR', 'MINISTER'];
    if (product.brand) {
      const uppercaseBrand = product.brand.toUpperCase();
      if (shopBrands.includes(uppercaseBrand)) return uppercaseBrand;
    }
    return shopBrands[product.id % shopBrands.length];
  }, [product]);

  // Format color hex into readable display color names
  const getColorDisplayName = (colorStr: string) => {
    if (!colorStr) return 'Cream';
    const lower = colorStr.toLowerCase();
    if (lower.includes('#ffffff') || lower.includes('white')) return 'White';
    if (lower.includes('#000000') || lower.includes('black')) return 'Black';
    if (lower.includes('#78350f') || lower.includes('brown')) return 'Dark Brown';
    if (lower.includes('#fef3c7') || lower.includes('sandal') || lower.includes('cream')) return 'Cream / Sandal';
    if (lower.includes('#3b82f6') || lower.includes('blue')) return 'Navy Blue';
    if (lower.includes('#22c55e') || lower.includes('green')) return 'Emerald Green';
    if (lower.includes('#ef4444') || lower.includes('red')) return 'Crimson Red';
    if (lower.includes('#eab308') || lower.includes('yellow')) return 'Sandal / Yellow';
    if (lower.includes('#ec4899') || lower.includes('pink')) return 'Rose Pink';
    if (colorStr.startsWith('#')) return 'Cream';
    return colorStr;
  };

  // Derive product type (e.g., "Men's Shirt", "Men's Pant")
  const productType = React.useMemo(() => {
    const name = (product.name || '').toLowerCase();
    const cat = (product.category || '').toLowerCase();
    
    if (name.includes('shirt') || cat.includes('shirt')) {
      if (name.includes('t-shirt') || name.includes('tee')) return "Men's T-Shirt";
      return "Men's Shirt";
    }
    if (name.includes('pant') || name.includes('trouser') || cat.includes('pant')) {
      return "Men's Pant";
    }
    if (name.includes('jeans')) return "Men's Jeans";
    if (name.includes('kurta') || cat.includes('ethnic')) return "Men's Kurta";
    if (cat) {
      return `Men's ${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
    }
    return "Men's Apparel";
  }, [product]);

  // Dynamic one-line description
  const oneLineDescription = React.useMemo(() => {
    const cat = (product.category || 'Apparel').toLowerCase();
    return `Premium men's 100% organic cotton ${cat} tailored for a modern sharp fit.`;
  }, [product]);

  // Permanent top-left badge text
  const badgeText = React.useMemo(() => {
    if (product.tags && product.tags.length > 0) {
      const t = product.tags[0].toUpperCase();
      if (t === 'NEW ARRIVALS' || t === 'NEW ARRIVAL') return 'NEW';
      return t;
    }
    if (product.id % 3 === 0) return 'TREND';
    if (product.id % 3 === 1) return 'NEW';
    return 'PREMIUM';
  }, [product]);

  // Scroll to top and sync like state on load or product change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (product) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const isLiked = wishlist.some((item: any) => item.id === product.id);
      setLiked(isLiked);
    }
  }, [id, product]);

  const toggleLike = () => {
    // Fire the playful heart bounce animation
    setIsHeartBouncing(true);
    setTimeout(() => {
      setIsHeartBouncing(false);
    }, 600);

    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isLiked = wishlist.some((item: any) => item.id === product.id);
    
    let updatedWishlist;
    if (isLiked) {
      updatedWishlist = wishlist.filter((item: any) => item.id !== product.id);
      setLiked(false);
    } else {
      updatedWishlist = [...wishlist, {
        id: product.id,
        name: product.name,
        price: product.price,
        priceVal: product.priceVal,
        image: product.image,
        category: product.category,
        gender: product.gender
      }];
      setLiked(true);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    // Trigger storage event so navbar and components update in real-time
    window.dispatchEvent(new Event('storage'));
  };

  const handleShare = () => {
    if (product) {
      try {
        const existing = JSON.parse(localStorage.getItem('gm_shared_products') || '[]');
        const formattedPrice = typeof product.price === 'number' ? `₹ ${product.price.toLocaleString('en-IN')}` : product.price;
        const newSharedItem = {
          id: product.id,
          name: product.name,
          price: formattedPrice || '₹ 0',
          image: product.image,
          category: product.category,
          gender: product.gender,
          sharedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        const filtered = Array.isArray(existing) ? existing.filter((item: any) => item.id !== product.id) : [];
        const updated = [newSharedItem, ...filtered];
        localStorage.setItem('gm_shared_products', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error('Error saving shared product:', e);
      }
    }

    if (navigator.share) {
      navigator.share({
        title: product?.name || 'GM Fashions',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  // Update selection if product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] || '#000000');
      setSelectedSize('');
      setIsAdded(false);
      setActiveImageIdx(0);
      setShowSizeModal(false);
    }
  }, [product]);

  // Execute actual cart addition once size is confirmed
  const executeAddToCart = (sizeToUse: string) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      priceVal: product.priceVal,
      image: product.image,
      color: selectedColor,
      size: sizeToUse,
      quantity: 1
    };

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIdx = existingCart.findIndex((item: any) => item.id === product.id && item.size === sizeToUse);
    
    if (existingItemIdx > -1) {
      existingCart[existingItemIdx].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('storage'));
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
  };

  // Handle Add to Bag button click
  const handleAddToBag = () => {
    if (!selectedSize) {
      setPendingAction('cart');
      setShowSizeModal(true);
      return;
    }
    executeAddToCart(selectedSize);
  };

  // Execute direct Buy Now for single product checkout
  const executeBuyNow = (sizeToUse: string) => {
    const buyItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      priceVal: product.priceVal,
      image: product.image,
      color: selectedColor,
      size: sizeToUse,
      quantity: 1,
      brand: 'The Goodlly'
    };
    sessionStorage.setItem('direct_buy_item', JSON.stringify(buyItem));
    navigate('/checkout', { state: { buyNowItem: buyItem } });
  };

  // Handle Buy Now button click
  const handleBuyNow = () => {
    if (!selectedSize) {
      setPendingAction('buy');
      setShowSizeModal(true);
      return;
    }
    executeBuyNow(selectedSize);
  };

  // Select size from modal prompt
  const handleSelectSizeFromModal = (size: string) => {
    setSelectedSize(size);
    setShowSizeModal(false);
    if (pendingAction === 'buy') {
      executeBuyNow(size);
    } else if (pendingAction === 'cart') {
      executeAddToCart(size);
    }
    setPendingAction(null);
  };

  // Get similar products
  const mergedProductsList = React.useMemo(() => {
    const custom = JSON.parse(localStorage.getItem('custom_products') || '[]');
    return [...allProducts, ...custom];
  }, []);

  const similarProducts = React.useMemo(() => {
    const sameCategory = mergedProductsList.filter(
      p => p.category === product.category && p.id !== product.id
    );
    if (sameCategory.length >= 4) return sameCategory.slice(0, 4);
    const fallbacks = mergedProductsList.filter(p => p.id !== product.id);
    return [...sameCategory, ...fallbacks].slice(0, 4);
  }, [mergedProductsList, product]);

  return (
    <main className="min-h-screen bg-zinc-50/50 pb-36 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        
        {/* Split Screen Container */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* LEFT PANEL: 3:3 ASPECT RATIO HORIZONTAL DRAG SLIDER */}
          <div className="w-full lg:w-[48%] flex flex-col gap-4">
            <div className="relative w-full aspect-square bg-white rounded-2xl overflow-hidden border border-zinc-200/80 shadow-xs group touch-pan-y select-none">
              {/* Slideable Main Image with Drag/Swipe capability */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={activeImageIdx}
                  src={imagesFeed[activeImageIdx]}
                  alt={`${product.name} View ${activeImageIdx + 1}`}
                  draggable={false}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    const swipeThreshold = 30;
                    if (info.offset.x < -swipeThreshold) {
                      // Swiped left -> Next Image
                      setActiveImageIdx((prev) => (prev + 1) % imagesFeed.length);
                    } else if (info.offset.x > swipeThreshold) {
                      // Swiped right -> Prev Image
                      setActiveImageIdx((prev) => (prev - 1 + imagesFeed.length) % imagesFeed.length);
                    }
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="w-full h-full object-cover select-none cursor-grab active:cursor-grabbing"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Permanent Top Left Badge - Touches corner frame */}
              <div className="absolute top-1 left-1 z-20 pointer-events-none">
                <span className="bg-white/95 text-zinc-950 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-tl-lg rounded-br-md shadow-xs border border-zinc-200/80">
                  {badgeText}
                </span>
              </div>

              {/* Top Right Overlay Actions: Wishlist Heart & Share Icon below it - Smaller size */}
              <div className="absolute top-2.5 right-2.5 z-20 flex flex-col gap-1.5">
                {/* Wishlist Button */}
                <motion.button
                  id="product-wishlist-heart"
                  onClick={toggleLike}
                  animate={isHeartBouncing ? { scale: [1, 1.4, 0.85, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  whileTap={{ scale: 0.85 }}
                  className="p-1.5 bg-white/90 backdrop-blur-md hover:bg-white text-zinc-900 rounded-full shadow-xs border border-zinc-200/60 transition-colors cursor-pointer flex items-center justify-center"
                  title="Save to Wishlist"
                >
                  <Heart
                    size={15}
                    fill={liked ? '#ef4444' : 'none'}
                    stroke={liked ? '#ef4444' : 'currentColor'}
                    className={liked ? 'text-red-500' : 'text-zinc-700'}
                  />
                </motion.button>

                {/* Share Button */}
                <motion.button
                  onClick={handleShare}
                  whileTap={{ scale: 0.85 }}
                  className="p-1.5 bg-white/90 backdrop-blur-md hover:bg-white text-zinc-900 rounded-full shadow-xs border border-zinc-200/60 transition-colors cursor-pointer flex items-center justify-center"
                  title="Share Product"
                >
                  <Share2 size={15} className="text-zinc-700" />
                </motion.button>
              </div>

              {/* Share Toast Feedback */}
              <AnimatePresence>
                {showShareToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-24 right-2.5 z-30 bg-zinc-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg tracking-wide"
                  >
                    Link copied!
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Overlay Bottom Pagination Dots */}
              {imagesFeed.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-zinc-900/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  {imagesFeed.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`transition-all rounded-full cursor-pointer ${
                        activeImageIdx === idx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: STICKY PURCHASE PANEL */}
          <div className="w-full lg:w-[50%] lg:sticky lg:top-24 bg-white border border-zinc-200/70 p-4 sm:p-6 rounded-3xl shadow-xs space-y-3.5">
            
            {/* 1. BRAND NAME & COLOR SHADES WITH GAPS */}
            <div className="flex items-center justify-between gap-3 pb-0.5">
              <span className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-widest font-headline">
                {brandName}
              </span>

              {/* Color Circles / Shades with gaps */}
              {product.colors && product.colors.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Shades:</span>
                  <div className="flex items-center gap-1.5">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        className={`w-5 h-5 rounded-full border border-zinc-300 shadow-xs transition-all cursor-pointer relative ${
                          selectedColor === color ? 'ring-2 ring-zinc-950 ring-offset-1 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color }}
                        title={getColorDisplayName(color)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. PRODUCT TYPE & ONE-LINE DESCRIPTION */}
            <div className="space-y-0.5">
              <h1 className="text-sm sm:text-base font-black text-zinc-900 tracking-tight uppercase">
                {productType}
              </h1>
              <p className="text-[11px] text-zinc-500 font-medium leading-tight">
                {oneLineDescription}
              </p>
            </div>

            {/* 3. RATING */}
            <div className="flex items-center gap-2">
              <div className="bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                4.5 <Star size={10} className="fill-emerald-700 text-emerald-700" />
              </div>
              <span className="text-zinc-400 text-[11px] font-medium">| 114 Verified Buyers Ratings</span>
            </div>

            {/* 4. PRICE */}
            <div className="py-2.5 border-y border-zinc-100 flex flex-col gap-0.5">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-2xl font-black text-zinc-950 font-headline tracking-tight">
                  {product.price}
                </span>
                <span className="text-xs text-zinc-400 line-through font-light">
                  ₹{Math.round(product.priceVal * 2)}
                </span>
                <span className="text-[10px] bg-rose-50 text-rose-600 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Flat 50% OFF
                </span>
              </div>
              <div className="text-[10px] text-zinc-400 font-medium tracking-wide">
                Price inclusive of all taxes
              </div>
            </div>

            {/* 5. SIZE */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-extrabold block">
                  Select Size
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs scale-[0.98]'
                          : 'bg-zinc-50/50 border-zinc-200 text-zinc-800 hover:border-zinc-900 hover:bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 6. PRODETAILS FRAME (2-COLUMN GRID) */}
            <div className="border border-zinc-200/80 rounded-xl p-3 bg-zinc-50/50 space-y-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-zinc-200/60">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-950 font-headline">
                  Prodetails
                </span>
                <span className="h-1 w-1 bg-zinc-400 rounded-full"></span>
                <span className="text-[10px] text-zinc-400 font-mono uppercase">Product Specifications</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Colour */}
                <div className="bg-white p-2 rounded-lg border border-zinc-200/60 flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-400">Colour</span>
                  <span className="font-semibold text-zinc-900 text-[11px] capitalize flex items-center gap-1.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full border border-zinc-300 inline-block shrink-0" 
                      style={{ backgroundColor: selectedColor || (product.colors && product.colors[0]) || '#18181b' }}
                    />
                    {getColorDisplayName(selectedColor)}
                  </span>
                </div>

                {/* Fabric */}
                <div className="bg-white p-2 rounded-lg border border-zinc-200/60 flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-400">Fabric</span>
                  <span className="font-semibold text-zinc-900 text-[11px]">100% Certified Organic Cotton</span>
                </div>

                {/* Fit */}
                <div className="bg-white p-2 rounded-lg border border-zinc-200/60 flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-400">Fit</span>
                  <span className="font-semibold text-zinc-900 text-[11px]">Regular / Modern Fit</span>
                </div>

                {/* Package Contain */}
                <div className="bg-white p-2 rounded-lg border border-zinc-200/60 flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-400">Package Contain</span>
                  <span className="font-semibold text-zinc-900 text-[11px]">1 Pcs</span>
                </div>

                {/* Size */}
                <div className="bg-white p-2 rounded-lg border border-zinc-200/60 flex flex-col gap-0.5 col-span-2 sm:col-span-1">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-400">Size</span>
                  <span className="font-semibold text-zinc-900 text-[11px]">{selectedSize ? selectedSize : 'S, M, L, XL, XXL'}</span>
                </div>

                {/* Product Description */}
                <div className="col-span-2 bg-white p-2 rounded-lg border border-zinc-200/60 flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-400">Product Description</span>
                  <p className="text-zinc-700 text-[11px] leading-relaxed">
                    {product.details || 'Precision engineered and constructed for maximum visual poise and everyday comfort. Sourced ethically with sustainable quality.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Security & Shipping Icons */}
            <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-zinc-100">
              <div className="flex items-center gap-2 text-zinc-500">
                <Truck size={14} className="text-zinc-400" />
                <span className="text-[9px] font-extrabold uppercase tracking-widest">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <RefreshCw size={14} className="text-zinc-400" />
                <span className="text-[9px] font-extrabold uppercase tracking-widest">10 Days Exchange</span>
              </div>
            </div>
          </div>

        </div>

        {/* SIMILAR PRODUCTS SECTION */}
        {similarProducts.length > 0 && (
          <div className="mt-8 sm:mt-12 pt-6 border-t border-zinc-200/80">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm sm:text-base font-black text-zinc-950 uppercase tracking-wider font-headline">
                Similar Products
              </h2>
              <Link
                to="/products"
                className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-500 hover:text-zinc-950 transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {similarProducts.map(item => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group bg-white rounded-xl border border-zinc-200/70 p-2.5 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-zinc-100 mb-2 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-zinc-400 block tracking-wider">
                      {item.brand || 'AIM'}
                    </span>
                    <h3 className="text-xs font-bold text-zinc-900 truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-xs font-black text-zinc-950">
                        {item.price}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded">
                        4.5 ★
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Fixed Bottom Action Bar */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/80 p-3 sm:py-3.5 sm:px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left Corner: Add to Cart */}
          <button
            onClick={handleAddToBag}
            className={`flex-1 py-3.5 sm:py-4 px-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] ${
              isAdded 
                ? 'bg-emerald-600 text-white' 
                : 'bg-white text-zinc-900 border-2 border-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <ShoppingBag size={16} className={isAdded ? 'animate-bounce' : ''} />
            <span>{isAdded ? 'Added to Cart!' : 'Add to Cart'}</span>
          </button>

          {/* Right Corner: Buy Now */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 py-3.5 sm:py-4 px-4 bg-zinc-950 hover:bg-zinc-900 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98]"
          >
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* SIZE VALIDATION PROMPT MODAL */}
      <AnimatePresence>
        {showSizeModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setShowSizeModal(false)}
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-zinc-100 z-10 text-center space-y-4"
            >
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 p-1 rounded-full hover:bg-zinc-100 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <AlertCircle size={24} />
              </div>

              <div>
                <h3 className="text-base font-black text-zinc-950 font-headline uppercase tracking-wider">
                  Select a Size
                </h3>
                <p className="text-zinc-500 text-xs font-medium mt-1 leading-relaxed">
                  Please choose your preferred size before proceeding with {pendingAction === 'buy' ? 'Buy Now' : 'Add to Cart'}.
                </p>
              </div>

              {/* Size Options Buttons */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {product.sizes && product.sizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSelectSizeFromModal(size)}
                    className="py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 text-zinc-900 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xs hover:scale-105"
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSizeModal(false)}
                  className="w-full text-zinc-500 hover:text-zinc-900 text-xs font-extrabold uppercase tracking-widest py-2"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
