import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  Zap,
  Eye,
  Shield,
  Flower2,
  Check,
  X,
  Star,
  Coins,
  Heart,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { datingSounds } from '../utils/soundEffects';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpgradeSuccess: (updatedUser: UserProfile, message: string) => void;
}

export function PremiumModal({
  isOpen,
  onClose,
  currentUser,
  onUpgradeSuccess,
}: PremiumModalProps) {
  const { isArabic } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<'gold' | 'vip'>('vip');
  const [selectedCreditPack, setSelectedCreditPack] = useState<number>(25);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = (plan: 'gold' | 'vip') => {
    setIsProcessing(true);
    datingSounds.playTapSound();

    setTimeout(() => {
      setIsProcessing(false);
      const isVip = plan === 'vip';
      const updated: UserProfile = {
        ...currentUser,
        seriousnessScore: 100,
        marriageVerified: true,
      };

      datingSounds.playMatchSound();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: isVip ? ['#e11d48', '#f59e0b', '#10b981', '#fbbf24'] : ['#f59e0b', '#fbbf24', '#fef08a'],
      });

      const message = isArabic
        ? `تهانينا ! تم تفعيل اشتراك ${plan === 'vip' ? 'Nisfy VIP 👑' : 'Nisfy Gold ⭐'} بنجاح.`
        : `Félicitations ! Votre abonnement ${plan === 'vip' ? 'Nisfy VIP 👑' : 'Nisfy Gold ⭐'} est maintenant actif.`;

      onUpgradeSuccess(updated, message);
      onClose();
    }, 800);
  };

  const handleBuyCredits = (credits: number) => {
    setIsProcessing(true);
    datingSounds.playTapSound();

    setTimeout(() => {
      setIsProcessing(false);
      const currentLikes = currentUser.likesCount || 0;
      const updated: UserProfile = {
        ...currentUser,
        likesCount: currentLikes + credits,
      };

      datingSounds.playMatchSound();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#10b981'],
      });

      const message = isArabic
        ? `تم شحن ${credits} نقطة/ياسمينة بنجاح إلى رصيدك ! 🌸`
        : `Pack de ${credits} crédits & jasmins ajouté avec succès à votre compte ! 🌸`;

      onUpgradeSuccess(updated, message);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-rose-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 p-6 sm:p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-inner">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/30 text-amber-100 text-[10px] font-black uppercase tracking-wider border border-amber-300/40">
                {isArabic ? 'باقات وعضويات NISFY' : 'Abonnements & Avantages Premium'}
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                {isArabic ? 'ارتقِ بتجربتك مع Nisfy Gold & VIP' : 'Passez à la vitesse supérieure'}
              </h2>
            </div>
          </div>
          <p className="text-xs text-rose-100 mt-2 max-w-lg">
            {isArabic
              ? 'احصل على إمكانية إرسال سوبر لايك وزهور الياسمين غير محدودة، وتصدر قوائم الـ 69 ولاية، ومعرفة من زار بروفايلك.'
              : 'Multipliez vos chances de mariage : Super Likes et Jasmins illimités, priorité dans les 69 wilayas et mode discret.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Plan Selection Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nisfy Gold */}
            <div
              onClick={() => setSelectedPlan('gold')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedPlan === 'gold'
                  ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Nisfy Gold</h3>
                </div>
                <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                  5 € <span className="text-[11px] font-medium text-slate-500">/ mois</span>
                </span>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isArabic ? 'سوبر لايك وياسمين يومي' : 'Super Likes & Jasmins quotidiens'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isArabic ? 'معرفة من أرسل لك إعجاب' : 'Voir qui a aimé votre profil'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isArabic ? '5 مرات رفع البروفايل في الشهر (Boost)' : '5 Boosts de visibilité / mois'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isArabic ? 'تصفح بدون إعلانات' : 'Navigation 100% sans publicité'}</span>
                </li>
              </ul>
            </div>

            {/* Nisfy VIP */}
            <div
              onClick={() => setSelectedPlan('vip')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedPlan === 'vip'
                  ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-md ring-2 ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-rose-300'
              }`}
            >
              <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                {isArabic ? 'الأكثر طلباً' : 'Recommandé'}
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-rose-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Nisfy VIP</h3>
                </div>
                <span className="text-base font-extrabold text-rose-600 dark:text-rose-400">
                  10 € <span className="text-[11px] font-medium text-slate-500">/ mois</span>
                </span>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-300">
                  <Check className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{isArabic ? 'كل ميزات Gold بالإضافة إلى :' : 'Tous les avantages Gold +'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isArabic ? 'شارة العضوية الملكية VIP 👑' : 'Badge Officiel VIP 👑'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isArabic ? 'أولوية الظهور في كل الـ 69 ولاية' : 'Priorité absolue dans les 69 wilayas'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isArabic ? 'دخول صالونات النقاش المغلقة' : 'Accès aux salons privés exclusifs'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isArabic ? 'وضع التصفح الخفي (Incognito)' : 'Mode Incognito activable'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Activate Subscription Button */}
          <button
            onClick={() => handleSubscribe(selectedPlan)}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white font-black text-sm shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Crown className="w-4 h-4" />
            <span>
              {isProcessing
                ? (isArabic ? 'جاري تفعيل الاشتراك...' : 'Activation en cours...')
                : (isArabic
                    ? `تفعيل باقة ${selectedPlan === 'vip' ? 'Nisfy VIP' : 'Nisfy Gold'} الآن`
                    : `Activer ${selectedPlan === 'vip' ? 'Nisfy VIP' : 'Nisfy Gold'} maintenant`)}
            </span>
          </button>

          {/* Credit Packs Section (À la carte) */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">
                  {isArabic ? 'شحن نقاط ورصيد الياسمين (A la carte)' : 'Packs de Crédits & Jasmins'}
                </h4>
              </div>
              <span className="text-[11px] text-slate-500">
                {isArabic ? 'بدون التزام شهري' : 'Sans abonnement récurrent'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { credits: 10, price: '5 €', desc: isArabic ? '10 ياسمينات' : '10 crédits' },
                { credits: 25, price: '10 €', desc: isArabic ? '25 ياسمينة' : '25 crédits', pop: true },
                { credits: 50, price: '15 €', desc: isArabic ? '50 ياسمينة' : '50 crédits' },
              ].map((pack) => (
                <button
                  key={pack.credits}
                  type="button"
                  onClick={() => handleBuyCredits(pack.credits)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    pack.pop
                      ? 'border-amber-400 bg-amber-50/70 dark:bg-amber-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <p className="text-xs font-black text-slate-900 dark:text-white">{pack.desc}</p>
                  <p className="text-sm font-extrabold text-rose-600 dark:text-rose-400 mt-1">{pack.price}</p>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {isArabic ? 'شحن فوري' : 'Acheter'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
