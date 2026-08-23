import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Heart, MessageCircle, Share2, Music, Volume2, VolumeX, Play, MessageSquarePlus, Sparkles, CheckCircle2 } from 'lucide-react';
import { SocialPost, UserProfile } from '../../types';
import { useAppStore } from '../../stores/appStore';
import confetti from 'canvas-confetti';
import { datingSounds } from '../../utils/soundEffects';

interface VideoPlayerProps {
  post: SocialPost;
  isActive: boolean;
  onOpenComments: () => void;
  onSelectUser?: (userId: string) => void;
}

export function VideoPlayer({ post, isActive, onOpenComments, onSelectUser }: VideoPlayerProps) {
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
  const lastTapRef = useRef<number>(0);

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
        colors: ['#f43f5e', '#fb7185', '#fda4af']
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
        colors: ['#ef4444', '#f59e0b']
      });
      
      try {
        datingSounds.playLikeSound();
      } catch (e) {
        // ignore
      }
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

  return (
    <div ref={ref} className="relative w-full h-full snap-start snap-always bg-black flex items-center justify-center select-none">
      {/* Video layer */}
      <div className="absolute inset-0 cursor-pointer" onClick={handleTogglePlay}>
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/50 bg-slate-900 gap-2">
            <span className="text-3xl">🎬</span>
            <span className="text-sm font-semibold">Vidéo en cours de chargement...</span>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={post.videoUrl}
            poster={post.posterUrl}
            className="w-full h-full object-cover"
            loop
            playsInline
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onError={() => setHasError(true)}
          />
        )}
      </div>

      {/* Burst Heart Animation on Double Tap */}
      {showHeartAnim && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 duration-200">
          <div className="w-28 h-28 bg-rose-500/90 rounded-full flex items-center justify-center shadow-2xl shadow-rose-500/50">
            <Heart className="w-16 h-16 fill-white text-white animate-bounce" />
          </div>
        </div>
      )}

      {/* Play/Pause indicator center */}
      {!isPlaying && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-20 h-20 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
            <Play className="w-10 h-10 text-white translate-x-1" />
          </div>
        </div>
      )}

      {/* Share Toast */}
      {showShareToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 text-white text-xs font-bold px-4 py-2 rounded-full border border-slate-700 shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Lien copié dans le presse-papiers ! 🇩🇿</span>
        </div>
      )}

      {/* Overlay controls - Right side (TikTok Style) */}
      <div className="absolute right-3 sm:right-5 bottom-20 sm:bottom-24 flex flex-col items-center gap-5 sm:gap-6 z-20">
        {/* Creator Avatar with Follow/Chat Plus Badge */}
        <div 
          className="relative cursor-pointer group"
          onClick={(e) => {
            e.stopPropagation();
            onSelectUser?.(post.authorId);
          }}
          title="Découvrir le profil"
        >
          <img 
            src={post.authorAvatar} 
            alt={post.authorPseudo} 
            className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-lg group-hover:scale-105 transition-transform" 
          />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full flex items-center justify-center text-white text-[10px] font-black border border-white shadow-xs">
            +
          </div>
        </div>

        {/* Like Button */}
        <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={handleLike}>
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-active:scale-75 transition-transform border border-white/10 shadow-lg hover:bg-black/60">
            <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white'}`} />
          </div>
          <span className="text-white text-[11px] font-black drop-shadow-md">{likesCount}</span>
        </div>

        {/* Comments Button */}
        <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={(e) => { e.stopPropagation(); onOpenComments(); }}>
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-active:scale-75 transition-transform border border-white/10 shadow-lg hover:bg-black/60">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-[11px] font-black drop-shadow-md">{post.commentsCount || (post.comments ? post.comments.length : 0)}</span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={handleShare}>
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-active:scale-75 transition-transform border border-white/10 shadow-lg hover:bg-black/60">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-[10px] font-bold drop-shadow-md">Partager</span>
        </div>

        {/* Sound Toggle */}
        <button 
          onClick={handleToggleMute}
          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/70 transition-colors shadow-lg"
          title={isMuted ? 'Activer le son' : 'Couper le son'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-white/80" /> : <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />}
        </button>
      </div>

      {/* Overlay info - Bottom left */}
      <div className="absolute bottom-4 left-3 sm:left-6 right-20 sm:right-24 z-20 flex flex-col gap-2.5 pointer-events-none">
        {/* Author Header */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div 
            onClick={() => onSelectUser?.(post.authorId)}
            className="flex items-center gap-2 cursor-pointer bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 hover:bg-black/60 transition-colors"
          >
            <span className="text-white font-bold text-xs drop-shadow-md">{post.authorPseudo}</span>
            {post.authorVerified && (
              <span className="px-1.5 py-0.2 bg-rose-500/90 text-white rounded-full text-[9px] font-black">
                DZ69
              </span>
            )}
            {post.authorCity && (
              <span className="text-amber-300 text-[10px] font-semibold">• {post.authorCity}</span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-white drop-shadow-md">
          <h2 className="font-extrabold text-sm sm:text-base leading-tight drop-shadow-lg">{post.title}</h2>
          <p className="text-xs sm:text-sm font-medium opacity-90 line-clamp-2 mt-1 drop-shadow-md">{post.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.tags?.map((tag) => (
              <span key={tag} className="text-amber-300 font-bold text-[11px] pointer-events-auto hover:underline cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Music / Audio Title */}
        {post.musicTitle && (
          <div className="flex items-center gap-2 text-white/90 bg-black/40 w-max max-w-full px-3 py-1 rounded-full backdrop-blur-md border border-white/10 mt-0.5 pointer-events-auto">
            <Music className="w-3 h-3 text-amber-400 shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-[11px] font-semibold truncate max-w-[200px] sm:max-w-[300px]">{post.musicTitle}</span>
          </div>
        )}
      </div>

      {/* Progress Bar (Bottom Line) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-30">
        <div 
          className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 transition-all duration-100" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Overlay gradient bottom to top */}
      <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none z-10" />
    </div>
  );
}
