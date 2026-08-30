// Creative Video Filters & Aesthetic Presets for Nisfy
export interface VideoFilterPreset {
  id: string;
  nameFr: string;
  nameAr: string;
  cssFilter: string;
  overlayGradient?: string;
  colorBadge: string;
}

export const VIDEO_FILTERS: VideoFilterPreset[] = [
  {
    id: 'none',
    nameFr: 'Naturel (Original)',
    nameAr: 'طبيعي',
    cssFilter: 'none',
    colorBadge: '#94a3b8',
  },
  {
    id: 'vintage_alger',
    nameFr: 'Casbah Vintage 1970',
    nameAr: 'عتيق القصبة',
    cssFilter: 'sepia(0.35) contrast(1.15) brightness(1.05) saturate(1.2)',
    overlayGradient: 'radial-gradient(circle, rgba(255,248,220,0.1) 0%, rgba(120,53,15,0.15) 100%)',
    colorBadge: '#d97706',
  },
  {
    id: 'sunset_oran',
    nameFr: 'Coucher de Soleil Oran',
    nameAr: 'غروب وهران',
    cssFilter: 'saturate(1.4) contrast(1.1) hue-rotate(-10deg)',
    overlayGradient: 'linear-gradient(180deg, rgba(255,107,53,0.15) 0%, rgba(225,29,72,0.15) 100%)',
    colorBadge: '#f43f5e',
  },
  {
    id: 'warm_sahara',
    nameFr: 'Sahara Doré & Tassili',
    nameAr: 'رمال الصحراء الذهبية',
    cssFilter: 'brightness(1.08) contrast(1.1) saturate(1.3) sepia(0.2)',
    overlayGradient: 'linear-gradient(45deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.1) 100%)',
    colorBadge: '#f59e0b',
  },
  {
    id: 'glamour_fete',
    nameFr: 'Éclat Fête & Mariage Royal',
    nameAr: 'بريق الأعراس الملكية',
    cssFilter: 'brightness(1.12) contrast(1.08) saturate(1.35)',
    overlayGradient: 'radial-gradient(circle, rgba(253,224,71,0.18) 0%, rgba(236,72,153,0.12) 100%)',
    colorBadge: '#ec4899',
  },
  {
    id: 'noir_casbah',
    nameFr: 'Cinéma Noir & Blanc Casbah',
    nameAr: 'سينما أبيض وأسود',
    cssFilter: 'grayscale(1) contrast(1.25) brightness(0.95)',
    colorBadge: '#475569',
  },
];

export interface CaptionStylePreset {
  id: string;
  nameFr: string;
  nameAr: string;
  classes: string;
}

export const CAPTION_STYLES: CaptionStylePreset[] = [
  {
    id: 'darija_gold',
    nameFr: 'Or Royal & Calligraphie',
    nameAr: 'ذهبي أصيل',
    classes: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black px-4 py-1.5 rounded-2xl shadow-xl shadow-amber-500/30 border border-yellow-200 uppercase tracking-wide text-xs sm:text-sm',
  },
  {
    id: 'neon_nisfy',
    nameFr: 'Néon Flamme Nisfy',
    nameAr: 'نيون نصفي',
    classes: 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white font-black px-4 py-1.5 rounded-2xl shadow-xl shadow-red-500/40 border border-white/40 tracking-wider text-xs sm:text-sm',
  },
  {
    id: 'subtitles_clean',
    nameFr: 'Sous-titre Pro Netflix',
    nameAr: 'ترجمة احترافية',
    classes: 'bg-black/85 backdrop-blur-md text-white font-extrabold px-3 py-1.5 rounded-xl border border-white/20 text-xs sm:text-sm shadow-lg',
  },
  {
    id: 'badge_authentic',
    nameFr: 'Badge Terroir & Wilaya',
    nameAr: 'شعار الولاية والتقاليد',
    classes: 'bg-emerald-900/90 backdrop-blur-md text-emerald-200 border border-emerald-400/50 font-bold px-3 py-1 rounded-full text-xs shadow-md',
  },
];
