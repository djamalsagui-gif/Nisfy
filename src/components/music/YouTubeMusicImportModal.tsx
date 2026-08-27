import React, { useState, useEffect } from 'react';
import {
  X,
  Music,
  Sparkles,
  Play,
  Pause,
  Trash2,
  Check,
  ExternalLink,
  Plus,
  Radio,
  Library,
  Volume2,
  VolumeX,
  Flame,
  Info,
} from 'lucide-react';
import {
  MusicTrack,
  extractYouTubeVideoId,
  getYouTubeThumbnailUrl,
  saveCustomImportedTrack,
  getCustomImportedTracks,
  deleteCustomImportedTrack,
  CURATED_YOUTUBE_SUGGESTIONS,
  CuratedYouTubeTrackSuggestion,
} from '../../data/musicThemes';
import { musicAudioEngine, AudioPlaybackState } from '../../utils/musicAudioEngine';
import { useLanguage } from '../../context/LanguageContext';
import { datingSounds } from '../../utils/soundEffects';

interface YouTubeMusicImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrack?: (track: MusicTrack) => void;
  currentUserPseudo?: string;
}

export function YouTubeMusicImportModal({
  isOpen,
  onClose,
  onSelectTrack,
  currentUserPseudo,
}: YouTubeMusicImportModalProps) {
  const { isArabic } = useLanguage();
  const [activeTab, setActiveTab] = useState<'import' | 'curated' | 'my_tracks'>('import');

  // Import form state
  const [inputUrl, setInputUrl] = useState('');
  const [detectedVideoId, setDetectedVideoId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState<MusicTrack['genre']>('rai_moderne');
  const [genreLabel, setGenreLabel] = useState('Raï & Musique Moderne');
  const [genreLabelAr, setGenreLabelAr] = useState('راي وموسيقى عصرية');
  const [synthPreset, setSynthPreset] = useState<MusicTrack['synthPreset']>('rai_electro');
  const [selectedIcon, setSelectedIcon] = useState('🎵');
  const [description, setDescription] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  // Playback state
  const [previewPlayingId, setPreviewPlayingId] = useState<string | null>(null);
  const [myTracks, setMyTracks] = useState<MusicTrack[]>([]);

  useEffect(() => {
    if (isOpen) {
      setMyTracks(getCustomImportedTracks());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => {
      setMyTracks(getCustomImportedTracks());
    };
    window.addEventListener('nisfy_custom_tracks_updated', handleUpdate);
    return () => window.removeEventListener('nisfy_custom_tracks_updated', handleUpdate);
  }, []);

  // Listen to music audio engine updates
  useEffect(() => {
    const unsub = musicAudioEngine.subscribe((track, state) => {
      setPreviewPlayingId(state === 'playing' && track ? track.id : null);
    });
    return unsub;
  }, []);

  // Watch URL input for YouTube ID extraction
  useEffect(() => {
    if (!inputUrl.trim()) {
      setDetectedVideoId(null);
      setUrlError(null);
      return;
    }

    const vidId = extractYouTubeVideoId(inputUrl);
    if (vidId) {
      setDetectedVideoId(vidId);
      setUrlError(null);

      // Auto-suggest titles if blank
      if (!title) {
        setTitle('Titre YouTube Personnalisé');
      }
      if (!artist) {
        setArtist(currentUserPseudo || 'Artiste Importé');
      }
    } else {
      setDetectedVideoId(null);
      setUrlError(
        isArabic
          ? 'رابط غير صالح. يرجى إدخال رابط يوتيوب صالح (مثال: youtube.com/watch?v=... أو youtu.be/...)'
          : 'Lien YouTube non reconnu. Entrez un lien youtube.com ou youtu.be valide.'
      );
    }
  }, [inputUrl, isArabic, currentUserPseudo, title, artist]);

  if (!isOpen) return null;

  const GENRES_CONFIG: {
    id: MusicTrack['genre'];
    labelFr: string;
    labelAr: string;
    icon: string;
    preset: MusicTrack['synthPreset'];
  }[] = [
    { id: 'chaabi', labelFr: 'Chaâbi Algérois', labelAr: 'شعبي عاصمي', icon: '🪕', preset: 'chaabi_mandole' },
    { id: 'zorna', labelFr: 'Zorna & Cortège', labelAr: 'زرنة وموكب الأعراس', icon: '🥁', preset: 'zorna_bendir' },
    { id: 'rai_moderne', labelFr: 'Raï Moderne & Fusion', labelAr: 'راي عصري', icon: '⚡', preset: 'rai_electro' },
    { id: 'andalou', labelFr: 'Andalou & Malouf', labelAr: 'أندلسي ومالوف', icon: '🎻', preset: 'malouf_oud' },
    { id: 'romantique', labelFr: 'Romantique & Noces', labelAr: 'رومانسي وأوتار الحب', icon: '🌹', preset: 'romantic_piano' },
    { id: 'kabyle', labelFr: 'Rythmes Kabyles', labelAr: 'إيقاعات قبايلية', icon: '🌿', preset: 'kabyle_fete' },
    { id: 'lounge', labelFr: 'Lounge Méditerranéen', labelAr: 'لاونج متوسطي هادئ', icon: '🎷', preset: 'mediterranean_lounge' },
    { id: 'traditionnel', labelFr: 'Traditionnel & Bénédictions', labelAr: 'تراثي وأفراح البركة', icon: '✨', preset: 'cortege_royal' },
  ];

  const EMOJI_PICKER = ['🎵', '🪕', '👑', '🌹', '🥁', '🎻', '⚡', '🌿', '🎷', '🎹', '✨', '💍', '❤️', '🌊', '🔥'];

  const handleSelectCurated = (curated: CuratedYouTubeTrackSuggestion) => {
    datingSounds.playTapSound();
    setInputUrl(`https://www.youtube.com/watch?v=${curated.youtubeId}`);
    setTitle(curated.title);
    setTitleAr(curated.titleAr);
    setArtist(curated.artist);
    setGenre(curated.genre);
    setGenreLabel(curated.genreLabel);
    setGenreLabelAr(curated.genreLabelAr);
    setSelectedIcon(curated.icon);
    setSynthPreset(curated.synthPreset);
    setDescription(curated.descriptionFr);
    setActiveTab('import');
  };

  const handleSaveAndApply = () => {
    if (!detectedVideoId) {
      setUrlError(isArabic ? 'يرجى إدخال رابط يوتيوب صالح أولاً.' : 'Veuillez renseigner un lien YouTube valide.');
      return;
    }

    const finalTitle = title.trim() || 'Musique YouTube';
    const finalArtist = artist.trim() || (currentUserPseudo ? `Sélection de ${currentUserPseudo}` : 'YouTube Import');

    const newTrack: MusicTrack = {
      id: `yt_custom_${Date.now()}_${detectedVideoId}`,
      title: finalTitle,
      titleAr: titleAr.trim() || finalTitle,
      genre: genre,
      genreLabel: genreLabel,
      genreLabelAr: genreLabelAr,
      artist: finalArtist,
      duration: 60,
      bpm: 115,
      icon: selectedIcon,
      coverImage: getYouTubeThumbnailUrl(detectedVideoId),
      audioUrl: '',
      synthPreset: synthPreset,
      descriptionFr: description.trim() || `Musique importée depuis YouTube (${finalArtist})`,
      descriptionAr: titleAr.trim() || `موسيقى مستوردة من يوتيوب (${finalArtist})`,
      recommendedFor: ['couple', 'general_user', 'fashion', 'venue'],
      youtubeId: detectedVideoId,
      youtubeUrl: inputUrl,
      isCustomImport: true,
      importedBy: currentUserPseudo,
      createdAt: new Date().toISOString(),
    };

    saveCustomImportedTrack(newTrack);
    datingSounds.playMatchSound();

    if (onSelectTrack) {
      onSelectTrack(newTrack);
    }

    // Start playing track to confirm
    musicAudioEngine.play(newTrack);

    onClose();
  };

  const handleDeleteTrack = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomImportedTrack(trackId);
    datingSounds.playTapSound();
  };

  const handleTogglePreview = (track: MusicTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewPlayingId === track.id) {
      musicAudioEngine.stop();
    } else {
      musicAudioEngine.play(track);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputUrl(text);
          datingSounds.playTapSound();
        }
      }
    } catch {
      // Clipboard permissions may not be granted
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with YouTube Red Gradient */}
        <div className="relative p-5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            title={isArabic ? 'إغلاق' : 'Fermer'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-lg">
              {/* YouTube SVG Play Icon */}
              <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  {isArabic ? 'استيراد موسيقى من يوتيوب 🎬' : 'Importer une Musique depuis YouTube 🎬'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                  Nisfy Audio
                </span>
              </div>
              <p className="text-xs text-white/90 mt-0.5">
                {isArabic
                  ? 'أضف أغنيتك المفضلة كنشيد لملفك الشخصي أو خلفية لمقاطع الفيديو والقصص'
                  : 'Associez votre chanson préférée à votre profil, vos vidéos ou vos stories'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setActiveTab('import');
                datingSounds.playTapSound();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'import'
                  ? 'bg-white text-rose-700 shadow-md'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isArabic ? 'رابط يوتيوب جديد' : 'Coller un Lien'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('curated');
                datingSounds.playTapSound();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'curated'
                  ? 'bg-white text-rose-700 shadow-md'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>{isArabic ? 'روائع الأعراس DZ (1-نقرة)' : 'Classiques DZ (1-Clic)'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('my_tracks');
                datingSounds.playTapSound();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'my_tracks'
                  ? 'bg-white text-rose-700 shadow-md'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Library className="w-3.5 h-3.5" />
              <span>{isArabic ? `مكتبتي (${myTracks.length})` : `Mes Imports (${myTracks.length})`}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: IMPORT BY URL */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              {/* URL Input */}
              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5">
                  {isArabic ? 'رابط فيديو أو أغنية يوتيوب :' : 'Lien de la vidéo / musique YouTube :'}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                      className={`w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all ${
                        urlError
                          ? 'border-rose-400 focus:ring-rose-400'
                          : detectedVideoId
                          ? 'border-emerald-500 ring-1 ring-emerald-400/40'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    className="px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black transition-colors shrink-0 cursor-pointer"
                  >
                    {isArabic ? 'لصق 📋' : 'Coller 📋'}
                  </button>
                </div>

                {urlError && <p className="text-[11px] font-bold text-rose-500 mt-1">{urlError}</p>}
              </div>

              {/* YouTube Video Preview Card when ID detected */}
              {detectedVideoId && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-slate-800 dark:to-slate-800/70 border border-rose-200 dark:border-slate-700 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-900 dark:text-rose-400 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{isArabic ? 'تم التعرف على الفيديو بنجاح !' : 'Vidéo YouTube détectée avec succès !'}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                      ID: {detectedVideoId}
                    </span>
                  </div>

                  {/* Embedded IFrame Interactive Player */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md bg-black border border-rose-200 dark:border-slate-700">
                    <iframe
                      src={`https://www.youtube.com/embed/${detectedVideoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
                      title="YouTube Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}

              {/* Metadata Fields Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                {/* Title */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'عنوان الأغنية / المقطع :' : 'Titre du morceau :'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Ya Rayah, Aïcha, Zina..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Artist */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'اسم الفنان / المغني :' : 'Nom de l’artiste ou interprète :'}
                  </label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Ex: Dahmane El Harrachi, Khaled, Soolking..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Genre Selector */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'النوع الموسيقي / الطابع الجزائري :' : 'Genre musical & ambiance :'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {GENRES_CONFIG.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          setGenre(g.id);
                          setGenreLabel(g.labelFr);
                          setGenreLabelAr(g.labelAr);
                          setSynthPreset(g.preset);
                          setSelectedIcon(g.icon);
                        }}
                        className={`p-2 rounded-xl border text-[11px] font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          genre === g.id
                            ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span>{g.icon}</span>
                        <span className="truncate">{isArabic ? g.labelAr : g.labelFr}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emoji Icon Picker */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'أيقونة التعبير :' : 'Icône du morceau :'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {EMOJI_PICKER.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedIcon(emoji)}
                        className={`w-8 h-8 rounded-xl text-base flex items-center justify-center transition-all cursor-pointer ${
                          selectedIcon === emoji
                            ? 'bg-rose-500 text-white scale-110 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleSaveAndApply}
                disabled={!detectedVideoId}
                className={`w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  detectedVideoId
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white shadow-rose-500/25 active:scale-98'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>
                  {isArabic
                    ? 'حفظ في مكتبتي وتعيين كنشيد للملف 🎶'
                    : 'Enregistrer & Utiliser sur mon Profil / Clip 🎶'}
                </span>
              </button>
            </div>
          )}

          {/* TAB 2: CURATED 1-CLICK PICKS */}
          {activeTab === 'curated' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/40 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 dark:text-amber-300">
                  {isArabic
                    ? 'اختر من روائع الموسيقى الجزائرية الخالدة وأغاني الأعراس الجاهزة للاستيراد المباشر بنقرة واحدة.'
                    : 'Sélectionnez parmi les plus grands chefs-d’œuvre de la musique algérienne et des noces traditionnelles prêts à l’emploi.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CURATED_YOUTUBE_SUGGESTIONS.map((sug) => {
                  const thumb = getYouTubeThumbnailUrl(sug.youtubeId);
                  const isPlaying = previewPlayingId === sug.id;

                  return (
                    <div
                      key={sug.id}
                      onClick={() => handleSelectCurated(sug)}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0 shadow-xs">
                          <img
                            src={thumb}
                            alt={sug.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                            <Play className="w-4 h-4 fill-white" />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs">{sug.icon}</span>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                              {isArabic ? sug.titleAr : sug.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {sug.artist}
                          </p>
                          <span className="inline-block mt-0.5 text-[9px] font-black px-1.5 py-0.2 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                            {isArabic ? sug.genreLabelAr : sug.genreLabel}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCurated(sug);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-black shrink-0 transition-transform active:scale-95 shadow-xs cursor-pointer"
                      >
                        {isArabic ? 'استيراد' : 'Importer'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MY IMPORTED TRACKS */}
          {activeTab === 'my_tracks' && (
            <div className="space-y-3">
              {myTracks.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-850 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 mx-auto flex items-center justify-center">
                    <Music className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">
                    {isArabic ? 'لم تقم باستيراد أي موسيقى بعد' : 'Aucune musique importée pour le moment'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {isArabic
                      ? 'الصق رابط فيديو من يوتيوب أو اختر من روائع الأعراس الجزائرية لإضافتها إلى مكتبتك.'
                      : 'Collez un lien YouTube dans le premier onglet pour enrichir votre bibliothèque Nisfy.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('import')}
                    className="mt-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-black shadow-md cursor-pointer"
                  >
                    {isArabic ? 'استيراد الآن' : 'Importer une musique'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {myTracks.map((track) => {
                    const isPlaying = previewPlayingId === track.id;

                    return (
                      <div
                        key={track.id}
                        onClick={() => {
                          if (onSelectTrack) {
                            onSelectTrack(track);
                            datingSounds.playTapSound();
                            onClose();
                          }
                        }}
                        className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0 shadow-xs">
                            <img
                              src={track.coverImage}
                              alt={track.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={(e) => handleTogglePreview(track, e)}
                              className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
                            >
                              {isPlaying ? (
                                <Pause className="w-4 h-4 fill-amber-300 text-amber-300" />
                              ) : (
                                <Play className="w-4 h-4 fill-white" />
                              )}
                            </button>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span>{track.icon}</span>
                              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                                {isArabic ? track.titleAr : track.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {track.artist} • <span className="text-rose-600 font-bold">{track.genreLabel}</span>
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                                YouTube
                              </span>
                              {track.createdAt && (
                                <span className="text-[9px] text-slate-400">
                                  {new Date(track.createdAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => handleDeleteTrack(track.id, e)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 text-slate-400 transition-colors cursor-pointer"
                            title={isArabic ? 'حذف من المكتبة' : 'Supprimer de ma bibliothèque'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (onSelectTrack) {
                                onSelectTrack(track);
                                datingSounds.playTapSound();
                                onClose();
                              }
                            }}
                            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isArabic ? 'تحديد' : 'Choisir'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Radio className="w-4 h-4 text-red-600 animate-pulse" />
            <span className="text-[11px] font-medium">Nisfy High-Fidelity Audio Streaming</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            {isArabic ? 'إغلاق' : 'Fermer'}
          </button>
        </div>
      </div>
    </div>
  );
}
