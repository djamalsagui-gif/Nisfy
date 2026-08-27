import {
  PaymentTransaction,
  INITIAL_PAYMENT_TRANSACTIONS,
  PaymentRecordStatus,
  PaymentMethodType,
} from '../data/paymentsData';
import { getManagedAdvertisements, updateAdPayment, checkAdCompliance } from './adsManager';

const PAYMENTS_STORAGE_KEY = 'nisfy_managed_payments';

// 1. Get All Managed Payments
export function getManagedPayments(): PaymentTransaction[] {
  try {
    const data = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(
        PAYMENTS_STORAGE_KEY,
        JSON.stringify(INITIAL_PAYMENT_TRANSACTIONS)
      );
      return INITIAL_PAYMENT_TRANSACTIONS;
    }
    const parsed: PaymentTransaction[] = JSON.parse(data);

    // Ensure default demo items are present
    const storedIds = new Set(parsed.map((p) => p.id));
    const missingDefaults = INITIAL_PAYMENT_TRANSACTIONS.filter(
      (p) => !storedIds.has(p.id)
    );
    if (missingDefaults.length > 0) {
      const merged = [...parsed, ...missingDefaults];
      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading payments from storage:', error);
    return INITIAL_PAYMENT_TRANSACTIONS;
  }
}

// 2. Save Managed Payments
export function saveManagedPayments(payments: PaymentTransaction[]): void {
  try {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
    window.dispatchEvent(new Event('nisfy_payments_updated'));
  } catch (error) {
    console.error('Error saving payments to storage:', error);
  }
}

// 3. Generate Next Receipt Number
export function generateNextReceiptNumber(payments: PaymentTransaction[]): string {
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const count = payments.length + 1;
  const seq = String(count).padStart(2, '0');
  return `REC-${currentYear}-${currentMonth}${seq}`;
}

// 4. Convert Number to Words (Simple French & Arabic helper for receipts)
export function numberToWordsFr(num: number, currency: 'DZD' | 'EUR' = 'DZD'): string {
  if (num === 0) return currency === 'DZD' ? 'Zéro Dinar' : 'Zéro Euro';
  const currencyLabel = currency === 'DZD' ? 'Dinars Algériens' : 'Euros';

  // Format with thousand separators for human-friendly receipt display
  return `${num.toLocaleString('fr-FR')} ${currencyLabel}`;
}

export function numberToWordsAr(num: number, currency: 'DZD' | 'EUR' = 'DZD'): string {
  if (num === 0) return currency === 'DZD' ? 'صفر دينار' : 'صفر يورو';
  const currencyLabel = currency === 'DZD' ? 'دينار جزائري' : 'يورو';
  return `${num.toLocaleString('fr-FR')} ${currencyLabel}`;
}

// 5. Add a New Payment Transaction
export function recordNewPayment(
  paymentData: Omit<PaymentTransaction, 'id' | 'createdAt' | 'updatedAt'>,
  syncWithAd = true
): PaymentTransaction {
  const payments = getManagedPayments();
  const id = `pay-${Date.now()}`;
  const now = new Date().toISOString();

  const newPayment: PaymentTransaction = {
    ...paymentData,
    id,
    createdAt: now,
    updatedAt: now,
  };

  const updatedPayments = [newPayment, ...payments];
  saveManagedPayments(updatedPayments);

  // Sync with advertisement status if requested
  if (syncWithAd && newPayment.adId) {
    const statusForAd = newPayment.status === 'paid' ? 'paid' : newPayment.status === 'overdue' ? 'overdue' : 'pending';
    updateAdPayment(newPayment.adId, statusForAd, newPayment.dueDate, true);
  }

  return newPayment;
}

// 6. Update Existing Payment Transaction
export function updatePaymentTransaction(
  id: string,
  updates: Partial<PaymentTransaction>,
  syncWithAd = true
): void {
  const payments = getManagedPayments();
  const now = new Date().toISOString();

  let targetAdId: string | undefined;
  let targetStatus: PaymentRecordStatus | undefined;
  let targetDueDate: string | undefined;

  const updatedPayments = payments.map((p) => {
    if (p.id === id) {
      const merged = { ...p, ...updates, updatedAt: now };
      targetAdId = merged.adId;
      targetStatus = merged.status;
      targetDueDate = merged.dueDate;
      return merged;
    }
    return p;
  });

  saveManagedPayments(updatedPayments);

  if (syncWithAd && targetAdId && targetStatus) {
    const statusForAd = targetStatus === 'paid' ? 'paid' : targetStatus === 'overdue' ? 'overdue' : 'pending';
    updateAdPayment(targetAdId, statusForAd, targetDueDate, true);
  }
}

// 7. Validate & Mark as Paid (Instant approval with quittance issue)
export function validateAndConfirmPayment(
  paymentId: string,
  adminName = 'Direction Financière NISFY'
): void {
  const payments = getManagedPayments();
  const now = new Date().toISOString();
  const today = now.split('T')[0];

  let targetAdId: string | undefined;
  let nextDueDate: string | undefined;

  const updated = payments.map((p) => {
    if (p.id === paymentId) {
      targetAdId = p.adId;
      nextDueDate = p.dueDate;
      return {
        ...p,
        status: 'paid' as PaymentRecordStatus,
        officialReceiptIssued: true,
        receivedByAdmin: adminName,
        paymentDate: today,
        updatedAt: now,
        notes: (p.notes || '') + `\n[${today}] Règlement validé et quittance émise par ${adminName}.`,
      };
    }
    return p;
  });

  saveManagedPayments(updated);

  if (targetAdId) {
    updateAdPayment(targetAdId, 'paid', nextDueDate, true);
  }
}

