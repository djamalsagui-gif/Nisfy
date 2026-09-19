export type SoldeCategory = 
  | 'all'
  | 'trousseau_mariage' 
  | 'maison_electromenager' 
  | 'videdressing_luxe' 
  | 'mode_streetwear' 
  | 'beaute_parfums';

export type SoldeCondition = 
  | 'neuf_etiquette' 
  | 'neuf_destockage' 
  | 'porte_une_fois' 
  | 'tres_bon_etat';

export interface SoldeItem {
  id: string;
  titleFr: string;
  titleAr: string;
  category: SoldeCategory;
  categoryLabelFr: string;
  categoryLabelAr: string;
  originalPriceDzd: number;
  soldePriceDzd: number;
  discountPercent: number;
  originalPriceEur: number;
  soldePriceEur: number;
  condition: SoldeCondition;
  conditionLabelFr: string;
  conditionLabelAr: string;
  sellerName: string;
  sellerType: 'boutique_certifiee' | 'particulier_verifie';
  sellerWilaya: string;
  sellerWilayaCode: string;
  phone: string;
  whatsapp?: string;
  images: string[];
  descriptionFr: string;
  descriptionAr: string;
  badge: string;
  endsInHours: number;
  stockLeft: number;
  initialStock: number;
  isFeatured?: boolean;
  isBoosted?: boolean;
  boostType?: 'gold' | 'top_listing' | 'urgent';
  boostExpiresAt?: string;
  sellerProBadge?: boolean;
  deliveryTypeFr: string;
  deliveryTypeAr: string;
  createdAt: string;
  // 🌐 Comparateur de prix sur le web
  brandOrModel?: string;
  marketComparison?: {
    suggestedStorePriceDzd: number;
    sources: {
      siteName: string;
      priceDzd: number;
      url?: string;
      inStock: boolean;
      badge?: string;
    }[];
    verdictFr?: string;
    verdictAr?: string;
  };
}

export interface BoostPlan {
  id: 'gold_vip' | 'top_listing' | 'urgent_flash';
  nameFr: string;
  nameAr: string;
  priceDzd: number;
  durationDays: number;
  taglineFr: string;
  taglineAr: string;
  featuresFr: string[];
  featuresAr: string[];
  badgeColor: string;
}

export const BOOST_PLANS: BoostPlan[] = [
  {
    id: 'top_listing',
    nameFr: 'Tête de Liste Quotidienne',
    nameAr: 'الظهور في الصدارة يومياً',
    priceDzd: 400,
    durationDays: 7,
    taglineFr: 'Remontez tout en haut des résultats 7 jours consécutifs',
    taglineAr: 'تصدر نتائج البحث لمدة 7 أيام متتالية لبيع أسرع',
    featuresFr: [
      'Remontée en 1ère position chaque matin',
      'Affichage prioritaire dans la Wilaya',
      'Multiplie les vues par 4x'
    ],
    featuresAr: [
      'الرفع لأعلى القائمة تلقائياً كل صباح',
      'أولوية الظهور للزبائن في ولايتك',
      'مضاعفة عدد المشاهدات 4 أضعاف'
    ],
    badgeColor: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'gold_vip',
    nameFr: 'Boost Or VIP & Carrousel',
    nameAr: 'باقة الذهب VIP وكاروسيل الصدارة',
    priceDzd: 800,
    durationDays: 14,
    taglineFr: 'Cadre doré étincelant + Badge Recommandé Nisfy',
    taglineAr: 'إطار ذهبي مميز + شارة موثوق من نصفي مع ظهور متكرر',
    featuresFr: [
      'Bordure dorée animée + Étoile VIP',
      'Diffusion prioritaire dans le carrousel d’accueil',
      'Contact direct WhatsApp mis en évidence',
      'Multiplie les ventes par 7x'
    ],
    featuresAr: [
      'إطار ذهبي لامع وشارة VIP مميزة',
      'ظهور في شريط العروض المميزة بالواجهة',
      'زر واتساب مباشر بحجم أكبر وتأكيد ثقة',
      'تسريع البيع 7 أضعاف'
    ],
    badgeColor: 'from-amber-500 to-yellow-500'
  },
  {
    id: 'urgent_flash',
    nameFr: 'Liquidation Urgente 48h',
    nameAr: 'تصفية عاجلة وبيع سريع 48 ساعة',
    priceDzd: 250,
    durationDays: 2,
    taglineFr: 'Vendez en moins de 48 heures au meilleur prix',
    taglineAr: 'بيع القطعة خلال أقل من 48 ساعة للمستعجلين',
    featuresFr: [
      'Badge rouge clignotant "URGENT"',
      'Alerte notification aux acheteurs récents',
      'Idéal pour déménagement ou mariage imminent'
    ],
    featuresAr: [
      'شارة حمراء نابضة "عاجل - فرصة"',
      'إشعار الزوار المهتمين بهذه الفئة',
      'مثالي للتصفية السريعة قبل السفر أو العرس'
    ],
    badgeColor: 'from-red-600 to-rose-600'
  }
];

