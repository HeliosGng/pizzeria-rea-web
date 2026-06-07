import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Trash2, HelpCircle } from 'lucide-react';
import { Language, MenuItem } from '../data';

interface EditProductModalProps {
  isOpen: boolean;
  lang: Language;
  editingItem: MenuItem | null; // Null means adding new item
  onClose: () => void;
  onSave: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

export default function EditProductModal({
  isOpen,
  lang,
  editingItem,
  onClose,
  onSave,
  onDelete,
}: EditProductModalProps) {
  // Local state for each form field
  const [nameSq, setNameSq] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descSq, setDescSq] = useState('');
  const [descEn, setDescEn] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [price40, setPrice40] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<'pizza_klasike' | 'pizza_speciale' | 'calzone' | 'piadina' | 'sandwich' | 'drinks'>('pizza_klasike');
  const [popular, setPopular] = useState(false);
  const [vegetarian, setVegetarian] = useState(false);
  const [spicy, setSpicy] = useState(false);
  const [emoji, setEmoji] = useState('🍕');

  // Load editing product state. If adding, load defaults
  useEffect(() => {
    if (editingItem) {
      setNameSq(editingItem.nameSq);
      setNameEn(editingItem.nameEn);
      setDescSq(editingItem.descriptionSq || '');
      setDescEn(editingItem.descriptionEn || '');
      setPrice(editingItem.price);
      setPrice40(editingItem.price40);
      setCategory(editingItem.category);
      setPopular(!!editingItem.popular);
      setVegetarian(!!editingItem.vegetarian);
      setSpicy(!!editingItem.spicy);
      setEmoji(editingItem.emoji || '🍕');
    } else {
      setNameSq('');
      setNameEn('');
      setDescSq('');
      setDescEn('');
      setPrice(0);
      setPrice40(undefined);
      setCategory('pizza_klasike');
      setPopular(false);
      setVegetarian(false);
      setSpicy(false);
      setEmoji('🍕');
    }
  }, [editingItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameSq || !nameEn || price <= 0) {
      alert(lang === 'sq' ? 'Ju lutemi plotësoni emrat dhe çmimin!' : 'Please complete names and valid pricing!');
      return;
    }

    const payload: MenuItem = {
      id: editingItem?.id || `product-${Date.now()}`,
      nameSq,
      nameEn,
      descriptionSq: descSq,
      descriptionEn: descEn,
      price: Number(price),
      price40: (category === 'pizza_klasike' || category === 'pizza_speciale') && price40 ? Number(price40) : undefined,
      category,
      popular,
      vegetarian,
      spicy,
      emoji,
    };

    onSave(payload);
  };

