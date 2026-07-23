import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, Banknote, Wifi, ArrowRight, ShieldCheck, RotateCcw, Trash2, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartItem {
  id: number;
  name: string;
  price: string;
  priceVal: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOrdered, setIsOrdered] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      // Fallback fallback mock items in Indian Rupees (INR) to keep the page stunning
      const defaultMockItems: CartItem[] = [
        {
          id: 1,
          name: 'AERO-KNIT RUNNER',
          price: '₹ 4,500',
          priceVal: 4500,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
          color: '#000000',
          size: '9',
          quantity: 1
        },
        {
          id: 2,
          name: 'MONOLITH MID-SOLE',
          price: '₹ 8,900',
          priceVal: 8900,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFwtIQhf6jgS9FDF3BYeF0l7ved20lvWXBX1x6Fg2WI4RqWe2rro034EKnVSoL2UUbdmu1pqo2_Zuc8cM6RBXla4O4J7WXqUqMrIlS0iXSY7cigF-y_VX1kNKlCNc5Bw1G2TELYdxhLRQ7Ljiqv1kBleCtk8K_QxFqU4LqR0DJKClHmE8Mlh5XqRreW0Qrwy9bptfucxcvZLu2K3vf39rSfUfs8asJHfySjKwAgsdP2smHNN37CyswtmrvN5vzfdPFJ8ZIog2upYLf',
          color: '#e5e7eb',
          size: '8',
          quantity: 1
        }
      ];
      setCartItems(defaultMockItems);
    }
  }, []);

  // Remove item from cart
  const handleRemoveItem = (id: number, size: string) => {
    const updated = cartItems.filter(item => !(item.id === id && item.size === size));
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  // Calculations in INR
  const subtotal = cartItems.reduce((acc, item) => acc + (item.priceVal * item.quantity), 0);
  const estimatedTax = Math.round(subtotal * 0.18); // 18% GST for India
  const shipping = subtotal > 5000 ? 0 : 150; // Free shipping over ₹ 5,000
  const total = subtotal + estimatedTax + shipping;

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleCompletePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
    
    // Create actual order details to store in localStorage
    const newOrderObj = {
      id: "GMF-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: cartItems.length > 0 ? cartItems : [
        {
          id: 1,
          name: 'AERO-KNIT RUNNER',
          price: '₹ 4,500',
          priceVal: 4500,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
          color: '#000000',
          size: '9',
          quantity: 1
        }
      ],
      total: total || 13550,
      status: 'Shipped', // Simulation states: Placed, Shipped, In Transit, Delivered
      address: `${streetAddress || '12, MG Road'}, ${city || 'Bengaluru'}, ${state || 'Karnataka'} - ${zipCode || '560001'}`
    };
    
    try {
      const existingOrders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')!) : [];
      localStorage.setItem('orders', JSON.stringify([newOrderObj, ...existingOrders]));
    } catch (err) {
      console.error('Failed to save order to history:', err);
    }
    
    // Clear cart
    localStorage.removeItem('cart');
  };

  if (isOrdered) {
    return (
      <main className="pt-12 pb-40 px-4 max-w-lg mx-auto text-center flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-4xl font-extrabold text-zinc-900 font-headline tracking-tighter mb-4">
          ORDER PLACED!
        </h1>
        <p className="text-zinc-500 font-body text-base max-w-sm mb-10 leading-relaxed">
          Thank you for shopping with GM Fashion. Your order has been logged into our fullfillment queue. We've sent a detailed confirmation to your email.
        </p>

        <div className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-left mb-10 space-y-4">
          <h3 className="font-headline font-bold text-zinc-900 text-sm uppercase tracking-wider border-b border-zinc-200/50 pb-2">
            Delivery Summary
          </h3>
          <div className="grid grid-cols-2 text-xs font-body text-zinc-600 gap-y-2">
            <span className="font-semibold text-zinc-500">Recipient:</span>
            <span className="text-zinc-900 font-medium text-right">{fullName || 'Julianne Moore'}</span>
            <span className="font-semibold text-zinc-500">Contact:</span>
            <span className="text-zinc-900 font-medium text-right">{phoneNumber || '+91 98765 43210'}</span>
            <span className="font-semibold text-zinc-500">Address:</span>
            <span className="text-zinc-900 font-medium text-right truncate" title={streetAddress || '245 Boutique Avenue, Suite 400'}>
              {streetAddress || '245 Boutique Avenue'}
            </span>
            <span className="font-semibold text-zinc-500">Amount Paid:</span>
            <span className="text-zinc-900 font-extrabold text-right text-emerald-600">{formatCurrency(total)}</span>
          </div>
        </div>

        <Link 
          to="/" 
          className="bg-zinc-900 text-white px-8 py-4.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all shadow-sm"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-6 max-w-7xl mx-auto px-4 md:px-8 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start w-full">
      {/* Steps Column */}
      <form onSubmit={handleCompletePurchase} className="lg:col-span-8 space-y-8 w-full">
        
        {/* Shipping Card */}
        <section className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-zinc-100">
          <div className="flex items-center gap-4 mb-8 border-b border-zinc-50 pb-6">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 font-extrabold text-sm font-headline">1</div>
            <h2 className="font-headline text-2xl font-extrabold tracking-tight text-zinc-900">Shipping Address</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold text-zinc-400 uppercase tracking-wider font-label">Full Name</label>
              <input 
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-zinc-50/50 border border-zinc-200/80 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900 transition-all font-body text-sm" 
                placeholder="Julianne Moore" 
                type="text"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold text-zinc-400 uppercase tracking-wider font-label">Phone Number</label>
              <input 
                required
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className="w-full bg-zinc-50/50 border border-zinc-200/80 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900 transition-all font-body text-sm" 
                placeholder="+91 98765 43210" 
                type="tel"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[0.75rem] font-bold text-zinc-400 uppercase tracking-wider font-label">Street Address</label>
              <input 
                required
                value={streetAddress}
                onChange={e => setStreetAddress(e.target.value)}
                className="w-full bg-zinc-50/50 border border-zinc-200/80 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900 transition-all font-body text-sm" 
                placeholder="245 Boutique Avenue, Suite 400" 
                type="text"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold text-zinc-400 uppercase tracking-wider font-label">City</label>
              <input 
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-zinc-50/50 border border-zinc-200/80 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900 transition-all font-body text-sm" 
                placeholder="Chennai" 
                type="text"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-bold text-zinc-400 uppercase tracking-wider font-label">State</label>
                <input 
                  required
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full bg-zinc-50/50 border border-zinc-200/80 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900 transition-all font-body text-sm text-center" 
                  placeholder="Tamil Nadu" 
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-bold text-zinc-400 uppercase tracking-wider font-label">Zip Code</label>
                <input 
                  required
                  value={zipCode}
                  onChange={e => setZipCode(e.target.value)}
                  className="w-full bg-zinc-50/50 border border-zinc-200/80 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900 transition-all font-body text-sm text-center" 
                  placeholder="600001" 
                  type="text"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Payment Card */}
        <section className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-zinc-100">
          <div className="flex items-center gap-4 mb-8 border-b border-zinc-50 pb-6">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 font-extrabold text-sm font-headline">2</div>
            <h2 className="font-headline text-2xl font-extrabold tracking-tight text-zinc-900">Payment Method</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Visa/Card */}
            <button 
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex flex-col items-start p-6 rounded-xl border-2 transition-all text-left ${paymentMethod === 'card' ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-zinc-50 border-transparent hover:border-zinc-200 text-zinc-800'}`}
            >
              <CreditCard size={24} className={`mb-4 ${paymentMethod === 'card' ? 'text-white' : 'text-zinc-500'}`} />
              <span className="font-bold text-sm block font-body">Credit Card</span>
              <span className={`text-xs mt-1 font-body ${paymentMethod === 'card' ? 'text-white/70' : 'text-zinc-500'}`}>Visa, Mastercard</span>
            </button>
            
            {/* UPI */}
            <button 
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`flex flex-col items-start p-6 rounded-xl border-2 transition-all text-left group ${paymentMethod === 'upi' ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-zinc-50 border-transparent hover:border-zinc-200 text-zinc-800'}`}
            >
              <Wallet size={24} className={`mb-4 transition-colors ${paymentMethod === 'upi' ? 'text-white' : 'text-zinc-500'}`} />
              <span className="font-bold text-sm block font-body">UPI Transfer</span>
              <span className={`text-xs mt-1 font-body ${paymentMethod === 'upi' ? 'text-white/70' : 'text-zinc-500'}`}>GPay, PhonePe</span>
            </button>
            
            {/* COD */}
            <button 
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={`flex flex-col items-start p-6 rounded-xl border-2 transition-all text-left group ${paymentMethod === 'cod' ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-zinc-50 border-transparent hover:border-zinc-200 text-zinc-800'}`}
            >
              <Banknote size={24} className={`mb-4 transition-colors ${paymentMethod === 'cod' ? 'text-white' : 'text-zinc-500'}`} />
              <span className="font-bold text-sm block font-body">Cash on Delivery</span>
              <span className={`text-xs mt-1 font-body ${paymentMethod === 'cod' ? 'text-white/70' : 'text-zinc-500'}`}>Pay at doorstep</span>
            </button>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-bold text-zinc-400 uppercase tracking-wider font-label">Card Number</label>
                <div className="relative">
                  <input 
                    required={paymentMethod === 'card'}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900 transition-all font-body text-sm tracking-widest" 
                    placeholder="0000 0000 0000 0000" 
                    type="text"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    <Wifi size={16} className="text-zinc-400 rotate-90" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[0.75rem] font-bold text-zinc-400 uppercase tracking-wider font-label">Expiry Date</label>
                  <input 
                    required={paymentMethod === 'card'}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900 transition-all font-body text-sm text-center" 
                    placeholder="MM / YY" 
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[0.75rem] font-bold text-zinc-400 uppercase tracking-wider font-label">CVV</label>
                  <input 
                    required={paymentMethod === 'card'}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900 transition-all font-body text-sm text-center" 
                    placeholder="***" 
                    type="password"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </form>

      {/* Sidebar / Order Summary */}
      <aside className="lg:col-span-4 sticky top-28 w-full">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-100">
          <h3 className="font-headline text-xl font-extrabold tracking-tight text-zinc-900 mb-6">Order Summary</h3>
          
          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
            {cartItems.map(item => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-zinc-50 pb-4 last:border-0 last:pb-0">
                <div className="w-14 h-18 bg-zinc-100 flex-shrink-0 rounded-lg overflow-hidden">
                  <img 
                    className="w-full h-full object-cover" 
                    alt={item.name} 
                    src={item.image}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-zinc-900 font-headline uppercase truncate">{item.name}</h4>
                    <span className="text-xs font-extrabold text-zinc-900 whitespace-nowrap">{item.price}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1 uppercase font-semibold font-label">
                    Size: {item.size} &bull; Qty: {item.quantity}
                  </p>
                  <div className="flex justify-end mt-2">
                    <button 
                      type="button"
                      onClick={() => handleRemoveItem(item.id, item.size)}
                      className="text-zinc-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {cartItems.length === 0 && (
              <div className="py-6 text-center text-zinc-400 text-xs">
                Your cart is empty.
              </div>
            )}
          </div>

          <div className="space-y-3 pt-6 border-t border-zinc-100">
            <div className="flex justify-between text-xs font-body">
              <span className="text-zinc-500 font-medium">Subtotal</span>
              <span className="text-zinc-900 font-bold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs font-body">
              <span className="text-zinc-500 font-medium">Estimated GST (18%)</span>
              <span className="text-zinc-900 font-bold">{formatCurrency(estimatedTax)}</span>
            </div>
            <div className="flex justify-between text-xs font-body">
              <span className="text-zinc-500 font-medium">Shipping Fee</span>
              {shipping === 0 ? (
                <span className="text-blue-600 font-bold">Complimentary</span>
              ) : (
                <span className="text-zinc-900 font-bold">{formatCurrency(shipping)}</span>
              )}
            </div>
            
            <div className="pt-4 flex justify-between items-end border-t border-zinc-100">
              <span className="font-headline font-extrabold text-zinc-900 text-sm uppercase tracking-wide">Total Amount</span>
              <span className="font-headline font-black text-zinc-900 text-xl tracking-tight text-blue-600">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          <button 
            onClick={(e) => {
              if (cartItems.length === 0) return;
              handleCompletePurchase(e);
            }}
            disabled={cartItems.length === 0}
            className={`w-full mt-8 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-sm ${
              cartItems.length === 0 ? 'bg-zinc-300 cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-800 hover:shadow-md'
            }`}
          >
            <span>Complete Purchase</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>

          <p className="text-[9px] text-center text-zinc-400 mt-4 uppercase tracking-widest leading-relaxed font-label">
            Secure 256-bit SSL encrypted payment.<br/>
            Taxes calculated at dynamic Indian state rates.
          </p>
        </div>

        {/* Trust Badge Bento */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-white p-4 rounded-xl flex items-center gap-3 border border-zinc-100 shadow-sm">
            <ShieldCheck size={18} className="text-zinc-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-label">100% Secure Checkout</span>
          </div>
          <div className="flex-1 bg-white p-4 rounded-xl flex items-center gap-3 border border-zinc-100 shadow-sm">
            <RotateCcw size={18} className="text-zinc-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-label">30-Day Moneyback Guarantee</span>
          </div>
        </div>
      </aside>
    </main>
  );
}
