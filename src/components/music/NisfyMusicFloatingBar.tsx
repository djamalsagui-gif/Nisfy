import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX, X, Music, Disc3 } from 'lucide-react';
import { musicAudioEngine, AudioPlaybackState } from '../../utils/musicAudioEngine';
import { MusicTrack } from '../../data/musicThemes';
import { useLanguage } from '../../context/LanguageContext';
import { ActiveTab } from '../../types';

interface NisfyMusicFloatingBarProps {
  activeTab: ActiveTab;
  onOpenMusicTab: () => void;
}

export function NisfyMusicFloatingBar({
  activeTab,
  onOpenMusicTab,
}: NisfyMusicFloatingBarProps) {
  const { isArabic } = useLanguage();
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>('stopped');
  const [isMuted, setIsMuted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const unsub = musicAudioEngine.subscribe((track, state) => {
      setCurrentTrack(track);
      setPlaybackState(state);
      setIsMuted(musicAudioEngine.isSoundMuted());
      if (state === 'playing') {
        setIsDismissed(false);
      }
    });
    return unsub;
  }, []);

  // Don't display floating bar if dismissed, or no track, or if user is already on the dedicated music tab
  if (isDismissed || !currentTrack || activeTab === 'music' || playbackState === 'stopped') {
    return null;
  }

  const isPlaying = playbackState === 'playing';

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    musicAudioEngine.togglePlay();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    musicAudioEngine.playNext();
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    musicAudioEngine.toggleMute();
    setIsMuted(musicAudioEngine.isSoundMuted());
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    musicAudioEngine.stop();
    setIsDismissed(true);
  };

  return (
    <div
      onClick={onOpenMusicTab}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-40 bg-slate-950/95 text-white backdrop-blur-xl rounded-2xl p-2.5 sm:p-3 border border-slate-800 shadow-2xl flex items-center justify-between gap-3 cursor-pointer hover:border-orange-500/60 transition-all animate-in slide-in-from-bottom-5"
    >
      {/* Left: Vinyl disk with spin and track details */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="relative shrink-0">
          <div
            className={`w-10 h-10 rounded-full bg-slate-900 border-2 border-orange-500/80 overflow-hidden relative flex items-center justify-center ${
              isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
            }`}
          >
            <img
              src={currentTrack.coverImage}
              alt={currentTrack.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-white/80 absolute" />
          </div>

          {isPlaying && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF3823] rounded-full border-2 border-slate-950 animate-ping" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h5 className="text-xs font-black text-white truncate line-clamp-1">
              {isArabic ? currentTrack.titleAr || currentTrack.title : currentTrack.title}
            </h5>
          </div>
          <p className="text-[10px] text-orange-400 font-bold truncate">
            {currentTrack.artist} • <span className="text-slate-400">{isArabic ? currentTrack.genreLabelAr : currentTrack.genreLabel}</span>
          </p>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleTogglePlay}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#FF3823] text-white flex items-center justify-center shadow-sm active:scale-95 cursor-pointer"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          title="Suivant"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleToggleMute}
          className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          title="Muet"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-300" />}
        </button>

        <button
          type="button"
          onClick={handleClose}
          className="w-6 h-6 rounded-full text-slate-500 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer ml-1 rtl:mr-1 rtl:ml-0"
          title="Fermer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
