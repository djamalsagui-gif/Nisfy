const fs = require('fs');
const file = 'src/context/LanguageContext.tsx';
let code = fs.readFileSync(file, 'utf8');

const interfaceKeys = `  // Missing keys added by fix
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
  dislikeBtn: string;`;

const frKeys = `    // Missing keys
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

const arKeys = `    // Missing keys
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

code = code.replace(/export interface Translations \{/, 'export interface Translations {\n' + interfaceKeys);
code = code.replace(/export const fr: Translations = \{/, 'export const fr: Translations = {\n' + frKeys);
code = code.replace(/export const ar: Translations = \{/, 'export const ar: Translations = {\n' + arKeys);

fs.writeFileSync(file, code);
