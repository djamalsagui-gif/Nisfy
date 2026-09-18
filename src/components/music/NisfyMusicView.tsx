import React, { useState, useEffect, useMemo } from 'react';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Share2,
  Sparkles,
  Plus,
  Search,
  Check,
  Heart,
  Radio,
  SlidersHorizontal,
  Flame,
  Globe,
  Trash2,
  Disc3,
  ExternalLink,
  ChevronRight,
  Headphones,
  RotateCcw,
} from 'lucide-react';
import {
  MusicTrack,
  MusicGenreId,
  NISFY_MUSIC_CATALOG,
  NISFY_GENRES_CONFIG,
  getAllAvailableTracks,
  deleteCustomImportedTrack,
  CURATED_YOUTUBE_SUGGESTIONS,
  CuratedYouTubeTrackSuggestion,
} from '../../data/musicThemes';
import { musicAudioEngine, AudioPlaybackState } from '../../utils/musicAudioEngine';
import { useLanguage } from '../../context/LanguageContext';
import { YouTubeMusicImportModal } from './YouTubeMusicImportModal';
import { MusicShareModal } from './MusicShareModal';
import { datingSounds } from '../../utils/soundEffects';

interface NisfyMusicViewProps {
  currentUser?: any;
  onSelectTab?: (tab: any) => void;
  onSelectWeddingSong?: (track: MusicTrack) => void;
}

