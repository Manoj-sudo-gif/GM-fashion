import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Trash2, MapPin, Package, ArrowRight, X, Check, Filter } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import shopkeeperImg from '../assets/images/mens_fashion_empty_orders_illustration_1784884242598.jpg';

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

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Placed' | 'Shipped' | 'Delivered'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Load actual orders placed by user from localStorage
  const loadOrders = () => {
    try {
      const saved = localStorage.getItem('orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
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
    
    // Listen for storage changes if order completed in another tab/window
    const handleStorageChange = () => {
      loadOrders();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter orders based on searchQuery and activeFilter status
  const filteredOrders = orders.filter(order => {
    const matchesQuery = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesQuery) return false;

    if (activeFilter === 'All') return true;
    if (activeFilter === 'Placed') return order.status === 'Order Placed';
    if (activeFilter === 'Shipped') return order.status === 'Shipped' || order.status === 'In Transit';
    if (activeFilter === 'Delivered') return order.status === 'Delivered';
    return true;
  });

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your order history?")) {
      localStorage.removeItem('orders');
      setOrders([]);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-20 pt-2 sm:pt-4">
      <div className="max-w-2xl mx-auto w-full px-4 flex flex-col min-h-[85vh]">
        
        {/* HEADER BAR: "MY ORDERS" */}
        <div className="py-3 px-1 border-b border-zinc-200/80 mb-3 flex items-center justify-between">
          <h1 className="text-sm sm:text-base font-extrabold tracking-wider text-zinc-900 font-headline uppercase">
            MY ORDERS
          </h1>
          {orders.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors"
              title="Clear Order History"
            >
              <Trash2 size={14} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* TOP CONTROL BAR: SEARCH AND FILTERS */}
        <div className="flex items-center gap-3 mb-6">
          {/* Search Input Box */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders"
              className="w-full bg-white border border-zinc-300 focus:border-purple-600 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-all shadow-2xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

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
              <div className="absolute right-0 top-12 w-44 bg-white border border-zinc-200 rounded-2xl shadow-xl z-30 p-2 space-y-1">
                {(['All', 'Placed', 'Shipped', 'Delivered'] as const).map((filter) => (
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

        {/* BODY AREA: EMPTY STATE OR ORDERS LIST */}
        {orders.length === 0 ? (
          /* ================= EXACT EMPTY ORDERS STATE ================= */
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 sm:py-12 my-auto">
            {/* Shopkeeper Illustration Image */}
            <div className="w-64 sm:w-72 md:w-80 h-auto mx-auto mb-6 relative">
              <img
                src={shopkeeperImg}
                alt="Friendly Shopkeeper - No Orders Yet"
                className="w-full h-auto object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Heading Title */}
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-zinc-900 tracking-tight font-headline mb-1.5">
              You haven't placed any orders
            </h2>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm text-zinc-500 font-body font-medium mb-7 max-w-xs mx-auto">
              All your orders will appear here
            </p>

            {/* Action CTA Button */}
            <button
              onClick={() => navigate('/products')}
              className="bg-[#8e24aa] hover:bg-[#7b1fa2] text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer uppercase tracking-wider font-headline"
            >
              View Products
            </button>
          </div>
        ) : (
          /* ================= ORDERS LIST (WHEN ORDERS EXIST) ================= */
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                <p className="text-sm font-semibold text-zinc-600">No orders match your search criteria</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
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
                      <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium mt-1">
                        <MapPin size={11} className="shrink-0 text-zinc-400" />
                        <span className="line-clamp-1">Deliver to: {order.address}</span>
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
