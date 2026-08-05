import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Package, ArrowRight, X, Check, Filter, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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

interface OrderAddress {
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface Order {
  id: string;
  date: string;
  createdAt?: number;
  items: OrderItem[];
  total: number;
  status: 'Order Placed' | 'Shipped' | 'In Transit' | 'Delivered' | 'Cancelled';
  address?: string | OrderAddress;
  paymentMethod?: string;
}

type FilterOption = 'All' | 'Last 7 Days' | 'Last 30 Days' | 'Last 60 Days' | 'Cancelled';

export default function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Load actual orders placed by user from localStorage matching user's mobile number
  const loadOrders = () => {
    try {
      // If user is not logged in, clear orders
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
    window.scrollTo({ top: 0, behavior: 'instant' });
    loadOrders();
    
    // Listen for storage changes if order completed in another tab/window
    const handleStorageChange = () => {
      loadOrders();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  // Handle Search Submission (on Enter or Button Click or Live Typing)
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveSearchQuery(searchInput);
  };

  // Helper to calculate age of order in days
  const getDaysDiff = (order: Order) => {
    if (order.createdAt) {
      return (Date.now() - order.createdAt) / (1000 * 60 * 60 * 24);
    }
    const parsed = new Date(order.date);
    if (!isNaN(parsed.getTime())) {
      return (Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24);
    }
    return 0;
  };

  // Filter orders based on activeSearchQuery/searchInput and activeFilter status
  const queryToUse = (activeSearchQuery || searchInput).trim().toLowerCase();
  
  const filteredOrders = orders.filter(order => {
    const matchesQuery = !queryToUse || 
      order.id.toLowerCase().includes(queryToUse) ||
      order.items.some(item => item.name.toLowerCase().includes(queryToUse) || item.size.toLowerCase().includes(queryToUse));
    
    if (!matchesQuery) return false;

    if (activeFilter === 'All') return true;
    if (activeFilter === 'Last 7 Days') return getDaysDiff(order) <= 7;
    if (activeFilter === 'Last 30 Days') return getDaysDiff(order) <= 30;
    if (activeFilter === 'Last 60 Days') return getDaysDiff(order) <= 60;
    if (activeFilter === 'Cancelled') return order.status === 'Cancelled';
    return true;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatAddress = (addr: any) => {
    if (!addr) return '';
    if (typeof addr === 'string') return addr;
    const parts = [addr.street, addr.city, addr.state, addr.zip].filter(Boolean);
    const location = parts.join(', ');
    const recipient = [addr.name, addr.phone].filter(Boolean).join(' • ');
    return recipient ? `${location} (${recipient})` : location;
  };

  return (
    <div className="min-h-screen bg-zinc-50/80 text-zinc-900 pb-20">
      
      {/* TOP STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-white/95 border-b border-zinc-200/90 px-4 py-3.5 flex items-center justify-between shadow-2xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              if (location.state?.from === 'account') {
                navigate('/account');
              } else {
                navigate('/');
              }
            }} 
            className="p-1.5 -ml-1 rounded-full hover:bg-zinc-100 text-zinc-800 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Back"
            title="Back"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <h1 className="text-base sm:text-lg font-black text-zinc-900 font-headline uppercase tracking-wide leading-none">
            My Orders
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-3 sm:px-4 flex flex-col min-h-[85vh] pt-3 sm:pt-5">

        {/* TOP CONTROL BAR: SEARCH AND FILTERS */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-3">
            {/* Search Input Box Form */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 flex items-center">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setActiveSearchQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
                placeholder="Type & press Enter to search orders..."
                className="w-full bg-white border border-zinc-300 focus:border-[#8e24aa] rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-all shadow-2xs"
              />
              {searchInput && (
                <button 
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setActiveSearchQuery('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </form>

            {/* Filters Button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/60 text-[#8e24aa] font-bold text-xs sm:text-sm cursor-pointer transition-all shadow-2xs"
              >
                <SlidersHorizontal size={16} className="text-[#8e24aa]" />
                <span>Filters</span>
                {activeFilter !== 'All' && (
                  <span className="w-2 h-2 rounded-full bg-[#8e24aa]" />
                )}
              </button>

              {/* Filter Dropdown Popover */}
              {isFilterOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-zinc-200 rounded-2xl shadow-xl z-30 p-2 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-400 font-headline">
                    Time Range
                  </div>
                  {(['All', 'Last 7 Days', 'Last 30 Days', 'Last 60 Days'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setActiveFilter(filter);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold font-headline transition-colors cursor-pointer ${
                        activeFilter === filter 
                          ? 'bg-purple-50 text-[#8e24aa]' 
                          : 'text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <span>{filter}</span>
                      {activeFilter === filter && <Check size={14} className="text-[#8e24aa]" />}
                    </button>
                  ))}

                  <div className="px-2 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-zinc-400 font-headline border-t border-zinc-100">
                    Order Status
                  </div>
                  {(['Cancelled'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setActiveFilter(filter);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold font-headline transition-colors cursor-pointer ${
                        activeFilter === filter 
                          ? 'bg-purple-50 text-[#8e24aa]' 
                          : 'text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <span>{filter} Orders</span>
                      {activeFilter === filter && <Check size={14} className="text-[#8e24aa]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Result / Filter Indicator Tag */}
          {(queryToUse || activeFilter !== 'All') && (
            <div className="flex items-center justify-between bg-purple-50/80 border border-purple-100 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-800">
              <span className="truncate">
                Showing results {queryToUse && <strong>for "{queryToUse}"</strong>} {activeFilter !== 'All' && <span className="text-[#8e24aa] font-bold">({activeFilter})</span>}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setActiveSearchQuery('');
                  setActiveFilter('All');
                }}
                className="text-xs font-bold text-[#8e24aa] underline shrink-0 cursor-pointer ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* BODY AREA: EMPTY STATE OR ORDERS LIST */}
        {orders.length === 0 ? (
          /* ================= EXACT EMPTY ORDERS STATE ================= */
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 sm:py-12 my-auto">
            {/* Shopkeeper Illustration Image Sticker */}
            <div className="w-64 sm:w-72 md:w-80 h-auto mx-auto mb-6 relative">
              <img
                src={shopkeeperImg}
                alt="Your order is empty"
                className="w-full h-auto object-contain mx-auto drop-shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Heading Title */}
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight font-headline mb-1.5 uppercase">
              Your order is empty
            </h2>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm text-zinc-500 font-body font-medium mb-7 max-w-xs mx-auto leading-relaxed">
              You haven't placed any orders yet. All your future orders will show up here!
            </p>

            {/* Action CTA Button */}
            <button
              onClick={() => navigate('/products')}
              className="bg-[#8e24aa] hover:bg-[#7b1fa2] text-white font-black text-xs sm:text-sm px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer uppercase tracking-wider font-headline"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* ================= ORDERS LIST (WHEN ORDERS EXIST) ================= */
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                <p className="text-sm font-semibold text-zinc-600">No orders match your search criteria</p>
                <button 
                  onClick={() => { setSearchInput(''); setActiveSearchQuery(''); setActiveFilter('All'); }}
                  className="mt-2 text-xs font-bold text-purple-700 hover:underline cursor-pointer"
                >
                  Clear search & filters
                </button>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="border border-zinc-200 rounded-2xl bg-white overflow-hidden shadow-xs hover:border-zinc-300 transition-colors">
                  {/* Card Header */}
                  <div className="bg-zinc-50 border-b border-zinc-100 px-4 py-3 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-extrabold text-zinc-400">Order ID</span>
                      <h4 className="text-xs font-black text-zinc-900 font-headline leading-tight mt-0.5">{order.id}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-widest font-extrabold text-zinc-400">Placed Date</span>
                      <p className="text-xs font-semibold text-zinc-800 leading-tight mt-0.5">{order.date}</p>
                    </div>
                  </div>

                  {/* Order Status Banner */}
                  <div className="px-4 py-3 bg-white border-b border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-500' : 'bg-purple-600 animate-pulse'}`} />
                      <span className="text-xs font-black uppercase tracking-wider font-headline text-zinc-800">{order.status}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-medium">Expected in 3-4 days</span>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 space-y-3 bg-white">
                    {order.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex gap-3 items-center">
                        <div className="w-14 h-16 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200/80 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h5 className="text-xs font-black tracking-tight text-zinc-900 uppercase font-headline line-clamp-1">{item.name}</h5>
                          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">Size: {item.size} • Qty: {item.quantity}</p>
                          <span className="text-xs font-extrabold text-zinc-900 mt-1 block">{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="p-4 bg-zinc-50/70 border-t border-zinc-100 flex flex-col gap-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 font-semibold">Total Invoice Amount:</span>
                      <span className="font-black text-zinc-900 font-headline text-sm">{formatCurrency(order.total)}</span>
                    </div>
                    {order.address && (
                      <div className="flex items-start gap-1 text-[11px] text-zinc-500 font-medium mt-1">
                        <MapPin size={12} className="shrink-0 text-zinc-500 mt-0.5" />
                        <span className="line-clamp-2">Deliver to: <strong className="text-zinc-800">{formatAddress(order.address)}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
