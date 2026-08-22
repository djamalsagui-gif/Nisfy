import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Briefcase,
  Play,
  Pause,
  Flower2,
} from 'lucide-react';
import { UserProfile, ProfileVideo } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { datingSounds } from '../utils/soundEffects';

interface NisfyStoriesViewerProps {
  users: UserProfile[];
  initialUserIndex: number;
  initialVideoIndex?: number;
  onClose: () => void;
  onLike: (profile: UserProfile) => void;
  onSuperLike: (profile: UserProfile, isJasmin?: boolean) => void;
  onStartDirectChat: (profile: UserProfile, message?: string) => void;
  onOpenProfile: (profile: UserProfile) => void;
}

export function NisfyStoriesViewer({
  users,
  initialUserIndex,
  initialVideoIndex = 0,
  onClose,
  onLike,
  onSuperLike,
  onStartDirectChat,
  onOpenProfile,
}: NisfyStoriesViewerProps) {
  const { t, isArabic } = useLanguage();
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(initialVideoIndex);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentUser = users[currentUserIndex];
  const videos = currentUser?.videos || [];
  const currentVideo: ProfileVideo | undefined = videos[currentVideoIndex];

  useEffect(() => {
    setProgress(0);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentUserIndex, currentVideoIndex]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 15;
      setProgress((current / duration) * 100);
    }
  };

  const handleVideoEnded = () => {
    // Next video or next user
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex((prev) => prev + 1);
    } else if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex((prev) => prev + 1);
      setCurrentVideoIndex(0);
    } else {
      onClose();
    }
  };

  const handleNext = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex((prev) => prev + 1);
    } else if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex((prev) => prev + 1);
      setCurrentVideoIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex((prev) => prev - 1);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex((prev) => prev - 1);
      const prevVideos = users[currentUserIndex - 1]?.videos || [];
      setCurrentVideoIndex(Math.max(0, prevVideos.length - 1));
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleJasmin = () => {
    datingSounds.playJasminSendSound();
    onSuperLike(currentUser, true);
  };

  if (!currentUser || !currentVideo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 select-none">
      {/* Container simulating vertical smartphone screen */}
      <div className="relative w-full sm:max-w-md h-full sm:h-[88vh] sm:rounded-3xl bg-slate-950 overflow-hidden shadow-2xl flex flex-col border border-white/10">
        {/* Top Story Progress Bars */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center gap-1.5">
          {videos.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width:
                    idx < currentVideoIndex
                      ? '100%'
                      : idx === currentVideoIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Header with User Info & Close */}
        <div className="absolute top-6 inset-x-3 z-30 flex items-center justify-between text-white">
          <div
            className="flex items-center gap-2 cursor-pointer bg-black/40 backdrop-blur-md py-1 px-2.5 rounded-full border border-white/20 hover:bg-black/60 transition-colors"
            onClick={() => onOpenProfile(currentUser)}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.pseudo}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-rose-500"
            />
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-black tracking-tight">{currentUser.pseudo}</span>
                {currentUser.marriageVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <span className="text-[10px] text-white/80 font-medium">
                {currentUser.city.split('-')[1]?.trim() || currentUser.city}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative flex-1 w-full bg-black flex items-center justify-center cursor-pointer" onClick={togglePlay}>
          <video
            ref={videoRef}
            src={currentVideo.url}
            muted={isMuted}
            playsInline
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onError={() => {
              setIsPlaying(false);
            }}
            className="w-full h-full object-cover"
          />

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20 pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Left/Right Click Nav Zones */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white/80 hover:bg-black/60 z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white/80 hover:bg-black/60 z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Overlay with Story Title & Quick Actions */}
        <div className="absolute bottom-0 inset-x-0 z-30 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-white">
          <div className="mb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {currentVideo.title}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">
              {currentUser.bio}
            </p>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
            {/* Jasmin Super-Like */}
            <button
              onClick={handleJasmin}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 hover:scale-102 transition-transform cursor-pointer"
            >
              <Flower2 className="w-4 h-4 text-white animate-spin-slow" />
              <span>{isArabic ? 'إرسال ياسمينة' : 'Offrir un Jasmin'}</span>
            </button>

            {/* Direct Chat */}
            <button
              onClick={() => {
                onClose();
                onStartDirectChat(currentUser, `Salam ${currentUser.pseudo} ! J’ai adoré ta vidéo story sur NISFY 🇩🇿`);
              }}
              className="py-2.5 px-4 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-indigo-300" />
              <span>{isArabic ? 'دردشة' : 'Discuter'}</span>
            </button>

            {/* Like Heart */}
            <button
              onClick={() => {
                datingSounds.playLikeSound();
                onLike(currentUser);
              }}
              className="p-2.5 rounded-2xl bg-rose-600/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
              title="Aimer ce profil"
            >
              <Heart className="w-5 h-5 fill-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
