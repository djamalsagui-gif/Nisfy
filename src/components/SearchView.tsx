import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  Users,
  Film,
  FileText,
  Hash,
  MapPin,
  Utensils,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Heart,
  MessageCircle,
  ShoppingBag,
  Layers,
  ArrowRight,
  TrendingUp,
  X,
  Play,
  Share2,
  Mic,
  RotateCcw,
  CheckCircle2,
  Car,
  ExternalLink,
  Phone,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { UserProfile, SocialPost } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { WILAYAS_LIST } from '../data/wilayas';
import { INITIAL_SOCIAL_POSTS } from '../data/socialFeedData';
import { INITIAL_WEDDING_VENDORS } from '../data/weddingVendorsData';
import { CHEF_NADJET_PROFILE } from '../data/chefNadjetData';
import { INITIAL_SHOP_PRODUCTS } from '../data/youthShopData';
import { SPONSORED_ADS } from '../data/advertisements';
import { VoiceSearchModal } from './voice/VoiceSearchModal';
import {
  SearchCategory,
  VoiceSearchIntent,
} from '../hooks/useWebSpeechSearch';
import { datingSounds } from '../utils/soundEffects';

interface SearchViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  onSelectUserForChat: (user: UserProfile) => void;
  onSelectUserForProfile: (user: UserProfile) => void;
  onSelectTab: (tab: any) => void;
}

const TRENDING_HASHTAGS = [
  { tag: '#MariageDZ', count: '14.2K', category: 'mariage' },
  { tag: 'location voiture', count: '12.4K', category: 'cortege' },
  { tag: '#KhetbaAlger', count: '8.5K', category: 'tradition' },
  { tag: 'location robe', count: '9.8K', category: 'tenues' },
  { tag: '#OranElBahia', count: '6.1K', category: 'wilaya' },
  { tag: '#CheddaTlemcen', count: '11.8K', category: 'culture' },
  { tag: '#SalhiyaDZ', count: '9.3K', category: 'communaute' },
  { tag: '#DiasporaDZ', count: '5.7K', category: 'diaspora' },
  { tag: '#RecettesFête', count: '7.9K', category: 'cuisine' },
];

const QUICK_SEARCH_SUGGESTIONS = [
  { labelFr: '🚗 Location voitures cortège', labelAr: '🚗 كراء سيارات الأعراس', query: 'location' },
  { labelFr: '👗 Location robes & Caftans', labelAr: '👗 كراء قفطان وفساتين', query: 'robe' },
  { labelFr: '🏰 Salles des fêtes', labelAr: '🏰 قاعات الحفلات', query: 'salle' },
  { labelFr: '🍰 Pâtisserie & Gâteaux', labelAr: '🍰 حلويات الأعراس', query: 'gâteau' },
  { labelFr: '👟 Streetwear DZ', labelAr: '👟 ستريت وير', query: 'streetwear' },
  { labelFr: '📍 Alger (16)', labelAr: '📍 الجزائر (16)', query: '16' },
];

const COMMUNITY_GROUPS = [
  {
    id: 'grp-alger',
    titleFr: 'Entraide & Rencontres Alger & Centre (16, 09, 35, 42)',
    titleAr: 'مجموعة التعارف واللقاءات الجزائر والوسط',
    wilaya: 'Alger (16)',
    membersCount: 3420,
    category: 'wilaya',
    image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'grp-oran',
    titleFr: 'Célibataires & Projets Mariage Oran & Ouest',
    titleAr: 'مشاريع الزواج وهران والغرب الجزائري',
    wilaya: 'Oran (31)',
    membersCount: 2150,
    category: 'wilaya',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'grp-diaspora',
    titleFr: 'Diaspora Algérienne (France, Canada, Europe) & Retour au Pays',
    titleAr: 'أبناء الجالية بالخارج ومشروع الاستقرار',
    wilaya: 'Diaspora',
    membersCount: 4890,
    category: 'diaspora',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'grp-khetba',
    titleFr: 'Conseils Khetba, Trouseau & Préparatifs Zawaj',
    titleAr: 'نصائح الخطوبة وجهاز العروس والمهر الشرعي',
    wilaya: 'National',
    membersCount: 6200,
    category: 'mariage',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400',
  },
];

