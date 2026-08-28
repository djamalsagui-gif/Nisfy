import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  Sparkles,
  Zap,
  Bell,
  WifiOff,
  ShieldCheck,
  X,
  Laptop,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { getPwaPlatformInfo, promptPwaInstall, PwaPlatformInfo } from '../utils/pwaManager';
import { useLanguage } from '../context/LanguageContext';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PwaInstallModal({ isOpen, onClose }: PwaInstallModalProps) {
  const { isArabic } = useLanguage();
  const [platformInfo, setPlatformInfo] = useState<PwaPlatformInfo>(getPwaPlatformInfo());
  const [selectedTab, setSelectedTab] = useState<'auto' | 'android' | 'ios' | 'desktop'>('auto');
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'installed'>('idle');

  useEffect(() => {
    if (isOpen) {
      const info = getPwaPlatformInfo();
      setPlatformInfo(info);
      if (info.isIos) setSelectedTab('ios');
      else if (info.isAndroid) setSelectedTab('android');
      else setSelectedTab('desktop');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleCanInstall = () => setPlatformInfo(getPwaPlatformInfo());
    const handleInstalled = () => {
      setInstallStatus('installed');
      setPlatformInfo(getPwaPlatformInfo());
    };

    window.addEventListener('nisfy-pwa-can-install', handleCanInstall);
    window.addEventListener('nisfy-pwa-installed', handleInstalled);

    return () => {
      window.removeEventListener('nisfy-pwa-can-install', handleCanInstall);
      window.removeEventListener('nisfy-pwa-installed', handleInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    setInstallStatus('installing');
    const result = await promptPwaInstall();
    if (result === 'accepted') {
      setInstallStatus('installed');
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setInstallStatus('idle');
    }
  };

  const activePlatform = selectedTab === 'auto'
    ? platformInfo.isIos ? 'ios' : platformInfo.isAndroid ? 'android' : 'desktop'
    : selectedTab;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header with Algerian Gradient Accent */}
        <div className="relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-6 pb-5 overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FF3823]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#38BDF8]/30 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6B35] via-[#FF3823] to-[#38BDF8] p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
                <Smartphone className="w-7 h-7 text-[#FF6B35]" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[11px] font-bold border border-orange-500/30 mb-1">
                <Sparkles className="w-3 h-3" />
                <span>{isArabic ? 'تطبيق PWA الرسمي' : 'Application Progressive PWA'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <span>{isArabic ? 'تثبيت تطبيق نصفي' : 'Installer l’App Nisfy'}</span>
                <span className="text-[#FF3823] font-serif text-lg">🇩🇿</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedTab('android')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activePlatform === 'android'
                ? 'bg-white dark:bg-slate-800 text-[#FF3823] shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-500" />
            <span>Android / Chrome</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('ios')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activePlatform === 'ios'
                ? 'bg-white dark:bg-slate-800 text-[#FF3823] shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-slate-800 dark:text-slate-200" />
            <span>iPhone / iPad</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('desktop')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activePlatform === 'desktop'
                ? 'bg-white dark:bg-slate-800 text-[#FF3823] shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4 text-[#38BDF8]" />
            <span>PC / Mac</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Key Advantages Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/30 flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-orange-500/10 text-[#FF3823] shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'فائق السرعة وخفيف' : 'Ultra-Rapide & Léger'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                  {isArabic ? 'أقل من 2 ميغابايت، توفير باقة الإنترنت' : '< 2 Mo, économise vos données 4G/5G'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'إشعارات مباشرة' : 'Alertes Directes'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                  {isArabic ? 'تنبيه فوري بالرسائل والإعجابات' : 'Ne manquez aucun match ni message'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/50 dark:border-sky-900/30 flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 shrink-0">
                <WifiOff className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'تشغيل فوري' : 'Lancement Direct'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                  {isArabic ? 'يعمل بدون متصفح من شاشتك' : 'Plein écran sans barre de navigateur'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-900/30 flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {isArabic ? '100% مجاني وآمن' : '100% Sécurisé'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                  {isArabic ? 'بدون وسيط ولا متاجر تطبيقات' : 'Mises à jour automatiques transparentes'}
                </p>
              </div>
            </div>
          </div>

          {/* Platform Specific Instructions */}
          {activePlatform === 'ios' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Share2 className="w-4 h-4 text-[#38BDF8]" />
                <span>{isArabic ? 'خطوات التثبيت على iPhone (متصفح Safari)' : 'Étapes d’installation sur iPhone / Safari :'}</span>
              </div>
              <ol className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#38BDF8]/20 text-[#0284C7] dark:text-[#38BDF8] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    {isArabic
                      ? 'اضغط على زر المشاركة (Share) 📤 في أسفل أو أعلى متصفح Safari.'
                      : 'Appuyez sur l’icône Partager 📤 en bas de votre écran Safari.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#FF3823]/20 text-[#FF3823] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    {isArabic
                      ? 'اسحب للأعلى واختر "إضافة إلى الصفحة الرئيسية" (Sur l’écran d’accueil) ➕.'
                      : 'Faites défiler vers le bas et sélectionnez "Sur l’écran d’accueil" ➕.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    {isArabic
                      ? 'اضغط على "إضافة" في الزاوية العليا، وسيظهر تطبيق نصفي مباشرة على هاتفك!'
                      : 'Appuyez sur "Ajouter" en haut à droite : Nisfy est prêt sur votre écran !'}
                  </span>
                </li>
              </ol>
            </div>
          )}

          {activePlatform === 'android' && (
            <div className="space-y-4">
              {platformInfo.canPromptInstall ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-amber-500/10 border border-orange-500/30 text-center space-y-3">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {isArabic
                      ? 'متصفحك جاهز لتثبيت التطبيق بنقرة واحدة مباشرة على هاتفك !'
                      : 'Votre navigateur Android est prêt pour l’installation directe en 1 clic !'}
                  </p>
                  <button
                    onClick={handleInstallClick}
                    disabled={installStatus === 'installing'}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF3823] hover:from-[#FF5519] hover:to-[#E02814] text-white text-sm font-black shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {installStatus === 'installing'
                        ? isArabic ? 'جاري التثبيت...' : 'Installation en cours...'
                        : isArabic ? '⚡ تثبيت تطبيق نصفي الآن' : '⚡ Installer Nisfy sur Android'}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <PlusSquare className="w-4 h-4 text-[#FF3823]" />
                    <span>{isArabic ? 'طريقة التثبيت عبر Chrome / Samsung Internet :' : 'Installation manuelle sur Chrome / Android :'}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {isArabic
                      ? 'اضغط على قائمة الثلاث نقاط (⋮) في أعلى المتصفح، ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".'
                      : 'Ouvrez le menu (⋮) en haut à droite de Google Chrome, puis appuyez sur "Installer l’application" ou "Ajouter à l’écran d’accueil".'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activePlatform === 'desktop' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Laptop className="w-4 h-4 text-[#38BDF8]" />
                <span>{isArabic ? 'تثبيت التطبيق على جهاز الكمبيوتر (Chrome / Edge / Mac) :' : 'Installation sur Ordinateur (PC Windows / Mac) :'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isArabic
                  ? 'انقر على أيقونة التثبيت ⊕ الموجودة في نهاية شريط الروابط (URL) في متصفح Chrome أو Edge لفتح نصفي كنافذة مستقلة.'
                  : 'Cliquez sur l’icône ⊕ dans la barre d’adresse de Google Chrome ou Microsoft Edge pour ouvrir Nisfy comme un logiciel dédié.'}
              </p>
              {platformInfo.canPromptInstall && (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" />
                  <span>{isArabic ? 'تثبيت البرنامج على الكمبيوتر' : 'Installer sur le bureau PC / Mac'}</span>
                </button>
              )}
            </div>
          )}

          {/* Already installed feedback */}
          {installStatus === 'installed' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-xs font-bold animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{isArabic ? 'مبروك! تم تثبيت تطبيق نصفي بنجاح على جهازك.' : 'Félicitations ! Nisfy a été installé avec succès.'}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            🇩🇿 {isArabic ? 'نصفي • 69 ولاية والجالية' : 'Nisfy • 69 Wilayas & Diaspora'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {isArabic ? 'إغلاق' : 'Fermer'}
          </button>
        </div>
      </div>
    </div>
  );
}
