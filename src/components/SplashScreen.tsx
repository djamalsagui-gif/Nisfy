import React, { useEffect, useState } from 'react';
import { NisfyLogo } from './NisfyLogo';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface SplashScreenProps {
  /** Callback fired once splash screen has completely vanished */
  onFinished?: () => void;
  /** Force dark mode styling if provided */
  isDarkMode?: boolean;
}

/**
 * Splash Screen Moteur Nisfy :
 * 1. Le logo apparaît et s'anime pendant que le moteur tourne pour ouvrir la plateforme.
 * 2. Une fois la plateforme initialisée et la fenêtre prête, le logo se fane graduellement et se cache.
 */
export function SplashScreen({ onFinished, isDarkMode }: SplashScreenProps) {
  const [progress, setProgress] = useState(15);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [statusText, setStatusText] = useState('Démarrage du moteur Nisfy...');
  const [isEngineReady, setIsEngineReady] = useState(false);

  useEffect(() => {
    // 1. Engine startup simulation with progressive loading
    const timer1 = setTimeout(() => {
      setProgress(48);
      setStatusText('Initialisation des services & 69 wilayas...');
    }, 300);

    const timer2 = setTimeout(() => {
      setProgress(85);
      setStatusText('Chargement de la plateforme...');
    }, 650);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Plateforme prête !');
      setIsEngineReady(true);
    }, 1000);

    // 2. Once ready, fade out smoothly ("le logo se fane")
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1250);

    // 3. Completely hide and unmount ("et se cache")
    const removeTimer = setTimeout(() => {
      setIsMounted(false);
      if (onFinished) {
        onFinished();
      }
    }, 1950);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onFinished]);

  // Click/tap anywhere for immediate opening
  const handleFastDismiss = () => {
    if (!isFadingOut) {
      setProgress(100);
      setIsEngineReady(true);
      setIsFadingOut(true);
      setTimeout(() => {
        setIsMounted(false);
        if (onFinished) onFinished();
      }, 350);
    }
  };

  if (!isMounted) return null;

  const isDark =
    isDarkMode ??
    (typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark'));

  return (
    <div
      id="nisfy-splash-screen"
      onClick={handleFastDismiss}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between select-none cursor-pointer overflow-hidden backdrop-blur-md ${
        isDark
          ? 'bg-[#0B0F19] text-white'
          : 'bg-white/98 text-slate-900'
      } ${
        isFadingOut
          ? 'opacity-0 scale-105 blur-[2px] pointer-events-none'
          : 'opacity-100 scale-100 blur-0 pointer-events-auto'
      }`}
      style={{
        transitionProperty: 'opacity, transform, filter',
        transitionDuration: isFadingOut ? '700ms' : '200ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      aria-hidden="true"
    >
      {/* Top spacing */}
      <div className="h-12 w-full flex items-center justify-end px-6 pt-4">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 opacity-60">
          Nisfy Engine v2.4
        </span>
      </div>

      {/* Center: Engine Animation + Iconic Nisfy Logo */}
      <div
        className={`flex flex-col items-center justify-center transition-all duration-700 ease-out ${
          isFadingOut ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Glowing engine halo & spinning energy ring */}
        <div className="relative flex items-center justify-center p-6">
          {/* Outer rotating gradient aura */}
          <div
            className={`absolute w-36 h-36 rounded-full border-2 border-transparent border-t-[#FF3823] border-r-[#38BDF8] border-b-[#FF6B35] animate-spin transition-opacity duration-500 ${
              isEngineReady ? 'opacity-30' : 'opacity-90'
            }`}
            style={{ animationDuration: '1.4s' }}
          />

          {/* Secondary counter-spinning light ring */}
          <div
            className={`absolute w-44 h-44 rounded-full border border-transparent border-t-[#38BDF8]/40 border-l-[#FF3823]/40 animate-spin transition-opacity duration-500 ${
              isEngineReady ? 'opacity-20' : 'opacity-70'
            }`}
            style={{ animationDuration: '2.8s', animationDirection: 'reverse' }}
          />

          {/* Ambient colored backdrop pulse */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-[#FF6B35]/25 via-[#FF3823]/20 to-[#38BDF8]/25 rounded-full blur-2xl animate-pulse" />

          {/* Nisfy Center Logo */}
          <div className="relative z-10 transform transition-transform duration-300 hover:scale-105">
            <NisfyLogo size="2xl" variant="vector" showText={false} />
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className="mt-4 flex flex-col items-center text-center">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
              Nisfy
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-[#FF3823] font-serif">
              نصفي
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500">
            Mariage & Rencontres Sincères
          </p>
        </div>

        {/* Dynamic Engine Loading Bar */}
        <div className="mt-6 w-56 flex flex-col items-center gap-2">
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#38BDF8] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {isEngineReady ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 animate-in zoom-in" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-[#FF3823] animate-pulse" />
            )}
            <span className="truncate">{statusText}</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Badge */}
      <div className="pb-8 flex flex-col items-center gap-1 text-center">
        <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          100% Algérie • 69 Wilayas & Diaspora
        </span>
        <span className="text-[10px] text-slate-400/80">
          Touchez l'écran pour passer
        </span>
      </div>
    </div>
  );
}
