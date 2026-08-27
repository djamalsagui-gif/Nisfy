export type ContractType = 'advertising_sponsor' | 'ecommerce_vendor' | 'partnership_vip' | 'custom_service';
export type ContractStatus = 'draft' | 'under_review' | 'verified_ready' | 'signed_active' | 'suspended' | 'terminated';
export type PaymentSchedule = 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel_avance';
export type PaymentMethod = 'baridimob' | 'virement_cib' | 'ccp' | 'especes_recu' | 'carte_bancaire';

export interface ContractArticle {
  id: string;
  articleNumber: number;
  titleFr: string;
  titleAr: string;
  contentFr: string;
  contentAr: string;
  isMandatory: boolean;
  isVerified: boolean;
  customNotes?: string;
}

export interface ContractParty {
  role: 'provider' | 'client';
  entityName: string;
  entityNameAr?: string;
  representativeName: string;
  legalStatus: string; // SARL, EURL, Artisan, Entreprise Individuelle...
  rcNumber?: string; // Registre de Commerce
  nifNumber?: string; // NIF
  nisNumber?: string; // NIS
  address: string;
  wilaya: string;
  phone: string;
  email: string;
}

export interface ContractPaymentTerms {
  totalAmount: string;
  monthlyAmount: string;
  currency: 'DZD' | 'EUR';
  paymentMethods: PaymentMethod[];
  schedule: PaymentSchedule;
  gracePeriodDays: number;
  bankDetails?: string;
}

export interface ContractTerminationTerms {
  noticePeriodDays: number;
  immediateTerminationReasons: string[];
  refundPolicy: string;
}

