import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'mr';

export interface LanguageOption {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  char: string; // Left icon character representation
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'hi', nativeName: 'हिंदी', englishName: 'Hindi', char: 'ह' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil', char: 'த' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu', char: 'తె' },
  { code: 'kn', nativeName: 'கன்னட', englishName: 'Kannada', char: 'க' },
  { code: 'en', nativeName: 'English', englishName: 'English', char: 'A' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi', char: 'म' },
];

export interface SavedAddressItem {
  id: string;
  name: string;
  phone: string;
  house: string;
  area: string;
  type?: string;
  isDefault?: boolean;
}

export interface UserProfile {
  phone: string;
  name: string;
  email?: string;
  avatar?: string;
  isLoggedIn: boolean;
  locationPermission?: 'precise' | 'approximate' | 'denied';
  addresses?: SavedAddressItem[];
}

// Translations dictionary for key UI components
export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    selectLanguageTitle: "Which language do you want to see GM Fashions in?",
    language: "Language",
    login: "Login",
    welcome: "Welcome",
    skip: "SKIP",
    searchPlaceholder: "Search for products, brands and more...",
    men: "Men",
    women: "Women",
    kids: "Kids",
    accessories: "Accessories",
    myOrders: "My Orders",
    shoppingBag: "Shopping Bag",
    account: "Account",
    categories: "Categories",
    home: "Home",
    loginToGetStarted: "Login to get started",
    phoneNumber: "Phone Number",
    useEmailId: "Use Email-ID",
    proceed: "PROCEED",
    useAnotherNumber: "USE ANOTHER MOBILE NUMBER",
    loginToGmFashions: "Login to GM Fashions",
    locationHeading: "Allow GM Fashions to access this device's location?",
    locationSubText: "This app stated that it may share location data with third parties",
    precise: "Precise",
    approximate: "Approximate",
    whileUsingApp: "While using the app",
    onlyThisTime: "Only this time",
    dontAllow: "Don't allow",
    welcomeGreeting: "Welcome to GM Fashions!",
    welcomeSubText: "You are successfully logged in. Enjoy an exclusive fashion shopping experience.",
    continueShopping: "Continue Shopping",
    logout: "Logout",
    verifyOtp: "Verifying mobile number with auto-OTP...",
    termsAgreement: "By continuing, you confirm that you agree to GM Fashions's Terms of Use and Privacy Policy",
    truecallerDisclaimer: "By continuing you accept to share your profile information with GM Fashions, and agree to the privacy policy and terms of service of GM Fashions."
  },
  ta: {
    selectLanguageTitle: "GM Fashions பயன்பாட்டை எந்த மொழியில் பார்க்க விரும்புகிறீர்கள்?",
    language: "மொழி",
    login: "உள்நுழைக",
    welcome: "வரவேற்பு",
    skip: "SKIP",
    searchPlaceholder: "ஆடைகள், பிராண்டுகள் மற்றும் பலவற்றைத் தேடுங்கள்...",
    men: "ஆண்கள்",
    women: "பெண்கள்",
    kids: "குழந்தைகள்",
    accessories: "அணிகலன்கள்",
    myOrders: "என் ஆர்டர்கள்",
    shoppingBag: "ஷாப்பிங் பை",
    account: "கணக்கு",
    categories: "பிரிவுகள்",
    home: "முகப்பு",
    loginToGetStarted: "தொடங்க உள்நுழையவும்",
    phoneNumber: "தொலைபேசி எண்",
    useEmailId: "மின்னஞ்சல் ஐடியைப் பயன்படுத்தவும்",
    proceed: "தொடரவும்",
    useAnotherNumber: "வெறு மொபைல் எண்ணைப் பயன்படுத்தவும்",
    loginToGmFashions: "GM Fashions இல் உள்நுழைக",
    locationHeading: "இந்த சாதனத்தின் இருப்பிடத்தை அணுக GM Fashions ஐ அனுமதிக்கவா?",
    locationSubText: "இந்த ஆப் மூன்றாம் தரப்பினருடன் இருப்பிடத் தரவைப் பகிரக்கூடும் எனக் குறிப்பிடப்பட்டுள்ளது",
    precise: "துல்லியமான",
    approximate: "தோராயமான",
    whileUsingApp: "ஆப் பயன்படுத்தும் போது",
    onlyThisTime: "இந்த ஒரு முறை மட்டும்",
    dontAllow: "அனுமதிக்க வேண்டாம்",
    welcomeGreeting: "GM Fashions க்கு நல்வரவு!",
    welcomeSubText: "நீங்கள் வெற்றிகரமாக உள்நுழைந்துவிட்டீர்கள். சிறப்பு ஆடைகளை வாங்கி மகிழுங்கள்.",
    continueShopping: "ஷாப்பிங்கைத் தொடரவும்",
    logout: "வெளியேறு",
    verifyOtp: "தானியங்கி OTP மூலம் மொபைல் எண் சரிபார்க்கப்படுகிறது...",
    termsAgreement: "தொடர்வதன் மூலம், GM Fashions இன் பயன்பாட்டு விதிகள் மற்றும் தனியுரிமைக் கொள்கையை ஏற்கிறீர்கள்",
    truecallerDisclaimer: "தொடர்வதன் மூலம் உங்கள் சுயவிவரத் தகவலை GM Fashions உடன் பகிர ஒப்புக்கொள்கிறீர்கள்."
  },
  hi: {
    selectLanguageTitle: "आप GM Fashions को किस भाषा में देखना चाहते हैं?",
    language: "भाषा",
    login: "लॉगिन",
    welcome: "स्वागत है",
    skip: "छोड़ें",
    searchPlaceholder: "उत्पादों, ब्रांडों और अधिक की खोज करें...",
    men: "पुरुष",
    women: "महिलाएं",
    kids: "बच्चे",
    accessories: "एक्सेसरीज",
    myOrders: "मेरे ऑर्डर",
    shoppingBag: "शॉपिंग बैग",
    account: "खाता",
    categories: "श्रेणियां",
    home: "होम",
    loginToGetStarted: "शुरू करने के लिए लॉगिन करें",
    phoneNumber: "फोन नंबर",
    useEmailId: "ईमेल-आईडी का उपयोग करें",
    proceed: "आगे बढ़ें",
    useAnotherNumber: "अन्य मोबाइल नंबर का उपयोग करें",
    loginToGmFashions: "GM Fashions में लॉगिन करें",
    locationHeading: "क्या GM Fashions को इस डिवाइस की लोकेशन एक्सेस करने दें?",
    locationSubText: "इस ऐप ने कहा है कि यह तीसरे पक्ष के साथ लोकेशन डेटा साझा कर सकता है",
    precise: "सटीक",
    approximate: "अनुमानित",
    whileUsingApp: "ऐप का उपयोग करते समय",
    onlyThisTime: "केवल इस बार",
    dontAllow: "अनुमति न दें",
    welcomeGreeting: "GM Fashions में आपका स्वागत है!",
    welcomeSubText: "आप सफलतापूर्वक लॉगिन हो चुके हैं। विशेष फैशन खरीदारी का आनंद लें।",
    continueShopping: "खरीदारी जारी रखें",
    logout: "लॉगआउट",
    verifyOtp: "ऑटो-ओटीपी से मोबाइल नंबर का सत्यापन हो रहा है...",
    termsAgreement: "आगे बढ़कर, आप पुष्टि करते हैं कि आप GM Fashions की शर्तों और गोपनीयता नीति से सहमत हैं",
    truecallerDisclaimer: "आगे बढ़कर आप GM Fashions के साथ अपनी प्रोफ़ाइल जानकारी साझा करने से सहमत होते हैं।"
  },
  te: {
    selectLanguageTitle: "మీరు GM Fashions ని ఏ భాషలో చూడాలనుకుంటున్నారు?",
    language: "భాష",
    login: "లాగిన్",
    welcome: "స్వాగతం",
    skip: "స్కిప్",
    searchPlaceholder: "ఉత్పత్తులు, బ్రాండ్లు మరియు మరిన్నింటి కోసం వెతకండి...",
    men: "పురుషులు",
    women: "మహిళలు",
    kids: "పిల్లలు",
    accessories: "యాక్సెసరీస్",
    myOrders: "నా ఆర్డర్లు",
    shoppingBag: "షాపింగ్ బ్యాగ్",
    account: "ఖాతా",
    categories: "వర్గాలు",
    home: "హోమ్",
    loginToGetStarted: "ప్రారంభించడానికి లాగిన్ అవ్వండి",
    phoneNumber: "ఫోన్ నంబర్",
    useEmailId: "ఇమెయిల్-ఐడీ ఉపయోగించండి",
    proceed: "ముందుకు సాగండి",
    useAnotherNumber: "మరొక మొబైల్ నంబర్ ఉపయోగించండి",
    loginToGmFashions: "GM Fashions లోకి లాగిన్ చేయండి",
    locationHeading: "GM Fashions ని ఈ పరికరం స్థానాన్ని యాక్సెస్ చేయడానికి అనుమతించాలా?",
    locationSubText: "ఈ యాప్ మూడవ పక్షాలతో లొకేషన్ డేటాను పంచుకోవచ్చని పేర్కొంది",
    precise: "ఖచ్చితమైన",
    approximate: "సుమారుగా",
    whileUsingApp: "యాప్ ఉపయోగిస్తున్నప్పుడు",
    onlyThisTime: "ఈ ఒక్కసారి మాత్రమే",
    dontAllow: "అనుమతించవద్దు",
    welcomeGreeting: "GM Fashions కు స్వాగతం!",
    welcomeSubText: "మీరు విజయవంతంగా లాగిన్ అయ్యారు. ప్రత్యేకం ఆన్‌లైన్ షాపింగ్‌ను ఆస్వాదించండి.",
    continueShopping: "షాపింగ్ కొనసాగించండి",
    logout: "లాగ్ అవుట్",
    verifyOtp: "ఆటో-OTP ద్వారా మొబైల్ నంబర్ సరిచూడబడుతోంది...",
    termsAgreement: "కొనసాగించడం ద్వారా, మీరు GM Fashions నిబంధనలను అంగీకరిస్తున్నారు",
    truecallerDisclaimer: "కొనసాగించడం ద్వారా మీరు GM Fashions తో మీ సమాచారాన్ని పంచుకోవడానికి అంగీకరిస్తున్నారు."
  },
  kn: {
    selectLanguageTitle: "ನೀವು GM Fashions ಅನ್ನು ಯಾವ ಭಾಷೆಯಲ್ಲಿ ನೋಡಲು ಬಯಸುತ್ತೀರಿ?",
    language: "ಭಾಷೆ",
    login: "ಲಾಗಿನ್",
    welcome: "ಸ್ವಾಗತ",
    skip: "ಸ್ಕಿಪ್",
    searchPlaceholder: "ಉತ್ಪನ್ನಗಳು, ಬ್ರ್ಯಾಂಡ್‌ಗಳು ಮತ್ತು ಹೆಚ್ಚಿನದನ್ನು ಹುಡುಕಿ...",
    men: "ಪುರುಷರು",
    women: "ಮಹಿಳೆಯರು",
    kids: "ಮಕ್ಕಳು",
    accessories: "ಪರಿಕರಗಳು",
    myOrders: "ನನ್ನ ಆರ್ಡರ್‌ಗಳು",
    shoppingBag: "ಶಾಪಿಂಗ್ ಬ್ಯಾಗ್",
    account: "ಖಾತೆ",
    categories: "ವರ್ಗಗಳು",
    home: "ಹೋಮ್",
    loginToGetStarted: "ಪ್ರಾರಂಭಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ",
    phoneNumber: "ಫೋನ್ ಸಂಖ್ಯೆ",
    useEmailId: "ಇಮೇಲ್-ಐಡಿ ಬಳಸಿ",
    proceed: "ಮುಂದುವರಿಯಿರಿ",
    useAnotherNumber: "ಮತ್ತೊಂದು ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಬಳಸಿ",
    loginToGmFashions: "GM Fashions ಗೆ ಲಾಗಿನ್ ಮಾಡಿ",
    locationHeading: "ಈ ಸಾಧನದ ಸ್ಥಳವನ್ನು ಪ್ರವೇಶಿಸಲು GM Fashions ಗೆ ಅನುಮತಿಸಬೇಕೆ?",
    locationSubText: "ಈ ಆಪ್ ಮೂರನೇ ವ್ಯಕ್ತಿಗಳೊಂದಿಗೆ ಸ್ಥಳ ಡೇಟಾವನ್ನು ಹಂಚಿಕೊಳ್ಳಬಹುದು ಎಂದು ತಿಳಿಸಲಾಗಿದೆ",
    precise: "ನಿಖರವಾದ",
    approximate: "ಅಂದಾಜು",
    whileUsingApp: "ಆಪ್ ಬಳಸುವಾಗ",
    onlyThisTime: "ಈ ಬಾರಿ ಮಾತ್ರ",
    dontAllow: "ಅನುಮತಿಸಬೇಡಿ",
    welcomeGreeting: "GM Fashions ಗೆ ಸ್ವಾಗತ!",
    welcomeSubText: "ನೀವು ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ.",
    continueShopping: "ಶಾಪಿಂಗ್ ಮುಂದುವರಿಸಿ",
    logout: "ಲಾಗಿನ್ ออก",
    verifyOtp: "ಆಟೋ-OTP ಮೂಲಕ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    termsAgreement: "ಮುಂದುವರಿಯುವ ಮೂಲಕ, ನೀವು GM Fashions ನಿಯಮಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳುತ್ತೀರಿ",
    truecallerDisclaimer: "ಮುಂದುವರಿಯುವ ಮೂಲಕ ನೀವು GM Fashions ನೊಂದಿಗೆ ಮಾಹಿತಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳಲು ಒಪ್ಪುತ್ತೀರಿ."
  },
  mr: {
    selectLanguageTitle: "तुम्हाला GM Fashions कोणत्या भाषेत पाहायचे आहे?",
    language: "भाषा",
    login: "लॉगिन",
    welcome: "स्वागत आहे",
    skip: "वगळा",
    searchPlaceholder: "उत्पादने, ब्रँड आणि बरेच काही शोधा...",
    men: "पुरुष",
    women: "महिला",
    kids: "मुले",
    accessories: "अॅक्सेसरीज",
    myOrders: "माझ्या ऑर्डर्स",
    shoppingBag: "शॉपिंग बॅग",
    account: "खाते",
    categories: "श्रेणी",
    home: "होम",
    loginToGetStarted: "सुरू करण्यासाठी लॉगिन करा",
    phoneNumber: "फोन नंबर",
    useEmailId: "ईमेल-आयडी वापरा",
    proceed: "पुढे जा",
    useAnotherNumber: "दुसरा मोबाईल नंबर वापरा",
    loginToGmFashions: "GM Fashions मध्ये लॉगिन करा",
    locationHeading: "GM Fashions ला या डिव्हाइसचे लोकेशन ॲक्सेस करण्याची अनुमती द्यायची?",
    locationSubText: "हे ॲप तृतीय पक्षांसह स्थान डेटा शेअर करू शकते असे नमूद केले आहे",
    precise: "अचूक",
    approximate: "अंदाजे",
    whileUsingApp: "ॲप वापरताना",
    onlyThisTime: "फक्त या वेळी",
    dontAllow: "अनुमती देऊ नका",
    welcomeGreeting: "GM Fashions मध्ये आपले स्वागत आहे!",
    welcomeSubText: "तुम्ही यशस्वीरीत्या लॉगिन झाले आहात.",
    continueShopping: "खरेदी सुरू ठेवा",
    logout: "लॉगआउट",
    verifyOtp: "ऑटो-OTP सह मोबाईल नंबरची पडताळणी करत आहे...",
    termsAgreement: "पुढे जावून, तुम्ही GM Fashions च्या अटींशी सहमत आहात",
    truecallerDisclaimer: "पुढे जावून तुम्ही GM Fashions सोबत तुमची माहिती शेअर करण्यास सहमती देता."
  }
};

