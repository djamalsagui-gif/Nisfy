import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
  Building2,
  ShieldCheck,
  HelpCircle,
  Heart,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubject?: string;
  initialType?: 'general' | 'partnership' | 'vendor' | 'support' | 'verification';
}

export const OFFICIAL_ADMIN_EMAIL = 'samirlaouami@gmail.com';

export function ContactModal({
  isOpen,
  onClose,
  initialSubject = '',
  initialType = 'general',
}: ContactModalProps) {
  const { isArabic } = useLanguage();
  const [requestType, setRequestType] = useState<string>(initialType);
  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    // Generate formatted mailto
    const mailSubject = encodeURIComponent(
      `[NISFY ${requestType.toUpperCase()}] ${subject || 'Nouvelle Demande Utilisateur'} - ${name}`
    );
    const bodyContent = encodeURIComponent(
      `Salam alaykoum / Bonjour l'équipe Nisfy,\n\n` +
        `Détails de la demande envoyée depuis Nisfy :\n` +
        `-----------------------------------------\n` +
        `• Type de demande : ${requestType}\n` +
        `• Nom & Prénom : ${name}\n` +
        `• Email expéditeur : ${userEmail || 'Non spécifié'}\n` +
        `• Téléphone : ${phone || 'Non spécifié'}\n` +
        `• Wilaya / Ville : ${wilaya || 'Non spécifié'}\n` +
        `• Sujet : ${subject || requestType}\n\n` +
        `Message :\n` +
        `${message}\n\n` +
        `-----------------------------------------\n` +
        `Envoyé via https://nisfy.vercel.app/`
    );

    // Open client email or copy
    window.location.href = `mailto:${OFFICIAL_ADMIN_EMAIL}?subject=${mailSubject}&body=${bodyContent}`;

    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setUserEmail('');
    setPhone('');
    setWilaya('');
    setSubject('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col relative p-6 sm:p-8"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full">
                {isArabic ? 'تم فتح تطبيق البريد بنجاح' : 'Demande Préparée avec Succès'}
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {isArabic ? 'شكراً لتواصلكم معنا' : 'Merci pour votre message !'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                {isArabic
                  ? `تم إرسال طلبكم مباشرة إلى البريد الرسمي لإدارة نصفي (${OFFICIAL_ADMIN_EMAIL}). سنرد عليكم في أقرب وقت ممكن.`
                  : `Votre demande est transmise directement à la direction de Nisfy à l'adresse officielle ${OFFICIAL_ADMIN_EMAIL}. Nous vous répondrons dans les plus brefs délais.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 max-w-md mx-auto flex items-center justify-between font-mono">
              <span className="font-bold">Email destinataire :</span>
              <span className="text-rose-600 dark:text-rose-400 font-black">{OFFICIAL_ADMIN_EMAIL}</span>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              {isArabic ? 'إغلاق' : 'Fermer'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-rose-700 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {isArabic ? 'الدعم الفني والإدارة الرسمية' : 'Support & Contact Officiel'}
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white leading-snug mt-1">
                  {isArabic ? 'تواصل مع إدارة منصة نصفي' : 'Contacter l’Administration Nisfy'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isArabic ? 'البريد الرسمي المعتمد لجميع الطلبات :' : 'Adresse officielle pour toute demande : '}{' '}
                  <strong className="text-rose-600 dark:text-rose-400 select-all font-mono">
                    {OFFICIAL_ADMIN_EMAIL}
                  </strong>
                </p>
              </div>
            </div>

            {/* Request Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isArabic ? 'نوع الطلب' : 'Objet de votre demande'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'general', label: 'Général', labelAr: 'عام' },
                  { id: 'partnership', label: 'Partenariat', labelAr: 'شراكة إعلانية' },
                  { id: 'vendor', label: 'Prestataire', labelAr: 'تسجيل مهني' },
                  { id: 'support', label: 'Assistance', labelAr: 'مساعدة ودعم' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setRequestType(type.id)}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all text-center cursor-pointer ${
                      requestType === type.id
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isArabic ? type.labelAr : type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Email inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'الاسم واللقب *' : 'Votre Nom Complet *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Samir Laouami"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-rose-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'بريدكم الإلكتروني' : 'Votre Adresse Email'}
                </label>
                <input
                  type="email"
                  placeholder="votre-email@gmail.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-rose-400 outline-none"
                />
              </div>
            </div>

            {/* Phone & Wilaya inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'رقم الهاتف' : 'Numéro de Téléphone'}
                </label>
                <input
                  type="tel"
                  placeholder="05 / 06 / 07..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-rose-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'الولاية / المدينة' : 'Wilaya / Région'}
                </label>
                <input
                  type="text"
                  placeholder="16 - Alger, 31 - Oran..."
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-rose-400 outline-none"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isArabic ? 'عنوان الرسالة' : 'Sujet / Titre de la demande'}
              </label>
              <input
                type="text"
                placeholder="Ex: Demande de partenariat / Question sur l'abonnement"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-rose-400 outline-none"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isArabic ? 'تفاصيل الرسالة *' : 'Votre Message / Demande *'}
              </label>
              <textarea
                required
                rows={4}
                placeholder="Écrivez votre message ou précisez votre demande ici..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-rose-400 outline-none resize-none"
              />
            </div>

            {/* Destination Notice */}
            <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-between text-xs text-rose-900 dark:text-rose-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  {isArabic
                    ? `سيتم إرسال هذا الطلب مباشرة إلى:`
                    : `Destinataire officiel :`}
                </span>
              </div>
              <span className="font-bold font-mono text-rose-700 dark:text-rose-300">
                {OFFICIAL_ADMIN_EMAIL}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isArabic
                    ? `إرسال الطلب بالبريد إلى ${OFFICIAL_ADMIN_EMAIL}`
                    : `Envoyer la demande à ${OFFICIAL_ADMIN_EMAIL}`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
