import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, User, Package, Heart, Tag, Headset, 
  Settings, Smartphone, Globe, MapPin, Star, Share2, Landmark, 
  CreditCard, ShieldCheck, LogOut, Camera, Image, Check, Plus, 
  Navigation, Map, Phone, Mail, Edit2, AlertCircle, Copy, CheckCircle2,
  Building, RefreshCw, HelpCircle, ExternalLink, Shield, Trash2
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

  // Profile Edit State
  const [profileName, setProfileName] = useState<string>(user.name || 'Karur Spark');
  const [profilePhone, setProfilePhone] = useState<string>(user.phone || '+91 7373772390');
  const [profileEmail, setProfileEmail] = useState<string>(user.email || 'karurspark06@gmail.com');
  const [profileAvatar, setProfileAvatar] = useState<string>(user.avatar || '');
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState<boolean>(false);

  // Hidden File input ref for Gallery picture upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Saved Addresses State
  const defaultAddressesList: SavedAddressItem[] = user.addresses && user.addresses.length > 0 ? user.addresses : [
    {
      id: 'addr-1',
      name: user.name || 'Karur Spark',
      phone: user.phone || '+91 7373772390',
      house: 'Door No. 42/1, Green Valley Heights',
      area: 'Jawahar Bazaar, Karur, Tamil Nadu - 639001',
      type: 'Home',
      isDefault: true
    }
  ];
  const [addresses, setAddresses] = useState<SavedAddressItem[]>(defaultAddressesList);

  // Add Address Form State
  const [newHouse, setNewHouse] = useState<string>('');
  const [newArea, setNewArea] = useState<string>('');
  const [newName, setNewName] = useState<string>(user.name || 'Karur Spark');
  const [newPhone, setNewPhone] = useState<string>(user.phone || '+91 7373772390');
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

  // Simulate Camera photo upload
  const handleCameraCapture = () => {
    // Generate a vibrant avatar sample
    const sampleAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    ];
    const randomAvatar = sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)];
    setProfileAvatar(randomAvatar);
    setShowPhotoModal(false);
  };

  // Save Profile Handler
  const handleSaveProfile = () => {
    setUser((prev) => ({
      ...prev,
      name: profileName,
      phone: profilePhone,
      email: profileEmail,
      avatar: profileAvatar
    }));
    setProfileSaveSuccess(true);
    setTimeout(() => {
      setProfileSaveSuccess(false);
      setView('main');
    }, 1200);
  };

  // Save Address Handler
  const handleSaveAddress = () => {
    if (!newHouse || !newArea || !newName) return;
    const newAddrItem: SavedAddressItem = {
      id: `addr-${Date.now()}`,
      name: newName,
      phone: newPhone,
      house: newHouse,
      area: newArea,
      type: newType,
      isDefault: addresses.length === 0
    };
    const updated = [newAddrItem, ...addresses];
    setAddresses(updated);
    setUser((prev) => ({ ...prev, addresses: updated }));
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

      {/* TOP STICKY HEADER */}
      {view === 'main' ? (
        <div className="sticky top-0 z-40 bg-white/95 border-b border-zinc-200/90 px-4 py-3.5 flex items-center justify-between shadow-2xs backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div>
              <h1 className="text-sm sm:text-base font-black text-zinc-900 font-headline uppercase tracking-wide leading-none">
                My Account
              </h1>
              <p className="text-[10px] text-zinc-400 font-medium">GM Fashions Profile</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="p-2 -mr-2 rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold font-headline uppercase"
            title="Back to Home"
          >
            <span className="hidden sm:inline">Home</span>
            <ChevronRight size={18} />
          </button>
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
          {view === 'saved-address' && (
            <button
              onClick={() => setView('add-address-location')}
              className="flex items-center gap-1 text-xs font-bold text-[#dc2626] hover:text-[#b91c1c] bg-red-50 hover:bg-red-100/80 px-3 py-1.5 rounded-full border border-red-200/80 transition-all font-headline uppercase tracking-wider cursor-pointer"
            >
              <Plus size={14} /> Add New
            </button>
          )}
        </div>
      )}

      {/* CONTENT CONTAINER */}
      <div className="max-w-2xl mx-auto px-3 sm:px-4 pt-3 sm:pt-5">

        {/* ==================================================================== */}
        {/* 1. MAIN ACCOUNT DASHBOARD VIEW */}
        {/* ==================================================================== */}
        {view === 'main' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-5"
          >
            {/* --- SECTION 1: USER PROFILE HEADER CARD --- */}
            <div 
              onClick={() => setView('edit-profile')}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5 sm:gap-4">
                  {/* Profile Avatar / Picture */}
                  <div className="relative">
                    {profileAvatar ? (
                      <img 
                        src={profileAvatar} 
                        alt={profileName} 
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-red-100 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#dc2626] to-[#991b1b] text-white flex items-center justify-center font-black font-headline text-lg sm:text-xl shadow-sm border-2 border-red-100">
                        {profileName ? profileName.substring(0, 2).toUpperCase() : 'GM'}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-zinc-900 text-white rounded-full p-1 border-2 border-white shadow-xs">
                      <Edit2 size={10} />
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-base sm:text-lg font-black text-zinc-900 font-headline uppercase tracking-tight group-hover:text-[#dc2626] transition-colors">
                        {profileName}
                      </h2>
                    </div>
                    <p className="text-xs text-zinc-500 font-medium font-body flex items-center gap-1">
                      <Phone size={12} className="text-zinc-400" /> {profilePhone}
                    </p>
                    {profileEmail && (
                      <p className="text-[11px] text-zinc-400 font-medium font-body flex items-center gap-1">
                        <Mail size={11} className="text-zinc-400" /> {profileEmail}
                      </p>
                    )}
                  </div>
                </div>

                {/* Chevron Right indicator */}
                <div className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-red-50 text-zinc-400 group-hover:text-[#dc2626] flex items-center justify-center transition-all shrink-0">
                  <ChevronRight size={18} strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* --- SECTION 2: QUICK NAVIGATION GRID (2x2) --- */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {/* Button 1: Orders */}
              <button
                onClick={() => navigate('/orders')}
                className="bg-white border border-zinc-200/90 hover:border-red-200 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 group-hover:bg-[#dc2626] text-[#dc2626] group-hover:text-white flex items-center justify-center transition-all shrink-0 shadow-2xs">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 font-headline uppercase tracking-tight group-hover:text-[#dc2626]">
                    Orders
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-medium">Track & Receipts</p>
                </div>
              </button>

              {/* Button 2: Wishlist */}
              <button
                onClick={() => navigate('/products')}
                className="bg-white border border-zinc-200/90 hover:border-red-200 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 group-hover:bg-rose-600 text-rose-600 group-hover:text-white flex items-center justify-center transition-all shrink-0 shadow-2xs">
                  <Heart size={20} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 font-headline uppercase tracking-tight group-hover:text-rose-600">
                    Wishlist
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-medium">Saved Favourites</p>
                </div>
              </button>

              {/* Button 3: Coupons */}
              <button
                onClick={() => setView('coupons')}
                className="bg-white border border-zinc-200/90 hover:border-red-200 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group text-left"
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
                className="bg-white border border-zinc-200/90 hover:border-red-200 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-all shrink-0 shadow-2xs">
                  <Headset size={20} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 font-headline uppercase tracking-tight group-hover:text-blue-600">
                    Help Center
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-medium">Direct Support</p>
                </div>
              </button>
            </div>

            {/* --- SECTION 3: ACCOUNT SETTINGS --- */}
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
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-zinc-400 group-hover:text-[#dc2626]" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 font-headline uppercase tracking-tight">Edit Profile</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">Name, Phone & Email details</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-400 group-hover:text-[#dc2626]" />
                </div>

                {/* 2. Manage Devices */}
                <div 
                  onClick={() => setView('manage-devices')}
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone size={18} className="text-zinc-400 group-hover:text-[#dc2626]" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 font-headline uppercase tracking-tight">Manage Devices</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">View & logout active login sessions</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-400 group-hover:text-[#dc2626]" />
                </div>

                {/* 3. Select Language */}
                <div 
                  onClick={() => {
                    setTempLang(selectedLanguage);
                    setView('select-language');
                  }}
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-zinc-400 group-hover:text-[#dc2626]" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 font-headline uppercase tracking-tight">Select Language</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">Current: <span className="uppercase font-bold text-zinc-700">{selectedLanguage}</span></p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-400 group-hover:text-[#dc2626]" />
                </div>

                {/* 4. Saved Address */}
                <div 
                  onClick={() => setView('saved-address')}
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-zinc-400 group-hover:text-[#dc2626]" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 font-headline uppercase tracking-tight">Saved Address</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">{addresses.length} delivery addresses saved</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-400 group-hover:text-[#dc2626]" />
                </div>
              </div>
            </div>

            {/* --- SECTION 4: MY ACTIVITY --- */}
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
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-zinc-50/80 transition-colors cursor-pointer group"
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
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Share2 size={18} className="text-zinc-400 group-hover:text-blue-600" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 font-headline uppercase tracking-tight">Shared Products</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">Items shared with friends and family</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-400 group-hover:text-blue-600" />
                </div>
              </div>
            </div>

            {/* --- SECTION 5: MY PAYMENTS --- */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs overflow-hidden">
              <div className="px-4 py-3 bg-zinc-50/80 border-b border-zinc-100">
                <h3 className="text-xs font-black text-zinc-500 font-headline uppercase tracking-widest">
                  My Payments
                </h3>
              </div>
              <div className="divide-y divide-zinc-100">
                {/* 1. Bank and UPI Details */}
                <div 
                  onClick={() => setView('bank-upi')}
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Landmark size={18} className="text-zinc-400 group-hover:text-emerald-600" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 font-headline uppercase tracking-tight">Bank and UPI Details</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">Add bank account for payments/refunds</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-400 group-hover:text-emerald-600" />
                </div>

                {/* 2. Payment and Refund */}
                <div 
                  onClick={() => setView('payment-refund')}
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard size={18} className="text-zinc-400 group-hover:text-blue-600" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 font-headline uppercase tracking-tight">Payment and Refund</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">Transaction history & refund tracking</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-400 group-hover:text-blue-600" />
                </div>
              </div>
            </div>

            {/* --- SECTION 6: OTHER INFORMATION & LOGOUT --- */}
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
                  className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-zinc-400 group-hover:text-zinc-800" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-zinc-800 font-headline uppercase tracking-tight">Terms, Policies & License</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">Privacy policy, terms of use & returns</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-400 group-hover:text-zinc-800" />
                </div>
              </div>
            </div>

            {/* --- LOG OUT BUTTON --- */}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to log out of GM Fashions?")) {
                  logoutUser();
                  navigate('/');
                }
              }}
              className="w-full py-3.5 bg-red-50 hover:bg-red-100/80 text-[#dc2626] font-extrabold text-xs sm:text-sm rounded-2xl border border-red-200/80 shadow-2xs transition-all cursor-pointer font-headline uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Log Out From GM Fashions
            </button>

            {/* Footer version stamp */}
            <div className="text-center text-[10px] text-zinc-400 font-medium font-headline py-2">
              GM FASHIONS MOBILE APP v2.4.0 • CRAFTED FOR EXCELLENCE
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW 1: EDIT PROFILE & PICTURE UPLOAD */}
        {/* ==================================================================== */}
        {view === 'edit-profile' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/90 shadow-2xs space-y-6">
              
              {/* Profile Picture Upload Section at Top Center */}
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="relative group cursor-pointer" onClick={() => setShowPhotoModal(true)}>
                  {profileAvatar ? (
                    <img 
                      src={profileAvatar} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-red-100 shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#dc2626] to-[#991b1b] text-white flex items-center justify-center font-black font-headline text-3xl border-4 border-red-100 shadow-md">
                      {profileName ? profileName.substring(0, 2).toUpperCase() : 'GM'}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-[#dc2626] text-white rounded-full p-2 border-2 border-white shadow-md">
                    <Camera size={16} />
                  </div>
                </div>

                <button 
                  onClick={() => setShowPhotoModal(true)}
                  className="text-xs font-extrabold text-[#dc2626] hover:underline font-headline uppercase tracking-wider cursor-pointer"
                >
                  Add your picture
                </button>
              </div>

              {/* Input Form Fields */}
              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-zinc-700 font-headline uppercase tracking-wider">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    value={profileName} 
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/20 text-xs sm:text-sm font-medium outline-hidden transition-all bg-zinc-50/50"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-zinc-700 font-headline uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <input 
                    type="tel" 
                    value={profilePhone} 
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="Enter mobile number"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/20 text-xs sm:text-sm font-medium outline-hidden transition-all bg-zinc-50/50"
                  />
                </div>

                {/* Email ID */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-zinc-700 font-headline uppercase tracking-wider">
                    Email ID
                  </label>
                  <input 
                    type="email" 
                    value={profileEmail} 
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/20 text-xs sm:text-sm font-medium outline-hidden transition-all bg-zinc-50/50"
                  />
                </div>

                <p className="text-[11px] text-zinc-400 font-medium italic">
                  Note: None of these fields are strictly mandatory.
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveProfile}
                className="w-full py-3.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer font-headline uppercase tracking-wider text-center"
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
                    className="flex flex-col items-center justify-center p-4 bg-zinc-50 hover:bg-red-50 border border-zinc-200 hover:border-red-200 rounded-2xl transition-all cursor-pointer gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white text-[#dc2626] flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                      <Image size={22} />
                    </div>
                    <span className="text-xs font-black font-headline text-zinc-800 uppercase tracking-wider">
                      Gallery
                    </span>
                  </button>

                  {/* Camera Button */}
                  <button
                    onClick={handleCameraCapture}
                    className="flex flex-col items-center justify-center p-4 bg-zinc-50 hover:bg-red-50 border border-zinc-200 hover:border-red-200 rounded-2xl transition-all cursor-pointer gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white text-[#dc2626] flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
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

        {/* ==================================================================== */}
        {/* SUB-VIEW 2: MY COUPONS & OFFERS */}
        {/* ==================================================================== */}
        {view === 'coupons' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-2xl p-5 shadow-sm space-y-1">
              <h2 className="text-base font-black font-headline uppercase tracking-wide">
                Exclusive GM Fashion Vouchers
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
        {/* SUB-VIEW 4: MANAGE DEVICES */}
        {/* ==================================================================== */}
        {view === 'manage-devices' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs overflow-hidden divide-y divide-zinc-100">
              <div className="p-4 bg-zinc-50/80 border-b border-zinc-100">
                <h3 className="text-xs font-black text-zinc-500 font-headline uppercase tracking-widest">
                  Active Logged-In Sessions
                </h3>
              </div>

              {[
                { name: 'Chrome on Android (This Device)', location: 'Karur, Tamil Nadu', status: 'Active Now', current: true },
                { name: 'Safari on iPhone 15 Pro', location: 'Bengaluru, Karnataka', status: 'Logged in 2 days ago', current: false },
                { name: 'Chrome on Windows PC', location: 'Chennai, Tamil Nadu', status: 'Logged in 5 days ago', current: false },
              ].map((d, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-extrabold text-zinc-900 font-headline">{d.name}</h4>
                      {d.current && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase rounded-full border border-emerald-200 font-headline">
                          This Device
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 font-medium">{d.location} • {d.status}</p>
                  </div>

                  {!d.current && (
                    <button 
                      onClick={() => alert(`Logged out from ${d.name}`)}
                      className="px-3 py-1 bg-red-50 text-[#dc2626] hover:bg-red-100 text-[11px] font-extrabold rounded-lg font-headline uppercase cursor-pointer"
                    >
                      Log Out
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={() => alert("Successfully logged out from all other active sessions!")}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer font-headline uppercase tracking-wider"
            >
              Log Out From All Other Devices
            </button>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW 5: SELECT LANGUAGE */}
        {/* ==================================================================== */}
        {view === 'select-language' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs space-y-4">
              <p className="text-xs font-bold text-zinc-600 font-headline uppercase tracking-wider">
                Select your preferred app language
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {LANGUAGE_OPTIONS.map((l) => (
                  <div
                    key={l.code}
                    onClick={() => setTempLang(l.code)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      tempLang === l.code 
                        ? 'bg-red-50/80 border-[#dc2626] ring-2 ring-red-500/20 shadow-2xs' 
                        : 'bg-zinc-50/50 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        tempLang === l.code ? 'bg-[#dc2626] text-white' : 'bg-zinc-200 text-zinc-700'
                      }`}>
                        {l.char}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-zinc-900 font-headline">{l.nativeName}</h4>
                        <p className="text-[10px] text-zinc-400 font-medium">{l.englishName}</p>
                      </div>
                    </div>

                    {tempLang === l.code && (
                      <Check size={18} className="text-[#dc2626]" strokeWidth={3} />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveLanguage}
                className="w-full py-3.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer font-headline uppercase tracking-wider text-center"
              >
                {langSavedSuccess ? "LANGUAGE SAVED!" : "SAVE LANGUAGE"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW 6: SAVED ADDRESS */}
        {/* ==================================================================== */}
        {view === 'saved-address' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <button
              onClick={() => setView('add-address-location')}
              className="w-full py-3.5 bg-white hover:bg-red-50/50 border-2 border-dashed border-red-300 text-[#dc2626] font-extrabold text-xs sm:text-sm rounded-2xl shadow-2xs transition-all cursor-pointer font-headline uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Plus size={18} /> + Add New Address
            </button>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-zinc-900 text-white text-[10px] font-black uppercase rounded-md font-headline">
                        {addr.type || 'Home'}
                      </span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase rounded-md border border-emerald-200 font-headline">
                          Default Address
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => setAddresses(addresses.filter(a => a.id !== addr.id))}
                      className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Address"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 font-headline uppercase">{addr.name}</h3>
                  <p className="text-xs text-zinc-600 font-medium leading-relaxed">{addr.house}, {addr.area}</p>
                  <p className="text-xs text-zinc-500 font-medium">Mobile: {addr.phone}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW 7: ADD ADDRESS STEP 1 - LOCATION SETUP */}
        {/* ==================================================================== */}
        {view === 'add-address-location' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/90 shadow-2xs space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#dc2626] flex items-center justify-center mx-auto shadow-2xs">
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
                    setView('add-address-form');
                  }}
                  className="p-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-white text-zinc-700 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                    <Building size={20} />
                  </div>
                  <span className="text-xs font-black font-headline text-zinc-900 uppercase">
                    Away from my location
                  </span>
                  <p className="text-[10px] text-zinc-400">Enter full street address manually</p>
                </button>

                {/* Option 2: Use current location */}
                <button
                  onClick={() => {
                    setSelectedLocationMode('current');
                    setView('add-address-map');
                  }}
                  className="p-4 bg-red-50/60 hover:bg-red-100/60 border border-red-200/90 rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-[#dc2626] text-white flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                    <Navigation size={20} />
                  </div>
                  <span className="text-xs font-black font-headline text-[#dc2626] uppercase">
                    Use current location
                  </span>
                  <p className="text-[10px] text-red-600/80">Detect GPS & map coordinates</p>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-VIEW 8: ADD ADDRESS STEP 2 - INTERACTIVE MAP PREVIEW */}
        {/* ==================================================================== */}
        {view === 'add-address-map' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs overflow-hidden">
              
              {/* Interactive Simulated Map Box */}
              <div className="w-full h-64 bg-zinc-100 relative flex items-center justify-center overflow-hidden">
                {/* Simulated Grid Lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                
                {/* Map Roads Vector Mockup */}
                <div className="absolute inset-0 border-t-4 border-l-4 border-amber-300/60 top-1/3 left-0 w-full h-full rotate-6" />
                <div className="absolute inset-0 border-b-4 border-r-4 border-blue-300/60 bottom-0 right-0 w-full h-full -rotate-12" />

                {/* Pulsing Pin */}
                <div className="relative z-10 flex flex-col items-center animate-bounce">
                  <div className="w-10 h-10 rounded-full bg-[#dc2626] text-white flex items-center justify-center shadow-xl">
                    <MapPin size={22} className="fill-white" />
                  </div>
                  <div className="w-4 h-1.5 bg-black/30 rounded-full blur-xs mt-1" />
                </div>

                <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold font-headline text-zinc-800 shadow-2xs">
                  GPS Detected: 10.9601° N, 78.0766° E
                </span>
              </div>

              {/* Detected Location Card */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="bg-red-50/60 rounded-xl p-3 border border-red-100 flex items-start gap-2.5">
                  <MapPin size={18} className="text-[#dc2626] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-900 font-headline uppercase">
                      Detected Delivery Location
                    </h4>
                    <p className="text-xs text-zinc-600 font-medium mt-0.5">
                      Jawahar Bazaar Road, Near Bus Stand, Karur, Tamil Nadu - 639001
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setNewArea('Jawahar Bazaar Road, Near Bus Stand, Karur, Tamil Nadu - 639001');
                    setView('add-address-form');
                  }}
                  className="w-full py-3.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer font-headline uppercase tracking-wider text-center"
                >
                  ADD ADDRESS DETAILS
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
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/90 shadow-2xs space-y-4">
              <h2 className="text-sm sm:text-base font-black text-zinc-900 font-headline uppercase border-b border-zinc-100 pb-2">
                Deliver to this address
              </h2>

              <div className="space-y-3.5">
                {/* Flat/House/Building Name */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-zinc-700 font-headline uppercase tracking-wider">
                    Flat / House / Building Name *
                  </label>
                  <input 
                    type="text" 
                    value={newHouse} 
                    onChange={(e) => setNewHouse(e.target.value)}
                    placeholder="e.g. Door No. 12, Green Heights Appt"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#dc2626] text-xs sm:text-sm font-medium outline-hidden bg-zinc-50/50"
                  />
                </div>

                {/* Area Address */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-zinc-700 font-headline uppercase tracking-wider">
                    Area Address / Street / Landmark *
                  </label>
                  <input 
                    type="text" 
                    value={newArea} 
                    onChange={(e) => setNewArea(e.target.value)}
                    placeholder="e.g. Jawahar Bazaar, Karur, Tamil Nadu"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#dc2626] text-xs sm:text-sm font-medium outline-hidden bg-zinc-50/50"
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-zinc-700 font-headline uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter receiver's name"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#dc2626] text-xs sm:text-sm font-medium outline-hidden bg-zinc-50/50"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-zinc-700 font-headline uppercase tracking-wider">
                    Mobile Number *
                  </label>
                  <input 
                    type="tel" 
                    value={newPhone} 
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Enter receiver's phone"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#dc2626] text-xs sm:text-sm font-medium outline-hidden bg-zinc-50/50"
                  />
                </div>

                {/* Address Type Pills */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-zinc-700 font-headline uppercase tracking-wider">
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
                            ? 'bg-[#dc2626] text-white shadow-2xs' 
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
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
                className="w-full py-3.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer font-headline uppercase tracking-wider text-center"
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
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-2xs space-y-3">
              <h3 className="text-xs font-black text-zinc-500 font-headline uppercase">
                Products Shared With Friends
              </h3>

              {[
                { name: 'GM Exclusive Silk Kurta', price: '₹ 2,850', sharedDate: 'Yesterday' },
                { name: 'Casual Slim Fit Chinos', price: '₹ 1,490', sharedDate: '3 days ago' },
              ].map((s, idx) => (
                <div key={idx} className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-900 font-headline uppercase">{s.name}</h4>
                    <p className="text-[10px] text-zinc-400 font-medium">Price: {s.price} • Shared {s.sharedDate}</p>
                  </div>
                  <button 
                    onClick={() => navigate('/products')}
                    className="px-3 py-1.5 bg-zinc-900 text-white font-extrabold text-xs rounded-lg font-headline uppercase cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ))}
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

      </div>
    </div>
  );
}
