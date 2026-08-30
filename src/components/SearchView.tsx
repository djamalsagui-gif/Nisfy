import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Users,
  Film,
  FileText,
  Hash,
  MapPin,
  Utensils,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Heart,
  MessageCircle,
  ShoppingBag,
  Layers,
  ArrowRight,
  TrendingUp,
  X,
  Play,
  Share2,
} from 'lucide-react';
import { UserProfile, SocialPost } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { WILAYAS_LIST } from '../data/wilayas';
import { INITIAL_SOCIAL_POSTS } from '../data/socialFeedData';

interface SearchViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSelectUserForChat: (user: UserProfile) => void;
  onSelectUserForProfile: (user: UserProfile) => void;
  onSelectTab: (tab: any) => void;
}

type SearchCategory = 'all' | 'people' | 'videos' | 'posts' | 'groups' | 'wilayas' | 'recipes' | 'marketplace';

const TRENDING_HASHTAGS = [
  { tag: '#MariageDZ', count: '14.2K', category: 'mariage' },
  { tag: '#KhetbaAlger', count: '8.5K', category: 'tradition' },
  { tag: '#OranElBahia', count: '6.1K', category: 'wilaya' },
  { tag: '#CheddaTlemcen', count: '11.8K', category: 'culture' },
  { tag: '#SalhiyaDZ', count: '9.3K', category: 'communaute' },
  { tag: '#DiasporaDZ', count: '5.7K', category: 'diaspora' },
  { tag: '#RecettesFête', count: '7.9K', category: 'cuisine' },
];

const COMMUNITY_GROUPS = [
  {
    id: 'grp-alger',
    titleFr: 'Entraide & Rencontres Alger & Centre (16, 09, 35, 42)',
    titleAr: 'مجموعة التعارف واللقاءات الجزائر والوسط',
    wilaya: 'Alger (16)',
    membersCount: 3420,
    category: 'wilaya',
    image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'grp-oran',
    titleFr: 'Célibataires & Projets Mariage Oran & Ouest',
    titleAr: 'مشاريع الزواج وهران والغرب الجزائري',
    wilaya: 'Oran (31)',
    membersCount: 2150,
    category: 'wilaya',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'grp-diaspora',
    titleFr: 'Diaspora Algérienne (France, Canada, Europe) & Retour au Pays',
    titleAr: 'أبناء الجالية بالخارج ومشروع الاستقرار',
    wilaya: 'Diaspora',
    membersCount: 4890,
    category: 'diaspora',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'grp-khetba',
    titleFr: 'Conseils Khetba, Trouseau & Préparatifs Zawaj',
    titleAr: 'نصائح الخطوبة وجهاز العروس والمهر الشرعي',
    wilaya: 'National',
    membersCount: 6200,
    category: 'mariage',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400',
  },
];

