import React, { useState, useRef, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import PopularTimes from './components/PopularTimes';
import ReviewSection from './components/ReviewSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import EditProductModal from './components/EditProductModal';
import { Language, PIZZERIA_INFO, TRANSLATIONS, MENU_ITEMS, MenuItem, CartItem } from './data';
import { Info, MapPin, Phone, Clock, ArrowRight, ExternalLink, Calendar, Star, ChefHat, Sparkles, ShoppingBag, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [lang, setLang] = useState<Language>('sq');
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'reviews' | 'about'>('overview');

  // Interactive dynamic menu data state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const cached = localStorage.getItem('pizzeria_rea_menu_items');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Error restoring menu items from cache:', e);
      }
    }
    return MENU_ITEMS;
  });

  // Synchronize menu items with server-side JSON file
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch('/api/menu-items');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data) && data.length > 0) {
            setMenuItems(data);
            localStorage.setItem('pizzeria_rea_menu_items', JSON.stringify(data));
          } else {
            // First run where server has no local JSON file, initialize server file with our current items
            await fetch('/api/menu-items', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(menuItems)
            });
          }
        }
      } catch (e) {
        console.error('Failed to sync menu items with server:', e);
      }
    };
    fetchMenuItems();
  }, []);

  // Shopping cart data state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const cached = localStorage.getItem('pizzeria_rea_cart');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Error restoring cart items from cache:', e);
      }
    }
    return [];
  });

  // Modals visibility state
  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Secure admin passcode passcode entry states
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  const t = TRANSLATIONS[lang];

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'Pizzarearea') {
      setIsOwnerMode(true);
      setActiveTab('menu');
      setPasscode('');
      setPasscodeError(false);
      setIsAdminLoginOpen(false);
    } else {
      setPasscodeError(true);
    }
  };

  const handleLockAdmin = () => {
    setIsOwnerMode(false);
    setPasscode('');
    setPasscodeError(false);
  };

  // Cart operations
  const handleAddToCart = (item: MenuItem | CartItem, size?: '30' | '40') => {
    let newItem: CartItem;
    if ('menuItemId' in item) {
      newItem = { ...item };
    } else {
      const finalPrice = size === '40' && item.price40 ? item.price40 : item.price;
      const sizeSuffix = size ? ` (${size}cm)` : '';
      newItem = {
        id: `cart-item-${item.id}-${size || 'default'}`,
        menuItemId: item.id,
        nameSq: `${item.nameSq}${sizeSuffix}`,
        nameEn: `${item.nameEn}${sizeSuffix}`,
        price: finalPrice,
        quantity: 1,
        emoji: item.emoji,
        size,
      };
    }

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(c =>
        c.menuItemId === newItem.menuItemId &&
        c.size === newItem.size &&
        c.crustType === newItem.crustType &&
        JSON.stringify(c.selectedToppings) === JSON.stringify(newItem.selectedToppings)
      );

      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...prevCart];
        updated[existingIndex].quantity += newItem.quantity || 1;
      } else {
        updated = [...prevCart, newItem];
      }
      localStorage.setItem('pizzeria_rea_cart', JSON.stringify(updated));
      return updated;
    });

    // Do not auto-trigger slide open cart so user can continue browsing uninterrupted
    // setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prevCart => {
      const updated = prevCart.map(item => {
        if (item.id === id) {
          const qty = item.quantity + delta;
          return qty > 0 ? { ...item, quantity: qty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
      localStorage.setItem('pizzeria_rea_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prevCart => {
      const updated = prevCart.filter(item => item.id !== id);
      localStorage.setItem('pizzeria_rea_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('pizzeria_rea_cart');
  };

  // Owner Operations
  const handleSaveProduct = async (item: MenuItem) => {
    let finalUpdated: MenuItem[] = [];
    setMenuItems(prevItems => {
      const existingIdx = prevItems.findIndex(i => i.id === item.id);
      let updated: MenuItem[];
      if (existingIdx > -1) {
        updated = [...prevItems];
        updated[existingIdx] = item;
      } else {
        updated = [...prevItems, item];
      }
      finalUpdated = updated;
      localStorage.setItem('pizzeria_rea_menu_items', JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch('/api/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalUpdated)
      });
    } catch (e) {
      console.error('Error saving menu item to server:', e);
    }

    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteProduct = async (id: string) => {
    let finalUpdated: MenuItem[] = [];
    setMenuItems(prevItems => {
      const updated = prevItems.filter(i => i.id !== id);
      finalUpdated = updated;
      localStorage.setItem('pizzeria_rea_menu_items', JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch('/api/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalUpdated)
      });
    } catch (e) {
      console.error('Error deleting menu item from server:', e);
    }

    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleEditItemClick = (item: MenuItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleAddNewItemClick = () => {
    setEditingItem(null);
    setIsEditModalOpen(true);
  };

  // Nav helper for Hero anchors
  const handleHeroNavigation = (sectionId: string) => {
    if (sectionId === 'menu-section') {
      setActiveTab('menu');
    }
  };

  // Extract a few popular items for Overview showcase
  const popularPizzaHighlights = useMemo(() => {
    return menuItems.filter(item => item.popular && (item.category === 'pizza_klasike' || item.category === 'pizza_speciale')).slice(0, 3);
  }, [menuItems]);

  return (
    <div className="min-h-screen bg-pizza-cream/60 flex flex-col justify-between selection:bg-pizza-red-light selection:text-white">
      
      {/* 1. Global Navigation Header */}
      <Header lang={lang} setLang={setLang} />

      {/* 2. Panoramic Visual Hero Banner */}
      <Hero lang={lang} onNavigateToSection={handleHeroNavigation} />

      {/* 3. Main Navigation Category Tab Bar */}
      <nav className="sticky top-20 md:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center -mb-px space-x-1 sm:space-x-8 md:space-x-10 py-1 font-sans">
            {([
              { id: 'overview', label: t.overview, emoji: '🏠' },
              { id: 'menu', label: t.menu, emoji: '🍕' },
              { id: 'reviews', label: t.reviews, emoji: '★' },
              { id: 'about', label: t.about, emoji: '📜' }
            ] as const).map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  id={`tab-${tab.id}`}
                  className={`flex items-center space-x-1 sm:space-x-2 py-4 px-2 sm:px-4 text-xs sm:text-sm font-extrabold tracking-tight border-b-2 transition duration-300 ${
                    isSelected
                      ? 'border-pizza-red text-pizza-red'
                      : 'border-transparent text-stone-500 hover:text-pizza-stone hover:border-stone-300'
                  }`}
                >
                  <span className="scale-90">{tab.emoji}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 4. Core Body Content sections with Page Transitions */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            
            {/* =======================================
                A. OVERVIEW TAB
               ======================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-10">
                {/* Intro welcome grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Opening details and Call actions */}
                  <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-150 p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="flex items-center space-x-2 text-pizza-red">
                      <ChefHat className="h-5 w-5 animate-pulse" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider">
                        {lang === 'sq' ? 'Kashar, Shqipëri' : 'Kashar, Albania'}
                      </span>
                    </div>
                    
                    <h3 className="font-serif text-3xl font-black text-pizza-stone tracking-tight leading-none">
                      {lang === 'sq' ? 'Përshëndetje në Pizzeria rea' : 'Welcome to Pizzeria rea'}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-sans">
                      {lang === 'sq' 
                        ? 'Ne besojmë tek thjeshtësia, brumi i shkëlqyer, dhe përbërësit e freskët. Picat tona piqen me dru lajthie në një temperaturë ideale rreth 450°C, që u jep brinjëve të tyre atë butësi dhe strukturë perfekte të picës së vërtetë Napoletane.'
                        : 'We believe in simplicity, slow fermentation, and the freshest toppings. Our pizzas are baked using quality oak wood logs in our direct stone hearth oven at 450°C, rendering an authentic, blistered crust that is airy, light and incredibly flavor-packed.'}
                    </p>

                    {/* Features checklist attributes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-stone-50 p-4 rounded-2xl border border-stone-100 text-xs">
                      <div className="flex items-center space-x-2 text-stone-600">
                        <span className="text-emerald-500">✓</span>
                        <span>{lang === 'sq' ? 'Dine-in (Ambiente të rehatshme)' : 'Cozy indoor seating'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-stone-600">
                        <span className="text-emerald-500">✓</span>
                        <span>{lang === 'sq' ? 'Marrja me vetë (Drive-through)' : 'Fast drive-through takeaway'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-stone-600">
                        <span className="text-emerald-500">✓</span>
                        <span>{lang === 'sq' ? 'Porosi të shpejta me telefon 📞' : 'Direct calling delivery hotline 📞'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-stone-600">
                        <span className="text-emerald-500">✓</span>
                        <span>{lang === 'sq' ? 'Furë druri tradicionale' : 'Genuine wood-burning hearth'}</span>
                      </div>
                    </div>

                    {/* Core contact CTA buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('menu')}
                        className="w-full sm:flex-1 inline-flex items-center justify-center space-x-2 bg-pizza-red hover:bg-pizza-red-dark text-white py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm transition duration-200 shadow-md shadow-pizza-red/20 text-center cursor-pointer"
                      >
                        <ShoppingBag className="h-4.5 w-4.5 text-pizza-cream" />
                        <span>{t.heroButtonOrder}</span>
                      </button>

                      <a
                        href={`tel:${PIZZERIA_INFO.phoneRaw}`}
                        className="w-full sm:flex-1 inline-flex items-center justify-center space-x-2 bg-stone-100 hover:bg-stone-200 text-pizza-stone hover:text-pizza-stone-dark border border-stone-250 py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm transition duration-200 text-center"
                      >
                        <Phone className="h-4.5 w-4.5 text-pizza-red" />
                        <span>{PIZZERIA_INFO.phone}</span>
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Key Details list Info */}
                  <div className="lg:col-span-5 space-y-5">
                    {/* Timezone Status widget */}
                    <div className="bg-white rounded-3xl border border-stone-150 p-6 shadow-sm">
                      <h4 className="font-serif text-sm font-bold text-stone-600 uppercase tracking-widest mb-4">
                        {lang === 'sq' ? 'Detajet Kryesore' : 'Listing Info'}
                      </h4>
                      
                      <div className="space-y-4">
                        {/* Address element */}
                        <div className="flex items-center space-x-3.5 text-xs text-stone-600 pb-3 border-b border-stone-100">
                          <div className="bg-stone-50 p-2 rounded-xl text-pizza-red shrink-0 border border-stone-100">
                            <MapPin className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <span className="text-zinc-400 block text-[9px] font-mono uppercase">{t.addressLabel}</span>
                            <span className="font-semibold block">{PIZZERIA_INFO.address}</span>
                          </div>
                        </div>

                        {/* Phone element */}
                        <div className="flex items-center space-x-3.5 text-xs text-stone-600 pb-3 border-b border-stone-100">
                          <div className="bg-stone-50 p-2 rounded-xl text-pizza-gold shrink-0 border border-stone-100">
                            <Phone className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <span className="text-zinc-400 block text-[9px] font-mono uppercase">{t.phoneLabel}</span>
                            <a href={`tel:${PIZZERIA_INFO.phoneRaw}`} className="font-semibold block hover:text-pizza-red transition-colors">
                              {PIZZERIA_INFO.phone}
                            </a>
                          </div>
                        </div>

                        {/* Hours element */}
                        <div className="flex items-center space-x-3.5 text-xs text-stone-600">
                          <div className="bg-stone-50 p-2 rounded-xl text-emerald-500 shrink-0 border border-stone-100">
                            <Clock className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <span className="text-zinc-400 block text-[9px] font-mono uppercase">{t.hoursLabel}</span>
                            <span className="font-semibold block">{lang === 'sq' ? 'Hapur çdo ditë: 11:00 - 23:00' : 'Open daily: 11:00 AM - 11:00 PM'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick popular times Friday trigger */}
                    <PopularTimes lang={lang} />
                  </div>

                </div>

                {/* Popular pizza samples carousel section */}
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-pizza-red uppercase tracking-widest block mb-1">
                        {lang === 'sq' ? 'Favoritët e Klientëve' : 'Most Loved Crusts'}
                      </span>
                      <h3 className="font-serif text-2xl font-black text-pizza-stone tracking-tight">
                        {t.popularDishes}
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('menu')}
                      className="text-xs font-bold text-pizza-red hover:text-pizza-red-dark tracking-tight flex items-center gap-0.5 group"
                    >
                      <span>{lang === 'sq' ? 'Shfaq të gjitha' : 'View full menu'}</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {popularPizzaHighlights.map(pizza => (
                      <div 
                        key={pizza.id}
                        className="bg-white rounded-3xl border border-stone-150 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-3.5xl scale-95">{pizza.emoji}</span>
                            <span className="bg-amber-50 text-amber-800 border border-amber-100 text-[8px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                              <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-500" />
                              <span>{lang === 'sq' ? 'ME E SHITURA' : 'BESTSELLER'}</span>
                            </span>
                          </div>
                          <h4 className="font-serif text-base font-black text-pizza-stone tracking-tight mt-4 group-hover:text-pizza-red transition-colors">
                            {lang === 'sq' ? pizza.nameSq : pizza.nameEn}
                          </h4>
                          <p className="text-xs text-stone-500 mt-1.5 leading-relaxed line-clamp-2">
                            {lang === 'sq' ? pizza.descriptionSq : pizza.descriptionEn}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-stone-50 flex items-center justify-between">
                          <span className="text-sm font-mono font-black text-pizza-stone">
                            {pizza.price} ALL
                          </span>
                          <button
                            onClick={() => handleAddToCart(pizza, '30')}
                            className="bg-stone-50 hover:bg-pizza-red text-pizza-stone hover:text-white border border-stone-200 hover:border-transparent py-1 px-2.5 rounded-xl text-[10px] font-bold transition duration-200 cursor-pointer"
                          >
                            {lang === 'sq' ? 'Shto në Shportë 🛒' : 'Add to Cart 🛒'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Embedded Map Section */}
                <div className="bg-white rounded-3xl border border-stone-150 p-6 sm:p-8 shadow-sm space-y-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-pizza-red uppercase tracking-widest block mb-1">
                      {lang === 'sq' ? 'Ku ndodhemi' : 'Find Us Instantly'}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-black text-pizza-stone tracking-tight">
                      Rruga 3 Deshmoret, Kashar, Albania
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      {lang === 'sq' 
                        ? 'Afër rrugës kryesore të Kasharit me mundësi parkimi të mjaftueshme.' 
                        : 'Easily accessible from the main road of Kashar, with generous curbside parking available.'}
                    </p>
                  </div>

                  {/* Google maps responsive iframe */}
                  <div className="rounded-2xl overflow-hidden border border-stone-200 h-64 sm:h-80 shadow-inner relative">
                    <iframe
                      title="Pizzeria Rea location Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.8943715362545!2d19.7214732!3d41.3329124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135031b20dfefecb%3A0xe5aefdaaebe644b9!2sPizzeria%20Rea!5e0!3m2!1sen!2sal!4v1717590000000!5m2!1sen!2sal"
                      className="absolute inset-0 w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  {/* Map Quick trigger bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-2">
                    <span className="text-stone-550 font-mono">
                      Albania Location Code: <strong>8QFJ+F2 Kashar</strong>
                    </span>
                    <a
                      href={PIZZERIA_INFO.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-pizza-red hover:text-pizza-red-dark font-bold hover:underline"
                    >
                      <span>{lang === 'sq' ? 'Hap në Google Maps' : 'Open in Google Maps App'}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

              </div>
            )}

            {/* =======================================
                B. MENU TAB
               ======================================= */}
            {activeTab === 'menu' && (
              <div className="space-y-12">
                
                {/* Main categorized list */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-pizza-red uppercase tracking-widest block mb-1">
                        {lang === 'sq' ? 'Produktet e Freskëta të Furrës' : 'Authentic Hearth Selections'}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3.5xl font-black text-pizza-stone tracking-tight">
                        {lang === 'sq' ? 'Zgjidhni Shijen Tuaj' : 'Explore Full Table Menu'}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                        {lang === 'sq' 
                          ? 'Shtrydhni dëshirat tuaja me pica të shoqëruara me përbërësit ikonë të paratës dhe cilësisë.' 
                          : 'Filter and search through our slow-risen craft slices, handmade pocket calzones, local cold brews, and home dessert recipes.'}
                      </p>
                    </div>

                    {isOwnerMode && (
                      <button
                        onClick={handleAddNewItemClick}
                        className="self-start sm:self-auto inline-flex items-center space-x-1.5 bg-pizza-stone hover:bg-pizza-slate text-white text-xs font-bold py-3 px-5 rounded-2xl transition duration-200 cursor-pointer shadow-md"
                        id="add-new-product-btn"
                      >
                        <Plus className="h-4 w-4 text-pizza-gold" />
                        <span>{lang === 'sq' ? 'Shto Produkt të Ri' : 'Add New dish'}</span>
                      </button>
                    )}
                  </div>

                  <MenuSection 
                    lang={lang} 
                    menuItems={menuItems}
                    onAddToCart={handleAddToCart}
                    isOwnerMode={isOwnerMode}
                    onEditItem={handleEditItemClick}
                  />
                </div>

              </div>
            )}

            {/* =======================================
                C. REVIEWS TAB
               ======================================= */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono font-bold text-pizza-red uppercase tracking-widest block mb-1">
                    {lang === 'sq' ? 'Përvojat e Klientëve' : 'Diner Testimonials'}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3.5xl font-black text-pizza-stone tracking-tight">
                    {lang === 'sq' ? 'Mendimet e Vizitorëve Tanë' : t.reviewsSubtitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                    {lang === 'sq' 
                      ? 'Ndarja e përvojave reale të vizitorëve tanë në Kashar. Ne mirëpresim gjithmonë sugjerimet për rritjen e cilësisë.' 
                      : 'Honest reviews and guide ratings synced directly. Leave your personal review below to participate in our community!'}
                  </p>
                </div>

                <ReviewSection lang={lang} />
              </div>
            )}

            {/* =======================================
                D. ABOUT TAB
               ======================================= */}
            {activeTab === 'about' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left side: Detailed History */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-150 p-6 sm:p-8 shadow-sm space-y-6">
                  
                  <div className="flex items-center space-x-1.5 text-pizza-red text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="h-4.5 w-4.5" />
                    <span>{lang === 'sq' ? 'TRADITA JONË' : 'OUR HISTORY'}</span>
                  </div>

                  <h3 className="font-serif text-3xl font-black text-pizza-stone tracking-tight leading-none">
                    {t.aboutTitle}
                  </h3>

                  <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                    <p>{t.aboutText1}</p>
                    <p>{t.aboutText2}</p>
                    <p>{t.aboutText3}</p>
                    <p>
                      {lang === 'sq'
                        ? 'Çdo mëngjes fillon me përgatitjen e brumit tonë të veçantë. Ne përdorim vetëm miell italian të tipit "00" dhe një përqindje të lartë hidratimi. Kjo siguron që pas pjekjes në temperaturë shumë të lartë, pica të mbetet jashtëzakonisht e lehtë për t\'u tretur, e butë në qendër dhe krokante në anë.'
                        : 'Every single morning starts with kneading our hallmark dough recipe. Using only the premium Italian Tipo "00" flour dough and high hydration levels, we let the yeast work slow and cold. The result is a gourmet base that digests with supreme lightness and is deeply satisfying.'}
                    </p>
                  </div>

                  {/* Highlights statistics list */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-stone-100 text-center">
                    <div>
                      <span className="font-serif text-3xl font-black text-pizza-red block">4.9 ★</span>
                      <span className="text-[10px] text-stone-450 uppercase tracking-widest mt-1 block">Google Rating</span>
                    </div>
                    <div>
                      <span className="font-serif text-3xl font-black text-pizza-gold block">48 {lang === 'sq' ? 'Orë' : 'Hrs'}</span>
                      <span className="text-[10px] text-stone-450 uppercase tracking-widest mt-1 block">{lang === 'sq' ? 'Brumbë i Thartë' : 'Slow Rise Ferment'}</span>
                    </div>
                    <div>
                      <span className="font-serif text-3xl font-black text-pizza-stone block">450°C</span>
                      <span className="text-[10px] text-stone-450 uppercase tracking-widest mt-1 block">{lang === 'sq' ? 'Furrë Dru Lajthie' : 'Wood oven heat'}</span>
                    </div>
                    <div>
                      <span className="font-serif text-3xl font-black text-[#8B1E1E] block">100%</span>
                      <span className="text-[10px] text-stone-450 uppercase tracking-widest mt-1 block">{lang === 'sq' ? 'Pasion real' : 'Hospitality'}</span>
                    </div>
                  </div>

                </div>

                {/* Right side: Fast facts / Contact specs */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Specific information cards */}
                  <div className="bg-white rounded-3xl border border-stone-150 p-6 shadow-sm space-y-4">
                    <h4 className="font-serif text-sm font-bold text-stone-600 uppercase tracking-widest">
                      {lang === 'sq' ? 'Orare & Vendndodhje' : 'Store Specifics'}
                    </h4>

                    <div className="space-y-3.5 text-xs">
                      
                      {/* Operational hours list */}
                      <div className="pb-3.5 border-b border-stone-100">
                        <span className="text-zinc-550 font-semibold block mb-1">{t.hoursLabel}:</span>
                        <div className="flex justify-between text-stone-600 font-mono text-[11px]">
                          <span>{lang === 'sq' ? 'E hënë' : 'Monday'}</span>
                          <span>11:00 AM - 11:00 PM</span>
                        </div>
                        <div className="flex justify-between text-stone-600 font-mono text-[11px] mt-1">
                          <span>{lang === 'sq' ? 'E martë' : 'Tuesday'}</span>
                          <span>11:00 AM - 11:00 PM</span>
                        </div>
                        <div className="flex justify-between text-stone-600 font-mono text-[11px] mt-1">
                          <span>{lang === 'sq' ? 'E mërkurë' : 'Wednesday'}</span>
                          <span>11:00 AM - 11:00 PM</span>
                        </div>
                        <div className="flex justify-between text-stone-600 font-mono text-[11px] mt-1">
                          <span>{lang === 'sq' ? 'E enjte' : 'Thursday'}</span>
                          <span>11:00 AM - 11:00 PM</span>
                        </div>
                        <div className="flex justify-between text-stone-600 font-mono text-[11px] mt-1">
                          <span>{lang === 'sq' ? 'E premte' : 'Friday'}</span>
                          <span className="text-pizza-red font-semibold">11:00 AM - 11:00 PM</span>
                        </div>
                        <div className="flex justify-between text-stone-600 font-mono text-[11px] mt-1">
                          <span>{lang === 'sq' ? 'E shtunë' : 'Saturday'}</span>
                          <span>11:00 AM - 11:00 PM</span>
                        </div>
                        <div className="flex justify-between text-stone-600 font-mono text-[11px] mt-1">
                          <span>{lang === 'sq' ? 'E diel' : 'Sunday'}</span>
                          <span>11:00 AM - 11:00 PM</span>
                        </div>
                      </div>

                      {/* Direct contact shortcuts cards */}
                      <div className="space-y-2">
                        <span className="text-zinc-550 font-semibold block">{lang === 'sq' ? 'Lidhje direkt:' : 'Direct linkages:'}</span>
                        <a
                          href={`tel:${PIZZERIA_INFO.phoneRaw}`}
                          className="w-full inline-flex items-center space-x-2 bg-stone-50 border border-stone-200 p-2.5 rounded-xl text-stone-600 hover:text-pizza-red hover:border-pizza-red transition text-xs"
                        >
                          <Phone className="h-4 w-4 text-pizza-gold shrink-0" />
                          <span className="font-semibold">{PIZZERIA_INFO.phone}</span>
                        </a>
                      </div>

                    </div>
                  </div>

                  {/* Trust Badge layout details */}
                  <div className="bg-gradient-to-br from-pizza-stone to-zinc-900 rounded-3xl p-6 text-white border border-stone-850 shadow space-y-4">
                    <div className="bg-pizza-red p-2.5 rounded-full border border-pizza-gold/40 w-fit">
                      <ChefHat className="h-5 w-5 text-white" />
                    </div>
                    <h5 className="font-serif text-lg font-bold text-pizza-cream leading-tight">
                      {lang === 'sq' ? 'Përpjekja për Përsosmëri' : 'The Commitment to Hospitality'}
                    </h5>
                    <p className="text-xs text-stone-400 leading-relaxed font-sans">
                      {lang === 'sq'
                        ? 'Nuk ka asgjë më të shenjtë se sa të ulesh me njerëzit e dashur rreth një pice të nxehtë dhe të shijshme. Na vizitoni për të shijuar një mikpritje autentike Shqiptare me shije të vërtetë Italiane!'
                        : 'There is nothing more sacred than sharing stories with beloved ones over a glowing culinary oven-fresh slice. Come taste the marriage of Albanian hospitality and precise Italian craft techniques!'}
                    </p>
                  </div>

                </div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Shopping Cart Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center justify-center bg-pizza-red hover:bg-pizza-red-dark text-white p-4 sm:p-5 rounded-2xl shadow-xl shadow-pizza-red/45 transition hover:scale-105 active:scale-95 duration-200 cursor-pointer animate-bounce-slow"
          id="floating-cart-btn"
        >
          <div className="relative">
            <ShoppingBag className="h-6 w-6 text-white" />
            {cart.length > 0 && (
              <span className="absolute -top-2.5 -right-2.5 bg-pizza-stone text-pizza-gold text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-white">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Cart Drawer Panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        lang={lang}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClear={handleClearCart}
      />

      {/* Owner Product Editing Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        lang={lang}
        editingItem={editingItem}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />

      {/* 4. Owner Admin Login Modal (Triggered quietly from the footer underbar) */}
      <AnimatePresence>
        {isAdminLoginOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAdminLoginOpen(false);
                setPasscode('');
                setPasscodeError(false);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md bg-white rounded-3xl border border-stone-150 p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => {
                  setIsAdminLoginOpen(false);
                  setPasscode('');
                  setPasscodeError(false);
                }}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition duration-155 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <form onSubmit={handleUnlockAdmin} className="space-y-4">
                <div className="flex items-center space-x-2.5 bg-pizza-stone/5 p-3.5 rounded-2xl border border-stone-100">
                  <div className="bg-pizza-stone text-pizza-gold p-2 rounded-xl">
                    <ChefHat className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-extrabold text-pizza-stone">
                      {lang === 'sq' ? 'Paneli i Pronarit' : 'Owner Admin Counter'}
                    </h4>
                    <p className="text-[10px] text-stone-400 font-mono tracking-wide leading-none mt-0.5">
                      PIZZERIA REA • SECURE DESK
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    {lang === 'sq' ? 'Kodi i Kalimit' : 'Security Passcode'}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passcode}
                    autoFocus
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setPasscodeError(false);
                    }}
                    className={`w-full bg-stone-50 text-xs px-4 py-3 rounded-xl focus:outline-none focus:ring-1 border ${
                      passcodeError
                        ? 'border-pizza-red focus:ring-pizza-red focus:border-pizza-red text-pizza-red'
                        : 'border-stone-200 focus:ring-pizza-stone focus:border-pizza-stone text-pizza-stone'
                    }`}
                  />
                  {passcodeError && (
                    <p className="text-[10px] text-pizza-red font-medium mt-1">
                      {lang === 'sq' ? 'Kod i pasaktë! Provoni përsëri.' : 'Incorrect passcode! Please try again.'}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-pizza-stone hover:bg-pizza-red hover:text-white text-pizza-gold text-xs font-bold py-3 px-4 rounded-xl transition duration-200 cursor-pointer text-center"
                >
                  {lang === 'sq' ? 'Hyni në Panel 🔓' : 'Verify Passcode 🔓'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Clean, Professional Website Footer */}
      <Footer 
        lang={lang} 
        isOwnerMode={isOwnerMode} 
        onAdminClick={() => setIsAdminLoginOpen(true)} 
        onLogout={handleLockAdmin} 
      />

    </div>
  );
}
