import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'fr' | 'ar';

export interface Translations {
  // Missing keys added by fix
  moderatedSpace: string;
  publishInLoungeBtn: string;
  writeToThem: string;
  swipeMode: string;
  gridMode: string;
  filters: string;
  allGenders: string;
  onlyWomen: string;
  onlyMen: string;
  wilayaFilter: string;
  ageFilter: string;
  noMoreCardsTitle: string;
  noMoreCardsDesc: string;
  restartDeckBtn: string;
  directMessage: string;
  exploreBtn: string;
  affinity: string;
  messagesTitle: string;
  contacts: string;
  typingStatus: string;
  callBtn: string;
  startConversationWith: string;
  selectContact: string;
  watchVideoBtn: string;
  dislikeBtn: string;
  // Brand & General
  appName: string;
  appSubtitle: string;
  wilayasBadge: string;
  frBtn: string;
  arBtn: string;
  langAria: string;

  // Tabs
  tabDiscover: string;
  tabMatches: string;
  tabChat: string;
  tabLounge: string;
  tabMap: string;
  tabProfile: string;
  tabChefNadjet: string;
  // Header & Status
  online: string;
  offline: string;
  activeNow: string;
  logout: string;
  muteOn: string;
  muteOff: string;

  // Discover & Filters
  discoverTitle: string;
  discoverSubtitle: string;
  filterTitle: string;
  filterLookingFor: string;
  allMembers: string;
  men: string;
  women: string;
  wilayaLabel: string;
  allWilayas: string;
  ageRange: string;
  interestsLabel: string;
  onlyOnline: string;
  onlyVerified: string;
  resetFilters: string;
  profilesFound: string;
  noProfileFound: string;
  noProfileFoundDesc: string;
  likeBtn: string;
  superLikeBtn: string;
  directChatBtn: string;
  viewProfile: string;
  icebreakerTitle: string;
  matchAffinity: string;
  loveRelation: string;
  friendshipRelation: string;

  // Matches View
  matchesTitle: string;
  matchesSubtitle: string;
  recentMatches: string;
  noMatchesYet: string;
  noMatchesDesc: string;
  exploreProfilesBtn: string;
  startChatBtn: string;

  // Private Chat View
  chatTitle: string;
  noActiveConversation: string;
  selectConversation: string;
  typeMessagePlaceholder: string;
  sendBtn: string;
  icebreakerSuggestions: string;
  voiceNote: string;
  audioCall: string;
  typingIndicator: string;
  searchConversation: string;
  conversations: string;

  // Community Lounge
  loungeTitle: string;
  loungeSubtitle: string;
  loungeBanner: string;
  loungePlaceholder: string;
  publishBtn: string;
  respectRules: string;
  respectRule1: string;
  respectRule2: string;
  respectRule3: string;
  likePost: string;
  replyDirect: string;

  // Map & Live Traffic
  mapTitle: string;
  radarLive: string;
  radarSubtitle: string;
  totalActive: string;
  genderBreakdown: string;
  requestsPerMin: string;
  topPole: string;
  zoomDZ: string;
  zoomWorld: string;
  radarToggle: string;
  genderFilterAll: string;
  genderFilterMen: string;
  genderFilterWomen: string;
  zonesRanking: string;
  membersDiscovered: string;
  selectedZoneHint: string;
  fluxDirect: string;

  // My Profile
  myProfileTitle: string;
  myProfileSubtitle: string;
  editProfileBtn: string;
  cancelBtn: string;
  saveChangesBtn: string;
  pseudoLabel: string;
  ageLabel: string;
  genderLabel: string;
  lookingForLabel: string;
  wilayaResidenceLabel: string;
  bioLabel: string;
  jobLabel: string;
  heightLabel: string;
  icebreakerLabel: string;
  likesReceived: string;
  profileVerified: string;
  badgeDz: string;

  // Auth Modal
  welcomeAuthTitle: string;
  welcomeAuthSubtitle: string;
  loginTab: string;
  registerTab: string;
  emailLabel: string;
  passwordLabel: string;
  confirmPasswordLabel: string;
  loginSubmitBtn: string;
  registerSubmitBtn: string;
  quickDemoLogin: string;
  alreadyAccount: string;
  noAccountYet: string;
  demoAccountsTitle: string;
  demoSubtitle: string;
  avatarChoice: string;
  interestsChoice: string;

