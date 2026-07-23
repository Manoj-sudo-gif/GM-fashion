import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Search, User, Camera, X, RefreshCw, Upload, Sparkles, Trash2, Baby, Gamepad2 } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

export default function TopNavBar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category');
  const currentSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track window scroll to optimize navbar
  useEffect(() => {
    let lastIsScrolled = false;
    const handleScroll = () => {
      const scrolled = window.scrollY > 15;
      if (scrolled !== lastIsScrolled) {
        lastIsScrolled = scrolled;
        setIsScrolled(scrolled);
      }
    };
    
    // Check initial scroll state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Sync search input with URL search param
  useEffect(() => {
    setSearchQuery(currentSearch);
  }, [currentSearch]);

  // Load wishlist items on mount and sync on storage updates
  useEffect(() => {
    const loadWishlist = () => {
      const items = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistItems(items);
    };

    loadWishlist();
    window.addEventListener('storage', loadWishlist);
    return () => {
      window.removeEventListener('storage', loadWishlist);
    };
  }, []);

  const handleRemoveWishlistItem = (id: number) => {
    const updated = wishlistItems.filter((item: any) => item.id !== id);
    setWishlistItems(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    // Alert other tabs or components (like ProductDetails) of the change
    window.dispatchEvent(new Event('storage'));
  };

  const getLinkClass = (currentCategory: string | null) => {
    const isActive = category === currentCategory || 
      (currentCategory === 'Men' && window.location.pathname.startsWith('/category/Men')) ||
      (currentCategory === null && !category && window.location.pathname !== '/' && !window.location.pathname.startsWith('/category'));
    return `font-headline tracking-tight transition-colors text-xs uppercase tracking-widest font-bold ${
      isActive 
        ? 'text-zinc-900 font-extrabold border-b-2 border-zinc-900 pb-1' 
        : 'text-zinc-500 hover:text-zinc-900'
    }`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const triggerVisualSearch = (categorySearch: string) => {
    setIsScanning(true);
    setScanResult(null);

    // Beautiful dynamic scanning animation
    setTimeout(() => {
      setIsScanning(false);
      setIsVisualSearchOpen(false);
      navigate(`/products?search=${encodeURIComponent(categorySearch)}`);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name.toLowerCase();
      let matchedCategory = 'Footwear';
      if (fileName.includes('shoe') || fileName.includes('sneaker') || fileName.includes('boot') || fileName.includes('run')) {
        matchedCategory = 'Footwear';
      } else if (fileName.includes('coat') || fileName.includes('jacket') || fileName.includes('outer') || fileName.includes('trench')) {
        matchedCategory = 'Outerwear';
      } else if (fileName.includes('bag') || fileName.includes('tote') || fileName.includes('pack') || fileName.includes('wallet')) {
        matchedCategory = 'Accessories';
      } else if (fileName.includes('shirt') || fileName.includes('tee') || fileName.includes('pants') || fileName.includes('lounge')) {
        matchedCategory = 'Essentials';
      } else if (fileName.includes('watch') || fileName.includes('time') || fileName.includes('clock')) {
        matchedCategory = 'Timepieces';
      } else if (fileName.includes('sweater') || fileName.includes('knit') || fileName.includes('cardigan')) {
        matchedCategory = 'Knitwear';
      }
      triggerVisualSearch(matchedCategory);
    }
  };

  return (
    <>
      <nav className={`sticky top-0 w-full z-[80] bg-white/95 backdrop-blur-xl border-b border-zinc-200/50 flex flex-col justify-between transition-[padding,box-shadow,background-color] duration-300 ease-out will-change-[padding,box-shadow] ${
        isScrolled ? 'py-1 px-3 sm:px-4 md:px-5 shadow-md' : 'py-3 px-4 md:px-8 shadow-sm'
      }`}>
        {/* Main Row / Row 1 */}
        <div className={`flex justify-between items-center h-14 md:h-16 w-full transition-[gap] duration-300 ${isScrolled ? 'gap-2 sm:gap-3' : 'gap-4'}`}>
          
          <div className={`flex items-center flex-grow transition-[gap] duration-300 ${isScrolled ? 'gap-0' : 'gap-4'}`}>
            {/* GM FASHION Logo */}
            <div className={`transition-[opacity,transform,max-width] duration-300 ease-out origin-left flex items-center shrink-0 will-change-[opacity,transform,max-width] ${
              isScrolled 
                ? 'opacity-0 max-w-0 -translate-x-10 pointer-events-none overflow-hidden mr-0' 
                : 'opacity-100 max-w-[180px] translate-x-0 mr-4'
            }`}>
              <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter text-zinc-900 font-headline uppercase select-none">
                GM FASHION
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className={`hidden md:flex gap-6 items-center transition-[opacity,transform,max-width] duration-300 ease-out will-change-[opacity,transform,max-width] ${
              isScrolled 
                ? 'opacity-0 max-w-0 scale-95 pointer-events-none overflow-hidden' 
                : 'opacity-100 max-w-[600px] scale-100'
            }`}>
              <Link to="/products?category=New Arrivals" className={getLinkClass('New Arrivals')}>New Arrivals</Link>
              <Link to="/products?category=Collections" className={getLinkClass('Collections')}>Collections</Link>
              <Link to="/products?category=Men" className={getLinkClass('Men')}>Men</Link>
              <Link to="/products?category=Women" className={getLinkClass('Women')}>Women</Link>
              <Link to="/products?category=Editorial" className={getLinkClass('Editorial')}>Editorial</Link>
            </div>

            {/* Scrolled Search Bar: occupies the main place when scrolled */}
            <div className={`flex-grow transition-[opacity,transform] duration-300 ease-out will-change-[opacity,transform] ${
              isScrolled 
                ? 'opacity-100 translate-x-0 scale-100 w-full' 
                : 'opacity-0 -translate-x-10 scale-95 pointer-events-none absolute w-0 overflow-hidden'
            }`}>
              <form 
                onSubmit={handleSearchSubmit} 
                className="relative w-full p-[1.5px] rounded-xl shadow-[0_1px_6px_rgba(0,0,0,0.02)] focus-within:shadow-[0_4px_16px_rgba(139,92,246,0.18)] transition-all duration-300"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #10b981, #f59e0b, #ec4899)',
                  backgroundSize: '200% auto',
                  animation: 'borderShine 4s linear infinite'
                }}
              >
                <div className="relative bg-white rounded-[10px] flex items-center p-1">
                  <Link 
                    to="/" 
                    className="flex items-center justify-center font-headline text-xs sm:text-sm font-black tracking-widest text-zinc-900 ml-3 mr-2 flex-shrink-0 cursor-pointer select-none hover:opacity-80 transition-opacity"
                    title="GM Fashion Home"
                  >
                    GM
                  </Link>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products, brands..."
                    className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 focus:outline-none font-body py-1.5 sm:py-2 pl-2 pr-2 placeholder-zinc-400 font-medium"
                  />
                  <button 
                    type="button"
                    onClick={() => setIsVisualSearchOpen(true)}
                    className="p-1.5 text-zinc-500 hover:text-zinc-900 transition-colors mr-1 cursor-pointer flex items-center justify-center rounded-lg hover:bg-zinc-100 shrink-0"
                    title="Search by image / Camera"
                  >
                    <Camera size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className={`flex items-center shrink-0 transition-[gap] duration-300 ${isScrolled ? 'gap-1 sm:gap-2' : 'gap-2 sm:gap-4'}`}>
            {/* Wishlist Button (Heart) */}
            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="text-zinc-800 hover:bg-zinc-100 p-2 rounded-lg transition-all duration-300 relative cursor-pointer"
              title="View Wishlist"
            >
              <Heart 
                size={20} 
                strokeWidth={1.5} 
                className={wishlistItems.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-zinc-800'} 
              />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center scale-90 border border-white animate-pulse">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Link */}
            <Link to="/checkout" className="text-zinc-800 hover:bg-zinc-100 p-2 rounded-lg transition-all duration-300 relative block" title="Shopping Bag">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
            </Link>
          </div>
        </div>

        {/* Row 2: Search Bar & Categories with Smooth Fluid Transitions */}
        <div className="w-full flex flex-col items-center overflow-hidden">
          
          {/* Main Search Bar (Visible ONLY when not scrolled) */}
          <div className={`w-full transition-[max-height,opacity,transform,padding,margin] duration-300 ease-out origin-top will-change-[max-height,opacity,transform] ${
            isScrolled 
              ? 'opacity-0 max-h-0 -translate-y-4 pointer-events-none overflow-hidden m-0' 
              : 'opacity-100 max-h-20 translate-y-0 pb-3 pt-1 px-2 sm:px-4'
          }`}>
            <form 
              onSubmit={handleSearchSubmit} 
              className="relative w-full max-w-xl mx-auto p-[1.5px] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] focus-within:shadow-[0_4px_24px_rgba(139,92,246,0.25)] transition-all duration-300"
              style={{
                backgroundImage: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #10b981, #f59e0b, #ec4899)',
                backgroundSize: '200% auto',
                animation: 'borderShine 4s linear infinite'
              }}
            >
              <div className="relative bg-white rounded-[14px] flex items-center p-1">
                {/* Rotating GM text brand mark on the left (No background circle) */}
                <button 
                  type="submit" 
                  className="flex items-center justify-center font-headline text-xs sm:text-sm font-black tracking-widest text-zinc-900 ml-3.5 mr-1.5 flex-shrink-0 cursor-pointer select-none hover:opacity-80 transition-opacity"
                  style={{ animation: 'gmRotatePause 4.5s infinite ease-in-out' }}
                  title="Search"
                >
                  GM
                </button>
                
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="w-full bg-transparent text-xs text-zinc-900 focus:outline-none font-body py-1.5 pl-2 pr-2 placeholder-zinc-400 font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setIsVisualSearchOpen(true)}
                  className="p-1.5 text-zinc-500 hover:text-zinc-900 transition-colors mr-1.5 cursor-pointer flex items-center justify-center rounded-lg hover:bg-zinc-100 shrink-0"
                  title="Search by image / Camera"
                >
                  <Camera size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* Curated Category Buttons: Styled as beautiful uniform circles with labels below when at top, and curved rectangular badges next to each other when scrolled in a single straight line */}
          <div className={`flex items-center transition-[gap,padding,border-color] duration-300 ease-out will-change-[gap,padding] ${
            isScrolled 
              ? 'flex-nowrap overflow-x-auto no-scrollbar justify-start sm:justify-center gap-2 sm:gap-3.5 pb-2 pt-1.5 border-t border-zinc-100/60 max-w-md mx-auto px-4 w-full' 
              : 'flex-wrap justify-center gap-5 sm:gap-8 pb-4 pt-1 max-w-lg mx-auto w-full'
          }`}>
            {/* Mens */}
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                navigate('/category/Men');
              }}
              className={`group cursor-pointer flex-shrink-0 transition-[background-color,padding,border-color,gap,box-shadow] duration-300 ease-out will-change-[background-color,padding] ${
                isScrolled 
                  ? 'flex items-center gap-2 bg-zinc-50/95 hover:bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]' 
                  : 'flex flex-col items-center gap-1.5'
              }`}
            >
              <div className={`rounded-full overflow-hidden flex items-center justify-center transition-[width,height,border-color,box-shadow,transform] duration-300 ease-out will-change-[width,height] ${
                isScrolled 
                  ? 'w-6 h-6 border border-zinc-200 shadow-inner' 
                  : (category?.toLowerCase() === 'men' || window.location.pathname.startsWith('/category/Men'))
                    ? 'w-14 h-14 sm:w-16 sm:h-16 border-2 border-zinc-900 scale-105 shadow-md shadow-zinc-900/10' 
                    : 'w-14 h-14 sm:w-16 sm:h-16 border border-zinc-200/80 hover:border-zinc-400'
              }`}>
                <img 
                  src="https://styleunion.in/cdn/shop/files/SMYS00049DARKOLIVE_1.webp?v=1783502402&width=1100"
                  alt="Mens"
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300 ease-in-out"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className={`tracking-widest uppercase font-headline transition-[font-size,color,font-weight] duration-300 ease-out will-change-[font-size,color] ${
                isScrolled 
                  ? 'text-[8px] sm:text-[9px] font-black text-zinc-800' 
                  : (category?.toLowerCase() === 'men' || window.location.pathname.startsWith('/category/Men')) ? 'text-[9px] sm:text-[10px] font-black text-zinc-950' : 'text-[9px] sm:text-[10px] font-bold text-zinc-500 group-hover:text-zinc-900'
              }`}>Mens</span>
            </button>

            {/* Boys */}
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                navigate('/category/Boys');
              }}
              className={`group cursor-pointer flex-shrink-0 transition-[background-color,padding,border-color,gap,box-shadow] duration-300 ease-out will-change-[background-color,padding] ${
                isScrolled 
                  ? 'flex items-center gap-2 bg-zinc-50/95 hover:bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]' 
                  : 'flex flex-col items-center gap-1.5'
              }`}
            >
              <div className={`rounded-full overflow-hidden flex items-center justify-center transition-[width,height,border-color,box-shadow,transform] duration-300 ease-out will-change-[width,height] ${
                isScrolled 
                  ? 'w-6 h-6 border border-zinc-200 shadow-inner' 
                  : (category?.toLowerCase() === 'boys' || window.location.pathname.startsWith('/category/Boys'))
                    ? 'w-14 h-14 sm:w-16 sm:h-16 border-2 border-zinc-900 scale-105 shadow-md shadow-zinc-900/10' 
                    : 'w-14 h-14 sm:w-16 sm:h-16 border border-zinc-200/80 hover:border-zinc-400'
              }`}>
                <img 
                  src="https://cdn.shopify.com/s/files/1/0583/4820/8201/files/UntitledSession2999.jpg"
                  alt="Boys"
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300 ease-in-out"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className={`tracking-widest uppercase font-headline transition-[font-size,color,font-weight] duration-300 ease-out will-change-[font-size,color] ${
                isScrolled 
                  ? 'text-[8px] sm:text-[9px] font-black text-zinc-800' 
                  : (category?.toLowerCase() === 'boys' || window.location.pathname.startsWith('/category/Boys')) ? 'text-[9px] sm:text-[10px] font-black text-zinc-950' : 'text-[9px] sm:text-[10px] font-bold text-zinc-500 group-hover:text-zinc-900'
              }`}>Boys</span>
            </button>

            {/* Kids */}
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                navigate('/category/Kids');
              }}
              className={`group cursor-pointer flex-shrink-0 transition-[background-color,padding,border-color,gap,box-shadow] duration-300 ease-out will-change-[background-color,padding] ${
                isScrolled 
                  ? 'flex items-center gap-2 bg-zinc-50/95 hover:bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]' 
                  : 'flex flex-col items-center gap-1.5'
              }`}
            >
              <div className={`rounded-full overflow-hidden flex items-center justify-center transition-[width,height,border-color,box-shadow,transform] duration-300 ease-out will-change-[width,height] ${
                isScrolled 
                  ? 'w-6 h-6 border border-zinc-200 shadow-inner' 
                  : (category?.toLowerCase() === 'kids' || window.location.pathname.startsWith('/category/Kids'))
                    ? 'w-14 h-14 sm:w-16 sm:h-16 border-2 border-zinc-900 scale-105 shadow-md shadow-zinc-900/10' 
                    : 'w-14 h-14 sm:w-16 sm:h-16 border border-zinc-200/80 hover:border-zinc-400'
              }`}>
                <img 
                  src="https://www.mumkins.in/cdn/shop/files/1_acb25f3d-7de5-4d76-a9a0-108592db9e9a.webp?v=1778479117&width=1080"
                  alt="Kids"
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300 ease-in-out"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className={`tracking-widest uppercase font-headline transition-[font-size,color,font-weight] duration-300 ease-out will-change-[font-size,color] ${
                isScrolled 
                  ? 'text-[8px] sm:text-[9px] font-black text-zinc-800' 
                  : (category?.toLowerCase() === 'kids' || window.location.pathname.startsWith('/category/Kids')) ? 'text-[9px] sm:text-[10px] font-black text-zinc-950' : 'text-[9px] sm:text-[10px] font-bold text-zinc-500 group-hover:text-zinc-900'
              }`}>Kids</span>
            </button>

            {/* Accessories */}
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                navigate('/products?category=Accessories');
              }}
              className={`group cursor-pointer flex-shrink-0 transition-[background-color,padding,border-color,gap,box-shadow] duration-300 ease-out will-change-[background-color,padding] ${
                isScrolled 
                  ? 'flex items-center gap-2 bg-zinc-50/95 hover:bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]' 
                  : 'flex flex-col items-center gap-1.5'
              }`}
            >
              <div className={`rounded-full overflow-hidden flex items-center justify-center transition-[width,height,border-color,box-shadow,transform] duration-300 ease-out will-change-[width,height] ${
                isScrolled 
                  ? 'w-6 h-6 border border-zinc-200 shadow-inner' 
                  : category?.toLowerCase() === 'accessories' 
                    ? 'w-14 h-14 sm:w-16 sm:h-16 border-2 border-zinc-900 scale-105 shadow-md shadow-zinc-900/10' 
                    : 'w-14 h-14 sm:w-16 sm:h-16 border border-zinc-200/80 hover:border-zinc-400'
              }`}>
                <img 
                  src="https://m.media-amazon.com/images/I/71sQIeakXfL._AC_UY1100_.jpg"
                  alt="Accessories"
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300 ease-in-out"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className={`tracking-widest uppercase font-headline transition-[font-size,color,font-weight] duration-300 ease-out will-change-[font-size,color] ${
                isScrolled 
                  ? 'text-[8px] sm:text-[9px] font-black text-zinc-800' 
                  : category?.toLowerCase() === 'accessories' ? 'text-[9px] sm:text-[10px] font-black text-zinc-950' : 'text-[9px] sm:text-[10px] font-bold text-zinc-500 group-hover:text-zinc-900'
              }`}>Accessories</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Visual Search Modal */}
      {isVisualSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => !isScanning && setIsVisualSearchOpen(false)}
          />

          {/* Modal Card */}
          <div className="relative bg-white w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl border border-zinc-100 z-10 overflow-hidden">
            <button
              onClick={() => setIsVisualSearchOpen(false)}
              disabled={isScanning}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 p-2 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Camera size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-zinc-900 font-headline uppercase">Visual Search AI</h3>
                <p className="text-zinc-500 text-xs font-body mt-1 leading-relaxed">
                  Upload an image or take a photo of an outfit, sneaker, or accessory to instantly find matches.
                </p>
              </div>

              {/* Scanning Viewport / Simulated Camera Frame */}
              <div className="relative aspect-[4/3] w-full rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden flex flex-col items-center justify-center text-white/50 gap-2">
                {isScanning ? (
                  <>
                    {/* Glowing scanning laser bar */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-500 shadow-[0_0_15px_#3b82f6] animate-[scan_2s_infinite_ease-in-out]"></div>
                    <div className="flex flex-col items-center gap-3 relative z-10">
                      <RefreshCw size={28} className="animate-spin text-sky-400" />
                      <span className="text-xs uppercase tracking-widest font-bold font-label text-sky-400">Scanning Image Details...</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 p-6 text-center">
                    <Sparkles size={24} className="text-zinc-500 animate-pulse" />
                    <span className="text-xs text-zinc-400 font-body">Camera view ready or drop image</span>
                    
                    {/* Invisible file input wrapper */}
                    <label className="mt-2 bg-white text-zinc-950 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-zinc-100 transition-colors flex items-center gap-2 border border-zinc-200">
                      <Upload size={12} />
                      <span>Upload Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Quick Try Sample Images */}
              {!isScanning && (
                <div className="space-y-3 pt-2">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold font-label">Quick test examples:</div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => triggerVisualSearch('Footwear')}
                      className="px-3 py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-800 cursor-pointer"
                    >
                      👟 Sneakers
                    </button>
                    <button
                      onClick={() => triggerVisualSearch('Outerwear')}
                      className="px-3 py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-800 cursor-pointer"
                    >
                      🧥 Jackets
                    </button>
                    <button
                      onClick={() => triggerVisualSearch('Accessories')}
                      className="px-3 py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-800 cursor-pointer"
                    >
                      👜 Bags
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Side Drawer Panel */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-[110] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsWishlistOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col z-10 animate-[slideIn_0.3s_ease-out]">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-rose-500 fill-rose-500" />
                <h3 className="text-sm font-black uppercase tracking-wider font-headline text-zinc-900">YOUR WISHLIST</h3>
                <span className="text-xs bg-zinc-100 text-zinc-600 font-bold px-2 py-0.5 rounded-full">
                  {wishlistItems.length}
                </span>
              </div>
              <button 
                onClick={() => setIsWishlistOpen(false)}
                className="text-zinc-400 hover:text-zinc-900 p-1.5 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {wishlistItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 px-4">
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
                    <Heart size={28} />
                  </div>
                  <h4 className="font-headline font-black text-sm uppercase tracking-wide text-zinc-900 mb-2">No items saved yet</h4>
                  <p className="text-zinc-500 text-xs font-body max-w-xs leading-relaxed">
                    Explore our collections and tap the heart icon on any product details screen to save your favorites here.
                  </p>
                  <button
                    onClick={() => {
                      setIsWishlistOpen(false);
                      navigate('/products');
                    }}
                    className="mt-6 bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded-lg transition-all"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-zinc-50">
                  {wishlistItems.map((item: any) => (
                    <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0 items-center">
                      {/* Product Image */}
                      <div className="w-16 h-20 bg-zinc-50 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow min-w-0">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                          {item.gender} &bull; {item.category}
                        </span>
                        <h4 className="text-xs font-extrabold uppercase tracking-tight text-zinc-900 truncate font-headline">
                          {item.name}
                        </h4>
                        <p className="text-xs font-bold text-zinc-900 mt-1">
                          {item.price}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => {
                            setIsWishlistOpen(false);
                            navigate(`/product/${item.id}`);
                          }}
                          className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-widest text-[9px] px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleRemoveWishlistItem(item.id)}
                          className="text-zinc-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove from Wishlist"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {wishlistItems.length > 0 && (
              <div className="border-t border-zinc-100 p-6 bg-zinc-50/50">
                <button
                  onClick={() => {
                    setIsWishlistOpen(false);
                    navigate('/products');
                  }}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-widest text-[10px] py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue Browsing</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global scan styling keyframe */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes gmRotatePause {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(360deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes borderShine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}

