import { Phone, Navigation, ArrowRight, Star, ShoppingBag, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, PIZZERIA_INFO, TRANSLATIONS } from '../data';

interface HeroProps {
  lang: Language;
  onNavigateToSection: (sectionId: string) => void;
}

export default function Hero({ lang, onNavigateToSection }: HeroProps) {
  const t = TRANSLATIONS[lang];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 25 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: custom * 0.15, ease: [0.21, 1.02, 0.43, 1.01] }
    })
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-pizza-charcoal text-white overflow-hidden py-16 px-4">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/pizza_hero_1780662916438.png"
          alt="Artisanal Pizza Wood-Fired"
          className="w-full h-full object-cover object-center opacity-40 scale-105 filter brightness-90 animate-[pulse_8s_infinite_alternate]"
          referrerPolicy="no-referrer"
        />
        {/* Gradients to blend beautifully */}
        <div className="absolute inset-0 bg-gradient-to-t from-pizza-charcoal via-pizza-charcoal/70 to-pizza-charcoal/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-pizza-charcoal/80 via-transparent to-pizza-charcoal/80" />
        {/* Subtle red heat glow effect */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-[30%] bg-pizza-red/20 blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Top Floating Rating Card */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex items-center space-x-2 bg-pizza-stone/90 border border-pizza-red/40 px-4 py-1.5 rounded-full shadow-lg backdrop-blur mb-6 hover:bg-pizza-stone transition duration-300"
        >
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current " />
            ))}
          </div>
          <span className="font-mono text-sm font-semibold tracking-wider text-pizza-cream">
            {PIZZERIA_INFO.rating}
          </span>
          <span className="text-xs text-stone-400">
            ({PIZZERIA_INFO.reviewsCount} {lang === 'sq' ? 'vlerësime' : 'reviews'})
          </span>
        </motion.div>

        {/* Catchy headline */}
        <motion.h2
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="font-serif text-4xl sm:text-5xl md:text-6.5xl font-black tracking-tight text-pizza-cream max-w-4xl leading-tight"
        >
          {lang === 'sq' ? (
            <>
              Pjekur me <span className="text-pizza-red font-semibold underline decoration-pizza-gold/40 underline-offset-4">Dru Lajthie</span>,<br className="hidden sm:inline" /> Gatuar me Dashuri te <span className="text-pizza-gold">Pizzeria rea</span>
            </>
          ) : (
            <>
              Wood-Fired <span className="text-pizza-red font-semibold underline decoration-pizza-gold/40 underline-offset-4">Lekë-Wise</span> Perfection,<br className="hidden sm:inline" /> Crafted with Love at <span className="text-pizza-gold">Pizzeria rea</span>
            </>
          )}
        </motion.h2>

        {/* Dynamic subtext */}
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mt-6 text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed"
        >
          {t.taglineSub}. {lang === 'sq' 
            ? 'Brumi ynë i famshëm që fermentohet ngadalë për 48 orë jep sekretin e picës më krokante në Kashar dhe Tiranë!'
            : 'Our famous slow-fermented 48-hour dough unlocks the finest crispy gourmet slice in Kashar and Tirana!'}
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4"
        >
          {/* Local Menu Direct CTA Button */}
          <button
            onClick={() => onNavigateToSection('menu-section')}
            className="group w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-pizza-red to-pizza-red-light hover:from-pizza-red-light hover:to-pizza-red text-white py-4 px-8 rounded-full font-bold shadow-lg shadow-pizza-red/30 hover:shadow-pizza-red/50 scale-100 hover:scale-102 active:scale-98 transition duration-300"
          >
            <ShoppingBag className="h-5 w-5 animate-pulse" />
            <span className="tracking-wide text-sm sm:text-base">{t.heroButtonOrder}</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Phone Call Call-to-Action */}
          <a
            href={`tel:${PIZZERIA_INFO.phoneRaw}`}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-pizza-stone hover:bg-pizza-slate text-pizza-cream hover:text-white border border-stone-700 hover:border-stone-500 py-4 px-8 rounded-full font-medium transition duration-300"
          >
            <Phone className="h-5 w-5 text-pizza-gold" />
            <span className="tracking-wide text-sm sm:text-base">{t.heroButtonCall}</span>
          </a>

          {/* Google Maps directions */}
          <a
            href={PIZZERIA_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-transparent hover:bg-white/5 text-stone-300 hover:text-white border border-stone-800 hover:border-stone-700 py-4 px-8 rounded-full font-medium transition duration-300"
          >
            <Navigation className="h-5 w-5 text-emerald-500" />
            <span className="tracking-wide text-sm sm:text-base">{t.heroButtonMaps}</span>
          </a>
        </motion.div>

        {/* Quick Attribute Badges */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mt-12 bg-pizza-charcoal/80 border border-stone-800/80 px-8 py-4 rounded-2xl grid grid-cols-3 gap-6 max-w-3xl w-full text-xs text-stone-400 font-mono"
        >
          <div className="flex flex-col items-center">
            <span className="text-pizza-gold text-lg mb-1">✓</span>
            <span className="text-stone-300 font-sans font-semibold mb-0.5">{t.dineInLabel}</span>
            <span className="text-[10px] text-stone-500">{lang === 'sq' ? 'Kujdes i veçantë' : 'Full table service'}</span>
          </div>
          <div className="flex flex-col items-center border-x border-stone-800">
            <span className="text-pizza-gold text-lg mb-1">✓</span>
            <span className="text-stone-300 font-sans font-semibold mb-0.5">{t.driveThrough}</span>
            <span className="text-[10px] text-stone-500">{lang === 'sq' ? 'Merr me Makinë' : 'Fast pickup'}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-pizza-gold text-lg mb-1">✓</span>
            <span className="text-stone-300 font-sans font-semibold mb-0.5">{t.noContactDelivery}</span>
            <span className="text-[10px] text-stone-500">{lang === 'sq' ? 'Porosit me Telefon' : 'Order via Phone Call'}</span>
          </div>
        </motion.div>

        {/* Quick Menu Hint anchor */}
        <motion.p
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          onClick={() => onNavigateToSection('menu-section')}
          className="mt-10 font-mono text-xs text-pizza-gold hover:text-pizza-cream tracking-widest uppercase cursor-pointer transition duration-350 flex items-center gap-1.5 animate-pulse"
        >
          <Sparkles className="h-3 w-3" />
          <span>{lang === 'sq' ? 'SHIKO MENUNË & KRIJO PICËN TËND' : 'EXPLORE MENU & BUILD YOUR CRUST'}</span>
          <Sparkles className="h-3 w-3" />
        </motion.p>
      </div>
    </section>
  );
}