export function NisfyMusicView({
  currentUser,
  onSelectTab,
  onSelectWeddingSong,
}: NisfyMusicViewProps) {
  const { isArabic } = useLanguage();

  // State
  const [allTracks, setAllTracks] = useState<MusicTrack[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<MusicGenreId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>('stopped');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Modals
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [shareModalTrack, setShareModalTrack] = useState<MusicTrack | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Load tracks
  const refreshTracks = () => {
    const available = getAllAvailableTracks();
    setAllTracks(available);
  };

  useEffect(() => {
    refreshTracks();
    const handleUpdate = () => refreshTracks();
    window.addEventListener('nisfy_custom_tracks_updated', handleUpdate);
    return () => window.removeEventListener('nisfy_custom_tracks_updated', handleUpdate);
  }, []);

  // Listen to audio engine
  useEffect(() => {
    const unsub = musicAudioEngine.subscribe((track, state, time, dur) => {
      setCurrentTrack(track);
      setPlaybackState(state);
      setCurrentTime(time);
      setDuration(dur || 60);
      setIsMuted(musicAudioEngine.isSoundMuted());
    });
    return unsub;
  }, []);

  // Set default initial track if none is playing
  useEffect(() => {
    if (!currentTrack && allTracks.length > 0) {
      setCurrentTrack(allTracks[0]);
    }
  }, [allTracks, currentTrack]);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3000);
  };

  // Playback handlers
  const handleTogglePlay = (track?: MusicTrack) => {
    datingSounds.playTapSound();
    const target = track || currentTrack || allTracks[0];
    if (target) {
      musicAudioEngine.togglePlay(target);
    }
  };

  const handleNext = () => {
    datingSounds.playTapSound();
    musicAudioEngine.playNext(filteredTracks);
  };

  const handlePrev = () => {
    datingSounds.playTapSound();
    musicAudioEngine.playPrev(filteredTracks);
  };

  const handleShuffle = () => {
    datingSounds.playTapSound();
    if (filteredTracks.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredTracks.length);
    musicAudioEngine.playTrack(filteredTracks[randomIndex]);
    showToast(isArabic ? '🔀 تم تشغيل مقطع عشوائي !' : '🔀 Lecture aléatoire lancée !');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    musicAudioEngine.setVolume(newVol);
  };

  const handleToggleMute = () => {
    datingSounds.playTapSound();
    musicAudioEngine.toggleMute();
    setIsMuted(musicAudioEngine.isSoundMuted());
  };

  const handleDeleteCustom = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    datingSounds.playTapSound();
    if (confirm(isArabic ? 'هل تريد حذف هذا المقطع من قائمتك؟' : 'Supprimer ce titre importé ?')) {
      deleteCustomImportedTrack(trackId);
      refreshTracks();
      showToast(isArabic ? 'تم حذف المقطع بنجاح' : 'Titre supprimé');
    }
  };

  const handleSetProfileMusic = (track: MusicTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    datingSounds.playLikeSound();
    try {
      localStorage.setItem('nisfy_user_profile_anthem', JSON.stringify(track));
      showToast(
        isArabic
          ? `🎵 تم تعيين "${track.titleAr || track.title}" كنغمة لملفك الشخصي !`
          : `🎵 "${track.title}" a été défini comme thème musical de votre profil !`
      );
    } catch {
      // Ignored
    }
  };

  // Mood filters
  const MOODS = [
    { id: 'all', labelFr: 'Toutes les ambiances', labelAr: 'كل الأجواء', icon: '✨' },
    { id: 'cortege', labelFr: 'Cortège & Entrée Mariés 👑', labelAr: 'موكب ودخول العرسان 👑', icon: '🎺' },
    { id: 'romantique', labelFr: 'Romance & Noces d’Amour 🌹', labelAr: 'رومانسية وأوتار الحب 🌹', icon: '❤️' },
    { id: 'fete', labelFr: 'Fête, Danse & Youyous 💃', labelAr: 'رقص واحتفال وزغاريد 💃', icon: '🔥' },
    { id: 'casbah_cafe', labelFr: 'Casbah & Soirée Nostalgie ☕', labelAr: 'جلسة قصبية وأصالة ☕', icon: '🪕' },
    { id: 'desert_chill', labelFr: 'Désert & Évasion Touarègue 🏜️', labelAr: 'صحراء وهقار وطوارق 🏜️', icon: '🌌' },
    { id: 'energy', labelFr: 'Énergie & Fierté DZ ⚡', labelAr: 'طاقة ونخوة جزائرية ⚡', icon: '⚡' },
  ];

  // Filtering
  const filteredTracks = useMemo(() => {
    return allTracks.filter((track) => {
      // Genre filter
      if (selectedGenre === 'youtube') {
        if (!track.isCustomImport && !track.youtubeId) return false;
      } else if (selectedGenre !== 'all') {
        if (track.genre !== selectedGenre) return false;
      }

      // Mood filter
      if (selectedMood !== 'all' && track.moodTag && track.moodTag !== selectedMood) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = track.title.toLowerCase().includes(q) || (track.titleAr && track.titleAr.includes(q));
        const matchArtist = track.artist.toLowerCase().includes(q);
        const matchGenre = track.genreLabel.toLowerCase().includes(q) || track.genre.includes(q as any);
        const matchDesc = track.descriptionFr.toLowerCase().includes(q) || (track.descriptionAr && track.descriptionAr.includes(q));
        if (!matchTitle && !matchArtist && !matchGenre && !matchDesc) return false;
      }

      return true;
    });
  }, [allTracks, selectedGenre, selectedMood, searchQuery]);

  // Compute counts per genre
  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allTracks.length };
    counts['youtube'] = allTracks.filter((t) => t.isCustomImport || Boolean(t.youtubeId)).length;
    NISFY_GENRES_CONFIG.forEach((g) => {
      if (g.id !== 'all' && g.id !== 'youtube') {
        counts[g.id] = allTracks.filter((t) => t.genre === g.id).length;
      }
    });
    return counts;
  }, [allTracks]);

  const activeGenreMeta = NISFY_GENRES_CONFIG.find((g) => g.id === selectedGenre) || NISFY_GENRES_CONFIG[0];
  const isPlaying = playbackState === 'playing';

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-32 transition-colors duration-200" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-slate-900/95 text-white text-xs font-black px-4 py-3 rounded-2xl shadow-2xl border border-orange-500/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-[#FF3823] animate-spin" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-orange-500/15 via-orange-500/5 to-transparent dark:from-orange-950/30 dark:via-transparent border-b border-slate-200/60 dark:border-slate-800/60 pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-orange-500/10 to-rose-500/10 border border-[#FF3823]/30 text-[#FF3823] dark:text-[#FF6B35]">
                <Music className="w-3.5 h-3.5" />
                <span>{isArabic ? 'المكتبة الموسيقية الجزائرية الكبرى 🇩🇿' : 'Patrimoine Musical Algérien & Noces 🇩🇿'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {isArabic ? '🎵 موسيقى كل الأنواع للأعراس والحياة اليومية' : '🎵 Rubrique Musique DZ • Tous les Genres'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                {isArabic
                  ? 'استمع واكتشف كنوز التراث الجزائري: الشعبي العاصمي، الراي والراي لوف، المالوف والأندلسي، القبايلي، بلوز الصحراء والهقار، السطايفي والشاوي، الزرنة والبارود ومقاطع يوتيوب.'
                  : 'Explorez le patrimoine musical d’Algérie sous toutes ses facettes : Chaâbi des maîtres, Raï Love d’Oran, Malouf de Constantine, Chants kabyles, Blues sahraoui, rythmes staïfis et importations YouTube directes.'}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
              <button
                type="button"
                onClick={handleShuffle}
                className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
                title={isArabic ? 'تشغيل مقطع عشوائي' : 'Lecture aléatoire'}
              >
                <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
                <span>{isArabic ? 'مقطع عشوائي 🎲' : 'Aléatoire 🎲'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsYouTubeModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF3823] hover:from-[#FF551F] hover:to-[#E02613] text-white text-xs font-black flex items-center gap-2 shadow-md shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>{isArabic ? 'استيراد من يوتيوب 🎬' : 'Importer YouTube 🎬'}</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative pt-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 rtl:right-3.5 rtl:left-auto pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isArabic
                    ? 'ابحث باسم الأغنية، الفنان (دحمان، حسني، إيدير...)، أو الطابع الموسيقي...'
                    : 'Rechercher un titre, un artiste (Dahmane, Khaled, Hasni, Idir, Tinariwen...), ou un genre...'
                }
                className="w-full pl-10 pr-10 rtl:pr-10 rtl:pl-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF3823] shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 rtl:left-3.5 rtl:right-auto text-slate-400 hover:text-slate-600 text-xs font-black cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ========================================================================= */}
        {/* 🎧 MASTER NOW-PLAYING CONSOLE & VINYL DECK                                */}
        {/* ========================================================================= */}
        {currentTrack && (
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-xl">
            {/* Subtle atmospheric ambient glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              {/* Vinyl Disk / Artwork Container */}
              <div className="relative shrink-0 flex items-center justify-center">
                <div
                  className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-slate-950 border-4 border-slate-800/80 shadow-2xl overflow-hidden relative flex items-center justify-center ${
                    isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''
                  }`}
                >
                  {/* Outer vinyl grooves simulation */}
                  <div className="absolute inset-1 rounded-full border border-slate-700/40 pointer-events-none" />
                  <div className="absolute inset-4 rounded-full border border-slate-700/30 pointer-events-none" />
                  <div className="absolute inset-7 rounded-full border border-slate-700/20 pointer-events-none" />

                  {/* Center Album Artwork */}
                  <img
                    src={currentTrack.coverImage}
                    alt={currentTrack.title}
                    referrerPolicy="no-referrer"
                    className="w-18 h-18 sm:w-22 sm:h-22 rounded-full object-cover border-2 border-white/40 shadow-inner"
                  />

                  {/* Vinyl center spindle hole */}
                  <div className="w-4 h-4 rounded-full bg-slate-900 border border-white/60 absolute z-10 shadow-xs" />
                </div>

                {/* Animated Equalizer Wave Overlay */}
                {isPlaying && (
                  <div className="absolute -bottom-2 px-2.5 py-1 rounded-full bg-orange-600/90 backdrop-blur-xs text-[10px] font-black flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-3 bg-white rounded-full animate-pulse" />
                    <span className="w-1.5 h-4 bg-white rounded-full animate-pulse delay-75" />
                    <span className="w-1.5 h-2 bg-white rounded-full animate-pulse delay-150" />
                    <span>{isArabic ? 'قيد التشغيل' : 'En lecture'}</span>
                  </div>
                )}
              </div>

              {/* Center Track Information & Progress */}
              <div className="flex-1 w-full space-y-3 text-center md:text-left rtl:md:text-right">
                <div className="flex flex-wrap items-center justify-center md:justify-start rtl:md:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-orange-500 to-rose-500 text-white flex items-center gap-1 shadow-xs">
                    <span>{currentTrack.icon}</span>
                    <span>{isArabic ? currentTrack.genreLabelAr || currentTrack.genreLabel : currentTrack.genreLabel}</span>
                  </span>

                  {currentTrack.bpm && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                      ⚡ {currentTrack.bpm} BPM
                    </span>
                  )}

                  {currentTrack.youtubeId && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">
                      ▶ YouTube
                    </span>
                  )}

                  <span className="text-[11px] text-slate-400">
                    {isArabic ? 'محرك صوت WebAudio / عالي الجودة' : 'Moteur WebAudio DZ haute fidélité'}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight line-clamp-1">
                    {isArabic ? currentTrack.titleAr || currentTrack.title : currentTrack.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-orange-400 font-bold mt-0.5">
                    {currentTrack.artist}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 max-w-2xl">
                    {isArabic ? currentTrack.descriptionAr : currentTrack.descriptionFr}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-rose-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (currentTime / (duration || 60)) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  {/* Primary Playback controls */}
                  <div className="flex items-center gap-3 mx-auto md:mx-0">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                      title={isArabic ? 'المقطع السابق' : 'Précédent'}
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTogglePlay()}
                      className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#FF3823] hover:from-[#FF551F] hover:to-[#E02613] text-white flex items-center justify-center shadow-lg shadow-orange-500/30 transition-transform active:scale-95 cursor-pointer"
                      title={isPlaying ? (isArabic ? 'إيقاف مؤقت' : 'Pause') : (isArabic ? 'تشغيل' : 'Lecture')}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                      title={isArabic ? 'المقطع التالي' : 'Suivant'}
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>

                    {/* Volume control */}
                    <div className="hidden sm:flex items-center gap-2 ml-2 rtl:mr-2 rtl:ml-0 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60">
                      <button
                        type="button"
                        onClick={handleToggleMute}
                        className="text-slate-300 hover:text-white cursor-pointer"
                      >
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-[#FF3823]"
                      />
                    </div>
                  </div>

                  {/* Secondary Social/Profile Actions */}
                  <div className="flex items-center gap-2 mx-auto md:mx-0">
                    <button
                      type="button"
                      onClick={(e) => handleSetProfileMusic(currentTrack, e)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title={isArabic ? 'تعيين هذا المقطع كنشيد لملفي الشخصي' : 'Définir comme thème de mon profil'}
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>{isArabic ? 'ثيم لملفي الشخصي' : 'Thème de mon profil'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShareModalTrack(currentTrack)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-rose-500/20 hover:from-orange-500/30 hover:to-rose-500/30 border border-orange-500/40 text-xs font-bold text-orange-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'مشاركة' : 'Partager'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🪕 GENRES FILTER PILLS - TOUS LES GENRES ALGÉRIENS                        */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{isArabic ? '🎵 تصفح حسب الطابع والنوع الموسيقي :' : '🎵 Explorer par genre musical & tradition :'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
                {filteredTracks.length} {isArabic ? 'مقطع' : 'titres'}
              </span>
            </h3>
            {selectedGenre !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedGenre('all')}
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
              >
                {isArabic ? 'إظهار الكل' : 'Voir tous les genres'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            {NISFY_GENRES_CONFIG.map((g) => {
              const count = genreCounts[g.id] ?? 0;
              const isSelected = selectedGenre === g.id;

              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    datingSounds.playTapSound();
                    setSelectedGenre(g.id);
                  }}
                  className={`px-3 py-2 rounded-2xl text-xs font-black shrink-0 transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white border-transparent shadow-md shadow-orange-500/20 scale-102'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-sm">{g.icon}</span>
                  <span>{isArabic ? g.labelAr : g.labelFr}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Genre Description Card */}
          {activeGenreMeta && (
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 shadow-xs">
              <span className="text-2xl shrink-0 mt-0.5">{activeGenreMeta.icon}</span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{isArabic ? activeGenreMeta.labelAr : activeGenreMeta.labelFr}</span>
                  <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold">
                    {genreCounts[activeGenreMeta.id] || 0} {isArabic ? 'أعمال مسجلة' : 'morceaux disponibles'}
                  </span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isArabic ? activeGenreMeta.descriptionAr : activeGenreMeta.descriptionFr}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 🎭 MOOD & AMBIANCE QUICK FILTER PILLS                                     */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            {MOODS.map((m) => {
              const isSelected = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    datingSounds.playTapSound();
                    setSelectedMood(m.id);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{isArabic ? m.labelAr : m.labelFr}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📋 TRACKS GRID CATALOG                                                   */}
        {/* ========================================================================= */}
        {filteredTracks.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center mx-auto text-2xl">
              🎵
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              {isArabic ? 'لم يتم العثور على أي مقطع مطابق' : 'Aucun morceau correspondant'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isArabic
                ? 'جرب البحث بكلمات أخرى أو قم باستيراد أغنيتك المفضلة مباشرة من يوتيوب !'
                : 'Essayez un autre mot-clé ou importez instantanément votre titre préféré depuis YouTube !'}
            </p>
            <button
              type="button"
              onClick={() => setIsYouTubeModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#FF3823] text-white text-xs font-black inline-flex items-center gap-2 cursor-pointer shadow-sm hover:opacity-90"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isArabic ? 'استيراد من يوتيوب' : 'Importer de YouTube'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTracks.map((track) => {
              const isCurrent = currentTrack?.id === track.id;
              const isTrackPlaying = isCurrent && isPlaying;

              return (
                <div
                  key={track.id}
                  onClick={() => handleTogglePlay(track)}
                  className={`relative rounded-2xl p-3.5 transition-all cursor-pointer border flex flex-col justify-between group overflow-hidden ${
                    isCurrent
                      ? 'bg-orange-50/70 dark:bg-slate-900 border-[#FF3823]/50 ring-2 ring-[#FF3823]/30 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-orange-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header with image and play overlay */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={track.coverImage}
                        alt={track.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Genre badge overlay */}
                      <span className="absolute top-2 left-2 rtl:left-auto rtl:right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-950/80 backdrop-blur-xs text-white flex items-center gap-1">
                        <span>{track.icon}</span>
                        <span>{isArabic ? track.genreLabelAr || track.genreLabel : track.genreLabel}</span>
                      </span>

                      {/* Duration / BPM badge */}
                      <span className="absolute bottom-2 right-2 rtl:right-auto rtl:left-2 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-950/80 backdrop-blur-xs text-white">
                        {formatTime(track.duration || 60)} {track.bpm ? `• ${track.bpm} BPM` : ''}
                      </span>

                      {/* Big Play button on hover or when playing */}
                      <div
                        className={`absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition-opacity ${
                          isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-[#FF3823] text-white flex items-center justify-center shadow-lg shadow-black/40 transform group-hover:scale-110 transition-transform">
                          {isTrackPlaying ? (
                            <Pause className="w-5 h-5 fill-current" />
                          ) : (
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`font-black text-sm line-clamp-1 transition-colors ${
                            isCurrent ? 'text-[#FF3823] dark:text-[#FF6B35]' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {isArabic ? track.titleAr || track.title : track.title}
                        </h4>
                        {track.isCustomImport && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustom(track.id, e)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                            title={isArabic ? 'حذف هذا المقطع' : 'Supprimer'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold truncate">
                        {track.artist}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {isArabic ? track.descriptionAr : track.descriptionFr}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleSetProfileMusic(track, e)}
                      className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-rose-500 flex items-center gap-1 cursor-pointer transition-colors"
                      title={isArabic ? 'تعيين كنشيد لملفي' : 'Définir comme thème de profil'}
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>{isArabic ? 'نشيد الملف' : 'Profil'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShareModalTrack(track);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title={isArabic ? 'مشاركة المقطع' : 'Partager'}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePlay(track);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                          isTrackPlaying
                            ? 'bg-[#FF3823] text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-[#FF3823] hover:text-white text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isTrackPlaying ? (
                          <>
                            <Pause className="w-3 h-3 fill-current" />
                            <span>{isArabic ? 'إيقاف' : 'Pause'}</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>{isArabic ? 'استماع' : 'Écouter'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🎬 CURATED YOUTUBE MASTERPIECES (1-CLICK PLAY & IMPORT)                  */}
        {/* ========================================================================= */}
        <div className="mt-10 pt-8 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>🎬 روائع وكنوز التراث الجزائري (يوتيوب)</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-red-100 dark:bg-red-950 text-red-600">
                  YouTube
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic
                  ? 'أشهر الأغاني الجزائرية الكلاسيكية والحديثة الجاهزة للاستماع أو إضافتها لملفك وإعلاناتك'
                  : 'Monuments algériens légendaires à écouter ou ajouter en un clic à vos vidéos et annonces'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsYouTubeModalOpen(true)}
              className="text-xs font-bold text-[#FF3823] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isArabic ? 'استيراد رابط آخر' : 'Importer une autre vidéo'}</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {CURATED_YOUTUBE_SUGGESTIONS.map((curated) => (
              <div
                key={curated.id}
                onClick={() => {
                  datingSounds.playTapSound();
                  const converted: MusicTrack = {
                    id: `curated-${curated.youtubeId}`,
                    title: curated.title,
                    titleAr: curated.titleAr,
                    artist: curated.artist,
                    genre: curated.genre,
                    genreLabel: curated.genreLabel,
                    genreLabelAr: curated.genreLabelAr,
                    duration: 60,
                    bpm: 110,
                    icon: curated.icon,
                    coverImage: `https://img.youtube.com/vi/${curated.youtubeId}/hqdefault.jpg`,
                    audioUrl: '',
                    synthPreset: curated.synthPreset,
                    descriptionFr: curated.descriptionFr,
                    descriptionAr: curated.titleAr,
                    recommendedFor: ['couple', 'general_user'],
                    youtubeId: curated.youtubeId,
                  };
                  musicAudioEngine.playTrack(converted);
                }}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-orange-400 dark:hover:border-slate-700 transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center gap-3 group"
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0">
                  <img
                    src={`https://img.youtube.com/vi/${curated.youtubeId}/hqdefault.jpg`}
                    alt={curated.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-[#FF3823] transition-colors">
                    {curated.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {curated.artist}
                  </p>
                  <span className="inline-block px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {curated.icon} {curated.genreLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* YouTube Import Modal */}
      <YouTubeMusicImportModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        currentUserPseudo={currentUser?.pseudo}
        onSelectTrack={(track) => {
          refreshTracks();
          handleTogglePlay(track);
          showToast(isArabic ? '🎵 تم استيراد وتشغيل الأغنية بنجاح !' : '🎵 Morceau importé et lancé avec succès !');
        }}
      />

      {/* Share Modal */}
      {shareModalTrack && (
        <MusicShareModal
          track={shareModalTrack}
          isOpen={Boolean(shareModalTrack)}
          onClose={() => setShareModalTrack(null)}
          currentUser={currentUser}
          onCreateStoryWithMusic={(track) => {
            setShareModalTrack(null);
            if (onSelectTab) onSelectTab('feed');
            showToast(isArabic ? 'تم حفظ الموسيقى لإنشاء الستوري !' : 'Musique sélectionnée pour votre story !');
          }}
        />
      )}
    </div>
  );
}
