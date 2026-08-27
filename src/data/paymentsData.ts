export type PaymentRecordStatus = 'paid' | 'pending' | 'overdue' | 'partial' | 'refunded';
export type PaymentMethodType =
  | 'baridimob'
  | 'virement_bancaire'
  | 'ccp'
  | 'especes'
  | 'cib_dahabia'
  | 'sepa_international'
  | 'cheque';

export interface PaymentTransaction {
  id: string;
  receiptNumber: string; // Ex: REC-2026-0801
  adId: string;
  brandName: string;
  brandNameAr?: string;
  contactPerson: string;
  phone: string;
  email?: string;
  city?: string;
  
  // Financial info
  amount: number;
  currency: 'DZD' | 'EUR';
  amountInWordsFr?: string;
  amountInWordsAr?: string;
  planLabel: string;
  planDuration: string;
  
  // Payment details
  paymentMethod: PaymentMethodType;
  paymentMethodLabel: string;
  transactionReference: string; // N° de bordereau CCP, Réf Virement, N° Reçu
  paymentDate: string; // YYYY-MM-DD
  dueDate?: string; // Next due date if recurring or partial
  periodCovered: string; // Ex: "01/08/2026 au 31/08/2026"
  
  // Status & installment
  status: PaymentRecordStatus;
  isInstallment: boolean;
  installmentNumber?: number;
  totalInstallments?: number;
  
