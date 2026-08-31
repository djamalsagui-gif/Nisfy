import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Copy,
  Check,
  Share2,
  Sparkles,
  Film,
  Flame,
  Crown,
  Smartphone,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Music,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PromoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToFeed?: () => void;
}

export function PromoVideoModal({
  isOpen,
  onClose,
}: PromoVideoModalProps) {
  const { isArabic } = useLanguage();

  // Mode: 'video_clip' (HTML5 video) or 'interactive_reel' (animated dynamic reel)
  const [playerMode, setPlayerMode] = useState<'video_clip' | 'interactive_reel'>('interactive_reel');
  const [selectedSpot, setSelectedSpot] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [reelScene, setReelScene] = useState<number>(0);
  const [reelProgress, setReelProgress] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [hasVideoLoadError, setHasVideoLoadError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 3 HD Promo Spots with fallback
  const promoSpots = [
    {
      id: 'spot-official',
      title: isArabic ? 'الإعلان الرسمي Nisfy 2026 🇩🇿' : 'Spot Officiel Nisfy 2026 🇩🇿',
      category: isArabic ? 'الزواج والتعارف الجاد' : 'Mariage & Rencontre Sérieuse',
      badge: '69 Wilayas & Diaspora',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1080',
      description: isArabic
        ? 'الإعلان الرسمي لجمع القلوب بالحلال في 69 ولاية والمهجر مع توثيق الهوية'
        : 'Spot promotionnel officiel : trouvez votre moitié dans le respect des valeurs algériennes.',
    },
    {
      id: 'spot-mariage',
      title: isArabic ? 'أعراس وتقاليد الجزائر 👑' : 'Mariage & Coutumes DZ 👑',
      category: isArabic ? 'تقاليد وزفاف' : 'Traditions & Trousseau',
      badge: 'Zawaj Halal 100%',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      poster: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1080',
      description: isArabic
        ? 'دليل العرس الجزائري، كاراكو، قفطان وأفضل المحلات والمنظمين'
        : 'Spécial mariage algérien, tenues traditionnelles et prestataires certifiés.',
    },
    {
      id: 'spot-hayaa',
      title: isArabic ? 'الأمان ونمط الحياء 🛡️' : 'Sécurité & Mode Hayaa 🛡️',
      category: isArabic ? 'أمان وخصوصية' : 'Confidentialité & Respect',
      badge: 'Trust Score 100%',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      poster: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1080',
      description: isArabic
        ? 'حماية تامة للصور، فحص الهويات وحسابات موثوقة بدون إزعاج'
        : 'Protection maximale des profils, floutage optionnel et zéro faux profil.',
    },
  ];

  // Dynamic Reel Slides for the interactive engine
  const reelSlides = [
    {
      title: '🇩🇿 NISFY (نصفي)',
      subtitle: 'L’App N°1 du Mariage & de la Rencontre Sérieuse',
      subtitleAr: 'التطبيق الأول للزواج واللقاء الجاد في الجزائر والمهجر',
      tag: '💍 100% Halal & Respect',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      bgGradient: 'from-orange-600/90 via-slate-900/95 to-black',
      stats: '⭐ 100 000+ Membres Sérieux',
      badgeColor: 'bg-[#FF3823]',
    },
    {
      title: '69 WILAYAS & DIASPORA 🌍',
      subtitle: 'D’Alger à Tamanrasset, de Paris à Montréal et Dubaï',
      subtitleAr: 'من الجزائر العاصمة إلى تمنراست، ومن فرنسا إلى كندا والخليج',
      tag: '📍 Partout avec vous',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
      bgGradient: 'from-amber-600/90 via-slate-900/95 to-black',
      stats: '🇩🇿 69 Wilayas Connectées',
      badgeColor: 'bg-amber-500',
    },
    {
      title: 'TRUST SCORE & SÉCURITÉ 🛡️',
      subtitle: 'Profils Vérifiés par IA & Pièce d’Identité • Mode Hayaa',
      subtitleAr: 'توثيق الهوية بالذكاء الاصطناعي ونمط الحياء لحماية الخصوصية',
      tag: '🔒 Zéro Faux Profil',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
      bgGradient: 'from-emerald-700/90 via-slate-900/95 to-black',
      stats: '✓ 100% Modéré 24h/24',
      badgeColor: 'bg-emerald-600',
    },
    {
      title: 'COMMENCEZ VOTRE MEKTOUB 📲',
      subtitle: 'Téléchargez Nisfy dès aujourd’hui et trouvez l’âme sœur !',
      subtitleAr: 'حمّل التطبيق الآن مجاناً وابدأ قصة مكتوبك بالحلال',
      tag: '✨ Inscription Rapide & Gratuite',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
      bgGradient: 'from-rose-600/90 via-slate-900/95 to-black',
      stats: '💍 Rencontre & Mariage',
      badgeColor: 'bg-pink-600',
    },
  ];

  const viralPostText = `🇩🇿💍 نصفي (Nisfy) : L’application N°1 du Mariage & de la Rencontre Sérieuse pour les Algériens !

Tu cherches ta moitié pour la vie dans le respect des valeurs, des traditions et avec un engagement sérieux ? 
✨ Rejoins Nisfy, la plateforme pensée pour réunir les cœurs à travers les 69 Wilayas et la Diaspora.

✅ Profils vérifiés & authentiques (Trust Score)
✅ Mode Hayaa & Intimité protégée
✅ Communautés par Wilaya & Diaspora
✅ Guide & Marketplace mariage complet (Zinet el Ârass)

📲 Télécharge l'application dès maintenant et commence ton histoire !
👉 Rendez-vous sur Nisfy !

#Nisfy #MariageDZ #ZawajHalal #Algerie #69Wilayas #DiasporaDZ #RencontreSerieuse #MariageAlgerien #Karakou`;

  // Autoplay handler when modal opens or spot changes in video_clip mode
  useEffect(() => {
    if (isOpen && playerMode === 'video_clip') {
      setHasVideoLoadError(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                videoRef.current.play().catch(() => {
                  setPlayerMode('interactive_reel');
                });
              }
            });
        }
      }
    }
  }, [isOpen, selectedSpot, playerMode]);

  // Sync background audio (Idir cover) with player state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (isPlaying && isOpen && !isMuted) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted, isOpen]);

  // Dynamic Interactive Reel Auto-rotation loop
  useEffect(() => {
    if (!isOpen || playerMode !== 'interactive_reel' || !isPlaying) return;

    const interval = setInterval(() => {
      setReelProgress((prev) => {
        if (prev >= 100) {
          setReelScene((curr) => (curr + 1) % reelSlides.length);
          return 0;
        }
        return prev + 2.5; // ~4 seconds per slide
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, playerMode, isPlaying, reelScene]);

  if (!isOpen) return null;

  const currentSpot = promoSpots[selectedSpot];
  const currentSlide = reelSlides[reelScene];

  const togglePlay = () => {
    if (playerMode === 'video_clip' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentSpot.videoUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(viralPostText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🇩🇿💍 نصفي (Nisfy) : L’application N°1 du Mariage & de la Rencontre Sérieuse en Algérie !\n\nRegarde la vidéo promotionnelle : ${currentSpot.videoUrl}\n\n${viralPostText.slice(0, 180)}...`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-y-auto shadow-2xl text-white flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#FF3823] text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isArabic ? '🎬 فيديو إعلاني وترويجي لتطبيق نصفي' : '🎬 Vidéo Promotionnelle Officielle Nisfy'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FF3823]/20 text-[#FF6B35] border border-[#FF3823]/30 animate-pulse">
                  HD 1080p
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isArabic
                  ? 'شاهد الفيديو المتحرك، حمله مباشرة أو انشر النص الجاهز على تيك توك وفيسبوك'
                  : 'Regardez le spot animé, téléchargez-le ou partagez le texte viral sur vos réseaux'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Switch Player Mode: Dynamic Reel Story vs MP4 Clip */}
          <div className="flex items-center justify-between gap-3 flex-wrap bg-slate-950/60 p-2 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => {
                  setPlayerMode('interactive_reel');
                  setIsPlaying(true);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                  playerMode === 'interactive_reel'
                    ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white border-orange-400 shadow-md shadow-orange-500/25'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isArabic ? '✨ ستوري تيك توك التفاعلي (موصى به)' : '✨ Story TikTok & Reels (Interactif)'}</span>
              </button>

              {promoSpots.map((spot, idx) => (
                <button
                  key={spot.id}
                  onClick={() => {
                    setSelectedSpot(idx);
                    setPlayerMode('video_clip');
                    setHasVideoLoadError(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    playerMode === 'video_clip' && selectedSpot === idx
                      ? 'bg-[#FF3823] text-white shadow-md shadow-orange-500/25'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{spot.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Video Box & Social Kit */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Video Player Box */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-[310px] sm:max-w-[330px] aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border-2 border-orange-500/40 group">
                
                {/* Background Music Audio Element (Idir - A Vava Inouva placeholder) */}
                <audio
                  ref={audioRef}
                  src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=acoustic-guitars-acoustic-music-background-111867.mp3"
                  loop
                  preload="auto"
                />

                {/* Music Badge Overlay */}
                <div className="absolute top-12 inset-x-3 pointer-events-none z-20 flex justify-end">
                  <div className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white flex items-center gap-1.5 border border-white/10 shadow-lg overflow-hidden max-w-[140px]">
                    <Music className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                    <div className="whitespace-nowrap animate-marquee">
                      Idir - A Vava Inouva (Cover)
                    </div>
                  </div>
                </div>

                {playerMode === 'video_clip' && !hasVideoLoadError ? (
                  /* --- HTML5 VIDEO PLAYER WITH SAFE FALLBACK --- */
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      poster={currentSpot.poster}
                      playsInline
                      autoPlay
                      loop
                      muted={isMuted}
                      className="w-full h-full object-cover"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onError={() => {
                        setHasVideoLoadError(true);
                        setPlayerMode('interactive_reel');
                      }}
                    >
                      <source src={currentSpot.videoUrl} type="video/mp4" />
                    </video>

                    {/* Overlay Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                      <div className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-black text-white flex items-center gap-1.5 border border-white/20">
                        <span className="w-2 h-2 rounded-full bg-[#FF3823] animate-pulse"></span>
                        Nisfy نصفي HD
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-[#FF3823]/80 backdrop-blur-md text-[10px] font-bold text-white">
                        {currentSpot.badge}
                      </div>
                    </div>

                    {/* Tap overlay to play/pause */}
                    <div
                      onClick={togglePlay}
                      className="absolute inset-0 bg-transparent flex items-center justify-center cursor-pointer"
                    >
                      {!isPlaying && (
                        <div className="w-16 h-16 rounded-full bg-[#FF3823]/90 text-white flex items-center justify-center shadow-2xl scale-110 transition-transform">
                          <Play className="w-8 h-8 fill-white ml-1" />
                        </div>
                      )}
                    </div>

                    {/* Bottom Controls Bar */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between bg-black/75 backdrop-blur-md p-2 rounded-2xl border border-white/10 z-10">
                      <button
                        onClick={togglePlay}
                        className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                      </button>

                      <div className="text-center px-2 flex-1">
                        <p className="text-[11px] font-bold text-white truncate">
                          {currentSpot.title}
                        </p>
                      </div>

                      <button
                        onClick={toggleMute}
                        className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                        title={isMuted ? 'Activer le son' : 'Couper le son'}
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 text-rose-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* --- DYNAMIC TIKTOK REEL SIMULATOR (100% RELIABLE) --- */
                  <div className={`relative w-full h-full bg-gradient-to-b ${currentSlide.bgGradient} p-4 flex flex-col justify-between overflow-hidden select-none`}>
                    {/* Background Image with animated zoom */}
                    <img
                      src={currentSlide.image}
                      alt={currentSlide.title}
                      className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 scale-105 transition-transform duration-1000"
                    />

                    {/* Top Progress Bars */}
                    <div className="relative z-10 space-y-2">
                      <div className="grid grid-cols-4 gap-1.5">
                        {reelSlides.map((_, idx) => (
                          <div key={idx} className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                            <div
                              className="h-full bg-white transition-all duration-100"
                              style={{
                                width: idx < reelScene ? '100%' : idx === reelScene ? `${reelProgress}%` : '0%',
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full ${currentSlide.badgeColor} backdrop-blur-md text-[10px] font-bold text-white border border-white/20 shadow`}>
                          {currentSlide.tag}
                        </span>
                        <span className="text-[10px] font-bold text-amber-300">
                          {reelScene + 1} / {reelSlides.length}
                        </span>
                      </div>
                    </div>

                    {/* Center Animated Message */}
                    <div className="relative z-10 text-center space-y-3 my-auto animate-in zoom-in-95 duration-300">
                      <div className="w-16 h-16 rounded-2xl bg-[#FF3823]/30 border border-[#FF3823] text-white flex items-center justify-center mx-auto shadow-2xl">
                        <Crown className="w-8 h-8 text-amber-300" />
                      </div>

                      <h4 className="text-xl font-black text-white leading-tight drop-shadow-md">
                        {currentSlide.title}
                      </h4>

                      <p className="text-sm font-bold text-amber-300 font-arabic">
                        {currentSlide.subtitleAr}
                      </p>

                      <p className="text-xs text-slate-200 max-w-xs mx-auto leading-relaxed drop-shadow">
                        {currentSlide.subtitle}
                      </p>

                      <div className="inline-block px-3 py-1 rounded-xl bg-black/60 border border-white/20 text-xs font-black text-emerald-400">
                        {currentSlide.stats}
                      </div>
                    </div>

                    {/* Bottom Reel Action */}
                    <div className="relative z-10 space-y-2">
                      
                      {/* Audio Controls for Reel */}
                      <div className="flex justify-center mb-2">
                        <button
                          onClick={toggleMute}
                          className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center gap-2 border border-white/10 shadow-lg cursor-pointer transition-colors"
                        >
                          {isMuted ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                              <span className="text-[10px] font-bold">Activer la musique</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[10px] font-bold">Musique Activée</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            setReelScene((curr) => (curr > 0 ? curr - 1 : reelSlides.length - 1));
                            setReelProgress(0);
                          }}
                          className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="text-[10px] text-center text-slate-300 font-bold">
                          Nisfy © 2026 • Mariage & 69 Wilayas
                        </div>
                        <button
                          onClick={() => {
                            setReelScene((curr) => (curr + 1) % reelSlides.length);
                            setReelProgress(0);
                          }}
                          className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Player Status Text */}
              <p className="text-xs text-slate-400 mt-2 text-center flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                {playerMode === 'interactive_reel'
                  ? (isArabic ? 'عرض ستوري تيك توك يعمل بسلاسة' : 'Story animée HD en lecture continue')
                  : (isArabic ? 'الفيديو يعمل بجودة عالية HD' : 'Vidéo en lecture continue HD 1080p')}
              </p>
            </div>

            {/* Right: Quick Actions & Viral Social Media Kit */}
            <div className="lg:col-span-6 space-y-4">
              {/* Direct Download Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/80 border border-slate-700 space-y-3">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  {isArabic ? 'تحميل مباشر أو فتح الفيديو في علامة تبويب جديدة' : 'Téléchargement Direct du Fichier Vidéo (MP4)'}
                </h4>

                <p className="text-xs text-slate-300">
                  {isArabic
                    ? 'يمكنك تحميل ملف الفيديو MP4 مباشرة على هاتفك أو حاسوبك لاستخدامه في الإعلانات.'
                    : 'Téléchargez le fichier MP4 HD directement sur votre appareil pour vos publications TikTok, Reels ou publicités.'}
                </p>

                <div className="space-y-2">
                  {/* Direct Download Link */}
                  <a
                    href={currentSpot.videoUrl}
                    download="Nisfy-Spot-Promo-Officiel.mp4"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF3823] hover:opacity-95 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isArabic ? '📥 تحميل الفيديو (MP4 HD)' : '📥 Télécharger la Vidéo (MP4 HD)'}</span>
                  </a>

                  {/* Open in new tab */}
                  <a
                    href={currentSpot.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{isArabic ? 'فتح الفيديو مباشرة في نافذة جديدة' : 'Ouvrir le flux vidéo plein écran'}</span>
                  </a>

                  {/* Copy Link */}
                  <button
                    onClick={handleCopyLink}
                    className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Lien MP4 copié !' : 'Copier le lien direct de la vidéo'}</span>
                  </button>
                </div>
              </div>

              {/* 1-Click Social Sharing */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                  {isArabic ? 'مشاركة فورية على مواقع التواصل' : 'Partage Immédiat en 1 Clic'}
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleShareWhatsApp}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={handleShareFacebook}
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Facebook</span>
                  </button>
                </div>
              </div>

              {/* Viral Description to Copy */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {isArabic ? 'نص منشور جاهز للنشر (TikTok / Reels / FB)' : 'Texte Prêt à Publier (TikTok / Reels / FB)'}
                  </h4>
                  <button
                    onClick={handleCopyText}
                    className="px-2.5 py-1 rounded-lg bg-[#FF3823]/20 hover:bg-[#FF3823]/30 text-[#FF6B35] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedText ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 font-mono max-h-32 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {viralPostText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
