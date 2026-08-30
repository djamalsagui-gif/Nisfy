import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Phone,
  Video,
  Smile,
  Mic,
  MoreVertical,
  Check,
  CheckCheck,
  Sparkles,
  Heart,
  ChevronLeft,
  MapPin,
  Clock,
  ShieldAlert,
  Volume2,
  Languages,
  Radio,
  Flower2,
  ShieldCheck,
  Pause,
  Play,
  Share2,
  Image as ImageIcon,
  Gift,
  X,
} from 'lucide-react';
import { UserProfile, ChatMessage, ChatMessageReaction } from '../types';
import { AUTOMATED_RESPONSES } from '../data/initialData';
import { datingSounds } from '../utils/soundEffects';
import { useLanguage } from '../context/LanguageContext';

interface PrivateChatViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  chats: Record<string, ChatMessage[]>;
  onSendMessage: (receiverId: string, content: string, type?: 'text' | 'image' | 'voice' | 'lounge_invite' | 'jasmin') => void;
  activeChatUserId: string | null;
  onSelectChatUser: (userId: string) => void;
  onStartCall: (user: UserProfile, isVideo?: boolean) => void;
  onReportUser?: (user: UserProfile) => void;
  onBlockUser?: (user: UserProfile) => void;
  onReactToMessage?: (messageId: string, emoji: '❤️' | '😂' | '🤲' | '☕' | '🌹') => void;
}

const QUICK_EMOJIS = ['❤️', '💍', '🌸', '✨', '😊', '☕', '🇩🇿', '🤲', '😂', '🌹'];