export function SearchView({
  currentUser,
  allUsers,
  onSelectUserForChat,
  onSelectUserForProfile,
  onSelectTab,
}: SearchViewProps) {
  const { isArabic } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const [selectedWilayaFilter, setSelectedWilayaFilter] = useState('');

  // Filtered Users
  const matchedUsers = useMemo(() => {
    const seen = new Set<string>();
    return allUsers.filter((user) => {
      if (!user || !user.id || seen.has(user.id) || user.id === currentUser.id) return false;
      const query = (searchQuery || '').toLowerCase().trim();
      const matchQuery =
        !query ||
        (user.pseudo && user.pseudo.toLowerCase().includes(query)) ||
        (user.city && user.city.toLowerCase().includes(query)) ||
        (user.occupation && user.occupation.toLowerCase().includes(query)) ||
        (user.bio && user.bio.toLowerCase().includes(query)) ||
        (user.interests && user.interests.some((i) => Boolean(i) && i.toLowerCase().includes(query)));

      const matchWilaya = !selectedWilayaFilter || user.wilayaCode === selectedWilayaFilter;

      if (matchQuery && matchWilaya) {
        seen.add(user.id);
        return true;
      }
      return false;
    });
  }, [allUsers, currentUser, searchQuery, selectedWilayaFilter]);

  // Filtered Videos & Posts
  const matchedPosts = useMemo(() => {
    return INITIAL_SOCIAL_POSTS.filter((post) => {
      const query = (searchQuery || '').toLowerCase().trim();
      return (
        !query ||
        (post.title && post.title.toLowerCase().includes(query)) ||
        (post.description && post.description.toLowerCase().includes(query)) ||
        (post.authorPseudo && post.authorPseudo.toLowerCase().includes(query)) ||
        (post.category && post.category.toLowerCase().includes(query))
      );
    });
  }, [searchQuery]);

  // Filtered Groups
  const matchedGroups = useMemo(() => {
    return COMMUNITY_GROUPS.filter((g) => {
      const query = (searchQuery || '').toLowerCase().trim();
      return (
        !query ||
        (g.titleFr && g.titleFr.toLowerCase().includes(query)) ||
        (g.titleAr && g.titleAr.includes(query)) ||
        (g.wilaya && g.wilaya.toLowerCase().includes(query))
      );
    });
  }, [searchQuery]);

  // Filtered Wilayas (DZ69)
  const matchedWilayas = useMemo(() => {
    const query = (searchQuery || '').toLowerCase().trim();
    if (!query) return WILAYAS_LIST.slice(0, 8);
    return WILAYAS_LIST.filter(
      (w) =>
        (w.code && w.code.includes(query)) ||
        (w.name && w.name.toLowerCase().includes(query)) ||
        (w.arabicName && w.arabicName.includes(query))
    );
  }, [searchQuery]);

  const categories: { id: SearchCategory; labelFr: string; labelAr: string; icon: any }[] = [
    { id: 'all', labelFr: 'Tout explorer', labelAr: 'الكل', icon: Sparkles },
    { id: 'people', labelFr: 'Personnes', labelAr: 'الأشخاص', icon: Users },
    { id: 'videos', labelFr: 'Shorts & Vidéos', labelAr: 'الفيديوهات', icon: Film },
    { id: 'posts', labelFr: 'Publications', labelAr: 'المنشورات', icon: FileText },
    { id: 'groups', labelFr: 'Groupes', labelAr: 'المجموعات', icon: Layers },
    { id: 'wilayas', labelFr: '69 Wilayas', labelAr: '69 ولاية', icon: MapPin },
    { id: 'recipes', labelFr: 'Gastronomie', labelAr: 'الطبخ', icon: Utensils },
    { id: 'marketplace', labelFr: 'Services Mariage', labelAr: 'خدمات العرس', icon: ShoppingBag },
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* 🔍 Search Input Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-lg">
        <div className="relative flex items-center">
          <Search className="absolute left-4 rtl:left-auto rtl:right-4 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isArabic
                ? 'ابحث عن أشخاص، فيديوهات، ولايات، تقاليد زواج، هاشتاغات...'
                : 'Rechercher personnes, vidéos, wilayas, traditions de mariage, hashtags...'
            }
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-3.5 pl-12 pr-10 rtl:pr-12 rtl:pl-10 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#FF3823] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 rtl:right-auto rtl:left-3 p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 🏷️ Horizontal Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF3823] text-white shadow-md shadow-orange-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{isArabic ? cat.labelAr : cat.labelFr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🔥 Trending Hashtags */}
      <div className="bg-gradient-to-r from-orange-500/5 via-rose-500/5 to-amber-500/5 dark:from-orange-950/20 dark:via-rose-950/20 dark:to-amber-950/20 rounded-3xl p-4 border border-orange-200/50 dark:border-orange-900/30">
        <div className="flex items-center gap-2 mb-2.5">
          <TrendingUp className="w-4 h-4 text-[#FF3823]" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            {isArabic ? 'الهاشتاغات الأكثر رواجاً في الجزائر' : 'Tendances & Hashtags Populaires DZ'}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRENDING_HASHTAGS.map((t, idx) => (
            <button
              key={idx}
              onClick={() => setSearchQuery(t.tag)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-[#FF3823] hover:text-[#FF3823] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span className="text-[#FF3823] font-black">{t.tag}</span>
              <span className="text-[10px] text-slate-400">({t.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 👥 1. Section: Personnes & Profils Compatibles */}
      {(selectedCategory === 'all' || selectedCategory === 'people') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FF3823]" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? 'الأشخاص والمطابقات المقترحة' : 'Personnes & Adhérents Compatibles'}
              </h3>
              <span className="text-xs text-slate-400 font-bold">({matchedUsers.length})</span>
            </div>
            <button
              onClick={() => onSelectTab('discover')}
              className="text-xs font-bold text-[#FF3823] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isArabic ? 'فتح قسم التوافق' : 'Mode Découverte'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {matchedUsers.slice(0, 6).map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3.5 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0 cursor-pointer" onClick={() => onSelectUserForProfile(user)}>
                    <img
                      src={user.avatar}
                      alt={user.pseudo}
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    {user.verified && (
                      <span className="absolute -bottom-1 -right-1 bg-[#38BDF8] text-white p-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">
                        <ShieldCheck className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                      {user.pseudo}, {user.age}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      📍 {user.city} {user.wilayaCode ? `(${user.wilayaCode})` : ''}
                    </p>
                    {user.marriageTimeline && (
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.2 rounded-md">
                        💍 {user.marriageTimeline}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onSelectUserForChat(user)}
                    className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 text-[#FF3823] transition-colors cursor-pointer"
                    title={isArabic ? 'مراسلة' : 'Envoyer un message'}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🎥 2. Section: Shorts & Vidéos */}
      {(selectedCategory === 'all' || selectedCategory === 'videos' || selectedCategory === 'posts') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? 'مقاطع الفيديو والشورطس' : 'Shorts & Vidéos Populaires'}
              </h3>
              <span className="text-xs text-slate-400 font-bold">({matchedPosts.length})</span>
            </div>
            <button
              onClick={() => onSelectTab('feed')}
              className="text-xs font-bold text-[#FF3823] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isArabic ? 'مشاهدة المزيد' : 'Voir le fil social'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {matchedPosts.slice(0, 4).map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectTab('feed')}
                className="group relative aspect-[9/14] rounded-3xl overflow-hidden bg-slate-900 cursor-pointer shadow-md"
              >
                <img
                  src={post.posterUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md text-white p-1.5 rounded-full">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>

                <div className="absolute bottom-3 inset-x-3 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block mb-0.5">
                    #{post.category}
                  </span>
                  <p className="text-xs font-black line-clamp-2 leading-snug">{post.title}</p>
                  <p className="text-[10px] text-slate-300 mt-1 flex items-center gap-1">
                    <span>❤️ {post.likesCount}</span>
                    <span>• {post.authorPseudo}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 👥 3. Section: Groupes Salhiya & Communautés */}
      {(selectedCategory === 'all' || selectedCategory === 'groups') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? 'المجموعات وصالونات النقاش' : 'Groupes Salhiya & Communautés'}
              </h3>
            </div>
            <button
              onClick={() => onSelectTab('communities')}
              className="text-xs font-bold text-[#FF3823] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isArabic ? 'صالون الصالحية' : 'Accéder au Salon'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchedGroups.map((grp) => (
              <div
                key={grp.id}
                onClick={() => onSelectTab('communities')}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3.5 flex items-center gap-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <img
                  src={grp.image}
                  alt={grp.titleFr}
                  className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-[#FF3823] transition-colors line-clamp-1">
                    {isArabic ? grp.titleAr : grp.titleFr}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>📍 {grp.wilaya}</span>
                    <span>• {grp.membersCount} membres</span>
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                    {isArabic ? 'انضمام فوري' : 'Rejoindre le groupe'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🇩🇿 4. Section: Exploration des 69 Wilayas */}
      {(selectedCategory === 'all' || selectedCategory === 'wilayas') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? 'استكشاف حسب الولايات الـ 69' : 'Explorer l’Algérie par Wilaya (DZ 01 à 69)'}
              </h3>
            </div>
            <button
              onClick={() => onSelectTab('customs')}
              className="text-xs font-bold text-[#FF3823] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isArabic ? 'دليل التقاليد' : 'Guide des traditions'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {matchedWilayas.map((wilaya) => (
              <button
                key={wilaya.code}
                onClick={() => {
                  setSelectedWilayaFilter(wilaya.code);
                  setSelectedCategory('people');
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 text-left rtl:text-right hover:border-[#FF3823] transition-all group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-[#FF3823] bg-orange-50 dark:bg-orange-950/60 px-1.5 py-0.5 rounded-md">
                    {wilaya.code}
                  </span>
                  <MapPin className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#FF3823] transition-colors" />
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {isArabic ? wilaya.arabicName : wilaya.name}
                </h4>
                <p className="text-[10px] text-slate-400">{wilaya.region}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
