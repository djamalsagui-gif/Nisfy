import React from 'react';
import { SocialPostCategory } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface CategoryTabsProps {
  selectedCategory: SocialPostCategory | 'all' | 'following' | 'nearby' | 'wilayas';
  onSelectCategory: (category: any) => void;
}

export function CategoryTabs({ selectedCategory, onSelectCategory }: CategoryTabsProps) {
  const { isArabic } = useLanguage();

  const primaryTabs = [
    { id: 'all', labelFr: 'Pour vous', labelAr: 'لك' },
    { id: 'following', labelFr: 'Abonnements', labelAr: 'المتابعون' },
    { id: 'wilayas', labelFr: 'Wilayas', labelAr: 'الولايات' },
  ];

  return (
    <div className="absolute top-0 left-0 w-full z-40 bg-gradient-to-b from-black/50 via-black/15 to-transparent pt-3.5 pb-4 pointer-events-none">
      <div className="flex items-center justify-center gap-5 px-4 w-full pointer-events-auto">
        {primaryTabs.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer bg-transparent border-0 ${
                isSelected
                  ? 'text-white border-b-2 border-white pb-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]'
                  : 'text-white/60 hover:text-white/90 pb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
              }`}
            >
              {isArabic ? cat.labelAr : cat.labelFr}
            </button>
          );
        })}
      </div>
    </div>
  );
}
