import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Plus,
  Heart,
  Compass,
  MessageCircle,
  Users,
  LogOut,
  Sparkles,
  Volume2,
  VolumeX,
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
  ChefHat,
  Crown,
  ShieldCheck,
  Moon,
  Sun,
  BookOpen,
  Store,
  ShoppingBag,
  Mail,
  MoreHorizontal,
  Smartphone,
  Download,
  PiggyBank,
  ArrowRightLeft,
  Calendar,
  UserX,
  FileCheck2,
  Music,
} from 'lucide-react';
import { UserProfile, ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NisfyLogo } from './NisfyLogo';
import { checkIsAdmin } from '../utils/adsManager';

interface NavbarProps {
  currentUser: UserProfile;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onLogout: () => void;
  unreadCount: number;
  matchesCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenStories?: () => void;
  onOpenCreateModal?: () => void;
  allUsers?: UserProfile[];
  onSelectUser?: (user: UserProfile) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenPremium?: () => void;
  onOpenVerification?: () => void;
  onOpenContact?: () => void;
  onOpenPwaInstall?: () => void;
  onOpenDeleteAccount?: () => void;
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
  searchQuery = '',
  onSearchChange,
  onOpenStories,
  onOpenCreateModal,
  allUsers = [],
  onSelectUser,
  isDarkMode = false,
  onToggleDarkMode,
  onOpenPremium,
  onOpenVerification,
  onOpenContact,
  onOpenPwaInstall,
  onOpenDeleteAccount,
}: NavbarProps) {
  const { t, isArabic } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExplorerMenu, setShowExplorerMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const explorerMenuRef = useRef<HTMLDivElement | null>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (explorerMenuRef.current && !explorerMenuRef.current.contains(event.target as Node)) {
        setShowExplorerMenu(false);
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

  const isMasterUser = checkIsAdmin(currentUser?.email);
  const isSecondaryActive = ['shop', 'marketplace', 'customs', 'chef_nadjet', 'admin', 'retroplanning', 'finance', 'wedding_contracts', 'live', 'music'].includes(activeTab);

  return (
    <>
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-3">
          {/* Brand Wordmark (Instagram style: clean typographic brand, logo hidden once window is open) */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent group-hover:opacity-90 transition-opacity font-sans">
                Nisfy
              </span>
              <span className="text-lg sm:text-xl font-bold text-[#FF3823] font-serif">
                نصفي
              </span>
              <span className="hidden xl:inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                {t.wilayasBadge}
              </span>
            </div>
          </div>

        {/* Primary Streamlined Navigation (Desktop & Tablet) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/70 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md">
          {/* 0. 🏠 Menu Principal / Accueil */}
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              (activeTab as string) === 'home'
                ? 'bg-white dark:bg-slate-900 text-[#FF3823] dark:text-[#FF6B35] shadow-xs ring-1 ring-[#FF3823]/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Home className={`w-3.5 h-3.5 ${(activeTab as string) === 'home' ? 'text-[#FF3823]' : 'text-slate-400'}`} />
            <span>{isArabic ? 'الرئيسية' : 'Accueil'}</span>
          </button>

          {/* 1. 🎬 Feed Vidéos */}
          <button
            onClick={() => onSelectTab('feed')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              (activeTab as string) === 'feed'
                ? 'bg-white dark:bg-slate-900 text-[#FF3823] dark:text-[#FF6B35] shadow-xs ring-1 ring-[#FF3823]/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Film className={`w-3.5 h-3.5 ${(activeTab as string) === 'feed' ? 'text-[#FF3823]' : 'text-slate-400'}`} />
            <span>{t.tabFeed}</span>
          </button>

          {/* 2. 🔎 Recherche */}
          <button
            onClick={() => onSelectTab('search')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'search'
                ? 'bg-white dark:bg-slate-900 text-[#FF3823] dark:text-[#FF6B35] shadow-xs ring-1 ring-[#FF3823]/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Search className={`w-3.5 h-3.5 ${activeTab === 'search' ? 'text-[#FF3823]' : 'text-slate-400'}`} />
            <span>{t.tabSearch}</span>
          </button>

          {/* 3. ＋ Publier Modal Trigger */}
          <button
            onClick={() => onOpenCreateModal && onOpenCreateModal()}
            className="px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white shadow-xs hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.tabPublish}</span>
          </button>

          {/* 4. ❤️ Rencontre / Discover */}
          <button
            onClick={() => onSelectTab('discover')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'discover'
                ? 'bg-white dark:bg-slate-900 text-[#FF3823] dark:text-[#FF6B35] shadow-xs ring-1 ring-[#FF3823]/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 fill-current ${activeTab === 'discover' ? 'text-[#FF3823]' : 'text-slate-400'}`} />
            <span>{t.tabDiscover}</span>
          </button>

          {/* 5. 👥 Nisfy Communautés (Wilayas, Diaspora, Thèmes, Live Rooms) */}
          <button
            onClick={() => onSelectTab('communities')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'communities'
                ? 'bg-white dark:bg-slate-900 text-[#FF3823] dark:text-[#FF6B35] shadow-xs ring-1 ring-[#FF3823]/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className={`w-3.5 h-3.5 ${activeTab === 'communities' ? 'text-[#FF3823]' : 'text-slate-400'}`} />
            <span>{isArabic ? 'المجتمعات 🇩🇿' : 'Communautés 🇩🇿'}</span>
          </button>

          {/* 6. 💬 Messagerie */}
          <button
            onClick={() => onSelectTab('chat')}
            className={`relative px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-slate-900 text-[#FF3823] dark:text-[#FF6B35] shadow-xs ring-1 ring-[#FF3823]/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageCircle className={`w-3.5 h-3.5 ${activeTab === 'chat' ? 'text-[#FF3823]' : 'text-slate-400'}`} />
            <span>{t.tabChat}</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white rounded-full text-[9px] font-extrabold animate-pulse shadow-xs shadow-orange-500/30">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Admin Direct Button (When Super Admin or activeTab === 'admin') */}
          {(isMasterUser || activeTab === 'admin') && (
            <button
              onClick={() => onSelectTab('admin')}
              className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-amber-500 to-[#FF3823] text-white shadow-xs'
                  : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 border border-amber-500/30'
              }`}
              title="Espace Administrateur (Gestion des publicités, contrats et paiements)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{isArabic ? '👑 الإدارة' : '👑 Admin Pubs'}</span>
            </button>
          )}

          {/* 6. Fluid "Explorer" Menu (Replaces 6 separate buttons) */}
          <div className="relative" ref={explorerMenuRef}>
            <button
              onClick={() => setShowExplorerMenu(!showExplorerMenu)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                isSecondaryActive || showExplorerMenu
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{isArabic ? 'المزيد' : 'Plus'}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showExplorerMenu ? 'rotate-180' : ''}`} />
            </button>

            {showExplorerMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-1.5 z-50 animate-in fade-in zoom-in-95">
                {/* 💍 Rétroplanning Dar Wa Drouj */}
                <button
                  onClick={() => { onSelectTab('retroplanning'); setShowExplorerMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'retroplanning' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{isArabic ? 'دار ودروج (مخطط الزواج)' : 'Dar Wa Drouj (Rétroplanning)'}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{isArabic ? 'تنظيم المراحل والمصاريف' : 'De la Fatiha au Jour J'}</span>
                  </div>
                </button>

                <button
                  onClick={() => { onSelectTab('finance'); setShowExplorerMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'finance' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <PiggyBank className="w-4 h-4 text-emerald-600" />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{isArabic ? 'مستشار الميزانية والتوفير IA' : 'Conseiller Épargne IA'}</span>
                    <span className="text-[10px] text-slate-400 font-normal">Gemini 3.7 • Budget Zawaj</span>
                  </div>
                </button>

                <button
                  onClick={() => { onSelectTab('shop'); setShowExplorerMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'shop' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>{isArabic ? 'متجر الأعراس (E-Commerce)' : 'Boutique Mariage DZ'}</span>
                </button>

                <button
                  onClick={() => { onSelectTab('marketplace'); setShowExplorerMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'marketplace' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>{isArabic ? 'سوق وقاعات الأعراس' : 'Prestataires & Salles'}</span>
                </button>

                <button
                  onClick={() => { onSelectTab('wedding_contracts'); setShowExplorerMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'wedding_contracts' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4 text-[#FF3823]" />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{isArabic ? 'عقود وحجوزات الأعراس' : 'Contrats & Réservations DZ'}</span>
                    <span className="text-[10px] text-slate-400 font-normal">Click-to-Book & Acomptes</span>
                  </div>
                </button>

                <button
                  onClick={() => { onSelectTab('customs'); setShowExplorerMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'customs' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>{isArabic ? 'دليل عادات 69 ولاية' : 'Coutumes 69 Wilayas'}</span>
                </button>

                <button
                  onClick={() => { onSelectTab('chef_nadjet'); setShowExplorerMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'chef_nadjet' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ChefHat className="w-4 h-4 text-amber-600" />
                  <span>{isArabic ? 'وصفات وفنون الطهي' : 'Recettes & Gastronomie'}</span>
                </button>

                <button
                  onClick={() => { onSelectTab('live'); setShowExplorerMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'live' ? 'bg-orange-50 dark:bg-orange-950/60 text-[#FF3823]' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Radio className="w-4 h-4 text-[#FF3823] animate-pulse" />
                  <span>{t.tabLive}</span>
                </button>

                <button
                  onClick={() => { onSelectTab('music'); setShowExplorerMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'music' ? 'bg-orange-50 dark:bg-orange-950/60 text-[#FF3823]' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Music className="w-4 h-4 text-[#FF3823]" />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{isArabic ? '🎵 موسيقى كل الأنواع' : '🎵 Musique Tous Genres'}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{isArabic ? 'شعبي، راي، أندلسي، قبايلي، يوتيوب' : 'Chaâbi, Raï, Andalou, Kabyle, Staïfi...'}</span>
                  </div>
                </button>

                {onOpenPwaInstall && (
                  <button
                    onClick={() => { setShowExplorerMenu(false); onOpenPwaInstall(); }}
                    className="w-full px-3 py-2 text-left text-xs font-bold rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer bg-orange-50/70 dark:bg-orange-950/40 text-[#FF3823] hover:bg-orange-100/80 dark:hover:bg-orange-950/60 border border-orange-200/60 dark:border-orange-900/40"
                  >
                    <Download className="w-4 h-4 text-[#FF3823] shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{isArabic ? '💻 / 📱 تثبيت التطبيق على الكمبيوتر والهاتف' : '💻 / 📱 Installer l’App sur PC & Mobile'}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        {isArabic ? 'رابط التثبيت • ويندوز • ماك • أندرويد' : 'PWA autonome • Windows, Mac & Mobile'}
                      </span>
                    </div>
                  </button>
                )}

                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                <button
                  onClick={() => { onSelectTab('admin'); setShowExplorerMenu(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-gradient-to-r from-amber-500 to-[#FF3823] text-white'
                      : isMasterUser
                      ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 border border-amber-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{isArabic ? '👑 إدارة الإعلانات والمدفوعات' : '👑 Pubs & Paiements (Admin)'}</span>
                    {isMasterUser && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">Super Admin actif</span>
                    )}
                  </div>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right Side: Fluid Search & Unified User Action Menu */}
        <div className="flex items-center gap-2">
          {/* Fluid Compact Search */}
          <div className="relative flex items-center">
            {isSearchExpanded ? (
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-right-4 duration-200">
                <Search 
                  className="w-3.5 h-3.5 text-slate-400 shrink-0 cursor-pointer hover:text-[#FF3823]" 
                  onClick={() => {
                    onSelectTab('search');
                    setIsSearchExpanded(false);
                    window.dispatchEvent(new CustomEvent('nisfy:execute-search', { detail: { query: searchQuery } }));
                  }}
                />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange?.(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      (e.target as HTMLElement)?.blur();
                      onSelectTab('search');
                      setIsSearchExpanded(false);
                      window.dispatchEvent(new CustomEvent('nisfy:execute-search', { detail: { query: searchQuery } }));
                    }
                  }}
                  placeholder={isArabic ? 'بحث (أشخاص، كراء، متجر...)' : 'Rechercher (location, shop...)'}
                  className="w-32 sm:w-48 px-2 py-0.5 bg-transparent text-xs text-slate-800 dark:text-white focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => onSearchChange?.('')} className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      onSelectTab('search');
                      window.dispatchEvent(new CustomEvent('nisfy:execute-search', { detail: { query: searchQuery } }));
                    }
                    setIsSearchExpanded(false);
                  }}
                  className="ml-1 text-[11px] font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  title="Fermer"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsSearchExpanded(true);
                  if (activeTab !== 'search') {
                    onSelectTab('search');
                  }
                }}
                title="Rechercher"
                className="w-8.5 h-8.5 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Minimal Language Toggle */}
          <LanguageSwitcher size="sm" variant="toggle" />

          {/* Unified Profile & Settings Menu (Replaces all scattered buttons) */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer group"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.pseudo}
                referrerPolicy="no-referrer"
                className="w-6.5 h-6.5 rounded-full object-cover"
              />
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95">
                {/* User Info Header */}
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between mb-1">
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate">{currentUser.pseudo}</p>
                    <p className="text-[11px] text-slate-400 font-medium truncate">{currentUser.city}</p>
                  </div>
                  {currentUser.verified && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      ✓ DZ69
                    </span>
                  )}
                </div>

                {/* Quick Preferences: Theme & Sound (Integrated inside menu) */}
                <div className="grid grid-cols-2 gap-1 px-1 py-1 mb-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  {onToggleDarkMode && (
                    <button
                      onClick={onToggleDarkMode}
                      className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
                      <span>{isDarkMode ? 'Clair' : 'Sombre'}</span>
                    </button>
                  )}
                  <button
                    onClick={onToggleMute}
                    className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#FF3823]" />}
                    <span>{isMuted ? 'Muet' : 'Sons'}</span>
                  </button>
                </div>

                {/* Main Menu Links */}
                <button
                  onClick={() => { onSelectTab('profile'); setShowUserMenu(false); }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{isArabic ? 'الملف الشخصي' : 'Mon Profil'}</span>
                </button>

                <button
                  onClick={() => { onSelectTab('finance'); setShowUserMenu(false); }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <PiggyBank className="w-4 h-4 text-emerald-600" />
                  <span>{isArabic ? 'مستشار الميزانية والتوفير IA' : 'Conseiller Épargne & Budget IA'}</span>
                </button>

                {onOpenPremium && (
                  <button
                    onClick={() => { onOpenPremium(); setShowUserMenu(false); }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span>{isArabic ? 'باقات VIP واشتراكات الذهب' : 'Abonnements VIP & Gold'}</span>
                  </button>
                )}

                {onOpenVerification && (
                  <button
                    onClick={() => { onOpenVerification(); setShowUserMenu(false); }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isArabic ? 'توثيق الحساب (Selfie)' : 'Vérification Profil 🇩🇿'}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onOpenContact) onOpenContact();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#38BDF8]" />
                  <span>{isArabic ? 'اتصل بالإدارة' : 'Contact & Support'}</span>
                </button>

                {onOpenPwaInstall && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenPwaInstall();
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#FF3823]" />
                    <span>{isArabic ? '💻 / 📱 تثبيت التطبيق (PC & Mobile)' : '💻 / 📱 Installer l’App (PC & Mobile)'}</span>
                  </button>
                )}

                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                {/* Direct Admin Access inside User Menu */}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onSelectTab('admin');
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-gradient-to-r from-amber-500 to-[#FF3823] text-white'
                      : isMasterUser
                      ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 border border-amber-500/30'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{isArabic ? '👑 إدارة الإعلانات والمدفوعات' : '👑 Espace Pubs & Paiements'}</span>
                    {isMasterUser && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">Super Admin actif</span>
                    )}
                  </div>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                {/* Switch Profiles (Tester d'autres profils instantanément) */}
                {onSelectUser && allUsers && allUsers.length > 1 && (
                  <div className="px-1 py-1 space-y-1">
                    <div className="flex items-center justify-between px-2 py-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <ArrowRightLeft className="w-3 h-3 text-[#FF3823]" />
                        {isArabic ? 'تبديل الحساب للتجربة' : 'Changer de profil (Test)'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {allUsers.slice(0, 3).map((u) => {
                        const isCurrent = u.id === currentUser.id;
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => {
                              if (!isCurrent) {
                                onSelectUser(u);
                                setShowUserMenu(false);
                              }
                            }}
                            className={`p-1.5 rounded-lg border text-left flex flex-col items-center gap-1 transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-orange-50 dark:bg-orange-950/40 border-[#FF3823]/50 ring-1 ring-[#FF3823]/30'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700'
                            }`}
                          >
                            <img
                              src={u.avatar}
                              alt={u.pseudo}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-[10px] font-bold truncate max-w-full text-slate-700 dark:text-slate-200">
                              {u.pseudo.split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                {onOpenDeleteAccount && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenDeleteAccount();
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <UserX className="w-4 h-4 text-red-500 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span>{isArabic ? 'حق الانسحاب وحذف الحساب' : 'Supprimer mon compte (Retrait)'}</span>
                      <span className="text-[10px] text-red-400 dark:text-red-500 font-normal">
                        {isArabic ? 'مع إبداء سبب المغادرة' : 'Explication obligatoire'}
                      </span>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => { setShowUserMenu(false); onLogout(); }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-[#FF3823] hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-[#FF3823]" />
                  <span>{t.logout}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Fixed Bottom Navigation Bar - Strict 5-Pill Master Schema */}
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/70 dark:border-slate-800/70 px-2 py-1.5 flex items-center justify-around shadow-lg transition-colors duration-200"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* 1. 🏠 Accueil / Menu Principal */}
      <button
        type="button"
        onClick={() => {
          if (activeTab === 'feed') {
            onSelectTab('home');
          } else {
            onSelectTab('home');
          }
        }}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'home'
            ? 'text-[#FF3823] dark:text-[#FF6B35] font-bold bg-orange-500/10 dark:bg-orange-500/20 ring-1 ring-[#FF3823]/25'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{isArabic ? 'الرئيسية' : 'Accueil'}</span>
      </button>

      {/* 2. 🔎 Recherche */}
      <button
        type="button"
        onClick={() => onSelectTab('search')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'search'
            ? 'text-[#FF3823] dark:text-[#FF6B35] font-bold bg-orange-500/10 dark:bg-orange-500/20 ring-1 ring-[#FF3823]/25'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t.tabSearch}</span>
      </button>

      {/* 3. ＋ Publier (Center Action Button) */}
      <button
        type="button"
        onClick={() => onOpenCreateModal && onOpenCreateModal()}
        className="flex flex-col items-center justify-center -mt-4 cursor-pointer group"
      >
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#FF3823] text-white flex items-center justify-center shadow-lg shadow-orange-500/40 group-active:scale-95 transition-transform border-2 border-white dark:border-slate-900">
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </div>
        <span className="text-[9px] font-black text-[#FF3823] mt-0.5">{t.tabPublish}</span>
      </button>

      {/* 4. ❤️ Rencontre */}
      <button
        type="button"
        onClick={() => onSelectTab('discover')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'discover'
            ? 'text-[#FF3823] dark:text-[#FF6B35] font-bold bg-orange-500/10 dark:bg-orange-500/20 ring-1 ring-[#FF3823]/25'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Heart className={`w-5 h-5 ${activeTab === 'discover' ? 'fill-[#FF3823]' : ''}`} />
        <span className="text-[10px] mt-0.5">{t.tabDiscover}</span>
      </button>

      {/* 5. 👤 Profil */}
      <button
        type="button"
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'profile'
            ? 'text-[#FF3823] dark:text-[#FF6B35] font-bold bg-orange-500/10 dark:bg-orange-500/20 ring-1 ring-[#FF3823]/25'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{isArabic ? 'حسابي' : 'Profil'}</span>
      </button>
    </nav>
    </>
  );
}

