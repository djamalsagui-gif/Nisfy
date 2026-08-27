import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Info,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import {
  PaymentTransaction,
  PaymentMethodType,
  PaymentRecordStatus,
} from '../../data/paymentsData';
import { Advertisement } from '../../data/advertisements';
import {
  generateNextReceiptNumber,
  numberToWordsFr,
  numberToWordsAr,
} from '../../utils/paymentsManager';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentData: Omit<PaymentTransaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  ads: Advertisement[];
  existingPayment?: PaymentTransaction | null;
  allPayments: PaymentTransaction[];
}

export function RecordPaymentModal({
  isOpen,
  onClose,
  onSave,
  ads,
  existingPayment,
  allPayments,
}: RecordPaymentModalProps) {
  const [selectedAdId, setSelectedAdId] = useState<string>('');
  const [brandName, setBrandName] = useState('');
  const [brandNameAr, setBrandNameAr] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [amount, setAmount] = useState<number>(30000);
  const [currency, setCurrency] = useState<'DZD' | 'EUR'>('DZD');
  const [planLabel, setPlanLabel] = useState('Pack Trimestriel Élite (3 Mois)');
  const [planDuration, setPlanDuration] = useState('3 mois');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('baridimob');
  const [transactionReference, setTransactionReference] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [periodCovered, setPeriodCovered] = useState('');
  const [status, setStatus] = useState<PaymentRecordStatus>('paid');
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentNumber, setInstallmentNumber] = useState<number>(1);
  const [totalInstallments, setTotalInstallments] = useState<number>(2);
  const [receivedByAdmin, setReceivedByAdmin] = useState('Direction Financière NISFY');
  const [notes, setNotes] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [syncWithAd, setSyncWithAd] = useState(true);

  // Initialize or populate from existing payment or selected ad
  useEffect(() => {
    if (existingPayment) {
      setSelectedAdId(existingPayment.adId);
      setBrandName(existingPayment.brandName);
      setBrandNameAr(existingPayment.brandNameAr || '');
      setContactPerson(existingPayment.contactPerson);
      setPhone(existingPayment.phone);
      setEmail(existingPayment.email || '');
      setCity(existingPayment.city || '');
      setAmount(existingPayment.amount);
      setCurrency(existingPayment.currency);
      setPlanLabel(existingPayment.planLabel);
      setPlanDuration(existingPayment.planDuration);
      setPaymentMethod(existingPayment.paymentMethod);
      setTransactionReference(existingPayment.transactionReference);
      setPaymentDate(existingPayment.paymentDate);
      setDueDate(existingPayment.dueDate || '');
      setPeriodCovered(existingPayment.periodCovered);
      setStatus(existingPayment.status);
      setIsInstallment(existingPayment.isInstallment);
      setInstallmentNumber(existingPayment.installmentNumber || 1);
      setTotalInstallments(existingPayment.totalInstallments || 2);
      setReceivedByAdmin(existingPayment.receivedByAdmin);
      setNotes(existingPayment.notes || '');
      setReceiptNumber(existingPayment.receiptNumber);
    } else {
      // New record
      setReceiptNumber(generateNextReceiptNumber(allPayments));
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      setPaymentDate(todayStr);

      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setDueDate(nextMonth.toISOString().split('T')[0]);

      setPeriodCovered(`${today.toLocaleDateString('fr-FR')} au ${nextMonth.toLocaleDateString('fr-FR')}`);
      setTransactionReference(`BM-${todayStr.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [existingPayment, isOpen]);

  // When an ad is selected from the dropdown
  const handleAdSelect = (adId: string) => {
    setSelectedAdId(adId);
    const foundAd = ads.find((a) => a.id === adId);
    if (foundAd) {
      setBrandName(foundAd.brandName);
      setBrandNameAr(foundAd.brandNameAr || '');
      setContactPerson(foundAd.advertiserContactPerson || foundAd.brandName);
      setPhone(foundAd.phone || '');
      setEmail(foundAd.advertiserEmail || '');
      setCity(foundAd.city || '');
      setPlanLabel(foundAd.subscriptionPlanLabel || 'Campagne Publicitaire NISFY');
      
      // Auto duration from plan
      if (foundAd.subscriptionPlan === '1_mois') {
        setPlanDuration('1 mois');
        setAmount(15000);
      } else if (foundAd.subscriptionPlan === '3_mois') {
        setPlanDuration('3 mois');
        setAmount(35000);
      } else if (foundAd.subscriptionPlan === '6_mois') {
        setPlanDuration('6 mois');
        setAmount(60000);
      } else if (foundAd.subscriptionPlan === '1_an') {
        setPlanDuration('1 an');
        if (foundAd.country === 'Espagne' || foundAd.id.includes('denia')) {
          setCurrency('EUR');
          setAmount(1440);
        } else {
          setAmount(110000);
        }
      }
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethodType): string => {
    switch (method) {
      case 'baridimob':
        return 'BaridiMob (RIP Algérie Poste)';
      case 'virement_bancaire':
        return 'Virement Bancaire (RIB Bancaire BNA/BEA/CPA)';
      case 'ccp':
        return 'Versement Guichet CCP (Bordereau Poste)';
      case 'especes':
        return 'Espèces avec Reçu de Caisse & Tampon';
      case 'cib_dahabia':
        return 'Carte CIB / Dahabia (Paiement Électronique)';
      case 'sepa_international':
        return 'Virement Bancaire International SEPA (IBAN)';
      case 'cheque':
        return 'Chèque de Banque Certifié';
      default:
        return 'Paiement Standard';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || amount <= 0) {
      alert('Veuillez renseigner le nom de l’enseigne et un montant valide.');
      return;
    }

    const payload: Omit<PaymentTransaction, 'id' | 'createdAt' | 'updatedAt'> = {
      receiptNumber: receiptNumber || generateNextReceiptNumber(allPayments),
      adId: selectedAdId,
      brandName,
      brandNameAr,
      contactPerson: contactPerson || brandName,
      phone: phone || '+213 550 00 00 00',
      email,
      city,
      amount: Number(amount),
      currency,
      amountInWordsFr: numberToWordsFr(Number(amount), currency),
      amountInWordsAr: numberToWordsAr(Number(amount), currency),
      planLabel,
      planDuration,
      paymentMethod,
      paymentMethodLabel: getPaymentMethodLabel(paymentMethod),
      transactionReference: transactionReference || `REF-${Date.now().toString().slice(-6)}`,
      paymentDate,
      dueDate,
      periodCovered: periodCovered || `${paymentDate} - Période active`,
      status,
      isInstallment,
      installmentNumber: isInstallment ? Number(installmentNumber) : undefined,
      totalInstallments: isInstallment ? Number(totalInstallments) : undefined,
      receivedByAdmin: receivedByAdmin || 'Direction Financière NISFY',
      officialReceiptIssued: status === 'paid',
      notes,
    };

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>{existingPayment ? 'Modifier le Règlement' : 'Enregistrer un Nouveau Règlement'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                  {receiptNumber}
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80">
                Génération de quittance officielle, validation comptable & synchronisation de diffusion
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Quick Select from Ads */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Lier à une Enseigne / Annonceur existant</span>
              <span className="text-[11px] text-emerald-600 font-medium">Auto-remplissage</span>
            </label>
            <select
              value={selectedAdId}
              onChange={(e) => handleAdSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="">-- Sélectionner un annonceur existant (ou saisie libre) --</option>
              {ads.map((ad) => (
                <option key={ad.id} value={ad.id}>
                  {ad.brandName} ({ad.city || 'Algérie'}) - Plan: {ad.subscriptionPlanLabel || ad.subscriptionPlan || 'Standard'}
                </option>
              ))}
            </select>
          </div>

          {/* Advertiser Info Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Nom de l'Enseigne (Français) *
              </label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Ex: Palais El-Bahia"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Nom en Arabe (Optionnel)
              </label>
              <input
                type="text"
                dir="rtl"
                value={brandNameAr}
                onChange={(e) => setBrandNameAr(e.target.value)}
                placeholder="قصر الباهية للأعراس"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-serif text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Nom du Contact / Gérant
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Ex: M. Karim Bahia"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Téléphone Contact *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +213 555 12 34 56"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Amount, Currency & Plan Details */}
          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 space-y-3">
            <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Détails Financiers & Montant Encaissé</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Montant Net *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 pr-16 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-black text-slate-900 dark:text-white"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCurrency('DZD')}
                      className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                        currency === 'DZD' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      DZD
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency('EUR')}
                      className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                        currency === 'EUR' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      EUR (€)
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Statut Règlement
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PaymentRecordStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="paid">🟢 Encaissé / Payé</option>
                  <option value="pending">🟡 En Attente Validation</option>
                  <option value="overdue">🔴 En Retard / Échu</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Intitulé Formule / Pack
                </label>
                <input
                  type="text"
                  value={planLabel}
                  onChange={(e) => setPlanLabel(e.target.value)}
                  placeholder="Ex: Pack Trimestriel Élite (3 Mois)"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Durée
                </label>
                <input
                  type="text"
                  value={planDuration}
                  onChange={(e) => setPlanDuration(e.target.value)}
                  placeholder="Ex: 3 mois"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method & Transaction Proof */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Mode de Paiement Utilisé *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="baridimob">📱 BaridiMob (RIP Algérie Poste)</option>
                <option value="virement_bancaire">🏦 Virement Bancaire (BNA, BEA, CPA, BDL)</option>
                <option value="ccp">✉️ Versement Guichet CCP (Bordereau)</option>
                <option value="especes">💵 Espèces avec Reçu de Caisse</option>
                <option value="cib_dahabia">💳 Carte CIB / Dahabia</option>
                <option value="sepa_international">🌍 Virement International SEPA (€)</option>
                <option value="cheque">📄 Chèque de Banque Certifié</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Réf. Transaction / N° Bordereau *
              </label>
              <input
                type="text"
                required
                value={transactionReference}
                onChange={(e) => setTransactionReference(e.target.value)}
                placeholder="Ex: BM-20260815-9981"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Date du Règlement *
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Prochaine Échéance (Facultatif)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Period Covered & Notes */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Période Couverte sur la Quittance
            </label>
            <input
              type="text"
              value={periodCovered}
              onChange={(e) => setPeriodCovered(e.target.value)}
              placeholder="Ex: 01/08/2026 au 01/11/2026"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Observations & Notes Internes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Reçu vérifié sur extrait postal. Quittance officielle remise au gérant."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white resize-none"
            />
          </div>

          {/* Actions Bar */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Valider & Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
