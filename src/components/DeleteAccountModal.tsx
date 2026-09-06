import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  UserX,
  Check,
  ShieldAlert,
  HeartHandshake,
  Heart,
  HelpCircle,
  FileText,
  Lock,
} from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { datingSounds } from '../utils/soundEffects';

export interface WithdrawalReasonOption {
  id: string;
  emoji: string;
  labelFr: string;
  labelAr: string;
  hintFr?: string;
  hintAr?: string;
  defaultExplanationFr: string;
  defaultExplanationAr: string;
}

export const WITHDRAWAL_REASONS: WithdrawalReasonOption[] = [
  {
    id: 'found_partner_nisfy',
    emoji: '💍',
    labelFr: "J'ai trouvé mon Nisf / mon âme sœur sur Nisfy (Mabrouk !)",
    labelAr: 'وجدت نصفي وشريك حياتي بفضل التطبيق (الحمد لله ومبروك)',
    hintFr: 'Toutes nos félicitations pour votre futur mariage !',
    hintAr: 'ألف مبروك وبالرفاه والبنين إن شاء الله !',
    defaultExplanationFr: "J'ai trouvé la personne idéale sur Nisfy pour mon projet de mariage. Merci à la plateforme !",
    defaultExplanationAr: 'وجدت شريك حياتي المناسب على منصة نصفي لمشروع الزواج، شكراً لكم.',
  },
  {
    id: 'found_partner_outside',
    emoji: '💑',
    labelFr: "J'ai rencontré quelqu'un en dehors de l'application",
    labelAr: 'ارتبطت بشخص خارج التطبيق',
    hintFr: 'Nous vous souhaitons beaucoup de bonheur dans votre vie.',
    hintAr: 'نتمنى لك التوفيق والسعادة في مسيرتك.',
    defaultExplanationFr: "J'ai fait une rencontre en dehors de l'application et je souhaite clore mon profil.",
    defaultExplanationAr: 'ارتبطت بشخص خارج التطبيق وأرغب في إنهاء حسابي هنا.',
  },
  {
    id: 'taking_a_break',
    emoji: '⏳',
    labelFr: "Je fais une pause / Arrêt temporaire de mes recherches",
    labelAr: 'أريد أخذ استراحة والتوقف مؤقتاً عن البحث',
    hintFr: 'Vous serez toujours le bienvenu si vous souhaitez revenir.',
    hintAr: 'مرحباً بك دائماً إذا رغبت في العودة مستقبلاً.',
    defaultExplanationFr: 'Je souhaite faire une pause temporaire dans mes recherches de mariage.',
    defaultExplanationAr: 'أريد أخذ استراحة مؤقتة والتوقف عن البحث في الوقت الحالي.',
  },
  {
    id: 'few_matches_wilaya',
    emoji: '📍',
    labelFr: 'Pas assez de profils compatibles dans ma wilaya ou région',
    labelAr: 'قلة الملفات المتوافقة في ولايتي أو منطقتي',
    hintFr: 'Nous continuons d’accueillir chaque jour de nouveaux membres.',
    hintAr: 'نواصل استقبال مئات الأعضاء الجدد يومياً من كل الولايات.',
    defaultExplanationFr: 'Je recherche des profils plus proches de ma région ou de ma wilaya de résidence.',
    defaultExplanationAr: 'أبحث عن ملفات أقرب لمنطقتي الجغرافية أو ولايتي.',
  },
  {
    id: 'privacy_concerns',
    emoji: '🛡️',
    labelFr: 'Soucis de confidentialité ou protection de ma vie privée',
    labelAr: 'دواعي الخصوصية وحماية المعطيات الشخصية',
    hintFr: 'Vos données actuelles seront intégralement détruites.',
    hintAr: 'سيتم مسح بياناتك الحالية بالكامل فور التأكيد.',
    defaultExplanationFr: 'Je préfère préserver ma confidentialité et retirer mes informations personnelles.',
    defaultExplanationAr: 'أفضل الحفاظ على خصوصيتي التامة وحذف بياناتي الشخصية.',
  },
  {
    id: 'unwanted_behavior',
    emoji: '⚠️',
    labelFr: 'Mauvaise expérience ou membre irrespectueux',
    labelAr: 'تجربة غير مرضية أو تلقي تصرفات غير لائقة',
    hintFr: 'N’hésitez pas à préciser pour que nous puissions sanctionner.',
    hintAr: 'يرجى التوضيح لنتمكن من اتخاذ الإجراءات التأديبية.',
    defaultExplanationFr: "J'ai rencontré des comportements non constructifs et je préfère me retirer.",
    defaultExplanationAr: 'صادفت تصرفات غير مناسبة وأفضل الانسحاب من المنصة.',
  },
  {
    id: 'technical_app_issues',
    emoji: '📱',
    labelFr: 'Difficultés techniques ou bugs dans l’application',
    labelAr: 'صعوبة في الاستخدام أو مشاكل تقنية بالتطبيق',
    hintFr: 'Nos équipes techniques prennent vos retours très au sérieux.',
    hintAr: 'فريقنا التقني يعمل باستمرار على إصلاح وتحسين الأداء.',
    defaultExplanationFr: "J'ai rencontré des difficultés d'utilisation de l'interface sur mon appareil.",
    defaultExplanationAr: 'واجهت صعوبة في استخدام بعض أجزاء التطبيق على جهازي.',
  },
  {
    id: 'other_personal',
    emoji: '💬',
    labelFr: 'Autre raison personnelle',
    labelAr: 'سبب شخصي آخر',
    hintFr: 'Merci de nous en dire un peu plus ci-dessous.',
    hintAr: 'نشكرك على مشاركة التفاصيل معنا لمساعدتنا.',
    defaultExplanationFr: 'Raisons personnelles diverses me poussant à cesser mon utilisation.',
    defaultExplanationAr: 'أسباب شخصية خاصة تدفعني للتوقف عن الاستخدام.',
  },
];

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onConfirmDelete: (reasonId: string, reasonLabel: string, explanation: string) => void;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  currentUser,
  onConfirmDelete,
}: DeleteAccountModalProps) {
  const { isArabic } = useLanguage();
  // Pré-sélectionner le premier motif pour que l'action soit immédiatement prête
  const [selectedReasonId, setSelectedReasonId] = useState<string>(
    WITHDRAWAL_REASONS[0].id
  );
  const [explanation, setExplanation] = useState<string>(
    isArabic
      ? WITHDRAWAL_REASONS[0].defaultExplanationAr
      : WITHDRAWAL_REASONS[0].defaultExplanationFr
  );
  const [hasConfirmedCheckbox, setHasConfirmedCheckbox] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationAlert, setValidationAlert] = useState<string | null>(null);

  // Synchronisation systématique à chaque ouverture de la modale
  useEffect(() => {
    if (isOpen) {
      setSelectedReasonId(WITHDRAWAL_REASONS[0].id);
      setExplanation(
        isArabic
          ? WITHDRAWAL_REASONS[0].defaultExplanationAr
          : WITHDRAWAL_REASONS[0].defaultExplanationFr
      );
      setHasConfirmedCheckbox(true);
      setIsSubmitting(false);
      setValidationAlert(null);
    }
  }, [isOpen, isArabic]);

  if (!isOpen) return null;

  const selectedReasonObj =
    WITHDRAWAL_REASONS.find((r) => r.id === selectedReasonId) || WITHDRAWAL_REASONS[0];

  const handleSelectReason = (reason: WithdrawalReasonOption) => {
    try {
      datingSounds.playTapSound();
    } catch {}
    setSelectedReasonId(reason.id);
    setValidationAlert(null);

    // Si l'explication est vide ou correspondait à l'ancienne valeur par défaut, on met à jour automatiquement
    const isDefaultPrevious = WITHDRAWAL_REASONS.some(
      (r) =>
        r.defaultExplanationFr === explanation.trim() ||
        r.defaultExplanationAr === explanation.trim()
    );

    if (!explanation.trim() || isDefaultPrevious) {
      setExplanation(
        isArabic ? reason.defaultExplanationAr : reason.defaultExplanationFr
      );
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      try {
        e.preventDefault();
      } catch {}
    }
    if (isSubmitting) return;

    const activeReason =
      selectedReasonObj ||
      WITHDRAWAL_REASONS.find((r) => r.id === selectedReasonId) ||
      WITHDRAWAL_REASONS[0];

    const finalExplanation =
      explanation.trim() ||
      (isArabic
        ? activeReason.defaultExplanationAr
        : activeReason.defaultExplanationFr);

    const finalReasonLabel = isArabic
      ? activeReason.labelAr
      : activeReason.labelFr;

    try {
      datingSounds.playTapSound();
    } catch {}

    setIsSubmitting(true);
    try {
      // Exécution immédiate et sans blocage
      onConfirmDelete(activeReason.id, finalReasonLabel, finalExplanation);
    } catch (err) {
      console.error('Erreur lors de la suppression du compte:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="delete-account-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div
        id="delete-account-modal-container"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-red-50/60 dark:bg-red-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isArabic ? 'حق الانسحاب وحذف الحساب نهائياً' : 'Droit de retrait & Suppression de compte'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isArabic
                  ? 'يمكنك سحب ملفك في أي وقت، مع إلزامية توضيح السبب لمساعدتنا على التحسين'
                  : 'Vous avez le droit de vous retirer, en expliquant obligatoirement votre motif'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* User badge summary */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.pseudo}
                className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-600 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                  {currentUser.pseudo}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                  {currentUser.city} • {currentUser.email}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shrink-0">
              {isArabic ? 'حذف نهائي' : 'Suppression'}
            </span>
          </div>

          {/* Section 1: Motif de départ (Obligatoire) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-[11px] font-bold flex items-center justify-center">
                  1
                </span>
                <span>{isArabic ? 'اختر سبب المغادرة (إجباري) :' : '1. Choisissez le motif de votre départ (Obligatoire) :'}</span>
              </label>
              <span className="text-[11px] font-bold text-red-500">* {isArabic ? 'مطلوب' : 'Requis'}</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {WITHDRAWAL_REASONS.map((reason) => {
                const isSelected = selectedReasonId === reason.id;
                return (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => handleSelectReason(reason)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-slate-900 dark:text-white ring-2 ring-red-500/20'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="text-xl shrink-0 mt-0.5">{reason.emoji}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-black">
                          {isArabic ? reason.labelAr : reason.labelFr}
                        </div>
                        {(reason.hintFr || reason.hintAr) && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {isArabic ? reason.hintAr : reason.hintFr}
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                        isSelected
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Explications détaillées (Obligatoire) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <span>
                  {isArabic
                    ? 'اشرح لنا سبب قرارك بالتفصيل (إجباري) :'
                    : '2. Expliquez les raisons de votre départ (Obligatoire) :'}
                </span>
              </label>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                {isArabic ? 'جاهز للتأكيد' : 'Explication prête'}
              </span>
            </div>

            <textarea
              value={explanation}
              onChange={(e) => {
                setExplanation(e.target.value);
                setValidationAlert(null);
              }}
              placeholder={
                isArabic
                  ? 'يرجى كتابة سبب رغبتك في حذف الحساب بالتفصيل لمساعدتنا على تحسين المنصة وتفادي النقائص...'
                  : 'Veuillez nous expliquer en quelques mots votre décision. Vos retours sont indispensables pour nous améliorer...'
              }
              rows={3}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none transition-all"
            />

            {validationAlert && (
              <p className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1 animate-bounce">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{validationAlert}</span>
              </p>
            )}
          </div>

          {/* Section 3: Avertissement et engagement irréversible */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                {isArabic
                  ? 'تنبيه هام حول عواقب الحذف النهائي :'
                  : 'Conséquences de la suppression définitive :'}
              </span>
            </div>
            <ul className="text-[11px] text-amber-700 dark:text-amber-300/90 space-y-1 list-disc list-inside ps-1">
              <li>
                {isArabic
                  ? 'سيتم مسح صورك، سيرتك الصوتية، وفيديوهات التعريف فوراً.'
                  : 'Vos photos, présentations vidéo et bio audio seront définitivement supprimées.'}
              </li>
              <li>
                {isArabic
                  ? 'سيتم إلغاء جميع المطابقات والمحادثات الخاصة والمشاركات.'
                  : 'Tous vos matchs, conversations privées et interactions seront effacés.'}
              </li>
              <li>
                {isArabic
                  ? 'لن يمكنك استرجاع الحساب بعد تأكيد الحذف.'
                  : 'Cette opération est irréversible, le compte ne pourra pas être restauré.'}
              </li>
            </ul>

            <label className="flex items-start gap-2.5 pt-2 border-t border-amber-500/20 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConfirmedCheckbox}
                onChange={(e) => setHasConfirmedCheckbox(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-red-600 focus:ring-red-500 border-slate-300 dark:border-slate-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 select-none">
                {isArabic
                  ? 'أؤكد رغبتي في ممارسة حق الانسحاب وحذف حسابي وبياناتي نهائياً.'
                  : 'Je confirme vouloir exercer mon droit de retrait et supprimer définitivement mon compte et mes données.'}
              </span>
            </label>
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="shrink-0 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            id="btn-cancel-delete-account"
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            {isArabic ? 'إلغاء والاحتفاظ بحسابي' : 'Annuler et rester sur Nisfy'}
          </button>

          <button
            id="btn-confirm-delete-account"
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 active:scale-95 text-white text-xs font-black shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserX className="w-4 h-4" />
            <span>
              {isSubmitting
                ? isArabic
                  ? 'جارٍ حذف الحساب...'
                  : 'Suppression en cours...'
                : isArabic
                ? 'تأكيد الانسحاب وحذف الحساب'
                : 'Confirmer mon retrait & Supprimer mon compte'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