// 8. Delete Payment Transaction
export function deletePaymentTransaction(paymentId: string): void {
  const payments = getManagedPayments();
  const filtered = payments.filter((p) => p.id !== paymentId);
  saveManagedPayments(filtered);
}

// 9. Calculate Financial Summary Statistics
export interface FinancialStats {
  totalPaidDZD: number;
  totalPaidEUR: number;
  totalPendingDZD: number;
  totalPendingEUR: number;
  totalOverdueDZD: number;
  totalOverdueEUR: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
  totalCount: number;
  collectionRate: number; // percentage
  byMethod: Record<PaymentMethodType, { count: number; totalDZD: number; totalEUR: number }>;
}

export function calculateFinancialStats(payments: PaymentTransaction[]): FinancialStats {
  let totalPaidDZD = 0;
  let totalPaidEUR = 0;
  let totalPendingDZD = 0;
  let totalPendingEUR = 0;
  let totalOverdueDZD = 0;
  let totalOverdueEUR = 0;

  let paidCount = 0;
  let pendingCount = 0;
  let overdueCount = 0;

  const byMethod: Record<PaymentMethodType, { count: number; totalDZD: number; totalEUR: number }> = {
    baridimob: { count: 0, totalDZD: 0, totalEUR: 0 },
    virement_bancaire: { count: 0, totalDZD: 0, totalEUR: 0 },
    ccp: { count: 0, totalDZD: 0, totalEUR: 0 },
    especes: { count: 0, totalDZD: 0, totalEUR: 0 },
    cib_dahabia: { count: 0, totalDZD: 0, totalEUR: 0 },
    sepa_international: { count: 0, totalDZD: 0, totalEUR: 0 },
    cheque: { count: 0, totalDZD: 0, totalEUR: 0 },
  };

  payments.forEach((p) => {
    const isDZD = p.currency === 'DZD';
    const amount = Number(p.amount) || 0;

    if (byMethod[p.paymentMethod]) {
      byMethod[p.paymentMethod].count += 1;
      if (isDZD) byMethod[p.paymentMethod].totalDZD += amount;
      else byMethod[p.paymentMethod].totalEUR += amount;
    }

    if (p.status === 'paid') {
      paidCount += 1;
      if (isDZD) totalPaidDZD += amount;
      else totalPaidEUR += amount;
    } else if (p.status === 'pending') {
      pendingCount += 1;
      if (isDZD) totalPendingDZD += amount;
      else totalPendingEUR += amount;
    } else if (p.status === 'overdue') {
      overdueCount += 1;
      if (isDZD) totalOverdueDZD += amount;
      else totalOverdueEUR += amount;
    }
  });

  const totalInvoicedDZD = totalPaidDZD + totalPendingDZD + totalOverdueDZD;
  const collectionRate = totalInvoicedDZD > 0 ? Math.round((totalPaidDZD / totalInvoicedDZD) * 100) : 100;

  return {
    totalPaidDZD,
    totalPaidEUR,
    totalPendingDZD,
    totalPendingEUR,
    totalOverdueDZD,
    totalOverdueEUR,
    paidCount,
    pendingCount,
    overdueCount,
    totalCount: payments.length,
    collectionRate,
    byMethod,
  };
}

// 10. Generate WhatsApp reminder message for payment
export function generatePaymentWhatsAppMessage(
  payment: PaymentTransaction,
  type: 'reminder' | 'overdue' | 'receipt_confirmation'
): string {
  const brand = payment.brandName;
  const amountStr = `${payment.amount.toLocaleString()} ${payment.currency}`;
  const receipt = payment.receiptNumber;
  const dueDate = payment.dueDate || 'très prochainement';

  if (type === 'receipt_confirmation') {
    return encodeURIComponent(
      `Bonjour ${payment.contactPerson} (${brand}),\n\n` +
      `La Direction NISFY confirme la bonne réception de votre règlement de ${amountStr} pour votre campagne publicitaire.\n` +
      `Votre quittance officielle N° ${receipt} a été émise et votre diffusion est 100% active sur la plateforme.\n\n` +
      `Merci pour votre confiance ! 🌟\nNISFY Media & Digital Services`
    );
  }

  if (type === 'overdue') {
    return encodeURIComponent(
      `Bonjour ${payment.contactPerson} (${brand}),\n\n` +
      `Sauf erreur de notre part, nous n'avons pas reçu le règlement de votre abonnement NISFY (${amountStr}) arrivé à échéance le ${dueDate}.\n\n` +
      `Modes de règlement acceptés :\n` +
      `• BaridiMob (RIP Algérie Poste)\n` +
      `• Versement CCP / Virement bancaire\n` +
      `• Espèces contre reçu officiel\n\n` +
      `Merci de nous envoyer la photo du reçu pour maintenir la visibilité de votre enseigne sur NISFY.\n\n` +
      `Cordialement,\nService Comptabilité NISFY`
    );
  }

  // Default reminder
  return encodeURIComponent(
    `Bonjour ${payment.contactPerson} (${brand}),\n\n` +
    `Nous vous informons que l'échéance de votre abonnement publicitaire NISFY (${amountStr}) est prévue pour le ${dueDate}.\n\n` +
    `Vous pouvez effectuer le règlement par BaridiMob, CCP ou virement bancaire pour assurer la continuité de votre diffusion sans interruption.\n\n` +
    `Excellente journée,\nL'équipe NISFY Algérie`
  );
}
