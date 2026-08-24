import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Compass,
  MessageCircle,
  Users,
  LogOut,
  Sparkles,
  Volume2,
  VolumeX,
  Globe,
  Radio,
  Search,
  Mic,
  MicOff,
  User,
  Sliders,
  Flower2,
  Film,
  ChevronDown,
  X,
  Cake,
  Crown,
  ShieldCheck,
  Moon,
  Sun,
  BookOpen,
  Store,
  ShoppingBag,
  Mail,
} from 'lucide-react';
import { UserProfile, ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  currentUser: UserProfile;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onLogout: () => void;
  unreadCount: number;
  matchesCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  isMapEnabled: boolean;
  onToggleMapEnabled: (enabled?: boolean) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenStories?: () => void;
  allUsers?: UserProfile[];
  onSelectUser?: (user: UserProfile) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenPremium?: () => void;
  onOpenVerification?: () => void;
  onOpenContact?: () => void;
}

export function Navbar({
  currentUser,
  activeTab,
  onSelectTab,
  onLogout,
  unreadCount,
  matchesCount,
  isMuted,
  onToggleMute,
  isMapEnabled,
  onToggleMapEnabled,
  searchQuery = '',
  onSearchChange,
  onOpenStories,
  allUsers = [],
  onSelectUser,
  isDarkMode = false,
  onToggleDarkMode,
  onOpenPremium,
  onOpenVerification,
  onOpenContact,
}: NavbarProps) {
  const { t, isArabic } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Voice Search using Web Speech API if supported
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isArabic ? 'البحث الصوتي غير مدعوم في متصفحك' : 'La recherche vocale n’est pas supportée sur ce navigateur.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isArabic ? 'ar-DZ' : 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (onSearchChange && transcript) {
          onSearchChange(transcript);
          onSelectTab('discover');
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <>
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('discover')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">
                {t.appName}
              </span>
              <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {t.wilayasBadge}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden md:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Persistent Global Search Bar (Desktop & Tablet) */}
        <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange?.(e.target.value);
              if (activeTab !== 'discover') onSelectTab('discover');
            }}
            placeholder={isArabic ? 'بحث بالاسم، الولاية، المهنة...' : 'Recherche par nom, wilaya, métier...'}
            className="w-full pl-9 pr-8 py-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:bg-white transition-all"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange?.('')}
              className="absolute right-7 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
          <button
            onClick={handleVoiceSearch}
            className={`absolute right-2 p-1 rounded-lg transition-colors ${
              isListening ? 'text-rose-600 animate-pulse bg-rose-50' : 'text-slate-400 hover:text-rose-500'
            }`}
            title="Recherche vocale"
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Tabs (Desktop & Tablet) - hidden on small mobile, visible sm+ */}
        <nav className="hidden sm:flex flex-1 min-w-0 items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1">
          {/* Discover */}
          <button
            onClick={() => onSelectTab('discover')}
            className={`px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'discover'
                ? 'bg-rose-50 text-rose-600 border border-rose-200/80 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-4 h-4 text-rose-500" />
            <span>{t.tabDiscover}</span>
          </button>

          {/* Boutique E-Commerce (Nisfy Shop) */}
          <button
            onClick={() => onSelectTab('shop')}
            className={`relative px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 border border-slate-200'
            }`}
            title="Boutique & Trousseau Mariage (E-Commerce)"
          >
            <ShoppingBag className={`w-4 h-4 ${activeTab === 'shop' ? 'text-white' : 'text-emerald-600'}`} />
            <span>{isArabic ? 'متجر الأعراس' : 'Boutique'}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${activeTab === 'shop' ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-800'}`}>
              SHOP
            </span>
          </button>

          {/* Wedding Marketplace (Prestataires & Salles) */}
          <button
            onClick={() => onSelectTab('marketplace')}
            className={`relative px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'marketplace'
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md shadow-amber-500/25'
                : 'text-slate-700 hover:text-amber-700 hover:bg-amber-50/60 border border-slate-200'
            }`}
            title="Prestataires & Salles des Fêtes"
          >
            <Store className={`w-4 h-4 ${activeTab === 'marketplace' ? 'text-white' : 'text-amber-600'}`} />
            <span>{isArabic ? 'سوق الأعراس' : 'Marketplace'}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${activeTab === 'marketplace' ? 'bg-white text-rose-600' : 'bg-amber-100 text-amber-800'}`}>
              DZ
            </span>
          </button>

          {/* Social Feed (Reels 69 Wilayas) */}
          <button
            onClick={() => onSelectTab('feed')}
            className={`relative px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-md shadow-purple-500/25'
                : 'text-slate-700 hover:text-purple-600 hover:bg-purple-50/50'
            }`}
          >
            <Film className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">{isArabic ? 'خلاصة الفيديوهات' : 'Social Feed'}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${activeTab === 'feed' ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-700'}`}>
              REELS
            </span>
          </button>

          {/* Live Streaming Tab */}
          <button
            onClick={() => onSelectTab('live')}
            className={`relative px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'live'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-500/30'
                : 'text-slate-700 hover:text-rose-600 hover:bg-rose-50/50'
            }`}
          >
            <div className="relative">
              <Radio className={`w-4 h-4 ${activeTab === 'live' ? 'text-white animate-pulse' : 'text-rose-600 animate-pulse'}`} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </div>
            <span className="hidden md:inline">{t.tabLive}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${activeTab === 'live' ? 'bg-white text-rose-600' : 'bg-rose-100 text-rose-700'}`}>
              LIVE
            </span>
          </button>

          {/* Matches */}
          <button
            onClick={() => onSelectTab('matches')}
            className={`relative px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'matches'
                ? 'bg-rose-50 text-rose-600 border border-rose-200/80 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="hidden md:inline">{t.tabMatches}</span>
            {matchesCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-extrabold">
                {matchesCount}
              </span>
            )}
          </button>

          {/* Private Chat */}
          <button
            onClick={() => onSelectTab('chat')}
            className={`relative px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-200/80 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-indigo-500" />
            <span className="hidden md:inline">{t.tabChat}</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[10px] font-extrabold animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Public Lounge */}
          <button
            onClick={() => onSelectTab('lounge')}
            className={`px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'lounge'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-500" />
            <span className="hidden lg:inline">{t.tabLounge}</span>
          </button>

          {/* Customs Guide (Coutumes 69 Wilayas) */}
          <button
            onClick={() => onSelectTab('customs')}
            className={`relative px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'customs'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/25'
                : 'text-emerald-800 hover:text-emerald-950 bg-emerald-50/90 hover:bg-emerald-100/80 border border-emerald-200/80'
            }`}
            title="Guide des Coutumes & Mariage des 69 Wilayas"
          >
            <BookOpen className={`w-4 h-4 ${activeTab === 'customs' ? 'text-white' : 'text-emerald-600'}`} />
            <span className="hidden lg:inline">{isArabic ? 'تقاليد 69 ولاية' : 'Coutumes 69 Wilayas'}</span>
          </button>

          {/* Chef Nadjet Pâtisserie & Mariage Tab */}
          <button
            onClick={() => onSelectTab('chef_nadjet')}
            className={`relative px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'chef_nadjet'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/25'
                : 'text-amber-800 hover:text-amber-950 bg-amber-50/90 hover:bg-amber-100/80 border border-amber-200/80'
            }`}
            title="Espace Chef Nadjet - Gâteaux & Recettes Mariage"
          >
            <Cake className={`w-4 h-4 ${activeTab === 'chef_nadjet' ? 'text-white' : 'text-amber-600'}`} />
            <span className="hidden lg:inline">{isArabic ? 'الشيف نجاة' : 'Chef Nadjet'}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${activeTab === 'chef_nadjet' ? 'bg-white text-amber-800' : 'bg-amber-200 text-amber-900'}`}>
              👑
            </span>
          </button>

          {/* World & Regional Traffic Map */}
          {isMapEnabled ? (
            <button
              onClick={() => onSelectTab('map')}
              className={`relative px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-slate-900 text-rose-400 border border-rose-500/50 shadow-xs ring-1 ring-rose-500/30'
                  : 'text-slate-700 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200'
              }`}
              title={t.mapTitle}
            >
              <div className="relative">
                <Globe className="w-4 h-4 text-rose-500" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              </div>
              <span className="hidden lg:inline">{t.tabMap}</span>
            </button>
          ) : (
            <button
              onClick={() => onToggleMapEnabled(true)}
              className="px-2 sm:px-2.5 py-1.5 rounded-2xl text-[11px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/70 border border-dashed border-slate-300 hover:border-indigo-300 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              title={t.mapOptionHint}
            >
              <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
              <span className="hidden lg:inline">{t.activateMapBtn}</span>
              <span className="lg:hidden">+ 🗺️</span>
            </button>
          )}
        </nav>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Sleek Compact Language Switcher Toggle */}
          <LanguageSwitcher size="sm" variant="toggle" />

          {/* Dark Mode Toggle */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title={isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>
          )}

          {/* Mute Audio Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title={isMuted ? t.muteOn : t.muteOff}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-rose-500" />}
          </button>

          {/* VIP Upgrade Button */}
          {onOpenPremium && (
            <button
              onClick={onOpenPremium}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-black shadow-sm transition-all hover:scale-105 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-200" />
              <span>VIP</span>
            </button>
          )}

          {/* User Button with Rich Dropdown Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`p-1 pl-2 pr-2.5 rounded-2xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'profile' || showUserMenu
                  ? 'border-rose-300 bg-rose-50/80 ring-2 ring-rose-200'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.pseudo}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
              </div>
              <span className="text-xs font-extrabold text-slate-800 hidden md:block max-w-[85px] truncate">
                {currentUser.pseudo}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-900 truncate">{currentUser.pseudo}</p>
                    <p className="text-[11px] text-slate-400 font-medium truncate">{currentUser.city}</p>
                  </div>
                  {currentUser.verified ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      ✓ DZ69
                    </span>
                  ) : null}
                </div>

                {onOpenPremium && (
                  <button
                    onClick={() => {
                      onOpenPremium();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-black bg-gradient-to-r from-amber-50 to-rose-50 hover:from-amber-100 hover:to-rose-100 text-rose-700 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span>{isArabic ? 'باقات VIP واشتراكات الذهب 👑' : 'Abonnements Nisfy VIP & Gold 👑'}</span>
                  </button>
                )}

                {onOpenVerification && (
                  <button
                    onClick={() => {
                      onOpenVerification();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isArabic ? 'توثيق الحساب (Selfie DZ69)' : 'Vérification Selfie & CNI 🇩🇿'}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onSelectTab('profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{isArabic ? 'الملف الشخصي' : 'Mon Profil'}</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-slate-400" />
                  <span>{isArabic ? 'معايير الزواج (Zawaj)' : 'Mes Critères Zawaj'}</span>
                </button>

                {onOpenStories && (
                  <button
                    onClick={() => {
                      onOpenStories();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Film className="w-4 h-4 text-rose-500" />
                    <span>{isArabic ? 'قصص وستوري NISFY' : 'NISFY Stories Vidéos'}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onSelectTab('matches');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Flower2 className="w-4 h-4 text-amber-500" />
                  <span>{isArabic ? 'الياسمين والاشتراكات' : 'Mes Jasmins & Matchs'}</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('customs');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-emerald-800 hover:bg-emerald-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>{isArabic ? 'دليل تقاليد وتراث 69 ولاية' : 'Guide Coutumes 69 Wilayas'}</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('shop');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-emerald-800 hover:bg-emerald-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>{isArabic ? 'متجر الأعراس (E-Commerce)' : 'Boutique & Trousseau Nisfy'}</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('marketplace');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-amber-900 hover:bg-amber-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>{isArabic ? 'سوق وقاعات الأعراس (Marketplace)' : 'Prestataires & Salles Mariage'}</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('chef_nadjet');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-amber-800 hover:bg-amber-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Cake className="w-4 h-4 text-amber-600" />
                  <span>{isArabic ? 'صفحة الشيف نجاة (حلويات الأعراس)' : 'Chef Nadjet (Recettes & Mariage)'}</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onOpenContact) {
                      onOpenContact();
                    } else {
                      window.location.href = 'mailto:contact@nisfy.app?subject=[NISFY]%20Demande%20ou%20Assistance';
                    }
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-rose-500" />
                  <span>{isArabic ? 'الدعم الفني والإدارة الرسمية' : 'Contact & Support Nisfy'}</span>
                </button>

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>{t.logout}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Fixed Bottom Navigation Bar (Visible only on mobile devices < sm) */}
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* 1. Découvrir */}
      <button
        type="button"
        onClick={() => onSelectTab('discover')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
          activeTab === 'discover'
            ? 'text-rose-600 font-black'
            : 'text-slate-500 hover:text-slate-800 font-bold'
        }`}
      >
        <div className={`p-1 rounded-xl transition-colors ${activeTab === 'discover' ? 'bg-rose-50 text-rose-600' : ''}`}>
          <Compass className="w-5 h-5" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">{t.tabDiscover}</span>
      </button>

      {/* 2. Boutique SHOP */}
      <button
        type="button"
        onClick={() => onSelectTab('shop')}
        className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
          activeTab === 'shop'
            ? 'text-emerald-700 font-black'
            : 'text-slate-500 hover:text-slate-800 font-bold'
        }`}
      >
        <div className={`relative p-1 rounded-xl transition-colors ${activeTab === 'shop' ? 'bg-emerald-50 text-emerald-700' : ''}`}>
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-emerald-600 text-white rounded-full text-[8px] font-black">
            SHOP
          </span>
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">{isArabic ? 'المتجر' : 'Boutique'}</span>
      </button>

      {/* 3. Marketplace DZ */}
      <button
        type="button"
        onClick={() => onSelectTab('marketplace')}
        className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
          activeTab === 'marketplace'
            ? 'text-amber-700 font-black'
            : 'text-slate-500 hover:text-slate-800 font-bold'
        }`}
      >
        <div className={`relative p-1 rounded-xl transition-colors ${activeTab === 'marketplace' ? 'bg-amber-50 text-amber-700' : ''}`}>
          <Store className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-amber-600 text-white rounded-full text-[8px] font-black">
            DZ
          </span>
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">{isArabic ? 'السوق' : 'Marché'}</span>
      </button>

      {/* 4. Social Feed / Live */}
      <button
        type="button"
        onClick={() => onSelectTab('feed')}
        className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
          activeTab === 'feed'
            ? 'text-purple-700 font-black'
            : 'text-slate-500 hover:text-slate-800 font-bold'
        }`}
      >
        <div className={`relative p-1 rounded-xl transition-colors ${activeTab === 'feed' ? 'bg-purple-50 text-purple-700' : ''}`}>
          <Film className="w-5 h-5" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">{isArabic ? 'ريلز' : 'Reels'}</span>
      </button>

      {/* 5. Messages / Chat */}
      <button
        type="button"
        onClick={() => onSelectTab('chat')}
        className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
          activeTab === 'chat'
            ? 'text-indigo-600 font-black'
            : 'text-slate-500 hover:text-slate-800 font-bold'
        }`}
      >
        <div className={`relative p-1 rounded-xl transition-colors ${activeTab === 'chat' ? 'bg-indigo-50 text-indigo-600' : ''}`}>
          <MessageCircle className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1.5 px-1 py-0.2 bg-rose-600 text-white rounded-full text-[8px] font-black animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">{t.tabChat}</span>
      </button>
    </nav>
    </>
  );
}
