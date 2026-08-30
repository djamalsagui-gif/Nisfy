import React, { useState } from 'react';
import { ShieldCheck, Mail, Phone, Fingerprint, Camera, X, CheckCircle2, ChevronRight, AlertCircle, Shield } from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TrustVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
}

export function TrustVerificationModal({ isOpen, onClose, currentUser, onUpdateUser }: TrustVerificationModalProps) {
  const { isArabic } = useLanguage();
  
  // Local state to simulate verification progress
  const [step, setStep] = useState<'overview' | 'phone' | 'identity'>('overview');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentStatus = currentUser.verificationStatus || {
    email: true, // Assuming true if they are logged in via magic link
    phone: false,
    identity: false,
    social: false,
  };

  const calculateScore = () => {
    let score = 0;
    if (currentStatus.email) score += 20;
    if (currentStatus.phone) score += 30;
    if (currentStatus.identity) score += 50;
    return score;
  };

  const currentScore = calculateScore();

  const getScoreLabel = (score: number) => {
    if (score < 50) return { label: isArabic ? 'ضعيف' : 'Faible', color: 'text-red-500', bg: 'bg-red-100', bar: 'bg-red-500' };
    if (score < 80) return { label: isArabic ? 'متوسط' : 'Moyen', color: 'text-amber-500', bg: 'bg-amber-100', bar: 'bg-amber-500' };
    return { label: isArabic ? 'ممتاز' : 'Excellent', color: 'text-emerald-500', bg: 'bg-emerald-100', bar: 'bg-emerald-500' };
  };

  const scoreInfo = getScoreLabel(currentScore);

  const simulateVerification = (type: 'phone' | 'identity') => {
    setIsProcessing(true);
    setTimeout(() => {
      const updatedStatus = { ...currentStatus, [type]: true };
      let newScore = 0;
      if (updatedStatus.email) newScore += 20;
      if (updatedStatus.phone) newScore += 30;
      if (updatedStatus.identity) newScore += 50;

      const newLabel = newScore >= 100 ? 'Excellent' : (newScore >= 50 ? 'Moyen' : 'Faible');
      const newColor = newScore >= 100 ? '#22c55e' : (newScore >= 50 ? '#f59e0b' : '#ef4444');

      onUpdateUser({
        verificationStatus: updatedStatus,
        trustScore: { score: newScore, label: newLabel as any, color: newColor },
        verified: newScore >= 100, // Fully verified if 100
        hasBlueBadge: newScore >= 100 || currentUser.hasBlueBadge,
      });
      setIsProcessing(false);
      setStep('overview');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'overview' && (
          <div className="p-6 overflow-y-auto">
            <div className="flex flex-col items-center text-center space-y-3 mb-8">
              <div className="w-16 h-16 rounded-full bg-[#FF3823]/10 flex items-center justify-center text-[#FF3823]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {isArabic ? 'مؤشر الثقة' : 'Trust Score'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isArabic 
                  ? 'أكمل التحقق من هويتك للحصول على الشارة الزرقاء وزيادة فرص التطابق.'
                  : 'Complétez votre vérification pour obtenir le badge bleu et rassurer la communauté.'}
              </p>
            </div>

            {/* Score Ring */}
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="12" fill="none" />
                  <circle 
                    cx="64" cy="64" r="56" 
                    className={`stroke-current ${scoreInfo.color} transition-all duration-1000 ease-out`}
                    strokeWidth="12" 
                    fill="none" 
                    strokeDasharray="351.8" 
                    strokeDashoffset={351.8 - (351.8 * currentScore) / 100}
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="flex flex-col items-center justify-center text-center z-10">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{currentScore}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${scoreInfo.bg} ${scoreInfo.color} uppercase tracking-wider mt-1`}>
                    {scoreInfo.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Email */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center gap-4 border border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Email</h4>
                  <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              </div>

              {/* Phone */}
              <button 
                disabled={currentStatus.phone}
                onClick={() => setStep('phone')}
                className={`w-full text-left bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center gap-4 border ${currentStatus.phone ? 'border-emerald-100 dark:border-emerald-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-[#FF3823] transition-colors group cursor-pointer'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${currentStatus.phone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 group-hover:bg-[#FF3823]/10 group-hover:text-[#FF3823]'}`}>
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{isArabic ? 'رقم الهاتف' : 'Numéro de téléphone'}</h4>
                  <p className="text-xs text-slate-500">{isArabic ? 'يزيد الثقة بنسبة +30%' : '+30% au Trust Score'}</p>
                </div>
                {currentStatus.phone ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#FF3823]" />
                )}
              </button>

              {/* Identity */}
              <button 
                disabled={currentStatus.identity}
                onClick={() => setStep('identity')}
                className={`w-full text-left bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center gap-4 border ${currentStatus.identity ? 'border-emerald-100 dark:border-emerald-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-[#FF3823] transition-colors group cursor-pointer'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${currentStatus.identity ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 group-hover:bg-[#FF3823]/10 group-hover:text-[#FF3823]'}`}>
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{isArabic ? 'تأكيد الهوية (Selfie)' : 'Vérification d\'Identité'}</h4>
                  <p className="text-xs text-slate-500">{isArabic ? 'يزيد الثقة بنسبة +50%' : '+50% au Trust Score'}</p>
                </div>
                {currentStatus.identity ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#FF3823]" />
                )}
              </button>
            </div>
            
            {currentScore === 100 && (
              <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 flex items-start gap-3 border border-emerald-100 dark:border-emerald-900/50">
                <Shield className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-400">{isArabic ? 'الملف الشخصي موثق بالكامل' : 'Profil vérifié à 100%'}</h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1">
                    {isArabic 
                      ? 'تهانينا! حسابك موثق الآن ويحمل الشارة الزرقاء. سيتم إعطاؤك الأولوية في الخوارزميات.'
                      : 'Félicitations ! Votre profil est vérifié et certifié. Vous bénéficiez désormais d\'une priorité dans l\'algorithme de matching.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'phone' && (
          <div className="p-6 flex flex-col h-full text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-900 dark:text-white mb-6">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              {isArabic ? 'التحقق من رقم الهاتف' : 'Vérification du téléphone'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              {isArabic ? 'سرسل لك رسالة قصيرة تحتوي على رمز سري.' : 'Nous allons vous envoyer un SMS avec un code de vérification.'}
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-8">
              <div className="flex items-center text-slate-500 text-sm">
                <span className="font-bold text-slate-900 dark:text-white px-3 border-r border-slate-300 dark:border-slate-600">+213</span>
                <input type="tel" placeholder="555 12 34 56" className="w-full bg-transparent border-none focus:ring-0 px-4 text-slate-900 dark:text-white font-bold" />
              </div>
            </div>
            <div className="mt-auto">
              <button 
                onClick={() => simulateVerification('phone')}
                disabled={isProcessing}
                className="w-full bg-[#FF3823] hover:bg-[#E0311E] text-white py-3.5 rounded-full font-bold shadow-md shadow-[#FF3823]/30 transition-all flex items-center justify-center disabled:opacity-50"
              >
                {isProcessing ? (isArabic ? 'جاري التحقق...' : 'Vérification...') : (isArabic ? 'إرسال الرمز' : 'Envoyer le code')}
              </button>
              <button onClick={() => setStep('overview')} className="w-full mt-3 text-sm text-slate-500 font-bold py-2">
                {isArabic ? 'إلغاء' : 'Annuler'}
              </button>
            </div>
          </div>
        )}

        {step === 'identity' && (
          <div className="p-6 flex flex-col h-full text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-900 dark:text-white mb-6">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              {isArabic ? 'التحقق من الهوية' : 'Vérification d\'identité'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              {isArabic 
                ? 'التقط صورة شخصية (سيلفي) لتأكيد تطابقك مع صور ملفك الشخصي.' 
                : 'Prenez un selfie vidéo rapide pour confirmer que vous correspondez à vos photos.'}
            </p>
            
            <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl aspect-[3/4] mb-8 border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center overflow-hidden relative">
              {isProcessing ? (
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-[#FF3823]/30 border-t-[#FF3823] rounded-full animate-spin mb-4"></div>
                  <span className="text-white font-bold">{isArabic ? 'جاري تحليل الصورة (IA)...' : 'Analyse IA en cours...'}</span>
                </div>
              ) : (
                <>
                  <Camera className="w-10 h-10 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500 font-bold">{isArabic ? 'انقر لفتح الكاميرا' : 'Ouvrir la caméra'}</span>
                </>
              )}
            </div>
            
            <div className="mt-auto">
              <button 
                onClick={() => simulateVerification('identity')}
                disabled={isProcessing}
                className="w-full bg-[#FF3823] hover:bg-[#E0311E] text-white py-3.5 rounded-full font-bold shadow-md shadow-[#FF3823]/30 transition-all flex items-center justify-center disabled:opacity-50"
              >
                {isProcessing ? (isArabic ? 'جاري التحقق...' : 'Vérification...') : (isArabic ? 'بدء التحقق' : 'Démarrer')}
              </button>
              <button onClick={() => setStep('overview')} disabled={isProcessing} className="w-full mt-3 text-sm text-slate-500 font-bold py-2 disabled:opacity-50">
                {isArabic ? 'إلغاء' : 'Annuler'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
