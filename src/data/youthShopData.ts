export type ShopProductCategory = 
  | 'box_hdiya' 
  | 'trousseau_mode' 
  | 'bijoux_alliances' 
  | 'maison_deco' 
  | 'beaute_parfums' 
  | 'packs_jeunes';

export interface ShopProduct {
  id: string;
  titleFr: string;
  titleAr: string;
  descriptionFr: string;
  descriptionAr: string;
  category: ShopProductCategory;
  priceDzd: number;
  priceEur: number;
  discountPriceDzd?: number;
  sellerName: string;
  sellerWilaya: string;
  sellerWilayaCode: string;
  sellerVerified: boolean;
  sellerAvatar: string;
  sellerPhone: string;
  sellerInstagram?: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  images: string[];
  badges: string[];
  isTrending?: boolean;
  isHandmade?: boolean;
  sizes?: string[];
  colors?: { nameFr: string; nameAr: string; hex: string }[];
  allowPersonalization?: boolean;
  personalizationLabel?: string;
  deliveryEstimateDays: string;
}

export interface CartItem {
  product: ShopProduct;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  customNote?: string;
}

export const SHOP_CATEGORIES: { id: ShopProductCategory | 'all'; labelFr: string; labelAr: string; icon: string; descriptionFr: string }[] = [
  { 
    id: 'all', 
    labelFr: 'Tous les Articles', 
    labelAr: 'كل المنتجات', 
    icon: '✨',
    descriptionFr: 'Découvrez toutes les créations et articles tendance pour jeunes et mariés'
  },
  { 
    id: 'box_hdiya', 
    labelFr: 'Box Hdiya & Cadeaux', 
    labelAr: 'صناديق الهدايا والخطوبة', 
    icon: '🎁',
    descriptionFr: 'Coffrets de fiançailles, box henné et cadeaux personnalisés'
  },
  { 
    id: 'trousseau_mode', 
    labelFr: 'Trousseau & Mode Jeunes', 
    labelAr: 'جهاز العروس والموضة', 
    icon: '👗',
    descriptionFr: 'Caftans modernes, Karakous revisités, Qamis chics et tenues de fête'
  },
  { 
    id: 'bijoux_alliances', 
    labelFr: 'Alliances & Parures', 
    labelAr: 'خواتم الزواج والمجوهرات', 
    icon: '💍',
    descriptionFr: 'Solitaires, parures plaqué or, argent 925 et coffrets alliances'
  },
  { 
    id: 'maison_deco', 
    labelFr: 'Nid Douillet & Déco', 
    labelAr: 'ديكور المنزل وجهاز البيت', 
    icon: '🏡',
    descriptionFr: 'Linge de lit brodé, diffuseurs de parfum et accessoires maison pour jeunes couples'
  },
  { 
    id: 'beaute_parfums', 
    labelFr: 'Parfums & Soins Orientaux', 
    labelAr: 'العطور وعناية العروس', 
    icon: '💄',
    descriptionFr: 'Musc tahara, bakhour de luxe, huiles précieuses et soins naturels de la mariée'
  },
  { 
    id: 'packs_jeunes', 
    labelFr: 'Packs "Spécial Jeunes Mariés"', 
    labelAr: 'باقات خاصة للعرائس والعرسان', 
    icon: '⚡',
    descriptionFr: 'Packs tout-en-un avec réduction spéciale pour le lancement'
  },
];

