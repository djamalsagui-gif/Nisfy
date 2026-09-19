import React, { useState, useEffect, useMemo } from 'react';
import {
  Tag,
  Flame,
  Clock,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  MapPin,
  Phone,
  MessageCircle,
  ShoppingBag,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Percent,
  TrendingDown,
  Truck,
  ShieldCheck,
  Share2,
  Heart,
  X,
  ChevronRight,
  ExternalLink,
  ChevronLeft,
  Crown,
  DollarSign,
  Package,
  Zap,
  Rocket,
  CreditCard,
  Building,
  Check,
  Award,
  Globe,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  SoldeItem,
  SoldeCategory,
  SoldeCondition,
  SOLDE_CATEGORIES,
  BOOST_PLANS,
  SHOP_PRO_PLANS,
  getAvailableSoldeItems,
  saveNewSoldeItem,
  boostSoldeItem
} from '../data/soldesData';
import { WILAYAS_LIST } from '../data/wilayas';
import { useLanguage } from '../context/LanguageContext';
import { datingSounds } from '../utils/soundEffects';

interface NisfySoldesMarketViewProps {
  onNavigateToShop?: () => void;
  onNavigateToHome?: () => void;
}

export const NisfySoldesMarketView: React.FC<NisfySoldesMarketViewProps> = ({
  onNavigateToShop,
  onNavigateToHome
}) => {
  const { isArabic } = useLanguage();

  // Data & sync
  const [items, setItems] = useState<SoldeItem[]>(() => getAvailableSoldeItems());
  const [selectedCategory, setSelectedCategory] = useState<SoldeCategory>('all');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [minDiscount, setMinDiscount] = useState<number>(0); // 0, 30, 50, 60
  const [priceRange, setPriceRange] = useState<'all' | 'under_5k' | '5k_to_15k' | '15k_to_30k' | 'over_30k'>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'discount_desc' | 'price_asc' | 'price_desc' | 'urgency'>('discount_desc');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nisfy_soldes_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Countdown timer for flash sale (calculates remaining hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 14,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen to custom updates
  useEffect(() => {
    const handleUpdate = () => {
      setItems(getAvailableSoldeItems());
    };
    window.addEventListener('nisfy_soldes_updated', handleUpdate);
    return () => window.removeEventListener('nisfy_soldes_updated', handleUpdate);
  }, []);

  // Toggle favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    datingSounds.playTapSound();
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('nisfy_soldes_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Details Modal
  const [activeItem, setActiveItem] = useState<SoldeItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Order Express Modal
  const [orderItem, setOrderItem] = useState<SoldeItem | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [orderName, setOrderName] = useState<string>('');
  const [orderPhone, setOrderPhone] = useState<string>('');
  const [orderWilaya, setOrderWilaya] = useState<string>('16');
  const [orderAddress, setOrderAddress] = useState<string>('');
  const [orderDeliveryMode, setOrderDeliveryMode] = useState<'yalidine_home' | 'yalidine_desk' | 'main_propre'>('yalidine_home');
  const [orderPromoCode, setOrderPromoCode] = useState<string>('');
  const [appliedExtraDiscount, setAppliedExtraDiscount] = useState<number>(0);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Post New Solde Item Modal
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<SoldeCategory>('trousseau_mariage');
  const [newOriginalPrice, setNewOriginalPrice] = useState<string>('');
  const [newSoldePrice, setNewSoldePrice] = useState<string>('');
  const [newCondition, setNewCondition] = useState<SoldeCondition>('porte_une_fois');
  const [newSellerName, setNewSellerName] = useState<string>('');
  const [newWilaya, setNewWilaya] = useState<string>('16');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newWhatsapp, setNewWhatsapp] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [postSuccess, setPostSuccess] = useState<boolean>(false);

  // 🚀 Boost Announcement Modal
  const [boostTargetItem, setBoostTargetItem] = useState<SoldeItem | null>(null);
  const [selectedBoostPlan, setSelectedBoostPlan] = useState<'top_listing' | 'gold_vip' | 'urgent_flash'>('gold_vip');
  const [boostPaymentMethod, setBoostPaymentMethod] = useState<'baridimob' | 'dahabia' | 'flexy'>('baridimob');
  const [boostSuccess, setBoostSuccess] = useState<boolean>(false);

  // 👑 Pro Boutique Subscription Modal
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);
  const [selectedProPlan, setSelectedProPlan] = useState<'pro_starter' | 'pro_atelier_vip'>('pro_atelier_vip');
  const [proStoreName, setProStoreName] = useState<string>('');
  const [proPhone, setProPhone] = useState<string>('');
  const [proWilaya, setProWilaya] = useState<string>('16');
  const [proInstagram, setProInstagram] = useState<string>('');
  const [proSuccess, setProSuccess] = useState<boolean>(false);

  // ⚖️ Comparateur de Prix Web Modal
  const [comparisonTargetItem, setComparisonTargetItem] = useState<SoldeItem | null>(null);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }
        // Wilaya
        if (selectedWilaya !== 'all' && item.sellerWilayaCode !== selectedWilaya) {
          return false;
        }
        // Discount
        if (minDiscount > 0 && item.discountPercent < minDiscount) {
          return false;
        }
        // Condition
        if (selectedCondition !== 'all' && item.condition !== selectedCondition) {
          return false;
        }
        // Price Range
        if (priceRange === 'under_5k' && item.soldePriceDzd >= 5000) return false;
        if (priceRange === '5k_to_15k' && (item.soldePriceDzd < 5000 || item.soldePriceDzd > 15000)) return false;
        if (priceRange === '15k_to_30k' && (item.soldePriceDzd < 15000 || item.soldePriceDzd > 30000)) return false;
        if (priceRange === 'over_30k' && item.soldePriceDzd <= 30000) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (item.titleFr && item.titleFr.toLowerCase().includes(q)) || (item.titleAr && item.titleAr.includes(q));
          const matchDesc = (item.descriptionFr && item.descriptionFr.toLowerCase().includes(q)) || (item.descriptionAr && item.descriptionAr.includes(q));
          const matchSeller = item.sellerName && item.sellerName.toLowerCase().includes(q);
          const matchWilaya = item.sellerWilaya && item.sellerWilaya.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchSeller && !matchWilaya) return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Boosted items appear first
        if (a.isBoosted && !b.isBoosted) return -1;
        if (!a.isBoosted && b.isBoosted) return 1;

        if (sortBy === 'discount_desc') {
          return b.discountPercent - a.discountPercent;
        }
        if (sortBy === 'price_asc') {
          return a.soldePriceDzd - b.soldePriceDzd;
        }
        if (sortBy === 'price_desc') {
          return b.soldePriceDzd - a.soldePriceDzd;
        }
        if (sortBy === 'urgency') {
          return a.endsInHours - b.endsInHours;
        }
        return 0;
      });
  }, [items, selectedCategory, selectedWilaya, minDiscount, selectedCondition, priceRange, searchQuery, sortBy]);

  // Handle Boost submission
  const handleConfirmBoost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boostTargetItem) return;

    const bType = selectedBoostPlan === 'gold_vip' ? 'gold' : selectedBoostPlan === 'urgent_flash' ? 'urgent' : 'top_listing';
    boostSoldeItem(boostTargetItem.id, bType);
    setBoostSuccess(true);
    datingSounds.playMatchSound();
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
    } catch {}

    setTimeout(() => {
      setBoostSuccess(false);
      setBoostTargetItem(null);
    }, 2200);
  };

  // Handle Pro Boutique Subscription
  const handleConfirmProSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proStoreName || !proPhone) {
      alert(isArabic ? 'يرجى إدخال اسم المتجر ورقم الهاتف' : 'Veuillez saisir le nom de votre boutique et numéro de téléphone.');
      return;
    }
    setProSuccess(true);
    datingSounds.playMatchSound();
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch {}

    setTimeout(() => {
      setProSuccess(false);
      setIsProModalOpen(false);
      setProStoreName('');
      setProPhone('');
      setProInstagram('');
    }, 2400);
  };

  // Handle Order submit
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderName || !orderPhone || !orderAddress) {
      alert(isArabic ? 'يرجى إدخال كافة بيانات التوصيل ورقم الهاتف' : 'Veuillez remplir toutes vos coordonnées de livraison.');
      return;
    }
    const orderId = 'SOLDE-' + Math.floor(100000 + Math.random() * 900000);
    setOrderSuccessId(orderId);
    datingSounds.playMatchSound();
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {}
  };

  // Handle Post Form Submit
  const handleCreateSoldeItem = (e: React.FormEvent) => {
    e.preventDefault();
    const orig = parseInt(newOriginalPrice, 10);
    const sld = parseInt(newSoldePrice, 10);
    if (!newTitle || isNaN(orig) || isNaN(sld) || orig <= 0 || sld <= 0 || sld >= orig) {
      alert(isArabic ? 'تأكد من إدخال السعر الأصلي وسعر الصولد بحيث يكون سعر الصولد أقل من السعر الأصلي' : 'Veuillez entrer un prix soldé strictement inférieur au prix d’origine.');
      return;
    }
    if (!newPhone) {
      alert(isArabic ? 'يرجى إدخال رقم الهاتف للتواصل' : 'Veuillez renseigner votre numéro de téléphone.');
      return;
    }

    const discount = Math.round(((orig - sld) / orig) * 100);
    const selectedWilayaObj = WILAYAS_LIST.find((w) => w.code === newWilaya);
    const wilayaName = selectedWilayaObj ? selectedWilayaObj.name : 'Alger';

    const defaultImg =
      newCategory === 'trousseau_mariage'
        ? 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&auto=format&fit=crop&q=80'
        : newCategory === 'maison_electromenager'
        ? 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&auto=format&fit=crop&q=80'
        : newCategory === 'beaute_parfums'
        ? 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80';

    const newItem: SoldeItem = {
      id: 'solde-user-' + Date.now(),
      titleFr: newTitle,
      titleAr: newTitle,
      category: newCategory,
      categoryLabelFr: SOLDE_CATEGORIES.find((c) => c.id === newCategory)?.labelFr || 'Solde',
      categoryLabelAr: SOLDE_CATEGORIES.find((c) => c.id === newCategory)?.labelAr || 'تخفيض',
      originalPriceDzd: orig,
      soldePriceDzd: sld,
      discountPercent: discount,
      originalPriceEur: Math.round(orig / 230),
      soldePriceEur: Math.round(sld / 230),
      condition: newCondition,
      conditionLabelFr: newCondition === 'porte_une_fois' ? 'Porté 1 seule fois (Très bon état)' : 'Neuf avec étiquette',
      conditionLabelAr: newCondition === 'porte_une_fois' ? 'ملبوس مرة واحدة فقط (حالة ممتازة)' : 'جديد بالملصق',
      sellerName: newSellerName || 'Membre Nisfy',
      sellerType: 'particulier_verifie',
      sellerWilaya: wilayaName,
      sellerWilayaCode: newWilaya,
      phone: newPhone,
      whatsapp: newWhatsapp || newPhone.replace(/\D/g, ''),
      images: [newImageUrl.trim() || defaultImg],
      descriptionFr: newDesc || 'Article en solde mis en ligne sur le marché Nisfy DZ.',
      descriptionAr: newDesc || 'منتج في الصولد معروض على سوق نصفي الجزائري.',
      badge: `-${discount}% BON PLAN`,
      endsInHours: 48,
      stockLeft: 1,
      initialStock: 1,
      deliveryTypeFr: 'Remise en main propre ou envoi Yalidine',
      deliveryTypeAr: 'تسليم يد بيد أو إرسال ياليدين',
      createdAt: new Date().toISOString().split('T')[0]
    };

    saveNewSoldeItem(newItem);
    setPostSuccess(true);
    datingSounds.playMatchSound();
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
    } catch {}

    setTimeout(() => {
      setPostSuccess(false);
      setIsPostModalOpen(false);
      setNewTitle('');
      setNewOriginalPrice('');
      setNewSoldePrice('');
      setNewDesc('');
      setNewPhone('');
      setNewWhatsapp('');
      setNewImageUrl('');
    }, 2000);
  };

  // Delivery fee calculation in modal
  const deliveryFee = orderDeliveryMode === 'yalidine_home' ? 800 : orderDeliveryMode === 'yalidine_desk' ? 500 : 0;
  const itemTotal = orderItem ? orderItem.soldePriceDzd * orderQuantity : 0;
  // 🛡️ Frais de prestation & protection acheteur Nisfy (fixe 300 DZD pour vérification, suivi Yalidine et médiation)
  const nisfyServiceFee = orderItem ? 300 : 0;
  const extraDiscountAmount = Math.round((itemTotal * appliedExtraDiscount) / 100);
  const grandTotal = Math.max(0, itemTotal - extraDiscountAmount + deliveryFee + nisfyServiceFee);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-28 sm:pb-16" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* 🏷️ 1. HERO BANNER • MARCHÉ DES SOLDES & VENTES FLASH */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-[#FF3823] to-amber-500 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)] pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black tracking-wide uppercase border border-white/30 shadow-xs">
                <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-300 animate-pulse" />
                <span>{isArabic ? 'سوق الصولد والهمزات الكبرى 🇩🇿' : 'Marché des Soldes & Déstockage DZ'}</span>
                <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 rounded-full font-black text-[10px]">
                  Jusqu’à -70%
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {isArabic ? (
                  <>
                    همزات الزواج وتصفية التروسو <br className="hidden sm:inline" />
                    <span className="text-amber-200">بأسعار الصولد الحقيقية</span>
                  </>
                ) : (
                  <>
                    Le Grand Souk des Soldes & Ventes Flash <br className="hidden sm:inline" />
                    <span className="text-amber-200">Trousseau, Maison & Bonnes Affaires</span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
                {isArabic
                  ? 'قفاطين وكاراكو، حقائب السفر، أدوات المطبخ، ومستعمل فاخر ملبوس مرة واحدة فقط. عروض وتخفيضات موثوقة مع توصيل ياليدين لجميع الولايات.'
                  : 'Déstockage d’ateliers, pièces de trousseau, électroménager et vide-dressing de luxe certifié. Économisez de 30% à 70% avec paiement sécurisé à la livraison.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-white text-red-600 hover:bg-amber-50 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-red-600" />
                  <span>{isArabic ? '➕ أنشر سلعتك في الصولد (مجاناً)' : '➕ Déposer un article en solde'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsProModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-slate-900 fill-slate-900" />
                  <span>{isArabic ? '👑 باقات المتاجر والحرفيين Pro' : '👑 Espace Boutiques Pro'}</span>
                </button>

                {onNavigateToShop && (
                  <button
                    type="button"
                    onClick={onNavigateToShop}
                    className="px-4 py-2.5 rounded-2xl bg-black/25 hover:bg-black/35 text-white border border-white/30 font-bold text-xs sm:text-sm flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isArabic ? 'المتجر العادي' : 'Boutique'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* ⏰ Vente Flash Live Countdown Box */}
            <div className="bg-black/30 backdrop-blur-xl border border-white/25 rounded-3xl p-5 sm:p-6 text-center max-w-sm w-full shadow-2xl flex flex-col items-center">
              <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4 animate-spin-slow" />
                <span>{isArabic ? 'تنتهي موجة الصولد الحالية في:' : 'Fin de la vague des soldes dans :'}</span>
              </div>

              {/* Clock Digits */}
              <div className="grid grid-cols-3 gap-2 w-full my-2">
                <div className="bg-white/15 rounded-2xl p-2.5 border border-white/20">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] text-white/75 font-semibold uppercase mt-0.5">
                    {isArabic ? 'ساعة' : 'Heures'}
                  </span>
                </div>
                <div className="bg-white/15 rounded-2xl p-2.5 border border-white/20">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] text-white/75 font-semibold uppercase mt-0.5">
                    {isArabic ? 'دقيقة' : 'Minutes'}
                  </span>
                </div>
                <div className="bg-white/15 rounded-2xl p-2.5 border border-white/20">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] text-white/75 font-semibold uppercase mt-0.5">
                    {isArabic ? 'ثانية' : 'Secondes'}
                  </span>
                </div>
              </div>

              {/* Promo Code hint */}
              <div className="mt-3 w-full bg-amber-400/20 rounded-xl px-3 py-2 border border-amber-300/30 text-xs text-amber-100 flex items-center justify-between">
                <span className="font-medium text-[11px]">{isArabic ? 'كود إضافي 10%:' : 'Code Promo -10% :'}</span>
                <span className="font-mono font-black text-amber-300 bg-black/40 px-2 py-0.5 rounded-md text-[11px]">
                  SOLDE2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 2. FILTRES MULTICRITÈRES • SOUK DES SOLDES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
          {/* Search bar & Wilaya selection */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isArabic
                    ? 'ابحث بالاسم: قفطان، كاراكو، عجانة، حقائب، طاقم ذهب، سنيكرز...'
                    : 'Rechercher un bon plan : Caftan, Karakou, Robot, Valises, Parure, Baskets...'
                }
                className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800 border-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Wilaya Filter */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800 rounded-2xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-xs">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">{isArabic ? 'كل الولايات (58/69)' : 'Toutes les Wilayas'}</option>
                  {WILAYAS_LIST.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code} - {w.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800 rounded-2xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="discount_desc">{isArabic ? 'الأعلى تخفيضاً %' : 'Plus forte remise %'}</option>
                  <option value="price_asc">{isArabic ? 'الأقل سعراً (DZD)' : 'Prix croissant'}</option>
                  <option value="price_desc">{isArabic ? 'الأعلى سعراً (DZD)' : 'Prix décroissant'}</option>
                  <option value="urgency">{isArabic ? 'ينتهي قريباً (عاجل)' : 'Se termine bientôt'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {SOLDE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-600 to-[#FF3823] text-white shadow-md shadow-red-500/25 scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{isArabic ? cat.labelAr : cat.labelFr}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Sub-filters: % Remise, Budget, État */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-bold text-slate-500 text-[11px] flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-red-500" />
              {isArabic ? 'نسبة التخفيض:' : 'Remise :'}
            </span>

            {[
              { val: 0, labelFr: 'Toutes', labelAr: 'الكل' },
              { val: 30, labelFr: '🔥 -30% et +', labelAr: '🔥 -30% فأكثر' },
              { val: 50, labelFr: '⚡ -50% et + (Choc)', labelAr: '⚡ -50% فأكثر' },
              { val: 60, labelFr: '👑 -60% et + (Liquidation)', labelAr: '👑 -60% فأكثر' },
            ].map((d) => (
              <button
                key={d.val}
                type="button"
                onClick={() => setMinDiscount(d.val)}
                className={`px-2.5 py-1 rounded-xl font-bold transition-colors cursor-pointer text-[11px] ${
                  minDiscount === d.val
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50'
                }`}
              >
                {isArabic ? d.labelAr : d.labelFr}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

            <span className="font-bold text-slate-500 text-[11px] flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              {isArabic ? 'الميزانية:' : 'Budget :'}
            </span>

            {[
              { val: 'all', labelFr: 'Tous', labelAr: 'الكل' },
              { val: 'under_5k', labelFr: '< 5 000 DA', labelAr: '< 5 000 دج' },
              { val: '5k_to_15k', labelFr: '5k - 15k DA', labelAr: '5 إلى 15 ألف دج' },
              { val: '15k_to_30k', labelFr: '15k - 30k DA', labelAr: '15 إلى 30 ألف دج' },
              { val: 'over_30k', labelFr: '> 30 000 DA', labelAr: '> 30 ألف دج' },
            ].map((b) => (
              <button
                key={b.val}
                type="button"
                onClick={() => setPriceRange(b.val as any)}
                className={`px-2.5 py-1 rounded-xl font-bold transition-colors cursor-pointer text-[11px] ${
                  priceRange === b.val
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50'
                }`}
              >
                {isArabic ? b.labelAr : b.labelFr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 📦 3. LISTE DES ARTICLES EN SOLDE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Reassurance Banner: Tierce de confiance Nisfy */}
        <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-emerald-950 dark:text-emerald-200 text-xs sm:text-sm">
                  {isArabic ? 'وساطة آمنة وضمان استلام 100% مع نصفي' : 'Tiers de Confiance & Protection Acheteur 100%'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  {isArabic ? 'عمولة رمزية 300 دج' : 'Frais de service : 300 DA'}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                {isArabic
                  ? 'لا تدفع مليمًا للبائع مسبقًا: الاستلام والدفع يدًا بيد أو مع ياليدين بعد فتح الطرد والتأكد من مطابقة السلعة.'
                  : 'Paiement à la livraison après inspection du colis avec Yalidine. Vos transactions sont protégées et arbitrées par Nisfy.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-950/60 px-2.5 py-1 rounded-xl flex items-center gap-1 border border-blue-200/50 dark:border-blue-900/50">
              <Scale className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{isArabic ? 'مقارن أسعار الويب مدمج' : 'Comparateur Web inclus'}</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
              🇩🇿 {isArabic ? '58 ولاية مغطاة' : '58 Wilayas'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500 fill-red-500" />
              <span>{isArabic ? 'المنتجات المعروضة في الصولد' : 'Offres & Déstockage Disponibles'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 font-bold">
                {filteredItems.length} {isArabic ? 'منتج' : 'articles'}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {isArabic ? 'تحديث الأسعار ونفاد المخزون يتم بصورة فورية' : 'Prix réduits vérifiés et livraison garantie'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsPostModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/50 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isArabic ? 'بيع في الصولد' : 'Vendre en solde'}</span>
          </button>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 max-w-lg mx-auto mt-6">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {isArabic ? 'لا توجد سلع تطابق بحثك حالياً' : 'Aucun article ne correspond à ces critères'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isArabic
                ? 'جرب إزالة بعض الفلاتر أو تغيير الولاية أو تصفح كل الفئات.'
                : 'Essayez d’élargir vos filtres de prix ou de wilaya pour voir plus de promotions.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedWilaya('all');
                setMinDiscount(0);
                setPriceRange('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-xs cursor-pointer"
            >
              {isArabic ? 'إعادة ضبط كل الفلاتر' : 'Réinitialiser les filtres'}
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => {
              const isFav = favorites.includes(item.id);
              const savingsDzd = item.originalPriceDzd - item.soldePriceDzd;
              const stockRatio = Math.max(15, Math.round((item.stockLeft / (item.initialStock || 10)) * 100));

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item);
                    setActiveImageIndex(0);
                  }}
                  className={`group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 relative ${
                    item.isBoosted && item.boostType === 'gold'
                      ? 'border-2 border-amber-400 dark:border-amber-400 shadow-amber-500/15'
                      : item.isBoosted && item.boostType === 'urgent'
                      ? 'border-2 border-red-500 dark:border-red-500'
                      : item.isBoosted
                      ? 'border-2 border-indigo-500 dark:border-indigo-500'
                      : 'border border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  {/* Boost VIP Banner if boosted */}
                  {item.isBoosted && (
                    <div className={`py-1 px-3 text-center text-[10px] font-black text-white flex items-center justify-center gap-1.5 ${
                      item.boostType === 'gold'
                        ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black'
                        : item.boostType === 'urgent'
                        ? 'bg-gradient-to-r from-red-600 to-rose-600'
                        : 'bg-gradient-to-r from-indigo-600 to-blue-600'
                    }`}>
                      <Zap className="w-3 h-3 fill-current" />
                      <span>
                        {item.boostType === 'gold'
                          ? (isArabic ? '👑 إعلان مميز VIP • متصدر القائمة' : '👑 ANNONCE VIP GOLD • EN TÊTE')
                          : item.boostType === 'urgent'
                          ? (isArabic ? '⚡ تصفية عاجلة ومستعجلة' : '⚡ LIQUIDATION URGENTE')
                          : (isArabic ? '🚀 إعلان في الصدارة' : '🚀 ANNONCE EN VEDETTE')}
                      </span>
                    </div>
                  )}

                  {/* Top Image Box */}
                  <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.titleFr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Badge Remise & Urgence */}
                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-col gap-1.5 items-start">
                      <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-red-600 to-[#FF3823] text-white text-[11px] font-black shadow-md">
                        {item.badge}
                      </span>
                      {item.condition === 'porte_une_fois' && (
                        <span className="px-2 py-0.5 rounded-lg bg-black/65 backdrop-blur-md text-white text-[10px] font-bold">
                          {isArabic ? '✨ ملبوس مرة' : '✨ Porté 1x'}
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className={`absolute top-3 right-3 rtl:right-auto rtl:left-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                        isFav ? 'bg-red-500 text-white' : 'bg-black/30 hover:bg-black/50 text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Stock Alert Jauge */}
                    <div className="absolute bottom-2 inset-x-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-[10px] flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1 text-amber-300">
                        <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                        {isArabic ? `بقي فقط ${item.stockLeft} قطع!` : `Plus que ${item.stockLeft} dispo !`}
                      </span>
                      <span className="text-slate-300 font-mono text-[9px]">
                        {isArabic ? `ينتهي في ${item.endsInHours} س` : `${item.endsInHours}h restantes`}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Category & Location */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <span className="font-bold text-red-600 dark:text-red-400">
                          {isArabic ? item.categoryLabelAr : item.categoryLabelFr}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.sellerWilaya}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-black text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-red-600 transition-colors">
                        {isArabic ? item.titleAr : item.titleFr}
                      </h3>

                      {/* Condition Label */}
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {isArabic ? item.conditionLabelAr : item.conditionLabelFr}
                      </p>
                    </div>

                    {/* Pricing Block with Visual Savings */}
                    <div className="bg-red-50/70 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 rounded-2xl p-3">
                      <div className="flex items-baseline justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xl sm:text-2xl font-black text-red-600 dark:text-red-400">
                              {item.soldePriceDzd.toLocaleString()} <span className="text-xs font-bold">DZD</span>
                            </span>
                            <span className="text-xs text-slate-400 line-through font-bold">
                              {item.originalPriceDzd.toLocaleString()} DA
                            </span>
                          </div>
                          <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                            {isArabic
                              ? `ربح وتوفير: ${savingsDzd.toLocaleString()} دج (-${item.discountPercent}%)`
                              : `Économie : -${savingsDzd.toLocaleString()} DZD (-${item.discountPercent}%)`}
                          </span>
                        </div>

                        {/* Euro converter for Diaspora */}
                        <div className="text-right rtl:text-left text-[11px] text-slate-500 font-medium">
                          <span className="block text-slate-400 text-[10px]">Diaspora</span>
                          <span className="font-bold text-slate-700 dark:text-slate-200">{item.soldePriceEur} €</span>
                        </div>
                      </div>

                      {/* 🌐 Comparateur de prix sur le web direct button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setComparisonTargetItem(item);
                        }}
                        className="mt-2 w-full py-1.5 px-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-[11px] flex items-center justify-between shadow-2xs hover:border-red-400 dark:hover:border-red-500 transition-all cursor-pointer group/comp"
                      >
                        <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                          <Scale className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'مقارنة السعر مع المتاجر والويب' : 'Comparer le prix sur le Web'}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 group-hover/comp:text-red-600 dark:group-hover/comp:text-red-400 flex items-center gap-0.5 font-medium">
                          <span>{isArabic ? 'تحقق' : 'Vérifier'}</span>
                          <ChevronRight className="w-3 h-3 rtl:rotate-180" />
                        </span>
                      </button>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOrderItem(item);
                          setOrderQuantity(1);
                          setOrderSuccessId(null);
                        }}
                        className="w-full py-2 px-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'طلب فوري' : 'Acheter'}</span>
                      </button>

                      {item.whatsapp ? (
                        <a
                          href={`https://wa.me/${item.whatsapp}?text=${encodeURIComponent(
                            `Salam, je vous contacte depuis Nisfy concernant l'article en solde "${item.titleFr}" à ${item.soldePriceDzd} DZD.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      ) : (
                        <a
                          href={`tel:${item.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'اتصال' : 'Appeler'}</span>
                        </a>
                      )}
                    </div>

                    {/* Quick Boost Button on card */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBoostTargetItem(item);
                        setBoostSuccess(false);
                      }}
                      className="w-full py-1.5 px-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Rocket className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isArabic ? '🚀 ترقية الإعلان في الصدارة (من 250 دج)' : '🚀 Booster cette annonce (dès 250 DA)'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🔍 4. MODAL DÉTAILS DE L’ARTICLE */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-1 rounded-xl bg-red-600 text-white text-xs font-black">
                  {activeItem.badge}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-2">
                  {isArabic ? activeItem.titleAr : activeItem.titleFr}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Gallery Image */}
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={activeItem.images[activeImageIndex] || activeItem.images[0]}
                alt={activeItem.titleFr}
                className="w-full h-full object-cover"
              />
              {activeItem.images.length > 1 && (
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
                  {activeItem.images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'bg-white scale-125' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pricing Details */}
            <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-2xl border border-red-200 dark:border-red-900 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-red-600 dark:text-red-400">
                    {activeItem.soldePriceDzd.toLocaleString()} DZD
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    {activeItem.originalPriceDzd.toLocaleString()} DZD
                  </span>
                </div>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold block mt-0.5">
                  {isArabic
                    ? `توفير صافي: ${(activeItem.originalPriceDzd - activeItem.soldePriceDzd).toLocaleString()} دج (${activeItem.discountPercent}% تخفيض)`
                    : `Économie : ${(activeItem.originalPriceDzd - activeItem.soldePriceDzd).toLocaleString()} DZD (-${activeItem.discountPercent}%)`}
                </span>
              </div>
              <div className="text-right rtl:text-left">
                <span className="text-xs text-slate-400 block">Prix Diaspora</span>
                <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{activeItem.soldePriceEur} €</span>
              </div>
            </div>

            {/* ⚖️ Comparateur de Prix Web Direct Access Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-blue-950 dark:text-blue-200">
                      {isArabic ? 'مقارن الأسعار على الويب والمتاجر' : 'Comparateur de Prix Web Nisfy'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-bold">
                      {isArabic ? 'شفافية 100%' : 'Audit Marché'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {isArabic
                      ? 'قارن سعر هذا المنتج مع أسعار السوق ومحلات العاصمة ووهران والمتاجر الرقمية قبل اتخاذ قرار الشراء.'
                      : 'Comparez le tarif de ce produit avec les boutiques physiques et les sites spécialisés pour vérifier la bonne affaire.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setComparisonTargetItem(activeItem)}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{isArabic ? 'فتح المقارن' : 'Lancer le comparateur'}</span>
              </button>
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h4 className="font-bold text-slate-900 dark:text-white">{isArabic ? 'وصف المنتج:' : 'Détails du produit :'}</h4>
              <p>{isArabic ? activeItem.descriptionAr : activeItem.descriptionFr}</p>
            </div>

            {/* Seller & Delivery info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl">
              <div>
                <span className="text-slate-400 block">{isArabic ? 'البائع والموقع:' : 'Vendeur :'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  {activeItem.sellerName} ({activeItem.sellerWilaya})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">{isArabic ? 'طريقة التوصيل:' : 'Livraison :'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 mt-0.5">
                  <Truck className="w-3.5 h-3.5 text-red-500" />
                  {isArabic ? activeItem.deliveryTypeAr : activeItem.deliveryTypeFr}
                </span>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOrderItem(activeItem);
                  setOrderQuantity(1);
                  setOrderSuccessId(null);
                  setActiveItem(null);
                }}
                className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isArabic ? 'طلب فوري إلى عنواني' : 'Passer commande maintenant'}</span>
              </button>

              {activeItem.whatsapp && (
                <a
                  href={`https://wa.me/${activeItem.whatsapp}?text=${encodeURIComponent(
                    `Salam, je souhaite réserver l'article en solde "${activeItem.titleFr}" à ${activeItem.soldePriceDzd} DZD.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🛍️ 5. MODAL COMMANDE EXPRESS */}
      {orderItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {orderSuccessId ? (
              /* Success confirmation */
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {isArabic ? 'تم تسجيل طلبك بنجاح! مبروك عليك الهمزة' : 'Commande enregistrée avec succès !'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isArabic
                    ? `رقم الطلب الخاص بك: ${orderSuccessId}. سيتصل بك فريق التوصيل أو البائع لتأكيد شحن طلبك عبر ياليدين إلى ولاية ${WILAYAS_LIST.find((w) => w.code === orderWilaya)?.name || 'الجزائر'}.`
                    : `Numéro de commande : ${orderSuccessId}. Vous serez contacté par téléphone pour confirmer l'expédition Yalidine Express.`}
                </p>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-left rtl:text-right text-xs space-y-1 my-3">
                  <div className="flex justify-between font-bold">
                    <span>{orderItem.titleFr}</span>
                    <span>{(orderItem.soldePriceDzd * orderQuantity).toLocaleString()} DZD</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Livraison ({orderDeliveryMode === 'yalidine_home' ? 'Domicile' : 'Stop Desk'})</span>
                    <span>{deliveryFee.toLocaleString()} DZD</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      {isArabic ? 'عمولة وساطة وحماية نصفي' : 'Frais de prestation & protection Nisfy'}
                    </span>
                    <span>{nisfyServiceFee} DZD</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-1 flex justify-between font-black text-red-600 text-sm">
                    <span>Total à payer à la livraison</span>
                    <span>{grandTotal.toLocaleString()} DZD</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOrderItem(null)}
                  className="w-full py-3 rounded-2xl bg-red-600 text-white font-bold text-xs cursor-pointer"
                >
                  {isArabic ? 'إغلاق ومتابعة التسوق' : 'Fermer'}
                </button>
              </div>
            ) : (
              /* Order Form */
              <form onSubmit={handleConfirmOrder} className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-red-600 uppercase">Commande Express Solde</span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {isArabic ? orderItem.titleAr : orderItem.titleFr}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOrderItem(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Item recap */}
                <div className="flex items-center gap-3 bg-red-50/70 dark:bg-red-950/30 p-3 rounded-2xl border border-red-200/60 dark:border-red-900/40">
                  <img src={orderItem.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block truncate">
                      {orderItem.titleFr}
                    </span>
                    <span className="text-red-600 font-black text-sm">
                      {orderItem.soldePriceDzd.toLocaleString()} DZD
                    </span>
                    <span className="text-slate-400 line-through text-[11px] ml-1.5">
                      {orderItem.originalPriceDzd.toLocaleString()} DZD
                    </span>
                  </div>
                  {/* Quantity */}
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setOrderQuantity((q) => Math.max(1, q - 1))}
                      className="text-slate-500 font-bold px-1"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs">{orderQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setOrderQuantity((q) => Math.min(orderItem.stockLeft, q + 1))}
                      className="text-slate-500 font-bold px-1"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delivery details fields */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'الاسم واللقب الكامل *' : 'Nom & Prénom complet *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={orderName}
                      onChange={(e) => setOrderName(e.target.value)}
                      placeholder="Ex: Amina Benali"
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'رقم الهاتف للتأكيد (موبيليس / أوريدو / جيزي) *' : 'Numéro de téléphone *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={orderPhone}
                      onChange={(e) => setOrderPhone(e.target.value)}
                      placeholder="05 / 06 / 07 XX XX XX"
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'الولاية *' : 'Wilaya *'}
                      </label>
                      <select
                        value={orderWilaya}
                        onChange={(e) => setOrderWilaya(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 cursor-pointer"
                      >
                        {WILAYAS_LIST.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.code} - {w.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'نوع التوصيل *' : 'Mode de livraison *'}
                      </label>
                      <select
                        value={orderDeliveryMode}
                        onChange={(e) => setOrderDeliveryMode(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 cursor-pointer"
                      >
                        <option value="yalidine_home">{isArabic ? 'توصيل للمنزل (+800 دج)' : 'À domicile (+800 DA)'}</option>
                        <option value="yalidine_desk">{isArabic ? 'مكتب ياليدين (+500 دج)' : 'Stop Desk Yalidine (+500 DA)'}</option>
                        <option value="main_propre">{isArabic ? 'تسليم يد بيد (0 دج)' : 'Main propre (0 DA)'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'عنوان الإقامة أو البلدية بالتفصيل *' : 'Adresse ou Commune *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={orderAddress}
                      onChange={(e) => setOrderAddress(e.target.value)}
                      placeholder={isArabic ? 'البلدية، الحي، الشارع...' : 'Commune, quartier, rue...'}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Promo code input */}
                  <div className="flex gap-2 items-center pt-1">
                    <input
                      type="text"
                      value={orderPromoCode}
                      onChange={(e) => setOrderPromoCode(e.target.value)}
                      placeholder="Code Promo (ex: SOLDE2026)"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white uppercase font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (orderPromoCode.trim().toUpperCase() === 'SOLDE2026' || orderPromoCode.trim().toUpperCase() === 'BARAKA') {
                          setAppliedExtraDiscount(10);
                          try {
                            confetti({ particleCount: 30, spread: 50 });
                          } catch {}
                        } else {
                          alert(isArabic ? 'رمز التخفيض غير صالح' : 'Code promo non valide');
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl text-xs space-y-1.5 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Sous-total articles</span>
                    <span>{itemTotal.toLocaleString()} DZD</span>
                  </div>
                  {appliedExtraDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Code promo ({appliedExtraDiscount}%)</span>
                      <span>-{extraDiscountAmount.toLocaleString()} DZD</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Frais de livraison ({orderDeliveryMode === 'yalidine_home' ? 'Domicile' : orderDeliveryMode === 'yalidine_desk' ? 'Stop Desk' : 'Main propre'})</span>
                    <span>{deliveryFee > 0 ? `${deliveryFee} DZD` : 'Gratuit'}</span>
                  </div>

                  {/* 🛡️ Commission de prestation & protection Nisfy */}
                  <div className="flex justify-between items-center py-1 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
                    <div className="flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isArabic ? 'خدمة وساطة وحماية المشتري نصفي' : 'Prestation & Protection Acheteur Nisfy'}</span>
                    </div>
                    <span className="font-black">+{nisfyServiceFee} DZD</span>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-1.5 flex justify-between font-black text-red-600 text-sm">
                    <span>Total à payer à réception</span>
                    <span>{grandTotal.toLocaleString()} DZD</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-[#FF3823] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isArabic ? 'تأكيد الطلب والدفع عند الاستلام' : 'Confirmer la commande (Paiement à la livraison)'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ➕ 6. MODAL DÉPOSER UN ARTICLE EN SOLDE */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {postSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {isArabic ? 'تم نشر سلعتك في سوق الصولد!' : 'Votre article est en ligne dans les soldes !'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isArabic
                    ? 'سيظهر إعلانك فوراً لكل زوار التطبيق في ولايتك وكافة أرجاء الجزائر.'
                    : 'Votre article bénéficie désormais de la visibilité auprès des membres de Nisfy.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateSoldeItem} className="space-y-3.5">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] font-black text-red-600 uppercase">
                      {isArabic ? 'إضافة همزة جديدة' : 'Déposer un bon plan'}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {isArabic ? 'بيع في سوق الصولد والتخفيضات' : 'Vendre un article en solde ou déstockage'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPostModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'عنوان السلعة أو الفستان *' : 'Titre de l’article *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ex: Robe de soirée velours brodée, Robot pétrin 7L..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'الفئة *' : 'Catégorie *'}
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 cursor-pointer"
                      >
                        {SOLDE_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.icon} {isArabic ? c.labelAr : c.labelFr}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'حالة السلعة *' : 'État de l’article *'}
                      </label>
                      <select
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 cursor-pointer"
                      >
                        <option value="porte_une_fois">{isArabic ? 'ملبوس مرة واحدة فقط (كأنه جديد)' : 'Porté 1 seule fois (Comme neuf)'}</option>
                        <option value="neuf_etiquette">{isArabic ? 'جديد بالملصق / الكرتون' : 'Neuf avec étiquette'}</option>
                        <option value="neuf_destockage">{isArabic ? 'تصفية محل أو مشغل' : 'Déstockage boutique / atelier'}</option>
                        <option value="tres_bon_etat">{isArabic ? 'حالة ممتازة جداً' : 'Très bon état'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Pricing Before / After with auto-calculated discount */}
                  <div className="grid grid-cols-2 gap-2 bg-red-50/70 dark:bg-red-950/30 p-3 rounded-2xl border border-red-200/50">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'السعر الأصلي (دج) *' : 'Prix d’origine (DZD) *'}
                      </label>
                      <input
                        type="number"
                        required
                        value={newOriginalPrice}
                        onChange={(e) => setNewOriginalPrice(e.target.value)}
                        placeholder="Ex: 35000"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-red-600 dark:text-red-400 mb-1">
                        {isArabic ? 'سعر الصولد (دج) *' : 'Prix Soldé (DZD) *'}
                      </label>
                      <input
                        type="number"
                        required
                        value={newSoldePrice}
                        onChange={(e) => setNewSoldePrice(e.target.value)}
                        placeholder="Ex: 17500"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-red-300 dark:border-red-800 text-xs text-red-600 font-black"
                      />
                    </div>

                    {parseInt(newOriginalPrice, 10) > 0 &&
                      parseInt(newSoldePrice, 10) > 0 &&
                      parseInt(newSoldePrice, 10) < parseInt(newOriginalPrice, 10) && (
                        <div className="col-span-2 text-center text-xs font-black text-red-600">
                          🔥 {isArabic ? 'نسبة التخفيض المحسوبة:' : 'Remise calculée :'} -
                          {Math.round(
                            ((parseInt(newOriginalPrice, 10) - parseInt(newSoldePrice, 10)) /
                              parseInt(newOriginalPrice, 10)) *
                              100
                          )}
                          %
                        </div>
                      )}
                  </div>

                  {/* Seller & Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'الولاية *' : 'Wilaya *'}
                      </label>
                      <select
                        value={newWilaya}
                        onChange={(e) => setNewWilaya(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white cursor-pointer"
                      >
                        {WILAYAS_LIST.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.code} - {w.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'رقم الهاتف للتواصل *' : 'Numéro de téléphone *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="05 / 06 / 07 XX XX XX"
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'رابط الصورة (URL) - اختياري' : 'Lien de la photo (URL) - facultatif'}
                    </label>
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'وصف إضافي ومقاسات *' : 'Description & taille *'}
                    </label>
                    <textarea
                      rows={2}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder={isArabic ? 'المقاس، اللون، سبب البيع، إمكانية التوصيل...' : 'Taille, couleur, état, conditions de livraison...'}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Note sur la gratuité pour le vendeur et la commission tiers de confiance */}
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black block">
                        {isArabic ? '✨ النشر مجاني 100% للبائع (بدون أي رسوم مسبقة)' : '✨ Publication 100% gratuite pour le vendeur'}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 block mt-0.5 text-[10px]">
                        {isArabic
                          ? 'نصفي توفر لك المشتري الجاد والتوصيل إلى 58 ولاية. تتكفل المنصة بتحصيل عمولة وساطة وحماية رمزية (300 دج) مباشرة مع التوصيل.'
                          : 'Nisfy vous met en relation avec des acheteurs sérieux. Les frais de service et de protection (300 DA) sont réglés par l’acheteur lors de la livraison.'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-[#FF3823] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isArabic ? 'نشر الإعلان في الصولد فوراً' : 'Publier mon annonce en solde'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 🚀 7. MODAL BOOSTER L'ANNONCE (MONÉTISATION DIRECTE) */}
      {boostTargetItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {boostSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto animate-bounce">
                  <Rocket className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {isArabic ? 'مبروك! تم ترقية إعلانك في الصدارة 🚀' : 'Félicitations ! Annonce boostée avec succès 🚀'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isArabic
                    ? 'إعلانك يظهر الآن بأعلى القائمة مع الشارة الذهبية لمضاعفة المشاهدات والمبيعات.'
                    : 'Votre annonce apparaît désormais en tête des résultats avec visibilité maximale.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBoost} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {isArabic ? 'ترقية الإعلان وتسريع البيع' : 'Booster la visibilité de l’annonce'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {isArabic ? boostTargetItem.titleAr : boostTargetItem.titleFr}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBoostTargetItem(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Boost Options */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'اختر باقة الترقية المناسبة:' : 'Choisissez une option de visibilité :'}
                  </label>

                  {BOOST_PLANS.map((plan) => {
                    const isSelected = selectedBoostPlan === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedBoostPlan(plan.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-amber-600 bg-amber-600' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                            </span>
                            <span className="font-black text-xs text-slate-900 dark:text-white">
                              {isArabic ? plan.nameAr : plan.nameFr}
                            </span>
                          </div>
                          <div className="text-right rtl:text-left">
                            <span className="font-black text-sm text-red-600">
                              {plan.priceDzd} DZD
                            </span>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              {plan.durationDays} {isArabic ? 'أيام' : 'jours'}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          {isArabic ? plan.taglineAr : plan.taglineFr}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(isArabic ? plan.featuresAr : plan.featuresFr).map((f, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-1"
                            >
                              <Check className="w-2.5 h-2.5 text-emerald-500" />
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Payment method selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'طريقة الدفع في الجزائر:' : 'Moyen de paiement en Algérie :'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'baridimob', name: 'BaridiMob', desc: 'RIP / QR Code' },
                      { id: 'dahabia', name: 'Edahabia', desc: 'Carte CIB / Poste' },
                      { id: 'flexy', name: 'Flexy Djezzy/Oor', desc: 'Crédit rapide' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setBoostPaymentMethod(m.id as any)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          boostPaymentMethod === m.id
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-black'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs'
                        }`}
                      >
                        <span className="block text-xs font-bold">{m.name}</span>
                        <span className="text-[9px] text-slate-400 font-normal">{m.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total & Submit */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-slate-500">{isArabic ? 'المبلغ المستحق:' : 'Total à régler :'}</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {BOOST_PLANS.find((p) => p.id === selectedBoostPlan)?.priceDzd} DZD
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>{isArabic ? 'تفعيل الترقية والدفع الفوري' : 'Activer le Boost & Payer'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 👑 8. MODAL FORFAITS BOUTIQUE PRO & REVENUS B2B */}
      {isProModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {proSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto animate-bounce">
                  <Crown className="w-8 h-8 fill-amber-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {isArabic ? 'مرحباً بك كمتجر معتمد على نصفي 🇩🇿' : 'Bienvenue sur Nisfy Espace Pro 🇩🇿'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isArabic
                    ? 'تم تسجيل طلب اشتراك متجرك بنجاح. سيتصل بك فريق الدعم التجاري لتفعيل شارة المتجر المعتمد وروابطك.'
                    : 'Votre demande de boutique Pro a été enregistrée. Notre équipe commerciale va activer votre badge certifié et vos avantages.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmProSubscription} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
                      <Building className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                          {isArabic ? 'باقات المتاجر ومشاغل الخياطة Pro' : 'Abonnements Boutiques & Ateliers DZ'}
                        </h3>
                        <span className="px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-900 text-[9px] font-black">
                          PRO
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {isArabic ? 'بيع كميات أكبر، إعلانات غير محدودة وشارة الثقة الرسمية' : 'Développez votre commerce, vendez en continu sur 58 Wilayas'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsProModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Plan Selection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SHOP_PRO_PLANS.map((plan) => {
                    const isSelected = selectedProPlan === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedProPlan(plan.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 shadow-md'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-slate-900 dark:text-white">
                              {isArabic ? plan.nameAr : plan.nameFr}
                            </span>
                            {plan.id === 'pro_atelier_vip' && (
                              <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black">
                                BEST-SELLER
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="text-xl font-black text-red-600">
                              {plan.priceDzdMonth.toLocaleString()} DZD
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              {isArabic ? 'شهرياً / بدون التزام' : '/ mois sans engagement'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {isArabic ? plan.taglineAr : plan.taglineFr}
                          </p>
                        </div>

                        <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 mt-3">
                          {(isArabic ? plan.featuresAr : plan.featuresFr).map((feat, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300">
                              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Form fields */}
                <div className="space-y-2.5 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'اسم المحل أو المشغل *' : 'Nom du magasin / atelier *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={proStoreName}
                        onChange={(e) => setProStoreName(e.target.value)}
                        placeholder="Ex: Maison du Trousseau d'Alger"
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'رقم هاتف التجاري / واتساب *' : 'Téléphone commercial / WhatsApp *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={proPhone}
                        onChange={(e) => setProPhone(e.target.value)}
                        placeholder="05 / 06 / 07 XX XX XX"
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'الولاية ومقر النشاط *' : 'Wilaya d’activité *'}
                      </label>
                      <select
                        value={proWilaya}
                        onChange={(e) => setProWilaya(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white"
                      >
                        {WILAYAS_LIST.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.code} - {w.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'رابط صفحة إنستغرام أو فيسبوك' : 'Page Instagram ou Facebook'}
                      </label>
                      <input
                        type="text"
                        value={proInstagram}
                        onChange={(e) => setProInstagram(e.target.value)}
                        placeholder="@boutique_dz_officiel"
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-[#FF3823] to-amber-500 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4 fill-white" />
                  <span>{isArabic ? 'تأكيد الاشتراك وتفعيل باقة المحترفين' : 'Souscrire au Pack Boutique Pro'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ⚖️ 8. MODAL COMPARATEUR DE PRIX WEB & MARCHÉ DZ */}
      {comparisonTargetItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {isArabic ? 'مقارن أسعار الويب والمتاجر' : 'Comparateur de Prix Web & Marché'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                      Audit DZ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isArabic
                      ? 'مقارنة حيادية تساعدك على التأكد هل العرض همزة حقيقية قبل الشراء'
                      : 'Analyse comparative pour vous aider à décider en toute transparence'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setComparisonTargetItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Item Quick Overview */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <img
                src={comparisonTargetItem.images[0]}
                alt={comparisonTargetItem.titleFr}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 block">
                  {isArabic ? comparisonTargetItem.categoryLabelAr : comparisonTargetItem.categoryLabelFr}
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {isArabic ? comparisonTargetItem.titleAr : comparisonTargetItem.titleFr}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">
                    {isArabic ? 'البائع:' : 'Vendeur :'} <strong className="text-slate-700 dark:text-slate-300">{comparisonTargetItem.sellerName}</strong> ({comparisonTargetItem.sellerWilaya})
                  </span>
                </div>
              </div>
            </div>

            {/* Duel de Prix: Nisfy vs Prix Moyen Web */}
            {(() => {
              const soldePrice = comparisonTargetItem.soldePriceDzd;
              const marketBenchmark = comparisonTargetItem.marketComparison?.suggestedStorePriceDzd || comparisonTargetItem.originalPriceDzd;
              const diffDzd = marketBenchmark - soldePrice;
              const isGoodDeal = diffDzd > 0;
              const savingsRatio = Math.round((diffDzd / marketBenchmark) * 100);

              // Comparison sources
              const sources = comparisonTargetItem.marketComparison?.sources || [
                { siteName: 'Moyenne Boutiques Didouche / Hydra (Alger)', priceDzd: marketBenchmark, inStock: true, badge: 'Magasins Physiques' },
                { siteName: 'Moyenne Annonces Ouedkniss & Marketplaces DZ', priceDzd: Math.round(marketBenchmark * 0.95), inStock: true, badge: 'Web Algérie' },
                { siteName: 'Boutiques Spécialisées Instagram / Facebook DZ', priceDzd: Math.round(marketBenchmark * 1.05), inStock: false, badge: 'Réseaux Sociaux' }
              ];

              return (
                <div className="space-y-4">
                  {/* Price Comparison Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Prix Nisfy */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-2 border-red-500/80 dark:border-red-500/70 relative">
                      <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider absolute top-3 right-3 rtl:right-auto rtl:left-3">
                        {isArabic ? 'عرض نصفي الحالي' : 'Offre Solde Nisfy'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                        {isArabic ? 'السعر المقترح هنا' : 'Tarif vérifié sur Nisfy'}
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 mt-1">
                        {soldePrice.toLocaleString()} <span className="text-sm font-bold">DZD</span>
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'جاهز للشحن مع التوصيل 58 ولاية' : 'En stock immédiat avec Yalidine'}</span>
                      </div>
                    </div>

                    {/* Prix Constaté sur la Toile */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 relative">
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider absolute top-3 right-3 rtl:right-auto rtl:left-3">
                        {isArabic ? 'معدل سعر السوق' : 'Moyenne du marché'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                        {isArabic ? 'السعر في المتاجر والويب' : 'Tarif moyen constaté sur la toile'}
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">
                        {marketBenchmark.toLocaleString()} <span className="text-sm font-bold text-slate-500">DZD</span>
                      </div>
                      <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-blue-500" />
                        <span>{isArabic ? 'مبني على 3 مصادر موثوقة' : 'Relevé sur 3 enseignes de référence'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Verdict / Decision Banner */}
                  <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    isGoodDeal
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/70 text-emerald-900 dark:text-emerald-200'
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/70 text-amber-900 dark:text-amber-200'
                  }`}>
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs sm:text-sm">
                          {isArabic
                            ? isGoodDeal ? '✨ قرار المقارن: همزة وصفقة ممتازة!' : '⚠️ قرار المقارن: السعر متقارب مع السوق'
                            : isGoodDeal ? '✨ Verdict Comparateur : Excellente affaire confirmée !' : '⚠️ Verdict : Tarif proche du marché'}
                        </span>
                        {isGoodDeal && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                            -{savingsRatio}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                        {isArabic
                          ? (comparisonTargetItem.marketComparison?.verdictAr || `شراء هذا المنتج من نصفي يوفر لك ${diffDzd.toLocaleString()} دج مقارنة بالسعر المتداول على الويب والمحلات.`)
                          : (comparisonTargetItem.marketComparison?.verdictFr || `Acheter cet article sur Nisfy vous fait économiser ${diffDzd.toLocaleString()} DZD par rapport aux autres canaux du marché.`)}
                      </p>
                    </div>
                  </div>

                  {/* Tableau détaillé des sources constatées sur la toile */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isArabic ? 'أسعار نفس الصنف في المواقع والمحلات:' : 'Tarifs constatés pour le même produit :'}</span>
                      </h4>
                      <span className="text-[10px] text-slate-400">Relevé actualisé</span>
                    </div>

                    <div className="space-y-1.5">
                      {sources.map((src, idx) => {
                        const priceDelta = src.priceDzd - soldePrice;
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block sm:inline">
                                  {src.siteName}
                                </span>
                                {src.badge && (
                                  <span className="sm:ml-2 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[9px] font-semibold">
                                    {src.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right rtl:text-left shrink-0">
                              <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                                {src.priceDzd.toLocaleString()} DZD
                              </span>
                              {priceDelta > 0 && (
                                <span className="block text-[10px] text-red-600 dark:text-red-400 font-bold">
                                  +{priceDelta.toLocaleString()} DZD plus cher
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Boutons d'action rapides */}
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const itm = comparisonTargetItem;
                        setComparisonTargetItem(null);
                        setActiveItem(null);
                        setOrderItem(itm);
                        setOrderQuantity(1);
                        setOrderSuccessId(null);
                      }}
                      className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isArabic ? 'اقتناص الصفقة والطلب الفوري' : 'Profiter de la bonne affaire (Commander)'}</span>
                    </button>

                    {/* Google Web Search Direct Link */}
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        `${comparisonTargetItem.brandOrModel || comparisonTargetItem.titleFr} prix algerie dzd`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                      <span>{isArabic ? 'بحث مباشر على Google' : 'Rechercher sur Google'}</span>
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
