import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Sparkles } from 'lucide-react';
import { getPwaPlatformInfo, PwaPlatformInfo } from '../utils/pwaManager';
import { useLanguage } from '../context/LanguageContext';

interface PwaInstallBannerProps {
  onOpenInstallModal: () => void;
}

export function PwaInstallBanner({ onOpenInstallModal }: PwaInstallBannerProps) {
  const { isArabic } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [platformInfo, setPlatformInfo] = useState<PwaPlatformInfo>(getPwaPlatformInfo());

  useEffect(() => {
    // Check if dismissed recently or already installed in standalone mode
    const checkVisibility = () => {
      const info = getPwaPlatformInfo();
      setPlatformInfo(info);

      if (info.isStandalone) {
        setIsVisible(false);
        return;
      }

      try {
        const isDismissed = localStorage.getItem('nisfy_pwa_banner_dismissed');
        if (isDismissed) {
          const dismissedTime = parseInt(isDismissed, 10);
          // Show again after 3 days
          if (Date.now() - dismissedTime < 3 * 24 * 60 * 60 * 1000) {
            setIsVisible(false);
            return;
          }
        }
      } catch {}

      // Show after 2.5s once user has started exploring
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500);

      return () => clearTimeout(timer);
    };

    checkVisibility();

    const handleCanInstall = () => setPlatformInfo(getPwaPlatformInfo());
    const handleInstalled = () => setIsVisible(false);

    window.addEventListener('nisfy-pwa-can-install', handleCanInstall);
    window.addEventListener('nisfy-pwa-installed', handleInstalled);

    return () => {
      window.removeEventListener('nisfy-pwa-can-install', handleCanInstall);
      window.removeEventListener('nisfy-pwa-installed', handleInstalled);
    };
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    try {
      localStorage.setItem('nisfy_pwa_banner_dismissed', Date.now().toString());
    } catch {}
  };

  if (!isVisible || platformInfo.isStandalone) return null;

  return (
    <div
      className="fixed bottom-18 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-6 z-40 max-w-md animate-in slide-in-from-bottom-5 duration-300"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div
        onClick={onOpenInstallModal}
        className="bg-[#0F172A]/95 text-white backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3 sm:p-3.5 shadow-2xl flex items-center justify-between gap-3 cursor-pointer group hover:border-[#FF3823]/60 transition-all"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B35] via-[#FF3823] to-[#38BDF8] p-0.5 shrink-0 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[#FF6B35]" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-tight text-white">
                {isArabic ? 'تطبيق نصفي 🇩🇿' : 'App Mobile Nisfy 🇩🇿'}
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#FF3823]/20 text-[#FF6B35] text-[9px] font-bold border border-[#FF3823]/30">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {isArabic ? 'ثبّت التطبيق بنقرة لتصفح أسرع وتنبيهات فورية' : 'Installez pour une expérience fluide & alertes directes'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenInstallModal}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isArabic ? 'تثبيت' : 'Installer'}</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
