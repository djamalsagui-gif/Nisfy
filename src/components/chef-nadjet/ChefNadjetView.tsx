import React, { useState } from 'react';
import {
  Youtube,
  ArrowLeft,
  Play,
  MapPin,
  ExternalLink,
  Phone,
  MessageCircle,
  Sparkles,
  Star,
  ChefHat,
  Utensils,
  Check,
  Navigation,
  Copy,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { CHEF_NADJET_PROFILE } from '../../data/chefNadjetData';
import { getManagedAdvertisements } from '../../utils/adsManager';

interface ChefNadjetViewProps {
  onBackToDiscover: () => void;
}

export function ChefNadjetView({ onBackToDiscover }: ChefNadjetViewProps) {
  const { isArabic } = useLanguage();
  const [selectedChefTab, setSelectedChefTab] = useState<'nadjet' | 'djamel'>('djamel');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeDonImg, setActiveDonImg] = useState(0);

  const chefNadjet = CHEF_NADJET_PROFILE;
  const allAds = getManagedAdvertisements();
  const donJeovaniAd = allAds.find((ad) => ad.id === 'ad-don-jeovani-denia') || allAds[0];
  const isDonActive = donJeovaniAd?.isActive !== false;

  const donImages = [
    donJeovaniAd.bannerImage,
    ...(donJeovaniAd.galleryImages || []).filter((img) => img !== donJeovaniAd.bannerImage),
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(donJeovaniAd.promoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hola Chef Djamel-Michel, je vous contacte depuis Nisfy pour réserver une table au restaurant DON-JEOVANI à Dénia (Espagne) avec le code ${donJeovaniAd.promoCode}.`
    );
    window.open(`https://wa.me/${donJeovaniAd.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="w-full max-w-3xl mx-auto min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 text-slate-900 dark:text-slate-100 transition-colors" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={onBackToDiscover}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Retour"
        >
          <ArrowLeft className="w-6 h-6 text-slate-800 dark:text-slate-200" />
        </button>
        <div className="text-center">
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <ChefHat className="w-5 h-5 text-amber-500" />
            <span>{isArabic ? 'ركن كبار الطهاة والذواقة' : 'Espace Chefs & Haute Gastronomie'}</span>
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {isArabic ? 'أطباق الزفاف والحلويات والمأكولات الإسبانية' : 'Pâtisseries & Spécialités Méditerranéennes'}
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* CHEF SELECTION TABS */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl">
          {/* 1. Chef Djamel-Michel */}
          <button
            type="button"
            onClick={() => setSelectedChefTab('djamel')}
            className={`py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedChefTab === 'djamel'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🥘</span>
            <span>{isArabic ? 'الشيف جمال ميشيل (إسبانيا)' : 'Chef Djamel-Michel (Espagne)'}</span>
          </button>

          {/* 2. Chef Nadjet */}
          <button
            type="button"
            onClick={() => setSelectedChefTab('nadjet')}
            className={`py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedChefTab === 'nadjet'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>👑</span>
            <span>{isArabic ? 'الشيف نجاة (حلويات)' : 'Chef Nadjet (Pâtisserie)'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CHEF DJAMEL-MICHEL & RESTAURANT DON-JEOVANI (DENIA - ESPAGNE) */}
      {selectedChefTab === 'djamel' && (
        <div className="p-4 space-y-6 animate-fadeIn">
          {/* Banner Hero */}
          <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden shadow-xl bg-slate-950 border border-slate-200 dark:border-slate-800">
            <img
              src={donImages[activeDonImg] || donJeovaniAd.bannerImage}
              alt="Restaurant DON-JEOVANI"
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                {isArabic ? 'دعوة لتذوق البايا والمأكولات الإسبانية' : 'Gastronomie Espagnole • Paella'}
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs shadow-md">
                🇪🇸 Dénia, Espagne
              </span>
            </div>

            {/* Profile Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white z-10 flex items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={donJeovaniAd.logoImage}
                  alt="Chef Djamel-Michel"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-amber-400 object-cover shadow-lg"
                />
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    Chef Djamel-Michel 👨‍🍳
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-amber-300">
                    Restaurant DON-JEOVANI • Dénia (Alicante, Espagne)
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-white">5.0</span>
                    <span>• {isArabic ? 'مطعم شريك معتمد' : 'Restaurant Partenaire Officiel'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Gallery Strip */}
          {donImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {donImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveDonImg(idx)}
                  className={`w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer shadow-xs ${
                    activeDonImg === idx
                      ? 'border-amber-500 ring-2 ring-amber-400/40 scale-105 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* INVITATION & SPECIALITES */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-xs uppercase tracking-wider">
              <Utensils className="w-4 h-4" />
              <span>{isArabic ? 'دعوة خاصة من الشيف جمال ميشيل' : 'Invitation Gourmande du Chef Djamel-Michel'}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
              {isArabic
                ? 'الشيف جمال ميشيل يدعوكم لتذوق أشهى أطباق البايا والمأكولات الإسبانية في مطعم دون جيوفاني بدينيا (إسبانيا) 🇪🇸'
                : 'Le Chef Djamel-Michel, maître de la gastronomie Espagnole & Paella, vous invite chaleureusement à déguster ses créations au restaurant DON-JEOVANI à Dénia ! 🇪🇸'}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isArabic
                ? 'استمتعوا بأرقى أطباق البايا الإسبانية الأصيلة (بايا ثمار البحر، بايا فالنسيانا، أرز أ باندا)، مقبلات التاباس الإيبيرية والأسماك الطازجة من مياه البحر الأبيض المتوسط، في أجواء راقية وجلسات متوسطية دافئة تليق بالعائلات والعرسان.'
                : 'Venez savourer une authentique Paella Valenciana mijotée au feu de bois, la généreuse Paella de Marisco aux fruits de mer extra-frais de la Méditerranée, l’Arroz a Banda, les Tapas ibériques raffinées et les poissons grillés du jour. Un rendez-vous incontournable pour vos escapades en Espagne, déjeuners romantiques et célébrations de mariage sur la Costa Blanca.'}
            </p>

            {/* Specialities bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {donJeovaniAd.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LOCALISATION & GOOGLE MAPS CARD */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-rose-950 text-white p-5 sm:p-6 shadow-xl border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5" />
                    {isArabic ? 'الموقع الجغرافي للمطعم' : 'Localisation du Restaurant DON-JEOVANI'}
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white mt-0.5">
                    Dénia • Alicante • Costa Blanca (Espagne 🇪🇸)
                  </h4>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200">
              <p className="font-semibold">
                📍 {donJeovaniAd.address}
              </p>
              <p className="text-[11px] text-slate-300 mt-1">
                {isArabic
                  ? 'مدينة دينيا الساحلية - مقاطعة أليكانتي، إسبانيا (أمام مياه البحر الأبيض المتوسط)'
                  : 'Ville côtière de Dénia, Province d’Alicante - Espagne (face à la Méditerranée)'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <a
                href={donJeovaniAd.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{isArabic ? 'فتح موقع المطعم على Google Maps' : 'Ouvrir la Localisation sur Google Maps'}</span>
              </a>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{isArabic ? 'حجز طاولة واتساب' : 'Réserver sur WhatsApp'}</span>
              </button>
            </div>
          </div>

          {/* PROMO CODE NISFY */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  {isArabic ? 'كود خصم حصري لمستخدمي نصفي :' : 'Code Promo Réduction Nisfy :'}
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  {donJeovaniAd.discountBadge}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-xl font-mono font-black text-sm text-slate-900 dark:text-amber-300">
                {donJeovaniAd.promoCode}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? (isArabic ? 'تم !' : 'Copié') : (isArabic ? 'نسخ' : 'Copier')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHEF NADJET (PÂTISSERIES ALGERIENNES) */}
      {selectedChefTab === 'nadjet' && (
        <div className="p-4 space-y-6 animate-fadeIn">
          {/* Banner */}
          <div className="relative h-56 sm:h-64 w-full rounded-3xl overflow-hidden shadow-xl bg-slate-900">
            <img src={chefNadjet.bannerImage} alt="Banner" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
              <img src={chefNadjet.avatar} alt={chefNadjet.name} className="w-20 h-20 rounded-full border-4 border-slate-900 object-cover shadow-lg" />
              <div className="text-white pb-1">
                <h2 className="text-xl font-bold">{isArabic ? chefNadjet.nameAr : chefNadjet.name}</h2>
                <p className="text-xs text-amber-300">{isArabic ? chefNadjet.titleAr : chefNadjet.title}</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            {isArabic ? chefNadjet.bioAr : chefNadjet.bio}
          </p>

          <div className="flex gap-3">
            <a
              href={chefNadjet.youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-3 flex items-center justify-center gap-2 font-bold transition-colors shadow-xs cursor-pointer"
            >
              <Youtube className="w-5 h-5" />
              <span>{isArabic ? 'فتح في يوتيوب' : 'Ouvrir sur YouTube'}</span>
            </a>
          </div>

          {/* Video Player */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Play className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                {isArabic ? 'آخر الوصفات (فيديو)' : 'Dernières Recettes Vidéo'}
              </h3>
            </div>
            <div className="relative pt-[56.25%] w-full bg-black">
              <iframe
                src="https://www.youtube-nocookie.com/embed/Hj3Q8B0qU4E"
                title="Chef Nadjet Recettes"
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

