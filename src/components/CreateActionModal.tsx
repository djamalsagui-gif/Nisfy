import React, { useState } from 'react';
import {
  X,
  Camera,
  Film,
  CircleDot,
  Radio,
  BarChart2,
  Calendar,
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Tag,
  MapPin,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { WILAYAS_LIST } from '../data/wilayas';

interface CreateActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onPublishPost: (postData: any) => void;
  onPublishStory: (storyData: any) => void;
  onStartLive: (liveData: any) => void;
}

type CreateType = 'post' | 'short' | 'story' | 'live' | 'poll' | 'event';

export function CreateActionModal({
  isOpen,
  onClose,
  currentUser,
  onPublishPost,
  onPublishStory,
  onStartLive,
}: CreateActionModalProps) {
  const { isArabic } = useLanguage();
  const [selectedType, setSelectedType] = useState<CreateType>('post');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('mariage');
  const [wilayaCode, setWilayaCode] = useState(currentUser.wilayaCode || '16');
  const [mediaUrl, setMediaUrl] = useState('');
  const [pollOptions, setPollOptions] = useState(['Option 1', 'Option 2']);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedType === 'post' || selectedType === 'short' || selectedType === 'poll') {
      onPublishPost({
        type: selectedType,
        title: title || (isArabic ? 'منشور جديد على نصفي' : 'Nouvelle publication sur Nisfy'),
        description,
        category,
        wilayaCode,
        videoUrl:
          selectedType === 'short'
            ? mediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
            : undefined,
        imageUrl:
          selectedType === 'post'
            ? mediaUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
            : undefined,
        pollOptions: selectedType === 'poll' ? pollOptions : undefined,
      });
    } else if (selectedType === 'story') {
      onPublishStory({
        mediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
        caption: description,
      });
    } else if (selectedType === 'live') {
      onStartLive({
        title: title || 'Live Nisfy DZ',
        category,
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset
      setTitle('');
      setDescription('');
      setMediaUrl('');
    }, 1200);
  };

  const createOptions = [
    {
      id: 'post' as CreateType,
      labelFr: 'Publication',
      labelAr: 'منشور / صورة',
      descFr: 'Photo, texte & carrousel',
      descAr: 'صورة، نص أو نصائح أسرية',
      icon: ImageIcon,
      color: 'bg-rose-500 text-white',
    },
    {
      id: 'short' as CreateType,
      labelFr: 'Short Vidéo',
      labelAr: 'فيديو قصير (Reel)',
      descFr: 'Vidéo verticale plein écran',
      descAr: 'فيديو عمودي قصير للتعريف بالذات',
      icon: Film,
      color: 'bg-orange-500 text-white',
    },
    {
      id: 'story' as CreateType,
      labelFr: 'Story 24h',
      labelAr: 'قصة (ستوري)',
      descFr: 'Photo/vidéo éphémère 24h',
      descAr: 'لحظات يومية تختفي بعد 24 ساعة',
      icon: CircleDot,
      color: 'bg-amber-500 text-white',
    },
    {
      id: 'live' as CreateType,
      labelFr: 'Nisfy Live',
      labelAr: 'بث مباشر',
      descFr: 'Échange vidéo ou audio direct',
      descAr: 'جلسة حوارية تفاعلية مباشرة',
      icon: Radio,
      color: 'bg-red-600 text-white',
    },
    {
      id: 'poll' as CreateType,
      labelFr: 'Sondage',
      labelAr: 'استطلاع رأي',
      descFr: 'Question à la communauté',
      descAr: 'سؤال موجه لمجتمع الصالحية',
      icon: BarChart2,
      color: 'bg-emerald-600 text-white',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {isArabic ? 'تم النشر بنجاح ! 🎉' : 'Publié avec succès ! 🎉'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isArabic
                ? 'مشاركتك متاحة الآن لمجتمع نصفي بكل احترام وأمان.'
                : 'Votre contenu est désormais visible par la communauté Nisfy.'}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#FF3823] flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {isArabic ? 'إنشاء محتوى على نصفي DZ' : 'Créer du contenu sur Nisfy'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isArabic
                    ? 'شارك لحظاتك، قيمك وأفكارك باحترام في بيئة أسرية آمنة'
                    : 'Partagez avec authenticité dans un environnement respectueux et familial'}
                </p>
              </div>
            </div>

            {/* Type selector chips */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
              {createOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedType(opt.id)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer border ${
                      isSelected
                        ? 'border-[#FF3823] bg-orange-50/70 dark:bg-orange-950/40 text-[#FF3823]'
                        : 'border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${opt.color} shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-black leading-tight line-clamp-1">
                      {isArabic ? opt.labelAr : opt.labelFr}
                    </span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              {/* Title / Question */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  {selectedType === 'poll'
                    ? (isArabic ? 'سؤال الاستطلاع' : 'Votre question pour la communauté')
                    : (isArabic ? 'عنوان المحتوى' : 'Titre / Sujet')}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    selectedType === 'poll'
                      ? (isArabic ? 'مثال: ما رأيكم في الخطبة التقليدية مقارنة بالتعارف المباشر؟' : 'Ex: Que pensez-vous du trousseau traditionnel ?')
                      : (isArabic ? 'مثال: تقاليد ليلة الحناء في ولاية تلمسان' : 'Ex: Préparatifs et traditions de mariage')
                  }
                  required
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF3823]"
                />
              </div>

              {/* Description / Caption */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  {isArabic ? 'النص والوصف' : 'Description / Message'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder={
                    isArabic
                      ? 'شارك أفكارك، نصائحك أو تجربتك في حدود الاحترام والآداب...'
                      : 'Exprimez-vous avec bienveillance...'
                  }
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF3823] resize-none"
                />
              </div>

              {/* Category & Wilaya */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'المجال' : 'Catégorie'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="mariage">{isArabic ? '💍 مشروع زواج' : '💍 Projet Mariage'}</option>
                    <option value="culture">{isArabic ? '🇩🇿 ثقافة وتقاليد' : '🇩🇿 Culture & Coutumes'}</option>
                    <option value="cuisine">{isArabic ? '🍲 طبخ وحلويات' : '🍲 Gastronomie'}</option>
                    <option value="conseils">{isArabic ? '💡 نصائح وحكمة' : '💡 Conseils & Valeurs'}</option>
                    <option value="diaspora">{isArabic ? '🌍 دياسبورا وجالية' : '🌍 Diaspora'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    {isArabic ? 'الولاية' : 'Wilaya (DZ69)'}
                  </label>
                  <select
                    value={wilayaCode}
                    onChange={(e) => setWilayaCode(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {WILAYAS_LIST.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.code} - {isArabic ? w.arabicName : w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Media URL / Upload option */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>{isArabic ? 'رابط الوسائط (صورة أو فيديو)' : 'Média (Image ou vidéo)'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{isArabic ? 'اختياري' : 'Optionnel'}</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#FF3823]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setMediaUrl(
                        selectedType === 'short'
                          ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                          : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
                      )
                    }
                    className="px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isArabic ? 'عينة DZ' : 'Démo'}
                  </button>
                </div>
              </div>

              {/* Safety notice */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  {isArabic
                    ? 'تخضع جميع المنشورات لميثاق الشرف الأخلاقي والمراقبة الذكية لحماية خصوصية العائلات.'
                    : 'Les publications sont soumises à la charte éthique et à la modération IA de Nisfy.'}
                </span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {selectedType === 'live'
                    ? (isArabic ? 'بدء البث المباشر 🔴' : 'Lancer le direct 🔴')
                    : (isArabic ? 'نشر المحتوى الآن 🚀' : 'Publier maintenant 🚀')}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