  const handleCategoryChange = (cat: typeof category) => {
    setCategory(cat);
    // Set matching default emoji if standard category to ease creation
    if (!editingItem) {
      if (cat === 'drinks') setEmoji('🥤');
      else if (cat === 'desserts') setEmoji('🍰');
      else if (cat === 'calzone') setEmoji('🥟');
      else if (cat === 'piadina') setEmoji('🌮');
      else if (cat === 'sandwich') setEmoji('🥪');
      else setEmoji('🍕');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 overflow-hidden pointer-events-auto"
            id="modal-backdrop"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-51 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-stone-200 shadow-2xl flex flex-col justify-between"
              id="edit-modal-panel"
            >
              {/* Modal Custom Header */}
              <div className="p-5 border-b border-stone-150 bg-stone-50 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-black text-pizza-stone leading-tight">
                    {editingItem 
                      ? (lang === 'sq' ? 'Modifiko Produktin' : 'Edit Menu Dish')
                      : (lang === 'sq' ? 'Shto Produkt të Ri' : 'Add New Menu Item')}
                  </h3>
                  <p className="text-[10px] text-stone-400 font-mono tracking-wider">
                    {lang === 'sq' ? 'PANELI I ADMINISTRATORIT' : 'COCKPIT MANAGEMENT'}
                  </p>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-1.5 text-stone-400 hover:text-pizza-stone bg-white border border-stone-200 rounded-xl transition cursor-pointer shadow-sm"
                  id="modal-close-btn"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Input fields */}
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  {/* Emoji selection box */}
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                      Emoji 💡
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={emoji}
                      onChange={(e) => setEmoji(e.target.value)}
                      className="w-full text-center text-2xl bg-stone-50 border border-stone-200 py-2.5 rounded-xl font-mono focus:ring-1 focus:ring-pizza-red focus:outline-none"
                    />
                  </div>

                  {/* Price input box */}
                  <div className={(category === 'pizza_klasike' || category === 'pizza_speciale') ? 'sm:col-span-4' : 'sm:col-span-9'}>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                      {(category === 'pizza_klasike' || category === 'pizza_speciale') ? (lang === 'sq' ? 'Çmimi 30cm' : 'Price 30cm') : (lang === 'sq' ? 'Çmimi (ALL)' : 'Price (ALL)')}
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={price || ''}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="e.g. 750"
                      className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl font-mono text-sm text-pizza-stone font-bold focus:ring-1 focus:ring-pizza-red focus:outline-none"
                    />
                  </div>

                  {/* Price 40cm input box */}
                  {(category === 'pizza_klasike' || category === 'pizza_speciale') && (
                    <div className="sm:col-span-5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                        {lang === 'sq' ? 'Çmimi 40cm (Opsional)' : 'Price 40cm (Optional)'}
                      </label>
                      <input
                        type="number"
                        min={10}
                        value={price40 || ''}
                        onChange={(e) => setPrice40(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="e.g. 1000"
                        className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl font-mono text-sm text-pizza-stone font-bold focus:ring-1 focus:ring-pizza-red focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Name Albanian */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    {lang === 'sq' ? 'Emri (Shqip)' : 'Name (Albanian Sq)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameSq}
                    onChange={(e) => setNameSq(e.target.value)}
                    placeholder={lang === 'sq' ? 'Pica Kapriçoza' : 'Albanian name labels'}
                    className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-xs sm:text-sm text-pizza-stone font-medium focus:ring-1 focus:ring-pizza-red focus:outline-none"
                  />
                </div>

                {/* Name English */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    {lang === 'sq' ? 'Emri (Anglisht)' : 'Name (English En)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Capricciosa Pizza"
                    className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-xs sm:text-sm text-pizza-stone font-medium focus:ring-1 focus:ring-pizza-red focus:outline-none"
                  />
                </div>

                {/* Category choice list dropdown */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    {lang === 'sq' ? 'Kategoria' : 'Dish Category'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(['pizza_klasike', 'pizza_speciale', 'calzone', 'piadina', 'sandwich', 'drinks'] as const).map((cat) => {
                      const labelSq = cat === 'pizza_klasike' ? 'Pica Klasike' : cat === 'pizza_speciale' ? 'Pica Speciale' : cat;
                      const labelEn = cat === 'pizza_klasike' ? 'Classic Pizza' : cat === 'pizza_speciale' ? 'Special Pizza' : cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryChange(cat)}
                          className={`py-2 px-2.5 rounded-xl text-[10px] font-bold text-center border capitalize transition cursor-pointer ${
                            category === cat
                              ? 'border-pizza-stone bg-pizza-stone text-pizza-gold font-black'
                              : 'border-stone-200 bg-white hover:border-stone-300 text-stone-550'
                          }`}
                        >
                          {lang === 'sq' ? labelSq : labelEn}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description Albanian */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    {lang === 'sq' ? 'Përshkrimi (Shqip)' : 'Description (Albanian Sq)'}
                  </label>
                  <textarea
                    rows={2}
                    value={descSq}
                    onChange={(e) => setDescSq(e.target.value)}
                    placeholder={lang === 'sq' ? 'Përbërësit e picës...' : 'Ingredients breakdown...'}
                    className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs sm:text-sm text-pizza-stone focus:ring-1 focus:ring-pizza-red focus:outline-none"
                  />
                </div>

                {/* Description English */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    {lang === 'sq' ? 'Përshkrimi (Anglisht)' : 'Description (English En)'}
                  </label>
                  <textarea
                    rows={2}
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    placeholder="e.g. Tomato sauce, mozzarella, mushrooms..."
                    className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs sm:text-sm text-pizza-stone focus:ring-1 focus:ring-pizza-red focus:outline-none"
                  />
                </div>

                {/* Toggle flags switches */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-150 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Popular check */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={popular}
                      onChange={(e) => setPopular(e.target.checked)}
                      className="rounded border-stone-300 text-pizza-red focus:ring-pizza-red h-4 w-4"
                    />
                    <span className="text-xs font-semibold text-stone-600">⭐ {lang === 'sq' ? 'Popullore' : 'Popular'}</span>
                  </label>

                  {/* Vegetarian check */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vegetarian}
                      onChange={(e) => setVegetarian(e.target.checked)}
                      className="rounded border-stone-300 text-pizza-red focus:ring-pizza-red h-4 w-4"
                    />
                    <span className="text-xs font-semibold text-stone-600">🥬 Veggie</span>
                  </label>

                  {/* Spicy check */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={spicy}
                      onChange={(e) => setSpicy(e.target.checked)}
                      className="rounded border-stone-300 text-pizza-red focus:ring-pizza-red h-4 w-4"
                    />
                    <span className="text-xs font-semibold text-stone-600">🔥 Spicy</span>
                  </label>
                </div>

                {/* Footer validation action buttons block */}
                <div className="pt-3 border-t border-stone-150 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {editingItem ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(lang === 'sq' ? 'Dëshironi ta fshini këtë produkt?' : 'Are you sure you want to delete this menu item?')) {
                          onDelete(editingItem.id);
                        }
                      }}
                      className="inline-flex items-center justify-center space-x-1 border border-pizza-red bg-rose-50 text-pizza-red hover:bg-pizza-red hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                      id="modal-delete-btn"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{lang === 'sq' ? 'Fshi Produktin' : 'Delete Product'}</span>
                    </button>
                  ) : (
                    <div className="hidden sm:block" />
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="bg-white border border-stone-200 text-stone-500 hover:text-stone-705 text-xs font-bold py-2.5 px-4 rounded-xl transition cursor-pointer"
                      id="modal-cancel-btn"
                    >
                      {lang === 'sq' ? 'Anulo' : 'Cancel'}
                    </button>
                    
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center space-x-1 bg-pizza-stone hover:bg-pizza-slate text-white text-xs font-bold py-2.5 px-4 rounded-xl transition cursor-pointer"
                      id="modal-save-btn"
                    >
                      <Save className="h-4 w-4 text-pizza-gold" />
                      <span>{lang === 'sq' ? 'Ruaj ndryshimet' : 'Save Dish'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
