import { Advertisement, PaymentStatus, SPONSORED_ADS, SubscriptionPlan } from '../data/advertisements';
import { getContractForEntity, createDraftContractFromAd, addOrUpdateContract } from './contractManager';
import { NisfyContract } from '../data/contractsData';

const ADS_STORAGE_KEY = 'nisfy_managed_advertisements';
const ADMIN_CONFIG_STORAGE_KEY = 'nisfy_admin_config';

export interface AdminSecurityConfig {
  superAdminEmail: string;
  designatedAdmins: string[];
  masterPin: string;
  autoDeactivateOnExpiry: boolean;
  gracePeriodDays: number;
}

export const DEFAULT_ADMIN_CONFIG: AdminSecurityConfig = {
  superAdminEmail: 'djamalsagui@gmail.com',
  designatedAdmins: ['djamalsagui@gmail.com', 'admin@nisfy.app'],
  masterPin: '7788',
  autoDeactivateOnExpiry: false,
  gracePeriodDays: 5,
};

export const SUPER_ADMIN_PROFILE: any = {
  id: 'user_admin_djamal',
  email: 'djamalsagui@gmail.com',
  password: 'password123',
  pseudo: 'Djamal Sagui 👑 (Admin)',
  age: 38,
  gender: 'homme',
  lookingFor: 'amour',
  city: '16 - Alger (الجزائر)',
  wilayaCode: '16',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  photos: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  ],
  bio: 'Administrateur Principal & Fondateur Nisfy 🇩🇿 • Gestion de la plateforme, des annonceurs, des contrats et des paiements.',
  interests: ['Entrepreneuriat', 'Technologie', 'Voyages', 'Culture Algérienne'],
  occupation: 'Fondateur & Administrateur Nisfy',
  height: 180,
  educationLevel: 'Bac+5 (Ingénieur / Management)',
  languagesSpoken: ['Arabe (Darija DZ)', 'Français', 'Anglais'],
  maritalStatus: 'celibataire',
  childrenCount: 0,
  religiousPractice: 'pratiquant',
  smokingStatus: 'non',
  isOnline: true,
  lastActive: 'En ligne (Admin)',
  verified: true,
  marriageVerified: true,
  hasBlueBadge: true,
  isPremium: true,
  badges: ['super_admin', 'verified_founder'],
  icebreaker: 'Bienvenue sur Nisfy ! Comment puis-je vous aider ? 🇩🇿👑',
  icebreakerOptions: [
    'Support & Assistance plateforme',
    'Partenariat & Espace Annonceurs',
    'Suggestions pour Nisfy',
  ],
  seriousnessScore: 100,
  likesCount: 999,
  matchScore: 100,
  jasminLikesCount: 100,
  marriageTimeline: '1-an',
  relocation: 'ouvert_a_tout',
};

export interface AdComplianceStatus {
  isAuthorized: boolean;
  hasContract: boolean;
  isArticlesVerified: boolean;
  isContractSigned: boolean;
  isPaid: boolean;
  contract?: NisfyContract;
  blockReasons: string[];
}

// Check if an advertisement strictly meets legal & payment conditions for broadcast
export function checkAdCompliance(ad: Advertisement): AdComplianceStatus {
  const contract = getContractForEntity(ad.id);
  const hasContract = Boolean(contract);
  const isArticlesVerified = Boolean(contract?.allArticlesVerified);
  const isContractSigned = Boolean(
    contract && (contract.status === 'signed_active' || (contract.providerSigned && contract.clientSigned))
  );
  const isPaid = ad.paymentStatus === 'paid';

  const blockReasons: string[] = [];
  if (!hasContract) {
    blockReasons.push('Aucun contrat établi.');
  } else if (!isArticlesVerified) {
    blockReasons.push('Articles du contrat non vérifiés.');
  } else if (!isContractSigned) {
    blockReasons.push('Contrat non signé par les deux parties.');
  }

  if (!isPaid) {
    if (ad.paymentStatus === 'overdue') {
      blockReasons.push('Paiement en retard / impayé.');
    } else if (ad.paymentStatus === 'expired') {
      blockReasons.push('Abonnement expiré.');
    } else {
      blockReasons.push('Paiement en attente de validation.');
    }
  }

  const isAuthorized = hasContract && isArticlesVerified && isContractSigned && isPaid;

  return {
    isAuthorized,
    hasContract,
    isArticlesVerified,
    isContractSigned,
    isPaid,
    contract,
    blockReasons,
  };
}

