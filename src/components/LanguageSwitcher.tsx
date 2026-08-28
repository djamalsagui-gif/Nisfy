import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { datingSounds } from '../utils/soundEffects';

interface LanguageSwitcherProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'toggle' | 'segmented' | 'compact';
}

export function LanguageSwitcher({ className = '', size = 'sm', variant = 'toggle' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    datingSounds.playLikeSound();
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  const handleSelect = (lang: 'fr' | 'ar') => {
    if (language !== lang) {
      datingSounds.playLikeSound();
      setLanguage(lang);
    }
  };

  if (variant === 'toggle' || variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all shadow-2xs shrink-0 cursor-pointer ${className}`}
        title={language === 'fr' ? 'Passer en Arabe (عربي)' : 'Passer en Français'}
        aria-label="Changer de langue"
      >
        <span className="text-sm">{language === 'fr' ? '🇫🇷' : '🇩🇿'}</span>
        <span className="font-mono text-[11px] font-black">{language === 'fr' ? 'FR' : 'عربي'}</span>
        <span className="text-[10px] text-slate-400">⇄</span>
      </button>
    );
  }

  // Segmented (2-button version)
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const basePadding = isSmall
    ? 'px-2 py-1 text-[11px]'
    : isLarge
    ? 'px-4 py-2 text-sm'
    : 'px-2.5 sm:px-3 py-1.5 text-xs';

  return (
    <div
      className={`inline-flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-xl shadow-2xs ${className}`}
      role="group"
      aria-label="Sélection de la langue"
    >
      <button
        type="button"
        onClick={() => handleSelect('fr')}
        className={`${basePadding} rounded-lg font-black transition-all flex items-center gap-1 cursor-pointer ${
          language === 'fr'
            ? 'bg-white text-[#FF3823] shadow-2xs ring-1 ring-[#FF3823]/25'
            : 'text-slate-500 hover:text-slate-800'
        }`}
        title="Passer en Français"
      >
        <span className="text-xs">🇫🇷</span>
        <span>FR</span>
      </button>

      <button
        type="button"
        onClick={() => handleSelect('ar')}
        className={`${basePadding} rounded-lg font-black transition-all flex items-center gap-1 cursor-pointer ${
          language === 'ar'
            ? 'bg-emerald-600 text-white shadow-2xs ring-1 ring-emerald-400'
            : 'text-slate-500 hover:text-slate-800'
        }`}
        title="التحويل إلى العربية"
      >
        <span className="text-xs">🇩🇿</span>
        <span>عربي</span>
      </button>
    </div>
  );
}

