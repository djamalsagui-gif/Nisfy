export type SubscriptionPlan = '1_mois' | '3_mois' | '6_mois' | '1_an' | 'partenaire_officiel';
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'expired';

export interface Advertisement {
  id: string;
  brandName: string;
  brandNameAr: string;
  category: 'venue' | 'fashion' | 'travel' | 'photo' | 'catering' | 'jewelry';
  categoryLabel: string;
  categoryLabelAr: string;
  tagline: string;
  taglineAr: string;
  description: string;
  descriptionAr: string;
  bannerImage: string;
  logoImage: string;
  galleryImages: string[];
  promoCode: string;
  discountBadge: string;
  discountBadgeAr: string;
  wilayas: string[];
  phone: string;
  whatsapp: string;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  features: string[];
  featuresAr: string[];
  websiteUrl?: string;
  priceStartingFrom?: string;
  address?: string;
  addressAr?: string;
  googleMapsUrl?: string;
  city?: string;
  country?: string;

  // Media Quotas & Uploaded Assets (for Contract & Ads Display)
  photosQuota?: number;
  videosQuota?: number;
  videoUrls?: string[];
  uploadedMediaFiles?: {
    id: string;
    name: string;
    type: 'photo' | 'video';
    url: string;
    sizeFormatted?: string;
    uploadedAt?: string;
  }[];

  // Thematic Music Audio Soundtrack
  musicThemeId?: string;
  musicThemeTitle?: string;
  musicThemeGenre?: string;
  musicThemeUrl?: string;

  // Management & Subscription Tracking
  isActive: boolean;
  advertiserContactPerson?: string;
  advertiserEmail?: string;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionPlanLabel?: string;
  monthlyFee?: string;
  startDate?: string;
  endDate?: string;
  paymentDueDate?: string;
  paymentStatus?: PaymentStatus;
  lastPaymentDate?: string;
  internalNotes?: string;
}

