import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Building2,
  Send,
  CheckCircle2,
  DollarSign,
  Users,
  Target,
  ShieldCheck,
  Megaphone,
  CreditCard,
  FileText,
  BadgeCheck,
  AlertCircle,
  Receipt,
  QrCode,
  Landmark,
  Upload,
} from 'lucide-react';
import { WILAYAS_69 } from '../data/wilayas';
import { useLanguage } from '../context/LanguageContext';

interface BecomePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BecomePartnerModal({ isOpen, onClose }: BecomePartnerModalProps) {
  const { isArabic } = useLanguage();
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');

  // Professional Verification Data
  const [businessName, setBusinessName] = useState('');
  const [rcNumber, setRcNumber] = useState(''); // Registre de Commerce (RC)
  const [nifNumber, setNifNumber] = useState(''); // NIF / NIS / Agrément
  const [businessType, setBusinessType] = useState('venue');
  const [selectedWilaya, setSelectedWilaya] = useState('16 - Alger');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [budgetPlan, setBudgetPlan] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState<'edahabia' | 'cib' | 'baridimob' | 'virement'>('edahabia');
  const [adTitle, setAdTitle] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [isAgreedTerms, setIsAgreedTerms] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');

  if (!isOpen) return null;

  const plans = [
    {
      id: 'starter',
      name: 'Starter Pro',
      nameAr: 'باقة الانطلاقة الاحترافية',
      price: '15 000 DZD',
      duration: '30 jours',
      durationAr: '30 يوماً',
      desc: 'Bannière ciblée dans le Lounge Communautaire + Badge Partenaire',
      descAr: 'بانر إعلاني في صالون المجتمع + شارة شريك رسمي',
      features: ['Diffusion Lounge & Salons', 'Ciblage 1 Wilaya', 'Rapports de clics mensuels'],
      featuresAr: ['ظهور في الصالونات المجتمعية', 'استهداف ولاية واحدة', 'تقرير إحصائيات شهري'],
    },
    {
      id: 'standard',
      name: 'VIP Feed Pro',
      nameAr: 'الباقة الذهبية المميزة',
      price: '28 000 DZD',
      duration: '30 jours',
      durationAr: '30 يوماً',
      popular: true,
      desc: 'Carte sponsorisée native dans le flux Découverte (Swipe) + Galerie',
      descAr: 'بطاقة رعاية مدمجة في صفحة الاستكشاف (السوايب) مع معرض صور',
      features: ['Carte sponsorisée Swipe & Grille', 'Ciblage multi-wilayas (jusqu’à 5)', 'Bouton WhatsApp direct + Code Promo'],
      featuresAr: ['ظهور في السوايب والشبكة', 'استهداف حتى 5 ولايات', 'زر واتساب مباشر وكود خصم مخصص'],
    },
    {
      id: 'premium',
      name: 'Pack Royal 69 Wilayas',
      nameAr: 'الباقة الملكية الشاملة',
      price: '45 000 DZD',
      duration: '45 jours',
      durationAr: '45 يوماً',
      desc: 'Présence maximale sur toute l’application Nisfy (Swipe, Lounge, Stories & Push)',
      descAr: 'أقصى انتشار في كافة أرجاء التطبيق (السوايب، القصص، الصالونات والتنبيهات)',
      features: ['Visibilité 69 Wilayas + Diaspora', 'Story sponsorisée épinglée', 'Mise en avant VIP prioritaire'],
      featuresAr: ['ظهور وطني في 69 ولاية + المهجر', 'قصة إعلانية مثبتة في الأعلى', 'أولوية الظهور للباحثين عن خدمات الأعراس'],
    },
  ];

