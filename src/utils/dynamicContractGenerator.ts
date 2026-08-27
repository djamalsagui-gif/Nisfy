import { Advertisement } from '../data/advertisements';
import { ContractArticle, NISFY_PROVIDER_PARTY, NisfyContract, STANDARD_CONTRACT_ARTICLES } from '../data/contractsData';

export function calculateContractPricing(monthlyFeeStr?: string, plan?: string) {
  const cleanNumber = parseInt((monthlyFeeStr || '30000').replace(/[^0-9]/g, '') || '30000', 10);
  const isEur = (monthlyFeeStr || '').includes('€') || (monthlyFeeStr || '').toUpperCase().includes('EUR');
  const currency: 'DZD' | 'EUR' = isEur ? 'EUR' : 'DZD';

  let months = 12;
  let durationLabel = '12 Mois (Pack Annuel Partenaire)';
  if (plan === '1_mois') {
    months = 1;
    durationLabel = '1 Mois (Formule Mensuelle)';
  } else if (plan === '3_mois') {
    months = 3;
    durationLabel = '3 Mois (Formule Trimestrielle)';
  } else if (plan === '6_mois') {
    months = 6;
    durationLabel = '6 Mois (Formule Semestrielle)';
  } else if (plan === 'partenaire_officiel') {
    months = 12;
    durationLabel = '12 Mois (Partenaire Officiel VIP)';
  }

  const total = cleanNumber * months;
  const formattedTotal = isEur ? `${total.toLocaleString('fr-FR')} €` : `${total.toLocaleString('fr-FR')} DZD`;
  const formattedMonthly = isEur ? `${cleanNumber.toLocaleString('fr-FR')} € / mois` : `${cleanNumber.toLocaleString('fr-FR')} DZD / mois`;

  return {
    months,
    durationLabel,
    currency,
    totalAmount: formattedTotal,
    monthlyAmount: formattedMonthly,
  };
}

export function getMediaQuotas(ad: Partial<Advertisement>): { photosCount: number; videosCount: number } {
  const photosCount =
    typeof ad.photosQuota === 'number' && ad.photosQuota > 0
      ? ad.photosQuota
      : ad.subscriptionPlan === 'partenaire_officiel' || ad.subscriptionPlan === '1_an'
      ? 12
      : ad.subscriptionPlan === '6_mois'
      ? 8
      : ad.subscriptionPlan === '3_mois'
      ? 5
      : 3;

  const videosCount =
    typeof ad.videosQuota === 'number' && ad.videosQuota >= 0
      ? ad.videosQuota
      : ad.subscriptionPlan === 'partenaire_officiel' || ad.subscriptionPlan === '1_an'
      ? 3
      : ad.subscriptionPlan === '6_mois'
      ? 2
      : 1;

  return { photosCount, videosCount };
}

/**
 * Dynamically constructs customized contract articles based on candidate / advertiser live input.
 * As the user types brand name, representative, monthly fee, address, media quotas, etc., the articles adapt in real-time.
 */
