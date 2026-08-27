import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  ActiveTab,
  ChatMessage,
  CommunityMessage,
  MatchRelation,
  LikeAction,
  LiveSession,
  LiveComment,
  ProfileVideo,
} from './types';
import {
  getRegisteredUsers,
  saveRegisteredUsers,
  getCurrentUser,
  setCurrentUser,
  getPrivateChats,
  savePrivateChats,
  getCommunityMessages,
  saveCommunityMessages,
  getLikesSent,
  saveLikesSent,
  getMatchesList,
  saveMatchesList,
} from './utils/storage';
import { INITIAL_LIVES, INITIAL_LIVE_COMMENTS } from './data/initialData';
import { datingSounds } from './utils/soundEffects';

import { Navbar } from './components/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { DiscoverView } from './components/DiscoverView';
import { MatchesView } from './components/MatchesView';
import { PrivateChatView } from './components/PrivateChatView';
import { CommunityLoungeView } from './components/CommunityLoungeView';
import { LiveTrafficMapView } from './components/LiveTrafficMapView';
import { LiveStreamView } from './components/LiveStreamView';
import { MyProfileView } from './components/MyProfileView';
import { ChefNadjetView } from './components/chef-nadjet/ChefNadjetView';
import { AdminAdvertisersView } from './components/admin/AdminAdvertisersView';
import { SocialFeed } from './components/feed/SocialFeed';
import { CustomsGuideView } from './components/CustomsGuideView';
import { WeddingMarketplaceView } from './components/WeddingMarketplaceView';
import { YouthShopView } from './components/YouthShopView';
import { CallModal } from './components/CallModal';
import { FooterProverbs } from './components/FooterProverbs';
import { PremiumModal } from './components/PremiumModal';
import { VerificationModal } from './components/auth/VerificationModal';
import { ContactModal } from './components/ContactModal';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t, isArabic } = useLanguage();

  // 1. Core State
  const [currentUser, setLoggedInUser] = useState<UserProfile | null>(() =>
    getCurrentUser()
  );

  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() =>
    getRegisteredUsers()
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>('discover');
  const [isMuted, setIsMuted] = useState(false);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nisfy_theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('nisfy_theme', isDarkMode ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    datingSounds.playTapSound();
  };

  // Modals state
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bookmarks State
  const [bookmarkedUserIds, setBookmarkedUserIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nisfy_bookmarked_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Map Visibility State (Hidden by default, user-activatable)
  const [isMapEnabled, setIsMapEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('dz_map_enabled');
      return saved === 'true'; // Defaults to false (hidden)
    } catch {
      return false;
    }
  });

  // 2. Data State
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(() =>
    getPrivateChats()
  );
  const [communityMessages, setCommunityMessages] = useState<CommunityMessage[]>(() =>
    getCommunityMessages()
  );
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>(() => INITIAL_LIVES);
  const [liveComments, setLiveComments] = useState<Record<string, LiveComment[]>>(() => INITIAL_LIVE_COMMENTS);
  const [matches, setMatches] = useState<MatchRelation[]>([]);
  const [likesSent, setLikesSent] = useState<LikeAction[]>([]);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);

  // 3. Modals state
  const [callingUser, setCallingUser] = useState<UserProfile | null>(null);
  const [newMatchAlert, setNewMatchAlert] = useState<UserProfile | null>(null);

  // Load user-specific matches and likes
  useEffect(() => {
    if (currentUser) {
      setMatches(getMatchesList(currentUser.id));
      setLikesSent(getLikesSent(currentUser.id));
    }
  }, [currentUser]);

  // Handle Login / Registration
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setLoggedInUser(user);
    setActiveTab('discover');
  };

  const handleToggleBookmark = (targetUser: UserProfile) => {
    datingSounds.playTapSound();
    setBookmarkedUserIds((prev) => {
      const isAlready = prev.includes(targetUser.id);
      const next = isAlready ? prev.filter((id) => id !== targetUser.id) : [...prev, targetUser.id];
      try {
        localStorage.setItem('nisfy_bookmarked_ids', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleToggleMap = (enabled?: boolean) => {
    const next = enabled !== undefined ? enabled : !isMapEnabled;
    setIsMapEnabled(next);
    try {
      localStorage.setItem('dz_map_enabled', String(next));
    } catch {
      // ignore
    }
    if (next) {
      setActiveTab('map');
      datingSounds.playTapSound();
    } else if (activeTab === 'map') {
      setActiveTab('discover');
    }
  };

  const handleRegisterUser = (newUser: UserProfile) => {
    const updated = [newUser, ...registeredUsers];
    setRegisteredUsers(updated);
    saveRegisteredUsers(updated);
  };

  const handleLogout = () => {
    datingSounds.playLikeSound();
    setCurrentUser(null);
    setLoggedInUser(null);
  };

  // Toggle audio
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    datingSounds.setMuted(nextMuted);
  };

  // Live stream handlers
  const handleStartLive = (newSession: LiveSession) => {
    setLiveSessions((prev) => [newSession, ...prev]);
    datingSounds.playMatchSound();
  };

  const handleEndLive = (sessionId: string) => {
    setLiveSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, isLive: false } : s))
    );
  };

  const handleSendLiveComment = (liveId: string, comment: LiveComment) => {
    setLiveComments((prev) => {
      const existing = prev[liveId] || [];
      return {
        ...prev,
        [liveId]: [...existing, comment],
      };
    });
  };

  const handleSendLiveLike = (liveId: string) => {
    setLiveSessions((prev) =>
      prev.map((s) => (s.id === liveId ? { ...s, likesCount: s.likesCount + 1 } : s))
    );
  };

  // Like user (Swipe / Action button)
  const handleLikeUser = (
    targetUser: UserProfile,
    isSuperLike = false,
    isJasmin = false
  ) => {
    if (!currentUser) return;

    const actionType: 'like' | 'superlike' | 'jasmin' = isJasmin
      ? 'jasmin'
      : isSuperLike
      ? 'superlike'
      : 'like';

    const newLike: LikeAction = {
      fromUserId: currentUser.id,
      toUserId: targetUser.id,
      isSuperLike: isSuperLike || isJasmin,
      isJasmin: isJasmin,
      type: actionType,
      timestamp: new Date().toISOString(),
    };

    const updatedLikes = [...likesSent, newLike];
    setLikesSent(updatedLikes);
    saveLikesSent(currentUser.id, updatedLikes);

    // Mutual Match Simulation
    const isMutual = isSuperLike || isJasmin || Math.random() > 0.35;

    if (isMutual) {
      const newMatch: MatchRelation = {
        id: `match_${Date.now()}`,
        user1Id: currentUser.id,
        user2Id: targetUser.id,
        matchedAt: 'À l’instant',
        lastMessageSnippet: isJasmin
          ? `🌸 Fleur de Jasmin reçue de ${currentUser.pseudo} !`
          : `Coup de cœur partagé avec ${targetUser.pseudo} ! ✨`,
        unreadCount: 1,
      };

      const updatedMatches = [newMatch, ...matches];
      setMatches(updatedMatches);
      saveMatchesList(currentUser.id, updatedMatches);

      // Trigger Celebration & Popup
      datingSounds.playMatchSound();
      confetti({
        particleCount: isJasmin ? 120 : 100,
        spread: 85,
        origin: { y: 0.6 },
        colors: isJasmin ? ['#f43f5e', '#ec4899', '#fbcfe8', '#fb7185'] : undefined,
      });
      setNewMatchAlert(targetUser);
    }
  };

  // Report user
  const handleReportUser = (targetUser: UserProfile) => {
    alert(
      isArabic
        ? `تم تسجيل بلاغك بخصوص حساب ${targetUser.pseudo}. شكراً لمساعدتنا في حماية مجتمع نصفي (Nisfy).`
        : `Votre signalement concernant le profil de ${targetUser.pseudo} a été transmis à l'équipe de modération de Nisfy.`
    );
  };

  // Block user
  const handleBlockUser = (targetUser: UserProfile) => {
    if (!currentUser) return;
    const currentBlocked = currentUser.blockedUsers || [];
    const updatedBlocked = [...currentBlocked, targetUser.id];
    const updatedUser: UserProfile = {
      ...currentUser,
      blockedUsers: updatedBlocked,
    };
    handleUpdateProfile(updatedUser);
    if (activeChatUserId === targetUser.id) {
      setActiveChatUserId(null);
    }
    alert(
      isArabic
        ? `تم حظر ${targetUser.pseudo}. لن يظهر هذا الحساب مجدداً.`
        : `Le profil ${targetUser.pseudo} a été bloqué avec succès.`
    );
  };

  // Start Direct Chat with user
  const handleStartDirectChat = (targetUser: UserProfile, initialMessage?: string) => {
    if (!currentUser) return;

    setActiveChatUserId(targetUser.id);
    setActiveTab('chat');

    // If initial message provided, send it
    if (initialMessage) {
      handleSendMessage(targetUser.id, initialMessage, 'text');
    }
  };

  // Send Private Message
  const handleSendMessage = (
    receiverId: string,
    content: string,
    type: 'text' | 'image' | 'voice' | 'lounge_invite' | 'icebreaker' | 'jasmin' = 'text'
  ) => {
    if (!currentUser) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      senderId: receiverId === currentUser.id ? activeChatUserId || 'user_claire' : currentUser.id,
      receiverId: receiverId,
      content,
      timestamp: timeStr,
      isRead: false,
      type,
    };

    const targetId =
      receiverId === currentUser.id ? activeChatUserId || 'user_claire' : receiverId;

    const currentChatList = chats[targetId] || [];
    const updatedChats = {
      ...chats,
      [targetId]: [...currentChatList, newMsg],
    };

    setChats(updatedChats);
    savePrivateChats(updatedChats);
  };

  // Community Lounge message
  const handlePostCommunityMessage = (content: string, roomId?: string) => {
    if (!currentUser) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const newMsg: CommunityMessage = {
      id: `comm_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.pseudo,
      authorAvatar: currentUser.avatar,
      authorCity: currentUser.city,
      roomId: roomId,
      content,
      timestamp: timeStr,
      likes: 1,
      likedBy: [currentUser.id],
    };

    const updated = [newMsg, ...communityMessages];
    setCommunityMessages(updated);
    saveCommunityMessages(updated);
  };

  const handleLikeCommunityMessage = (messageId: string) => {
    if (!currentUser) return;

    datingSounds.playLikeSound();
    const updated = communityMessages.map((msg) => {
      if (msg.id === messageId) {
        const isLiked = msg.likedBy.includes(currentUser.id);
        return {
          ...msg,
          likes: isLiked ? msg.likes - 1 : msg.likes + 1,
          likedBy: isLiked
            ? msg.likedBy.filter((id) => id !== currentUser.id)
            : [...msg.likedBy, currentUser.id],
        };
      }
      return msg;
    });

    setCommunityMessages(updated);
    saveCommunityMessages(updated);
  };

  // Update Profile
  const handleUpdateProfile = (updated: UserProfile) => {
    setLoggedInUser(updated);
    setCurrentUser(updated);

    const updatedRegistered = registeredUsers.map((u) =>
      u.id === updated.id ? updated : u
    );
    setRegisteredUsers(updatedRegistered);
    saveRegisteredUsers(updatedRegistered);
  };

  // Publish Video by any member (Stories / Reels DZ)
  const handlePublishVideo = (newVideo: ProfileVideo) => {
    if (!currentUser) return;
    const currentVideos = currentUser.videos || [];
    const updatedVideos = [newVideo, ...currentVideos];
    const updatedUser: UserProfile = {
      ...currentUser,
      videos: updatedVideos,
    };
    handleUpdateProfile(updatedUser);
  };

  // Calculate unread count
  const unreadMessagesCount = (Object.values(chats) as ChatMessage[][]).reduce((total, chatList) => {
    return (
      total +
      chatList.filter((m) => !m.isRead && m.senderId !== currentUser?.id).length
    );
  }, 0);

  // If not logged in, render Authentication Screen
  if (!currentUser) {
    return (
      <AuthModal
        onLoginSuccess={handleLoginSuccess}
        registeredUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 font-sans flex flex-col justify-between transition-colors duration-200">
      <div>
        {/* Navigation Bar */}
        <Navbar
          currentUser={currentUser}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onLogout={handleLogout}
          unreadCount={unreadMessagesCount}
          matchesCount={matches.length}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isMapEnabled={isMapEnabled}
          onToggleMapEnabled={handleToggleMap}
          allUsers={registeredUsers}
          onSelectUser={(u) => handleStartDirectChat(u)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onOpenPremium={() => setIsPremiumModalOpen(true)}
          onOpenVerification={() => setIsVerificationModalOpen(true)}
          onOpenContact={() => setIsContactModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeTab === 'discover' && (
            <DiscoverView
              currentUser={currentUser}
              allUsers={registeredUsers}
              onLikeUser={handleLikeUser}
              onStartDirectChat={handleStartDirectChat}
              onOpenMap={() => {
                setIsMapEnabled(true);
                setActiveTab('map');
              }}
              isMapEnabled={isMapEnabled}
              onToggleMap={handleToggleMap}
              onReportUser={handleReportUser}
              onBlockUser={handleBlockUser}
              bookmarkedUserIds={bookmarkedUserIds}
              onToggleBookmark={handleToggleBookmark}
              onPublishVideo={handlePublishVideo}
            />
          )}

          {activeTab === 'feed' && (
            <div className="-mt-6 -mx-4 sm:-mx-6 lg:-mx-8 h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)]">
              <SocialFeed 
                currentUser={currentUser}
                onSelectUser={(userId) => {
                  const target = registeredUsers.find((u) => u.id === userId);
                  if (target) {
                    handleStartDirectChat(target);
                  }
                }}
                onNavigateToDiscover={() => setActiveTab('discover')}
              />
            </div>
          )}

          {activeTab === 'customs' && (
            <CustomsGuideView
              onNavigateToMarketplace={() => setActiveTab('marketplace')}
            />
          )}

          {activeTab === 'shop' && (
            <YouthShopView />
          )}

          {activeTab === 'marketplace' && (
            <WeddingMarketplaceView />
          )}

          {activeTab === 'live' && (
            <LiveStreamView
              currentUser={currentUser}
              liveSessions={liveSessions}
              liveComments={liveComments}
              onStartLive={handleStartLive}
              onEndLive={handleEndLive}
              onSendComment={handleSendLiveComment}
              onSendLike={handleSendLiveLike}
              onViewProfile={(userId) => {
                const u = registeredUsers.find((user) => user.id === userId);
                if (u) {
                  handleStartDirectChat(u);
                }
              }}
            />
          )}

          {activeTab === 'matches' && (
            <MatchesView
              currentUser={currentUser}
              matches={matches}
              allUsers={registeredUsers}
              onStartDirectChat={handleStartDirectChat}
              onExploreMore={() => setActiveTab('discover')}
            />
          )}

          {activeTab === 'chat' && (
            <PrivateChatView
              currentUser={currentUser}
              allUsers={registeredUsers}
              chats={chats}
              onSendMessage={handleSendMessage}
              activeChatUserId={activeChatUserId}
              onSelectChatUser={setActiveChatUserId}
              onStartCall={setCallingUser}
              onReportUser={handleReportUser}
              onBlockUser={handleBlockUser}
            />
          )}

          {activeTab === 'lounge' && (
            <CommunityLoungeView
              currentUser={currentUser}
              allUsers={registeredUsers}
              messages={communityMessages}
              onPostMessage={handlePostCommunityMessage}
              onLikeMessage={handleLikeCommunityMessage}
              onStartDirectChat={handleStartDirectChat}
            />
          )}

          {activeTab === 'map' && (
            <LiveTrafficMapView
              currentUser={currentUser}
              allUsers={registeredUsers}
              onStartDirectChat={handleStartDirectChat}
              onExploreZoneFilter={() => setActiveTab('discover')}
              onCloseMap={() => setActiveTab('discover')}
              onToggleMap={handleToggleMap}
            />
          )}

          {activeTab === 'profile' && (
            <MyProfileView
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
              likesReceivedCount={likesSent.length}
            />
          )}

          {activeTab === 'chef_nadjet' && (
            <ChefNadjetView
              onBackToDiscover={() => setActiveTab('discover')}
            />
          )}

          {activeTab === 'admin' && (
            <AdminAdvertisersView
              currentUser={currentUser}
              onBack={() => setActiveTab('discover')}
            />
          )}
        </main>
      </div>

      {/* Cultural Wisdom Proverbs Footer */}
      <FooterProverbs onOpenContact={() => setIsContactModalOpen(true)} />

      {/* ===== POPUP MODAL: MUTUAL MATCH ALERT ===== */}
      {newMatchAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-rose-200 space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center text-3xl mx-auto shadow-lg shadow-rose-500/30">
              ❤️
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                {isArabic ? 'إعجاب متبادل !' : 'Coup de Cœur Réciproque !'}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                {isArabic ? `توافق رائع مع ${newMatchAlert.pseudo} !` : `C’est un Match avec ${newMatchAlert.pseudo} !`}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isArabic ? 'هناك إعجاب متبادل بينكما. ابدأ المحادثة الآن !' : 'Vous vous plaisez mutuellement. Lancez la discussion dès maintenant !'}
              </p>
            </div>

            {/* Overlapping Avatars */}
            <div className="flex items-center justify-center -space-x-4 py-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.pseudo}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md z-10"
              />
              <img
                src={newMatchAlert.avatar}
                alt={newMatchAlert.pseudo}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md z-20"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const target = newMatchAlert;
                  setNewMatchAlert(null);
                  handleStartDirectChat(
                    target,
                    isArabic
                      ? `أهلاً وسهلاً ${target.pseudo} ! سعيد(ة) جداً بتوافقنا على Nisfy ! ✨`
                      : `Coucou ${target.pseudo} ! Trop content(e) de notre match sur Nisfy ! ✨`
                  );
                }}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white rounded-2xl text-xs font-black shadow-md shadow-rose-500/25 transition-all cursor-pointer"
              >
                {isArabic ? `إرسال رسالة إلى ${newMatchAlert.pseudo}` : `Envoyer un message à ${newMatchAlert.pseudo}`}
              </button>

              <button
                type="button"
                onClick={() => setNewMatchAlert(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
              >
                {isArabic ? 'متابعة الاستكشاف' : 'Continuer à découvrir'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===== POPUP MODAL: AUDIO CALL ===== */}
      {callingUser && (
        <CallModal
          targetUser={callingUser}
          onEndCall={() => setCallingUser(null)}
        />
      )}

      {/* ===== POPUP MODAL: PREMIUM & VIP SUBSCRIPTIONS ===== */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        currentUser={currentUser}
        onUpgradeSuccess={(updatedUser, message) => {
          handleUpdateProfile(updatedUser);
          setToastMessage(message);
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />

      {/* ===== POPUP MODAL: SELF-IDENTITY VERIFICATION ===== */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        currentUser={currentUser}
        onVerificationSuccess={(updatedUser) => {
          handleUpdateProfile(updatedUser);
          setToastMessage(
            isArabic
              ? 'تهانينا ! تم اعتماد حسابك وتوثيق نية الزواج بنجاح 🇩🇿💍'
              : 'Félicitations ! Votre profil est officiellement vérifié 🇩🇿💍'
          );
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />

      {/* ===== POPUP MODAL: CONTACT & SUPPORT ===== */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* ===== TOAST NOTIFICATION POPUP ===== */}
      {toastMessage && (
        <div className="fixed bottom-6 inset-x-4 max-w-md mx-auto z-50 animate-in slide-in-from-bottom-5">
          <div className="p-4 rounded-2xl bg-slate-900/95 text-white shadow-2xl border border-slate-700 flex items-center justify-between gap-3">
            <p className="text-xs font-black">{toastMessage}</p>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
