export interface MusicTrack {
  id: string;
  title: string;
  titleAr: string;
  genre: 'traditionnel' | 'chaabi' | 'andalou' | 'kabyle' | 'rai_moderne' | 'romantique' | 'lounge' | 'zorna' | 'youtube';
  genreLabel: string;
  genreLabelAr: string;
  artist: string;
  duration: number; // in seconds
  bpm: number;
  icon: string;
  coverImage: string;
  audioUrl: string; // audio sample or synth preset
  synthPreset: 'zorna_bendir' | 'chaabi_mandole' | 'malouf_oud' | 'kabyle_fete' | 'romantic_piano' | 'mediterranean_lounge' | 'rai_electro' | 'cortege_royal';
  descriptionFr: string;
  descriptionAr: string;
  recommendedFor: ('venue' | 'fashion' | 'travel' | 'photo' | 'catering' | 'jewelry' | 'general_user' | 'couple')[];
  youtubeId?: string;
  youtubeUrl?: string;
  isCustomImport?: boolean;
  importedBy?: string;
  createdAt?: string;
}

export const NISFY_MUSIC_CATALOG: MusicTrack[] = [
  {
    id: 'track-zorna-cortege',
    title: 'Zorna & Bendir • Cortège Impérial DZ',
    titleAr: 'زرنة وبندير • موكب الأعراس الجزائري الملكي',
    genre: 'zorna',
    genreLabel: 'Zorna & Percussions',
    genreLabelAr: 'زرنة وإيقاعات تقليدية',
    artist: 'Troupe El Bahdja & Nisfy Orchestra',
    duration: 45,
    bpm: 128,
    icon: '🥁',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/612/612624_5674468-lq.mp3',
    synthPreset: 'zorna_bendir',
    descriptionFr: 'L’ambiance vibrante des grands cortèges d’Alger avec bendir et flûtes traditionnelles.',
    descriptionAr: 'أجواء الأفراح الجزائرية الأصيلة مع الموكب والبندير التراثي.',
    recommendedFor: ['venue', 'fashion', 'general_user', 'couple'],
  },
  {
    id: 'track-chaabi-casbah',
    title: 'Nostalgie Chaâbi • Mandole & Qçid',
    titleAr: 'شعبي عاصمي أصيل • مندول وقصيد الغرام',
    genre: 'chaabi',
    genreLabel: 'Chaâbi Algérois',
    genreLabelAr: 'شعبي عاصمي',
    artist: 'Maîtres de la Casbah',
    duration: 52,
    bpm: 104,
    icon: '🪕',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/563/563816_11861866-lq.mp3',
    synthPreset: 'chaabi_mandole',
    descriptionFr: 'Mélodie chaleureuse au mandole algérois, parfaite pour les mariages conviviaux.',
    descriptionAr: 'نغمات المندول الدافئة ولمسة القصبة العريقة لليالي الفرح الأصيلة.',
    recommendedFor: ['venue', 'catering', 'general_user', 'couple'],
  },
  {
    id: 'track-andalou-malouf',
    title: 'Nouba Royale • Malouf & Violon Andalou',
    titleAr: 'نوبة المالوف الأندلسي • قسنطينة وتلمسان',
    genre: 'andalou',
    genreLabel: 'Andalou & Malouf',
    genreLabelAr: 'أندلسي ومالوف',
    artist: 'Ensemble Cirta & Tlemcen',
    duration: 60,
    bpm: 96,
    icon: '🎻',
    coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/415/415511_5121236-lq.mp3',
    synthPreset: 'malouf_oud',
    descriptionFr: 'Élégance impériale de Constantine et Tlemcen pour une entrée de mariée prestigieuse.',
    descriptionAr: 'رقي المالوف الأندلسي العريق لدخول العروسين بكل فخامة وهيبة.',
    recommendedFor: ['jewelry', 'fashion', 'photo', 'general_user'],
  },
  {
    id: 'track-lounge-denia',
    title: 'Costa Blanca Breeze • Lounge Gastronomie Don-Jeovani',
    titleAr: 'نسيم كوستا بلانكا • لاونج البحر الأبيض المتوسط',
    genre: 'lounge',
    genreLabel: 'Lounge Méditerranéen',
    genreLabelAr: 'لاونج متوسطي هادئ',
    artist: 'Chef Djamel-Michel DJ Set (Dénia)',
    duration: 48,
    bpm: 110,
    icon: '🎷',
    coverImage: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/448/448080_9159316-lq.mp3',
    synthPreset: 'mediterranean_lounge',
    descriptionFr: 'Ambiance lounge élégante bord de mer, guitare espagnole et détente gastronomique.',
    descriptionAr: 'أنغام إسبانية متوسطية ناعمة لعشاء رومانسي وأجواء راقية.',
    recommendedFor: ['catering', 'travel', 'general_user'],
  },
  {
    id: 'track-romantic-piano',
    title: 'Douceur Éternelle • Piano & Cordes Romantiques',
    titleAr: 'سحر القلوب • بيانو وأوتار رومانسية',
    genre: 'romantique',
    genreLabel: 'Romantique & Noces',
    genreLabelAr: 'رومانسي ونغمات حب',
    artist: 'Nisfy Romantic Symphony',
    duration: 55,
    bpm: 82,
    icon: '🎹',
    coverImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/387/387232_1474204-lq.mp3',
    synthPreset: 'romantic_piano',
    descriptionFr: 'Notes cristallines pour sublimer les échanges de vœux et moments d’émotion.',
    descriptionAr: 'عزف شاعري راقٍ يرافق مشاعر الحب ولحظات العمر الخالدة.',
    recommendedFor: ['jewelry', 'photo', 'couple', 'general_user'],
  },
  {
    id: 'track-kabyle-fete',
    title: 'Idhebalen du Djurdjura • Fête & Célébration',
    titleAr: 'إيدبالن جرجرة • فرح وأهازيج قبايلية أصيلة',
    genre: 'kabyle',
    genreLabel: 'Rythmes Kabyles',
    genreLabelAr: 'إيقاعات قبايلية',
    artist: 'Troupe Ithrane & Djurdjura Beats',
    duration: 40,
    bpm: 132,
    icon: '🪘',
    coverImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/512/512471_9497060-lq.mp3',
    synthPreset: 'kabyle_fete',
    descriptionFr: 'Joie festive montagnarde, rythmes entraînants pour danser et célébrer.',
    descriptionAr: 'بهجة تراثية متجددة بإيقاعات قبائلية حماسية تصنع الفرح.',
    recommendedFor: ['venue', 'fashion', 'general_user'],
  },
  {
    id: 'track-rai-moderne',
    title: 'Raï Sunset Fusion • Oran El Bahia Beats',
    titleAr: 'راي فيوجن الباهية • وهران وسحر الغروب',
    genre: 'rai_moderne',
    genreLabel: 'Raï Moderne & Fusion',
    genreLabelAr: 'راي عصري',
    artist: 'Bahia Groove Collective',
    duration: 50,
    bpm: 118,
    icon: '⚡',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/456/456965_5121236-lq.mp3',
    synthPreset: 'rai_electro',
    descriptionFr: 'Synthétiseurs modernes mêlés aux accords orientaux chaleureux d’Oran.',
    descriptionAr: 'توليفة شبابية عصرية بأنغام غرب الجزائر المليئة بالحيوية.',
    recommendedFor: ['travel', 'venue', 'general_user'],
  },
  {
    id: 'track-cortege-henna',
    title: 'Laylat El Henna • Chants Traditionnels & Youyous',
    titleAr: 'ليلة الحناء والبركة • زغاريد وأناشيد الأعراس',
    genre: 'traditionnel',
    genreLabel: 'Nuit du Henné & Bénédictions',
    genreLabelAr: 'ليلة الحناء والبركة',
    artist: 'Chœur Féminin El Baraka',
    duration: 46,
    bpm: 100,
    icon: '🌿',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/381/381382_1676145-lq.mp3',
    synthPreset: 'cortege_royal',
    descriptionFr: 'Douceur des traditions du henné avec résonance de youyous et bénédictions nuptiales.',
    descriptionAr: 'أنغام ليلة الحناء التراثية مع الزغاريد والتهاني المباركة للعروسين.',
    recommendedFor: ['fashion', 'jewelry', 'couple', 'general_user'],
  },
];

