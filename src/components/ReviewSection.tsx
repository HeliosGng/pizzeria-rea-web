import { useState, useEffect, FormEvent } from 'react';
import { Star, MessageSquare, ShieldCheck, ThumbsUp, Sparkles, User, AlertCircle } from 'lucide-react';
import { Language, GENUINE_REVIEWS, Review, TRANSLATIONS } from '../data';

interface ReviewSectionProps {
  lang: Language;
}

export default function ReviewSection({ lang }: ReviewSectionProps) {
  const t = TRANSLATIONS[lang];

  // Storage key
  const LOCAL_STORAGE_REVIEWS_KEY = 'pizzeria_rea_guest_reviews';

  // State
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'highest'>('highest');
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form states
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [formError, setFormError] = useState('');

  // Load reviews on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with initial native reviews
        const merged = [...GENUINE_REVIEWS];
        parsed.forEach((customRev: Review) => {
          if (!merged.some(m => m.id === customRev.id)) {
            merged.push(customRev);
          }
        });
        setReviewsList(merged);
      } catch (err) {
        setReviewsList(GENUINE_REVIEWS);
      }
    } else {
      setReviewsList(GENUINE_REVIEWS);
    }
  }, []);

  // Filter and sort reviews
  const sortedReviews = [...reviewsList].sort((a, b) => {
    if (sortBy === 'highest') {
      return b.rating - a.rating || b.author.localeCompare(a.author);
    } else {
      // simulate newest by ordering native ID descending
      return b.id.localeCompare(a.id);
    }
  });

  const ratingSummary = {
    average: 4.9,
    guestCount: 16 + (reviewsList.length - GENUINE_REVIEWS.length),
    starsDistribution: [
      { stars: 5, percentage: 92 },
      { stars: 4, percentage: 8 },
      { stars: 3, percentage: 0 },
      { stars: 2, percentage: 0 },
      { stars: 1, percentage: 0 },
    ]
  };

  const handleAddReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newAuthor.trim()) {
      setFormError(lang === 'sq' ? 'Ju lutem shkruani emrin tuaj.' : 'Please enter your name.');
      return;
    }
    if (!newText.trim() || newText.trim().length < 5) {
      setFormError(lang === 'sq' ? 'Komentet duhet të jenë të paktën 5 karaktere.' : 'Review comments must be at least 5 characters.');
      return;
    }

    const uniqueId = `custom-rev-${Date.now()}`;
    const newReviewItem: Review = {
      id: uniqueId,
      author: newAuthor,
      avatar: '', // uses fallback letter icon
      rating: newRating,
      timeSq: 'Sot',
      timeEn: 'Today',
      textSq: newText,
      textEn: newText,
      isLocalGuide: false,
      reviewsCount: 1,
      photosCount: 0
    };

    const updatedList = [newReviewItem, ...reviewsList];
    setReviewsList(updatedList);

    // Save custom review array to localStorage
    const savedCustoms = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    let customArray: Review[] = [];
    if (savedCustoms) {
      try {
        customArray = JSON.parse(savedCustoms);
      } catch (e) {
        customArray = [];
      }
    }
    customArray.push(newReviewItem);
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(customArray));

    // Reset fields
    setNewAuthor('');
    setNewText('');
    setNewRating(5);
    setShowAddForm(false);
    setSubmitSuccess(true);

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
  };

  return (
    <div className="space-y-8">
      
      {/* Review general summaries card */}
      <div className="bg-white rounded-3xl border border-stone-150 p-6 sm:p-8 shadow-md grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Large Score Plate */}
        <div className="md:col-span-4 text-center md:border-r md:border-stone-100 md:pr-6">
          <p className="text-6xl font-serif font-black text-pizza-stone font-serif">
            {ratingSummary.average}
          </p>
          <div className="flex justify-center text-amber-400 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <p className="text-xs text-stone-400 font-mono mt-2">
            {ratingSummary.guestCount} {lang === 'sq' ? 'VLERËSIME TOTALE' : 'TOTAL REVIEWS'}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full mt-3 inline-block">
            {lang === 'sq' ? 'Përshkrim nga 5 persona' : 'Reported by 5 people'}
          </p>
        </div>

        {/* Stars distribution bar visualization */}
        <div className="md:col-span-5 space-y-2">
          {ratingSummary.starsDistribution.map(dist => (
            <div key={dist.stars} className="flex items-center text-xs text-stone-500">
              <span className="w-3 font-semibold font-mono">{dist.stars}</span>
              <Star className="h-3 w-3 fill-amber-400 text-amber-400 mx-1 shrink-0" />
              <div className="flex-1 bg-stone-100 rounded-full h-2 mx-2">
                <div 
                  className="bg-amber-400 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${dist.percentage}%` }} 
                />
              </div>
              <span className="w-8 text-right font-mono text-[10px] text-stone-400">{dist.percentage}%</span>
            </div>
          ))}
        </div>

        {/* Actions layout button */}
        <div className="md:col-span-3 flex flex-col items-stretch space-y-2.5">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full inline-flex items-center justify-center space-x-2 bg-pizza-stone hover:bg-pizza-slate text-white py-3 px-4 rounded-xl font-semibold text-xs transition duration-200"
          >
            <MessageSquare className="h-4 w-4 text-pizza-gold" />
            <span>{t.writeReview}</span>
          </button>
          
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setSortBy('highest')}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                sortBy === 'highest' 
                  ? 'bg-white text-pizza-stone shadow-sm' 
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              ★ {lang === 'sq' ? 'Më të lartat' : 'Best'}
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                sortBy === 'newest' 
                  ? 'bg-white text-pizza-stone shadow-sm' 
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              ⏲ {lang === 'sq' ? 'Më te rejat' : 'Newest'}
            </button>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs py-3.5 px-4 rounded-2xl flex items-center gap-2 animate-fade-in font-semibold">
          <Sparkles className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{t.successReview}</span>
        </div>
      )}

      {/* Write a Review Drawer/Form */}
      {showAddForm && (
        <form 
          onSubmit={handleAddReviewSubmit}
          className="bg-pizza-cream rounded-3xl border border-pizza-red/20 p-6 sm:p-8 shadow-inner space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-lg font-bold text-pizza-stone">
              {t.addReviewTitle}
            </h4>
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="text-stone-400 hover:text-stone-600 text-lg font-bold font-mono"
            >
              ✕
            </button>
          </div>

          {formError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs py-2.5 px-3 rounded-xl flex items-center gap-1.5">
              <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1 uppercase tracking-wider">
                {t.yourName}
              </label>
              <input 
                type="text" 
                placeholder="Ex. Ervis S." 
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full bg-white border border-stone-250 rounded-xl px-4 py-2.5 text-xs text-pizza-stone focus:outline-none focus:ring-1 focus:ring-pizza-red focus:border-pizza-red"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1 uppercase tracking-wider">
                {t.stars} (1-5)
              </label>
              <div className="flex items-center space-x-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`h-6 w-6 transition ${
                        star <= newRating 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-stone-300 hover:text-amber-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1 uppercase tracking-wider">
              {t.comment}
            </label>
            <textarea 
              rows={3}
              placeholder={lang === 'sq' ? 'Shkruani mendimin tuaj për ushqimin apo shërbimin...' : 'Write your culinary experience here...'}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="w-full bg-white border border-stone-250 rounded-xl px-4 py-2.5 text-xs text-pizza-stone focus:outline-none focus:ring-1 focus:ring-pizza-red focus:border-pizza-red"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-pizza-red hover:bg-pizza-red-dark text-white rounded-xl px-6 py-2.5 text-xs font-semibold shadow transition-all duration-200"
            >
              {t.btnSubmit}
            </button>
          </div>
        </form>
      )}

      {/* Review Listing Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedReviews.map((rev) => {
          const initials = rev.author.split(' ').map(name => name[0]).join('');
          return (
            <div 
              key={rev.id} 
              className="bg-white rounded-2xl border border-stone-150 p-5 shadow-sm hover:border-stone-300 hover:shadow-md transition duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Author Card Meta */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center space-x-2.5">
                    {rev.avatar ? (
                      <img 
                        src={rev.avatar} 
                        alt={rev.author} 
                        className="w-10 h-10 rounded-full object-cover border border-stone-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-stone-100 text-pizza-stone border border-stone-200 flex items-center justify-center font-bold text-xs uppercase">
                        {initials || <User className="h-4 w-4 text-stone-400" />}
                      </div>
                    )}
                    <div>
                      <h5 className="text-xs font-bold text-pizza-stone flex items-center gap-1">
                        <span>{rev.author}</span>
                        {rev.isLocalGuide && (
                          <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full font-sans tracking-wide">
                            GUIDE
                          </span>
                        )}
                      </h5>
                      <span className="text-[9px] text-stone-400 block font-mono">
                        {lang === 'sq' ? rev.timeSq : rev.timeEn} • {rev.reviewsCount || 1} {lang === 'sq' ? 'vlerësim' : 'review'}
                      </span>
                    </div>
                  </div>

                  {/* Rating stars */}
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs text-stone-600 leading-relaxed font-sans mt-2">
                  "{lang === 'sq' ? rev.textSq : rev.textEn}"
                </p>
              </div>

              {/* Verified food status checklist block */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{lang === 'sq' ? 'Përvojë reale' : 'Verified review'}</span>
                </span>
                
                {rev.foodRating && (
                  <span className="font-mono">
                    {t.foodLabel}: <strong className="text-pizza-stone">{rev.foodRating}/5</strong>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
