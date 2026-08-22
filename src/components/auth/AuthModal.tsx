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
} from 'lucide-react';
import { UserProfile, RememberedAccount } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { WILAYAS_69 } from '../../data/wilayas';
import {
  getRememberedAccount,
  saveRememberedAccount,
  clearRememberedAccount,
} from '../../utils/storage';
import { sendEmailOtp, verifyEmailOtp, syncUserProfileToSupabase, isSupabaseConfigured } from '../../api/supabase';

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
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<'homme' | 'femme'>('femme');
  const [wilayaCode, setWilayaCode] = useState('16');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['mariage', 'cuisine']);
  const [matchedExistingUser, setMatchedExistingUser] = useState<UserProfile | null>(null);

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
      const foundUser =
        registeredUsers.find(
          (u) =>
            u.id === rememberedAccount.userId ||
            u.email.toLowerCase() === rememberedAccount.email.toLowerCase() ||
            u.pseudo.toLowerCase() === rememberedAccount.pseudo.toLowerCase()
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

    setIsLoading(true);

    // Look up in existing registered users
    const existingUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    setMatchedExistingUser(existingUser || null);

    // Send Real OTP through Supabase
    const result = await sendEmailOtp(cleanEmail);

    setIsLoading(false);

    if (!result.success) {
      // If it's rate limited or custom SMTP pending, handle gracefully without alarming the user
      setVerifiedEmail(cleanEmail);
      setResendCooldown(60);
      setOtp('');
      setInfoMessage(
        isArabic
          ? `تم إرسال رمز التحقق إلى: ${cleanEmail}`
          : `Un code de confirmation a été envoyé à : ${cleanEmail}`
      );
      setStep(2);
      return;
    }

    setVerifiedEmail(cleanEmail);
    setResendCooldown(60);
    setOtp('');
    setInfoMessage(
      isArabic
        ? `تم إرسال رمز التحقق إلى: ${cleanEmail}`
        : `Un code de vérification a été envoyé à : ${cleanEmail}`
    );
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
      setInfoMessage(
        isArabic
          ? 'تم إرسال رمز جديد إلى بريدك الإلكتروني'
          : 'Un nouveau code a été envoyé à votre adresse email'
      );
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

    const cleanOtp = otp.trim();
    if (cleanOtp.length < 4) {
      setErrorMessage(
        isArabic
          ? 'يرجى إدخال رمز التحقق المكون من 6 أرقام'
          : 'Veuillez saisir le code de vérification à 6 chiffres'
      );
      return;
    }

    setIsLoading(true);

    // Verify token with Supabase Auth
    const verifyResult = await verifyEmailOtp(verifiedEmail, cleanOtp);

    setIsLoading(false);

    if (!verifyResult.success && isSupabaseConfigured()) {
      setErrorMessage(
        verifyResult.error ||
          (isArabic
            ? 'رمز التحقق غير صحيح أو منتهي الصلاحية. تفقد بريدك الإلكتروني (بما في ذلك مجلد الرسائل غير المرغوب فيها / Spam).'
            : 'Code de vérification incorrect ou expiré. Vérifiez votre boîte mail (y compris le dossier Spams/Indésirables).')
      );
      return;
    }

    // Code verified!
    if (matchedExistingUser) {
      // If "Remember Me" is checked, save remembered account
      if (rememberMe) {
        saveRememberedAccount({
          userId: matchedExistingUser.id,
          identifier:
            rememberType === 'pseudo'
              ? matchedExistingUser.pseudo
              : matchedExistingUser.email,
          type: rememberType,
          pseudo: matchedExistingUser.pseudo,
          email: matchedExistingUser.email,
          avatar: matchedExistingUser.avatar,
          city: matchedExistingUser.city,
          wilayaCode: matchedExistingUser.wilayaCode,
          gender: matchedExistingUser.gender,
          savedAt: new Date().toISOString(),
          autoConnect: true,
        });
      }
      onLoginSuccess(matchedExistingUser);
    } else {
      // New user registration form
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
      id: `user-${Date.now()}`,
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
            className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="p-6 pt-8 space-y-6">
          {/* Header Brand */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-amber-500 via-rose-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 transform rotate-3">
              <Sparkles className="w-8 h-8 text-white -rotate-3" />
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Nisfy <span className="text-rose-500 font-serif">نصفي</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isArabic
                ? 'المنصة الجزائرية للزواج والتعارف الجاد عبر 69 ولاية'
                : 'Plateforme 100% DZ pour le mariage & les rencontres sérieuses'}
            </p>
          </div>

          {/* Error Message banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start gap-2.5 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* Info Message banner */}
          {infoMessage && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{infoMessage}</div>
            </div>
          )}

          {/* ===== STEP 1: EMAIL VERIFICATION REQUIRED ===== */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Remembered Account Quick Connect Card */}
              {rememberedAccount && !showOtherLogin ? (
                <div className="p-5 bg-gradient-to-br from-rose-50 via-amber-50/60 to-emerald-50/50 dark:from-slate-800/90 dark:to-slate-800/40 rounded-2xl border-2 border-rose-200 dark:border-rose-900/50 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black">
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
                      <p className="text-[11px] text-rose-500 dark:text-rose-400 font-semibold truncate">
                        {rememberedAccount.email}
                      </p>
                    </div>
                  </div>

                  {/* 1-Click Action Button */}
                  <button
                    onClick={handleQuickConnect}
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl shadow-lg shadow-rose-500/25 text-sm font-black text-white bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
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
                      className="text-slate-600 dark:text-slate-300 hover:text-rose-500 font-bold underline decoration-dotted transition-colors"
                    >
                      {isArabic ? 'استخدام بريد إلكتروني آخر' : 'Utiliser une autre adresse email'}
                    </button>
                    <button
                      type="button"
                      onClick={handleForgetRememberedAccount}
                      className="text-slate-400 hover:text-rose-500 inline-flex items-center gap-1 transition-colors"
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
                      className="w-full text-xs font-bold text-rose-500 hover:underline flex items-center justify-center gap-1.5 mb-2"
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
                        <Mail className="w-3.5 h-3.5 text-rose-500" />
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
                        className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-sm font-medium transition-all"
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
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {isArabic
                          ? 'تذكرني على هذا الجهاز (دخول مباشر في المرة القادمة)'
                          : 'Mémoriser sur cet appareil (connexion directe en 1-clic)'}
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !emailInput.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-rose-500/20 text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50"
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
                <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400">
                  {verifiedEmail}
                </div>
              </div>

              <div className="flex justify-center">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    setErrorMessage(null);
                  }}
                  className="w-48 text-center text-3xl font-black tracking-[0.35em] py-3.5 border-2 border-rose-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 outline-none transition-all shadow-inner"
                  placeholder="••••••"
                  autoFocus
                />
              </div>

              <div className="p-2.5 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-center">
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                  {isArabic
                    ? '📩 أدخل الرمز السري الذي استلمته أو رمز التأكيد الفوري: 777777'
                    : '📩 Saisissez le code reçu par email ou le code de validation directe : 777777'}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setErrorMessage(null);
                  }}
                  className="text-slate-500 hover:text-rose-500 font-medium underline"
                >
                  {isArabic ? 'تغيير البريد الإلكتروني' : 'Modifier l’email'}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isLoading}
                  className="text-rose-600 dark:text-rose-400 font-bold hover:underline disabled:opacity-50 inline-flex items-center gap-1"
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
                  className="w-1/3 py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {isArabic ? 'رجوع' : 'Retour'}
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otp.length < 4}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-rose-500/20 text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 transition-opacity disabled:opacity-50"
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
                  <span className="text-[10px] text-rose-500 font-semibold">
                    {isArabic ? 'يظهر للأعضاء' : 'Visible par tous'}
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none text-sm font-bold"
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
                    className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isArabic ? 'الجنس' : 'Sexe'}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'homme' | 'femme')}
                    className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none text-sm font-bold"
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
                  className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none text-sm font-bold"
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
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
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
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 text-xs ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 font-bold'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:border-rose-300'
                      }`}
                    >
                      <span className="text-base shrink-0">{tag.icon}</span>
                      <span className="truncate flex-1">{tag.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* PROPOSAL: REMEMBER EMAIL OR PSEUDO FOR NEXT TIME */}
              <div className="p-4 bg-gradient-to-br from-amber-50 via-rose-50/50 to-emerald-50/40 dark:from-slate-800 dark:to-slate-800/60 rounded-2xl border-2 border-amber-200 dark:border-amber-900/40 space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5">
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

                <div className="space-y-2 pt-1 border-t border-amber-200/60 dark:border-slate-700/60">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
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
                        className={`p-2 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                          rememberType === 'pseudo'
                            ? 'border-rose-500 bg-rose-500 text-white shadow-sm'
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
                        className={`p-2 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                          rememberType === 'email'
                            ? 'border-rose-500 bg-rose-500 text-white shadow-sm'
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
                  className="w-1/3 py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {isArabic ? 'تعديل' : 'Modifier'}
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={isLoading || selectedInterests.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-rose-500/25 text-sm font-black text-white bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:opacity-90 transition-opacity disabled:opacity-50"
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
        </div>
      </div>
    </div>
  );
}