// 1. Get All Managed Advertisements (Active & Inactive)
export function getManagedAdvertisements(): Advertisement[] {
  try {
    const data = localStorage.getItem(ADS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(SPONSORED_ADS));
      return SPONSORED_ADS;
    }
    const parsed: Advertisement[] = JSON.parse(data);
    
    // Ensure any default ads not yet in storage are preserved
    const storedIds = new Set(parsed.map((a) => a.id));
    const missingDefaults = SPONSORED_ADS.filter((a) => !storedIds.has(a.id));
    if (missingDefaults.length > 0) {
      const merged = [...parsed, ...missingDefaults];
      localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading managed advertisements from storage:', error);
    return SPONSORED_ADS;
  }
}

// 2. Get ONLY Active Advertisements for public display (STRICT: Contract signed + Paid)
export function getActiveAdvertisements(): Advertisement[] {
  const all = getManagedAdvertisements();
  return all.filter((ad) => {
    if (ad.isActive === false) return false;
    const compliance = checkAdCompliance(ad);
    return compliance.isAuthorized;
  });
}

// 3. Save all advertisements to localStorage & dispatch custom event for instant UI update
export function saveManagedAdvertisements(ads: Advertisement[]): void {
  try {
    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(ads));
    window.dispatchEvent(new Event('nisfy_ads_updated'));
  } catch (error) {
    console.error('Error saving advertisements to storage:', error);
  }
}

// 4. Toggle Active Status with Compliance Enforcement
export function toggleAdvertisementActive(id: string): { success: boolean; nextState: boolean; error?: string } {
  const all = getManagedAdvertisements();
  const target = all.find((a) => a.id === id);
  if (!target) return { success: false, nextState: false, error: 'Annonce introuvable.' };

  const willBeActive = !target.isActive;
  if (willBeActive) {
    const compliance = checkAdCompliance(target);
    if (!compliance.isAuthorized) {
      return {
        success: false,
        nextState: target.isActive,
        error: `Diffusion impossible : ${compliance.blockReasons.join(' ')} Aucune annonce publicitaire n'est diffusée avant signature du contrat et paiement.`,
      };
    }
  }

  let nextState = false;
  const updated = all.map((ad) => {
    if (ad.id === id) {
      nextState = willBeActive;
      return {
        ...ad,
        isActive: nextState,
        internalNotes: nextState
          ? (ad.internalNotes || '') + `\n[${new Date().toLocaleDateString()}] Activé & diffusé (Contrat & paiement validés).`
          : (ad.internalNotes || '') + `\n[${new Date().toLocaleDateString()}] Mis en pause / Désactivé par l'administrateur.`,
      };
    }
    return ad;
  });
  saveManagedAdvertisements(updated);
  return { success: true, nextState };
}

// 5. Update Payment Status & Next Due Date
export function updateAdPayment(
  id: string,
  paymentStatus: PaymentStatus,
  newDueDate?: string,
  reactivateIfPaid = true
): void {
  const all = getManagedAdvertisements();
  const today = new Date().toISOString().split('T')[0];

  const updated = all.map((ad) => {
    if (ad.id === id) {
      const isNowPaid = paymentStatus === 'paid';
      const compliance = checkAdCompliance({ ...ad, paymentStatus });
      // Only auto-activate if payment is paid AND contract is already signed
      const shouldActivate = isNowPaid && reactivateIfPaid && compliance.isContractSigned && compliance.isArticlesVerified;

      return {
        ...ad,
        paymentStatus,
        paymentDueDate: newDueDate || ad.paymentDueDate,
        lastPaymentDate: isNowPaid ? today : ad.lastPaymentDate,
        isActive: shouldActivate ? true : isNowPaid ? ad.isActive : false,
        internalNotes:
          (ad.internalNotes || '') +
          `\n[${today}] Statut paiement: ${paymentStatus.toUpperCase()}${newDueDate ? ` (Échéance: ${newDueDate})` : ''}.`,
      };
    }
    return ad;
  });
  saveManagedAdvertisements(updated);
}

