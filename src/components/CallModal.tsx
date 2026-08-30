import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Video,
  VideoOff,
  Camera,
  Flower2,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { UserProfile } from '../types';
import { datingSounds } from '../utils/soundEffects';
import { useLanguage } from '../context/LanguageContext';

interface CallModalProps {
  targetUser: UserProfile;
  onEndCall: () => void;
  initialVideoMode?: boolean;
}

export function CallModal({ targetUser, onEndCall, initialVideoMode = false }: CallModalProps) {
  const { t, isArabic } = useLanguage();
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(initialVideoMode);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callStatus, setCallStatus] = useState<'calling' | 'connected'>('calling');
  const [showJasminBurst, setShowJasminBurst] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Play sound on dial
    datingSounds.playLikeSound();

    // Connect after 2s
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
      datingSounds.playMessageReceived();
    }, 2000);

    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    if (callStatus !== 'connected') return;
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [callStatus]);

  // Webcam stream management
  useEffect(() => {
    if (isVideoOn) {
      navigator.mediaDevices?.getUserMedia({
        video: { facingMode: cameraFacing },
        audio: false,
      })
        .then((stream) => {
          streamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn('Camera access not granted or not available:', err);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoOn, cameraFacing]);

  const handleSendJasmin = () => {
    datingSounds.playJasminSendSound();
    setShowJasminBurst(true);
    setTimeout(() => setShowJasminBurst(false), 2500);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className={`relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm sm:max-w-md p-6 text-center text-white shadow-2xl space-y-5 overflow-hidden transition-all duration-300 ${
        isVideoOn ? 'h-[520px] sm:h-[580px] flex flex-col justify-between' : ''
      }`}>
        {/* Jasmin Celebration Animation Burst */}
        {showJasminBurst && (
          <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center animate-in zoom-in-50 duration-300">
            <div className="text-6xl animate-bounce">🌸✨💍✨🌸</div>
            <p className="mt-2 text-sm font-black text-amber-300 bg-black/60 px-4 py-1.5 rounded-full border border-amber-400/40">
              {isArabic ? 'باقة ياسمين نصفي 🇩🇿' : 'Jasmin d’Or envoyé ! 🇩🇿'}
            </p>
          </div>
        )}

        {/* Video Mode Screen */}
        {isVideoOn ? (
          <div className="absolute inset-0 z-0 bg-slate-950">
            {/* Target User Video (Simulated / Avatar backdrop) */}
            <div className="relative w-full h-full">
              <img
                src={targetUser.avatar}
                alt={targetUser.pseudo}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-75 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

              {/* Local User Mini Camera PIP */}
              <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-28 h-40 rounded-2xl border-2 border-white/40 shadow-xl overflow-hidden bg-slate-800 z-20">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <button
                  type="button"
                  onClick={() => setCameraFacing((f) => (f === 'user' ? 'environment' : 'user'))}
                  className="absolute bottom-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                  title="Changer de caméra"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Top Status Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-semibold text-[11px]">
              {isArabic ? 'مشفر وآمن 🇩🇿' : 'Sécurisé NISFY 🇩🇿'}
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF3823]/20 text-orange-200 text-xs font-bold border border-[#FF3823]/40 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
            {callStatus === 'calling' ? (isArabic ? 'جارٍ الاتصال...' : 'Appel en cours...') : (isArabic ? 'مكالمة جارية' : 'En communication')}
          </span>
        </div>

        {/* Audio Mode Main Body */}
        {!isVideoOn && (
          <div className="space-y-4">
            {/* Avatar with pulse */}
            <div className="relative inline-block mx-auto">
              {callStatus === 'calling' && (
                <span className="absolute -inset-3 rounded-full bg-[#FF3823]/30 animate-ping" />
              )}
              <img
                src={targetUser.avatar}
                alt={targetUser.pseudo}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#FF3823] shadow-2xl relative z-10"
              />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">{targetUser.pseudo}</h3>
              <p className="text-xs text-slate-400 mt-1">{targetUser.city} ({targetUser.wilayaCode || '16'})</p>
              <div className="text-sm font-mono font-bold text-[#38BDF8] mt-2">
                {callStatus === 'calling' ? (isArabic ? 'رنين...' : 'Sonnerie...') : formatTimer(callDuration)}
              </div>
            </div>
          </div>
        )}

        {/* Video Mode Header Info */}
        {isVideoOn && (
          <div className="relative z-10 text-left rtl:text-right">
            <h3 className="text-lg font-black text-white drop-shadow-md">{targetUser.pseudo}</h3>
            <p className="text-xs text-white/80 drop-shadow-xs">{targetUser.city} • {formatTimer(callDuration)}</p>
          </div>
        )}

        {/* Quick Reactions Bar During Call */}
        <div className="relative z-10 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleSendJasmin}
            className="px-3.5 py-1.5 rounded-full bg-amber-500/30 hover:bg-amber-500/50 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Flower2 className="w-4 h-4 text-amber-300" />
            <span>{isArabic ? 'إرسال ياسمين' : 'Jasmin DZ'}</span>
          </button>
        </div>

        {/* In-Call Bottom Controls */}
        <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4 pt-2">
          {/* Mute */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${
              isMuted ? 'bg-[#FF3823] text-white' : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 backdrop-blur-xs border border-white/10'
            }`}
            title="Couper micro"
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Toggle Video/Camera */}
          <button
            type="button"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${
              isVideoOn ? 'bg-[#38BDF8] text-slate-950 font-bold' : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 backdrop-blur-xs border border-white/10'
            }`}
            title="Activer/Désactiver caméra"
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* End Call */}
          <button
            type="button"
            onClick={() => {
              datingSounds.playLikeSound();
              onEndCall();
            }}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#FF3823] hover:bg-[#FF3823]/90 text-white flex items-center justify-center shadow-lg shadow-[#FF3823]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Raccrocher"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          {/* Speaker */}
          <button
            type="button"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${
              isSpeakerOn ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 backdrop-blur-xs border border-white/10'
            }`}
            title="Haut-parleur"
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