export function generateDynamicArticlesForAd(ad: Partial<Advertisement>): ContractArticle[] {
  const brandName = ad.brandName?.trim() || '[Nom de l’Enseigne / Candidat]';
  const brandNameAr = ad.brandNameAr?.trim() || brandName;
  const contactPerson = ad.advertiserContactPerson?.trim() || '[Responsable / Gérant Légitime]';
  const email = ad.advertiserEmail?.trim() || '[Email de contact]';
  const phone = ad.phone?.trim() || '[Numéro de téléphone]';
  const address = ad.address?.trim() || (ad.wilayas?.[0] ? `Wilaya de ${ad.wilayas[0]}` : '[Adresse / Wilaya]');
  const category = ad.categoryLabel || 'Prestation & Commerce Partenaire';
  const categoryAr = ad.categoryLabelAr || 'خدمات وشركاء الزواج والتجارة';
  const pricing = calculateContractPricing(ad.monthlyFee, ad.subscriptionPlan);
  const media = getMediaQuotas(ad);
  const promo = ad.promoCode ? `avec code exclusif "${ad.promoCode}" (${ad.discountBadge || 'Avantage VIP'})` : 'avec tarification préférentielle';
  const promoAr = ad.promoCode ? `مع الرمز الترويجي الحصري "${ad.promoCode}"` : '';

  return [
    {
      id: 'art-1',
      articleNumber: 1,
      titleFr: 'Article 1 : Objet & Candidature Partenaire',
      titleAr: 'المادة 1 : موضوع الاتفاقية وترشح الشريك',
      contentFr: `La présente convention a pour objet d'agréer la candidature commerciale de "${brandName}" (représentée par ${contactPerson}) et de lui concéder des espaces de diffusion sponsorisée et de visibilité numérique géolocalisée (${category}) sur la plateforme officielle NISFY Algérie & Diaspora.`,
      contentAr: `تهدف هذه الاتفاقية إلى اعتماد وترسيم الشراكة الإعلانية والتجارية لمؤسسة "${brandNameAr}" (تحت إدارة وإشراف ${contactPerson}) ومنحها مساحات إعلانية وظهوراً تسويقياً موجهاً في صنف (${categoryAr}) عبر منصة وتطبيق نصف دينك.`,
      isMandatory: true,
      isVerified: false,
    },
    {
      id: 'art-2',
      articleNumber: 2,
      titleFr: 'Article 2 : Prestations Accordées, Quotas Photos & Vidéos',
      titleAr: 'المادة 2 : تفاصيل الخدمات، حصص الصور والفيديوهات الممنوحة',
      contentFr: `NISFY met à disposition de l'enseigne "${brandName}" les prestations et quotas multimédias suivants :
1. Quota Multimédia Officiel Contractuel :
   • Diffusion et hébergement de ${media.photosCount} Photo(s) Haute Définition (bannières d'en-tête, galerie immersive, visuels de produits/menus).
   • Diffusion et intégration de ${media.videosCount} Vidéo(s) promotionnelle(s) / Capsule(s) vidéo ou Spot(s) publicitaire(s) HD.
2. Fiche établissement certifiée avec logo de la marque et coordonnées de réservation directe (${phone}, ${email}).
3. Intégration dans le carrousel sponsorisé de l'espace public et mise en avant des offres ${promo}.
4. Attribution du badge officiel "Partenaire Certifié 🇩🇿" dès signature bilatérale du présent contrat et validation du paiement.`,
      contentAr: `تضع منصة نصف دينك تحت تصرف مؤسسة "${brandNameAr}" الخدمات والحصص المرئية التالية :
1. الحصة المرئية الرسمية المعتمدة في العقد :
   • نشر واستضافة عدد (${media.photosCount}) صور عالية الدقة (HD) في المعرض التجاري وبطاقة العرض.
   • بث وتضمين عدد (${media.videosCount}) مقاطع فيديو ترويجية / كبسولات إعلانية متلفزة وبجودة عالية.
2. بطاقة تجارية موثقة تضم شعار المؤسسة، ومعلومات التواصل والحجز المباشر (${phone} / ${email}).
3. الظهور في الشريط الترويجي المميز للأعراس والتسوق ${promoAr}.
4. منح شارة "شريك معتمد وموثق 🇩🇿" فور اكتمال التوقيع وسداد المستحقات.`,
      isMandatory: true,
      isVerified: false,
    },
    {
      id: 'art-3',
      articleNumber: 3,
      titleFr: 'Article 3 : Durée du Contrat & Prise d’Effet',
      titleAr: 'المادة 3 : مدة العقد، السريان والتجديد',
      contentFr: `Le présent contrat est conclu pour une durée de ${pricing.durationLabel} (${pricing.months} mois), débutant le ${ad.startDate || 'date de signature'} et prenant fin le ${ad.endDate || 'date d’échéance contractuelle'}. La diffusion effective n'est activée qu'après vérification intégrale des articles et encaissement du règlement.`,
      contentAr: `يبرم هذا العقد لمدة ${pricing.durationLabel} (${pricing.months} أشهر)، ويسري ابتداءً من تاريخ التوقيع والتحقق حتى تاريخ ${ad.endDate || 'نهاية الفترة التعاقدية'}. لا يتم النشر الفعلي للإعلان إلا بعد التحقق من البنود وسداد الرسوم.`,
      isMandatory: true,
      isVerified: false,
    },
    {
      id: 'art-4',
      articleNumber: 4,
      titleFr: 'Article 4 : Tarification & Conditions de Règlement',
      titleAr: 'المادة 4 : الرسوم والمستحقات المالية وطرق السداد',
      contentFr: `En contrepartie des prestations, l'enseigne "${brandName}" s'engage à payer à NISFY SARL la somme mensuelle de ${pricing.monthlyAmount} (soit un montant global estimé à ${pricing.totalAmount} pour la période engagée). Le paiement s'effectue par BaridiMob, CCP, virement bancaire CIB ou reçu d'espèces officiel.`,
      contentAr: `مقابل خدمات الدعاية والترويج، يلتزم الطرف الثاني بدفع مبلغ ${pricing.monthlyAmount} (بإجمالي قدره ${pricing.totalAmount} طيلة مدة العقد). يتم السداد عبر تطبيق بريدي موب، الحساب البريدي الجاري CCP أو التحويل البنكي المعتمد.`,
      isMandatory: true,
      isVerified: false,
    },
    {
      id: 'art-5',
      articleNumber: 5,
      titleFr: 'Article 5 : Engagements Juridiques & Éthiques de l’Annonceur',
      titleAr: 'المادة 5 : التزامات ومسؤوليات المعلن القانونية والأخلاقية',
      contentFr: `Le représentant légal (${contactPerson}) garantit sur l'honneur que l'établissement situé à "${address}" dispose de toutes les autorisations légales nécessaires et que ses prestations respectent rigoureusement les normes sanitaires, commerciales et les valeurs éthiques de l'application NISFY.`,
      contentAr: `يقر الممثل القانوني للمؤسسة (${contactPerson}) بأن المقر الكائن في "${address}" حائز على كافة التراخيص القانونية، وأن كافة الخدمات والمنتجات المقدمة مطابقة لمعايير الجودة والأخلاق والاحترام المعتمدة.`,
      isMandatory: true,
      isVerified: false,
    },
    {
      id: 'art-6',
      articleNumber: 6,
      titleFr: 'Article 6 : Engagements Techniques de la Plateforme NISFY',
      titleAr: 'المادة 6 : التزامات منصة نصف دينك التقنية',
      contentFr: `NISFY garantit une haute disponibilité technique du service (24h/24 et 7j/7), le maintien des liens de contact (${phone}) et la redirection fluide vers les itinéraires Google Maps et WhatsApp de l'annonceur.`,
      contentAr: `تلتزم منصة نصف دينك بضمان استمرارية تشغيل وعرض الإعلان على مدار الساعة، وتسهيل اتصال وتوجيه المستخدمين مباشرة نحو أرقام هواتف وموقع المؤسسة.`,
      isMandatory: true,
      isVerified: false,
    },
    {
      id: 'art-7',
      articleNumber: 7,
      titleFr: 'Article 7 : Règle Impérative de Diffusion & Suspension en Cas d’Impayé',
      titleAr: 'المادة 7 : الشرط الحتمي للنشر والتعليق الفوري عند التأخر',
      contentFr: `AUCUNE ANNONCE N'EST DIFFUSÉE SANS CONTRAT DÛMENT VÉRIFIÉ/SIGNÉ ET PAIEMENT ENCAISSÉ. Tout retard de règlement supérieur au délai de grâce de 5 jours entraîne la suspension immédiate et automatique de l'annonce sur l'ensemble de la plateforme jusqu'à régularisation.`,
      contentAr: `لا يتم نشر أي إعلان إطلاقاً قبل توقيع العقد رسمياً وفحص بنوده وسداد الرسوم. أي تأخر في السداد يتجاوز مهلة 5 أيام يؤدي إلى التعليق الفوري والتلقائي للإعلان من التطبيق.`,
      isMandatory: true,
      isVerified: false,
    },
    {
      id: 'art-8',
      articleNumber: 8,
      titleFr: 'Article 8 : Résiliation & Notification',
      titleAr: 'المادة 8 : إنهاء العقد والإشعار المسبق',
      contentFr: `En cas de manquement grave ou de signalements répétés d'utilisateurs concernant les services de "${brandName}", NISFY se réserve le droit de résilier la convention sous préavis de 8 jours. Tout mois commencé reste acquis à NISFY SARL.`,
      contentAr: `في حال الإخلال الجسيم بالبنود أو ثبوت شكاوى متكررة من الزبائن، تحتفظ إدارة المنصة بحق إنهاء العقد بإخطار مدته 8 أيام، مع احتفاظ المنصة بالمبالغ المستحقة للفترة المنقضية.`,
      isMandatory: true,
      isVerified: false,
    },
    {
      id: 'art-9',
      articleNumber: 9,
      titleFr: 'Article 9 : Confidentialité & Protection des Données',
      titleAr: 'المادة 9 : السرية وحماية المعطيات الشخصية',
      contentFr: `Les coordonnées et données d'enregistrement de l'annonceur (${email}, ${phone}) sont strictement sécurisées selon la loi algérienne 18-07 relative à la protection des données personnelles.`,
      contentAr: `تخضع كافة بيانات المؤسسة (${email} / ${phone}) للسرية التامة وفقاً لأحكام القانون الجزائري 18-07 المتعلق بحماية البيانات ذات الطابع الشخصي.`,
      isMandatory: true,
      isVerified: false,
    },
    {
      id: 'art-10',
      articleNumber: 10,
      titleFr: 'Article 10 : Juridiction Compétente & Loi Applicable',
      titleAr: 'المادة 10 : القانون الساري والمحكمة المختصة',
      contentFr: `Le présent contrat est régi par le droit algérien. Tout différend non résolu à l'amiable sera soumis aux tribunaux compétents de la wilaya d'Alger.`,
      contentAr: `يخضع هذا العقد للقانون الجزائري، وفي حال تعذر التسوية الودية، ينعقد الاختصاص لمحاكم الجزائر العاصمة المختصة.`,
      isMandatory: true,
      isVerified: false,
    },
    {
      id: 'art-11',
      articleNumber: 11,
      titleFr: 'Article 11 : Paraphes, Signatures Bilatérales & Force Exécutoire',
      titleAr: 'المادة 11 : التوقيعات، التأشير والقوة الإلزامية',
      contentFr: `La validation électronique et la signature des deux parties (${NISFY_PROVIDER_PARTY.entityName} et ${brandName}) confèrent à la présente convention pleine force obligatoire et légale.`,
      contentAr: `تعتبر المصادقة والتوقيع بين الطرفين (${NISFY_PROVIDER_PARTY.entityNameAr} ومؤسسة ${brandNameAr}) بمثابة التزام قانوني نهائي ونافذ.`,
      isMandatory: true,
      isVerified: false,
    },
  ];
}

