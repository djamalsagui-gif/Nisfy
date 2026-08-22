const fs = require('fs');
let code = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');

const frKeys = `
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
    dislikeBtn: "Passer",`;

const arKeys = `
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
    dislikeBtn: "تجاوز",`;

code = code.replace(/fr: \{/, 'fr: {' + frKeys);
code = code.replace(/ar: \{/, 'ar: {' + arKeys);

fs.writeFileSync('src/context/LanguageContext.tsx', code);
