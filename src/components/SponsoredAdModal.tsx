import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Star,
  MapPin,
  ShieldCheck,
  Tag,
  ChevronLeft,
  ChevronRight,
  Send,
  Camera,
  Layers,
  Calendar,
  Gift,
} from 'lucide-react';
import { Advertisement } from '../data/advertisements';
import { useLanguage } from '../context/LanguageContext';

interface SponsoredAdModalProps {
  ad: Advertisement | null;
  onClose: () => void;
}

export function SponsoredAdModal({ ad, onClose }: SponsoredAdModalProps) {
  const { isArabic } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [selectedImgIndex, setSelectedImgIndex] = useState<number>(0);
  const [messageSent, setMessageSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactNote, setContactNote] = useState('');

  if (!ad) return null;

  // Build full photo list
  const allImages = [
    ad.bannerImage,
    ...(ad.galleryImages || []).filter((img) => img !== ad.bannerImage),
  ];

  const currentImage = allImages[selectedImgIndex] || ad.bannerImage;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImgIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImgIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ad.promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      `Salam alaykoum, je vous contacte depuis l'application Nisfy (نصفي) concernant votre offre "${ad.brandName}" avec le code promo ${ad.promoCode}.`
    );
    window.open(`https://wa.me/${ad.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPhone.trim()) return;

    const subject = encodeURIComponent(
      `[DEMANDE ANNONCE NISFY] ${ad.brandName} - Contact ${contactName || 'Client'}`
    );
    const body = encodeURIComponent(
      `Salam alaykoum,\n\nNouvelle demande client pour l'offre ${ad.brandName} :\n` +
        `- Nom client : ${contactName || 'Non précisé'}\n` +
        `- Téléphone : ${contactPhone}\n` +
        `- Note / Date : ${contactNote || 'Non précisé'}\n` +
        `- Code Promo : ${ad.promoCode}\n\n` +
        `Envoyé depuis Nisfy`
    );
    window.location.href = `mailto:contact@nisfy.app?subject=${subject}&body=${body}`;

    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setContactName('');
      setContactPhone('');
      setContactNote('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col relative"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900/90 text-white transition-colors backdrop-blur-md cursor-pointer shadow-lg"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. HERO VISUAL GALLERY WITH FULL VISIBILITY & NAVIGATION */}
        <div className="relative h-72 sm:h-84 w-full bg-slate-950 overflow-hidden shrink-0 group">
          <img
            src={currentImage}
            alt={ad.brandName}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              {isArabic ? 'إعلان معتمد • شريك نصفي' : 'Sponsor Officiel Nisfy'}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600/95 text-white font-bold text-xs backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isArabic ? 'خدمة موثوقة' : 'Prestataire Vérifié'}
            </span>
          </div>

          {/* Carousel Arrows (if multiple photos) */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
                title="Photo précédente"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
                title="Photo suivante"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Photo Counter Pill */}
          <div className="absolute top-4 right-16 z-20 px-2.5 py-1 rounded-full bg-slate-900/70 text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1">
            <Camera className="w-3 h-3 text-amber-400" />
            <span>
              {selectedImgIndex + 1} / {allImages.length}
            </span>
          </div>

          {/* Brand Quick Headline Bar */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-4 text-white z-10">
            <div className="text-[11px] uppercase tracking-wider text-amber-300 font-bold mb-0.5">
              {isArabic ? ad.categoryLabelAr : ad.categoryLabel}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {isArabic ? ad.brandNameAr : ad.brandName}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-200">
              <div className="flex items-center text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                <span>{ad.rating}</span>
              </div>
              <span>•</span>
              <span>
                {ad.reviewsCount} {isArabic ? 'تقييم زبائن' : 'avis certifiés'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-rose-300 font-medium">
                <MapPin className="w-3.5 h-3.5" />
                {ad.wilayas.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* 2. THUMBNAIL SELECTOR STRIP (Cleanly displayed right under the hero) */}
        {allImages.length > 1 && (
          <div className="p-3 bg-slate-100 border-b border-slate-200">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                {isArabic ? 'تصفح جميع صور المكان والخدمة' : 'Galerie photos HD (cliquez pour agrandir)'}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {allImages.length} {isArabic ? 'صور متوفرة' : 'photos'}
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer shadow-xs ${
                    selectedImgIndex === idx
                      ? 'border-amber-500 ring-2 ring-amber-400/40 scale-105 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100 hover:scale-102'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {selectedImgIndex === idx && (
                    <div className="absolute inset-0 bg-amber-500/10" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. CONTENT BODY */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {/* OFFRE SPÉCIALE MEMBRES NISFY (Clean, dedicated promo card with zero occlusion) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-emerald-500/10 border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md font-black">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  {isArabic ? 'عرض حصري لأعضاء نصفي' : 'Offre Spéciale Membres Nisfy'}
                </div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  {isArabic ? ad.discountBadgeAr : ad.discountBadge}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="px-3.5 py-2 bg-white rounded-xl border border-amber-300 font-mono font-black text-slate-900 text-sm tracking-wider shadow-xs">
                {ad.promoCode}
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>{isArabic ? 'تم النسخ !' : 'Copié !'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{isArabic ? 'نسخ الكود' : 'Copier'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-2">
              {isArabic ? ad.taglineAr : ad.tagline}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {isArabic ? ad.descriptionAr : ad.description}
            </p>
          </div>

          {/* Key Features & Benefits */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {isArabic ? 'أبرز مميزات الخدمة والضمانات' : 'Ce qui est inclus & Avantages'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(isArabic ? ad.featuresAr : ad.features).map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Callback / Inquiry form */}
          <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white shadow-xs">
            <h4 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" />
              {isArabic ? 'طلب اتصال أو حجز موعد سريع' : 'Demande de rappel & Devis express'}
            </h4>
            <p className="text-xs text-slate-500 mb-3.5">
              {isArabic
                ? 'اترك رقمك وسيتواصل معك ممثل الخدمة خلال ساعات قليلة'
                : 'Laissez vos coordonnées pour recevoir la brochure complète et un devis personnalisé'}
            </p>

            {messageSent ? (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl text-sm font-semibold flex items-center gap-2 border border-emerald-200">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  {isArabic
                    ? 'شكراً لك! تم إرسال طلبك إلى الشريك بنجاح وسيتم الاتصال بك قريباً.'
                    : 'Votre demande a été transmise au partenaire. Vous serez contacté très rapidement !'}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder={isArabic ? 'الاسم واللقب' : 'Votre Nom & Prénom'}
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <input
                    type="tel"
                    placeholder={isArabic ? 'رقم الهاتف (05/06/07)' : 'Téléphone (05xx / 06xx / 07xx)'}
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder={isArabic ? 'ملاحظة أو تاريخ الحفل المرتقب (اختياري)...' : 'Précisions ou date souhaitée (optionnel)...'}
                  value={contactNote}
                  onChange={(e) => setContactNote(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {isArabic ? 'إرسال طلب الاستفسار مجاناً' : 'Envoyer ma demande gratuitement'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4. FOOTER ACTIONS */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              {isArabic ? 'الأسعار تبدأ من :' : 'Tarif indicatif à partir de :'}
            </div>
            <div className="text-base font-black text-slate-900">
              {ad.priceStartingFrom || 'Sur Devis'}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{isArabic ? 'واتساب مباشر' : 'WhatsApp'}</span>
            </button>
            <a
              href={`tel:${ad.phone}`}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>{isArabic ? 'اتصال' : 'Appeler'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

