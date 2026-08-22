import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Heart, MessageCircle, Share2, Music, Volume2, VolumeX, Play } from 'lucide-react';
import { SocialPost } from '../../types';
import { useAppStore } from '../../stores/appStore';
import confetti from 'canvas-confetti';
import { datingSounds } from '../../utils/soundEffects';

interface VideoPlayerProps {
  post: SocialPost;
  isActive: boolean;
  onOpenComments: () => void;
}

export function VideoPlayer({ post, isActive, onOpenComments }: VideoPlayerProps) {
  const { ref, inView } = useInView({
    threshold: 0.6,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default to muted for autoplay policies
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [hasError, setHasError] = useState(false);
  
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

  const handleTogglePlay = () => {
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

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <div ref={ref} className="relative w-full h-full snap-start snap-always bg-black flex items-center justify-center">
      {/* Video layer */}
      <div className="absolute inset-0 cursor-pointer" onClick={handleTogglePlay}>
        {hasError ? (
          <div className="w-full h-full flex items-center justify-center text-white/50 bg-slate-900">
            <span className="text-sm">Vidéo non disponible</span>
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
            onError={() => setHasError(true)}
          />
        )}
      </div>

      {/* Play/Pause indicator center */}
      {!isPlaying && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-20 h-20 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Play className="w-10 h-10 text-white translate-x-1" />
          </div>
        </div>
      )}

      {/* Overlay controls - Right side */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20">
        <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={handleLike}>
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-active:scale-90 transition-transform border border-white/10">
            <Heart className={`w-7 h-7 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
          </div>
          <span className="text-white text-xs font-bold drop-shadow-md">{likesCount}</span>
        </div>

        <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={(e) => { e.stopPropagation(); onOpenComments(); }}>
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-active:scale-90 transition-transform border border-white/10">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <span className="text-white text-xs font-bold drop-shadow-md">{post.commentsCount || 0}</span>
        </div>

        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-active:scale-90 transition-transform border border-white/10">
            <Share2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-white text-xs font-bold drop-shadow-md">Partager</span>
        </div>
      </div>

      {/* Overlay info - Bottom left */}
      <div className="absolute bottom-4 left-4 right-20 z-20 flex flex-col gap-3 pointer-events-none">
        <div className="flex items-center gap-2">
          <img src={post.authorAvatar} alt="Author" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
          <div>
            <h3 className="text-white font-bold text-sm drop-shadow-md">{post.authorPseudo}</h3>
            {post.authorCity && (
              <p className="text-white/80 text-xs font-medium drop-shadow-md">{post.authorCity}</p>
            )}
          </div>
        </div>

        <div className="text-white drop-shadow-md">
          <h2 className="font-bold text-base line-clamp-1">{post.title}</h2>
          <p className="text-sm font-medium opacity-90 line-clamp-2 mt-1">{post.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags?.map((tag) => (
              <span key={tag} className="text-amber-300 font-bold text-xs pointer-events-auto">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {post.musicTitle && (
            <div className="flex items-center gap-2 text-white/90 bg-black/30 w-max px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 mt-1 pointer-events-auto">
              <Music className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-xs font-medium truncate max-w-[150px]">{post.musicTitle}</span>
            </div>
          )}
          <button 
            onClick={handleToggleMute}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center pointer-events-auto hover:bg-black/60 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>

      {/* Overlay gradient bottom to top */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />
    </div>
  );
}
