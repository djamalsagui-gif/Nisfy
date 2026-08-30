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
  ShoppingBag,
  Store,
  Tag,
  Truck,
  Eye,
} from 'lucide-react';
import { UserProfile, MatchRelation } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { calculateCompatibilityScore } from '../utils/matchingAlgorithm';
import { INITIAL_SHOP_PRODUCTS, ShopProduct } from '../data/youthShopData';
import { INITIAL_WEDDING_VENDORS } from '../data/weddingVendorsData';

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

  // 1. High compatibility recommendations with unique IDs
  const recommendedProfiles = React.useMemo(() => {
    const seen = new Set<string>();
    return allUsers
      .filter((u) => {
        if (!u || !u.id || seen.has(u.id) || u.id === currentUser.id) return false;
        if ((currentUser.blockedUsers || []).includes(u.id)) return false;
        seen.add(u.id);
        return true;
      })
      .map((u) => ({
        user: u,
        compatibility: calculateCompatibilityScore(currentUser, u),
      }))
      .sort((a, b) => b.compatibility.score - a.compatibility.score)
      .slice(0, 6);
  }, [allUsers, currentUser]);

  // 2. Showcase Products with direct visible prices
  const showcaseProducts = React.useMemo(() => {
    return INITIAL_SHOP_PRODUCTS.slice(0, 6);
  }, []);

  // 3. Showcase Certified Wedding Vendors with explicit starting prices
  const showcaseVendors = React.useMemo(() => {
    return INITIAL_WEDDING_VENDORS.slice(0, 4);
  }, []);

  // 4. User Goal / Profile Completion Check
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
    <div className="space-y-7 pb-12 animate-in fade-in duration-300">
      {/* 🌟 1. Warm Greeting & Quick Action Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-5 sm:p-7 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-[#FF3823]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {isArabic ? 'واجهة نصفي المباشرة' : 'Vitrine Directe Nisfy'}
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
                ? 'كل شيء في متناول يدك: المنتجات، الأسعار واضحة، التوافقات الجادة وخدمات الأعراس بدون وسيط تجاري.'
                : 'Tout est à portée de main : articles, prix affichés en clair, profils compatibles et prestataires mariage sans intermédiaire.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onSelectTab('shop')}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isArabic ? 'سوق المنتجات (الأسعار مباشرة)' : 'Vitrine Produits & Prix'}</span>
            </button>
            <button
              onClick={() => onSelectTab('discover')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>{isArabic ? 'التوافقات' : 'Rencontres'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🛍️ 2. VITRINE E-COMMERCE : PRODUITS & PRIX DIRECTS */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                {isArabic ? '🛍️ واجهة المنتجات والأسعار المعروضة' : '🛍️ Vitrine Produits & Prix Affichés'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'تصفح مباشرة دون تعقيد - الأسعار بالدينار الجزائري والتوصيل متوفر' : 'Accès instantané aux articles avec prix clairs en DZD et livraison rapide'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('shop')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{isArabic ? 'كل المنتجات' : 'Voir toute la boutique'}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        {/* 6 Showcase Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {showcaseProducts.map((product) => {
            const hasDiscount = !!product.discountPriceDzd;
            const price = product.discountPriceDzd || product.priceDzd;

            return (
              <div
                key={product.id}
                onClick={() => onSelectTab('shop')}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={product.images[0]}
                      alt={product.titleFr}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {hasDiscount && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-600 text-white shadow-xs">
                        PROMO
                      </span>
                    )}
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-slate-950/75 backdrop-blur-xs text-white text-[9px] font-bold">
                      {product.sellerWilaya}
                    </span>
                  </div>

                  <div className="p-3">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {isArabic ? product.titleAr : product.titleFr}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {product.sellerName}
                    </p>
                  </div>
                </div>

                <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-1 flex items-center justify-between">
                  <div>
                    <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {price.toLocaleString()} DZD
                    </span>
                    {hasDiscount && (
                      <span className="block text-[9px] text-slate-400 line-through">
                        {product.priceDzd.toLocaleString()} DZD
                      </span>
                    )}
                  </div>
                  <span className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-xs font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    +
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🏰 3. VITRINE PRESTATAIRES DE MARIAGE & TARIFS */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Store className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                {isArabic ? '🏰 قاعات الحفلات وخدمات الأعراس (الأسعار مباشرة)' : '🏰 Prestataires Mariage & Tarifs de Base'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'قاعات، أزياء تقليدية، وتصوير بأسعار شفافة وبدون تعقيد' : 'Salles, neggafas et photographes avec tarifs indicatifs affichés'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('marketplace')}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{isArabic ? 'عرض كل القاعات' : 'Voir l’annuaire complet'}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {showcaseVendors.map((vendor) => (
            <div
              key={vendor.id}
              onClick={() => onSelectTab('marketplace')}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-16/9 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={vendor.photos[0]}
                    alt={vendor.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white">
                    📍 {vendor.wilayaName} ({vendor.wilayaCode})
                  </span>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-amber-500 text-white text-[10px] font-extrabold shadow-sm">
                    {vendor.rating} ★
                  </span>
                </div>

                <div className="p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                      {vendor.name}
                    </h4>
                    {vendor.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {vendor.category === 'salle_fetes' ? '🏰 Salles des Fêtes' :
                     vendor.category === 'neggafa_tenues' ? '👑 Neggafa & Tenues' :
                     vendor.category === 'photographe_video' ? '📸 Photographes & Vidéo' :
                     vendor.category === 'traiteur_repas' ? '🍲 Traiteurs & Repas' : '✨ Prestataire Mariage'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    {isArabic ? 'السعر التقديري' : 'Tarif à partir de'}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400">
                    {vendor.priceStartingAt || vendor.priceRange}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTab('marketplace');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-amber-500 group-hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                >
                  {isArabic ? 'طلب تسعيرة' : 'Devis direct'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ❤️ 4. VITRINE RENCONTRE & COMPATIBILITÉS */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-[#FF3823] flex items-center justify-center font-bold">
              <Heart className="w-4.5 h-4.5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {isArabic ? 'توصيات التوافق الذكي لليوم' : 'Recommandations Intelligentes du Jour'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'ملفات جادة مع مؤشر التوافق الحقيقي' : 'Profils vérifiés selon vos critères de mariage'}
              </p>
            </div>
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
                      referrerPolicy="no-referrer"
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
    </div>
  );
}
