import React, { useMemo, useState, useEffect } from 'react';
import { Tags, Plus, Upload, Trash2, X, ChevronLeft } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { allProducts } from '../data/products';
import FilterSortBar, { FilterState, initialFilterState } from '../components/FilterSortBar';

export default function ProductListing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  // Filter State
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);

  // Update gender filter when category URL parameter changes (e.g. /products?category=Men)
  useEffect(() => {
    if (categoryParam) {
      const lower = categoryParam.toLowerCase();
      if (['men', 'boys', 'kids'].includes(lower)) {
        setFilterState(prev => ({
          ...prev,
          gender: categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase()
        }));
      }
    }
  }, [categoryParam]);

  // Custom uploaded products
  const [customProducts, setCustomProducts] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('custom_products') || '[]');
  });

  // Add Product Modal states
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Top Wear');
  const [newProductGender, setNewProductGender] = useState('Men');
  const [newProductDetails, setNewProductDetails] = useState('');
  const [newProductImage, setNewProductImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Image Upload Handlers
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewProductImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) {
      alert('Please enter a product name.');
      return;
    }
    if (!newProductPrice.trim()) {
      alert('Please enter a price.');
      return;
    }
    if (!newProductImage) {
      alert('Please upload an image for the product.');
      return;
    }

    const priceNum = parseFloat(newProductPrice.replace(/[^\d.]/g, '')) || 0;
    const formattedPrice = `₹ ${priceNum.toLocaleString('en-IN')}`;

    const newProduct = {
      id: Date.now(),
      brand: 'GM Fashions',
      name: newProductName,
      price: formattedPrice,
      priceVal: priceNum,
      image: newProductImage,
      category: newProductCategory,
      gender: newProductGender,
      colors: ['White', 'Black', 'Blue'],
      sizes: ['S', 'M', 'L', 'XL'],
      tags: ['New Arrivals'],
      details: newProductDetails || 'Premium craftsmanship redefined.'
    };

    const updated = [newProduct, ...customProducts];
    localStorage.setItem('custom_products', JSON.stringify(updated));
    setCustomProducts(updated);

    // Reset Form
    setNewProductName('');
    setNewProductPrice('');
    setNewProductCategory('Top Wear');
    setNewProductGender('Men');
    setNewProductDetails('');
    setNewProductImage(null);
    setIsAddFormOpen(false);
  };

  const handleDeleteProduct = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this custom product?')) {
      const updated = customProducts.filter(p => p.id !== productId);
      localStorage.setItem('custom_products', JSON.stringify(updated));
      setCustomProducts(updated);
    }
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...allProducts, ...customProducts];

    // Search query from URL
    if (searchParam) {
      const rawQuery = searchParam.toLowerCase().trim();
      const tokens = rawQuery.split(/\s+/).filter(Boolean);

      const matched = list.filter(p => {
        const pName = p.name.toLowerCase();
        const pCat = p.category.toLowerCase();
        const pGen = p.gender.toLowerCase();
        const pTags = p.tags ? p.tags.map(t => t.toLowerCase()).join(' ') : '';
        const pDet = (p.details || '').toLowerCase();

        const fullText = `${pName} ${pCat} ${pGen} ${pTags} ${pDet}`;

        if (fullText.includes(rawQuery)) return true;
        if (tokens.length > 1 && tokens.every(tok => fullText.includes(tok))) return true;

        // Specific category aliases
        if (rawQuery.includes('shirt') && !rawQuery.includes('t-shirt') && pCat.includes('top') && (pName.includes('shirt') || pCat.includes('shirt'))) return true;
        if (rawQuery.includes('t-shirt') && (pName.includes('t-shirt') || pName.includes('tee') || pCat.includes('t-shirt'))) return true;
        if (rawQuery.includes('pant') && (pName.includes('pant') || pName.includes('jogger') || pName.includes('trouser') || pCat.includes('bottom'))) return true;
        if (rawQuery.includes('shorts') && (pName.includes('short') || pCat.includes('short'))) return true;
        if (rawQuery.includes('vest') && (pName.includes('vest') || pCat.includes('vest') || pCat.includes('inner'))) return true;
        if (rawQuery.includes('dhoti') && (pName.includes('dhoti') || pCat.includes('dhoti') || pCat.includes('traditional'))) return true;

        return false;
      });

      if (matched.length > 0) {
        list = matched;
      }
    }

    // Category query from URL if not overridden by dropdown
    if (categoryParam && !filterState.gender && !filterState.mainCategory) {
      const lower = categoryParam.toLowerCase();
      if (['new arrivals', 'editorial', 'collections'].includes(lower)) {
        list = list.filter(p => p.tags.some(t => t.toLowerCase() === lower));
      } else if (lower === 'men' || lower === 'mens') {
        list = list.filter(p => p.gender.toLowerCase() === 'men');
      } else if (lower === 'boys' || lower === 'boy') {
        list = list.filter(p => p.gender.toLowerCase() === 'boy');
      } else if (lower === 'kids' || lower === 'kid') {
        list = list.filter(p => ['boy', 'girl', 'kid', 'kids'].includes(p.gender.toLowerCase()));
      }
    }

    // 1. Main Category filter ('Top Wear' | 'Bottom Wear' | 'Inner Wear' | 'Traditional Wear')
    if (filterState.mainCategory) {
      const mc = filterState.mainCategory.toLowerCase();
      list = list.filter(p => {
        const pCat = p.category.toLowerCase();
        const pName = p.name.toLowerCase();

        if (mc === 'top wear') {
          return pCat.includes('shirt') || pCat.includes('top') || pCat.includes('t-shirt') || pCat.includes('apparel') || pCat.includes('fancy') || pName.includes('shirt') || pName.includes('t-shirt') || pName.includes('vest');
        }
        if (mc === 'bottom wear') {
          return pCat.includes('pant') || pCat.includes('short') || pCat.includes('trouser') || pCat.includes('bottom') || pName.includes('pant') || pName.includes('shorts') || pName.includes('dhoti');
        }
        if (mc === 'inner wear') {
          return pCat.includes('inner') || pCat.includes('brief') || pCat.includes('trunk') || pCat.includes('vest') || pName.includes('brief') || pName.includes('trunk') || pName.includes('vest');
        }
        if (mc === 'traditional wear') {
          return pCat.includes('traditional') || pCat.includes('dhoti') || pCat.includes('kurta') || pName.includes('dhoti') || pName.includes('kurta') || pName.includes('silk');
        }
        return true;
      });
    }

    // 2. Gender filter ('Men' | 'Boys' | 'Kids')
    if (filterState.gender) {
      const g = filterState.gender.toLowerCase();
      list = list.filter(p => {
        const pG = p.gender.toLowerCase();
        if (g === 'men' || g === 'mens') return pG === 'men' || pG === 'mens';
        if (g === 'boys' || g === 'boy') return pG === 'boy' || pG === 'boys';
        if (g === 'kids' || g === 'kid') return pG === 'kid' || pG === 'kids' || pG === 'boy' || pG === 'girl';
        return pG.includes(g);
      });
    }

    // 3. SubCategories filter ('shirt', 't-shirt', 'pant', 'track pant', 'shorts', 'vest', 'gym vest', 'brief', 'trunk', 'white shirt', 'dhoti', 'set dhoti')
    if (filterState.subCategories.length > 0) {
      list = list.filter(p => {
        const nameCat = `${p.name} ${p.category} ${p.details || ''} ${p.tags.join(' ')}`.toLowerCase();
        return filterState.subCategories.some(sub => nameCat.includes(sub.toLowerCase()));
      });
    }

    // 4. Advanced Genders filter
    if (filterState.advGenders.length > 0) {
      list = list.filter(p => {
        const pG = p.gender.toLowerCase();
        return filterState.advGenders.some(ag => {
          const agL = ag.toLowerCase();
          if (agL === 'mens' || agL === 'men') return pG === 'men' || pG === 'mens';
          if (agL === 'boys' || agL === 'boy') return pG === 'boy' || pG === 'boys';
          if (agL === 'kids' || agL === 'kid') return pG === 'kid' || pG === 'kids' || pG === 'boy' || pG === 'girl';
          return pG.includes(agL);
        });
      });
    }

    // 5. Colors filter
    if (filterState.colors.length > 0) {
      list = list.filter(p => {
        return filterState.colors.some(col => {
          const cL = col.toLowerCase();
          const pColorsStr = p.colors.join(' ').toLowerCase();
          const pDetailsStr = `${p.name} ${p.details || ''}`.toLowerCase();
          return pColorsStr.includes(cL) || pDetailsStr.includes(cL);
        });
      });
    }

    // 6. Fabrics filter
    if (filterState.fabrics.length > 0) {
      list = list.filter(p => {
        const text = `${p.name} ${p.category} ${p.details || ''} ${p.tags.join(' ')}`.toLowerCase();
        return filterState.fabrics.some(f => text.includes(f.toLowerCase()));
      });
    }

    // 7. Fits filter
    if (filterState.fits.length > 0) {
      list = list.filter(p => {
        const text = `${p.name} ${p.details || ''} ${p.tags.join(' ')}`.toLowerCase();
        return filterState.fits.some(f => text.includes(f.toLowerCase()));
      });
    }

    // 8. Patterns filter
    if (filterState.patterns.length > 0) {
      list = list.filter(p => {
        const text = `${p.name} ${p.details || ''} ${p.tags.join(' ')}`.toLowerCase();
        return filterState.patterns.some(pat => text.includes(pat.toLowerCase()));
      });
    }

    // 9. Sizes filter
    if (filterState.sizes.length > 0) {
      list = list.filter(p => {
        return filterState.sizes.some(sz => p.sizes.includes(sz));
      });
    }

    // 10. Price Range filter
    list = list.filter(p => p.priceVal >= filterState.minPrice && p.priceVal <= filterState.maxPrice);

    // 11. Brands filter
    if (filterState.brands.length > 0) {
      list = list.filter(p => {
        const brandStr = `${p.brand || 'GM Fashions'} ${p.name}`.toLowerCase();
        return filterState.brands.some(b => brandStr.includes(b.toLowerCase()));
      });
    }

    // SORTING
    if (filterState.sort === 'new_arrivals') {
      list.sort((a, b) => b.id - a.id);
    } else if (filterState.sort === 'price_low_high') {
      list.sort((a, b) => a.priceVal - b.priceVal);
    } else if (filterState.sort === 'price_high_low') {
      list.sort((a, b) => b.priceVal - a.priceVal);
    } else if (filterState.sort === 'rating') {
      list.sort((a, b) => b.id - a.id);
    } else if (filterState.sort === 'discount') {
      list.sort((a, b) => a.priceVal - b.priceVal);
    }

    return list;
  }, [allProducts, customProducts, categoryParam, searchParam, filterState]);

  return (
    <main className="flex flex-col min-h-screen max-w-[1920px] mx-auto w-full relative">
      
      {/* 4-Option Filter & Sorting Bar placed directly below main header */}
      <FilterSortBar
        filters={filterState}
        onChange={setFilterState}
        totalProductsCount={filteredProducts.length}
      />

      {/* Content Area */}
      <div className="flex-1 px-4 sm:px-8 pb-32 w-full pt-4 sm:pt-6">

        {/* Add Product Modal */}
        <AnimatePresence>
          {isAddFormOpen && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddFormOpen(false)}
                className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-xs pointer-events-auto"
              />
              {/* Form Drawer */}
              <motion.aside 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white z-[110] flex flex-col p-8 border-l border-zinc-200 overflow-y-auto shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-zinc-900 leading-none font-headline tracking-tight uppercase">New Product</h2>
                    <p className="text-xs text-zinc-400 mt-1 font-body">Upload product details & launch into collection</p>
                  </div>
                  <button 
                    onClick={() => setIsAddFormOpen(false)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer text-zinc-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddProductSubmit} className="flex-1 flex flex-col gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-label">Product Name</label>
                    <input 
                      type="text" 
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      placeholder="e.g. Classic Suede Chelsea Boots"
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900 font-body"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-label">Price (INR)</label>
                    <input 
                      type="text" 
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      placeholder="e.g. 8999"
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900 font-body"
                      required
                    />
                  </div>

                  {/* Grid of options */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Category */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-label">Category</label>
                      <select 
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900 font-body appearance-none"
                      >
                        <option value="Top Wear">Top Wear</option>
                        <option value="Bottom Wear">Bottom Wear</option>
                        <option value="Inner Wear">Inner Wear</option>
                        <option value="Traditional Wear">Traditional Wear</option>
                      </select>
                    </div>

                    {/* Shop For */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-label">Shop For</label>
                      <select 
                        value={newProductGender}
                        onChange={(e) => setNewProductGender(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900 font-body appearance-none"
                      >
                        <option value="Men">Men</option>
                        <option value="Boys">Boys</option>
                        <option value="Kids">Kids</option>
                      </select>
                    </div>
                  </div>

                  {/* Image Drag and Drop */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-label">Product Image</label>
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all min-h-[160px] ${
                        isDragging ? 'border-zinc-950 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-400 bg-zinc-50/50'
                      }`}
                      onClick={() => document.getElementById('new-file-input')?.click()}
                    >
                      <input 
                        type="file" 
                        id="new-file-input" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageFile(e.target.files[0]);
                          }
                        }}
                      />
                      {newProductImage ? (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden group">
                          <img src={newProductImage} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold uppercase tracking-wider">Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
                            <Upload size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-800">Drag & drop your file here</p>
                            <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider">or click to browse from device</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-label">Product Details (Optional)</label>
                    <textarea 
                      value={newProductDetails}
                      onChange={(e) => setNewProductDetails(e.target.value)}
                      placeholder="e.g. Crafted with Italian suede. Highly durable natural crepe rubber sole with orthotic arch support..."
                      rows={3}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900 font-body resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button 
                    type="submit"
                    className="w-full mt-auto py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Launch Product
                  </button>
                </form>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-12">
          {filteredProducts.map((product) => {
            const isCustom = customProducts.some(p => p.id === product.id);

            return (
              <Link key={product.id} to={`/product/${product.id}`} className="group relative flex flex-col gap-4 cursor-pointer block">
                <div className="aspect-[4/5] overflow-hidden bg-zinc-100 relative rounded-lg">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={product.name} 
                      src={product.image}
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Top Left Single Clean Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                      <span className="bg-white text-zinc-900 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded shadow-xs border border-zinc-200/60">
                        {(() => {
                          if (isCustom) return 'NEW';
                          const tagsUpper = product.tags.map((t: string) => t.toUpperCase());
                          if (tagsUpper.includes('EDITORIAL') || tagsUpper.includes('COLLECTIONS')) return 'PREMIUM';
                          if (tagsUpper.includes('NEW ARRIVALS') || tagsUpper.includes('NEW ARRIVAL')) return 'NEW';
                          if (product.id % 3 === 0) return 'TREND';
                          if (product.id % 3 === 1) return 'NEW';
                          return 'PREMIUM';
                        })()}
                      </span>
                    </div>

                    {/* Delete button for custom items */}
                    {isCustom && (
                      <button 
                        onClick={(e) => handleDeleteProduct(product.id, e)}
                        title="Delete Product"
                        className="absolute bottom-2.5 right-2.5 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md shadow-xs cursor-pointer transition-all z-20"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-900 font-headline uppercase truncate">{product.name}</h3>
                    <p className="text-xs text-zinc-500 font-medium">{product.price}</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">{product.gender} • {product.category}</p>
                  </div>
                </Link>
            );
          })}
        </div>
        
        {filteredProducts.length === 0 && (
           <div className="py-24 flex flex-col items-center justify-center text-center pb-40">
             <div className="w-16 h-16 mb-4 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
               <Tags size={24} />
             </div>
             <h3 className="text-2xl font-bold font-headline text-zinc-900 mb-2 tracking-tight">No Products Found</h3>
             <p className="text-zinc-500 font-body max-w-sm">We couldn't find anything matching your selected filters. Try clearing them or choosing different options.</p>
             <button onClick={() => setFilterState(initialFilterState)} className="mt-8 border border-zinc-300 text-zinc-900 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer rounded-xl">
               Clear All Filters
             </button>
           </div>
        )}
      </div>
    </main>
  );
}
