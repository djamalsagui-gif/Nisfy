import React, { useEffect, useState } from 'react';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  MapPin,
  Users,
  Film,
  FileText,
  Layers,
  Utensils,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  useWebSpeechSearch,
  SearchCategory,
  VoiceSearchIntent,
} from '../../hooks/useWebSpeechSearch';
import { datingSounds } from '../../utils/soundEffects';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVoiceSearch: (intent: VoiceSearchIntent) => void;
  currentCategory?: SearchCategory;
}

const CATEGORY_ICONS: Record<SearchCategory, any> = {
  all: Sparkles,
  people: Users,
  videos: Film,
  posts: FileText,
  groups: Layers,
  wilayas: MapPin,
  recipes: Utensils,
  marketplace: ShoppingBag,
  shop: ShoppingBag,
};

const CATEGORY_NAMES_FR: Record<SearchCategory, string> = {
  all: 'Tout explorer',
  people: 'Personnes & Profils',
  videos: 'Shorts & Vidéos',
  posts: 'Publications',
  groups: 'Groupes Salhiya',
  wilayas: '69 Wilayas',
  recipes: 'Gastronomie & Recettes',
  marketplace: 'Services Mariage & Location',
  shop: 'Boutique & Drops',
};

const CATEGORY_NAMES_AR: Record<SearchCategory, string> = {
  all: 'الكل',
  people: 'الأشخاص والملفات',
  videos: 'الفيديوهات والشورطس',
  posts: 'المنشورات',
  groups: 'المجموعات وصالون الصالحية',
  wilayas: '69 ولاية',
  recipes: 'الطبخ والوصفات',
  marketplace: 'خدمات العرس والكراء',
  shop: 'المتجر والمستعمل',
};

