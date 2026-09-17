import { useState, useEffect, useRef, useCallback } from 'react';
import { WILAYAS_69 } from '../data/wilayas';

export type SearchCategory =
  | 'all'
  | 'people'
  | 'videos'
  | 'posts'
  | 'groups'
  | 'wilayas'
  | 'recipes'
  | 'marketplace'
  | 'shop';

export interface VoiceSearchIntent {
  rawTranscript: string;
  cleanedQuery: string;
  category?: SearchCategory;
  wilayaCode?: string;
  wilayaName?: string;
  feedbackMessageFr: string;
  feedbackMessageAr: string;
}

// Category keyword mappings for French and Arabic
const CATEGORY_KEYWORDS: Record<SearchCategory, { fr: string[]; ar: string[] }> = {
  all: {
    fr: ['tout', 'tous', 'tout voir', 'explorer tout', 'accueil', 'général'],
    ar: ['الكل', 'الجميع', 'كل شيء', 'استكشف الكل', 'الرئيسية'],
  },
  people: {
    fr: [
      'personne',
      'personnes',
      'profil',
      'profils',
      'célibataire',
      'célibataires',
      'mariage',
      'zawaj',
      'adhérent',
      'adhérents',
      'femme',
      'femmes',
      'homme',
      'hommes',
      'rencontre',
      'rencontres',
    ],
    ar: [
      'أشخاص',
      'شخص',
      'ملفات',
      'بروفايل',
      'عزاب',
      'عازب',
      'عازبة',
      'زواج',
      'أعضاء',
      'عضو',
      'نساء',
      'بنات',
      'رجال',
      'شباب',
      'تعارف',
      'نصفي',
    ],
  },
  videos: {
    fr: ['vidéo', 'vidéos', 'video', 'videos', 'short', 'shorts', 'reel', 'reels', 'clip', 'clips', 'tiktok'],
    ar: ['فيديو', 'فيديوهات', 'شورطس', 'شورتس', 'مقاطع', 'مقطع', 'ريلز', 'تيك توك'],
  },
  posts: {
    fr: ['publication', 'publications', 'post', 'posts', 'statut', 'statuts', 'article', 'articles', 'fil social'],
    ar: ['منشور', 'منشورات', 'بوست', 'بوستات', 'مشاركات', 'مشاركة', 'مقال', 'مقالات'],
  },
  groups: {
    fr: ['groupe', 'groupes', 'salon', 'salons', 'salhiya', 'communauté', 'communautés', 'forum'],
    ar: ['مجموعة', 'مجموعات', 'صالون', 'صالونات', 'صالحة', 'الصالحية', 'مجتمع', 'مجتمعات', 'منتدى'],
  },
  wilayas: {
    fr: ['wilaya', 'wilayas', 'région', 'régions', 'ville', 'villes', 'carte', '69 wilayas', 'diaspora'],
    ar: ['ولاية', 'ولايات', 'الولايات', 'مدينة', 'مدن', 'منطقة', 'مناطق', 'خريطة', 'الجالية'],
  },
  recipes: {
    fr: ['recette', 'recettes', 'cuisine', 'gastronomie', 'plat', 'plats', 'nadjet', 'chef', 'gâteau', 'couscous'],
    ar: ['طبخ', 'وصفة', 'وصفات', 'مأكولات', 'طعام', 'أكلات', 'حلويات', 'كسكس', 'الشيف نجاة', 'نجاة'],
  },
  marketplace: {
    fr: ['service', 'services', 'marketplace', 'prestataire', 'prestataires', 'salle des fêtes', 'traiteur', 'location', 'louer', 'voiture', 'cortège', 'robe', 'costume', 'karakou', 'caftan', 'fête'],
    ar: ['سوق', 'خدمات', 'خدمة', 'قاعة', 'قاعات', 'أعراس', 'عرس', 'كراء', 'تاجير', 'تأجير', 'سيارات', 'موكب', 'فستان', 'كاراكو', 'قفطان', 'حلويات العرس'],
  },
  shop: {
    fr: ['shop', 'boutique', 'souk', 'drops', 'streetwear', 'sneakers', 'hoodie', 'vide-dressing', 'cadeau', 'cadeaux', 'trousseau', 'promo'],
    ar: ['متجر', 'سوق', 'شوب', 'ستريت وير', 'سنيكرز', 'هودي', 'مستعمل', 'فيديو دريسينغ', 'هدية', 'هدايا', 'جهاز العروس', 'تخفيض'],
  },
};

// Normalize text helper for fuzzy matching
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, ' ')
    .trim();
}

