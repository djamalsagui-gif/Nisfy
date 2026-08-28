import React, { useState } from 'react';
import {
  Users,
  Radio,
  Sparkles,
  MapPin,
  Globe2,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Mic,
  MicOff,
  Hand,
  Volume2,
  Plus,
  Search,
  CheckCircle2,
  Layers,
  ChevronRight,
  TrendingUp,
  X,
  Send,
  Video,
  Flame,
  ShieldCheck,
  Smile,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { UserProfile, NisfyCommunity, CommunityPostItem, CommunityEventItem, LiveRoom, CommunityCategory } from '../types';
import {
  NISFY_COMMUNITIES,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_COMMUNITY_EVENTS,
  INITIAL_LIVE_ROOMS,
} from '../data/communitiesData';
import { datingSounds } from '../utils/soundEffects';
import { useLanguage } from '../context/LanguageContext';

interface NisfyCommunitiesViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onStartDirectChat: (user: UserProfile) => void;
  onOpenCreateModal?: () => void;
}

export function NisfyCommunitiesView({
  currentUser,
  allUsers,
  onStartDirectChat,
  onOpenCreateModal,
}: NisfyCommunitiesViewProps) {
  const { t, isArabic } = useLanguage();

  // Tab & Filter states
  const [activeCategory, setActiveCategory] = useState<CommunityCategory | 'all' | 'my_groups'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [communities, setCommunities] = useState<NisfyCommunity[]>(NISFY_COMMUNITIES);
  const [posts, setPosts] = useState<CommunityPostItem[]>(INITIAL_COMMUNITY_POSTS);
  const [events, setEvents] = useState<CommunityEventItem[]>(INITIAL_COMMUNITY_EVENTS);
  const [liveRooms, setLiveRooms] = useState<LiveRoom[]>(INITIAL_LIVE_ROOMS);

  // Selected Community Detail Modal / Drawer
  const [selectedCommunity, setSelectedCommunity] = useState<NisfyCommunity | null>(null);

  // Active Live Room State (Interactive Audio/Video Stage)
  const [activeLiveRoom, setActiveLiveRoom] = useState<LiveRoom | null>(null);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isOnStage, setIsOnStage] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liveReactions, setLiveReactions] = useState<{ id: number; emoji: string }[]>([]);
  const [liveChatMessages, setLiveChatMessages] = useState<{ id: string; sender: string; text: string }[]>([
    { id: '1', sender: 'Sofiane', text: 'Salam à tous, bienvenue dans ce live !' },
    { id: '2', sender: 'Amel DZ', text: 'Très beau sujet, baraka Allahu fikoum 🤲' },
  ]);
  const [liveChatInput, setLiveChatInput] = useState('');

  // Quick Post State for Community Feed
  const [newPostText, setNewPostText] = useState('');
  const [activeViewMode, setActiveViewMode] = useState<'explore' | 'feed' | 'live_rooms' | 'events'>('explore');

  // Toggle Join Community
  const handleToggleJoin = (commId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    datingSounds.playTapSound();
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === commId) {
          const nextJoined = !c.joined;
          return {
            ...c,
            joined: nextJoined,
            membersCount: nextJoined ? c.membersCount + 1 : c.membersCount - 1,
          };
        }
        return c;
      })
    );
  };

  // Like Post
  const handleLikePost = (postId: string) => {
    datingSounds.playTapSound();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = p.likedBy?.includes(currentUser.id);
          const nextLikedBy = isLiked
            ? (p.likedBy || []).filter((id) => id !== currentUser.id)
            : [...(p.likedBy || []), currentUser.id];
          return {
            ...p,
            likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1,
            likedBy: nextLikedBy,
          };
        }
        return p;
      })
    );
  };

  // Vote in Poll
  const handleVotePoll = (postId: string, optionIndex: number) => {
    datingSounds.playTapSound();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.pollOptions) {
          const updatedOptions = p.pollOptions.map((opt, idx) =>
            idx === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return { ...p, pollOptions: updatedOptions };
        }
        return p;
      })
    );
  };

  // Publish Quick Community Post
  const handleCreateQuickPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    datingSounds.playMessageSent();
    const targetComm = selectedCommunity || communities[0];
    const newPost: CommunityPostItem = {
      id: `post-${Date.now()}`,
      communityId: targetComm.id,
      communityName: isArabic ? targetComm.nameAr : targetComm.name,
      authorId: currentUser.id,
      authorName: currentUser.pseudo,
      authorAvatar: currentUser.avatar,
      authorCity: currentUser.city,
      authorVerified: currentUser.verified,
      content: newPostText.trim(),
      likesCount: 1,
      commentsCount: 0,
      timestamp: isArabic ? 'الآن' : 'À l’instant',
      likedBy: [currentUser.id],
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  // Live Room Handlers
  const handleJoinLiveRoom = (room: LiveRoom) => {
    datingSounds.playMatchSound();
    setActiveLiveRoom(room);
    setIsHandRaised(false);
    setIsOnStage(false);
    setIsMuted(true);
  };

  const handleRaiseHandInLive = () => {
    datingSounds.playTapSound();
    if (isHandRaised) {
      setIsHandRaised(false);
    } else {
      setIsHandRaised(true);
      // Host accepts after short delay
      setTimeout(() => {
        setIsOnStage(true);
        setIsMuted(false);
        setIsHandRaised(false);
        datingSounds.playMatchSound();
      }, 1400);
    }
  };

  const sendLiveReaction = (emoji: string) => {
    datingSounds.playTapSound();
    const newR = { id: Date.now() + Math.random(), emoji };
    setLiveReactions((prev) => [...prev, newR]);
    setTimeout(() => {
      setLiveReactions((prev) => prev.filter((r) => r.id !== newR.id));
    }, 2000);
  };

  const sendLiveChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveChatInput.trim()) return;
    setLiveChatMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: currentUser.pseudo, text: liveChatInput.trim() },
    ]);
    setLiveChatInput('');
  };

  // Filtered Communities
  const filteredCommunities = communities.filter((c) => {
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'my_groups'
        ? c.joined
        : c.category === activeCategory;

    const matchesSearch =
      searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameAr.includes(searchQuery) ||
      (c.wilayaCode && c.wilayaCode.includes(searchQuery)) ||
      (c.country && c.country.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-28 pt-4 px-3 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* ===== HEADER & SEARCH BAR ===== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#1e1b4b] rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF3823]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#FF3823] flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                  <span>{isArabic ? 'مجتمعات نصفي' : 'Nisfy Communities'}</span>
                  <span className="text-xs bg-orange-500/30 border border-orange-400/40 text-orange-200 px-2.5 py-0.5 rounded-full font-bold">
                    69 Wilayas & Diaspora
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  {isArabic
                    ? 'فضاءات تواصل هادفة، ولايات الجزائر، دياسبورا، غرف صوتية مباشرة ومجموعات اهتمام.'
                    : 'Groupes par wilayas, diaspora, centres d’intérêts, événements et Live Rooms 🎙️.'}
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveViewMode('live_rooms')}
                className="px-3.5 py-2 rounded-xl bg-red-600/30 hover:bg-red-600/40 border border-red-500/40 text-red-200 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer animate-pulse"
              >
                <Radio className="w-3.5 h-3.5 text-red-400" />
                <span>{isArabic ? 'غرف البث الحي (3)' : 'Live Rooms Direct (3)'}</span>
              </button>
            </div>
          </div>

          {/* Unified Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? 'ابحث عن مجتمع (ولاية، مغتربين، زواج، طبخ، رياضة)...'
                  : 'Rechercher une communauté (Wilaya, Diaspora, Mariage, Gastronomie, Thème)...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 dark:bg-slate-900/60 border border-white/15 rounded-2xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3823] backdrop-blur-md transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs / Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
            {[
              { id: 'all', labelFr: '🌟 Toutes', labelAr: '🌟 الكل' },
              { id: 'my_groups', labelFr: '✅ Mes Groupes', labelAr: '✅ مجموعاتي' },
              { id: 'wilaya', labelFr: '📍 69 Wilayas', labelAr: '📍 الولايات (69)' },
              { id: 'diaspora', labelFr: '🌍 Diaspora DZ', labelAr: '🌍 دياسبورا المهجر' },
              { id: 'theme', labelFr: '💍 Thématiques & Mariage', labelAr: '💍 مواضيع وأعراس' },
              { id: 'social', labelFr: '☕ Échanges & Entraide', labelAr: '☕ حوار وتعارف' },
            ].map((tab) => {
              const isSelected = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    datingSounds.playTapSound();
                    setActiveCategory(tab.id as any);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white shadow-md shadow-orange-500/30 ring-2 ring-white/30'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                  }`}
                >
                  {isArabic ? tab.labelAr : tab.labelFr}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== VIEW MODE SELECTOR (DISCOVER / FEED / LIVE ROOMS / EVENTS) ===== */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide no-scrollbar">
          {[
            { id: 'explore', labelFr: 'Découvrir Groupes', labelAr: 'استكشاف المجموعات', icon: Layers },
            { id: 'live_rooms', labelFr: '🎙️ Live Rooms (Direct)', labelAr: '🎙️ غرف البث الصوتي', icon: Radio },
            { id: 'feed', labelFr: '📰 Fil Communautaire', labelAr: '📰 منشورات المجتمعات', icon: Flame },
            { id: 'events', labelFr: '📅 Événements & Lives', labelAr: '📅 فعاليات ومواعيد', icon: Calendar },
          ].map((mode) => {
            const isSel = activeViewMode === mode.id;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  datingSounds.playTapSound();
                  setActiveViewMode(mode.id as any);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
                  isSel
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{isArabic ? mode.labelAr : mode.labelFr}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onOpenCreateModal && onOpenCreateModal()}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white text-xs font-black shadow-md shadow-orange-500/20 hover:opacity-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isArabic ? 'إنشاء منشور / بث' : 'Créer / Lancer'}</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* SECTION A: EXPLORE COMMUNITIES GRID                         */}
      {/* ============================================================ */}
      {activeViewMode === 'explore' && (
        <div className="space-y-6">
          {/* Spotlight Active Live Rooms preview */}
          {liveRooms.filter((r) => r.isLive).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span>{isArabic ? 'غرف البث المباشر النشطة الآن' : 'Live Rooms en direct maintenant'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveViewMode('live_rooms')}
                  className="text-xs font-bold text-[#FF3823] hover:underline"
                >
                  {isArabic ? 'عرض الكل' : 'Tout voir'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {liveRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => handleJoinLiveRoom(room)}
                    className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-[#1e1b4b] text-white shadow-lg border border-red-500/30 hover:border-red-500 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full bg-red-600 text-white flex items-center gap-1">
                        <Radio className="w-2.5 h-2.5" /> LIVE
                      </span>
                      <span className="text-xs text-slate-300 flex items-center gap-1 font-bold">
                        <Users className="w-3 h-3 text-slate-400" /> {room.listenersCount} auditeurs
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors line-clamp-1 mb-1">
                      {isArabic ? room.titleAr : room.title}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-1 mb-3">{room.topic}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <img
                          src={room.host.avatar}
                          alt={room.host.name}
                          className="w-6 h-6 rounded-full object-cover border border-white/40"
                        />
                        <span className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                          {room.host.name}
                        </span>
                      </div>
                      <span className="text-xs font-black text-orange-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        {isArabic ? 'دخول 🎙️' : 'Rejoindre 🎙️'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommunities.map((comm) => (
              <div
                key={comm.id}
                onClick={() => setSelectedCommunity(comm)}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-orange-500/40 transition-all overflow-hidden flex flex-col cursor-pointer group"
              >
                {/* Cover Banner */}
                <div className="relative h-28 w-full overflow-hidden bg-slate-800">
                  <img
                    src={comm.coverImage}
                    alt={comm.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Icon & Badge */}
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 text-xl flex items-center justify-center shadow-md border-2 border-white/30">
                      {comm.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-white font-black text-sm drop-shadow-sm">
                        <span>{isArabic ? comm.nameAr : comm.name}</span>
                        {comm.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-300 font-bold">
                        {comm.membersCount.toLocaleString()} {isArabic ? 'عضو' : 'membres'}
                      </span>
                    </div>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {comm.category === 'wilaya'
                        ? 'Wilaya'
                        : comm.category === 'diaspora'
                        ? 'Diaspora'
                        : comm.category === 'theme'
                        ? 'Thème'
                        : 'Social'}
                    </span>
                  </div>
                </div>

                {/* Content info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {isArabic ? comm.descriptionAr : comm.description}
                  </p>

                  {comm.recentTopic && (
                    <div className="p-2.5 rounded-xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/15 text-[11px] text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-[#FF3823]">
                        {isArabic ? 'موضوع حديث : ' : 'Sujet du moment : '}
                      </span>
                      {comm.recentTopic}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {isArabic ? 'مشاركات نشطة' : 'Échanges actifs'}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleToggleJoin(comm.id, e)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                        comm.joined
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600'
                          : 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white shadow-sm shadow-orange-500/30 hover:opacity-95'
                      }`}
                    >
                      {comm.joined ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{isArabic ? 'مشترك' : 'Membre'}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'انضمام' : 'Rejoindre'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION B: LIVE ROOMS (DIRECT AUDIO / VIDEO)                 */}
      {/* ============================================================ */}
      {activeViewMode === 'live_rooms' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 text-white border border-purple-500/20 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-black flex items-center gap-2">
                  <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                  <span>{isArabic ? 'غرف الحوار المباشر (Nisfy Live Rooms)' : 'Nisfy Live Rooms (Direct)'}</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  {isArabic
                    ? 'جلسات صوتية ومرئية تفاعلية حول الزواج، المغتربين، الطبخ وثقافة الولايات.'
                    : 'Discussions audio et vidéo interactives sur le mariage, la diaspora et la culture.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  datingSounds.playMatchSound();
                  const sampleNewRoom: LiveRoom = {
                    id: `room-${Date.now()}`,
                    title: `🎙️ Salon de ${currentUser.pseudo}`,
                    titleAr: `🎙️ صالون ${currentUser.pseudo}`,
                    topic: 'Échange libre et bienveillant entre membres sérieux.',
                    type: 'audio',
                    host: {
                      id: currentUser.id,
                      name: currentUser.pseudo,
                      avatar: currentUser.avatar,
                      city: currentUser.city,
                      verified: currentUser.verified,
                    },
                    speakers: [
                      {
                        id: currentUser.id,
                        name: currentUser.pseudo,
                        avatar: currentUser.avatar,
                        isHost: true,
                        isMuted: false,
                      },
                    ],
                    listenersCount: 1,
                    category: 'Social',
                    startedAt: 'À l’instant',
                    isLive: true,
                  };
                  setLiveRooms([sampleNewRoom, ...liveRooms]);
                  handleJoinLiveRoom(sampleNewRoom);
                }}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-500 to-[#FF3823] text-white text-xs font-black shadow-lg shadow-red-500/30 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>{isArabic ? 'بدء صالون صوتي خاص بي' : 'Créer ma Live Room 🎙️'}</span>
              </button>
            </div>

            {/* Live Rooms List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleJoinLiveRoom(room)}
                  className="bg-white/10 dark:bg-slate-800/80 rounded-2xl p-5 border border-white/10 hover:border-orange-500 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white flex items-center gap-1 shadow-xs">
                      <Radio className="w-3 h-3 animate-ping" />
                      {room.type === 'video' ? 'LIVE VIDÉO 🎥' : 'LIVE AUDIO 🎙️'}
                    </span>
                    <span className="text-xs text-slate-300 font-bold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-orange-400" />
                      {room.listenersCount} {isArabic ? 'مستمع' : 'participants'}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-orange-400 transition-colors mb-1">
                    {isArabic ? room.titleAr : room.title}
                  </h3>
                  <p className="text-xs text-slate-300 mb-4 line-clamp-2">{room.topic}</p>

                  {/* Speakers Avatars on Stage */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {room.speakers.map((spk) => (
                          <img
                            key={spk.id}
                            src={spk.avatar}
                            alt={spk.name}
                            className="w-8 h-8 rounded-full object-cover border-2 border-slate-900"
                            title={spk.name}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-300 font-medium">
                        {room.speakers.length} {isArabic ? 'متحدثين على المنصة' : 'sur scène'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1 rounded-xl bg-orange-500 text-white text-xs font-black shadow-sm group-hover:scale-105 transition-transform"
                    >
                      {isArabic ? 'انضم الآن' : 'Participer'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION C: COMMUNITY FEED (POSTS, PHOTOS, POLLS)             */}
      {/* ============================================================ */}
      {activeViewMode === 'feed' && (
        <div className="space-y-6">
          {/* Quick Publish Box */}
          <form
            onSubmit={handleCreateQuickPost}
            className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex items-start gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.pseudo}
                className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700"
              />
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder={
                  isArabic
                    ? `شارك فكرة، استفساراً، أو تجربة مع مجتمعات نصفي...`
                    : `Posez une question, partagez une recommandation ou échangez avec les 69 wilayas...`
                }
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF3823] resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium">
                {isArabic ? 'نشر في : مجتمعات نصفي' : 'Publier dans : Nisfy Communities'}
              </span>
              <button
                type="submit"
                disabled={!newPostText.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white text-xs font-black shadow-md shadow-orange-500/20 disabled:opacity-40 cursor-pointer"
              >
                {isArabic ? 'نشر 🇩🇿' : 'Publier 🇩🇿'}
              </button>
            </div>
          </form>

          {/* Posts Stream */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
              >
                {/* Author Info & Community Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {post.authorName}
                        </span>
                        {post.authorVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{post.communityName}</span>
                        <span>•</span>
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-500/10 text-[#FF3823] border border-orange-500/20">
                    {post.authorCity || 'DZ'}
                  </span>
                </div>

                {/* Post Content */}
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Optional Media */}
                {post.mediaUrl && post.mediaType === 'image' && (
                  <div className="rounded-2xl overflow-hidden max-h-96 w-full bg-slate-900">
                    <img src={post.mediaUrl} alt="Post media" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Optional Interactive Poll */}
                {post.mediaType === 'poll' && post.pollOptions && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? '📊 تصويت الأعضاء :' : '📊 Sondage de la communauté :'}
                    </div>
                    {post.pollOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleVotePoll(post.id, idx)}
                        className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#FF3823] text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <span className="group-hover:text-[#FF3823] transition-colors">{opt.text}</span>
                        <span className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-500">
                          {opt.votes} votes
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Post Actions (Like, Comment, Share) */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      post.likedBy?.includes(currentUser.id)
                        ? 'text-red-500 bg-red-500/10'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        post.likedBy?.includes(currentUser.id) ? 'fill-red-500' : ''
                      }`}
                    />
                    <span>{post.likesCount}</span>
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount} {isArabic ? 'تعليق' : 'commentaires'}</span>
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{isArabic ? 'مشاركة' : 'Partager'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION D: COMMUNITY EVENTS & WEBINARS                       */}
      {/* ============================================================ */}
      {activeViewMode === 'events' && (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      event.isLiveNow
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                    }`}
                  >
                    {event.isLiveNow ? '🔴 EN DIRECT MAINTENANT' : 'ÉVÉNEMENT PROGRAMMÉ'}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">{event.communityName}</span>
                </div>

                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {isArabic ? event.titleAr : event.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">{event.description}</p>

                <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold pt-1">
                  <span className="flex items-center gap-1 text-orange-500">
                    <Clock className="w-3.5 h-3.5" /> {event.date} à {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {event.participantsCount} inscrits
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    datingSounds.playMatchSound();
                    if (event.isLiveNow) {
                      setActiveViewMode('live_rooms');
                    }
                  }}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-black shadow-md cursor-pointer transition-all ${
                    event.isLiveNow
                      ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-500/30 animate-pulse'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                  }`}
                >
                  {event.isLiveNow
                    ? isArabic
                      ? 'دخول البث المباشر 🎙️'
                      : 'Rejoindre le Live 🎙️'
                    : isArabic
                    ? 'تسجيل حضور / تذكير 🔔'
                    : 'Participer / Rappel 🔔'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* POPUP MODAL: INTERACTIVE LIVE ROOM STAGE (FULLSCREEN VOLET) */}
      {/* ============================================================ */}
      {activeLiveRoom && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200">
          {/* Live Stage Top Bar */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black flex items-center gap-1.5 shadow-md">
                <Radio className="w-3.5 h-3.5 animate-ping" /> LIVE ROOM
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isArabic ? activeLiveRoom.titleAr : activeLiveRoom.title}
                </h3>
                <span className="text-xs text-slate-300">{activeLiveRoom.communityName || 'Nisfy Live'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveLiveRoom(null)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Live Stage Main: Speakers on Stage */}
          <div className="flex-1 flex flex-col items-center justify-center my-4 relative">
            {/* Floating Reactions overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {liveReactions.map((r) => (
                <div
                  key={r.id}
                  className="absolute bottom-10 right-10 text-4xl animate-bounce"
                  style={{ transform: `translateY(-${Math.random() * 80}px)` }}
                >
                  {r.emoji}
                </div>
              ))}
            </div>

            {/* Speakers Avatars Grid */}
            <div className="text-center space-y-4">
              <div className="text-xs uppercase tracking-widest font-black text-slate-400">
                {isArabic ? 'المتحدثون على المنصة' : 'Sur la scène Nisfy'}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 max-w-lg">
                {activeLiveRoom.speakers.map((spk) => (
                  <div key={spk.id} className="flex flex-col items-center space-y-2">
                    <div className="relative">
                      <img
                        src={spk.avatar}
                        alt={spk.name}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 ${
                          !spk.isMuted
                            ? 'border-emerald-400 shadow-xl shadow-emerald-500/30 animate-pulse'
                            : 'border-slate-700'
                        }`}
                      />
                      {spk.isHost && (
                        <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-[#FF3823] text-white text-[9px] font-black shadow-sm">
                          HOST
                        </span>
                      )}
                      <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-900 text-white border border-white/20">
                        {spk.isMuted ? (
                          <MicOff className="w-3 h-3 text-red-400" />
                        ) : (
                          <Mic className="w-3 h-3 text-emerald-400 animate-pulse" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white">{spk.name}</span>
                  </div>
                ))}

                {/* If user is on stage */}
                {isOnStage && (
                  <div className="flex flex-col items-center space-y-2 animate-in zoom-in-90 duration-200">
                    <div className="relative">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.pseudo}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 ${
                          !isMuted
                            ? 'border-emerald-400 shadow-xl shadow-emerald-500/30 animate-pulse'
                            : 'border-slate-700'
                        }`}
                      />
                      <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-black">
                        VOUS
                      </span>
                      <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-900 text-white border border-white/20">
                        {isMuted ? (
                          <MicOff className="w-3 h-3 text-red-400" />
                        ) : (
                          <Mic className="w-3 h-3 text-emerald-400 animate-pulse" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white">{currentUser.pseudo}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stage Live Chat Overlay */}
            <div className="w-full max-w-md mt-6 bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/10 max-h-36 overflow-y-auto space-y-1.5 text-xs text-left">
              {liveChatMessages.map((msg) => (
                <div key={msg.id} className="text-slate-200">
                  <span className="font-bold text-orange-400">{msg.sender} : </span>
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Stage Bottom Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
            {/* Quick Emoji Reactions */}
            <div className="flex items-center gap-1.5">
              {['❤️', '🌸', '👏', '🤲', '☕', '🔥'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => sendLiveReaction(emoji)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-lg flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Stage Action Buttons */}
            <div className="flex items-center gap-2">
              {isOnStage ? (
                <button
                  type="button"
                  onClick={() => {
                    datingSounds.playTapSound();
                    setIsMuted(!isMuted);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                    isMuted
                      ? 'bg-slate-700 text-white'
                      : 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  }`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isMuted ? 'Activer Micro' : 'Micro Ouvert'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRaiseHandInLive}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                    isHandRaised
                      ? 'bg-amber-500 text-slate-900 animate-pulse'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Hand className="w-4 h-4" />
                  <span>{isHandRaised ? 'Main Levée ✋...' : 'Demander la parole ✋'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveLiveRoom(null)}
                className="px-4 py-2.5 rounded-2xl bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/40 text-xs font-black transition-colors cursor-pointer"
              >
                {isArabic ? 'مغادرة الغرفة' : 'Quitter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