const LOCAL_STORAGE_CUSTOM_TRACKS_KEY = 'nisfy_custom_youtube_tracks';

/**
 * Extracts YouTube Video ID from any standard or shortened YouTube URL
 */
export function extractYouTubeVideoId(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Direct 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle youtu.be/ID
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (youtuBeMatch && youtuBeMatch[1]) return youtuBeMatch[1];

  // Handle youtube.com/watch?v=ID or music.youtube.com/watch?v=ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // Handle youtube.com/embed/ID or shorts/ID
  const embedOrShortsMatch = trimmed.match(/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})/);
  if (embedOrShortsMatch && embedOrShortsMatch[1]) return embedOrShortsMatch[1];

  return null;
}

/**
 * Returns high quality YouTube thumbnail URL
 */
export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Retrieves custom imported YouTube tracks from local storage
 */
export function getCustomImportedTracks(): MusicTrack[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_TRACKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves a new custom imported YouTube track to local storage
 */
export function saveCustomImportedTrack(track: MusicTrack): MusicTrack[] {
  try {
    const existing = getCustomImportedTracks();
    const updated = [track, ...existing.filter((t) => t.id !== track.id)];
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_TRACKS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('nisfy_custom_tracks_updated', { detail: updated }));
    return updated;
  } catch {
    return [track];
  }
}

