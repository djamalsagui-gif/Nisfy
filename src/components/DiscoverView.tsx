import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  SlidersHorizontal,
  LayoutGrid,
  Sparkles,
  Heart,
  RotateCcw,
  MapPin,
  CheckCircle2,
  Layers,
  Search,
  Filter,
  MessageCircle,
  Video,
  Play,
  Bookmark,
  Megaphone,
  Tag,
  X,
} from 'lucide-react';
import { UserProfile, SearchFilter, ProfileVideo } from '../types';
import { WILAYAS_69 } from '../data/wilayas';
import { Advertisement } from '../data/advertisements';
import { getActiveAdvertisements } from '../utils/adsManager';
import { ProfileCard } from './discovery/ProfileCard';
import { MatchingActions } from './discovery/MatchingActions';
import { Filters } from './discovery/Filters';
import { MediaViewerModal } from './MediaViewerModal';
import { NisfyStoriesBar } from './NisfyStoriesBar';
import { NisfyStoriesViewer } from './NisfyStoriesViewer';
import { PublishVideoModal } from './PublishVideoModal';
import { SponsoredAdCard } from './SponsoredAdCard';
import { SponsoredAdModal } from './SponsoredAdModal';
import { BecomePartnerModal } from './BecomePartnerModal';
import { calculateCompatibilityScore } from '../utils/matchingAlgorithm';
import { datingSounds } from '../utils/soundEffects';
import { useLanguage } from '../context/LanguageContext';

interface DiscoverViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onLikeUser: (targetUser: UserProfile, isSuperLike?: boolean, isJasmin?: boolean) => void;
  onStartDirectChat: (targetUser: UserProfile, initialMessage?: string) => void;
  onReportUser?: (targetUser: UserProfile) => void;
  onBlockUser?: (targetUser: UserProfile) => void;
  bookmarkedUserIds?: string[];
  onToggleBookmark?: (targetUser: UserProfile) => void;
  onPublishVideo?: (newVideo: ProfileVideo) => void;
}

