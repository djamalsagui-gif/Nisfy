export type SubscriptionPlan = '1_mois' | '3_mois' | '6_mois' | '1_an' | 'partenaire_officiel';
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'expired';

export interface Advertisement {
  id: string;
  brandName: string;
  brandNameAr: string;
  category: 'venue' | 'fashion' | 'travel' | 'photo' | 'catering' | 'jewelry' | 'auto';
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
  },
  {
    id: 'ad-zekri-auto-location',
    brandName: 'Zekri Auto Location • Cortèges & Mariage 🚗💍',
    brandNameAr: 'زكري أوتو لوكاسيون • كراء سيارات الأعراس والمواكب',
    category: 'auto',
    categoryLabel: 'Location Véhicules de Marque & Cortège',
    categoryLabelAr: 'كراء سيارات الماركات العالمية لمواكب الأعراس',
    tagline: 'Mercedes, Audi, Range Rover & Porsche pour un cortège de mariage royal',
    taglineAr: 'مرسيدس، أودي، رانج روفر وبورش لموكب زفاف ملكي لا يُنسى',
    description: 'Zekri Auto Location met à votre disposition une flotte prestigieuse de voitures de grande marque pour vos fêtes de fiançailles, cortèges nuptiaux et cérémonies de mariage. Chauffeurs VIP en costume d’apparat, rubans et décorations florales raffinées offerts, service de navette aéroport pour les invités de la diaspora et disponibilité 24/7 sur Alger et toutes les wilayas.',
    descriptionAr: 'تقدم لكم وكالة زكري أوتو لوكاسيون أسطولاً استثنائياً من أفخم السيارات الفاخرة المخصصة لمواكب الأعراس والأفراح بالجزائر. تزيين راقٍ بالورود، سائقين محترفين ببذلات رسمية، وخدمة خاصة للمغتربين والضيوف 24/7 في كافة الولايات.',
    bannerImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
    logoImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    ],
    promoCode: 'ZEKRI-NISFY10',
    discountBadge: '-10% + Décoration Florale Offerte',
    discountBadgeAr: 'تخفيض 10% + تزيين الورد مجاناً',
    wilayas: ['16 - Alger', '09 - Blida', '35 - Boumerdès', '31 - Oran', '25 - Constantine', 'Toutes les Wilayas'],
    phone: '+213 550 88 44 22',
    whatsapp: '+213550884422',
    rating: 4.9,
    reviewsCount: 164,
    featured: true,
    priceStartingFrom: '25 000 DZD / jour',
    features: [
      'Flotte de prestige : Mercedes Classe S, Range Rover, Audi Q8, BMW',
      'Chauffeur VIP en costume inclus ou mise à disposition',
      'Décoration florale de mariage & rubans personnalisés offerts',
      'Livraison du véhicule au domicile ou à la salle des fêtes',
    ],
    featuresAr: [
      'أسطول سيارات ملكي : مرسيدس، رانج روفر، أودي، بي إم دبليو',
      'سائق VIP محترف باللباس الرسمي متوفر عند الطلب',
      'تزيين طبيعي بالورود والأشرطة الفاخرة مهداة مع الحجز',
      'توصيل واستلام السيارة أمام البيت أو قاعة الحفلات',
    ],
    musicThemeId: 'track-zorna-cortege',
    musicThemeTitle: 'Mawakib El Afrah • Cortège & Zorna Royale',
    musicThemeGenre: 'Cortège & Fête Populaire',
    isActive: true,
    advertiserContactPerson: 'M. Zekri (Direction)',
    advertiserEmail: 'contact@zekri-autolocation.dz',
    subscriptionPlan: '1_an',
    subscriptionPlanLabel: 'Pack Prestige Annuel (12 Mois)',
    monthlyFee: '35 000 DZD / mois',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    paymentDueDate: '2026-09-01',
    paymentStatus: 'paid',
    lastPaymentDate: '2026-08-01',
    internalNotes: 'Partenaire Officiel Voitures de Prestige & Cortèges Mariage NISFY.',
  },
  {
    id: 'ad-mirou-diner-domicile',
    brandName: 'Maison Mirou • Chef Privé & Dîner à Domicile 🍽️✨',
    brandNameAr: 'دار ميرو • شيف خاص وخدمة تحضير العشاء الملكي بالمنزل',
    category: 'catering',
    categoryLabel: 'Location Service Dîner & Chef à Domicile',
    categoryLabelAr: 'كراء خدمات الطبخ وتحضير العشاء المنزلي الفاخر',
    tagline: 'Votre chef privé à domicile : une expérience gastronomique 5 étoiles pour vos dîners romantiques, fiançailles et fêtes',
    taglineAr: 'شيفكم الخاص في المنزل : تجربة طهي 5 نجوم لسهراتكم الرومانسية، الخطوبة والولائم العائلية',
    description: 'Maison Mirou révolutionne vos réceptions privées avec un service clé en main de chef et traiteur gastronomique à domicile. Idéal pour vos dîners romantiques en tête-à-tête, fiançailles intimes, anniversaires de mariage, réceptions familiales et repas d’affaires. Mirou s’occupe de tout : sélection des meilleurs ingrédients frais du terroir, élaboration de menus sur-mesure (cuisine traditionnelle algérienne raffinée et gastronomie internationale), location de vaisselle d’exception et d’argenterie dorée, dressage somptueux de la table, service discret et professionnel, et remise en état impeccable de votre cuisine.',
    descriptionAr: 'تقدم لكم دار ميرو خدمة استثنائية لطهي وتحضير العشاء الفاخر مباشرة في منازلكم مع توفير كافة لوازم الضيافة. مثالية لسهرات العشاق الرومانسية، حفلات الخطوبة، أعياد الزواج والمناسبات العائلية الخاصة. يتكفل الشيف ميرو بكل التفاصيل: شراء أجود المكونات الطازجة، إعداد أشهى الأطباق الجزائرية العريقة والوصفات العالمية الراقية، كراء أطقم الأواني الفاخرة والملاعق الذهبية، تزيين المائدة، الخدمة الاحترافية وتنظيف المطبخ بالكامل.',
    bannerImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    logoImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80',
    ],
    promoCode: 'MIROU-NISFY15',
    discountBadge: '-15% + Amuse-Bouches & Cocktail Offerts',
    discountBadgeAr: 'تخفيض 15% + مقبلات الشيف وعصائر طبيعية مجاناً',
    wilayas: ['16 - Alger', '09 - Blida', '35 - Boumerdès', '42 - Tipaza', '31 - Oran', '25 - Constantine'],
    phone: '+213 555 42 19 80',
    whatsapp: '+213555421980',
    rating: 5.0,
    reviewsCount: 182,
    featured: true,
    priceStartingFrom: '18 000 DZD / prestation',
    address: 'Prestation à Domicile • Alger, Blida, Tipaza, Boumerdès et Grand Centre',
    addressAr: 'خدمة منزلية راقية مع التنقل إلى العاصمة، البليدة، تيبازة، بومرداس وكافة المدن',
    features: [
      'Formule Dîner Romantique en tête-à-tête (Bougies, chandeliers & ambiance tamisée)',
      'Location complète de matériel : vaisselle luxe, verres cristal, couverts dorés & réchauds',
      'Menus algériens d’apparat : Rechta impériale, Tajine El Khowk, Couscous d’or, Pastilla',
      'Service de table VIP discret et nettoyage complet de la cuisine avant départ',
    ],
    featuresAr: [
      'صيغة العشاء الرومانسي لشخصين (شموع، مائدة مضاءة، قائمة طعام ملكية من 3 أطباق)',
      'كراء وتوفير عتاد الضيافة : أواني بورسلين فاخرة، كؤوس كريستال وملاعق مذهبة',
      'أطباق جزائرية تقليدية راقية : رشتة بالدجاج البلدي، طاجين الخوخ، كسكسي الأفراح، بسطيلة',
      'خدمة مائدة VIP احترافية مع تنظيف وتطهير المطبخ بالكامل قبل المغادرة',
    ],
    musicThemeId: 'track-andalous-soiree',
    musicThemeTitle: 'Nawbet El Qods • Soirée Andalouse & Dîner Intime',
    musicThemeGenre: 'Musique Andalouse & Ambiance Feutrée',
    isActive: true,
    advertiserContactPerson: 'Chef Amira "Mirou" Khelifi',
    advertiserEmail: 'contact@maison-mirou.dz',
    subscriptionPlan: '1_an',
    subscriptionPlanLabel: 'Partenaire Officiel Dîner & Chef à Domicile NISFY',
    monthlyFee: '30 000 DZD / mois',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    paymentDueDate: '2026-09-01',
    paymentStatus: 'paid',
    lastPaymentDate: '2026-08-01',
    internalNotes: 'Partenaire exclusif Préparation Dîner à Domicile & Location Service Table Mirou.',
  }
];
