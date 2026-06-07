import { MapPin, Phone, ChefHat, ExternalLink, ShieldAlert } from 'lucide-react';
import { Language, PIZZERIA_INFO, TRANSLATIONS } from '../data';

interface FooterProps {
  lang: Language;
  isOwnerMode?: boolean;
  onAdminClick?: () => void;
  onLogout?: () => void;
}

export default function Footer({ lang, isOwnerMode, onAdminClick, onLogout }: FooterProps) {
  const t = TRANSLATIONS[lang];

  return (
    <footer className="bg-pizza-charcoal text-white border-t border-stone-850 mt-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left column: Brand statement */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="bg-pizza-red p-2 rounded-full border border-pizza-gold/40">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-pizza-cream">
              Pizzeria <span className="text-pizza-red-light font-bold">rea</span>
            </span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
            {lang === 'sq' 
              ? 'Shija e pjekur në furrë druri që prej momentit të parë. Shërbimi ynë miqësor dhe cilësia e padiskutueshme në Kashar, Shqipëri.'
              : 'Traditional wood-fired ovens, aromatic dough, and authentic hospitality in Kashar, Albania since day one.'}
          </p>
          <div className="flex items-center text-[10px] text-stone-500 font-mono">
            <span>Rating 4.9 ★ 16 Reviews on Google Maps</span>
          </div>
        </div>

        {/* Middle column: Quick Links to sections or direct delivery options */}
        <div className="md:col-span-4 space-y-4">
          <h5 className="font-serif text-sm font-semibold text-pizza-cream uppercase tracking-wider">
            {t.quickLinks}
          </h5>
          <ul className="space-y-2 text-xs text-stone-450 font-sans">
            <li>
              <a 
                href={`tel:${PIZZERIA_INFO.phoneRaw}`} 
                className="hover:text-pizza-gold transition flex items-center gap-1.5"
              >
                <span>{lang === 'sq' ? 'Porosit me Telefon 📞' : 'Direct Call to Order 📞'}</span>
              </a>
            </li>
            <li>
              <a 
                href={PIZZERIA_INFO.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-pizza-gold transition flex items-center gap-1.5"
              >
                <span>Drejtuesit në Google Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a 
                href={`tel:${PIZZERIA_INFO.phoneRaw}`} 
                className="hover:text-pizza-gold transition flex items-center gap-1.5"
              >
                <span>Telefono {PIZZERIA_INFO.phone}</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Right column: Contact specifics */}
        <div className="md:col-span-4 space-y-4">
          <h5 className="font-serif text-sm font-semibold text-pizza-cream uppercase tracking-wider">
            {t.contactUs}
          </h5>
          <div className="space-y-3 text-xs text-stone-400">
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-pizza-red-light shrink-0 mt-0.5" />
              <span>{PIZZERIA_INFO.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-pizza-gold shrink-0" />
              <a href={`tel:${PIZZERIA_INFO.phoneRaw}`} className="hover:text-white transition">
                {PIZZERIA_INFO.phone}
              </a>
            </div>
            {/* Opening hours list */}
            <div className="text-[11px] bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-400 font-mono">
              <p className="text-pizza-gold font-sans font-semibold mb-1 text-xs">{t.hoursLabel}:</p>
              <p>{lang === 'sq' ? 'E hënë - E diel:' : 'Mon - Sun:'} 11:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>

      </div>

      {/* Underbar rights reserved & tech info strictly literal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-stone-850 text-center text-xs text-stone-550 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-stone-500 font-serif">
          © {new Date().getFullYear()} Pizzeria rea. {t.allRightsReserved}.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1 text-[10px] text-stone-650 font-mono">
          <span>{lang === 'sq' ? 'Faqe zyrtare e modeluar për vizitorët' : 'Official landing page designed for responsive display'}</span>
          <span className="text-stone-800">•</span>
          {isOwnerMode ? (
            <button 
              type="button" 
              onClick={onLogout} 
              className="hover:text-pizza-red text-pizza-gold font-bold underline bg-transparent border-0 cursor-pointer p-0 select-none"
            >
              {lang === 'sq' ? 'Mbyll Panelin (Dil) 🔒' : 'Exit Admin 🔒'}
            </button>
          ) : (
            <button 
              type="button" 
              onClick={onAdminClick} 
              className="hover:text-pizza-gold text-stone-500 underline bg-transparent border-0 cursor-pointer p-0 select-none"
            >
              {lang === 'sq' ? 'Paneli i Pronarit' : 'Owner Area'}
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