  const selectedPlanObj = plans.find((p) => p.id === budgetPlan) || plans[1];

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rcNumber.trim()) {
      alert(isArabic ? 'يرجى إدخال رقم السجل التجاري للتحقق من صفتكم المهنية' : 'Veuillez saisir votre numéro de Registre de Commerce (RC) pour certifier votre statut professionnel.');
      return;
    }
    setStep('payment');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  const handleReset = () => {
    setStep('info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col relative p-6 sm:p-8"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: INFORMATIONS PROFESSIONNELLES & OFFRE */}
        {step === 'info' && (
          <form onSubmit={handleProceedToPayment} className="space-y-6">
            {/* Header with Professional Badge */}
            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-rose-600 text-white flex items-center justify-center shadow-lg shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    {isArabic ? 'فضاء مخصص للمهنيين المعتمدين فقط' : 'Espace Réservé aux Professionnels Certifiés'}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 leading-snug">
                  {isArabic ? 'تسجيل إعلان تجاري ممول على منصة نصفي' : 'Souscription & Diffusion Publicitaire Professionnelle'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isArabic
                    ? 'نشر الإعلانات على نصفي متاح حصرياً للمؤسسات والمهنيين المسجلين في السجل التجاري بموجب باقات مدفوعة.'
                    : 'La diffusion publicitaire sur Nisfy est strictement réservée aux professionnels déclarés avec paiement requis.'}
                </p>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {isArabic
                  ? 'يتم التحقق من الوثائق التجارية (RC / NIF) قبل تفعيل الحملة لضمان أمان ومصداقية الخدمات لمستخدمي نصفي.'
                  : 'Vérification légale obligatoire (RC / NIF / Agrément) pour protéger la communauté de futurs mariés Nisfy.'}
              </span>
            </div>

            {/* Form Fields: Professional Identification */}
            <div className="space-y-4">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
                1. {isArabic ? 'هوية المؤسسة والتحقق المهني' : 'Identification de l’Entreprise & Justificatifs'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isArabic ? 'اسم المؤسسة / العلامة التجارية' : 'Nom de l’Entreprise ou Enseigne'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Palais El Bahdja, Dar Caftan..."
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>{isArabic ? 'رقم السجل التجاري (RC)' : 'Numéro Registre de Commerce (RC)'} *</span>
                    <span className="text-[10px] text-amber-600 font-bold">{isArabic ? 'إلزامي للتحقق' : 'Obligatoire'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 16/00-1234567B22"
                    value={rcNumber}
                    onChange={(e) => setRcNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isArabic ? 'مجال النشاط' : 'Secteur d’Activité'}
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="venue">{isArabic ? 'قاعات حفلات وأعراس' : 'Salle des Fêtes / Domaine'}</option>
                    <option value="fashion">{isArabic ? 'أزياء تقليدية وجهاز العروس' : 'Caftan, Karakou & Robes'}</option>
                    <option value="travel">{isArabic ? 'عمرة ورحلات شهر العسل' : 'Omra & Lune de Miel'}</option>
                    <option value="photo">{isArabic ? 'تصوير فوتوغرافي وفيديو 4K' : 'Photographe & Drone 4K'}</option>
                    <option value="catering">{isArabic ? 'حلويات وإطعام تقليدي' : 'Traiteur & Gâteaux'}</option>
                    <option value="jewelry">{isArabic ? 'مجوهرات وحلي وأطقم' : 'Bijouterie & Alliances'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isArabic ? 'الولاية المستهدفة' : 'Wilaya Principale'}
                  </label>
                  <select
                    value={selectedWilaya}
                    onChange={(e) => setSelectedWilaya(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="national">{isArabic ? 'كل الولايات (وطني)' : 'Toutes Wilayas (National)'}</option>
                    {WILAYAS_69.slice(0, 35).map((w) => (
                      <option key={w.code} value={`${w.code} - ${w.name}`}>
                        {w.code} - {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isArabic ? 'رقم الهاتف / واتساب' : 'Tél Professionnel / WhatsApp'} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05 / 06 / 07 xx xx xx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 in form: Choose Advertising Plan */}
            <div className="space-y-3">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center justify-between">
                <span>2. {isArabic ? 'اختر الباقة الإعلانية المدفوعة' : 'Sélection du Forfait Publicitaire'}</span>
                <span className="text-[11px] text-rose-600 font-bold">{isArabic ? 'دفع إلكتروني آمن' : 'Tarifs Hors Taxes'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {plans.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setBudgetPlan(p.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      budgetPlan === p.id
                        ? 'border-amber-500 bg-amber-50/60 shadow-md ring-2 ring-amber-400/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                        {isArabic ? 'الأكثر طلباً' : 'Recommandé'}
                      </span>
                    )}

                    <div>
                      <div className="text-xs font-bold text-slate-900">{isArabic ? p.nameAr : p.name}</div>
                      <div className="text-lg font-black text-amber-700 mt-1">{p.price}</div>
                      <div className="text-[10px] text-slate-500 font-semibold mb-2">
                        {isArabic ? `مدة العرض: ${p.durationAr}` : `Durée : ${p.duration}`}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                        {isArabic ? p.descAr : p.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/70 space-y-1">
                      {(isArabic ? p.featuresAr : p.features).map((feat, idx) => (
                        <div key={idx} className="text-[10px] text-slate-700 flex items-center gap-1">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign details */}
            <div className="space-y-3">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
                3. {isArabic ? 'تفاصيل الإعلان والعرض الترويجي' : 'Contenu de l’Annonce & Offre Spéciale'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isArabic ? 'عنوان الإعلان أو الشعار' : 'Titre Publicitaire / Slogan'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: -15% sur réservation de la salle de mariage"
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isArabic ? 'الرمز الترويجي الحصري (Code Promo)' : 'Code Promo Exclusif Nisfy'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: NISFY-MARIAGE26"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={isAgreedTerms}
                onChange={(e) => setIsAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span className="text-xs text-slate-600">
                {isArabic
                  ? 'أقر بصفتي ممثلاً قانونياً للمؤسسة، وأوافق على شروط الإعلان المدفوع والتحقق من صحة السجل التجاري.'
                  : 'Je certifie être le représentant légal de l’établissement et j’accepte les conditions de diffusion publicitaire payante sur Nisfy.'}
              </span>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!isAgreedTerms}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {isArabic
                  ? `المتابعة إلى الدفع وتأكيد الباقة (${selectedPlanObj.price})`
                  : `Passer au Règlement du Forfait (${selectedPlanObj.price})`}
              </span>
            </button>
          </form>
        )}

        {/* STEP 2: PASSERELLE DE PAIEMENT SÉCURISÉE (Edahabia, CIB, BaridiMob) */}
        {step === 'payment' && (
          <form onSubmit={handleConfirmPayment} className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {isArabic ? 'الدفع الإلكتروني وتأكيد الاشتراك الإعلاني' : 'Règlement Sécurisé de la Campagne'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isArabic ? 'معاملة رسمية وفاتورة قانونية فورية' : 'Paiement professionnel certifié SATIM / Algérie Poste'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-500">{isArabic ? 'المبلغ الإجمالي :' : 'Montant TTC :'}</div>
                <div className="text-lg font-black text-emerald-600">{selectedPlanObj.price}</div>
              </div>
            </div>

            {/* Recap Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-700">
                <span className="font-bold">{isArabic ? 'المعلن / المؤسسة :' : 'Annonceur / Raison Sociale :'}</span>
                <span className="font-extrabold text-slate-900">{businessName}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="font-bold">{isArabic ? 'رقم السجل التجاري (RC) :' : 'Registre de Commerce (RC) :'}</span>
                <span className="font-mono text-slate-900">{rcNumber}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="font-bold">{isArabic ? 'الباقة المختارة :' : 'Forfait souscrit :'}</span>
                <span className="font-extrabold text-amber-700">{isArabic ? selectedPlanObj.nameAr : selectedPlanObj.name} ({selectedPlanObj.duration})</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                {isArabic ? 'اختر وسيلة الدفع المهنية' : 'Mode de Paiement Professionnel'}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'edahabia', name: 'Carte Edahabia', nameAr: 'البطاقة الذهبية', badge: 'Poste DZ' },
                  { id: 'cib', name: 'Carte CIB', nameAr: 'بطاقة CIB البنكية', badge: 'Banques' },
                  { id: 'baridimob', name: 'BaridiMob', nameAr: 'بريدي موب', badge: 'Virement App' },
                  { id: 'virement', name: 'Virement RIB', nameAr: 'تحويل بنكي / صك', badge: 'Facture Pro' },
                ].map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                      paymentMethod === m.id
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-emerald-700 uppercase mb-0.5">{m.badge}</div>
                    <div className="text-xs font-black text-slate-900">{isArabic ? m.nameAr : m.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Payment Card / RIP Form */}
            {paymentMethod === 'edahabia' || paymentMethod === 'cib' ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span className="font-mono">{paymentMethod === 'edahabia' ? 'EDAHABIA SATIM' : 'CIB INTERBANCAIRE'}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-300 font-bold mb-1">
                    {isArabic ? 'رقم البطاقة (16 رقم)' : 'Numéro de Carte (16 chiffres)'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="6280 0000 0000 0000"
                    maxLength={19}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-300 font-bold mb-1">
                      {isArabic ? 'تاريخ نهاية الصلاحية' : 'Date d’expiration'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-300 font-bold mb-1">
                      {isArabic ? 'رمز الأمان (CVV)' : 'Cryptogramme (CVV2)'}
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-amber-700" />
                  <span>{isArabic ? 'بيانات الحساب البريدي / البنكي لمنصة نصفي' : 'Coordonnées Bancaires & RIP Nisfy Pub'}</span>
                </div>
                <div className="font-mono text-[11px] bg-white p-2.5 rounded-xl border border-amber-300 space-y-1">
                  <div><strong>RIB SATIM :</strong> 007 99999 0001234567 89</div>
                  <div><strong>RIP Algérie Poste (CCP) :</strong> 0012345678 Clé 99</div>
                  <div><strong>Bénéficiaire :</strong> SARL NISFY DIGITAL MEDIA SERVICES</div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isArabic ? 'رقم مرجع الحوالة أو وصل الدفع' : 'Numéro de Transaction / Réf. Virement'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: TXN-89421893 ou n° bordereau"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('info')}
                className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {isArabic ? 'رجوع' : 'Retour'}
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isArabic ? `تأكيد الدفع وتفعيل الحملة (${selectedPlanObj.price})` : `Confirmer le Paiement & Activer l’Annonce`}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCÈS & FACTURE */}
        {step === 'success' && (
          <div className="py-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full">
                {isArabic ? 'تم الدفع وتأكيد الحساب المهني بنجاح' : 'Paiement Validé & Campagne Enregistrée'}
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                {isArabic ? 'شكراً لثقتكم في منصة نصفي' : 'Félicitations pour votre Partenariat !'}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {isArabic
                  ? `تم استلام دفعتكم وقدرها ${selectedPlanObj.price} الخاصة بمؤسسة "${businessName}". سيبدأ بث الإعلان بعد المصادقة التقنية النهائية خلال أقل من ساعتين.`
                  : `Votre paiement de ${selectedPlanObj.price} pour "${businessName}" a été validé. Votre campagne sera mise en ligne après contrôle technique sous 2 heures.`}
              </p>
            </div>

            {/* Summary Ticket */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs max-w-md mx-auto space-y-2">
              <div className="flex justify-between font-mono text-[11px] text-slate-500 border-b border-slate-200 pb-1">
                <span>FACTURE N° : NISFY-INV-2026-089</span>
                <span>{new Date().toLocaleDateString('fr-DZ')}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800">
                <span>Raison Sociale (RC {rcNumber}) :</span>
                <span>{businessName}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800">
                <span>Forfait souscrit :</span>
                <span className="text-emerald-700">{selectedPlanObj.name} ({selectedPlanObj.duration})</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800">
                <span>Code Promo attribué :</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-300">{promoCode || 'PROMO-NISFY'}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 border-t border-slate-200 pt-1">
                <span>Contact Administration Nisfy :</span>
                <span className="text-rose-600 font-mono">contact@nisfy.app</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <a
                href={`mailto:contact@nisfy.app?subject=${encodeURIComponent(`[NISFY PARTENAIRE] Dossier ${businessName} - RC ${rcNumber}`)}&body=${encodeURIComponent(`Salam alaykoum,\n\nVoici le dossier de souscription pour ${businessName} :\n- RC : ${rcNumber}\n- NIF : ${nifNumber || 'N/A'}\n- Téléphone : ${phone}\n- Email : ${email}\n- Forfait : ${selectedPlanObj.name} (${selectedPlanObj.price})\n- Wilaya : ${selectedWilaya}\n- Réf Paiement : ${transactionRef || 'En cours'}\n\nCordialement.`)}`}
                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Transmettre mon dossier par email</span>
              </a>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                {isArabic ? 'إغلاق' : 'Fermer'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
