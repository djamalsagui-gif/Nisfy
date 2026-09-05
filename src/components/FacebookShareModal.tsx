import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Globe2,
  Send,
  MessageCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { openFacebookShare, openWhatsAppShare, copyToClipboard } from '../utils/facebookShare';
import { useLanguage } from '../context/LanguageContext';

export function FacebookIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

interface FacebookShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  content?: string;
  url?: string;
  wilayaName?: string;
  wilaya?: string;
  categoryName?: string;
  imageUrl?: string;
  authorName?: string;
}

export function FacebookShareModal({
  isOpen,
  onClose,
  title,
  description,
  content,
  url,
  wilayaName,
  wilaya,
  categoryName,
  imageUrl,
  authorName,
}: FacebookShareModalProps) {
  const { isArabic } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [customHashtag, setCustomHashtag] = useState('#Nisfy #MariageDZ #ZawajAlgerie');

  if (!isOpen) return null;

  const targetUrl = url || window.location.href;
  const effectiveDescription = description || content || '';
  const effectiveWilaya = wilayaName || wilaya || '';

  const handleShareFacebook = () => {
    openFacebookShare({
      url: targetUrl,
      title,
      quote: `${title}${authorName ? ` (${authorName})` : ''}\n${effectiveDescription}`,
      hashtag: customHashtag,
      wilayaName: effectiveWilaya,
    });
  };

  const handleShareWhatsApp = () => {
    openWhatsAppShare(`${title} 🇩🇿 ${customHashtag}`, targetUrl);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(targetUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shadow-md shadow-blue-500/30">
              <FacebookIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {isArabic ? 'مشاركة عبر فيسبوك والمجموعات' : 'Partager sur Facebook & Groupes DZ'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'نشر في المجموعات الجزائرية والصفحات الرسمية' : 'Diffusez vers vos groupes et votre communauté'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Card (Facebook Post Mockup) */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#FF3823] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              🇩🇿
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                  Nisfy (نصفي) • منصة الزواج الجزائري
                </span>
                <span className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-black">
                  ✓
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {isArabic ? 'الآن • متاح للمشاركة العامة' : 'À l’instant • Public'}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
              {title}
            </h4>
            {description && (
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {imageUrl && (
            <div className="rounded-xl overflow-hidden h-44 w-full bg-slate-900 border border-slate-200 dark:border-slate-700">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
            <span>nisfy.app 🇩🇿</span>
            {wilayaName && <span className="font-bold text-[#FF3823]">{wilayaName}</span>}
          </div>
        </div>

        {/* Hashtag Presets */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>{isArabic ? 'الوسوم الجزائرية المقترحة :' : 'Hashtags populaires :'}</span>
            <span className="text-[10px] text-[#1877F2] font-semibold">Facebook & Insta</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              '#Nisfy #ZawajDZ',
              '#MariageAlgérien #69Wilayas',
              '#Algerie #Diaspora',
              '#TrousseauMariée #Chedda',
            ].map((tagGroup) => (
              <button
                key={tagGroup}
                type="button"
                onClick={() => setCustomHashtag(tagGroup)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                  customHashtag === tagGroup
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-[#1877F2] text-[#1877F2]'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                {tagGroup}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* 1. Facebook Official Share */}
          <button
            type="button"
            onClick={handleShareFacebook}
            className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] active:scale-[0.98] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            <FacebookIcon className="w-5 h-5 fill-current" />
            <span>{isArabic ? 'نشر على فيسبوك / المجموعات' : 'Partager sur Facebook / Groupes'}</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
          </button>

          {/* 2. WhatsApp & Copy Link */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp DZ</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-black">
                    {isArabic ? 'تم النسخ !' : 'Copié !'}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>{isArabic ? 'نسخ الرابط' : 'Copier le lien'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