export interface ShopProSubscription {
  id: 'pro_starter' | 'pro_atelier_vip';
  nameFr: string;
  nameAr: string;
  priceDzdMonth: number;
  taglineFr: string;
  taglineAr: string;
  featuresFr: string[];
  featuresAr: string[];
}

export const SHOP_PRO_PLANS: ShopProSubscription[] = [
  {
    id: 'pro_starter',
    nameFr: 'Boutique & Atelier Débutant',
    nameAr: 'باقة المتجر المبتدئ',
    priceDzdMonth: 1500,
    taglineFr: 'Idéal pour petites couturières et boutiques naissantes',
    taglineAr: 'مناسبة للمشاغل الصغيرة والتجار المبتدئين',
    featuresFr: [
      'Jusqu’à 15 annonces actives simultanément',
      'Badge "Boutique Certifiée 🇩🇿"',
      'Lien direct vers votre page Facebook / Instagram',
      'Support commercial Nisfy'
    ],
    featuresAr: [
      'عرض حتى 15 إعلان صولد نشط في وقت واحد',
      'شارة متجر معتمد وموثوق 🇩🇿',
      'إضافة روابط صفحات إنستغرام وفيسبوك',
      'دعم تجاري مخصص'
    ]
  },
  {
    id: 'pro_atelier_vip',
    nameFr: 'Boutique Illimitée & Haute Couture',
    nameAr: 'باقة المحترفين اللامحدودة VIP',
    priceDzdMonth: 3500,
    taglineFr: 'Pour magasins de trousseau, grossistes et ateliers reconnus',
    taglineAr: 'لمحلات تجهيز العرائس وموزعي الأواني ومصممي الأزياء',
    featuresFr: [
      'Annonces en solde ILLIMITÉES',
      '3 Boosts VIP Or offerts chaque mois',
      'Statistiques de vues et clics WhatsApp',
      'Gestionnaire de compte dédié Nisfy DZ',
      'Tarifs de livraison Yalidine réduits'
    ],
    featuresAr: [
      'إعلانات غير محدودة طيلة الشهر',
      '3 ترقيات ذهبية VIP مهداة شهرياً',
      'إحصائيات دقيقة لعدد المشاهدات ونقرات واتساب',
      'أولوية في أسعار شحن ياليدين المخفضة'
    ]
  }
];

