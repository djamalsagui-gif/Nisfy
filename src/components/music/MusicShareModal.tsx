import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  MessageCircle,
  Sparkles,
  Play,
  Pause,
  Film,
  Camera,
  Heart,
  Globe,
  Radio,
} from 'lucide-react';
import { MusicTrack } from '../../data/musicThemes';
import { musicAudioEngine, AudioPlaybackState } from '../../utils/musicAudioEngine';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';

interface MusicShareModalProps {
  track: MusicTrack | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser?: any;
  onCreateStory?: () => void;
  onCreateStoryWithMusic?: (track: MusicTrack) => void;
  onShareToFeed?: (track: MusicTrack, caption: string) => void;
}

export function MusicShareModal({
  track,
  isOpen,
  onClose,
  currentUser,
  onCreateStory,
  onCreateStoryWithMusic,
  onShareToFeed,
}: MusicShareModalProps) {
  const { isArabic } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [customCaption, setCustomCaption] = useState(
    'Découvrez ce magnifique thème musical pour nos préparatifs de mariage sur Nisfy ! 🇩🇿💍'
  );
  const [sharedToFeedSuccess, setSharedToFeedSuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen || !track) return null;

  const shareUrl = `${window.location.origin}/?track=${track.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${customCaption}\n🎵 ${track.title} - ${track.artist}\n🔗 ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🎵 *${track.title}* (${track.genreLabel})\n` +
      `✨ _${track.artist}_\n\n` +
      `"${customCaption}"\n\n` +
      `Écouter sur Nisfy 🇩🇿 : ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Nisfy Audio • ${track.title}`,
          text: `${customCaption}\n${track.title} (${track.artist})`,
          url: shareUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handlePostToWall = () => {
    if (onShareToFeed) {
      onShareToFeed(track, customCaption);
    }
    setSharedToFeedSuccess(true);
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setSharedToFeedSuccess(false);
      onClose();
    }, 2000);
  };

  const handleStoryCreate = () => {
    if (onCreateStoryWithMusic) {
      onCreateStoryWithMusic(track);
    } else if (onCreateStory) {
      onCreateStory();
    }
    onClose();
  };

  const togglePreview = () => {
    musicAudioEngine.togglePlay(track);
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header with Cover */}
        <div className="relative h-44 sm:h-48 w-full bg-slate-950 overflow-hidden shrink-0">
          <img
            src={track.coverImage}
            alt={track.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Track Summary Over Header */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePreview}
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#FF3823] hover:scale-105 transition-transform flex items-center justify-center text-white shadow-lg cursor-pointer shrink-0"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </button>
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
                  {isArabic ? track.genreLabelAr : track.genreLabel}
                </span>
                <h3 className="text-base font-black text-white truncate max-w-[240px] sm:max-w-xs mt-0.5">
                  {isArabic ? track.titleAr : track.title}
                </h3>
                <p className="text-xs text-orange-200 truncate">{track.artist}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Custom Message Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isArabic ? 'رسالة أو تعليق مخصص للمشاركة :' : 'Votre message d’accompagnement :'}
            </label>
            <textarea
              rows={2}
              value={customCaption}
              onChange={(e) => setCustomCaption(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-800 resize-none bg-slate-50"
              placeholder="Écrivez un mot doux ou une invitation..."
            />
          </div>

          {/* 🌟 1-CLICK STORY CREATOR BUTTON (Primary action) */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] text-white shadow-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <Film className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black leading-tight">
                  {isArabic ? 'إنشاء قصة أو مقطع (Story) على حائطي' : 'Créer une Story / Clip sur mon Mur'}
                </h4>
                <p className="text-[11px] text-orange-100 opacity-90 leading-tight mt-0.5">
                  {isArabic ? 'دمج الموسيقى مع فيديو أو صورة ونشرها لمتابعيك' : 'Associer ce thème musical à votre clip vidéo'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleStoryCreate}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-950 hover:bg-orange-100 text-xs font-black shrink-0 transition-transform active:scale-95 shadow-md cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF3823]" />
              <span>{isArabic ? 'إنشاء +' : 'Créer'}</span>
            </button>
          </div>

          {/* Share Grid Buttons */}
          <div>
            <span className="block text-xs font-bold text-slate-500 mb-2">
              {isArabic ? 'مشاركة عبر القنوات والشبكات :' : 'Partager avec vos abonnés ou vers un autre réseau :'}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-transform hover:scale-102 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1 shadow-xs">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">WhatsApp</span>
                <span className="text-[10px] text-emerald-600">Discussion</span>
              </button>

              {/* Mur Nisfy / Abonnés */}
              <button
                type="button"
                onClick={handlePostToWall}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 transition-transform hover:scale-102 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#FF3823] text-white flex items-center justify-center mb-1 shadow-xs">
                  <Send className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">{isArabic ? 'متابعيني' : 'Mes Abonnés'}</span>
                <span className="text-[10px] text-[#FF3823]">{isArabic ? 'حائط نصفي' : 'Mur Nisfy'}</span>
              </button>

              {/* Instagram / Story */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 transition-transform hover:scale-102 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center mb-1 shadow-xs">
                  <Radio className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Instagram</span>
                <span className="text-[10px] text-pink-600">Story / Reel</span>
              </button>

              {/* Copy Link / Native */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-transform hover:scale-102 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center mb-1 shadow-xs">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                </div>
                <span className="text-xs font-bold">{copied ? (isArabic ? 'تم النسخ' : 'Copié !') : (isArabic ? 'نسخ الرابط' : 'Copier Lien')}</span>
                <span className="text-[10px] text-slate-500">Presse-papier</span>
              </button>
            </div>
          </div>

          {/* Success Toast */}
          {sharedToFeedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{isArabic ? 'تمت مشاركة الموسيقى بنجاح مع متابعيك على الحائط !' : 'Musique partagée avec succès sur votre Mur Nisfy !'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
