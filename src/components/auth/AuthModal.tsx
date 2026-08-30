import React, { useState, useEffect } from 'react';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Check,
  User,
  Zap,
  RotateCcw,
  Trash2,
  Lock,
  KeyRound,
  BadgeCheck,
  Smartphone,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { UserProfile, RememberedAccount } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { WILAYAS_69 } from '../../data/wilayas';
import { NisfyLogo } from '../NisfyLogo';
import {
  getRememberedAccount,
  saveRememberedAccount,
  clearRememberedAccount,
} from '../../utils/storage';
import {
  sendEmailOtp,
  verifyEmailOtp,
  syncUserProfileToSupabase,
  fetchUserProfileFromSupabase,
  isSupabaseConfigured,
} from '../../api/supabase';
import { SUPER_ADMIN_PROFILE, checkIsAdmin } from '../../utils/adsManager';

interface AuthModalProps {
  onLoginSuccess: (user: UserProfile) => void;
  registeredUsers: UserProfile[];
  onRegisterUser: (newUser: UserProfile) => void;
}

const INTEREST_TAGS = [
  { id: 'cuisine', label: 'Cuisine & Gastronomie DZ', icon: '🍳' },
  { id: 'voyages', label: 'Voyages & Découverte', icon: '✈️' },
  { id: 'documentaires', label: 'Culture & Documentaires', icon: '🎬' },
  { id: 'selfies', label: 'Moments & Selfies', icon: '🤳' },
  { id: 'mariage', label: 'Préparatifs Mariage & Zawaj', icon: '💍' },
  { id: 'nature', label: 'Nature & Randonnée', icon: '🌲' },
  { id: 'musique', label: 'Musique & Poésie', icon: '🎵' },
  { id: 'entrepreneuriat', label: 'Projets & Avenir', icon: '💼' },
];

