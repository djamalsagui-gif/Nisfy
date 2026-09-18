export type MusicGenreId =
  | 'all'
  | 'chaabi'
  | 'rai_moderne'
  | 'andalou'
  | 'kabyle'
  | 'sahraoui'
  | 'staifi_chaoui'
  | 'zorna'
  | 'romantique'
  | 'lounge'
  | 'rap_urbain'
  | 'traditionnel'
  | 'youtube';

export type MusicSynthPreset =
  | 'zorna_bendir'
  | 'chaabi_mandole'
  | 'malouf_oud'
  | 'kabyle_fete'
  | 'romantic_piano'
  | 'mediterranean_lounge'
  | 'rai_electro'
  | 'cortege_royal'
  | 'sahraoui_desert'
  | 'staifi_gasba'
  | 'rap_beat';

export interface MusicGenreMeta {
  id: MusicGenreId;
  labelFr: string;
  labelAr: string;
  icon: string;
  descriptionFr: string;
  descriptionAr: string;
  gradient: string;
  badgeBg: string;
  badgeText: string;
  preset: MusicSynthPreset;
}

export const NISFY_GENRES_CONFIG: MusicGenreMeta[] = [
  {
    id: 'all',
    labelFr: 'Tous les genres',
    labelAr: 'كل الأنواع الموسيقية',
    icon: '✨',
    descriptionFr: 'Le panorama complet du patrimoine musical algérien et des chants d’amour.',
    descriptionAr: 'البانوراما الشاملة للتراث الموسيقي الجزائري وأنغام الأفراح.',
    gradient: 'from-slate-900 to-slate-800',
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-slate-800 dark:text-slate-200',
    preset: 'chaabi_mandole',
  },
  {
    id: 'chaabi',
    labelFr: 'Chaâbi Algérois & Casbah',
    labelAr: 'الشعبي العاصمي والقصبة',
    icon: '🪕',
    descriptionFr: 'Mandole, poésie des maîtres (El Anka, Dahmane, Guerrouabi, Ezzahi) et esprit de la Casbah.',
    descriptionAr: 'سحر المندول وشعر القصيد الخالد لكبار شيوخ القصبة العريقة.',
    gradient: 'from-amber-600 to-yellow-500',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    badgeText: 'text-amber-800 dark:text-amber-300',
    preset: 'chaabi_mandole',
  },
  {
    id: 'rai_moderne',
    labelFr: 'Raï, Raï Love & Fusion',
    labelAr: 'الراي الجزائري والفيوجن',
    icon: '⚡',
    descriptionFr: 'L’énergie d’Oran et de Sidi Bel Abbès : Khaled, Hasni, Mami et la modernité pop urbaine.',
    descriptionAr: 'طاقة وهران والراي العاطفي الأصيل الذي وصل إلى العالمية.',
    gradient: 'from-orange-600 to-red-500',
    badgeBg: 'bg-orange-50 dark:bg-orange-950/60',
    badgeText: 'text-orange-800 dark:text-orange-300',
    preset: 'rai_electro',
  },
  {
    id: 'andalou',
    labelFr: 'Andalou, Malouf & Hawzi',
    labelAr: 'المالوف والأندلسي والحوزي',
    icon: '🎻',
    descriptionFr: 'Noblesse de Constantine (Malouf), Tlemcen (Hawzi/Gharnati) et Alger (Sanâa) pour les noces d’apparat.',
    descriptionAr: 'فخامة المالوف القسنطيني والحوزي التلمساني والصنعة العاصمية لدخول العروسين.',
    gradient: 'from-emerald-700 to-teal-600',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    preset: 'malouf_oud',
  },
  {
    id: 'kabyle',
    labelFr: 'Kabyle & Patrimoine Amazigh',
    labelAr: 'الأغنية القبائلية والتراث الأمازيغي',
    icon: '🌿',
    descriptionFr: 'Idir, Matoub, Takfarinas : cordes acoustiques, flûtes du Djurdjura et fêtes montagnardes.',
    descriptionAr: 'أعذب ألحان جبال جرجرة مع قيثارة إيدير ومعطوب وأهازيج الأعراس.',
    gradient: 'from-lime-600 to-emerald-600',
    badgeBg: 'bg-lime-50 dark:bg-lime-950/60',
    badgeText: 'text-lime-800 dark:text-lime-300',
    preset: 'kabyle_fete',
  },
  {
    id: 'sahraoui',
    labelFr: 'Sahraoui, Touareg & Gnawa',
    labelAr: 'الصحراوي والڨناوي والبلوز',
    icon: '🏜️',
    descriptionFr: 'Tinariwen, guitare du désert (Hoggar, Tassili), Goumbri et transes mystiques de Béchar et Timimoun.',
    descriptionAr: 'بلوز الصحراء والهقار والڨناوي العريق بأوتار القمبري وروح الواحات.',
    gradient: 'from-amber-700 to-orange-600',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    badgeText: 'text-amber-800 dark:text-amber-300',
    preset: 'sahraoui_desert',
  },
  {
    id: 'staifi_chaoui',
    labelFr: 'Staïfi, Chaoui & Aurès',
    labelAr: 'السطايفي والشاوي وإيقاعات الأوراس',
    icon: '🥁',
    descriptionFr: 'Rythmes festifs de Sétif et Bordj, puissance de la Gasba et du Bendir des Aurès (Batna, Khenchela).',
    descriptionAr: 'حيوية السطايفي وبندير الأوراس والقصبة الشاوية التي تشعل قاعات الأفراح.',
    gradient: 'from-rose-600 to-pink-500',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
    badgeText: 'text-rose-800 dark:text-rose-300',
    preset: 'staifi_gasba',
  },
  {
    id: 'zorna',
    labelFr: 'Zorna, Cortège & Baroud',
    labelAr: 'الزرنة ومواكب الأعراس والبارود',
    icon: '🎺',
    descriptionFr: 'L’arrivée royale des mariés, résonance de la Zorna, Bendir et youyous retentissants.',
    descriptionAr: 'أجواء موكب العرس الملكي بالزرنة والبندير والبارود مع الزغاريد الجزائرية.',
    gradient: 'from-red-600 to-orange-500',
    badgeBg: 'bg-red-50 dark:bg-red-950/60',
    badgeText: 'text-red-800 dark:text-red-300',
    preset: 'zorna_bendir',
  },
  {
    id: 'romantique',
    labelFr: 'Romantique, Tarab & Noces',
    labelAr: 'الرومانسي والطرب وأجواء العرس',
    icon: '🌹',
    descriptionFr: 'Warda Al-Jazairia, Babylone Zina, piano doux et violons pour les demandes en mariage et moments d’émotion.',
    descriptionAr: 'سيدة الطرب وردة الجزائرية، فرقة بابيلون، بيانو العشق ولحظات العمر الشاعرية.',
    gradient: 'from-purple-600 to-rose-500',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
    badgeText: 'text-purple-800 dark:text-purple-300',
    preset: 'romantic_piano',
  },
  {
    id: 'lounge',
    labelFr: 'Lounge Méditerranéen & Chill',
    labelAr: 'لاونج متوسطي واسترخاء',
    icon: '🎷',
    descriptionFr: 'Ambiance feutrée bord de mer, mandole jazzifié, saxophone et détente pour dîners intimes.',
    descriptionAr: 'أنغام شاطئية متوسطية هادئة وسكسفون لعشاء رومانسي وأجواء راقية.',
    gradient: 'from-sky-600 to-blue-500',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/60',
    badgeText: 'text-sky-800 dark:text-sky-300',
    preset: 'mediterranean_lounge',
  },
  {
    id: 'rap_urbain',
    labelFr: 'Rap DZ & Fusion Urbaine',
    labelAr: 'الراب والموسيقى الحضرية',
    icon: '🎤',
    descriptionFr: 'Le pouls de la jeunesse algérienne : flow mélodique, beats modernes et mandole électrique.',
    descriptionAr: 'نبض الشباب الجزائري وإيقاعات الراب الحديث الممزوجة بالأصالة.',
    gradient: 'from-slate-800 to-indigo-900',
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-indigo-800 dark:text-indigo-300',
    preset: 'rap_beat',
  },
  {
    id: 'traditionnel',
    labelFr: 'Henné & Bénédictions',
    labelAr: 'ليلة الحناء والبركة التراثية',
    icon: '🌿',
    descriptionFr: 'Chants traditionnels de la mariée, Laylat El Henna, prières nuptiales et souhaits de bonheur.',
    descriptionAr: 'مدائح وأناشيد ليلة الحناء التراثية ودعوات البركة للعروسين.',
    gradient: 'from-teal-700 to-emerald-600',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/60',
    badgeText: 'text-teal-800 dark:text-teal-300',
    preset: 'cortege_royal',
  },
  {
    id: 'youtube',
    labelFr: 'Imports & Favoris YouTube',
    labelAr: 'مقاطع يوتيوب ومفضلاتي',
    icon: '▶️',
    descriptionFr: 'Vos morceaux importés instantanément depuis YouTube avec lecteur intégré et vidéo.',
    descriptionAr: 'المقاطع الخاصة بك المستوردة برابط يوتيوب المباشر.',
    gradient: 'from-rose-600 to-red-600',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
    badgeText: 'text-rose-800 dark:text-rose-300',
    preset: 'rai_electro',
  },
];

