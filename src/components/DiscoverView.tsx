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
  Globe,
  Radio,
  Video,
  Play,
  Bookmark,
  Megaphone,
  Tag,
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
import { datingSounds } from '../utils/soundEffects';
import { useLanguage } from '../context/LanguageContext';

interface DiscoverViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onLikeUser: (targetUser: UserProfile, isSuperLike?: boolean, isJasmin?: boolean) => void;
  onStartDirectChat: (targetUser: UserProfile, initialMessage?: string) => void;
  onOpenMap?: () => void;
  isMapEnabled?: boolean;
  onToggleMap?: (enabled?: boolean) => void;
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
  onOpenMap,
  isMapEnabled = false,
  onToggleMap,
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

  // Filters state
  const [discoveryFilters, setDiscoveryFilters] = useState({
    wilaya: 'all',
    ageMin: 18,
    ageMax: 55,
    gender: 'all' as 'all' | 'homme' | 'femme',
    educationLevel: 'all'
  });
  const [filterGender, setFilterGender] = useState<'tous' | 'femme' | 'homme' | 'non-binaire'>('tous');
  const [filterCity, setFilterCity] = useState('');
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [onlyMarriage, setOnlyMarriage] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyWithVideo, setOnlyWithVideo] = useState(false);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(55);
  const [selectedInterest, setSelectedInterest] = useState('');

  // Advertising & Partner Modals state
  const [activeAds, setActiveAds] = useState<Advertisement[]>(() => getActiveAdvertisements());
  const [selectedAdForModal, setSelectedAdForModal] = useState<Advertisement | null>(null);
  const [isBecomePartnerOpen, setIsBecomePartnerOpen] = useState(false);
  const [activeBannerAdIndex, setActiveBannerAdIndex] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setActiveAds(getActiveAdvertisements());
    window.addEventListener('nisfy_ads_updated', handleUpdate);
    return () => window.removeEventListener('nisfy_ads_updated', handleUpdate);
  }, []);

  // Rotate sponsored banner ad (from active ads only)
  const currentBannerAd = activeAds.length > 0 ? activeAds[activeBannerAdIndex % activeAds.length] : null;

  // Filtered profiles (excluding current user and blocked users)
  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      // Exclude current user and blocked
      if (u.id === currentUser.id) return false;
      if (currentUser.blockedUsers && currentUser.blockedUsers.includes(u.id)) return false;
      
      // Gender
      if (discoveryFilters.gender !== 'all' && u.gender !== discoveryFilters.gender) return false;
      
      // Wilaya
      if (discoveryFilters.wilaya !== 'all') {
        if (u.wilayaCode !== discoveryFilters.wilaya) return false;
      }
      
      // Age
      if (u.age < discoveryFilters.ageMin || u.age > discoveryFilters.ageMax) return false;
      
      // Education
      if (discoveryFilters.educationLevel !== 'all') {
        if (u.educationLevel !== discoveryFilters.educationLevel) return false;
      }
      
      return true;
    });
  }, [allUsers, currentUser.id, currentUser.blockedUsers, discoveryFilters]);

  const activeCardUser = filteredUsers[currentIndex] || null;

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

      {/* 2. Top Controls & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>{t.discoverTitle}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
                {filteredUsers.length} {t.profilesFound}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {t.discoverSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Marriage Filter Toggle Button 💍 */}
            <button
              type="button"
              onClick={() => setOnlyMarriage(!onlyMarriage)}
              className={`px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                onlyMarriage
                  ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white ring-2 ring-amber-300 scale-102'
                  : 'bg-gradient-to-r from-amber-50 to-rose-50 text-rose-700 border-2 border-rose-300 hover:border-rose-400'
              }`}
            >
              <span>💍</span>
              <span>{t.marriageFilterBtn}</span>
              {onlyMarriage && <span className="text-[10px] bg-white/20 px-1 rounded">✓</span>}
            </button>

            {/* Quick Saved / Bookmarked Toggle */}
            {bookmarkedUserIds.length > 0 && (
              <button
                type="button"
                onClick={() => setOnlyBookmarked(!onlyBookmarked)}
                className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  onlyBookmarked
                    ? 'bg-amber-500 text-white shadow-amber-500/20'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>Favoris ({bookmarkedUserIds.length})</span>
              </button>
            )}

            {/* Quick Video Only Toggle */}
            <button
              type="button"
              onClick={() => setOnlyWithVideo(!onlyWithVideo)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                onlyWithVideo
                  ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isArabic ? 'فيديوهات' : 'Avec vidéo'}</span>
              {onlyWithVideo && <span className="text-[10px] bg-white/20 px-1 rounded">✓</span>}
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setViewMode('card')}
                className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'card'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-rose-500" />
                <span>{t.swipeMode}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t.gridMode}</span>
              </button>
            </div>

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 px-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                showFilters
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t.filters}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Filters Drawer */}
        {showFilters && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-in fade-in">
            {/* Gender filter */}
            <div>
              <label className="block font-bold text-slate-600 mb-1">{t.genderFilterAll}</label>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none"
              >
                <option value="tous">{t.allGenders}</option>
                <option value="femme">{t.onlyWomen}</option>
                <option value="homme">{t.onlyMen}</option>
                <option value="non-binaire">{isArabic ? 'آخر' : 'Non-binaires'}</option>
              </select>
            </div>

            {/* Wilaya Filter (69 Wilayas) */}
            <div>
              <label className="block font-bold text-slate-600 mb-1">{t.wilayaFilter}</label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none"
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
              <label className="block font-bold text-slate-600 mb-1">
                {t.ageFilter} ({minAge} - {maxAge} {isArabic ? 'سنة' : 'ans'})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={18}
                  max={65}
                  value={maxAge}
                  onChange={(e) => setMaxAge(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>

            {/* Toggles (Online & Verified & Video) */}
            <div className="flex flex-col gap-1.5 justify-end">
              <label className="flex items-center gap-2 cursor-pointer p-1.5 px-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={onlyOnline}
                  onChange={(e) => setOnlyOnline(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-400 w-3.5 h-3.5"
                />
                <span className="font-bold text-slate-700 text-[11px]">{t.onlyOnline}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-1.5 px-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-sky-400 w-3.5 h-3.5"
                />
                <span className="font-bold text-slate-700 text-[11px]">{t.onlyVerified}</span>
              </label>
            </div>
          </div>
        )}

        {/* World Traffic Map - Optional & Toggleable by user choice */}
        {isMapEnabled ? (
          <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white shadow-md">
            <div
              onClick={onOpenMap}
              className="flex items-center gap-3 cursor-pointer group flex-1"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white group-hover:text-rose-300 transition-colors">
                    {t.worldMapBanner}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold border border-emerald-500/30">
                    ACTIVÉE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {t.worldMapTeaser}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onOpenMap}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>{t.viewMapBtn}</span>
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </button>
              {onToggleMap && (
                <button
                  type="button"
                  onClick={() => onToggleMap(false)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
                  title={t.deactivateMapBtn}
                >
                  {t.deactivateMapBtn}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-rose-950 border border-indigo-500/30 hover:border-rose-400/50 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all shadow-md group">
            {/* Ambient colorful glow */}
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 -mb-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Globe className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <p className="text-xs font-black text-white flex items-center gap-2">
                  <span>{t.mapToggleTitle}</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                    {t.mapStatusDisabled}
                  </span>
                </p>
                <p className="text-[11px] text-slate-300 hidden sm:block mt-0.5">
                  {t.mapOptionHint}
                </p>
              </div>
            </div>

            {onToggleMap && (
              <button
                type="button"
                onClick={() => {
                  onToggleMap(true);
                  if (onOpenMap) onOpenMap();
                }}
                className="relative z-10 w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-black transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95"
              >
                <Globe className="w-4 h-4 text-white" />
                <span>{t.activateMapBtn}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Sponsored Partner Spotlight Banner */}
      <div className="relative">
        <div className="flex items-center justify-between px-1 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isArabic ? 'شركاء وباقات الزفاف المعتمدة' : 'Bons Plans & Prestataires Mariage'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveBannerAdIndex((prev) => prev + 1)}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              {isArabic ? 'العرض التالي ↻' : 'Offre suivante ↻'}
            </button>
            <button
              type="button"
              onClick={() => setIsBecomePartnerOpen(true)}
              className="text-[11px] font-black text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Megaphone className="w-3 h-3" />
              <span>{isArabic ? 'فضاء المهنيين (إعلانات مدفوعة)' : 'Espace Annonceurs Pro'}</span>
            </button>
          </div>
        </div>

        {currentBannerAd && (
          <SponsoredAdCard
            ad={currentBannerAd}
            layout="banner"
            onOpenDetails={(ad) => setSelectedAdForModal(ad)}
          />
        )}
      </div>

      {/* Main View Mode: Card Swipe vs Grid */}
      {viewMode === 'card' ? (
        <div className="flex flex-col items-center justify-center py-4">
          {/* Periodic Sponsored Card every 4 swipes */}
          {currentIndex > 0 && currentIndex % 4 === 0 && activeAds.length > 0 ? (
            <div className="w-full flex flex-col items-center space-y-3">
              <SponsoredAdCard
                ad={activeAds[(Math.floor(currentIndex / 4) - 1) % activeAds.length]}
                layout="card"
                onOpenDetails={(ad) => setSelectedAdForModal(ad)}
                onDismiss={() => setCurrentIndex((prev) => prev + 1)}
              />
            </div>
          ) : activeCardUser ? (
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
            <div className="w-full max-w-md bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-lg space-y-4">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-3xl mx-auto">
                ✨
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {t.noMoreCardsTitle}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {t.noMoreCardsDesc}
              </p>
              <button
                type="button"
                onClick={handleResetCards}
                className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer"
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
          {filteredUsers.map((user, idx) => {
            const hasVideo = user.videos && user.videos.length > 0;
            const shouldShowAd = idx > 0 && idx % 3 === 0 && activeAds.length > 0;
            const adToShow = activeAds.length > 0 ? activeAds[Math.floor(idx / 3) % activeAds.length] : null;

            return (
              <React.Fragment key={user.id}>
                {shouldShowAd && adToShow && (
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 rounded-3xl overflow-hidden border border-amber-400/50 shadow-md p-4 text-white flex flex-col justify-between group">
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
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold">
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
                        className="flex-1 py-1.5 px-3 bg-gradient-to-r from-amber-400 to-rose-500 hover:brightness-110 text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer text-center"
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
                                    ? 'bg-gradient-to-r from-amber-100 to-rose-100 text-rose-800 border border-rose-300 font-extrabold shadow-xs'
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
                        className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors cursor-pointer"
                        title={t.directMessage}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLike(user)}
                        className="flex-1 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
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
