import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Sparkles, Check, Heart, Share2, Trash2 } from 'lucide-react';
import { MusicTrack, NISFY_MUSIC_CATALOG, getAllAvailableTracks, deleteCustomImportedTrack } from '../../data/musicThemes';
import { musicAudioEngine, AudioPlaybackState } from '../../utils/musicAudioEngine';
import { useLanguage } from '../../context/LanguageContext';
import { YouTubeMusicImportModal } from './YouTubeMusicImportModal';

interface MusicSelectorProps {
  selectedTrackId?: string;
  onSelectTrack: (track: MusicTrack) => void;
  categoryFilter?: string;
  title?: string;
  compact?: boolean;
  onShareTrack?: (track: MusicTrack) => void;
  currentUserPseudo?: string;
}

export function MusicSelector({
  selectedTrackId,
  onSelectTrack,
  categoryFilter,
  title,
  compact = false,
  onShareTrack,
  currentUserPseudo,
}: MusicSelectorProps) {
  const { isArabic } = useLanguage();
  const [activeGenre, setActiveGenre] = useState<string>('all');
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>('stopped');
  const [isMuted, setIsMuted] = useState(false);
  const [allTracks, setAllTracks] = useState<MusicTrack[]>([]);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);

  const loadTracks = () => {
    setAllTracks(getAllAvailableTracks());
  };

  useEffect(() => {
    loadTracks();
    const handleUpdate = () => loadTracks();
    window.addEventListener('nisfy_custom_tracks_updated', handleUpdate);
    return () => window.removeEventListener('nisfy_custom_tracks_updated', handleUpdate);
  }, []);

  useEffect(() => {
    const unsubscribe = musicAudioEngine.subscribe((track, state) => {
      setPlayingTrackId(track ? track.id : null);
      setPlaybackState(state);
      setIsMuted(musicAudioEngine.isSoundMuted());
    });
    return unsubscribe;
  }, []);

  const genres = [
    { id: 'all', label: isArabic ? 'الكل' : 'Tous', icon: '✨' },
    { id: 'youtube', label: isArabic ? 'مستورد من يوتيوب 🎬' : 'Mes Imports YouTube 🎬', icon: '▶️' },
    { id: 'traditionnel', label: isArabic ? 'تراثي وأعراس' : 'Traditionnel', icon: '🥁' },
    { id: 'chaabi', label: isArabic ? 'شعبي' : 'Chaâbi', icon: '🪕' },
    { id: 'andalou', label: isArabic ? 'أندلسي ومالوف' : 'Andalou', icon: '🎻' },
    { id: 'lounge', label: isArabic ? 'لاونج متوسطي' : 'Lounge Paella', icon: '🎷' },
    { id: 'romantique', label: isArabic ? 'رومانسي' : 'Romantique', icon: '🎹' },
    { id: 'kabyle', label: isArabic ? 'قبايل' : 'Kabyle', icon: '🪘' },
    { id: 'rai_moderne', label: isArabic ? 'راي عصري' : 'Raï Fusion', icon: '⚡' },
  ];

  const filteredTracks = allTracks.filter((track) => {
    if (activeGenre === 'youtube') return track.isCustomImport || Boolean(track.youtubeId);
    if (activeGenre !== 'all' && track.genre !== activeGenre) return false;
    return true;
  });

  const handleTogglePlay = (track: MusicTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    musicAudioEngine.togglePlay(track);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    musicAudioEngine.toggleMute();
  };

  const handleDeleteCustom = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomImportedTrack(trackId);
    loadTracks();
  };

  return (
    <div className="w-full select-none" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#FF3823] flex items-center justify-center text-white shadow-xs">
            <Music className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              {title || (isArabic ? 'موسيقى وخلفيات الأعراس' : 'Catalogue Musical & Thèmes')}
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
                Audio DZ
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* YouTube Import Trigger Button */}
          <button
            type="button"
            onClick={() => setIsYouTubeModalOpen(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF3823] hover:opacity-95 text-white text-[11px] font-black flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
            title={isArabic ? 'استيراد موسيقى من يوتيوب' : 'Importer depuis YouTube'}
          >
            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span>{isArabic ? '+ استيراد يوتيوب' : '+ Importer YouTube'}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleMute}
            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#FF3823]" /> : <Volume2 className="w-3.5 h-3.5 text-[#38BDF8]" />}
          </button>
        </div>
      </div>

      {/* Genre Filter Pills */}
      {!compact && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2.5 mb-2">
          {genres.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGenre(g.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                activeGenre === g.id
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white shadow-xs scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{g.icon}</span>
              <span>{g.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Tracks Grid */}
      <div className={`grid gap-2.5 ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {filteredTracks.map((track) => {
          const isSelected = selectedTrackId === track.id;
          const isCurrentPlaying = playingTrackId === track.id && playbackState === 'playing';

          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track)}
              className={`relative group rounded-2xl p-3 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#FF6B35]/10 via-[#FF3823]/10 to-[#38BDF8]/10 border-[#FF3823] shadow-md ring-2 ring-[#FF6B35]/30'
                  : 'bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Track Cover / Play Button */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-xs bg-slate-900">
                  <img
                    src={track.coverImage}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div
                    onClick={(e) => handleTogglePlay(track, e)}
                    className={`absolute inset-0 flex items-center justify-center transition-all ${
                      isCurrentPlaying
                        ? 'bg-black/60 text-amber-300 opacity-100'
                        : 'bg-black/30 group-hover:bg-black/50 text-white opacity-90'
                    }`}
                  >
                    {isCurrentPlaying ? (
                      <Pause className="w-5 h-5 fill-amber-300" />
                    ) : (
                      <Play className="w-5 h-5 fill-white" />
                    )}
                  </div>
                </div>

                {/* Track Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{track.icon}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {isArabic ? track.titleAr : track.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {track.artist} • <span className="font-semibold text-[#FF3823]">{isArabic ? track.genreLabelAr : track.genreLabel}</span>
                  </p>

                  <div className="flex items-center gap-2 mt-0.5">
                    {track.isCustomImport && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                        YouTube
                      </span>
                    )}

                    {/* Visual Equalizer if Playing */}
                    {isCurrentPlaying && (
                      <div className="flex items-end gap-0.5 h-3">
                        <span className="w-1 bg-[#FF3823] rounded-full animate-pulse h-full" />
                        <span className="w-1 bg-[#FF6B35] rounded-full animate-pulse h-2/3" />
                        <span className="w-1 bg-[#38BDF8] rounded-full animate-pulse h-4/5" />
                        <span className="w-1 bg-[#FF3823]/60 rounded-full animate-pulse h-1/2" />
                        <span className="text-[9px] font-bold text-[#FF6B35] ml-1">En direct</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {track.isCustomImport && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteCustom(track.id, e)}
                    title={isArabic ? 'حذف من المكتبة' : 'Supprimer'}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 text-slate-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {onShareTrack && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShareTrack(track);
                    }}
                    title={isArabic ? 'مشاركة الموسيقى' : 'Partager la musique'}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                    isSelected
                      ? 'bg-[#FF3823] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  {isSelected ? <Check className="w-4 h-4" /> : <PlusIcon className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* YouTube Import Modal */}
      <YouTubeMusicImportModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        onSelectTrack={(importedTrack) => {
          loadTracks();
          onSelectTrack(importedTrack);
        }}
        currentUserPseudo={currentUserPseudo}
      />
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