  // Proof & Audit
  proofDocumentUrl?: string; // Image or receipt scan
  proofDocumentName?: string;
  receivedByAdmin: string;
  officialReceiptIssued: boolean;
  notes?: string;
  
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_PAYMENT_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'pay-don-jeovani-2026-08',
    receiptNumber: 'REC-2026-0801',
    adId: 'ad-don-jeovani-denia',
    brandName: 'Restaurant DON-JEOVANI • Chef Djamel-Michel 🇪🇸',
    brandNameAr: 'مطعم دون جيوفاني • الشيف جمال ميشيل (إسبانيا)',
    contactPerson: 'Chef Djamel-Michel',
    phone: '+34 965 78 00 00',
    email: 'contact@donjeovani-denia.es',
    city: 'Dénia (Alicante - Espagne)',
    amount: 1440,
    currency: 'EUR',
    amountInWordsFr: 'Mille Quatre Cent Quarante Euros',
    amountInWordsAr: 'ألف وأربعمائة وأربعون يورو',
    planLabel: 'Pack Prestige International (12 Mois)',
    planDuration: '1 an (12 mois)',
    paymentMethod: 'sepa_international',
    paymentMethodLabel: 'Virement Bancaire International SEPA (IBAN Espagne)',
    transactionReference: 'SEPA-ES91-2100-8874-9923',
    paymentDate: '2026-08-01',
    dueDate: '2027-01-01',
    periodCovered: '01/01/2026 au 31/12/2026',
    status: 'paid',
    isInstallment: false,
    receivedByAdmin: 'Direction Financière NISFY',
    officialReceiptIssued: true,
    notes: 'Règlement annuel complet par virement bancaire européen. Reçu de banque validé.',
    createdAt: '2026-08-01T10:30:00Z',
    updatedAt: '2026-08-01T10:30:00Z',
  },
  {
    id: 'pay-palais-bahia-2026-08',
    receiptNumber: 'REC-2026-0802',
    adId: 'ad-palais-el-bahia',
    brandName: 'Palais El-Bahia • قصر الباهية',
    brandNameAr: 'قصر الباهية للأعراس والمؤتمرات',
    contactPerson: 'M. Karim Bahia',
    phone: '+213 555 12 34 56',
    email: 'contact@palaiselbahia-dz.com',
    city: 'Alger',
    amount: 45000,
    currency: 'DZD',
    amountInWordsFr: 'Quarante-Cinq Mille Dinars Algériens',
    amountInWordsAr: 'خمسة وأربعون ألف دينار جزائري',
    planLabel: 'Pack Visibilité Prestige (3 Mois)',
    planDuration: '3 mois',
    paymentMethod: 'baridimob',
    paymentMethodLabel: 'BaridiMob (RIP Algérie Poste)',
    transactionReference: 'BM-20260805-998124',
    paymentDate: '2026-08-05',
    dueDate: '2026-11-05',
    periodCovered: '05/08/2026 au 05/11/2026',
    status: 'paid',
    isInstallment: false,
    receivedByAdmin: 'Djamel S. (Super-Admin)',
    officialReceiptIssued: true,
    notes: 'Virement BaridiMob instantané vérifié sur le compte postal NISFY.',
    createdAt: '2026-08-05T14:15:00Z',
    updatedAt: '2026-08-05T14:15:00Z',
  },
  {
    id: 'pay-ziana-kenza-2026-08',
    receiptNumber: 'REC-2026-0803',
    adId: 'ad-ziana-kenza-oran',
    brandName: 'Ziana Kenza Haute Couture & Caftans 👑',
    brandNameAr: 'زيانة كنزة للأزياء الراقية والقفطان الملكي',
    contactPerson: 'Mme Kenza B.',
    phone: '+213 550 98 76 54',
    email: 'kenza.couture@gmail.com',
    city: 'Oran',
    amount: 30000,
    currency: 'DZD',
    amountInWordsFr: 'Trente Mille Dinars Algériens',
    amountInWordsAr: 'ثلاثون ألف دينار جزائري',
    planLabel: 'Pack Semestriel Mariage (6 Mois)',
    planDuration: '6 mois',
    paymentMethod: 'especes',
    paymentMethodLabel: 'Espèces avec Reçu de Caisse & Tampon',
    transactionReference: 'ESP-ALGER-2026-441',
    paymentDate: '2026-08-10',
    dueDate: '2027-02-10',
    periodCovered: '10/08/2026 au 10/02/2027',
    status: 'paid',
    isInstallment: true,
    installmentNumber: 1,
    totalInstallments: 2,
    receivedByAdmin: 'Bureau NISFY Alger',
    officialReceiptIssued: true,
    notes: 'Premier acompte de 50% réglé en mains propres. Solde de 30 000 DZD prévu pour novembre 2026.',
    createdAt: '2026-08-10T11:00:00Z',
    updatedAt: '2026-08-10T11:00:00Z',
  },
  {
    id: 'pay-voyage-lune-miel-2026-08',
    receiptNumber: 'REC-2026-0804',
    adId: 'ad-safir-voyages-honeymoon',
    brandName: 'Safir Voyages • Lunes de Miel & Évasions',
    brandNameAr: 'سفير للسياحة والأسفار • رحلات شهر العسل',
    contactPerson: 'M. Amine Safir',
    phone: '+213 552 44 11 22',
    email: 'honeymoon@safirvoyages.dz',
    city: 'Alger & Constantine',
    amount: 55000,
    currency: 'DZD',
    amountInWordsFr: 'Cinquante-Cinq Mille Dinars Algériens',
    amountInWordsAr: 'خمسة وخمسون ألف دينار جزائري',
    planLabel: 'Pack Partenaire Officiel Évasion (Annuel)',
    planDuration: '1 an',
    paymentMethod: 'virement_bancaire',
    paymentMethodLabel: 'Virement Bancaire (BNA Agence Chéraga)',
    transactionReference: 'VIR-BNA-88349201',
    paymentDate: '2026-08-12',
    dueDate: '2027-08-12',
    periodCovered: '12/08/2026 au 12/08/2027',
    status: 'paid',
    isInstallment: false,
    receivedByAdmin: 'Comptabilité NISFY',
    officialReceiptIssued: true,
    notes: 'Virement bancaire professionnel interbancaire BNA vers compte NISFY.',
    createdAt: '2026-08-12T09:45:00Z',
    updatedAt: '2026-08-12T09:45:00Z',
  },
  {
    id: 'pay-studio-lumiere-2026-08',
    receiptNumber: 'REC-2026-0805',
    adId: 'ad-studio-lumiere-constantine',
    brandName: 'Studio Lumière & Cinéma Wedding 4K',
    brandNameAr: 'استوديو لوميير للتصوير السينمائي والأعراس',
    contactPerson: 'M. Farouk Lumière',
    phone: '+213 558 77 66 55',
    email: 'contact@studiolumiere4k.dz',
    city: 'Constantine',
    amount: 18000,
    currency: 'DZD',
    amountInWordsFr: 'Dix-Huit Mille Dinars Algériens',
    amountInWordsAr: 'ثمانية عشر ألف دينار جزائري',
    planLabel: 'Pack Découverte (1 Mois)',
    planDuration: '1 mois',
    paymentMethod: 'ccp',
    paymentMethodLabel: 'Versement Guichet CCP (Bordereau Poste)',
    transactionReference: 'CCP-BORD-0918237',
    paymentDate: '2026-08-18',
    dueDate: '2026-09-18',
    periodCovered: '18/08/2026 au 18/09/2026',
    status: 'pending',
    isInstallment: false,
    receivedByAdmin: 'En attente validation bordereau',
    officialReceiptIssued: false,
    notes: 'Annonceur a envoyé la photo du reçu de versement CCP. En cours de vérification de crédit sur extrait postal.',
    createdAt: '2026-08-18T16:20:00Z',
    updatedAt: '2026-08-18T16:20:00Z',
  },
  {
    id: 'pay-bijouterie-aurum-2026-08',
    receiptNumber: 'REC-2026-0806',
    adId: 'ad-bijouterie-aurum-setif',
    brandName: 'Maison Aurum • Joaillerie & Or 18K Sétif',
    brandNameAr: 'مجوهرات أوروم • الذهب والماس عيار 18 قيراط',
    contactPerson: 'M. Sofiane Aurum',
    phone: '+213 554 33 22 11',
    email: 'contact@maisonaurum.dz',
    city: 'Sétif',
    amount: 35000,
    currency: 'DZD',
    amountInWordsFr: 'Trente-Cinq Mille Dinars Algériens',
    amountInWordsAr: 'خمسة وثلاثون ألف دينار جزائري',
    planLabel: 'Pack Trimestriel Élite (3 Mois)',
    planDuration: '3 mois',
    paymentMethod: 'baridimob',
    paymentMethodLabel: 'BaridiMob (RIP Algérie Poste)',
    transactionReference: 'BM-20260715-44219',
    paymentDate: '2026-07-15',
    dueDate: '2026-08-15',
    periodCovered: '15/07/2026 au 15/08/2026',
    status: 'overdue',
    isInstallment: false,
    receivedByAdmin: 'Non reçu',
    officialReceiptIssued: false,
    notes: 'Échéance dépassée de 10 jours. Annonce mise en pause temporaire en attente du renouvellement.',
    createdAt: '2026-07-15T08:00:00Z',
    updatedAt: '2026-08-16T10:00:00Z',
  }
];
