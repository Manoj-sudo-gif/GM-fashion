import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, Package, User, X, ChevronRight, ChevronLeft, ShoppingBag, MapPin, Wallet, ArrowRight, Heart, PhoneCall, Trash2, Check, Award, Globe, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import shopkeeperImg from '../assets/images/mens_fashion_empty_orders_illustration_1784884242598.jpg';
import { useLanguage } from '../context/LanguageContext';

interface OrderItem {
  id: number;
  name: string;
  price: string;
  priceVal: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Order Placed' | 'Shipped' | 'In Transit' | 'Delivered';
  address: string;
}

export default function BottomNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedLanguage, t, user, openOnboarding } = useLanguage();

  // State for slide-up drawers
  const [activeDrawer, setActiveDrawer] = useState<'categories' | 'orders' | 'account' | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Selected category state inside the drawer
  const [selectedMainCat, setSelectedMainCat] = useState<'men' | 'boys' | 'kids' | 'accessories'>('men');

  // Drawer search & counts state
  const [isDrawerSearchOpen, setIsDrawerSearchOpen] = useState(false);
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalCartQty = Array.isArray(cart) ? cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) : 0;
        setCartCount(totalCartQty);
      } catch (e) {
        console.error(e);
      }
    };
    updateCounts();
    window.addEventListener('storage', updateCounts);
    return () => window.removeEventListener('storage', updateCounts);
  }, [activeDrawer]);

  // Structured Category data for the full screen categories drawer
  const detailedCategoriesData = {
    men: [
      {
        groupName: 'Topwear',
        items: [
          { name: 'Shirt', url: '/products?category=Men&search=shirt', img: 'https://styleunion.in/cdn/shop/files/SMYS00049DARKOLIVE_1.webp?v=1783502402&width=1100' },
          { name: 'T-Shirt', url: '/products?category=Men&search=tshirt', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80' },
          { name: 'T-Shirt Combo', url: '/products?category=Men&search=combo', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        groupName: 'Bottomwear',
        items: [
          { name: 'Track Pant', url: '/products?category=Men&search=track', img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=400&q=80' },
          { name: 'Shorts', url: '/products?category=Men&search=shorts', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=400&q=80' },
          { name: 'Jeans', url: '/products?category=Men&search=jeans', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80' },
          { name: 'Cotton Pant', url: '/products?category=Men&search=cotton', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80' },
          { name: 'Formal Pant', url: '/products?category=Men&search=formal', img: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        groupName: 'Innerwear',
        items: [
          { name: 'Vest', url: '/products?category=Men&search=vest', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80' },
          { name: 'Gym Vest', url: '/products?category=Men&search=gym', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80' },
          { name: 'Brief', url: '/products?category=Men&search=brief', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80' },
          { name: 'Trunk', url: '/products?category=Men&search=trunk', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80' },
          { name: 'Printed Brief', url: '/products?category=Men&search=printed%20brief', img: 'https://images.unsplash.com/photo-1506629082925-2368c4b2b000?auto=format&fit=crop&w=400&q=80' },
          { name: 'Printed Trunk', url: '/products?category=Men&search=printed%20trunk', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80' },
          { name: 'Colour Vest', url: '/products?category=Men&search=colour%20vest', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        groupName: 'Traditional',
        items: [
          { name: 'White Shirt', url: '/products?category=Men&search=white%20shirt', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80' },
          { name: 'Dhoti', url: '/products?category=Men&search=dhoti', img: 'https://m.media-amazon.com/images/I/71sQIeakXfL._AC_UY1100_.jpg' },
          { name: 'Lungi', url: '/products?category=Men&search=lungi', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80' },
          { name: 'Set Dhoti', url: '/products?category=Men&search=set%20dhoti', img: 'https://m.media-amazon.com/images/I/71sQIeakXfL._AC_UY1100_.jpg' },
          { name: 'Political Dhoti', url: '/products?category=Men&search=political%20dhoti', img: 'https://m.media-amazon.com/images/I/71sQIeakXfL._AC_UY1100_.jpg' }
        ]
      }
    ],
    boys: [
      {
        groupName: 'Topwear',
        items: [
          { name: 'Shirt', url: '/products?category=Boys&search=shirt', img: 'https://cdn.shopify.com/s/files/1/0583/4820/8201/files/UntitledSession2999.jpg' },
          { name: 'T-Shirt', url: '/products?category=Boys&search=tshirt', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=400&q=80' },
          { name: 'T-Shirt Combo', url: '/products?category=Boys&search=combo', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=80' },
          { name: 'Casual Shirt', url: '/products?category=Boys&search=casual', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80' },
          { name: 'Polo Tee', url: '/products?category=Boys&search=polo', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=400&q=80' },
          { name: 'Hoodies & Sweaters', url: '/products?category=Boys&search=hoodie', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        groupName: 'Bottomwear',
        items: [
          { name: 'Track Pant', url: '/products?category=Boys&search=track', img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=400&q=80' },
          { name: 'Shorts', url: '/products?category=Boys&search=shorts', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80' },
          { name: 'Jeans', url: '/products?category=Boys&search=jeans', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=400&q=80' },
          { name: 'Cotton Pant', url: '/products?category=Boys&search=cotton', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80' },
          { name: 'Formal Pant', url: '/products?category=Boys&search=formal', img: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        groupName: 'Innerwear',
        items: [
          { name: 'Vest', url: '/products?category=Boys&search=vest', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80' },
          { name: 'Gym Vest', url: '/products?category=Boys&search=gym', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80' },
          { name: 'Brief', url: '/products?category=Boys&search=brief', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80' },
          { name: 'Trunk', url: '/products?category=Boys&search=trunk', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80' },
          { name: 'Printed Brief', url: '/products?category=Boys&search=printed%20brief', img: 'https://images.unsplash.com/photo-1506629082925-2368c4b2b000?auto=format&fit=crop&w=400&q=80' },
          { name: 'Printed Trunk', url: '/products?category=Boys&search=printed%20trunk', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80' },
          { name: 'Colour Vest', url: '/products?category=Boys&search=colour%20vest', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        groupName: 'Traditional',
        items: [
          { name: 'White Shirt', url: '/products?category=Boys&search=white%20shirt', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80' },
          { name: 'Dhoti', url: '/products?category=Boys&search=dhoti', img: 'https://m.media-amazon.com/images/I/71sQIeakXfL._AC_UY1100_.jpg' },
          { name: 'Lungi', url: '/products?category=Boys&search=lungi', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80' },
          { name: 'Set Dhoti', url: '/products?category=Boys&search=set%20dhoti', img: 'https://m.media-amazon.com/images/I/71sQIeakXfL._AC_UY1100_.jpg' },
          { name: 'Kurta Set', url: '/products?category=Boys&search=kurta', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80' }
        ]
      }
    ],
    kids: [
      {
        groupName: 'Topwear',
        items: [
          { name: 'Shirt', url: '/products?category=Kids&search=shirt', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80' },
          { name: 'T-Shirt', url: '/products?category=Kids&search=tshirt', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=400&q=80' },
          { name: 'T-Shirt Combo', url: '/products?category=Kids&search=combo', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=80' },
          { name: 'Casual Top', url: '/products?category=Kids&search=top', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=400&q=80' },
          { name: 'Polo Tee', url: '/products?category=Kids&search=polo', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=400&q=80' },
          { name: 'Printed Tee', url: '/products?category=Kids&search=printed', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        groupName: 'Bottomwear',
        items: [
          { name: 'Track Pant', url: '/products?category=Kids&search=track', img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=400&q=80' },
          { name: 'Shorts', url: '/products?category=Kids&search=shorts', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80' },
          { name: 'Jeans', url: '/products?category=Kids&search=jeans', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=400&q=80' },
          { name: 'Cotton Pant', url: '/products?category=Kids&search=cotton', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80' },
          { name: 'Leggings & Pants', url: '/products?category=Kids&search=leggings', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        groupName: 'Innerwear & Baby Essentials',
        items: [
          { name: 'Vest', url: '/products?category=Kids&search=vest', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80' },
          { name: 'Brief', url: '/products?category=Kids&search=brief', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80' },
          { name: 'Trunk', url: '/products?category=Kids&search=trunk', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80' },
          { name: 'Onesies', url: '/products?category=Kids&search=romper', img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80' },
          { name: 'Inner Vests', url: '/products?category=Kids&search=innerwear', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80' },
          { name: 'Printed Brief', url: '/products?category=Kids&search=printed%20brief', img: 'https://images.unsplash.com/photo-1506629082925-2368c4b2b000?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        groupName: 'Traditional & Ethnic',
        items: [
          { name: 'Kurta Pyjama', url: '/products?category=Kids&search=kurta', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80' },
          { name: 'Frock & Gown', url: '/products?category=Kids&search=frock', img: 'https://www.mumkins.in/cdn/shop/files/1_acb25f3d-7de5-4d76-a9a0-108592db9e9a.webp?v=1778479117&width=1080' },
          { name: 'Kids Dhoti Set', url: '/products?category=Kids&search=dhoti', img: 'https://m.media-amazon.com/images/I/71sQIeakXfL._AC_UY1100_.jpg' },
          { name: 'Ethnic Suit', url: '/products?category=Kids&search=suit', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80' },
          { name: 'White Shirt & Dhoti', url: '/products?category=Kids&search=white%20shirt', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80' }
        ]
      }
    ],
    accessories: [
      {
        groupName: 'Accessories Collection',
        items: [
          { name: 'Perfume & Cologne', url: '/products?category=Accessories&search=perfume', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80' },
          { name: 'Belts', url: '/products?category=Accessories&search=belt', img: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=400&q=80' },
          { name: 'Wallets', url: '/products?category=Accessories&search=wallet', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80' },
          { name: 'Glasses & Eyewear', url: '/products?category=Accessories&search=glasses', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80' },
          { name: 'Footwear & Juttis', url: '/products?category=Accessories&search=footwear', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80' },
          { name: 'Dhotis & Shawls', url: '/products?category=Accessories&search=dhoti', img: 'https://m.media-amazon.com/images/I/71sQIeakXfL._AC_UY1100_.jpg' }
        ]
      }
    ]
  };

  // Load orders from localStorage
  const loadOrders = () => {
    try {
      if (!user || !user.isLoggedIn || !user.phone) {
        setOrders([]);
        return;
      }
      const userPhoneDigits = user.phone.replace(/\D/g, '').slice(-10);
      const saved = localStorage.getItem('orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const userOrders = parsed.filter((o: any) => {
            const orderPhone = (o.phone || (typeof o.address === 'object' ? o.address?.phone : '') || '').replace(/\D/g, '').slice(-10);
            return orderPhone === userPhoneDigits;
          });
          setOrders(userOrders);
        } else {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    } catch (e) {
      console.error(e);
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [activeDrawer, user]);

  // Sync navigation active state
  const currentPath = location.pathname;

  // Hide bottom navigation on checkout, orders, and account pages
  const isHideBottomNav = 
    currentPath.startsWith('/checkout') ||
    currentPath.startsWith('/orders') ||
    currentPath.startsWith('/my-orders') ||
    currentPath.startsWith('/account');

  if (isHideBottomNav) {
    return null;
  }

  const isHomeActive = currentPath === '/' && activeDrawer === null;
  const isCategoriesActive = activeDrawer === 'categories';
  const isOrdersActive = currentPath === '/orders' || currentPath === '/my-orders' || activeDrawer === 'orders';
  const isAccountActive = currentPath === '/account' || activeDrawer === 'account';

  // Helper to handle tab clicks
  const handleTabClick = (tab: 'home' | 'categories' | 'orders' | 'account') => {
    if (tab === 'home') {
      setActiveDrawer(null);
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'orders') {
      setActiveDrawer(null);
      navigate('/orders');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'account') {
      setActiveDrawer(null);
      navigate('/account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (activeDrawer === tab) {
        setActiveDrawer(null); // Toggle off
      } else {
        setActiveDrawer(tab);
      }
    }
  };

  // Close all drawers
  const closeDrawer = () => {
    setActiveDrawer(null);
  };

  // Clear orders handler (for debug/testing)
  const handleClearOrders = () => {
    if (window.confirm("Are you sure you want to clear your order history?")) {
      localStorage.removeItem('orders');
      setOrders([]);
    }
  };

  // Format currency in Indian Rupees
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Category data for the bottom sheet
  const categoriesList = {
    men: [
      { name: 'Shirts', url: '/products?category=Men', img: 'https://styleunion.in/cdn/shop/files/SMYS00049DARKOLIVE_1.webp?v=1783502402&width=1100' },
      { name: 'Trousers & Pants', url: '/products?category=Men', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80' },
      { name: 'Kurta & Ethnic', url: '/products?category=Men', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80' },
      { name: 'Jeans & Denim', url: '/products?category=Men', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80' }
    ],
    boys: [
      { name: 'Casual Shirts', url: '/products?category=Boys', img: 'https://cdn.shopify.com/s/files/1/0583/4820/8201/files/UntitledSession2999.jpg' },
      { name: 'Polo & Tees', url: '/products?category=Boys', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=400&q=80' },
      { name: 'Denims & Shorts', url: '/products?category=Boys', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=400&q=80' }
    ],
    kids: [
      { name: 'Frock & Gowns', url: '/products?category=Kids', img: 'https://www.mumkins.in/cdn/shop/files/1_acb25f3d-7de5-4d76-a9a0-108592db9e9a.webp?v=1778479117&width=1080' },
      { name: 'Boys Suits', url: '/products?category=Kids', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80' },
      { name: 'Tees & Sets', url: '/products?category=Kids', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80' }
    ],
    accessories: [
      { name: 'Dhotis', url: '/products?category=Accessories', img: 'https://m.media-amazon.com/images/I/71sQIeakXfL._AC_UY1100_.jpg' },
      { name: 'Footwear & Juttis', url: '/products?category=Accessories', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80' },
      { name: 'Belts & Wallets', url: '/products?category=Accessories', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80' }
    ]
  };

  // Mock static orders if there is none in history
  const mockPastOrders: Order[] = [
    {
      id: "GMF-482931",
      date: "14 Jul 2026",
      items: [
        {
          id: 101,
          name: 'ROYAL LINEN DHOTI',
          price: '₹ 1,850',
          priceVal: 1850,
          image: 'https://m.media-amazon.com/images/I/71sQIeakXfL._AC_UY1100_.jpg',
          color: '#ffffff',
          size: 'Free Size',
          quantity: 1
        },
        {
          id: 102,
          name: 'AIM COTTON SLIM SHIRT',
          price: '₹ 2,400',
          priceVal: 2400,
          image: 'https://styleunion.in/cdn/shop/files/SMYS00049DARKOLIVE_1.webp?v=1783502402&width=1100',
          color: '#556b2f',
          size: 'L',
          quantity: 1
        }
      ],
      total: 4250,
      status: 'Delivered',
      address: '12, MG Road, Bengaluru, Karnataka - 560001'
    }
  ];

  const displayedOrders = orders;

  return (
    <>
      {/* BOTTOM NAVIGATION BAR: Sticky, high-performance, purely customized - ONLY VISIBLE ON MOBILE */}
      <div id="bottom-nav-bar" className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] z-[99] flex items-center justify-around px-2 select-none pb-safe h-16">
        {/* Tab 1: Home */}
        <button
          onClick={() => handleTabClick('home')}
          className="flex flex-col items-center justify-center w-16 h-12 gap-1 relative cursor-pointer group"
          style={{ minWidth: '48px', minHeight: '48px' }}
        >
          <Home 
            size={20} 
            strokeWidth={isHomeActive ? 2.5 : 1.75} 
            className={`transition-all duration-300 transform group-hover:scale-105 ${
              isHomeActive ? 'text-blue-600' : 'text-zinc-400'
            }`} 
          />
          <span className={`text-[10px] font-black tracking-wider uppercase transition-colors duration-300 ${
            isHomeActive ? 'text-blue-600 font-extrabold' : 'text-zinc-400 font-bold'
          }`}>
            Home
          </span>
          {isHomeActive && (
            <motion.div 
              layoutId="bottom-nav-active-dot" 
              className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-600"
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          )}
        </button>

        {/* Tab 2: Categories */}
        <button
          onClick={() => handleTabClick('categories')}
          className="flex flex-col items-center justify-center w-16 h-12 gap-1 relative cursor-pointer group"
          style={{ minWidth: '48px', minHeight: '48px' }}
        >
          <LayoutGrid 
            size={20} 
            strokeWidth={isCategoriesActive ? 2.5 : 1.75} 
            className={`transition-all duration-300 transform group-hover:scale-105 ${
              isCategoriesActive ? 'text-blue-600' : 'text-zinc-400'
            }`} 
          />
          <span className={`text-[10px] font-black tracking-wider uppercase transition-colors duration-300 ${
            isCategoriesActive ? 'text-blue-600 font-extrabold' : 'text-zinc-400 font-bold'
          }`}>
            Categories
          </span>
          {isCategoriesActive && (
            <motion.div 
              layoutId="bottom-nav-active-dot" 
              className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-600"
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          )}
        </button>

        {/* Tab 3: My Orders */}
        <button
          onClick={() => handleTabClick('orders')}
          className="flex flex-col items-center justify-center w-16 h-12 gap-1 relative cursor-pointer group"
          style={{ minWidth: '48px', minHeight: '48px' }}
        >
          <Package 
            size={20} 
            strokeWidth={isOrdersActive ? 2.5 : 1.75} 
            className={`transition-all duration-300 transform group-hover:scale-105 ${
              isOrdersActive ? 'text-blue-600' : 'text-zinc-400'
            }`} 
          />
          <span className={`text-[10px] font-black tracking-wider uppercase transition-colors duration-300 ${
            isOrdersActive ? 'text-blue-600 font-extrabold' : 'text-zinc-400 font-bold'
          }`}>
            Orders
          </span>
          {orders.length > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
          )}
          {isOrdersActive && (
            <motion.div 
              layoutId="bottom-nav-active-dot" 
              className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-600"
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          )}
        </button>

        {/* Tab 4: Account */}
        <button
          onClick={() => handleTabClick('account')}
          className="flex flex-col items-center justify-center w-16 h-12 gap-1 relative cursor-pointer group"
          style={{ minWidth: '48px', minHeight: '48px' }}
        >
          <User 
            size={20} 
            strokeWidth={isAccountActive ? 2.5 : 1.75} 
            className={`transition-all duration-300 transform group-hover:scale-105 ${
              isAccountActive ? 'text-blue-600' : 'text-zinc-400'
            }`} 
          />
          <span className={`text-[10px] font-black tracking-wider uppercase transition-colors duration-300 ${
            isAccountActive ? 'text-blue-600 font-extrabold' : 'text-zinc-400 font-bold'
          }`}>
            Account
          </span>
          {isAccountActive && (
            <motion.div 
              layoutId="bottom-nav-active-dot" 
              className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-600"
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          )}
        </button>
      </div>

      {/* DRAWERS: Absolute slide-up bottom sheets with premium overlay experience */}
      <AnimatePresence>
        {activeDrawer !== null && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[90] md:hidden"
              onClick={closeDrawer}
            />

            {/* Slide-Up Bottom Sheet Drawer Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`fixed left-0 w-full bg-white z-[95] flex flex-col overflow-hidden pb-16 md:hidden ${
                activeDrawer === 'categories'
                  ? 'inset-0 h-full max-h-none rounded-none'
                  : 'bottom-0 rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.15)] max-h-[82vh] border-t border-zinc-100'
              }`}
            >
              {/* Swipe/Drag Indicator Bar */}
              <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto my-3 shrink-0 cursor-pointer" onClick={closeDrawer} />

              {/* SHEET 1: CATEGORIES DRAWER */}
              {activeDrawer === 'categories' && (
                <div className="flex flex-col h-full min-h-0 overflow-hidden flex-1 bg-white">
                  {/* HEADER */}
                  <div className="flex flex-col border-b border-zinc-100 bg-white shrink-0">
                    <div className="flex justify-between items-center px-4 py-3.5">
                      {/* Top Left Corner with Back (<) symbol */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={closeDrawer}
                          className="p-1 hover:bg-zinc-100 rounded-full text-zinc-800 hover:text-zinc-950 transition-colors cursor-pointer -ml-1 flex items-center justify-center"
                          aria-label="Back"
                          title="Back"
                        >
                          <ChevronLeft size={24} strokeWidth={2.5} />
                        </button>
                        <h3 className="text-base sm:text-lg font-black tracking-wider text-zinc-900 font-headline uppercase">
                          CATEGORIES
                        </h3>
                      </div>

                      {/* Top Right Corner Icons */}
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        {/* Search Icon */}
                        <button 
                          onClick={() => setIsDrawerSearchOpen(!isDrawerSearchOpen)} 
                          className="p-1.5 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
                          title="Search"
                          aria-label="Search"
                        >
                          <Search size={20} />
                        </button>

                        {/* Wishlist Icon */}
                        <button 
                          onClick={() => {
                            closeDrawer();
                            navigate('/products?wishlist=true');
                          }} 
                          className="p-1.5 text-zinc-700 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors relative cursor-pointer"
                          title="Wishlist"
                          aria-label="Wishlist"
                        >
                          <Heart size={20} />
                          {wishlistCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                              {wishlistCount}
                            </span>
                          )}
                        </button>

                        {/* Shopping Bag Icon */}
                        <button 
                          onClick={() => {
                            closeDrawer();
                            navigate('/checkout');
                          }} 
                          className="p-1.5 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors relative cursor-pointer"
                          title="Shopping Bag"
                          aria-label="Shopping Bag"
                        >
                          <ShoppingBag size={20} />
                          {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                              {cartCount}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Toggled Inline Search Input */}
                    {isDrawerSearchOpen && (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (drawerSearchQuery.trim()) {
                            closeDrawer();
                            navigate(`/products?search=${encodeURIComponent(drawerSearchQuery.trim())}`);
                          }
                        }}
                        className="px-4 pb-3 flex items-center gap-2"
                      >
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            value={drawerSearchQuery}
                            onChange={(e) => setDrawerSearchQuery(e.target.value)}
                            placeholder="Search shirts, belts, perfumes..." 
                            className="w-full bg-zinc-100 border border-zinc-200 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-zinc-900 font-body"
                            autoFocus
                          />
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        </div>
                        <button 
                          type="submit" 
                          className="bg-zinc-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg uppercase tracking-wider cursor-pointer font-headline"
                        >
                          Search
                        </button>
                      </form>
                    )}
                  </div>

                  {/* MAIN GRID CONTENT split layout: Left side menu, Right side list */}
                  <div className="flex flex-grow min-h-0 h-full overflow-hidden">
                    {/* Left Sidebar Selectors */}
                    <div className="w-1/3 bg-zinc-50 border-r border-zinc-200/80 overflow-y-auto py-2 shrink-0">
                      {(['men', 'boys', 'kids', 'accessories'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedMainCat(cat)}
                          className={`w-full py-3.5 px-3 text-left font-headline text-xs font-black uppercase tracking-wider transition-all border-l-4 cursor-pointer focus:outline-none ${
                            selectedMainCat === cat 
                              ? 'bg-white border-zinc-900 text-zinc-900 shadow-2xs font-extrabold' 
                              : 'border-transparent text-zinc-500 hover:text-zinc-900'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Right Side Subcategory Contents */}
                    <div className="w-2/3 p-3 sm:p-4 overflow-y-auto flex flex-col gap-4">
                      {/* Department Title & Quick View All */}
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 shrink-0">
                        <h4 className="text-xs font-black uppercase text-zinc-900 tracking-wider font-headline">
                          {selectedMainCat === 'men' ? "Men's Fashion" : selectedMainCat === 'boys' ? "Boys Collection" : selectedMainCat === 'kids' ? "Kids Apparel" : "Fashion Accessories"}
                        </h4>
                        <button
                          onClick={() => {
                            closeDrawer();
                            const route = selectedMainCat === 'accessories' ? '/products?category=Accessories' : `/category/${selectedMainCat.charAt(0).toUpperCase() + selectedMainCat.slice(1)}`;
                            navigate(route);
                          }}
                          className="text-[10px] font-bold text-zinc-900 hover:text-zinc-600 flex items-center gap-0.5 uppercase tracking-wider cursor-pointer"
                        >
                          <span>View All</span>
                          <ChevronRight size={12} />
                        </button>
                      </div>

                      {/* Subcategory Groups with 3 Round Product Icons per row */}
                      {detailedCategoriesData[selectedMainCat].map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-2">
                          <h5 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-headline">
                            {group.groupName}
                          </h5>
                          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                            {group.items.map((sub, itemIdx) => (
                              <div 
                                key={itemIdx}
                                onClick={() => {
                                  closeDrawer();
                                  navigate(sub.url);
                                }}
                                className="flex flex-col items-center cursor-pointer group text-center"
                              >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-zinc-200 group-hover:border-zinc-900 shadow-2xs bg-white transition-all duration-200 p-0.5 flex items-center justify-center shrink-0">
                                  <img 
                                    src={sub.img} 
                                    alt={sub.name} 
                                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300" 
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <span className="text-[9px] sm:text-[10px] font-bold text-zinc-800 font-headline uppercase tracking-tight leading-tight line-clamp-2 mt-1 group-hover:text-zinc-900 transition-colors">
                                  {sub.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SHEET 2: MY ORDERS DRAWER */}
              {activeDrawer === 'orders' && (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="flex justify-between items-center px-6 pb-4 border-b border-zinc-100">
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-zinc-900 font-headline uppercase">MY ORDERS</h3>
                      <p className="text-[11px] text-zinc-400 font-medium">Track shipping and browse previous receipts</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {orders.length > 0 && (
                        <button 
                          onClick={handleClearOrders}
                          className="p-2 text-zinc-400 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-colors"
                          title="Clear order history"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <button onClick={closeDrawer} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors">
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Orders List viewport container */}
                  <div className="p-6 overflow-y-auto space-y-4 h-[55vh]">
                    {displayedOrders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-4 my-auto">
                        <img 
                          src={shopkeeperImg} 
                          alt="No Orders Yet" 
                          className="w-52 h-auto object-contain mx-auto mb-4" 
                          referrerPolicy="no-referrer"
                        />
                        <h4 className="text-sm font-bold text-zinc-900 font-headline mb-1">You haven't placed any orders</h4>
                        <p className="text-xs text-zinc-500 mb-5">All your orders will appear here</p>
                        <button
                          onClick={() => {
                            closeDrawer();
                            navigate('/products');
                          }}
                          className="bg-[#8e24aa] hover:bg-[#7b1fa2] text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-md transition-all cursor-pointer uppercase tracking-wider font-headline"
                        >
                          View Products
                        </button>
                      </div>
                    ) : (
                      displayedOrders.map((order) => (
                        <div key={order.id} className="border border-zinc-150 rounded-2xl bg-zinc-50/20 overflow-hidden shadow-xs hover:border-zinc-300 transition-colors">
                          {/* Header banner of card */}
                          <div className="bg-zinc-50 border-b border-zinc-100 px-4 py-3 flex justify-between items-center">
                            <div>
                              <span className="text-[9px] uppercase tracking-widest font-extrabold text-zinc-400">Order Reference</span>
                              <h4 className="text-xs font-black text-zinc-900 font-headline leading-tight mt-0.5">{order.id}</h4>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] uppercase tracking-widest font-extrabold text-zinc-400">Placed Date</span>
                              <p className="text-xs font-semibold text-zinc-800 leading-tight mt-0.5">{order.date}</p>
                            </div>
                          </div>

                          {/* Status timeline indicator bar */}
                          <div className="px-4 py-3.5 bg-white border-b border-zinc-100/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-500' : 'bg-blue-600 animate-pulse'}`}></div>
                              <span className="text-[11px] font-black uppercase tracking-wider font-headline text-zinc-800">{order.status}</span>
                            </div>
                            <div className="text-[10px] text-zinc-500 font-semibold font-body">
                              Estimated delivery: <span className="font-extrabold text-zinc-900">3-4 business days</span>
                            </div>
                          </div>

                          {/* Sub items inside order */}
                          <div className="p-4 space-y-3.5 bg-white">
                            {order.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex gap-3">
                                <div className="w-12 h-14 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-100 flex-shrink-0">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
                                </div>
                                <div className="flex-grow flex flex-col justify-center min-w-0">
                                  <h5 className="text-[10px] font-black tracking-tight text-zinc-900 uppercase font-headline leading-snug line-clamp-1">{item.name}</h5>
                                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Size: {item.size} • Qty: {item.quantity}</p>
                                  <span className="text-xs font-bold text-zinc-800 mt-1">{item.price}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Address & Total Invoice footer summary */}
                          <div className="p-4 bg-zinc-50/60 border-t border-zinc-100 flex flex-col gap-1.5 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-zinc-500 font-semibold">Total Invoice value:</span>
                              <span className="font-black text-zinc-900 font-headline">{formatCurrency(order.total)}</span>
                            </div>
                            <div className="flex items-start gap-1 text-[10px] text-zinc-400 font-medium leading-relaxed mt-1">
                              <MapPin size={11} className="shrink-0 text-zinc-400 mt-0.5" />
                              <span className="line-clamp-1">Deliver to: {order.address}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SHEET 3: MY ACCOUNT DRAWER */}
              {activeDrawer === 'account' && (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="flex justify-between items-center px-6 pb-4 border-b border-zinc-100">
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-zinc-900 font-headline uppercase">User Workspace</h3>
                      <p className="text-[11px] text-zinc-400 font-medium">GM Premium Privilege account profile</p>
                    </div>
                    <button onClick={closeDrawer} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors">
                      <X size={18} />
                    </button>
                  </div>

                  {/* Profile contents viewport */}
                  <div className="p-6 overflow-y-auto space-y-5 h-[55vh]">
                    {/* Premium Profile Badge */}
                    <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white rounded-2xl p-5 shadow-lg border border-zinc-800 relative overflow-hidden">
                      {/* Ambient background accent */}
                      <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                      
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white border-2 border-white/20 flex items-center justify-center font-headline text-lg font-black uppercase">
                          KS
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-black uppercase tracking-wider font-headline">KARUR SPARK</h4>
                            <span className="bg-blue-500/20 text-blue-300 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border border-blue-400/20 flex items-center gap-0.5">
                              <Award size={8} /> Elite
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 font-body font-medium">karurspark06@gmail.com</p>
                        </div>
                      </div>
                      
                      {/* Loyalty info footer inside profile box */}
                      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex justify-between items-center text-[10px] font-headline">
                        <span className="text-zinc-400 uppercase tracking-widest font-extrabold">GM VIP Rewards Level</span>
                        <span className="text-blue-400 font-black tracking-wide">1,820 Credits Available</span>
                      </div>
                    </div>

                    {/* Quick status wallets and benefits */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-zinc-150 rounded-xl p-3 bg-zinc-50/50 flex flex-col gap-1 shadow-2xs">
                        <Wallet size={16} className="text-blue-600" />
                        <span className="text-[9px] uppercase tracking-wider font-black text-zinc-400 font-headline mt-1">GMF Pay Balance</span>
                        <span className="text-sm font-black text-zinc-900 font-headline">₹ 1,500.00</span>
                      </div>
                      <div className="border border-zinc-150 rounded-xl p-3 bg-zinc-50/50 flex flex-col gap-1 shadow-2xs">
                        <Award size={16} className="text-emerald-500" />
                        <span className="text-[9px] uppercase tracking-wider font-black text-zinc-400 font-headline mt-1">Exclusive Coupons</span>
                        <span className="text-sm font-black text-zinc-900 font-headline">3 Active</span>
                      </div>
                    </div>

                    {/* List items settings options */}
                    <div className="space-y-1.5 border-t border-zinc-100 pt-4">
                      {/* Onboarding / Language & Login Flow Tile */}
                      <div 
                        onClick={() => {
                          closeDrawer();
                          openOnboarding(1);
                        }}
                        className="flex items-center justify-between p-3.5 bg-red-50/60 hover:bg-red-100/60 border border-red-200/80 rounded-xl cursor-pointer transition-colors shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <Globe size={18} className="text-[#dc2626]" />
                          <div>
                            <h5 className="text-[11px] font-black tracking-tight text-[#dc2626] uppercase font-headline">App Language & Login Flow</h5>
                            <p className="text-[9px] text-red-600/80 font-semibold font-body leading-none mt-0.5">
                              Current Language: <span className="uppercase font-bold">{selectedLanguage}</span> • {user.isLoggedIn ? user.phone : 'Not Logged In'}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-[#dc2626]" />
                      </div>

                      {/* Item 1 */}
                      <div className="flex items-center justify-between p-3.5 bg-white hover:bg-zinc-50 border border-zinc-150/70 rounded-xl cursor-pointer transition-colors shadow-2xs">
                        <div className="flex items-center gap-3">
                          <MapPin size={16} className="text-zinc-400" />
                          <div>
                            <h5 className="text-[11px] font-black tracking-tight text-zinc-800 uppercase font-headline">Saved Shipments Addresses</h5>
                            <p className="text-[9px] text-zinc-400 font-semibold font-body leading-none mt-0.5">1 address set as default</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-zinc-400" />
                      </div>

                      {/* Item 2 */}
                      <div className="flex items-center justify-between p-3.5 bg-white hover:bg-zinc-50 border border-zinc-150/70 rounded-xl cursor-pointer transition-colors shadow-2xs">
                        <div className="flex items-center gap-3">
                          <PhoneCall size={16} className="text-zinc-400" />
                          <div>
                            <h5 className="text-[11px] font-black tracking-tight text-zinc-800 uppercase font-headline">WhatsApp Customer Support</h5>
                            <p className="text-[9px] text-zinc-400 font-semibold font-body leading-none mt-0.5">Instant human help 24/7 online</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-zinc-400" />
                      </div>
                    </div>

                    {/* Developer notes / Credit stamp */}
                    <div className="text-center space-y-1 py-2">
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest font-headline">GM FASHIONS MOBILE V2.0.4</p>
                      <p className="text-[8px] text-zinc-400 font-medium font-body">Crafted for premium user responsiveness</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