interface LanguageContextType {
  selectedLanguage: LanguageCode;
  setSelectedLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isOnboardingOpen: boolean;
  onboardingStep: number; // 1: Language, 2: Login, 3: Welcome
  setOnboardingStep: (step: number) => void;
  openOnboarding: (step?: number) => void;
  closeOnboarding: () => void;
  logoutUser: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('gm_language') as LanguageCode) || 'ta'; // Default Tamil/English friendly
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('gm_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            phone: parsed.phone || '',
            name: parsed.name || '',
            email: parsed.email || '',
            avatar: parsed.avatar || '',
            isLoggedIn: typeof parsed.isLoggedIn === 'boolean' ? parsed.isLoggedIn : Boolean(parsed.phone || parsed.name),
            addresses: Array.isArray(parsed.addresses) ? parsed.addresses : []
          };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return {
      phone: '',
      name: '',
      email: '',
      avatar: '',
      isLoggedIn: false,
      addresses: []
    };
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);

  // Sync user state to localStorage when updated
  useEffect(() => {
    try {
      localStorage.setItem('gm_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const setSelectedLanguage = (lang: LanguageCode) => {
    setSelectedLanguageState(lang);
    localStorage.setItem('gm_language', lang);
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[selectedLanguage] || TRANSLATIONS['en'];
    return langDict[key] || TRANSLATIONS['en'][key] || key;
  };

  const openOnboarding = (step: number = 1) => {
    setOnboardingStep(step);
    setIsOnboardingOpen(true);
  };

  const closeOnboarding = () => {
    setIsOnboardingOpen(false);
  };

  const logoutUser = () => {
    setUser({
      phone: '',
      name: '',
      email: '',
      avatar: '',
      isLoggedIn: false,
      addresses: []
    });
    localStorage.removeItem('gm_user');
    localStorage.removeItem('gm_saved_addresses');
    localStorage.removeItem('gm_onboarding_completed');
    localStorage.removeItem('wishlist');
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <LanguageContext.Provider value={{
      selectedLanguage,
      setSelectedLanguage,
      t,
      user,
      setUser,
      isOnboardingOpen,
      onboardingStep,
      setOnboardingStep,
      openOnboarding,
      closeOnboarding,
      logoutUser
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
