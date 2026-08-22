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
}

export const SPONSORED_ADS: Advertisement[] = [
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
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80'
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
    ]
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
    ]
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
    ]
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
    ]
  }
];
