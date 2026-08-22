import React, { useRef, useState } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Heart,
  Calendar,
  Sparkles,
  Film,
  Image as ImageIcon,
  Youtube,
  ExternalLink,
} from 'lucide-react';
import { ProfileVideo } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: 'photo' | 'video';
  mediaUrl: string;
  title?: string;
  authorName?: string;
  authorAvatar?: string;
  authorCity?: string;
  videoDetails?: ProfileVideo;
}

export function MediaViewerModal({
  isOpen,
  onClose,
  mediaType,
  mediaUrl,
  title,
  authorName,
  authorAvatar,
  authorCity,
  videoDetails,
}: MediaViewerModalProps) {
  const { isArabic } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likesCount, setLikesCount] = useState(24);
  const [hasLiked, setHasLiked] = useState(false);
  const [showHeartsAnim, setShowHeartsAnim] = useState(false);

  const [videoError, setVideoError] = useState(false);

  if (!isOpen) return null;

  const isYouTube = mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be');

  // Extract YouTube ID if applicable
  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0] || '';
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || '';
    }
    return videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
      : url;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setHasLiked(true);
      setLikesCount((prev) => prev + 1);
      setShowHeartsAnim(true);
      setTimeout(() => setShowHeartsAnim(false), 1200);
    } else {
      setHasLiked(false);
      setLikesCount((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-3">
            {authorAvatar && (
              <img
                src={authorAvatar}
                alt={authorName || 'Avatar'}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-rose-500/50"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-white font-bold text-sm sm:text-base">
                  {authorName || 'Membre DZ69'}
                </h4>
                {mediaType === 'video' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    <Film className="w-3 h-3" />
                    <span>Vidéo HD</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <ImageIcon className="w-3 h-3" />
                    <span>Photo</span>
                  </span>
                )}
              </div>
              {authorCity && (
                <p className="text-xs text-slate-400">{authorCity}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isYouTube && (
              <a
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Content Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[65vh]">
          {mediaType === 'video' ? (
            isYouTube ? (
              <div className="relative w-full h-full aspect-video flex items-center justify-center bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(mediaUrl)}
                  title={title || 'Vidéo'}
                  className="w-full h-full border-0 min-h-[350px]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                {videoError ? (
                  <div className="flex flex-col items-center justify-center text-white/70 p-8 space-y-2 text-center">
                    <Film className="w-12 h-12 text-rose-400" />
                    <p className="text-sm font-bold">{title || 'Vidéo'}</p>
                    <p className="text-xs text-slate-400">Le lecteur vidéo a rencontré un problème de chargement.</p>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      src={mediaUrl}
                      autoPlay
                      loop
                      playsInline
                      muted={isMuted}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onError={() => setVideoError(true)}
                      className="max-w-full max-h-[60vh] object-contain cursor-pointer"
                      onClick={togglePlay}
                    />

                    {/* Center Play/Pause indicator button on hover/pause */}
                    {!isPlaying && (
                      <button
                        onClick={togglePlay}
                        className="absolute p-4 rounded-full bg-rose-600/90 text-white shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Play className="w-8 h-8 fill-white ml-0.5" />
                      </button>
                    )}
                  </>
                )}

                {/* Floating Hearts Animation */}
                {showHeartsAnim && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="animate-ping text-5xl">❤️</div>
                  </div>
                )}

                {/* Video Bottom Controls Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between gap-3 text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 fill-white" />
                      )}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-rose-400" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    {title && (
                      <span className="text-xs font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                        {title}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <img
                src={mediaUrl}
                alt={title || 'Photo'}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[60vh] object-contain rounded-xl"
              />
            </div>
          )}
        </div>

        {/* Footer Info & Interactions */}
        <div className="p-3.5 sm:p-4 border-t border-white/10 bg-slate-900/90 flex items-center justify-between gap-3">
          <div>
            <h5 className="text-white font-bold text-sm">
              {title || (mediaType === 'video' ? 'Vidéo de profil' : 'Photo de profil')}
            </h5>
            <p className="text-xs text-slate-400">
              {videoDetails?.createdAt
                ? `Publié ${videoDetails.createdAt}`
                : isArabic
                ? 'محتوى موثق في منصة نصفي'
                : 'Média vérifié sur la communauté Nisfy'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isYouTube && (
              <a
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Youtube className="w-3.5 h-3.5 text-red-400" />
                <span>{isArabic ? 'مشاهدة في يوتيوب' : 'Ouvrir sur YouTube'}</span>
              </a>
            )}
            <button
              onClick={handleLike}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                hasLiked
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white' : ''}`} />
              <span>{likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