export interface NisfyContract {
  id: string;
  contractNumber: string;
  contractType: ContractType;
  contractTypeLabel: string;
  contractTypeLabelAr: string;
  title: string;
  targetEntityId: string;
  targetEntityType: 'ad' | 'vendor';
  targetEntityName: string;
  dateIssued: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  durationLabel: string;
  provider: ContractParty;
  client: ContractParty;
  subjectFr: string;
  subjectAr: string;
  mediaQuota?: {
    photosCount: number;
    videosCount: number;
  };
  payment: ContractPaymentTerms;
  termination: ContractTerminationTerms;
  articles: ContractArticle[];
  allArticlesVerified: boolean;
  verifiedAt?: string;
  verifiedByAdminName?: string;
  status: ContractStatus;
  providerSigned: boolean;
  providerSignDate?: string;
  clientSigned: boolean;
  clientSignDate?: string;
  officialSealApplied: boolean;
  internalAdminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export const NISFY_PROVIDER_PARTY: ContractParty = {
  role: 'provider',
  entityName: 'NISFY MEDIA & DIGITAL SERVICES SARL',
  entityNameAr: 'شركة نصف دينك للإعلام والخدمات الرقمية ذ.م.م',
  representativeName: 'La Direction Générale NISFY Algérie',
  legalStatus: 'SARL au capital de 5 000 000 DZD',
  rcNumber: '16/00-0987654B26',
  nifNumber: '002616098765432',
  nisNumber: '002616123456789',
  address: 'Tour d\'Affaires El Qods, Niveau 12, Chéraga',
  wilaya: 'Alger (16)',
  phone: '+213 (0) 23 80 00 16 / +213 550 16 00 00',
  email: 'direction@nisfy-dz.com',
};

export const STANDARD_CONTRACT_ARTICLES: ContractArticle[] = [
  {
    id: 'art-1',
    articleNumber: 1,
    titleFr: 'Article 1 : Objet de la Convention',
    titleAr: 'المادة 1 : موضوع الاتفاقية والعقد',
    contentFr: `La présente convention a pour objet de définir les conditions techniques, juridiques et financières selon lesquelles NISFY SARL concède à l'Annonceur / Vendeur Partenaire des espaces de diffusion publicitaire sponsorisée, de visibilité numérique géolocalisée et/ou d'hébergement de boutique e-commerce sur la plateforme mobile et web NISFY Algérie & Diaspora.`,
    contentAr: `تهدف هذه الاتفاقية إلى تحديد الشروط والبنود التقنية والقانونية والمالية التي تمنح بموجبها شركة نصف دينك (NISFY) للطرف الثاني مساحات إعلانية مميزة وظهوراً تسويقياً موجهاً و/أو استضافة لمتجره الإلكتروني عبر المنصة الرقمية والتطبيق.`,
    isMandatory: true,
    isVerified: false,
  },
  {
    id: 'art-2',
    articleNumber: 2,
    titleFr: 'Article 2 : Description des Prestations & Emplacements Publicitaires',
    titleAr: 'المادة 2 : تفاصيل الخدمات والمساحات الترويجية الممنوحة',
    contentFr: `NISFY met à disposition de l'Annonceur :
1. Une fiche établissement ou boutique certifiée avec logo, photos haute définition, vidéo et coordonnées directes (Téléphone, WhatsApp, Google Maps, Instagram).
2. Un carrousel sponsorisé dans l'espace "Prestataires & Mariage" et/ou l'espace "E-Shop & Trousseau".
3. Un badge officiel "Partenaire Certifié 🇩🇿" garantissant la crédibilité auprès des utilisateurs.
4. L'accès à la distribution de codes promotionnels exclusifs négociés pour les futurs mariés de l'application.`,
    contentAr: `تضع منصة نصف دينك تحت تصرف المعلن:
1. بطاقة تجارية موثقة تضم الشعار، معرض صور بجودة عالية، فيديو، والاتصال المباشر (هاتف، واتساب، خرائط جوجل، إنستغرام).
2. ظهوراً في الشريط الترويجي المميز لقسم تنظيم الأعراس أو المتجر الإلكتروني.
3. شارة "شريك معتمد وموثق 🇩🇿" لتعزيز الثقة والمصداقية.
4. إمكانية إدراج عروض وتخفيضات حصرية لمستخدمي التطبيق.`,
    isMandatory: true,
    isVerified: false,
  },
  {
    id: 'art-3',
    articleNumber: 3,
    titleFr: 'Article 3 : Durée, Prise d\'Effet & Renouvellement',
    titleAr: 'المادة 3 : مدة العقد، السريان والتجديد',
    contentFr: `Le présent contrat est conclu pour la durée ferme stipulée aux conditions particulières, prenant effet à compter de la date de validation et de mise en ligne des visuels publicitaires. Il pourra être renouvelé par accord mutuel ou par tacite reconduction sous réserve du règlement préalable de l'échéance suivante selon la grille tarifaire en vigueur.`,
    contentAr: `يبرم هذا العقد للمدة المحددة في الشروط الخاصة، ويسري مفعوله ابتداءً من تاريخ تفعيل ونشر الإعلان أو المتجر عبر التطبيق. يمكن تجديده باتفاق الطرفين أو تلقائياً شريطة سداد مستحقات الفترة اللاحقة وفق التعريفات المعتمدة.`,
    isMandatory: true,
    isVerified: false,
  },
  {
    id: 'art-4',
    articleNumber: 4,
    titleFr: 'Article 4 : Tarification, Montant & Modalités de Règlement',
    titleAr: 'المادة 4 : الأسعار، المبالغ المستحقة وطرق الدفع',
    contentFr: `En contrepartie des prestations accordées, l'Annonceur s'engage à payer à NISFY SARL le montant convenu aux conditions particulières. Les règlements s'effectuent par virement bancaire sécurisé CIB / Edahabia via BaridiMob, CCP, virement bancaire ou en espèces contre reçu officiel signé et cacheté par l'administration. Tout retard supérieur au délai de grâce de 5 jours entraîne l'application des dispositions de l'Article 7.`,
    contentAr: `مقابل الخدمات المقدمة، يلتزم المعلن بدفع المستحقات المالية المتفق عليها في الشروط الخاصة. يتم الدفع عبر بريدي موب (BaridiMob)، الحساب البريدي الجاري (CCP)، البطاقة البنكية CIB/الذهبية، أو نقداً مقابل وصل إبراء رسمي موقع ومختوم. أي تأخر يتجاوز 5 أيام يخضع للمادة 7.`,
    isMandatory: true,
    isVerified: false,
  },
  {
    id: 'art-5',
    articleNumber: 5,
    titleFr: 'Article 5 : Obligations & Engagements de l\'Annonceur',
    titleAr: 'المادة 5 : التزامات ومسؤوليات المعلن / الشريك',
    contentFr: `L'Annonceur certifie et garantit :
1. Qu'il détient tous les droits, autorisations et licences d'exploitation pour les marques, photos, logos et textes transmis.
2. Que ses produits et prestations sont conformes aux normes de qualité, aux lois algériennes en vigueur et aux valeurs d'éthique, de respect et de confiance prônées par NISFY.
3. Qu'il s'engage à honorer avec sérieux et professionnalisme les engagements pris auprès des clients et futurs mariés issus de la plateforme.`,
    contentAr: `يقر المعلن ويضمن:
1. امتلاكه لكافة الحقوق والتراخيص القانونية للصور والشعارات والمواد الإعلانية المرفوعة.
2. مطابقة منتجاته وخدماته للقوانين الجزائرية السارية ولمعايير الجودة والأخلاق والاحترام المعتمدة في منصة نصف دينك.
3. التزامه التام والمهني بتقديم أفضل الخدمات للعملاء والمقبلين على الزواج المتواصلين عبر التطبيق.`,
    isMandatory: true,
    isVerified: false,
  },
  {
    id: 'art-6',
    articleNumber: 6,
    titleFr: 'Article 6 : Obligations & Engagements de la Plateforme NISFY',
    titleAr: 'المادة 6 : التزامات منصة نصف دينك (NISFY)',
    contentFr: `NISFY s'engage à :
1. Assurer la continuité technique et la disponibilité de la diffusion de la fiche ou boutique 24h/24 et 7j/7, sauf cas de force majeure ou opérations de maintenance planifiées.
2. Mettre en valeur les annonces conformément à l'offre souscrite et veiller à une expérience utilisateur fluide.
3. Fournir une assistance et un support réactif à l'Annonceur en cas de mise à jour de ses coordonnées, visuels ou offres promotionnelles.`,
    contentAr: `تلتزم منصة نصف دينك بـ:
1. ضمان استمرارية البث الرقمي والظهور عبر التطبيق على مدار الساعة وطيلة أيام الأسبوع باستثناء فترات الصيانة المبرمجة.
2. إبراز العروض الإعلانية وفق الباقة المختارة وضمان تجربة استخدام ممتازة.
3. توفير الدعم الفني وتحديث بيانات وصور وعروض المعلن بناءً على طلبه.`,
    isMandatory: true,
    isVerified: false,
  },
  {
    id: 'art-7',
    articleNumber: 7,
    titleFr: 'Article 7 : Clause Résolutoire, Suspension & Défaut de Paiement',
    titleAr: 'المادة 7 : الشرط الفاسخ، التعليق الفوري والتخلف عن السداد',
    contentFr: `À défaut de paiement de toute somme due à son échéance exacte ou dans le délai de grâce accordé de 5 (cinq) jours calendaires, NISFY SARL se réserve le droit de plein droit et sans préavis judiciaire de :
1. Suspendre immédiatement la visibilité de l'annonce ou de la boutique et de ses articles sur la plateforme publique.
2. Désactiver le badge "Partenaire Certifié".
3. Rétablir la diffusion sous 2 heures dès réception et validation du justificatif de virement ou de paiement.`,
    contentAr: `في حالة عدم سداد المستحقات في تاريخ الاستحقاق المحدد أو خلال مهلة السماح المحددة بـ 5 أيام، تحتفظ إدارة نصف دينك بالحق التلقائي وبدون إشعار مسبق في:
1. تعليق وحجب الإعلان أو المتجر ومنتجاته فوراً من الظهور العام في التطبيق.
2. سحب شارة التوثيق والاعتماد مؤقتاً.
3. إعادة التفعيل التلقائي في غضون ساعتين بمجرد استلام وتأكيد وصل السداد.`,
    isMandatory: true,
    isVerified: false,
  },
  {
    id: 'art-8',
    articleNumber: 8,
    titleFr: 'Article 8 : Résiliation Anticipée & Préavis',
    titleAr: 'المادة 8 : إنهاء العقد والإخطار المسبق',
    contentFr: `Chacune des parties peut résilier le contrat en cas de manquement grave de l'autre partie à l'une quelconque de ses obligations, non réparé dans un délai de huit (8) jours suivant notification écrite. En cas de résiliation anticipée à l'initiative exclusive de l'Annonceur sans faute de NISFY, les sommes déjà perçues restent acquises à titre d'indemnité forfaitaire d'immobilisation de l'espace publicitaire.`,
    contentAr: `يحق لأي من الطرفين إنهاء العقد في حال الإخلال الجسيم بالبنود بعد إخطار كتابي بمهلة 8 أيام دون معالجة الإخلال. في حال الإنهاء المبكر بطلب من المعلن دون خطأ من المنصة، تعتبر المبالغ المدفوعة مسبقاً حقاً مكتسباً للمنصة كتعويض حجز مساحة.`,
    isMandatory: true,
    isVerified: false,
  },
  {
    id: 'art-9',
    articleNumber: 9,
    titleFr: 'Article 9 : Confidentialité & Protection des Données Personnelles',
    titleAr: 'المادة 9 : السرية وحماية المعطيات ذات الطابع الشخصي',
    contentFr: `Les parties s'engagent à préserver la stricte confidentialité de toutes les informations commerciales, financières et stratégiques échangées. Conformément à la législation algérienne (Loi 18-07 relative à la protection des données à caractère personnel), NISFY veille à la sécurité des données transmises et s'interdit de les céder à des tiers non autorisés.`,
    contentAr: `يتعهد الطرفان بالحفاظ على سرية المعلومات التجارية والمالية المتبادلة. والتزاماً بالقانون 18-07 الجزائري المتعلق بحماية البيانات الشخصية، تضمن المنصة سرية وأمان البيانات وعدم مشاركتها مع أطراف خارجية غير مصرح لها.`,
    isMandatory: true,
    isVerified: false,
  },
  {
    id: 'art-10',
    articleNumber: 10,
    titleFr: 'Article 10 : Droit Applicable & Juridiction Compétente',
    titleAr: 'المادة 10 : القانون الواجب التطبيق والاختصاص القضائي',
    contentFr: `Le présent contrat est régi et interprété selon le droit et la législation de la République Algérienne Démocratique et Populaire. En cas de différend relatif à la validité, l'interprétation ou l'exécution de la convention, les parties s'engagent à privilégier une solution amiable. À défaut, compétence expresse est attribuée aux juridictions compétentes du ressort du Tribunal de Commerce d'Alger.`,
    contentAr: `يخضع هذا العقد ويفسر وفقاً لأحكام وقوانين الجمهورية الجزائرية الديمقراطية الشعبية. في حال نشوء أي نزاع، يتعهد الطرفان بالسعي لتسويته ودياً، وفي حال تعذر ذلك، ينعقد الاختصاص الحصري لمحاكم الجزائر العاصمة المختصة.`,
    isMandatory: true,
    isVerified: false,
  },
  {
    id: 'art-11',
    articleNumber: 11,
    titleFr: 'Article 11 : Paraphes, Signatures & Valeur Juridique',
    titleAr: 'المادة 11 : التوقيعات، التأشير والحجية القانونية',
    contentFr: `La validation électronique, l'apposition du cachet humide ou la signature numérique certifiée des présentes conditions confère au contrat pleine valeur juridique probante et force exécutoire entre les deux parties signataires, chacune reconnaissant en avoir lu et vérifié chaque article sans réserve.`,
    contentAr: `تعتبر المصادقة الإلكترونية، الختم الرطب أو التوقيع الرقمي بمثابة موافقة تامة ونهائية ذات حجية قانونية ملزمة للطرفين، ويقر كل طرف باطلاعه وفحصه الدقيق لكافة بنود ومواد العقد.`,
    isMandatory: true,
    isVerified: false,
  },
];

export const INITIAL_NISFY_CONTRACTS: NisfyContract[] = [
  {
    id: 'ctr-don-jeovani-2026',
    contractNumber: 'CTR-2026-NISFY-DJ01',
    contractType: 'advertising_sponsor',
    contractTypeLabel: 'Contrat Sponsor Officiel & Gastronomie',
    contractTypeLabelAr: 'عقد رعاية رسمية وإشهار مطاعم',
    title: 'Convention de Partenariat Publicitaire • Restaurant DON-JEOVANI (Dénia, Espagne)',
    targetEntityId: 'ad-don-jeovani-denia',
    targetEntityType: 'ad',
    targetEntityName: 'Restaurant DON-JEOVANI • Chef Djamel-Michel',
    dateIssued: '2026-08-01',
    startDate: '2026-08-01',
    endDate: '2027-07-31',
    durationMonths: 12,
    durationLabel: '12 Mois (1 An Ferme)',
    provider: NISFY_PROVIDER_PARTY,
    client: {
      role: 'client',
      entityName: 'RESTAURANTE DON-JEOVANI S.L. / Chef Djamel-Michel',
      entityNameAr: 'مطعم دون جيوفاني • الشيف جمال ميشيل',
      representativeName: 'Chef Djamel-Michel (Directeur & Propriétaire)',
      legalStatus: 'Sociedad Limitada (S.L.)',
      rcNumber: 'ES-B03998124',
      nifNumber: 'NIF-ESB03998124',
      address: 'Paseo Marítimo de Dénia, 03700 Dénia, Alicante, Costa Blanca',
      wilaya: 'Dénia (Espagne 🇪🇸) / Diaspora',
      phone: '+34 966 42 00 00 / +34 600 00 00 00',
      email: 'contact@donjeovani-denia.com',
    },
    subjectFr: 'Diffusion sponsorisée prioritaire et exclusive de l\'établissement gastronomique DON-JEOVANI (Spécialités Paella & Cuisine Méditerranéenne) sur les espaces Mariage, Réceptions, Lunes de Miel et Diaspora de l\'application NISFY.',
    subjectAr: 'النشر الإعلاني المميز والرعاية الرسمية لمطعم دون جيوفاني (المأكولات الإسبانية والبايا) عبر منصة وتطبيق نصف دينك.',
    payment: {
      totalAmount: '420 000 DZD (2 100 €)',
      monthlyAmount: '35 000 DZD / mois (175 € / mois)',
      currency: 'DZD',
      paymentMethods: ['baridimob', 'virement_cib', 'carte_bancaire'],
      schedule: 'annuel_avance',
      gracePeriodDays: 5,
      bankDetails: 'CCP Alger: 00199999 Clé 45 / BaridiMob: 00799999001999990045',
    },
    termination: {
      noticePeriodDays: 30,
      immediateTerminationReasons: [
        'Non-paiement après mise en demeure de 5 jours',
        'Contenu diffamatoire ou illicite',
        'Fermeture définitive de l\'établissement',
      ],
      refundPolicy: 'Non remboursable pour la période entamée sauf manquement technique grave constaté de la plateforme supérieur à 15 jours consécutifs.',
    },
    articles: STANDARD_CONTRACT_ARTICLES.map((a) => ({ ...a, isVerified: true })),
    allArticlesVerified: true,
    verifiedAt: '2026-08-01T10:00:00Z',
    verifiedByAdminName: 'Direction Juridique NISFY',
    status: 'signed_active',
    providerSigned: true,
    providerSignDate: '2026-08-01',
    clientSigned: true,
    clientSignDate: '2026-08-02',
    officialSealApplied: true,
    internalAdminNotes: 'Contrat annuel VIP réglé avec succès. Chef Djamel-Michel bénéficie d\'une mise en avant permanente dans la section Gastronomie & Réceptions.',
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-02T14:30:00Z',
  },
  {
    id: 'ctr-dar-hdiya-2026',
    contractNumber: 'CTR-2026-NISFY-DH02',
    contractType: 'ecommerce_vendor',
    contractTypeLabel: 'Contrat Vendeur Boutique E-Shop',
    contractTypeLabelAr: 'عقد متجر إلكتروني وشريك هدايا',
    title: 'Convention d\'Hébergement E-Commerce & Vente • Atelier Dar El Hdiya',
    targetEntityId: 'vendor-1',
    targetEntityType: 'vendor',
    targetEntityName: 'Atelier Dar El Hdiya (Alger)',
    dateIssued: '2026-08-10',
    startDate: '2026-08-10',
    endDate: '2026-11-09',
    durationMonths: 3,
    durationLabel: '3 Mois (Pack Pro E-Shop)',
    provider: NISFY_PROVIDER_PARTY,
    client: {
      role: 'client',
      entityName: 'Atelier Dar El Hdiya SARL',
      entityNameAr: 'دار الهدية الجزائر',
      representativeName: 'Mme. Amina Benali (Artisane Créatrice)',
      legalStatus: 'Entreprise Artisanale Agréée',
      rcNumber: '16/00-1122334A26',
      nifNumber: '002616112233445',
      address: '14 Rue Didouche Mourad, Alger Centre',
      wilaya: 'Alger (16)',
      phone: '+213 555 12 34 56',
      email: 'contact@dar-hdiya.dz',
    },
    subjectFr: 'Référencement, exposition et commercialisation directe de coffrets cadeaux de mariage, trousseau de la mariée et box hdiya sur l\'E-Shop NISFY avec intégration de commandes WhatsApp et livraison 58 Wilayas.',
    subjectAr: 'استضافة وتسويق صناديق الهدايا الفاخرة، جهاز العروس وبوكس الهدية عبر المتجر الإلكتروني لنصف دينك مع التوصيل لـ 58 ولاية.',
    payment: {
      totalAmount: '75 000 DZD',
      monthlyAmount: '25 000 DZD / mois',
      currency: 'DZD',
      paymentMethods: ['baridimob', 'ccp', 'virement_cib'],
      schedule: 'mensuel',
      gracePeriodDays: 5,
      bankDetails: 'BaridiMob: 00799999001999990045 (NISFY SARL)',
    },
    termination: {
      noticePeriodDays: 15,
      immediateTerminationReasons: [
        'Défaut de règlement des mensualités d\'hébergement',
        'Contrefaçon ou non-respect de la qualité annoncée',
        'Plaintes répétées des acheteurs sur les délais de livraison',
      ],
      refundPolicy: 'Mois entamé dû.',
    },
    articles: STANDARD_CONTRACT_ARTICLES.map((a) => ({ ...a, isVerified: true })),
    allArticlesVerified: true,
    verifiedAt: '2026-08-10T11:00:00Z',
    verifiedByAdminName: 'Responsable E-Commerce NISFY',
    status: 'signed_active',
    providerSigned: true,
    providerSignDate: '2026-08-10',
    clientSigned: true,
    clientSignDate: '2026-08-11',
    officialSealApplied: true,
    internalAdminNotes: 'Vendeur vérifié. Échéance mensuelle à surveiller le 10 de chaque mois.',
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-08-11T16:00:00Z',
  },
  {
    id: 'ctr-palais-bahia-2026',
    contractNumber: 'CTR-2026-NISFY-PB03',
    contractType: 'advertising_sponsor',
    contractTypeLabel: 'Contrat Sponsor Salle des Fêtes Royale',
    contractTypeLabelAr: 'عقد رعاية قاعة الحفلات الملكية',
    title: 'Convention de Diffusion Publicitaire • Palais El-Bahia',
    targetEntityId: 'ad-palais-el-bahia',
    targetEntityType: 'ad',
    targetEntityName: 'Palais El-Bahia • قصر الباهية',
    dateIssued: '2026-08-15',
    startDate: '2026-08-15',
    endDate: '2027-02-14',
    durationMonths: 6,
    durationLabel: '6 Mois (Pack Salle Royale)',
    provider: NISFY_PROVIDER_PARTY,
    client: {
      role: 'client',
      entityName: 'Palais El-Bahia SARL',
      entityNameAr: 'قصر الباهية للأعراس والمؤتمرات',
      representativeName: 'M. Amine Reda (Gérant)',
      legalStatus: 'SARL au capital de 2 000 000 DZD',
      address: 'Route Nationale N°11, Dély Ibrahim, Alger',
      wilaya: 'Alger (16)',
      phone: '+213 555 12 34 56',
      email: 'contact@palais-elbahia.dz',
    },
    subjectFr: 'Diffusion bannières grand format, référencement prioritaire salle des fêtes et package traiteur sur NISFY.',
    subjectAr: 'النشر الإعلاني المميز لقاعة الحفلات قصر الباهية مع إبراز عروض الولائم وباقات العرسان.',
    payment: {
      totalAmount: '240 000 DZD',
      monthlyAmount: '40 000 DZD / mois',
      currency: 'DZD',
      paymentMethods: ['virement_cib', 'baridimob', 'especes_recu'],
      schedule: 'mensuel',
      gracePeriodDays: 5,
      bankDetails: 'BaridiMob: 00799999001999990045 (NISFY SARL)',
    },
    termination: {
      noticePeriodDays: 15,
      immediateTerminationReasons: ['Défaut de paiement sous 5 jours ouvrés', 'Non-respect des règles éthiques'],
      refundPolicy: 'Non remboursable.',
    },
    articles: STANDARD_CONTRACT_ARTICLES.map((a, idx) => ({ ...a, isVerified: idx < 4 })),
    allArticlesVerified: false,
    status: 'under_review',
    providerSigned: true,
    providerSignDate: '2026-08-15',
    clientSigned: false,
    officialSealApplied: true,
    internalAdminNotes: 'Articles en cours de vérification. Paiement en attente. Annonce non diffusée.',
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'ctr-safir-voyages-2026',
    contractNumber: 'CTR-2026-NISFY-SV04',
    contractType: 'advertising_sponsor',
    contractTypeLabel: 'Contrat Sponsor Agence de Voyages & Omra',
    contractTypeLabelAr: 'عقد رعاية سياحة وعمرة',
    title: 'Convention de Partenariat • Safir Voyages & Omra VIP',
    targetEntityId: 'ad-safir-voyages',
    targetEntityType: 'ad',
    targetEntityName: 'Safir Omra & Lune de Miel • سفير للسياحة',
    dateIssued: '2026-08-18',
    startDate: '2026-08-18',
    endDate: '2027-08-17',
    durationMonths: 12,
    durationLabel: '12 Mois (Pack Agence Officielle)',
    provider: NISFY_PROVIDER_PARTY,
    client: {
      role: 'client',
      entityName: 'Safir Voyages EURL',
      entityNameAr: 'سفير للسياحة والأسفار ذ.ش.و.ذ.م.م',
      representativeName: 'M. Karim Safir (Directeur Général)',
      legalStatus: 'Agence de Tourisme et de Voyages Agréée (Licence A)',
      address: 'Boulevard Colonel Amirouche, Alger',
      wilaya: 'Alger (16)',
      phone: '+213 770 45 67 89',
      email: 'karim@safirvoyages.dz',
    },
    subjectFr: 'Diffusion sponsorisée des packages Omra Duo, voyages de noces et facilités de paiement.',
    subjectAr: 'النشر الإعلاني لباقات العمرة لشخصين ورحلات شهر العسل.',
    payment: {
      totalAmount: '420 000 DZD',
      monthlyAmount: '35 000 DZD / mois',
      currency: 'DZD',
      paymentMethods: ['virement_cib', 'baridimob'],
      schedule: 'mensuel',
      gracePeriodDays: 5,
      bankDetails: 'BaridiMob: 00799999001999990045 (NISFY SARL)',
    },
    termination: {
      noticePeriodDays: 30,
      immediateTerminationReasons: ['Perte d\'agrément ministère du tourisme', 'Non-paiement'],
      refundPolicy: 'Non remboursable.',
    },
    articles: STANDARD_CONTRACT_ARTICLES.map((a) => ({ ...a, isVerified: false })),
    allArticlesVerified: false,
    status: 'draft',
    providerSigned: true,
    providerSignDate: '2026-08-18',
    clientSigned: false,
    officialSealApplied: false,
    internalAdminNotes: 'Paiement déjà reçu par virement mais le contrat doit être signé et audité avant diffusion.',
    createdAt: '2026-08-18T14:00:00Z',
    updatedAt: '2026-08-18T14:00:00Z',
  },
];

