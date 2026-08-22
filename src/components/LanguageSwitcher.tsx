import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { datingSounds } from '../utils/soundEffects';

interface LanguageSwitcherProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LanguageSwitcher({ className = '', size = 'md' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const handleSelect = (lang: 'fr' | 'ar') => {
    if (language !== lang) {
      datingSounds.playLikeSound();
      setLanguage(lang);
    }
  };

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const basePadding = isSmall
    ? 'px-2 py-1 text-[11px]'
    : isLarge
    ? 'px-4 py-2 text-sm'
    : 'px-2.5 sm:px-3 py-1.5 text-xs';

  return (
    <div
      className={`inline-flex items-center p-1 bg-slate-100/90 border border-slate-200/90 rounded-2xl shadow-xs ${className}`}
      role="group"
      aria-label="Sélection de la langue"
    >
      {/* French Button */}
      <button
        type="button"
        onClick={() => handleSelect('fr')}
        className={`${basePadding} rounded-xl font-black transition-all flex items-center gap-1.5 cursor-pointer ${
          language === 'fr'
            ? 'bg-white text-rose-600 shadow-xs ring-1 ring-rose-200'
            : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
        }`}
        title="Passer en Français"
      >
        <span className="text-sm">🇫🇷</span>
        <span>FR</span>
      </button>

      {/* Arabic Button */}
      <button
        type="button"
        onClick={() => handleSelect('ar')}
        className={`${basePadding} rounded-xl font-black transition-all flex items-center gap-1.5 cursor-pointer ${
          language === 'ar'
            ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-400'
            : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
        }`}
        title="التحويل إلى العربية والدارجة الجزائرية"
      >
        <span className="text-sm">🇩🇿</span>
        <span>عربي</span>
      </button>
    </div>
  );
}