export const INITIAL_SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'prod-1',
    titleFr: 'Coffret Royal "Hdiya de Fiançailles" Personnalisé',
    titleAr: 'صندوق الهدايا الملكي للخطوبة مخصص بالأسماء',
    descriptionFr: 'Magnifique coffret en velours vert émeraude et doré comprenant un Coran brodé au prénom des fiancés, flacon de Musc Royal, chapelet en cristal, et bakhour artisanal de Constantine. Emballage cadeau raffiné inclus.',
    descriptionAr: 'صندوق مخملي فاخر باللون الأخضر الزمردي والذهبي يحتوي على مصحف شريف مطرز باسم الخطيبين، مسك ملكي أصلي، مسبحة كريستال وبخور قسنطيني فاخر مع علبة تغليف هدية راقية.',
    category: 'box_hdiya',
    priceDzd: 12500,
    priceEur: 65,
    discountPriceDzd: 9900,
    sellerName: 'Atelier Dar El Hdiya',
    sellerWilaya: 'Alger (16)',
    sellerWilayaCode: '16',
    sellerVerified: true,
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    sellerPhone: '+213 555 12 34 56',
    sellerInstagram: '@dar_elhdiya_dz',
    rating: 4.9,
    reviewsCount: 42,
    inStock: true,
    stockCount: 15,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80'
    ],
    badges: ['Top Ventes 2026', 'Personnalisation Gratuite', 'Fait Main 🇩🇿'],
    isTrending: true,
    isHandmade: true,
    allowPersonalization: true,
    personalizationLabel: 'Prénoms des fiancés ou date de la Khetba à broder',
    colors: [
      { nameFr: 'Vert Émeraude & Or', nameAr: 'أخضر زمردي مع ذهبي', hex: '#064e3b' },
      { nameFr: 'Bordeaux Royal', nameAr: 'عنابي ملكي', hex: '#881337' },
      { nameFr: 'Blanc Nacré & Argent', nameAr: 'أبيض لؤلؤي وفضي', hex: '#e2e8f0' }
    ],
    deliveryEstimateDays: '48h à 72h (Yalidine)'
  },
  {
    id: 'prod-2',
    titleFr: 'Karakou Moderne "Rêve d’Alger" en Velours de Soie',
    titleAr: 'كاراكو عصري حريري "حلم الجزائر" بتطريز المجبود',
    descriptionFr: 'Création exclusive alliant la tradition algéroise et une coupe cintrée moderne. Veste en velours de soie pur brodée au fil de cannetille dorée (Majboud) avec son pantalon Seroual Mdouwer fluide.',
    descriptionAr: 'تصميم حصري يجمع بين الأصالة العاصمية والقصة العصرية الأنيقة. سترة من المخمل الحريري الخالص مطرزة بخيوط المجبود الذهبي مع سروال مدور حريري انسيابي.',
    category: 'trousseau_mode',
    priceDzd: 38000,
    priceEur: 190,
    discountPriceDzd: 32000,
    sellerName: 'Maison Sarah Haute Couture',
    sellerWilaya: 'Alger (16)',
    sellerWilayaCode: '16',
    sellerVerified: true,
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    sellerPhone: '+213 550 78 90 12',
    sellerInstagram: '@sarah_couture_dz',
    rating: 5.0,
    reviewsCount: 28,
    inStock: true,
    stockCount: 6,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'
    ],
    badges: ['Coup de Cœur Créatrice', 'Sur-Mesure Disponible', 'Édition Limitée'],
    isTrending: true,
    isHandmade: true,
    sizes: ['36 (S)', '38 (M)', '40 (L)', '42 (XL)', 'Sur-mesure'],
    colors: [
      { nameFr: 'Noir Profond & Or', nameAr: 'أسود ملكي مع ذهبي', hex: '#0f172a' },
      { nameFr: 'Bleu Roi Impérial', nameAr: 'أزرق ملكي', hex: '#1e3a8a' },
      { nameFr: 'Vert Bouteille', nameAr: 'أخضر داكن', hex: '#14532d' }
    ],
    deliveryEstimateDays: '3 à 5 jours ouvrés'
  },
  {
    id: 'prod-3',
    titleFr: 'Duo Alliances "Amour Éternel" Argent 925 & Zirconium',
    titleAr: 'طقم دبلتي زواج للعروسين من الفضة الخالصة 925',
    descriptionFr: 'Paire d’alliances complémentaires pour mariés : bague solitaire étincelante avec pierre en oxyde de zirconium pour la mariée, et anneau satiné brossé élégant pour l’homme. Gravure intérieure gratuite.',
    descriptionAr: 'طقم خاتمي زواج متكامل للعروسين من الفضة الإيطالية عيار 925 مع حجر زركون برّاق للعروس وخاتم مصقول أنيق للعريس مع خدمة الحفر المجاني لأسماء وتاريخ الزواج بالداخل.',
    category: 'bijoux_alliances',
    priceDzd: 18500,
    priceEur: 95,
    discountPriceDzd: 14900,
    sellerName: 'Bijouterie El Qods',
    sellerWilaya: 'Oran (31)',
    sellerWilayaCode: '31',
    sellerVerified: true,
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    sellerPhone: '+213 540 22 33 44',
    sellerInstagram: '@elqods_bijoux_oran',
    rating: 4.8,
    reviewsCount: 35,
    inStock: true,
    stockCount: 20,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
    ],
    badges: ['Argent 925 Garanti', 'Gravure Offerte', 'Écrin Led Inclus'],
    isTrending: true,
    allowPersonalization: true,
    personalizationLabel: 'Initiales et date du mariage à graver à l\'intérieur des bagues',
    sizes: ['Tailles Femme: 50 à 58', 'Tailles Homme: 58 à 66'],
    deliveryEstimateDays: '48h chrono'
  },
  {
    id: 'prod-4',
    titleFr: 'Coffret Prestige "Rituel Henné & Beauté de la Mariée"',
    titleAr: 'طقم فاخر "طقوس حناء العروس والجمال الطبيعي"',
    descriptionFr: 'Kit complet traditionnel et esthétique pour la nuit du henné : poudre de henné naturel royal de Tindouf ultra-fine, seringues applicatrices précises, gants brodés en satin, bougies parfumées à la fleur d\'oranger et coupelle dorée artisanale.',
    descriptionAr: 'طقم متكامل لليلة الحناء يجمع بين التقاليد واللمسة العصرية : حناء ملكي طبيعي من تندوف ناعم ومصفى، قفازات حريرية مطرزة، شموع معطرة بماء الزهر، وطبق نحاسي مذهب أصيل.',
    category: 'beaute_parfums',
    priceDzd: 7500,
    priceEur: 38,
    discountPriceDzd: 5900,
    sellerName: 'Henné & Secrets d’Orient',
    sellerWilaya: 'Tlemcen (13)',
    sellerWilayaCode: '13',
    sellerVerified: true,
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    sellerPhone: '+213 560 99 88 77',
    sellerInstagram: '@henne_tlemcen_bio',
    rating: 4.9,
    reviewsCount: 51,
    inStock: true,
    stockCount: 30,
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
    ],
    badges: ['100% Naturel & Bio', 'Tradition Tlemcénienne', 'Prêt à l\'Emploi'],
    isTrending: false,
    isHandmade: true,
    deliveryEstimateDays: '48h à 72h'
  },
  {
    id: 'prod-5',
    titleFr: 'Parure de Lit Satin de Coton "Nid Douillet" 6 Pièces',
    titleAr: 'طقم أفرشة سرير العروس من ساتان القطن الفاخر 6 قطع',
    descriptionFr: 'Indispensable pour le trousseau de maison de la mariée ! Satin de coton égyptien 400 fils, toucher soyeux d\'une extrême douceur avec broderie fine ton-sur-ton et taies d\'oreillers festonnées.',
    descriptionAr: 'أساسي لجهاز بيت العروس ! قطن مصري ساتان فائق النعومة 400 خيط مع تطريز راقٍ وحواشي أنيقة لأجواء نوم فندقية مريحة وفاخرة.',
    category: 'maison_deco',
    priceDzd: 16500,
    priceEur: 85,
    discountPriceDzd: 13500,
    sellerName: 'Maison Blanche Home Textile',
    sellerWilaya: 'Sétif (19)',
    sellerWilayaCode: '19',
    sellerVerified: true,
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    sellerPhone: '+213 552 44 55 66',
    sellerInstagram: '@maisonblanche_setif',
    rating: 4.7,
    reviewsCount: 19,
    inStock: true,
    stockCount: 12,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80'
    ],
    badges: ['Grand Confort', 'Trousseau Essentiel', 'Anti-Boulochage'],
    colors: [
      { nameFr: 'Blanc Pur Hôtelier', nameAr: 'أبيض ناصع', hex: '#ffffff' },
      { nameFr: 'Beige Crème Chaud', nameAr: 'بيج كريمي دافئ', hex: '#f5efe6' },
      { nameFr: 'Gris Perle Satiné', nameAr: 'رمادي لؤلؤي', hex: '#cbd5e1' }
    ],
    deliveryEstimateDays: '48h à 72h'
  },
  {
    id: 'prod-6',
    titleFr: 'Qamis Émirati Chic & Broderie Manuelle pour Homme',
    titleAr: 'قميص رجالي فاخر قماش إماراتي بتطريز يدوي أنيق',
    descriptionFr: 'Qamis moderne haut de gamme en tissu infroissable respirant avec col rigide élégant et broderie subtile sur le torse. Idéal pour la Khetba, le Fatiha et les vendredis.',
    descriptionAr: 'قميص رجالي عصري مميز بقماش فاخر مقاوم للتجعد مع ياقة مستقيمة وتطريز خفيف راقٍ على الصدر. مثالي للخطوبة، قراءة الفاتحة والمناسبات الدينية.',
    category: 'trousseau_mode',
    priceDzd: 8900,
    priceEur: 45,
    discountPriceDzd: 7200,
    sellerName: 'Boutique Al-Baraa Couture',
    sellerWilaya: 'Constantine (25)',
    sellerWilayaCode: '25',
    sellerVerified: true,
    sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    sellerPhone: '+213 558 11 22 33',
    sellerInstagram: '@albaraa_homme_dz',
    rating: 4.9,
    reviewsCount: 39,
    inStock: true,
    stockCount: 18,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80'
    ],
    badges: ['Tissu Anti-Pli', 'Coupe Confort', 'Qualité Premium'],
    sizes: ['52 (S / 1m65-1m70)', '54 (M / 1m70-1m75)', '56 (L / 1m75-1m80)', '58 (XL / 1m80-1m85)'],
    colors: [
      { nameFr: 'Blanc Neige', nameAr: 'أبيض ثلجي', hex: '#ffffff' },
      { nameFr: 'Bleu Nuit Foncé', nameAr: 'أزرق ليلي', hex: '#0f172a' },
      { nameFr: 'Vert Sauge Pastel', nameAr: 'أخضر هادئ', hex: '#84a98c' }
    ],
    deliveryEstimateDays: '48h (Yalidine)'
  },
  {
    id: 'prod-7',
    titleFr: 'Pack "Grand Départ Lune de Miel" (Couple)',
    titleAr: 'باقة "سفر شهر العسل" متكاملة للعروسين',
    descriptionFr: 'Pack complet voyage comprenant 2 passeports cover en cuir personnalisés à vos initiales, 2 étiquettes bagages assorties, une trousse de toilette double compartiment, et un album photo souvenirs relié main.',
    descriptionAr: 'باقة متكاملة لرحلة شهر العسل تضم غلافي جواز سفر جلديين مخصصين بالحروف الأولى للعروسين، بطاقات حقائب مطابقة، حقيبة مستلزمات مزدوجة، وألبوم صور فاخر لتخليد الذكريات.',
    category: 'packs_jeunes',
    priceDzd: 11000,
    priceEur: 55,
    discountPriceDzd: 8500,
    sellerName: 'Nomad Couple DZ',
    sellerWilaya: 'Batna (05)',
    sellerWilayaCode: '05',
    sellerVerified: true,
    sellerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    sellerPhone: '+213 549 77 66 55',
    sellerInstagram: '@nomad_couple_dz',
    rating: 4.8,
    reviewsCount: 22,
    inStock: true,
    stockCount: 10,
    images: [
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&auto=format&fit=crop&q=80'
    ],
    badges: ['Idéal Cadeau Mariage', 'Cuir Véritable', 'Gravure Personnalisée'],
    allowPersonalization: true,
    personalizationLabel: 'Initiales du couple (ex: S & D) et date de départ',
    deliveryEstimateDays: '48h à 72h'
  },
  {
    id: 'prod-8',
    titleFr: 'Diffuseur Électrique "Bakhour & Oud" Sans Fumée + Coffret 3 Encens',
    titleAr: 'مبخرة كهربائية عصرية بدون دخان مع باقة 3 عطور عود فاخرة',
    descriptionFr: 'Appareil moderne et sécurisé au design oriental minimaliste pour parfumer délicatement votre nouveau foyer. Chauffe en céramique sans charbon, autonomie USB rechargeable et 3 pots d\'encens artisanaux offerts.',
    descriptionAr: 'مبخرة ذكية آمنة وعصرية بتصميم إسلامي ناعم لتعطير البيت الجديد. تسخين سيراميكي بدون فحم، قابلة للشحن عبر USB مع 3 علب بخور عود شرقي أصلي مجاناً.',
    category: 'maison_deco',
    priceDzd: 6800,
    priceEur: 35,
    discountPriceDzd: 5200,
    sellerName: 'Ambiance & Bakhour DZ',
    sellerWilaya: 'Béjaïa (06)',
    sellerWilayaCode: '06',
    sellerVerified: true,
    sellerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    sellerPhone: '+213 556 33 22 11',
    sellerInstagram: '@bakhour_bejaia_shop',
    rating: 4.9,
    reviewsCount: 64,
    inStock: true,
    stockCount: 25,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80'
    ],
    badges: ['Rechargeable USB', 'Sans Charbon / Sans Danger', 'Livraison Rapide'],
    colors: [
      { nameFr: 'Noir Mat & Or Rose', nameAr: 'أسود مع ذهبي وردي', hex: '#1e293b' },
      { nameFr: 'Blanc Marbré', nameAr: 'أبيض رخامي', hex: '#f8fafc' }
    ],
    deliveryEstimateDays: '24h à 48h'
  }
];
