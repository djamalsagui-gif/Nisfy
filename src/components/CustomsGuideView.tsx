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

interface CustomsGuideViewProps {
  onNavigateToMarketplace?: () => void;
}

export const CustomsGuideView: React.FC<CustomsGuideViewProps> = ({
  onNavigateToMarketplace,
}) => {
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
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 md:p-10 shadow-2xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-400/30">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Patrimoine & Traditions des 69 Wilayas
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
              Guide des Coutumes & Mariage en Algérie 💍
            </h1>
            <p className="text-emerald-100/80 text-sm md:text-base leading-relaxed">
              Explorez les rituels de fiançailles (Khetba), la tradition de la dot (Mahr), les tenues légendaires (Chedda, Karakou, Robe Kabyle, Melhfa) et les coutumes de chaque région d’Algérie.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {onNavigateToMarketplace && (
              <button
                type="button"
                onClick={onNavigateToMarketplace}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-amber-700 transition"
              >
                <Crown className="w-4 h-4" />
                Trouver un Prestataire (Marketplace)
              </button>
            )}
          </div>
        </div>

        {/* Quick Search across 69 wilayas */}
        <div className="mt-8 relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300" />
          <input
            type="text"
            value={searchWilaya}
            onChange={(e) => setSearchWilaya(e.target.value)}
            placeholder="Rechercher une wilaya (ex: Tlemcen, Alger, Batna, Djanet, 16...)"
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 text-white placeholder-emerald-200/60 text-sm border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-400/50 backdrop-blur-md"
          />
        </div>
      </div>

      {/* Region Selector Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Sélectionner une Région Culturelle
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {filteredRegions.length} région(s) disponible(s)
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {filteredRegions.map((region) => {
            const isSelected = region.id === selectedRegionId;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => setSelectedRegionId(region.id)}
                className={`flex-shrink-0 px-4 py-3 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                }`}
              >
                <div className="text-sm font-bold truncate max-w-[240px]">
                  {region.regionNameFr.split('(')[0]}
                </div>
                <div
                  className={`text-xs mt-0.5 truncate max-w-[240px] ${
                    isSelected ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                  dir="rtl"
                >
                  {region.regionNameAr.split('(')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Region Header Card */}
      <div
        key={currentRegion.id}
        className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Wilayas concernées : {currentRegion.wilayaNames.join(', ')} (Codes: {currentRegion.wilayaCodes.join(', ')})
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">
              {currentRegion.regionNameFr}
            </h2>
            <p className="text-emerald-800 font-semibold text-lg mt-1" dir="rtl">
              {currentRegion.regionNameAr}
            </p>
          </div>

          {/* Proverb badge */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/70 text-slate-800 max-w-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Dicton Matrimonial Traditionnel
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopyProverb(
                    currentRegion.matrimonialProverbFr,
                    currentRegion.matrimonialProverbAr
                  )
                }
                className="text-amber-700 hover:text-amber-900 text-xs flex items-center gap-1 font-medium"
              >
                {copiedProverb ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
                {copiedProverb ? 'Copié !' : 'Partager'}
              </button>
            </div>
            <p className="font-bold text-slate-900 text-sm" dir="rtl">
              {currentRegion.matrimonialProverbAr}
            </p>
            <p className="text-xs text-slate-600 italic mt-1">
              {currentRegion.matrimonialProverbFr}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-xl">
          <button
            type="button"
            onClick={() => setActiveTab('outfits')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs md:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'outfits'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-500" />
            Tenues & Parures
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('khetba')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs md:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'khetba'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            La Khetba (الخطبة)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mahr')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs md:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'mahr'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gem className="w-4 h-4 text-emerald-600" />
            Dot & Trousseau
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ceremony')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs md:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'ceremony'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-indigo-500" />
            Henné & Cortège
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
                className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 hover:shadow-md transition group"
              >
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={outfit.imageUrl}
                    alt={outfit.nameFr}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-extrabold text-lg leading-snug">
                      {outfit.nameFr}
                    </h3>
                    <p className="text-amber-300 font-bold text-sm" dir="rtl">
                      {outfit.nameAr}
                    </p>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {outfit.descriptionFr}
                  </p>
                  <p className="text-slate-600 text-xs leading-relaxed text-right border-t border-slate-200/60 pt-2 font-medium" dir="rtl">
                    {outfit.descriptionAr}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'khetba' && (
          <div
            key="khetba"
            className="p-6 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                💍
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {currentRegion.khetbaTraditions.titleFr}
                </h3>
                <p className="text-rose-700 font-semibold text-sm" dir="rtl">
                  {currentRegion.khetbaTraditions.titleAr}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-rose-100/80 space-y-3">
              <p className="text-slate-700 text-sm leading-relaxed">
                {currentRegion.khetbaTraditions.detailsFr}
              </p>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-slate-700 text-sm leading-relaxed text-right font-medium" dir="rtl">
                  {currentRegion.khetbaTraditions.detailsAr}
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
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <Gem className="w-4 h-4 text-emerald-600" />
                Coutume de la Dot (المهر الشرعي والعرفي)
              </div>
              <p className="text-slate-800 text-sm font-medium">
                {currentRegion.mahrAndChoura.mahrCustomFr}
              </p>
              <p className="text-emerald-900 text-sm font-bold text-right pt-1" dir="rtl">
                {currentRegion.mahrAndChoura.mahrCustomAr}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Éléments clés du Trousseau (شورة العروس)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentRegion.mahrAndChoura.trousseauItemsFr.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-slate-800 text-sm font-semibold">
                        {item}
                      </span>
                    </div>
                    <div className="text-slate-600 text-xs text-right font-medium" dir="rtl">
                      {currentRegion.mahrAndChoura.trousseauItemsAr[idx]}
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
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="font-bold text-amber-900 text-sm flex items-center gap-2">
                  <span>✨</span>
                  Nuit du Henné (ليلة الحناء)
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentRegion.ceremonyRituals.hennaNightFr}
                </p>
                <p className="text-xs text-amber-900 font-semibold text-right pt-2 border-t border-amber-200/60" dir="rtl">
                  {currentRegion.ceremonyRituals.hennaNightAr}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                <div className="font-bold text-indigo-900 text-sm flex items-center gap-2">
                  <span>🎺</span>
                  Cortège & Kharja (خرجة العروس)
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentRegion.ceremonyRituals.cortegeTraditionFr}
                </p>
                <p className="text-xs text-indigo-900 font-semibold text-right pt-2 border-t border-indigo-200/60" dir="rtl">
                  {currentRegion.ceremonyRituals.cortegeTraditionAr}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                  <span>🍲</span>
                  Plat d’Honneur (طعام العرس)
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentRegion.ceremonyRituals.signatureDishFr}
                </p>
                <p className="text-xs text-emerald-900 font-semibold text-right pt-2 border-t border-emerald-200/60" dir="rtl">
                  {currentRegion.ceremonyRituals.signatureDishAr}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
