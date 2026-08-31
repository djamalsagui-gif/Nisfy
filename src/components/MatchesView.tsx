import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  MessageCircle,
  MapPin,
  Calendar,
  CheckCircle2,
  ChevronRight,
  UserCheck,
  Bookmark,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile, MatchRelation } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MatchesViewProps {
  currentUser: UserProfile;
  matches: MatchRelation[];
  allUsers: UserProfile[];
  bookmarkedUserIds?: string[];
  onToggleBookmark?: (targetUser: UserProfile) => void;
  onStartDirectChat: (targetUser: UserProfile, initialMessage?: string) => void;
  onExploreMore: () => void;
}

export function MatchesView({
  currentUser,
  matches,
  allUsers,
  bookmarkedUserIds = [],
  onToggleBookmark,
  onStartDirectChat,
  onExploreMore,
}: MatchesViewProps) {
  const { t, isArabic } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'matches' | 'favorites'>('matches');

  // Get matched user profiles with guaranteed unique keys
  const matchedUsers = React.useMemo(() => {
    const seen = new Set<string>();
    return matches
      .map((m) => {
        const otherUserId =
          m.user1Id === currentUser.id ? m.user2Id : m.user1Id;
        const userObj = allUsers.find((u) => u.id === otherUserId);
        if (!userObj || seen.has(userObj.id)) return null;
        seen.add(userObj.id);
        return { ...userObj, matchMeta: m };
      })
      .filter(Boolean) as (UserProfile & { matchMeta: MatchRelation })[];
  }, [matches, currentUser.id, allUsers]);

  // Get bookmarked user profiles
  const bookmarkedUsers = React.useMemo(() => {
    return allUsers.filter((u) => bookmarkedUserIds.includes(u.id));
  }, [allUsers, bookmarkedUserIds]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#2A1115] to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-[#FF3823]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF6B35]" />
            <h2 className="text-xl sm:text-2xl font-black">
              {activeSubTab === 'matches'
                ? t.matchesTitle
                : isArabic
                ? 'قائمة المفضلة الشخصية ⭐'
                : 'Mes Favoris Personnels ⭐'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            {activeSubTab === 'matches'
              ? t.matchesSubtitle
              : isArabic
              ? 'الملفات الشخصية التي قمت بحفظها لمراجعتها والتواصل معها لاحقاً بكل سهولة.'
              : 'Les profils enregistrés pour les retrouver facilement et initier une discussion respectueuse.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-center">
            <span className="text-xl sm:text-2xl font-black text-[#38BDF8]">
              {matchedUsers.length}
            </span>
            <span className="text-[9px] sm:text-[10px] block font-extrabold uppercase tracking-wider text-orange-200">
              {t.recentMatches}
            </span>
          </div>

          <div className="bg-amber-400/15 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-amber-300/30 text-center">
            <span className="text-xl sm:text-2xl font-black text-amber-300">
              {bookmarkedUsers.length}
            </span>
            <span className="text-[9px] sm:text-[10px] block font-extrabold uppercase tracking-wider text-amber-200">
              {isArabic ? 'المفضلة' : 'Favoris'}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Matchs vs Favoris */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('matches')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'matches'
              ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white shadow-md shadow-orange-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
          <span>{isArabic ? `توافقات متبادلة (${matchedUsers.length})` : `Mes Matchs (${matchedUsers.length})`}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('favorites')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'favorites'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4 fill-current" />
          <span>{isArabic ? `المفضلة (${bookmarkedUsers.length})` : `Mes Favoris (${bookmarkedUsers.length})`}</span>
        </button>
      </div>

      {/* View Content: MATCHES */}
      {activeSubTab === 'matches' && (
        matchedUsers.length === 0 ? (
          /* Empty State Matches */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/50 text-[#FF3823] rounded-full flex items-center justify-center text-3xl mx-auto">
              💌
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {t.matchesTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.noMatchesDesc}
            </p>
            <button
              type="button"
              onClick={onExploreMore}
              className="py-2.5 px-6 bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] hover:opacity-95 text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{t.exploreBtn}</span>
            </button>
          </div>
        ) : (
          /* Matches Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Profile Header */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.pseudo}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-200 dark:border-orange-900/60 group-hover:scale-105 transition-transform"
                      />
                      {user.isOnline && (
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                          {user.pseudo}, {user.age}
                        </h4>
                        {user.verified && (
                          <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                        )}
                        {user.marriageVerified && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold border border-amber-200 dark:border-amber-800">
                            💍
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF3823]" /> {user.city}
                      </p>
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-[#FF3823] dark:text-[#FF6B35] bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded-full">
                        Match à {user.matchScore || 92}% {t.affinity}
                      </span>
                    </div>

                    {onToggleBookmark && (
                      <button
                        type="button"
                        onClick={() => onToggleBookmark(user)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                          bookmarkedUserIds.includes(user.id)
                            ? 'bg-amber-50 text-amber-600 border-amber-300'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-amber-500 border-slate-200 dark:border-slate-700'
                        }`}
                        title={
                          bookmarkedUserIds.includes(user.id)
                            ? isArabic
                              ? 'إزالة من المفضلة'
                              : 'Retirer des favoris'
                            : isArabic
                            ? 'حفظ في المفضلة'
                            : 'Ajouter aux favoris'
                        }
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            bookmarkedUserIds.includes(user.id)
                              ? 'fill-amber-500 text-amber-500'
                              : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Match snippet / Icebreaker */}
                  <div className="mt-3 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
                      💡 {t.icebreakerTitle} :
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 italic line-clamp-2">
                      « {user.icebreaker} »
                    </p>
                  </div>
                </div>

                {/* Chat Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() =>
                      onStartDirectChat(
                        user,
                        isArabic
                          ? `أهلا ${user.pseudo} ! فرحان(ة) بالماتش ديالنا في Nisfy نصفي ! ✨`
                          : `Coucou ${user.pseudo} ! Ravi(e) de notre match sur Nisfy ! ✨`
                      )
                    }
                    className="w-full py-2.5 bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] hover:opacity-95 text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.startChatBtn}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* View Content: FAVORITES */}
      {activeSubTab === 'favorites' && (
        bookmarkedUsers.length === 0 ? (
          /* Empty State Favorites */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/50 text-amber-500 rounded-full flex items-center justify-center text-3xl mx-auto">
              ⭐
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {isArabic ? 'قائمة المفضلة فارغة' : 'Aucun favori enregistré'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isArabic
                ? 'استخدموا زر النجمة (⭐) أثناء تصفح الملفات لحفظ الأشخاص الذين تودون مراجعة بروفايلهم لاحقاً.'
                : 'Enregistrez des profils coup de cœur lors de vos découvertes pour les retrouver ici et les revoir quand vous le souhaitez.'}
            </p>
            <button
              type="button"
              onClick={onExploreMore}
              className="py-2.5 px-6 bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] hover:opacity-95 text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{isArabic ? 'استكشاف الملفات' : 'Découvrir des profils'}</span>
            </button>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-amber-200/70 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Profile Header */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.pseudo}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-300 dark:border-amber-700 group-hover:scale-105 transition-transform"
                      />
                      {user.isOnline && (
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                          {user.pseudo}, {user.age}
                        </h4>
                        {user.verified && (
                          <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                        )}
                        {user.marriageVerified && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold border border-amber-200 dark:border-amber-800">
                            💍
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF3823]" /> {user.city}
                      </p>
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                        ⭐ {isArabic ? 'محفوظ في المفضلة' : 'Enregistré dans vos favoris'}
                      </span>
                    </div>

                    {onToggleBookmark && (
                      <button
                        type="button"
                        onClick={() => onToggleBookmark(user)}
                        className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 hover:bg-rose-50 hover:text-rose-600 border border-amber-200 dark:border-amber-900/50 transition-colors cursor-pointer shrink-0"
                        title={isArabic ? 'إزالة من المفضلة' : 'Retirer des favoris'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Bio / Project */}
                  <div className="mt-3 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                    <p className="text-slate-700 dark:text-slate-300 italic line-clamp-2">
                      « {user.bio || user.icebreaker} »
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onStartDirectChat(
                        user,
                        isArabic
                          ? `السلام عليكم ${user.pseudo}، لفت انتباهي ملفك الشخصي في Nisfy ! ✨`
                          : `Bonjour ${user.pseudo}, votre profil a attiré mon attention sur Nisfy ! ✨`
                      )
                    }
                    className="flex-1 py-2.5 bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] hover:opacity-95 text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.startChatBtn}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

