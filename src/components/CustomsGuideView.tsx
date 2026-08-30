import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Heart,
  Crown,
  Share2,
  CheckCircle2,
  ChevronRight,
  Info,
  MapPin,
  Search,
  Gem,
  Award,
} from 'lucide-react';
import { ALGERIAN_CUSTOMS_DATA } from '../data/customsData';
import { WilayaCustom } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CustomsGuideViewProps {
  onNavigateToMarketplace?: () => void;
}

export const CustomsGuideView: React.FC<CustomsGuideViewProps> = ({
  onNavigateToMarketplace,
}) => {
  const { isArabic } = useLanguage();
  const [selectedRegionId, setSelectedRegionId] = useState<string>(
    ALGERIAN_CUSTOMS_DATA[0].id
  );
  const [searchWilaya, setSearchWilaya] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'outfits' | 'khetba' | 'mahr' | 'ceremony'>(
    'outfits'
  );
  const [copiedProverb, setCopiedProverb] = useState<boolean>(false);

  const currentRegion =
    ALGERIAN_CUSTOMS_DATA.find((r) => r.id === selectedRegionId) ||
    ALGERIAN_CUSTOMS_DATA[0];

  const filteredRegions = ALGERIAN_CUSTOMS_DATA.filter((region) => {
    if (!searchWilaya.trim()) return true;
    const q = searchWilaya.toLowerCase().trim();
    return (
      region.regionNameFr.toLowerCase().includes(q) ||
      region.regionNameAr.includes(q) ||
      region.wilayaNames.some((w) => w.toLowerCase().includes(q)) ||
      region.wilayaCodes.some((c) => c.includes(q))
    );
  });

  const handleCopyProverb = (proverbFr: string, proverbAr: string) => {
    navigator.clipboard?.writeText?.(`${proverbAr}\n${proverbFr}`);
    setCopiedProverb(true);
    setTimeout(() => setCopiedProverb(false), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white p-6 md:p-10 shadow-2xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>{isArabic ? 'تراث وتقاليد الـ 69 ولاية والمهجر 🇩🇿' : 'Patrimoine & Traditions des 69 Wilayas'}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              {isArabic ? 'دليل عادات الزواج والتقاليد الأصيلة في الجزائر 💍' : 'Guide des Coutumes & Mariage en Algérie 💍'}
            </h1>
            <p className="text-emerald-100/80 text-sm md:text-base leading-relaxed">
              {isArabic
                ? 'استكشف طقوس الخطبة الشرعية والعرفية، عادات المهر وشورة العروس، والأزياء الملكية الخالدة (الشدة، الكاراكو، اللباس القبائلي، الملحفة الشاوية والصحراوية) وتقاليد كل ربوع الوطن.'
                : 'Explorez les rituels de fiançailles (Khetba), la tradition de la dot (Mahr), les tenues légendaires (Chedda, Karakou, Robe Kabyle, Melhfa) et les coutumes de chaque région d’Algérie.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {onNavigateToMarketplace && (
              <button
                type="button"
                onClick={onNavigateToMarketplace}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] text-white font-bold text-sm shadow-lg shadow-orange-500/20 hover:opacity-95 transition cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>{isArabic ? 'دليل قاعات وخدمات الأعراس' : 'Trouver un Prestataire (Marketplace)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Search across 69 wilayas */}
        <div className="mt-8 relative max-w-md">
          <Search className={`absolute ${isArabic ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300`} />
          <input
            type="text"
            value={searchWilaya}
            onChange={(e) => setSearchWilaya(e.target.value)}
            placeholder={isArabic ? 'ابحث عن ولاية (مثال: تلمسان، وهران، الجزائر، باتنة، 16...)' : 'Rechercher une wilaya (ex: Tlemcen, Alger, Batna, Djanet, 16...)'}
            className={`w-full ${isArabic ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 rounded-2xl bg-white/10 text-white placeholder-emerald-200/60 text-sm border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-400/50 backdrop-blur-md`}
          />
        </div>
      </div>

      {/* Region Selector Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{isArabic ? 'اختر منطقة ثقافية' : 'Sélectionner une Région Culturelle'}</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            {filteredRegions.length} {isArabic ? 'مناطق متوفرة' : 'région(s) disponible(s)'}
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {filteredRegions.map((region) => {
            const isSelected = region.id === selectedRegionId;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => setSelectedRegionId(region.id)}
                className={`shrink-0 px-4 py-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-600/20 font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-xs sm:text-sm font-black truncate max-w-[240px]">
                  {isArabic ? region.regionNameAr.split('(')[0] : region.regionNameFr.split('(')[0]}
                </div>
                <div
                  className={`text-[11px] mt-0.5 truncate max-w-[240px] font-semibold ${
                    isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isArabic ? region.regionNameFr.split('(')[0] : region.regionNameAr.split('(')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Region Header Card */}
      <div
        key={currentRegion.id}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
              {isArabic ? 'الولايات المعنية :' : 'Wilayas concernées :'} {currentRegion.wilayaNames.join(', ')} (Codes: {currentRegion.wilayaCodes.join(', ')})
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              {isArabic ? currentRegion.regionNameAr : currentRegion.regionNameFr}
            </h2>
            <p className="text-emerald-700 dark:text-emerald-400 font-bold text-sm sm:text-base mt-1">
              {isArabic ? currentRegion.regionNameFr : currentRegion.regionNameAr}
            </p>
          </div>

          {/* Proverb badge */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/60 text-slate-800 dark:text-slate-200 max-w-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                {isArabic ? 'مثل شعبي أصيل عن الزواج' : 'Dicton Matrimonial Traditionnel'}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopyProverb(
                    currentRegion.matrimonialProverbFr,
                    currentRegion.matrimonialProverbAr
                  )
                }
                className="text-amber-700 dark:text-amber-400 hover:text-amber-900 text-xs flex items-center gap-1 font-bold cursor-pointer"
              >
                {copiedProverb ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
                <span>{copiedProverb ? (isArabic ? 'تم النسخ !' : 'Copié !') : (isArabic ? 'مشاركة' : 'Partager')}</span>
              </button>
            </div>
            <p className="font-black text-slate-900 dark:text-white text-sm">
              {isArabic ? currentRegion.matrimonialProverbAr : currentRegion.matrimonialProverbFr}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 italic mt-1 font-medium">
              {isArabic ? currentRegion.matrimonialProverbFr : currentRegion.matrimonialProverbAr}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-xl">
          <button
            type="button"
            onClick={() => setActiveTab('outfits')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs md:text-sm font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'outfits'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span>{isArabic ? 'الأزياء والحلي' : 'Tenues & Parures'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('khetba')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs md:text-sm font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'khetba'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>{isArabic ? 'الخطبة والفاتحة' : 'La Khetba'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mahr')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs md:text-sm font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'mahr'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Gem className="w-4 h-4 text-emerald-600" />
            <span>{isArabic ? 'المهر والشورة' : 'Dot & Trousseau'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ceremony')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs md:text-sm font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'ceremony'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-indigo-500" />
            <span>{isArabic ? 'الحناء والخرجة' : 'Henné & Cortège'}</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'outfits' && (
          <div
            key="outfits"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 animate-in fade-in duration-200"
          >
            {currentRegion.traditionalOutfits.map((outfit, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/60 hover:shadow-md transition group"
              >
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={outfit.imageUrl}
                    alt={outfit.nameFr}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-black text-lg leading-snug">
                      {isArabic ? outfit.nameAr : outfit.nameFr}
                    </h3>
                    <p className="text-amber-300 font-bold text-xs">
                      {isArabic ? outfit.nameFr : outfit.nameAr}
                    </p>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {isArabic ? outfit.descriptionAr : outfit.descriptionFr}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed border-t border-slate-200/80 dark:border-slate-700/80 pt-2 font-medium">
                    {isArabic ? outfit.descriptionFr : outfit.descriptionAr}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'khetba' && (
          <div
            key="khetba"
            className="p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center font-bold text-lg">
                💍
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                  {isArabic ? currentRegion.khetbaTraditions.titleAr : currentRegion.khetbaTraditions.titleFr}
                </h3>
                <p className="text-rose-700 dark:text-rose-400 font-bold text-xs">
                  {isArabic ? currentRegion.khetbaTraditions.titleFr : currentRegion.khetbaTraditions.titleAr}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-rose-100 dark:border-slate-700 space-y-3">
              <p className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">
                {isArabic ? currentRegion.khetbaTraditions.detailsAr : currentRegion.khetbaTraditions.detailsFr}
              </p>
              <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
                  {isArabic ? currentRegion.khetbaTraditions.detailsFr : currentRegion.khetbaTraditions.detailsAr}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mahr' && (
          <div
            key="mahr"
            className="space-y-6 pt-2 animate-in fade-in duration-200"
          >
            <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-black text-sm">
                <Gem className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isArabic ? 'أعراف المهر والتيسير الشرعي' : 'Coutume de la Dot (المهر الشرعي والعرفي)'}</span>
              </div>
              <p className="text-slate-900 dark:text-white text-xs sm:text-sm font-bold">
                {isArabic ? currentRegion.mahrAndChoura.mahrCustomAr : currentRegion.mahrAndChoura.mahrCustomFr}
              </p>
              <p className="text-emerald-800 dark:text-emerald-400 text-xs font-semibold pt-1">
                {isArabic ? currentRegion.mahrAndChoura.mahrCustomFr : currentRegion.mahrAndChoura.mahrCustomAr}
              </p>
            </div>

            <div>
              <h4 className="font-black text-slate-800 dark:text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isArabic ? 'عناصر جهاز العروس (الشورة)' : 'Éléments clés du Trousseau (شورة العروس)'}</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentRegion.mahrAndChoura.trousseauItemsFr.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-slate-900 dark:text-white text-xs sm:text-sm font-bold">
                        {isArabic ? currentRegion.mahrAndChoura.trousseauItemsAr[idx] : item}
                      </span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                      {isArabic ? item : currentRegion.mahrAndChoura.trousseauItemsAr[idx]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ceremony' && (
          <div
            key="ceremony"
            className="space-y-4 pt-2 animate-in fade-in duration-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
                <div className="font-black text-amber-900 dark:text-amber-300 text-sm flex items-center gap-2">
                  <span>✨</span>
                  <span>{isArabic ? 'ليلة الحناء المباركة' : 'Nuit du Henné (ليلة الحناء)'}</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                  {isArabic ? currentRegion.ceremonyRituals.hennaNightAr : currentRegion.ceremonyRituals.hennaNightFr}
                </p>
                <p className="text-[11px] text-amber-800 dark:text-amber-400 font-medium pt-2 border-t border-amber-200/60 dark:border-amber-900/60">
                  {isArabic ? currentRegion.ceremonyRituals.hennaNightFr : currentRegion.ceremonyRituals.hennaNightAr}
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
                <div className="font-black text-indigo-900 dark:text-indigo-300 text-sm flex items-center gap-2">
                  <span>🎺</span>
                  <span>{isArabic ? 'خرجة العروس والموكب' : 'Cortège & Kharja (خرجة العروس)'}</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                  {isArabic ? currentRegion.ceremonyRituals.cortegeTraditionAr : currentRegion.ceremonyRituals.cortegeTraditionFr}
                </p>
                <p className="text-[11px] text-indigo-800 dark:text-indigo-400 font-medium pt-2 border-t border-indigo-200/60 dark:border-indigo-900/60">
                  {isArabic ? currentRegion.ceremonyRituals.cortegeTraditionFr : currentRegion.ceremonyRituals.cortegeTraditionAr}
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                <div className="font-black text-emerald-900 dark:text-emerald-300 text-sm flex items-center gap-2">
                  <span>🍲</span>
                  <span>{isArabic ? 'طعام ووليمة العرس' : 'Plat d’Honneur (طعام العرس)'}</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                  {isArabic ? currentRegion.ceremonyRituals.signatureDishAr : currentRegion.ceremonyRituals.signatureDishFr}
                </p>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium pt-2 border-t border-emerald-200/60 dark:border-emerald-900/60">
                  {isArabic ? currentRegion.ceremonyRituals.signatureDishFr : currentRegion.ceremonyRituals.signatureDishAr}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