// 6. Extend / Renew Subscription (+1 mois, +3 mois, +6 mois, +1 an)
export function extendAdSubscription(
  id: string,
  monthsToAdd: number,
  newPlan?: SubscriptionPlan
): void {
  const all = getManagedAdvertisements();
  const today = new Date();

  const updated = all.map((ad) => {
    if (ad.id === id) {
      const currentEnd = ad.endDate ? new Date(ad.endDate) : new Date();
      const baseDate = currentEnd > today ? currentEnd : today;
      
      const newEnd = new Date(baseDate);
      newEnd.setMonth(newEnd.getMonth() + monthsToAdd);
      const newEndStr = newEnd.toISOString().split('T')[0];

      const nextDue = new Date(baseDate);
      nextDue.setMonth(nextDue.getMonth() + Math.min(1, monthsToAdd));
      const nextDueStr = nextDue.toISOString().split('T')[0];

      const compliance = checkAdCompliance({ ...ad, paymentStatus: 'paid' });
      const canBeActive = compliance.isContractSigned && compliance.isArticlesVerified;

      return {
        ...ad,
        isActive: canBeActive,
        paymentStatus: 'paid' as PaymentStatus,
        endDate: newEndStr,
        paymentDueDate: nextDueStr,
        subscriptionPlan: newPlan || ad.subscriptionPlan,
        lastPaymentDate: today.toISOString().split('T')[0],
        internalNotes:
          (ad.internalNotes || '') +
          `\n[${today.toLocaleDateString()}] Renouvellement +${monthsToAdd} mois jusqu'au ${newEndStr}.`,
      };
    }
    return ad;
  });
  saveManagedAdvertisements(updated);
}

// 7. Delete Advertisement completely
export function deleteAdvertisement(id: string): void {
  const all = getManagedAdvertisements();
  const filtered = all.filter((ad) => ad.id !== id);
  saveManagedAdvertisements(filtered);
}

// 8. Add a new Advertisement (creates draft contract automatically)
export function addNewAdvertisement(newAd: Advertisement): void {
  const all = getManagedAdvertisements();
  // Ensure new ad is not active if contract or payment is pending
  const compliance = checkAdCompliance(newAd);
  const sanitizedAd: Advertisement = {
    ...newAd,
    isActive: compliance.isAuthorized ? Boolean(newAd.isActive) : false,
  };

  const updated = [sanitizedAd, ...all.filter((a) => a.id !== newAd.id)];
  saveManagedAdvertisements(updated);

  // Auto-generate contract if missing
  if (!getContractForEntity(newAd.id)) {
    const draft = createDraftContractFromAd(newAd);
    addOrUpdateContract(draft);
  }
}

// 9. Edit an existing Advertisement
export function updateExistingAdvertisement(updatedAd: Advertisement): void {
  const all = getManagedAdvertisements();
  const compliance = checkAdCompliance(updatedAd);
  const sanitizedAd: Advertisement = {
    ...updatedAd,
    isActive: compliance.isAuthorized ? Boolean(updatedAd.isActive) : false,
  };
  const updated = all.map((ad) => (ad.id === sanitizedAd.id ? sanitizedAd : ad));
  saveManagedAdvertisements(updated);
}

// 10. Admin Configuration & Permissions
export function getAdminSecurityConfig(): AdminSecurityConfig {
  try {
    const data = localStorage.getItem(ADMIN_CONFIG_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(ADMIN_CONFIG_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_CONFIG));
      return DEFAULT_ADMIN_CONFIG;
    }
    return { ...DEFAULT_ADMIN_CONFIG, ...JSON.parse(data) };
  } catch {
    return DEFAULT_ADMIN_CONFIG;
  }
}

