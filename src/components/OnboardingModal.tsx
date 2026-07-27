import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Shield, MapPin, Check, Globe, X, Phone, Lock, Sparkles, AlertCircle, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage, LANGUAGE_OPTIONS, LanguageCode } from '../context/LanguageContext';

export default function OnboardingModal() {
  const { 
    selectedLanguage, 
    setSelectedLanguage, 
    t, 
    user, 
    setUser, 
    isOnboardingOpen, 
    onboardingStep, 
    setOnboardingStep, 
    closeOnboarding 
  } = useLanguage();

  // Location permission modal overlay inside Step 1
  const [showLocationDialog, setShowLocationDialog] = useState<boolean>(true);
  const [locationType, setLocationType] = useState<'precise' | 'approximate'>('precise');

  // Step 2 Login State
  const [phoneInput, setPhoneInput] = useState<string>('7373772390');
  const [showTruecallerSheet, setShowTruecallerSheet] = useState<boolean>(true);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [useEmailId, setUseEmailId] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');

  // Party popper confetti burst trigger
  const triggerConfettiPop = () => {
    // Center colorful burst
    confetti({
      particleCount: 90,
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#dc2626', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#fbbf24']
    });

    // Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 65,
        origin: { x: 0.1, y: 0.6 },
        colors: ['#dc2626', '#fbbf24', '#3b82f6', '#ec4899']
      });
    }, 150);

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 65,
        origin: { x: 0.9, y: 0.6 },
        colors: ['#10b981', '#8b5cf6', '#dc2626', '#f59e0b']
      });
    }, 300);
  };

  // Reset states when onboarding opens or changes step
  useEffect(() => {
    if (isOnboardingOpen) {
      if (onboardingStep === 1) {
        setShowLocationDialog(true);
      } else if (onboardingStep === 2) {
        setShowTruecallerSheet(true);
        setIsVerifyingOtp(false);
      } else if (onboardingStep === 3) {
        triggerConfettiPop();
      }
    }
  }, [isOnboardingOpen, onboardingStep]);

  if (!isOnboardingOpen) return null;

  // Location handler
  const handleLocationResponse = (action: 'while_using' | 'only_once' | 'dont_allow') => {
    setShowLocationDialog(false);
    setUser(prev => ({
      ...prev,
      locationPermission: action === 'dont_allow' ? 'denied' : locationType
    }));
  };

  // Language choice handler
  const handleSelectLanguage = (code: LanguageCode) => {
    setSelectedLanguage(code);
    // Smoothly transition to Step 2
    setOnboardingStep(2);
  };

  // Handle One-Tap Login (Proceed)
  const handleProceedLogin = (phoneNum: string = phoneInput) => {
    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      setUser(prev => ({
        ...prev,
        phone: phoneNum.startsWith('+91') ? phoneNum : `+91 ${phoneNum}`,
        isLoggedIn: true
      }));
      setOnboardingStep(3); // Advance to Welcome Step 3
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto">
      <div className="relative w-full h-full sm:h-[640px] sm:max-w-md bg-[#dc2626] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between border-0 sm:border sm:border-red-500/20">
        
        {/* ================= TOP RED HEADER ================= */}
        <div className="bg-[#dc2626] text-white p-4 pt-5 sm:pt-6 flex flex-col shrink-0 shadow-xs">
          
          {/* Top Logo & Skip button */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black font-headline text-[#dc2626] text-sm shadow-md">
                GM
              </div>
              <span className="font-extrabold text-base tracking-wider font-headline text-white uppercase">
                GM Fashions
              </span>
            </div>

            <button
              onClick={() => closeOnboarding()}
              className="text-xs font-bold text-white/90 hover:text-white px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer font-headline tracking-wider uppercase"
            >
              {t('skip')}
            </button>
          </div>

          {/* STEP PROGRESS INDICATOR (1. Language -> 2. Login -> 3. Welcome) */}
          <div className="relative flex items-center justify-between px-6 py-1.5">
            {/* Background connecting line */}
            <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[2px] bg-white/30 z-0" />

            {/* Step 1: Language */}
            <div 
              onClick={() => setOnboardingStep(1)}
              className="relative z-10 flex flex-col items-center gap-1 cursor-pointer group"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                onboardingStep === 1 
                  ? 'bg-white text-[#dc2626] shadow-md ring-4 ring-white/20' 
                  : onboardingStep > 1 
                    ? 'bg-emerald-400 text-zinc-900' 
                    : 'bg-white/30 text-white'
              }`}>
                {onboardingStep > 1 ? <Check size={14} strokeWidth={3} /> : '1'}
              </div>
              <span className={`text-[10px] font-bold tracking-tight font-headline ${
                onboardingStep === 1 ? 'text-white' : 'text-white/70'
              }`}>
                Language
              </span>
            </div>

            {/* Step 2: Login */}
            <div 
              onClick={() => { if (user.isLoggedIn || onboardingStep >= 2) setOnboardingStep(2); }}
              className="relative z-10 flex flex-col items-center gap-1 cursor-pointer group"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                onboardingStep === 2 
                  ? 'bg-white text-[#dc2626] shadow-md ring-4 ring-white/20' 
                  : onboardingStep > 2 
                    ? 'bg-emerald-400 text-zinc-900' 
                    : 'bg-white/30 text-white'
              }`}>
                {onboardingStep > 2 ? <Check size={14} strokeWidth={3} /> : '2'}
              </div>
              <span className={`text-[10px] font-bold tracking-tight font-headline ${
                onboardingStep === 2 ? 'text-white' : 'text-white/70'
              }`}>
                Login
              </span>
            </div>

            {/* Step 3: Welcome */}
            <div 
              onClick={() => { if (user.isLoggedIn) setOnboardingStep(3); }}
              className="relative z-10 flex flex-col items-center gap-1 cursor-pointer group"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                onboardingStep === 3 
                  ? 'bg-white text-[#dc2626] shadow-md ring-4 ring-white/20' 
                  : 'bg-white/30 text-white'
              }`}>
                3
              </div>
              <span className={`text-[10px] font-bold tracking-tight font-headline ${
                onboardingStep === 3 ? 'text-white' : 'text-white/70'
              }`}>
                Welcome
              </span>
            </div>
          </div>
        </div>

        {/* ================= STEP CONTENT AREA (WHITE CONTAINER) ================= */}
        <div className="flex-1 bg-white rounded-t-3xl overflow-hidden flex flex-col relative text-zinc-900 min-h-0">
          
          <AnimatePresence mode="wait">
            
            {/* ================= STEP 1: LANGUAGE SELECTION ================= */}
            {onboardingStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="p-5 flex-1 flex flex-col justify-between overflow-y-auto relative"
              >
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 font-headline mb-4 leading-snug">
                    {t('selectLanguageTitle')}
                  </h2>

                  {/* Language Grid / List */}
                  <div className="space-y-2.5">
                    {LANGUAGE_OPTIONS.map((lang) => {
                      const isSelected = selectedLanguage === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => handleSelectLanguage(lang.code)}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-[#dc2626] bg-red-50/60 shadow-xs' 
                              : 'border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            {/* Left square avatar badge */}
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base transition-colors ${
                              isSelected ? 'bg-[#dc2626] text-white' : 'bg-red-50 text-[#dc2626]'
                            }`}>
                              {lang.char}
                            </div>
                            
                            <div className="text-left">
                              <h3 className="text-sm font-bold text-zinc-900 font-headline leading-tight">
                                {lang.nativeName}
                              </h3>
                              {lang.nativeName !== lang.englishName && (
                                <p className="text-xs font-medium text-zinc-400 mt-0.5">
                                  {lang.englishName}
                                </p>
                              )}
                            </div>
                          </div>

                          <ChevronRight size={18} className="text-zinc-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom info note */}
                <div className="mt-6 pt-3 border-t border-zinc-100 flex items-center justify-center gap-2 text-zinc-400 text-xs font-medium">
                  <Globe size={14} className="text-[#dc2626]" />
                  <span>Language preference can be changed anytime in Settings</span>
                </div>

                {/* OVERLAY: LOCATION PERMISSION DIALOG (WHITE THEME - ENGLISH - FULL CONTAINER FIT) */}
                {showLocationDialog && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute inset-0 bg-white text-zinc-900 p-4 sm:p-6 z-30 flex flex-col justify-between overflow-y-auto"
                  >
                    <div className="space-y-4">
                      {/* Top Location Icon Badge */}
                      <div className="flex justify-center pt-2">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#dc2626] border border-red-100 flex items-center justify-center shadow-xs">
                          <MapPin size={28} className="text-[#dc2626] fill-red-500/20" />
                        </div>
                      </div>

                      {/* Heading */}
                      <h3 className="text-base sm:text-lg font-extrabold text-center leading-snug font-headline text-zinc-900 px-2">
                        Allow <span className="text-[#dc2626]">GM Fashions</span> to access this device's location?
                      </h3>

                      {/* Third Party Notice Box */}
                      <div className="bg-red-50/60 rounded-2xl p-3 flex items-center gap-3 text-xs text-zinc-600 border border-red-100/80 shadow-2xs">
                        <Shield size={18} className="shrink-0 text-[#dc2626]" />
                        <span className="flex-1 leading-snug font-medium">
                          This app stated that it may share location data with third parties
                        </span>
                        <ChevronRight size={16} className="text-zinc-400 shrink-0" />
                      </div>

                      {/* Map Options Selection (Precise vs Approximate) */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        {/* Precise Option */}
                        <div
                          onClick={() => setLocationType('precise')}
                          className={`flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer ${
                            locationType === 'precise' 
                              ? 'border-[#dc2626] bg-red-50/80 ring-2 ring-red-500/20 shadow-xs' 
                              : 'border-zinc-200 bg-zinc-50/80 hover:bg-zinc-100 opacity-90'
                          }`}
                        >
                          {/* Map graphic mockup */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-red-200 relative overflow-hidden bg-red-50/50 flex items-center justify-center mb-2 shadow-inner">
                            {/* Radial grid lines */}
                            <div className="absolute inset-0 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:10px_10px] opacity-25" />
                            {/* Location Pin */}
                            <div className="w-7 h-7 rounded-full bg-[#dc2626] text-white flex items-center justify-center shadow-md z-10 animate-bounce">
                              <MapPin size={15} className="fill-white" />
                            </div>
                          </div>
                          <span className="text-xs font-black font-headline text-zinc-900">
                            Precise
                          </span>
                        </div>

                        {/* Approximate Option */}
                        <div
                          onClick={() => setLocationType('approximate')}
                          className={`flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer ${
                            locationType === 'approximate' 
                              ? 'border-[#dc2626] bg-red-50/80 ring-2 ring-red-500/20 shadow-xs' 
                              : 'border-zinc-200 bg-zinc-50/80 hover:bg-zinc-100 opacity-90'
                          }`}
                        >
                          {/* Map graphic mockup */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-amber-200 relative overflow-hidden bg-amber-50/50 flex items-center justify-center mb-2 shadow-inner">
                            {/* Road network mockup */}
                            <div className="absolute inset-0 border-t-2 border-r-2 border-amber-400/80 top-1/2 -left-2 rotate-12" />
                            <div className="absolute inset-0 border-b-2 border-red-400/80 bottom-2 right-1" />
                            <div className="w-7 h-7 rounded-full border-2 border-dashed border-amber-500 bg-amber-400/30 flex items-center justify-center z-10">
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            </div>
                          </div>
                          <span className="text-xs font-black font-headline text-zinc-900">
                            Approximate
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Option Buttons (English) */}
                    <div className="space-y-2 pt-4 border-t border-zinc-100">
                      <button
                        onClick={() => handleLocationResponse('while_using')}
                        className="w-full py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer text-center font-headline uppercase tracking-wider"
                      >
                        While using the app
                      </button>

                      <button
                        onClick={() => handleLocationResponse('only_once')}
                        className="w-full py-3 bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer text-center font-headline uppercase tracking-wider"
                      >
                        Only this time
                      </button>

                      <button
                        onClick={() => handleLocationResponse('dont_allow')}
                        className="w-full py-2.5 bg-transparent hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer text-center font-headline uppercase tracking-wider"
                      >
                        Don't allow
                      </button>
                    </div>

                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ================= STEP 2: LOGIN SCREEN & TRUECALLER BOTTOM SHEET ================= */}
            {onboardingStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="p-5 flex-1 flex flex-col justify-between overflow-y-auto relative"
              >
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 font-headline mb-5">
                    {t('loginToGetStarted')}
                  </h2>

                  {/* Phone / Email Input Form */}
                  <div className="space-y-4">
                    {!useEmailId ? (
                      <div>
                        <label className="block text-xs font-extrabold text-[#dc2626] uppercase tracking-wider mb-1 font-headline">
                          {t('phoneNumber')}
                        </label>
                        <div className="flex items-center border-2 border-[#dc2626] rounded-xl px-3 py-2.5 bg-white focus-within:ring-2 focus-within:ring-red-200">
                          <span className="text-sm font-bold text-zinc-800 pr-2 border-r border-zinc-200">
                            +91 ▼
                          </span>
                          <input
                            type="tel"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            placeholder="Enter 10 digit number"
                            className="w-full pl-3 text-sm font-bold text-zinc-900 focus:outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-extrabold text-[#dc2626] uppercase tracking-wider mb-1 font-headline">
                          Email ID
                        </label>
                        <input
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="example@gmail.com"
                          className="w-full border-2 border-[#dc2626] rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-900 focus:outline-none bg-white"
                        />
                      </div>
                    )}

                    {/* Toggle Link */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => setUseEmailId(!useEmailId)}
                        className="text-xs font-bold text-[#dc2626] hover:underline cursor-pointer font-headline"
                      >
                        {useEmailId ? "Use Phone Number" : t('useEmailId')}
                      </button>
                    </div>

                    {/* Manual submit button if sheet dismissed */}
                    {!showTruecallerSheet && (
                      <button
                        onClick={() => handleProceedLogin(useEmailId ? emailInput : phoneInput)}
                        disabled={isVerifyingOtp}
                        className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider font-headline flex items-center justify-center gap-2 mt-4"
                      >
                        {isVerifyingOtp ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{t('verifyOtp')}</span>
                          </>
                        ) : (
                          <span>Continue</span>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Terms & Privacy Note */}
                  <p className="text-[11px] text-zinc-400 font-medium leading-relaxed mt-6">
                    {t('termsAgreement')}
                  </p>
                </div>

                {/* OVERLAY: TRUECALLER / SMART ONE-TAP LOGIN BOTTOM SHEET */}
                {showTruecallerSheet && (
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl border-t border-zinc-200 shadow-[0_-10px_40px_rgba(0,0,0,0.18)] p-5 z-20 space-y-4"
                  >
                    {/* Top Row: App Brand & Language Badge */}
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-3">
                        {/* GM Brand Icon */}
                        <div className="w-10 h-10 rounded-2xl bg-[#dc2626] text-white flex items-center justify-center font-black font-headline text-base shadow-md">
                          GM
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-zinc-900 font-headline leading-tight">
                            {t('loginToGmFashions')}
                          </h3>
                          <p className="text-xs font-semibold text-zinc-500">
                            GM Fashions
                          </p>
                        </div>
                      </div>

                      {/* Language indicator pill */}
                      <button
                        onClick={() => setOnboardingStep(1)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-bold cursor-pointer transition-colors"
                      >
                        <Globe size={13} className="text-[#dc2626]" />
                        <span className="uppercase">{selectedLanguage}</span>
                      </button>
                    </div>

                    {/* Detected Active SIM Number Display */}
                    <div className="bg-red-50/70 border border-red-100 rounded-2xl p-3.5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block">
                          Verified Mobile SIM
                        </span>
                        <span className="text-base font-black text-zinc-900 font-headline tracking-wide">
                          +91 {phoneInput}
                        </span>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    </div>

                    {/* Primary Button: PROCEED */}
                    <button
                      onClick={() => handleProceedLogin(phoneInput)}
                      disabled={isVerifyingOtp}
                      className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer uppercase tracking-wider font-headline flex items-center justify-center gap-2 transform active:scale-98"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Auto-Verifying OTP...</span>
                        </>
                      ) : (
                        <span>{t('proceed')}</span>
                      )}
                    </button>

                    {/* Secondary Button: USE ANOTHER MOBILE NUMBER */}
                    <button
                      onClick={() => setShowTruecallerSheet(false)}
                      className="w-full py-2 text-xs font-extrabold text-zinc-600 hover:text-zinc-900 transition-colors uppercase tracking-wider font-headline cursor-pointer text-center"
                    >
                      {t('useAnotherNumber')}
                    </button>

                    {/* Bottom Fine Print */}
                    <p className="text-[10px] text-zinc-400 font-medium text-center leading-relaxed border-t border-zinc-100 pt-3">
                      {t('truecallerDisclaimer')}
                    </p>
                  </motion.div>
                )}

              </motion.div>
            )}

            {/* ================= STEP 3: WELCOME & COMPLETION ================= */}
            {onboardingStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-6"
              >
                {/* GM Fashions Shop Logo Badge with Confetti Pop Trigger */}
                <div 
                  onClick={triggerConfettiPop}
                  className="relative flex flex-col items-center cursor-pointer group transform hover:scale-105 transition-transform"
                  title="Click to pop confetti!"
                >
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#dc2626] via-[#b91c1c] to-[#991b1b] text-white flex flex-col items-center justify-center shadow-2xl border-4 border-red-100 relative overflow-visible">
                    {/* GM Monogram Box */}
                    <div className="w-10 h-10 rounded-2xl bg-white text-[#dc2626] flex items-center justify-center font-black font-headline text-lg shadow-md mb-1">
                      GM
                    </div>
                    {/* Brand Subtitle */}
                    <span className="text-[9px] font-black tracking-widest font-headline uppercase text-red-100">
                      FASHIONS
                    </span>
                    
                    {/* Verified Success Check Badge */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <Check size={18} strokeWidth={3} />
                    </div>

                    {/* Party Popper Icon Top Left */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-amber-400 text-zinc-900 flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                      <PartyPopper size={18} />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-red-600 mt-2 flex items-center justify-center gap-1 uppercase tracking-wider font-headline">
                    Click logo to pop party colors!
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-black text-zinc-900 font-headline">
                    {t('welcomeGreeting')}
                  </h2>
                  <div className="inline-block px-3.5 py-1 bg-red-50 text-[#dc2626] rounded-full text-xs font-bold font-headline border border-red-100 shadow-2xs">
                    Logged in as: {user.phone}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
                    {t('welcomeSubText')}
                  </p>
                </div>

                {/* Continue Shopping Button */}
                <button
                  onClick={() => closeOnboarding()}
                  className="w-full max-w-xs bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-lg transition-all cursor-pointer uppercase tracking-wider font-headline transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <PartyPopper size={16} />
                  {t('continueShopping')}
                </button>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
