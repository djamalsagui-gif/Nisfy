/**
 * Reliable CORS-enabled video CDN sources and fallbacks for Nisfy
 * Replaces brittle third-party hotlinks with high-speed Google Cloud CDN video streams
 */

export const SAFE_DEFAULT_VIDEOS = {
  presentationFemale1: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  presentationMale1: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  presentationFemale2: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  presentationMale2: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  weddingAndTradition: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  saharaAndTravel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  cookingAndFood: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  craftsAndCulture: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
};

export const BACKUP_VIDEO_STREAM_URLS: string[] = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
];

/**
 * Returns a robust, fast-loading CORS-friendly video URL.
 * Automatically cleans up broken hotlinks (e.g., Mixkit CDN blocks/expirations).
 */
export function getReliableVideoUrl(url?: string, fallbackIndex: number = 0): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return BACKUP_VIDEO_STREAM_URLS[fallbackIndex % BACKUP_VIDEO_STREAM_URLS.length];
  }

  const cleanUrl = url.trim();

  // If it's a YouTube link, preserve it for iframe embedding
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
    return cleanUrl;
  }

  // If it's a Mixkit preview URL that gets blocked by browser CORS / hotlink protection, map to stable CDN video
  if (cleanUrl.includes('mixkit.co')) {
    if (cleanUrl.includes('young-woman') || cleanUrl.includes('smiling-woman') || cleanUrl.includes('bride')) {
      return SAFE_DEFAULT_VIDEOS.presentationFemale1;
    }
    if (cleanUrl.includes('young-man') || cleanUrl.includes('man-talking')) {
      return SAFE_DEFAULT_VIDEOS.presentationMale1;
    }
    if (cleanUrl.includes('desert') || cleanUrl.includes('sand-dunes')) {
      return SAFE_DEFAULT_VIDEOS.saharaAndTravel;
    }
    if (cleanUrl.includes('cooking') || cleanUrl.includes('pan-with-vegetables')) {
      return SAFE_DEFAULT_VIDEOS.cookingAndFood;
    }
    if (cleanUrl.includes('clay-pot') || cleanUrl.includes('crafting')) {
      return SAFE_DEFAULT_VIDEOS.craftsAndCulture;
    }
    return BACKUP_VIDEO_STREAM_URLS[fallbackIndex % BACKUP_VIDEO_STREAM_URLS.length];
  }

  // Already a valid http/https or blob / data url
  return cleanUrl;
}
