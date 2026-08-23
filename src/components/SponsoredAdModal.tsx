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
  ExternalLink,
  Play,
  Send,
  Youtube,
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
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [messageSent, setMessageSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactNote, setContactNote] = useState('');

  if (!ad) return null;

  const currentImage = selectedImg || ad.bannerImage;

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
    
    // Direct dispatch / notification to admin
    const subject = encodeURIComponent(`[DEMANDE ANNONCE NISFY] ${ad.brandName} - Contact ${contactName || 'Client'}`);
    const body = encodeURIComponent(
      `Salam alaykoum,\n\nNouvelle demande client pour l'offre ${ad.brandName} :\n` +
        `- Nom client : ${contactName || 'Non précisé'}\n` +
        `- Téléphone : ${contactPhone}\n` +
        `- Note / Date : ${contactNote || 'Non précisé'}\n` +
        `- Code Promo : ${ad.promoCode}\n\n` +
        `Envoyé depuis https://nisfy.vercel.app/`
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col relative"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white transition-colors backdrop-blur-md cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Visual Banner / Embedded Player */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden shrink-0">
          <img
            src={currentImage}
            alt={ad.brandName}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              {isArabic ? 'إعلان معتمد • شريك نصفي' : 'Sponsor Officiel Nisfy'}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600/90 text-white font-medium text-xs backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isArabic ? 'خدمة موثوقة' : 'Prestataire Vérifié'}
            </span>
          </div>

          {/* Brand Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                  {isArabic ? ad.categoryLabelAr : ad.categoryLabel}
                </div>
                <h2 className="text-2xl font-extrabold text-white leading-tight">
                  {isArabic ? ad.brandNameAr : ad.brandName}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-200">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold ml-1">{ad.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{ad.reviewsCount} {isArabic ? 'تقييم زبائن' : 'avis certifiés'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {ad.wilayas[0]}
                  </span>
                </div>
              </div>
        </div>

        {/* Gallery Thumbnails */}
        {ad.galleryImages && ad.galleryImages.length > 1 && (
          <div className="flex gap-2 p-3 bg-slate-100 border-b border-slate-200 overflow-x-auto">
            {ad.galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImg(img)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  currentImage === img ? 'border-amber-500 scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Promo Code Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-rose-50 to-emerald-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
                  {isArabic ? 'عرض حصري لأعضاء نصفي' : 'Offre Spéciale Membres Nisfy'}
                </div>
                <div className="text-base font-bold text-slate-900">
                  {isArabic ? ad.discountBadgeAr : ad.discountBadge}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="px-3 py-2 bg-white rounded-lg border border-amber-300 font-mono font-bold text-slate-800 text-sm tracking-wider shadow-sm">
                {ad.promoCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    {isArabic ? 'تم النسخ' : 'Copié !'}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    {isArabic ? 'نسخ الكود' : 'Copier'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {isArabic ? ad.taglineAr : ad.tagline}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {isArabic ? ad.descriptionAr : ad.description}
            </p>
          </div>

          {/* Key Features */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              {isArabic ? 'أبرز مميزات الخدمة' : 'Ce qui est inclus & Avantages'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(isArabic ? ad.featuresAr : ad.features).map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Callback / Inquiry form */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" />
              {isArabic ? 'طلب اتصال أو حجز موعد سريع' : 'Demande de rappel & Devis express'}
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              {isArabic
                ? 'اترك رقمك وسيتواصل معك ممثل الخدمة خلال ساعات قليلة'
                : 'Laissez vos coordonnées pour recevoir la brochure complète et un devis personnalisé'}
            </p>

            {messageSent ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-sm flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
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
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <input
                    type="tel"
                    placeholder={isArabic ? 'رقم الهاتف (05/06/07)' : 'Téléphone (05xx / 06xx / 07xx)'}
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder={isArabic ? 'ملاحظة أو تاريخ الحفل المرتقب (اختياري)...' : 'Précisions ou date souhaitée (optionnel)...'}
                  value={contactNote}
                  onChange={(e) => setContactNote(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {isArabic ? 'إرسال طلب الاستفسار مجاناً' : 'Envoyer ma demande gratuitement'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <div className="text-xs text-slate-500">
              {isArabic ? 'الأسعار تبدأ من :' : 'Tarif indicatif à partir de :'}
            </div>
            <div className="text-base font-extrabold text-slate-900">
              {ad.priceStartingFrom || 'Sur Devis'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppClick}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              {isArabic ? 'واتساب مباشر' : 'WhatsApp'}
            </button>
            <a
              href={`tel:${ad.phone}`}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md"
            >
              <Phone className="w-4 h-4" />
              {isArabic ? 'اتصال' : 'Appeler'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
