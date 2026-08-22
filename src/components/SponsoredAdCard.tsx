import React, { useState } from 'react';
import {
  Sparkles,
  Tag,
  Star,
  MapPin,
  ExternalLink,
  Phone,
  MessageCircle,
  Copy,
  Check,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Advertisement } from '../data/advertisements';
import { useLanguage } from '../context/LanguageContext';

interface SponsoredAdCardProps {
  ad: Advertisement;
  onOpenDetails: (ad: Advertisement) => void;
  onDismiss?: () => void;
  layout?: 'card' | 'banner' | 'compact';
}

export function SponsoredAdCard({
  ad,
  onOpenDetails,
  onDismiss,
  layout = 'card',
}: SponsoredAdCardProps) {
  const { isArabic } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ad.promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `Salam alaykoum, je viens de Nisfy (نصفي) pour votre offre "${ad.brandName}" (Code: ${ad.promoCode}).`
    );
    window.open(`https://wa.me/${ad.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  // 1. BANNER LAYOUT (e.g. for Lounge or Grid Header)
  if (layout === 'banner') {
    return (
      <div
        onClick={() => onOpenDetails(ad)}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white shadow-lg border border-slate-700/60 p-4 sm:p-5 cursor-pointer hover:border-amber-400/60 transition-all group"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <div className="absolute top-0 right-0 w-64 h-full opacity-20 pointer-events-none overflow-hidden">
          <img src={ad.bannerImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-amber-400/80 shrink-0 shadow-md">
              <img src={ad.logoImage} alt={ad.brandName} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {isArabic ? 'إعلان معتمد' : 'Sponsor Nisfy'}
                </span>
                <span className="text-xs text-rose-300 font-medium">
                  {isArabic ? ad.discountBadgeAr : ad.discountBadge}
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                {isArabic ? ad.brandNameAr : ad.brandName}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                {isArabic ? ad.taglineAr : ad.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
              <span>{ad.promoCode}</span>
            </button>
            <button
              onClick={() => onOpenDetails(ad)}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <span>{isArabic ? 'عرض التفاصيل' : 'Découvrir'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. DISCOVERY SWIPE / FULL CARD LAYOUT
  return (
    <div
      className="w-full max-w-md mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 flex flex-col relative transition-all"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Top Media Banner */}
      <div className="relative h-80 sm:h-96 w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onOpenDetails(ad)}>
        <img
          src={ad.bannerImage}
          alt={ad.brandName}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              {isArabic ? 'إعلان مميز • نصفي' : 'Partenaire Nisfy'}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-xs font-medium backdrop-blur-md">
              {isArabic ? ad.categoryLabelAr : ad.categoryLabel}
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs shadow-md animate-pulse">
            {isArabic ? ad.discountBadgeAr : ad.discountBadge}
          </span>
        </div>

        {/* Brand Headline Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center text-amber-400 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
              {ad.rating} ({ad.reviewsCount} avis)
            </div>
            <span className="text-slate-400">•</span>
            <div className="flex items-center text-slate-300 text-xs">
              <MapPin className="w-3.5 h-3.5 text-rose-400 mr-0.5" />
              {ad.wilayas[0]}
            </div>
          </div>
          <h3 className="text-2xl font-black leading-tight text-white drop-shadow-md">
            {isArabic ? ad.brandNameAr : ad.brandName}
          </h3>
          <p className="text-xs text-slate-200 mt-1 line-clamp-2 leading-relaxed">
            {isArabic ? ad.taglineAr : ad.tagline}
          </p>
        </div>
      </div>

      {/* Card Content & Features */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Promo Code Strip */}
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-900">
            <Tag className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs font-bold">{isArabic ? 'كود الخصم :' : 'Code Promo :'}</span>
            <span className="font-mono font-black text-sm tracking-wider text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-300">
              {ad.promoCode}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (isArabic ? 'تم !' : 'Copié') : (isArabic ? 'نسخ' : 'Copier')}</span>
          </button>
        </div>

        {/* Highlights List */}
        <div className="space-y-1.5">
          {(isArabic ? ad.featuresAr : ad.features).slice(0, 3).map((feat, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="line-clamp-1">{feat}</span>
            </div>
          ))}
        </div>

        {/* Bottom CTA Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => onOpenDetails(ad)}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <span>{isArabic ? 'تفاصيل العرض والتواصل' : 'Découvrir l’Offre'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleWhatsApp}
            className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-md flex items-center justify-center shrink-0 cursor-pointer"
            title="WhatsApp direct"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
          </button>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
            >
              {isArabic ? 'تخطي' : 'Passer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
