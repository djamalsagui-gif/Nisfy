import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  FileCheck,
  CreditCard,
  TrendingUp,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  MessageCircle,
  Eye,
  Calendar,
  Clock,
  Stamp,
  User,
  ExternalLink,
  Receipt,
  Play,
  RotateCcw,
  Zap,
  Upload,
  AlertOctagon,
  FileWarning,
  RefreshCw,
  Check,
  Send,
  HelpCircle,
  Bell,
  BellRing,
  Copy,
  ShieldAlert,
  Share2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Bot,
  Radio,
  Music,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AutonomousWorkflow40 } from './AutonomousWorkflow40';
import {
  Advertisement,
  PaymentStatus,
  SubscriptionPlan,
} from '../../data/advertisements';
import {
  NISFY_MUSIC_CATALOG,
  getDefaultTrackForCategory,
  getTrackById,
  MusicTrack,
} from '../../data/musicThemes';
import { musicAudioEngine } from '../../utils/musicAudioEngine';
import {
  NisfyContract,
  ContractArticle,
  STANDARD_CONTRACT_ARTICLES,
} from '../../data/contractsData';
import {
  PaymentTransaction,
  PaymentMethodType,
} from '../../data/paymentsData';
import {
  getManagedAdvertisements,
  addNewAdvertisement,
  deleteAdvertisement,
  saveManagedAdvertisements,
  updateAdPayment,
  detectAdAlerts,
  AdAlertItem,
  AlertType,
} from '../../utils/adsManager';
import {
  getManagedContracts,
  addOrUpdateContract,
  createDraftContractFromAd,
} from '../../utils/contractManager';
import {
  getManagedPayments,
  saveManagedPayments,
  generateNextReceiptNumber,
  numberToWordsFr,
  numberToWordsAr,
} from '../../utils/paymentsManager';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import { RecordPaymentModal } from './RecordPaymentModal';
import { recordNewPayment } from '../../utils/paymentsManager';

interface SimpleAdManagerProps {
  onViewPublicAd?: (adId: string) => void;
  onBack?: () => void;
}