export function PrivateChatView({
  currentUser,
  allUsers,
  chats,
  onSendMessage,
  activeChatUserId,
  onSelectChatUser,
  onStartCall,
  onReportUser,
  onBlockUser,
}: PrivateChatViewProps) {
  const { t, isArabic } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [translatedMsgIds, setTranslatedMsgIds] = useState<Record<string, boolean>>({});
  const [localReactions, setLocalReactions] = useState<Record<string, string[]>>({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [showJasminCelebration, setShowJasminCelebration] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordTimerRef = useRef<any>(null);

  // Available conversation partners
  const conversationUserIds = Object.keys(chats);

  // Active user
  const activeUser =
    allUsers.find((u) => u.id === activeChatUserId) ||
    allUsers.find((u) => u.id === conversationUserIds[0]) ||
    allUsers.find((u) => u.id !== currentUser.id) ||
    null;

  // Active message history
  const currentMessages = activeUser ? chats[activeUser.id] || [] : [];
  const messageCount = currentMessages.length;
  const isUnlocked = currentUser.isPremium || messageCount >= 10;
  const blurClass = isUnlocked ? '' : messageCount >= 5 ? 'blur-[3px]' : 'blur-[8px]';

  // Scroll to bottom on messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isTyping]);

  // Voice recording timer
  useEffect(() => {
    if (isRecordingVoice) {
      setRecordDuration(0);
      recordTimerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, [isRecordingVoice]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeUser) return;

    const content = inputText.trim();
    setInputText('');
    datingSounds.playMessageSent();
    onSendMessage(activeUser.id, content, 'text');

    // Simulate smart typing & response
    setIsTyping(true);
    const typingTimeout = setTimeout(() => {
      setIsTyping(false);
      const possibleReplies =
        AUTOMATED_RESPONSES[activeUser.id] || AUTOMATED_RESPONSES.default;
      const chosenReply =
        possibleReplies[Math.floor(Math.random() * possibleReplies.length)];

      datingSounds.playMessageReceived();
      onSendMessage(currentUser.id, chosenReply, 'text');
    }, 1800 + Math.random() * 1500);

    return () => clearTimeout(typingTimeout);
  };

  const handleSendQuickStarter = (starterText: string) => {
    if (!activeUser) return;
    datingSounds.playMessageSent();
    onSendMessage(activeUser.id, starterText, 'text');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      datingSounds.playMessageReceived();
      onSendMessage(
        currentUser.id,
        isArabic
          ? `سلام ! شكراً على رسالتك الطيبة، يسعدني كثيراً الحديث معك 😊🇩🇿`
          : `Salam ! Merci pour ton message respectueux, c’est un plaisir d’échanger avec toi 😊🇩🇿`,
        'text'
      );
    }, 1900);
  };

  const handleSendJasminGift = () => {
    if (!activeUser) return;
    datingSounds.playJasminSendSound();
    setShowJasminCelebration(true);
    setTimeout(() => setShowJasminCelebration(false), 2400);

    onSendMessage(
      activeUser.id,
      isArabic
        ? '🌸 أهديك باقة ورد الياسمين الجزائرية كتعبير عن التقدير والاحترام 🇩🇿'
        : '🌸 Je t’envoie un bouquet de Jasmin d’Or algérien en gage de considération et de respect sincère 🇩🇿',
      'jasmin'
    );

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      datingSounds.playMessageReceived();
      onSendMessage(
        currentUser.id,
        isArabic
          ? '« بارك الله فيك على هذه اللفتة الطيبة والجميلة جداً ! 🌸🤲 »'
          : '« Merci infiniment pour cette délicate attention et ce Jasmin d’honneur ! 🌸🤲 »',
        'text'
      );
    }, 2000);
  };

  const handleSendImage = (imageUrl: string) => {
    if (!activeUser) return;
    datingSounds.playMessageSent();
    setShowImageModal(false);
    onSendMessage(activeUser.id, imageUrl, 'image');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      datingSounds.playMessageReceived();
      onSendMessage(
        currentUser.id,
        isArabic
          ? '« ما شاء الله، صورة جميلة جداً ! 🇩🇿✨ »'
          : '« MachaAllah, magnifique photo ! 🇩🇿✨ »',
        'text'
      );
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        handleSendImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInviteToVoiceLounge = () => {
    if (!activeUser) return;
    datingSounds.playMessageSent();
    onSendMessage(
      activeUser.id,
      isArabic
        ? `☕ هل ترغب في الانضمام معي إلى الصالون الصوتي NISFY لتبادل الحديث ؟`
        : `☕ Souhaiterais-tu me rejoindre dans un salon vocal privé NISFY pour échanger de vive voix ?`,
      'lounge_invite'
    );
  };

  const startVoiceRecording = () => {
    datingSounds.playTapSound();
    setIsRecordingVoice(true);
  };

  const finishVoiceRecording = () => {
    if (!activeUser) return;
    setIsRecordingVoice(false);
    datingSounds.playMessageSent();
    onSendMessage(
      activeUser.id,
      `🎙️ Message vocal (${recordDuration > 0 ? `0:${recordDuration < 10 ? '0' : ''}${recordDuration}` : '0:08'})`,
      'voice'
    );

    // Simulate audio response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      datingSounds.playMessageReceived();
      onSendMessage(
        currentUser.id,
        isArabic
          ? '« ماشاء الله، صوت طيب ومحترم جداً ! يسعدني تواصلنا 🌸 »'
          : '« MachaAllah, message vocal très agréable et respectueux ! 🌸 »',
        'text'
      );
    }, 2200);
  };

  const cancelVoiceRecording = () => {
    setIsRecordingVoice(false);
    setRecordDuration(0);
  };

  const toggleTranslation = (msgId: string) => {
    datingSounds.playTapSound();
    setTranslatedMsgIds((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleReaction = (msgId: string, emoji: string) => {
    datingSounds.playTapSound();
    setLocalReactions((prev) => {
      const existing = prev[msgId] || [];
      if (existing.includes(emoji)) {
        return { ...prev, [msgId]: existing.filter((e) => e !== emoji) };
      }
      return { ...prev, [msgId]: [...existing, emoji] };
    });
  };

  // DZ Cultural Starters
  const dzStarters = isArabic
    ? [
        `سلام ${activeUser?.pseudo.split(' ')[0]} ! كيف أحوالك في ${activeUser?.city.split('-')[1]?.trim() || 'مدينتك'} ؟ 🇩🇿`,
        `واش رأيك في فنجان قهوة أو شاي لنتعرف باحترام ؟ ☕`,
        `واش هي القيم اللي تهمك أكثر لبناء أسرة سعيدة ؟ 💍`,
      ]
    : [
        `Salam ${activeUser?.pseudo.split(' ')[0]} ! Comment se passe ta journée à ${activeUser?.city.split('-')[1]?.trim() || 'ta wilaya'} ? 🇩🇿`,
        `Plutôt thé à la menthe ou grand café pour papoter ? ☕`,
        `Quelles sont pour toi les clés d'un mariage serein ? 💍`,
      ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[80vh] flex flex-col md:flex-row select-none relative">
      {/* Jasmin Send Celebration Popup */}
      {showJasminCelebration && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-amber-300 rounded-3xl p-6 text-center shadow-2xl space-y-2 animate-in zoom-in-75">
            <div className="text-5xl animate-bounce">🌸💍✨</div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              {isArabic ? 'تم إرسال ياسمين الشرف بنجاح !' : 'Jasmin d’Or envoyé avec succès !'}
            </h4>
            <p className="text-xs text-amber-600 font-bold">
              {isArabic ? 'هدية احترام وتقدير جزائري 🇩🇿' : 'Symbole de respect et de projet sérieux 🇩🇿'}
            </p>
          </div>
        </div>
      )}

      {/* ===== LEFT CONVERSATIONS LIST ===== */}
      <div
        className={`w-full md:w-80 border-r border-slate-200 bg-slate-50/50 flex flex-col ${
          activeChatUserId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-200 bg-white space-y-2">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
            <span>{t.messagesTitle}</span>
            <span className="text-[11px] font-bold text-slate-400">
              {allUsers.filter((u) => u.id !== currentUser.id).length} {t.contacts}
            </span>
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder={isArabic ? 'بحث في المحادثات...' : 'Rechercher un contact...'}
              value={contactSearchQuery}
              onChange={(e) => setContactSearchQuery(e.target.value)}
              className="w-full pl-3 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {(() => {
            const seen = new Set<string>();
            return allUsers
              .filter((u) => {
                if (!u || !u.id || seen.has(u.id) || u.id === currentUser.id) return false;
                seen.add(u.id);
                return true;
              })
              .filter((u) => {
                if (!contactSearchQuery.trim()) return true;
                const q = contactSearchQuery.toLowerCase().trim();
                return (
                  (u.pseudo && u.pseudo.toLowerCase().includes(q)) ||
                  (u.city && u.city.toLowerCase().includes(q)) ||
                  (u.bio && u.bio.toLowerCase().includes(q))
                );
              })
              .map((user) => {
              const userChat = chats[user.id] || [];
              const lastMsg = userChat[userChat.length - 1];
              const isSelected = activeUser?.id === user.id;

              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => onSelectChatUser(user.id)}
                  className={`w-full p-3 rounded-2xl transition-all flex items-center gap-3 text-left cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-xs border border-orange-200 ring-2 ring-[#FF3823]/30'
                      : 'hover:bg-slate-100/80 border border-transparent'
                  }`}
                >
                  <div className="relative shrink-0">
                    {(() => {
                      const contactMsgCount = (chats[user.id] || []).length;
                      const contactIsUnlocked = currentUser.isPremium || contactMsgCount >= 10;
                      const contactBlur = contactIsUnlocked ? '' : contactMsgCount >= 5 ? 'blur-[3px]' : 'blur-[8px]';
                      return (
                        <img
                          src={user.avatar}
                          alt={user.pseudo}
                          referrerPolicy="no-referrer"
                          className={`w-12 h-12 rounded-full object-cover border border-slate-200 transition-all ${contactBlur}`}
                        />
                      );
                    })()}
                    {user.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {user.pseudo}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {lastMsg ? lastMsg.timestamp : user.city.split('-')[1]?.trim() || user.city}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                      {lastMsg ? lastMsg.content : user.bio}
                    </p>
                  </div>
                </button>
              );
            });
          })()}
        </div>
      </div>

      {/* ===== RIGHT ACTIVE CHAT ROOM ===== */}
      {activeUser ? (
        <div
          className={`flex-1 flex flex-col bg-white ${
            !activeChatUserId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Active Chat Header */}
          <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => onSelectChatUser('')}
                className="p-1.5 text-slate-500 hover:text-slate-900 md:hidden rounded-xl bg-slate-100 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="relative shrink-0">
                <img
                  src={activeUser.avatar}
                  alt={activeUser.pseudo}
                  referrerPolicy="no-referrer"
                  className={`w-10 h-10 rounded-full object-cover border border-slate-200 transition-all duration-1000 ${blurClass}`}
                />
                {activeUser.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-white" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-black text-sm text-slate-900 truncate">
                    {activeUser.pseudo}, {activeUser.age}
                  </h3>
                  {activeUser.marriageVerified && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-gradient-to-r from-amber-100 to-orange-100 text-orange-900 font-extrabold border border-orange-200">
                      💍 {isArabic ? 'زواج' : 'Zawaj'}
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-orange-50 text-[#FF3823] font-bold border border-orange-200/60">
                    {activeUser.city}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  {isTyping ? (
                    <span className="text-[#FF3823] animate-pulse">
                      {t.typingStatus}
                    </span>
                  ) : activeUser.isOnline ? (
                    t.online
                  ) : (
                    activeUser.lastActive
                  )}
                </span>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-1.5 relative">
              {/* Invite to Voice Lounge */}
              <button
                type="button"
                onClick={handleInviteToVoiceLounge}
                className="p-2 text-[#FF3823] hover:bg-orange-50 rounded-xl transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer"
                title="Inviter au Lounge Vocal"
              >
                <Radio className="w-4 h-4 text-[#FF3823]" />
                <span className="hidden sm:inline">{isArabic ? 'صالون صوتي' : 'Lounge'}</span>
              </button>

              {/* Video Call */}
              <button
                type="button"
                onClick={() => onStartCall(activeUser, true)}
                className="p-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-2xl border border-sky-200 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                title="Appel Vidéo"
              >
                <Video className="w-4 h-4 text-sky-600" />
                <span className="hidden sm:inline">{isArabic ? 'فيديو' : 'Vidéo'}</span>
              </button>

              {/* Audio Call */}
              <button
                type="button"
                onClick={() => onStartCall(activeUser, false)}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl border border-emerald-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title={t.callBtn}
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">{t.callBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Options"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>

              {showOptionsMenu && (
                <div className="absolute right-0 top-12 w-40 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 text-xs z-30 animate-in fade-in">
                  {onReportUser && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowOptionsMenu(false);
                        onReportUser(activeUser);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-amber-600 font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>⚠️</span>
                      <span>{t.reportUserBtn}</span>
                    </button>
                  )}
                  {onBlockUser && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowOptionsMenu(false);
                        onBlockUser(activeUser);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-[#FF3823] font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>🚫</span>
                      <span>{t.blockUserBtn}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Charte de Courtoisie Reminder */}
          <div className="bg-amber-50/70 border-b border-amber-200/60 px-4 py-1.5 flex items-center justify-between text-[11px] text-amber-900 font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              {isArabic
                ? 'ميثاق الاحترام الجزائري : تواصل جاد، مؤدب وصادق لغاية الزواج'
                : 'Charte de courtoisie DZ : Échanges bienveillants et respectueux pour projet sérieux.'}
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
            {currentMessages.length === 0 && (
              <div className="text-center py-8 space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-[#FF3823] flex items-center justify-center text-xl mx-auto shadow-xs">
                  🌸
                </div>
                <h4 className="font-extrabold text-sm text-slate-800">
                  {t.startConversationWith} {activeUser.pseudo}
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {t.searchConversation}
                </p>
              </div>
            )}

            {currentMessages.map((msg) => {
              const isMe = msg.senderId !== activeUser.id;
              const isTranslated = !!translatedMsgIds[msg.id];
              const reactions = localReactions[msg.id] || [];

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group/msg relative`}
                >
                  <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && (
                      <img
                        src={activeUser.avatar}
                        alt={activeUser.pseudo}
                        referrerPolicy="no-referrer"
                        className={`w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 mb-1 transition-all duration-1000 ${blurClass}`}
                      />
                    )}

                    <div
                      className={`max-w-[80%] sm:max-w-md rounded-2xl p-3 text-xs sm:text-sm shadow-xs relative ${
                        isMe
                          ? 'bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] text-white rounded-br-xs shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {msg.type === 'voice' ? (
                        <div className="flex items-center gap-3 py-1">
                          <button
                            type="button"
                            onClick={() => {
                              setPlayingVoiceId(playingVoiceId === msg.id ? null : msg.id);
                              datingSounds.playTapSound();
                            }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                              isMe
                                ? 'bg-white text-[#FF3823] hover:bg-orange-50'
                                : 'bg-[#FF3823] text-white hover:bg-[#FF6B35]'
                            }`}
                          >
                            {playingVoiceId === msg.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4 ml-0.5" />
                            )}
                          </button>
                          <div className="flex-1 min-w-[140px]">
                            <div className="flex items-center gap-1 h-5">
                              {[40, 75, 30, 90, 60, 100, 45, 80, 50, 70, 35, 85].map((h, i) => (
                                <span
                                  key={i}
                                  style={{ height: `${playingVoiceId === msg.id ? Math.max(20, (h * (i % 3 + 1)) % 100) : h}%` }}
                                  className={`w-1 rounded-full transition-all duration-300 ${
                                    isMe ? 'bg-white/80' : 'bg-[#FF6B35]'
                                  } ${playingVoiceId === msg.id ? 'animate-pulse' : ''}`}
                                />
                              ))}
                            </div>
                            <span className={`text-[10px] font-bold mt-0.5 block ${isMe ? 'text-orange-100' : 'text-slate-500'}`}>
                              {playingVoiceId === msg.id ? 'Lecture en cours...' : 'Note vocale (0:14)'}
                            </span>
                          </div>
                        </div>
                      ) : msg.type === 'image' ? (
                        <div className="space-y-1.5 py-1">
                          <img
                            src={msg.content}
                            alt="Partage photo"
                            className="max-h-60 rounded-xl object-cover w-full cursor-pointer hover:opacity-95 transition-opacity"
                            onClick={() => window.open(msg.content, '_blank')}
                          />
                          <span className={`text-[10px] block font-bold ${isMe ? 'text-orange-100' : 'text-slate-500'}`}>
                            {isArabic ? 'صورة مرفقة' : 'Photo partagée'}
                          </span>
                        </div>
                      ) : msg.type === 'jasmin' ? (
                        <div className="space-y-2 py-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl animate-bounce">🌸</span>
                            <span className="font-black text-xs text-amber-200">
                              {isArabic ? 'هدية ياسمين الشرف 🇩🇿' : 'Jasmin d’Or Offert 🇩🇿'}
                            </span>
                          </div>
                          <p className="leading-relaxed font-bold">{msg.content}</p>
                        </div>
                      ) : msg.type === 'lounge_invite' ? (
                        <div className="space-y-1.5">
                          <p className="leading-relaxed font-bold">{msg.content}</p>
                          <div className="p-2 rounded-xl bg-white/20 text-[11px] font-black flex items-center gap-2">
                            <Radio className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                            <span>Salon Vocal Thématique DZ</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="leading-relaxed whitespace-pre-wrap font-medium">
                            {isTranslated
                              ? isArabic
                                ? `[ترجمة بالعربية] : ${msg.content}`
                                : `[Traduction FR] : ${msg.content}`
                              : msg.content}
                          </p>
                        </div>
                      )}

                      {/* Footer Info & Translate Button */}
                      <div
                        className={`mt-1 flex items-center justify-between gap-2 text-[10px] ${
                          isMe ? 'text-orange-100' : 'text-slate-400'
                        }`}
                      >
                        <button
                          onClick={() => toggleTranslation(msg.id)}
                          className="hover:underline flex items-center gap-0.5 opacity-80 hover:opacity-100"
                        >
                          <Languages className="w-3 h-3" />
                          <span>{isTranslated ? 'Original' : 'Traduire'}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <span>{msg.timestamp}</span>
                          {isMe && <CheckCheck className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>

                    {/* Quick Reactions Palette */}
                    <div className="opacity-0 group-hover/msg:opacity-100 transition-opacity flex items-center gap-1 bg-white p-1 rounded-xl shadow-xs border border-slate-200">
                      {['❤️', '😂', '🤲', '☕', '🌹'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(msg.id, emoji)}
                          className="hover:scale-125 transition-transform text-xs p-0.5 cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reaction Badges below message */}
                  {reactions.length > 0 && (
                    <div className={`flex items-center gap-1 mt-1 ${isMe ? 'mr-2' : 'ml-9'}`}>
                      {reactions.map((r, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 bg-white rounded-full border border-slate-200 shadow-2xs text-[10px]"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <img
                  src={activeUser.avatar}
                  alt={activeUser.pseudo}
                  referrerPolicy="no-referrer"
                  className={`w-6 h-6 rounded-full object-cover border border-slate-200 transition-all duration-1000 ${blurClass}`}
                />
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 3 Quick DZ Culture Starters Chips */}
          <div className="px-3 sm:px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-black uppercase text-slate-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              DZ Culture :
            </span>
            {dzStarters.map((starter, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuickStarter(starter)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-[#FF3823] text-slate-700 font-bold text-[11px] whitespace-nowrap border border-slate-200 transition-colors cursor-pointer shrink-0"
              >
                {starter}
              </button>
            ))}
          </div>

          {/* Quick Emoji Bar */}
          {showEmojiBar && (
            <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setInputText((prev) => prev + emoji)}
                  className="text-lg hover:scale-125 transition-transform p-1 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Voice Recording Active Bar */}
          {isRecordingVoice ? (
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-orange-50 flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-[#FF3823] font-bold text-xs">
                <span className="w-3 h-3 rounded-full bg-[#FF3823] animate-ping" />
                <span>Enregistrement audio en cours... (0:{recordDuration < 10 ? '0' : ''}{recordDuration})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cancelVoiceRecording}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={finishVoiceRecording}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white text-xs font-black shadow-sm hover:opacity-90 cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer</span>
                </button>
              </div>
            </div>
          ) : (
            /* Standard Message Input Bar */
            <form
              onSubmit={handleSend}
              className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setShowEmojiBar(!showEmojiBar)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Emojis"
              >
                <Smile className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleSendJasminGift}
                className="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                title="Offrir un Jasmin"
              >
                <Flower2 className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setShowImageModal(true)}
                className="p-2 text-slate-400 hover:text-[#FF3823] hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
                title="Partager une photo"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={startVoiceRecording}
                className="p-2 text-slate-400 hover:text-[#FF3823] hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
                title="Enregistrer note vocale"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                placeholder={`${t.typeMessagePlaceholder} ${activeUser.pseudo}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF3823] focus:outline-none transition-all"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] hover:opacity-95 disabled:opacity-50 text-white rounded-2xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
          {t.selectContact}
        </div>
      )}
      {/* Photo Picker Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 w-full max-w-sm sm:max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#FF3823]" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  {isArabic ? 'مشاركة صورة' : 'Partager une photo'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Upload from device */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 border-2 border-dashed border-orange-300 hover:border-[#FF3823] bg-orange-50/50 hover:bg-orange-50 rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-[#FF3823] transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{isArabic ? 'اختر صورة من جهازك' : 'Téléverser depuis votre appareil'}</span>
            </button>

            {/* Quick cultural presets */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 mb-2">
                {isArabic ? 'أو اختر صورة رمزية سريعة :' : 'Ou choisir un visuel culturel :'}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Thé DZ', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80' },
                  { label: 'Jasmin', url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=500&auto=format&fit=crop&q=80' },
                  { label: 'Paysage DZ', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleSendImage(preset.url)}
                    className="group relative rounded-xl overflow-hidden aspect-video border border-slate-200 hover:ring-2 hover:ring-[#FF3823] transition-all"
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[10px] font-bold text-white text-center py-0.5">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
