import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Phone,
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
  onStartCall: (user: UserProfile) => void;
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
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [translatedMsgIds, setTranslatedMsgIds] = useState<Record<string, boolean>>({});
  const [localReactions, setLocalReactions] = useState<Record<string, string[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[80vh] flex flex-col md:flex-row select-none">
      {/* ===== LEFT CONVERSATIONS LIST ===== */}
      <div
        className={`w-full md:w-80 border-r border-slate-200 bg-slate-50/50 flex flex-col ${
          activeChatUserId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
            <span>{t.messagesTitle}</span>
            <span className="text-[11px] font-bold text-slate-400">
              {allUsers.filter((u) => u.id !== currentUser.id).length} {t.contacts}
            </span>
          </h3>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {allUsers
            .filter((u) => u.id !== currentUser.id)
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
                      ? 'bg-white shadow-xs border border-slate-200/80 ring-1 ring-rose-200'
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
            })}
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
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-gradient-to-r from-amber-100 to-rose-100 text-rose-800 font-extrabold border border-rose-200">
                      💍 {isArabic ? 'زواج' : 'Zawaj'}
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-rose-50 text-rose-600 font-bold border border-rose-100">
                    {activeUser.city}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  {isTyping ? (
                    <span className="text-rose-500 animate-pulse">
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
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer"
                title="Inviter au Lounge Vocal"
              >
                <Radio className="w-4 h-4 text-rose-500" />
                <span className="hidden sm:inline">{isArabic ? 'صالون صوتي' : 'Lounge'}</span>
              </button>

              {/* Call */}
              <button
                type="button"
                onClick={() => onStartCall(activeUser)}
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
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-rose-600 font-bold flex items-center gap-1.5 cursor-pointer"
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
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-xl mx-auto shadow-xs">
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
                          ? 'bg-gradient-to-r from-rose-500 to-indigo-600 text-white rounded-br-xs'
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
                                ? 'bg-white text-rose-600 hover:bg-rose-50'
                                : 'bg-rose-500 text-white hover:bg-rose-600'
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
                                    isMe ? 'bg-white/80' : 'bg-rose-400'
                                  } ${playingVoiceId === msg.id ? 'animate-pulse' : ''}`}
                                />
                              ))}
                            </div>
                            <span className={`text-[10px] font-bold mt-0.5 block ${isMe ? 'text-rose-100' : 'text-slate-500'}`}>
                              {playingVoiceId === msg.id ? 'Lecture en cours...' : 'Note vocale (0:14)'}
                            </span>
                          </div>
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
                          isMe ? 'text-rose-100' : 'text-slate-400'
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
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold text-[11px] whitespace-nowrap border border-slate-200 transition-colors cursor-pointer shrink-0"
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
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-rose-50 flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
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
                  className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-black shadow-sm hover:bg-rose-700 cursor-pointer flex items-center gap-1"
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
                onClick={startVoiceRecording}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Enregistrer note vocale"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                placeholder={`${t.typeMessagePlaceholder} ${activeUser.pseudo}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none transition-all"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 disabled:opacity-50 text-white rounded-2xl shadow-xs transition-all flex items-center justify-center cursor-pointer"
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
    </div>
  );
}
