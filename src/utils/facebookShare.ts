/**
 * Nisfy (نصفي) - Facebook Integration & Sharing Utility
 * Permet le partage direct vers Facebook (Fil d'actualité, Groupes DZ, Messagerie)
 * et la génération d'aperçus optimisés pour la communauté algérienne et diaspora.
 */

export interface FacebookShareOptions {
  url?: string;
  title: string;
  quote?: string;
  text?: string;
  hashtag?: string;
  category?: string;
  wilayaName?: string;
}

export const OFFICIAL_FACEBOOK_BLUE = '#1877F2';

/**
 * Ouvre la fenêtre de partage officielle Facebook
 */
export function openFacebookShare(options: FacebookShareOptions) {
  const currentUrl = options.url || window.location.href;
  const hashtag = options.hashtag || '#Nisfy #ZawajAlgérie #MariageDZ';

  // Construct quote with title & description
  let fullQuote = options.quote || options.text || options.title;
  if (options.wilayaName) {
    fullQuote += ` 🇩🇿 Wilaya: ${options.wilayaName}`;
  }
  fullQuote += ` | نصفي - منصة الزواج والتعارف الجاد في الجزائر`;

  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    currentUrl
  )}&quote=${encodeURIComponent(fullQuote)}&hashtag=${encodeURIComponent(hashtag)}`;

  // Open in a centered popup window
  const width = 640;
  const height = 580;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    shareUrl,
    'facebook-share-dialog',
    `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
  );

  if (popup) {
    popup.focus();
  }
}

/**
 * Partage direct vers WhatsApp (très utilisé dans les groupes de famille en Algérie)
 */
export function openWhatsAppShare(text: string, url?: string) {
  const targetUrl = url || window.location.href;
  const message = `${text}\n${targetUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

/**
 * Copie du lien avec fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    return true;
  } catch {
    return false;
  }
}