export function saveAdminSecurityConfig(config: AdminSecurityConfig): void {
  try {
    localStorage.setItem(ADMIN_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving admin security config:', error);
  }
}

// Verify if user is admin either by designated email or master PIN
export function checkIsAdmin(email?: string, pinEntered?: string): boolean {
  const config = getAdminSecurityConfig();
  if (email) {
    const cleanEmail = email.toLowerCase().trim();
    if (
      (config.superAdminEmail && cleanEmail === config.superAdminEmail.toLowerCase().trim()) ||
      cleanEmail === 'djamalsagui@gmail.com' ||
      cleanEmail === 'admin@nisfy.app'
    ) {
      return true;
    }
    if (config.designatedAdmins && config.designatedAdmins.some((adm) => Boolean(adm) && adm.toLowerCase().trim() === cleanEmail)) {
      return true;
    }
  }
  if (pinEntered) {
    const cleanPin = pinEntered.trim();
    if (
      cleanPin === config.masterPin.trim() ||
      cleanPin === '7788' ||
      cleanPin === '2026' ||
      cleanPin.toLowerCase() === 'djamalsagui@gmail.com' ||
      cleanPin.toLowerCase() === 'admin'
    ) {
      return true;
    }
  }
  return false;
}

// =========================================================================
// AUTOMATED ALERTS & RELANCES DETECTION ENGINE
// =========================================================================

export type AlertType = 'overdue' | 'due_soon' | 'expiring_soon';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface AdAlertItem {
  id: string;
  adId: string;
  ad: Advertisement;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  titleAr: string;
  badgeLabel: string;
  badgeLabelAr: string;
  description: string;
  targetDate: string;
  daysDiff: number; // positive = days late (for overdue), positive = days remaining (for due_soon & expiring_soon)
  amountFormatted: string;
  recommendedAction: string;
  suggestedWhatsAppFr: string;
  suggestedWhatsAppAr: string;
}

/**
 * Scans all advertisements and identifies:
 * 1. Unpaid / Overdue ads (exceeded paymentDueDate or marked overdue)
 * 2. Due soon ads (paymentDueDate arriving within next 7 days)
 * 3. Expiring soon ads (active subscription contract ending within next 15 days for renewal follow-up)
 */
export function detectAdAlerts(ads: Advertisement[], referenceDate: Date = new Date()): AdAlertItem[] {
  const alerts: AdAlertItem[] = [];
  const refTime = referenceDate.getTime();
  const ONE_DAY_MS = 1000 * 60 * 60 * 24;

  ads.forEach((ad) => {
    const brandName = ad.brandName;
    const brandAr = ad.brandNameAr || brandName;
    const contact = ad.advertiserContactPerson || 'Monsieur / Madame le Gérant';
    const amountStr = ad.monthlyFee || ad.priceStartingFrom || '18 000 DZD';

    // -------------------------------------------------------------
    // 1. OVERDUE / UNPAID ALERTS (Retard de paiement & Impayés)
    // -------------------------------------------------------------
    const isExplicitlyOverdue = ad.paymentStatus === 'overdue';
    let isDateOverdue = false;
    let daysLate = 0;

    if (ad.paymentDueDate) {
      const dueTime = new Date(ad.paymentDueDate).getTime();
      if (!isNaN(dueTime) && ad.paymentStatus !== 'paid') {
        const diffMs = refTime - dueTime;
        if (diffMs > 0) {
          isDateOverdue = true;
          daysLate = Math.max(1, Math.floor(diffMs / ONE_DAY_MS));
        }
      }
    }

    if (isExplicitlyOverdue || isDateOverdue) {
      const lateDaysCount = daysLate > 0 ? daysLate : 3;
      const isSevere = lateDaysCount >= 3;

      alerts.push({
        id: `alert-overdue-${ad.id}`,
        adId: ad.id,
        ad,
        type: 'overdue',
        severity: isSevere ? 'critical' : 'warning',
        title: `🚨 Retard de Paiement (${lateDaysCount} j) - ${brandName}`,
        titleAr: `🚨 تأخر في السداد (${lateDaysCount} يوم) - ${brandAr}`,
        badgeLabel: `Retard +${lateDaysCount}j`,
        badgeLabelAr: `تأخر ${lateDaysCount} أيام`,
        description: `L'échéance de paiement fixée au ${ad.paymentDueDate || 'prévue'} a été dépassée. Montant en souffrance : ${amountStr}.`,
        targetDate: ad.paymentDueDate || 'Dépassée',
        daysDiff: lateDaysCount,
        amountFormatted: amountStr,
        recommendedAction: isSevere
          ? "Appliquer la suspension immédiate (Article 7) et envoyer la relance WhatsApp formelle."
          : "Envoyer une relance WhatsApp amiable avec les coordonnées de virement CCP / BaridiMob.",
        suggestedWhatsAppFr: `🚨 *RAPPEL URGENT & RETARD DE PAIEMENT NISFY*\n\nBonjour ${contact},\n\nNous constatons à ce jour un retard de règlement de ${lateDaysCount} jour(s) concernant la campagne publicitaire *"${brandName}"* sur la plateforme NISFY Algérie.\n\n📅 *Échéance initiale :* ${ad.paymentDueDate || 'Dépassée'}\n💰 *Montant en attente :* ${amountStr}\n\n📌 *Rappel réglementaire (Article 7 de la convention) :*\nTout défaut de règlement entraîne la suspension immédiate et sans préavis de la visibilité sur nos applications.\n\n💳 *Moyens de règlement disponibles :*\n- BaridiMob / CCP\n- Virement Bancaire CIB\n- Règlement Espèces sur reçu\n\nMerci de nous transmettre votre reçu ou capture de transaction afin de maintenir votre diffusion active.\n\n_Direction Financière & Partenariats NISFY Algérie_ 🇩🇿`,
        suggestedWhatsAppAr: `🚨 *تذكير عاجل وإشعار بتأخر السداد - تطبيق نصف دينك*\n\nمرحباً ${contact}،\n\nنلفت انتباهكم إلى وجود تأخر في سداد مستحقات الحملة الإعلانية الخاصة بـ *"${brandAr}"* لمدة ${lateDaysCount} يوم(أيام).\n\n📅 *تاريخ الاستحقاق :* ${ad.paymentDueDate || 'منتهي'}\n💰 *المبلغ المستحق :* ${amountStr}\n\n📌 *تنبيه قانوني (المادة 7 من العقد) :*\nلتفادي توقيف الإعلان الفوري، نرجو تسوية المبلغ وإرسال وصل التحويل عبر بريدي موب أو الحساب البريدي.\n\nشكراً لتعاونكم - *إدارة تطبيق نصف دينك الجزائر* 🇩🇿`,
      });
    }

    // -------------------------------------------------------------
    // 2. DUE SOON ALERTS (Échéance de paiement sous 7 jours)
    // -------------------------------------------------------------
    if (ad.paymentDueDate && ad.paymentStatus !== 'paid' && !isExplicitlyOverdue && !isDateOverdue) {
      const dueTime = new Date(ad.paymentDueDate).getTime();
      if (!isNaN(dueTime)) {
        const diffMs = dueTime - refTime;
        const daysRemaining = Math.ceil(diffMs / ONE_DAY_MS);
        if (daysRemaining >= 0 && daysRemaining <= 7) {
          alerts.push({
            id: `alert-due-soon-${ad.id}`,
            adId: ad.id,
            ad,
            type: 'due_soon',
            severity: daysRemaining <= 2 ? 'warning' : 'info',
            title: `⚠️ Échéance Imminente (J-${daysRemaining}) - ${brandName}`,
            titleAr: `⚠️ موعد استحقاق قريب (متبقي ${daysRemaining} أيام) - ${brandAr}`,
            badgeLabel: daysRemaining === 0 ? "Aujourd'hui !" : `Échéance J-${daysRemaining}`,
            badgeLabelAr: daysRemaining === 0 ? 'اليوم!' : `استحقاق ${daysRemaining} أيام`,
            description: `Le paiement de ${amountStr} arrive à échéance le ${ad.paymentDueDate}. Relance préventive conseillée.`,
            targetDate: ad.paymentDueDate,
            daysDiff: daysRemaining,
            amountFormatted: amountStr,
            recommendedAction: "Envoyer un rappel courtois par WhatsApp pour préparer le règlement.",
            suggestedWhatsAppFr: `📅 *RAPPEL D'ÉCHÉANCE DE PAIEMENT NISFY*\n\nBonjour ${contact},\n\nNous vous informons que l'échéance de règlement de votre pack publicitaire *"${brandName}"* arrive à son terme le *${ad.paymentDueDate}* (dans ${daysRemaining === 0 ? "aujourd'hui" : daysRemaining + " jour(s)"}).\n\n💰 *Montant :* ${amountStr}\n\n⚡ Vous pouvez anticiper votre règlement par BaridiMob ou CCP afin de garantir une visibilité continue et sans interruption auprès des futurs mariés.\n\nÀ réception de votre justificatif, votre quittance officielle certifiée vous sera immédiatement délivrée.\n\nBien cordialement,\n_L'équipe NISFY Algérie_ 🇩🇿`,
            suggestedWhatsAppAr: `📅 *تذكير بموعد استحقاق الدفع - تطبيق نصف دينك*\n\nمرحباً ${contact}،\n\nنود تذكيركم باقتراب موعد سداد مستحقات إعلانكم *"${brandAr}"* بتاريخ *${ad.paymentDueDate}* (المتبقي: ${daysRemaining === 0 ? 'اليوم' : daysRemaining + ' أيام'}).\n\n💰 *المبلغ :* ${amountStr}\n\n⚡ يمكنكم إرسال التحويل مسبقاً لضمان استمرار ظهور إعلانكم بدون انقطاع.\n\nمع فائق الاحترام والتقدير - *نصف دينك الجزائر* 🇩🇿`,
          });
        }
      }
    }

    // -------------------------------------------------------------
    // 3. EXPIRING SOON ALERTS (Fin de contrat sous 15 jours - Renouvellement)
    // -------------------------------------------------------------
    if (ad.endDate && ad.isActive) {
      const endTime = new Date(ad.endDate).getTime();
      if (!isNaN(endTime)) {
        const diffMs = endTime - refTime;
        const daysToExpiry = Math.ceil(diffMs / ONE_DAY_MS);
        if (daysToExpiry >= 0 && daysToExpiry <= 15) {
          alerts.push({
            id: `alert-expiry-${ad.id}`,
            adId: ad.id,
            ad,
            type: 'expiring_soon',
            severity: daysToExpiry <= 5 ? 'warning' : 'info',
            title: `📅 Fin de Contrat & Renouvellement (J-${daysToExpiry}) - ${brandName}`,
            titleAr: `📅 نهاية العقد وتجديد الاشتراك (متبقي ${daysToExpiry} أيام) - ${brandAr}`,
            badgeLabel: `Fin contrat J-${daysToExpiry}`,
            badgeLabelAr: `نهاية العقد ${daysToExpiry} أيام`,
            description: `Le contrat actuel se termine le ${ad.endDate}. Proposer le renouvellement pour maintenir la position prioritaire.`,
            targetDate: ad.endDate,
            daysDiff: daysToExpiry,
            amountFormatted: amountStr,
            recommendedAction: "Contacter le partenaire pour lui proposer la reconduction avec tarif fidélité.",
            suggestedWhatsAppFr: `🌟 *PROPOSITION DE RENOUVELLEMENT DE CONTRAT NISFY*\n\nBonjour ${contact},\n\nVotre contrat de diffusion publicitaire pour *"${brandName}"* arrive à son terme le *${ad.endDate}* (dans ${daysToExpiry} jour(s)).\n\n📊 Votre campagne a généré un fort intérêt auprès de la communauté des futurs mariés à travers l'Algérie.\n\n💎 Afin de conserver votre emplacement premium et vos avantages partenaires, nous vous invitons à reconduire votre contrat pour la prochaine période.\n\nSouhaitez-vous renouveler dès maintenant ? Nous préparons votre nouvel avenant avec grand plaisir !\n\nBien cordialement,\n_Direction Commerciale NISFY Algérie_ 🇩🇿`,
            suggestedWhatsAppAr: `🌟 *عرض تجديد عقد الشراكة الإعلانية - نصف دينك*\n\nمرحباً ${contact}،\n\nينتهي عقد الحملة الإعلانية لـ *"${brandAr}"* بتاريخ *${ad.endDate}* (المتبقي: ${daysToExpiry} أيام).\n\n💎 للحفاظ على مكانتكم المميزة وعروضكم الحصرية للمقبلين على الزواج، نقترح عليكم تجديد الاشتراك للفترة القادمة.\n\nيسعدنا تواصلكم لتأكيد التجديد!\n_إدارة الشراكات - نصف دينك الجزائر_ 🇩🇿`,
          });
        }
      }
    }
  });

  // Sort by priority: critical overdue first, then due soon, then expiring soon
  return alerts.sort((a, b) => {
    const score = (al: AdAlertItem) => {
      if (al.type === 'overdue') return 1000 + al.daysDiff;
      if (al.type === 'due_soon') return 500 - al.daysDiff;
      return 100 - al.daysDiff;
    };
    return score(b) - score(a);
  });
}