export function VoiceSearchModal({
  isOpen,
  onClose,
  onApplyVoiceSearch,
}: VoiceSearchModalProps) {
  const { isArabic } = useLanguage();
  const defaultLang = isArabic ? 'ar-DZ' : 'fr-FR';

  const {
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
  } = useWebSpeechSearch(defaultLang);

  const [enableTts, setEnableTts] = useState(true);
  const [showTips, setShowTips] = useState(false);

  // Auto start listening when modal opens
  useEffect(() => {
    if (isOpen) {
      datingSounds.playTapSound();
      resetVoiceState();
      const timer = setTimeout(() => {
        startListening(selectedLanguage);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      resetVoiceState();
    }
  }, [isOpen, selectedLanguage, startListening, resetVoiceState]);

  if (!isOpen) return null;

  const currentDisplayTranscript = transcript || interimTranscript;

  const handleApply = (intentToUse?: VoiceSearchIntent) => {
    const finalIntent = intentToUse || recognizedIntent;
    if (!finalIntent) return;

    datingSounds.playMatchSound();
    if (enableTts) {
      const feedback = isArabic ? finalIntent.feedbackMessageAr : finalIntent.feedbackMessageFr;
      speakFeedback(feedback, selectedLanguage);
    }

    onApplyVoiceSearch(finalIntent);
    onClose();
  };

  const sampleCommandsFr = [
    { text: 'Cherche des personnes à Alger', category: 'people' as SearchCategory },
    { text: 'Vidéos de mariage traditionnel', category: 'videos' as SearchCategory },
    { text: 'Recettes de gâteaux de fête', category: 'recipes' as SearchCategory },
    { text: 'Wilaya d’Oran 31', category: 'wilayas' as SearchCategory },
    { text: 'Services traiteur et salle des fêtes', category: 'marketplace' as SearchCategory },
  ];

  const sampleCommandsAr = [
    { text: 'ابحث عن أشخاص في ولاية الجزائر', category: 'people' as SearchCategory },
    { text: 'فيديوهات وشورطس الأعراس الجزائرية', category: 'videos' as SearchCategory },
    { text: 'وصفات وحلويات الأعراس', category: 'recipes' as SearchCategory },
    { text: 'ولاية وهران 31', category: 'wilayas' as SearchCategory },
    { text: 'خدمات وقاعات الأفراح', category: 'marketplace' as SearchCategory },
  ];

  const sampleCommands = selectedLanguage.startsWith('ar') ? sampleCommandsAr : sampleCommandsFr;

  return (
    <div
      id="voice-search-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopListening();
          onClose();
        }
      }}
    >
      <div
        id="voice-search-modal-container"
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-6 relative overflow-hidden"
      >
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-gradient-to-br from-orange-400/20 to-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-gradient-to-tr from-rose-500/20 to-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#FF3823] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{isArabic ? 'البحث الصوتي الذكي' : 'Recherche Vocale Nisfy'}</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-[#FF3823] dark:bg-orange-950/60">
                  Web Speech
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'تحدث بالعربية أو الفرنسية للبحث' : 'Commandes vocales en arabe ou français'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setEnableTts(!enableTts)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                enableTts
                  ? 'bg-orange-50 text-[#FF3823] border-orange-200 dark:bg-orange-950/50 dark:border-orange-800'
                  : 'bg-slate-100 text-slate-400 border-transparent dark:bg-slate-800'
              }`}
              title={enableTts ? 'Retour vocal activé' : 'Retour vocal désactivé'}
            >
              {enableTts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                showTips
                  ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/50'
                  : 'bg-slate-100 text-slate-400 border-transparent dark:bg-slate-800'
              }`}
              title="Aide & Exemples"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                stopListening();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Language Selection Selector (Arabe DZ / Français) */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl relative z-10">
          <button
            type="button"
            onClick={() => {
              setSelectedLanguage('ar-DZ');
              startListening('ar-DZ');
              datingSounds.playTapSound();
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedLanguage === 'ar-DZ'
                ? 'bg-white dark:bg-slate-900 text-[#FF3823] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>🇩🇿</span>
            <span>العربية (الجزائر)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedLanguage('fr-FR');
              startListening('fr-FR');
              datingSounds.playTapSound();
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedLanguage === 'fr-FR'
                ? 'bg-white dark:bg-slate-900 text-[#FF3823] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>🇫🇷</span>
            <span>Français</span>
          </button>
        </div>

        {/* Central Animated Mic Stage */}
        <div className="flex flex-col items-center justify-center py-4 space-y-4 relative z-10">
          <div className="relative flex items-center justify-center">
            {/* Audio Wave Ripples when listening */}
            {isListening && (
              <>
                <div className="absolute w-36 h-36 rounded-full bg-[#FF3823]/15 animate-ping duration-1000 pointer-events-none" />
                <div className="absolute w-28 h-28 rounded-full bg-orange-400/25 animate-pulse duration-700 pointer-events-none" />
              </>
            )}

            <button
              id="voice-mic-main-button"
              type="button"
              onClick={() => {
                if (isListening) {
                  stopListening();
                } else {
                  startListening();
                }
                datingSounds.playTapSound();
              }}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer relative z-10 ${
                isListening
                  ? 'bg-gradient-to-tr from-[#FF6B35] via-[#FF3823] to-rose-600 text-white ring-4 ring-orange-200 dark:ring-orange-950 scale-105 shadow-orange-500/40'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {isListening ? (
                <Mic className="w-8 h-8 animate-pulse text-white" />
              ) : (
                <MicOff className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Listening State Label */}
          <div className="text-center">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                isListening
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-[#FF3823] animate-pulse'
                  : currentDisplayTranscript
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-[#FF3823] animate-ping' : 'bg-slate-400'}`} />
              {isListening
                ? selectedLanguage.startsWith('ar')
                  ? 'جاري الاستماع... تحدث الآن'
                  : 'Écoute active... Parlez maintenant'
                : currentDisplayTranscript
                ? selectedLanguage.startsWith('ar')
                  ? 'تم التقاط الصوت بنجاح'
                  : 'Voix reconnue'
                : selectedLanguage.startsWith('ar')
                ? 'اضغط على الميكروفون للتحدث'
                : 'Appuyez pour parler'}
            </span>
          </div>

          {/* Live Transcript Bubble */}
          <div className="w-full min-h-[70px] p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-center text-center">
            {currentDisplayTranscript ? (
              <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-relaxed">
                "{currentDisplayTranscript}"
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic">
                {selectedLanguage.startsWith('ar')
                  ? 'مثال: "ابحث عن أشخاص في وهران" أو "فيديوهات الأعراس"'
                  : 'Ex : "Trouve des profils à Alger" ou "Vidéos de mariage"'}
              </p>
            )}
          </div>
        </div>

        {/* Error State if Any */}
        {!isSupported && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {isArabic
                ? 'المتصفح الحالي لا يدعم ميزة Web Speech API بشكل كامل. يرجى استخدام متصفح Chrome أو Safari أو Edge.'
                : 'Votre navigateur actuel ne supporte pas l’API Web Speech. Veuillez utiliser Chrome, Safari ou Edge.'}
            </span>
          </div>
        )}

        {speechError && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{speechError}</span>
            <button
              type="button"
              onClick={() => startListening(selectedLanguage)}
              className="text-rose-600 dark:text-rose-400 underline font-black cursor-pointer"
            >
              {isArabic ? 'إعادة المحاولة' : 'Réessayer'}
            </button>
          </div>
        )}

        {/* Recognized Intent Cards (Categories & Wilaya Extraction) */}
        {recognizedIntent && (
          <div className="p-3.5 bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/30 dark:to-rose-950/30 rounded-2xl border border-orange-200/80 dark:border-orange-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isArabic ? 'الأمر الصوتي المفهوم :' : 'Action Vocale Détectée :'}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold">Smart Intent</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {recognizedIntent.category && (
                <div className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-800 flex items-center gap-1.5 text-xs font-black text-[#FF3823] shadow-2xs">
                  {(() => {
                    const CatIcon = CATEGORY_ICONS[recognizedIntent.category];
                    return <CatIcon className="w-3.5 h-3.5 text-[#FF3823]" />;
                  })()}
                  <span>
                    {isArabic
                      ? CATEGORY_NAMES_AR[recognizedIntent.category]
                      : CATEGORY_NAMES_FR[recognizedIntent.category]}
                  </span>
                </div>
              )}

              {recognizedIntent.wilayaName && (
                <div className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>📍 {recognizedIntent.wilayaName}</span>
                </div>
              )}

              {recognizedIntent.cleanedQuery && (
                <div className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
                  <span>🔎 "{recognizedIntent.cleanedQuery}"</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Suggestions / Prompt Chips */}
        {(showTips || !currentDisplayTranscript) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-black text-slate-500 uppercase tracking-wider">
              <span>{isArabic ? 'أمثلة للأوامر الصوتية السريعة :' : 'Exemples de commandes vocales :'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sampleCommands.map((cmd, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    datingSounds.playTapSound();
                    const intent = {
                      rawTranscript: cmd.text,
                      cleanedQuery: cmd.text,
                      category: cmd.category,
                      feedbackMessageFr: `Recherche de "${cmd.text}"`,
                      feedbackMessageAr: `بحث عن "${cmd.text}"`,
                    };
                    handleApply(intent);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer text-left rtl:text-right"
                >
                  🎙️ {cmd.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              resetVoiceState();
              startListening(selectedLanguage);
              datingSounds.playTapSound();
            }}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Recommencer"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">{isArabic ? 'إعادة' : 'Recommencer'}</span>
          </button>

          <button
            id="apply-voice-search-btn"
            type="button"
            onClick={() => handleApply()}
            disabled={!currentDisplayTranscript}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-black text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              currentDisplayTranscript
                ? 'bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-rose-600 hover:opacity-95 shadow-orange-500/30 active:scale-95'
                : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-50'
            }`}
          >
            <span>{isArabic ? 'تطبيق البحث' : 'Appliquer la recherche'}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
