import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Heart,
  MessageCircle,
  Users,
  Sparkles,
  Send,
  X,
  Plus,
  Flame,
  ShieldCheck,
  Gift,
  Share2,
  Smile,
  RefreshCw,
  Camera,
  Play,
} from 'lucide-react';
import { LiveSession, LiveComment, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { WILAYAS_69 } from '../data/wilayas';

interface LiveStreamViewProps {
  currentUser: UserProfile;
  liveSessions: LiveSession[];
  liveComments: Record<string, LiveComment[]>;
  onStartLive: (newSession: LiveSession) => void;
  onEndLive: (sessionId: string) => void;
  onSendComment: (liveId: string, comment: LiveComment) => void;
  onSendLike: (liveId: string) => void;
  onViewProfile?: (userId: string) => void;
}

const VIRTUAL_GIFTS = [
  { id: 'gift_rose', name: 'Rose Rouge', icon: '🌹', cost: 1 },
  { id: 'gift_tea', name: 'Thé à la menthe DZ', icon: '☕', cost: 2 },
  { id: 'gift_ring', name: 'Bague Zawaj', icon: '💍', cost: 5 },
  { id: 'gift_jasmin', name: 'Fleur de Jasmin', icon: '🌸', cost: 3 },
  { id: 'gift_mandole', name: 'Mandole Chaâbi', icon: '🪕', cost: 4 },
];

export function LiveStreamView({
  currentUser,
  liveSessions,
  liveComments,
  onStartLive,
  onEndLive,
  onSendComment,
  onSendLike,
  onViewProfile,
}: LiveStreamViewProps) {
  const { t, isArabic } = useLanguage();

  // Active room state
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const [isHostMode, setIsHostMode] = useState(false);

  // Host creation state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [liveTitle, setLiveTitle] = useState('');
  const [liveTopic, setLiveTopic] = useState('Rencontre sérieuse & Mariage');
  const [liveWilaya, setLiveWilaya] = useState(currentUser.city);

  // Media Stream controls
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [beautyFilter, setBeautyFilter] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const hostVideoRef = useRef<HTMLVideoElement>(null);
  const viewerVideoRef = useRef<HTMLVideoElement>(null);

  // Interactive Live controls
  const [commentText, setCommentText] = useState('');
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; icon: string }[]>([]);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [showGiftsMenu, setShowGiftsMenu] = useState(false);
  const [liveDuration, setLiveDuration] = useState(0);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll comments
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveComments, activeSession]);

  // Live timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession && activeSession.isLive) {
      interval = setInterval(() => {
        setLiveDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setLiveDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  // Handle Camera initialization for host
  useEffect(() => {
    if (isHostMode && isCameraOn) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: isMicOn })
        .then((stream) => {
          setLocalStream(stream);
          if (hostVideoRef.current) {
            hostVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.log('Camera access info:', err);
        });
    } else {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isHostMode, isCameraOn]);

  // Handle Simulated Live Viewer Activity
  useEffect(() => {
    if (!activeSession) return;

    // Periodic simulated viewer comment to make live buzzing and lively
    const simulatedUsers = [
      { name: 'Yanis DZ', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80', text: 'Salam alaykoum depuis Tizi Ouzou 🇩🇿' },
      { name: 'Rania B.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80', text: 'Très beau sujet, que Dieu facilite nos projets ! ✨' },
      { name: 'Bilal 69', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80', text: 'Un grand coucou à tous les frères et sœurs ! 🦁' },
      { name: 'Nour El Houda', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80', text: 'MachaAllah respect et honneur aux 69 wilayas 🌸' },
    ];

    const commentInterval = setInterval(() => {
      const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
      const newComment: LiveComment = {
        id: `auto_${Date.now()}_${Math.random()}`,
        liveId: activeSession.id,
        senderId: `sim_${Math.random()}`,
        senderName: randomUser.name,
        senderAvatar: randomUser.avatar,
        content: randomUser.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onSendComment(activeSession.id, newComment);
    }, 9000);

    return () => clearInterval(commentInterval);
  }, [activeSession]);

  const handleLaunchLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitle.trim()) return;

    const newSession: LiveSession = {
      id: `live_${currentUser.id}_${Date.now()}`,
      hostId: currentUser.id,
      hostName: currentUser.pseudo,
      hostAvatar: currentUser.avatar,
      hostCity: liveWilaya || currentUser.city,
      title: liveTitle.trim(),
      topic: liveTopic,
      viewersCount: 1,
      likesCount: 1,
      isLive: true,
      startedAt: 'À l’instant',
      tags: [liveTopic, liveWilaya.split('-')[0].trim()],
      pinnedNotice: `Bienvenue sur le Live de ${currentUser.pseudo} ! Respectez les règles de bienséance.`,
    };

    onStartLive(newSession);
    setActiveSession(newSession);
    setIsHostMode(true);
    setShowCreateModal(false);
  };

  const handleLeaveLive = () => {
    if (isHostMode && activeSession) {
      onEndLive(activeSession.id);
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    setActiveSession(null);
    setIsHostMode(false);
  };

  const handleSendLiveComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeSession) return;

    const comment: LiveComment = {
      id: `lc_${Date.now()}`,
      liveId: activeSession.id,
      senderId: currentUser.id,
      senderName: currentUser.pseudo,
      senderAvatar: currentUser.avatar,
      content: commentText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onSendComment(activeSession.id, comment);
    setCommentText('');
  };

  const handleSendGift = (gift: typeof VIRTUAL_GIFTS[0]) => {
    if (!activeSession) return;

    const giftComment: LiveComment = {
      id: `gift_${Date.now()}`,
      liveId: activeSession.id,
      senderId: currentUser.id,
      senderName: currentUser.pseudo,
      senderAvatar: currentUser.avatar,
      content: `A envoyé ${gift.name} ${gift.icon} !`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isGift: true,
      giftIcon: gift.icon,
      giftName: gift.name,
    };

    onSendComment(activeSession.id, giftComment);
    onSendLike(activeSession.id);
    setShowGiftsMenu(false);
    triggerFloatingHeart(gift.icon);
  };

  const triggerFloatingHeart = (icon = '❤️') => {
    if (!activeSession) return;
    onSendLike(activeSession.id);
    const newHeart = {
      id: Date.now() + Math.random(),
      x: 40 + Math.random() * 40,
      icon,
    };
    setFloatingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 2000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentComments = activeSession ? liveComments[activeSession.id] || [] : [];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
      {/* If currently in an active Live room (either as Host or Viewer) */}
      {activeSession ? (
        <div className="relative w-full max-w-5xl mx-auto bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-rose-500/20 grid grid-cols-1 lg:grid-cols-12 min-h-[75vh] max-h-[85vh]">
          {/* Main Video Stream Frame */}
          <div className="lg:col-span-8 relative bg-black flex items-center justify-center overflow-hidden min-h-[400px]">
            {isHostMode ? (
              isCameraOn ? (
                <video
                  ref={hostVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover scale-x-[-1] ${
                    beautyFilter ? 'brightness-105 contrast-105 saturate-110' : ''
                  }`}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-24 h-24 rounded-full border-4 border-rose-500/40 p-1">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.pseudo}
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-white font-bold text-lg">{currentUser.pseudo}</h3>
                  <p className="text-slate-400 text-xs">{t.liveCameraOff}</p>
                </div>
              )
            ) : (
              // Viewer Mode - Showing host stream or fallback video
              <div className="relative w-full h-full flex items-center justify-center">
                {activeSession.previewVideoUrl ? (
                  <video
                    ref={viewerVideoRef}
                    src={activeSession.previewVideoUrl}
                    autoPlay
                    loop
                    playsInline
                    muted={!isMicOn}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback gracefully on media error
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <img
                      src={activeSession.hostAvatar}
                      alt={activeSession.hostName}
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 rounded-full object-cover border-4 border-rose-500/50"
                    />
                    <h3 className="text-white font-bold text-lg">{activeSession.hostName}</h3>
                    <p className="text-rose-400 text-xs font-semibold">{activeSession.hostCity}</p>
                  </div>
                )}
              </div>
            )}

            {/* Top Stream Header Overlay */}
            <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between gap-2 z-20">
              <div className="flex items-center gap-2 sm:gap-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <img
                  src={isHostMode ? currentUser.avatar : activeSession.hostAvatar}
                  alt="Host Avatar"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-rose-500"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold text-xs sm:text-sm">
                      {isHostMode ? currentUser.pseudo : activeSession.hostName}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-600 text-white animate-pulse">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 truncate max-w-[140px] sm:max-w-[200px]">
                    {isHostMode ? liveWilaya : activeSession.hostCity}
                  </p>
                </div>
              </div>

              {/* Viewers counter & Timer */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs font-bold">
                  <Users className="w-3.5 h-3.5 text-rose-400" />
                  <span>{activeSession.viewersCount + (isHostMode ? 12 : 0)}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-slate-300 text-xs font-medium">
                  <span>⏱️ {formatDuration(liveDuration)}</span>
                </div>
                <button
                  onClick={handleLeaveLive}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{isHostMode ? t.stopLiveBtn : t.closeVideo}</span>
                </button>
              </div>
            </div>

            {/* Pinned Notice banner */}
            {activeSession.pinnedNotice && (
              <div className="absolute top-16 inset-x-4 z-20 flex justify-center">
                <div className="bg-slate-900/80 backdrop-blur-md border border-amber-500/30 text-amber-200 px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg max-w-md">
                  <span className="text-sm">📌</span>
                  <span className="truncate">{activeSession.pinnedNotice}</span>
                </div>
              </div>
            )}

            {/* Floating Hearts Container */}
            <div className="absolute inset-y-0 right-4 w-20 pointer-events-none z-30 overflow-hidden flex flex-col justify-end">
              {floatingHearts.map((heart) => (
                <div
                  key={heart.id}
                  className="text-3xl animate-bounce transition-all duration-1000 mb-4"
                  style={{
                    transform: `translateY(-${Math.random() * 200}px)`,
                    opacity: 0.9,
                  }}
                >
                  {heart.icon}
                </div>
              ))}
            </div>

            {/* Host Bottom Toolbar Controls */}
            {isHostMode && (
              <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`p-3 rounded-full backdrop-blur-md border transition-all ${
                    isCameraOn
                      ? 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                      : 'bg-rose-600 border-rose-500 text-white'
                  }`}
                  title={isCameraOn ? t.liveCameraOff : t.liveCameraOn}
                >
                  {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-full backdrop-blur-md border transition-all ${
                    isMicOn
                      ? 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                      : 'bg-rose-600 border-rose-500 text-white'
                  }`}
                  title={isMicOn ? t.liveMicOff : t.liveMicOn}
                >
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setBeautyFilter(!beautyFilter)}
                  className={`p-3 rounded-full backdrop-blur-md border transition-all ${
                    beautyFilter
                      ? 'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                  }`}
                  title={t.liveBeautyFilter}
                >
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Side Live Chat & Interactions */}
          <div className="lg:col-span-4 bg-slate-900 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col h-full max-h-[85vh]">
            {/* Live Chat Header */}
            <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <MessageCircle className="w-4 h-4 text-rose-400" />
                <span>{isArabic ? 'شات البث المباشر' : 'Chat en Direct'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>{activeSession.likesCount}</span>
                </span>
              </div>
            </div>

            {/* Comments List Feed */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
              {currentComments.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p>{isArabic ? 'كن أول من يعلق في هذا البث المباشر !' : 'Soyez le premier à commenter ce Live !'}</p>
                </div>
              ) : (
                currentComments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-2 rounded-xl transition-all ${
                      comment.isGift
                        ? 'bg-gradient-to-r from-rose-950/60 to-pink-950/60 border border-rose-500/30 text-rose-200'
                        : 'bg-white/5 border border-white/5 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <img
                        src={comment.senderAvatar}
                        alt={comment.senderName}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/10 mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-white text-[11px] hover:underline cursor-pointer">
                            {comment.senderName}
                          </span>
                          <span className="text-[9px] text-slate-500">{comment.timestamp}</span>
                        </div>
                        {comment.isGift ? (
                          <div className="flex items-center gap-1 text-rose-300 font-bold mt-0.5">
                            <span className="text-base">{comment.giftIcon}</span>
                            <span>{comment.content}</span>
                          </div>
                        ) : (
                          <p className="text-slate-300 mt-0.5">{comment.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={commentsEndRef} />
            </div>

            {/* Virtual Gifts Bar */}
            {showGiftsMenu && (
              <div className="p-3 bg-slate-950 border-t border-white/10 grid grid-cols-5 gap-2 animate-in fade-in">
                {VIRTUAL_GIFTS.map((gift) => (
                  <button
                    key={gift.id}
                    onClick={() => handleSendGift(gift)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-rose-600/30 border border-white/10 flex flex-col items-center gap-1 text-center transition-transform hover:scale-105 cursor-pointer"
                  >
                    <span className="text-2xl">{gift.icon}</span>
                    <span className="text-[9px] text-slate-300 font-bold truncate max-w-[50px]">
                      {gift.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input & Action Bar */}
            <div className="p-3 border-t border-white/10 bg-slate-950 flex flex-col gap-2">
              <form onSubmit={handleSendLiveComment} className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t.liveTypeMessage}
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Action buttons (Gifts & Fast Likes) */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowGiftsMenu(!showGiftsMenu)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    showGiftsMenu
                      ? 'bg-rose-600 text-white'
                      : 'bg-white/10 text-rose-300 hover:bg-white/20'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>{t.liveSendGift}</span>
                </button>

                <button
                  type="button"
                  onClick={() => triggerFloatingHeart('❤️')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold shadow-md hover:scale-105 transition-transform flex items-center gap-1 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>{t.liveLike}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Main Live Stream Discovery Page */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold border border-white/20">
                <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>{isArabic ? 'بث فيديو مباشر • 69 ولاية' : 'Live Vidéo & Rencontres Directes'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{t.liveTitle}</h2>
              <p className="text-xs sm:text-sm text-rose-100 max-w-xl">{t.liveSubtitle}</p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="z-10 px-6 py-3.5 bg-white text-rose-600 hover:bg-rose-50 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-105 cursor-pointer shrink-0"
            >
              <Video className="w-5 h-5 text-rose-600" />
              <span>{t.startLiveBtn}</span>
            </button>
          </div>

          {/* Active Live Broadcasts Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-black text-slate-900">{t.activeLives}</h3>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-xs font-extrabold">
                  {liveSessions.filter((s) => s.isLive).length}
                </span>
              </div>
            </div>

            {liveSessions.filter((s) => s.isLive).length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
                  <Radio className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800">{t.noLivesActive}</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">{t.noLivesDesc}</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-xs hover:bg-rose-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.startLiveBtn}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveSessions
                  .filter((s) => s.isLive)
                  .map((session) => (
                    <div
                      key={session.id}
                      className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 hover:shadow-xl transition-all flex flex-col group"
                    >
                      {/* Live Thumbnail / Video preview */}
                      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                        {session.previewVideoUrl ? (
                          <video
                            src={session.previewVideoUrl}
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onMouseOver={(e) => {
                              try {
                                const p = e.currentTarget.play();
                                if (p) p.catch(() => {});
                              } catch {
                                // ignore
                              }
                            }}
                            onMouseOut={(e) => {
                              try {
                                e.currentTarget.pause();
                              } catch {
                                // ignore
                              }
                            }}
                          />
                        ) : (
                          <img
                            src={session.hostAvatar}
                            alt={session.hostName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}

                        {/* Live Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-lg animate-pulse">
                            <Radio className="w-3 h-3" />
                            <span>LIVE</span>
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white">
                            <Users className="w-3 h-3 text-rose-400" />
                            <span>{session.viewersCount}</span>
                          </span>
                        </div>

                        {/* City Badge */}
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-white/10">
                            {session.hostCity}
                          </span>
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={session.hostAvatar}
                              alt={session.hostName}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full object-cover border border-rose-400"
                            />
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{session.hostName}</h4>
                              <p className="text-[10px] text-slate-500">{session.startedAt}</p>
                            </div>
                          </div>
                          <h5 className="font-bold text-slate-800 text-sm line-clamp-2">
                            {session.title}
                          </h5>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {session.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-600"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            setActiveSession(session);
                            setIsHostMode(session.hostId === currentUser.id);
                          }}
                          className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 text-white rounded-xl font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>{t.joinLiveBtn}</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal to Launch a New Live */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-rose-600" />
                <h3 className="font-black text-slate-900 text-lg">{t.startLiveBtn}</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLaunchLive} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isArabic ? 'عنوان البث المباشر' : 'Titre du Live'}
                </label>
                <input
                  type="text"
                  required
                  value={liveTitle}
                  onChange={(e) => setLiveTitle(e.target.value)}
                  placeholder={
                    isArabic
                      ? 'مثال : دردشة محترمة حول مشروع الزواج والتعارف الجاد...'
                      : 'Ex: Échange et discussion zawaj dans le respect...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isArabic ? 'الموضوع الأساسي' : 'Sujet principal'}
                </label>
                <select
                  value={liveTopic}
                  onChange={(e) => setLiveTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="Rencontre sérieuse & Mariage">💍 Rencontre sérieuse & Mariage (Zawaj)</option>
                  <option value="Diaspora DZ & Vie à l’étranger">✈️ Diaspora DZ & Vie à l’étranger</option>
                  <option value="Culture, Chaâbi & Patrimoine">🇩🇿 Culture, Chaâbi & Patrimoine</option>
                  <option value="Discussion amicale & Entraide">🤝 Discussion amicale & Entraide</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.wilayaLabel}
                </label>
                <select
                  value={liveWilaya}
                  onChange={(e) => setLiveWilaya(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  {WILAYAS_69.map((w) => (
                    <option key={w.code} value={`${w.code} - ${w.name}`}>
                      {w.code} - {w.name} {w.isDiaspora ? '🌍 (Diaspora)' : '🇩🇿'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-rose-50 rounded-2xl p-3 text-[11px] text-rose-800 border border-rose-100 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p>
                  {isArabic
                    ? 'البث المباشر مخصص للتعارف المحترم ومشاريع الزواج. يُرجى الالتزام بالأخلاق وحسن المعاملة.'
                    : 'Les Lives sur Nisfy sont dédiés à la rencontre sincère et respectueuse. Tout comportement inapproprié sera immédiatement modéré.'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  {t.startLiveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
