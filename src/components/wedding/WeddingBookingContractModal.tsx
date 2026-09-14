import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Download,
  Share2,
  AlertCircle,
  Clock,
  Sparkles,
  Printer,
  Copy,
  Check,
  CreditCard,
} from 'lucide-react';
import { WeddingVendor, WeddingBookingContract, UserProfile } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { addWeddingBooking } from '../../utils/storage';

interface WeddingBookingContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: WeddingVendor;
  currentUser?: UserProfile | null;
  onBookingSuccess?: (booking: WeddingBookingContract) => void;
}

export const WeddingBookingContractModal: React.FC<WeddingBookingContractModalProps> = ({
  isOpen,
  onClose,
  vendor,
  currentUser,
  onBookingSuccess,
}) => {
  const { isArabic } = useLanguage();

  // Booking Form State
  const [clientName, setClientName] = useState(
    currentUser ? `${currentUser.pseudo}` : ''
  );
  const [clientPhone, setClientPhone] = useState('0550 00 00 00');
  const [clientEmail, setClientEmail] = useState(currentUser?.email || '');
  const [weddingDate, setWeddingDate] = useState('2026-10-24');
  const [guestCount, setGuestCount] = useState<number>(250);
  const [paymentMethod, setPaymentMethod] = useState<
    'baridimob' | 'ccp' | 'especes_salle' | 'virement_cib'
  >('baridimob');
  const [specialNotes, setSpecialNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [signature, setSignature] = useState(currentUser ? currentUser.pseudo : '');

  // Dynamic Selected Options from vendor services
  const [selectedServices, setSelectedServices] = useState<string[]>(
    vendor.services ? vendor.services.slice(0, 3) : []
  );

  // Success state with generated contract
  const [generatedContract, setGeneratedContract] = useState<WeddingBookingContract | null>(null);
  const [copiedBaridiMob, setCopiedBaridiMob] = useState(false);

  if (!isOpen) return null;

  const toggleService = (srv: string) => {
    setSelectedServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  // Pricing calculation
  const parsedPrice = parseInt(vendor.priceStartingAt.replace(/\D/g, ''), 10) || 45000;
  const totalAmountDzd = parsedPrice + selectedServices.length * 5000;
  const depositAmountDzd = Math.round(totalAmountDzd * 0.3); // 30% d'acompte
  const remainingAmountDzd = totalAmountDzd - depositAmountDzd;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted || !clientName.trim() || !weddingDate) return;

    const bookingCode = `NISFY-DZ-${Date.now().toString().slice(-6)}`;
    const newBooking: WeddingBookingContract = {
      id: `wbk-${Date.now()}`,
      bookingCode,
      vendorId: vendor.id,
      vendorName: vendor.name,
      vendorCategory: vendor.category,
      vendorPhone: vendor.phone,
      vendorWilaya: `${vendor.wilayaName} (${vendor.wilayaCode})`,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || `${clientName.toLowerCase().replace(/\s+/g, '')}@nisfy.dz`,
      weddingDate,
      guestCount: vendor.category === 'salle_fetes' || vendor.category === 'traiteur_repas' ? guestCount : undefined,
      totalAmountDzd,
      depositAmountDzd,
      remainingAmountDzd,
      status: 'confirme_signe',
      paymentMethod,
      selectedOptions: selectedServices,
      specialNotes: specialNotes.trim() || undefined,
      signedAt: new Date().toISOString(),
      signatureClient: signature.trim() || clientName,
      termsAccepted: true,
      createdAt: new Date().toISOString(),
    };

    addWeddingBooking(newBooking);
    setGeneratedContract(newBooking);
    if (onBookingSuccess) onBookingSuccess(newBooking);
  };

  const handlePrint = () => {
    window.print();
  };

  const copyBaridiMob = () => {
    navigator.clipboard.writeText('00799999000123456789');
    setCopiedBaridiMob(true);
    setTimeout(() => setCopiedBaridiMob(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-amber-600 via-[#FF6B35] to-[#FF3823] text-white shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                  {isArabic ? 'خدمة التعاقد الرسمي' : 'Contrat & Acompte Sécurisé'}
                </span>
                <span className="text-xs font-bold text-amber-200">100% DZ 🇩🇿</span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                {isArabic ? 'عقد حجز وضمان خدمة العرس' : 'Bon de Réservation & Contrat Prestataire'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
          {generatedContract ? (
            /* ============================================================== */
            /* SUCCÈS : BON DE RÉSERVATION & CONTRAT LÉGAL GÉNÉRÉ             */
            /* ============================================================== */
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              {/* Notification Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-emerald-900 dark:text-emerald-200">
                    {isArabic
                      ? 'تم توثيق وتأكيد حجزكم بنجاح وبقوة العقد !'
                      : 'Contrat & Bon de réservation validé avec succès !'}
                  </h3>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                    {isArabic
                      ? `رمز العقد المرجعي: ${generatedContract.bookingCode}. تم إشعار مقدم الخدمة رسميًا ويتم حجز التاريخ وتثبيت السعر بموجب هذا العقد.`
                      : `Numéro d'agrément: ${generatedContract.bookingCode}. Le prestataire a été notifié. La date et le tarif sont désormais verrouillés et sécurisés par Nisfy.`}
                  </p>
                </div>
              </div>

              {/* Printable Official Contract Document */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-5 print:border-none print:p-0">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💍</span>
                    <div>
                      <span className="font-black text-slate-900 dark:text-white block text-sm">
                        NISFY SARL • PLATEFORME NATIONALE MATRIMONIALE
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Agrément & Registre de Commerce RC N° 16/00-887412 • Alger
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                      {isArabic ? 'عقد رسمي مبرم' : 'CONTRAT SIGNÉ & ACTIF'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 block mt-1">
                      {generatedContract.bookingCode}
                    </span>
                  </div>
                </div>

                {/* Parties Contractantes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
                      {isArabic ? 'الطرف الأول (مقدم الخدمة المعتمد)' : 'Prestataire Agréé (Partie A)'}
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{generatedContract.vendorName}</p>
                    <p className="text-[11px] text-slate-500">📍 {generatedContract.vendorWilaya}</p>
                    <p className="text-[11px] text-slate-500">📞 {generatedContract.vendorPhone}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#FF3823]">
                      {isArabic ? 'الطرف الثاني (العميل المحترم)' : 'Client / Futurs Mariés (Partie B)'}
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">{generatedContract.clientName}</p>
                    <p className="text-[11px] text-slate-500">📞 {generatedContract.clientPhone}</p>
                    <p className="text-[11px] text-slate-500">✉️ {generatedContract.clientEmail}</p>
                  </div>
                </div>

                {/* Détails Date & Prestations */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Calendar className="w-4 h-4 text-amber-500" />
                      {isArabic ? 'تاريخ الحفل والموعد:' : 'Date de célébration :'} {generatedContract.weddingDate}
                    </span>
                    {generatedContract.guestCount && (
                      <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Users className="w-4 h-4 text-emerald-500" />
                        {generatedContract.guestCount} {isArabic ? 'ضيف مدعو' : 'invités'}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                      {isArabic ? 'الخدمات المتفق عليها في العقد:' : 'Prestations & Options Contractuelles :'}
                    </span>
                    <ul className="space-y-1">
                      {generatedContract.selectedOptions.map((opt, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{opt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bilan Financier de l'Acompte & Reste */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white space-y-3 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>{isArabic ? 'المبلغ الإجمالي المتفق عليه:' : 'Montant Total Convenu :'}</span>
                    <span className="font-bold font-mono text-sm">{generatedContract.totalAmountDzd.toLocaleString()} DZD</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" />
                      {isArabic ? 'مبلغ العربون / الدفعة الأولى (30%):' : 'Acompte de Réservation (30%) :'}
                    </span>
                    <span className="font-mono text-base">{generatedContract.depositAmountDzd.toLocaleString()} DZD</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span>{isArabic ? 'المتبقي للتسديد يوم الحفل:' : 'Solde restant (à régler le Jour J) :'}</span>
                    <span className="font-mono text-slate-300">{generatedContract.remainingAmountDzd.toLocaleString()} DZD</span>
                  </div>
                </div>

                {/* Instructions de Paiement d'Acompte BaridiMob / CCP */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                      <span>💳</span>
                      {isArabic ? 'بيانات دفع العربون (بريدي موب / CCP معتمد) :' : 'Modalités de Versement Acompte (BaridiMob & CCP) :'}
                    </span>
                    <button
                      type="button"
                      onClick={copyBaridiMob}
                      className="px-2.5 py-1 rounded-lg bg-amber-200 dark:bg-amber-900/80 text-amber-950 dark:text-amber-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-amber-300"
                    >
                      {copiedBaridiMob ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedBaridiMob ? 'Copié !' : 'Copier RIP BaridiMob'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-amber-900 dark:text-amber-200 bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                    <span>RIP BaridiMob : <strong>007 99999 0001234567 89</strong></span>
                    <span className="text-[10px] text-slate-500 font-sans">Titulaire : NISFY SÉCURI-MARIAGE</span>
                  </div>
                  <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80">
                    {isArabic
                      ? 'احتفظ بوصل الدفع أو أرسل صورة الوصل مباشرة إلى مستشار الأعراس عبر الواتساب لتفعيل شهادة الحجز النهائية.'
                      : 'Envoyez la capture d’écran du reçu de virement pour recevoir le tampon d’homologation officiel Nisfy.'}
                  </p>
                </div>

                {/* Signatures électroniques */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold">Cachet & Signature Prestataire</span>
                    <div className="h-10 flex items-center justify-center font-serif text-sm italic text-amber-700 dark:text-amber-300">
                      ✓ Validé & Certifié Nisfy
                    </div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold">Signature Client / Mariés</span>
                    <div className="h-10 flex items-center justify-center font-serif text-sm italic text-emerald-600 dark:text-emerald-400">
                      ✍️ {generatedContract.signatureClient}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 w-full py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isArabic ? 'طباعة العقد أو حفظ كـ PDF' : 'Imprimer ou Télécharger en PDF'}</span>
                </button>

                <a
                  href={`https://wa.me/213550884422?text=${encodeURIComponent(
                    `Salam alaykoum, j'ai validé le contrat de réservation ${generatedContract.bookingCode} pour ${vendor.name} au montant de ${generatedContract.totalAmountDzd} DZD. Date : ${generatedContract.weddingDate}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500 transition shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isArabic ? 'إرسال الوصل للمستشار عبر واتساب' : 'Envoyer reçu via WhatsApp'}</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  {isArabic ? 'إغلاق' : 'Fermer'}
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* FORMULAIRE DE RÉSERVATION & DEVIS CONTRAT EN 1 CLIC            */
            /* ============================================================== */
            <form onSubmit={handleSubmitBooking} className="space-y-5">
              {/* Summary Card of the Vendor */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={vendor.avatarUrl || vendor.photos[0]}
                    alt={vendor.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                      {vendor.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      📍 {vendor.wilayaName} ({vendor.wilayaCode}) • ⭐ {vendor.rating}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    {isArabic ? 'السعر الأساسي' : 'Base à partir de'}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400">
                    {vendor.priceStartingAt}
                  </span>
                </div>
              </div>

              {/* Form Fields: Date & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'تاريخ حفل الزفاف المبارك *' : 'Date de la célébration *'}
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-3 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      required
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full pl-9 rtl:pl-3 rtl:pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-[#FF3823] outline-none"
                    />
                  </div>
                </div>

                {(vendor.category === 'salle_fetes' || vendor.category === 'traiteur_repas') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'عدد الضيوف المتوقع' : 'Nombre d’invités estimés'}
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-3 text-slate-400 pointer-events-none" />
                      <input
                        type="number"
                        min="50"
                        max="1000"
                        value={guestCount}
                        onChange={(e) => setGuestCount(parseInt(e.target.value, 10) || 100)}
                        className="w-full pl-9 rtl:pl-3 rtl:pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-[#FF3823] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'اسم العريس / العروس *' : 'Nom & Prénom du Client *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Karim & Amira"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-[#FF3823] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'رقم الهاتف للتأكيد *' : 'Téléphone de contact *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="0550 00 00 00"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-[#FF3823] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'البريد الإلكتروني' : 'Adresse Email'}
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="nom@email.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-[#FF3823] outline-none"
                  />
                </div>
              </div>

              {/* Prestations & Options Checkboxes */}
              {vendor.services && vendor.services.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'خيارات وباقات الخدمة المطلوبة في العقد :' : 'Prestations et options incluses dans le contrat :'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {vendor.services.map((srv, idx) => {
                      const isSelected = selectedServices.includes(srv);
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleService(srv)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-slate-900 dark:text-white font-bold'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <span className="text-xs truncate pr-2">{srv}</span>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 accent-[#FF3823]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mode de règlement de l'acompte */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isArabic ? 'طريقة دفع العربون (30%) المعتمدة :' : 'Mode de versement de l’acompte légal (30%) :'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'baridimob', label: 'BaridiMob (RIP DZ)', icon: '📱' },
                    { id: 'ccp', label: 'Virement CCP', icon: '📬' },
                    { id: 'especes_salle', label: 'Espèces sur place', icon: '💵' },
                    { id: 'virement_cib', label: 'Carte CIB / Edahabia', icon: '💳' },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === pm.id
                          ? 'bg-[#FF3823]/10 border-[#FF3823] text-[#FF3823] font-black'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-base block mb-0.5">{pm.icon}</span>
                      <span className="text-[11px] block">{pm.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Financial Box Summary */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                    {isArabic ? 'تقدير التكلفة الإجمالية:' : 'Total Estimatif du Contrat :'}
                  </span>
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {totalAmountDzd.toLocaleString()} DZD
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                  <span>{isArabic ? 'العربون المطلوب لتثبيت التاريخ (30%):' : 'Acompte requis pour réservation ferme (30%) :'}</span>
                  <span className="font-mono text-sm">{depositAmountDzd.toLocaleString()} DZD</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-amber-500/20">
                  {isArabic
                    ? '🛡️ ضمان نصفي: في حال إلغاء الخدمة من قبل مقدم الخدمة، يتم استرداد العربون بالكامل في 48 ساعة.'
                    : '🛡️ Garantie Nisfy : Restitution immédiate de l’acompte sous 48h en cas de défaillance du prestataire.'}
                </p>
              </div>

              {/* Terms & Electronic Signature */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#FF3823]"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    {isArabic
                      ? 'أوافق على بنود العقد الموحد لمنصة نصفي لحماية الأفراح وضمان تثبيت الأسعار والتزام الطرفين.'
                      : 'J’accepte les clauses du contrat type Nisfy régissant les réservations de mariage en Algérie.'}
                  </span>
                </label>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'التوقيع الإلكتروني (اكتب اسمك للمصادقة) :' : 'Signature électronique (Tapez votre nom pour valider) :'}
                  </label>
                  <input
                    type="text"
                    required
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Votre nom complet..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-serif italic text-xs focus:ring-2 focus:ring-[#FF3823] outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={!termsAccepted || !clientName.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-[#FF6B35] to-[#FF3823] hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition-transform active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>
                  {isArabic
                    ? 'إبرام العقد وتأكيد الحجز الفوري (Devis & Contrat en 1 clic)'
                    : 'Générer le Contrat & Valider la Réservation Immédiate'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
