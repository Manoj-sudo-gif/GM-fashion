import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Heart, ShoppingBag, Tags, Sparkles, Filter, Check, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { allProducts, Product } from '../data/products';

// Define structures for category groups
interface SubCategoryItem {
  name: string;
  img: string;
}

interface CategoryGroup {
  title: string;
  items: SubCategoryItem[];
}

export default function CategoryDirectory() {
  const { gender } = useParams<{ gender: string }>();
  const navigate = useNavigate();

  // Map initial department from URL parameter
  const initialDept = useMemo(() => {
    if (!gender) return 'Men';
    const lower = gender.toLowerCase();
    if (lower === 'boys' || lower === 'boy') return 'Boys';
    if (lower === 'kids' || lower === 'kid') return 'Kids';
    if (lower === 'accessories' || lower === 'accessory') return 'Accessories';
    return 'Men';
  }, [gender]);

  const [activeDept, setActiveDept] = useState<string>(initialDept);
  const [selectedSub, setSelectedSub] = useState<{ parentGroup: string; subCategory: string } | null>(null);

  // Sync state if URL changes (e.g. user clicks another department in global header)
  useEffect(() => {
    setActiveDept(initialDept);
    setSelectedSub(null);
  }, [initialDept]);

  // Wishlist and Cart synchronization
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('wishlist') || '[]';
      return JSON.parse(saved).map((p: any) => p.id);
    } catch {
      return [];
    }
  });

  const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updatedList = [...wishlist];
    let savedItems = JSON.parse(localStorage.getItem('wishlist') || '[]');

    if (wishlist.includes(product.id)) {
      updatedList = updatedList.filter(id => id !== product.id);
      savedItems = savedItems.filter((item: any) => item.id !== product.id);
    } else {
      updatedList.push(product.id);
      savedItems.push(product);
    }

    setWishlist(updatedList);
    localStorage.setItem('wishlist', JSON.stringify(savedItems));
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const cart = JSON.parse(localStorage.getItem('cart_items') || '[]');
      const existing = cart.find((item: any) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          priceVal: product.priceVal,
          image: product.image,
          color: product.colors[0] || '#000000',
          size: product.sizes[0] || 'M',
          quantity: 1
        });
      }
      localStorage.setItem('cart_items', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
      
      alert(`${product.name} added to your Shopping Bag!`);
    } catch (err) {
      console.error(err);
    }
  };

  // Structured data for Men, Boys, Kids and Accessories with rich, comprehensive categories
  const DEPARTMENT_DATA: Record<string, CategoryGroup[]> = useMemo(() => {
    return {
      Men: [
        {
          title: 'Top Wear',
          items: [
            { name: 'Shirt', img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=300' },
            { name: 'T-Shirt', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=300' },
            { name: 'Polo Shirt', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=300' },
            { name: 'Casual Shirt', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=300' },
            { name: 'Denim Shirt', img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=300' },
            { name: 'Hoodie & Sweatshirt', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=300' },
            { name: 'Jacket', img: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=300' },
            { name: 'Blazer', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=300' }
          ]
        },
        {
          title: 'Bottom Wear',
          items: [
            { name: 'Pant', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=300' },
            { name: 'Jeans', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=300' },
            { name: 'Track Pant', img: 'https://images.unsplash.com/photo-1517438476312-10d79c07750d?auto=format&fit=crop&q=80&w=300' },
            { name: 'Chinos', img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=300' },
            { name: 'Shorts', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=300' },
            { name: 'Cargo Pants', img: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=300' }
          ]
        },
        {
          title: 'Inner Wear & Sleep',
          items: [
            { name: 'Vest', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=300' },
            { name: 'Gym Wear', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300' },
            { name: 'Brief', img: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80&w=300' },
            { name: 'Trunk', img: 'https://images.unsplash.com/photo-1608228079938-c6250f2aa74f?auto=format&fit=crop&q=80&w=300' },
            { name: 'Boxer', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=300' },
            { name: 'Pyjamas', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=300' }
          ]
        },
        {
          title: 'Traditional Wear',
          items: [
            { name: 'Traditional Shirt', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=300' },
            { name: 'Dhoti', img: 'https://m.media-amazon.com/images/I/71sQIeakXfL._AC_UY1100_.jpg' },
            { name: 'Set Dhoti', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=300' },
            { name: 'Kurta', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=300' },
            { name: 'Ethnic Jacket', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=300' }
          ]
        },
        {
          title: 'Footwear & Accessories',
          items: [
            { name: 'Sneakers', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300' },
            { name: 'Formal Shoes', img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=300' },
            { name: 'Sandals & Slides', img: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&q=80&w=300' },
            { name: 'Belts & Wallets', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=300' },
            { name: 'Watches', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=300' },
            { name: 'Sunglasses', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=300' }
          ]
        }
      ],
      Boys: [
        {
          title: 'Top Wear',
          items: [
            { name: 'Shirt', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=300' },
            { name: 'T-Shirt', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=300' },
            { name: 'Graphic Tees', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=300' },
            { name: 'Hoodies', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=300' },
            { name: 'Jackets', img: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=300' }
          ]
        },
        {
          title: 'Bottom Wear',
          items: [
            { name: 'Jeans', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=300' },
            { name: 'Track Pant', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80' },
            { name: 'Shorts', img: 'https://images.unsplash.com/photo-1618354691452-16eac7efc5be?auto=format&fit=crop&q=80&w=300' },
            { name: 'Cargo Shorts', img: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=300' }
          ]
        },
        {
          title: 'Inner Wear & Nightwear',
          items: [
            { name: 'Vest', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=300&q=80' },
            { name: 'Briefs', img: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=300&q=80' },
            { name: 'Sleepwear', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=300&q=80' }
          ]
        },
        {
          title: 'Traditional Wear',
          items: [
            { name: 'Kurta Set', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=300' },
            { name: 'Set Dhoti', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80' },
            { name: 'Party Suit', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=300' }
          ]
        }
      ],
      Kids: [
        {
          title: 'Top Wear',
          items: [
            { name: 'Shirt', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=300' },
            { name: 'T-Shirt', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80' },
            { name: 'Rompers & Onesies', img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80' },
            { name: 'Sweaters', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=300&q=80' }
          ]
        },
        {
          title: 'Bottom Wear',
          items: [
            { name: 'Soft Pants', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=300' },
            { name: 'Shorts', img: 'https://images.unsplash.com/photo-1618354691452-16eac7efc5be?auto=format&fit=crop&w=300&q=80' },
            { name: 'Dungarees', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=300&q=80' }
          ]
        },
        {
          title: 'Festive & Essentials',
          items: [
            { name: 'Kids Dhoti', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80' },
            { name: 'Inner Vests', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=300&q=80' },
            { name: 'Baby Booties & Socks', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80' }
          ]
        }
      ],
      Accessories: [
        {
          title: 'Bags & Wallets',
          items: [
            { name: 'Leather Wallets', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=300&q=80' },
            { name: 'Backpacks', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80' },
            { name: 'Sling & Travel Bags', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80' }
          ]
        },
        {
          title: 'Footwear & Juttis',
          items: [
            { name: 'Sneakers', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80' },
            { name: 'Formal Shoes', img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=300&q=80' },
            { name: 'Ethnic Juttis & Mojris', img: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=300&q=80' }
          ]
        },
        {
          title: 'Style Essentials',
          items: [
            { name: 'Dhotis', img: 'https://m.media-amazon.com/images/I/71sQIeakXfL._AC_UY1100_.jpg' },
            { name: 'Belts', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=300&q=80' },
            { name: 'Watches', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=300&q=80' },
            { name: 'Sunglasses & Caps', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80' }
          ]
        }
      ]
    };
  }, []);

  // Filter products matching dynamic activeDepartment + subcategory selection
  const filteredProducts = useMemo(() => {
    if (!selectedSub) return [];

    const { parentGroup, subCategory } = selectedSub;
    const lowerSub = subCategory.toLowerCase();

    // First filter by department gender
    const deptProducts = allProducts.filter(p => {
      if (activeDept === 'Accessories') return true;
      const pGender = p.gender.toLowerCase();
      const currentGen = activeDept.toLowerCase();
      if (currentGen === 'men') return pGender === 'men' || pGender === 'unisex';
      if (currentGen === 'boys') return pGender === 'boy';
      if (currentGen === 'kids') return pGender === 'kids' || pGender === 'boy' || pGender === 'girl';
      return true;
    });

    // Try exact or tag/category/name matching
    const matched = deptProducts.filter(p => {
      const pCat = p.category.toLowerCase();
      const pName = p.name.toLowerCase();
      const pTags = p.tags ? p.tags.map(t => t.toLowerCase()) : [];

      if (pCat.includes(lowerSub) || pName.includes(lowerSub) || pTags.some(t => t.includes(lowerSub))) {
        return true;
      }

      // Keyword based sub-matching
      if (lowerSub.includes('shirt') && (pCat.includes('shirt') || pName.includes('shirt'))) return true;
      if (lowerSub.includes('t-shirt') || lowerSub.includes('tee')) return pCat.includes('t-shirt') || pCat.includes('tee') || pName.includes('tee');
      if (lowerSub.includes('pant') || lowerSub.includes('jeans') || lowerSub.includes('chino') || lowerSub.includes('trouser')) return pCat.includes('pant') || pCat.includes('trouser') || pName.includes('jeans') || pName.includes('pant');
      if (lowerSub.includes('track') || lowerSub.includes('jogger')) return pCat.includes('track') || pName.includes('jogger');
      if (lowerSub.includes('short')) return pCat.includes('short') || pName.includes('short');
      if (lowerSub.includes('vest') || lowerSub.includes('brief') || lowerSub.includes('trunk') || lowerSub.includes('boxer') || lowerSub.includes('inner')) return pCat.includes('vest') || pCat.includes('brief') || pCat.includes('trunk') || pName.includes('vest');
      if (lowerSub.includes('dhoti') || lowerSub.includes('kurta') || lowerSub.includes('traditional') || lowerSub.includes('ethnic')) return pCat.includes('dhoti') || pCat.includes('traditional') || pName.includes('dhoti') || pName.includes('kurta');
      if (lowerSub.includes('shoe') || lowerSub.includes('sneaker') || lowerSub.includes('sandal') || lowerSub.includes('boot') || lowerSub.includes('jutti')) return pCat.includes('footwear') || pName.includes('shoe') || pName.includes('sneaker') || pName.includes('sandal');
      if (lowerSub.includes('belt') || lowerSub.includes('wallet') || lowerSub.includes('bag') || lowerSub.includes('watch') || lowerSub.includes('sunglass')) return pCat.includes('belt') || pCat.includes('wallet') || pCat.includes('accessory') || pName.includes('belt') || pName.includes('wallet') || pName.includes('watch');

      return false;
    });

    // Fallback if specific tag/name match yielded zero products
    return matched.length > 0 ? matched : deptProducts;
  }, [activeDept, selectedSub]);

  // Handle department changes in unified view
  const handleDeptChange = (dept: string) => {
    setActiveDept(dept);
    setSelectedSub(null);
    // Sync URL state quietly
    window.history.replaceState(null, '', `/category/${dept}`);
  };

  // Determine current active theme styling
  const themeAccent = useMemo(() => {
    if (activeDept === 'Men') return { bg: 'bg-zinc-950', hoverBg: 'hover:bg-zinc-900', text: 'text-zinc-950', border: 'border-zinc-950', rawHex: '#000000' };
    if (activeDept === 'Boys') return { bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-700', text: 'text-blue-600', border: 'border-blue-600', rawHex: '#2563eb' };
    if (activeDept === 'Kids') return { bg: 'bg-rose-500', hoverBg: 'hover:bg-rose-600', text: 'text-rose-500', border: 'border-rose-500', rawHex: '#f43f5e' };
    return { bg: 'bg-amber-600', hoverBg: 'hover:bg-amber-700', text: 'text-amber-600', border: 'border-amber-600', rawHex: '#d97706' };
  }, [activeDept]);

  return (
    <main className="min-h-screen lg:h-screen lg:overflow-hidden bg-white flex flex-col justify-between pt-16">
      
      {/* Main Interactive Work Area */}
      <div className="flex-1 max-w-5xl md:max-w-6xl mx-auto w-full px-4 sm:px-6 py-2 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {!selectedSub ? (
            /* ================= MODE 1: OPTIMIZED SINGLE-SCREEN DIRECTORY HUB ================= */
            <motion.div
              key={`${activeDept}-directory`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col gap-5 h-full overflow-y-auto pb-8 pr-1"
            >
              {DEPARTMENT_DATA[activeDept]?.map((group) => (
                <div 
                  key={group.title} 
                  className="flex flex-col gap-3"
                >
                  {/* Category Group Heading: Clean typography & No Heavy Borders */}
                  <div className="flex items-center gap-2 pt-3 pb-0.5 shrink-0">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-950 font-headline">
                      {group.title}
                    </span>
                    <span className="h-px bg-zinc-100 flex-1 ml-2"></span>
                  </div>

                  {/* Balanced grid: 4 cols on mobile, 5 cols on sm, 6 on md, 8 on lg for full desktop utilization */}
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-x-2.5 sm:gap-x-4 gap-y-3.5">
                    {group.items.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => setSelectedSub({ parentGroup: group.title, subCategory: item.name })}
                        className="group flex flex-col items-center p-1.5 hover:bg-zinc-50 rounded-xl transition-all duration-300 w-full cursor-pointer focus:outline-none"
                      >
                        {/* Compact Perfect Square Model Thumbnail Card */}
                        <div className="relative aspect-square w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 shrink-0 overflow-hidden bg-zinc-50 rounded-xl border border-zinc-100 shadow-2xs group-hover:scale-105 group-hover:border-zinc-300 transition-all duration-300">
                          <img 
                            src={item.img} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/[0.03] group-hover:bg-black/0 transition-colors"></div>
                        </div>

                        {/* Text Label Below with a Balanced Design */}
                        <div className="mt-1.5 w-full text-center min-w-0">
                          <h4 className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-zinc-800 uppercase tracking-wide truncate group-hover:text-zinc-950 transition-colors leading-tight">
                            {item.name}
                          </h4>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            /* ================= MODE 2: HIGHLY OPTIMIZED INTERNALLY SCROLLING PRODUCT VIEW ================= */
            <motion.div
              key="product-listing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              {/* Product list header panel */}
              <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-4 shrink-0">
                <div className="space-y-0.5">
                  <button 
                    onClick={() => setSelectedSub(null)}
                    className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 hover:text-zinc-950 transition-colors uppercase tracking-widest cursor-pointer"
                  >
                    <ArrowLeft size={10} />
                    <span>Back to unified categories</span>
                  </button>
                  <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight font-headline uppercase">
                    {selectedSub.subCategory}
                  </h2>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                    Showing {filteredProducts.length} Premium Articles in <span className="text-zinc-800">{activeDept}</span>
                  </p>
                </div>
                
                <button
                  onClick={() => setSelectedSub(null)}
                  className="border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white px-4 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all rounded-xl cursor-pointer shadow-xs"
                >
                  Change Category
                </button>
              </div>

              {/* Product Grid Area with Dedicated Scrollbar Container */}
              <div className="flex-1 overflow-y-auto pr-1 py-4 mt-2">
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8 pb-12">
                    {filteredProducts.map((product) => {
                      const isFavorited = wishlist.includes(product.id);

                      return (
                        <Link 
                          key={product.id} 
                          to={`/product/${product.id}`} 
                          className="group flex flex-col gap-2.5 cursor-pointer"
                        >
                          {/* Square image card with tools */}
                          <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 rounded-xl border border-zinc-200/50 shadow-xs group-hover:shadow-sm transition-all duration-300">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Actions overlay */}
                            <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
                              <button
                                onClick={(e) => handleToggleWishlist(product, e)}
                                className="w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs shadow-xs flex items-center justify-center text-zinc-800 hover:bg-white hover:scale-105 transition-all cursor-pointer"
                              >
                                <Heart 
                                  size={13} 
                                  className={isFavorited ? 'text-rose-500 fill-rose-500' : 'text-zinc-600'} 
                                />
                              </button>
                            </div>

                            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                              {product.tags.slice(0, 1).map(tag => (
                                <span key={tag} className="bg-zinc-950/90 text-white text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded shadow-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Quick Add overlay */}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                onClick={(e) => handleAddToCart(product, e)}
                                className="bg-zinc-950 text-white px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-zinc-800 cursor-pointer"
                              >
                                Add to Bag
                              </button>
                            </div>
                          </div>

                          {/* Product meta */}
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest truncate">
                                {product.brand || 'GM Fashion'}
                              </span>
                              <div className="flex items-center gap-0.5 text-amber-500 text-[9px] font-bold">
                                <Star size={8} className="fill-amber-500 text-amber-500" />
                                <span>4.8</span>
                              </div>
                            </div>
                            <h3 className="text-xs font-black text-zinc-900 tracking-tight font-headline uppercase truncate group-hover:text-zinc-600 transition-colors">
                              {product.name}
                            </h3>
                            <span className="text-xs font-extrabold text-zinc-950">
                              {product.price}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="py-14 bg-white border border-zinc-200/60 rounded-2xl text-center space-y-3.5 flex flex-col items-center justify-center px-6">
                    <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-400 border border-zinc-100">
                      <Tags size={20} />
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 font-headline uppercase tracking-wider">No Stock Available</h3>
                    <p className="text-zinc-500 text-xs font-body max-w-sm leading-relaxed">
                      Our designers are currently weaving active collections for <span className="font-extrabold text-zinc-800">{activeDept} &gt; {selectedSub.subCategory}</span>. Please explore our other premier categories in the meantime!
                    </p>
                    <button
                      onClick={() => setSelectedSub(null)}
                      className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold uppercase tracking-widest text-[10px] px-5 py-3 rounded-xl transition-all shadow-sm"
                    >
                      Explore Categories
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Banner Info */}
      <div className="bg-zinc-900 text-white/50 text-[10px] py-3.5 px-6 font-mono text-center shrink-0 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GM FASHION CO. © 2026</span>
          <span className="text-white/30 tracking-wider">PREMIUM FABRICS • EXPERT CRAFTSMANSHIP • LIFETIME DESIGN</span>
        </div>
      </div>

    </main>
  );
}
