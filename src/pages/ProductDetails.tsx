import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Package, ArrowLeft, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Sparkles, AlertCircle, Share2, Ruler } from 'lucide-react';
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
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [isAdded, setIsAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isHeartBouncing, setIsHeartBouncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping'>('details');

  // List of high-res fallback images if product.images is empty
  const imagesFeed = product.images && product.images.length > 0 
    ? product.images 
    : [product.image, product.image, product.image];

  // Sync like state on load or product change
  useEffect(() => {
    if (product) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const isLiked = wishlist.some((item: any) => item.id === product.id);
      setLiked(isLiked);
    }
  }, [product]);

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

  // Update selection if product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] || '#000000');
      setSelectedSize(product.sizes[0] || 'M');
      setIsAdded(false);
      setActiveImageIdx(0);
    }
  }, [product]);

  // Handle Add to Bag
  const handleAddToBag = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      priceVal: product.priceVal,
      image: product.image,
      color: selectedColor,
      size: selectedSize,
      quantity: 1
    };

    // Store in localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIdx = existingCart.findIndex((item: any) => item.id === product.id && item.size === selectedSize);
    
    if (existingItemIdx > -1) {
      existingCart[existingItemIdx].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    setIsAdded(true);
    
    // Trigger storage event to notify top navigation bar immediately
    window.dispatchEvent(new Event('storage'));
    
    // Reset success status after 3 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
  };

  // Get recommendations
  const mergedProductsList = React.useMemo(() => {
    const custom = JSON.parse(localStorage.getItem('custom_products') || '[]');
    return [...allProducts, ...custom];
  }, []);

  const recommendations = mergedProductsList
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const fallbackRecommendations = mergedProductsList
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const finalRecommendations = recommendations.length >= 2 ? recommendations : fallbackRecommendations;

  return (
    <main className="min-h-screen bg-zinc-50/50 pb-32">
      {/* Dynamic Header / Breadcrumbs */}
      <div className="w-full bg-white border-b border-zinc-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-950 font-sans text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div className="text-[10px] text-zinc-400 font-mono">
            {product.gender} / {product.category} / PRODUCT #{product.id}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* Split Screen Container */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
          
          {/* LEFT PANEL: VERTICAL PRODUCT IMAGES STACK (AJIO STYLE) */}
          <div className="w-full lg:w-[58%] flex flex-col gap-6">
            
            {/* Desktop Stack: Full resolution stack of all images with a beautiful clean grid */}
            <div className="hidden lg:flex flex-col gap-4">
              {imagesFeed.map((imgUrl, index) => (
                <div 
                  key={index} 
                  className="aspect-[4/5] bg-white rounded-2xl overflow-hidden border border-zinc-200/60 shadow-xs hover:shadow-md transition-shadow duration-500"
                >
                  <img 
                    src={imgUrl} 
                    alt={`${product.name} View ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>

            {/* Mobile View Slider: Responsive horizontal card swiper */}
            <div className="lg:hidden w-full relative">
              <div className="aspect-[4/5] bg-white rounded-2xl overflow-hidden border border-zinc-200/60 shadow-xs relative">
                <img 
                  src={imagesFeed[activeImageIdx]} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                
                {/* Product Promo Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    {product.tags.map(tag => (
                      <span key={tag} className="bg-zinc-900/90 backdrop-blur-xs text-white px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Floating Wishlist Heart on Image for Mobile */}
                <motion.button 
                  id="mobile-wishlist-heart"
                  onClick={toggleLike}
                  animate={isHeartBouncing ? { scale: [1, 1.45, 0.85, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  whileTap={{ scale: 0.8 }}
                  className="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur-xs hover:bg-white rounded-full shadow-lg text-zinc-900 transition-colors z-10 cursor-pointer border border-zinc-100 flex items-center justify-center"
                >
                  <Heart 
                    size={18} 
                    fill={liked ? '#ef4444' : 'none'} 
                    stroke={liked ? '#ef4444' : 'currentColor'} 
                    className={liked ? 'text-red-500 scale-105' : 'text-zinc-700'}
                  />
                </motion.button>
              </div>

              {/* Slider Thumbnails Navigation under Main Mobile Image */}
              <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none snap-x mt-1">
                {imagesFeed.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIdx(index)}
                    className={`flex-shrink-0 w-16 aspect-[4/5] rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIdx === index ? 'border-zinc-950 scale-95 shadow-sm' : 'border-zinc-200 opacity-60'
                    }`}
                  >
                    <img src={imgUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: STICKY PURCHASE PANEL (AJIO STYLE) */}
          <div className="w-full lg:w-[42%] lg:sticky lg:top-24 bg-white border border-zinc-200/70 p-5 sm:p-8 rounded-3xl shadow-xs space-y-6 sm:space-y-7">
            
            {/* Brand, Title, Rating, Wishlist button row */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest font-black">
                    <Sparkles size={11} className="text-amber-500 animate-spin-slow" />
                    <span>{product.brand || 'GM Fashion'} Original</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight leading-tight uppercase font-headline">
                    {product.name}
                  </h1>
                </div>

                {/* Floating Wishlist Heart on Desktop Details Panel */}
                <motion.button 
                  id="desktop-wishlist-heart"
                  onClick={toggleLike}
                  animate={isHeartBouncing ? { scale: [1, 1.45, 0.85, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  whileTap={{ scale: 0.8 }}
                  className="hidden lg:flex p-3 bg-zinc-50 hover:bg-zinc-100 rounded-full text-zinc-900 transition-colors cursor-pointer border border-zinc-200/60 items-center justify-center flex-shrink-0"
                  title="Save to Wishlist"
                >
                  <Heart 
                    size={20} 
                    fill={liked ? '#ef4444' : 'none'} 
                    stroke={liked ? '#ef4444' : 'currentColor'} 
                    className={liked ? 'text-red-500 scale-105' : 'text-zinc-600'}
                  />
                </motion.button>
              </div>

              {/* Ratings and Reviews Summary badge */}
              <div className="flex items-center gap-3 pt-1">
                <div className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
                  4.5 <Star size={10} className="fill-emerald-700 text-emerald-700" />
                </div>
                <span className="text-zinc-400 text-xs font-light">| 114 Verified Buyers Ratings</span>
              </div>
            </div>

            {/* Pricing Section with 50% Off Banner (Flipkart / AJIO style) */}
            <div className="py-4 border-y border-zinc-100 flex flex-col gap-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-black text-zinc-950 font-headline tracking-tight">
                  {product.price}
                </span>
                <span className="text-sm text-zinc-400 line-through font-light">
                  ₹{Math.round(product.priceVal * 2)}
                </span>
                <span className="text-xs bg-rose-50 text-rose-600 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Flat 50% OFF
                </span>
              </div>
              <div className="text-[10px] text-zinc-400 font-medium tracking-wide">
                Price inclusive of all taxes
              </div>
            </div>

            {/* Shade Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2.5">
                <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-extrabold block">
                  Select Shade
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer`}
                      style={{ 
                        backgroundColor: color,
                        borderColor: selectedColor === color ? '#09090b' : 'transparent',
                        boxShadow: selectedColor === color ? '0 0 0 2px #ffffff inset' : 'none'
                      }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <span className={`w-1.5 h-1.5 rounded-full ${color === '#ffffff' ? 'bg-black' : 'bg-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-extrabold block">
                    Select Size
                  </label>
                  <button className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1 hover:text-zinc-950 transition-colors uppercase tracking-wider">
                    <Ruler size={12} />
                    <span>Size Chart</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
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

            {/* Dynamic Stock Warning Banner */}
            <div className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl flex items-start gap-2.5">
              <AlertCircle size={15} className="text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-900 leading-normal">
                <span className="font-extrabold">Fast Selling Category: </span>
                Only 3 pieces left in our Chennai warehouse. Order in the next 14 minutes for same-day dispatch.
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="space-y-2.5 pt-1.5">
              <button
                onClick={handleAddToBag}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  isAdded 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-zinc-950 text-white hover:bg-zinc-900'
                }`}
              >
                <ShoppingBag size={14} className={isAdded ? 'animate-bounce' : ''} />
                <span>{isAdded ? 'Added to Bag!' : `Add to Bag`}</span>
              </button>

              <Link
                to="/checkout"
                onClick={handleAddToBag}
                className="w-full py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              >
                Express Checkout (Buy Now)
              </Link>
            </div>

            {/* Product description tabs section */}
            <div className="border-t border-zinc-100 pt-5 space-y-4">
              <div className="flex border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <button 
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 pr-4 border-b-2 transition-colors ${activeTab === 'details' ? 'border-zinc-900 text-zinc-900' : 'border-transparent'}`}
                >
                  The Story
                </button>
                <button 
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 px-4 border-b-2 transition-colors ${activeTab === 'specs' ? 'border-zinc-900 text-zinc-900' : 'border-transparent'}`}
                >
                  Specs
                </button>
                <button 
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2 px-4 border-b-2 transition-colors ${activeTab === 'shipping' ? 'border-zinc-900 text-zinc-900' : 'border-transparent'}`}
                >
                  Delivery
                </button>
              </div>

              <div className="min-h-[5.5rem]">
                <AnimatePresence mode="wait">
                  {activeTab === 'details' && (
                    <motion.div 
                      key="details"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-zinc-600 text-xs leading-relaxed"
                    >
                      {product.details || 'Precision engineered and constructed for maximum visual poise. Composed of raw materials sourced with a rigorous commitment to ethical and environmental sustainability.'}
                    </motion.div>
                  )}
                  {activeTab === 'specs' && (
                    <motion.div 
                      key="specs"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-zinc-600 text-xs space-y-1.5"
                    >
                      <div className="flex justify-between py-1 border-b border-zinc-50">
                        <span className="font-semibold text-zinc-400">Fit</span>
                        <span className="text-zinc-800">Regular / Modern Tailoring</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-50">
                        <span className="font-semibold text-zinc-400">Composition</span>
                        <span className="text-zinc-800">100% Certified Organic Cotton</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="font-semibold text-zinc-400">Origin</span>
                        <span className="text-zinc-800">Made in India</span>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'shipping' && (
                    <motion.div 
                      key="shipping"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-zinc-600 text-xs space-y-2.5"
                    >
                      <p>🚚 Free standard delivery on all domestic orders above ₹499.</p>
                      <p>🔄 Hassle-free 30-day exchange and returns. Self-service portal available in your orders account section.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Security & Shipping Icons */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-50">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Truck size={14} className="text-zinc-400" />
                  <span className="text-[9px] font-extrabold uppercase tracking-widest">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <RefreshCw size={14} className="text-zinc-400" />
                  <span className="text-[9px] font-extrabold uppercase tracking-widest">30 Day Exchange</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* COMPLETE THE LOOK / RECOMMENDED PAIRINGS GRID */}
      <section className="mt-20 sm:mt-28 bg-zinc-100/40 py-16 sm:py-20 border-y border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div className="space-y-1">
              <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400 font-extrabold">Aesthetic Curation</span>
              <h2 className="text-2xl font-black tracking-tight text-zinc-900 uppercase font-headline">Complete the Look</h2>
            </div>
            <Link 
              to="/products" 
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-950 underline underline-offset-8 transition-colors"
            >
              Explore All
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {finalRecommendations.map(rec => (
              <Link 
                key={rec.id} 
                to={`/product/${rec.id}`}
                className="group flex flex-col justify-between bg-white p-3 rounded-2xl border border-zinc-200/60 hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-50 relative">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={rec.name} 
                    src={rec.image}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col gap-1 mt-3">
                  <h4 className="text-xs font-bold text-zinc-800 group-hover:text-zinc-950 font-sans line-clamp-1 truncate uppercase tracking-tight">
                    {rec.name}
                  </h4>
                  <p className="text-xs font-black text-zinc-900">{rec.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
