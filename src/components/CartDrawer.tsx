import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Phone, Copy, Check, ShoppingBag, Plus, Minus } from 'lucide-react';
import { Language, CartItem, PIZZERIA_INFO } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClear: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  lang,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClear,
}: CartDrawerProps) {
  const [copied, setCopied] = useState(false);

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  // Phone Call Order Script
  const generatedOrderScript = useMemo(() => {
    if (cart.length === 0) return '';
    const lines = cart.map(item => {
      const quantityStr = `${item.quantity}x`;
      const toppings = item.selectedToppings && item.selectedToppings.length > 0 
        ? ` (+ ${item.selectedToppings.map(t => lang === 'sq' ? t.nameSq : t.nameEn).join(', ')})`
        : '';
      const crust = item.crustType && item.crustType !== 'classic'
        ? ` [${lang === 'sq' ? 'Brum' : 'Crust'}: ${item.crustType === 'thick' ? (lang === 'sq' ? 'Napoletan' : 'Thick') : (lang === 'sq' ? 'Pa Gluten' : 'Gluten-Free')}]`
        : '';
      const itemName = lang === 'sq' ? item.nameSq : item.nameEn;
      return `${quantityStr} ${itemName}${crust}${toppings}`;
    });
    return lang === 'sq'
      ? `Përshëndetje! Dua të porosis:\n${lines.join('\n')}\nTotali: ${cartTotal} ALL.`
      : `Hello! I want to order:\n${lines.join('\n')}\nTotal: ${cartTotal} ALL.`;
  }, [cart, cartTotal, lang]);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generatedOrderScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 pointer-events-auto"
            id="cart-backdrop"
          />

          {/* Drawer main panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-51 flex flex-col justify-between border-l border-stone-200"
            id="cart-panel"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-stone-150 flex items-center justify-between bg-stone-50">
              <div className="flex items-center space-x-2.5">
                <div className="bg-pizza-red/10 p-2 rounded-xl">
                  <ShoppingBag className="h-5 w-5 text-pizza-red" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-black text-pizza-stone leading-tight">
                    {lang === 'sq' ? 'Shporta Juaj' : 'Your Order Cart'}
                  </h3>
                  <p className="text-[10px] text-stone-400 font-mono tracking-wider">
                    PIZZERIA REA • KASHAR
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {cart.length > 0 && (
                  <button
                    onClick={onClear}
                    title={lang === 'sq' ? 'Pastro Shportën' : 'Clear All'}
                    className="p-2 text-stone-400 hover:text-pizza-red transition cursor-pointer"
                    id="clear-cart-btn"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-stone-500 hover:text-pizza-stone bg-white border border-stone-200 rounded-xl transition cursor-pointer shadow-sm"
                  id="close-cart-btn"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Cart items list / Scrollroom */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length > 0 ? (
                cart.map(item => {
                  const itemPriceTotal = item.price * item.quantity;
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-stone-150 rounded-2xl p-4 flex items-start gap-3 shadow-xs space-y-0 text-left"
                      id={`cart-item-${item.id}`}
                    >
                      <span className="text-2.5xl filter drop-shadow bg-stone-50 p-2 rounded-xl shrink-0">
                        {item.emoji}
                      </span>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans text-xs sm:text-sm font-bold text-pizza-stone truncate leading-tight">
                          {lang === 'sq' ? item.nameSq : item.nameEn}
                        </h4>
                        
                        {/* Selected Crust and Extras subtitles */}
                        {item.selectedToppings && item.selectedToppings.length > 0 && (
                          <div className="text-[10px] text-amber-800 bg-amber-50 rounded px-1.5 py-0.5 mt-1 font-sans inline-block">
                            ＋ {item.selectedToppings.map(t => lang === 'sq' ? t.nameSq : t.nameEn).join(', ')}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3 font-mono">
                          {/* Price Display */}
                          <span className="text-xs font-bold text-pizza-red-light">
                            {itemPriceTotal} ALL <span className="text-[10px] text-stone-400 font-normal">({item.price} x {item.quantity})</span>
                          </span>

                          {/* Quality Modifiers block */}
                          <div className="flex items-center space-x-1.5 bg-stone-100 p-1 rounded-lg border border-stone-200">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="p-1 hover:bg-white rounded transition text-stone-500 hover:text-pizza-stone cursor-pointer"
                              id={`minus-${item.id}`}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold px-1.5 select-none">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="p-1 hover:bg-white rounded transition text-stone-500 hover:text-pizza-stone cursor-pointer"
                              id={`plus-${item.id}`}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-300 hover:text-pizza-red p-1 cursor-pointer shrink-0 transition"
                        title={lang === 'sq' ? 'Largoni këtë produkt' : 'Remove item'}
                        id={`delete-${item.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })
              ) : (
                /* Empty state room */
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <span className="text-4xl filter drop-shadow">🍕</span>
                  <h4 className="font-serif text-base font-bold text-pizza-stone">
                    {lang === 'sq' ? 'Shporta juaj është bosh' : 'Your Order is Empty'}
                  </h4>
                  <p className="text-xs text-stone-400 max-w-xs">
                    {lang === 'sq'
                      ? 'Nisni duke shtuar pica tuaja të preferuara ose pije të ftohta ikonë direkt nga menuja.'
                      : 'Browse our slow-fermented crust selection and refreshers to start assembling your custom order.'}
                  </p>
                </div>
              )}
            </div>

            {/* Sticky Order Action Block */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-4 shadow-inner">
                {/* Script Display and Help desk context */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider font-sans">
                      {lang === 'sq' ? 'Lista e Porosisë' : 'Order Call Script'}
                    </span>
                    <button
                      onClick={handleCopyScript}
                      className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-700 hover:text-amber-900 cursor-pointer transition"
                      id="copy-script-btn"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-700">{lang === 'sq' ? 'Kopjuar!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>{lang === 'sq' ? 'Kopjo' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-stone-700 italic font-medium font-sans text-xs border-l-2 border-amber-200 pl-2 whitespace-pre-line leading-relaxed">
                    {generatedOrderScript}
                  </pre>
                </div>

                {/* Subtotals info */}
                <div className="flex items-center justify-between text-pizza-stone font-sans py-1">
                  <span className="text-xs font-semibold">
                    {lang === 'sq' ? 'Nëntotali përfundimtar:' : 'Total due value:'}
                  </span>
                  <span className="text-xl font-mono font-black text-pizza-stone">
                    {cartTotal} ALL
                  </span>
                </div>

                {/* Call-to-actions row */}
                <a
                  href={`tel:${PIZZERIA_INFO.phoneRaw}`}
                  className="w-full inline-flex items-center justify-center space-x-2.5 bg-pizza-red hover:bg-pizza-red-dark text-white rounded-2xl py-3.5 px-4 font-bold shadow-md shadow-pizza-red/30 hover:scale-101 transition duration-200 cursor-pointer text-center text-sm"
                  id="checkout-call-btn"
                >
                  <Phone className="h-4.5 w-4.5 animate-pulse" />
                  <span>
                    {lang === 'sq' ? 'Porosit Tani (Telefono)' : 'Place Order via Phone'}
                  </span>
                </a>

                <p className="text-[10px] text-center text-stone-400 font-sans leading-none">
                  {lang === 'sq'
                    ? 'Duke shtypur butonin, pajisja juaj do të hapë thirrjen automatike.'
                    : 'Pressing call will instantly prompt your phone to dial Pizzeria rea.'}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
