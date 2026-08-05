import React, { useState, useEffect, useRef } from 'react';
import { Heart, ShoppingBag, Search, User, Camera, X, RefreshCw, Upload, Sparkles, Trash2, Baby, Gamepad2, Globe, ChevronLeft, Image as ImageIcon, ShieldCheck, AlertCircle, Video } from 'lucide-react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SEARCH_KEYWORDS = ['Shirt', 'Pant', 'Shorts', 'Pants', 'Vest', 'Brief', 'Trunk', 'Dhoti'];

export default function TopNavBar() {
  const { selectedLanguage, t, user, openOnboarding } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const category = searchParams.get('category');
  const currentSearch = searchParams.get('search') || '';

  const isCategoryPage = location.pathname.startsWith('/category');
  const isProductsPage = location.pathname.startsWith('/products');
  const isProductDetailPage = location.pathname.startsWith('/product/');

  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Camera & Gallery Visual Search state
  const [visualMode, setVisualMode] = useState<'select' | 'permission' | 'camera' | 'scanning'>('select');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);

  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Rotate search placeholder continuously through keywords
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_KEYWORDS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const dynamicPlaceholder = `${SEARCH_KEYWORDS[placeholderIndex]}...`;

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
      (currentCategory === 'Men' && location.pathname.startsWith('/category/Men')) ||
      (currentCategory === null && !category && location.pathname !== '/' && !location.pathname.startsWith('/category'));
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

  // Stop active camera stream tracks
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleCloseVisualSearch = () => {
    stopCamera();
    setIsVisualSearchOpen(false);
    setVisualMode('select');
    setCapturedImage(null);
    setPermissionError(null);
    setIsScanning(false);
  };

  // Attach camera stream to video element when visualMode changes to camera
  useEffect(() => {
    if (visualMode === 'camera' && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [visualMode, cameraStream]);

  // Request camera access permission
  const handleRequestCameraPermission = async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      });
      setCameraStream(stream);
      setVisualMode('camera');
    } catch (err: any) {
      console.warn('Camera facingMode request failed, attempting basic video:', err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(fallbackStream);
        setVisualMode('camera');
      } catch (err2: any) {
        console.warn('Live stream access blocked or denied by browser/iframe, opening native camera:', err2);
        setPermissionError('Live stream access was restricted or denied by your browser. Tap "SNAP PHOTO WITH CAMERA" below to take a photo.');
        setVisualMode('permission');
        if (nativeCameraInputRef.current) {
          nativeCameraInputRef.current.click();
        }
      }
    }
  };

  // Capture frame from live video feed
  const handleCapturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
        setVisualMode('scanning');
        triggerVisualSearch('Shirt');
      }
    }
  };

  const triggerVisualSearch = (categorySearch: string) => {
    setIsScanning(true);
    setScanResult(null);

    // Dynamic scanning animation delay
    setTimeout(() => {
      setIsScanning(false);
      handleCloseVisualSearch();
      navigate(`/products?search=${encodeURIComponent(categorySearch)}`);
    }, 2200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCapturedImage(reader.result);
          setVisualMode('scanning');
          
          const fileName = file.name.toLowerCase();
          let matchedCategory = 'Shirt';
          if (fileName.includes('shoe') || fileName.includes('sneaker') || fileName.includes('boot') || fileName.includes('run')) {
            matchedCategory = 'Footwear';
          } else if (fileName.includes('coat') || fileName.includes('jacket') || fileName.includes('outer') || fileName.includes('trench')) {
            matchedCategory = 'Outerwear';
          } else if (fileName.includes('bag') || fileName.includes('tote') || fileName.includes('pack') || fileName.includes('wallet')) {
            matchedCategory = 'Accessories';
          } else if (fileName.includes('pant') || fileName.includes('short') || fileName.includes('trouser')) {
            matchedCategory = 'Pants';
          }
          triggerVisualSearch(matchedCategory);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (location.pathname === '/account' || location.pathname === '/orders' || location.pathname === '/my-orders' || location.pathname === '/checkout') {
    return null;
  }

  return (
    <>
      <nav className={`sticky top-0 w-full z-[80] bg-white/95 backdrop-blur-xl border-b border-zinc-200/50 flex flex-col justify-between transition-[padding,box-shadow,background-color] duration-300 ease-out will-change-[padding,box-shadow] ${
        isScrolled ? 'py-1 px-3 sm:px-4 md:px-5 shadow-md' : 'py-2 px-4 md:px-8 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col">
        {/* Main Row / Row 1 */}
        <div className={`flex justify-between items-center h-13 md:h-15 w-full transition-[gap] duration-300 ${isScrolled ? 'gap-2 sm:gap-3' : 'gap-4'}`}>
          
          <div className={`flex items-center flex-grow transition-[gap] duration-300 ${isScrolled ? 'gap-0' : 'gap-4'}`}>
            {/* GM FASHIONS Logo with Back button */}
            <div className={`transition-[opacity,transform,max-width] duration-300 ease-out origin-left flex items-center shrink-0 will-change-[opacity,transform,max-width] ${
              isScrolled && !isCategoryPage && !isProductsPage && !isProductDetailPage 
                ? 'opacity-0 max-w-0 -translate-x-10 pointer-events-none overflow-hidden mr-0' 
                : 'opacity-100 max-w-[220px] translate-x-0 mr-4'
            }`}>
              {(isProductsPage || isCategoryPage || isProductDetailPage) && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.history.state && window.history.state.idx > 0) {
                      navigate(-1);
                    } else {
                      navigate('/');
                    }
                  }}
                  className="p-1.5 -ml-1 mr-1.5 text-zinc-800 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
                  title="Back"
                  aria-label="Back"
                >
                  <ChevronLeft size={22} strokeWidth={2.5} />
                </button>
              )}
              <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter text-zinc-900 font-headline uppercase select-none">
                GM FASHIONS
              </Link>
            </div>
            
            {/* Desktop Navigation Links removed per request */}

            {/* Scrolled Search Bar: occupies the main place when scrolled (only on non-category and non-products pages) */}
            <div className={`flex-grow transition-[opacity,transform] duration-300 ease-out will-change-[opacity,transform] ${
              isScrolled && !isCategoryPage && !isProductsPage && !isProductDetailPage 
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
                    title="GM Fashions Home"
                  >
                    GM
                  </Link>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={dynamicPlaceholder}
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

          <div className={`flex items-center shrink-0 transition-[gap] duration-300 ${isScrolled ? 'gap-1 sm:gap-2' : 'gap-2 sm:gap-3'}`}>
            {/* Search Button (Always visible so users can search on scroll on category & all pages) */}
            <button 
              onClick={() => setIsSearchModalOpen(true)}
              className="text-zinc-800 hover:bg-zinc-100 p-2 rounded-lg transition-all duration-300 relative cursor-pointer flex items-center justify-center"
              title="Search Products"
            >
              <Search size={20} strokeWidth={1.5} className="text-zinc-800 hover:text-zinc-950" />
            </button>

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
          
          {/* Main Search Bar (Visible ONLY when not scrolled and NOT on category, products, or product detail pages) */}
          <div className={`w-full transition-[max-height,opacity,transform,padding,margin] duration-300 ease-out origin-top will-change-[max-height,opacity,transform] ${
            isScrolled || isCategoryPage || isProductsPage || isProductDetailPage
              ? 'opacity-0 max-h-0 -translate-y-4 pointer-events-none overflow-hidden m-0 hidden' 
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
                  placeholder={dynamicPlaceholder}
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
          {!isProductsPage && !isProductDetailPage && (
            <div className={`flex items-center transition-[gap,padding,border-color] duration-300 ease-out will-change-[gap,padding] ${
              isScrolled 
                ? 'flex-nowrap overflow-x-auto no-scrollbar justify-start sm:justify-center gap-2 sm:gap-3.5 pb-1.5 pt-1 border-t border-zinc-100/60 max-w-md mx-auto px-4 w-full' 
                : 'flex-wrap justify-center gap-5 sm:gap-8 pb-1.5 pt-0.5 max-w-lg mx-auto w-full'
            }`}>
              {/* Mens */}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  navigate('/category/Men');
                }}
                className={`group cursor-pointer flex-shrink-0 transition-[background-color,padding,gap,box-shadow] duration-300 ease-out ${
                  isScrolled 
                    ? 'flex items-center gap-2 bg-zinc-50/95 hover:bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]' 
                    : 'flex flex-col items-center gap-1.5'
                }`}
              >
                <div className={`rounded-full overflow-hidden flex items-center justify-center transition-[width,height] duration-300 ease-out ${
                  isScrolled 
                    ? 'w-6 h-6 border border-zinc-200/60' 
                    : 'w-14 h-14 sm:w-16 sm:h-16'
                }`}>
                  <img 
                    src="https://styleunion.in/cdn/shop/files/SMYS00049DARKOLIVE_1.webp?v=1783502402&width=1100"
                    alt="Mens"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className={`tracking-widest uppercase font-headline transition-[font-size,color,font-weight] duration-300 ease-out ${
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
                className={`group cursor-pointer flex-shrink-0 transition-[background-color,padding,gap,box-shadow] duration-300 ease-out ${
                  isScrolled 
                    ? 'flex items-center gap-2 bg-zinc-50/95 hover:bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]' 
                    : 'flex flex-col items-center gap-1.5'
                }`}
              >
                <div className={`rounded-full overflow-hidden flex items-center justify-center transition-[width,height] duration-300 ease-out ${
                  isScrolled 
                    ? 'w-6 h-6 border border-zinc-200/60' 
                    : 'w-14 h-14 sm:w-16 sm:h-16'
                }`}>
                  <img 
                    src="https://cdn.shopify.com/s/files/1/0583/4820/8201/files/UntitledSession2999.jpg"
                    alt="Boys"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className={`tracking-widest uppercase font-headline transition-[font-size,color,font-weight] duration-300 ease-out ${
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
                className={`group cursor-pointer flex-shrink-0 transition-[background-color,padding,gap,box-shadow] duration-300 ease-out ${
                  isScrolled 
                    ? 'flex items-center gap-2 bg-zinc-50/95 hover:bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]' 
                    : 'flex flex-col items-center gap-1.5'
                }`}
              >
                <div className={`rounded-full overflow-hidden flex items-center justify-center transition-[width,height] duration-300 ease-out ${
                  isScrolled 
                    ? 'w-6 h-6 border border-zinc-200/60' 
                    : 'w-14 h-14 sm:w-16 sm:h-16'
                }`}>
                  <img 
                    src="https://www.mumkins.in/cdn/shop/files/1_acb25f3d-7de5-4d76-a9a0-108592db9e9a.webp?v=1778479117&width=1080"
                    alt="Kids"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className={`tracking-widest uppercase font-headline transition-[font-size,color,font-weight] duration-300 ease-out ${
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
                  navigate('/category/Accessories');
                }}
                className={`group cursor-pointer flex-shrink-0 transition-[background-color,padding,gap,box-shadow] duration-300 ease-out ${
                  isScrolled 
                    ? 'flex items-center gap-2 bg-zinc-50/95 hover:bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]' 
                    : 'flex flex-col items-center gap-1.5'
                }`}
              >
                <div className={`rounded-full overflow-hidden flex items-center justify-center transition-[width,height] duration-300 ease-out ${
                  isScrolled 
                    ? 'w-6 h-6 border border-zinc-200/60' 
                    : 'w-14 h-14 sm:w-16 sm:h-16'
                }`}>
                  <img 
                    src="https://m.media-amazon.com/images/I/71sQIeakXfL._AC_UY1100_.jpg"
                    alt="Accessories"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className={`tracking-widest uppercase font-headline transition-[font-size,color,font-weight] duration-300 ease-out ${
                  isScrolled 
                    ? 'text-[8px] sm:text-[9px] font-black text-zinc-800' 
                    : (category?.toLowerCase() === 'accessories' || window.location.pathname.startsWith('/category/Accessories')) ? 'text-[9px] sm:text-[10px] font-black text-zinc-950' : 'text-[9px] sm:text-[10px] font-bold text-zinc-500 group-hover:text-zinc-900'
                }`}>Accessories</span>
              </button>
            </div>
          )}
        </div>
        </div>
      </nav>

      {/* Hidden File Input for Gallery Selection */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Hidden File Input for Direct Native Camera Snapshot */}
      <input 
        type="file" 
        ref={nativeCameraInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        capture="environment"
        className="hidden" 
      />

      {/* Visual Search Modal */}
      {isVisualSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={handleCloseVisualSearch}
          />

          {/* Modal Card - Soft Lavender Theme */}
          <div className="relative bg-white w-full max-w-sm sm:max-w-md rounded-[28px] p-6 sm:p-7 shadow-2xl border border-purple-100 z-10 overflow-hidden">
            <button
              onClick={handleCloseVisualSearch}
              disabled={isScanning}
              className="absolute top-5 right-5 text-purple-400 hover:text-purple-900 p-2 rounded-full hover:bg-purple-50 transition-colors cursor-pointer z-20"
              title="Close"
            >
              <X size={18} />
            </button>

            {/* 1. SELECTION MODE: GALLERY vs CAMERA (Soft Lavender Styling) */}
            {visualMode === 'select' && (
              <div className="text-center pt-0.5">
                {/* Top drag handle bar */}
                <div className="w-12 h-1 bg-purple-200/80 rounded-full mx-auto mb-4" />

                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-zinc-950 font-headline uppercase">
                    VISUAL PRODUCT SEARCH
                  </h3>
                  <p className="text-purple-900/60 text-xs font-semibold mt-1 max-w-[260px] mx-auto leading-relaxed">
                    Choose photo source to search matching products
                  </p>
                </div>

                {permissionError && (
                  <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-start gap-2 text-left">
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                    <span className="leading-tight">{permissionError}</span>
                  </div>
                )}

                {/* Two Large Square Cards (Gallery & Camera) in Soft Lavender */}
                <div className="grid grid-cols-2 gap-3.5 sm:gap-4 my-5 sm:my-6">
                  {/* Gallery Card */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-6 px-4 rounded-[22px] border border-purple-100 bg-purple-50/40 hover:bg-purple-100/60 hover:border-purple-300 transition-all text-center group cursor-pointer flex flex-col items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <div className="w-16 h-16 rounded-full bg-white text-[#8a1c84] border border-purple-200/80 shadow-xs flex items-center justify-center group-hover:scale-105 group-hover:border-purple-300 transition-all shrink-0">
                      <ImageIcon size={28} />
                    </div>
                    <span className="font-headline font-extrabold text-xs sm:text-sm uppercase tracking-wider text-zinc-800 group-hover:text-[#8a1c84]">
                      GALLERY
                    </span>
                  </button>

                  {/* Camera Card */}
                  <button
                    type="button"
                    onClick={handleRequestCameraPermission}
                    className="py-6 px-4 rounded-[22px] border border-purple-100 bg-purple-50/40 hover:bg-purple-100/60 hover:border-purple-300 transition-all text-center group cursor-pointer flex flex-col items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <div className="w-16 h-16 rounded-full bg-white text-[#8a1c84] border border-purple-200/80 shadow-xs flex items-center justify-center group-hover:scale-105 group-hover:border-purple-300 transition-all shrink-0">
                      <Camera size={28} />
                    </div>
                    <span className="font-headline font-extrabold text-xs sm:text-sm uppercase tracking-wider text-zinc-800 group-hover:text-[#8a1c84]">
                      CAMERA
                    </span>
                  </button>
                </div>

                {/* Full Width Lavender Cancel Button */}
                <button
                  type="button"
                  onClick={handleCloseVisualSearch}
                  className="w-full bg-purple-100/70 hover:bg-purple-200/80 text-[#8a1c84] font-headline font-black text-xs uppercase tracking-wider py-4 rounded-2xl transition-all cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            )}

            {/* 2. CAMERA PERMISSION MODE */}
            {visualMode === 'permission' && (
              <div className="text-center space-y-4 py-2">
                <div className="w-14 h-14 bg-purple-50 text-[#8a1c84] rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-purple-200">
                  <ShieldCheck size={28} />
                </div>

                <div>
                  <h3 className="text-base font-black tracking-tight text-zinc-900 font-headline uppercase">
                    CAMERA ACCESS PERMISSION
                  </h3>
                  <p className="text-zinc-600 text-xs font-body mt-1.5 leading-relaxed max-w-xs mx-auto">
                    GM Fashions requires permission to access your device camera to capture photos for product search.
                  </p>
                </div>

                {permissionError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-start gap-2 text-left">
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                    <span className="leading-tight">{permissionError}</span>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => nativeCameraInputRef.current?.click()}
                    className="w-full bg-[#8a1c84] hover:bg-[#771672] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all cursor-pointer font-headline flex items-center justify-center gap-2"
                  >
                    <Camera size={16} />
                    <span>SNAP PHOTO WITH CAMERA</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRequestCameraPermission}
                    className="w-full bg-purple-50 hover:bg-purple-100 text-[#8a1c84] font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer font-headline flex items-center justify-center gap-2 border border-purple-200"
                  >
                    <Video size={15} />
                    <span>RETRY LIVE PREVIEW STREAM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer font-headline flex items-center justify-center gap-2"
                  >
                    <ImageIcon size={16} className="text-zinc-500" />
                    <span>CHOOSE FROM GALLERY</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisualMode('select')}
                    className="text-[11px] font-bold text-zinc-400 hover:text-zinc-700 pt-1 cursor-pointer block mx-auto"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {/* 3. LIVE CAMERA VIEW */}
            {visualMode === 'camera' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-900 font-headline flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    LIVE CAMERA PREVIEW
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setVisualMode('select');
                    }}
                    className="text-[10px] font-bold text-zinc-500 hover:text-zinc-900 uppercase"
                  >
                    Back
                  </button>
                </div>

                <div className="relative aspect-[4/3] w-full rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center shadow-inner">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Camera viewfinder corners overlay */}
                  <div className="absolute inset-4 border-2 border-white/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                    <div className="flex justify-between">
                      <div className="w-4 h-4 border-t-2 border-l-2 border-white" />
                      <div className="w-4 h-4 border-t-2 border-r-2 border-white" />
                    </div>
                    <div className="flex justify-between">
                      <div className="w-4 h-4 border-b-2 border-l-2 border-white" />
                      <div className="w-4 h-4 border-b-2 border-r-2 border-white" />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="w-full bg-[#8a1c84] hover:bg-[#771672] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all cursor-pointer font-headline flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Camera size={18} />
                  <span>CAPTURE PHOTO & SEARCH</span>
                </button>
              </div>
            )}

            {/* 4. SCANNING IMAGE MODE */}
            {visualMode === 'scanning' && (
              <div className="text-center space-y-4 py-1">
                <div className="relative aspect-[4/3] w-full rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center shadow-lg">
                  {capturedImage && (
                    <img
                      src={capturedImage}
                      alt="Captured search item"
                      className="w-full h-full object-cover opacity-80"
                    />
                  )}

                  {/* Scanning laser line animation */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500 shadow-[0_0_15px_#a855f7] animate-[scan_2s_infinite_ease-in-out]" />

                  <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-2 p-4">
                    <RefreshCw size={28} className="animate-spin text-purple-400" />
                    <span className="text-xs uppercase tracking-widest font-black font-headline text-white drop-shadow-md">
                      SCANNING FASHION DETAILS...
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-500 font-medium font-body">
                  Analyzing image features to match GM Fashions catalog...
                </p>
              </div>
            )}
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

      {/* Quick Search Modal Overlay */}
      {isSearchModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[200] flex items-start justify-center pt-16 sm:pt-20 px-4 animate-in fade-in duration-200"
          onClick={() => setIsSearchModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-lg p-5 shadow-2xl border border-zinc-200/80 animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-900 font-headline flex items-center gap-2">
                <Search size={16} className="text-zinc-900" />
                Search GM Fashions
              </span>
              <button 
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                handleSearchSubmit(e);
                setIsSearchModalOpen(false);
              }}
              className="relative w-full p-[1.5px] rounded-xl shadow-xs"
              style={{
                backgroundImage: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #10b981, #f59e0b, #ec4899)',
                backgroundSize: '200% auto',
                animation: 'borderShine 4s linear infinite'
              }}
            >
              <div className="bg-white rounded-[10px] flex items-center p-1.5">
                <Search size={18} className="text-zinc-400 ml-2 mr-2 shrink-0" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={dynamicPlaceholder}
                  className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 focus:outline-none font-body py-1.5 placeholder-zinc-400 font-medium"
                  autoFocus
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-zinc-400 hover:text-zinc-700 mr-1 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    setIsVisualSearchOpen(true);
                  }}
                  className="p-1.5 text-zinc-500 hover:text-zinc-900 transition-colors mr-1 cursor-pointer flex items-center justify-center rounded-lg hover:bg-zinc-100 shrink-0"
                  title="Search by Camera"
                >
                  <Camera size={16} />
                </button>
              </div>
            </form>

            {/* Popular Quick Searches */}
            <div className="mt-4 pt-3 border-t border-zinc-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Popular Categories & Keywords
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Shirt', 'T-Shirt', 'Jeans', 'Track Pant', 'Shorts', 'Dhoti', 'Vest', 'Combo'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      navigate(`/products?search=${encodeURIComponent(term)}`);
                      setIsSearchModalOpen(false);
                    }}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-700 transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
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

