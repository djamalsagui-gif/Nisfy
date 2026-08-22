import React from 'react';
import { Youtube, ArrowLeft, Play } from 'lucide-react';
import ReactPlayer from 'react-player';
import { useLanguage } from '../../context/LanguageContext';
import { CHEF_NADJET_PROFILE } from '../../data/chefNadjetData';

interface ChefNadjetViewProps {
  onBackToDiscover: () => void;
}

export function ChefNadjetView({ onBackToDiscover }: ChefNadjetViewProps) {
  const { isArabic } = useLanguage();
  const chef = CHEF_NADJET_PROFILE;

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button onClick={onBackToDiscover} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">
          {isArabic ? 'ركن الشيف نجاة' : 'Espace Chef Nadjet'}
        </h1>
        <div className="w-10"></div>
      </div>

      {/* Banner */}
      <div className="relative h-48 w-full bg-slate-900">
        <img src={chef.bannerImage} alt="Banner" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
          <img src={chef.avatar} alt={chef.name} className="w-20 h-20 rounded-full border-4 border-slate-900 object-cover" />
          <div className="text-white pb-1">
            <h2 className="text-xl font-bold">{isArabic ? chef.nameAr : chef.name}</h2>
            <p className="text-xs text-amber-300">{isArabic ? chef.titleAr : chef.title}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        <p className="text-sm text-slate-600 leading-relaxed">
          {isArabic ? chef.bioAr : chef.bio}
        </p>
        
        <div className="flex gap-3">
          <a
            href={chef.youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 flex items-center justify-center gap-2 font-bold transition-colors"
          >
            <Youtube className="w-5 h-5" />
            <span>{isArabic ? 'فتح في يوتيوب' : 'Ouvrir sur YouTube'}</span>
          </a>
        </div>

        {/* Video Player */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <Play className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="font-bold text-slate-900">
              {isArabic ? 'آخر الوصفات (فيديو)' : 'Dernières Recettes Vidéo'}
            </h3>
          </div>
          <div className="relative pt-[56.25%] w-full bg-black">
            
                  {/* @ts-expect-error type missing */} <ReactPlayer
              url="https://www.youtube.com/watch?v=Hj3Q8B0qU4E"
              className="absolute top-0 left-0"
              width="100%"
              height="100%"
              controls
              light={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
