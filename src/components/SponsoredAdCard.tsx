import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Tag,
  Star,
  MapPin,
  MessageCircle,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Camera,
  Layers,
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Share2,
  X,
} from 'lucide-react';
import { Advertisement } from '../data/advertisements';
import { useLanguage } from '../context/LanguageContext';
import { getTrackById, getDefaultTrackForCategory, MusicTrack } from '../data/musicThemes';
import { musicAudioEngine } from '../utils/musicAudioEngine';
import { MusicShareModal } from './music/MusicShareModal';

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
  const [cardImgIndex, setCardImgIndex] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const musicTrack: MusicTrack =
    getTrackById(ad.musicThemeId) || getDefaultTrackForCategory(ad.category);

  useEffect(() => {
    const unsub = musicAudioEngine.subscribe((track, state) => {
      setIsPlayingMusic(track?.id === musicTrack.id && state === 'playing');
    });
    return unsub;
  }, [musicTrack.id]);

  const handleToggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    musicAudioEngine.togglePlay(musicTrack);
  };

  const handleOpenShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  const allImages = [
    ad.bannerImage,
    ...(ad.galleryImages || []).filter((img) => img !== ad.bannerImage),
  ];

  const currentImage = allImages[cardImgIndex] || ad.bannerImage;

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

  const handlePrevCardImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCardImgIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextCardImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCardImgIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // 1. COMPACT / RIBBON LAYOUT (Discreet, respectful, 1-line bar)
  if (layout === 'compact') {
    return (
      <div
        onClick={() => onOpenDetails(ad)}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 dark:from-amber-950/30 dark:to-rose-950/30 border border-amber-300/40 dark:border-amber-700/40 p-2.5 sm:p-3 flex items-center justify-between gap-3 cursor-pointer hover:border-amber-400 transition-all group"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-amber-400/50 shadow-xs">
            <img src={ad.logoImage} alt={ad.brandName} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {isArabic ? '✨ شريك معتمد' : '✨ Sponsor'}
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                {isArabic ? ad.brandNameAr : ad.brandName}
              </span>
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded">
                {isArabic ? ad.discountBadgeAr : ad.discountBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate hidden sm:block">
              {isArabic ? ad.taglineAr : ad.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Tag className="w-3 h-3 text-amber-600" />}
            <span>{ad.promoCode}</span>
          </button>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            <span>{isArabic ? 'عرض' : 'Voir'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
          {onDismiss && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
              title={isArabic ? 'إخفاء' : 'Masquer'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. BANNER LAYOUT (Sleek, with optional dismiss button)
  if (layout === 'banner') {
    return (
      <div
        onClick={() => onOpenDetails(ad)}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white shadow-md border border-slate-700/60 p-4 sm:p-5 cursor-pointer hover:border-amber-400/60 transition-all group"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {onDismiss && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="absolute top-2.5 right-2.5 z-20 p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer backdrop-blur-md"
            title={isArabic ? 'إخفاء الإعلان' : 'Masquer cette annonce'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="absolute top-0 right-0 w-64 h-full opacity-20 pointer-events-none overflow-hidden">
          <img src={ad.bannerImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 border-amber-400/80 shrink-0 shadow-md">
              <img src={ad.logoImage} alt={ad.brandName} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {isArabic ? 'إعلان معتمد' : 'Sponsor Nisfy'}
                </span>
                <span className="text-xs text-rose-300 font-bold">
                  {isArabic ? ad.discountBadgeAr : ad.discountBadge}
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                {isArabic ? ad.brandNameAr : ad.brandName}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 max-w-md">
                {isArabic ? ad.taglineAr : ad.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
            {/* Music pill on banner */}
            <button
              type="button"
              onClick={handleToggleMusic}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm transition-all cursor-pointer ${
                isPlayingMusic
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={isPlayingMusic ? 'Mettre en pause la musique' : 'Écouter le thème musical du sponsor'}
            >
              {isPlayingMusic ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span className="hidden sm:inline">{musicTrack.icon} {isArabic ? musicTrack.genreLabelAr : musicTrack.genreLabel}</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
              <span>{ad.promoCode}</span>
            </button>
            <button
              onClick={() => onOpenDetails(ad)}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <span>{isArabic ? 'عرض التفاصيل' : 'Détails & Photos'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <MusicShareModal
          track={musicTrack}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      </div>
    );
  }

  // 3. DISCOVERY SWIPE / FULL CARD LAYOUT
  return (
    <div
      className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col relative transition-all"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Top Media Banner with Slide Arrows */}
      <div className="relative h-80 sm:h-96 w-full bg-slate-900 overflow-hidden group cursor-pointer" onClick={() => onOpenDetails(ad)}>
        <img
          src={currentImage}
          alt={ad.brandName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              {isArabic ? 'إعلان معتمد • نصفي' : 'Sponsor Officiel Nisfy'}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-xs font-medium backdrop-blur-md">
              {isArabic ? ad.categoryLabelAr : ad.categoryLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs shadow-md">
              {isArabic ? ad.discountBadgeAr : ad.discountBadge}
            </span>
            {onDismiss && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
                className="p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-colors cursor-pointer"
                title={isArabic ? 'تخطي' : 'Passer'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Carousel arrows if multiple images */}
        {allImages.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity z-10">
            <button
              type="button"
              onClick={handlePrevCardImg}
              className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextCardImg}
              className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Photos count */}
        {allImages.length > 1 && (
          <div className="absolute top-14 right-4 z-10 px-2.5 py-1 rounded-full bg-slate-900/70 text-white text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
            <Camera className="w-3 h-3 text-amber-400" />
            <span>
              {cardImgIndex + 1}/{allImages.length}
            </span>
          </div>
        )}

        {/* Brand Headline Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white z-10">
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

          {/* 🎵 Floating Music Theme Tag on Hero Photo */}
          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleMusic}
              className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 backdrop-blur-md border transition-all cursor-pointer shadow-lg ${
                isPlayingMusic
                  ? 'bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 border-amber-300 ring-2 ring-amber-300/50 scale-105'
                  : 'bg-black/60 hover:bg-black/80 text-white border-white/20'
              }`}
            >
              {isPlayingMusic ? (
                <Pause className="w-3.5 h-3.5 fill-slate-950" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-white" />
              )}
              <span className="truncate max-w-[140px]">
                {musicTrack.icon} {isArabic ? musicTrack.titleAr : musicTrack.title}
              </span>
              {isPlayingMusic && (
                <span className="flex items-end gap-0.5 h-2.5 ml-0.5">
                  <span className="w-0.75 bg-slate-950 rounded-full animate-bounce h-full" />
                  <span className="w-0.75 bg-slate-950 rounded-full animate-bounce h-2/3" />
                  <span className="w-0.75 bg-slate-950 rounded-full animate-bounce h-4/5" />
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleOpenShare}
              title={isArabic ? 'مشاركة الموسيقى والقصة' : 'Partager la musique'}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Content & Features */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Promo Code Strip */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/40 dark:to-rose-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
            <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-xs font-bold">{isArabic ? 'كود الخصم :' : 'Code Promo :'}</span>
            <span className="font-mono font-black text-sm tracking-wider text-slate-900 dark:text-amber-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-amber-300 dark:border-amber-700 shadow-xs">
              {ad.promoCode}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (isArabic ? 'تم !' : 'Copié') : (isArabic ? 'نسخ' : 'Copier')}</span>
          </button>
        </div>

        {/* Highlights List */}
        <div className="space-y-1.5">
          {(isArabic ? ad.featuresAr : ad.features).slice(0, 3).map((feat, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="line-clamp-1">{feat}</span>
            </div>
          ))}
        </div>

        {/* Bottom CTA Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => onOpenDetails(ad)}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>{isArabic ? 'عرض جميع الصور والتفاصيل' : 'Voir les Photos & Offre'}</span>
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
              className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {isArabic ? 'تخطي' : 'Passer'}
            </button>
          )}
        </div>
      </div>

      <MusicShareModal
        track={musicTrack}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}