export function parseVoiceCommand(transcript: string): VoiceSearchIntent {
  const norm = normalizeText(transcript);
  let cleaned = transcript.trim();
  let detectedCategory: SearchCategory | undefined = undefined;
  let detectedWilayaCode: string | undefined = undefined;
  let detectedWilayaName: string | undefined = undefined;

  // 1. Detect Category
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matchedFr = keywords.fr.some((kw) => norm.includes(normalizeText(kw)));
    const matchedAr = keywords.ar.some((kw) => transcript.includes(kw));

    if (matchedFr || matchedAr) {
      detectedCategory = cat as SearchCategory;
      break;
    }
  }

  // 2. Detect Wilaya (Code or Name)
  for (const w of WILAYAS_69) {
    const wNameNorm = normalizeText(w.name);
    const codeMatch = new RegExp(`\\b${w.code}\\b`).test(norm);
    const nameMatch = norm.includes(wNameNorm) || (wNameNorm.length > 4 && wNameNorm.split(/[\s/-]+/).some((part) => part.length > 3 && norm.includes(part)));
    const arMatch = transcript.includes(w.arabicName) || (w.arabicName.length > 3 && w.arabicName.split(' ').some((p) => p.length > 3 && transcript.includes(p)));

    if (codeMatch || nameMatch || arMatch) {
      detectedWilayaCode = w.code;
      detectedWilayaName = `${w.code} - ${w.name}`;
      break;
    }
  }

  // 3. Clean query from command prefix words
  const prefixRegexFr = /^(cherche|recherche|trouve|trouver|montre|montre-moi|cherche-moi|affiche|ouvre|mets|je veux|je cherche)\s+(des|du|de la|les|un|une|le|la|pour|sur)?\s*/i;
  const prefixRegexAr = /^(ابحث عن|ابحث لي عن|أريد|جد لي|أظهر لي|اعرض لي|بحث عن|وريني|شوف لي)\s*/i;

  cleaned = cleaned.replace(prefixRegexFr, '').replace(prefixRegexAr, '').trim();

  // If the query was purely a category name or wilaya name, keep search flexible
  const feedbackFr = detectedCategory
    ? `Recherche vocale dans "${detectedCategory}" ${detectedWilayaName ? `à ${detectedWilayaName}` : ''}`
    : `Recherche vocale pour "${cleaned || transcript}"`;

  const feedbackAr = detectedCategory
    ? `بحث صوتي في قسم "${detectedCategory}" ${detectedWilayaName ? `في ${detectedWilayaName}` : ''}`
    : `بحث صوتي عن "${cleaned || transcript}"`;

  return {
    rawTranscript: transcript,
    cleanedQuery: cleaned,
    category: detectedCategory,
    wilayaCode: detectedWilayaCode,
    wilayaName: detectedWilayaName,
    feedbackMessageFr: feedbackFr,
    feedbackMessageAr: feedbackAr,
  };
}

export function useWebSpeechSearch(defaultLang: 'ar-DZ' | 'fr-FR' = 'fr-FR') {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'ar-DZ' | 'fr-FR'>(defaultLang);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [recognizedIntent, setRecognizedIntent] = useState<VoiceSearchIntent | null>(null);

  const recognitionRef = useRef<any>(null);

  // Check support on mount
  useEffect(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
    }
  }, []);

  // Initialize and start recognition
  const startListening = useCallback(
    (customLang?: 'ar-DZ' | 'fr-FR') => {
      const SpeechRecognitionAPI =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognitionAPI) {
        setIsSupported(false);
        setSpeechError('Web Speech API non supportée sur ce navigateur.');
        return;
      }

      const langToUse = customLang || selectedLanguage;

      try {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = langToUse;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
          setTranscript('');
          setInterimTranscript('');
          setRecognizedIntent(null);
        };

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const item = event.results[i];
            if (item.isFinal) {
              finalTranscript += item[0].transcript;
            } else {
              currentInterim += item[0].transcript;
            }
          }

          if (currentInterim) {
            setInterimTranscript(currentInterim);
          }

          if (finalTranscript) {
            setTranscript(finalTranscript);
            setInterimTranscript('');
            const intent = parseVoiceCommand(finalTranscript);
            setRecognizedIntent(intent);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech Recognition Error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            setSpeechError(
              langToUse.startsWith('ar')
                ? 'تم رفض إذن استخدام الميكروفون. يرجى تفعيله في المتصفح.'
                : 'Accès au micro refusé. Veuillez autoriser le microphone dans votre navigateur.'
            );
          } else if (event.error === 'no-speech') {
            setSpeechError(
              langToUse.startsWith('ar')
                ? 'لم يتم سماع أي صوت. حاول التحدث مجدداً.'
                : 'Aucune voix détectée. Veuillez réessayer en parlant près du micro.'
            );
          } else {
            setSpeechError(`Erreur de reconnaissance vocale (${event.error}).`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.error('Failed to start SpeechRecognition:', err);
        setIsListening(false);
        setSpeechError(err.message || 'Impossible de démarrer la reconnaissance vocale.');
      }
    },
    [selectedLanguage]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
  }, []);

  const resetVoiceState = useCallback(() => {
    stopListening();
    setTranscript('');
    setInterimTranscript('');
    setSpeechError(null);
    setRecognizedIntent(null);
  }, [stopListening]);

  // Optional Voice Feedback using SpeechSynthesis
  const speakFeedback = useCallback(
    (text: string, lang: 'ar-DZ' | 'fr-FR' = selectedLanguage) => {
      if (!('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang.startsWith('ar') ? 'ar-SA' : 'fr-FR';
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Audio synthesis fallback
      }
    },
    [selectedLanguage]
  );

  return {
    isListening,
    transcript,
    interimTranscript,
    selectedLanguage,
    setSelectedLanguage,
    speechError,
    isSupported,
    recognizedIntent,
    startListening,
    stopListening,
    resetVoiceState,
    speakFeedback,
  };
}