export function SearchView({
  currentUser,
  allUsers,
  searchQuery: propSearchQuery,
  onSearchQueryChange,
  onSelectUserForChat,
  onSelectUserForProfile,
  onSelectTab,
}: SearchViewProps) {
  const { isArabic } = useLanguage();
  const [localQuery, setLocalQuery] = useState(propSearchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const [selectedWilayaFilter, setSelectedWilayaFilter] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [lastVoiceSearch, setLastVoiceSearch] = useState<VoiceSearchIntent | null>(null);
  const [hasSearched, setHasSearched] = useState(Boolean(propSearchQuery?.trim()));
  const [isSearching, setIsSearching] = useState(false);
  const [searchSubmittedFeedback, setSearchSubmittedFeedback] = useState(false);
  const [autoCategorySwitched, setAutoCategorySwitched] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize when prop changes from outside (e.g. from navbar)
  useEffect(() => {
    if (propSearchQuery !== undefined) {
      setLocalQuery(propSearchQuery);
      if (propSearchQuery.trim()) {
        setHasSearched(true);
      }
    }
  }, [propSearchQuery]);

  const searchQuery = localQuery;
  const setSearchQuery = (query: string) => {
    setLocalQuery(query);
    onSearchQueryChange?.(query);
    setAutoCategorySwitched(null);
    if (!query.trim()) {
      setHasSearched(false);
      setSearchSubmittedFeedback(false);
    }
  };

  // Submit and Enter key handler
  const handleExecuteSearch = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
    }

    // 1. Unfocus/blur active inputs so on mobile the keyboard drops and results are visible
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    searchInputRef.current?.blur();

    // 2. Play subtle tap sound
    try {
      datingSounds.playTapSound();
    } catch {
      // Audio playback failsafe
    }

    // 3. Mark search active and trigger feedback
    setIsSearching(true);
    setHasSearched(true);
    setSearchSubmittedFeedback(true);

    // 4. Auto-broaden category if current category has 0 results for this query
    const queryStr = (localQuery || '').toLowerCase().trim();
    if (queryStr && selectedCategory !== 'all') {
      let currentCategoryCount = 0;
      if (selectedCategory === 'people') currentCategoryCount = matchedUsers.length;
      else if (selectedCategory === 'marketplace') currentCategoryCount = matchedVendors.length + matchedAds.length;
      else if (selectedCategory === 'shop') currentCategoryCount = matchedProducts.length;
      else if (selectedCategory === 'videos') currentCategoryCount = matchedPosts.length;
      else if (selectedCategory === 'groups') currentCategoryCount = matchedGroups.length;
      else if (selectedCategory === 'wilayas') currentCategoryCount = matchedWilayas.length;

      if (currentCategoryCount === 0 && totalResultsCount > 0) {
        if (matchedVendors.length > 0 || matchedAds.length > 0) {
          setSelectedCategory('marketplace');
          setAutoCategorySwitched('marketplace');
        } else if (matchedProducts.length > 0) {
          setSelectedCategory('shop');
          setAutoCategorySwitched('shop');
        } else {
          setSelectedCategory('all');
          setAutoCategorySwitched('all');
        }
      } else {
        setAutoCategorySwitched(null);
      }
    } else {
      setAutoCategorySwitched(null);
    }

    // 5. Scroll smoothly to results section
    setTimeout(() => {
      setIsSearching(false);
      const targetEl = document.getElementById('search-results-section') || resultsContainerRef.current;
      if (targetEl) {
        const yOffset = -80;
        const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 200);
  };

  // Handle Voice Search Command
  const handleApplyVoiceSearch = (intent: VoiceSearchIntent) => {
    setLastVoiceSearch(intent);

    if (intent.category) {
      setSelectedCategory(intent.category);
    }

    if (intent.wilayaCode) {
      setSelectedWilayaFilter(intent.wilayaCode);
    }

    // Set search query if there's specific text
    if (intent.cleanedQuery) {
      setSearchQuery(intent.cleanedQuery);
    } else if (intent.rawTranscript) {
      setSearchQuery(intent.rawTranscript);
    }
    setHasSearched(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedWilayaFilter('');
    setSelectedCategory('all');
    setLastVoiceSearch(null);
    setHasSearched(false);
    datingSounds.playTapSound();
  };

  // 1. Filtered Users
  const matchedUsers = useMemo(() => {
    const seen = new Set<string>();
    return allUsers.filter((user) => {
      if (!user || !user.id || seen.has(user.id) || user.id === currentUser.id) return false;
      const query = (searchQuery || '').toLowerCase().trim();
      const matchQuery =
        !query ||
        (user.pseudo && user.pseudo.toLowerCase().includes(query)) ||
        (user.city && user.city.toLowerCase().includes(query)) ||
        (user.wilayaCode && user.wilayaCode.includes(query)) ||
        (user.occupation && user.occupation.toLowerCase().includes(query)) ||
        (user.bio && user.bio.toLowerCase().includes(query)) ||
        (user.interests && user.interests.some((i) => Boolean(i) && i.toLowerCase().includes(query)));

      const matchWilaya = !selectedWilayaFilter || user.wilayaCode === selectedWilayaFilter;

      if (matchQuery && matchWilaya) {
        seen.add(user.id);
        return true;
      }
      return false;
    });
  }, [allUsers, currentUser, searchQuery, selectedWilayaFilter]);

  // 2. Filtered Wedding Marketplace Vendors & Services & Location
  const matchedVendors = useMemo(() => {
    const query = (searchQuery || '').toLowerCase().trim();
    return INITIAL_WEDDING_VENDORS.filter((v) => {
      const matchQuery =
        !query ||
        (v.name && v.name.toLowerCase().includes(query)) ||
        (v.wilayaName && v.wilayaName.toLowerCase().includes(query)) ||
        (v.wilayaCode && v.wilayaCode.includes(query)) ||
        (v.category && v.category.toLowerCase().includes(query)) ||
        (v.descriptionFr && v.descriptionFr.toLowerCase().includes(query)) ||
        (v.descriptionAr && v.descriptionAr.includes(query)) ||
        (v.priceRange && v.priceRange.toLowerCase().includes(query)) ||
        (v.priceStartingAt && v.priceStartingAt.toLowerCase().includes(query)) ||
        (v.services && v.services.some((s) => s.toLowerCase().includes(query)));

      const matchWilaya = !selectedWilayaFilter || v.wilayaCode === selectedWilayaFilter;
      return matchQuery && matchWilaya;
    });
  }, [searchQuery, selectedWilayaFilter]);

  // 3. Filtered Shop / Drops / Vide-Dressing Products
  const matchedProducts = useMemo(() => {
    const query = (searchQuery || '').toLowerCase().trim();
    return INITIAL_SHOP_PRODUCTS.filter((p) => {
      const matchQuery =
        !query ||
        p.titleFr.toLowerCase().includes(query) ||
        p.titleAr.includes(query) ||
        p.descriptionFr.toLowerCase().includes(query) ||
        p.descriptionAr.includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.sellerName.toLowerCase().includes(query) ||
        p.sellerWilaya.toLowerCase().includes(query) ||
        p.sellerWilayaCode.includes(query) ||
        (p.badges && p.badges.some((b) => b.toLowerCase().includes(query)));

      const matchWilaya = !selectedWilayaFilter || p.sellerWilayaCode === selectedWilayaFilter;
      return matchQuery && matchWilaya;
    });
  }, [searchQuery, selectedWilayaFilter]);

  // 4. Filtered Partner Ads & Official Sponsors
  const matchedAds = useMemo(() => {
    const query = (searchQuery || '').toLowerCase().trim();
    if (!query) return [];
    return SPONSORED_ADS.filter((ad) => {
      return (
        ad.brandName.toLowerCase().includes(query) ||
        ad.brandNameAr.includes(query) ||
        ad.category.toLowerCase().includes(query) ||
        ad.categoryLabel.toLowerCase().includes(query) ||
        ad.categoryLabelAr.includes(query) ||
        (ad.tagline && ad.tagline.toLowerCase().includes(query)) ||
        (ad.taglineAr && ad.taglineAr.includes(query)) ||
        ad.description.toLowerCase().includes(query) ||
        ad.descriptionAr.includes(query) ||
        (ad.features && ad.features.some((f) => f.toLowerCase().includes(query))) ||
        (ad.wilayas && ad.wilayas.some((w) => w.toLowerCase().includes(query)))
      );
    });
  }, [searchQuery]);

  // 5. Filtered Videos & Posts
  const matchedPosts = useMemo(() => {
    return INITIAL_SOCIAL_POSTS.filter((post) => {
      const query = (searchQuery || '').toLowerCase().trim();
      return (
        !query ||
        (post.title && post.title.toLowerCase().includes(query)) ||
        (post.description && post.description.toLowerCase().includes(query)) ||
        (post.authorPseudo && post.authorPseudo.toLowerCase().includes(query)) ||
        (post.category && post.category.toLowerCase().includes(query)) ||
        (post.locationName && post.locationName.toLowerCase().includes(query))
      );
    });
  }, [searchQuery]);

  // 6. Filtered Groups
  const matchedGroups = useMemo(() => {
    return COMMUNITY_GROUPS.filter((g) => {
      const query = (searchQuery || '').toLowerCase().trim();
      return (
        !query ||
        (g.titleFr && g.titleFr.toLowerCase().includes(query)) ||
        (g.titleAr && g.titleAr.includes(query)) ||
        (g.wilaya && g.wilaya.toLowerCase().includes(query))
      );
    });
  }, [searchQuery]);

  // 7. Filtered Wilayas (DZ69)
  const matchedWilayas = useMemo(() => {
    const query = (searchQuery || '').toLowerCase().trim();
    if (!query) return WILAYAS_LIST.slice(0, 8);
    return WILAYAS_LIST.filter(
      (w) =>
        (w.code && w.code.includes(query)) ||
        (w.name && w.name.toLowerCase().includes(query)) ||
        (w.arabicName && w.arabicName.includes(query))
    );
  }, [searchQuery]);

  const totalResultsCount =
    matchedVendors.length +
    matchedProducts.length +
    matchedAds.length +
    matchedUsers.length +
    matchedPosts.length +
    matchedGroups.length +
    (searchQuery.trim() ? matchedWilayas.length : 0);

  const categories: { id: SearchCategory; labelFr: string; labelAr: string; icon: any; count?: number }[] = [
    { id: 'all', labelFr: 'Tout explorer', labelAr: 'الكل', icon: Sparkles, count: totalResultsCount },
    { id: 'marketplace', labelFr: 'Services & Location', labelAr: 'خدمات وكراء', icon: Car, count: matchedVendors.length + matchedAds.length },
    { id: 'shop', labelFr: 'Boutique & Drops', labelAr: 'المتجر والمستعمل', icon: ShoppingBag, count: matchedProducts.length },
    { id: 'people', labelFr: 'Personnes', labelAr: 'الأشخاص', icon: Users, count: matchedUsers.length },
    { id: 'videos', labelFr: 'Shorts & Vidéos', labelAr: 'الفيديوهات', icon: Film, count: matchedPosts.length },
    { id: 'posts', labelFr: 'Publications', labelAr: 'المنشورات', icon: FileText },
    { id: 'groups', labelFr: 'Groupes', labelAr: 'المجموعات', icon: Layers, count: matchedGroups.length },
    { id: 'wilayas', labelFr: '69 Wilayas', labelAr: '69 ولاية', icon: MapPin },
    { id: 'recipes', labelFr: 'Gastronomie', labelAr: 'الطبخ', icon: Utensils },
  ];

  // If search query is present, check if services/location have priority
  const hasVendorOrAdMatches = matchedVendors.length > 0 || matchedAds.length > 0;
  const hasProductMatches = matchedProducts.length > 0;

  // Listen for global navbar search triggers
  useEffect(() => {
    const handleGlobalSearchExecute = (ev: Event) => {
      const customEv = ev as CustomEvent;
      if (customEv.detail?.query !== undefined) {
        setLocalQuery(customEv.detail.query);
      }
      setTimeout(() => {
        handleExecuteSearch();
      }, 50);
    };
    window.addEventListener('nisfy:execute-search', handleGlobalSearchExecute);
    return () => window.removeEventListener('nisfy:execute-search', handleGlobalSearchExecute);
  }, [totalResultsCount, matchedVendors, matchedAds, matchedProducts, matchedUsers, matchedPosts, matchedGroups, matchedWilayas, selectedCategory, localQuery]);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* 🔍 Search Input Bar with Web Speech Voice Search & Enter Key Execution */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-3">
        <form onSubmit={handleExecuteSearch} className="relative flex items-center">
          <Search className="absolute left-4 rtl:left-auto rtl:right-4 w-5 h-5 text-slate-400" />
          <input
            ref={searchInputRef}
            id="search-main-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleExecuteSearch(e);
              }
            }}
            placeholder={
              isArabic
                ? 'ابحث عن كراء سيارات، فساتين، قاعات، أشخاص، تقاليد، ولايات...'
                : 'Rechercher location voiture, robes, prestataires, personnes, wilayas...'
            }
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-3.5 pl-12 pr-44 rtl:pr-12 rtl:pl-44 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#FF3823] transition-all"
          />

          <div className="absolute right-2 rtl:right-auto rtl:left-2 flex items-center gap-1.5">
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setHasSearched(false);
                }}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title={isArabic ? 'مسح' : 'Effacer'}
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* 🎙️ Web Speech Voice Search Mic Button */}
            <button
              id="voice-search-trigger-btn"
              type="button"
              onClick={() => {
                datingSounds.playTapSound();
                setIsVoiceModalOpen(true);
              }}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-[#FF3823] hover:bg-orange-100 dark:hover:bg-orange-900/40 flex items-center gap-1.5 text-xs font-black shadow-xs transition-all cursor-pointer group active:scale-95"
              title={
                isArabic
                  ? 'البحث الصوتي (العربية / الفرنسية)'
                  : 'Recherche vocale (Arabe / Français)'
              }
            >
              <Mic className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">
                {isArabic ? 'صوتي' : 'Vocal'}
              </span>
            </button>

            {/* 🔍 Primary Action Search Button (Clickable & Enter-ready) */}
            <button
              type="submit"
              id="execute-search-btn"
              disabled={isSearching}
              className={`px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#FF3823] hover:opacity-90 text-white flex items-center gap-1.5 text-xs font-black shadow-md shadow-orange-500/25 transition-all cursor-pointer group active:scale-95 ${
                isSearching ? 'animate-pulse opacity-90' : ''
              }`}
            >
              {isSearching ? (
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              )}
              <span>{isSearching ? (isArabic ? 'جارٍ البحث...' : 'Recherche...') : (isArabic ? 'بحث' : 'Rechercher')}</span>
            </button>
          </div>
        </form>

        {/* 💡 Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>{isArabic ? 'اقتراحات سريعة :' : 'Suggestions :'}</span>
          </span>
          {QUICK_SEARCH_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchQuery(sug.query);
                setHasSearched(true);
                datingSounds.playTapSound();
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-slate-600 dark:text-slate-300 hover:text-[#FF3823] text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer border border-transparent hover:border-orange-200 dark:hover:border-orange-800"
            >
              {isArabic ? sug.labelAr : sug.labelFr}
            </button>
          ))}
        </div>

        {/* 🎙️ Active Voice Search Result Banner */}
        {lastVoiceSearch && (
          <div className="p-3 bg-gradient-to-r from-orange-50 via-rose-50 to-amber-50 dark:from-orange-950/40 dark:via-rose-950/30 dark:to-amber-950/30 rounded-2xl border border-orange-200/80 dark:border-orange-900/50 flex flex-wrap items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-[#FF3823] flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" />
                <span>{isArabic ? 'البحث الصوتي :' : 'Commande vocale :'}</span>
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-lg border border-orange-200 dark:border-orange-800">
                "{lastVoiceSearch.rawTranscript}"
              </span>

              {lastVoiceSearch.category && (
                <span className="text-[11px] font-black text-white bg-[#FF3823] px-2 py-0.5 rounded-md shadow-2xs">
                  📁 {lastVoiceSearch.category}
                </span>
              )}

              {lastVoiceSearch.wilayaName && (
                <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md">
                  📍 {lastVoiceSearch.wilayaName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="text-[11px] font-bold text-[#FF3823] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Mic className="w-3 h-3" />
                <span>{isArabic ? 'أمر جديد' : 'Nouvel ordre'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetFilters}
                className="p-1 rounded-md hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                title={isArabic ? 'إلغاء الفلتر' : 'Réinitialiser'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 🏷️ Horizontal Category Pills with dynamic badges */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100 dark:border-slate-800">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  datingSounds.playTapSound();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF3823] text-white shadow-md shadow-orange-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{isArabic ? cat.labelAr : cat.labelFr}</span>
                {cat.count !== undefined && cat.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 📊 Active Search Execution Banner */}
      {searchQuery.trim() && (
        <div
          ref={resultsContainerRef}
          id="search-results-section"
          className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
            isSearching
              ? 'bg-orange-50 dark:bg-orange-950/50 border-orange-300 dark:border-orange-700 animate-pulse'
              : 'bg-gradient-to-r from-orange-500/10 via-emerald-500/10 to-amber-500/10 dark:from-orange-950/30 dark:via-emerald-950/20 dark:to-amber-950/20 border-orange-200/80 dark:border-orange-900/40'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            {isSearching ? (
              <RotateCcw className="w-4 h-4 text-[#FF3823] animate-spin" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            )}
            
            <span>
              {isSearching
                ? (isArabic ? `جارٍ فحص قاعدة البيانات لـ "${searchQuery}"...` : `Recherche en direct pour « ${searchQuery} »...`)
                : (isArabic ? `تم تنفيذ البحث عن : "${searchQuery}"` : `Recherche validée pour « ${searchQuery} »`)}
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[11px] font-black flex items-center gap-1 shadow-2xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>
                {totalResultsCount} {isArabic ? 'نتيجة مطابقة' : 'trouvé(s)'}
              </span>
            </span>

            {autoCategorySwitched && (
              <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 text-[10px] font-bold animate-in fade-in">
                {isArabic ? '✨ تم التبديل التلقائي للقسم المطابق' : '✨ Catégorie ajustée automatiquement'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-[#FF3823] transition-colors cursor-pointer"
              >
                {isArabic ? 'عرض كل الأقسام' : 'Tout afficher'}
              </button>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-[#FF3823] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isArabic ? 'إلغاء البحث' : 'Effacer'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ⚠️ Empty State when no results found */}
      {searchQuery.trim() && totalResultsCount === 0 && (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FF3823] flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isArabic ? `لا توجد نتائج مطابقة لـ "${searchQuery}"` : `Aucun résultat direct pour « ${searchQuery} »`}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {isArabic
                ? 'جرب البحث بكلمات أخرى مثل "كراء"، "سيارات"، "قفطان"، أو اختر ولاية معينة.'
                : 'Essayez avec un mot-clé plus court comme "location", "voiture", "robe", "traiteur" ou le nom d\'une wilaya.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {QUICK_SEARCH_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(sug.query);
                  handleExecuteSearch();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-[#FF3823] border border-transparent transition-colors cursor-pointer"
              >
                {isArabic ? sug.labelAr : sug.labelFr}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 Trending Hashtags (when no active query) */}
      {!searchQuery.trim() && (
        <div className="bg-gradient-to-r from-orange-500/5 via-rose-500/5 to-amber-500/5 dark:from-orange-950/20 dark:via-rose-950/20 dark:to-amber-950/20 rounded-3xl p-4 border border-orange-200/50 dark:border-orange-900/30">
          <div className="flex items-center gap-2 mb-2.5">
            <TrendingUp className="w-4 h-4 text-[#FF3823]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              {isArabic ? 'الهاشتاغات والأكثر طلباً في الجزائر' : 'Tendances & Mots-Clés Populaires DZ'}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRENDING_HASHTAGS.map((t, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(t.tag.replace('#', ''));
                  handleExecuteSearch();
                }}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-[#FF3823] hover:text-[#FF3823] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span className="text-[#FF3823] font-black">{t.tag}</span>
                <span className="text-[10px] text-slate-400">({t.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🚗 1. SECTION PRESTATAIRES, SERVICES MARIAGE & LOCATION (Shown with high priority on matches) */}
      {(selectedCategory === 'all' || selectedCategory === 'marketplace') && hasVendorOrAdMatches && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Car className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? 'خدمات، كراء سيارات الأعراس وتنظيم الحفلات' : 'Services, Location de Voitures & Prestataires Mariage'}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold">
                {matchedVendors.length + matchedAds.length}
              </span>
            </div>
            <button
              onClick={() => onSelectTab('marketplace')}
              className="text-xs font-bold text-[#FF3823] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isArabic ? 'فتح السوق كاملاً' : 'Voir tout le Marketplace'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          {/* SPONSORED ADS MATCHES (Ex: Zekri Auto Location) */}
          {matchedAds.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isArabic ? 'شركاء رسميون موثوقون :' : 'Partenaires Officiels Recommandés :'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedAds.map((ad) => (
                  <div
                    key={ad.id}
                    onClick={() => onSelectTab('marketplace')}
                    className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-rose-950/30 border-2 border-amber-300/80 dark:border-amber-800/80 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-2xs">
                          ⭐ {isArabic ? ad.categoryLabelAr : ad.categoryLabel}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Vérifié</span>
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#FF3823] transition-colors">
                        {isArabic ? ad.brandNameAr : ad.brandName}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {isArabic ? ad.descriptionAr : ad.description}
                      </p>
                      {ad.features && ad.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {ad.features.slice(0, 3).map((f, idx) => (
                            <span key={idx} className="text-[10px] font-bold bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{ad.phone}</span>
                      </span>
                      <span className="text-[#FF3823] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>{isArabic ? 'حجز واستفسار' : 'Contacter'}</span>
                        <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REGULAR MATCHED VENDORS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {matchedVendors.slice(0, 6).map((vendor) => (
              <div
                key={vendor.id}
                onClick={() => onSelectTab('marketplace')}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3.5 shadow-xs hover:shadow-md hover:border-purple-500/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800 relative">
                    <img
                      src={vendor.avatarUrl}
                      alt={vendor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                      📍 {vendor.wilayaName} ({vendor.wilayaCode})
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
                      #{vendor.category}
                    </span>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                      ⭐ {vendor.rating} ({vendor.reviewsCount})
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-[#FF3823] transition-colors line-clamp-1">
                    {vendor.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {isArabic ? vendor.descriptionAr : vendor.descriptionFr}
                  </p>
                  {vendor.services && vendor.services.length > 0 && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1.5 truncate">
                      🚗 {vendor.services[0]}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-[#FF3823]">{vendor.priceStartingAt}</span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 group-hover:text-[#FF3823]">
                    <span>{isArabic ? 'تفاصيل' : 'Détails & Contact'}</span>
                    <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🛍️ 2. SECTION BOUTIQUE, DROPS & VIDE-DRESSING (Shown when matches exist) */}
      {(selectedCategory === 'all' || selectedCategory === 'shop') && hasProductMatches && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? 'منتجات المتجر، ستريت وير وسوق المستعمل' : 'Articles Souk Nisfy, Streetwear & Vide-Dressing'}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                {matchedProducts.length}
              </span>
            </div>
            <button
              onClick={() => onSelectTab('shop')}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isArabic ? 'فتح المتجر' : 'Voir le Souk'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {matchedProducts.slice(0, 8).map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectTab('shop')}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-3 space-y-2 hover:border-emerald-500/50 transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={product.images[0]}
                    alt={product.titleFr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discountPriceDzd && (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#FF3823] text-white text-[10px] font-black shadow-xs">
                      PROMO
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {isArabic ? product.titleAr : product.titleFr}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{product.sellerWilaya}</span>
                  </p>
                  <div className="flex items-baseline gap-1.5 pt-1">
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {(product.discountPriceDzd || product.priceDzd).toLocaleString()} DZD
                    </span>
                    {product.discountPriceDzd && (
                      <span className="text-[10px] text-slate-400 line-through">
                        {product.priceDzd.toLocaleString()} DZD
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 👥 3. Section: Personnes & Profils Compatibles */}
      {(selectedCategory === 'all' || selectedCategory === 'people') && matchedUsers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FF3823]" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? 'الأشخاص والمطابقات المقترحة' : 'Personnes & Adhérents Compatibles'}
              </h3>
              <span className="text-xs text-slate-400 font-bold">({matchedUsers.length})</span>
            </div>
            <button
              onClick={() => onSelectTab('discover')}
              className="text-xs font-bold text-[#FF3823] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isArabic ? 'فتح قسم التوافق' : 'Mode Découverte'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {matchedUsers.slice(0, 6).map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3.5 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0 cursor-pointer" onClick={() => onSelectUserForProfile(user)}>
                    <img
                      src={user.avatar}
                      alt={user.pseudo}
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    {user.verified && (
                      <span className="absolute -bottom-1 -right-1 bg-[#38BDF8] text-white p-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">
                        <ShieldCheck className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                      {user.pseudo}, {user.age}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      📍 {user.city} {user.wilayaCode ? `(${user.wilayaCode})` : ''}
                    </p>
                    {user.marriageTimeline && (
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.2 rounded-md">
                        💍 {user.marriageTimeline}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onSelectUserForChat(user)}
                    className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 text-[#FF3823] transition-colors cursor-pointer"
                    title={isArabic ? 'مراسلة' : 'Envoyer un message'}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🎥 4. Section: Shorts & Vidéos */}
      {(selectedCategory === 'all' || selectedCategory === 'videos' || selectedCategory === 'posts') && matchedPosts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? 'مقاطع الفيديو والشورطس' : 'Shorts & Vidéos Populaires'}
              </h3>
              <span className="text-xs text-slate-400 font-bold">({matchedPosts.length})</span>
            </div>
            <button
              onClick={() => onSelectTab('feed')}
              className="text-xs font-bold text-[#FF3823] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isArabic ? 'مشاهدة المزيد' : 'Voir le fil social'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {matchedPosts.slice(0, 4).map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectTab('feed')}
                className="group relative aspect-[9/14] rounded-3xl overflow-hidden bg-slate-900 cursor-pointer shadow-md"
              >
                <img
                  src={post.posterUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md text-white p-1.5 rounded-full">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>

                <div className="absolute bottom-3 inset-x-3 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block mb-0.5">
                    #{post.category}
                  </span>
                  <p className="text-xs font-black line-clamp-2 leading-snug">{post.title}</p>
                  <p className="text-[10px] text-slate-300 mt-1 flex items-center gap-1">
                    <span>❤️ {post.likesCount}</span>
                    <span>• {post.authorPseudo}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 👥 5. Section: Groupes Salhiya & Communautés */}
      {(selectedCategory === 'all' || selectedCategory === 'groups') && matchedGroups.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? 'المجموعات وصالونات النقاش' : 'Groupes Salhiya & Communautés'}
              </h3>
            </div>
            <button
              onClick={() => onSelectTab('communities')}
              className="text-xs font-bold text-[#FF3823] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isArabic ? 'صالون الصالحية' : 'Accéder au Salon'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchedGroups.map((grp) => (
              <div
                key={grp.id}
                onClick={() => onSelectTab('communities')}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3.5 flex items-center gap-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <img
                  src={grp.image}
                  alt={grp.titleFr}
                  className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-[#FF3823] transition-colors line-clamp-1">
                    {isArabic ? grp.titleAr : grp.titleFr}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>📍 {grp.wilaya}</span>
                    <span>• {grp.membersCount} membres</span>
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                    {isArabic ? 'انضمام فوري' : 'Rejoindre le groupe'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🇩🇿 6. Section: Exploration des 69 Wilayas */}
      {(selectedCategory === 'all' || selectedCategory === 'wilayas') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? 'استكشاف حسب الولايات الـ 69' : 'Explorer l’Algérie par Wilaya (DZ 01 à 69)'}
              </h3>
            </div>
            <button
              onClick={() => onSelectTab('customs')}
              className="text-xs font-bold text-[#FF3823] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isArabic ? 'دليل التقاليد' : 'Guide des traditions'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {matchedWilayas.map((wilaya) => (
              <button
                key={wilaya.code}
                onClick={() => {
                  setSelectedWilayaFilter(wilaya.code);
                  setSelectedCategory('marketplace');
                  datingSounds.playTapSound();
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 text-left rtl:text-right hover:border-[#FF3823] transition-all group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-[#FF3823] bg-orange-50 dark:bg-orange-950/60 px-1.5 py-0.5 rounded-md">
                    {wilaya.code}
                  </span>
                  <MapPin className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#FF3823] transition-colors" />
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {isArabic ? wilaya.arabicName : wilaya.name}
                </h4>
                <p className="text-[10px] text-slate-400">{wilaya.region}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🍰 7. Section: Gastronomie & Pâtisserie Traditionnelle (Chef Nadjet) */}
      {(selectedCategory === 'all' || selectedCategory === 'recipes') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? 'فن الطبخ وحلويات الأعراس (الشيف نجاة)' : 'Gastronomie & Gâteaux de Mariage (Chef Nadjet)'}
              </h3>
            </div>
            <button
              onClick={() => onSelectTab('feed')}
              className="text-xs font-bold text-[#FF3823] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isArabic ? 'استكشاف الوصفات' : 'Toutes les recettes'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-rose-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
            <img
              src={CHEF_NADJET_PROFILE.avatar}
              alt={CHEF_NADJET_PROFILE.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-amber-400 shrink-0"
            />
            <div className="flex-1 text-center sm:text-left rtl:sm:text-right min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start rtl:sm:justify-end gap-2">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {isArabic ? CHEF_NADJET_PROFILE.nameAr : CHEF_NADJET_PROFILE.name}
                </h4>
                <span className="text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full">
                  ⭐ Chef Officielle Nisfy
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                {isArabic ? CHEF_NADJET_PROFILE.bioAr : CHEF_NADJET_PROFILE.bio}
              </p>
            </div>
            <a
              href={CHEF_NADJET_PROFILE.youtubeChannelUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shrink-0 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>{isArabic ? 'قناة اليوتيوب' : 'Masterclass YouTube'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </a>
          </div>
        </div>
      )}

      {/* 🎙️ Voice Search Interactive Modal (Web Speech API) */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onApplyVoiceSearch={handleApplyVoiceSearch}
        currentCategory={selectedCategory}
      />
    </div>
  );
}