  // Match Modal
  matchModalTitle: string;
  matchModalCongrats: string;
  matchModalDesc: string;
  sendMessageToMatch: string;
  continueExploring: string;

  // New Features
  marriageFilterBtn: string;
  marriageBadge: string;
  marriageTimelineLabel: string;
  relocationLabel: string;
  jasminSuperLikeBtn: string;
  jasminSentAlert: string;
  blurPhotoBadge: string;
  blurPhotoHint: string;
  revealPhotoBtn: string;
  reportUserBtn: string;
  blockUserBtn: string;
  userReportedSuccess: string;
  userBlockedSuccess: string;
  recordVoiceNote: string;
  recordingVoice: string;
  stopVoiceNote: string;
  playVoiceNote: string;

  // Live Streams & Media
  tabLive: string;
  liveTitle: string;
  liveSubtitle: string;
  startLiveBtn: string;
  stopLiveBtn: string;
  joinLiveBtn: string;
  activeLives: string;
  noLivesActive: string;
  noLivesDesc: string;
  liveViewers: string;
  liveSendGift: string;
  liveLike: string;
  liveTypeMessage: string;
  liveCameraOn: string;
  liveCameraOff: string;
  liveMicOn: string;
  liveMicOff: string;
  liveBeautyFilter: string;
  photosAndVideos: string;
  addPhotoBtn: string;
  addVideoBtn: string;
  recordVideoBtn: string;
  videoPresentation: string;
  hasVideoBadge: string;
  playVideo: string;
  closeVideo: string;
  filterHasVideo: string;

  // Map Toggle & Option
  mapToggleTitle: string;
  mapStatusDisabled: string;
  mapStatusEnabled: string;
  activateMapBtn: string;
  deactivateMapBtn: string;
  returnToDiscover: string;
  mapOptionHint: string;
  worldMapBanner: string;
  worldMapTeaser: string;
  viewMapBtn: string;