export const SOLDE_CATEGORIES: { id: SoldeCategory; labelFr: string; labelAr: string; icon: string }[] = [
  { id: 'all', labelFr: 'Toutes les Promos', labelAr: 'كل التخفيضات والهمزات', icon: '🔥' },
  { id: 'trousseau_mariage', labelFr: 'Trousseau & Tenues de Mariage', labelAr: 'جهاز العروس وقفاطين السهرة', icon: '👑' },
  { id: 'maison_electromenager', labelFr: 'Maison, Linge & Électro', labelAr: 'تأثيث البيت وكهربائيات المطبخ', icon: '🏡' },
  { id: 'videdressing_luxe', labelFr: 'Vide-Dressing (Porté 1 fois)', labelAr: 'سوق المستعمل الفاخر (ملبوس مرة)', icon: '✨' },
  { id: 'mode_streetwear', labelFr: 'Streetwear & Sneakers DZ', labelAr: 'أزياء شبابية وسنيكرز', icon: '👟' },
  { id: 'beaute_parfums', labelFr: 'Parfums, Bakhour & Parures', labelAr: 'عطور، بخور ومجوهرات', icon: '💎' },
];

export const INITIAL_SOLDE_ITEMS: SoldeItem[] = [
  {
    id: 'solde-1',
    titleFr: 'Caftan Royal Bleu Majorelle Velours Brodé Fil d’Or',
    titleAr: 'قفطان ملكي أزرق ماجوريل قطيفة مطرز بالصقلي الذهبي',
    category: 'trousseau_mariage',
    categoryLabelFr: 'Trousseau & Haute Couture',
    categoryLabelAr: 'جهاز العروس وخياطة راقية',
    originalPriceDzd: 45000,
    soldePriceDzd: 19500,
    discountPercent: 57,
    originalPriceEur: 190,
    soldePriceEur: 85,
    condition: 'neuf_destockage',
    conditionLabelFr: 'Neuf - Liquidation Atelier',
    conditionLabelAr: 'جديد - تصفية مشغل خياطة',
    sellerName: 'Haute Couture Sultana DZ',
    sellerType: 'boutique_certifiee',
    sellerWilaya: 'Alger (Kouba)',
    sellerWilayaCode: '16',
    phone: '0550123456',
    whatsapp: '213550123456',
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80'
    ],
    descriptionFr: 'Magnifique caftan de soirée en velours de soie bleu roi, brodé entièrement à la main au fil d’or véritable (fetla et mejboud). Ceinture mdamma artisanale offerte. Déstockage fin de saison.',
    descriptionAr: 'قفطان سهرة فاخر من قطيفة الحرير الأزرق الملكي، مطرز بالكامل يدوياً بالفتلة والمجبود الذهبي الأصلي مع حزام مضمة يدوي هدية. تصفية نهاية الموسم.',
    badge: '-57% DÉSTOCKAGE CHIC',
    endsInHours: 14,
    stockLeft: 2,
    initialStock: 8,
    isFeatured: true,
    deliveryTypeFr: 'Livraison 58 Wilayas Yalidine ou Récupération atelier',
    deliveryTypeAr: 'توصيل ياليدين 58 ولاية أو استلام بالمشغل',
    createdAt: '2026-09-18',
    brandOrModel: 'Caftan Royal Majorelle Brodé Main',
    marketComparison: {
      suggestedStorePriceDzd: 42000,
      sources: [
        { siteName: 'Boutiques Mariage Alger (Didouche)', priceDzd: 48000, inStock: true, badge: 'Magasin Physique' },
        { siteName: 'Boutique Ouedkniss Vendeurs Pro', priceDzd: 38000, inStock: true, badge: 'Web DZ' },
        { siteName: 'Instagram Ateliers Haute Couture', priceDzd: 45000, inStock: false, badge: 'Sur Commande' }
      ],
      verdictFr: 'Économie massive de 22 500 DZD par rapport au prix moyen constaté en boutique (42 000 DZD).',
      verdictAr: 'توفير استثنائي قدره 22,500 دج مقارنة بمتوسط سعر المحلات وصالونات الخياطة (42,000 دج).'
    }
  },
  {
    id: 'solde-perfume-1',
    titleFr: 'Eau de Parfum "Sauvage Elixir" 100ml Flacon Authentique Scellé',
    titleAr: 'عطر ماركة أصلي "سوفاج إلكسير" 100مل مغلف بغلاف المصنع',
    category: 'beaute_parfums',
    categoryLabelFr: 'Parfumerie & Cosmétiques Luxe',
    categoryLabelAr: 'عطور ومستحضرات تجميل أصلية',
    originalPriceDzd: 26000,
    soldePriceDzd: 11900,
    discountPercent: 54,
    originalPriceEur: 115,
    soldePriceEur: 52,
    condition: 'neuf_destockage',
    conditionLabelFr: 'Neuf scellé sous blister avec batch code vérifiable',
    conditionLabelAr: 'جديد ومغلف بالكامل مع كود التحقق من المصنع',
    sellerName: 'Parfumerie Prestige El Assima',
    sellerType: 'boutique_certifiee',
    sellerWilaya: 'Alger (Sidi Yahia)',
    sellerWilayaCode: '16',
    phone: '0552334455',
    whatsapp: '213552334455',
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80'
    ],
    descriptionFr: 'Eau de parfum intense pour homme et marié, flacon 100ml neuf scellé sous blister d’origine. Batch code vérifiable sur checkfresh. Déstockage fin de série parfumerie franchise.',
    descriptionAr: 'عطر فاخر أصلي وثابت مناسب للعريس والمناسبات الراقية، عبوة 100مل مغلفة ومختومة بالكامل مع كود الدفعة الأصلي. تصفية مخزون معتمد.',
    badge: '🔥 OFFRE CHOC PARFUM -54%',
    endsInHours: 8,
    stockLeft: 3,
    initialStock: 15,
    isFeatured: true,
    deliveryTypeFr: 'Livraison 58 Wilayas Yalidine avec vérification du flacon',
    deliveryTypeAr: 'توصيل ياليدين لجميع الولايات مع فحص العلبة قبل الاستلام',
    createdAt: '2026-09-18',
    brandOrModel: 'Sauvage Elixir Eau de Parfum 100ml',
    marketComparison: {
      suggestedStorePriceDzd: 25000,
      sources: [
        { siteName: 'Parfumeries Séphora / Duty Free Europe', priceDzd: 27500, inStock: true, badge: 'Boutique Duty Free' },
        { siteName: 'Magasins Alger Centre (Didouche / Ben Aknoun)', priceDzd: 24500, inStock: true, badge: 'Magasins Alger' },
        { siteName: 'Moyenne Web & Ouedkniss (Vendeurs Agréés)', priceDzd: 22000, inStock: true, badge: 'Marché Web DZ' }
      ],
      verdictFr: 'Prix imbattable : vous économisez 12 600 DZD par rapport à la moyenne du marché algérien (24 500 DZD).',
      verdictAr: 'صفقة لا تقبل المنافسة: توفر 12,600 دج مقارنة بمتوسط سعر السوق والمحلات الكبرى (24,500 دج).'
    }
  },
  {
    id: 'solde-2',
    titleFr: 'Robot Pétrin Multifonctionnel 1800W Bol Inox 7L (Spécial Aroussa)',
    titleAr: 'عجانة كهربائية متعددة الاستعمالات 1800 واط سعة 7 لتر للعروسة',
    category: 'maison_electromenager',
    categoryLabelFr: 'Électroménager Cuisine',
    categoryLabelAr: 'أجهزة المطبخ للبيت الجديد',
    originalPriceDzd: 28000,
    soldePriceDzd: 13900,
    discountPercent: 50,
    originalPriceEur: 120,
    soldePriceEur: 60,
    condition: 'neuf_etiquette',
    conditionLabelFr: 'Neuf sous carton scellé (Garantie 2 ans)',
    conditionLabelAr: 'جديد بالكرتون وضمان سنتين',
    sellerName: 'Électro-Mariage El Bahia',
    sellerType: 'boutique_certifiee',
    sellerWilaya: 'Oran (Medina Jdida)',
    sellerWilayaCode: '31',
    phone: '0770987654',
    whatsapp: '213770987654',
    images: [
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    descriptionFr: 'L’incontournable pour la cuisine de la nouvelle mariée : pétrin haute puissance 1800W, bol 7 litres en inox, fouet, crochet à pâte et batteur. Parfait pour la galette, le khobz dar, pâtes à gâteaux et brioches.',
    descriptionAr: 'الجهاز الأساسي لكل عروس جديدة: عجانة بقوة 1800 واط، وعاء 7 لتر من الإينوكس المقاوم للصدأ، 3 مضارب للخبز والحلويات. سعر تصفية حصري.',
    badge: '⚡ VENTE FLASH -50%',
    endsInHours: 9,
    stockLeft: 3,
    initialStock: 20,
    isFeatured: true,
    deliveryTypeFr: 'Paiement à la livraison après inspection',
    deliveryTypeAr: 'الدفع عند الاستلام بعد المعاينة والتجربة',
    createdAt: '2026-09-18',
    brandOrModel: 'Robot Pétrin Inox 1800W 7L',
    marketComparison: {
      suggestedStorePriceDzd: 26000,
      sources: [
        { siteName: 'Grandes Enseignes Électro DZ', priceDzd: 27900, inStock: true, badge: 'Showroom Officiel' },
        { siteName: 'Moyenne Ouedkniss Électroménager', priceDzd: 22500, inStock: true, badge: 'Vendeurs Web' },
        { siteName: 'Commerces Medina Jdida Oran', priceDzd: 25000, inStock: true, badge: 'Boutique' }
      ],
      verdictFr: 'Ce prix solde Nisfy (13 900 DZD) vous fait économiser 12 100 DZD sur le prix public habituel.',
      verdictAr: 'هذا السعر في صولد نصفي (13,900 دج) يوفر لك 12,100 دج مقارنة بسعر السوق المعتاد.'
    }
  },
  {
    id: 'solde-3',
    titleFr: 'Karakou Algérois Moderne Veste Velours Noir & Pantalon Seroual Chelqa',
    titleAr: 'كاراكو عاصمي عصري سترة قطيفة سوداء وسروال شلقة حريري',
    category: 'videdressing_luxe',
    categoryLabelFr: 'Vide-Dressing Luxe',
    categoryLabelAr: 'سوق المستعمل الفاخر',
    originalPriceDzd: 65000,
    soldePriceDzd: 24000,
    discountPercent: 63,
    originalPriceEur: 275,
    soldePriceEur: 105,
    condition: 'porte_une_fois',
    conditionLabelFr: 'Porté 1 seule fois (Pressing fait - Comme neuf)',
    conditionLabelAr: 'ملبوس مرة واحدة فقط بحفل العرس - كأنه جديد تماماً',
    sellerName: 'Yasmine L. (Particulier)',
    sellerType: 'particulier_verifie',
    sellerWilaya: 'Blida',
    sellerWilayaCode: '09',
    phone: '0661239845',
    whatsapp: '213661239845',
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549439602-43ebca2327af?w=800&auto=format&fit=crop&q=80'
    ],
    descriptionFr: 'Veste karakou brodée tarz tlemceni et perles d’eau douce, confectionnée sur mesure pour ma khotba. Portée quelques heures seulement. Lavage pressing professionnel effectué. Taille 38-40 ajustable.',
    descriptionAr: 'سترة كاراكو مطرزة بالطرز القسنطيني واللؤلؤ، فُصّلت بالطلب لخطوبتي ولُبست لساعات معدودة. نظيفة جداً كأنها خرجت من المحل، مقاس 38-40 قابل للتعديل.',
    badge: '👑 BONNE AFFAIRE -63%',
    endsInHours: 28,
    stockLeft: 1,
    initialStock: 1,
    isFeatured: true,
    deliveryTypeFr: 'Remise en main propre Blida/Alger ou envoi sécurisé',
    deliveryTypeAr: 'تسليم يد بيد بالبليدة/العاصمة أو إرسال سريع',
    createdAt: '2026-09-17',
  },
  {
    id: 'solde-4',
    titleFr: 'Set de Valises Rigides Trousseau Mariée 4 Pièces (Rose Poudré & Or)',
    titleAr: 'طقم حقائب سفر فاخر لجهاز العروس 4 قطع (وردي باستيل وذهبي)',
    category: 'trousseau_mariage',
    categoryLabelFr: 'Trousseau Mariée',
    categoryLabelAr: 'جهاز العروس',
    originalPriceDzd: 32000,
    soldePriceDzd: 15500,
    discountPercent: 51,
    originalPriceEur: 135,
    soldePriceEur: 68,
    condition: 'neuf_etiquette',
    conditionLabelFr: 'Neuf avec emballage d’origine et serrures TSA',
    conditionLabelAr: 'جديد بالأغلفة والأقفال الرقمية',
    sellerName: 'Maison du Trousseau Constantine',
    sellerType: 'boutique_certifiee',
    sellerWilaya: 'Constantine',
    sellerWilayaCode: '25',
    phone: '0555432109',
    whatsapp: '213555432109',
    images: [
      'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=800&auto=format&fit=crop&q=80'
    ],
    descriptionFr: 'Ensemble complet 4 valises en polycarbonate incassable avec vanity case pour produits de beauté. Roulettes 360° silencieuses. Indispensable pour transporter le trousseau de noces avec classe.',
    descriptionAr: 'طقم 4 حقائب سفر من البوليكاربونات غير القابل للكسر مع حقيبة يد تجميلية فخمة وعجلات 360 درجة هادئة، لحمل جهاز العروس بأرقى مظهر.',
    badge: '📦 PACK COMPLET -51%',
    endsInHours: 20,
    stockLeft: 4,
    initialStock: 12,
    isFeatured: false,
    deliveryTypeFr: 'Livraison express à domicile',
    deliveryTypeAr: 'توصيل سريع حتى باب المنزل',
    createdAt: '2026-09-18',
  },
  {
    id: 'solde-5',
    titleFr: 'Parure Prestige Plaqué Or 18K & Cristaux Zirconium (Collier + Boucles + Bracelet + Bague)',
    titleAr: 'طاقم مجوهرات ملكي مطلي بالذهب 18 قيراط ومرصع بالزركون الأصلي',
    category: 'beaute_parfums',
    categoryLabelFr: 'Bijoux & Parures',
    categoryLabelAr: 'مجوهرات وأطقم الزفاف',
    originalPriceDzd: 18000,
    soldePriceDzd: 6900,
    discountPercent: 61,
    originalPriceEur: 75,
    soldePriceEur: 30,
    condition: 'neuf_etiquette',
    conditionLabelFr: 'Neuf dans son écrin velours de luxe',
    conditionLabelAr: 'جديد داخل علبة مخملية راقية',
    sellerName: 'Bijouterie Al Baraka',
    sellerType: 'boutique_certifiee',
    sellerWilaya: 'Sétif (Ain El Fouara)',
    sellerWilayaCode: '19',
    phone: '0771234599',
    whatsapp: '213771234599',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
    ],
    descriptionFr: 'Superbe parure scintillante garantie anti-ternissement. Idéale pour les réceptions de fiançailles, le henné ou compléter la tenue de noces sans se ruiner. Écrin cadeau inclus.',
    descriptionAr: 'طاقم مجوهرات براق ومقاوم لتغير اللون مع ضمان، مثالي للخطوبة والحنة وإبهار الحضور بسعر رمزي مدروس.',
    badge: '💎 PROMO CHOC -61%',
    endsInHours: 6,
    stockLeft: 5,
    initialStock: 25,
    isFeatured: true,
    deliveryTypeFr: 'Livraison 48h dans toute l’Algérie',
    deliveryTypeAr: 'توصيل في 48 ساعة لكافة أنحاء الجزائر',
    createdAt: '2026-09-18',
  },
  {
    id: 'solde-6',
    titleFr: 'Pack Bakhour Royal d’Oman + Encens Musc Blanc + Brûleur Électrique Doré',
    titleAr: 'باقة البخور الملكي العماني + مسك الطهارة الأصلي + مبخرة كهربائية ذهبية',
    category: 'beaute_parfums',
    categoryLabelFr: 'Bakhour & Parfums',
    categoryLabelAr: 'بخور وعطور فاخرة',
    originalPriceDzd: 9500,
    soldePriceDzd: 3800,
    discountPercent: 60,
    originalPriceEur: 40,
    soldePriceEur: 16,
    condition: 'neuf_etiquette',
    conditionLabelFr: 'Neuf scellé (Import direct Orient)',
    conditionLabelAr: 'جديد معبأ استيراد مباشر',
    sellerName: 'Oud & Musc El Assima',
    sellerType: 'boutique_certifiee',
    sellerWilaya: 'Alger (Hydra)',
    sellerWilayaCode: '16',
    phone: '0560998877',
    whatsapp: '213560998877',
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80'
    ],
    descriptionFr: 'Diffusez une fragrance envoûtante dans votre nouveau foyer avec ce pack complet : 100g de copeaux de bakhour de bois d’oud, fiole de musc blanc tahara concentrated et brûleur oriental sécurité.',
    descriptionAr: 'عطّري بيتك الجديد بأفخر الروائح الشرقية: 100غ بخور عود ملكي، مسك الطهارة الأبيض الأصلي، ومبخرة كهربائية ذهبية فاخرة.',
    badge: '🌸 PACK COCOONING -60%',
    endsInHours: 35,
    stockLeft: 7,
    initialStock: 30,
    isFeatured: false,
    deliveryTypeFr: 'Livraison 58 Wilayas Yalidine',
    deliveryTypeAr: 'توصيل ياليدين لجميع الولايات',
    createdAt: '2026-09-17',
  },
  {
    id: 'solde-7',
    titleFr: 'Sneakers Originals Urban DZ Édition Limitée Broderie Calligraphie',
    titleAr: 'حذاء رياضي شبابي أصلي إصدار محدود بتطريز الخط العربي',
    category: 'mode_streetwear',
    categoryLabelFr: 'Streetwear & Sneakers',
    categoryLabelAr: 'أزياء شبابية وسنيكرز',
    originalPriceDzd: 16000,
    soldePriceDzd: 7500,
    discountPercent: 53,
    originalPriceEur: 68,
    soldePriceEur: 32,
    condition: 'neuf_etiquette',
    conditionLabelFr: 'Neuf avec boîte d’origine',
    conditionLabelAr: 'جديد بالعلبة الأصلية',
    sellerName: 'StreetWear Casbah Store',
    sellerType: 'boutique_certifiee',
    sellerWilaya: 'Annaba',
    sellerWilayaCode: '23',
    phone: '0670112233',
    whatsapp: '213670112233',
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
    ],
    descriptionFr: 'Paire de baskets streetwear ultra confort avec détails subtils en calligraphie maghrébine. Semelle amortissante et finitions cuir et suède. Pointures disponibles du 39 au 44.',
    descriptionAr: 'سنيكرز عصري أنيق ومريح بتفاصيل خط عربي دقيقة ونعل مرن مريح للمشي اليومي. المقاسات متوفرة من 39 إلى 44.',
    badge: '👟 DÉSTOCKAGE POINTURES -53%',
    endsInHours: 11,
    stockLeft: 4,
    initialStock: 16,
    isFeatured: false,
    deliveryTypeFr: 'Livraison avec essayage possible',
    deliveryTypeAr: 'توصيل مع إمكانية القياس قبل الدفع',
    createdAt: '2026-09-18',
  },
  {
    id: 'solde-8',
    titleFr: 'Service de Table en Porcelaine Fine 72 Pièces Dorure Or Égyptienne',
    titleAr: 'طاقم أواني طاولة ملكي 72 قطعة بورسلين فاخر بحواف ذهبية',
    category: 'maison_electromenager',
    categoryLabelFr: 'Arts de la Table',
    categoryLabelAr: 'أواني الضيافة للبيت الجديد',
    originalPriceDzd: 42000,
    soldePriceDzd: 21000,
    discountPercent: 50,
    originalPriceEur: 175,
    soldePriceEur: 90,
    condition: 'neuf_etiquette',
    conditionLabelFr: 'Neuf dans son coffret renforcé d’origine',
    conditionLabelAr: 'جديد داخل علبته الأصلية المحمية',
    sellerName: 'Galerie Prestige Tlemcen',
    sellerType: 'boutique_certifiee',
    sellerWilaya: 'Tlemcen',
    sellerWilayaCode: '13',
    phone: '0551778899',
    whatsapp: '213551778899',
    images: [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80'
    ],
    descriptionFr: 'Le trousseau indispensable pour accueillir les familles lors des premières fêtes : assiettes plates, creuses, à dessert, soupière, saucière, plats de présentation et tasses à café assorties. Porcelaine fine résistante.',
    descriptionAr: 'أرقى طاقم ضيافة لاستقبال أهل العريس والضيوف في أول الأعياد والمناسبات: 72 قطعة تشمل الصحون، الشوربة، صواني التقديم وفناجين القهوة والشاي.',
    badge: '🍽️ ARTE DE TABLE -50%',
    endsInHours: 17,
    stockLeft: 2,
    initialStock: 10,
    isFeatured: true,
    deliveryTypeFr: 'Livraison transporteur sécurisé anti-casse',
    deliveryTypeAr: 'توصيل محمي ضد الكسر لكافة الولايات',
    createdAt: '2026-09-18',
  }
];