/**
 * Builds a full NisfyContract dynamically synced with an ad's form fields.
 */
export function buildSyncedContractFromAdForm(
  ad: Partial<Advertisement>,
  existingContract?: NisfyContract
): NisfyContract {
  const now = new Date();
  const pricing = calculateContractPricing(ad.monthlyFee, ad.subscriptionPlan);
  const brandName = ad.brandName?.trim() || 'Nouvel Annonceur Candidat';
  const brandNameAr = ad.brandNameAr?.trim() || brandName;
  const contactPerson = ad.advertiserContactPerson?.trim() || 'Directeur / Représentant Légal';
  const email = ad.advertiserEmail?.trim() || 'contact@partenaire.dz';
  const phone = ad.phone?.trim() || '+213 550 00 00 00';
  const address = ad.address?.trim() || (ad.wilayas?.[0] ? `Wilaya de ${ad.wilayas[0]}` : 'Alger, Algérie');
  const wilaya = ad.wilayas?.[0] || 'Alger (16)';
  
  const generatedArticles = generateDynamicArticlesForAd(ad);

  // Preserve verification state if existing contract articles were already marked
  const articles: ContractArticle[] = generatedArticles.map((newArt, idx) => {
    const prev = existingContract?.articles[idx];
    return {
      ...newArt,
      isVerified: prev ? prev.isVerified : false,
      customNotes: prev ? prev.customNotes : undefined,
    };
  });

  const allVerified = articles.length > 0 && articles.every((a) => a.isVerified);
  const contractNumber =
    existingContract?.contractNumber ||
    `CTR-${now.getFullYear()}-PUB-${(ad.id || 'NEW').replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`;

  return {
    id: existingContract?.id || `ctr-ad-${ad.id || Date.now()}`,
    contractNumber,
    contractType: 'advertising_sponsor',
    contractTypeLabel: 'Contrat Sponsor & Diffusion Publicitaire',
    contractTypeLabelAr: 'عقد رعاية وإشهار تجاري رسمي',
    title: `Convention de Diffusion Publicitaire • ${brandName}`,
    targetEntityId: ad.id || `ad_${Date.now()}`,
    targetEntityType: 'ad',
    targetEntityName: brandName,
    dateIssued: existingContract?.dateIssued || now.toISOString().split('T')[0],
    startDate: ad.startDate || existingContract?.startDate || now.toISOString().split('T')[0],
    endDate: ad.endDate || existingContract?.endDate || new Date(Date.now() + pricing.months * 30 * 86400000).toISOString().split('T')[0],
    durationMonths: pricing.months,
    durationLabel: pricing.durationLabel,
    provider: NISFY_PROVIDER_PARTY,
    client: {
      role: 'client',
      entityName: brandName,
      entityNameAr: brandNameAr,
      representativeName: contactPerson,
      legalStatus: 'Établissement Commercial / Prestataire Agréé',
      address,
      wilaya,
      phone,
      email,
    },
    subjectFr: `Diffusion sponsorisée, référencement prioritaire et affichage des bannières de l'enseigne "${brandName}" sur NISFY Algérie & Diaspora.`,
    subjectAr: `النشر الإعلاني المميز وظهور العلامة التجارية "${brandNameAr}" عبر تطبيق ومنصة نصف دينك.`,
    mediaQuota: getMediaQuotas(ad),
    payment: {
      totalAmount: pricing.totalAmount,
      monthlyAmount: pricing.monthlyAmount,
      currency: pricing.currency,
      paymentMethods: ['baridimob', 'virement_cib', 'ccp', 'especes_recu'],
      schedule: 'mensuel',
      gracePeriodDays: 5,
      bankDetails: 'BaridiMob: 00799999001999990045 (NISFY SARL)',
    },
    termination: {
      noticePeriodDays: 15,
      immediateTerminationReasons: [
        'Défaut de paiement sous 5 jours ouvrés',
        'Non-conformité des prestations ou réclamations graves d\'utilisateurs',
        'Atteinte aux valeurs morales et éthiques de l\'application NISFY',
      ],
      refundPolicy: 'Tout mois entamé reste intégralement acquis à NISFY SARL.',
    },
    articles,
    allArticlesVerified: allVerified,
    verifiedAt: existingContract?.verifiedAt,
    verifiedByAdminName: existingContract?.verifiedByAdminName,
    status: existingContract?.status || (allVerified ? 'verified_ready' : 'under_review'),
    providerSigned: existingContract ? existingContract.providerSigned : true,
    providerSignDate: existingContract?.providerSignDate || now.toISOString().split('T')[0],
    clientSigned: existingContract ? existingContract.clientSigned : false,
    clientSignDate: existingContract?.clientSignDate,
    officialSealApplied: existingContract ? existingContract.officialSealApplied : true,
    internalAdminNotes:
      existingContract?.internalAdminNotes ||
      'Contrat généré en direct lors de la saisie des informations de l’annonceur. Articles synchronisés en temps réel.',
    createdAt: existingContract?.createdAt || now.toISOString(),
    updatedAt: now.toISOString(),
  };
}
