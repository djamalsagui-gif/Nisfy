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
    { id: 'all', labelFr: 'Pour vous', labelAr: 'لك (Pour vous)', icon: Sparkles },
    { id: 'following', labelFr: 'Abonnements', labelAr: 'المتابعون', icon: Users },
    { id: 'nearby', labelFr: 'Proche de vous', labelAr: 'بالقرب منك', icon: MapPin },
    { id: 'wilayas', labelFr: 'Wilayas (69)', labelAr: 'الولايات الـ 69', icon: Layers },
    { id: 'mariage', labelFr: '💍 Mariage', labelAr: '💍 أعراس وتقاليد', icon: Heart },
    { id: 'cuisine', labelFr: '🍲 Gastronomie', labelAr: '🍲 فن الطبخ', icon: Utensils },
  ];

  return (
    <div className="absolute top-0 left-0 w-full z-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent pt-3 pb-8">
      <div className="flex items-center gap-2 overflow-x-auto px-4 snap-x snap-mandatory scrollbar-hide no-scrollbar w-full">
        {primaryTabs.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`snap-center shrink-0 px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all backdrop-blur-md border shadow-md cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white border-transparent shadow-[#FF3823]/40 scale-105 ring-2 ring-white/30'
                  : 'bg-black/50 text-white/80 hover:bg-black/70 border-white/15'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-white" />
              <span>{isArabic ? cat.labelAr : cat.labelFr}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
