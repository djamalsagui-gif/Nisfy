import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Star,
  MapPin,
  Phone,
  Instagram,
  CheckCircle2,
  Sparkles,
  PlusCircle,
  Truck,
  ShieldCheck,
  Tag,
  Heart,
  X,
  Plus,
  Minus,
  Trash2,
  Send,
  MessageCircle,
  ArrowRight,
  Gift,
  Award,
  ChevronRight,
  SlidersHorizontal,
  Check,
  CreditCard,
  Building,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ShopProduct,
  ShopProductCategory,
  CartItem,
  SHOP_CATEGORIES,
  INITIAL_SHOP_PRODUCTS
} from '../data/youthShopData';
import { WILAYAS_LIST } from '../data/wilayas';
import { useLanguage } from '../context/LanguageContext';
import { getActiveShopProducts, addOrUpdateShopProduct } from '../utils/shopManager';

export const YouthShopView: React.FC = () => {
  const { isArabic } = useLanguage();

  // Products & Categories (synced with admin shop manager)
  const [products, setProducts] = useState<ShopProduct[]>(() => getActiveShopProducts());
  const [selectedCategory, setSelectedCategory] = useState<ShopProductCategory | 'all'>('all');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');

  // Live Sync with Admin Advertiser / Shop Vendor changes
  React.useEffect(() => {
    const handleSync = () => {
      setProducts(getActiveShopProducts());
    };
    window.addEventListener('nisfy_shop_updated', handleSync);
    return () => window.removeEventListener('nisfy_shop_updated', handleSync);
  }, []);

  // Product Details Modal
  const [activeProduct, setActiveProduct] = useState<ShopProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [customPersonalization, setCustomPersonalization] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nisfy_shop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');

  // Checkout State
  const [isCheckoutStep, setIsCheckoutStep] = useState<boolean>(false);
  const [orderCustomerName, setOrderCustomerName] = useState<string>('');
  const [orderCustomerPhone, setOrderCustomerPhone] = useState<string>('');
  const [orderCustomerWilaya, setOrderCustomerWilaya] = useState<string>('16');
  const [orderCustomerAddress, setOrderCustomerAddress] = useState<string>('');
  const [orderDeliveryType, setOrderDeliveryType] = useState<'home' | 'stopdesk'>('home');
  const [orderPaymentMethod, setOrderPaymentMethod] = useState<'cod' | 'dahabia' | 'baridimob'>('cod');
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // New Seller/Product Modal
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState<boolean>(false);
  const [newSellerName, setNewSellerName] = useState<string>('');
  const [newSellerPhone, setNewSellerPhone] = useState<string>('');
  const [newProductTitle, setNewProductTitle] = useState<string>('');
  const [newProductPrice, setNewProductPrice] = useState<string>('');
  const [newProductCategory, setNewProductCategory] = useState<ShopProductCategory>('box_hdiya');
  const [newProductDesc, setNewProductDesc] = useState<string>('');
  const [newProductSuccess, setNewProductSuccess] = useState<boolean>(false);

  // Save cart changes
  const updateCartAndStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('nisfy_shop_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error(e);
    }
  };

  // Add to cart helper
  const handleAddToCart = (product: ShopProduct, size?: string, color?: string, personalization?: string) => {
    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color &&
        item.customNote === personalization
    );

    let updated: CartItem[];
    if (existingIndex >= 0) {
      updated = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updated = [
        ...cart,
        {
          product,
          quantity: 1,
          selectedSize: size,
          selectedColor: color,
          customNote: personalization,
        },
      ];
    }

    updateCartAndStorage(updated);
    setIsCartOpen(true);

    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
  };

  // Cart operations
  const handleUpdateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    updateCartAndStorage(updated);
  };

  const handleRemoveFromCart = (index: number) => {
    const updated = cart.filter((_, idx) => idx !== index);
    updateCartAndStorage(updated);
  };

  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const subtotalCartDzd = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = item.product.discountPriceDzd || item.product.priceDzd;
      return acc + price * item.quantity;
    }, 0);
  }, [cart]);

  const deliveryFeeDzd = useMemo(() => {
    if (cart.length === 0) return 0;
    return orderDeliveryType === 'home' ? 800 : 500;
  }, [cart, orderDeliveryType]);

  const discountAmountDzd = useMemo(() => {
    return Math.round((subtotalCartDzd * appliedDiscountPercent) / 100);
  }, [subtotalCartDzd, appliedDiscountPercent]);

  const grandTotalDzd = useMemo(() => {
    return Math.max(0, subtotalCartDzd - discountAmountDzd + deliveryFeeDzd);
  }, [subtotalCartDzd, discountAmountDzd, deliveryFeeDzd]);

  // Apply promo code
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'NISFY2026' || code === 'MARIAGE' || code === 'JEUNESSE') {
      setAppliedDiscountPercent(15);
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch {}
    } else if (code === 'YALIDINE') {
      setAppliedDiscountPercent(10);
    } else {
      setPromoError(isArabic ? 'رمز التخفيض غير صالح' : 'Code promo non valide');
    }
  };

  // Confirm Order
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCustomerName || !orderCustomerPhone || !orderCustomerAddress) {
      alert(isArabic ? 'يرجى ملء جميع معلومات التوصيل' : 'Veuillez remplir toutes les informations de livraison.');
      return;
    }

    const orderId = 'NSF-' + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      orderId,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      customerName: orderCustomerName,
      customerPhone: orderCustomerPhone,
      wilaya: WILAYAS_LIST.find((w) => w.code === orderCustomerWilaya)?.name || 'Alger',
      address: orderCustomerAddress,
      deliveryType: orderDeliveryType === 'home' ? 'À Domicile' : 'Bureau Yalidine Express (Stop Desk)',
      paymentMethod:
        orderPaymentMethod === 'cod'
          ? 'Paiement à la livraison (Cash on Delivery)'
          : orderPaymentMethod === 'dahabia'
          ? 'Carte Dahabia / CIB'
          : 'BaridiMob',
      items: [...cart],
      subtotalDzd: subtotalCartDzd,
      discountDzd: discountAmountDzd,
      deliveryFeeDzd,
      totalDzd: grandTotalDzd,
    };

    setCompletedOrder(orderData);
    updateCartAndStorage([]);
    setIsCheckoutStep(false);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {}
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        if (selectedWilaya !== 'all' && p.sellerWilayaCode !== selectedWilaya) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.titleFr.toLowerCase().includes(q) || p.titleAr.includes(q);
          const matchDesc = p.descriptionFr.toLowerCase().includes(q) || p.descriptionAr.includes(q);
          const matchSeller = p.sellerName.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchSeller) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
        if (sortBy === 'price_asc') {
          const priceA = a.discountPriceDzd || a.priceDzd;
          const priceB = b.discountPriceDzd || b.priceDzd;
          return priceA - priceB;
        }
        if (sortBy === 'price_desc') {
          const priceA = a.discountPriceDzd || a.priceDzd;
          const priceB = b.discountPriceDzd || b.priceDzd;
          return priceB - priceA;
        }
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, selectedWilaya, searchQuery, sortBy]);

  // Handle open product details
  const handleOpenProduct = (p: ShopProduct) => {
    setActiveProduct(p);
    setActiveImageIndex(0);
    setSelectedSize(p.sizes && p.sizes.length > 0 ? p.sizes[0] : '');
    setSelectedColor(p.colors && p.colors.length > 0 ? p.colors[0].nameFr : '');
    setCustomPersonalization('');
  };

  // Submit new product creation
  const handleCreateSellerProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSellerName || !newProductTitle || !newProductPrice) return;

    const priceNum = parseInt(newProductPrice, 10) || 5000;
    const newProd: ShopProduct = {
      id: `prod-user-${Date.now()}`,
      titleFr: newProductTitle,
      titleAr: newProductTitle,
      descriptionFr: newProductDesc || 'Création artisanale proposée par un jeune artisan certifié Nisfy.',
      descriptionAr: newProductDesc || 'إبداع يدوي مقترح من حرفي معتمد على منصة نصفي.',
      category: newProductCategory,
      priceDzd: priceNum,
      priceEur: Math.round(priceNum / 200),
      sellerName: newSellerName,
      sellerWilaya: 'Alger (16)',
      sellerWilayaCode: '16',
      sellerVerified: true,
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      sellerPhone: newSellerPhone || '+213 555 00 00 00',
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      stockCount: 10,
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80'
      ],
      badges: ['Nouveau Créateur', 'Fait Main 🇩🇿'],
      isTrending: true,
      deliveryEstimateDays: '48h à 72h',
    };

    addOrUpdateShopProduct(newProd);
    setNewProductSuccess(true);
    setTimeout(() => {
      setIsNewProductModalOpen(false);
      setNewProductSuccess(false);
      setNewProductTitle('');
      setNewProductPrice('');
      setNewProductDesc('');
      setNewSellerName('');
      setNewSellerPhone('');
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. HERO HEADER WITH E-COMMERCE ACCENTS */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>{isArabic ? 'سوق نصفي - تجارة إلكترونية وجهاز العرائس' : 'Souk Nisfy • E-Commerce & Trousseau Jeunesse'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {isArabic ? (
                <>كل ما يحتاجه <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-emerald-300">الشباب والعرائس</span> في مكان واحد</>
              ) : (
                <>La Boutique Éthique des <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-emerald-300">Jeunes & Nouveaux Mariés</span></>
              )}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isArabic
                ? 'صناديق هدايا الخطوبة، جهاز العروس، كاراكو وقفاطين عصرية، أطقم خواتم فضة 925، وعطور شرقية أصيلة مع خدمة التوصيل إلى 69 ولاية.'
                : 'Box cadeaux de fiançailles, trousseau de la mariée, tenues traditionnelles modernes, alliances argent 925 et déco de maison avec livraison express Yalidine dans les 69 wilayas & diaspora.'}
            </p>

            {/* Value Props Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-emerald-200">
              <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                {isArabic ? 'توصيل سريع 69 ولاية' : 'Livraison 69 Wilayas (Yalidine)'}
              </span>
              <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {isArabic ? 'دفع عند الاستلام أو بريدي موب' : 'Cash on Delivery / BaridiMob'}
              </span>
              <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isArabic ? 'صناعة يدوية جزائرية 100%' : 'Artisanat & Créations DZ'}
              </span>
            </div>
          </div>

          {/* Action Buttons: Cart & Seller */}
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{isArabic ? 'السلة' : 'Mon Panier'}</span>
              {totalCartCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-white text-rose-600 text-xs font-black animate-bounce shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Add Item / Become Seller */}
            <button
              onClick={() => setIsNewProductModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
              title="Vendre un article ou proposer une création"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{isArabic ? 'بيع منتج' : 'Vendre un article'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY SELECTOR TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {SHOP_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{isArabic ? cat.labelAr : cat.labelFr}</span>
            </button>
          );
        })}
      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-700 flex flex-col md:flex-row items-center gap-3 justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArabic ? 'ابحث عن هدية، قفطان، طقم خواتم...' : 'Rechercher un cadeau, caftan, bague...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Wilaya Filter & Sorting */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <select
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="all">{isArabic ? 'جميع الولايات (69 ولاية)' : 'Toutes les Wilayas (69)'}</option>
              {WILAYAS_LIST.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.code} - {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="popular">{isArabic ? 'الأكثر رواجاً' : 'Plus Populaires'}</option>
              <option value="price_asc">{isArabic ? 'السعر : من الأقل للأعلى' : 'Prix croissant'}</option>
              <option value="price_desc">{isArabic ? 'السعر : من الأعلى للأقل' : 'Prix décroissant'}</option>
              <option value="rating">{isArabic ? 'أعلى تقييم' : 'Mieux Notés'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. PRODUCTS GRID */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center text-3xl mx-auto">
            🛍️
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isArabic ? 'لا توجد منتجات مطابقة للبحث' : 'Aucun article trouvé pour ces critères'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isArabic
              ? 'جرب تغيير خيارات البحث أو استكشاف تصنيف آخر من تصنيفات سوق نصفي.'
              : 'Essayez de modifier votre recherche ou explorez une autre catégorie de notre boutique.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedWilaya('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
          >
            {isArabic ? 'عرض كل المنتجات' : 'Réinitialiser les filtres'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const hasDiscount = !!product.discountPriceDzd;
            const currentPriceDzd = product.discountPriceDzd || product.priceDzd;

            return (
              <div
                key={product.id}
                className="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image & Badges */}
                <div
                  onClick={() => handleOpenProduct(product)}
                  className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.titleFr}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.badges && product.badges.length > 0 && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-md">
                        {product.badges[0]}
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-md">
                        PROMO
                      </span>
                    )}
                  </div>

                  {/* Wilaya badge on bottom right */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{product.sellerWilaya}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Seller row */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={product.sellerAvatar}
                          alt={product.sellerName}
                          referrerPolicy="no-referrer"
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                          {product.sellerName}
                        </span>
                        {product.sellerVerified && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{product.rating}</span>
                        <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => handleOpenProduct(product)}
                      className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-2 cursor-pointer"
                    >
                      {isArabic ? product.titleAr : product.titleFr}
                    </h3>
                  </div>

                  {/* Pricing & Add to Cart */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          {currentPriceDzd.toLocaleString()} <span className="text-xs text-emerald-600 font-bold">DZD</span>
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through">
                            {product.priceDzd.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        (~{product.priceEur} € diaspora)
                      </span>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-400 hover:text-white transition-all transform active:scale-90 cursor-pointer"
                      title="Ajouter au Panier"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. MODAL: PRODUCT DETAILS & PURCHASE */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 p-6 sm:p-8 space-y-6">
            {/* Header with Close */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full">
                  {isArabic ? 'تفاصيل المنتج والحرفي' : 'Article Certifié • Souk Nisfy'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1.5">
                  {isArabic ? activeProduct.titleAr : activeProduct.titleFr}
                </h2>
              </div>
              <button
                onClick={() => setActiveProduct(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery + Info 2-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Images */}
              <div className="space-y-3">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={activeProduct.images[activeImageIndex] || activeProduct.images[0]}
                    alt={activeProduct.titleFr}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnails */}
                {activeProduct.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {activeProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          activeImageIndex === idx
                            ? 'border-emerald-500 shadow-md scale-105'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Seller Box */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={activeProduct.sellerAvatar}
                      alt={activeProduct.sellerName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {activeProduct.sellerName}
                        </span>
                        {activeProduct.sellerVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {activeProduct.sellerWilaya} • {activeProduct.deliveryEstimateDays}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${activeProduct.sellerPhone.replace(/[^0-9]/g, '')}?text=Salam,%20je%20suis%20intéressé(e)%20par%20l'article%20Nisfy:%20${encodeURIComponent(activeProduct.titleFr)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                    title="Contacter le vendeur sur WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Right: Options & Ordering */}
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
                    {isArabic ? 'وصف المنتج' : 'Description'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isArabic ? activeProduct.descriptionAr : activeProduct.descriptionFr}
                  </p>
                </div>

                {/* Color Selector */}
                {activeProduct.colors && activeProduct.colors.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isArabic ? 'اختر اللون :' : 'Couleur / Teinte :'} <span className="text-emerald-600 font-semibold">{selectedColor}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {activeProduct.colors.map((c) => (
                        <button
                          key={c.nameFr}
                          onClick={() => setSelectedColor(c.nameFr)}
                          className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                            selectedColor === c.nameFr ? 'border-emerald-500 scale-110 shadow-sm' : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={isArabic ? c.nameAr : c.nameFr}
                        >
                          {selectedColor === c.nameFr && (
                            <Check className={`w-3.5 h-3.5 ${c.hex === '#ffffff' ? 'text-slate-900' : 'text-white'}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {activeProduct.sizes && activeProduct.sizes.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isArabic ? 'اختر المقاس :' : 'Taille / Mesure :'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {activeProduct.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            selectedSize === s
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personalization input */}
                {activeProduct.allowPersonalization && (
                  <div className="bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-200/80 dark:border-amber-800/50">
                    <label className="block text-xs font-bold text-amber-900 dark:text-amber-300 mb-1">
                      ✨ {activeProduct.personalizationLabel || (isArabic ? 'تخصيص مجاني بالأسماء والتواريخ' : 'Personnalisation Prénoms / Date')}
                    </label>
                    <input
                      type="text"
                      value={customPersonalization}
                      onChange={(e) => setCustomPersonalization(e.target.value)}
                      placeholder={isArabic ? 'مثال: سمير & مريم - 2026' : 'Ex: Samir & Meriem - 2026'}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 focus:outline-hidden"
                    />
                  </div>
                )}

                {/* Price Display */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {(activeProduct.discountPriceDzd || activeProduct.priceDzd).toLocaleString()}{' '}
                      <span className="text-sm font-bold text-emerald-600">DZD</span>
                    </span>
                    {activeProduct.discountPriceDzd && (
                      <span className="text-sm text-slate-400 line-through">
                        {activeProduct.priceDzd.toLocaleString()} DZD
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {isArabic ? 'خدمة التوصيل ياليدين متوفرة لكل الولايات' : 'Livraison express Yalidine disponible dans les 69 wilayas'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      handleAddToCart(
                        activeProduct,
                        selectedSize,
                        selectedColor,
                        customPersonalization
                      );
                      setActiveProduct(null);
                    }}
                    className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isArabic ? 'إضافة إلى السلة' : 'Ajouter au Panier'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. SLIDE-OVER / MODAL: SHOPPING CART & CHECKOUT */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
            {/* Cart Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isCheckoutStep
                    ? isArabic
                      ? 'تأكيد الطلب والتوصيل'
                      : 'Finalisation de Commande'
                    : isArabic
                    ? 'سلة المشتريات'
                    : 'Mon Panier Nisfy'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold">
                  {totalCartCount}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutStep(false);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-2xl">
                    🛍️
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {isArabic ? 'سلتك فارغة حالياً' : 'Votre panier est vide'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isArabic
                      ? 'تصفح تشكيلة الهدايا، الأزياء وأطقم الأعراس وأضف ما يعجبك !'
                      : 'Parcourez notre collection de box cadeaux, tenues et trousseaux.'}
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    {isArabic ? 'استكشف المنتجات' : 'Découvrir la boutique'}
                  </button>
                </div>
              ) : !isCheckoutStep ? (
                /* Step 1: Items List */
                <div className="space-y-3">
                  {cart.map((item, index) => {
                    const price = item.product.discountPriceDzd || item.product.priceDzd;
                    return (
                      <div
                        key={index}
                        className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.titleFr}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {isArabic ? item.product.titleAr : item.product.titleFr}
                          </h4>

                          {/* Options if chosen */}
                          {(item.selectedSize || item.selectedColor || item.customNote) && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {item.selectedSize && `Taille: ${item.selectedSize} `}
                              {item.selectedColor && `• ${item.selectedColor} `}
                              {item.customNote && `• Note: ${item.customNote}`}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-extrabold text-emerald-600">
                              {(price * item.quantity).toLocaleString()} DZD
                            </span>

                            {/* Quantity buttons */}
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                              <button
                                onClick={() => handleUpdateQuantity(index, -1)}
                                className="text-slate-400 hover:text-slate-700 p-0.5"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(index, 1)}
                                className="text-slate-400 hover:text-slate-700 p-0.5"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveFromCart(index)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}

                  {/* Promo Code Box */}
                  <form onSubmit={handleApplyPromo} className="pt-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder={isArabic ? 'رمز التخفيض (مثال: NISFY2026)' : 'Code promo (ex: NISFY2026)'}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs"
                      >
                        {isArabic ? 'تطبيق' : 'Appliquer'}
                      </button>
                    </div>
                    {appliedDiscountPercent > 0 && (
                      <p className="text-[11px] font-bold text-emerald-600 mt-1">
                        ✨ {isArabic ? `تم تطبيق خصم ${appliedDiscountPercent}% !` : `Réduction de ${appliedDiscountPercent}% appliquée !`}
                      </p>
                    )}
                    {promoError && (
                      <p className="text-[11px] font-semibold text-rose-500 mt-1">{promoError}</p>
                    )}
                  </form>
                </div>
              ) : (
                /* Step 2: Checkout Form */
                <form onSubmit={handleConfirmOrder} id="checkout-form" className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'الاسم واللقب :' : 'Nom complet :'}
                    </label>
                    <input
                      type="text"
                      required
                      value={orderCustomerName}
                      onChange={(e) => setOrderCustomerName(e.target.value)}
                      placeholder="Ex: Samir Laouami"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'رقم الهاتف (لتأكيد الطلب والتوصيل) :' : 'Numéro de Téléphone (DZ / WhatsApp) :'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={orderCustomerPhone}
                      onChange={(e) => setOrderCustomerPhone(e.target.value)}
                      placeholder="0550 12 34 56"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'الولاية :' : 'Wilaya :'}
                      </label>
                      <select
                        value={orderCustomerWilaya}
                        onChange={(e) => setOrderCustomerWilaya(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                      >
                        {WILAYAS_LIST.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.code} - {w.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isArabic ? 'نوع التوصيل :' : 'Mode de livraison :'}
                      </label>
                      <select
                        value={orderDeliveryType}
                        onChange={(e: any) => setOrderDeliveryType(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                      >
                        <option value="home">Domicile (+800 DZD)</option>
                        <option value="stopdesk">Bureau Yalidine (+500 DZD)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'العنوان والبلدية :' : 'Adresse & Commune de livraison :'}
                    </label>
                    <input
                      type="text"
                      required
                      value={orderCustomerAddress}
                      onChange={(e) => setOrderCustomerAddress(e.target.value)}
                      placeholder="Ex: Bab Ezzouar, Cité 2068 logts, Bât 12"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isArabic ? 'طريقة الدفع :' : 'Moyen de Paiement :'}
                    </label>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/30 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          checked={orderPaymentMethod === 'cod'}
                          onChange={() => setOrderPaymentMethod('cod')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          💵 {isArabic ? 'الدفع عند الاستلام (Cash on Delivery)' : 'Paiement à la livraison (Cash)'}
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          checked={orderPaymentMethod === 'baridimob'}
                          onChange={() => setOrderPaymentMethod('baridimob')}
                          className="text-emerald-600"
                        />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          📱 BaridiMob / Virement CCP
                        </span>
                      </label>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Cart Footer / Totals */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>{isArabic ? 'المجموع الفرعي :' : 'Sous-total articles :'}</span>
                    <span className="font-semibold">{subtotalCartDzd.toLocaleString()} DZD</span>
                  </div>

                  {discountAmountDzd > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>{isArabic ? 'خصم الكوبون :' : 'Réduction Code :'}</span>
                      <span>-{discountAmountDzd.toLocaleString()} DZD</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500">
                    <span>{isArabic ? 'تكلفة التوصيل (ياليدين) :' : 'Frais de livraison (Yalidine) :'}</span>
                    <span className="font-semibold">{deliveryFeeDzd.toLocaleString()} DZD</span>
                  </div>

                  <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span>{isArabic ? 'المجموع الكلي :' : 'Total à Payer :'}</span>
                    <span className="text-emerald-600">{grandTotalDzd.toLocaleString()} DZD</span>
                  </div>
                </div>

                {!isCheckoutStep ? (
                  <button
                    onClick={() => setIsCheckoutStep(true)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>{isArabic ? 'متابعة إلى معلومات التوصيل' : 'Passer la Commande'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCheckoutStep(false)}
                      className="px-4 py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                    >
                      {isArabic ? 'رجوع' : 'Retour'}
                    </button>
                    <button
                      type="submit"
                      form="checkout-form"
                      className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isArabic ? 'تأكيد واستلام وصل الطلب' : 'Confirmer la Commande'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. ORDER SUCCESS RECEIPT POPUP */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-emerald-500/40 space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/20">
              🎉
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
                {isArabic ? 'تم تسجيل طلبك بنجاح !' : 'Commande Confirmée !'}
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                N° {completedOrder.orderId}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isArabic
                  ? `شكراً ${completedOrder.customerName} ! تم إرسال تفاصيل التوصيل إلى مكتب ياليدين في ولاية ${completedOrder.wilaya}.`
                  : `Merci ${completedOrder.customerName} ! Votre colis est en cours de préparation pour livraison vers ${completedOrder.wilaya}.`}
              </p>
            </div>

            {/* Receipt details */}
            <div className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl text-left text-xs space-y-2 border border-slate-200/80 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Total :</span>
                <span className="font-extrabold text-emerald-600">{completedOrder.totalDzd.toLocaleString()} DZD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mode :</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination :</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{completedOrder.wilaya}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <a
                href={`https://wa.me/213550123456?text=Salam,%20je%20confirme%20ma%20commande%20Nisfy%20N°%20${completedOrder.orderId}%20pour%20un%20montant%20de%20${completedOrder.totalDzd}%20DZD.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isArabic ? 'متابعة الشحنة على WhatsApp' : 'Suivi direct sur WhatsApp'}</span>
              </a>

              <button
                onClick={() => setCompletedOrder(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                {isArabic ? 'إغلاق ومتابعة التسوق' : 'Fermer et continuer mes achats'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: BECOME SELLER / POST ITEM */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isArabic ? 'إضافة منتج في سوق نصفي' : 'Proposer une Création / Vendre'}
                </h3>
              </div>
              <button
                onClick={() => setIsNewProductModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {newProductSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto">
                  ✓
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'تمت إضافة منتجك بنجاح !' : 'Article ajouté avec succès !'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isArabic ? 'سيظهر منتجك مباشرة في قائمة المتجر.' : 'Votre article est maintenant visible dans la boutique.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateSellerProduct} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'اسم الورشة / الحرفي / المصمم :' : 'Nom de l\'Artisan / Boutique / Créateur :'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newSellerName}
                    onChange={(e) => setNewSellerName(e.target.value)}
                    placeholder="Ex: Atelier Sarah Couture"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'رقم الهاتف / واتساب :' : 'Téléphone / WhatsApp :'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={newSellerPhone}
                      onChange={(e) => setNewSellerPhone(e.target.value)}
                      placeholder="0550 00 00 00"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'التصنيف :' : 'Catégorie :'}
                    </label>
                    <select
                      value={newProductCategory}
                      onChange={(e: any) => setNewProductCategory(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                    >
                      <option value="box_hdiya">Box Hdiya & Cadeaux</option>
                      <option value="trousseau_mode">Trousseau & Mode Jeunes</option>
                      <option value="bijoux_alliances">Alliances & Bijoux</option>
                      <option value="maison_deco">Maison & Déco</option>
                      <option value="beaute_parfums">Parfums & Soins</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'عنوان المنتج :' : 'Titre de l\'article :'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newProductTitle}
                    onChange={(e) => setNewProductTitle(e.target.value)}
                    placeholder="Ex: Coffret Fiançailles Velours & Musc"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'السعر بالدينار الجزائري (DZD) :' : 'Prix en Dinars (DZD) :'}
                  </label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    placeholder="Ex: 8500"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'وصف وتفاصيل المنتج :' : 'Description & matériaux :'}
                  </label>
                  <textarea
                    rows={2}
                    value={newProductDesc}
                    onChange={(e) => setNewProductDesc(e.target.value)}
                    placeholder="Précisez les dimensions, finitions et délais de confection..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                  />
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/60 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>Validation & Administration :</span>
                  <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">contact@nisfy.app</span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer"
                  >
                    {isArabic ? 'نشر المنتج في المتجر' : 'Publier mon article'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
