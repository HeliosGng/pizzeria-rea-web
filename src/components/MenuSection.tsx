import { useState, useMemo } from 'react';
import { Search, Flame, Leaf, Sparkles, Plus } from 'lucide-react';
import { Language, MenuItem, TRANSLATIONS } from '../data';

interface MenuSectionProps {
  lang: Language;
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, size?: '30' | '40') => void;
  isOwnerMode: boolean;
  onEditItem: (item: MenuItem) => void;
}

export default function MenuSection({ 
  lang, 
  menuItems, 
  onAddToCart, 
  isOwnerMode, 
  onEditItem 
}: MenuSectionProps) {
  const t = TRANSLATIONS[lang];

  // State
  type CategoryType = 'all' | 'pizza_klasike' | 'pizza_speciale' | 'calzone' | 'piadina' | 'sandwich' | 'drinks';
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterSpicy, setFilterSpicy] = useState(false);

  // Card specific size states: maps item.id to '30' or '40'
  const [selectedSizes, setSelectedSizes] = useState<Record<string, '30' | '40'>>({});

  // Categories config
  const categories = [
    { id: 'all', label: t.allDishes },
    { id: 'pizza_klasike', label: t.categoryPizzaKlasike || 'Pica Klasike' },
    { id: 'pizza_speciale', label: t.categoryPizzaSpeciale || 'Pica Speciale' },
    { id: 'calzone', label: t.categoryCalzone },
    { id: 'piadina', label: t.categoryPiadina || 'Piadina' },
    { id: 'sandwich', label: t.categorySandwich || 'Sandwich' },
    { id: 'drinks', label: t.categoryDrinks },
  ];

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      // Category check
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Search query check
      const query = searchQuery.toLowerCase();
      const name = (lang === 'sq' ? item.nameSq : item.nameEn).toLowerCase();
      const desc = (lang === 'sq' ? item.descriptionSq : item.descriptionEn).toLowerCase();
      if (query && !name.includes(query) && !desc.includes(query)) {
        return false;
      }

      // Vegetarian filter
      if (filterVeg && !item.vegetarian) {
        return false;
      }

      // Spicy filter
      if (filterSpicy && !item.spicy) {
        return false;
      }

      return true;
    });
  }, [activeCategory, searchQuery, filterVeg, filterSpicy, lang, menuItems]);

  return (
    <div className="space-y-6">
      
      {/* Category Tabs & Filter toolbar block */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-stone-150 shadow-sm">
        
        {/* Horizontal Category selectors */}
        <div className="flex overflow-x-auto pb-1 md:pb-0 scrollbar-none gap-1.5 snap-x">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap snap-center shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-pizza-red text-pizza-cream shadow'
                  : 'text-stone-500 hover:text-pizza-stone hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Live Search & Badges Box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Search box input */}
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder={lang === 'sq' ? 'Kërko picë, pije...' : 'Search items...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 text-xs text-pizza-stone border border-stone-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-pizza-red focus:border-pizza-red"
            />
          </div>

          {/* Quick toggle filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterVeg(!filterVeg)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center space-x-1 transition cursor-pointer ${
                filterVeg
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-850'
                  : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
              }`}
            >
              <Leaf className={`h-3.5 w-3.5 ${filterVeg ? 'text-emerald-600 fill-emerald-100' : 'text-stone-400'}`} />
              <span>Veg.</span>
            </button>

            <button
              onClick={() => setFilterSpicy(!filterSpicy)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center space-x-1 transition cursor-pointer ${
                filterSpicy
                  ? 'border-pizza-red bg-pizza-red/5 text-pizza-red'
                  : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
              }`}
            >
              <Flame className={`h-3.5 w-3.5 ${filterSpicy ? 'text-pizza-red fill-pizza-red/10' : 'text-stone-400'}`} />
              <span>{lang === 'sq' ? 'Pikante' : 'Spicy'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Grid listing */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const size = selectedSizes[item.id] || '30';
            const price = size === '40' && item.price40 ? item.price40 : item.price;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-150 overflow-hidden shadow-sm hover:shadow-md hover:border-stone-220 transition-all duration-300 flex flex-col justify-between group"
              >
                
                {/* Card visual decorative item header */}
                <div className="p-5 sm:p-6 pb-2">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl filter drop-shadow bg-stone-50 p-2.5 rounded-2xl border border-stone-100 group-hover:scale-110 transition duration-300 inline-block">
                      {item.emoji}
                    </span>
                    
                    {/* Category Status pill labels */}
                    <div className="flex flex-col items-end space-y-1">
                      {item.popular && (
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-extrabold px-2 py-0.5 rounded-full font-serif flex items-center gap-0.5">
                          <Sparkles className="h-2.5 w-2.5 fill-amber-300 text-amber-500" />
                          <span>POPULLORE</span>
                        </span>
                      )}
                      {item.vegetarian && (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-150 text-[9px] font-extrabold px-2 py-0.5 rounded-full font-sans">
                          VEGJETARIANE
                        </span>
                      )}
                      {item.spicy && (
                        <span className="bg-rose-50 text-rose-800 border border-rose-150 text-[9px] font-extrabold px-2 py-0.5 rounded-full font-sans">
                          {lang === 'sq' ? 'PIKANTE 🔥' : 'SPICY 🔥'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content text metadata */}
                  <h4 className="font-serif text-lg font-black text-pizza-stone tracking-tight mt-4 group-hover:text-pizza-red transition-colors">
                    {lang === 'sq' ? item.nameSq : item.nameEn}
                  </h4>
                  
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed min-h-[46px] line-clamp-3">
                    {lang === 'sq' ? item.descriptionSq : item.descriptionEn}
                  </p>
                </div>

                {/* Bottom drawer price and binder action */}
                <div className="px-5 sm:px-6 py-4 border-t border-stone-50 bg-stone-50/50 flex flex-col gap-3 mt-4">
                  
                  {/* Size Selector for Pizzas with two prices */}
                  {item.price40 && (
                    <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                      <span className="text-[10px] text-stone-400 font-mono uppercase">
                        {lang === 'sq' ? 'Madhësia' : 'Size'}:
                      </span>
                      <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-150">
                        <button
                          type="button"
                          onClick={() => setSelectedSizes(prev => ({ ...prev, [item.id]: '30' }))}
                          className={`px-3 py-1 rounded-md text-[10px] font-bold transition cursor-pointer select-none ${
                            size === '30'
                              ? 'bg-white text-pizza-stone shadow-sm border border-stone-200'
                              : 'text-stone-500 hover:text-pizza-stone'
                          }`}
                        >
                          30 cm
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedSizes(prev => ({ ...prev, [item.id]: '40' }))}
                          className={`px-3 py-1 rounded-md text-[10px] font-bold transition cursor-pointer select-none ${
                            size === '40'
                              ? 'bg-white text-pizza-stone shadow-sm border border-stone-200'
                              : 'text-stone-500 hover:text-pizza-stone'
                          }`}
                        >
                          40 cm
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 font-mono block uppercase">
                        {lang === 'sq' ? 'Çmimi' : 'Price'}
                        {item.price40 ? ` (${size} cm)` : ''}
                      </span>
                      <span className="text-lg font-mono font-black text-pizza-stone col-start-1">
                        {price} ALL
                      </span>
                    </div>

                    {/* Add to Cart button */}
                    <button
                      onClick={() => onAddToCart(item, item.price40 ? size : undefined)}
                      className="inline-flex items-center space-x-1 bg-pizza-red hover:bg-pizza-red-dark text-white text-xs font-bold py-2.5 px-4 rounded-xl transition duration-200 cursor-pointer shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{lang === 'sq' ? 'Shto në Shportë' : 'Add to Cart'}</span>
                    </button>
                  </div>

                  {/* Edit button for Owner Mode */}
                  {isOwnerMode && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => onEditItem(item)}
                        className="font-extrabold text-pizza-gold hover:text-amber-600 flex items-center gap-1 bg-pizza-stone px-2.5 py-1 rounded-lg transition duration-150 cursor-pointer text-[11px]"
                      >
                        ✏️ {lang === 'sq' ? 'Ndrysho' : 'Edit'}
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty search/filters state */
        <div className="bg-white rounded-3xl border border-stone-150 p-12 text-center max-w-md mx-auto">
          <p className="text-3xl">😞</p>
          <h5 className="font-serif text-lg font-bold text-pizza-stone mt-4">
            {lang === 'sq' ? 'Nuk u gjet asnjë produkt' : 'No items matched your query'}
          </h5>
          <p className="text-xs text-stone-500 mt-2">
            {lang === 'sq' 
              ? 'Provoni të hiqni ndonjë filtër ose kontrolloni drejtshkrimin e kërkimit tuaj.' 
              : 'Try resetting the dietary filters or search for another delicious alternative!'}
          </p>
        </div>
      )}

    </div>
  );
}
