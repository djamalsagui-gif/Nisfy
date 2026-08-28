import React from 'react';
import { SocialPostCategory } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Compass, Utensils, Film, Camera, Heart, Sparkles } from 'lucide-react';

interface CategoryTabsProps {
  selectedCategory: SocialPostCategory | 'all';
  onSelectCategory: (category: SocialPostCategory | 'all') => void;
}

export function CategoryTabs({ selectedCategory, onSelectCategory }: CategoryTabsProps) {
  const { isArabic } = useLanguage();

  const categories = [
    { id: 'all', labelFr: 'Pour vous', labelAr: 'لك', icon: Sparkles },
    { id: 'cuisine', labelFr: 'Cuisine', labelAr: 'طبخ', icon: Utensils },
    { id: 'voyage', labelFr: 'Voyages', labelAr: 'سفر', icon: Compass },
    { id: 'documentaire', labelFr: 'Docu', labelAr: 'وثائقي', icon: Film },
    { id: 'selfie', labelFr: 'Selfies', labelAr: 'يوميات', icon: Camera },
    { id: 'mariage', labelFr: 'Mariage', labelAr: 'أعراس', icon: Heart },
  ];

  return (
    <div className="absolute top-0 left-0 w-full z-40 bg-gradient-to-b from-black/60 to-transparent pt-4 pb-12">
      <div className="flex items-center gap-4 overflow-x-auto px-4 snap-x snap-mandatory scrollbar-hide no-scrollbar w-full">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as SocialPostCategory | 'all')}
              className={`snap-center shrink-0 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all backdrop-blur-md border shadow-md ${
                isSelected
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white border-transparent shadow-[#FF3823]/30 scale-105'
                  : 'bg-black/40 text-white/90 hover:bg-black/60 border-white/20'
              }`}
            >
              <Icon className="w-4 h-4 text-white" />
              <span>{isArabic ? cat.labelAr : cat.labelFr}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