export function DiscoverView({
  currentUser,
  allUsers,
  onLikeUser,
  onStartDirectChat,
  onReportUser,
  onBlockUser,
  bookmarkedUserIds = [],
  onToggleBookmark,
  onPublishVideo,
}: DiscoverViewProps) {
  const { t, isArabic } = useLanguage();
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [activeMediaModal, setActiveMediaModal] = useState<{
    user: UserProfile;
    video: ProfileVideo;
  } | null>(null);

  // Stories Fullscreen Player state
  const [activeStoryUser, setActiveStoryUser] = useState<UserProfile | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  // 7 Sub-tabs for Encounter (Section 8)
  const [encounterSubTab, setEncounterSubTab] = useState<
    'pour_vous' | 'compatibilites' | 'nouveaux' | 'likes_recus' | 'favoris' | 'superlikes_jasmin' | 'matchs'
  >('pour_vous');

  // Filters state
  const [discoveryFilters, setDiscoveryFilters] = useState({
    wilaya: 'all',
    ageMin: 18,
    ageMax: 55,
    gender: 'all' as 'all' | 'men' | 'women',
    educationLevel: 'all',
    marriageTimeline: 'all',
    familyOrigin: 'all',
    relocation: 'all',
  });
  const [filterCity, setFilterCity] = useState('');
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [onlyMarriage, setOnlyMarriage] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyWithVideo, setOnlyWithVideo] = useState(false);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(55);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Advertising & Partner Modals state
  const [activeAds, setActiveAds] = useState<Advertisement[]>(() => getActiveAdvertisements());
  const [selectedAdForModal, setSelectedAdForModal] = useState<Advertisement | null>(null);
  const [isBecomePartnerOpen, setIsBecomePartnerOpen] = useState(false);
  const [activeBannerAdIndex, setActiveBannerAdIndex] = useState(0);
  const [isBannerMinimized, setIsBannerMinimized] = useState(() => {
    return localStorage.getItem('nisfy_ad_minimized') === 'true';
  });
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [dismissedGridAdIds, setDismissedGridAdIds] = useState<string[]>([]);

  useEffect(() => {
    const handleUpdate = () => setActiveAds(getActiveAdvertisements());
    window.addEventListener('nisfy_ads_updated', handleUpdate);
    return () => window.removeEventListener('nisfy_ads_updated', handleUpdate);
  }, []);

  const toggleBannerMinimized = () => {
    setIsBannerMinimized((prev) => {
      const next = !prev;
      localStorage.setItem('nisfy_ad_minimized', String(next));
      return next;
    });
  };

  // Rotate sponsored banner ad (from active ads only)
  const currentBannerAd = activeAds.length > 0 ? activeAds[activeBannerAdIndex % activeAds.length] : null;

  // Filtered profiles (excluding current user, blocked users, and duplicates)
  const filteredUsers = useMemo(() => {
    const seen = new Set<string>();
    return allUsers.filter((u) => {
      if (!u || !u.id || seen.has(u.id)) return false;
      // Exclude current user and blocked
      if (u.id === currentUser.id) return false;
      if (currentUser.blockedUsers && currentUser.blockedUsers.includes(u.id)) return false;
      
      seen.add(u.id);
      
      // Gender
      if (discoveryFilters.gender !== 'all') {
        const targetGender = discoveryFilters.gender === 'women' ? 'femme' : 'homme';
        if (u.gender !== targetGender) return false;
      }
      
      // Wilaya code or city name
      if (discoveryFilters.wilaya !== 'all') {
        if (u.wilayaCode !== discoveryFilters.wilaya) return false;
      }
      if (filterCity && u.city.toLowerCase() !== filterCity.toLowerCase()) {
        return false;
      }
      
      // Age
      if (u.age < discoveryFilters.ageMin || u.age > discoveryFilters.ageMax) return false;
      
      // Education
      if (discoveryFilters.educationLevel !== 'all') {
        if (u.educationLevel && !u.educationLevel.toLowerCase().includes(discoveryFilters.educationLevel.toLowerCase())) {
          return false;
        }
      }

      // Marriage Timeline
      if (discoveryFilters.marriageTimeline !== 'all') {
        if (u.marriageTimeline !== discoveryFilters.marriageTimeline) return false;
      }

      // Family Origin
      if (discoveryFilters.familyOrigin !== 'all') {
        if (u.familyOrigin && !u.familyOrigin.toLowerCase().includes(discoveryFilters.familyOrigin.toLowerCase())) {
          return false;
        }
      }

      // Relocation
      if (discoveryFilters.relocation !== 'all') {
        if (u.relocation !== discoveryFilters.relocation) return false;
      }

      // Online & Verified toggles
      if (onlyOnline && !u.isOnline) return false;
      if (onlyVerified && !u.verified && !u.hasBlueBadge) return false;
      if (onlyMarriage && !u.marriageVerified && !u.marriageTimeline) return false;
      if (onlyWithVideo && (!u.videos || u.videos.length === 0)) return false;
      if (onlyBookmarked && !bookmarkedUserIds.includes(u.id)) return false;
      
      return true;
    });
  }, [allUsers, currentUser.id, currentUser.blockedUsers, discoveryFilters, filterCity, onlyOnline, onlyVerified, onlyMarriage, onlyWithVideo, onlyBookmarked, bookmarkedUserIds]);

  // Process profiles according to encounterSubTab (Section 8)
  const processedUsers = useMemo(() => {
    let list = [...filteredUsers];
    if (encounterSubTab === 'compatibilites') {
      list.sort((a, b) => {
        const scoreA = calculateCompatibilityScore(currentUser, a).score;
        const scoreB = calculateCompatibilityScore(currentUser, b).score;
        return scoreB - scoreA;
      });
    } else if (encounterSubTab === 'nouveaux') {
      list.reverse();
    } else if (encounterSubTab === 'favoris') {
      list = list.filter((u) => bookmarkedUserIds.includes(u.id));
    } else if (encounterSubTab === 'likes_recus') {
      list = list.filter((u) => (u.likesCount && u.likesCount > 80) || u.verified);
    } else if (encounterSubTab === 'superlikes_jasmin') {
      list = list.filter((u) => u.marriageVerified || u.verified || (u.jasminLikesCount && u.jasminLikesCount > 0));
    } else if (encounterSubTab === 'matchs') {
      list = list.filter((u) => u.isOnline || (u.seriousnessScore && u.seriousnessScore >= 80));
    }
    return list;
  }, [filteredUsers, encounterSubTab, currentUser, bookmarkedUserIds]);

  const activeCardUser = processedUsers[currentIndex] || null;

  const handleLike = (targetUser: UserProfile) => {
    datingSounds.playLikeSound();
    onLikeUser(targetUser, false, false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleDislike = (targetUser: UserProfile) => {
    datingSounds.playLikeSound();
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSuperLike = (targetUser: UserProfile, isJasmin = false) => {
    datingSounds.playMatchSound();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: isJasmin ? ['#f43f5e', '#ec4899', '#fb7185', '#fbcfe8'] : undefined,
    });
    onLikeUser(targetUser, true, isJasmin);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleResetCards = () => {
    setCurrentIndex(0);
    datingSounds.playLikeSound();
  };

  const handleSelectStory = (user: UserProfile, initialVideoIndex = 0) => {
    setActiveStoryUser(user);
    setActiveStoryIndex(initialVideoIndex);
  };

  return (
    <div className="space-y-5">
      {/* 1. NISFY Stories Bar (Video Feed) */}
      <NisfyStoriesBar
        currentUser={currentUser}
        users={allUsers}
        onOpenStory={(user, videoIndex) => handleSelectStory(user, videoIndex || 0)}
        onAddStory={() => setIsPublishModalOpen(true)}
      />

      {/* 2. Top Fluid Controls & Encounter Sub-Tabs (Section 8) */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-3.5 sm:p-4 border border-slate-200/70 dark:border-slate-800 shadow-xs space-y-3">
        {/* Encounter Sub-Tabs (Pour vous, Compatibilités, Nouveaux, Likes reçus, Favoris, Jasmin, Matchs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide no-scrollbar border-b border-slate-100 dark:border-slate-800">
          {[
            { id: 'pour_vous', labelFr: '🌟 Pour vous', labelAr: '🌟 لك' },
            { id: 'compatibilites', labelFr: '❤️ 90%+ Compatibles', labelAr: '❤️ أعلى توافق' },
            { id: 'nouveaux', labelFr: '✨ Nouveaux profils', labelAr: '✨ الجدد' },
            { id: 'likes_recus', labelFr: '💌 Likes reçus', labelAr: '💌 إعجابات واردة' },
            { id: 'favoris', labelFr: '⭐ Favoris', labelAr: '⭐ المفضلة' },
            { id: 'superlikes_jasmin', labelFr: '🌸 Jasmin & Super-Likes', labelAr: '🌸 ياسمين ومميز' },
            { id: 'matchs', labelFr: '🤝 Matchs', labelAr: '🤝 توافق متبادل' },
          ].map((sub) => {
            const isSel = encounterSubTab === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  datingSounds.playTapSound();
                  setEncounterSubTab(sub.id as any);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSel
                    ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white shadow-md shadow-orange-500/25 ring-2 ring-white/30'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isArabic ? sub.labelAr : sub.labelFr}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t.discoverTitle}</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-50 text-[#FF3823] dark:bg-orange-950/50 dark:text-[#FF6B35] border border-orange-200/60 dark:border-orange-900/40">
              {processedUsers.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-full border border-slate-200/60 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('card')}
                title={t.swipeMode}
                className={`p-1.5 px-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'card'
                    ? 'bg-white dark:bg-slate-900 text-[#FF3823] dark:text-[#FF6B35] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">{t.swipeMode}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title={t.gridMode}
                className={`p-1.5 px-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">{t.gridMode}</span>
              </button>
            </div>

            {/* Comprehensive Filter Trigger Button */}
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className={`p-1.5 px-3 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isFilterModalOpen || discoveryFilters.wilaya !== 'all' || discoveryFilters.gender !== 'all' || discoveryFilters.marriageTimeline !== 'all' || discoveryFilters.familyOrigin !== 'all' || onlyMarriage || onlyWithVideo || onlyBookmarked
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white border-transparent shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-[11px]">{t.filters}</span>
              {(discoveryFilters.wilaya !== 'all' || discoveryFilters.gender !== 'all' || discoveryFilters.marriageTimeline !== 'all' || discoveryFilters.familyOrigin !== 'all' || onlyMarriage || onlyWithVideo || onlyBookmarked) && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Fluid Filters Drawer */}
        {showFilters && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
            {/* Quick Filter Tags (Zawaj, Vidéo, Favoris) */}
            <div className="flex flex-wrap items-center gap-1.5 pb-1">
              <button
                type="button"
                onClick={() => setOnlyMarriage(!onlyMarriage)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  onlyMarriage
                    ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>💍</span>
                <span>{t.marriageFilterBtn}</span>
                {onlyMarriage && <span>✓</span>}
              </button>

              <button
                type="button"
                onClick={() => setOnlyWithVideo(!onlyWithVideo)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  onlyWithVideo
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Video className="w-3 h-3" />
                <span>{isArabic ? 'مع فيديو' : 'Avec vidéo'}</span>
                {onlyWithVideo && <span>✓</span>}
              </button>

              {bookmarkedUserIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setOnlyBookmarked(!onlyBookmarked)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    onlyBookmarked
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Bookmark className="w-3 h-3 fill-current" />
                  <span>Favoris ({bookmarkedUserIds.length})</span>
                </button>
              )}
            </div>

            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {/* Gender filter */}
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">{t.genderFilterAll}</label>
                <select
                  value={discoveryFilters.gender}
                  onChange={(e) => setDiscoveryFilters((prev) => ({ ...prev, gender: e.target.value as any }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none"
                >
                  <option value="all">{t.allGenders}</option>
                  <option value="women">{t.onlyWomen}</option>
                  <option value="men">{t.onlyMen}</option>
                </select>
              </div>

              {/* Wilaya Filter (69 Wilayas) */}
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">{t.wilayaFilter}</label>
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none"
                >
                  <option value="">{t.allWilayas}</option>
                  <optgroup label={isArabic ? '🇩🇿 الجزائر (الولايات 01 إلى 58)' : '🇩🇿 Algérie (Wilayas 01 à 58)'}>
                    {WILAYAS_69.filter((w) => !w.isDiaspora).map((w) => (
                      <option key={w.code} value={w.name}>
                        {w.code} - {w.name} ({w.arabicName})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={isArabic ? '🌍 دياسبورا DZ69 (الولايات 59 إلى 69)' : '🌍 Diaspora DZ69 (Wilayas 59 à 69)'}>
                    {WILAYAS_69.filter((w) => w.isDiaspora).map((w) => (
                      <option key={w.code} value={w.name}>
                        {w.code} - {w.name} ({w.arabicName})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Age Range */}
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {t.ageFilter} ({minAge} - {maxAge} {isArabic ? 'سنة' : 'ans'})
                </label>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="range"
                    min={18}
                    max={65}
                    value={maxAge}
                    onChange={(e) => setMaxAge(Number(e.target.value))}
                    className="w-full accent-[#FF3823]"
                  />
                </div>
              </div>

              {/* Toggles (Online & Verified) */}
              <div className="flex flex-col gap-1.5 justify-end">
                <label className="flex items-center gap-2 cursor-pointer p-1.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                  <input
                    type="checkbox"
                    checked={onlyOnline}
                    onChange={(e) => setOnlyOnline(e.target.checked)}
                    className="rounded text-[#FF3823] focus:ring-[#FF3823] w-3.5 h-3.5"
                  />
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">{t.onlyOnline}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-1.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="rounded text-emerald-500 focus:ring-emerald-400 w-3.5 h-3.5"
                  />
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">{t.onlyVerified}</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Sponsored Partner Spotlight Banner (Non-intrusive, Collapsible & Dismissible) */}
      {!isBannerDismissed ? (
        <div className="relative">
          <div className="flex items-center justify-between px-1 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isArabic ? 'شركاء وباقات الزفاف المعتمدة' : 'Bons Plans & Prestataires Mariage'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleBannerMinimized}
                className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                {isBannerMinimized
                  ? (isArabic ? 'عرض كامل ⤢' : 'Agrandir ⤢')
                  : (isArabic ? 'تصغير ⤡' : 'Réduire ⤡')}
              </button>
              <button
                type="button"
                onClick={() => setActiveBannerAdIndex((prev) => prev + 1)}
                className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                {isArabic ? 'العرض التالي ↻' : 'Offre suivante ↻'}
              </button>
              <button
                type="button"
                onClick={() => setIsBecomePartnerOpen(true)}
                className="text-[11px] font-black text-amber-600 dark:text-amber-400 hover:text-amber-700 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800/60 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Megaphone className="w-3 h-3" />
                <span>{isArabic ? 'فضاء المهنيين' : 'Espace Pros'}</span>
              </button>
            </div>
          </div>

          {currentBannerAd && (
            <SponsoredAdCard
              ad={currentBannerAd}
              layout={isBannerMinimized ? 'compact' : 'banner'}
              onOpenDetails={(ad) => setSelectedAdForModal(ad)}
              onDismiss={() => setIsBannerDismissed(true)}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-2 px-3 bg-amber-50/50 dark:bg-slate-900/50 rounded-2xl border border-amber-200/50 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isArabic ? 'عروض وباقات زفاف حصرية بانتظاركم' : 'Offres & réductions prestataires mariage disponibles'}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsBannerDismissed(false)}
            className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
          >
            {isArabic ? 'إظهار الباقة' : 'Afficher les bons plans'}
          </button>
        </div>
      )}

      {/* Main View Mode: Card Swipe vs Grid */}
      {viewMode === 'card' ? (
        <div className="flex flex-col items-center justify-center py-2 space-y-4">
          {activeCardUser ? (
            <div className="w-full flex flex-col items-center">
              <ProfileCard
                profile={activeCardUser}
                currentUser={currentUser}
              />
              <MatchingActions 
                onPass={() => handleDislike(activeCardUser)}
                onLike={() => handleLike(activeCardUser)}
                onSuperLike={() => handleSuperLike(activeCardUser, false)}
                onJasmin={() => handleSuperLike(activeCardUser, true)}
              />
            </div>
          ) : (
            /* Empty state when deck is finished */
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/50 text-[#FF3823] rounded-full flex items-center justify-center text-3xl mx-auto">
                ✨
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {t.noMoreCardsTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                {t.noMoreCardsDesc}
              </p>
              <button
                type="button"
                onClick={handleResetCards}
                className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-2xl text-xs font-bold transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.restartDeckBtn}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ===== GRID GALLERY VIEW ===== */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {processedUsers.map((user, idx) => {
            const hasVideo = user.videos && user.videos.length > 0;
            const shouldShowAd = idx > 0 && idx % 8 === 0 && activeAds.length > 0;
            const adToShow = activeAds.length > 0 ? activeAds[Math.floor(idx / 8) % activeAds.length] : null;
            const isAdDismissed = adToShow && dismissedGridAdIds.includes(adToShow.id);

            return (
              <React.Fragment key={user.id}>
                {shouldShowAd && adToShow && !isAdDismissed && (
                  <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 rounded-3xl overflow-hidden border border-amber-400/50 shadow-md p-4 text-white flex flex-col justify-between group">
                    <button
                      type="button"
                      onClick={() => setDismissedGridAdIds((prev) => [...prev, adToShow.id])}
                      className="absolute top-2.5 right-2.5 z-20 p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title={isArabic ? 'إخفاء' : 'Masquer'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 mb-3">
                      <img
                        src={adToShow.bannerImage}
                        alt={adToShow.brandName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-extrabold flex items-center gap-1 shadow-md">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{isArabic ? 'إعلان معتمد' : 'Sponsor Nisfy'}</span>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-[#FF3823] text-white text-[9px] font-bold">
                        {isArabic ? adToShow.discountBadgeAr : adToShow.discountBadge}
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="text-[10px] text-amber-300 font-bold uppercase">
                        {isArabic ? adToShow.categoryLabelAr : adToShow.categoryLabel}
                      </div>
                      <h4 className="text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors">
                        {isArabic ? adToShow.brandNameAr : adToShow.brandName}
                      </h4>
                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {isArabic ? adToShow.taglineAr : adToShow.tagline}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-700/60 flex items-center gap-2">
                      <div className="text-[10px] font-mono font-bold bg-white/10 px-2 py-1 rounded text-amber-300">
                        {adToShow.promoCode}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedAdForModal(adToShow)}
                        className="flex-1 py-1.5 px-3 bg-gradient-to-r from-[#FF6B35] to-[#FF3823] hover:opacity-95 text-white rounded-xl text-xs font-black transition-all cursor-pointer text-center"
                      >
                        {isArabic ? 'عرض التفاصيل' : 'Voir l’Offre'}
                      </button>
                    </div>
                  </div>
                )}

                <div
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  {/* Photo & Badge */}
                  <div className="relative aspect-square w-full bg-slate-900 overflow-hidden">
                    <img
                      src={user.avatar}
                      alt={user.pseudo}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute top-2.5 left-2.5 flex gap-1 items-center">
                      {user.isOnline && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                      {hasVideo && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMediaModal({ user, video: user.videos![0] });
                          }}
                          className="px-2 py-0.5 rounded-full bg-indigo-600/90 backdrop-blur-xs text-white text-[9px] font-black flex items-center gap-0.5 shadow-md hover:bg-indigo-500 cursor-pointer"
                        >
                          <Play className="w-2.5 h-2.5 fill-white" />
                          <span>{isArabic ? 'فيديو' : 'Vidéo'}</span>
                        </button>
                      )}
                    </div>

                    <div className="absolute bottom-2 inset-x-2.5 text-white z-10">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm drop-shadow">
                          {user.pseudo}, {user.age}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded-full">
                          {user.city}
                        </span>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Info & Fast Action Buttons */}
                  <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-600 line-clamp-2 italic">
                        {user.bio}
                      </p>

                      {user.interests && user.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {user.interests.slice(0, 3).map((tag, tIdx) => {
                            const isMarriage = tag.toLowerCase().includes('mariage') || tag.includes('زواج');
                            return (
                              <span
                                key={tIdx}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  isMarriage
                                    ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-[#FF3823] border border-orange-300 font-extrabold shadow-xs'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {isMarriage ? `💍 ${tag}` : tag}
                              </span>
                            );
                          })}
                          {user.interests.length > 3 && (
                            <span className="text-[9px] font-bold text-slate-400 self-center">
                              +{user.interests.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onStartDirectChat(user)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                        title={t.directMessage}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLike(user)}
                        className="flex-1 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF3823] hover:opacity-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>{t.likeBtn}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Sponsored Ad Detail Modal */}
      {selectedAdForModal && (
        <SponsoredAdModal
          ad={selectedAdForModal}
          onClose={() => setSelectedAdForModal(null)}
        />
      )}

      {/* Advanced Algerian Filters Modal */}
      {isFilterModalOpen && (
        <Filters
          filters={discoveryFilters}
          onChange={(key, val) => {
            setDiscoveryFilters((prev) => ({ ...prev, [key]: val }));
          }}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}

      {/* Become Advertiser / Partner Modal */}
      <BecomePartnerModal
        isOpen={isBecomePartnerOpen}
        onClose={() => setIsBecomePartnerOpen(false)}
      />

      {/* Grid Video Modal Player */}
      {activeMediaModal && (
        <MediaViewerModal
          isOpen={true}
          onClose={() => setActiveMediaModal(null)}
          mediaType="video"
          mediaUrl={activeMediaModal.video.url}
          title={activeMediaModal.video.title}
          authorName={activeMediaModal.user.pseudo}
          authorAvatar={activeMediaModal.user.avatar}
          authorCity={activeMediaModal.user.city}
          videoDetails={activeMediaModal.video}
        />
      )}

      {/* NISFY Stories Fullscreen Player */}
      {activeStoryUser && activeStoryUser.videos && activeStoryUser.videos.length > 0 && (() => {
        // Collect all users with stories including current user
        const allPotentialUsers = allUsers.some((u) => u.id === currentUser.id)
          ? allUsers
          : [currentUser, ...allUsers];
        const usersWithStories = allPotentialUsers.filter((u) => u.videos && u.videos.length > 0);
        const userIndex = Math.max(0, usersWithStories.findIndex((u) => u.id === activeStoryUser.id));

        return (
          <NisfyStoriesViewer
            users={usersWithStories}
            initialUserIndex={userIndex}
            initialVideoIndex={activeStoryIndex}
            onClose={() => setActiveStoryUser(null)}
            onLike={(user) => handleLike(user)}
            onSuperLike={(user, isJasmin) => handleSuperLike(user, isJasmin)}
            onStartDirectChat={(user, initialMsg) => {
              setActiveStoryUser(null);
              onStartDirectChat(user, initialMsg);
            }}
            onOpenProfile={(user) => {
              setActiveStoryUser(null);
              onStartDirectChat(user);
            }}
          />
        );
      })()}

      {/* Publish Video Modal */}
      {isPublishModalOpen && (
        <PublishVideoModal
          currentUser={currentUser}
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          onPublishVideo={(newVideo) => {
            if (onPublishVideo) {
              onPublishVideo(newVideo);
            }
            setIsPublishModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
