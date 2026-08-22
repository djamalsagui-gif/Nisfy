import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Globe,
  Radio,
  Zap,
  Activity,
  Flame,
  MapPin,
  Users,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  MessageCircle,
  ArrowLeft,
  EyeOff,
  Heart,
  Send,
  Eye,
  Play,
  X,
  CheckCircle2,
  Video,
} from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { datingSounds } from '../utils/soundEffects';

export interface TrafficZone {

  id: string;
  name: string;
  arabicName: string;
  country: string;
  flag: string;
  trafficLevel: 'critical' | 'high' | 'medium' | 'normal';
  activeUsers: number;
  activeMen: number;
  activeWomen: number;
  requestsPerMin: number;
  growthRate: string;
  coordinates: { x: number; y: number }; // Percentage on SVG 0-100
  recentActivity: string;
  wilayaCode?: string;
  category: 'dz' | 'france' | 'diaspora';
}

const INITIAL_ZONES: TrafficZone[] = [
  {
    id: 'algiers',
    name: 'Alger',
    arabicName: 'الجزائر العاصمة',
    country: 'Algérie',
    flag: '🇩🇿',
    trafficLevel: 'critical',
    activeUsers: 2180,
    activeMen: 1190,
    activeWomen: 990,
    requestsPerMin: 540,
    growthRate: '+34%',
    coordinates: { x: 50.5, y: 38.5 },
    recentActivity: 'Pic d’activité : discussions privées & likes intensifs',
    wilayaCode: '16',
    category: 'dz',
  },
  {
    id: 'lyon',
    name: 'Lyon (Rhône 69)',
    arabicName: 'ليون (69)',
    country: 'France',
    flag: '🇫🇷',
    trafficLevel: 'critical',
    activeUsers: 1640,
    activeMen: 890,
    activeWomen: 750,
    requestsPerMin: 410,
    growthRate: '+29%',
    coordinates: { x: 52.0, y: 31.0 },
    recentActivity: 'Zone cœur DZ69 : forte concentration de connexions',
    wilayaCode: '69',
    category: 'france',
  },
  {
    id: 'oran',
    name: 'Oran',
    arabicName: 'وهران',
    country: 'Algérie',
    flag: '🇩🇿',
    trafficLevel: 'high',
    activeUsers: 1120,
    activeMen: 610,
    activeWomen: 510,
    requestsPerMin: 290,
    growthRate: '+19%',
    coordinates: { x: 48.8, y: 39.4 },
    recentActivity: 'Nombreux partages de profils et salons vocaux',
    wilayaCode: '31',
    category: 'dz',
  },
  {
    id: 'paris',
    name: 'Paris & Île-de-France',
    arabicName: 'باريس',
    country: 'France',
    flag: '🇫🇷',
    trafficLevel: 'high',
    activeUsers: 980,
    activeMen: 530,
    activeWomen: 450,
    requestsPerMin: 245,
    growthRate: '+16%',
    coordinates: { x: 50.8, y: 28.5 },
    recentActivity: 'Multiplication des matchs bilatéraux Paris ↔ Alger',
    category: 'france',
  },
  {
    id: 'marseille',
    name: 'Marseille & PACA',
    arabicName: 'مارسيليا',
    country: 'France',
    flag: '🇫🇷',
    trafficLevel: 'high',
    activeUsers: 840,
    activeMen: 460,
    activeWomen: 380,
    requestsPerMin: 195,
    growthRate: '+22%',
    coordinates: { x: 52.4, y: 33.6 },
    recentActivity: 'Afflux important de nouveaux inscrits connectés',
    wilayaCode: '13',
    category: 'france',
  },
  {
    id: 'constantine',
    name: 'Constantine',
    arabicName: 'قسنطينة',
    country: 'Algérie',
    flag: '🇩🇿',
    trafficLevel: 'high',
    activeUsers: 760,
    activeMen: 410,
    activeWomen: 350,
    requestsPerMin: 180,
    growthRate: '+15%',
    coordinates: { x: 52.8, y: 38.6 },
    recentActivity: 'Salon public très dynamique et interactions rapides',
    wilayaCode: '25',
    category: 'dz',
  },
  {
    id: 'tizi',
    name: 'Tizi Ouzou & Béjaïa',
    arabicName: 'تيزي وزو / بجاية',
    country: 'Algérie',
    flag: '🇩🇿',
    trafficLevel: 'medium',
    activeUsers: 590,
    activeMen: 320,
    activeWomen: 270,
    requestsPerMin: 140,
    growthRate: '+12%',
    coordinates: { x: 51.7, y: 38.3 },
    recentActivity: 'Échanges continus et découverte de profils',
    wilayaCode: '15/06',
    category: 'dz',
  },
  {
    id: 'setif',
    name: 'Sétif & Bordj',
    arabicName: 'سطيف / برج بوعريريج',
    country: 'Algérie',
    flag: '🇩🇿',
    trafficLevel: 'medium',
    activeUsers: 480,
    activeMen: 260,
    activeWomen: 220,
    requestsPerMin: 110,
    growthRate: '+10%',
    coordinates: { x: 52.0, y: 39.2 },
    recentActivity: 'Forte consultation des fiches membres',
    wilayaCode: '19',
    category: 'dz',
  },
  {
    id: 'annaba',
    name: 'Annaba',
    arabicName: 'عنابة',
    country: 'Algérie',
    flag: '🇩🇿',
    trafficLevel: 'medium',
    activeUsers: 420,
    activeMen: 230,
    activeWomen: 190,
    requestsPerMin: 98,
    growthRate: '+14%',
    coordinates: { x: 53.6, y: 38.2 },
    recentActivity: 'Connexions nocturnes et messages instantanés',
    wilayaCode: '23',
    category: 'dz',
  },
  {
    id: 'montreal',
    name: 'Montréal & Québec',
    arabicName: 'مونتريال (كندا)',
    country: 'Canada',
    flag: '🇨🇦',
    trafficLevel: 'medium',
    activeUsers: 390,
    activeMen: 210,
    activeWomen: 180,
    requestsPerMin: 85,
    growthRate: '+25%',
    coordinates: { x: 26.5, y: 31.5 },
    recentActivity: 'Forte communauté diaspora connectée le soir',
    category: 'diaspora',
  },
  {
    id: 'dubai',
    name: 'Dubaï & E.A.U.',
    arabicName: 'دبي (الإمارات)',
    country: 'Émirats',
    flag: '🇦🇪',
    trafficLevel: 'normal',
    activeUsers: 310,
    activeMen: 170,
    activeWomen: 140,
    requestsPerMin: 72,
    growthRate: '+18%',
    coordinates: { x: 67.5, y: 44.5 },
    recentActivity: 'Activité soutenue en fin d’après-midi',
    category: 'diaspora',
  },
  {
    id: 'london',
    name: 'Londres & UK',
    arabicName: 'لندن (بريطانيا)',
    country: 'Royaume-Uni',
    flag: '🇬🇧',
    trafficLevel: 'normal',
    activeUsers: 240,
    activeMen: 130,
    activeWomen: 110,
    requestsPerMin: 55,
    growthRate: '+8%',
    coordinates: { x: 49.5, y: 26.2 },
    recentActivity: 'Consultations régulières et messages privés',
    category: 'diaspora',
  },
  {
    id: 'tunis_casa',
    name: 'Tunis & Casablanca',
    arabicName: 'تونس / الدار البيضاء',
    country: 'Maghreb',
    flag: '🇹🇳',
    trafficLevel: 'medium',
    activeUsers: 510,
    activeMen: 270,
    activeWomen: 240,
    requestsPerMin: 125,
    growthRate: '+14%',
    coordinates: { x: 46.2, y: 40.2 },
    recentActivity: 'Échanges inter-villes et nouvelles affinités',
    category: 'dz',
  },
];