/**
 * Deletes a custom imported YouTube track from local storage
 */
export function deleteCustomImportedTrack(trackId: string): MusicTrack[] {
  try {
    const existing = getCustomImportedTracks();
    const updated = existing.filter((t) => t.id !== trackId);
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_TRACKS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('nisfy_custom_tracks_updated', { detail: updated }));
    return updated;
  } catch {
    return [];
  }
}

/**
 * Returns all available tracks (catalog + custom YouTube imports)
 */
export function getAllAvailableTracks(): MusicTrack[] {
  const custom = getCustomImportedTracks();
  return [...custom, ...NISFY_MUSIC_CATALOG];
}

export function getTrackById(id?: string): MusicTrack | undefined {
  if (!id) return undefined;
  const allTracks = getAllAvailableTracks();
  return allTracks.find((t) => t.id === id);
}

export function getDefaultTrackForCategory(category?: string): MusicTrack {
  const allTracks = getAllAvailableTracks();
  if (!category) return allTracks[0] || NISFY_MUSIC_CATALOG[0];
  const found = allTracks.find((t) => t.recommendedFor && t.recommendedFor.includes(category as any));
  return found || allTracks[0] || NISFY_MUSIC_CATALOG[0];
}

/**
 * Curated Algerian & Romantic Masterpieces available for 1-click import
 */
export interface CuratedYouTubeTrackSuggestion {
  id: string;
  title: string;
  titleAr: string;
  artist: string;
  youtubeId: string;
  genre: MusicTrack['genre'];
  genreLabel: string;
  genreLabelAr: string;
  icon: string;
  descriptionFr: string;
  synthPreset: MusicTrack['synthPreset'];
}

