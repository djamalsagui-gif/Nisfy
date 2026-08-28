import React, { useState } from 'react';
import {
  Users,
  Send,
  Heart,
  MessageCircle,
  Sparkles,
  MapPin,
  Mic,
  MicOff,
  Hand,
  Volume2,
  ShieldCheck,
  Headphones,
  Radio,
  Share2,
  Flower2,
  Check,
  Megaphone,
} from 'lucide-react';
import { UserProfile, CommunityMessage } from '../types';
import { THEMATIC_ROOMS, ThematicRoom } from '../data/thematicRooms';
import { Advertisement } from '../data/advertisements';
import { getActiveAdvertisements } from '../utils/adsManager';
import { SponsoredAdCard } from './SponsoredAdCard';
import { SponsoredAdModal } from './SponsoredAdModal';
import { BecomePartnerModal } from './BecomePartnerModal';
import { datingSounds } from '../utils/soundEffects';
import { useLanguage } from '../context/LanguageContext';

interface CommunityLoungeViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  messages: CommunityMessage[];
  onPostMessage: (content: string, roomId?: string) => void;
  onLikeMessage: (messageId: string) => void;
  onStartDirectChat: (user: UserProfile) => void;
}

export function CommunityLoungeView({
  currentUser,
  allUsers,
  messages,
  onPostMessage,
  onLikeMessage,
  onStartDirectChat,
}: CommunityLoungeViewProps) {
  const { t, isArabic } = useLanguage();
  const [selectedRoom, setSelectedRoom] = useState<ThematicRoom>(THEMATIC_ROOMS[0]);
  const [postContent, setPostContent] = useState('');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isOnStage, setIsOnStage] = useState(false);
  const [roomReactions, setRoomReactions] = useState<{ id: number; emoji: string }[]>([]);

  // Ads state
  const [activeAds, setActiveAds] = useState<Advertisement[]>(() => getActiveAdvertisements());
  const [selectedAdForModal, setSelectedAdForModal] = useState<Advertisement | null>(null);
  const [isBecomePartnerOpen, setIsBecomePartnerOpen] = useState(false);
  const [loungeAdIndex, setLoungeAdIndex] = useState(1);
  const [isLoungeAdDismissed, setIsLoungeAdDismissed] = useState(false);

  React.useEffect(() => {
    const handleSync = () => setActiveAds(getActiveAdvertisements());
    window.addEventListener('nisfy_ads_updated', handleSync);
    return () => window.removeEventListener('nisfy_ads_updated', handleSync);
  }, []);

  const currentLoungeAd = activeAds.length > 0 ? activeAds[loungeAdIndex % activeAds.length] : null;

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    datingSounds.playMessageSent();
    onPostMessage(postContent.trim(), selectedRoom.id);
    setPostContent('');
  };

  const toggleHandRaise = () => {
    datingSounds.playTapSound();
    if (isHandRaised) {
      setIsHandRaised(false);
    } else {
      setIsHandRaised(true);
      // Simulate host inviting user on stage after 1.5 seconds
      setTimeout(() => {
        setIsOnStage(true);
        setIsMuted(false);
        setIsHandRaised(false);
        datingSounds.playMatchSound();
      }, 1500);
    }
  };

  const toggleMic = () => {
    datingSounds.playTapSound();
    setIsMuted(!isMuted);
  };

  const sendReaction = (emoji: string) => {
    datingSounds.playTapSound();
    const newReaction = { id: Date.now() + Math.random(), emoji };
    setRoomReactions((prev) => [...prev, newReaction]);
    setTimeout(() => {
      setRoomReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2000);
  };

  const onlineMembers = allUsers.filter((u) => u.isOnline);
  const onlineMen = onlineMembers.filter((u) => u.gender === 'homme');
  const onlineWomen = onlineMembers.filter((u) => u.gender === 'femme');

  // Filter messages for current room or global
  const roomMessages = messages.filter(
    (m) => !m.roomId || m.roomId === selectedRoom.id
  );

  return (
    <div className="space-y-6">
      {/* 6 Thematic Audio Salons Selector */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-orange-100 text-[#FF3823]">
                <Radio className="w-5 h-5 animate-pulse" />
              </span>
              <h2 className="text-lg font-black text-slate-900">
                {isArabic ? 'الصالونات الصوتية والمجالس DZ' : 'Lounge Vocal & 6 Salons Thématiques'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isArabic
                ? 'انضم للصالون المناسب وتبادل النقاش الهادف والمحترم في كنف التقاليد'
                : 'Salons audio permanents animés pour échanger avec respect, bienveillance et authenticité.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {onlineMembers.length} {t.online}
            </span>
          </div>
        </div>

        {/* Horizontal Rooms Grid / Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {THEMATIC_ROOMS.map((room) => {
            const isSelected = selectedRoom.id === room.id;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => {
                  setSelectedRoom(room);
                  setIsOnStage(false);
                  setIsHandRaised(false);
                }}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-orange-50 to-sky-50/40 border-[#FF3823] shadow-md ring-2 ring-[#FF3823]/25'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{room.emoji}</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-white text-slate-700 shadow-2xs">
                      👥 {room.activeListeners}
                    </span>
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 leading-tight">
                    {isArabic ? room.nameAr : room.nameFr}
                  </h3>
                </div>

                <div className="mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FF3823] animate-pulse" />
                  <span className="text-[10px] text-slate-500 font-medium">
                    {room.speakersCount} {isArabic ? 'متحدث' : 'orateurs'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Salon Stage (Live Audio Room Hub) */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Floating Animated Emojis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {roomReactions.map((r) => (
            <div
              key={r.id}
              className="absolute bottom-10 right-10 text-3xl animate-bounce"
              style={{
                right: `${Math.random() * 40 + 10}%`,
                animationDuration: '1.8s',
              }}
            >
              {r.emoji}
            </div>
          ))}
        </div>

        {/* Room Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#FF3823] flex items-center justify-center text-2xl shadow-lg">
              {selectedRoom.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {isArabic ? selectedRoom.nameAr : selectedRoom.nameFr}
                </h3>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-[#FF3823] text-white uppercase">
                  En Direct
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                {isArabic ? selectedRoom.descriptionAr : selectedRoom.descriptionFr}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Reactions Bar */}
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/10">
              {['❤️', '👏', '🇩🇿', '☕', '🌸'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(emoji)}
                  className="p-1.5 hover:scale-125 transition-transform text-sm cursor-pointer"
                  title="Réagir"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stage Speakers Grid */}
        <div className="mb-6">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400 block mb-3">
            🎙️ {isArabic ? 'المتحدثون على المنصة' : 'Sur Scène (Orateurs)'} :
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Host Speaker */}
            <div className="bg-white/5 border border-amber-400/40 rounded-2xl p-3 flex flex-col items-center text-center relative group">
              <div className="relative mb-2">
                <img
                  src={selectedRoom.hostAvatar}
                  alt={selectedRoom.hostName}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 ring-4 ring-amber-400/20"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] shadow-md">
                  HÔTE
                </span>
              </div>
              <span className="text-xs font-black text-white truncate max-w-[110px]">
                {selectedRoom.hostName}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-0.5 font-bold">
                <Volume2 className="w-3 h-3 animate-pulse" />
                <span>{isArabic ? 'يتحدث الآن' : 'En train de parler'}</span>
              </div>
            </div>

            {/* Other Speakers from Seed Users */}
            {allUsers.slice(0, 3).map((u, idx) => (
              <div
                key={u.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center relative"
              >
                <div className="relative mb-2">
                  <img
                    src={u.avatar}
                    alt={u.pseudo}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover border-2 border-slate-400"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-600 text-white shadow-xs">
                    <Mic className="w-2.5 h-2.5" />
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-200 truncate max-w-[110px]">
                  {u.pseudo}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[110px]">
                  {u.city.split('-')[1]?.trim() || u.city}
                </span>
              </div>
            ))}

            {/* Current User if on stage */}
            {isOnStage && (
              <div className="bg-orange-950/40 border border-[#FF3823] rounded-2xl p-3 flex flex-col items-center text-center relative animate-in zoom-in-95">
                <div className="relative mb-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.pseudo}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#FF3823] ring-4 ring-[#FF3823]/30"
                  />
                  <button
                    onClick={toggleMic}
                    className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white shadow-xs ${
                      isMuted ? 'bg-red-600' : 'bg-emerald-600'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-2.5 h-2.5" /> : <Mic className="w-2.5 h-2.5" />}
                  </button>
                </div>
                <span className="text-xs font-black text-orange-200 truncate max-w-[110px]">
                  {currentUser.pseudo} (Moi)
                </span>
                <span className="text-[10px] text-orange-400 font-bold">
                  {isMuted ? 'Micro coupé' : 'Micro actif 🎙️'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stage Interaction Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            {isOnStage ? (
              <>
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`py-2 px-4 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                    isMuted
                      ? 'bg-[#FF3823] hover:bg-[#FF6B35] text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isMuted ? (isArabic ? 'فتح المايك' : 'Activer Micro') : (isArabic ? 'كتم المايك' : 'Couper Micro')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOnStage(false)}
                  className="py-2 px-3 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isArabic ? 'النزول للجمهور' : 'Quitter la scène'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={toggleHandRaise}
                className={`py-2 px-4 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                  isHandRaised
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] hover:opacity-95 text-white shadow-md shadow-orange-500/20'
                }`}
              >
                <Hand className="w-4 h-4" />
                <span>
                  {isHandRaised
                    ? isArabic ? 'تم طلب الكلمة ✋' : 'Main levée (Attente...) ✋'
                    : isArabic ? 'طلب الكلمة (رفع اليد)' : 'Lever la main pour parler ✋'}
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5 text-slate-300" />
              <span>{selectedRoom.activeListeners} {isArabic ? 'مستمع' : 'auditeurs'}</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isArabic ? 'مجلس محترم ومراقب' : 'Modéré en direct'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Post Message In Active Room */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <form onSubmit={handlePost} className="space-y-3">
          <div className="flex items-start gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.pseudo}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="flex-1">
              <textarea
                rows={2}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={
                  isArabic
                    ? `شارك فكرة أو سؤال في صالون "${selectedRoom.nameAr}"...`
                    : `Partagez une réflexion ou une question dans le salon "${selectedRoom.nameFr}"...`
                }
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF3823] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {t.moderatedSpace}
            </span>

            <button
              type="submit"
              disabled={!postContent.trim()}
              className="py-2 px-4 bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] hover:opacity-95 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.publishInLoungeBtn}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Sponsored Partner Spotlight in Lounge */}
      {!isLoungeAdDismissed && currentLoungeAd && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isArabic ? 'عروض حصرية لأعضاء الصالون' : 'Offres Partenaires Mariage'}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLoungeAdIndex((prev) => prev + 1)}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                {isArabic ? 'عرض آخر ↻' : 'Changer ↻'}
              </button>
              <button
                type="button"
                onClick={() => setIsBecomePartnerOpen(true)}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Megaphone className="w-3 h-3" />
                <span>{isArabic ? 'إعلانات المهنيين' : 'Pub Pro'}</span>
              </button>
            </div>
          </div>

          <SponsoredAdCard
            ad={currentLoungeAd}
            layout="compact"
            onOpenDetails={(ad) => setSelectedAdForModal(ad)}
            onDismiss={() => setIsLoungeAdDismissed(true)}
          />
        </div>
      )}

      {/* Messages Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            💬 {isArabic ? 'مشاركات الأعضاء في هذا الصالون' : 'Discussions & Messages dans ce salon'}
          </h4>
          <span className="text-xs text-slate-400 font-bold">
            {roomMessages.length} {isArabic ? 'رسالة' : 'messages'}
          </span>
        </div>

        {roomMessages.map((msg) => {
          const authorUser = allUsers.find((u) => u.id === msg.authorId);
          const isLikedByMe = msg.likedBy.includes(currentUser.id);

          return (
            <div
              key={msg.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={msg.authorAvatar}
                    alt={msg.authorName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm text-slate-900">
                        {msg.authorName}
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold">
                        {msg.authorCity}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                </div>

                {authorUser && authorUser.id !== currentUser.id && (
                  <button
                    type="button"
                    onClick={() => onStartDirectChat(authorUser)}
                    className="py-1.5 px-3 bg-orange-50 hover:bg-orange-100 text-[#FF3823] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{t.writeToThem}</span>
                  </button>
                )}
              </div>

              {/* Message Content */}
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium pl-1">
                {msg.content}
              </p>

              {/* Likes & Reactions */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => onLikeMessage(msg.id)}
                  className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                    isLikedByMe ? 'text-[#FF3823]' : 'text-slate-500 hover:text-[#FF3823]'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isLikedByMe ? 'fill-[#FF3823]' : ''}`}
                  />
                  <span>{msg.likes} {t.likeBtn}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

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
    </div>
  );
}
