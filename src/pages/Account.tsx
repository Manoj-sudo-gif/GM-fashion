import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, ArrowLeft, User, Package, Heart, Tag, Headset, 
  Settings, Smartphone, Globe, MapPin, Star, Share2, Landmark, 
  CreditCard, ShieldCheck, LogOut, Camera, Image, Check, Plus, 
  Navigation, Map, Phone, Mail, Edit2, AlertCircle, Copy, CheckCircle2,
  Building, RefreshCw, HelpCircle, ExternalLink, Shield, Trash2, Search, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage, LANGUAGE_OPTIONS, LanguageCode, SavedAddressItem } from '../context/LanguageContext';

export default function Account() {
  const navigate = useNavigate();
  const { selectedLanguage, setSelectedLanguage, t, user, setUser, logoutUser } = useLanguage();

  // Navigation state between views
  type ViewState = 
    | 'main'
    | 'edit-profile'
    | 'wishlist'
    | 'coupons'
    | 'help-center'
    | 'manage-devices'
    | 'select-language'
    | 'saved-address'
    | 'add-address-location'
    | 'add-address-map'
    | 'add-address-form'
    | 'reviews'
    | 'shared-products'
    | 'bank-upi'
    | 'payment-refund'
    | 'legal-details';

  const [view, setView] = useState<ViewState>('main');

  // Legal Sub-tab state inside legal-details view
  const [activeLegalTab, setActiveLegalTab] = useState<'terms' | 'privacy' | 'license' | 'returns'>('terms');

  // Payments Sub-tab state inside payment-refund view
  const [activePaymentTab, setActivePaymentTab] = useState<'transactions' | 'modes'>('transactions');

  // Profile Edit State (Blank by default)
  const [profileName, setProfileName] = useState<string>(user.name || '');
  const [profilePhone, setProfilePhone] = useState<string>(user.phone || '');
  const [profileEmail, setProfileEmail] = useState<string>(user.email || '');
  const [profileAvatar, setProfileAvatar] = useState<string>(user.avatar || '');
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState<boolean>(false);

  // Login & OTP Modal State
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginStep, setLoginStep] = useState<'details' | 'otp'>('details');
  const [loginNameInput, setLoginNameInput] = useState<string>('');
  const [loginPhoneInput, setLoginPhoneInput] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhoneInput.trim() || loginPhoneInput.trim().length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setOtpError('');
    setOtpInput('');
    setLoginStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput || otpInput.trim().length < 4) {
      setOtpError('Please enter valid 4-digit OTP code');
      return;
    }
    const resolvedName = loginNameInput.trim() || profileName || '';
    const newUser = {
      name: resolvedName,
      phone: loginPhoneInput.trim(),
      email: profileEmail || '',
      avatar: profileAvatar || '',
      isLoggedIn: true,
      addresses: addresses
    };
    setUser(newUser);
    setProfileName(resolvedName);
    setProfilePhone(loginPhoneInput.trim());
    setShowLoginModal(false);
    setLoginStep('details');
  };

  // Sync profile state when user context updates
  useEffect(() => {
    if (user.isLoggedIn) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileEmail(user.email || '');
      setProfileAvatar(user.avatar || '');
    } else {
      setProfileName('');
      setProfilePhone('');
      setProfileEmail('');
      setProfileAvatar('');
      setView('main');
    }
  }, [user]);

  // Wishlist State inside Account
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    if (view === 'wishlist') {
      try {
        const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistItems(Array.isArray(saved) ? saved : []);
      } catch (e) {
        console.error(e);
      }
    }
  }, [view]);

  const handleRemoveWishlistItem = (id: number) => {
    const updated = wishlistItems.filter((item: any) => item.id !== id);
    setWishlistItems(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  // Shared Products State inside Account
  const [sharedProducts, setSharedProducts] = useState<any[]>([]);

  const loadSharedProducts = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('gm_shared_products') || '[]');
      setSharedProducts(Array.isArray(saved) ? saved : []);
    } catch (e) {
      console.error(e);
      setSharedProducts([]);
    }
  }, []);

  useEffect(() => {
    loadSharedProducts();
    window.addEventListener('storage', loadSharedProducts);
    return () => window.removeEventListener('storage', loadSharedProducts);
  }, [loadSharedProducts, view]);

  const handleRemoveSharedProduct = (id: number) => {
    const updated = sharedProducts.filter((item: any) => item.id !== id);
    setSharedProducts(updated);
    localStorage.setItem('gm_shared_products', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleClearAllSharedProducts = () => {
    setSharedProducts([]);
    localStorage.removeItem('gm_shared_products');
    window.dispatchEvent(new Event('storage'));
  };

  // Hidden File input refs for Gallery and Camera uploads
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const accountVideoRef = useRef<HTMLVideoElement>(null);

  // Camera Live Stream States
  const [isAccountCameraLive, setIsAccountCameraLive] = useState<boolean>(false);
  const [accountCameraStream, setAccountCameraStream] = useState<MediaStream | null>(null);
  const [profilePhoneError, setProfilePhoneError] = useState<string>('');

  // Phone Number Change Verification States
  const [isPhoneOtpModalOpen, setIsPhoneOtpModalOpen] = useState<boolean>(false);
  const [phoneChangeOtpInput, setPhoneChangeOtpInput] = useState<string>('');
  const [phoneChangeOtpError, setPhoneChangeOtpError] = useState<string>('');

  // Reset phone input if leaving edit-profile view without OTP verification
  useEffect(() => {
    if (view !== 'edit-profile' && user.isLoggedIn) {
      setProfilePhone(user.phone || '');
      setProfilePhoneError('');
      setIsPhoneOtpModalOpen(false);
    }
  }, [view, user.phone, user.isLoggedIn]);

  // Saved Addresses State (Blank by default)
  const [addresses, setAddresses] = useState<SavedAddressItem[]>(() => {
    if (user.addresses && user.addresses.length > 0) {
      return user.addresses;
    }
    try {
      const local = localStorage.getItem('gm_saved_addresses');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((a: any) => ({
            id: a.id || `addr-${Math.random()}`,
            name: a.fullName || a.name || '',
            phone: a.phoneNumber || a.phone || '',
            house: a.house || a.streetAddress || '',
            area: a.area || '',
            type: a.type || 'Home',
            isDefault: true
          }));
        }
      }
    } catch (e) {}
    return [];
  });

  // Helper function to persist updated addresses to both User Context & LocalStorage
  const persistAddresses = (updatedList: SavedAddressItem[]) => {
    setAddresses(updatedList);
    setUser((prev) => ({ ...prev, addresses: updatedList }));
    try {
      const formattedForCheckout = updatedList.map((a) => ({
        id: a.id,
        fullName: a.name,
        phoneNumber: a.phone,
        streetAddress: a.house ? `${a.house}, ${a.area}` : a.area,
        zipCode: '639001'
      }));
      localStorage.setItem('gm_saved_addresses', JSON.stringify(formattedForCheckout));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  };

  // Add Address Form State
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [newHouse, setNewHouse] = useState<string>('');
  const [newArea, setNewArea] = useState<string>('');
  const [newName, setNewName] = useState<string>(profileName);
  const [newPhone, setNewPhone] = useState<string>(profilePhone);
  const [newType, setNewType] = useState<string>('Home');
  const [selectedLocationMode, setSelectedLocationMode] = useState<'away' | 'current' | null>(null);

  // Bank & UPI State & Verification Modal
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [verificationType, setVerificationType] = useState<'bank' | 'upi'>('bank');
  const [verificationStep, setVerificationStep] = useState<'sending' | 'success'>('sending');
  const [bankAccount, setBankAccount] = useState<{ accountNo: string; ifsc: string; bankName: string } | null>(null);
  const [upiId, setUpiId] = useState<string | null>(null);
  const [tempBankNo, setTempBankNo] = useState<string>('');
  const [tempIfsc, setTempIfsc] = useState<string>('');
  const [tempUpi, setTempUpi] = useState<string>('');

  // Selected Language State inside select-language view
  const [tempLang, setTempLang] = useState<LanguageCode>(selectedLanguage);
  const [langSavedSuccess, setLangSavedSuccess] = useState<boolean>(false);

  // Scroll to top automatically whenever view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  // Coupon copy toast
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result as string);
        setShowPhotoModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Stop Active Account Camera
  const stopAccountCamera = () => {
    if (accountCameraStream) {
      accountCameraStream.getTracks().forEach(track => track.stop());
      setAccountCameraStream(null);
    }
    setIsAccountCameraLive(false);
  };

  // Start Real Live Camera Stream for Profile Avatar
  const handleCameraCapture = async () => {
    setShowPhotoModal(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'user' } }
      });
      setAccountCameraStream(stream);
      setIsAccountCameraLive(true);
    } catch (err: any) {
      console.warn('Direct camera stream failed, attempting basic video stream:', err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setAccountCameraStream(fallbackStream);
        setIsAccountCameraLive(true);
      } catch (err2) {
        console.warn('Webcam stream not allowed, triggering native device camera input:', err2);
        if (cameraInputRef.current) {
          cameraInputRef.current.click();
        }
      }
    }
  };

  // Attach video stream when camera live mode is active
  useEffect(() => {
    if (isAccountCameraLive && accountCameraStream && accountVideoRef.current) {
      accountVideoRef.current.srcObject = accountCameraStream;
    }
  }, [isAccountCameraLive, accountCameraStream]);

  // Capture frame from live camera stream
  const handleCapturePhotoFromCamera = () => {
    if (accountVideoRef.current) {
      const video = accountVideoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setProfileAvatar(dataUrl);
        stopAccountCamera();
      }
    }
  };

  // Internal helper to persist profile updates
  const saveProfileData = (verifiedPhone: string) => {
    setUser((prev) => ({
      ...prev,
      name: profileName,
      phone: verifiedPhone,
      email: profileEmail,
      avatar: profileAvatar
    }));
    setProfileSaveSuccess(true);
    setTimeout(() => {
      setProfileSaveSuccess(false);
      setView('main');
    }, 1200);
  };

  // Save Profile Handler (Mobile Number Required, Name Optional)
  const handleSaveProfile = () => {
    const trimmedPhone = profilePhone.trim();
    if (!trimmedPhone) {
      setProfilePhoneError('Mobile number is required to save profile.');
      return;
    }
    if (trimmedPhone.length < 10) {
      setProfilePhoneError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setProfilePhoneError('');

    // If mobile number was changed without OTP verification, revert to previous verified phone number
    let phoneToSave = trimmedPhone;
    if (user.phone && trimmedPhone !== user.phone.trim()) {
      phoneToSave = user.phone.trim();
      setProfilePhone(user.phone.trim());
    }

    saveProfileData(phoneToSave);
  };

  // Handle Phone OTP Verification
  const handleVerifyPhoneOtp = () => {
    const code = phoneChangeOtpInput.trim();
    if (code.length < 4) {
      setPhoneChangeOtpError('Please enter valid 4-digit OTP code');
      return;
    }

    setPhoneChangeOtpError('');
    setIsPhoneOtpModalOpen(false);
    saveProfileData(profilePhone.trim());
  };

  // Handle Phone OTP Cancel (Reverts to old phone number)
  const handleCancelPhoneOtp = () => {
    setProfilePhone(user.phone || '');
    setProfilePhoneError('');
    setIsPhoneOtpModalOpen(false);
  };

  // Save Address Handler
  const handleSaveAddress = () => {
    if (!newHouse || !newArea) return;
    const saveName = newName || profileName || 'GM Fashions User';
    const savePhone = newPhone || profilePhone || '';

    if (editingAddressId) {
      const updated = addresses.map((a) =>
        a.id === editingAddressId
          ? {
              ...a,
              name: saveName,
              phone: savePhone,
              house: newHouse,
              area: newArea,
              type: newType
            }
          : a
      );
      persistAddresses(updated);
      setEditingAddressId(null);
    } else {
      const newAddrItem: SavedAddressItem = {
        id: `addr-${Date.now()}`,
        name: saveName,
        phone: savePhone,
        house: newHouse,
        area: newArea,
        type: newType,
        isDefault: addresses.length === 0
      };
      const updated = [newAddrItem, ...addresses];
      persistAddresses(updated);
    }
    // Reset form & view
    setNewHouse('');
    setNewArea('');
    setView('saved-address');
  };

  // Save Language Handler
  const handleSaveLanguage = () => {
    setSelectedLanguage(tempLang);
    setLangSavedSuccess(true);
    setTimeout(() => {
      setLangSavedSuccess(false);
      setView('main');
    }, 1000);
  };

  // Trigger Bank/UPI Verification
  const startVerification = (type: 'bank' | 'upi') => {
    setVerificationType(type);
    setVerificationStep('sending');
    setShowVerificationModal(true);

    setTimeout(() => {
      setVerificationStep('success');
      if (type === 'bank') {
        setBankAccount({
          accountNo: tempBankNo || 'XXXX XXXX 8912',
          ifsc: tempIfsc || 'HDFC0001829',
          bankName: 'HDFC Bank Ltd'
        });
      } else {
        setUpiId(tempUpi || `${profilePhone.replace(/\D/g, '')}@okicici`);
      }
    }, 2000);
  };

  // Copy Coupon Code
  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  // Helper for Page Titles
  const getPageTitle = (currentView: ViewState) => {
    switch (currentView) {
      case 'edit-profile': return 'Edit Profile';
      case 'wishlist': return 'My Wishlist & Favourites';
      case 'coupons': return 'My Coupons & Offers';
      case 'help-center': return 'Help Center & Support';
      case 'manage-devices': return 'Manage Logged-in Devices';
      case 'select-language': return 'Select App Language';
      case 'saved-address': return 'Saved Delivery Addresses';
      case 'add-address-location': return 'Delivery Location Setup';
      case 'add-address-map': return 'Confirm Location';
      case 'add-address-form': return 'Deliver To This Address';
      case 'reviews': return 'My Product Reviews';
      case 'shared-products': return 'Shared Products';
      case 'bank-upi': return 'Bank & UPI Details';
      case 'payment-refund': return 'Payments & Refunds';
      case 'legal-details': return 'Terms, Policies & License';
      default: return 'Account / Profile';
    }
  };

  // Back Button Router
  const handleBack = () => {
    if (view === 'add-address-form' && selectedLocationMode === 'current') {
      setView('add-address-map');
    } else if (view === 'add-address-map') {
      setView('add-address-location');
    } else if (view === 'add-address-location') {
      setView('saved-address');
    } else {
      setView('main');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/80 text-zinc-900 pb-20 md:pb-12 font-body">
      
      {/* Hidden File Input for Gallery Selection */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Hidden File Input for Native Camera Capture */}
      <input 
        type="file" 
        ref={cameraInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        capture="user"
        className="hidden" 
      />

      {/* TOP STICKY HEADER */}
      {view === 'main' ? (
        <div className="sticky top-0 z-40 bg-white/95 border-b border-zinc-200/90 px-4 py-3.5 flex items-center justify-between shadow-2xs backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/')} 
              className="p-1.5 -ml-1 rounded-full hover:bg-zinc-100 text-zinc-800 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Home"
              title="Back to Home"
            >
              <ChevronLeft size={22} strokeWidth={2.2} />
            </button>
            <h1 className="text-base sm:text-lg font-black text-zinc-900 font-headline uppercase tracking-wide leading-none">
              My Account
            </h1>
          </div>
        </div>
      ) : (
        <div className="sticky top-0 z-40 bg-white border-b border-zinc-200/90 px-4 py-3.5 flex items-center justify-between shadow-2xs backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack} 
              className="p-2 -ml-2 rounded-full hover:bg-zinc-100 text-zinc-800 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>
            <h1 className="text-sm sm:text-base font-black text-zinc-900 font-headline uppercase tracking-wide">
              {getPageTitle(view)}
            </h1>
          </div>
        </div>
      )}

      {/* CONTENT CONTAINER */}
      <div className="max-w-2xl lg:max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 pt-3 sm:pt-6">

        {/* ==================================================================== */}
        {/* 1. MAIN ACCOUNT DASHBOARD VIEW */}
        {/* ==================================================================== */}
        {view === 'main' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-5"
          >
            {/* --- SECTION 1: USER PROFILE HEADER CARD / LOGIN BANNER --- */}
            {!user.isLoggedIn ? (
              <div 
                onClick={() => {
                  setLoginNameInput('');
                  setLoginPhoneInput('');
                  setLoginStep('details');
                  setShowLoginModal(true);
                }}
                className="bg-gradient-to-r from-purple-950 via-[#7e22ce] to-fuchsia-800 text-white rounded-2xl p-5 border border-purple-200/80 shadow-md hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5 max-w-[80%]">
                    <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-xs text-white rounded-full text-[10px] font-black uppercase font-headline tracking-wider">
                      WELCOME TO GM FASHIONS
                    </span>
                    <h2 className="text-base sm:text-lg font-black font-headline uppercase tracking-tight">
                      Log In or Sign Up
                    </h2>
                    <p className="text-xs text-purple-100 font-medium font-body">
                      Enter mobile number to access your Orders, Wishlist, Profile & Addresses
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-white text-[#7e22ce] flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform shrink-0">
                    <User size={22} />
                  </div>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => setView('edit-profile')}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100/80 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    {/* Profile Avatar / Picture */}
                    <div className="relative">
                      {profileAvatar ? (
                        <img 
                          src={profileAvatar} 
                          alt={profileName} 
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-purple-200 shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#7e22ce] via-purple-700 to-indigo-800 text-white flex items-center justify-center font-black font-headline text-lg sm:text-xl shadow-xs border-2 border-purple-200">
                          {profileName ? profileName.substring(0, 2).toUpperCase() : 'GM'}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-purple-900 text-white rounded-full p-1 border-2 border-white shadow-xs">
                        <Edit2 size={10} />
                      </div>
                    </div>

                    {/* Profile Info */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-base sm:text-lg font-black text-purple-950 font-headline uppercase tracking-tight group-hover:text-[#7e22ce] transition-colors">
                          {profileName ? profileName : (profilePhone ? `+91 ${profilePhone}` : 'GM CUSTOMER')}
                        </h2>
                      </div>
                      <p className="text-xs text-purple-900/70 font-medium font-body flex items-center gap-1">
                        {profileName ? (
                          <>
                            <Phone size={12} className="text-purple-400" /> +91 {profilePhone || user.phone}
                          </>
                        ) : (
                          <span className="text-[11px] font-bold text-[#7e22ce] uppercase tracking-wider">Tap to add your name</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Chevron Right indicator */}
                  <div className="w-8 h-8 rounded-full bg-purple-50 group-hover:bg-purple-100 text-purple-500 group-hover:text-[#7e22ce] flex items-center justify-center transition-all shrink-0">
                    <ChevronRight size={18} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            )}

            {/* --- SECTIONS ONLY VISIBLE WHEN LOGGED IN --- */}
            {user.isLoggedIn ? (
              <>
                {/* --- QUICK NAVIGATION GRID (2x2) --- */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {/* Button 1: Orders */}
                  <button
                    onClick={() => navigate('/orders', { state: { from: 'account' } })}
                    className="bg-white border border-purple-100/90 hover:border-purple-300 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-50 group-hover:bg-[#7e22ce] text-[#7e22ce] group-hover:text-white flex items-center justify-center transition-all shrink-0 shadow-2xs">
                      <Package size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 font-headline uppercase tracking-tight group-hover:text-[#7e22ce]">
                        Orders
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-medium">Track & Receipts</p>
                    </div>
                  </button>

                  {/* Button 2: Wishlist */}
                  <button
                    onClick={() => setView('wishlist')}
                    className="bg-white border border-purple-100/90 hover:border-fuchsia-300 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-fuchsia-50 group-hover:bg-fuchsia-600 text-fuchsia-600 group-hover:text-white flex items-center justify-center transition-all shrink-0 shadow-2xs">
                      <Heart size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 font-headline uppercase tracking-tight group-hover:text-fuchsia-600">
                        Wishlist
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-medium">Saved Favourites</p>
                    </div>
                  </button>

                  {/* Button 3: Coupons */}
                  <button
                    onClick={() => setView('coupons')}
                    className="bg-white border border-purple-100/90 hover:border-amber-300 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-amber-500 text-amber-600 group-hover:text-white flex items-center justify-center transition-all shrink-0 shadow-2xs">
                      <Tag size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 font-headline uppercase tracking-tight group-hover:text-amber-600">
                        Coupons
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-medium">Active Discounts</p>
                    </div>
                  </button>

                  {/* Button 4: Help Center */}
                  <button
                    onClick={() => setView('help-center')}
                    className="bg-white border border-purple-100/90 hover:border-indigo-300 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-all shrink-0 shadow-2xs">
                      <Headset size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 font-headline uppercase tracking-tight group-hover:text-indigo-600">
                        Help Center
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-medium">Direct Support</p>
                    </div>
                  </button>
                </div>

                {/* --- ACCOUNT SETTINGS --- */}
                <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs overflow-hidden">
                  <div className="px-4 py-3 bg-zinc-50/80 border-b border-zinc-100">
                    <h3 className="text-xs font-black text-zinc-500 font-headline uppercase tracking-widest">
                      Account Settings
                    </h3>
                  </div>
                  <div className="divide-y divide-zinc-100">
                    {/* 1. Edit Profile */}
                    <div 
                      onClick={() => setView('edit-profile')}
                      className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-purple-50/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <User size={18} className="text-zinc-400 group-hover:text-[#7e22ce]" />
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 font-headline uppercase tracking-tight">Edit Profile</h4>
                          <p className="text-[10px] text-zinc-400 font-medium">Name & Phone details</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-zinc-400 group-hover:text-[#7e22ce]" />
                    </div>

                    {/* Saved Address */}
                    <div 
                      onClick={() => setView('saved-address')}
                      className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-purple-50/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-zinc-400 group-hover:text-[#7e22ce]" />
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 font-headline uppercase tracking-tight">Saved Address</h4>
                          <p className="text-[10px] text-zinc-400 font-medium">{addresses.length} delivery addresses saved</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-zinc-400 group-hover:text-[#7e22ce]" />
                    </div>
                  </div>
                </div>

                {/* --- MY ACTIVITY --- */}
                <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs overflow-hidden">
                  <div className="px-4 py-3 bg-zinc-50/80 border-b border-zinc-100">
                    <h3 className="text-xs font-black text-zinc-500 font-headline uppercase tracking-widest">
                      My Activity
                    </h3>
                  </div>
                  <div className="divide-y divide-zinc-100">
                    {/* 1. Reviews */}
                    <div 
                      onClick={() => setView('reviews')}
                      className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-purple-50/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Star size={18} className="text-zinc-400 group-hover:text-amber-500" />
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 font-headline uppercase tracking-tight">Reviews</h4>
                          <p className="text-[10px] text-zinc-400 font-medium">Your ratings and product reviews</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-zinc-400 group-hover:text-amber-500" />
                    </div>

                    {/* 2. Shared Products */}
                    <div 
                      onClick={() => setView('shared-products')}
                      className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-purple-50/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Share2 size={18} className="text-zinc-400 group-hover:text-indigo-600" />
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 font-headline uppercase tracking-tight">Shared Products</h4>
                          <p className="text-[10px] text-zinc-400 font-medium">Items shared with friends and family</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {sharedProducts.length > 0 && (
                          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full font-headline">
                            {sharedProducts.length}
                          </span>
                        )}
                        <ChevronRight size={16} className="text-zinc-400 group-hover:text-indigo-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* --- WHEN LOGGED OUT: HELP CENTER CARD --- */
              <div 
                onClick={() => setView('help-center')}
                className="bg-white border border-purple-100 hover:border-indigo-300 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-all shrink-0 shadow-2xs">
                    <Headset size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 font-headline uppercase tracking-tight group-hover:text-indigo-600">
                      Help Center
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-medium">Customer support & FAQs</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-zinc-400 group-hover:text-indigo-600" />
              </div>
            )}

            {/* --- OTHER INFORMATION (ALWAYS VISIBLE) --- */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs overflow-hidden">
              <div className="px-4 py-3 bg-zinc-50/80 border-b border-zinc-100">
                <h3 className="text-xs font-black text-zinc-500 font-headline uppercase tracking-widest">
                  Other Information
                </h3>
              </div>
              <div className="divide-y divide-zinc-100">
                {/* Terms, Policies & License */}
                <div 
                  onClick={() => setView('legal-details')}
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-purple-50/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-zinc-400 group-hover:text-purple-900" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 font-headline uppercase tracking-tight">Terms, Policies & License</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">Privacy policy, terms of use & returns</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-400 group-hover:text-purple-900" />
                </div>
              </div>
            </div>

            {/* --- LOG OUT BUTTON (ONLY SHOWN AFTER LOG IN) --- */}
            {user.isLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  setView('menu');
                }}
                className="w-full py-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs sm:text-sm rounded-2xl border border-rose-200 shadow-2xs transition-all cursor-pointer font-headline uppercase tracking-wider flex items-center justify-center gap-2 mt-2 active:scale-[0.99]"
              >
                <LogOut size={18} className="text-rose-600" />
                <span>Log Out From GM Fashions</span>
              </button>
            )}

          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW 1: EDIT PROFILE & PICTURE UPLOAD */}
        {/* ==================================================================== */}
        {view === 'edit-profile' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100/90 shadow-2xs space-y-6">
              
              {/* Profile Picture Upload Section at Top Center */}
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="relative group cursor-pointer" onClick={() => setShowPhotoModal(true)}>
                  {profileAvatar ? (
                    <img 
                      src={profileAvatar} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7e22ce] via-purple-700 to-indigo-800 text-white flex items-center justify-center font-black font-headline text-3xl border-4 border-purple-200 shadow-md">
                      {profileName ? profileName.substring(0, 2).toUpperCase() : 'GM'}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-[#7e22ce] text-white rounded-full p-2 border-2 border-white shadow-md">
                    <Camera size={16} />
                  </div>
                </div>

                <button 
                  onClick={() => setShowPhotoModal(true)}
                  className="text-xs font-extrabold text-[#7e22ce] hover:underline font-headline uppercase tracking-wider cursor-pointer"
                >
                  Add your picture
                </button>
              </div>

              {/* Input Form Fields */}
              <div className="space-y-4">
                {/* Full Name (Optional) */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-purple-950 font-headline uppercase tracking-wider flex items-center justify-between">
                    <span>Full Name</span>
                    <span className="text-[10px] text-purple-600/70 font-semibold lowercase font-body">(optional)</span>
                  </label>
                  <input 
                    type="text" 
                    value={profileName} 
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-[#7e22ce] focus:ring-2 focus:ring-purple-500/20 text-xs sm:text-sm font-medium outline-hidden transition-all bg-purple-50/30"
                  />
                </div>

                {/* Mobile Number (REQUIRED) */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-purple-950 font-headline uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span>Mobile Number</span>
                      <span className="text-rose-600 font-black">*</span>
                    </span>
                    {profilePhone && user.phone && profilePhone.trim() !== user.phone.trim() && profilePhone.trim().length === 10 && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        OTP Verification Required
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      required
                      maxLength={10}
                      value={profilePhone} 
                      onChange={(e) => {
                        setProfilePhone(e.target.value.replace(/\D/g, ''));
                        setProfilePhoneError('');
                      }}
                      placeholder="Enter 10-digit mobile number"
                      className={`w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-[#7e22ce] focus:ring-2 focus:ring-purple-500/20 text-xs sm:text-sm font-medium outline-hidden transition-all bg-purple-50/30 ${
                        profilePhone && user.phone && profilePhone.trim() !== user.phone.trim() && profilePhone.trim().length === 10 ? 'pr-24 border-amber-300 bg-amber-50/20' : ''
                      }`}
                    />
                    {profilePhone && user.phone && profilePhone.trim() !== user.phone.trim() && profilePhone.trim().length === 10 && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneChangeOtpInput('');
                          setPhoneChangeOtpError('');
                          setIsPhoneOtpModalOpen(true);
                        }}
                        className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#7e22ce] hover:bg-[#6b21a8] text-white text-[10px] font-black uppercase tracking-wider px-2.5 rounded-lg transition-all cursor-pointer font-headline flex items-center gap-1 shadow-2xs active:scale-95"
                      >
                        VERIFY OTP
                      </button>
                    )}
                  </div>
                  {profilePhoneError && (
                    <p className="text-[11px] text-rose-600 font-extrabold mt-1 flex items-center gap-1">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{profilePhoneError}</span>
                    </p>
                  )}
                </div>

                <p className="text-[11px] text-purple-800/60 font-medium italic">
                  Note: Mobile number is required to save your profile account.
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveProfile}
                className="w-full py-3.5 bg-[#7e22ce] hover:bg-[#6b21a8] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer font-headline uppercase tracking-wider text-center"
              >
                {profileSaveSuccess ? "PROFILE SAVED!" : "SAVE PROFILE DETAILS"}
              </button>
            </div>
          </motion.div>
        )}

        {/* --- BOTTOM SHEET MODAL: PROFILE PICTURE UPLOAD OPTIONS --- */}
        <AnimatePresence>
          {showPhotoModal && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setShowPhotoModal(false)}
                className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
              />
              <motion.div 
                initial={{ y: '100%' }} 
                animate={{ y: 0 }} 
                exit={{ y: '100%' }}
                className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl p-6 z-50 space-y-4 shadow-2xl border-t border-zinc-200"
              >
                <div className="w-12 h-1 bg-zinc-200 rounded-full mx-auto cursor-pointer" onClick={() => setShowPhotoModal(false)} />
                <h3 className="text-sm font-black text-zinc-900 font-headline uppercase tracking-wide text-center">
                  Add Your Profile Picture
                </h3>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {/* Gallery Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-4 bg-purple-50/50 hover:bg-purple-100/50 border border-purple-200 rounded-2xl transition-all cursor-pointer gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white text-[#7e22ce] flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                      <Image size={22} />
                    </div>
                    <span className="text-xs font-black font-headline text-zinc-800 uppercase tracking-wider">
                      Gallery
                    </span>
                  </button>

                  {/* Camera Button */}
                  <button
                    onClick={handleCameraCapture}
                    className="flex flex-col items-center justify-center p-4 bg-purple-50/50 hover:bg-purple-100/50 border border-purple-200 rounded-2xl transition-all cursor-pointer gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white text-[#7e22ce] flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                      <Camera size={22} />
                    </div>
                    <span className="text-xs font-black font-headline text-zinc-800 uppercase tracking-wider">
                      Camera
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="w-full py-2.5 bg-zinc-100 text-zinc-600 font-extrabold text-xs rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer uppercase font-headline tracking-wider"
                >
                  Cancel
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- LIVE CAMERA PREVIEW MODAL FOR ACCOUNT PROFILE --- */}
        <AnimatePresence>
          {isAccountCameraLive && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={stopAccountCamera}
                className="fixed inset-0 bg-black/80 z-50 backdrop-blur-xs flex items-center justify-center p-4"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }}
                className="fixed z-50 w-full max-w-sm bg-zinc-950 rounded-3xl p-5 text-white space-y-4 shadow-2xl border border-zinc-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider font-headline text-purple-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    LIVE CAMERA PREVIEW
                  </span>
                  <button
                    onClick={stopAccountCamera}
                    className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-900 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="relative aspect-square w-full rounded-2xl bg-black border border-zinc-800 overflow-hidden shadow-inner flex items-center justify-center">
                  <video
                    ref={accountVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Viewfinder circle overlay */}
                  <div className="absolute inset-4 border-2 border-purple-400/70 rounded-full pointer-events-none" />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCapturePhotoFromCamera}
                    className="flex-1 bg-[#7e22ce] hover:bg-[#6b21a8] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all cursor-pointer font-headline flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Camera size={18} />
                    <span>TAKE PHOTO</span>
                  </button>
                  <button
                    onClick={stopAccountCamera}
                    className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer font-headline"
                  >
                    CANCEL
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- MOBILE NUMBER CHANGE OTP VERIFICATION MODAL --- */}
        <AnimatePresence>
          {isPhoneOtpModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={handleCancelPhoneOtp}
                className="absolute inset-0"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative z-10 w-full max-w-xs sm:max-w-sm bg-white rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl border border-purple-100 text-center my-auto"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#7e22ce]">
                    <Phone size={18} className="text-[#7e22ce]" />
                    <span className="text-xs font-black uppercase tracking-wider font-headline text-purple-950">
                      VERIFY MOBILE NUMBER
                    </span>
                  </div>
                  <button
                    onClick={handleCancelPhoneOtp}
                    className="p-1.5 text-zinc-400 hover:text-zinc-800 rounded-full bg-zinc-100 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-purple-900/80 font-medium font-body">
                    An OTP code was sent to your new mobile number:
                  </p>
                  <p className="text-base font-black text-[#7e22ce] font-headline tracking-wide">
                    +91 {profilePhone}
                  </p>
                </div>

                <div className="space-y-2 text-center py-2">
                  <label className="text-[11px] font-extrabold text-purple-950 font-headline uppercase tracking-wider block">
                    Enter 4-Digit OTP Code *
                  </label>
                  
                  <div className="flex items-center justify-center gap-2.5 sm:gap-3 my-2">
                    {[0, 1, 2, 3].map((idx) => {
                      const digit = phoneChangeOtpInput[idx] || '';
                      return (
                        <input
                          key={idx}
                          id={`phone-change-otp-box-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            const arr = (phoneChangeOtpInput.padEnd(4, ' ')).split('');
                            arr[idx] = val ? val.slice(-1) : '';
                            const newCode = arr.join('').trimEnd();
                            setPhoneChangeOtpInput(newCode);
                            setPhoneChangeOtpError('');
                            if (val && idx < 3) {
                              const nextEl = document.getElementById(`phone-change-otp-box-${idx + 1}`);
                              if (nextEl) nextEl.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !phoneChangeOtpInput[idx] && idx > 0) {
                              const prevEl = document.getElementById(`phone-change-otp-box-${idx - 1}`);
                              if (prevEl) prevEl.focus();
                            }
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
                            if (pasted) {
                              setPhoneChangeOtpInput(pasted);
                              setPhoneChangeOtpError('');
                              const focusIdx = Math.min(pasted.length - 1, 3);
                              const el = document.getElementById(`phone-change-otp-box-${focusIdx}`);
                              if (el) el.focus();
                            }
                          }}
                          className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-black rounded-2xl border-2 border-purple-200 focus:border-[#7e22ce] focus:ring-4 focus:ring-purple-500/20 outline-hidden bg-purple-50/40 text-purple-950 font-headline shadow-2xs transition-all"
                        />
                      );
                    })}
                  </div>

                  {phoneChangeOtpError && (
                    <p className="text-[11px] text-rose-600 font-extrabold">{phoneChangeOtpError}</p>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleVerifyPhoneOtp}
                    className="w-full bg-[#7e22ce] hover:bg-[#6b21a8] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all cursor-pointer font-headline flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Check size={16} />
                    <span>VERIFY & UPDATE MOBILE</span>
                  </button>
                  <button
                    onClick={handleCancelPhoneOtp}
                    className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer font-headline"
                  >
                    CANCEL (KEEP +91 {user.phone})
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ==================================================================== */}
        {/* SUB-VIEW 1.5: MY WISHLIST & FAVOURITES */}
        {/* ==================================================================== */}
        {view === 'wishlist' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-gradient-to-r from-fuchsia-600 to-purple-800 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-black font-headline uppercase tracking-wide">
                  Saved Favourites ({wishlistItems.length})
                </h2>
                <p className="text-xs font-medium text-fuchsia-100">
                  Your bookmarked items stored in your GM Fashions wishlist
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
                <Heart size={20} className="fill-white" />
              </div>
            </div>

            {wishlistItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-purple-100 text-center space-y-3 shadow-2xs">
                <div className="w-14 h-14 bg-fuchsia-50 text-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Heart size={28} />
                </div>
                <h3 className="text-sm font-black font-headline text-zinc-900 uppercase">
                  Your Wishlist is Empty
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto font-medium">
                  Browse our trending collections and tap the heart icon on products to save them here.
                </p>
                <button
                  onClick={() => navigate('/products')}
                  className="px-5 py-2.5 bg-[#7e22ce] text-white font-extrabold text-xs rounded-xl font-headline uppercase tracking-wider cursor-pointer shadow-xs hover:bg-[#6b21a8] transition-all"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-3 border border-purple-100 shadow-2xs flex items-center gap-3 relative group">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl object-cover shrink-0 bg-zinc-100"
                    />
                    <div className="flex-1 min-w-0 pr-6">
                      <h4 className="text-xs sm:text-sm font-black text-zinc-900 font-headline uppercase truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs font-black text-[#7e22ce] font-headline mt-1">
                        {item.price}
                      </p>
                      <button
                        onClick={() => navigate(`/products`)}
                        className="mt-2 px-3 py-1 bg-purple-50 text-[#7e22ce] hover:bg-[#7e22ce] hover:text-white text-[10px] font-bold uppercase font-headline rounded-lg transition-colors cursor-pointer"
                      >
                        View Product
                      </button>
                    </div>

                    {/* Trash / Delete button */}
                    <button
                      onClick={() => handleRemoveWishlistItem(item.id)}
                      className="absolute top-2.5 right-2.5 p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW 2: MY COUPONS & OFFERS */}
        {/* ==================================================================== */}
        {view === 'coupons' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-2xl p-5 shadow-sm space-y-1">
              <h2 className="text-base font-black font-headline uppercase tracking-wide">
                Exclusive GM Fashions Vouchers
              </h2>
              <p className="text-xs font-medium text-amber-100">
                Apply these coupon codes at checkout to unlock instant cashback & extra discounts.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { code: 'GMFWELCOME10', discount: '10% FLAT DISCOUNT', desc: 'Valid on first order above ₹999', exp: 'Expires in 6 days' },
                { code: 'FESTIVE500', discount: '₹ 500 INSTANT CASHBACK', desc: 'Valid on Ethnic & Linen Kurtas', exp: 'Expires in 12 days' },
                { code: 'FREESHIP', discount: 'FREE EXPRESS SHIPPING', desc: 'Zero delivery fee on all orders', exp: 'Valid forever' },
              ].map((c) => (
                <div key={c.code} className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-2xs flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-red-50 text-[#dc2626] border border-red-200 rounded-md font-black font-headline text-xs tracking-wider">
                        {c.code}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">{c.exp}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 font-headline uppercase">{c.discount}</h3>
                    <p className="text-[11px] text-zinc-500">{c.desc}</p>
                  </div>

                  <button
                    onClick={() => copyCoupon(c.code)}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-[#dc2626] text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer font-headline uppercase tracking-wider shrink-0"
                  >
                    {copiedCoupon === c.code ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW 3: HELP CENTER & MANAGEMENT SUPPORT */}
        {/* ==================================================================== */}
        {view === 'help-center' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Headset size={22} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-zinc-900 font-headline uppercase">
                    GM Fashions Support Team
                  </h2>
                  <p className="text-xs text-zinc-500">Contact store management directly for order queries</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <a 
                  href="tel:+917373772390"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 font-headline uppercase tracking-wider"
                >
                  <Phone size={18} /> Call Management: +91 73737 72390
                </a>

                <a 
                  href="https://wa.me/917373772390" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 font-headline uppercase tracking-wider"
                >
                  <Mail size={18} /> Email Support: support@gmfashions.com
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW: SAVED ADDRESS */}
        {/* ==================================================================== */}
        {view === 'saved-address' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <button
              onClick={() => {
                setEditingAddressId(null);
                setNewHouse('');
                setNewArea('');
                setNewName(profileName);
                setNewPhone(profilePhone);
                setView('add-address-location');
              }}
              className="w-full py-3.5 bg-purple-50 hover:bg-purple-100/80 border-2 border-dashed border-purple-300 text-[#7e22ce] font-extrabold text-xs sm:text-sm rounded-2xl shadow-2xs transition-all cursor-pointer font-headline uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Plus size={18} /> + Add New Address
            </button>

            {addresses.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-purple-100 text-center space-y-3 shadow-2xs">
                <div className="w-14 h-14 bg-purple-50 text-[#7e22ce] rounded-2xl flex items-center justify-center mx-auto">
                  <MapPin size={28} />
                </div>
                <h3 className="text-sm font-black font-headline text-zinc-900 uppercase">
                  No Saved Address Found
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto font-medium">
                  Add your delivery address to enjoy 1-click checkout on GM Fashions.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100/90 shadow-2xs space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-purple-900 text-white text-[10px] font-black uppercase rounded-md font-headline">
                          {addr.type || 'Home'}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-purple-50 text-[#7e22ce] text-[9px] font-black uppercase rounded-md border border-purple-200 font-headline">
                            Default Address
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => {
                            setEditingAddressId(addr.id);
                            setNewHouse(addr.house || '');
                            setNewArea(addr.area || '');
                            setNewName(addr.name || profileName || '');
                            setNewPhone(addr.phone || profilePhone || '');
                            setNewType(addr.type || 'Home');
                            setView('add-address-form');
                          }}
                          className="p-1.5 text-zinc-400 hover:text-[#7e22ce] rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                          title="Edit Address"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button 
                          onClick={() => persistAddresses(addresses.filter(a => a.id !== addr.id))}
                          className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Address"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 font-headline uppercase">{addr.name || 'GM Fashions User'}</h3>
                    <p className="text-xs text-zinc-600 font-medium leading-relaxed">{addr.house ? `${addr.house}, ` : ''}{addr.area}</p>
                    {addr.phone && <p className="text-xs text-zinc-500 font-medium">Mobile: {addr.phone}</p>}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW 7: ADD ADDRESS STEP 1 - LOCATION SETUP */}
        {/* ==================================================================== */}
        {view === 'add-address-location' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100/90 shadow-2xs space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7e22ce] flex items-center justify-center mx-auto shadow-2xs">
                <MapPin size={26} />
              </div>

              <h2 className="text-base sm:text-lg font-black text-zinc-900 font-headline uppercase">
                Where do you want us to deliver?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Option 1: Away from my location */}
                <button
                  onClick={() => {
                    setSelectedLocationMode('away');
                    setNewHouse('');
                    setNewArea('Anna Nagar 2nd Avenue, Chennai, Tamil Nadu - 600040');
                    setNewName(profileName);
                    setNewPhone(profilePhone);
                    setView('add-address-map');
                  }}
                  className="p-4 bg-purple-50/40 hover:bg-purple-100/60 border border-purple-200 rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-white text-[#7e22ce] flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                    <Building size={20} />
                  </div>
                  <span className="text-xs font-black font-headline text-zinc-900 uppercase">
                    Away from my location
                  </span>
                  <p className="text-[10px] text-purple-700/80 font-medium">Search map location & address</p>
                </button>

                {/* Option 2: Use current location */}
                <button
                  onClick={() => {
                    setSelectedLocationMode('current');
                    setNewHouse('');
                    setNewArea('Jawahar Bazaar Road, Near Bus Stand, Karur, Tamil Nadu - 639001');
                    setNewName(profileName);
                    setNewPhone(profilePhone);
                    setView('add-address-map');
                  }}
                  className="p-4 bg-purple-100/60 hover:bg-purple-200/60 border border-purple-300 rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-[#7e22ce] text-white flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                    <Navigation size={20} />
                  </div>
                  <span className="text-xs font-black font-headline text-[#7e22ce] uppercase">
                    Use current location
                  </span>
                  <p className="text-[10px] text-purple-900/80 font-medium">Detect GPS & map coordinates</p>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW 8: ADD ADDRESS STEP 2 - INTERACTIVE GOOGLE MAP PREVIEW */}
        {/* ==================================================================== */}
        {view === 'add-address-map' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl border border-purple-100/90 shadow-2xs overflow-hidden">
              
              {/* If "Away from my location" is selected: show Location Search Bar & Quick Chips */}
              {selectedLocationMode === 'away' && (
                <div className="p-3.5 bg-purple-50/50 border-b border-purple-100 space-y-2.5">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      placeholder="Search area, street name, city or pincode..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-purple-200 focus:border-[#7e22ce] focus:ring-2 focus:ring-purple-500/20 text-xs font-medium bg-white shadow-2xs outline-hidden"
                    />
                    <Search size={16} className="absolute left-3 top-3 text-purple-600" />
                  </div>

                  {/* Popular City Suggestions Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    <span className="text-[10px] font-bold text-purple-950 uppercase shrink-0 font-headline">Popular:</span>
                    {[
                      { city: 'Karur', full: 'Jawahar Bazaar Road, Karur, Tamil Nadu - 639001' },
                      { city: 'Chennai', full: 'Anna Nagar 2nd Avenue, Chennai, Tamil Nadu - 600040' },
                      { city: 'Coimbatore', full: 'RS Puram, DB Road, Coimbatore, Tamil Nadu - 641002' },
                      { city: 'Trichy', full: 'Thillai Nagar Main Road, Tiruchirappalli, Tamil Nadu - 620018' },
                      { city: 'Erode', full: 'Brough Road, Erode, Tamil Nadu - 638001' },
                      { city: 'Madurai', full: 'KK Nagar Main Road, Madurai, Tamil Nadu - 625020' },
                      { city: 'Salem', full: 'Fairlands Main Road, Salem, Tamil Nadu - 636016' }
                    ].map((item) => (
                      <button
                        key={item.city}
                        type="button"
                        onClick={() => setNewArea(item.full)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase shrink-0 transition-all cursor-pointer font-headline ${
                          newArea.includes(item.city) 
                            ? 'bg-[#7e22ce] text-white' 
                            : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-100/80'
                        }`}
                      >
                        {item.city}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Simulated Map Box */}
              <div className="w-full h-60 bg-purple-50/40 relative flex items-center justify-center overflow-hidden">
                {/* Simulated Grid Lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#7e22ce_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                
                {/* Map Roads Vector Mockup */}
                <div className="absolute inset-0 border-t-4 border-l-4 border-purple-300/60 top-1/3 left-0 w-full h-full rotate-6" />
                <div className="absolute inset-0 border-b-4 border-r-4 border-fuchsia-300/60 bottom-0 right-0 w-full h-full -rotate-12" />

                {/* Pulsing Pin */}
                <div className="relative z-10 flex flex-col items-center animate-bounce">
                  <div className="w-10 h-10 rounded-full bg-[#7e22ce] text-white flex items-center justify-center shadow-xl">
                    <MapPin size={22} className="fill-white" />
                  </div>
                  <div className="w-4 h-1.5 bg-black/30 rounded-full blur-xs mt-1" />
                </div>

                <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold font-headline text-purple-950 shadow-2xs border border-purple-100">
                  {selectedLocationMode === 'current' ? 'GPS Location: 10.9601° N, 78.0766° E' : 'Map Pin Location Selected'}
                </span>
              </div>

              {/* Selected Location Card & Action Button */}
              <div className="p-4 sm:p-5 space-y-4">
                <div className="bg-purple-50/60 rounded-xl p-3 border border-purple-200 flex items-start gap-2.5">
                  <MapPin size={18} className="text-[#7e22ce] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-900 font-headline uppercase">
                      {selectedLocationMode === 'current' ? 'Detected Current Location' : 'Selected Map Location'}
                    </h4>
                    <p className="text-xs text-purple-900 font-bold mt-0.5 leading-relaxed">
                      {newArea || 'Jawahar Bazaar Road, Near Bus Stand, Karur, Tamil Nadu - 639001'}
                    </p>
                  </div>
                </div>

                {/* ADD ADDRESS DETAILS BUTTON */}
                <button
                  onClick={() => setView('add-address-form')}
                  className="w-full py-3.5 bg-[#7e22ce] hover:bg-[#6b21a8] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer font-headline uppercase tracking-wider text-center flex items-center justify-center gap-2"
                >
                  ADD ADDRESS DETAILS <ChevronRight size={18} />
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW 9: ADD ADDRESS STEP 3 - FORM FIELDS */}
        {/* ==================================================================== */}
        {view === 'add-address-form' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100/90 shadow-2xs space-y-4">
              <h2 className="text-sm sm:text-base font-black text-zinc-900 font-headline uppercase border-b border-purple-100 pb-2">
                Deliver to this address
              </h2>

              <div className="space-y-3.5">
                {/* Flat/House/Building Name */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-purple-950 font-headline uppercase tracking-wider">
                    Flat / House / Building Name *
                  </label>
                  <input 
                    type="text" 
                    value={newHouse} 
                    onChange={(e) => setNewHouse(e.target.value)}
                    placeholder="e.g. Door No. 12, Green Heights Appt"
                    className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-[#7e22ce] focus:ring-2 focus:ring-purple-500/20 text-xs sm:text-sm font-medium outline-hidden bg-purple-50/30"
                  />
                </div>

                {/* Area Address */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-purple-950 font-headline uppercase tracking-wider">
                    Area Address / Street / Landmark *
                  </label>
                  <input 
                    type="text" 
                    value={newArea} 
                    onChange={(e) => setNewArea(e.target.value)}
                    placeholder="e.g. Jawahar Bazaar, Karur, Tamil Nadu"
                    className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-[#7e22ce] focus:ring-2 focus:ring-purple-500/20 text-xs sm:text-sm font-medium outline-hidden bg-purple-50/30"
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-purple-950 font-headline uppercase tracking-wider">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Fill your name"
                    className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-[#7e22ce] focus:ring-2 focus:ring-purple-500/20 text-xs sm:text-sm font-medium outline-hidden bg-purple-50/30"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-purple-950 font-headline uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <input 
                    type="tel" 
                    value={newPhone} 
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Fill mobile number"
                    className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-[#7e22ce] focus:ring-2 focus:ring-purple-500/20 text-xs sm:text-sm font-medium outline-hidden bg-purple-50/30"
                  />
                </div>

                {/* Address Type Pills */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-purple-950 font-headline uppercase tracking-wider">
                    Address Type
                  </label>
                  <div className="flex items-center gap-2">
                    {['Home', 'Office', 'Other'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewType(t)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase font-headline transition-all cursor-pointer ${
                          newType === t 
                            ? 'bg-[#7e22ce] text-white shadow-2xs' 
                            : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveAddress}
                className="w-full py-3.5 bg-[#7e22ce] hover:bg-[#6b21a8] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer font-headline uppercase tracking-wider text-center"
              >
                SAVE ADDRESS
              </button>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW 10: REVIEWS */}
        {/* ==================================================================== */}
        {view === 'reviews' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs space-y-3">
              <h3 className="text-xs font-black text-zinc-500 font-headline uppercase">
                Your Product Reviews
              </h3>

              {[
                { name: 'AIM COTTON SLIM SHIRT', rating: 5, date: '20 Jul 2026', comment: 'Superb fabric quality! Fits perfectly and looks super premium.' },
                { name: 'ROYAL LINEN DHOTI SET', rating: 5, date: '12 May 2026', comment: 'Authentic pure linen feel. Delivered very fast in Karur.' },
              ].map((r, idx) => (
                <div key={idx} className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-zinc-900 font-headline uppercase">{r.name}</h4>
                    <span className="text-[10px] text-zinc-400">{r.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-600 font-medium">{r.comment}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW 11: SHARED PRODUCTS */}
        {/* ==================================================================== */}
        {view === 'shared-products' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <h3 className="text-xs font-black text-purple-950 font-headline uppercase tracking-wide flex items-center gap-2">
                    <Share2 size={16} className="text-[#7e22ce]" />
                    <span>Products Shared With Friends ({sharedProducts.length})</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                    Items you shared from product details pages
                  </p>
                </div>
                {sharedProducts.length > 0 && (
                  <button
                    onClick={handleClearAllSharedProducts}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer font-headline uppercase"
                  >
                    <Trash2 size={13} />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {sharedProducts.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-14 h-14 bg-purple-50 text-[#7e22ce] rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Share2 size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-purple-950 font-headline uppercase">No Shared Products Yet</h4>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto font-medium">
                      When you click the share icon on any product details page, it will be saved here for easy access!
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/products')}
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-[#7e22ce] hover:bg-[#6b21a8] text-white font-extrabold text-xs rounded-xl uppercase tracking-wider font-headline shadow-xs cursor-pointer transition-all active:scale-95"
                  >
                    <Search size={14} />
                    <span>EXPLORE PRODUCTS</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {sharedProducts.map((s) => (
                    <div key={s.id} className="p-3 sm:p-3.5 bg-purple-50/30 rounded-2xl border border-purple-100 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img 
                          src={s.image || 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=200&q=80'} 
                          alt={s.name} 
                          className="w-14 h-16 sm:w-16 sm:h-18 object-cover rounded-xl border border-purple-100 shrink-0 bg-white"
                        />
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <h4 className="text-xs sm:text-sm font-extrabold text-purple-950 font-headline uppercase truncate">{s.name}</h4>
                          <p className="text-xs font-black text-[#7e22ce] font-headline">{s.price}</p>
                          <p className="text-[10px] text-zinc-400 font-medium">Shared on {s.sharedDate || 'Recently'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => navigate(`/product/${s.id}`)}
                          className="px-3 py-2 bg-[#7e22ce] hover:bg-[#6b21a8] text-white font-extrabold text-[11px] rounded-xl font-headline uppercase cursor-pointer transition-all active:scale-95 shadow-2xs"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleRemoveSharedProduct(s.id)}
                          className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW 12: BANK & UPI DETAILS */}
        {/* ==================================================================== */}
        {view === 'bank-upi' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-sm space-y-1">
              <h2 className="text-sm sm:text-base font-black font-headline uppercase tracking-wide">
                Add your bank account and UPI details to receive payment
              </h2>
              <p className="text-xs font-medium text-emerald-100">
                Used for instant automatic refunds for cancelled or returned orders.
              </p>
            </div>

            <div className="space-y-3">
              {/* Option 1: Bank Details */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Landmark size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 font-headline uppercase">Bank Details</h3>
                      <p className="text-[11px] text-zinc-400 font-medium">
                        {bankAccount ? `${bankAccount.bankName} (${bankAccount.accountNo})` : 'No bank account added yet'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => startVerification('bank')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer font-headline uppercase tracking-wider"
                  >
                    {bankAccount ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>

              {/* Option 2: UPI Details */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 font-headline uppercase">UPI Details</h3>
                      <p className="text-[11px] text-zinc-400 font-medium">
                        {upiId ? upiId : 'No VPA / UPI ID linked'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => startVerification('upi')}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer font-headline uppercase tracking-wider"
                  >
                    {upiId ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Verification Modal for Bank & UPI */}
        <AnimatePresence>
          {showVerificationModal && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowVerificationModal(false)}
                className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl p-6 z-50 space-y-4 shadow-2xl border border-zinc-200 text-center"
              >
                {verificationStep === 'sending' ? (
                  <div className="space-y-4 py-4">
                    <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-spin">
                      <RefreshCw size={28} />
                    </div>
                    <h3 className="text-sm font-black font-headline text-zinc-900 uppercase">
                      Verifying Mobile Number...
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">
                      Initiating account verification for <span className="font-bold text-zinc-900">{profilePhone}</span> with your consulting mobile carrier.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                      <Check size={32} strokeWidth={3} />
                    </div>
                    <h3 className="text-sm font-black font-headline text-zinc-900 uppercase">
                      Verification Successful!
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">
                      {verificationType === 'bank' ? 'Your bank account has been verified and saved.' : 'Your UPI ID has been linked successfully.'}
                    </p>
                    <button
                      onClick={() => setShowVerificationModal(false)}
                      className="w-full py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl font-headline uppercase tracking-wider cursor-pointer"
                    >
                      DONE
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ==================================================================== */}
        {/* SUB-VIEW 13: PAYMENTS & REFUNDS */}
        {/* ==================================================================== */}
        {view === 'payment-refund' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            
            {/* Tabs Toggle */}
            <div className="flex bg-zinc-200/80 p-1 rounded-2xl gap-1">
              <button
                onClick={() => setActivePaymentTab('transactions')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase font-headline transition-all cursor-pointer ${
                  activePaymentTab === 'transactions' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActivePaymentTab('modes')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase font-headline transition-all cursor-pointer ${
                  activePaymentTab === 'modes' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Payment Modes
              </button>
            </div>

            {/* Content for Transactions */}
            {activePaymentTab === 'transactions' && (
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs space-y-3">
                <h3 className="text-xs font-black text-zinc-500 font-headline uppercase">Recent Payments</h3>
                {[
                  { id: 'TXN-98102', date: '14 Jul 2026', amount: '₹ 4,250', status: 'Success', mode: 'UPI / GPay' },
                  { id: 'TXN-77812', date: '02 May 2026', amount: '₹ 1,850', status: 'Success', mode: 'Credit Card' },
                ].map((t) => (
                  <div key={t.id} className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/80 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-zinc-900 font-headline">{t.id}</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">{t.date} • {t.mode}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black font-headline text-zinc-900">{t.amount}</span>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase font-headline">{t.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Content for Payment Modes */}
            {activePaymentTab === 'modes' && (
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs space-y-3">
                <h3 className="text-xs font-black text-zinc-500 font-headline uppercase">Saved Cards & UPI</h3>
                <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-blue-600" />
                    <div>
                      <h4 className="text-xs font-extrabold text-zinc-900 font-headline">HDFC Bank Debit Card</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">Ends with **8912</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400">Primary</span>
                </div>
              </div>
            )}

            {/* DEDICATED REFUNDS STATUS SECTION */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs space-y-3">
              <h3 className="text-xs font-black text-zinc-500 font-headline uppercase flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-600" /> Active & Past Refunds
              </h3>

              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase font-headline">Refund Ref: #RFD9812</span>
                  <h4 className="text-xs font-extrabold text-zinc-900 font-headline uppercase">₹ 1,850.00</h4>
                  <p className="text-[10px] text-zinc-500">Credited to HDFC Bank A/c ending 8912</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-full font-headline">
                  Refunded
                </span>
              </div>
            </div>

          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW 14: TERMS, POLICIES & LICENSE */}
        {/* ==================================================================== */}
        {view === 'legal-details' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            
            {/* Legal Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 bg-zinc-200/80 p-1 rounded-2xl gap-1">
              {[
                { id: 'terms', label: 'Terms' },
                { id: 'privacy', label: 'Privacy' },
                { id: 'license', label: 'License' },
                { id: 'returns', label: 'Returns' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveLegalTab(t.id as any)}
                  className={`py-2 rounded-xl text-[11px] font-black uppercase font-headline transition-all cursor-pointer ${
                    activeLegalTab === t.id ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-2xs space-y-3 text-xs text-zinc-600 leading-relaxed font-body">
              {activeLegalTab === 'terms' && (
                <>
                  <h3 className="text-sm font-black text-zinc-900 font-headline uppercase">Terms of Use</h3>
                  <p>Welcome to GM Fashions. By browsing or ordering from our app, you agree to abide by all merchant guidelines, shipping standards, and payment terms regulated under Indian e-commerce legislation.</p>
                </>
              )}

              {activeLegalTab === 'privacy' && (
                <>
                  <h3 className="text-sm font-black text-zinc-900 font-headline uppercase">Privacy Policy</h3>
                  <p>GM Fashions values your privacy. We collect minimal device details and shipping addresses solely to facilitate doorstep delivery and order tracking. Your payment data is end-to-end encrypted.</p>
                </>
              )}

              {activeLegalTab === 'license' && (
                <>
                  <h3 className="text-sm font-black text-zinc-900 font-headline uppercase">Software & Brand License</h3>
                  <p>© 2026 GM Fashions India Ltd. All rights reserved. Registered trademark under textile and retail trade laws.</p>
                </>
              )}

              {activeLegalTab === 'returns' && (
                <>
                  <h3 className="text-sm font-black text-zinc-900 font-headline uppercase">7-Day Returns Policy</h3>
                  <p>Hassle-free 7-day doorstep replacement and instant bank refunds for unwashed, tag-intact garments.</p>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* --- LOGIN / OTP MODAL --- */}
        <AnimatePresence>
          {showLoginModal && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setShowLoginModal(false)}
                className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl p-6 z-50 space-y-5 shadow-2xl border border-purple-100"
              >
                <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7e22ce] flex items-center justify-center font-black">
                      <User size={18} />
                    </div>
                    <h3 className="text-sm font-black font-headline text-purple-950 uppercase">
                      {loginStep === 'details' ? 'Log In to GM Fashions' : 'Verify Mobile OTP'}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setShowLoginModal(false)} 
                    className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {loginStep === 'details' ? (
                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    <p className="text-xs text-purple-900/80 font-medium">
                      Enter your 10-digit mobile number to receive an OTP code and log in to your account.
                    </p>

                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-purple-950 font-headline uppercase tracking-wider">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3 text-xs font-bold text-purple-900">+91</span>
                        <input 
                          type="tel" 
                          required
                          maxLength={10}
                          value={loginPhoneInput} 
                          onChange={(e) => setLoginPhoneInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter 10-digit mobile number"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-purple-200 focus:border-[#7e22ce] focus:ring-2 focus:ring-purple-500/20 text-xs sm:text-sm font-medium outline-hidden bg-purple-50/30 text-purple-950"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#7e22ce] hover:bg-[#6b21a8] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer font-headline uppercase tracking-wider text-center"
                    >
                      GET OTP CODE
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
                    <div className="bg-purple-50/80 p-3 rounded-2xl border border-purple-200 space-y-1">
                      <p className="text-xs text-purple-950 font-bold">
                        OTP sent to <span className="font-extrabold text-[#7e22ce]">+91 {loginPhoneInput}</span>
                      </p>
                      <button 
                        type="button" 
                        onClick={() => setLoginStep('details')}
                        className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
                      >
                        Change Number
                      </button>
                    </div>

                    <div className="space-y-2 text-center">
                      <label className="text-xs font-extrabold text-purple-950 font-headline uppercase tracking-wider block">
                        Enter 4-Digit OTP Code *
                      </label>
                      
                      <div className="flex items-center justify-center gap-2.5 sm:gap-3 my-3">
                        {[0, 1, 2, 3].map((idx) => {
                          const digit = otpInput[idx] || '';
                          return (
                            <input
                              key={idx}
                              id={`login-otp-box-${idx}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                const arr = (otpInput.padEnd(4, ' ')).split('');
                                arr[idx] = val ? val.slice(-1) : '';
                                const newCode = arr.join('').trimEnd();
                                setOtpInput(newCode);
                                setOtpError('');
                                if (val && idx < 3) {
                                  const nextEl = document.getElementById(`login-otp-box-${idx + 1}`);
                                  if (nextEl) nextEl.focus();
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !otpInput[idx] && idx > 0) {
                                  const prevEl = document.getElementById(`login-otp-box-${idx - 1}`);
                                  if (prevEl) prevEl.focus();
                                }
                              }}
                              onPaste={(e) => {
                                e.preventDefault();
                                const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
                                if (pasted) {
                                  setOtpInput(pasted);
                                  setOtpError('');
                                  const focusIdx = Math.min(pasted.length - 1, 3);
                                  const el = document.getElementById(`login-otp-box-${focusIdx}`);
                                  if (el) el.focus();
                                }
                              }}
                              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-2xl border-2 border-purple-200 focus:border-[#7e22ce] focus:ring-4 focus:ring-purple-500/20 outline-hidden bg-purple-50/40 text-purple-950 font-headline shadow-2xs transition-all"
                            />
                          );
                        })}
                      </div>

                      {otpError && <p className="text-[11px] text-red-600 font-extrabold">{otpError}</p>}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#7e22ce] hover:bg-[#6b21a8] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer font-headline uppercase tracking-wider text-center"
                    >
                      VERIFY OTP & LOG IN
                    </button>
                  </form>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
