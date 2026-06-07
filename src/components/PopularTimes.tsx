import { useState, useEffect } from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { Language, HOURLY_POPULARITY, TRANSLATIONS } from '../data';

interface PopularTimesProps {
  lang: Language;
}

export default function PopularTimes({ lang }: PopularTimesProps) {
  const t = TRANSLATIONS[lang];
  const [currentHourIndex, setCurrentHourIndex] = useState<number>(-1);

  useEffect(() => {
    // Determine current hour to accentuate the bar
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Tirane',
        hour12: false,
        hour: 'numeric',
      });
      const now = new Date();
      const TiranaHour = parseInt(formatter.format(now), 10);
      
      const idx = HOURLY_POPULARITY.findIndex(item => {
        const itemHour = parseInt(item.hour.split(':')[0], 10);
        return itemHour === TiranaHour;
      });
      setCurrentHourIndex(idx);
    } catch (e) {
      // ignore errors
    }
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-stone-150 p-6 sm:p-8 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-pizza-red" />
          <div>
            <h4 className="font-serif text-lg font-bold text-pizza-stone tracking-tight leading-none">
              {t.popularTimes}
            </h4>
            <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
              {lang === 'sq' ? 'Ditët e Premte (Sipas kërkesave)' : 'Fridays (Peak Times)'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-100">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          <span>{lang === 'sq' ? 'Koha më e mirë: 19:00 - 21:00' : 'Best time: 7:00 PM - 9:00 PM'}</span>
        </div>
      </div>

      {/* Modern custom visual bar graph */}
      <div className="flex items-end justify-between h-44 pt-6 pb-2 px-1 sm:px-3 bg-stone-50 rounded-2xl border border-stone-100 relative">
        {/* Horizontal grid guide lines */}
        <div className="absolute top-[25%] left-0 right-0 border-t border-stone-200/40 pointer-events-none" />
        <div className="absolute top-[50%] left-0 right-0 border-t border-stone-200/40 pointer-events-none" />
        <div className="absolute top-[75%] left-0 right-0 border-t border-stone-200/40 pointer-events-none" />

        {HOURLY_POPULARITY.map((item, index) => {
          const isCurrent = index === currentHourIndex;
          return (
            <div key={item.hour} className="flex flex-col items-center flex-1 h-full relative group">
              
              {/* Tooltip on hover */}
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition duration-200 bg-pizza-stone text-white text-[10px] py-1 px-1.5 rounded shadow pointer-events-none whitespace-nowrap z-50">
                {item.value}% {lang === 'sq' ? 'plot' : 'busy'} ({item.hour})
              </div>

              {/* Bar */}
              <div className="w-[60%] sm:w-[50%] h-full flex items-end justify-center rounded-t-sm overflow-hidden bg-transparent">
                <div 
                  style={{ height: `${item.value}%` }}
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    isCurrent 
                      ? 'bg-gradient-to-t from-pizza-red to-pizza-red-light shadow-inner animate-[pulse_2.5s_infinite]' 
                      : 'bg-zinc-300 group-hover:bg-pizza-gold/75'
                  }`}
                />
              </div>

              {/* Hour Label */}
              <span className={`text-[9px] font-mono mt-2 scale-90 ${isCurrent ? 'text-pizza-red font-bold' : 'text-stone-400'}`}>
                {item.hour.split(':')[0]}
                <span className="text-[7px] text-stone-500">
                  {parseInt(item.hour.split(':')[0], 10) >= 12 ? 'p' : 'a'}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-stone-400 font-sans">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-zinc-300 inline-block" />
          <span>{lang === 'sq' ? 'Kohët e zakonshme' : 'Normal attendance'}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-pizza-red inline-block" />
          <span>{lang === 'sq' ? 'Ora juaj aktuale' : 'Your current hour'}</span>
        </span>
      </div>
    </div>
  );
}
