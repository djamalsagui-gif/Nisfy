import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Heart, MessageCircle, Share2, Music, Volume2, VolumeX, Play, CheckCircle2, ShoppingBag } from 'lucide-react';
import { SocialPost, UserProfile } from '../../types';
import { useAppStore } from '../../stores/appStore';
import confetti from 'canvas-confetti';
import { datingSounds } from '../../utils/soundEffects';
import { MusicShareModal } from '../music/MusicShareModal';
import { getTrackById, NISFY_MUSIC_CATALOG } from '../../data/musicThemes';
import { getReliableVideoUrl } from '../../utils/videoHelpers';
import { VIDEO_FILTERS } from '../../data/videoStudioPresets';

interface VideoPlayerProps {
  post: SocialPost;
  isActive: boolean;
  onOpenComments: () => void;
  onSelectUser?: (userId: string) => void;
  currentUser?: UserProfile;
  onCreateStoryFromClip?: (post: SocialPost) => void;
  onNavigateToShop?: (productId?: string) => void;
}

export function VideoPlayer({ post, isActive, onOpenComments, onSelectUser, currentUser, onCreateStoryFromClip, onNavigateToShop }: VideoPlayerProps) {
  const { ref, inView } = useInView({
    threshold: 0.6,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const lastTapRef = useRef<number>(0);

  const matchedTrack = post.musicThemeId
    ? getTrackById(post.musicThemeId)
    : NISFY_MUSIC_CATALOG.find((t) => post.musicTitle?.includes(t.title) || post.musicTitle?.includes(t.artist)) || NISFY_MUSIC_CATALOG[0];

  const addXp = useAppStore((state) => state.addXp);

  useEffect(() => {
    if (inView && isActive && videoRef.current) {
      setIsPlaying(true);
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay prevented or interrupted:", error);
          setIsPlaying(false);
        });
      }
      
      const timer = setTimeout(() => addXp(10), 3000);
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [inView, isActive, addXp]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleTogglePlay = () => {
    const now = Date.now();
    // Double tap detection (within 300ms)
    if (now - lastTapRef.current < 300) {
      handleDoubleTapLike();
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => console.warn("Play error:", error));
        }
        setIsPlaying(true);
      }
    }
  };

  const handleDoubleTapLike = () => {
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 900);
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
      addXp(25);
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#FF3823', '#FF6B35', '#38BDF8']
      });
      try {
        datingSounds.playLikeSound();
      } catch (e) {}
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
      addXp(25);
      
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7, x: 0.8 },
        colors: ['#FF3823', '#FF6B35', '#38BDF8']
      });
      
      try {
        datingSounds.playLikeSound();
      } catch (e) {}
    } else {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return count.toString();
  };

  const appliedFilterPreset = VIDEO_FILTERS.find((f) => f.id === post.appliedFilter);

  return (
    <div ref={ref} className="relative w-full h-full snap-start snap-always bg-black flex items-center justify-center select-none overflow-hidden">
      {/* Video layer */}
      <div className="absolute inset-0 cursor-pointer overflow-hidden" onClick={handleTogglePlay}>
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/50 bg-slate-950 gap-2">
            <span className="text-3xl">🎬</span>
            <span className="text-xs font-semibold">Vidéo en cours de chargement...</span>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              src={getReliableVideoUrl(post.videoUrl)}
              poster={post.posterUrl}
              preload="auto"
              className="w-full h-full object-cover transition-all duration-300"
              style={{ filter: appliedFilterPreset?.cssFilter || 'none' }}
              loop
              playsInline
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onError={() => setHasError(true)}
            />
            {/* Subtle Filter Overlay if applied */}
            {appliedFilterPreset?.overlayGradient && (
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50"
                style={{ background: appliedFilterPreset.overlayGradient }}
              />
            )}
          </>
        )}
      </div>

      {/* Burst Heart Animation on Double Tap */}
      {showHeartAnim && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 duration-200">
          <div className="w-24 h-24 bg-[#FF3823]/90 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50">
            <Heart className="w-14 h-14 fill-white text-white animate-bounce" />
          </div>
        </div>
      )}

      {/* Play/Pause indicator center */}
      {!isPlaying && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-16 h-16 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl">
            <Play className="w-8 h-8 text-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Share Toast */}
      {showShareToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full border border-slate-700 shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Lien copié !</span>
        </div>
      )}

      {/* Overlay controls - Right side (Clean & Minimalist TikTok Style) */}
      <div className="absolute right-3 bottom-16 sm:bottom-20 flex flex-col items-center gap-4.5 z-20">
        {/* Creator Avatar */}
        <div 
          className="relative cursor-pointer group"
          onClick={(e) => {
            e.stopPropagation();
            onSelectUser?.(post.authorId);
          }}
          title="Voir le profil"
        >
          <img 
            src={post.authorAvatar} 
            alt={post.authorPseudo} 
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white/90 object-cover shadow-lg group-hover:scale-105 transition-transform" 
          />
        </div>

        {/* Like Button */}
        <button 
          type="button" 
          className="flex flex-col items-center gap-1 cursor-pointer group bg-transparent border-0 p-0" 
          onClick={handleLike}
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-black/35 backdrop-blur-sm rounded-full flex items-center justify-center group-active:scale-75 transition-transform shadow-md">
            <Heart className={`w-5.5 h-5.5 transition-colors ${isLiked ? 'fill-[#FF3823] text-[#FF3823] scale-110' : 'text-white'}`} />
          </div>
          <span className="text-white text-[11px] font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{formatCount(likesCount)}</span>
        </button>

        {/* Comments Button */}
        <button 
          type="button" 
          className="flex flex-col items-center gap-1 cursor-pointer group bg-transparent border-0 p-0" 
          onClick={(e) => { e.stopPropagation(); onOpenComments(); }}
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-black/35 backdrop-blur-sm rounded-full flex items-center justify-center group-active:scale-75 transition-transform shadow-md">
            <MessageCircle className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="text-white text-[11px] font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{formatCount(post.commentsCount || (post.comments ? post.comments.length : 0))}</span>
        </button>

        {/* Share Button */}
        <button 
          type="button" 
          className="flex flex-col items-center gap-1 cursor-pointer group bg-transparent border-0 p-0" 
          onClick={handleShare}
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-black/35 backdrop-blur-sm rounded-full flex items-center justify-center group-active:scale-75 transition-transform shadow-md">
            <Share2 className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="text-white text-[10px] font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{formatCount(post.sharesCount || 32)}</span>
        </button>

        {/* Sound Toggle */}
        <button 
          type="button"
          onClick={handleToggleMute}
          className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/90 hover:text-white transition-colors shadow-md cursor-pointer"
          title={isMuted ? 'Activer le son' : 'Couper le son'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-white/70" /> : <Volume2 className="w-4 h-4 text-[#38BDF8]" />}
        </button>
      </div>

      {/* Overlay info - Bottom left (Clean, Uncluttered, Elegant) */}
      <div className="absolute bottom-4 sm:bottom-6 left-3 sm:left-5 right-18 sm:right-22 z-20 flex flex-col gap-1.5 pointer-events-none">
        {/* Author Pseudo & City */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button 
            type="button"
            onClick={() => onSelectUser?.(post.authorId)}
            className="text-white font-bold text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>@{post.authorPseudo}</span>
            {post.authorVerified && (
              <span className="inline-block w-3.5 h-3.5 bg-[#FF3823] rounded-full text-white text-[8px] leading-tight text-center font-black">✓</span>
            )}
          </button>
          {post.authorCity && (
            <span className="text-white/75 text-xs font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              • {post.authorCity}
            </span>
          )}
        </div>

        {/* Short clean caption */}
        <p className="text-white text-xs sm:text-sm font-normal line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] max-w-lg leading-snug">
          {post.title || post.description}
        </p>

        {/* Subtle Tagged Product Pill (if present) */}
        {post.taggedProductTitle && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onNavigateToShop?.(post.taggedProductId);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/15 text-white shadow-md pointer-events-auto cursor-pointer transition-all w-max max-w-xs mt-0.5"
            title="Voir le produit"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-semibold truncate text-white/95">{post.taggedProductTitle}</span>
            {post.taggedProductPriceDzd && (
              <span className="text-[11px] font-bold text-amber-300 shrink-0">• {post.taggedProductPriceDzd.toLocaleString()} DA</span>
            )}
          </div>
        )}

        {/* Minimal Music Pill */}
        {(post.musicTitle || matchedTrack) && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setIsMusicModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-white/90 bg-black/40 hover:bg-black/60 w-max max-w-full px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 mt-0.5 pointer-events-auto cursor-pointer transition-colors"
            title="Écouter le son"
          >
            <Music className="w-3 h-3 text-[#38BDF8] shrink-0" />
            <span className="text-[11px] font-medium truncate max-w-[220px] sm:max-w-[320px]">
              {matchedTrack ? `${matchedTrack.title} • ${matchedTrack.artist}` : post.musicTitle}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar (Bottom Line) */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/20 z-30">
        <div 
          className="h-full bg-[#FF3823] transition-all duration-100" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Subtle bottom shadow gradient for legibility */}
      <div className="absolute bottom-0 left-0 w-full h-44 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none z-10" />

      {/* Music & Story Modal */}
      {isMusicModalOpen && matchedTrack && (
        <MusicShareModal
          isOpen={isMusicModalOpen}
          onClose={() => setIsMusicModalOpen(false)}
          track={matchedTrack}
          currentUser={currentUser}
          onCreateStory={() => {
            setIsMusicModalOpen(false);
            onCreateStoryFromClip?.(post);
          }}
        />
      )}
    </div>
  );
}