export const CURATED_YOUTUBE_SUGGESTIONS: CuratedYouTubeTrackSuggestion[] = [
  {
    id: 'yt_ya_rayah',
    title: 'Ya Rayah (يا رايح وين مسافر)',
    titleAr: 'يا رايح وين مسافر • التحفة الخالدة',
    artist: 'Dahmane El Harrachi / Rachid Taha',
    youtubeId: 'WkP1wZrnwL8',
    genre: 'chaabi',
    genreLabel: 'Chaâbi Classique',
    genreLabelAr: 'شعبي كلاسيكي',
    icon: '🪕',
    descriptionFr: 'L’hymne éternel du Chaâbi algérois connu dans le monde entier.',
    synthPreset: 'chaabi_mandole',
  },
  {
    id: 'yt_aicha',
    title: 'Aïcha (عائشة)',
    titleAr: 'عائشة • ملك الراي الجزائري',
    artist: 'Cheb Khaled',
    youtubeId: 'gzlHucbD76U',
    genre: 'rai_moderne',
    genreLabel: 'Raï Légendaire',
    genreLabelAr: 'راي أسطوري',
    icon: '👑',
    descriptionFr: 'Le monument romantique mondial de Cheb Khaled pour célébrer l’amour.',
    synthPreset: 'rai_electro',
  },
  {
    id: 'yt_avava_inouva',
    title: 'A Vava Inouva (أبي إينوفا)',
    titleAr: 'أبي إينوفا • التراث الأمازيغي العالمي',
    artist: 'Idir',
    youtubeId: 'YvJ3p4L0lZ8',
    genre: 'kabyle',
    genreLabel: 'Poésie Kabyle',
    genreLabelAr: 'شعر قبايلي أصيل',
    icon: '🌿',
    descriptionFr: 'La guitare acoustique et la pureté des montagnes du Djurdjura.',
    synthPreset: 'kabyle_fete',
  },
  {
    id: 'yt_batwanes_beek',
    title: 'Batwanes Beek (بتونس بيك)',
    titleAr: 'بتونس بيك • أميرة الطرب وردة الجزائرية',
    artist: 'Warda Al-Jazairia',
    youtubeId: 'Fz7b59-YxUQ',
    genre: 'romantique',
    genreLabel: 'Tarab & Romantique',
    genreLabelAr: 'طرب ورومانسية',
    icon: '🌹',
    descriptionFr: 'La voix d’or de Warda pour une ambiance de mariage douce et passionnée.',
    synthPreset: 'romantic_piano',
  },
  {
    id: 'yt_suavemente',
    title: 'Suavemente / Guérilla',
    titleAr: 'سوافيمنتي • النجم سولكينغ',
    artist: 'Soolking',
    youtubeId: 'oN2Xs8ZSRhE',
    genre: 'rai_moderne',
    genreLabel: 'Hit Moderne DZ',
    genreLabelAr: 'موسيقى شبابية عصرية',
    icon: '⚡',
    descriptionFr: 'Rythme entraînant et énergie festive pour faire vibrer votre profil et vos clips.',
    synthPreset: 'rai_electro',
  },
  {
    id: 'yt_zina_babylone',
    title: 'Zina (زينة)',
    titleAr: 'زينة • فرقة بابيلون',
    artist: 'Babylone',
    youtubeId: 'Y9jM9_4kQyo',
    genre: 'romantique',
    genreLabel: 'Acoustique DZ',
    genreLabelAr: 'أكوستيك دافئ',
    icon: '✨',
    descriptionFr: 'Ballade romantique algéroise plébiscitée pour les demandes en mariage.',
    synthPreset: 'chaabi_mandole',
  },
  {
    id: 'yt_cortege_zorna',
    title: 'Cortège Fête & Baroud Algérien (زرنة وبندير)',
    titleAr: 'موكب العرس الجزائري والبارود',
    artist: 'Zorna El Marsa & Bendir',
    youtubeId: 'b_i_cO3HjXQ',
    genre: 'zorna',
    genreLabel: 'Zorna & Fête',
    genreLabelAr: 'زرنة وأعراس',
    icon: '🥁',
    descriptionFr: 'Ambiance festive des cortèges traditionnels algériens.',
    synthPreset: 'zorna_bendir',
  },
];

