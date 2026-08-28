import React, { useState, useEffect } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Video,
} from 'lucide-react';
import { UserProfile } from '../types';
import { datingSounds } from '../utils/soundEffects';
import { useLanguage } from '../context/LanguageContext';

interface CallModalProps {
  targetUser: UserProfile;
  onEndCall: () => void;
}

export function CallModal({ targetUser, onEndCall }: CallModalProps) {
  const { t, isArabic } = useLanguage();
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callStatus, setCallStatus] = useState<'calling' | 'connected'>('calling');


  useEffect(() => {
    // Play match sound as ringtone
    datingSounds.playLikeSound();

    // Connect after 2.5s
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
      datingSounds.playMessageReceived();
    }, 2500);

    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    if (callStatus !== 'connected') return;
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [callStatus]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 text-center text-white shadow-2xl space-y-6 animate-in zoom-in-95">
        {/* Top Status */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF3823]/20 text-orange-200 text-xs font-bold border border-[#FF3823]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
            {callStatus === 'calling' ? (isArabic ? 'جارٍ الاتصال...' : 'Appel en cours...') : (isArabic ? 'مكالمة جارية' : 'En communication')}
          </span>
        </div>

        {/* Avatar with pulse */}
        <div className="relative inline-block mx-auto">
          {callStatus === 'calling' && (
            <span className="absolute -inset-3 rounded-full bg-[#FF3823]/30 animate-ping" />
          )}
          <img
            src={targetUser.avatar}
            alt={targetUser.pseudo}
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-full object-cover border-4 border-[#FF3823] shadow-2xl relative z-10"
          />
        </div>

        <div>
          <h3 className="text-xl font-black text-white">{targetUser.pseudo}</h3>
          <p className="text-xs text-slate-400 mt-1">{targetUser.city}</p>
          <div className="text-sm font-mono font-bold text-[#38BDF8] mt-2">
            {callStatus === 'calling' ? (isArabic ? 'رنين...' : 'Sonnerie...') : formatTimer(callDuration)}
          </div>
        </div>


        {/* In-Call Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          {/* Mute */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isMuted ? 'bg-[#FF3823] text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Couper micro"
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call */}
          <button
            type="button"
            onClick={() => {
              datingSounds.playLikeSound();
              onEndCall();
            }}
            className="w-14 h-14 rounded-2xl bg-[#FF3823] hover:bg-[#FF3823]/90 text-white flex items-center justify-center shadow-lg shadow-[#FF3823]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Raccrocher"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          {/* Speaker */}
          <button
            type="button"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isSpeakerOn ? 'bg-[#38BDF8] text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
