import React, { useMemo, useState } from 'react';
import { Banknote, Palette, Ruler, LayoutGrid, Tags, BadgeCheck, Check, Filter, X, Plus, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { allProducts } from '../data/products';

const PRICE_RANGES = [
  { label: 'Under ₹ 5,000', min: 0, max: 5000 },
  { label: '₹ 5,000 - ₹ 10,000', min: 5000, max: 10000 },
  { label: 'Over ₹ 10,000', min: 10000, max: Infinity }
];

export default function ProductListing() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Custom uploaded products
  const [customProducts, setCustomProducts] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('custom_products') || '[]');
  });

  // Add Product Modal states
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Footwear');
  const [newProductGender, setNewProductGender] = useState('Men');
  const [newProductDetails, setNewProductDetails] = useState('');
  const [newProductImage, setNewProductImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Filter States
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const toggleFilter = (setState: React.Dispatch<React.SetStateAction<any[]>>, value: string | number) => {
    setState(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const clearFilters = () => {
    setSelectedGenders([]);
    setSelectedPriceRanges([]);
    setSelectedColors([]);
    setSelectedSizes([]);
  };

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
      name: newProductName,
      price: formattedPrice,
      priceVal: priceNum,
      image: newProductImage,
      category: newProductCategory,
      gender: newProductGender,
      colors: ['#000000', '#ffffff', '#ef4444'],
      sizes: ['7', '8', '9', '10', '11'],
      tags: ['New Arrivals'],
      details: newProductDetails || 'Premium craftsmanship redefined.'
    };

    const updated = [newProduct, ...customProducts];
    localStorage.setItem('custom_products', JSON.stringify(updated));
    setCustomProducts(updated);

    // Reset Form
    setNewProductName('');
    setNewProductPrice('');
    setNewProductCategory('Footwear');
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

  // 1. Get base products for the current category context (before user selected filters)
  const categorySpecificProducts = useMemo(() => {
    let list = [...allProducts, ...customProducts];
    if (categoryParam) {
      const lowerParam = categoryParam.toLowerCase();
      if (['new arrivals', 'editorial', 'collections'].includes(lowerParam)) {
        list = list.filter(p => p.tags.some(t => t.toLowerCase() === lowerParam));
      } else if (lowerParam === 'men' || lowerParam === 'mens') {
        list = list.filter(p => p.gender.toLowerCase() === 'men');
      } else if (lowerParam === 'women' || lowerParam === 'womens') {
        list = list.filter(p => p.gender.toLowerCase() === 'women');
      } else if (lowerParam === 'boys' || lowerParam === 'boy') {
        list = list.filter(p => p.gender.toLowerCase() === 'boy');
      } else if (lowerParam === 'girls' || lowerParam === 'girl') {
        list = list.filter(p => p.gender.toLowerCase() === 'girl');
      } else if (lowerParam === 'kids' || lowerParam === 'kid') {
        list = list.filter(p => ['boy', 'girl'].includes(p.gender.toLowerCase()));
      } else {
        list = list.filter(p => p.category.toLowerCase() === lowerParam || p.category.toLowerCase() === lowerParam.replace('ies', 'y'));
      }
    }

    if (searchParam) {
      const query = searchParam.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.gender.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query)) ||
        (p.details && p.details.toLowerCase().includes(query))
      );
    }
    return list;
  }, [categoryParam, searchParam, customProducts]);

  // 2. Extract available filter options exactly related to the current category bounds
  const availableGenders = useMemo(() => Array.from(new Set(categorySpecificProducts.map(p => p.gender))), [categorySpecificProducts]);
  const availableColors = useMemo(() => Array.from(new Set(categorySpecificProducts.flatMap(p => p.colors))), [categorySpecificProducts]);
  const availableSizes = useMemo(() => Array.from(new Set(categorySpecificProducts.flatMap(p => p.sizes))), [categorySpecificProducts]);

  // 3. Apply user selected filters onto the category specific list
  const filteredProducts = useMemo(() => {
    return categorySpecificProducts.filter(p => {
      // Gender filter
      if (selectedGenders.length > 0 && !selectedGenders.includes(p.gender)) return false;
      
      // Color filter
      if (selectedColors.length > 0 && !p.colors.some(c => selectedColors.includes(c))) return false;
      
      // Size filter
      if (selectedSizes.length > 0 && !p.sizes.some(s => selectedSizes.includes(s))) return false;
      
      // Price range filter
      if (selectedPriceRanges.length > 0) {
        const matchesPrice = selectedPriceRanges.some(index => {
          const range = PRICE_RANGES[index];
          return p.priceVal >= range.min && p.priceVal <= range.max;
        });
        if (!matchesPrice) return false;
      }
      return true;
    });
  }, [categorySpecificProducts, selectedGenders, selectedColors, selectedSizes, selectedPriceRanges]);

  const pageTitle = searchParam
    ? `Search: "${searchParam}"`
    : categoryParam && ['New Arrivals', 'Editorial'].includes(categoryParam) 
      ? categoryParam 
      : categoryParam 
        ? categoryParam 
        : "All Products";

  return (
    <main className="pt-6 flex flex-col min-h-screen max-w-[1920px] mx-auto w-full relative">
      
      {/* Floating Filter Toggle Button (Desktop/Tablet only) */}
      <button 
        onClick={() => setIsFilterOpen(true)}
        className="hidden md:flex fixed top-44 right-0 bg-zinc-900 text-white pl-4 pr-6 py-4 rounded-l-full shadow-2xl z-40 items-center gap-2 hover:pl-6 transition-all font-bold text-sm uppercase tracking-widest cursor-pointer"
      >
        <Filter size={20} />
        <span className="hidden sm:inline">Filters</span>
      </button>

      {/* Sticky Bottom Bar for Mobile Filters (Flipkart style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-zinc-200/80 backdrop-blur z-40 flex items-center justify-around px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <Link 
          to="/" 
          className="flex flex-col items-center justify-center gap-0.5 text-zinc-500 hover:text-zinc-900 flex-1 py-1"
        >
          <LayoutGrid size={18} />
          <span className="text-[10px] font-semibold uppercase tracking-wider font-label">Home</span>
        </Link>
        <div className="w-[1px] h-8 bg-zinc-200"></div>
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center justify-center gap-2 text-zinc-900 font-bold text-xs uppercase tracking-widest flex-1 py-1 cursor-pointer"
        >
          <Filter size={18} />
          <span>Filters</span>
          {(selectedGenders.length + selectedColors.length + selectedSizes.length + selectedPriceRanges.length) > 0 && (
            <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] flex items-center justify-center font-bold font-label">
              {selectedGenders.length + selectedColors.length + selectedSizes.length + selectedPriceRanges.length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Slide-over Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 pointer-events-auto"
            />
            {/* Panel */}
            <motion.aside 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white z-[60] flex flex-col p-8 gap-8 border-l border-zinc-200 overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 leading-none font-headline tracking-tight">Refine</h2>
                </div>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Dynamic Gender/Category Filter */}
              {availableGenders.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-zinc-900 font-headline text-sm font-semibold uppercase tracking-widest">
                    <BadgeCheck size={16} strokeWidth={2} />
                    Category
                  </div>
                  <div className="flex flex-col gap-3">
                    {availableGenders.sort().map(gender => (
                      <label key={gender} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${selectedGenders.includes(gender) ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300 group-hover:border-zinc-900'}`}>
                          {selectedGenders.includes(gender) && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors uppercase tracking-wider">{gender}</span>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={selectedGenders.includes(gender)}
                          onChange={() => toggleFilter(setSelectedGenders, gender)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Filter */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-zinc-900 font-headline text-sm font-semibold uppercase tracking-widest">
                  <Banknote size={16} strokeWidth={2} />
                  Price Range
                </div>
                <div className="flex flex-col gap-3">
                  {PRICE_RANGES.map((range, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${selectedPriceRanges.includes(idx) ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300 group-hover:border-zinc-900'}`}>
                        {selectedPriceRanges.includes(idx) && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors uppercase tracking-wider">{range.label}</span>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedPriceRanges.includes(idx)}
                        onChange={() => toggleFilter(setSelectedPriceRanges, idx)}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Swatches */}
              {availableColors.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-zinc-900 font-headline text-sm font-semibold uppercase tracking-widest">
                    <Palette size={16} strokeWidth={2} />
                    Color
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.sort().map(color => (
                      <button 
                        key={color} 
                        onClick={() => toggleFilter(setSelectedColors, color)}
                        style={{ backgroundColor: color }}
                        className={`w-8 h-8 rounded-full ring-offset-2 ring-offset-white transition-all cursor-pointer border border-zinc-200 ${
                          selectedColors.includes(color) ? 'ring-2 ring-zinc-900 scale-110' : 'hover:ring-2 hover:ring-zinc-300'
                        }`}
                        aria-label={`Select color`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {availableSizes.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-zinc-900 font-headline text-sm font-semibold uppercase tracking-widest">
                    <Ruler size={16} strokeWidth={2} />
                    Size
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.sort((a,b) => a.localeCompare(b)).map(size => (
                      <button 
                        key={size}
                        onClick={() => toggleFilter(setSelectedSizes, size)}
                        className={`px-3 py-2 flex items-center justify-center border text-xs font-bold transition-all cursor-pointer ${
                          selectedSizes.includes(size) ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-900 hover:text-white hover:border-zinc-900'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear All */}
              <div className="mt-auto pt-8 border-t border-zinc-100">
                 <button 
                   onClick={clearFilters}
                   className="w-full text-zinc-900 border border-zinc-900 py-4 text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"
                 >
                   Clear Filters
                 </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="flex-1 px-8 pb-32 w-full">
        <header className="mb-12 border-b border-zinc-200 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs tracking-[0.3em] uppercase text-zinc-500 font-medium font-label">Curated Selection</span>
            <h1 className="text-5xl font-extrabold tracking-tighter text-zinc-900 font-headline capitalize">{pageTitle}</h1>
            <p className="text-zinc-500 max-w-md mt-4 text-sm leading-relaxed font-body">
              {filteredProducts.length} Premium items optimized for comfort and uncompromising style.
            </p>
          </div>
          <button 
            onClick={() => setIsAddFormOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex-shrink-0"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </header>

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
                        <option value="Footwear">Footwear</option>
                        <option value="Outerwear">Outerwear</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Apparel">Apparel</option>
                      </select>
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-label">Gender</label>
                      <select 
                        value={newProductGender}
                        onChange={(e) => setNewProductGender(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900 font-body appearance-none"
                      >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Boy">Boy</option>
                        <option value="Girl">Girl</option>
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

        {/* Action Indicators */}
        {(selectedGenders.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0 || selectedPriceRanges.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
             <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 mr-2">Active Filters:</span>
             {[...selectedGenders, ...selectedSizes].map(filter => (
               <span key={filter} className="bg-zinc-100 text-zinc-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">{filter}</span>
             ))}
             {selectedPriceRanges.map(idx => (
               <span key={`p-${idx}`} className="bg-zinc-100 text-zinc-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">{PRICE_RANGES[idx].label}</span>
             ))}
             {selectedColors.map(color => (
               <span key={color} className="flex items-center gap-1 bg-zinc-100 text-zinc-900 px-2 py-1 text-[10px] uppercase rounded-full">
                 <div className="w-2.5 h-2.5 rounded-full border border-zinc-300" style={{ backgroundColor: color }}></div>
               </span>
             ))}
             <button onClick={clearFilters} className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:underline ml-2 cursor-pointer">Clear All</button>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-12">
          {filteredProducts.map((product, index) => {
            const showAd = index === 6;
            const isCustom = customProducts.some(p => p.id === product.id);

            return (
              <React.Fragment key={product.id}>
                {showAd && (
                  <div className="col-span-full my-8 bg-zinc-900 text-white rounded-xl overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-16 min-h-[300px] relative w-full group">
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity duration-700">
                       <img src="https://images.unsplash.com/photo-1618354691452-16eac7efc5be?auto=format&fit=crop&w=1200&q=80" alt="Brand Ad" className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
                    </div>
                    <div className="relative z-10 flex flex-col gap-4 max-w-lg">
                      <span className="text-white/80 font-label text-xs tracking-[0.3em] uppercase font-bold">Featured Brand</span>
                      <h2 className="text-4xl md:text-5xl font-headline font-black tracking-tighter leading-none">THE NEW CLASSIC</h2>
                      <p className="text-white/80 font-body text-sm md:text-base mb-4">Experience uncompromising quality with our latest signature collection. Redefined for the modern aesthetic.</p>
                    </div>
                    <Link to="/products?category=Editorial" className="relative z-10 mt-8 md:mt-0 border border-white text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-zinc-900 transition-colors">
                      Discover Collection
                    </Link>
                  </div>
                )}
                
                <Link to={`/product/${product.id}`} className="group relative flex flex-col gap-4 cursor-pointer block">
                  <div className="aspect-[4/5] overflow-hidden bg-zinc-100 relative rounded-lg">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={product.name} 
                      src={product.image}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-zinc-900 text-white px-6 py-3 text-xs font-bold tracking-widest uppercase rounded-lg shadow-xl translate-y-4 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                        View Details
                      </button>
                    </div>
                    
                    {/* Top badging */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                       {product.tags.map(tag => (
                         <span key={tag} className="bg-white/90 backdrop-blur-sm text-zinc-900 px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded shadow-sm">{tag}</span>
                       ))}
                       {isCustom && (
                         <span className="bg-amber-500/90 backdrop-blur-sm text-white px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded shadow-sm">My Upload</span>
                       )}
                    </div>

                    {/* Delete overlay for custom items */}
                    {isCustom && (
                      <button 
                        onClick={(e) => handleDeleteProduct(product.id, e)}
                        title="Delete Product"
                        className="absolute bottom-3 right-3 p-2 bg-red-50 hover:bg-red-100 hover:text-red-700 text-red-600 rounded-lg shadow-sm cursor-pointer transition-all z-20"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-900 font-headline uppercase truncate">{product.name}</h3>
                    <p className="text-xs text-zinc-500 font-medium">{product.price}</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">{product.gender} • {product.category}</p>
                  </div>
                </Link>
              </React.Fragment>
            );
          })}
        </div>
        
        {filteredProducts.length === 0 && (
           <div className="py-24 flex flex-col items-center justify-center text-center pb-40">
             <div className="w-16 h-16 mb-4 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
               <Tags size={24} />
             </div>
             <h3 className="text-2xl font-bold font-headline text-zinc-900 mb-2 tracking-tight">No Products Found</h3>
             <p className="text-zinc-500 font-body max-w-sm">We couldn't find anything matching your selected filters. Try clearing them to see all items.</p>
             <button onClick={clearFilters} className="mt-8 border border-zinc-300 text-zinc-900 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer">
               Clear Filters
             </button>
           </div>
        )}
      </div>
    </main>
  );
}
