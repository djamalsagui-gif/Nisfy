// PWA Management Utility for Nisfy (Progressive Web App)

export interface PwaPlatformInfo {
  isStandalone: boolean;
  isIos: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
  isSafari: boolean;
  isChrome: boolean;
  canPromptInstall: boolean;
}

let deferredInstallPrompt: any = null;

// Initialize listeners for PWA install prompt
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    // Prevent default mini-infobar on mobile Chrome
    e.preventDefault();
    deferredInstallPrompt = e;
    // Notify React listeners
    window.dispatchEvent(new CustomEvent('nisfy-pwa-can-install', { detail: true }));
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    window.dispatchEvent(new CustomEvent('nisfy-pwa-installed', { detail: true }));
    try {
      localStorage.setItem('nisfy_pwa_installed', 'true');
    } catch {}
  });
}

/**
 * Detect current device and PWA installation state
 */
export function getPwaPlatformInfo(): PwaPlatformInfo {
  if (typeof window === 'undefined') {
    return {
      isStandalone: false,
      isIos: false,
      isAndroid: false,
      isDesktop: true,
      isSafari: false,
      isChrome: false,
      canPromptInstall: false,
    };
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://');

  const isIos = /iphone|ipad|ipod/.test(userAgent) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(userAgent);
  const isDesktop = !isIos && !isAndroid;
  const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios|edg/.test(userAgent);
  const isChrome = /chrome|crios/.test(userAgent) && !/edg/.test(userAgent);
  const canPromptInstall = !!deferredInstallPrompt;

  return {
    isStandalone,
    isIos,
    isAndroid,
    isDesktop,
    isSafari,
    isChrome,
    canPromptInstall,
  };
}

/**
 * Trigger native browser install prompt (Android/Chrome/Edge/Desktop)
 */
export async function promptPwaInstall(): Promise<'accepted' | 'dismissed' | 'unsupported'> {
  if (!deferredInstallPrompt) {
    return 'unsupported';
  }

  try {
    deferredInstallPrompt.prompt();
    const choiceResult = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    window.dispatchEvent(new CustomEvent('nisfy-pwa-can-install', { detail: false }));
    return choiceResult.outcome === 'accepted' ? 'accepted' : 'dismissed';
  } catch (error) {
    console.error('[PWA] Prompt error:', error);
    return 'unsupported';
  }
}
