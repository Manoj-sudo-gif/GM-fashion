import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Wallet, Banknote, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  ShieldCheck, RotateCcw, Trash2, CheckCircle2, ShoppingBag, Truck, MapPin, Sparkles, 
  Tag, Plus, Minus, AlertCircle, X, Package, Award, Heart, ShoppingCart, Sparkle
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import emptyCartStickerImg from '../assets/images/empty_cart_sticker_1785316800183.jpg';
import { useLanguage } from '../context/LanguageContext';

interface CartItem {
  id: number;
  name: string;
  price: string;
  priceVal: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  brand?: string;
}

export interface SavedAddress {
  id: string;
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  zipCode: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useLanguage();

  // Step 1 = Review Your Order, Step 2 = Payment Method
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Cart & Order State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOrdered, setIsOrdered] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [isDirectBuy, setIsDirectBuy] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Price details accordion toggle
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  // Coupon State
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Saved Addresses List (Persisted in localStorage)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    try {
      const local = localStorage.getItem('gm_saved_addresses');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

  // Session OTP verification state
  const [hasVerifiedSessionOtp, setHasVerifiedSessionOtp] = useState(false);

  // Auto-select / pre-fill address from user context or localStorage when entering checkout
  useEffect(() => {
    try {
      const local = localStorage.getItem('gm_saved_addresses');
      let addressesList: SavedAddress[] = [];
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) addressesList = parsed;
      }
      setSavedAddresses(addressesList);

      if (user && user.isLoggedIn) {
        // User logged in from Account page: pre-fill customer details immediately!
        const defaultName = user.name || (addressesList[0]?.fullName) || 'GM Customer';
        const defaultPhone = user.phone || (addressesList[0]?.phoneNumber) || '';
        const defaultStreet = (addressesList[0]?.streetAddress) || 'No. 12, Main Street, Karur';
        const defaultZip = (addressesList[0]?.zipCode) || '639001';

        setFullName(defaultName);
        setPhoneNumber(defaultPhone);
        setStreetAddress(defaultStreet);
        setZipCode(defaultZip);
        if (addressesList[0]?.id) setSelectedAddressId(addressesList[0].id);
        setIsAddressVerified(true);
      } else {
        // Logged out / Guest user
        if (addressesList.length > 0) {
          const first = addressesList[0];
          setSelectedAddressId(first.id);
          setFullName(first.fullName || '');
          setPhoneNumber(first.phoneNumber || '');
          setStreetAddress(first.streetAddress || '');
          setZipCode(first.zipCode || '639001');
          setIsAddressVerified(true);
        } else {
          setFullName('');
          setPhoneNumber('');
          setStreetAddress('');
          setZipCode('');
          setIsAddressVerified(false);
        }
      }
    } catch (e) {}
  }, [user]);

  // Address Editing & Selection State (Empty fields by default)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [modalStep, setModalStep] = useState<'address' | 'otp'>('address');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // OTP Verification State
  const [generatedOtp, setGeneratedOtp] = useState('4829');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Timer countdown for OTP resend
  useEffect(() => {
    let timer: any = null;
    if (modalStep === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [modalStep, resendTimer]);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [onlineType, setOnlineType] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');

  // Fixed Instant Offer Discount Amount for Online Pay
  const DISCOUNT_OFFER = 60;

  // Load single product or full cart
  useEffect(() => {
    // 1. Check if passed directly via location state (Buy Now)
    const directBuyItem = location.state?.buyNowItem;
    if (directBuyItem) {
      setCartItems([directBuyItem]);
      setIsDirectBuy(true);
      return;
    }

    // 2. Check if saved in sessionStorage for single product direct buy
    const sessionDirect = sessionStorage.getItem('direct_buy_item');
    if (sessionDirect) {
      try {
        const item = JSON.parse(sessionDirect);
        setCartItems([item]);
        setIsDirectBuy(true);
        return;
      } catch (e) {
        // ignore error
      }
    }

    // 3. Fallback to standard shopping bag cart
    setIsDirectBuy(false);
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCartItems(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [location.state]);

  // Sync cart to localStorage when changed
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    if (!isDirectBuy) {
      localStorage.setItem('cart', JSON.stringify(items));
      window.dispatchEvent(new Event('storage'));
    }
  };

  // Quantity updates
  const handleUpdateQuantity = (id: number, size: string, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.id === id && item.size === size) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];

    saveCart(updated);
  };

  // Remove item from cart
  const handleRemoveItem = (id: number, size: string) => {
    const updated = cartItems.filter(item => !(item.id === id && item.size === size));
    saveCart(updated);
  };

  // Move item from cart to wishlist
  const handleMoveToWishlist = (item: CartItem) => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const exists = wishlist.some((w: any) => w.id === item.id);
      if (!exists) {
        const updatedWishlist = [
          ...wishlist,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            priceVal: item.priceVal,
            image: item.image,
            category: 'Fashion',
            gender: 'Women'
          }
        ];
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      }
      
      // Remove item from cart
      const updated = cartItems.filter(c => !(c.id === item.id && c.size === item.size));
      saveCart(updated);
      window.dispatchEvent(new Event('storage'));

      setToastMessage(`Moved "${item.name}" to Wishlist!`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Error moving item to wishlist:', err);
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.priceVal * item.quantity), 0);
  const originalMRP = Math.round(subtotal * 1.3); // Simulated original MRP
  const mrpDiscount = originalMRP - subtotal;
  
  // Coupon Discount (Flat ₹100 for GM123)
  const couponDiscount = appliedCoupon ? 100 : 0;
  const subtotalAfterCoupon = Math.max(0, subtotal - couponDiscount);

  // Conditional discount applies ONLY when Pay Online is selected
  const appliedDiscount = paymentMethod === 'online' ? DISCOUNT_OFFER : 0;
  const finalTotal = Math.max(0, subtotalAfterCoupon - appliedDiscount);

  // Coupon Handlers
  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }

    if (code === 'GM123') {
      setAppliedCoupon('GM123');
      setCouponError(null);
      setShowCouponModal(false);
      setToastMessage('🎉 Coupon GM123 applied! You saved ₹100.');
      setTimeout(() => setToastMessage(null), 3500);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 9999
        });
      } catch (e) {
        // ignore
      }
    } else {
      setCouponError('Invalid coupon code! Check our Instagram page for secret codes.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setToastMessage('Coupon removed.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Pincode-based Expected Delivery Date Calculation
  const getDeliveryDateForPincode = (pincodeVal: string) => {
    const date = new Date();
    // South Indian pincodes starting with 6 (Tamil Nadu, Kerala, etc.) -> 3 days, others -> 5 days
    const deliveryDays = pincodeVal.startsWith('6') ? 3 : 5;
    date.setDate(date.getDate() + deliveryDays);

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNum = date.getDate();
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });

    const getSuffix = (d: number) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return `${dayName}, ${dayNum}${getSuffix(dayNum)} ${monthName}`;
  };

  // Select a Saved Address -> Triggers OTP confirmation
  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setFullName(addr.fullName);
    setPhoneNumber(addr.phoneNumber);
    setStreetAddress(addr.streetAddress);
    setZipCode(addr.zipCode);
    setSelectedAddressId(addr.id);

    setFormError(null);
    const newOtp = '4829';
    setGeneratedOtp(newOtp);
    setOtpDigits(['', '', '', '']);
    setOtpError(null);
    setResendTimer(30);
    setModalStep('otp');
    setToastMessage(`OTP sent to +91 ${addr.phoneNumber}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Delete a Saved Address
  const handleDeleteSavedAddress = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedAddresses(prev => {
      const updated = prev.filter(a => a.id !== id);
      try {
        localStorage.setItem('gm_saved_addresses', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
    if (selectedAddressId === id) {
      setSelectedAddressId(null);
      setFullName('');
      setPhoneNumber('');
      setStreetAddress('');
      setZipCode('');
      setIsAddressVerified(false);
    }
  };

  // Address Save -> Triggers OTP Verification
  const handleSaveAddressClick = () => {
    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 10) {
      setFormError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!streetAddress.trim()) {
      setFormError('Please enter your street address.');
      return;
    }
    if (!zipCode.trim() || zipCode.trim().length < 6) {
      setFormError('Please enter a valid 6-digit pincode.');
      return;
    }

    setFormError(null);
    const newOtp = '4829';
    setGeneratedOtp(newOtp);
    setOtpDigits(['', '', '', '']);
    setOtpError(null);
    setResendTimer(30);
    setModalStep('otp');
    setToastMessage(`OTP sent to +91 ${phoneNumber}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // OTP Digit Input Handlers
  const handleOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtpError(null);

    if (digit && index < 3) {
      const nextEl = document.getElementById(`otp-input-${index + 1}`);
      if (nextEl) nextEl.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevEl = document.getElementById(`otp-input-${index - 1}`);
      if (prevEl) prevEl.focus();
    }
  };

  const handleVerifyOtpClick = () => {
    const enteredCode = otpDigits.join('');
    if (enteredCode === generatedOtp || enteredCode === '4829' || enteredCode.length === 4) {
      setIsAddressVerified(true);
      setHasVerifiedSessionOtp(true);
      setShowAddressModal(false);
      setModalStep('address');

      const newId = `addr_${Date.now()}`;
      const newAddress: SavedAddress = {
        id: newId,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        streetAddress: streetAddress.trim(),
        zipCode: zipCode.trim()
      };

      setSelectedAddressId(newId);

      setSavedAddresses(prev => {
        const exists = prev.some(a => a.phoneNumber === newAddress.phoneNumber && a.streetAddress === newAddress.streetAddress);
        if (!exists) {
          const updated = [newAddress, ...prev];
          try {
            localStorage.setItem('gm_saved_addresses', JSON.stringify(updated));
          } catch (err) {}
          return updated;
        }
        return prev;
      });

      setToastMessage('Mobile number & delivery details verified!');
      setTimeout(() => setToastMessage(null), 3000);
      setCurrentStep(2);
    } else {
      setOtpError(`Invalid OTP. Please enter ${generatedOtp}`);
    }
  };

  const handleResendOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setResendTimer(30);
    setOtpDigits(['', '', '', '']);
    setOtpError(null);
    setToastMessage(`New OTP sent to +91 ${phoneNumber}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Format currency
  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Trigger colorful paper / confetti burst from top two corners & bottom two corners
  const triggerCornerConfetti = () => {
    const confettiColors = ['#a855f7', '#ec4899', '#3b82f6', '#eab308', '#22c55e', '#f97316', '#8b5cf6'];

    // Top-Left Corner
    confetti({
      particleCount: 60,
      angle: 315,
      spread: 70,
      origin: { x: 0, y: 0 },
      colors: confettiColors,
      zIndex: 9999
    });

    // Top-Right Corner
    confetti({
      particleCount: 60,
      angle: 225,
      spread: 70,
      origin: { x: 1, y: 0 },
      colors: confettiColors,
      zIndex: 9999
    });

    // Bottom-Left Corner
    confetti({
      particleCount: 60,
      angle: 45,
      spread: 70,
      origin: { x: 0, y: 1 },
      colors: confettiColors,
      zIndex: 9999
    });

    // Bottom-Right Corner
    confetti({
      particleCount: 60,
      angle: 135,
      spread: 70,
      origin: { x: 1, y: 1 },
      colors: confettiColors,
      zIndex: 9999
    });

    // Second celebratory wave
    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 300,
        spread: 80,
        origin: { x: 0.05, y: 0.1 },
        colors: confettiColors,
        zIndex: 9999
      });
      confetti({
        particleCount: 45,
        angle: 240,
        spread: 80,
        origin: { x: 0.95, y: 0.1 },
        colors: confettiColors,
        zIndex: 9999
      });
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 80,
        origin: { x: 0.05, y: 0.9 },
        colors: confettiColors,
        zIndex: 9999
      });
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 80,
        origin: { x: 0.95, y: 0.9 },
        colors: confettiColors,
        zIndex: 9999
      });
    }, 280);
  };

  // Complete Order
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    const orderId = "GMF-" + Math.floor(100000 + Math.random() * 900000);
    const orderObj = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      estimatedDelivery: getDeliveryDateForPincode(zipCode),
      items: [...cartItems],
      subtotal,
      couponDiscount,
      appliedCoupon,
      discount: appliedDiscount,
      total: finalTotal,
      paymentMethod: paymentMethod === 'online' ? 'Pay Online (₹60 Instant Off)' : 'Cash on Delivery (COD)',
      createdAt: Date.now(),
      status: 'Order Placed',
      phone: phoneNumber,
      address: {
        name: fullName,
        phone: phoneNumber,
        street: streetAddress,
        zip: zipCode
      }
    };

    try {
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([orderObj, ...existingOrders]));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Failed to save order:', err);
    }

    // Clear cart or direct buy state
    sessionStorage.removeItem('direct_buy_item');
    if (!isDirectBuy) {
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('storage'));
    }

    setCreatedOrder(orderObj);
    setIsOrdered(true);
    triggerCornerConfetti();
  };

  // EMPTY CART VIEW
  if (cartItems.length === 0 && !isOrdered) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50/60 via-zinc-50 to-zinc-50 flex flex-col justify-between items-center px-4 py-6 text-center select-none">
        {/* Top Header with < CART back button */}
        <div className="w-full max-w-md flex items-center justify-start">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-zinc-950 font-black text-lg sm:text-xl hover:text-[#8a1c84] transition-colors cursor-pointer py-1"
          >
            <ChevronLeft size={24} strokeWidth={3} />
            <span className="font-headline tracking-wider uppercase">CART</span>
          </button>
        </div>

        {/* Vibrant 3D Sticker Bag Illustration Container */}
        <div className="my-auto py-4 flex flex-col items-center max-w-sm w-full">
          <motion.div 
            initial={{ scale: 0.85, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative mb-8 cursor-pointer group"
            onClick={() => {
              confetti({
                particleCount: 40,
                spread: 60,
                origin: { y: 0.45 },
                colors: ['#8a1c84', '#f59e0b', '#ec4899', '#3b82f6']
              });
            }}
          >
            {/* Soft Ambient Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-300 via-[#8a1c84] to-pink-400 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
            
            {/* Main Sticker Frame with Die-Cut White Outline & Shadow */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-white p-3 rounded-[36px] shadow-2xl border-4 border-white transform -rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300 ring-1 ring-zinc-200/60">
              
              {/* Sticker Inner Image */}
              <div className="w-full h-full rounded-[28px] overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 relative flex items-center justify-center">
                <img 
                  src={emptyCartStickerImg} 
                  alt="Empty Cart Fashion Sticker" 
                  className="w-full h-full object-cover transform scale-105 transition-transform group-hover:scale-110 duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid Decorative Sparkle Badge */}
                <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs p-1.5 rounded-full shadow-md text-amber-500 animate-bounce">
                  <Sparkles size={16} strokeWidth={2.5} />
                </div>

                {/* Overlaid Bottom Sticker Tag */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-zinc-950/90 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border border-white/20 whitespace-nowrap flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  CART IS EMPTY
                </div>
              </div>
            </div>

            {/* Floating Side Badge Sticker 1 */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -top-3 -left-4 bg-amber-400 text-zinc-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border-2 border-white rotate-[-12deg] tracking-wider uppercase font-headline"
            >
              🛍️ SHOP TIME!
            </motion.div>

            {/* Floating Side Badge Sticker 2 */}
            <motion.div 
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-2 -right-4 bg-[#8a1c84] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white rotate-[8deg] tracking-wider uppercase font-headline flex items-center gap-1"
            >
              <Sparkle size={12} className="text-amber-300 fill-amber-300" />
              NEW ARRIVALS
            </motion.div>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 uppercase font-headline tracking-tight">
            Your Cart is Empty
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xs mt-2 mb-7 leading-relaxed font-medium">
            Looks like you haven't added anything yet! Explore our fresh trendy collections and fill your bag.
          </p>

          <button
            type="button"
            onClick={() => navigate('/products')}
            className="w-full bg-gradient-to-r from-[#8a1c84] via-purple-700 to-pink-600 hover:from-[#761571] hover:to-pink-700 text-white font-black text-xs sm:text-sm uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-purple-900/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 group"
          >
            <ShoppingCart size={18} className="group-hover:translate-x-0.5 transition-transform" />
            <span>START SHOPPING NOW</span>
          </button>
        </div>

        <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-2">
          <span>100% Genuine Products</span>
          <span>•</span>
          <span>Fast Delivery</span>
          <span>•</span>
          <span>Easy Returns</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100/70 text-zinc-900 font-sans pb-28">
      
      {/* 1. TOP HEADER (REVIEW YOUR ORDER | STEP 1/2) */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => {
              if (currentStep === 2) {
                setCurrentStep(1);
              } else {
                sessionStorage.removeItem('direct_buy_item');
                navigate(-1);
              }
            }}
            className="p-1 text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer flex items-center gap-0.5 font-black text-xs sm:text-sm"
            title="Back to Cart"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
            <span className="font-headline tracking-wider text-xs sm:text-sm">CART</span>
          </button>

          <span className="text-zinc-300 font-light mx-1">|</span>

          <h1 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-zinc-900 font-headline">
            {currentStep === 1 ? 'REVIEW YOUR ORDER' : 'SELECT PAYMENT METHOD'}
          </h1>
        </div>

        {/* Step Indicator Pill */}
        <span className="bg-purple-50 text-[#8a1c84] font-extrabold text-[11px] px-3 py-1 rounded-full border border-purple-200/60 tracking-wider">
          {currentStep === 1 ? 'STEP 1/2' : 'STEP 2/2'}
        </span>
      </header>

      {/* 2. STEP 1: REVIEW YOUR ORDER UI (Matching Reference Image) */}
      {currentStep === 1 && (
        <main className="max-w-xl mx-auto space-y-3 pt-3">
          <div className="px-3 sm:px-4 space-y-3">
            {/* Product List Card */}
            <div className="bg-white rounded-xl border border-zinc-200/80 shadow-2xs overflow-hidden divide-y divide-zinc-100">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="p-3.5">
                  <div className="flex gap-3.5 items-start">
                    {/* Item Image */}
                    <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200/60">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 line-clamp-2 leading-snug">
                          {item.name}
                        </h3>
                        <ChevronRight size={18} className="text-zinc-400 shrink-0 mt-0.5" />
                      </div>

                      {/* Price Row */}
                      <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
                        <span className="text-sm sm:text-base font-extrabold text-zinc-950">
                          {item.price}
                        </span>
                        <span className="text-xs text-zinc-400 line-through font-normal">
                          ₹{Math.round(item.priceVal * 1.3)}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-extrabold">
                          23% Off
                        </span>
                      </div>

                      {/* Size & Qty Row */}
                      <div className="flex items-center justify-between mt-2.5 text-xs text-zinc-600 font-medium flex-wrap gap-2">
                        <span>Size: <strong className="text-zinc-900 font-bold">{item.size}</strong></span>

                        {/* Quantity Adjuster */}
                        <div className="flex items-center gap-1 bg-zinc-100/80 rounded-lg p-0.5 border border-zinc-200/60">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, item.size, -1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-zinc-800 shadow-2xs hover:bg-zinc-200 transition-colors cursor-pointer"
                            title="Decrease Quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-5 text-center font-black text-zinc-900 text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, item.size, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-zinc-800 shadow-2xs hover:bg-zinc-200 transition-colors cursor-pointer"
                            title="Increase Quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seller Info & Action Buttons Footer */}
                  <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-medium flex-wrap gap-2">
                    <span>
                      Sold by: <span className="text-zinc-800 font-semibold">{item.brand || 'The Goodlly'}</span>
                    </span>

                    {/* Only show Move to Wishlist & Remove options for items added via Add to Cart */}
                    {!isDirectBuy && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleMoveToWishlist(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black text-zinc-700 hover:text-[#8a1c84] bg-zinc-50 hover:bg-purple-50 rounded-lg border border-zinc-200 hover:border-purple-200 transition-all cursor-pointer font-headline uppercase"
                        >
                          <Heart size={13} className="text-[#8a1c84] fill-purple-100" />
                          <span>Move to Wishlist</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id, item.size)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black text-zinc-700 hover:text-rose-600 bg-zinc-50 hover:bg-rose-50 rounded-lg border border-zinc-200 hover:border-rose-200 transition-all cursor-pointer font-headline uppercase"
                        >
                          <Trash2 size={13} className="text-rose-500" />
                          <span>Remove</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Estimated Delivery & Address Card */}
            <div className="bg-white rounded-xl border border-zinc-200/80 p-4 shadow-2xs space-y-3">
              {isAddressVerified && fullName.trim() ? (
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-[#8a1c84] shrink-0" />
                      <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 uppercase font-headline">
                        DELIVERY ADDRESS
                      </h3>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase rounded-full border border-emerald-200 font-headline">
                        Verified
                      </span>
                    </div>

                    <div className="text-xs text-zinc-700 pl-6 space-y-1 pt-0.5">
                      <p className="font-bold text-zinc-900">
                        {fullName} <span className="text-zinc-400 font-normal">•</span> +91 {phoneNumber}
                      </p>
                      <p className="text-zinc-500 leading-snug">
                        {streetAddress}, Pincode: <strong className="text-zinc-900 font-bold">{zipCode}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setModalStep('address');
                      setShowAddressModal(true);
                    }}
                    className="px-3 py-1.5 border border-zinc-300 hover:border-zinc-900 rounded-lg text-xs font-bold text-zinc-800 hover:bg-zinc-50 transition-all cursor-pointer shrink-0 font-headline uppercase"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 py-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#8a1c84] flex items-center justify-center shrink-0 border border-purple-100">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-zinc-900 uppercase font-headline">
                        SELECT ADDRESS
                      </h3>
                      <p className="text-[11px] text-zinc-500 font-medium">
                        {savedAddresses.length > 0
                          ? `${savedAddresses.length} saved address(es) available`
                          : 'Add delivery address to proceed'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setModalStep('address');
                      setShowAddressModal(true);
                    }}
                    className="px-4 py-2 bg-[#8a1c84] hover:bg-[#771672] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-2xs active:scale-[0.98] cursor-pointer font-headline shrink-0"
                  >
                    Select Address
                  </button>
                </div>
              )}

              {/* Expected Delivery Date Banner (Based on Pincode if pincode available) */}
              <div className="pt-2.5 border-t border-zinc-100 flex items-center gap-3 bg-purple-50/60 p-3 rounded-xl border border-purple-100/80">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#8a1c84] flex items-center justify-center shrink-0">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-zinc-900 font-headline uppercase">
                    Expected Delivery: <span className="text-[#8a1c84]">{getDeliveryDateForPincode(zipCode || '637211')}</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                    Delivering to pincode <strong className="text-zinc-700">{zipCode || 'Standard delivery'}</strong> ({!zipCode || zipCode.startsWith('6') ? '2-3' : '4-5'} Business Days)
                  </p>
                </div>
              </div>
            </div>

            {/* APPLY COUPON BANNER (16:1 ratio theme banner) */}
            {!appliedCoupon ? (
              <button
                type="button"
                onClick={() => {
                  setCouponError(null);
                  setShowCouponModal(true);
                }}
                className="w-full h-12 sm:h-14 rounded-xl bg-gradient-to-r from-[#8a1c84] via-purple-700 to-pink-600 hover:from-[#771672] hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer flex items-center justify-between px-4 sm:px-5 relative overflow-hidden group border border-purple-400/40"
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="flex items-center gap-2.5 z-10">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 shrink-0">
                    <Tag size={16} className="text-amber-300" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider block font-headline text-white">
                      APPLY COUPON
                    </span>
                    <span className="text-[10px] text-purple-100 font-medium block">
                      Instagram Code: Use <strong className="text-amber-300 font-bold underline">gm123</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 z-10">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wide bg-amber-400 text-zinc-950 px-2.5 py-1 rounded-full shadow-2xs">
                    GET ₹100 OFF
                  </span>
                  <ChevronRight size={18} className="text-white/80 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ) : (
              <div className="w-full rounded-xl bg-emerald-50/90 border-2 border-emerald-500/80 p-3 sm:p-3.5 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wide text-emerald-950 bg-emerald-200/90 px-2 py-0.5 rounded font-mono">
                        {appliedCoupon}
                      </span>
                      <span className="text-[11px] font-extrabold text-emerald-700 uppercase">APPLIED</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                      🎉 Extra ₹100 OFF applied to your cart!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-all cursor-pointer shrink-0"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Price Details Card */}
            <div className="bg-white rounded-xl border border-zinc-200/80 shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={() => setShowPriceDetails(!showPriceDetails)}
                className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-zinc-50 transition-colors"
              >
                <span className="text-xs sm:text-sm font-extrabold text-zinc-900">
                  Price Details
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-zinc-950">
                    {formatCurrency(subtotalAfterCoupon)}
                  </span>
                  {couponDiscount > 0 && (
                    <span className="bg-purple-100 text-[#8a1c84] text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                      ₹100 OFF
                    </span>
                  )}
                  {showPriceDetails ? <ChevronUp size={18} className="text-zinc-500" /> : <ChevronDown size={18} className="text-zinc-500" />}
                </div>
              </button>

              {/* Collapsible Details */}
              {showPriceDetails && (
                <div className="px-4 pb-4 pt-1 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
                  <div className="flex justify-between">
                    <span>Product Total MRP</span>
                    <span>{formatCurrency(originalMRP)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount on MRP</span>
                    <span>- {formatCurrency(mrpDiscount)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-[#8a1c84] font-extrabold bg-purple-50/80 p-2 rounded-lg border border-purple-100">
                      <span className="flex items-center gap-1.5">
                        <Tag size={13} className="text-[#8a1c84]" />
                        <span>Coupon Discount ({appliedCoupon})</span>
                      </span>
                      <span>- {formatCurrency(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-600 font-bold uppercase">FREE</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-100 flex justify-between font-black text-sm text-zinc-950">
                    <span>Subtotal Payable</span>
                    <span>{formatCurrency(subtotalAfterCoupon)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Trust Badges Card */}
            <div className="bg-white rounded-xl border border-zinc-200/80 p-3.5 shadow-2xs grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs font-bold text-zinc-700">
              <div className="flex flex-col items-center gap-1 p-1">
                <RotateCcw size={18} className="text-purple-700" />
                <span className="underline decoration-zinc-300 underline-offset-2">7 Days Easy Return</span>
              </div>

              <div className="flex flex-col items-center gap-1 p-1 border-x border-zinc-100">
                <Banknote size={18} className="text-emerald-700" />
                <span>Cash on Delivery</span>
              </div>

              <div className="flex flex-col items-center gap-1 p-1">
                <Tag size={18} className="text-rose-600" />
                <span>Lowest Price</span>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Bar for Step 1 */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200/90 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-zinc-900 tracking-tight font-sans">
                    {formatCurrency(subtotalAfterCoupon)}
                  </span>
                  {couponDiscount > 0 && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                      SAVED ₹100
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowPriceDetails(!showPriceDetails)}
                  className="text-[11px] font-bold uppercase tracking-wide text-[#8a1c84] hover:underline cursor-pointer block mt-0.5 text-left"
                >
                  VIEW PRICE DETAILS
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!fullName.trim() || !phoneNumber.trim() || !streetAddress.trim() || !zipCode.trim() || !isAddressVerified) {
                    setModalStep('address');
                    setShowAddressModal(true);
                  } else if (!hasVerifiedSessionOtp) {
                    // Pre-filled customer details are ready, ask for OTP verification for the consulting phone number
                    const newOtp = '4829';
                    setGeneratedOtp(newOtp);
                    setOtpDigits(['', '', '', '']);
                    setOtpError(null);
                    setResendTimer(30);
                    setModalStep('otp');
                    setShowAddressModal(true);
                    setToastMessage(`OTP sent to mobile +91 ${phoneNumber}`);
                    setTimeout(() => setToastMessage(null), 3000);
                  } else {
                    setCurrentStep(2);
                  }
                }}
                className="bg-[#8a1c84] hover:bg-[#771672] text-white py-3 px-8 rounded-xl font-bold text-sm tracking-wide transition-all shadow-xs active:scale-[0.98] cursor-pointer font-headline uppercase"
              >
                Continue
              </button>
            </div>
          </div>
        </main>
      )}

      {/* 3. STEP 2: PAYMENT METHOD & CONDITIONAL OFFERS */}
      {currentStep === 2 && (
        <main className="max-w-xl mx-auto px-3 sm:px-4 space-y-3 pt-3">
          
          {/* Address Review Summary Banner */}
          <div className="bg-white rounded-xl border border-zinc-200/80 p-3.5 shadow-2xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <MapPin size={18} className="text-[#8a1c84] shrink-0" />
              <div className="text-xs">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Delivering To:</span>
                <p className="font-extrabold text-zinc-900">{fullName} (+91 {phoneNumber})</p>
                <p className="text-zinc-500 font-medium truncate max-w-xs text-[11px]">{streetAddress}, Pincode: {zipCode}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs font-bold text-[#8a1c84] underline cursor-pointer shrink-0 font-headline uppercase"
            >
              Change
            </button>
          </div>

          {/* Payment Method Options Container */}
          <div className="bg-white rounded-xl border border-zinc-200/80 p-4 shadow-2xs space-y-4">
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-900 pb-2 border-b border-zinc-100">
              Choose Payment Method
            </h2>

            {/* Option 1: PAY ONLINE (CONDITIONAL ₹60 DISCOUNT APPLIED) */}
            <div 
              onClick={() => setPaymentMethod('online')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                paymentMethod === 'online'
                  ? 'border-purple-700 bg-purple-50/20'
                  : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'online' ? 'border-purple-700 bg-purple-700' : 'border-zinc-300'
                  }`}>
                    {paymentMethod === 'online' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-extrabold text-zinc-950">
                        Pay Online (UPI / Cards)
                      </h3>
                      {/* Offer tag ONLY shown for Pay Online */}
                      {paymentMethod === 'online' && (
                        <span className="text-[10px] bg-rose-500 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                          ₹60 EXTRA OFF
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                      Instant discount applies automatically on online payment
                    </p>
                  </div>
                </div>

                <Wallet size={20} className="text-zinc-600 shrink-0" />
              </div>

              {/* UPI Sub-option Input */}
              {paymentMethod === 'online' && (
                <div className="mt-3 pt-3 border-t border-zinc-100 space-y-2">
                  <input 
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="Enter UPI ID (e.g. 9876543210@upi or GPay)"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-700"
                  />
                </div>
              )}
            </div>

            {/* Option 2: CASH ON DELIVERY (NO ONLINE OFFERS) */}
            <div 
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                paymentMethod === 'cod'
                  ? 'border-purple-700 bg-purple-50/20'
                  : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'cod' ? 'border-purple-700 bg-purple-700' : 'border-zinc-300'
                  }`}>
                    {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-zinc-950">
                      Cash on Delivery (COD)
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                      Pay cash when item is delivered
                    </p>
                  </div>
                </div>

                <Banknote size={20} className="text-zinc-600 shrink-0" />
              </div>

              {paymentMethod === 'cod' && (
                <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/60 mt-2.5 font-semibold">
                  Online discount of ₹60 is excluded for Cash on Delivery.
                </p>
              )}
            </div>
          </div>

          {/* Payment Summary Box */}
          <div className="bg-white rounded-xl border border-zinc-200/80 p-4 shadow-2xs space-y-2.5 text-xs text-zinc-600">
            <h3 className="font-extrabold text-zinc-950 uppercase tracking-wider text-xs pb-1 border-b border-zinc-100">
              Payment Breakdown
            </h3>
            
            <div className="flex justify-between">
              <span>Item Subtotal</span>
              <span className="font-bold text-zinc-900">{formatCurrency(subtotal)}</span>
            </div>

            {paymentMethod === 'online' ? (
              <div className="flex justify-between text-rose-600 font-extrabold bg-rose-50 p-1.5 rounded-md">
                <span>Online Offer Savings</span>
                <span>- ₹60</span>
              </div>
            ) : (
              <div className="text-[10px] text-zinc-400 font-medium italic text-right">
                (No online offer for Cash on Delivery)
              </div>
            )}

            <div className="pt-2 border-t border-zinc-100 flex justify-between items-baseline text-sm font-black text-zinc-950">
              <span>Total Amount</span>
              <span className="text-base text-emerald-700 font-headline">{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          {/* Sticky Bottom Bar for Step 2 */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200/90 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-zinc-900 tracking-tight font-sans">
                  {formatCurrency(finalTotal)}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPriceDetails(!showPriceDetails)}
                  className="text-[11px] font-bold uppercase tracking-wide text-[#8a1c84] hover:underline cursor-pointer block mt-0.5 text-left"
                >
                  VIEW PRICE DETAILS
                </button>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="bg-[#8a1c84] hover:bg-[#771672] text-white py-3 px-8 rounded-xl font-bold text-sm tracking-wide transition-all shadow-xs active:scale-[0.98] cursor-pointer flex items-center gap-2"
              >
                <span>Place Order</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* APPLY COUPON MODAL */}
      <AnimatePresence>
        {showCouponModal && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
              onClick={() => setShowCouponModal(false)}
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white w-full max-w-sm sm:max-w-md rounded-2xl shadow-2xl overflow-hidden border border-zinc-100 z-10 space-y-0"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#8a1c84] via-purple-700 to-pink-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white/20 backdrop-blur-xs rounded-xl border border-white/30">
                    <Tag size={18} className="text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider font-headline">Apply Coupon Code</h3>
                    <p className="text-[11px] text-purple-100 font-medium">Get instant discount on your order</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content Body */}
              <div className="p-5 space-y-4">
                {/* Instagram Offer Banner Callout */}
                <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-amber-50 p-3.5 rounded-xl border border-pink-200/80 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-[#8a1c84] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Tag size={18} />
                  </div>
                  <div className="text-xs">
                    <p className="font-extrabold text-zinc-900 flex items-center gap-1.5">
                      <span>📸 Instagram Exclusive Offer</span>
                    </p>
                    <p className="text-zinc-600 font-medium text-[11px] leading-relaxed mt-1">
                      We reveal special coupon codes on our Instagram page! Use active code <strong className="text-[#8a1c84] font-black underline bg-purple-100/80 px-1 py-0.5 rounded">gm123</strong> to enjoy <strong className="text-emerald-700 font-black">₹100 Instant Discount</strong>.
                    </p>
                  </div>
                </div>

                {/* Input & Apply Button */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wide text-zinc-700 block">
                    Enter Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleApplyCoupon();
                      }}
                      placeholder="e.g. GM123"
                      className="flex-1 uppercase font-mono tracking-wider font-black text-sm bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#8a1c84] focus:bg-white transition-all text-zinc-900 placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-zinc-400"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-[#8a1c84] hover:bg-[#771672] text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      Apply
                    </button>
                  </div>

                  {couponError && (
                    <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200/80 text-rose-700 text-xs font-bold flex items-center gap-1.5 mt-1">
                      <AlertCircle size={15} className="shrink-0 text-rose-600" />
                      <span>{couponError}</span>
                    </div>
                  )}
                </div>

                {/* Instant Tap Suggestion Box */}
                <div className="pt-2 border-t border-zinc-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block mb-2">
                    Available Active Coupon
                  </span>
                  <div 
                    onClick={() => {
                      setCouponInput('gm123');
                      setCouponError(null);
                    }}
                    className="p-3 bg-purple-50/80 hover:bg-purple-100 rounded-xl border border-purple-200 flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="bg-[#8a1c84] text-white font-mono font-black text-xs px-2.5 py-1 rounded-md tracking-wider">
                        GM123
                      </span>
                      <div>
                        <p className="text-xs font-extrabold text-zinc-900">Get Flat ₹100 OFF</p>
                        <p className="text-[10px] text-zinc-500 font-medium">Valid on all orders • Instagram special</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-[#8a1c84] group-hover:underline">
                      TAP TO FILL
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADDRESS EDITING & OTP MODAL */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => {
                if (isAddressVerified) setShowAddressModal(false);
              }}
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-zinc-100 z-10 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              {/* STEP 1: ADDRESS & MOBILE NUMBER FORM */}
              {modalStep === 'address' && (
                <>
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 font-headline">
                      SELECT OR ADD DELIVERY ADDRESS
                    </h3>
                    <button 
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="text-zinc-400 hover:text-zinc-900 p-1 rounded-full cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* 1. SAVED ADDRESSES SECTION (For Returning Users) */}
                  {savedAddresses.length > 0 && (
                    <div className="space-y-2 pt-1 pb-2 border-b border-zinc-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 font-headline">
                          SAVED ADDRESSES ({savedAddresses.length})
                        </span>
                        <span className="text-[10px] text-[#8a1c84] font-bold">Tap card to select</span>
                      </div>

                      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                        {savedAddresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.id || (fullName === addr.fullName && zipCode === addr.zipCode && streetAddress === addr.streetAddress);
                          return (
                            <div
                              key={addr.id}
                              onClick={() => handleSelectSavedAddress(addr)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer relative flex items-start justify-between gap-2.5 ${
                                isSelected 
                                  ? 'border-[#8a1c84] bg-purple-50/70 ring-2 ring-purple-500/20 shadow-xs' 
                                  : 'border-zinc-200 bg-zinc-50/70 hover:bg-white hover:border-zinc-300'
                              }`}
                            >
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-xs text-zinc-950">{addr.fullName}</span>
                                  <span className="text-[10px] font-bold text-zinc-500">• +91 {addr.phoneNumber}</span>
                                  {isSelected && (
                                    <span className="bg-[#8a1c84] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                                      Active
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-zinc-600 leading-tight">
                                  {addr.streetAddress}, Pincode: <strong className="text-zinc-800 font-bold">{addr.zipCode}</strong>
                                </p>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteSavedAddress(e, addr.id)}
                                  className="p-1 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete saved address"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. ADD NEW ADDRESS FORM */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 font-headline">
                        {savedAddresses.length > 0 ? 'OR ADD NEW ADDRESS' : 'ENTER DELIVERY ADDRESS'}
                      </span>
                    </div>

                    {formError && (
                      <div className="p-2.5 mb-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0 text-rose-600" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                          FULL NAME
                        </label>
                        <input 
                          type="text" 
                          value={fullName} 
                          onChange={e => { setFullName(e.target.value); setFormError(null); setSelectedAddressId(null); }}
                          placeholder="Enter full name"
                          className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl p-2.5 font-semibold text-zinc-900 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                          PHONE NUMBER
                        </label>
                        <input 
                          type="tel"
                          maxLength={10} 
                          value={phoneNumber} 
                          onChange={e => { setPhoneNumber(e.target.value.replace(/\D/g, '')); setFormError(null); setSelectedAddressId(null); }}
                          placeholder="10-digit mobile number"
                          className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl p-2.5 font-semibold text-zinc-900 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                          STREET ADDRESS
                        </label>
                        <input 
                          type="text" 
                          value={streetAddress} 
                          onChange={e => { setStreetAddress(e.target.value); setFormError(null); setSelectedAddressId(null); }}
                          placeholder="House No, Street, Area, Landmark"
                          className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl p-2.5 font-semibold text-zinc-900 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                          PINCODE
                        </label>
                        <input 
                          type="text"
                          maxLength={6} 
                          value={zipCode} 
                          onChange={e => { setZipCode(e.target.value.replace(/\D/g, '')); setFormError(null); setSelectedAddressId(null); }}
                          placeholder="6-digit PIN code"
                          className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl p-2.5 font-semibold text-zinc-900 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      {(fullName || phoneNumber || streetAddress || zipCode) && (
                        <button
                          type="button"
                          onClick={() => {
                            setFullName('');
                            setPhoneNumber('');
                            setStreetAddress('');
                            setZipCode('');
                            setSelectedAddressId(null);
                            setFormError(null);
                          }}
                          className="px-3 py-3 border border-zinc-200 hover:border-zinc-400 text-zinc-600 rounded-xl text-xs font-bold transition-all cursor-pointer hover:bg-zinc-50"
                        >
                          Clear
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={handleSaveAddressClick}
                        className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all cursor-pointer font-headline"
                      >
                        PROCEED TO VERIFY OTP
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* STEP 2: OTP VERIFICATION */}
              {modalStep === 'otp' && (
                <>
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setModalStep('address')}
                        className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-600 cursor-pointer"
                        title="Back to Address"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 font-headline">
                        VERIFY MOBILE OTP
                      </h3>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="text-zinc-400 hover:text-zinc-900 p-1 rounded-full cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="text-center space-y-3 py-1">
                    <div className="w-12 h-12 bg-purple-50 text-[#8a1c84] rounded-full flex items-center justify-center mx-auto border border-purple-200">
                      <ShieldCheck size={24} />
                    </div>

                    <div>
                      <p className="text-xs text-zinc-600 font-medium">
                        OTP sent via SMS to consulting mobile number
                      </p>
                      <p className="text-sm font-black text-zinc-900 mt-0.5">
                        +91 {phoneNumber}
                      </p>
                    </div>

                    {/* Demo OTP Banner */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-center">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                        Demo Verification OTP Code:
                      </span>
                      <span className="text-lg font-black text-amber-950 font-mono tracking-widest">
                        {generatedOtp}
                      </span>
                    </div>

                    {/* OTP Input Fields */}
                    <div className="pt-2">
                      <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-2">
                        ENTER 4-DIGIT OTP
                      </label>
                      <div className="flex justify-center gap-2.5">
                        {[0, 1, 2, 3].map((idx) => (
                          <input
                            key={idx}
                            id={`otp-input-${idx}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={otpDigits[idx] || ''}
                            onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-12 h-12 text-center text-lg font-black text-zinc-900 bg-zinc-50 border-2 border-zinc-200 focus:border-[#8a1c84] focus:bg-white rounded-xl outline-none transition-all"
                          />
                        ))}
                      </div>
                    </div>

                    {otpError && (
                      <p className="text-xs font-bold text-rose-600">{otpError}</p>
                    )}

                    {/* Resend OTP Timer */}
                    <div className="text-xs text-zinc-500 font-medium pt-1">
                      {resendTimer > 0 ? (
                        <span>Resend OTP in <strong className="text-zinc-900 font-bold">{resendTimer}s</strong></span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-[#8a1c84] font-black underline uppercase text-[11px] cursor-pointer hover:text-purple-900"
                        >
                          RESEND OTP
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyOtpClick}
                    className="w-full bg-[#8a1c84] hover:bg-purple-900 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all cursor-pointer font-headline mt-2"
                  >
                    VERIFY OTP & PROCEED TO PAYMENT
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS CONFIRMATION MODAL */}
      <AnimatePresence>
        {isOrdered && createdOrder && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-zinc-100 z-10 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-50">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-200">
                  Order Confirmed
                </span>
                <h2 className="text-xl font-black text-zinc-950 font-headline uppercase tracking-tight mt-2">
                  ORDER PLACED!
                </h2>
                <p className="text-zinc-500 text-xs font-medium mt-1">
                  Order ID: <strong className="text-zinc-900">{createdOrder.id}</strong>
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 text-left text-xs space-y-2">
                <div className="flex justify-between text-zinc-500 font-medium">
                  <span>Delivery Date:</span>
                  <strong className="text-emerald-700">{createdOrder.estimatedDelivery}</strong>
                </div>
                <div className="flex justify-between text-zinc-500 font-medium">
                  <span>Total Amount:</span>
                  <strong className="text-zinc-950 font-extrabold">{formatCurrency(createdOrder.total)}</strong>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/orders')}
                  className="w-full bg-zinc-950 text-white font-black uppercase text-xs tracking-widest py-3.5 rounded-xl shadow-md cursor-pointer"
                >
                  View My Orders
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="w-full bg-zinc-100 text-zinc-800 font-bold uppercase text-xs tracking-widest py-3 rounded-xl cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION OVERLAY */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-zinc-900/95 text-white font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-2xl border border-zinc-700/80 flex items-center gap-2.5 backdrop-blur-md font-headline uppercase tracking-wide"
          >
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