  // Connected Members on Map Click
  connectedMembersInZone: string;
  chooseToChat: string;
  chatNowBtn: string;
  sendDirectMsg: string;
  sendJasmin: string;
  viewProfileDetails: string;
  connectedLiveHeader: string;
  clickCityInstruction: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  fr: {
    moderatedSpace: "Espace modéré",
    publishInLoungeBtn: "Publier",
    writeToThem: "Écrire",
    swipeMode: "Mode Swipe",
    gridMode: "Mode Grille",
    filters: "Filtres",
    allGenders: "Tous les genres",
    onlyWomen: "Femmes uniquement",
    onlyMen: "Hommes uniquement",
    wilayaFilter: "Filtrer par Wilaya",
    ageFilter: "Tranche d'âge",
    noMoreCardsTitle: "Plus de profils",
    noMoreCardsDesc: "Revenez plus tard",
    restartDeckBtn: "Recommencer",
    directMessage: "Message direct",
    exploreBtn: "Explorer",
    affinity: "Affinité",
    messagesTitle: "Messages",
    contacts: "Contacts",
    typingStatus: "écrit...",
    callBtn: "Appeler",
    startConversationWith: "Commencer avec",
    selectContact: "Sélectionnez un contact",
    watchVideoBtn: "Voir la vidéo",
    dislikeBtn: "Passer",
    // Brand & General
    appName: 'Nisfy',
    appSubtitle: 'Trouvez votre moitié • 69 Wilayas & Diaspora',
    wilayasBadge: '🇩🇿 69 Wilayas',
    frBtn: 'Français',
    arBtn: 'العربية / الدارجة',
    langAria: 'Changer la langue',

    // Tabs
    tabDiscover: 'Découvrir',
    tabMatches: 'Mes Matchs',
    tabChat: 'Messagerie',
    tabLounge: 'Salon Public',
    tabMap: 'Carte & Trafic',
    tabProfile: 'Mon Profil',
    tabChefNadjet: 'Chef Nadjet (Gâteaux & Mariage)',
    tabLive: 'En Direct (Live)',

    // Header & Status
    online: 'En ligne',
    offline: 'Hors ligne',
    activeNow: 'En ligne maintenant',
    logout: 'Déconnexion',
    muteOn: 'Activer le son',
    muteOff: 'Couper le son',

    // Discover & Filters
    discoverTitle: 'Rencontres & Affinités DZ69',
    discoverSubtitle: 'Trouvez votre moitié parmi les 69 wilayas en Algérie et dans la diaspora',
    filterTitle: 'Filtres de recherche',
    filterLookingFor: 'Je recherche',
    allMembers: 'Tous les profils',
    men: '👨 Hommes (H)',
    women: '👩 Femmes (F)',
    wilayaLabel: 'Wilaya (69 Wilayas)',
    allWilayas: 'Toutes les 69 Wilayas',
    ageRange: 'Tranche d’âge',
    interestsLabel: 'Centres d’intérêt',
    onlyOnline: 'En ligne uniquement',
    onlyVerified: 'Profils certifiés uniquement',
    resetFilters: 'Réinitialiser',
    profilesFound: 'profil(s) correspondant(s)',
    noProfileFound: 'Aucun profil trouvé',
    noProfileFoundDesc: 'Essayez d’élargir vos filtres de recherche ou de changer de wilaya.',
    likeBtn: 'Coup de cœur',
    superLikeBtn: 'Super Like',
    directChatBtn: 'Discuter',
    viewProfile: 'Voir le profil',
    icebreakerTitle: 'Brise-glace favori',
    matchAffinity: "d'affinité",
    loveRelation: 'Grand Amour & Zawaj',
    friendshipRelation: 'Amitié & Entraide',

    // Matches View
    matchesTitle: 'Vos Coups de Cœur & Matchs',
    matchesSubtitle: 'Voici les membres avec qui vous partagez une affinité mutuelle. Lancez la discussion !',
    recentMatches: 'Matchs Récents',
    noMatchesYet: 'Pas encore de nouveau match',
    noMatchesDesc: 'Continuez d’explorer les profils des 69 wilayas et d’envoyer des cœurs pour matcher !',
    exploreProfilesBtn: 'Découvrir des profils',
    startChatBtn: 'Démarrer la discussion',

    // Private Chat View
    chatTitle: 'Messagerie Privée',
    noActiveConversation: 'Sélectionnez une discussion',
    selectConversation: 'Choisissez un contact dans la liste à gauche pour débuter un échange.',
    typeMessagePlaceholder: 'Écrivez votre message...',
    sendBtn: 'Envoyer',
    icebreakerSuggestions: 'Idées pour briser la glace',
    voiceNote: 'Note vocale',
    audioCall: 'Appel vocal',
    typingIndicator: 'est en train d’écrire...',
    searchConversation: 'Rechercher un contact...',
    conversations: 'Conversations actives',

    // Community Lounge
    loungeTitle: 'Salon Public DZ69',
    loungeSubtitle: 'Le point de rencontre convivial pour toute la communauté des 69 wilayas',
    loungeBanner: 'Espace d’échange fraternel & respectueux',
    loungePlaceholder: 'Partagez une pensée, une question ou un message avec la communauté...',
    publishBtn: 'Publier dans le salon',
    respectRules: 'Charte du salon DZ69',
    respectRule1: 'Respect mutuel, courtoisie et bienveillance obligatoires.',
    respectRule2: 'Tous les membres des 58 wilayas et de la diaspora (DZ69) sont les bienvenus.',
    respectRule3: 'Pas de spam ni de propos déplacés.',
    likePost: 'Aimer',
    replyDirect: 'Contacter en privé',

    // Map & Live Traffic
    mapTitle: 'Radar en Direct DZ69',
    radarLive: 'RADAR EN DIRECT',
    radarSubtitle: 'Carte interactive et flux des connexions en temps réel (Algérie & Diaspora)',
    totalActive: 'Total Connectés',
    genderBreakdown: 'Répartition Hommes / Femmes',
    requestsPerMin: 'Débit / min',
    topPole: 'Pôle Nº1',
    zoomDZ: 'Algérie & Méditerranée',
    zoomWorld: 'Monde & Diaspora',
    radarToggle: 'Radar Actif',
    genderFilterAll: 'Tous',
    genderFilterMen: '👨 Hommes (H)',
    genderFilterWomen: '👩 Femmes (F)',
    zonesRanking: 'Classement des Zones de Connexion',
    membersDiscovered: 'Membres découverts dans cette zone',
    selectedZoneHint: 'Cliquez sur un marqueur ou une wilaya pour analyser les membres en direct.',
    fluxDirect: 'Échanges instantanés',

    // My Profile
    myProfileTitle: 'Mon Profil Membre',
    myProfileSubtitle: 'Gérez vos informations et votre visibilité sur la communauté des 69 wilayas',
    editProfileBtn: 'Modifier mon profil',
    cancelBtn: 'Annuler',
    saveChangesBtn: 'Enregistrer les modifications',
    pseudoLabel: 'Pseudo / Prénom',
    ageLabel: 'Âge',
    genderLabel: 'Sexe',
    lookingForLabel: 'Objectif de rencontre',
    wilayaResidenceLabel: 'Wilaya / Région (69)',
    bioLabel: 'À propos de moi',
    jobLabel: 'Profession / Activité',
    heightLabel: 'Taille (cm)',
    icebreakerLabel: 'Votre brise-glace préféré',
    likesReceived: 'Coups de cœur reçus',
    profileVerified: 'Profil Vérifié DZ69',
    badgeDz: 'Membre Officiel',

    // Auth Modal
    welcomeAuthTitle: 'Bienvenue sur Nisfy',
    welcomeAuthSubtitle: 'Trouvez votre moitié sincère parmi les célibataires des 69 Wilayas et de la Diaspora',
    loginTab: 'Connexion',
    registerTab: 'Inscription Rapide',
    emailLabel: 'Adresse Email',
    passwordLabel: 'Mot de passe',
    confirmPasswordLabel: 'Confirmer le mot de passe',
    loginSubmitBtn: 'Se connecter',
    registerSubmitBtn: 'Créer mon profil Nisfy',
    quickDemoLogin: 'Ou connexion instantanée en 1 clic :',
    alreadyAccount: 'Déjà inscrit ? Connectez-vous',
    noAccountYet: 'Pas encore de compte ? Inscrivez-vous gratuitement',
    demoAccountsTitle: 'Comptes de Démonstration',
    demoSubtitle: 'Cliquez sur un profil pour tester instantanément la plateforme :',
    avatarChoice: 'Photo de profil / Avatar',
    interestsChoice: 'Vos centres d’intérêt',

    // Match Modal
    matchModalTitle: 'Coup de Cœur Réciproque !',
    matchModalCongrats: 'C’est un Match !',
    matchModalDesc: 'Vous vous plaisez mutuellement. Lancez la discussion dès maintenant !',
    sendMessageToMatch: 'Envoyer un message',
    continueExploring: 'Continuer à découvrir',

    // New Features
    marriageFilterBtn: '💍 Objectif Mariage',
    marriageBadge: 'Certifié Mariage 💍',
    marriageTimelineLabel: 'Délai projet mariage',
    relocationLabel: 'Mobilité / Déménagement',
    jasminSuperLikeBtn: '🌸 Fleur de Jasmin',
    jasminSentAlert: 'Fleur de Jasmin envoyée avec succès ! 🌸✨',
    blurPhotoBadge: 'Mode Discret 🔒',
    blurPhotoHint: 'Photo floutée par discrétion. Se dévoile sur match ou autorisation.',
    revealPhotoBtn: 'Dévoiler la photo',
    reportUserBtn: 'Signaler',
    blockUserBtn: 'Bloquer',
    userReportedSuccess: 'Profil signalé à la modération DZ69 avec succès.',
    userBlockedSuccess: 'Utilisateur bloqué.',
    recordVoiceNote: 'Enregistrer une note vocale',
    recordingVoice: 'Enregistrement en cours...',
    stopVoiceNote: 'Arrêter & Envoyer',
    playVoiceNote: 'Écouter le message vocal',

    // Live Streams & Media
    liveTitle: 'Lives & Directs DZ69',
    liveSubtitle: 'Participez aux Lives vidéo des membres des 69 Wilayas et de la Diaspora',
    startLiveBtn: 'Lancer mon Live Vidéo',
    stopLiveBtn: 'Terminer le Live',
    joinLiveBtn: 'Rejoindre le Live',
    activeLives: 'Lives en cours',
    noLivesActive: 'Aucun Live en cours pour le moment',
    noLivesDesc: 'Soyez le premier à lancer un Live vidéo et à échanger avec la communauté !',
    liveViewers: 'spectateurs',
    liveSendGift: 'Envoyer un cadeau',
    liveLike: 'J’aime le Live',
    liveTypeMessage: 'Envoyer un message en direct...',
    liveCameraOn: 'Caméra Activée',
    liveCameraOff: 'Caméra Désactivée',
    liveMicOn: 'Micro Activé',
    liveMicOff: 'Micro Coupé',
    liveBeautyFilter: 'Filtre Beauté & Éclat',
    photosAndVideos: 'Photos & Vidéos',
    addPhotoBtn: 'Ajouter une photo',
    addVideoBtn: 'Ajouter une vidéo',
    recordVideoBtn: 'Enregistrer une vidéo selfie',
    videoPresentation: 'Vidéo de présentation',
    hasVideoBadge: 'Avec Vidéo 📹',
    playVideo: 'Regarder la vidéo',
    closeVideo: 'Fermer',
    filterHasVideo: '📹 Profils avec Vidéo uniquement',

    // Map Toggle & Option
    mapToggleTitle: 'Carte Mondiale du Trafic & Wilayas',
    mapStatusDisabled: 'Carte actuellement masquée',
    mapStatusEnabled: 'Carte mondiale active',
    activateMapBtn: 'Activer la Carte',
    deactivateMapBtn: 'Masquer la Carte',
    returnToDiscover: 'Retour aux profils',
    mapOptionHint: 'Activez la carte à tout moment pour visualiser les flux de connexion en temps réel.',
    worldMapBanner: 'Carte Mondiale du Trafic & Wilayas',
    worldMapTeaser: 'Visualisez les connexions en direct et les flux actifs entre les 69 wilayas et la diaspora',
    viewMapBtn: 'Ouvrir la Carte',

    // Connected Members on Map Click
    connectedMembersInZone: 'Membres connectés en direct',
    chooseToChat: 'Choisissez avec qui converser en direct :',
    chatNowBtn: 'Discuter maintenant',
    sendDirectMsg: 'Envoyer un message',
    sendJasmin: 'Offrir un Jasmin',
    viewProfileDetails: 'Voir le profil',
    connectedLiveHeader: 'Connectés en direct à',
    clickCityInstruction: 'Cliquez sur une ville ou une wilaya pour afficher les membres connectés et discuter immédiatement.',
  },