export function AuthModal({
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
}: AuthModalProps) {
  const { isArabic } = useLanguage();
  const [rememberedAccount, setRememberedAccount] = useState<RememberedAccount | null>(() =>
    getRememberedAccount()
  );

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [emailInput, setEmailInput] = useState(''); // Email requis
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [showOtherLogin, setShowOtherLogin] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Remember preference for login & registration
  const [rememberMe, setRememberMe] = useState(true);
  const [rememberType, setRememberType] = useState<'pseudo' | 'email'>('email');

  // Registration data
  const [pseudo, setPseudo] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [verifiedUserId, setVerifiedUserId] = useState<string | null>(null);
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<'homme' | 'femme'>('femme');
  const [wilayaCode, setWilayaCode] = useState('16');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['mariage', 'cuisine']);
  const [matchedExistingUser, setMatchedExistingUser] = useState<UserProfile | null>(null);

  // Admin Login States & Handler
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState('7788');
  const [adminEmail, setAdminEmail] = useState('djamalsagui@gmail.com');
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  const handleDirectAdminLogin = (customEmail?: string, customPin?: string) => {
    setIsLoading(true);
    setAdminAuthError(null);
    setErrorMessage(null);

    const targetEmail = (customEmail || adminEmail).trim().toLowerCase();
    const pin = (customPin !== undefined ? customPin : adminPin).trim();

    // Check admin credentials
    const isMasterEmail = targetEmail === 'djamalsagui@gmail.com' || targetEmail === 'admin@nisfy.app';
    const isPinValid = !pin || pin === '7788' || pin === '2026' || checkIsAdmin(targetEmail, pin);

    if (isMasterEmail || isPinValid) {
      setTimeout(() => {
        const found =
          registeredUsers.find((u) => u.email && u.email.toLowerCase() === targetEmail) ||
          SUPER_ADMIN_PROFILE;
        onRegisterUser(found);

        if (rememberMe) {
          saveRememberedAccount({
            userId: found.id,
            identifier: found.email,
            type: 'email',
            pseudo: found.pseudo,
            email: found.email,
            avatar: found.avatar,
            city: found.city,
            wilayaCode: found.wilayaCode,
            gender: found.gender,
            savedAt: new Date().toISOString(),
            autoConnect: true,
          });
        }

        try {
          sessionStorage.setItem('nisfy_target_tab', 'admin');
        } catch {
          // ignore
        }
        onLoginSuccess(found);
        setIsLoading(false);
      }, 300);
    } else {
      setIsLoading(false);
      setAdminAuthError(
        isArabic
          ? 'رمز PIN الإداري غير صحيح (الافتراضي: 7788 أو 2026)'
          : 'Code PIN administrateur incorrect (Défaut: 7788 ou 2026)'
      );
    }
  };

  // Timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Validation d'email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  // 1-Click Fast Login using remembered account
  const handleQuickConnect = () => {
    if (!rememberedAccount) return;
    setIsLoading(true);

    setTimeout(() => {
      // Find full user profile in registered users
      const remEmail = (rememberedAccount.email || '').toLowerCase().trim();
      const remPseudo = (rememberedAccount.pseudo || '').toLowerCase().trim();
      const foundUser =
        registeredUsers.find(
          (u) =>
            u.id === rememberedAccount.userId ||
            (remEmail && u.email && u.email.toLowerCase().trim() === remEmail) ||
            (remPseudo && u.pseudo && u.pseudo.toLowerCase().trim() === remPseudo)
        ) || null;

      if (foundUser) {
        onLoginSuccess(foundUser);
      } else {
        // Reconstruct user profile from remembered data if needed
        const restoredUser: UserProfile = {
          id: rememberedAccount.userId || `user-${Date.now()}`,
          email: rememberedAccount.email,
          pseudo: rememberedAccount.pseudo,
          age: 26,
          gender: rememberedAccount.gender || 'femme',
          lookingFor: 'amour',
          city: rememberedAccount.city || 'Alger (16)',
          wilayaCode: rememberedAccount.wilayaCode || '16',
          avatar: rememberedAccount.avatar,
          photos: [rememberedAccount.avatar],
          bio: 'Membre Nisfy fidèle !',
          icebreaker: 'Salam ! Ravis de faire ta connaissance sur Nisfy 🇩🇿',
          interests: ['mariage', 'cuisine'],
          occupation: 'Membre vérifié',
          badges: ['verified_member'],
          hasBlueBadge: true,
          isPremium: false,
          isOnline: true,
          lastActive: 'Maintenant',
          verified: true,
        };
        onRegisterUser(restoredUser);
        onLoginSuccess(restoredUser);
      }
      setIsLoading(false);
    }, 600);
  };

  const handleForgetRememberedAccount = () => {
    clearRememberedAccount();
    setRememberedAccount(null);
    setShowOtherLogin(true);
  };

  // Step 1: Submit Email and Send Verification Code
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage(
        isArabic
          ? 'يرجى كتابة بريدك الإلكتروني'
          : 'Veuillez saisir votre adresse email'
      );
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMessage(
        isArabic
          ? 'يرجى إدخال بريد إلكتروني صالح (مثال: exemple@domaine.com)'
          : 'Veuillez saisir une adresse email valide (ex: contact@gmail.com)'
      );
      return;
    }

    // Direct Super-Admin Recognition: immediately route to Admin Login card
    if (
      cleanEmail === 'djamalsagui@gmail.com' ||
      cleanEmail === 'admin@nisfy.app' ||
      checkIsAdmin(cleanEmail)
    ) {
      setAdminEmail(cleanEmail);
      setAdminPin('7788');
      setShowAdminLogin(true);
      return;
    }

    setIsLoading(true);

    // Look up in existing registered users
    const existingUser = registeredUsers.find(
      (u) => u.email && u.email.toLowerCase().trim() === cleanEmail
    );
    setMatchedExistingUser(existingUser || null);

    // Send Real OTP through Supabase
    const result = await sendEmailOtp(cleanEmail);

    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(
        result.error?.toLowerCase().includes('rate limit')
          ? isArabic
            ? 'تم تجاوز الحد الأقصى لإرسال الرسائل حالياً في خادم البريد. يرجى إعداد SMTP في Supabase أو الانتظار قليلاً.'
            : 'Limite d’envoi d’emails atteinte par Supabase. Veuillez configurer le SMTP personnalisé dans Supabase ou patienter quelques minutes.'
          : result.error ||
              (isArabic
                ? 'تعذر إرسال رمز التحقق. يرجى التحقق من صحة البريد والمحاولة ثانية.'
                : 'Impossible d’envoyer le code. Veuillez vérifier l’adresse email et réessayer.')
      );
      return;
    }

    setVerifiedEmail(cleanEmail);
    setResendCooldown(60);
    setOtp('');
    
    if (result.mocked) {
      setInfoMessage(
        isArabic 
          ? `⚠️ وضع العرض: تم تجاوز الحد الأقصى للإيميلات. أدخل الرمز 123456 للدخول.`
          : `⚠️ Mode Demo : Limite d'emails atteinte. Utilisez le code 123456 pour continuer.`
      );
    } else {
      setInfoMessage(
        isArabic
          ? `تم إرسال رمز التحقق إلى: ${cleanEmail}`
          : `Un code de vérification a été envoyé à : ${cleanEmail}`
      );
    }
    setStep(2); // Go to OTP verification step
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !verifiedEmail) return;
    setIsLoading(true);
    setErrorMessage(null);

    const result = await sendEmailOtp(verifiedEmail);
    setIsLoading(false);

    if (result.success) {
      setResendCooldown(60);
      if (result.mocked) {
        setInfoMessage(
          isArabic 
            ? `⚠️ وضع العرض: أدخل الرمز 123456 للدخول.`
            : `⚠️ Mode Demo : Utilisez le code 123456 pour continuer.`
        );
      } else {
        setInfoMessage(
          isArabic
            ? 'تم إرسال رمز جديد إلى بريدك الإلكتروني'
            : 'Un nouveau code a été envoyé à votre adresse email'
        );
      }
    } else {
      setErrorMessage(
        result.error ||
          (isArabic
            ? 'Erreur lors du renvoi du code'
            : 'Erreur lors du renvoi du code')
      );
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanOtp = otp.trim().replace(/\s+/g, '').replace(/-/g, '');

    // Check if entered code matches Master Admin PINs
    const isMasterPin =
      cleanOtp === '7788' ||
      cleanOtp === '2026' ||
      cleanOtp === '778800' ||
      cleanOtp === '202600';
    const cleanVerifiedEmail = (verifiedEmail || '').toLowerCase().trim();
    const isSuperAdminEmail =
      cleanVerifiedEmail === 'djamalsagui@gmail.com' ||
      cleanVerifiedEmail === 'admin@nisfy.app' ||
      checkIsAdmin(cleanVerifiedEmail);

    if (isMasterPin || (isSuperAdminEmail && cleanOtp.length >= 4)) {
      const adminUser =
        registeredUsers.find(
          (u) => u.email && u.email.toLowerCase().trim() === cleanVerifiedEmail
        ) || SUPER_ADMIN_PROFILE;
      onRegisterUser(adminUser);
      if (rememberMe) {
        saveRememberedAccount({
          userId: adminUser.id,
          identifier: adminUser.email,
          type: 'email',
          pseudo: adminUser.pseudo,
          email: adminUser.email,
          avatar: adminUser.avatar,
          city: adminUser.city,
          wilayaCode: adminUser.wilayaCode,
          gender: adminUser.gender,
          savedAt: new Date().toISOString(),
          autoConnect: true,
        });
      }
      try {
        sessionStorage.setItem('nisfy_target_tab', 'admin');
      } catch {
        // ignore
      }
      onLoginSuccess(adminUser);
      return;
    }

    if (cleanOtp.length < 6 || cleanOtp.length > 8) {
      setErrorMessage(
        isArabic
          ? 'يرجى إدخال رمز التحقق المكون من 6 أو 8 أرقام المستلم في بريدك الإلكتروني'
          : 'Veuillez saisir le code de vérification reçu par email (6 ou 8 chiffres)'
      );
      return;
    }

    setIsLoading(true);

    // Verify token with Supabase Auth
    const verifyResult = await verifyEmailOtp(verifiedEmail, cleanOtp);

    setIsLoading(false);

    if (!verifyResult.success && isSupabaseConfigured()) {
      const isExpiredOrInvalid =
        verifyResult.error?.toLowerCase().includes('expired') ||
        verifyResult.error?.toLowerCase().includes('invalide') ||
        verifyResult.error?.toLowerCase().includes('token');

      setErrorMessage(
        isExpiredOrInvalid
          ? isArabic
            ? 'رمز التحقق منتهي الصلاحية أو غير صحيح. إذا طلبت أكثر من رمز، يرجى إدخال الرمز من آخر رسالة بريد إلكتروني وصلتك أو الضغط على "إعادة إرسال الرمز".'
            : 'Code incorrect ou expiré. Si vous avez demandé plusieurs codes, veillez à utiliser le code du TOUT DERNIER email reçu (les précédents sont automatiquement annulés).'
          : verifyResult.error ||
              (isArabic
                ? 'رمز التحقق غير صحيح. يرجى التأكد والمحاولة ثانية.'
                : 'Code de vérification incorrect. Veuillez vérifier et réessayer.')
      );
      return;
    }

    // Code verified!
    // 1. Check if user profile already exists in memory or in Supabase
    let existingProfile = matchedExistingUser;
    if (!existingProfile) {
      existingProfile =
        registeredUsers.find(
          (u) => u.email && u.email.toLowerCase().trim() === cleanVerifiedEmail
        ) || null;
    }

    if (!existingProfile && isSupabaseConfigured()) {
      // Lookup remote database
      const remote = await fetchUserProfileFromSupabase(verifiedEmail);
      if (remote) {
        existingProfile = remote;
        onRegisterUser(remote);
      }
    }

    if (existingProfile) {
      // User is already fully registered
      if (rememberMe) {
        saveRememberedAccount({
          userId: existingProfile.id,
          identifier:
            rememberType === 'pseudo'
              ? existingProfile.pseudo
              : existingProfile.email,
          type: rememberType,
          pseudo: existingProfile.pseudo,
          email: existingProfile.email,
          avatar: existingProfile.avatar,
          city: existingProfile.city,
          wilayaCode: existingProfile.wilayaCode,
          gender: existingProfile.gender,
          savedAt: new Date().toISOString(),
          autoConnect: true,
        });
      }
      onLoginSuccess(existingProfile);
    } else {
      // New user registration flow
      if (verifyResult.user?.id) {
        setVerifiedUserId(verifyResult.user.id);
      }
      setStep(3);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim()) {
      setErrorMessage(
        isArabic ? 'يرجى كتابة اسمك المستعار' : 'Veuillez renseigner votre pseudo'
      );
      return;
    }
    setStep(4);
  };

  // Step 4: Finalize registration & remember preference
  const handleFinalSubmit = async () => {
    if (selectedInterests.length === 0) return;

    setIsLoading(true);

    const selectedWilaya = WILAYAS_69.find((w) => w.code === wilayaCode);
    const city = selectedWilaya
      ? `${selectedWilaya.name} (${wilayaCode})`
      : 'Alger (16)';

    const newUser: UserProfile = {
      id: verifiedUserId || `user-${Date.now()}`,
      email: verifiedEmail,
      pseudo: pseudo.trim(),
      age,
      gender,
      lookingFor: 'amour',
      city,
      wilayaCode,
      avatar:
        gender === 'femme'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
      photos: [],
      bio: 'Nouveau membre vérifié sur Nisfy !',
      icebreaker: 'Salam ! Ravis de faire ta connaissance sur Nisfy 🇩🇿',
      interests: selectedInterests,
      occupation: 'Membre Nisfy',
      badges: ['new', 'verified_member'],
      hasBlueBadge: true,
      isPremium: false,
      isOnline: true,
      lastActive: 'Maintenant',
      verified: true,
    };

    // Sync to Supabase cloud database
    await syncUserProfileToSupabase(newUser);

    // Save credentials for fast 1-click reconnect if user opted-in
    if (rememberMe) {
      saveRememberedAccount({
        userId: newUser.id,
        identifier: rememberType === 'pseudo' ? newUser.pseudo : newUser.email,
        type: rememberType,
        pseudo: newUser.pseudo,
        email: newUser.email,
        avatar: newUser.avatar,
        city: newUser.city,
        wilayaCode: newUser.wilayaCode,
        gender: newUser.gender,
        savedAt: new Date().toISOString(),
        autoConnect: true,
      });
    }

    setIsLoading(false);
    onRegisterUser(newUser);
    onLoginSuccess(newUser);
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800 my-auto">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#38BDF8] transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="p-6 pt-8 space-y-6">
          {/* Header Brand */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Nisfy
              </h2>
              <span className="text-2xl font-bold text-[#FF3823] font-serif">
                نصفي
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isArabic
                ? 'المنصة الجزائرية للزواج والتعارف الجاد عبر 69 ولاية'
                : 'Plateforme 100% DZ pour le mariage & les rencontres sérieuses'}
            </p>
          </div>

          {/* Error Message banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl space-y-2 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
              </div>
              {step === 2 && (
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setOtp('');
                      handleResendOtp();
                    }}
                    disabled={resendCooldown > 0 || isLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF3823] hover:opacity-90 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>
                      {resendCooldown > 0
                        ? `${isArabic ? 'إعادة الإرسال بعد' : 'Renvoyer dans'} ${resendCooldown}s`
                        : isArabic
                        ? 'طلب رمز جديد الآن'
                        : 'Demander un nouveau code'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Info Message banner */}
          {infoMessage && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{infoMessage}</div>
            </div>
          )}

          {/* ===== DEDICATED ADMIN LOGIN VIEW ===== */}
          {showAdminLogin ? (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 dark:from-amber-950/40 dark:to-orange-950/20 rounded-2xl border-2 border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-black">
                    <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{isArabic ? '👑 بوابة الإدارة العليا' : '👑 Espace Direction & Administration'}</span>
                  </div>
                  <span className="text-[11px] text-amber-700 dark:text-amber-300 font-bold">
                    {isArabic ? 'إعلانات • عقود • مدفوعات' : 'Pubs • Contrats • Paiements'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {isArabic ? 'تسجيل دخول المشرف العام' : 'Connexion Administrateur'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {isArabic
                      ? 'مخصص للمؤسس وإدارة نِصفي لمراجعة العقود الرسمية وتأكيد المدفوعات ونشر الإعلانات.'
                      : 'Accès réservé au Super Admin pour valider les contrats, suivre les virements et publier les annonces.'}
                  </p>
                </div>

                {/* Super Admin Quick Connect Banner */}
                <div className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-amber-300 dark:border-amber-800/60 shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-[#FF3823] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                      👑
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                        Djamal Sagui (Super Admin)
                      </p>
                      <p className="text-[11px] text-[#FF3823] dark:text-[#FF6B35] font-mono truncate">
                        djamalsagui@gmail.com
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDirectAdminLogin('djamalsagui@gmail.com', '7788')}
                    disabled={isLoading}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#FF3823] text-white text-xs font-black shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{isArabic ? 'دخول 1-نقرة' : '1-Clic Direct'}</span>
                  </button>
                </div>

                {/* Manual Admin Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleDirectAdminLogin();
                  }}
                  className="space-y-3 pt-1"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isArabic ? 'البريد الإلكتروني للإدارة' : 'Email Administrateur'}
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="djamalsagui@gmail.com"
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span>{isArabic ? 'رمز PIN الإداري السري' : 'Code PIN Secret Administrateur'}</span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Défaut: 7788 ou 2026</span>
                    </label>
                    <input
                      type="text"
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      placeholder="7788 ou 2026"
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono tracking-widest text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  {adminAuthError && (
                    <p className="text-xs font-bold text-[#FF3823] bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 dark:border-red-900">
                      {adminAuthError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-[#FF6B35] to-[#FF3823] text-white font-black text-xs shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{isArabic ? 'فتح لوحة الإعلانات والمدفوعات' : 'Ouvrir l’Espace Pubs & Paiements'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminAuthError(null);
                  }}
                  className="w-full py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'العودة لتسجيل دخول الأعضاء' : 'Retour à la connexion membres'}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
          {/* ===== STEP 1: EMAIL VERIFICATION REQUIRED ===== */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Remembered Account Quick Connect Card */}
              {rememberedAccount && !showOtherLogin ? (
                <div className="p-5 bg-gradient-to-br from-orange-50/70 via-amber-50/50 to-sky-50/50 dark:from-slate-800/90 dark:to-slate-800/40 rounded-2xl border-2 border-orange-200 dark:border-orange-900/50 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-[#FF3823] dark:text-[#FF6B35] text-xs font-black">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      {isArabic ? 'حساب محفوظ • دخول سريع' : 'Compte Mémorisé • 1-Clic'}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {isArabic ? 'محفوظ على جهازك' : 'Sur cet appareil'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 pt-1">
                    <div className="relative">
                      <img
                        src={rememberedAccount.avatar}
                        alt={rememberedAccount.pseudo}
                        className="w-14 h-14 rounded-full object-cover ring-4 ring-white dark:ring-slate-700 shadow-md"
                      />
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-base font-black text-slate-900 dark:text-white truncate">
                          {rememberedAccount.pseudo}
                        </h4>
                        <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {rememberedAccount.city || 'Algérie'}
                      </p>
                      <p className="text-[11px] text-[#FF3823] dark:text-[#FF6B35] font-semibold truncate">
                        {rememberedAccount.email}
                      </p>
                    </div>
                  </div>

                  {/* 1-Click Action Button */}
                  <button
                    onClick={handleQuickConnect}
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl shadow-lg shadow-orange-500/25 text-sm font-black text-white bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-current" />
                        {isArabic
                          ? `الدخول المباشر باسم ${rememberedAccount.pseudo}`
                          : `Se connecter directement en 1 clic`}
                      </>
                    )}
                  </button>

                  {/* Secondary Options */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setShowOtherLogin(true)}
                      className="text-slate-600 dark:text-slate-300 hover:text-[#FF3823] font-bold underline decoration-dotted transition-colors cursor-pointer"
                    >
                      {isArabic ? 'استخدام بريد إلكتروني آخر' : 'Utiliser une autre adresse email'}
                    </button>
                    <button
                      type="button"
                      onClick={handleForgetRememberedAccount}
                      className="text-slate-400 hover:text-[#FF3823] inline-flex items-center gap-1 transition-colors cursor-pointer"
                      title="Oublier cet appareil"
                    >
                      <Trash2 className="w-3 h-3" />
                      {isArabic ? 'نسيان الحساب' : 'Oublier'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Strict Email Authentication Form */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {rememberedAccount && showOtherLogin && (
                    <button
                      type="button"
                      onClick={() => setShowOtherLogin(false)}
                      className="w-full text-xs font-bold text-[#FF3823] hover:underline flex items-center justify-center gap-1.5 mb-2 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      {isArabic
                        ? `العودة لحساب ${rememberedAccount.pseudo} المحفوظ`
                        : `Revenir au profil mémorisé (${rememberedAccount.pseudo})`}
                    </button>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#FF3823]" />
                        {isArabic
                          ? 'البريد الإلكتروني الحقيقي (إجباري للتحقق)'
                          : 'Votre adresse Email réelle (Vérification obligatoire)'}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                        {isArabic ? 'حماية من الحسابات الوهمية' : 'Anti-faux profils'}
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => {
                          setEmailInput(e.target.value);
                          setErrorMessage(null);
                        }}
                        className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#FF3823] focus:border-transparent outline-none text-sm font-medium transition-all"
                        placeholder={
                          isArabic
                            ? 'exemple@gmail.com أو yahoo.fr'
                            : 'exemple : contact@gmail.com'
                        }
                        autoFocus
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isArabic
                        ? '📩 سنرسل رمز تحقق سري إلى بريدك للتأكد من هويتك ومصداقية الحساب.'
                        : '📩 Un code secret de confirmation vous sera envoyé par email pour valider votre compte.'}
                    </p>
                  </div>

                  {/* "Remember me" on this device toggle */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-[#FF3823] focus:ring-[#FF3823] border-slate-300"
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {isArabic
                          ? 'تذكرني على هذا الجهاز (دخول مباشر في المرة القادمة)'
                          : 'Mémoriser sur cet appareil (connexion directe en 1-clic)'}
                      </span>
                    </label>
                  </div>

                  {/* Detected Super-Admin Fast Shortcut */}
                  {emailInput.trim().toLowerCase() === 'djamalsagui@gmail.com' && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-xs animate-in fade-in">
                      <div className="flex items-center gap-2 font-black text-amber-800 dark:text-amber-300">
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>Compte Super-Administrateur Détecté !</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                        Accédez directement à la gestion des publicités, contrats et paiements sans attendre d'email.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDirectAdminLogin('djamalsagui@gmail.com', '7788')}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-[#FF3823] text-white font-black text-xs shadow-xs hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Connexion Directe Super-Admin (1 Clic)</span>
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !emailInput.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-orange-500/20 text-sm font-bold text-white bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        {isArabic ? 'إرسال رمز التحقق بالبريد' : 'Recevoir le code de vérification'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Quick Admin Access Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLogin(true);
                    setAdminEmail('djamalsagui@gmail.com');
                    setAdminPin('7788');
                    setErrorMessage(null);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/25 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{isArabic ? '👑 دخول المشرف العام (إدارة الإعلانات والمدفوعات)' : '👑 Accès Administrateur (Gestion des Pubs & Paiements)'}</span>
                </button>
              </div>

              {/* Security notice */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {isArabic
                    ? 'التحقق الإجباري بالبريد يضمن مجتمعاً حقيقياً وخالياً من الحسابات المزيفة'
                    : 'La vérification par email garantit une communauté authentique sans faux profils.'}
                </span>
              </div>
            </div>
          )}

          {/* ===== STEP 2: EMAIL OTP VERIFICATION (6 DIGITS) ===== */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in duration-200">
              <div className="text-center space-y-1.5 mb-3">
                <div className="inline-flex p-3.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl mb-1 shadow-sm">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isArabic ? 'أدخل رمز تأكيد البريد' : 'Vérifiez votre boîte Email'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {isArabic
                    ? `أدخل رمز التحقق المرسل إلى:`
                    : `Saisissez le code reçu sur votre adresse email :`}
                </p>
                <div className="inline-block px-3 py-1 bg-orange-50 dark:bg-orange-950/60 rounded-lg text-xs font-bold text-[#FF3823] dark:text-[#FF6B35] border border-orange-200/60 dark:border-orange-900/40">
                  {verifiedEmail}
                </div>
              </div>

              <div className="flex justify-center">
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={8}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    setErrorMessage(null);
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const text = e.clipboardData.getData('text');
                    const clean = text.replace(/\D/g, '').slice(0, 8);
                    setOtp(clean);
                    setErrorMessage(null);
                  }}
                  className="w-60 text-center text-2xl sm:text-3xl font-black tracking-[0.25em] py-3.5 border-2 border-orange-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white focus:border-[#FF3823] focus:ring-4 focus:ring-orange-500/20 outline-none transition-all shadow-inner"
                  placeholder="••••••"
                  autoFocus
                />
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-center">
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  {isArabic
                    ? '📩 أدخل رمز التحقق السري المستلم في بريدك الإلكتروني.'
                    : '📩 Saisissez le code secret reçu dans votre boîte email.'}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setErrorMessage(null);
                  }}
                  className="text-slate-500 hover:text-[#FF3823] font-medium underline cursor-pointer"
                >
                  {isArabic ? 'تغيير البريد الإلكتروني' : 'Modifier l’email'}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isLoading}
                  className="text-[#FF3823] dark:text-[#FF6B35] font-bold hover:underline disabled:opacity-50 inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                  {resendCooldown > 0
                    ? `${isArabic ? 'إعادة الإرسال بعد' : 'Renvoyer dans'} ${resendCooldown}s`
                    : isArabic
                    ? 'إعادة إرسال الرمز'
                    : 'Renvoyer un code'}
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {isArabic ? 'رجوع' : 'Retour'}
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6 || otp.length > 8}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-orange-500/20 text-sm font-bold text-white bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#38BDF8] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      {isArabic ? 'تأكيد ودخول' : 'Confirmer & Continuer'}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ===== STEP 3: PROFILE ESSENTIALS (WITH VERIFIED EMAIL BADGE) ===== */}
          {step === 3 && (
            <form
              onSubmit={handleProfileSubmit}
              className="space-y-4 animate-in fade-in duration-200"
            >
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {isArabic ? 'تم تأكيد البريد بنجاح ✓' : 'Email vérifié avec succès ✓'}
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-lg">
                  {isArabic ? 'إنشاء حساب عضو جديد' : 'Complétez votre profil Nisfy'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isArabic
                    ? 'اختر اسمك المستعار ومعلوماتك الأساسية'
                    : 'Choisissez votre pseudo public et votre wilaya'}
                </p>
              </div>

              {/* Verified Email Field (Read Only) */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>{isArabic ? 'البريد الإلكتروني الموثق' : 'Email vérifié'}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">✓ Certifié</span>
                </label>
                <div className="mt-1 flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="truncate flex-1">{verifiedEmail}</span>
                  <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>{isArabic ? 'الاسم المستعار (Pseudo)' : 'Pseudo public'}</span>
                  <span className="text-[10px] text-[#FF3823] dark:text-[#FF6B35] font-semibold">
                    {isArabic ? 'يظهر للأعضاء' : 'Visible par tous'}
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF3823] outline-none text-sm font-bold"
                  placeholder="ex: Yasmine_Oran ou Amine_Blida"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'العمر' : 'Âge'}
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="99"
                    required
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                    className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF3823] outline-none text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'الجنس' : 'Sexe'}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'homme' | 'femme')}
                    className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF3823] outline-none text-sm font-bold"
                  >
                    <option value="femme">{isArabic ? 'امرأة 👩' : 'Femme 👩'}</option>
                    <option value="homme">{isArabic ? 'رجل 👨' : 'Homme 👨'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'الولاية (69 ولاية + المهجر)' : 'Wilaya (69 Wilayas & Diaspora)'}
                </label>
                <select
                  value={wilayaCode}
                  onChange={(e) => setWilayaCode(e.target.value)}
                  className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF3823] outline-none text-sm font-bold"
                >
                  {WILAYAS_69.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code} - {w.name}
                    </option>
                  ))}
                  <option value="99">
                    {isArabic ? '99 - المهجر (الجالية بالخارج)' : '99 - Diaspora (Étranger)'}
                  </option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!pseudo.trim()}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#38BDF8] hover:opacity-90 transition-opacity disabled:opacity-50 mt-4 cursor-pointer"
              >
                {isArabic ? 'متابعة لاختيار الاهتمامات' : 'Continuer vers les options'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ===== STEP 4: INTERESTS & REMEMBER PREFERENCE ===== */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <h3 className="font-black text-slate-900 dark:text-white text-lg">
                  {isArabic ? 'الاهتمامات وخيارات الحفظ' : 'Centres d’intérêt & Mémorisation'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isArabic
                    ? 'اختر اهتماماتك المفضلة وسجل طريقة الدخول السريع'
                    : 'Personnalisez vos centres d’intérêt et finalisez votre inscription'}
                </p>
              </div>

              {/* Tag Selection */}
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {INTEREST_TAGS.map((tag) => {
                  const isSelected = selectedInterests.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleInterest(tag.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 text-xs cursor-pointer ${
                        isSelected
                          ? 'border-[#FF3823] bg-orange-50 dark:bg-orange-950/40 text-[#FF3823] dark:text-[#FF6B35] font-bold'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:border-orange-300'
                      }`}
                    >
                      <span className="text-base shrink-0">{tag.icon}</span>
                      <span className="truncate flex-1">{tag.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#FF3823] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* PROPOSAL: REMEMBER EMAIL OR PSEUDO FOR NEXT TIME */}
              <div className="p-4 bg-gradient-to-br from-amber-50/70 via-orange-50/50 to-sky-50/40 dark:from-slate-800 dark:to-slate-800/60 rounded-2xl border-2 border-orange-200 dark:border-orange-900/40 space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-gradient-to-tr from-[#FF6B35] to-[#FF3823] text-white rounded-lg shrink-0 mt-0.5 shadow-xs">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      {isArabic
                        ? 'حفظ بيانات الدخول المباشر'
                        : 'Connexion directe sans ressaisir'}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      {isArabic
                        ? 'هل ترغب في تسجيل حسابك لتدخل مباشرة في المرة القادمة دون كتابة بياناتك من جديد؟'
                        : 'Enregistrez votre compte pour vous connecter directement la prochaine fois en 1 clic.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1 border-t border-orange-200/60 dark:border-slate-700/60">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#FF3823] focus:ring-[#FF3823] border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {isArabic
                        ? 'نعم، احفظ حسابي على هذا الجهاز'
                        : 'Mémoriser mon compte sur cet appareil'}
                    </span>
                  </label>

                  {rememberMe && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setRememberType('pseudo')}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          rememberType === 'pseudo'
                            ? 'border-[#FF3823] bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span className="truncate">
                          {isArabic ? `بالاسم: @${pseudo}` : `Par Pseudo (@${pseudo})`}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRememberType('email')}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          rememberType === 'email'
                            ? 'border-[#FF3823] bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate">
                          {isArabic
                            ? `بالإيميل: ${verifiedEmail || 'Email'}`
                            : `Par Email (${verifiedEmail ? verifiedEmail.split('@')[0] : 'Email'})`}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-1/3 py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {isArabic ? 'تعديل' : 'Modifier'}
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={isLoading || selectedInterests.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-orange-500/25 text-sm font-black text-white bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#38BDF8] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {isArabic ? 'تأكيد والانطلاق ! 🇩🇿💍' : 'Créer mon compte & Démarrer !'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          </>
        )}
        </div>
      </div>
    </div>
  );
}

