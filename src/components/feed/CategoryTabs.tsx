import React from 'react';
import { SocialPostCategory } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Compass, Utensils, Film, Camera, Heart, Sparkles, Users, MapPin, Layers } from 'lucide-react';

interface CategoryTabsProps {
  selectedCategory: SocialPostCategory | 'all' | 'following' | 'nearby' | 'wilayas';
  onSelectCategory: (category: any) => void;
}

export function CategoryTabs({ selectedCategory, onSelectCategory }: CategoryTabsProps) {
  const { isArabic } = useLanguage();

  const primaryTabs = [
    { id: 'all', labelFr: 'Pour vous', labelAr: 'لك (Pour vous)' },
    { id: 'following', labelFr: 'Abonnements', labelAr: 'المتابعون' },
    { id: 'nearby', labelFr: 'Proche de vous', labelAr: 'بالقرب منك' },
    { id: 'wilayas', labelFr: 'Wilayas', labelAr: 'الولايات' },
  ];

  return (
    <div className="absolute top-0 left-0 w-full z-40 bg-gradient-to-b from-black/60 via-black/20 to-transparent pt-10 sm:pt-6 pb-6">
      <div className="flex items-center justify-center gap-4 px-4 w-full">
        {primaryTabs.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`text-sm sm:text-base font-black transition-all cursor-pointer ${
                isSelected
                  ? 'text-white border-b-2 border-white pb-1 shadow-black drop-shadow-md'
                  : 'text-white/60 hover:text-white/90 pb-1'
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