export interface MusicTrack {
  id: string;
  title: string;
  titleAr: string;
  genre: MusicGenreId;
  genreLabel: string;
  genreLabelAr: string;
  artist: string;
  duration: number; // in seconds
  bpm: number;
  icon: string;
  coverImage: string;
  audioUrl: string; // audio sample or synth preset
  synthPreset: MusicSynthPreset;
  descriptionFr: string;
  descriptionAr: string;
  recommendedFor: ('venue' | 'fashion' | 'travel' | 'photo' | 'catering' | 'jewelry' | 'general_user' | 'couple')[];
  youtubeId?: string;
  youtubeUrl?: string;
  isCustomImport?: boolean;
  importedBy?: string;
  createdAt?: string;
  moodTag?: 'cortege' | 'romantique' | 'fete' | 'casbah_cafe' | 'desert_chill' | 'energy';
  moodTagLabelFr?: string;
  moodTagLabelAr?: string;
}

export const NISFY_MUSIC_CATALOG: MusicTrack[] = [
  {
    id: 'track-idir-vava-inouva',
    title: 'A Vava Inouva • Idir (Guitare & Flûte Berbère)',
    titleAr: 'أ بابا إينوفا • إيدير (أيقونة الأغنية القبائلية والجزائرية)',
    genre: 'kabyle',
    genreLabel: 'Idir & Patrimoine Berbère',
    genreLabelAr: 'إيدير والتراث الجزائري الأصيل',
    artist: 'Idir (إيدير) • Chef-d’œuvre Algérien',
    duration: 58,
    bpm: 92,
    icon: '🎸',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/415/415511_5121236-lq.mp3',
    synthPreset: 'kabyle_fete',
    descriptionFr: 'Le monument musical universel d’Idir, arpèges acoustiques et poésie millénaire de Kabylie.',
    descriptionAr: 'التحفة الخالدة للموسيقار إيدير، أنغام القيثارة الأصيلة ودفء التراث القبائلي الجزائري.',
    recommendedFor: ['fashion', 'travel', 'general_user', 'couple'],
  },
  {
    id: 'track-chaabi-dahmane',
    title: 'Ya Rayah • Chaâbi Algérois (Dahmane El Harrachi)',
    titleAr: 'يا الرايح • كلاسيكيات الشعبي العاصمي (دحمان الحراشي)',
    genre: 'chaabi',
    genreLabel: 'Chaâbi Algérois Culte',
    genreLabelAr: 'شعبي عاصمي عريق',
    artist: 'Dahmane El Harrachi • Patrimoine d’Alger',
    duration: 54,
    bpm: 108,
    icon: '🪕',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/563/563816_11861866-lq.mp3',
    synthPreset: 'chaabi_mandole',
    descriptionFr: 'Le chant légendaire de la Casbah et de la diaspora algérienne au son inimitable du mandole.',
    descriptionAr: 'الأغنية الأسطورية لقلب القصبة العتيقة وعشاق الشعبي والمهجر.',
    recommendedFor: ['venue', 'catering', 'general_user', 'couple'],
  },
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
    moodTag: 'cortege',
    moodTagLabelFr: 'Nuit du Henné & Bénédictions',
    moodTagLabelAr: 'ليلة الحناء المباركة',
  },
  {
    id: 'track-sahraoui-tinariwen',
    title: 'Toumast • Tinariwen (Blues du Désert Touareg)',
    titleAr: 'تومست • تيناريوين (بلوز الصحراء الكبرى وتمنراست)',
    genre: 'sahraoui',
    genreLabel: 'Sahraoui & Blues Touareg',
    genreLabelAr: 'صحراوي وبلوز الطوارق',
    artist: 'Tinariwen (تمنراست وإيليزي)',
    duration: 56,
    bpm: 98,
    icon: '🏜️',
    coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/415/415511_5121236-lq.mp3',
    synthPreset: 'sahraoui_desert',
    descriptionFr: 'Guitare électrique touarègue et clappements de mains sous la voûte céleste du Hoggar et Tassili n’Ajjer.',
    descriptionAr: 'أنغام قيثارة الطوارق الساحرة وأهازيج الصحراء الجزائرية الشاسعة تحت سماء الهقار.',
    recommendedFor: ['travel', 'general_user', 'couple'],
    moodTag: 'desert_chill',
    moodTagLabelFr: 'Désert & Évasion Touarègue',
    moodTagLabelAr: 'أجواء الصحراء والهقار',
  },
  {
    id: 'track-gnawa-djam',
    title: 'Ya Qawm • Gnawa Fusion & Guembri',
    titleAr: 'يا قوم • قناوي جزائري وأوتار القمبري',
    genre: 'sahraoui',
    genreLabel: 'Diwan Gnawa & Guembri',
    genreLabelAr: 'ديوان قناوي وقرقابو',
    artist: 'Diwan Béchar & Grooves du Sud',
    duration: 52,
    bpm: 112,
    icon: '🪘',
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/512/512471_9497060-lq.mp3',
    synthPreset: 'sahraoui_desert',
    descriptionFr: 'Transe spirituelle et festive du Sud-Ouest algérien : Guembri ancestral, karkabous et voix chaleureuses.',
    descriptionAr: 'روحانيات وإيقاعات القناوي الجزائري الأصيل من بشار وتيميمون مع القرقابو.',
    recommendedFor: ['venue', 'travel', 'general_user'],
    moodTag: 'fete',
    moodTagLabelFr: 'Transe Festive Gnawa',
    moodTagLabelAr: 'حيوية الديوان والقناوي',
  },
  {
    id: 'track-staifi-setif',
    title: 'Sétif El Ali • Sraoui & Bendir Staïfi',
    titleAr: 'سطيف العالي • سراوي وبندير سطايفي حماسي للأفراح',
    genre: 'staifi_chaoui',
    genreLabel: 'Staïfi & Fêtes des Hauts-Plateaux',
    genreLabelAr: 'سطايفي حماسي للأعراس',
    artist: 'Troupe El Fouara (Sétif & Bordj)',
    duration: 48,
    bpm: 130,
    icon: '🥁',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/612/612624_5674468-lq.mp3',
    synthPreset: 'staifi_gasba',
    descriptionFr: 'Le rythme fou des mariages sétifiens : clavier synthé festif, bendir et joie collective communicative.',
    descriptionAr: 'أجواء عرس سطايفي أصيل من عين الفوارة، الإيقاع المفضل لإشعال قاعات الحفلات والرقص.',
    recommendedFor: ['venue', 'fashion', 'general_user'],
    moodTag: 'fete',
    moodTagLabelFr: 'Danse & Ambiance Mariage',
    moodTagLabelAr: 'رقص وفرح عائلي',
  },
  {
    id: 'track-chaoui-aures',
    title: 'Légendes des Aurès • Gasba & Chants Chaouis',
    titleAr: 'أساطير الأوراس • قصبة وشاوي أصيل وبندير بارود',
    genre: 'staifi_chaoui',
    genreLabel: 'Chaoui & Patrimoine des Aurès',
    genreLabelAr: 'شاوي وتراث الأوراس الأشم',
    artist: 'Maîtres de la Gasba (Batna & Khenchela)',
    duration: 54,
    bpm: 116,
    icon: '🌾',
    coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/415/415511_5121236-lq.mp3',
    synthPreset: 'staifi_gasba',
    descriptionFr: 'La fierté et la noblesse des montagnes des Aurès, souffle profond de la Gasba et bendir héroïque.',
    descriptionAr: 'أصالة ونخوة جبال الأوراس الشامخة، نغمات القصبة الشاوية وبندير الشاوية الشجي.',
    recommendedFor: ['venue', 'travel', 'general_user'],
    moodTag: 'energy',
    moodTagLabelFr: 'Fierté & Tradition Aurès',
    moodTagLabelAr: 'أصالة الأوراس الشاوية',
  },
  {
    id: 'track-chaabi-guerrouabi',
    title: 'El Bareh • El Hachemi Guerrouabi (Mandole Impérial)',
    titleAr: 'البارح كان في عمري عشرين • الهاشمي قروابي',
    genre: 'chaabi',
    genreLabel: 'Chaâbi Royal & Qçid',
    genreLabelAr: 'شعبي راقٍ وقصيد أصيل',
    artist: 'El Hachemi Guerrouabi (الهاشمي قروابي)',
    duration: 58,
    bpm: 102,
    icon: '🪕',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/563/563816_11861866-lq.mp3',
    synthPreset: 'chaabi_mandole',
    descriptionFr: 'L’élégance suprême du maître El Hachemi Guerrouabi, virtuosité du mandole et voix de velours.',
    descriptionAr: 'قمة الذوق والرقي مع الشيخ الهاشمي قروابي، سحر نغمات المندول وصوت الأناقة العاصمية.',
    recommendedFor: ['venue', 'catering', 'couple', 'general_user'],
    moodTag: 'casbah_cafe',
    moodTagLabelFr: 'Soirée Casbah & Nostalgie',
    moodTagLabelAr: 'جلسة قصبية وأصالة',
  },
  {
    id: 'track-chaabi-ezzahi',
    title: 'Zinou • Cheikh Amar Ezzahi (La Perle de la Casbah)',
    titleAr: 'زينو • الشيخ اعمر الزاهي (جوهرة القصبة والقلب)',
    genre: 'chaabi',
    genreLabel: 'Chaâbi d’Alger & Maîtrise',
    genreLabelAr: 'شعبي عاصمي عذب',
    artist: 'Amar Ezzahi (اعمر الزاهي)',
    duration: 55,
    bpm: 106,
    icon: '👑',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/563/563816_11861866-lq.mp3',
    synthPreset: 'chaabi_mandole',
    descriptionFr: 'Le son inimitable de « Cheikh Labled », poésie populaire et ferveur des mariages traditionnels d’Alger.',
    descriptionAr: 'صوت شيخ البلاد اعمر الزاهي الذي أضاء ليالي أفراح العاصمة والقلوب الصادقة.',
    recommendedFor: ['venue', 'couple', 'general_user'],
    moodTag: 'casbah_cafe',
    moodTagLabelFr: 'Ambiance Casbah Pure',
    moodTagLabelAr: 'جلسة عاصمية خالدة',
  },
  {
    id: 'track-rai-hasni',
    title: 'Mazel Souvenir Andi • Cheb Hasni (Roi du Raï Love)',
    titleAr: 'مازال سوفينير عندي • الشاب حسني (أسطورة الراي الرومانسي)',
    genre: 'rai_moderne',
    genreLabel: 'Raï Love Romantique',
    genreLabelAr: 'راي عاطفي رومانسي',
    artist: 'Cheb Hasni (الشاب حسني)',
    duration: 52,
    bpm: 108,
    icon: '🌹',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/456/456965_5121236-lq.mp3',
    synthPreset: 'rai_electro',
    descriptionFr: 'L’hymne intemporel du Raï sentimental de Cheb Hasni, romance et sincérité des amoureux algériens.',
    descriptionAr: 'تحفة أمير الأغنية العاطفية الشاب حسني، عنوان المشاعر الصادقة والذكريات الجميلة للأزواج.',
    recommendedFor: ['couple', 'photo', 'jewelry', 'general_user'],
    moodTag: 'romantique',
    moodTagLabelFr: 'Romance & Hasni Love',
    moodTagLabelAr: 'رومانسية حسني الخالدة',
  },
  {
    id: 'track-rai-khaled',
    title: 'Didi & Bakhta • Cheb Khaled (King of Raï)',
    titleAr: 'ديدي وبختة • الشاب خالد (ملك الراي وسفير الجزائر)',
    genre: 'rai_moderne',
    genreLabel: 'Raï Légende Universelle',
    genreLabelAr: 'راي عالمي وأسطوري',
    artist: 'Cheb Khaled (الشاب خالد)',
    duration: 50,
    bpm: 124,
    icon: '⭐',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/456/456965_5121236-lq.mp3',
    synthPreset: 'rai_electro',
    descriptionFr: 'Le groove planétaire du Raï d’Oran qui fait danser la diaspora et le monde entier depuis des décennies.',
    descriptionAr: 'الإيقاع الساحر لملك الراي الشاب خالد الذي جمع الشرق والغرب وجعل العالم يرقص على أنغام الجزائر.',
    recommendedFor: ['venue', 'travel', 'general_user'],
    moodTag: 'fete',
    moodTagLabelFr: 'Groove & Fête Internationale',
    moodTagLabelAr: 'بهجة واحتفال عالمي',
  },
  {
    id: 'track-hawzi-tlemcen',
    title: 'Ryam Ya Ryam • Hawzi de Tlemcen',
    titleAr: 'ريام يا ريام • حوزي وغرناطي تلمساني أصيل',
    genre: 'andalou',
    genreLabel: 'Hawzi & Gharnati de Tlemcen',
    genreLabelAr: 'حوزي وغرناطي تلمساني',
    artist: 'Orchestre Gharnati de Tlemcen',
    duration: 62,
    bpm: 94,
    icon: '🪕',
    coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/415/415511_5121236-lq.mp3',
    synthPreset: 'malouf_oud',
    descriptionFr: 'Splendeur des palais de Tlemcen : poésie amoureuse classique, violon andalou et luth pour les mariages aristocratiques.',
    descriptionAr: 'رقي قصور تلمسان الزيانية، قصائد الغزل العفيف والأوتار الأندلسية العذبة لحفلات الزفاف الراقية.',
    recommendedFor: ['jewelry', 'fashion', 'venue', 'couple'],
    moodTag: 'romantique',
    moodTagLabelFr: 'Palais Andalou & Mariage Royal',
    moodTagLabelAr: 'أعراس ملكية أندلسية',
  },
  {
    id: 'track-rap-alger',
    title: 'Casbah Flow • Melodic Rap DZ & Mandole Fusion',
    titleAr: 'كازبا فلو • راب جزائري عصري ومندول إلكتروني',
    genre: 'rap_urbain',
    genreLabel: 'Rap DZ & Fusion Urbaine',
    genreLabelAr: 'راب جزائري عصري',
    artist: 'Nisfy Urban DZ Collective',
    duration: 46,
    bpm: 120,
    icon: '🎤',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/456/456965_5121236-lq.mp3',
    synthPreset: 'rap_beat',
    descriptionFr: 'Le nouveau souffle de la scène urbaine algérienne : beat trap percutant croisé avec des mélodies de mandole.',
    descriptionAr: 'الإيقاع العصري لشباب الجزائر: بيتات حديثة ممزوجة بلمسة المندول والروح الجزائرية.',
    recommendedFor: ['travel', 'general_user'],
    moodTag: 'energy',
    moodTagLabelFr: 'Énergie Urbaine DZ',
    moodTagLabelAr: 'طاقة وحيوية شبابية',
  },
  {
    id: 'track-baroud-tlemcen',
    title: 'Baroud & Mawakib • Célébration Royale d’Oranie',
    titleAr: 'بارود ومواكب • أهازيج الغرب الجزائري للأعراس والفرسان',
    genre: 'zorna',
    genreLabel: 'Baroud & Fantasia Nuptiale',
    genreLabelAr: 'بارود وفانتازيا الأعراس',
    artist: 'Troupe Baroud d’Affrah (Tlemcen & Mascara)',
    duration: 50,
    bpm: 126,
    icon: '🔥',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/612/612624_5674468-lq.mp3',
    synthPreset: 'zorna_bendir',
    descriptionFr: 'Ferveur des cortèges équestres et mariages d’Oranie : coups de baroud festifs, bendir et chants de triomphe.',
    descriptionAr: 'أهازيج الفروسية ومواكب الأعراس العريقة في الغرب الجزائري، بهجة البارود والبندير الملكي.',
    recommendedFor: ['venue', 'fashion', 'general_user'],
    moodTag: 'cortege',
    moodTagLabelFr: 'Entrée Cortège & Baroud',
    moodTagLabelAr: 'موكب الأعراس والبارود',
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
  {
    id: 'yt_hasni_souvenir',
    title: 'Mazel Souvenir Andi (مازال سوفينير عندي)',
    titleAr: 'مازال سوفينير عندي • أسطورة الراي الشاب حسني',
    artist: 'Cheb Hasni',
    youtubeId: 'bA4yN9Yw6b0',
    genre: 'rai_moderne',
    genreLabel: 'Raï Love Éternel',
    genreLabelAr: 'راي عاطفي خالد',
    icon: '🌹',
    descriptionFr: 'La référence absolue du romantisme algérien par le regretté roi du Raï Love.',
    synthPreset: 'rai_electro',
  },
  {
    id: 'yt_tinariwen_desert',
    title: 'Sastanàqqàm • Tinariwen (Blues Sahraoui)',
    titleAr: 'سستاناقام • تيناريوين (بلوز الصحراء الكبرى)',
    artist: 'Tinariwen',
    youtubeId: 'vACZA9dGvV4',
    genre: 'sahraoui',
    genreLabel: 'Touareg & Sahraoui',
    genreLabelAr: 'صحراوي وطوارق',
    icon: '🏜️',
    descriptionFr: 'Guitare touarègue envoûtante célébrée à travers tous les continents.',
    synthPreset: 'sahraoui_desert',
  },
  {
    id: 'yt_takfarinas_zaama',
    title: 'Zaama Zaama (زعمة زعمة)',
    titleAr: 'زعمة زعمة • النجم تكفاريناس',
    artist: 'Takfarinas',
    youtubeId: 'bK4T5iL1KzA',
    genre: 'kabyle',
    genreLabel: 'Kabyle & Yal Groove',
    genreLabelAr: 'يال وقبايلي احتفالي',
    icon: '⚡',
    descriptionFr: 'Yal et mandole électrique survolté pour enflammer les mariages et festivités.',
    synthPreset: 'kabyle_fete',
  },
];