  ar: {
    moderatedSpace: "مساحة خاضعة للإشراف",
    publishInLoungeBtn: "نشر",
    writeToThem: "اكتب لهم",
    swipeMode: "وضع السحب",
    gridMode: "وضع الشبكة",
    filters: "عوامل التصفية",
    allGenders: "جميع الأجناس",
    onlyWomen: "النساء فقط",
    onlyMen: "الرجال فقط",
    wilayaFilter: "تصفية حسب الولاية",
    ageFilter: "الفئة العمرية",
    noMoreCardsTitle: "لا مزيد من الملفات الشخصية",
    noMoreCardsDesc: "عد لاحقاً",
    restartDeckBtn: "إعادة البدء",
    directMessage: "رسالة مباشرة",
    exploreBtn: "استكشاف",
    affinity: "تطابق",
    messagesTitle: "الرسائل",
    contacts: "جهات الاتصال",
    typingStatus: "يكتب...",
    callBtn: "اتصال",
    startConversationWith: "ابدأ محادثة مع",
    selectContact: "اختر جهة اتصال",
    watchVideoBtn: "مشاهدة الفيديو",
    dislikeBtn: "تجاوز",
    // Brand & General
    appName: 'نصفي • Nisfy',
    appSubtitle: 'اعثر على نصفك الآخر • 69 ولاية والمهجر',
    wilayasBadge: '🇩🇿 69 ولاية',
    frBtn: 'Français',
    arBtn: 'العربية / الدارجة',
    langAria: 'تغيير اللغة',

    // Tabs
    tabDiscover: 'اكتشاف الأعضاء',
    tabMatches: 'مطابقاتي',
    tabChat: 'الدردشة والرسائل',
    tabLounge: 'الصالون العام',
    tabMap: 'الخريطة والترافيك',
    tabProfile: 'ملفي الشخصي',
    tabChefNadjet: 'الشيف نجاة (حلويات الأعراس)',
    tabLive: 'بث مباشر (Live)',

    // Header & Status
    online: 'متصل',
    offline: 'غير متصل',
    activeNow: 'متصل الآن',
    logout: 'تسجيل الخروج',
    muteOn: 'تشغيل الصوت',
    muteOff: 'كتم الصوت',

    // Discover & Filters
    discoverTitle: 'تعارف وتواصل جاد DZ69',
    discoverSubtitle: 'تلاقى مع شريك حياتك من بين الـ 69 ولاية في الجزائر والدياسبورا بكل احترام',
    filterTitle: 'تصفية وبحث متقدم',
    filterLookingFor: 'أبحث عن',
    allMembers: 'جميع الأعضاء',
    men: '👨 رجال (ذكور)',
    women: '👩 نساء (إناث)',
    wilayaLabel: 'الولاية (69 ولاية)',
    allWilayas: 'كل الـ 69 ولاية',
    ageRange: 'الفئة العمرية',
    interestsLabel: 'الاهتمامات والهوايات',
    onlyOnline: 'المتصلين الآن فقط',
    onlyVerified: 'الحسابات الموثقة فقط',
    resetFilters: 'إعادة ضبط',
    profilesFound: 'عضو مطابق للبحث',
    noProfileFound: 'لم يتم العثور على نتائج',
    noProfileFoundDesc: 'جرب توسيع معايير البحث أو اختيار ولاية أخرى.',
    likeBtn: 'إعجاب (كوب دو كور)',
    superLikeBtn: 'سوبر لايك',
    directChatBtn: 'دردشة مباشرة',
    viewProfile: 'عرض الحساب',
    icebreakerTitle: 'سؤال فتح الحديث المفصل',
    matchAffinity: 'نسبة التوافق',
    loveRelation: 'زواج وحلال على سنة الله',
    friendshipRelation: 'صداقة وتعارف أخوي',

    // Matches View
    matchesTitle: 'المطابقات والإعجابات المتبادلة',
    matchesSubtitle: 'هؤلاء الأعضاء أبدوا إعجابهم ببروفايلك أيضاً. ابدأ الحديث معهم الآن !',
    recentMatches: 'مطابقات حديثة',
    noMatchesYet: 'لا توجد مطابقات جديدة حتى الآن',
    noMatchesDesc: 'واصل تصفح بروفايلات الـ 69 ولاية وإرسال الإعجاب لبدء مطابقات حقيقية !',
    exploreProfilesBtn: 'تصفح البروفايلات',
    startChatBtn: 'بدء الدردشة الآن',

    // Private Chat View
    chatTitle: 'الدردشة الخاصة',
    noActiveConversation: 'اختر محادثة للبدء',
    selectConversation: 'اختر جهة اتصال من القائمة لبدء التحدث والتعارف.',
    typeMessagePlaceholder: 'اكتب رسالتك هنا بكل احترام...',
    sendBtn: 'إرسال',
    icebreakerSuggestions: 'أفكار ذكية لفتح الحديث',
    voiceNote: 'رسالة صوتية',
    audioCall: 'مكالمة صوتية',
    typingIndicator: 'يكتب الآن...',
    searchConversation: 'بحث في المحادثات...',
    conversations: 'المحادثات النشطة',

    // Community Lounge
    loungeTitle: 'الصالون العام DZ69',
    loungeSubtitle: 'مساحة أخوية تجمع خاوتنا وخواتاتنا من 58 ولاية ومن دياسبورا (DZ69)',
    loungeBanner: 'فضاء للتواصل المحترم وتبادل الآراء والتحايا',
    loungePlaceholder: 'شارك كلمة طيبة، تحية من ولايتك أو منشوراً مع المجتمع...',
    publishBtn: 'نشر في الصالون',
    respectRules: 'ميثاق الصالون DZ69',
    respectRule1: 'الاحترام المتبادل والكلام الطيب والنية الصادقة شرط أساسي.',
    respectRule2: 'مرحباً بكل الجزائريين من الـ 58 ولاية ومن المهجر (الولاية 69).',
    respectRule3: 'يمنع الإزعاج أو نشر أي محتوى غير لائق.',
    likePost: 'إعجاب',
    replyDirect: 'تواصل في الخاص',

    // Map & Live Traffic
    mapTitle: 'الرادار المباشر DZ69',
    radarLive: 'رادار حي ومباشر',
    radarSubtitle: 'خريطة تفاعلية وحركة الاتصال في الوقت الفعلي (الجزائر والعالم)',
    totalActive: 'إجمالي المتصلين',
    genderBreakdown: 'التوزيع: ذكور / إناث',
    requestsPerMin: 'التبادلات / دقيقة',
    topPole: 'القطب الأول',
    zoomDZ: 'الجزائر والمتوسط',
    zoomWorld: 'العالم والدياسبورا',
    radarToggle: 'الرادار مفعل',
    genderFilterAll: 'الكل',
    genderFilterMen: '👨 رجال (ذكور)',
    genderFilterWomen: '👩 نساء (إناث)',
    zonesRanking: 'ترتيب الولايات ومراكز الاتصال',
    membersDiscovered: 'الأعضاء المتواجدون في هذه المنطقة',
    selectedZoneHint: 'انقر على أي ولاية أو منطقة لمشاهدة تفاصيل الأعضاء المتصلين.',
    fluxDirect: 'تبادلات فورية',

    // My Profile
    myProfileTitle: 'الملف الشخصي',
    myProfileSubtitle: 'تحكم في معلوماتك وحضورك في مجتمع الـ 69 ولاية',
    editProfileBtn: 'تعديل البروفايل',
    cancelBtn: 'إلغاء',
    saveChangesBtn: 'حفظ التعديلات',
    pseudoLabel: 'الاسم المستعار أو اللقب',
    ageLabel: 'العمر',
    genderLabel: 'الجنس',
    lookingForLabel: 'الهدف من التسجيل',
    wilayaResidenceLabel: 'الولاية / المنطقة (69)',
    bioLabel: 'نبذة عني',
    jobLabel: 'المهنة / النشاط',
    heightLabel: 'الطول (سم)',
    icebreakerLabel: 'سؤالك المفضل لكسر الجليد',
    likesReceived: 'الإعجابات المستلمة',
    profileVerified: 'حساب موثق DZ69',
    badgeDz: 'عضو رسمي',

    // Auth Modal
    welcomeAuthTitle: 'مرحباً بكم في نصفي (Nisfy)',
    welcomeAuthSubtitle: 'المنصة المخصصة للعثور على شريك الحياة بين الـ 69 ولاية والمهجر بكل احترام وجدية',
    loginTab: 'تسجيل الدخول',
    registerTab: 'تسجيل حساب جديد',
    emailLabel: 'البريد الإلكتروني',
    passwordLabel: 'كلمة المرور',
    confirmPasswordLabel: 'تأكيد كلمة المرور',
    loginSubmitBtn: 'دخول إلى حسابي',
    registerSubmitBtn: 'إنشاء حسابي في نصفي (Nisfy)',
    quickDemoLogin: 'أو تجربة سريعة وفورية بضغطة زر :',
    alreadyAccount: 'لديك حساب بالفعل ؟ سجل دخولك',
    noAccountYet: 'ليس لديك حساب بعد ؟ سجل مجاناً الآن',
    demoAccountsTitle: 'حسابات جاهزة للتجربة',
    demoSubtitle: 'اضغط على أي بروفايل لتجربة المنصة فوراً :',
    avatarChoice: 'الصورة الشخصية أو الأفاتار',
    interestsChoice: 'اهتماماتك وهواياتك',

    // Match Modal
    matchModalTitle: 'كوب دو كور متبادل !',
    matchModalCongrats: 'حدث توافق متبادل !',
    matchModalDesc: 'أنتما معجبان ببعضكما. ابدأ المحادثة والتعارف الآن بكل احترام !',
    sendMessageToMatch: 'إرسال رسالة مباشرة',
    continueExploring: 'متابعة التصفح',

    // New Features
    marriageFilterBtn: '💍 هدف زواج جاد',
    marriageBadge: 'موثق للزواج 💍',
    marriageTimelineLabel: 'المخطط الزمني للزواج',
    relocationLabel: 'الاستعداد للانتقال / السفر',
    jasminSuperLikeBtn: '🌸 زهرة الياسمين',
    jasminSentAlert: 'تم إرسال زهرة الياسمين بنجاح ! 🌸✨',
    blurPhotoBadge: 'وضع الخصوصية 🔒',
    blurPhotoHint: 'الصورة مموهة احتراما للخصوصية، وتظهر عند الإعجاب المتبادل.',
    revealPhotoBtn: 'كشف الصورة',
    reportUserBtn: 'إبلاغ',
    blockUserBtn: 'حظر',
    userReportedSuccess: 'تم إرسال البلاغ لإدارة DZ69 بنجاح.',
    userBlockedSuccess: 'تم حظر المستخدم.',
    recordVoiceNote: 'تسجيل رسالة صوتية',
    recordingVoice: 'جاري التسجيل...',
    stopVoiceNote: 'إيقاف وإرسال',
    playVoiceNote: 'تشغيل الرسالة الصوتية',

    // Live Streams & Media
    liveTitle: 'البث المباشر DZ69',
    liveSubtitle: 'شارك في البث المباشر وتواصل مع أعضاء الـ 69 ولاية والمهجر بالصوت والصورة',
    startLiveBtn: 'بدء بث مباشر الآن',
    stopLiveBtn: 'إنهاء البث',
    joinLiveBtn: 'دخول البث المباشر',
    activeLives: 'البث المباشر الجاري',
    noLivesActive: 'لا يوجد بث مباشر حالياً',
    noLivesDesc: 'كن أول من يطلق بثاً مباشراً ويتواصل مع مجتمع 69 ولاية !',
    liveViewers: 'مشاهد',
    liveSendGift: 'إرسال هدية',
    liveLike: 'إعجاب بالبث',
    liveTypeMessage: 'إرسال تعليق في البث المباشر...',
    liveCameraOn: 'الكاميرا مفعلة',
    liveCameraOff: 'الكاميرا متوقفة',
    liveMicOn: 'الميكروفون مفعل',
    liveMicOff: 'كتم الميكروفون',
    liveBeautyFilter: 'فلتر الجمال والإضاءة',
    photosAndVideos: 'الصور ومقاطع الفيديو',
    addPhotoBtn: 'إضافة صورة',
    addVideoBtn: 'إضافة فيديو',
    recordVideoBtn: 'تسجيل فيديو تعريفي',
    videoPresentation: 'فيديو تعريفي',
    hasVideoBadge: 'يحتوي على فيديو 📹',
    playVideo: 'مشاهدة الفيديو',
    closeVideo: 'إغلاق',
    filterHasVideo: '📹 حسابات تحتوي على فيديو فقط',

    // Map Toggle & Option
    mapToggleTitle: 'خريطة الترافيك العالمية والولايات',
    mapStatusDisabled: 'الخريطة مخفية حالياً',
    mapStatusEnabled: 'الخريطة مفعلة حالياً',
    activateMapBtn: 'تفعيل الخريطة',
    deactivateMapBtn: 'إخفاء الخريطة',
    returnToDiscover: 'العودة لتصفح الأعضاء',
    mapOptionHint: 'قم بتفعيل الخريطة في أي وقت لمشاهدة حركة وتدفق الاتصال في الوقت الفعلي بين الـ 69 ولاية والمهجر.',
    worldMapBanner: 'خريطة الترافيك العالمية والولايات',
    worldMapTeaser: 'شاهد التفاعلات المباشرة ونقاط الاتصال بين الـ 69 ولاية والمهجر في الوقت الفعلي',
    viewMapBtn: 'فتح الخريطة',

    // Connected Members on Map Click
    connectedMembersInZone: 'الأعضاء المتصلون الآن في هذه المنطقة',
    chooseToChat: 'اختر مع من تريد بدء المحادثة والتعارف في الخاص :',
    chatNowBtn: 'تحدث الآن',
    sendDirectMsg: 'إرسال رسالة',
    sendJasmin: 'إهداء ياسمينة',
    viewProfileDetails: 'عرض البروفايل',
    connectedLiveHeader: 'المتصلون مباشرة في',
    clickCityInstruction: 'اضغط على أي ولاية أو مدينة لعرض كافة الأعضاء المتصلين واختيار من ترغب في مراسلته فوراً.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isArabic: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'dz69_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === 'ar' || saved === 'fr' ? saved : 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const t = TRANSLATIONS[language];
  const isArabic = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isArabic }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
