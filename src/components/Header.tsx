import { useState, useEffect } from 'react';
import { ChefHat, Globe, Phone, MapPin, Clock } from 'lucide-react';
import { Language, PIZZERIA_INFO, TRANSLATIONS } from '../data';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

export default function Header({ lang, setLang }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [timeUntilChange, setTimeUntilChange] = useState('');

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const checkStatus = () => {
      try {
        // Safe, timezone-aware date parsing for Europe/Tirane (Albania)
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Europe/Tirane',
          hour12: false,
          hour: 'numeric',
          minute: 'numeric',
        });
        
        const now = new Date();
        const parts = formatter.formatToParts(now);
        const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '12', 10);
        const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);

        // Standard open hours: 11:00 to 23:00 (11 AM to 11 PM)
        const openHour = 11;
        const closeHour = 23;

        const isCurrentlyOpen = hour >= openHour && hour < closeHour;
        setIsOpen(isCurrentlyOpen);

        // Pad hours and minutes with zeros
        const pad = (num: number) => num.toString().padStart(2, '0');
        setCurrentTimeStr(`${pad(hour)}:${pad(minute)}`);

        // Compute countdown
        if (isCurrentlyOpen) {
          const remainingHours = closeHour - 1 - hour;
          const remainingMinutes = 60 - minute;
          const totalRemainingMin = remainingHours * 60 + remainingMinutes;
          
          if (totalRemainingMin <= 60) {
            setTimeUntilChange(
              lang === 'sq' 
                ? `Mbyllet së shpejti! Edhe ${totalRemainingMin} minuta` 
                : `Closing soon! In ${totalRemainingMin} mins`
            );
          } else {
            const hPart = Math.floor(totalRemainingMin / 60);
            const mPart = totalRemainingMin % 60;
            setTimeUntilChange(
              lang === 'sq'
                ? `Edhe ${hPart} orë e ${mPart} minuta hapur`
                : `${hPart} hrs ${mPart} mins left to close`
            );
          }
        } else {
          // Calculate when it opens
          let minsToOpen = 0;
          if (hour < openHour) {
            const remainingHours = openHour - 1 - hour;
            const remainingMinutes = 60 - minute;
            minsToOpen = remainingHours * 60 + remainingMinutes;
          } else {
            // After 23:00, opens tomorrow at 11:00
            const remainingHours = (24 - hour) + openHour - 1;
            const remainingMinutes = 60 - minute;
            minsToOpen = remainingHours * 60 + remainingMinutes;
          }

          const hPart = Math.floor(minsToOpen / 60);
          const mPart = minsToOpen % 60;
          setTimeUntilChange(
            lang === 'sq'
              ? `Hapet pas ${hPart} orësh e ${mPart} minutash`
              : `Opens in ${hPart} hrs ${mPart} mins`
          );
        }
      } catch (e) {
        // Fallback in case of standard timezone errors or server-side limitations
        setIsOpen(true);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // check status every 30s
    return () => clearInterval(interval);
  }, [lang]);

  return (
    <header className="sticky top-0 z-50 bg-pizza-charcoal text-white border-b border-pizza-red/40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="bg-pizza-red p-2.5 rounded-full border border-pizza-gold/50 shadow-inner flex items-center justify-center">
              <ChefHat className="h-6 w-6 text-pizza-cream" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-pizza-cream">
                Pizzeria <span className="text-pizza-red-light font-bold">rea</span>
              </h1>
              <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
                <MapPin className="h-3 w-3 text-pizza-red-light" /> Kashar, Shqipëri
              </span>
            </div>
          </div>

          {/* Widgets / Live Info (Desktop) */}
          <div className="hidden md:flex items-center space-x-6 text-xs text-stone-300">
            {/* Live timezone status clock */}
            <div className="flex items-center space-x-2 bg-pizza-stone/80 px-3.5 py-1.5 rounded-full border border-stone-800">
              <Clock className="h-3.5 w-3.5 text-pizza-gold" />
              <div>
                <span className="block font-medium text-stone-400 font-mono">Tirane: {currentTimeStr || '12:00'}</span>
                <span className="text-[10px] text-zinc-500 font-sans block">{timeUntilChange}</span>
              </div>
            </div>

            {/* Live Open/Closed badge */}
            <div className="flex items-center space-x-1.5 bg-pizza-stone/80 px-3 py-1.5 rounded-full border border-stone-800">
              <span className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="font-semibold text-xs tracking-wider">
                {isOpen 
                  ? (lang === 'sq' ? 'HAPUR' : 'OPEN') 
                  : (lang === 'sq' ? 'MBYLLUR' : 'CLOSED')}
              </span>
            </div>
          </div>

          {/* Right Section: Actions & Language Toggle */}
          <div className="flex items-center space-x-3">
            {/* Fast Quick Phone Button */}
            <a 
              href={`tel:${PIZZERIA_INFO.phoneRaw}`}
              className="flex items-center gap-1.5 bg-pizza-stone/80 text-white border border-stone-700 hover:border-pizza-red hover:bg-pizza-stone transition px-3 py-1.5 rounded-full text-xs font-medium md:flex hidden"
            >
              <Phone className="h-3 w-3 text-pizza-gold" />
              <span>{PIZZERIA_INFO.phone}</span>
            </a>

            {/* Language Selector Selector */}
            <div className="flex items-center bg-pizza-stone px-1 py-1 rounded-full border border-stone-850 shadow-inner">
              <button
                onClick={() => setLang('sq')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                  lang === 'sq'
                    ? 'bg-pizza-red text-pizza-cream shadow-md scale-105'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                SQ
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                  lang === 'en'
                    ? 'bg-pizza-red text-pizza-cream shadow-md scale-105'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Info Strip */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-pizza-stone/40 text-xs text-stone-300">
          <div className="flex items-center space-x-1.5 font-mono">
            <Clock className="h-3.5 w-3.5 text-pizza-gold" />
            <span className="text-zinc-400">Tiranë: {currentTimeStr || '12:00'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              {isOpen 
                ? (lang === 'sq' ? 'HAPUR' : 'OPEN') 
                : (lang === 'sq' ? 'MBYLLUR' : 'CLOSED')}
            </span>
            <span className="text-stone-400 text-[10px]">• {timeUntilChange}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