interface LiveTrafficMapViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onStartDirectChat: (user: UserProfile, prefilledMessage?: string) => void;
  onExploreZoneFilter?: (cityName: string) => void;
  onCloseMap?: () => void;
  onToggleMap?: (enabled: boolean) => void;
}

export function LiveTrafficMapView({
  currentUser,
  allUsers,
  onStartDirectChat,
  onExploreZoneFilter,
  onCloseMap,
  onToggleMap,
}: LiveTrafficMapViewProps) {
  const { t, isArabic } = useLanguage();
  const [zones, setZones] = useState<TrafficZone[]>(INITIAL_ZONES);
  const [selectedZone, setSelectedZone] = useState<TrafficZone | null>(INITIAL_ZONES[0]);
  const [filterCategory, setFilterCategory] = useState<'all' | 'dz' | 'france' | 'diaspora'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'homme' | 'femme'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRadarActive, setIsRadarActive] = useState(true);
  const [zoomFocus, setZoomFocus] = useState<'world' | 'mediterranean'>('mediterranean');

  // Zone specific filters & modal state
  const [cityFilter, setCityFilter] = useState<'all' | 'femme' | 'homme' | 'marriage' | 'video'>('all');
  const [citySearchText, setCitySearchText] = useState('');
  const [messageModalUser, setMessageModalUser] = useState<UserProfile | null>(null);
  const [customMessageText, setCustomMessageText] = useState('');
  const [profileModalUser, setProfileModalUser] = useState<UserProfile | null>(null);
  const [videoModalUser, setVideoModalUser] = useState<UserProfile | null>(null);
  const [jasminFeedbackId, setJasminFeedbackId] = useState<string | null>(null);
  const membersSectionRef = useRef<HTMLDivElement | null>(null);

  // Smooth scroll to members hub when zone is selected
  const handleSelectZone = (zone: TrafficZone) => {
    setSelectedZone(zone);
    setTimeout(() => {
      membersSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };


  // Live Activity Stream
  const [liveEvents, setLiveEvents] = useState<{ id: string; text: string; time: string; tag: string }[]>([
    { id: '1', text: '⚡ Connexion massive depuis Lyon (Rhône 69) : 890 H · 750 F', time: 'À l’instant', tag: 'DZ69' },
    { id: '2', text: '❤️ Match détecté entre Alger (F) et Lyon (H)', time: 'Il y a 10s', tag: 'Match' },
    { id: '3', text: '💬 14 nouveaux messages dans le Salon depuis Oran', time: 'Il y a 25s', tag: 'Salon' },
    { id: '4', text: '✨ Inscription validée d’une célibataire depuis Constantine', time: 'Il y a 40s', tag: 'Membre F' },
  ]);

  // Simulate subtle real-time traffic flux
  useEffect(() => {
    const interval = setInterval(() => {
      setZones((prev) =>
        prev.map((z) => {
          const deltaMen = Math.floor(Math.random() * 5) - 2;
          const deltaWomen = Math.floor(Math.random() * 5) - 2;
          const newMen = Math.max(20, z.activeMen + deltaMen);
          const newWomen = Math.max(20, z.activeWomen + deltaWomen);
          return {
            ...z,
            activeMen: newMen,
            activeWomen: newWomen,
            activeUsers: newMen + newWomen,
          };
        })
      );

      // Random new event
      const sampleEvents = [
        { text: '🔥 Pic de trafic détecté sur Alger (16) : 1,190 H & 990 F connectés', tag: 'Trafic' },
        { text: '💬 Nouveau message direct Lyon 69 (H) ➔ Marseille (F)', tag: 'Chat' },
        { text: '⭐ Coup de cœur envoyé depuis Montréal vers Alger', tag: 'Coup de cœur' },
        { text: '🇩🇿 8 membres en ligne simultanés (4 H · 4 F) à Tizi Ouzou', tag: 'DZ' },
        { text: '🚀 Afflux de visiteurs sur القلعة DZ69', tag: 'Serveur' },
        { text: '👩 Nouvelle célibataire active à Annaba (W.23)', tag: 'Connectée' },
        { text: '👨 Nouveau membre actif à Oran (W.31)', tag: 'Connecté' },
      ];
      const randomEv = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      setLiveEvents((prev) => [
        {
          id: String(Date.now()),
          text: randomEv.text,
          time: 'À l’instant',
          tag: randomEv.tag,
        },
        ...prev.slice(0, 4),
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Filtered zones
  const filteredZones = useMemo(() => {
    return zones.filter((z) => {
      const matchCat = filterCategory === 'all' || z.category === filterCategory;
      const matchSearch =
        z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        z.arabicName.includes(searchQuery) ||
        z.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (z.wilayaCode && z.wilayaCode.includes(searchQuery));
      return matchCat && matchSearch;
    });
  }, [zones, filterCategory, searchQuery]);

  // Total stats & gender breakdown
  const totalActiveUsers = useMemo(
    () => zones.reduce((acc, curr) => acc + curr.activeUsers, 0),
    [zones]
  );
  const totalActiveMen = useMemo(
    () => zones.reduce((acc, curr) => acc + curr.activeMen, 0),
    [zones]
  );
  const totalActiveWomen = useMemo(
    () => zones.reduce((acc, curr) => acc + curr.activeWomen, 0),
    [zones]
  );
  const percentMen = Math.round((totalActiveMen / (totalActiveUsers || 1)) * 100);
  const percentWomen = 100 - percentMen;

  const totalRpm = useMemo(
    () => zones.reduce((acc, curr) => acc + curr.requestsPerMin, 0),
    [zones]
  );

  // All members registered in selected zone (case-insensitive fuzzy matching)
  const allZoneMembers = useMemo(() => {
    if (!selectedZone) return [];
    const zoneQuery = selectedZone.name.toLowerCase();
    const zoneId = selectedZone.id.toLowerCase();
    const wilayaCode = selectedZone.wilayaCode;

    return allUsers.filter((u) => {
      const uCity = (u.city || '').toLowerCase();
      const uBio = (u.bio || '').toLowerCase();
      return (
        uCity.includes(zoneQuery) ||
        (wilayaCode && uCity.includes(wilayaCode)) ||
        (zoneId === 'algiers' && (uCity.includes('alger') || uCity.includes('16') || uBio.includes('alger'))) ||
        (zoneId === 'lyon' && (uCity.includes('lyon') || uCity.includes('69') || uBio.includes('lyon'))) ||
        (zoneId === 'oran' && (uCity.includes('oran') || uCity.includes('31') || uBio.includes('oran'))) ||
        (zoneId === 'paris' && (uCity.includes('paris') || uCity.includes('75') || uCity.includes('59'))) ||
        (zoneId === 'constantine' && (uCity.includes('constantine') || uCity.includes('25'))) ||
        (zoneId === 'tizi' && (uCity.includes('tizi') || uCity.includes('15'))) ||
        (zoneId === 'setif' && (uCity.includes('setif') || uCity.includes('sétif') || uCity.includes('19'))) ||
        (zoneId === 'annaba' && (uCity.includes('annaba') || uCity.includes('23'))) ||
        (zoneId === 'marseille' && (uCity.includes('marseille') || uCity.includes('13'))) ||
        (zoneId === 'montreal' && (uCity.includes('montreal') || uCity.includes('montréal') || uCity.includes('canada'))) ||
        (zoneId === 'dubai' && (uCity.includes('dubai') || uCity.includes('dubaï') || uCity.includes('emirates')))
      );
    });
  }, [selectedZone, allUsers]);

  // Filtered members in selected zone by user's search & filter tabs
  const filteredZoneMembers = useMemo(() => {
    return allZoneMembers.filter((u) => {
      // Gender & Category tab filter
      if (cityFilter === 'femme' && u.gender !== 'femme') return false;
      if (cityFilter === 'homme' && u.gender !== 'homme') return false;
      if (cityFilter === 'marriage' && !u.marriageIntentions && !u.lookingFor?.toLowerCase().includes('mariage')) return false;
      if (cityFilter === 'video' && !u.videoPresentation) return false;

      // Text search inside city
      if (citySearchText.trim()) {
        const query = citySearchText.toLowerCase();
        const matchPseudo = u.pseudo.toLowerCase().includes(query);
        const matchOccupation = (u.occupation || '').toLowerCase().includes(query);
        const matchBio = (u.bio || '').toLowerCase().includes(query);
        const matchInterests = u.interests.some((i) => i.toLowerCase().includes(query));
        if (!matchPseudo && !matchOccupation && !matchBio && !matchInterests) return false;
      }

      return true;
    });
  }, [allZoneMembers, cityFilter, citySearchText]);

  // Fast direct chat launcher
  const handleQuickChat = (user: UserProfile) => {
    datingSounds.playMessageSent();
    const cityLabel = selectedZone?.name || user.city;
    const defaultMsg = isArabic
      ? `سلام ${user.pseudo} ! رأيت حسابك متصلاً الآن في ${selectedZone?.arabicName || cityLabel} عبر رادار نصفي DZ69 ✨`
      : `Salam ${user.pseudo} ! J'ai vu que tu es connecté(e) en direct à ${cityLabel} sur la carte DZ69 ✨`;
    onStartDirectChat(user, defaultMsg);
  };

  // Open custom message composer modal
  const handleOpenCustomMessageModal = (user: UserProfile) => {
    setMessageModalUser(user);
    const cityLabel = selectedZone?.name || user.city;
    setCustomMessageText(
      isArabic
        ? `سلام ${user.pseudo} ! يسعدني التعرف عليك والحديث معك بكل احترام عبر نصفي DZ69 (${cityLabel}) ✨`
        : `Salam ${user.pseudo} ! Je serais ravi(e) d'échanger et de faire connaissance avec toi dans le respect (${cityLabel}) ✨`
    );
  };

  // Submit custom message
  const handleSendCustomMessage = () => {
    if (!messageModalUser) return;
    datingSounds.playMessageSent();
    onStartDirectChat(messageModalUser, customMessageText);
    setMessageModalUser(null);
    setCustomMessageText('');
  };

  // Send Jasmin flower
  const handleSendJasmin = (user: UserProfile) => {
    datingSounds.playLikeSound();
    setJasminFeedbackId(user.id);
    setTimeout(() => {
      setJasminFeedbackId(null);
    }, 2500);
  };

  const getTrafficColor = (level: TrafficZone['trafficLevel']) => {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-rose-500',
          border: 'border-rose-400',
          ring: 'ring-rose-500/40',
          ping: 'bg-rose-400',
          text: 'text-rose-400',
          badge: 'bg-rose-950/80 text-rose-300 border-rose-800',
          label: 'Trafic Très Élevé 🔥',
        };
      case 'high':
        return {
          bg: 'bg-amber-500',
          border: 'border-amber-400',
          ring: 'ring-amber-500/40',
          ping: 'bg-amber-400',
          text: 'text-amber-400',
          badge: 'bg-amber-950/80 text-amber-300 border-amber-800',
          label: 'Trafic Élevé ⚡',
        };
      case 'medium':
        return {
          bg: 'bg-indigo-500',
          border: 'border-indigo-400',
          ring: 'ring-indigo-500/40',
          ping: 'bg-indigo-400',
          text: 'text-indigo-400',
          badge: 'bg-indigo-950/80 text-indigo-300 border-indigo-800',
          label: 'Trafic Actif 📈',
        };
      default:
        return {
          bg: 'bg-emerald-500',
          border: 'border-emerald-400',
          ring: 'ring-emerald-500/40',
          ping: 'bg-emerald-400',
          text: 'text-emerald-400',
          badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
          label: 'Trafic Normal 🟢',
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar for Navigation & Visibility Controls */}
      {(onCloseMap || onToggleMap) && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            {onCloseMap && (
              <button
                type="button"
                onClick={onCloseMap}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.returnToDiscover}</span>
              </button>
            )}
            <span className="text-xs text-slate-500 hidden sm:inline">
              • {t.mapOptionHint}
            </span>
          </div>

          {onToggleMap && (
            <button
              type="button"
              onClick={() => {
                onToggleMap(false);
                if (onCloseMap) onCloseMap();
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title={t.deactivateMapBtn}
            >
              <EyeOff className="w-4 h-4 text-rose-600" />
              <span>{t.deactivateMapBtn}</span>
            </button>
          )}
        </div>
      )}

      {/* Header Info Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-60 h-60 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping inline-block" />
                {t.radarLive}
              </span>
              <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-[11px] font-bold">
                {t.appName}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Serveur synchronisé
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Globe className="w-7 h-7 text-rose-500" />
              {t.worldMapBanner}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {t.radarSubtitle}
            </p>
          </div>

          {/* Quick Metrics Cards with Gender (H / F) Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
            {/* Total Connectés */}
            <div className="p-2">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                <Users className="w-3.5 h-3.5 text-rose-400" />
                Total Connectés
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {totalActiveUsers.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +24% en direct
              </span>
            </div>

            {/* Répartition par Sexe H / F */}
            <div className="p-2 border-l border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="text-indigo-400">👨 H:</span> {totalActiveMen.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-rose-400">👩 F:</span> {totalActiveWomen.toLocaleString()}
                </span>
              </div>
              {/* Ratio Bar */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex mt-2 shadow-inner border border-slate-700/60">
                <div
                  style={{ width: `${percentMen}%` }}
                  className="bg-indigo-500 h-full transition-all duration-500"
                  title={`Hommes (H): ${percentMen}%`}
                />
                <div
                  style={{ width: `${percentWomen}%` }}
                  className="bg-rose-500 h-full transition-all duration-500"
                  title={`Femmes (F): ${percentWomen}%`}
                />
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-400 font-extrabold mt-1">
                <span className="text-indigo-300">{percentMen}% Hommes</span>
                <span className="text-rose-300">{percentWomen}% Femmes</span>
              </div>
            </div>

            {/* Débit / min */}
            <div className="p-2 border-l border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Débit / min
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">
                {totalRpm.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">Échanges instantanés</span>
            </div>

            {/* Pôle Nº1 */}
            <div className="p-2 border-l border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                Pôle Nº1
              </div>
              <div className="text-sm sm:text-base font-black text-rose-400 mt-0.5 truncate">
                Alger & Lyon 69
              </div>
              <span className="text-[10px] text-rose-300/80">Cœur de réseau</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Map + Side Hotspots List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-4 sm:p-5 relative overflow-hidden">
            {/* Map Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setZoomFocus('mediterranean')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    zoomFocus === 'mediterranean'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  🇩🇿 Focus Algérie & Lyon (69)
                </button>
                <button
                  onClick={() => setZoomFocus('world')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    zoomFocus === 'world'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  🌐 Vue Monde Entier
                </button>
              </div>

              {/* Gender Filter for Map & List */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
                <button
                  onClick={() => setGenderFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    genderFilter === 'all'
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tous ({totalActiveUsers.toLocaleString()})
                </button>
                <button
                  onClick={() => setGenderFilter('homme')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    genderFilter === 'homme'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-indigo-400 hover:text-indigo-200'
                  }`}
                >
                  👨 H ({totalActiveMen.toLocaleString()})
                </button>
                <button
                  onClick={() => setGenderFilter('femme')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    genderFilter === 'femme'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-rose-400 hover:text-rose-200'
                  }`}
                >
                  👩 F ({totalActiveWomen.toLocaleString()})
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRadarActive(!isRadarActive)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isRadarActive
                      ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                  title="Activer/Désactiver l'effet radar"
                >
                  <Radio className={`w-3.5 h-3.5 ${isRadarActive ? 'animate-spin' : ''}`} />
                  {isRadarActive ? 'Radar Actif' : 'Radar Pause'}
                </button>
              </div>
            </div>

            {/* SVG WORLD / REGIONAL MAP WITH BLINKING RADAR POINTS */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-b from-slate-900 via-slate-950 to-[#070b14] rounded-2xl overflow-hidden border border-slate-800/80 select-none">
              {/* Radar Scanner Beam */}
              {isRadarActive && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-25 z-0"
                  style={{
                    background:
                      'conic-gradient(from 0deg at 51% 36%, rgba(244,63,94,0.3) 0deg, rgba(99,102,241,0.15) 60deg, transparent 90deg, transparent 360deg)',
                    animation: 'spin 6s linear infinite',
                  }}
                />
              )}

              {/* Background Grid & Coordinates */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* World Landmass Silhouettes (Accurate stylized vector map) */}
              <svg
                viewBox={zoomFocus === 'mediterranean' ? '30 15 45 40' : '0 0 100 80'}
                className="absolute inset-0 w-full h-full transition-all duration-700 ease-out"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="dzGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e11d48" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.15" />
                  </linearGradient>
                </defs>

                {/* Stylized Continents */}
                {/* North America */}
                <path
                  d="M 12 18 Q 18 14 26 16 Q 32 20 28 32 Q 22 40 18 48 Q 14 36 10 28 Z"
                  fill="url(#landGrad)"
                  stroke="#334155"
                  strokeWidth="0.3"
                />
                {/* South America */}
                <path
                  d="M 24 50 Q 30 52 32 60 Q 28 72 24 75 Q 20 66 22 55 Z"
                  fill="url(#landGrad)"
                  stroke="#334155"
                  strokeWidth="0.3"
                />
                {/* Europe */}
                <path
                  d="M 46 16 Q 54 14 58 20 Q 56 28 52 33 Q 46 32 44 24 Z"
                  fill="url(#landGrad)"
                  stroke="#475569"
                  strokeWidth="0.4"
                />
                {/* Africa (with Algeria highlighted) */}
                <path
                  d="M 44 34 Q 54 33 58 37 Q 62 48 58 60 Q 52 70 48 62 Q 42 50 42 38 Z"
                  fill="url(#landGrad)"
                  stroke="#475569"
                  strokeWidth="0.4"
                />
                {/* Specific highlight over Algeria / Maghreb */}
                <path
                  d="M 46 36 Q 53 35 55 38 Q 54 44 48 45 Q 45 42 46 36 Z"
                  fill="url(#dzGlow)"
                  stroke="#e11d48"
                  strokeWidth="0.6"
                  strokeDasharray="1,1"
                />
                {/* Asia / Middle East */}
                <path
                  d="M 60 18 Q 78 16 88 24 Q 92 38 84 50 Q 70 46 64 36 Z"
                  fill="url(#landGrad)"
                  stroke="#334155"
                  strokeWidth="0.3"
                />
                {/* Australia */}
                <path
                  d="M 80 58 Q 88 56 90 64 Q 86 70 80 68 Z"
                  fill="url(#landGrad)"
                  stroke="#334155"
                  strokeWidth="0.3"
                />

                {/* Animated Flight / Communication Curves between Hubs */}
                {/* Alger ↔ Lyon (Rhône 69) */}
                <path
                  d="M 50.5 38.5 Q 53 34 52.0 31.0"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="0.7"
                  strokeDasharray="1.5,1.5"
                  className="animate-pulse"
                />
                {/* Alger ↔ Paris */}
                <path
                  d="M 50.5 38.5 Q 49 33 50.8 28.5"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
                {/* Oran ↔ Marseille */}
                <path
                  d="M 48.8 39.4 Q 52 36 52.4 33.6"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="0.6"
                  strokeDasharray="1.5,1.5"
                />
                {/* Constantine ↔ Montréal */}
                <path
                  d="M 52.8 38.6 Q 38 28 26.5 31.5"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="0.4"
                  strokeDasharray="3,3"
                  opacity="0.7"
                />
              </svg>

              {/* Dynamic Blinking Hotspot Markers */}
              {zones.map((zone) => {
                const colors = getTrafficColor(zone.trafficLevel);
                const isSelected = selectedZone?.id === zone.id;

                // Adjust position percentage if in zoom mode
                let posX = zone.coordinates.x;
                let posY = zone.coordinates.y;

                if (zoomFocus === 'mediterranean') {
                  // Transform coordinate space from 0-100 to cropped 30-75 (X) and 15-55 (Y)
                  posX = ((zone.coordinates.x - 30) / 45) * 100;
                  posY = ((zone.coordinates.y - 15) / 40) * 100;
                }

                // If outside current view, skip rendering
                if (posX < 0 || posX > 100 || posY < 0 || posY > 100) {
                  return null;
                }

                return (
                  <div
                    key={zone.id}
                    onClick={() => handleSelectZone(zone)}
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                  >
                    {/* Blinking Radar Rings */}
                    <div className="relative flex items-center justify-center">
                      {/* Big Animated Ping Ring */}
                      <span
                        className={`absolute w-9 h-9 sm:w-12 sm:h-12 rounded-full ${colors.ping} opacity-75 animate-ping`}
                        style={{
                          animationDuration:
                            zone.trafficLevel === 'critical'
                              ? '1.2s'
                              : zone.trafficLevel === 'high'
                              ? '1.8s'
                              : '2.5s',
                        }}
                      />

                      {/* Secondary pulse wave */}
                      <span
                        className={`absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full ${colors.bg} opacity-40 animate-pulse`}
                      />

                      {/* Center Core Dot */}
                      <span
                        className={`relative w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${colors.bg} border-2 border-white shadow-lg ${
                          isSelected ? 'scale-125 ring-4 ring-rose-400/80' : 'group-hover:scale-110'
                        } transition-transform`}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Bottom Map Legend */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-md rounded-xl p-2 sm:p-2.5 border border-slate-800 flex flex-wrap items-center justify-between gap-2 z-20 text-[10px] text-slate-300">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
                    <span className="font-bold text-rose-300">Trafic Critique (&gt; 1200)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse inline-block" />
                    <span className="font-bold text-amber-300">Trafic Élevé</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                    <span>Trafic Actif</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Modéré</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 italic">
                  💡 Cliquez sur un point pour inspecter la zone
                </div>
              </div>
            </div>
          </div>

          {/* Live Activity Feed / Ticker */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Flux d’activité en temps réel
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Actualisation auto
              </span>
            </div>

            <div className="space-y-1.5">
              {liveEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs animate-in fade-in"
                >
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-rose-300 border border-slate-700">
                      {ev.tag}
                    </span>
                    <span>{ev.text}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">{ev.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel: Zone Inspector & Hotspot List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Zone Card (Detail Inspector) */}
          {selectedZone ? (
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedZone.flag}</span>
                    <div>
                      <h3 className="text-lg font-black text-white">{selectedZone.name}</h3>
                      <p className="text-xs text-rose-300 font-bold font-arabic">
                        {selectedZone.arabicName}
                      </p>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                    getTrafficColor(selectedZone.trafficLevel).badge
                  }`}
                >
                  {getTrafficColor(selectedZone.trafficLevel).label}
                </span>
              </div>

              {/* Stats Grid for this Zone including H & F */}
              <div className="space-y-2.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-1.5 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Total</span>
                    <span className="text-base font-black text-white">
                      {selectedZone.activeUsers.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-emerald-400 block font-bold">
                      {selectedZone.growthRate}
                    </span>
                  </div>

                  <div className="p-1.5 bg-indigo-950/30 rounded-xl border border-indigo-900/40">
                    <span className="text-[10px] text-indigo-300 block font-bold">👨 Hommes (H)</span>
                    <span className="text-base font-black text-indigo-300">
                      {selectedZone.activeMen.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-indigo-400 block font-semibold">
                      {Math.round((selectedZone.activeMen / (selectedZone.activeUsers || 1)) * 100)}%
                    </span>
                  </div>

                  <div className="p-1.5 bg-rose-950/30 rounded-xl border border-rose-900/40">
                    <span className="text-[10px] text-rose-300 block font-bold">👩 Femmes (F)</span>
                    <span className="text-base font-black text-rose-300">
                      {selectedZone.activeWomen.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-rose-400 block font-semibold">
                      {Math.round((selectedZone.activeWomen / (selectedZone.activeUsers || 1)) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Local Zone Ratio Bar */}
                <div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex border border-slate-800">
                    <div
                      style={{
                        width: `${Math.round(
                          (selectedZone.activeMen / (selectedZone.activeUsers || 1)) * 100
                        )}%`,
                      }}
                      className="bg-indigo-500 h-full"
                    />
                    <div
                      style={{
                        width: `${Math.round(
                          (selectedZone.activeWomen / (selectedZone.activeUsers || 1)) * 100
                        )}%`,
                      }}
                      className="bg-rose-500 h-full"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1">
                    <span>👨 {selectedZone.activeMen} connectés</span>
                    <span>👩 {selectedZone.activeWomen} connectées</span>
                  </div>
                </div>
              </div>

              {/* Zone Activity Description */}
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  État du trafic local
                </div>
                {selectedZone.recentActivity}
              </div>

              {/* Members in this Zone */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold">Membres découverts ({selectedZone.name})</span>
                  <span className="text-[10px] text-slate-500">
                    {allZoneMembers.length} profil(s)
                  </span>
                </div>

                {/* Gender selector for discovered members */}
                <div className="flex items-center gap-1 mb-2.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[10px]">
                  <button
                    onClick={() => setGenderFilter('all')}
                    className={`flex-1 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      genderFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setGenderFilter('homme')}
                    className={`flex-1 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      genderFilter === 'homme' ? 'bg-indigo-600 text-white' : 'text-indigo-400 hover:text-white'
                    }`}
                  >
                    👨 H
                  </button>
                  <button
                    onClick={() => setGenderFilter('femme')}
                    className={`flex-1 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      genderFilter === 'femme' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:text-white'
                    }`}
                  >
                    👩 F
                  </button>
                </div>

                {allZoneMembers.filter((u) => genderFilter === 'all' || u.gender === genderFilter).length > 0 ? (
                  <div className="space-y-2">
                    {allZoneMembers
                      .filter((u) => genderFilter === 'all' || u.gender === genderFilter)
                      .slice(0, 5)
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-rose-500/50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={user.avatar}
                              alt={user.pseudo}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-white">{user.pseudo}</span>
                                <span className="text-[10px] text-slate-400">({user.age} ans)</span>
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                                    user.gender === 'femme'
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                  }`}
                                >
                                  {user.gender === 'femme' ? '👩 F' : '👨 H'}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 block truncate max-w-[130px]">
                                {user.occupation}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleQuickChat(user)}
                              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                              title="Discuter"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
                    Plusieurs membres ({selectedZone.activeMen} H · {selectedZone.activeWomen} F) sont connectés dans ce secteur.
                  </div>
                )}
              </div>

              {/* Action Button */}
              {onExploreZoneFilter && (
                <button
                  onClick={() => onExploreZoneFilter(selectedZone.name)}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Filtrer les profils de {selectedZone.name}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-center text-slate-400 text-xs">
              Sélectionnez un point sur la carte pour voir ses statistiques détaillées.
            </div>
          )}

          {/* Search & Category Filter List */}
          <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-rose-500" />
              Classement des Zones & Connectés H / F
            </h3>

            {/* Category tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[10px]">
              <button
                onClick={() => setFilterCategory('all')}
                className={`py-1 rounded-lg font-bold transition-colors ${
                  filterCategory === 'all' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterCategory('dz')}
                className={`py-1 rounded-lg font-bold transition-colors ${
                  filterCategory === 'dz' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇩🇿 Algérie
              </button>
              <button
                onClick={() => setFilterCategory('france')}
                className={`py-1 rounded-lg font-bold transition-colors ${
                  filterCategory === 'france' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇫🇷 DZ69
              </button>
              <button
                onClick={() => setFilterCategory('diaspora')}
                className={`py-1 rounded-lg font-bold transition-colors ${
                  filterCategory === 'diaspora' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                🌍 Monde
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une ville, wilaya..."
                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Hotspots List with H / F Count */}
            <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
              {filteredZones.map((zone, idx) => {
                const isSelected = selectedZone?.id === zone.id;
                const colors = getTrafficColor(zone.trafficLevel);
                const displayCount =
                  genderFilter === 'homme'
                    ? zone.activeMen
                    : genderFilter === 'femme'
                    ? zone.activeWomen
                    : zone.activeUsers;

                return (
                  <div
                    key={zone.id}
                    onClick={() => handleSelectZone(zone)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-600 shadow-md ring-1 ring-rose-500'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-black text-slate-500 w-4 text-center">
                        #{idx + 1}
                      </span>
                      <span className="text-lg">{zone.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{zone.name}</span>
                          {zone.wilayaCode && (
                            <span className="px-1 py-0.2 bg-slate-800 text-slate-400 rounded text-[9px] font-bold">
                              W.{zone.wilayaCode}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="text-indigo-400 font-semibold">👨 {zone.activeMen} H</span>
                          <span>•</span>
                          <span className="text-rose-400 font-semibold">👩 {zone.activeWomen} F</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className={`w-2 h-2 rounded-full ${colors.bg} animate-pulse`} />
                        <span className="text-xs font-extrabold text-white">
                          {displayCount.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400">
                        {genderFilter === 'homme'
                          ? 'hommes'
                          : genderFilter === 'femme'
                          ? 'femmes'
                          : 'connectés'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🚀 PRIMARY FEATURE: CONNECTED MEMBERS HUB FOR SELECTED ZONE (e.g. ALGER) */}
      {/* ========================================================================= */}
      {selectedZone && (
        <div
          ref={membersSectionRef}
          className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-2xl text-white space-y-6"
        >
          {/* Header with City Name & Stats */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3.5">
              <span className="text-4xl sm:text-5xl shadow-xs">{selectedZone.flag}</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {isArabic
                      ? `الأعضاء المتصلون في ${selectedZone.arabicName}`
                      : `Connectés en direct à ${selectedZone.name}`}
                  </h2>
                  {selectedZone.wilayaCode && (
                    <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                      Wilaya {selectedZone.wilayaCode}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {isArabic ? 'متصلون الآن' : 'En ligne maintenant'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {isArabic
                    ? `اختر من بين ${allZoneMembers.length} عضواً مسجلاً ومتاحاً للتحدث والتعارف الفوري بكل احترام`
                    : `Choisissez avec qui converser parmi les membres connectés (${selectedZone.activeMen} H · ${selectedZone.activeWomen} F)`}
                </p>
              </div>
            </div>

            {/* Quick action buttons & category indicators */}
            <div className="flex items-center gap-2 flex-wrap">
              {onExploreZoneFilter && (
                <button
                  type="button"
                  onClick={() => onExploreZoneFilter(selectedZone.name)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700 shadow-xs"
                >
                  <span>{isArabic ? 'عرض كل الحسابات' : 'Filtre Découvrir'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filtering & Search Bar inside Selected City */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs overflow-x-auto w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setCityFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  cityFilter === 'all'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isArabic ? 'الكل' : 'Tous'} ({allZoneMembers.length})
              </button>
              <button
                type="button"
                onClick={() => setCityFilter('femme')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  cityFilter === 'femme'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-rose-400 hover:text-white'
                }`}
              >
                👩 {isArabic ? 'نساء' : 'Femmes'} ({allZoneMembers.filter((u) => u.gender === 'femme').length})
              </button>
              <button
                type="button"
                onClick={() => setCityFilter('homme')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  cityFilter === 'homme'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-indigo-400 hover:text-white'
                }`}
              >
                👨 {isArabic ? 'رجال' : 'Hommes'} ({allZoneMembers.filter((u) => u.gender === 'homme').length})
              </button>
              <button
                type="button"
                onClick={() => setCityFilter('marriage')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  cityFilter === 'marriage'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-400 hover:text-white'
                }`}
              >
                💍 {isArabic ? 'هدف زواج' : 'Mariage'}
              </button>
              <button
                type="button"
                onClick={() => setCityFilter('video')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  cityFilter === 'video'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-purple-400 hover:text-white'
                }`}
              >
                📹 {isArabic ? 'مع فيديو' : 'Vidéo'}
              </button>
            </div>

            {/* Quick Text Filter inside City */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={citySearchText}
                onChange={(e) => setCitySearchText(e.target.value)}
                placeholder={
                  isArabic
                    ? `بحث في ${selectedZone.arabicName}...`
                    : `Rechercher à ${selectedZone.name}...`
                }
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Members Grid */}
          {filteredZoneMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredZoneMembers.map((user) => {
                const isFemale = user.gender === 'femme';
                const hasVideo = Boolean(user.videoPresentation);
                const isJasminSent = jasminFeedbackId === user.id;

                return (
                  <div
                    key={user.id}
                    className="bg-slate-950/90 rounded-2xl p-4 sm:p-5 border border-slate-800 hover:border-rose-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg group relative overflow-hidden"
                  >
                    {/* Top User Info Bar */}
                    <div className="flex items-start gap-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.pseudo}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-rose-500 transition-colors shadow-md"
                        />
                        {/* Pulsing online badge */}
                        <span
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center"
                          title="En ligne"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm sm:text-base font-extrabold text-white truncate">
                            {user.pseudo}
                          </h4>
                          <span className="text-xs text-slate-400 font-semibold">
                            {user.age} ans
                          </span>
                          {(user.verified || user.hasBlueBadge) && (
                            <span
                              className="text-sky-400"
                              title="Profil Vérifié DZ69"
                            >
                              <ShieldCheck className="w-4 h-4 inline" />
                            </span>
                          )}
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                              isFemale
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            }`}
                          >
                            {isFemale ? '👩 Femme' : '👨 Homme'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                          {user.occupation || (isFemale ? 'Professionnelle' : 'Cadre / Entrepreneur')}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 text-slate-300">
                            <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                            {user.city}
                          </span>
                          {user.height && <span>• {user.height} cm</span>}
                          {user.marriageIntentions && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                              💍 Zawaj
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bio & Icebreaker snippet */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                      {user.bio && (
                        <p className="text-slate-300 line-clamp-2 italic text-[11px]">
                          « {user.bio} »
                        </p>
                      )}
                      {user.icebreaker && (
                        <div className="text-[11px] text-rose-300 font-medium flex items-start gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{user.icebreaker}</span>
                        </div>
                      )}
                    </div>

                    {/* Interests tags */}
                    {user.interests && user.interests.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {user.interests.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 text-[10px] font-semibold border border-slate-800"
                          >
                            #{item}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons: Fast Chat, Custom Note, Jasmin, Full Profile */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                      {/* Primary CTA: Start Chat Immediately */}
                      <button
                        type="button"
                        onClick={() => handleQuickChat(user)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-rose-600/30 cursor-pointer"
                        title="Démarrer la discussion instantanée"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{isArabic ? 'تحدث الآن 💬' : 'Discuter 💬'}</span>
                      </button>

                      {/* Compose Custom Opening Message */}
                      <button
                        type="button"
                        onClick={() => handleOpenCustomMessageModal(user)}
                        className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-800"
                        title={isArabic ? 'رسالة مخصصة' : 'Message personnalisé'}
                      >
                        <Send className="w-4 h-4 text-sky-400" />
                      </button>

                      {/* Send Jasmin Super Like */}
                      <button
                        type="button"
                        onClick={() => handleSendJasmin(user)}
                        className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                          isJasminSent
                            ? 'bg-rose-500 text-white border-rose-400 scale-110'
                            : 'bg-slate-900 hover:bg-slate-800 text-rose-400 border-slate-800'
                        }`}
                        title="Offrir une fleur de Jasmin 🌸"
                      >
                        <Heart className="w-4 h-4" />
                      </button>

                      {/* View Video Presentation if available */}
                      {hasVideo && (
                        <button
                          type="button"
                          onClick={() => setVideoModalUser(user)}
                          className="p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 transition-colors cursor-pointer border border-purple-800"
                          title="Regarder la vidéo de présentation"
                        >
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                      )}

                      {/* View Full Profile */}
                      <button
                        type="button"
                        onClick={() => setProfileModalUser(user)}
                        className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-800"
                        title={isArabic ? 'عرض البروفايل' : 'Voir profil complet'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Jasmin Sent Toast Notification */}
                    {isJasminSent && (
                      <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-4 text-center z-10 animate-in fade-in zoom-in-95">
                        <span className="text-4xl animate-bounce">🌸✨</span>
                        <h5 className="text-sm font-black text-rose-300 mt-2">
                          {isArabic ? 'تم إرسال زهرة الياسمين !' : 'Jasmin offert avec succès !'}
                        </h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {user.pseudo} {isArabic ? 'سيتلقى إشعارك فوراً' : 'recevra votre coup de cœur'}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold">
                {isArabic
                  ? `لا توجد نتائج تطابق معايير البحث في ${selectedZone.arabicName}`
                  : `Aucun membre ne correspond à vos filtres à ${selectedZone.name}`}
              </p>
              <button
                type="button"
                onClick={() => {
                  setCityFilter('all');
                  setCitySearchText('');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer mt-2"
              >
                {isArabic ? 'إعادة ضبط الفلاتر' : 'Réinitialiser les filtres'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ✉️ MODAL: CUSTOM MESSAGE COMPOSER */}
      {/* ========================================================================= */}
      {messageModalUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-2xl max-w-lg w-full text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={messageModalUser.avatar}
                  alt={messageModalUser.pseudo}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isArabic
                      ? `إرسال رسالة إلى ${messageModalUser.pseudo}`
                      : `Message direct à ${messageModalUser.pseudo}`}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {messageModalUser.city} • {messageModalUser.age} ans
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMessageModalUser(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                {isArabic ? 'نص رسالتك الأولى :' : 'Votre message d’introduction :'}
              </label>
              <textarea
                rows={4}
                value={customMessageText}
                onChange={(e) => setCustomMessageText(e.target.value)}
                placeholder="Rédigez un message respectueux et chaleureux..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Quick suggestion chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-semibold block">
                {isArabic ? 'عبارات مقترحة :' : 'Suggestions rapides :'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setCustomMessageText(
                      `Salam ${messageModalUser.pseudo} ! J'ai beaucoup aimé ton profil et ta vision du mariage sur DZ69 ✨`
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  💍 Projet Mariage
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCustomMessageText(
                      `Salam ${messageModalUser.pseudo} ! Ravi(e) de voir un membre connecté à ${messageModalUser.city} ! Comment se passe ta journée ?`
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  🇩🇿 Salutation locale
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setMessageModalUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={handleSendCustomMessage}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isArabic ? 'إرسال والبدء' : 'Envoyer et converser'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 👁️ MODAL: FULL PROFILE PREVIEW */}
      {/* ========================================================================= */}
      {profileModalUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl max-w-md w-full text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>{profileModalUser.pseudo}</span>
                <span className="text-xs text-slate-400 font-normal">
                  ({profileModalUser.age} ans)
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setProfileModalUser(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-800">
              <img
                src={profileModalUser.avatar}
                alt={profileModalUser.pseudo}
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover"
              />
              <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/80 text-white text-xs font-bold border border-slate-700">
                📍 {profileModalUser.city}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  À propos
                </span>
                <p className="text-slate-200 leading-relaxed">{profileModalUser.bio}</p>
              </div>

              {profileModalUser.icebreaker && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-rose-400 uppercase font-bold block mb-1">
                    Question brise-glace
                  </span>
                  <p className="text-slate-200">{profileModalUser.icebreaker}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Profession</span>
                  <span className="font-bold text-xs">{profileModalUser.occupation || 'N/A'}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Taille</span>
                  <span className="font-bold text-xs">{profileModalUser.height ? `${profileModalUser.height} cm` : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const u = profileModalUser;
                  setProfileModalUser(null);
                  handleQuickChat(u);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuter en privé</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📹 MODAL: VIDEO PRESENTATION PLAYER */}
      {/* ========================================================================= */}
      {videoModalUser && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl max-w-lg w-full text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">
                  Vidéo de présentation • {videoModalUser.pseudo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalUser(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
              {videoModalUser.videoPresentation ? (
                <video
                  src={videoModalUser.videoPresentation}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-slate-400 text-xs">
                  Aucune vidéo disponible pour ce profil.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const u = videoModalUser;
                  setVideoModalUser(null);
                  handleQuickChat(u);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuter avec {videoModalUser.pseudo}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