export const SPONSORED_ADS: Advertisement[] = [
  {
    id: 'ad-don-jeovani-denia',
    brandName: 'Restaurant DON-JEOVANI • Chef Djamel-Michel 🇪🇸',
    brandNameAr: 'مطعم دون جيوفاني • الشيف جمال ميشيل (إسبانيا)',
    category: 'catering',
    categoryLabel: 'Gastronomie Espagnole & Paella Méditerranéenne',
    categoryLabelAr: 'فنون الطهي الإسباني والبايا المتوسطية',
    tagline: 'Le Chef Djamel-Michel vous invite à déguster ses spécialités et sa fameuse Paella à Dénia',
    taglineAr: 'الشيف جمال ميشيل يدعوكم لتذوق أشهى أطباق البايا والمأكولات الإسبانية في دينيا',
    description: 'Le Chef Djamel-Michel vous ouvre chaleureusement les portes du restaurant DON-JEOVANI à Dénia (Espagne). Maître de la gastronomie espagnole authentique : Paella Valenciana au feu de bois, Paella de Marisco aux fruits de mer frais de la Méditerranée, Arroz a Banda, Tapas ibériques raffinées et poissons grillés. Une expérience culinaire inoubliable pour vos séjours, dîners en amoureux, réceptions privées et lunes de miel sur la Costa Blanca.',
    descriptionAr: 'يستقبلكم الشيف جمال ميشيل في مطعمه الشهير دون جيوفاني بمدينة دينيا الساحلية بإسبانيا. تشكيلة ملكية من أطباق البايا الإسبانية الأصيلة (بايا ثمار البحر، بايا فالنسيانا، أرز أ باندا)، مقبلات التاباس الإيبيرية والأسماك الطازجة. دعوة مميزة لرحلاتكم وعطلاتكم بأجواء متوسطية ساحرة.',
    bannerImage: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1000&q=80',
    logoImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80'
    ],
    promoCode: 'NISFY-DENIA15',
    discountBadge: '-15% + Dessert du Chef Offert',
    discountBadgeAr: 'تخفيض 15% + تحلية الشيف مجانية',
    wilayas: ['Dénia (Alicante - Espagne 🇪🇸)', 'International & Diaspora'],
    address: 'Restaurant DON-JEOVANI, Dénia, Alicante, Costa Blanca, Espagne 🇪🇸',
    addressAr: 'مطعم دون جيوفاني، دينيا، أليكانتي، كوستا بلانكا، إسبانيا 🇪🇸',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Restaurant+DON+JEOVANI+Denia+Alicante+Spain',
    city: 'Dénia',
    country: 'Espagne',
    phone: '+34 965 78 00 00',
    whatsapp: '+34600123456',
    rating: 5.0,
    reviewsCount: 189,
    featured: true,
    priceStartingFrom: '18 € / menu',
    features: [
      'Paella artisanale géante & Fruits de mer frais',
      'Accueil chaleureux par le Chef Djamel-Michel',
      'Terrasse d’ambiance méditerranéenne à Dénia',
      'Réservations tables VIP pour couples & familles'
    ],
    featuresAr: [
      'بايا إسبانية طازجة ومأكولات بحرية يومية',
      'استقبال مميز وخاص من الشيف جمال ميشيل',
      'جلسات راقية بإطلالة متوسطية في دينيا',
      'حجوزات طاولات VIP للعائلات والعرسان'
    ],
    // Thematic background soundtrack
    musicThemeId: 'track-lounge-denia',
    musicThemeTitle: 'Costa Blanca Breeze • Lounge Gastronomie Don-Jeovani',
    musicThemeGenre: 'Lounge Méditerranéen',
    // Subscription details
    isActive: true,
    advertiserContactPerson: 'Chef Djamel-Michel',
    advertiserEmail: 'contact@donjeovani-denia.es',
    subscriptionPlan: '1_an',
    subscriptionPlanLabel: 'Pack Prestige International (12 Mois)',
    monthlyFee: '120 € / mois',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    paymentDueDate: '2026-09-01',
    paymentStatus: 'paid',
    lastPaymentDate: '2026-08-01',
    internalNotes: 'Partenaire VIP Espagne - Renouvellement automatique avec réduction membre.'
  },
  {
    id: 'ad-palais-el-bahia',
    brandName: 'Palais El-Bahia • قصر الباهية',
    brandNameAr: 'قصر الباهية للأعراس والمؤتمرات',
    category: 'venue',
    categoryLabel: 'Salles des Fêtes & Banquets',
    categoryLabelAr: 'قاعات الحفلات والأعراس',
    tagline: 'L’écrin royal pour célébrer votre union sacrée',
    taglineAr: 'المكان المثالي لليلة العمر والفرحة الكبرى',
    description: 'Salle des fêtes de grand standing climatisée, capacité 600 personnes. Traiteur gastronomique algérien, zorna traditionnelle, suite nuptiale offerte aux mariés et parking sécurisé.',
    descriptionAr: 'قاعة فخمة مكيفة تتسع لـ 600 شخص مع أرقى خدمات الإطعام الجزائري الأصيل، جناح خاص بالعروسين وموقف سيارات محروس.',
    bannerImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80',
    logoImage: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80'
    ],
    promoCode: 'NISFY-BAHIA15',
    discountBadge: '-15% sur réservation',
    discountBadgeAr: 'تخفيض 15% لمشتركي نصفي',
    wilayas: ['16 - Alger', '31 - Oran', '25 - Constantine'],
    phone: '+213 555 12 34 56',
    whatsapp: '+213555123456',
    rating: 4.9,
    reviewsCount: 142,
    featured: true,
    priceStartingFrom: '180 000 DZD',
    features: [
      'Capacité 600 convives',
      'Traiteur gastronomique inclus',
      'Suite nuptiale 5 étoiles',
      'Sonorisation & éclairage laser 4K'
    ],
    featuresAr: [
      'سعة تصل إلى 600 ضيف',
      'خدمة إطعام راقية متكاملة',
      'جناح فاخر مخصص للعروسين',
      'أحدث أنظمة الإضاءة والصوتيات'
    ],
    musicThemeId: 'track-zorna-cortege',
    musicThemeTitle: 'Zorna & Bendir • Cortège Impérial DZ',
    musicThemeGenre: 'Zorna & Percussions',
    isActive: true,
    advertiserContactPerson: 'M. Amine Reda (Gérant)',
    advertiserEmail: 'contact@palais-elbahia.dz',
    subscriptionPlan: '6_mois',
    subscriptionPlanLabel: 'Pack Salle Royale (6 Mois)',
    monthlyFee: '40 000 DZD / mois',
    startDate: '2026-03-01',
    endDate: '2026-08-31',
    paymentDueDate: '2026-08-30',
    paymentStatus: 'pending',
    lastPaymentDate: '2026-07-28',
    internalNotes: 'Échéance mensuelle à surveiller pour fin août.'
  },
  {
    id: 'ad-dar-el-caftan',
    brandName: 'Dar El Caftan & Karakou • دار القفطان',
    brandNameAr: 'دار القفطان والكاراكو الجزائري',
    category: 'fashion',
    categoryLabel: 'Trousseau & Haute Couture',
    categoryLabelAr: 'جهاز العروس والأزياء التقليدية',
    tagline: 'Karakou algérois, Gandoura constantinoise & Caftans royaux',
    taglineAr: 'كاراكو عاصمي، قندورة قسنطينية وقفاطين ملكية فاخرة',
    description: 'Sublimez votre fête avec nos collections artisanales brodées au fil d’or véritable (Fetla & Medjboud). Vente et location sur mesure avec livraison assurée dans les 69 Wilayas.',
    descriptionAr: 'تألقي بأبهى حلة تقليدية مع تطريز يدوي بالفتلة والمجبود الأصيل. بيع وكراء حسب الطلب وتوصيل لكافة الولايات.',
    bannerImage: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=80',
    logoImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
    ],
    promoCode: 'CHOURA-NISFY',
    discountBadge: '-20% Trousseau Complet',
    discountBadgeAr: 'خصم 20% على باقة جهاز العروس',
    wilayas: ['69 Wilayas + Diaspora'],
    phone: '+213 661 98 76 54',
    whatsapp: '+213661987654',
    rating: 4.8,
    reviewsCount: 98,
    featured: true,
    priceStartingFrom: '45 000 DZD',
    features: [
      'Broderie main Fetla & Medjboud',
      'Essayage privé sur rendez-vous',
      'Accessoires & Khit Errouh offerts',
      'Livraison express sécurisée'
    ],
    featuresAr: [
      'تطريز يدوي بالفتلة والمجبود',
      'جلسة قياس وتجربة خاصة',
      'إكسسوارات وخيط الروح هدية',
      'توصيل سريع ومضمون'
    ],
    musicThemeId: 'track-andalou-malouf',
    musicThemeTitle: 'Nouba Royale • Malouf & Violon Andalou',
    musicThemeGenre: 'Andalou & Malouf',
    isActive: true,
    advertiserContactPerson: 'Mme Meriem B.',
    advertiserEmail: 'contact@dar-elcaftan.dz',
    subscriptionPlan: '3_mois',
    subscriptionPlanLabel: 'Pack Trousseau Prestige (3 Mois)',
    monthlyFee: '25 000 DZD / mois',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    paymentDueDate: '2026-08-20',
    paymentStatus: 'overdue',
    lastPaymentDate: '2026-07-15',
    internalNotes: 'Paiement en retard de 4 jours. Rappel WhatsApp envoyé.'
  },
  {
    id: 'ad-safir-voyages',
    brandName: 'Safir Omra & Lune de Miel • سفير للسياحة',
    brandNameAr: 'سفير للسياحة والعمرة ورحلات شهر العسل',
    category: 'travel',
    categoryLabel: 'Voyages de Noces & Omra',
    categoryLabelAr: 'رحلات شهر العسل والعمرة في ثنائي',
    tagline: 'Commencez votre vie à deux par une Omra bénie ou une escapade féérique',
    taglineAr: 'ابدأوا حياتكما الزوجية بعمرة مباركة أو رحلة استرخاء لا تُنسى',
    description: 'Packs Duo Omra VIP avec hôtels 5 étoiles en face du Haram, transferts privés et guide bilingue. Également séjours lune de miel en Turquie, Malaisie et Zanzibar.',
    descriptionAr: 'برامج عمرة VIP للزوجين مع فنادق 5 نجوم مطلة على الحرم، رحلات شهر عسل متميزة إلى ماليزيا وتركيا وزنجبار.',
    bannerImage: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1000&q=80',
    logoImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    promoCode: 'BARAKA-COUPLE',
    discountBadge: '30 000 DZD de remise',
    discountBadgeAr: 'تخفيض 30,000 دج للزوجين',
    wilayas: ['Toutes Wilayas & International'],
    phone: '+213 770 45 67 89',
    whatsapp: '+213770456789',
    rating: 5.0,
    reviewsCount: 215,
    featured: true,
    priceStartingFrom: '195 000 DZD / pers.',
    features: [
      'Hôtels 5★ vue Haram',
      'Visa Omra & Assurance inclus',
      'Shooting souvenir offert',
      'Facilités de paiement disponibles'
    ],
    featuresAr: [
      'فنادق 5 نجوم مطلة على الحرم',
      'شامل التأشيرة والتأمين',
      'جلسة تصوير تذكارية مجانية',
      'تسهيلات في الدفع'
    ],
    musicThemeId: 'track-chaabi-casbah',
    musicThemeTitle: 'Nostalgie Chaâbi • Mandole & Qçid',
    musicThemeGenre: 'Chaâbi Algérois',
    isActive: true,
    advertiserContactPerson: 'M. Karim Safir',
    advertiserEmail: 'karim@safirvoyages.dz',
    subscriptionPlan: '1_an',
    subscriptionPlanLabel: 'Pack Agence Officielle (12 Mois)',
    monthlyFee: '35 000 DZD / mois',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    paymentDueDate: '2026-09-05',
    paymentStatus: 'paid',
    lastPaymentDate: '2026-08-04',
    internalNotes: 'Client fidèle. Règlements par virement bancaire mensuel.'
  },
  {
    id: 'ad-studio-nour',
    brandName: 'Studio Prestige Mariage • استوديو نور',
    brandNameAr: 'استوديو نور للإنتاج والتصوير السينمائي',
    category: 'photo',
    categoryLabel: 'Photographie & Vidéo Drone 4K',
    categoryLabelAr: 'تصوير احترافي وفيديو درون 4K',
    tagline: 'Immortalisez les plus doux souvenirs de votre mariage en 4K',
    taglineAr: 'خلدوا أجمل لحظات زفافكم بأرقى تقنيات الفيديو والصور السينمائية',
    description: 'Équipe féminine dédiée pour la mariée (100% respect de la discrétion). Prise de vue aérienne par Drone, Album photo cuir d’Italie et Teaser vidéo cinématographique.',
    descriptionAr: 'طاقم نسائي محترف ومخصص للعروس لضمان الخصوصية التامة. ألبومات إيطالية وتصوير درون سينمائي عالي الجودة.',
    bannerImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=80',
    logoImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
    ],
    promoCode: 'ALBUM-NISFY',
    discountBadge: 'Album Luxe Offert',
    discountBadgeAr: 'ألبوم إيطالي فاخر مجاني',
    wilayas: ['16 - Alger', '09 - Blida', '35 - Boumerdès', '15 - Tizi Ouzou'],
    phone: '+213 560 33 22 11',
    whatsapp: '+213560332211',
    rating: 4.9,
    reviewsCount: 84,
    featured: false,
    priceStartingFrom: '65 000 DZD',
    features: [
      'Équipe 100% féminine sur demande',
      'Livraison clé USB coffret bois',
      'Teaser vidéo sous 72h',
      'Photos illimitées en haute définition'
    ],
    featuresAr: [
      'طاقم نسائي كامل عند الطلب',
      'تسليم في علبة خشبية أنيقة',
      'تيزر الفيديو في غضون 72 ساعة',
      'صور غير محدودة بدقة فائقة'
    ],
    musicThemeId: 'track-romantic-piano',
    musicThemeTitle: 'Douceur Éternelle • Piano & Cordes Romantiques',
    musicThemeGenre: 'Romantique & Noces',
    isActive: true,
    advertiserContactPerson: 'Nour El Houda',
    advertiserEmail: 'nour@studionour.dz',
    subscriptionPlan: '1_mois',
    subscriptionPlanLabel: 'Pack Mensuel Essentiel',
    monthlyFee: '18 000 DZD / mois',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    paymentDueDate: '2026-08-31',
    paymentStatus: 'pending',
    lastPaymentDate: '2026-07-30',
    internalNotes: 'Pack test 1 mois.'
  }
];