export function SimpleAdManager({ onViewPublicAd, onBack }: SimpleAdManagerProps) {
  // 1. Current Step in the 4-Step Simple Flow + Workflow 4.0 Autonome
  // 'step1_reception' | 'step2_contrat' | 'step3_paiement_lancement' | 'step4_suivi' | 'step_autonomous_40'
  const [activeStep, setActiveStep] = useState<
    'step1_reception' | 'step2_contrat' | 'step3_paiement_lancement' | 'step4_suivi' | 'step_autonomous_40'
  >('step1_reception');

  // 2. Core Data State
  const [ads, setAds] = useState<Advertisement[]>(() => getManagedAdvertisements());
  const [contracts, setContracts] = useState<NisfyContract[]>(() => getManagedContracts());
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => getManagedPayments());

  // 3. Selected Entities for Workflow Steps
  const [selectedAdId, setSelectedAdId] = useState<string>(() => ads[0]?.id || '');
  const [receiptModalPayment, setReceiptModalPayment] = useState<PaymentTransaction | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // 4. Suspension & Reactivation Modals State
  const [suspensionModalAd, setSuspensionModalAd] = useState<Advertisement | null>(null);
  const [reactivateModalAd, setReactivateModalAd] = useState<Advertisement | null>(null);

  // 5. Automated Alerts & Smart Relances State
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [selectedAlertForRelance, setSelectedAlertForRelance] = useState<AdAlertItem | null>(null);
  const [relanceLang, setRelanceLang] = useState<'fr' | 'ar'>('fr');
  const [relanceCustomMessage, setRelanceCustomMessage] = useState<string>('');
  const [relanceTone, setRelanceTone] = useState<'auto' | 'courtois' | 'ferme' | 'art7' | 'renouvellement'>('auto');
  const [activeAlertFilter, setActiveAlertFilter] = useState<'all' | 'overdue' | 'due_soon' | 'expiring_soon'>('all');
  const [isAlertsBannerExpanded, setIsAlertsBannerExpanded] = useState(true);
  const [copiedRelance, setCopiedRelance] = useState(false);

  // Proof / Justification Form
  const [proofForm, setProofForm] = useState({
    paymentMethod: 'baridimob' as PaymentMethodType,
    transactionReference: '',
    amount: 18000,
    proofDate: new Date().toISOString().split('T')[0],
    proofNotes: 'Justificatif de virement transmis par l\'annonceur via WhatsApp.',
    proofFileName: 'recu_virement_baridimob.jpg',
  });

  // Search & Filters for Step 1 & Step 4
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contract_ready' | 'paid_online' | 'overdue'>('all');

  // Step 1: New Demand Form Modal
  const [isNewDemandModalOpen, setIsNewDemandModalOpen] = useState(false);
  const [previewPlayingTrackId, setPreviewPlayingTrackId] = useState<string | null>(null);
  const [newDemandForm, setNewDemandForm] = useState({
    brandName: '',
    brandNameAr: '',
    category: 'venue' as Advertisement['category'],
    contactPerson: '',
    phone: '',
    whatsapp: '',
    wilaya: '16 - Alger',
    plan: '1_mois' as SubscriptionPlan,
    customAmount: '18000',
    tagline: '',
    description: '',
    musicThemeId: 'track-zorna-cortege',
    bannerImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    logoImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'
    ],
    address: '',
    websiteUrl: '',
    promoCode: 'NISFY-PROMO',
    discountBadge: 'Remise Spéciale',
  });

  // Step 2: Contract Language & Options
  const [contractLang, setContractLang] = useState<'fr' | 'ar' | 'bilingual'>('bilingual');
  const [contractArticlesSearch, setContractArticlesSearch] = useState('');

  // Step 3: Payment & Launch Form
  const [paymentForm, setPaymentForm] = useState({
    amount: 18000,
    paymentMethod: 'baridimob' as PaymentMethodType,
    transactionReference: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: 'Paiement pour activation de la campagne publicitaire.',
  });

  // Refresh on external storage updates
  useEffect(() => {
    const handleStorageUpdate = () => {
      setAds(getManagedAdvertisements());
      setContracts(getManagedContracts());
      setPayments(getManagedPayments());
    };
    window.addEventListener('nisfy_ads_updated', handleStorageUpdate);
    window.addEventListener('nisfy_contracts_updated', handleStorageUpdate);
    window.addEventListener('nisfy_payments_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('nisfy_ads_updated', handleStorageUpdate);
      window.removeEventListener('nisfy_contracts_updated', handleStorageUpdate);
      window.removeEventListener('nisfy_payments_updated', handleStorageUpdate);
    };
  }, []);

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  // Selected Ad and Contract
  const currentAd = useMemo(() => {
    return ads.find((a) => a.id === selectedAdId) || ads[0] || null;
  }, [ads, selectedAdId]);

  const currentContract = useMemo(() => {
    if (!currentAd) return null;
    let found = contracts.find((c) => c.targetEntityId === currentAd.id);
    if (!found) {
      // Create draft if not existing
      found = createDraftContractFromAd(currentAd);
    }
    return found;
  }, [contracts, currentAd]);

  // Refresh and sync data from storage
  const reloadData = () => {
    setAds(getManagedAdvertisements());
    setContracts(getManagedContracts());
    setPayments(getManagedPayments());
  };

  // Filtered Ads for Step 1
  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      const matchSearch =
        ad.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.brandNameAr?.includes(searchQuery) ||
        ad.advertiserContactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.phone.includes(searchQuery);

      if (!matchSearch) return false;

      if (statusFilter === 'new') return ad.paymentStatus === 'pending' && !ad.isActive;
      if (statusFilter === 'contract_ready') {
        const ctr = contracts.find((c) => c.targetEntityId === ad.id);
        return ctr && ctr.status === 'signed_active' && !ad.isActive;
      }
      if (statusFilter === 'paid_online') return ad.isActive && ad.paymentStatus === 'paid';
      if (statusFilter === 'overdue') return ad.paymentStatus === 'overdue' || (!ad.isActive && ad.paymentStatus !== 'pending');

      return true;
    });
  }, [ads, contracts, searchQuery, statusFilter]);

  // Financial Stats for Step 4
  const stats = useMemo(() => {
    const totalEncaise = payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const totalEnAttente = ads
      .filter((a) => a.paymentStatus === 'pending')
      .reduce((sum, a) => {
        const val = parseInt(a.monthlyFee?.replace(/\D/g, '') || '18000', 10);
        return sum + (isNaN(val) ? 18000 : val);
      }, 0);

    const totalImpayes = ads
      .filter((a) => a.paymentStatus === 'overdue')
      .reduce((sum, a) => {
        const val = parseInt(a.monthlyFee?.replace(/\D/g, '') || '18000', 10);
        return sum + (isNaN(val) ? 18000 : val);
      }, 0);

    const activeAdsCount = ads.filter((a) => a.isActive).length;
    const suspendedAdsCount = ads.filter((a) => a.paymentStatus === 'overdue' || (!a.isActive && a.paymentStatus !== 'pending')).length;
    const paidTransactionsCount = payments.filter((p) => p.status === 'paid').length;

    return {
      totalEncaise,
      totalEnAttente,
      totalImpayes,
      activeAdsCount,
      suspendedAdsCount,
      paidTransactionsCount,
    };
  }, [ads, payments]);

  // =========================================================================
  // AUTOMATED ALERTS & SMART RELANCES LOGIC
  // =========================================================================
  const alerts = useMemo(() => {
    return detectAdAlerts(ads);
  }, [ads]);

  const overdueAlerts = useMemo(() => alerts.filter((a) => a.type === 'overdue'), [alerts]);
  const dueSoonAlerts = useMemo(() => alerts.filter((a) => a.type === 'due_soon'), [alerts]);
  const expiringSoonAlerts = useMemo(() => alerts.filter((a) => a.type === 'expiring_soon'), [alerts]);

  const filteredAlerts = useMemo(() => {
    if (activeAlertFilter === 'overdue') return overdueAlerts;
    if (activeAlertFilter === 'due_soon') return dueSoonAlerts;
    if (activeAlertFilter === 'expiring_soon') return expiringSoonAlerts;
    return alerts;
  }, [alerts, activeAlertFilter, overdueAlerts, dueSoonAlerts, expiringSoonAlerts]);

  // Template generator for Relances
  const generateRelanceText = (
    ad: Advertisement,
    tone: 'auto' | 'courtois' | 'ferme' | 'art7' | 'renouvellement',
    lang: 'fr' | 'ar',
    alertItem?: AdAlertItem | null
  ): string => {
    const contact = ad.advertiserContactPerson || (lang === 'ar' ? 'المسؤول المحترم' : 'Monsieur/Madame le Gérant');
    const brand = lang === 'ar' ? ad.brandNameAr || ad.brandName : ad.brandName;
    const fee = ad.monthlyFee || '18 000 DZD';
    const dueDate = ad.paymentDueDate || 'prévue';
    const endDate = ad.endDate || 'fin de contrat';
    const daysDiff = alertItem ? alertItem.daysDiff : 3;

    if (tone === 'art7') {
      if (lang === 'ar') {
        return `🚨 *إشعار رسمي بتوقيف البث الإعلاني (المادة 7 من العقد)*\n\nمرحباً ${contact}،\n\nنحيطكم علماً بأنه تم تطبيق المادة 7 من العقد الإعلاني المبرم مع منصة *نصف دينك* نظراً لعدم تسوية مستحقات الحملة الإعلانية لـ *"${brand}"* (المبلغ: ${fee}).\n\n⛔ تم توقيف ظهور الإعلان بشكل فوري على التطبيق.\n\n⚡ *طريقة إعادة التفعيل المباشر :*\nيرجى إرسال وصل التحويل (بريدي موب / CCP) ليتم استئناف البث فوراً وإصدار الوصل الرسمي المعتمد.\n\n_الإدارة العامة لمنصة نصف دينك الجزائر_ 🇩🇿`;
      }
      return `🚨 *NOTIFICATION OFFICIELLE DE SUSPENSION - ARTICLE 7*\n\nBonjour ${contact},\n\nNous vous notifions par la présente de l'application immédiate de l'Article 7 de la convention publicitaire NISFY suite au défaut de règlement de votre campagne *"${brand}"* (Montant : ${fee}).\n\n⛔ La diffusion de votre publicité a été interrompue en direct sur l'ensemble du réseau NISFY.\n\n⚡ *Procédure de réactivation immédiate :*\nTransmettez-nous votre justificatif de virement (BaridiMob / CCP) pour une remise en ligne instantanée.\n\n_Direction Générale NISFY Algérie_ 🇩🇿`;
    }

    if (tone === 'ferme' || (tone === 'auto' && alertItem?.type === 'overdue')) {
      if (lang === 'ar') {
        return `🚨 *تذكير عاجل وإشعار بتأخر السداد - نصف دينك*\n\nمرحباً ${contact}،\n\nنلفت انتباهكم إلى وجود تأخر في سداد مستحقات الحملة الإعلانية الخاصة بـ *"${brand}"* لمدة ${daysDiff} يوم(أيام).\n\n📅 *تاريخ الاستحقاق :* ${dueDate}\n💰 *المبلغ المستحق :* ${fee}\n\n📌 *تنبيه قانوني (المادة 7 من العقد) :*\nلتفادي توقيف الإعلان الفوري، نرجو تسوية المبلغ وإرسال وصل التحويل عبر بريدي موب أو الحساب البريدي.\n\nشكراً لتعاونكم - *إدارة تطبيق نصف دينك الجزائر* 🇩🇿`;
      }
      return `🚨 *RAPPEL URGENT & RETARD DE PAIEMENT NISFY*\n\nBonjour ${contact},\n\nNous constatons à ce jour un retard de règlement de ${daysDiff} jour(s) concernant la campagne publicitaire *"${brand}"* sur la plateforme NISFY Algérie.\n\n📅 *Échéance initiale :* ${dueDate}\n💰 *Montant en attente :* ${fee}\n\n📌 *Rappel réglementaire (Article 7 de la convention) :*\nTout défaut de règlement entraîne la suspension immédiate et sans préavis de la visibilité sur nos applications.\n\n💳 *Moyens de règlement disponibles :*\n- BaridiMob / CCP\n- Virement Bancaire CIB\n- Règlement Espèces sur reçu\n\nMerci de nous transmettre votre reçu ou capture de transaction afin de maintenir votre diffusion active.\n\n_Direction Financière & Partenariats NISFY Algérie_ 🇩🇿`;
    }

    if (tone === 'renouvellement' || (tone === 'auto' && alertItem?.type === 'expiring_soon')) {
      if (lang === 'ar') {
        return `🌟 *عرض تجديد عقد الشراكة الإعلانية - نصف دينك*\n\nمرحباً ${contact}،\n\nينتهي عقد الحملة الإعلانية لـ *"${brand}"* بتاريخ *${endDate}* (المتبقي: ${daysDiff} أيام).\n\n💎 للحفاظ على مكانتكم المميزة وعروضكم الحصرية للمقبلين على الزواج، نقترح عليكم تجديد الاشتراك للفترة القادمة مع تخفيض الشريك الوفي.\n\nيسعدنا تواصلكم لتأكيد التجديد!\n_إدارة الشراكات - نصف دينك الجزائر_ 🇩🇿`;
      }
      return `🌟 *PROPOSITION DE RENOUVELLEMENT DE CONTRAT NISFY*\n\nBonjour ${contact},\n\nVotre contrat de diffusion publicitaire pour *"${brand}"* arrive à son terme le *${endDate}* (dans ${daysDiff} jour(s)).\n\n📊 Votre campagne a généré un fort intérêt auprès de la communauté des futurs mariés à travers l'Algérie.\n\n💎 Afin de conserver votre emplacement premium et vos avantages partenaires, nous vous invitons à reconduire votre contrat pour la prochaine période avec un tarif fidélité.\n\nSouhaitez-vous renouveler dès maintenant ? Nous préparons votre nouvel avenant avec grand plaisir !\n\nBien cordialement,\n_Direction Commerciale NISFY Algérie_ 🇩🇿`;
    }

    // Courtois / Due soon default
    if (lang === 'ar') {
      return `📅 *تذكير بموعد استحقاق الدفع - تطبيق نصف دينك*\n\nمرحباً ${contact}،\n\nنود تذكيركم باقتراب موعد سداد مستحقات إعلانكم *"${brand}"* بتاريخ *${dueDate}* (المتبقي: ${daysDiff} أيام - المبلغ: ${fee}).\n\n⚡ يمكنكم إرسال التحويل مسبقاً لضمان استمرار ظهور إعلانكم بدون انقطاع.\n\nمع فائق الاحترام والتقدير - *نصف دينك الجزائر* 🇩🇿`;
    }
    return `📅 *RAPPEL D'ÉCHÉANCE DE PAIEMENT NISFY*\n\nBonjour ${contact},\n\nNous vous informons que l'échéance de règlement de votre pack publicitaire *"${brand}"* arrive à son terme le *${dueDate}* (dans ${daysDiff} jour(s)).\n\n💰 *Montant :* ${fee}\n\n⚡ Vous pouvez anticiper votre règlement par BaridiMob ou CCP afin de garantir une visibilité continue et sans interruption auprès des futurs mariés.\n\nÀ réception de votre justificatif, votre quittance officielle certifiée vous sera immédiatement délivrée.\n\nBien cordialement,\n_L'équipe NISFY Algérie_ 🇩🇿`;
  };

  // Open Relance Modal from an alert
  const handleOpenRelanceModal = (
    alertItem: AdAlertItem,
    forcedTone: 'auto' | 'courtois' | 'ferme' | 'art7' | 'renouvellement' = 'auto'
  ) => {
    setSelectedAlertForRelance(alertItem);
    setRelanceLang('fr');
    setRelanceTone(forcedTone);
    setCopiedRelance(false);
    const initialText = generateRelanceText(alertItem.ad, forcedTone, 'fr', alertItem);
    setRelanceCustomMessage(initialText);
  };

  // Open Relance Modal directly from an ad (outside alert list)
  const handleOpenRelanceFromAd = (ad: Advertisement) => {
    const existingAlert = alerts.find((a) => a.adId === ad.id);
    if (existingAlert) {
      handleOpenRelanceModal(existingAlert);
      return;
    }

    // Create synthetic alert
    const synthAlert: AdAlertItem = {
      id: `alert-manual-${ad.id}`,
      adId: ad.id,
      ad,
      type: ad.paymentStatus === 'overdue' ? 'overdue' : 'due_soon',
      severity: ad.paymentStatus === 'overdue' ? 'critical' : 'info',
      title: `Relance Annonceur - ${ad.brandName}`,
      titleAr: `مراسلة الشريك - ${ad.brandNameAr || ad.brandName}`,
      badgeLabel: ad.paymentStatus === 'overdue' ? 'Retard' : 'Rappel',
      badgeLabelAr: 'تذكير',
      description: `Rappel de paiement pour ${ad.brandName}.`,
      targetDate: ad.paymentDueDate || 'Échéance',
      daysDiff: 3,
      amountFormatted: ad.monthlyFee || '18 000 DZD',
      recommendedAction: 'Envoyer une relance par message.',
      suggestedWhatsAppFr: '',
      suggestedWhatsAppAr: '',
    };
    handleOpenRelanceModal(synthAlert);
  };

  // Switch tone in Relance Modal
  const handleChangeRelanceTone = (newTone: 'auto' | 'courtois' | 'ferme' | 'art7' | 'renouvellement') => {
    if (!selectedAlertForRelance) return;
    setRelanceTone(newTone);
    const updatedMsg = generateRelanceText(
      selectedAlertForRelance.ad,
      newTone,
      relanceLang,
      selectedAlertForRelance
    );
    setRelanceCustomMessage(updatedMsg);
  };

  // Switch language in Relance Modal
  const handleChangeRelanceLang = (newLang: 'fr' | 'ar') => {
    if (!selectedAlertForRelance) return;
    setRelanceLang(newLang);
    const updatedMsg = generateRelanceText(
      selectedAlertForRelance.ad,
      relanceTone,
      newLang,
      selectedAlertForRelance
    );
    setRelanceCustomMessage(updatedMsg);
  };

  // Copy Relance message to clipboard
  const handleCopyRelanceText = () => {
    navigator.clipboard.writeText(relanceCustomMessage);
    setCopiedRelance(true);
    showToast('📋 Message de relance copié dans le presse-papier !');
    setTimeout(() => setCopiedRelance(false), 2500);
  };

  // Send Relance message directly via WhatsApp
  const handleSendCustomWhatsAppRelance = () => {
    if (!selectedAlertForRelance) return;
    const phone =
      selectedAlertForRelance.ad.whatsapp?.replace(/\D/g, '') ||
      selectedAlertForRelance.ad.phone.replace(/\D/g, '');
    const encoded = encodeURIComponent(relanceCustomMessage);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    showToast(`📲 Message WhatsApp transmis vers ${selectedAlertForRelance.ad.brandName} !`);
  };

  // =========================================================================
  // ACTIONS: SUSPENSION (ARTICLE 7) & REACTIVATION ON PROOF
  // =========================================================================

  // 1. Trigger Suspension Modal for an Ad
  const handleOpenSuspensionModal = (ad: Advertisement) => {
    setSuspensionModalAd(ad);
  };

  // 2. Execute Immediate Suspension for Overdue (Article 7)
  const handleConfirmSuspension = (ad: Advertisement) => {
    const all = getManagedAdvertisements();
    const updated = all.map((item) => {
      if (item.id === ad.id) {
        return {
          ...item,
          isActive: false, // CUT OFF LIVE BROADCAST IMMEDIATELY
          paymentStatus: 'overdue' as PaymentStatus,
          internalNotes:
            (item.internalNotes || '') +
            `\n[${new Date().toLocaleString('fr-FR')}] 🚨 SUSPENSION IMMÉDIATE DE LA DIFFUSION (Application stricte de l'Article 7 pour retard/défaut de paiement).`,
        };
      }
      return item;
    });

    saveManagedAdvertisements(updated);
    reloadData();
    setSuspensionModalAd(null);
    showToast(`🚨 Publicité "${ad.brandName}" SUSPENDUE IMMÉDIATEMENT (Article 7). Diffusion arrêtée.`);
  };

  // 3. Trigger Reactivation Modal on Proof Submission
  const handleOpenReactivateModal = (ad: Advertisement) => {
    const defaultAmount = parseInt(ad.monthlyFee?.replace(/\D/g, '') || '18000', 10) || 18000;
    setProofForm({
      paymentMethod: 'baridimob',
      transactionReference: `VIR-BARIDI-${Date.now().toString().slice(-6)}`,
      amount: defaultAmount,
      proofDate: new Date().toISOString().split('T')[0],
      proofNotes: `Justificatif de règlement transmis pour remise en ligne immédiate de ${ad.brandName}.`,
      proofFileName: `recu_paiement_${ad.brandName.toLowerCase().replace(/\s+/g, '_')}.jpg`,
    });
    setReactivateModalAd(ad);
  };

  // 4. Confirm Proof & Immediately Reactivate Ad (En Ligne)
  const handleConfirmProofAndReactivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reactivateModalAd) return;

    const ad = reactivateModalAd;
    const amountVal = proofForm.amount || 18000;
    const receiptNum = generateNextReceiptNumber(payments);

    const methodLabels: Record<PaymentMethodType, string> = {
      baridimob: 'BaridiMob (Algérie Poste)',
      ccp: 'Virement CCP / Mandat',
      virement_bancaire: 'Virement Bancaire CIB',
      cib_dahabia: 'Carte CIB / Edahabia',
      especes: 'Espèces contre Reçu Officiel',
      sepa_international: 'Virement SEPA (Diaspora)',
      cheque: 'Chèque Bancaire Certifié',
    };

    // A. Generate and save Official NISFY Receipt
    const newPayment: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNum,
      adId: ad.id,
      brandName: ad.brandName,
      brandNameAr: ad.brandNameAr,
      contactPerson: ad.advertiserContactPerson || 'Gérant',
      phone: ad.phone,
      email: ad.advertiserEmail,
      city: ad.wilayas?.[0] || 'Alger',
      amount: amountVal,
      currency: 'DZD',
      amountInWordsFr: numberToWordsFr(amountVal),
      amountInWordsAr: numberToWordsAr(amountVal),
      planLabel: ad.subscriptionPlanLabel || 'Abonnement Annonceur',
      planDuration: ad.subscriptionPlan || '1_mois',
      paymentMethod: proofForm.paymentMethod,
      paymentMethodLabel: methodLabels[proofForm.paymentMethod],
      transactionReference: proofForm.transactionReference || `TR-${Date.now().toString().slice(-6)}`,
      paymentDate: proofForm.proofDate,
      periodCovered: `${proofForm.proofDate} au ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
      status: 'paid',
      isInstallment: false,
      receivedByAdmin: 'Direction Financière NISFY (Validation Justificatif)',
      officialReceiptIssued: true,
      notes: proofForm.proofNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedPayments = [newPayment, ...payments];
    saveManagedPayments(updatedPayments);

    // B. Reactivate Ad and Set Paid
    const all = getManagedAdvertisements();
    const updated = all.map((item) => {
      if (item.id === ad.id) {
        return {
          ...item,
          isActive: true, // PUT BACK LIVE ON NISFY IMMEDIATELY
          paymentStatus: 'paid' as PaymentStatus,
          lastPaymentDate: proofForm.proofDate,
          internalNotes:
            (item.internalNotes || '') +
            `\n[${new Date().toLocaleString('fr-FR')}] 🟢 RÉACTIVATION EN DIRECT : Justificatif validé (${proofForm.transactionReference}, ${amountVal.toLocaleString('fr-FR')} DZD). Quittance N° ${receiptNum} émise.`,
        };
      }
      return item;
    });

    saveManagedAdvertisements(updated);
    reloadData();
    setReactivateModalAd(null);
    showToast(`🟢 Publicité "${ad.brandName}" RÉACTIVÉE avec succès ! La diffusion est à nouveau en direct.`);

    // Open Quittance Modal
    setReceiptModalPayment(newPayment);
  };

  // WhatsApp Suspension Notice Generator
  const handleSendSuspensionWhatsApp = (ad: Advertisement) => {
    const text = encodeURIComponent(
      `🚨 NOTIFICATION OFFICIELLE DE SUSPENSION PUBLICITAIRE (Article 7)\n\n` +
      `Bonjour M./Mme ${ad.advertiserContactPerson || ad.brandName},\n\n` +
      `Nous vous informons que conformément à l'Article 7 de la convention d'affichage publicitaire signée avec NISFY Algérie, la diffusion de votre campagne "${ad.brandName}" a été TEMPORAIREMENT SUSPENDUE pour défaut de règlement du montant convenu (${ad.monthlyFee || '18 000 DZD'}).\n\n` +
      `⚡ Pour réactiver votre visibilité en direct sans délai :\n` +
      `Veuillez nous transmettre votre justificatif de virement BaridiMob / CCP / Reçu.\n` +
      `Dès réception de la preuve de paiement, la diffusion sera remise en ligne instantanément avec émission de votre quittance officielle.\n\n` +
      `Direction Financière & Commerciale NISFY Algérie 🇩🇿`
    );
    window.open(`https://wa.me/${ad.whatsapp?.replace(/\D/g, '') || ad.phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  // WhatsApp Reactivation Confirmation
  const handleSendReactivationWhatsApp = (ad: Advertisement, receiptNumber: string) => {
    const text = encodeURIComponent(
      `🟢 CONFIRMATION DE RÈGLEMENT & RÉACTIVATION IMMÉDIATE\n\n` +
      `Bonjour ${ad.advertiserContactPerson || ad.brandName},\n\n` +
      `Nous accusons bonne réception de votre justificatif de paiement.\n` +
      `Votre campagne publicitaire "${ad.brandName}" a été RÉACTIVÉE EN DIRECT sur l'application NISFY Algérie !\n\n` +
      `📄 Quittance Officielle Émise : N° ${receiptNumber}\n` +
      `Merci pour votre confiance et excellent partenariat.\n\n` +
      `L'équipe NISFY Algérie 🇩🇿`
    );
    window.open(`https://wa.me/${ad.whatsapp?.replace(/\D/g, '') || ad.phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  // =========================================================================
  // STANDARD STEP ACTIONS (CREATE, SIGN, LAUNCH)
  // =========================================================================

  // 1. Create New Demand (Step 1)
  const handleCreateDemand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDemandForm.brandName.trim() || !newDemandForm.phone.trim()) {
      alert('Veuillez renseigner le nom de la marque et le numéro de téléphone.');
      return;
    }

    const newId = `ad-${Date.now()}`;
    const planLabels: Record<SubscriptionPlan, string> = {
      '1_mois': 'Pack Mensuel Essentiel (1 Mois)',
      '3_mois': 'Pack Trimestriel Visibilité (3 Mois)',
      '6_mois': 'Pack Semestriel Premium (6 Mois)',
      '1_an': 'Pack Annuel Partenaire Officiel (12 Mois)',
      'partenaire_officiel': 'Pack Sponsor VIP Exclusif',
    };

    const categoryLabels: Record<Advertisement['category'], { fr: string; ar: string }> = {
      venue: { fr: 'Salles des Fêtes & Domaines', ar: 'قاعات الحفلات والفنادق' },
      fashion: { fr: 'Robes de Mariée & Caftans', ar: 'فساتين الزفاف والأزياء' },
      travel: { fr: 'Voyages de Noces & Omra', ar: 'رحلات شهر العسل والعمرة' },
      photo: { fr: 'Photographie & Vidéo 4K', ar: 'تصوير احترافي وفيديو 4K' },
      catering: { fr: 'Traiteur & Pâtisserie Fine', ar: 'إطعام وحلويات الأعراس' },
      jewelry: { fr: 'Bijouterie & Joaillerie', ar: 'مجوهرات وحلي العروس' },
    };

    const amountNum = parseInt(newDemandForm.customAmount, 10) || 18000;

    const newAd: Advertisement = {
      id: newId,
      brandName: newDemandForm.brandName,
      brandNameAr: newDemandForm.brandNameAr || newDemandForm.brandName,
      category: newDemandForm.category,
      categoryLabel: categoryLabels[newDemandForm.category].fr,
      categoryLabelAr: categoryLabels[newDemandForm.category].ar,
      tagline: newDemandForm.tagline || `Prestataire recommandé à ${newDemandForm.wilaya}`,
      taglineAr: 'خدمات متميزة للأعراس والمناسبات',
      description: newDemandForm.description || 'Prestations de haute qualité pour les futurs mariés.',
      descriptionAr: 'خدمات راقية واستثنائية للمقبلين على الزواج.',
      // Themed Music Audio Soundtrack
      musicThemeId: newDemandForm.musicThemeId,
      musicThemeTitle: getTrackById(newDemandForm.musicThemeId)?.title || 'Zorna & Percussions Algériennes',
      musicThemeGenre: getTrackById(newDemandForm.musicThemeId)?.genreLabel || 'Traditionnel',
      bannerImage: newDemandForm.bannerImage,
      logoImage: newDemandForm.logoImage,
      galleryImages: newDemandForm.galleryImages,
      promoCode: newDemandForm.promoCode,
      discountBadge: newDemandForm.discountBadge,
      discountBadgeAr: 'عرض خاص',
      wilayas: [newDemandForm.wilaya],
      phone: newDemandForm.phone,
      whatsapp: newDemandForm.whatsapp || newDemandForm.phone.replace(/\s+/g, ''),
      rating: 5.0,
      reviewsCount: 1,
      featured: true,
      priceStartingFrom: `${amountNum.toLocaleString('fr-FR')} DZD`,
      features: ['Partenaire vérifié NISFY', 'Accès direct WhatsApp', 'Offre spéciale mariage'],
      featuresAr: ['شريك موثق لدى نصف دينك', 'تواصل مباشر عبر الواتساب', 'عرض خاص للأعراس'],
      isActive: false, // Inactive until contract signed & payment confirmed
      advertiserContactPerson: newDemandForm.contactPerson || 'Gérant',
      advertiserEmail: 'contact@partenaire-dz.com',
      subscriptionPlan: newDemandForm.plan,
      subscriptionPlanLabel: planLabels[newDemandForm.plan],
      monthlyFee: `${amountNum.toLocaleString('fr-FR')} DZD`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentDueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentStatus: 'pending',
      address: newDemandForm.address || newDemandForm.wilaya,
      websiteUrl: newDemandForm.websiteUrl || '',
    };

    addNewAdvertisement(newAd);
    // Automatically generate draft contract
    const draftContract = createDraftContractFromAd(newAd);
    addOrUpdateContract(draftContract);

    reloadData();
    setSelectedAdId(newId);
    setIsNewDemandModalOpen(false);
    showToast(`Demande "${newAd.brandName}" enregistrée avec succès !`);

    // Jump directly to step 2 (Drafting Contract)
    setActiveStep('step2_contrat');
  };

  // 2. Sign and Verify Contract (Step 2)
  const handleSignContract = () => {
    if (!currentContract || !currentAd) return;

    const updatedArticles: ContractArticle[] = currentContract.articles.map((art) => ({
      ...art,
      isVerified: true,
    }));

    const updatedContract: NisfyContract = {
      ...currentContract,
      articles: updatedArticles,
      allArticlesVerified: true,
      providerSigned: true,
      providerSignDate: new Date().toISOString().split('T')[0],
      clientSigned: true,
      clientSignDate: new Date().toISOString().split('T')[0],
      officialSealApplied: true,
      status: 'signed_active',
      verifiedAt: new Date().toISOString(),
      verifiedByAdminName: 'Direction Générale NISFY',
      updatedAt: new Date().toISOString(),
    };

    addOrUpdateContract(updatedContract);
    reloadData();
    showToast(`Contrat N° ${updatedContract.contractNumber} (11 Articles) signé & validé avec succès !`);

    // Prepare step 3 payment form
    const feeNum = parseInt(currentAd.monthlyFee?.replace(/\D/g, '') || '18000', 10);
    setPaymentForm((prev) => ({
      ...prev,
      amount: isNaN(feeNum) ? 18000 : feeNum,
      transactionReference: `VIR-${Date.now().toString().slice(-6)}`,
    }));

    // Move to step 3
    setActiveStep('step3_paiement_lancement');
  };

  // 3. Confirm Payment and Launch Ad (Step 3)
  const handleConfirmPaymentAndLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAd) return;

    const receiptNum = generateNextReceiptNumber(payments);
    const amountVal = paymentForm.amount || 18000;

    const methodLabels: Record<PaymentMethodType, string> = {
      baridimob: 'BaridiMob (Algérie Poste)',
      ccp: 'Virement CCP / Mandat',
      virement_bancaire: 'Virement Bancaire CIB',
      cib_dahabia: 'Carte CIB / Edahabia',
      especes: 'Espèces contre Reçu Officiel',
      sepa_international: 'Virement SEPA (Diaspora)',
      cheque: 'Chèque Bancaire Certifié',
    };

    // 1. Create Official Payment Transaction
    const newPayment: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNum,
      adId: currentAd.id,
      brandName: currentAd.brandName,
      brandNameAr: currentAd.brandNameAr,
      contactPerson: currentAd.advertiserContactPerson || 'Gérant',
      phone: currentAd.phone,
      email: currentAd.advertiserEmail,
      city: currentAd.wilayas?.[0] || 'Alger',
      amount: amountVal,
      currency: 'DZD',
      amountInWordsFr: numberToWordsFr(amountVal),
      amountInWordsAr: numberToWordsAr(amountVal),
      planLabel: currentAd.subscriptionPlanLabel || 'Abonnement Annonceur',
      planDuration: currentAd.subscriptionPlan || '1_mois',
      paymentMethod: paymentForm.paymentMethod,
      paymentMethodLabel: methodLabels[paymentForm.paymentMethod],
      transactionReference: paymentForm.transactionReference || `TR-${Date.now().toString().slice(-6)}`,
      paymentDate: paymentForm.paymentDate,
      periodCovered: `${paymentForm.paymentDate} au ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
      status: 'paid',
      isInstallment: false,
      receivedByAdmin: 'Direction Financière NISFY',
      officialReceiptIssued: true,
      notes: paymentForm.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedPayments = [newPayment, ...payments];
    saveManagedPayments(updatedPayments);

    // 2. Update Ad status to PAID and ACTIVATE (Launch pub on the app)
    const all = getManagedAdvertisements();
    const updated = all.map((a) => {
      if (a.id === currentAd.id) {
        return {
          ...a,
          isActive: true, // LAUNCH THE PUB
          paymentStatus: 'paid' as PaymentStatus,
          lastPaymentDate: paymentForm.paymentDate,
          internalNotes: (a.internalNotes || '') + `\n[${paymentForm.paymentDate}] Activé et diffusé suite au paiement initial. Quittance N° ${receiptNum}.`,
        };
      }
      return a;
    });

    saveManagedAdvertisements(updated);
    reloadData();
    showToast(`Paiement de ${amountVal.toLocaleString('fr-FR')} DZD enregistré et Publicité LANCÉE EN DIRECT !`);

    // Show receipt modal
    setReceiptModalPayment(newPayment);
  };

  // WhatsApp Generic Reminder
  const handleWhatsAppReminder = (ad: Advertisement) => {
    const text = encodeURIComponent(
      `Bonjour ${ad.advertiserContactPerson || ad.brandName},\n\n` +
      `C'est l'administration NISFY Algérie concernant votre campagne publicitaire "${ad.brandName}".\n` +
      `Nous vous contactons pour faire le point sur le contrat et le règlement de votre pack (${ad.monthlyFee || 'Abonnement'}).\n\n` +
      `Lien de paiement BaridiMob / CCP disponible. Merci de nous transmettre le justificatif dès que possible.\n` +
      `Bien cordialement,\nL'équipe NISFY Algérie 🇩🇿`
    );
    window.open(`https://wa.me/${ad.whatsapp?.replace(/\D/g, '') || ad.phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#FF3823] animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#38BDF8] shrink-0" />
          <p className="text-sm font-bold">{successToast}</p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4-STEP WORKFLOW STEPPER BAR + WORKFLOW 4.0 AUTONOME                       */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-2 w-full">
            {/* Step 1 */}
            <button
              onClick={() => setActiveStep('step1_reception')}
              className={`p-3 rounded-2xl text-left transition-all flex items-center gap-2.5 cursor-pointer border ${
                activeStep === 'step1_reception'
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white border-transparent font-black shadow-md scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                activeStep === 'step1_reception' ? 'bg-white text-[#FF3823]' : 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
              }`}>
                1
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider font-extrabold truncate">Étape 1</p>
                <p className="text-xs font-bold truncate">Demandes ({ads.length})</p>
              </div>
            </button>

            {/* Step 2 */}
            <button
              onClick={() => setActiveStep('step2_contrat')}
              className={`p-3 rounded-2xl text-left transition-all flex items-center gap-2.5 cursor-pointer border ${
                activeStep === 'step2_contrat'
                  ? 'bg-[#38BDF8] text-white border-sky-400 font-black shadow-md scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                activeStep === 'step2_contrat' ? 'bg-white text-sky-700' : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
              }`}>
                2
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider font-extrabold truncate">Étape 2</p>
                <p className="text-xs font-bold truncate">Contrat (11 Art.)</p>
              </div>
            </button>

            {/* Step 3 */}
            <button
              onClick={() => setActiveStep('step3_paiement_lancement')}
              className={`p-3 rounded-2xl text-left transition-all flex items-center gap-2.5 cursor-pointer border ${
                activeStep === 'step3_paiement_lancement'
                  ? 'bg-emerald-600 text-white border-emerald-500 font-black shadow-md scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                activeStep === 'step3_paiement_lancement' ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                3
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider font-extrabold truncate">Étape 3</p>
                <p className="text-xs font-bold truncate">Paiement & Live</p>
              </div>
            </button>

            {/* Step 4 */}
            <button
              onClick={() => setActiveStep('step4_suivi')}
              className={`p-3 rounded-2xl text-left transition-all flex items-center justify-between gap-1.5 cursor-pointer border ${
                activeStep === 'step4_suivi'
                  ? 'bg-purple-600 text-white border-purple-500 font-black shadow-md scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                  activeStep === 'step4_suivi' ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                }`}>
                  4
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold truncate">Étape 4</p>
                  <p className="text-xs font-bold truncate">Suivi & Art. 7</p>
                </div>
              </div>

              {alerts.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black shrink-0 flex items-center gap-0.5 ${
                  overdueAlerts.length > 0
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-amber-400 text-slate-950'
                }`}>
                  <BellRing className="w-2.5 h-2.5" />
                  {alerts.length}
                </span>
              )}
            </button>

            {/* Step 5: WORKFLOW 4.0 AUTONOME */}
            <button
              onClick={() => setActiveStep('step_autonomous_40')}
              className={`p-3 rounded-2xl text-left transition-all flex items-center justify-between gap-1.5 cursor-pointer border col-span-2 md:col-span-4 xl:col-span-1 ${
                activeStep === 'step_autonomous_40'
                  ? 'bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white border-indigo-500 font-black shadow-xl scale-[1.02]'
                  : 'bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-slate-800 dark:to-indigo-950/40 text-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800/60 hover:border-indigo-400'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                  activeStep === 'step_autonomous_40' ? 'bg-indigo-500 text-white animate-pulse' : 'bg-indigo-600 text-white'
                }`}>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-[10px] uppercase tracking-wider font-black text-indigo-500 dark:text-indigo-400 truncate">Mode 4.0</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <p className="text-xs font-black truncate">Autonome & IA</p>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[9px] shrink-0">
                AUTO
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🚨 BANNIÈRE D'ALERTES AUTOMATIQUES & RELANCES SMART                        */}
      {/* ========================================================================= */}
      {alerts.length > 0 && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-rose-500/40 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black shadow-lg shadow-rose-900/50 animate-pulse">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                    <span>🚨 Système d'Alertes & Relances Intelligentes</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 border border-rose-400/40 text-rose-300 text-[11px] font-black">
                    {alerts.length} dossier(s) à traiter
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Détection automatique des impayés, échéances proches et contrats à renouveler avec messages WhatsApp pré-rédigés.
                </p>
              </div>
            </div>

            {/* Quick Stat Tags & Toggle */}
            <div className="flex items-center gap-2 flex-wrap">
              {overdueAlerts.length > 0 && (
                <button
                  onClick={() => {
                    setActiveStep('step4_suivi');
                    setActiveAlertFilter('overdue');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>{overdueAlerts.length} Impayé(s)</span>
                </button>
              )}

              {dueSoonAlerts.length > 0 && (
                <button
                  onClick={() => {
                    setActiveStep('step4_suivi');
                    setActiveAlertFilter('due_soon');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/90 hover:bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{dueSoonAlerts.length} Échéance(s) &lt; 7j</span>
                </button>
              )}

              {expiringSoonAlerts.length > 0 && (
                <button
                  onClick={() => {
                    setActiveStep('step4_suivi');
                    setActiveAlertFilter('expiring_soon');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{expiringSoonAlerts.length} Renouvellement(s)</span>
                </button>
              )}

              <button
                onClick={() => setIsAlertsBannerExpanded(!isAlertsBannerExpanded)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1 transition-all cursor-pointer ml-auto"
              >
                <span>{isAlertsBannerExpanded ? 'Masquer la liste' : 'Voir les détails'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAlertsBannerExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick List Preview */}
          {isAlertsBannerExpanded && (
            <div className="pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in duration-200">
              {alerts.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                    item.type === 'overdue'
                      ? 'bg-rose-950/40 border-rose-800/80 text-rose-100'
                      : item.type === 'due_soon'
                      ? 'bg-amber-950/40 border-amber-800/80 text-amber-100'
                      : 'bg-indigo-950/40 border-indigo-800/80 text-indigo-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.ad.logoImage}
                      alt={item.ad.brandName}
                      className="w-9 h-9 rounded-xl object-cover border border-white/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black truncate">{item.ad.brandName}</p>
                        <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-black ${
                          item.type === 'overdue' ? 'bg-rose-600 text-white' : item.type === 'due_soon' ? 'bg-amber-400 text-slate-950' : 'bg-indigo-600 text-white'
                        }`}>
                          {item.badgeLabel}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 truncate">
                        {item.type === 'overdue' ? `🚨 +${item.daysDiff}j de retard` : item.type === 'due_soon' ? `⚠️ Échéance J-${item.daysDiff}` : `📅 Fin contrat J-${item.daysDiff}`} • {item.amountFormatted}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenRelanceModal(item)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black shrink-0 flex items-center gap-1 transition-all cursor-pointer hover:scale-105"
                  >
                    <Send className="w-3 h-3 text-emerald-400" />
                    <span>Relancer</span>
                  </button>
                </div>
              ))}

              {alerts.length > 3 && (
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
                  <span>+{alerts.length - 3} autre(s) alerte(s) en attente</span>
                  <button
                    onClick={() => {
                      setActiveStep('step4_suivi');
                      setActiveAlertFilter('all');
                    }}
                    className="text-amber-400 font-bold hover:underline cursor-pointer"
                  >
                    Voir tout dans l'Étape 4 →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ÉTAPE 1 : RÉCEPTION DE LA DEMANDE                                         */}
      {/* ========================================================================= */}
      {activeStep === 'step1_reception' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header & New Demand Button */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-black">
                  Étape 1 sur 4
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                  📥 Réception & Gestion des Demandes d'Annonceurs
                </h2>
              </div>
              <p className="text-sm font-medium text-slate-900/90 mt-1">
                Enregistrez les nouvelles demandes des prestataires (nom, coordonnées, pack, visuels) et pilotez leur statut de diffusion en direct.
              </p>
            </div>

            <button
              onClick={() => setIsNewDemandModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-slate-950 text-amber-400 hover:bg-slate-900 font-black text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer whitespace-nowrap hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>+ Enregistrer une Nouvelle Demande</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une marque, contact, tél..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  statusFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Toutes ({ads.length})
              </button>
              <button
                onClick={() => setStatusFilter('new')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  statusFilter === 'new'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                }`}
              >
                Nouvelles ({ads.filter((a) => a.paymentStatus === 'pending' && !a.isActive).length})
              </button>
              <button
                onClick={() => setStatusFilter('paid_online')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  statusFilter === 'paid_online'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                🟢 En Ligne ({ads.filter((a) => a.isActive && a.paymentStatus === 'paid').length})
              </button>
              <button
                onClick={() => setStatusFilter('overdue')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  statusFilter === 'overdue'
                    ? 'bg-rose-600 text-white font-black'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                }`}
              >
                🚨 Suspendues / Impayés ({ads.filter((a) => a.paymentStatus === 'overdue' || (!a.isActive && a.paymentStatus !== 'pending')).length})
              </button>
            </div>
          </div>

          {/* List of Demands */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAds.map((ad) => {
              const contract = contracts.find((c) => c.targetEntityId === ad.id);
              const isContractSigned = contract && contract.status === 'signed_active';
              const isPaid = ad.paymentStatus === 'paid';
              const isOnline = ad.isActive;
              const isSuspended = ad.paymentStatus === 'overdue' || (!ad.isActive && isContractSigned);

              return (
                <div
                  key={ad.id}
                  className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                    isSuspended
                      ? 'border-rose-300 dark:border-rose-900 bg-rose-50/20 dark:bg-rose-950/10'
                      : ad.id === selectedAdId
                      ? 'border-amber-500 ring-2 ring-amber-400/30'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    {/* Banner & Logo */}
                    <div className="relative h-28 rounded-2xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                      <img
                        src={ad.bannerImage}
                        alt={ad.brandName}
                        className={`w-full h-full object-cover ${isSuspended ? 'grayscale contrast-125' : ''}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                      
                      {isSuspended && (
                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center gap-1 shadow-md">
                          <AlertOctagon className="w-3 h-3" />
                          <span>DIFFUSION SUSPENDUE</span>
                        </div>
                      )}

                      <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
                        <img
                          src={ad.logoImage}
                          alt={ad.brandName}
                          className="w-8 h-8 rounded-lg object-cover border border-white/40 shadow-xs"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-white truncate">{ad.brandName}</p>
                          <p className="text-[10px] text-amber-300 font-bold">{ad.categoryLabel}</p>
                        </div>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          Wilaya :
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {ad.wilayas?.[0] || 'Toutes'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          Contact :
                        </span>
                        <span className="font-bold">{ad.phone}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5" />
                          Pack & Tarif :
                        </span>
                        <span className="font-black text-amber-600 dark:text-amber-400">
                          {ad.monthlyFee || '18 000 DZD'}
                        </span>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1 flex-wrap text-[11px]">
                      <span className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                        isContractSigned
                          ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        <FileCheck className="w-3 h-3" />
                        {isContractSigned ? 'Contrat Signé' : 'Contrat à Rédiger'}
                      </span>

                      <span className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                        isOnline
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : isSuspended
                          ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : isPaid
                          ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}>
                        {isOnline ? '🟢 En Ligne' : isSuspended ? '🔴 Suspendue (Art. 7)' : isPaid ? '💳 Payé' : '⏳ En Attente'}
                      </span>
                    </div>

                    {/* Active Alert Highlight if any */}
                    {(() => {
                      const itemAlert = alerts.find((a) => a.adId === ad.id);
                      if (!itemAlert) return null;
                      return (
                        <div className={`mt-3 p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                          itemAlert.type === 'overdue'
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                            : itemAlert.type === 'due_soon'
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                            : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200'
                        }`}>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <BellRing className="w-3.5 h-3.5 shrink-0 animate-bounce" />
                            <span className="font-bold truncate text-[11px]">
                              {itemAlert.type === 'overdue' ? `Retard ${itemAlert.daysDiff}j` : itemAlert.type === 'due_soon' ? `Échéance J-${itemAlert.daysDiff}` : `Fin J-${itemAlert.daysDiff}`}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenRelanceModal(itemAlert)}
                            className="px-2 py-0.5 rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-[10px] shrink-0 cursor-pointer hover:scale-105"
                          >
                            Relancer
                          </button>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 space-y-2">
                    {/* Primary Step Transition or Reactivation Button */}
                    {isSuspended ? (
                      <button
                        onClick={() => handleOpenReactivateModal(ad)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                      >
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>📥 Justificatif & Réactiver Direct →</span>
                      </button>
                    ) : isOnline ? (
                      <button
                        onClick={() => handleOpenSuspensionModal(ad)}
                        className="w-full py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <AlertOctagon className="w-4 h-4 text-rose-600" />
                        <span>🚨 Suspendre pour Impayé (Art. 7)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedAdId(ad.id);
                          setActiveStep('step2_contrat');
                        }}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>✍️ Rédiger le Contrat (11 Articles) →</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleWhatsAppReminder(ad)}
                        className="flex-1 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </button>

                      {onViewPublicAd && (
                        <button
                          onClick={() => onViewPublicAd(ad.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                          title="Aperçu public de la fiche"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ÉTAPE 2 : RÉDACTION DU CONTRAT (11 ARTICLES)                              */}
      {/* ========================================================================= */}
      {activeStep === 'step2_contrat' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/20 text-indigo-100 text-xs font-black">
                  Étape 2 sur 4
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  📜 Convention d'Affichage Publicitaire (11 Articles Légaux)
                </h2>
              </div>
              <p className="text-sm font-medium text-indigo-100 mt-1">
                Contrat officiel pré-rempli automatiquement avec les clauses obligatoires (Français & Arabe).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer / Exporter PDF</span>
              </button>
            </div>
          </div>

          {/* Advertiser Selector for Contract */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 shrink-0">Annonceur sélectionné :</span>
              <select
                value={selectedAdId}
                onChange={(e) => setSelectedAdId(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-full sm:w-80"
              >
                {ads.map((ad) => (
                  <option key={ad.id} value={ad.id}>
                    {ad.brandName} • {ad.monthlyFee || '18 000 DZD'}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setContractLang('bilingual')}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                  contractLang === 'bilingual' ? 'bg-white dark:bg-slate-700 shadow-xs text-indigo-600' : 'text-slate-500'
                }`}
              >
                Bilingue (FR / AR)
              </button>
              <button
                onClick={() => setContractLang('fr')}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                  contractLang === 'fr' ? 'bg-white dark:bg-slate-700 shadow-xs text-indigo-600' : 'text-slate-500'
                }`}
              >
                Français
              </button>
              <button
                onClick={() => setContractLang('ar')}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                  contractLang === 'ar' ? 'bg-white dark:bg-slate-700 shadow-xs text-indigo-600' : 'text-slate-500'
                }`}
              >
                العربية
              </button>
            </div>
          </div>

          {/* Contract Document Card */}
          {currentContract && currentAd && (
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200 space-y-8 max-w-4xl mx-auto">
              {/* Document Header */}
              <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-400 font-mono text-xs font-black">
                      N° {currentContract.contractNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Émis le {currentContract.dateIssued}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 mt-2">
                    CONVENTION D'AFFICHAGE & PARTENARIAT PUBLICITAIRE
                  </h1>
                  <p className="text-sm font-bold text-slate-600" dir="rtl">
                    اتفاقية إشهار وشراكة إعلانية رسمية
                  </p>
                </div>

                <div className="text-right">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-md ml-auto">
                    N
                  </div>
                  <p className="text-xs font-black text-slate-900 mt-1">NISFY ALGERIA</p>
                  <p className="text-[10px] text-slate-500">Plateforme Officielle du Mariage</p>
                </div>
              </div>

              {/* Parties identification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="space-y-1">
                  <p className="font-extrabold text-indigo-700 uppercase tracking-wider">PREMIER PARTENAIRE (NISFY) :</p>
                  <p className="font-black text-slate-900">NISFY WEDDING SERVICES ALGERIA</p>
                  <p className="text-slate-600">Représentée par : La Direction Commerciale & Technique</p>
                  <p className="text-slate-600">Alger, Algérie • Contact : contact@nisfy.app</p>
                </div>

                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                  <p className="font-extrabold text-amber-600 uppercase tracking-wider">SECOND PARTENAIRE (L'ANNONCEUR) :</p>
                  <p className="font-black text-slate-900">{currentAd.brandName} {currentAd.brandNameAr ? `(${currentAd.brandNameAr})` : ''}</p>
                  <p className="text-slate-600">Gérant / Responsable : <span className="font-bold">{currentAd.advertiserContactPerson || 'Direction'}</span></p>
                  <p className="text-slate-600">Téléphone / WhatsApp : <span className="font-bold">{currentAd.phone}</span></p>
                  <p className="text-slate-600">Wilaya : <span className="font-bold">{currentAd.wilayas?.[0] || '16 - Alger'}</span></p>
                </div>
              </div>

              {/* 11 Mandatory Articles */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b pb-2">
                  Clauses & Articles Contractuels Réglementaires (11 Articles Obligatoires)
                </h3>

                <div className="space-y-3">
                  {(currentContract?.articles || STANDARD_CONTRACT_ARTICLES).map((article) => (
                    <div
                      key={article.articleNumber}
                      className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-indigo-900">
                          {article.titleFr}
                        </span>
                        <span className="text-[11px] font-bold text-amber-700" dir="rtl">
                          {article.titleAr}
                        </span>
                      </div>

                      {(contractLang === 'bilingual' || contractLang === 'fr') && (
                        <p className="text-slate-700 leading-relaxed">
                          {article.contentFr}
                        </p>
                      )}

                      {(contractLang === 'bilingual' || contractLang === 'ar') && (
                        <p className="text-slate-700 leading-relaxed font-arabic" dir="rtl">
                          {article.contentAr}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Signatures and Official Seals */}
              <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
                {/* NISFY Signature */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2 relative overflow-hidden">
                  <p className="font-black text-slate-900 uppercase">Pour la Direction de NISFY Algérie</p>
                  <p className="text-[11px] text-slate-500">Signature Électronique Certifiée & Cachet</p>
                  
                  <div className="h-16 flex items-center justify-center">
                    <div className="border-2 border-emerald-600 rounded-xl px-4 py-1 text-emerald-700 font-mono font-black text-xs rotate-[-3deg] shadow-xs">
                      ✓ NISFY OFFICIAL SEAL • VALIDÉ
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Signé numériquement le {currentContract.providerSignDate || currentContract.dateIssued}
                  </p>
                </div>

                {/* Advertiser Signature */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2 relative">
                  <p className="font-black text-slate-900 uppercase">Pour l'Annonceur ({currentAd.brandName})</p>
                  <p className="text-[11px] text-slate-500">M./Mme {currentAd.advertiserContactPerson || 'Le Gérant'}</p>

                  <div className="h-16 flex items-center justify-center">
                    {currentContract.clientSigned ? (
                      <div className="border-2 border-indigo-600 rounded-xl px-4 py-1 text-indigo-700 font-mono font-black text-xs rotate-[2deg] shadow-xs">
                        ✓ BON POUR ACCORD & DIFFUSION
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Signature & Mention « Lu et approuvé »</span>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400">
                    {currentContract.clientSigned ? `Signé le ${currentContract.clientSignDate || currentContract.dateIssued}` : 'À parapher'}
                  </p>
                </div>
              </div>

              {/* Bottom Next Step Bar */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                <button
                  onClick={() => setActiveStep('step1_reception')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Retour aux Demandes</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSignContract}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                  >
                    <Stamp className="w-4 h-4" />
                    <span>Valider & Signer le Contrat</span>
                  </button>

                  <button
                    onClick={() => {
                      handleSignContract();
                      setActiveStep('step3_paiement_lancement');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 transition-all shadow-md cursor-pointer hover:scale-105"
                  >
                    <span>Passer au Paiement & Lancement →</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ÉTAPE 3 : PAIEMENT ET LANCEMENT DE LA PUB                                  */}
      {/* ========================================================================= */}
      {activeStep === 'step3_paiement_lancement' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-black">
                  Étape 3 sur 4
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  💳 Validation du Paiement & Lancement de la Pub
                </h2>
              </div>
              <p className="text-sm font-medium text-emerald-100 mt-1">
                Enregistrez le règlement (BaridiMob, CCP, CIB ou Espèces), éditez la quittance officielle et activez la diffusion de la publicité en direct.
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Diffusion immédiate dès validation</span>
            </div>
          </div>

          {/* Advertiser Selector */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 shrink-0">Annonceur concerné :</span>
              <select
                value={selectedAdId}
                onChange={(e) => setSelectedAdId(e.target.value)}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 w-full sm:w-80"
              >
                {ads.map((ad) => (
                  <option key={ad.id} value={ad.id}>
                    {ad.brandName} • {ad.monthlyFee || 'Tarif'} ({ad.isActive ? '🟢 En Ligne' : ad.paymentStatus === 'overdue' ? '🔴 Suspendue' : '⏳ En attente'})
                  </option>
                ))}
              </select>
            </div>

            {currentAd && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Statut actuel :</span>
                <span className={`px-2.5 py-1 rounded-full font-bold ${
                  currentAd.isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : currentAd.paymentStatus === 'overdue'
                    ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}>
                  {currentAd.isActive ? '🟢 En Ligne' : currentAd.paymentStatus === 'overdue' ? '🔴 Suspendue (Art. 7)' : '⏳ Inactive (En attente)'}
                </span>
              </div>
            )}
          </div>

          {/* Payment & Launch Form */}
          {currentAd && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Col */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>Enregistrer le Règlement & Émettre la Quittance</span>
                </h3>

                <form onSubmit={handleConfirmPaymentAndLaunch} className="space-y-4">
                  {/* Amount and Currency */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Montant à encaisser (DZD) *
                      </label>
                      <input
                        type="number"
                        value={paymentForm.amount}
                        onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseInt(e.target.value, 10) || 0 })}
                        className="w-full px-3.5 py-2.5 text-sm font-black rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Date du paiement *
                      </label>
                      <input
                        type="date"
                        value={paymentForm.paymentDate}
                        onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                      Moyen de règlement utilisé *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'baridimob', label: 'BaridiMob', icon: '📱' },
                        { id: 'ccp', label: 'CCP Poste', icon: '📮' },
                        { id: 'virement_bancaire', label: 'Virement CIB', icon: '🏦' },
                        { id: 'especes', label: 'Espèces', icon: '💵' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentForm({ ...paymentForm, paymentMethod: m.id as PaymentMethodType })}
                          className={`p-3 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                            paymentForm.paymentMethod === m.id
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-base">{m.icon}</span>
                          <span>{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Transaction Reference */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Numéro de Transaction / Référence Mandat *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: VIR-BARIDI-883921 ou N° Reçu"
                      value={paymentForm.transactionReference}
                      onChange={(e) => setPaymentForm({ ...paymentForm, transactionReference: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  {/* Submit and Launch Pub */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                    >
                      <Sparkles className="w-5 h-5 text-amber-300" />
                      <span>🚀 Valider le Paiement & LANCER LA PUB EN DIRECT</span>
                    </button>
                    <p className="text-center text-[11px] text-slate-500 mt-2">
                      Génère la quittance officielle et rend l'annonce immédiatement visible sur l'application Nisfy.
                    </p>
                  </div>
                </form>
              </div>

              {/* Preview Card of the Ad */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-600" />
                    <span>Aperçu de l'Annonce qui sera Diffusée</span>
                  </h3>

                  {/* Mini Preview Box */}
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <div className="relative h-32">
                      <img
                        src={currentAd.bannerImage}
                        alt={currentAd.brandName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
                        <img
                          src={currentAd.logoImage}
                          alt={currentAd.brandName}
                          className="w-9 h-9 rounded-xl object-cover border border-white/60 shadow-md"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-white truncate">{currentAd.brandName}</p>
                          <p className="text-[10px] text-amber-300 font-bold">{currentAd.categoryLabel}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-2 text-xs">
                      <p className="text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                        "{currentAd.tagline}"
                      </p>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Wilaya : {currentAd.wilayas?.[0] || '16 - Alger'}</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400">
                          {currentAd.discountBadge}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Switch to Step 4 */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setActiveStep('step4_suivi')}
                    className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Consulter le Suivi des Paiements & Trésorerie →</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ÉTAPE 4 : SUIVI DES PAIEMENTS, SUSPENSION (ART. 7) & RÉACTIVATION           */}
      {/* ========================================================================= */}
      {activeStep === 'step4_suivi' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/20 text-purple-100 text-xs font-black">
                  Étape 4 sur 4
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  📊 Suivi des Paiements, Trésorerie & Suspensions (Article 7)
                </h2>
              </div>
              <p className="text-sm font-medium text-purple-100 mt-1">
                Visualisez les encaissements, suspendez immédiatement les publicités pour impayé et réactivez instantanément la diffusion dès réception du justificatif.
              </p>
            </div>

            <button
              onClick={() => setActiveStep('step1_reception')}
              className="px-4 py-2.5 rounded-2xl bg-white text-purple-900 hover:bg-purple-50 font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nouvelle Demande</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 🧪 BANC D'ESSAI & SIMULATION EN DIRECT : SUSPENSION & RÉACTIVATION         */}
          {/* ========================================================================= */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-800/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <span>🧪 Banc d'Essai & Simulation : Suspension Immédiate (Art. 7) & Réactivation</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-bold border border-indigo-400/30">
                      Test 1-Clic
                    </span>
                  </h3>
                  <p className="text-xs text-indigo-200/80">
                    Testez le cycle complet de gestion des contentieux en temps réel sur n'importe quel annonceur.
                  </p>
                </div>
              </div>

              {/* Selector */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400 shrink-0">Campagne à tester :</span>
                <select
                  value={selectedAdId}
                  onChange={(e) => setSelectedAdId(e.target.value)}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 border border-indigo-700 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400 w-full sm:w-64"
                >
                  {ads.map((ad) => (
                    <option key={ad.id} value={ad.id}>
                      {ad.brandName} • {ad.isActive ? '🟢 En Ligne' : '🔴 Suspendue/Inactive'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Test Simulation Controls */}
            {currentAd && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
                  <img
                    src={currentAd.logoImage}
                    alt={currentAd.brandName}
                    className="w-12 h-12 rounded-xl object-cover border border-white/20"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">{currentAd.brandName}</p>
                    <p className="text-[10px] text-slate-400">{currentAd.monthlyFee || '18 000 DZD'}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        currentAd.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500 animate-ping'
                      }`} />
                      <span className={`text-[11px] font-black ${
                        currentAd.isActive ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {currentAd.isActive ? '🟢 DIFFUSION EN DIRECT' : '🔴 DIFFUSION SUSPENDUE (IMPAYÉ)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2 Test Action Buttons */}
                <div className="md:col-span-8 flex flex-col sm:flex-row items-center gap-3">
                  {/* Button 1: Suspend for Overdue */}
                  <button
                    onClick={() => handleOpenSuspensionModal(currentAd)}
                    disabled={!currentAd.isActive}
                    className={`flex-1 w-full py-3.5 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                      currentAd.isActive
                        ? 'bg-rose-600 hover:bg-rose-700 text-white hover:scale-[1.02]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <AlertOctagon className="w-4 h-4 text-white" />
                    <span>🚨 1. Suspendre Immédiatement (Impayé Art. 7)</span>
                  </button>

                  {/* Button 2: Provide Proof & Reactivate */}
                  <button
                    onClick={() => handleOpenReactivateModal(currentAd)}
                    className="flex-1 w-full py-3.5 px-4 rounded-2xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-slate-950" />
                    <span>📥 2. Valider Justificatif & Réactiver Direct</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Total Encaissé */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total Encaissé</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                {stats.totalEncaise.toLocaleString('fr-FR')} DZD
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {stats.paidTransactionsCount} quittances émises
              </p>
            </div>

            {/* Total En Attente */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">En Attente Règlement</span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
                {stats.totalEnAttente.toLocaleString('fr-FR')} DZD
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Contrats en cours</p>
            </div>

            {/* Total Impayés */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Pubs Suspendues (Impayés)</span>
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                  <AlertOctagon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
                {stats.suspendedAdsCount} Pub(s)
              </p>
              <p className="text-[11px] text-rose-500 font-bold mt-1">Arrêtées selon l'Art. 7</p>
            </div>

            {/* Annonces Actives */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Campagnes en Ligne</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                  <Play className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
                {stats.activeAdsCount} Pubs
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Diffusées sur les 69 Wilayas</p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 🚨 CENTRE DE PILOTAGE DES ALERTES & RELANCES AUTOMATIQUES                  */}
          {/* ========================================================================= */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-rose-600" />
                  <span>🚨 Centre des Alertes Automatiques & Relances Multi-Canaux ({alerts.length})</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Surveillance en temps réel des impayés, des échéances à 7 jours et des fins de contrats avec relances WhatsApp prêtes à l'envoi.
                </p>
              </div>

              {/* Alert Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setActiveAlertFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeAlertFilter === 'all'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Toutes ({alerts.length})
                </button>
                <button
                  onClick={() => setActiveAlertFilter('overdue')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeAlertFilter === 'overdue'
                      ? 'bg-rose-600 text-white font-black'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Impayés & Retards ({overdueAlerts.length})</span>
                </button>
                <button
                  onClick={() => setActiveAlertFilter('due_soon')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeAlertFilter === 'due_soon'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Échéance &lt; 7j ({dueSoonAlerts.length})</span>
                </button>
                <button
                  onClick={() => setActiveAlertFilter('expiring_soon')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeAlertFilter === 'expiring_soon'
                      ? 'bg-indigo-600 text-white font-black'
                      : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fin Contrat &lt; 15j ({expiringSoonAlerts.length})</span>
                </button>
              </div>
            </div>

            {/* Alert Cards Grid */}
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Aucune alerte active dans cette catégorie !
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Tous les règlements et contrats sont à jour selon les critères sélectionnés.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAlerts.map((alertItem) => {
                  const isOverdue = alertItem.type === 'overdue';
                  const isDueSoon = alertItem.type === 'due_soon';
                  const isExpiring = alertItem.type === 'expiring_soon';
                  const isAdActive = alertItem.ad.isActive;

                  return (
                    <div
                      key={alertItem.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isOverdue
                          ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                          : isDueSoon
                          ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                          : 'bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60'
                      }`}
                    >
                      <div>
                        {/* Card Header with Logo, Brand & Urgency Badge */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={alertItem.ad.logoImage}
                              alt={alertItem.ad.brandName}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                                {alertItem.ad.brandName}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {alertItem.ad.advertiserContactPerson || 'Gérant'} • {alertItem.ad.phone}
                              </p>
                            </div>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-xs font-black shrink-0 flex items-center gap-1 ${
                            isOverdue
                              ? 'bg-rose-600 text-white animate-pulse shadow-xs'
                              : isDueSoon
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-indigo-600 text-white'
                          }`}>
                            {isOverdue && <AlertOctagon className="w-3.5 h-3.5" />}
                            {isDueSoon && <Clock className="w-3.5 h-3.5" />}
                            {isExpiring && <Sparkles className="w-3.5 h-3.5" />}
                            <span>{alertItem.badgeLabel}</span>
                          </span>
                        </div>

                        {/* Details grid */}
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Diagnostic :</span>
                            <span className={`font-black ${
                              isOverdue ? 'text-rose-600 dark:text-rose-400' : isDueSoon ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'
                            }`}>
                              {isOverdue
                                ? `🚨 Retard de +${alertItem.daysDiff} jour(s)`
                                : isDueSoon
                                ? `⚠️ Échéance dans ${alertItem.daysDiff} jour(s)`
                                : `📅 Fin de contrat dans ${alertItem.daysDiff} jour(s)`}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Date Cible :</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {alertItem.targetDate}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Montant / Pack :</span>
                            <span className="font-black text-amber-600 dark:text-amber-400">
                              {alertItem.amountFormatted}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500">Statut Diffusion :</span>
                            <span className={`font-bold ${isAdActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {isAdActive ? '🟢 En direct sur l\'app' : '🔴 Diffusion suspendue'}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400 italic mt-2">
                          💡 {alertItem.recommendedAction}
                        </p>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2 flex-wrap">
                        {/* Button 1: Smart Relance Modal */}
                        <button
                          onClick={() => handleOpenRelanceModal(alertItem)}
                          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer hover:scale-102"
                        >
                          <Send className="w-3.5 h-3.5 text-amber-300" />
                          <span>Relancer WhatsApp</span>
                        </button>

                        {/* Button 2: Quick Proof & Payment */}
                        <button
                          onClick={() => handleOpenReactivateModal(alertItem.ad)}
                          className="py-2 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 font-black text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                          title="Enregistrer le reçu de paiement"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Régulariser</span>
                        </button>

                        {/* Button 3: Suspend (Art. 7) if Active and Overdue */}
                        {isOverdue && isAdActive && (
                          <button
                            onClick={() => handleOpenSuspensionModal(alertItem.ad)}
                            className="py-2 px-2.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-200 border border-rose-300 dark:border-rose-800 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                            title="Suspendre immédiatement la diffusion (Article 7)"
                          >
                            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                            <span>Suspendre (Art. 7)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Transactions Table & Receipts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-4 h-4 text-purple-600" />
                <span>Registre des Quittances & Règlements Encaissés ({payments.length})</span>
              </h3>

              <button
                type="button"
                onClick={() => setIsRecordPaymentModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Enregistrer un Paiement Manuel</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">N° Quittance</th>
                    <th className="pb-3">Annonceur</th>
                    <th className="pb-3">Montant Encaissé</th>
                    <th className="pb-3">Moyen & Réf</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Statut Diffusion</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payments.map((p) => {
                    const linkedAd = ads.find((a) => a.id === p.adId);
                    const isAdOnline = linkedAd?.isActive;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-black text-purple-600 dark:text-purple-400">
                          {p.receiptNumber}
                        </td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">
                          <div>{p.brandName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{p.phone}</div>
                        </td>
                        <td className="py-3 font-black text-emerald-600 dark:text-emerald-400">
                          {p.amount.toLocaleString('fr-FR')} {p.currency}
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-300">
                          <div className="font-bold">{p.paymentMethodLabel}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{p.transactionReference}</div>
                        </td>
                        <td className="py-3 text-slate-500 font-medium">{p.paymentDate}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isAdOnline
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          }`}>
                            {isAdOnline ? '🟢 En Ligne' : '🔴 Suspendue'}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => setReceiptModalPayment(p)}
                            className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Quittance PDF</span>
                          </button>

                          {linkedAd && (
                            <button
                              onClick={() => handleWhatsAppReminder(linkedAd)}
                              className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                              title="Envoyer message WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ÉTAPE 5 : WORKFLOW 4.0 AUTONOME (SMART CONTRACTS & IA)                    */}
      {/* ========================================================================= */}
      {activeStep === 'step_autonomous_40' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <AutonomousWorkflow40
            ads={ads}
            onViewPublicAd={onViewPublicAd}
            onRefreshAds={reloadData}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL : SUSPENSION IMMÉDIATE POUR IMPAYÉ (ARTICLE 7)                      */}
      {/* ========================================================================= */}
      {suspensionModalAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-rose-300 dark:border-rose-900 overflow-hidden space-y-5">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-white" />
                <div>
                  <h3 className="text-base font-black text-white">
                    🚨 Suspension Immédiate de Diffusion (Article 7)
                  </h3>
                  <p className="text-xs text-rose-100">
                    Application stricte de la clause de défaut de règlement
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSuspensionModalAd(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-sm">
                  <span>Annonceur : {suspensionModalAd.brandName}</span>
                </div>
                <p className="leading-relaxed">
                  Conformément à l'<strong>Article 7</strong> de la convention NISFY : <em>« En cas de retard de règlement excédant 48 heures, NISFY se réserve le droit d'interrompre sans préavis la diffusion de l'encart publicitaire jusqu'à régularisation intégrale. »</em>
                </p>
              </div>

              <div className="space-y-1 text-slate-600 dark:text-slate-300">
                <p>• <strong>Impact immédiat :</strong> La publicité sera retirée instantanément des espaces d'affichage publics de l'application.</p>
                <p>• <strong>Réactivation :</strong> Dès réception du justificatif de virement, la publicité pourra être remise en ligne en 1 clic.</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSuspensionModalAd(null)}
                  className="w-full sm:w-auto flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Annuler
                </button>

                <button
                  type="button"
                  onClick={() => handleSendSuspensionWhatsApp(suspensionModalAd)}
                  className="w-full sm:w-auto py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 font-bold flex items-center justify-center gap-1 cursor-pointer"
                  title="Préparer le message WhatsApp de suspension"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notifier WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirmSuspension(suspensionModalAd)}
                  className="w-full sm:w-auto flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>Confirmer Suspension</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL : RÉCEPTION DU JUSTIFICATIF & RÉACTIVATION IMMÉDIATE                */}
      {/* ========================================================================= */}
      {reactivateModalAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-emerald-300 dark:border-emerald-900 overflow-hidden my-6">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="text-base font-black text-white">
                    📥 Réception Justificatif & Réactivation Immédiate
                  </h3>
                  <p className="text-xs text-emerald-100">
                    Validation du règlement et remise en ligne en direct
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReactivateModalAd(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmProofAndReactivate} className="p-6 space-y-4 text-xs">
              {/* Advertiser Info Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm">{reactivateModalAd.brandName}</p>
                  <p className="text-[11px] text-slate-500">{reactivateModalAd.phone} • {reactivateModalAd.wilayas?.[0]}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-[10px]">
                  Régularisation
                </span>
              </div>

              {/* Amount and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Montant Justifié (DZD) *
                  </label>
                  <input
                    type="number"
                    value={proofForm.amount}
                    onChange={(e) => setProofForm({ ...proofForm, amount: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Date du Règlement *
                  </label>
                  <input
                    type="date"
                    value={proofForm.proofDate}
                    onChange={(e) => setProofForm({ ...proofForm, proofDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Moyen de paiement reçu *
                </label>
                <select
                  value={proofForm.paymentMethod}
                  onChange={(e) => setProofForm({ ...proofForm, paymentMethod: e.target.value as PaymentMethodType })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                >
                  <option value="baridimob">📱 BaridiMob (Algérie Poste)</option>
                  <option value="ccp">📮 Virement CCP / Mandat</option>
                  <option value="virement_bancaire">🏦 Virement Bancaire CIB</option>
                  <option value="especes">💵 Espèces contre Reçu</option>
                  <option value="cib_dahabia">💳 Carte Edahabia / CIB</option>
                </select>
              </div>

              {/* Transaction / Receipt Reference */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Référence du Justificatif (N° Virement / Reçu) *
                </label>
                <input
                  type="text"
                  placeholder="Ex: VIR-BARIDIMOB-99201"
                  value={proofForm.transactionReference}
                  onChange={(e) => setProofForm({ ...proofForm, transactionReference: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  required
                />
              </div>

              {/* Proof File Attachment Preview Simulation */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Justificatif / Bordereau Reçu (WhatsApp ou Reçu)
                </label>
                <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{proofForm.proofFileName}</p>
                      <p className="text-[10px] text-slate-400">Capture reçue • Vérifiée par NISFY</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Attaché ✓
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReactivateModalAd(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>⚡ Valider & Réactiver Immédiatement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL : NOUVELLE DEMANDE ANNONCEUR                                        */}
      {/* ========================================================================= */}
      {isNewDemandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-950">
                  📥 Réception d'une Nouvelle Demande Annonceur
                </h3>
                <p className="text-xs font-bold text-slate-900/80">
                  Saisie rapide des informations pour générer le contrat et préparer la diffusion.
                </p>
              </div>
              <button
                onClick={() => setIsNewDemandModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateDemand} className="p-6 space-y-4 text-xs">
              {/* Brand Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Nom de l'Établissement / Marque *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Palais des Lys Mariage"
                    value={newDemandForm.brandName}
                    onChange={(e) => setNewDemandForm({ ...newDemandForm, brandName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Nom en Arabe (Optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: قصر الزهور للأفراح"
                    dir="rtl"
                    value={newDemandForm.brandNameAr}
                    onChange={(e) => setNewDemandForm({ ...newDemandForm, brandNameAr: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Category & Wilaya */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Catégorie d'activité *
                  </label>
                  <select
                    value={newDemandForm.category}
                    onChange={(e) => setNewDemandForm({ ...newDemandForm, category: e.target.value as Advertisement['category'] })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="venue">🏰 Salles des Fêtes & Domaines</option>
                    <option value="fashion">👗 Robes de Mariée & Caftans</option>
                    <option value="travel">✈️ Voyages de Noces & Omra</option>
                    <option value="photo">📸 Photographie & Vidéo 4K</option>
                    <option value="catering">🍽️ Traiteur & Pâtisserie</option>
                    <option value="jewelry">💍 Bijouterie & Joaillerie</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Wilaya principale *
                  </label>
                  <select
                    value={newDemandForm.wilaya}
                    onChange={(e) => setNewDemandForm({ ...newDemandForm, wilaya: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="16 - Alger">16 - Alger</option>
                    <option value="31 - Oran">31 - Oran</option>
                    <option value="25 - Constantine">25 - Constantine</option>
                    <option value="09 - Blida">09 - Blida</option>
                    <option value="19 - Sétif">19 - Sétif</option>
                    <option value="15 - Tizi Ouzou">15 - Tizi Ouzou</option>
                    <option value="Toutes les Wilayas">Toutes les 69 Wilayas</option>
                  </select>
                </div>
              </div>

              {/* Contact Person & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Nom du Contact / Responsable
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: M. Karim Benali"
                    value={newDemandForm.contactPerson}
                    onChange={(e) => setNewDemandForm({ ...newDemandForm, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Numéro de Téléphone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: +213 550 12 34 56"
                    value={newDemandForm.phone}
                    onChange={(e) => setNewDemandForm({ ...newDemandForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>
              </div>

              {/* Pack & Custom Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Pack souscrit *
                  </label>
                  <select
                    value={newDemandForm.plan}
                    onChange={(e) => {
                      const p = e.target.value as SubscriptionPlan;
                      const defaults: Record<SubscriptionPlan, string> = {
                        '1_mois': '18000',
                        '3_mois': '45000',
                        '6_mois': '80000',
                        '1_an': '150000',
                        'partenaire_officiel': '250000',
                      };
                      setNewDemandForm({ ...newDemandForm, plan: p, customAmount: defaults[p] });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="1_mois">Pack Mensuel Essentiel (1 Mois)</option>
                    <option value="3_mois">Pack Trimestriel Visibilité (3 Mois)</option>
                    <option value="6_mois">Pack Semestriel Premium (6 Mois)</option>
                    <option value="1_an">Pack Annuel Partenaire Officiel (12 Mois)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Tarif convenu (DZD) *
                  </label>
                  <input
                    type="number"
                    value={newDemandForm.customAmount}
                    onChange={(e) => setNewDemandForm({ ...newDemandForm, customAmount: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black"
                    required
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Slogan d'accroche
                </label>
                <input
                  type="text"
                  placeholder="Ex: Le plus beau jour de votre vie dans un cadre féerique"
                  value={newDemandForm.tagline}
                  onChange={(e) => setNewDemandForm({ ...newDemandForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* 🎵 THÈME MUSICAL & AMBIANCE DU SPONSOR */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-300 dark:border-amber-700/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Music className="w-4 h-4 text-amber-500" />
                    <span>Ambiance Musicale Thématique de la PUB *</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Synthétiseur DZ intégré</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {NISFY_MUSIC_CATALOG.map((track) => {
                    const isSelected = newDemandForm.musicThemeId === track.id;
                    const isPlaying = previewPlayingTrackId === track.id;

                    return (
                      <div
                        key={track.id}
                        onClick={() => setNewDemandForm({ ...newDemandForm, musicThemeId: track.id })}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-400/40 text-slate-900 dark:text-white font-bold'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-300 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg">{track.icon}</span>
                          <div className="min-w-0">
                            <p className="font-bold text-xs truncate">{track.title}</p>
                            <p className="text-[10px] text-slate-500 truncate">{track.genreLabel}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isPlaying) {
                              musicAudioEngine.stop();
                              setPreviewPlayingTrackId(null);
                            } else {
                              musicAudioEngine.play(track);
                              setPreviewPlayingTrackId(track.id);
                            }
                          }}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                            isPlaying
                              ? 'bg-rose-500 text-white animate-pulse'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-amber-400 hover:text-slate-950'
                          }`}
                          title="Écouter un extrait"
                        >
                          {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewDemandModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Enregistrer et Passer au Contrat →</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {receiptModalPayment && (
        <PaymentReceiptModal
          payment={receiptModalPayment}
          onClose={() => setReceiptModalPayment(null)}
        />
      )}

      {/* Manual Record Payment Modal */}
      {isRecordPaymentModalOpen && (
        <RecordPaymentModal
          isOpen={isRecordPaymentModalOpen}
          onClose={() => setIsRecordPaymentModalOpen(false)}
          onSave={(paymentData) => {
            const saved = recordNewPayment(paymentData);
            setPayments(getManagedPayments());
            setAds(getManagedAdvertisements());
            setIsRecordPaymentModalOpen(false);
            setReceiptModalPayment(saved);
          }}
          ads={ads}
          allPayments={payments}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL : RELANCE INTELLIGENTE MULTI-CANAUX (WHATSAPP / APPEL / SMS)        */}
      {/* ========================================================================= */}
      {selectedAlertForRelance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
            {/* Modal Header */}
            <div className={`px-6 py-4 flex items-center justify-between text-white ${
              selectedAlertForRelance.type === 'overdue'
                ? 'bg-gradient-to-r from-rose-600 to-rose-700'
                : selectedAlertForRelance.type === 'due_soon'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700'
                : 'bg-gradient-to-r from-indigo-600 to-purple-700'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-black">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    📲 Centre de Relance Intelligente Annonceur
                  </h3>
                  <p className="text-xs text-white/90">
                    {selectedAlertForRelance.title} • {selectedAlertForRelance.badgeLabel}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAlertForRelance(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Advertiser Banner Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={selectedAlertForRelance.ad.logoImage}
                    alt={selectedAlertForRelance.ad.brandName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-600 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                      {selectedAlertForRelance.ad.brandName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      Contact : <span className="font-bold text-slate-700 dark:text-slate-300">{selectedAlertForRelance.ad.advertiserContactPerson || 'Gérant'}</span> • Tél : {selectedAlertForRelance.ad.phone}
                    </p>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                      {selectedAlertForRelance.amountFormatted} • {selectedAlertForRelance.targetDate}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black inline-block ${
                    selectedAlertForRelance.type === 'overdue'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      : selectedAlertForRelance.type === 'due_soon'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                  }`}>
                    {selectedAlertForRelance.badgeLabel}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {selectedAlertForRelance.ad.isActive ? '🟢 En direct sur l\'app' : '🔴 Suspendue'}
                  </p>
                </div>
              </div>

              {/* Tone & Language Selection Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider">
                    Modèle de message & Tonalité :
                  </label>
                  {/* Language Selector */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => handleChangeRelanceLang('fr')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        relanceLang === 'fr'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      🇫🇷 Français
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeRelanceLang('ar')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        relanceLang === 'ar'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      🇩🇿 العربية
                    </button>
                  </div>
                </div>

                {/* Tone Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleChangeRelanceTone('courtois')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      relanceTone === 'courtois'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 font-black shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-bold text-xs truncate">🕊️ Rappel Courtois</p>
                    <p className="text-[10px] opacity-80 truncate">Échéance J-3 / J-5</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChangeRelanceTone('ferme')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      relanceTone === 'ferme' || (relanceTone === 'auto' && selectedAlertForRelance.type === 'overdue')
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-900 dark:text-rose-200 font-black shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-bold text-xs truncate">⚠️ Relance Ferme</p>
                    <p className="text-[10px] opacity-80 truncate">Retard de règlement</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChangeRelanceTone('art7')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      relanceTone === 'art7'
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-200 font-black shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-bold text-xs truncate">🚨 Mise en Demeure</p>
                    <p className="text-[10px] opacity-80 truncate">Suspension Article 7</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChangeRelanceTone('renouvellement')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      relanceTone === 'renouvellement' || (relanceTone === 'auto' && selectedAlertForRelance.type === 'expiring_soon')
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 text-indigo-900 dark:text-indigo-200 font-black shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-bold text-xs truncate">🌟 Renouvellement</p>
                    <p className="text-[10px] opacity-80 truncate">Fin de contrat</p>
                  </button>
                </div>
              </div>

              {/* Message Live Editor Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Contenu du message (personnalisable avant envoi) :
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {relanceCustomMessage.length} caractères
                  </span>
                </div>
                <textarea
                  rows={8}
                  dir={relanceLang === 'ar' ? 'rtl' : 'ltr'}
                  value={relanceCustomMessage}
                  onChange={(e) => setRelanceCustomMessage(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-sans text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Action Buttons Bar */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={handleCopyRelanceText}
                    className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all flex-1 sm:flex-none"
                  >
                    {copiedRelance ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedRelance ? 'Copié !' : 'Copier texte'}</span>
                  </button>

                  {/* Call Button */}
                  <a
                    href={`tel:${selectedAlertForRelance.ad.phone}`}
                    className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all flex-1 sm:flex-none"
                  >
                    <Phone className="w-4 h-4 text-indigo-500" />
                    <span>Appeler</span>
                  </a>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {/* Direct Payment Action */}
                  <button
                    type="button"
                    onClick={() => {
                      const ad = selectedAlertForRelance.ad;
                      setSelectedAlertForRelance(null);
                      handleOpenReactivateModal(ad);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer hover:opacity-90 flex-1 sm:flex-none"
                  >
                    <Receipt className="w-4 h-4 text-amber-400 dark:text-amber-600" />
                    <span>⚡ Encaisser Règlement</span>
                  </button>

                  {/* Send via WhatsApp Main CTA */}
                  <button
                    type="button"
                    onClick={handleSendCustomWhatsAppRelance}
                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-all flex-1 sm:flex-none"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>📲 Envoyer sur WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
