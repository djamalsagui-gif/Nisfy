import React from 'react';
import {
  Sparkles,
  Heart,
  MessageCircle,
  MapPin,
  Calendar,
  CheckCircle2,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { UserProfile, MatchRelation } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MatchesViewProps {
  currentUser: UserProfile;
  matches: MatchRelation[];
  allUsers: UserProfile[];
  onStartDirectChat: (targetUser: UserProfile, initialMessage?: string) => void;
  onExploreMore: () => void;
}

export function MatchesView({
  currentUser,
  matches,
  allUsers,
  onStartDirectChat,
  onExploreMore,
}: MatchesViewProps) {
  const { t, isArabic } = useLanguage();

  // Get matched user profiles
  const matchedUsers = matches
    .map((m) => {
      const otherUserId =
        m.user1Id === currentUser.id ? m.user2Id : m.user1Id;
      const userObj = allUsers.find((u) => u.id === otherUserId);
      return userObj ? { ...userObj, matchMeta: m } : null;
    })
    .filter(Boolean) as (UserProfile & { matchMeta: MatchRelation })[];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h2 className="text-xl font-black">{t.matchesTitle}</h2>
          </div>
          <p className="text-xs sm:text-sm text-rose-100 max-w-lg">
            {t.matchesSubtitle}
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-center shrink-0">
          <span className="text-2xl font-black text-white">{matchedUsers.length}</span>
          <span className="text-[10px] block font-extrabold uppercase tracking-wider text-rose-100">
            {t.recentMatches}
          </span>
        </div>
      </div>

      {matchedUsers.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-3xl mx-auto">
            💌
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {t.matchesTitle}
          </h3>
          <p className="text-xs text-slate-500">
            {t.noMatchesDesc}
          </p>
          <button
            type="button"
            onClick={onExploreMore}
            className="py-2.5 px-6 bg-gradient-to-r from-rose-500 to-indigo-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-500/20 hover:opacity-95 transition-all inline-flex items-center gap-2 cursor-pointer"
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
              className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.pseudo}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-rose-200 group-hover:scale-105 transition-transform"
                    />
                    {user.isOnline && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-extrabold text-sm text-slate-900 truncate">
                        {user.pseudo}, {user.age}
                      </h4>
                      {user.verified && (
                        <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                      )}
                      {user.marriageVerified && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-gradient-to-r from-amber-100 to-rose-100 text-rose-800 font-extrabold border border-rose-200">
                          💍
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" /> {user.city}
                    </p>
                    <span className="inline-block mt-0.5 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      Match à {user.matchScore || 92}% {t.affinity}
                    </span>
                  </div>
                </div>

                {/* Match snippet / Icebreaker */}
                <div className="mt-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    💡 {t.icebreakerTitle} :
                  </span>
                  <p className="text-slate-700 italic line-clamp-2">
                    « {user.icebreaker} »
                  </p>
                </div>
              </div>

              {/* Chat Action */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() =>
                    onStartDirectChat(
                      user,
                      isArabic
                        ? `أهلا ${user.pseudo} ! فرحان(ة) بالماتش ديالنا في القلعة DZ69 ! ✨`
                        : `Coucou ${user.pseudo} ! Ravi(e) de notre match sur القلعة DZ69 ! ✨`
                    )
                  }
                  className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.startChatBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

