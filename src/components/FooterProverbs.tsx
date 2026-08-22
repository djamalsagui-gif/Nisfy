import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Pause, Play, HeartHandshake } from 'lucide-react';
import { ALGERIAN_PROVERBS } from '../data/proverbs';
import { useLanguage } from '../context/LanguageContext';

export function FooterProverbs() {
  const { isArabic } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ALGERIAN_PROVERBS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const proverb = ALGERIAN_PROVERBS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ALGERIAN_PROVERBS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ALGERIAN_PROVERBS.length) % ALGERIAN_PROVERBS.length);
  };

  return (
    <footer className="mt-auto border-t border-slate-200 bg-gradient-to-b from-white via-slate-50 to-rose-50/30 py-4 px-3 sm:px-6 relative z-10 select-none">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        {/* Proverb Content with Algerian Cultural Badge */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
            <HeartHandshake className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 transition-all duration-300">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-100/70 px-2 py-0.5 rounded-full border border-rose-200">
                {isArabic ? 'حكمة اليوم الجزائري' : 'Sagesse & Proverbe DZ'}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                • {proverb.theme}
              </span>
            </div>

            <p className="text-sm sm:text-base font-extrabold text-slate-800 font-serif tracking-tight truncate">
              {proverb.arabic}
            </p>
            <p className="text-xs text-slate-500 font-medium italic truncate">
              {proverb.french}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0 bg-white/80 backdrop-blur-xs p-1 rounded-2xl border border-slate-200 shadow-2xs">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
            title={isPlaying ? 'Pause' : 'Lecture'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-[10px] font-black text-slate-400 px-1.5">
            {currentIndex + 1}/{ALGERIAN_PROVERBS.length}
          </span>
        </div>
      </div>
    </footer>
  );
}