const STORAGE_KEY = 'nisfy_soldes_items_custom';

export function getAvailableSoldeItems(): SoldeItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SOLDE_ITEMS;
    const custom = JSON.parse(raw);
    if (Array.isArray(custom)) {
      return [...custom, ...INITIAL_SOLDE_ITEMS];
    }
    return INITIAL_SOLDE_ITEMS;
  } catch {
    return INITIAL_SOLDE_ITEMS;
  }
}

export function saveNewSoldeItem(item: SoldeItem): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: SoldeItem[] = raw ? JSON.parse(raw) : [];
    existing.unshift(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('nisfy_soldes_updated'));
  } catch (err) {
    console.error('Error saving custom solde item:', err);
  }
}

export function boostSoldeItem(itemId: string, boostType: 'gold' | 'top_listing' | 'urgent'): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let items: SoldeItem[] = raw ? JSON.parse(raw) : [];
    
    // Check if it's already in custom items
    const index = items.findIndex((i) => i.id === itemId);
    if (index !== -1) {
      items[index].isBoosted = true;
      items[index].boostType = boostType;
      if (boostType === 'gold') {
        items[index].badge = '👑 VIP OR • ' + items[index].badge;
      } else if (boostType === 'urgent') {
        items[index].badge = '⚡ URGENT • ' + items[index].badge;
      }
      // Move to top
      const boosted = items.splice(index, 1)[0];
      items.unshift(boosted);
    } else {
      // If it's in initial items, clone it into custom items as boosted
      const initial = INITIAL_SOLDE_ITEMS.find((i) => i.id === itemId);
      if (initial) {
        const cloned: SoldeItem = {
          ...initial,
          isBoosted: true,
          boostType: boostType,
          badge: boostType === 'gold' ? '👑 VIP OR • ' + initial.badge : '⚡ URGENT • ' + initial.badge
        };
        items.unshift(cloned);
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('nisfy_soldes_updated'));
    return true;
  } catch (err) {
    console.error('Error boosting solde item:', err);
    return false;
  }
}
