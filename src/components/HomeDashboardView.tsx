import React from 'react';
import {
  Sparkles,
  Heart,
  MessageCircle,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkle,
  Flame,
  UserCheck,
  Star,
  Coffee,
  Music,
  BookOpen,
  Award,
} from 'lucide-react';
import { UserProfile, MatchRelation } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { calculateCompatibilityScore } from '../utils/matchingAlgorithm';

interface HomeDashboardViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  matches: MatchRelation[];
  onSelectTab: (tab: any) => void;
  onSelectUserForChat: (user: UserProfile) => void;
  onExploreFiltered: (category: 'high_compatibility' | 'verified' | 'marriage_ready' | 'same_wilaya' | 'diaspora') => void;
}

export function HomeDashboardView({
  currentUser,
  allUsers,
  matches,
  onSelectTab,
  onSelectUserForChat,
  onExploreFiltered,
}: HomeDashboardViewProps) {
  const { t, isArabic } = useLanguage();

  // 1. High compatibility recommendations
  const recommendedProfiles = React.useMemo(() => {
    return allUsers
      .filter((u) => u.id !== currentUser.id && !(currentUser.blockedUsers || []).includes(u.id))
      .map((u) => ({
        user: u,
        compatibility: calculateCompatibilityScore(currentUser, u),
      }))
      .sort((a, b) => b.compatibility.score - a.compatibility.score)
      .slice(0, 6);
  }, [allUsers, currentUser]);

  // 2. Verified Marriage-Ready Profiles
  const marriageReadyProfiles = React.useMemo(() => {
    return allUsers
      .filter(
        (u) =>
          u.id !== currentUser.id &&
          (u.marriageVerified || u.hasBlueBadge || u.marriageTimeline === 'immediat' || u.marriageTimeline === '1-an')
      )
      .slice(0, 4);
  }, [allUsers, currentUser]);

  // 3. User Goal / Profile Completion Check
  const completionPercentage = React.useMemo(() => {
    let count = 0;
    const total = 7;
    if (currentUser.avatar) count++;
    if (currentUser.bio && currentUser.bio.length > 20) count++;
    if (currentUser.photos && currentUser.photos.length >= 2) count++;
    if (currentUser.interests && currentUser.interests.length >= 3) count++;
    if (currentUser.occupation) count++;
    if (currentUser.wilayaCode) count++;
    if (currentUser.marriageTimeline) count++;
    return Math.round((count / total) * 100);
  }, [currentUser]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 🌟 1. Warm Greeting & Daily Objective Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-5 sm:p-7 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-[#FF3823]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {isArabic ? 'لوحة التوافق اليومية' : 'Tableau de bord quotidien'}
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString(isArabic ? 'ar-DZ' : 'fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {isArabic ? `مرحباً ${currentUser.pseudo} 👋` : `Bonjour ${currentUser.pseudo} 👋`}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              {isArabic
                ? 'نصفي يقترح عليك ملفات جادة تم اختيارها بعناية حسب قيمك، مشروع زواجك، وولايتك.'
                : 'Nisfy vous propose aujourd’hui des profils sérieux sélectionnés selon vos valeurs, votre projet de mariage et votre wilaya.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('discover')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Compass className="w-4 h-4" />
              <span>{isArabic ? 'بدء التصفح' : 'Explorer les profils'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Profile Completion Goal Card */}
        {completionPercentage < 100 && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                {completionPercentage}%
              </div>
              <div>
                <span className="font-bold text-white block">
                  {isArabic ? '🎯 هدفك اليوم : إكمال ملفك الشخصي' : '🎯 Votre objectif : Compléter votre profil'}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {isArabic
                    ? 'الملفات المكتملة والمحققة تحصل على توافقات أسرع بـ 4 أضعاف.'
                    : 'Les profils complets et vérifiés reçoivent 4x plus de propositions compatibles.'}
                </span>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('profile')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors shrink-0 cursor-pointer"
            >
              {isArabic ? 'تحسين الملف' : 'Améliorer mon profil'}
            </button>
          </div>
        )}
      </div>

      {/* 🚀 2. Three Quick-Access Feature Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Pillar 1: High Compatibility */}
        <div
          onClick={() => onSelectTab('discover')}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4.5 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-[#FF3823] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              {isArabic ? 'توافقات عالية' : 'Compatibilité Élevée'}
            </h3>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-[#FF3823]">
              {recommendedProfiles.length} {isArabic ? 'جديد' : 'nouveaux'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {isArabic
              ? 'أعضاء يشاركونك نفس الرؤية والأهداف الزوجية والقيم الأسرية.'
              : 'Membres partageant vos valeurs familiales et votre vision du mariage.'}
          </p>
        </div>

        {/* Pillar 2: Community Lounge Salhiya */}
        <div
          onClick={() => onSelectTab('lounge')}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4.5 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              {isArabic ? 'صالون الصالحية' : 'Salon Salhiya'}
            </h3>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              {isArabic ? 'حي ومباشر' : 'Actif'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {isArabic
              ? 'تبادل النقاشات الهادفة والمشاركات الصوتية المحترمة بين أفراد المجتمع.'
              : 'Échanges respectueux, partages vocaux et discussions thématiques.'}
          </p>
        </div>

        {/* Pillar 3: Matches & Active Chats */}
        <div
          onClick={() => onSelectTab(matches.length > 0 ? 'matches' : 'chat')}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4.5 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              {isArabic ? 'مطابقاتي والرسائل' : 'Matchs & Messages'}
            </h3>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600">
              {matches.length} {isArabic ? 'محادثات' : 'actifs'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {isArabic
              ? 'متابعة المحادثات الخاصة، الرسائل الصوتية والهدايا التعبيرية.'
              : 'Poursuivez vos échanges privés, notes vocales et cadeaux Jasmin.'}
          </p>
        </div>
      </div>

      {/* ❤️ 3. Top Intelligent Recommendations of the Day */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF3823] animate-ping" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {isArabic ? 'توصيات التوافق الذكي لليوم' : 'Recommandations Intelligentes du Jour'}
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('discover')}
            className="text-xs font-bold text-[#FF3823] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{isArabic ? 'عرض الجميع' : 'Voir tout'}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedProfiles.map(({ user: recUser, compatibility }) => (
            <div
              key={recUser.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={recUser.avatar}
                      alt={recUser.pseudo}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    {recUser.verified && (
                      <span className="absolute -bottom-1 -right-1 bg-[#38BDF8] text-white p-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-base font-black text-slate-900 dark:text-white truncate">
                        {recUser.pseudo}, {recUser.age}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white shrink-0 shadow-xs">
                        {compatibility.score}% {isArabic ? 'توافق' : 'compat.'}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                      <span>📍 {recUser.city}</span>
                      {recUser.wilayaCode && <span>({recUser.wilayaCode})</span>}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 truncate">
                      💼 {recUser.occupation || (isArabic ? 'مشروع زواج جاد' : 'Projet mariage')}
                    </p>
                  </div>
                </div>

                {/* Compatibility Explanatory Factors */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? '💡 أسباب التوافق :' : '💡 Pourquoi ce profil vous correspond :'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {compatibility.matchingFactors.slice(0, 2).map((factor, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50"
                      >
                        ✓ {isArabic ? factor.labelAr : factor.labelFr}
                      </span>
                    ))}
                    {recUser.marriageTimeline && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/50">
                        💍 {isArabic ? 'مشروع زواج' : 'Projet zawaj'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => onSelectUserForChat(recUser)}
                  className="flex-1 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'مراسلة خاصة' : 'Discuter'}</span>
                </button>
                <button
                  onClick={() => onSelectTab('discover')}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                  title={isArabic ? 'عرض البروفايل' : 'Voir profil'}
                >
                  <Compass className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📚 4. Cultural & Matrimonial Guides Preview */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-rose-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isArabic ? '🇩🇿 دليلي للزواج والتقاليد الجزائرية' : '🇩🇿 Guide du Mariage & Coutumes Algériennes'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {isArabic
                ? 'اكتشف تقاليد الخطبة، الشورى، ليلة الحناء، والوصفات التقليدية حسب كل ولاية.'
                : 'Explorez les rituels de Khetba, Choura, Nuit du Henné et recettes de fête par wilaya.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectTab('customs')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shrink-0 shadow-sm cursor-pointer"
        >
          {isArabic ? 'تصفح الدليل' : 'Consulter le guide'}
        </button>
      </div>
    </div>
  );
}
