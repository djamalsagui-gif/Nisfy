import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  MapPin,
  Briefcase,
  Heart,
  Sparkles,
  Save,
  CheckCircle2,
  Camera,
  LogOut,
  ShieldCheck,
  Film,
  Image as ImageIcon,
  Plus,
  Trash2,
  Play,
  Video,
  StopCircle,
  Upload,
  Zap,
  Mail,
  Music,
  Volume2,
  VolumeX,
  Share2,
  Disc,
  Smartphone,
  Download,
} from 'lucide-react';
import { UserProfile, Gender, LookingFor, ProfileVideo } from '../types';
import { WILAYAS_69 } from '../data/wilayas';
import { datingSounds } from '../utils/soundEffects';
import { useLanguage } from '../context/LanguageContext';
import { MediaViewerModal } from './MediaViewerModal';
import { PublishVideoModal } from './PublishVideoModal';
import { TrustVerificationModal } from './TrustVerificationModal';
import {
  NISFY_MUSIC_CATALOG,
  getAllAvailableTracks,
  getTrackById,
  MusicTrack,
} from '../data/musicThemes';
import { musicAudioEngine } from '../utils/musicAudioEngine';
import { MusicShareModal } from './music/MusicShareModal';
import { MusicSelector } from './music/MusicSelector';
import { YouTubeMusicImportModal } from './music/YouTubeMusicImportModal';
import {
  getRememberedAccount,
  saveRememberedAccount,
  clearRememberedAccount,
} from '../utils/storage';
import { syncUserProfileToSupabase } from '../api/supabase';

interface MyProfileViewProps {
  currentUser: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
  likesReceivedCount: number;
  onOpenPwaInstall?: () => void;
}

const AVATAR_SELECTION = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
];

const SAMPLE_VIDEOS = [
  {
    title: 'Présentation Décontractée 🌺',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
  },
  {
    title: 'Salutations d’Extérieur 🦁',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
  },
  {
    title: 'Sourire & Présentation 🌊',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  },
];

export function MyProfileView({
  currentUser,
  onUpdateProfile,
  onLogout,
  likesReceivedCount,
  onOpenPwaInstall,
}: MyProfileViewProps) {
  const { t, isArabic } = useLanguage();
  const [pseudo, setPseudo] = useState(currentUser.pseudo);
  const [city, setCity] = useState(currentUser.city);
  const [age, setAge] = useState(currentUser.age);
  const [occupation, setOccupation] = useState(currentUser.occupation || '');
  const [bio, setBio] = useState(currentUser.bio);
  const [lookingFor, setLookingFor] = useState<LookingFor>(currentUser.lookingFor);
  const [gender, setGender] = useState<Gender>(currentUser.gender);
  const [icebreaker, setIcebreaker] = useState(currentUser.icebreaker || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [photos, setPhotos] = useState<string[]>(
    currentUser.photos && currentUser.photos.length > 0
      ? currentUser.photos
      : [currentUser.avatar]
  );
  const [videos, setVideos] = useState<ProfileVideo[]>(currentUser.videos || []);
  const [interests, setInterests] = useState<string[]>(currentUser.interests || []);
  const [hidePhotoInitially, setHidePhotoInitially] = useState<boolean>(
    Boolean(currentUser.hidePhotoInitially)
  );
  const [rememberedOnDevice, setRememberedOnDevice] = useState<boolean>(() =>
    Boolean(getRememberedAccount())
  );
  const [prefIdentifierType, setPrefIdentifierType] = useState<'pseudo' | 'email'>(
    () => {
      const r = getRememberedAccount();
      return r ? r.type : 'pseudo';
    }
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isTrustModalOpen, setIsTrustModalOpen] = useState(false);

  // 🎵 Wedding Music Theme & Sharing State
  const [weddingThemeMusicId, setWeddingThemeMusicId] = useState<string>(
    currentUser.weddingThemeMusicId || 'track-zorna-cortege'
  );
  const [previewMusicTrackId, setPreviewMusicTrackId] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isYouTubeMusicModalOpen, setIsYouTubeMusicModalOpen] = useState(false);
  const [allTracks, setAllTracks] = useState<MusicTrack[]>([]);

  useEffect(() => {
    setAllTracks(getAllAvailableTracks());
    const handleUpdate = () => {
      setAllTracks(getAllAvailableTracks());
    };
    window.addEventListener('nisfy_custom_tracks_updated', handleUpdate);
    return () => window.removeEventListener('nisfy_custom_tracks_updated', handleUpdate);
  }, []);
  const [selectedTrackForShare, setSelectedTrackForShare] = useState<MusicTrack | null>(null);

  // Video recording state
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const videoRecorderStream = useRef<MediaStream | null>(null);
  const recordVideoElemRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  // Media preview modal
  const [selectedMedia, setSelectedMedia] = useState<{
    type: 'photo' | 'video';
    url: string;
    title?: string;
  } | null>(null);

  const fileInputPhotoRef = useRef<HTMLInputElement>(null);
  const fileInputVideoRef = useRef<HTMLInputElement>(null);

  const interestOptions = isArabic
    ? [
        'زواج',
        'سفر',
        'موسيقى',
        'طبخ ومأكولات',
        'سينما',
        'تصوير',
        'رياضة ولياقة',
        'تجوال ومغامرة',
        'فن وثقافة',
        'قراءة',
        'ألعاب إلكترونية',
        'قهوة ومقاهي',
        'طبيعة',
        'يوغا واسترخاء',
      ]
    : [
        'Mariage',
        'Voyages',
        'Musique',
        'Cuisine & Gastronomie',
        'Cinéma',
        'Photographie',
        'Sport & Fitness',
        'Randonnée',
        'Art & Culture',
        'Lecture',
        'Jeux Vidéo',
        'Café & Brunch',
        'Nature',
        'Yoga',
      ];

  const toggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      if (interests.length < 6) {
        setInterests([...interests, item]);
      }
    }
  };

  // Upload photo handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          const newPhotoUrl = loadEvt.target.result as string;
          setPhotos((prev) => [...prev, newPhotoUrl]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Upload video handler
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          const newVideoUrl = loadEvt.target.result as string;
          const newVid: ProfileVideo = {
            id: `vid_${Date.now()}_${Math.random()}`,
            url: newVideoUrl,
            title: file.name.replace(/\.[^/.]+$/, '') || 'Vidéo de profil',
            thumbnail: avatar,
            duration: 15,
            createdAt: 'Aujourd’hui',
            isPresentation: videos.length === 0,
          };
          setVideos((prev) => [...prev, newVid]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add sample video
  const handleAddSampleVideo = (sample: typeof SAMPLE_VIDEOS[0]) => {
    const newVid: ProfileVideo = {
      id: `vid_${Date.now()}_${Math.random()}`,
      url: sample.url,
      title: sample.title,
      thumbnail: sample.thumbnail,
      duration: 12,
      createdAt: 'Aujourd’hui',
      isPresentation: videos.length === 0,
    };
    setVideos((prev) => [...prev, newVid]);
  };

  // Start live webcam video recording
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRecorderStream.current = stream;
      if (recordVideoElemRef.current) {
        recordVideoElemRef.current.srcObject = stream;
      }
      setIsRecordingVideo(true);
      setRecordingTimer(0);
      recordedChunks.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        const newVid: ProfileVideo = {
          id: `vid_rec_${Date.now()}`,
          url: videoUrl,
          title: 'Vidéo Selfie Présentation 🎥',
          thumbnail: avatar,
          duration: recordingTimer || 10,
          createdAt: 'À l’instant',
          isPresentation: true,
        };
        setVideos((prev) => [newVid, ...prev]);

        if (videoRecorderStream.current) {
          videoRecorderStream.current.getTracks().forEach((track) => track.stop());
          videoRecorderStream.current = null;
        }
        setIsRecordingVideo(false);
      };

      mediaRecorder.start();

      // Timer interval
      const timerInt = setInterval(() => {
        setRecordingTimer((prev) => {
          if (prev >= 20) {
            stopVideoRecording();
            clearInterval(timerInt);
            return 20;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.log('Video recording error:', err);
      alert('Impossible d’accéder à la caméra ou au micro.');
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const deletePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: UserProfile = {
      ...currentUser,
      pseudo: pseudo.trim(),
      city: city.trim(),
      age: Number(age),
      occupation: occupation.trim(),
      bio: bio.trim(),
      lookingFor,
      gender,
      icebreaker: icebreaker.trim(),
      avatar,
      photos: photos.length > 0 ? photos : [avatar],
      videos,
      interests,
      weddingThemeMusicId,
      hidePhotoInitially,
    };

    datingSounds.playLikeSound();
    onUpdateProfile(updated);
    syncUserProfileToSupabase(updated);

    // Save or update remembered credentials on this device
    if (rememberedOnDevice) {
      saveRememberedAccount({
        userId: updated.id,
        identifier: prefIdentifierType === 'pseudo' ? updated.pseudo : updated.email,
        type: prefIdentifierType,
        pseudo: updated.pseudo,
        email: updated.email,
        avatar: updated.avatar,
        city: updated.city,
        wilayaCode: updated.wilayaCode,
        gender: updated.gender,
        savedAt: new Date().toISOString(),
        autoConnect: true,
      });
    } else {
      clearRememberedAccount();
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <img
            src={avatar}
            alt={currentUser.pseudo}
            referrerPolicy="no-referrer"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-orange-100 shadow-md"
          />
          <span className="absolute -bottom-2 -right-2 p-1.5 bg-gradient-to-tr from-[#FF6B35] to-[#FF3823] text-white rounded-xl shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>

        <div className="text-center sm:text-left space-y-1 flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black text-slate-900">{pseudo}, {age}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
              {t.activeNow}
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#FF3823]" /> {city} • {currentUser.email}
          </p>

          <p className="text-xs text-slate-600 italic pt-1 max-w-md">
            « {bio} »
          </p>
        </div>

        {/* Stats */}
        <div className="flex sm:flex-col gap-2 shrink-0">
          <div className="bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 text-center">
            <span className="text-lg font-black text-[#FF3823]">{likesReceivedCount + 14}</span>
            <span className="text-[10px] font-extrabold text-orange-800 block uppercase">
              {t.likesReceived}
            </span>
          </div>
          <div className="bg-sky-50 px-4 py-2 rounded-2xl border border-sky-100 text-center">
            <span className="text-lg font-black text-[#0284C7]">
              {photos.length} 📸 • {videos.length} 📹
            </span>
            <span className="text-[10px] font-extrabold text-sky-800 block uppercase">
              Médias
            </span>
          </div>
        </div>
      </div>

      {/* Trust & Safety Section */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="6" fill="none" />
              <circle 
                cx="32" cy="32" r="28" 
                className={`stroke-current ${currentUser.trustScore?.color?.replace('text-', '') || 'text-[#FF3823]'} transition-all duration-1000`}
                strokeWidth="6" 
                fill="none" 
                strokeDasharray="175.9" 
                strokeDashoffset={175.9 - (175.9 * (currentUser.trustScore?.score || 40)) / 100}
                strokeLinecap="round" 
              />
            </svg>
            <div className="flex flex-col items-center justify-center z-10">
              <span className="text-sm font-black text-slate-900 dark:text-white">{currentUser.trustScore?.score || 40}</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF3823]" />
              {isArabic ? 'مؤشر الثقة (Trust Score)' : 'Trust Score'}
              {currentUser.verified && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              {currentUser.verified 
                ? (isArabic ? 'ملفك الشخصي موثق بالكامل.' : 'Votre profil est vérifié à 100%.')
                : (isArabic ? 'أكمل التحقق من هويتك لزيادة فرص التطابق.' : 'Complétez votre vérification pour obtenir le badge bleu.')}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsTrustModalOpen(true)}
          className="w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-[#FF3823] dark:hover:border-[#FF3823] text-slate-900 dark:text-white font-bold rounded-xl transition-all whitespace-nowrap shadow-sm hover:shadow-md"
        >
          {currentUser.verified ? (isArabic ? 'عرض التفاصيل' : 'Voir les détails') : (isArabic ? 'توثيق الحساب' : 'Vérifier mon profil')}
        </button>
      </div>

      {/* Media Management Section (Photos & Videos) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Film className="w-5 h-5 text-[#FF3823]" />
              <span>{t.photosAndVideos}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {isArabic
                ? 'أضف صورك ومقاطع الفيديو التعريفية لزيادة التفاعل والثقة'
                : 'Ajoutez vos photos et vos vidéos de présentation pour multiplier vos affinités'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputPhotoRef}
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <input
              type="file"
              ref={fileInputVideoRef}
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputPhotoRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-orange-50 text-[#FF3823] hover:bg-orange-100 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{t.addPhotoBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputVideoRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-sky-50 text-[#0284C7] hover:bg-sky-100 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>{t.addVideoBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPublishModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-[#FF3823] dark:text-[#FF6B35] text-xs font-semibold border border-orange-200/80 dark:border-orange-800/40 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Film className="w-4 h-4 text-[#FF3823]" />
              <span>{isArabic ? 'نشر فيديو وقصة' : 'Publier une vidéo / Story'}</span>
            </button>
          </div>
        </div>

        {/* Live Recording Modal if recording */}
        {isRecordingVideo && (
          <div className="bg-slate-950 rounded-2xl p-4 text-white space-y-3 border border-[#FF3823]/30 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-black text-[#FF6B35]">
                <span className="w-3 h-3 rounded-full bg-[#FF3823] animate-ping" />
                <span>{isArabic ? 'جاري تسجيل فيديو تعريفي...' : 'Enregistrement vidéo selfie en cours...'} ({recordingTimer}s / 20s)</span>
              </span>
              <button
                type="button"
                onClick={stopVideoRecording}
                className="px-4 py-1.5 bg-gradient-to-r from-[#FF6B35] to-[#FF3823] hover:opacity-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <StopCircle className="w-4 h-4" />
                <span>{isArabic ? 'إنهاء وحفظ' : 'Terminer & Ajouter'}</span>
              </button>
            </div>
            <div className="aspect-video max-h-64 mx-auto rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <video
                ref={recordVideoElemRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            </div>
          </div>
        )}

        {/* Photos Grid */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#FF3823]" />
            <span>{isArabic ? 'معرض الصور الشخصية' : 'Galerie Photos'} ({photos.length})</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {photos.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-xs group bg-slate-100"
              >
                <img
                  src={url}
                  alt={`Photo ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedMedia({ type: 'photo', url, title: `Photo ${index + 1}` })}
                />
                <button
                  type="button"
                  onClick={() => deletePhoto(index)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 text-white hover:bg-[#FF3823] transition-colors opacity-0 group-hover:opacity-100"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {url === avatar && (
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-[#FF3823] text-white rounded-md text-[9px] font-bold">
                    Principale
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Videos Section */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Film className="w-4 h-4 text-indigo-500" />
            <span>{t.videoPresentation} ({videos.length})</span>
          </h4>

          {videos.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3">
              <Film className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600 font-medium">
                {isArabic
                  ? 'لم تقم بإضافة أي مقطع فيديو بعد. أضف مقطع فيديو لزيادة فرص المطابقة !'
                  : 'Vous n’avez pas encore de vidéo de présentation. Une courte vidéo augmente considérablement vos interactions !'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {SAMPLE_VIDEOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddSampleVideo(sample)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-bold hover:bg-orange-50 hover:text-[#FF3823] transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{sample.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-slate-900 rounded-2xl overflow-hidden shadow-md border border-slate-700 relative group flex flex-col justify-between"
                >
                  <div
                    className="relative aspect-video w-full cursor-pointer bg-black flex items-center justify-center overflow-hidden"
                    onClick={() => setSelectedMedia({ type: 'video', url: vid.url, title: vid.title })}
                  >
                    <video
                      src={vid.url}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="p-3 rounded-full bg-[#FF3823]/90 text-white shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 flex flex-col gap-2 text-white">
                    <div className="flex items-center justify-between">
                      <div className="truncate pr-2">
                        <h5 className="font-bold text-xs truncate">{vid.title}</h5>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400">{vid.createdAt}</span>
                          {vid.isStoryOnWall && (
                            <span className="px-1.5 py-0.2 rounded-md bg-purple-500/30 text-purple-300 text-[9px] font-black">
                              Story Mur
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteVideo(vid.id)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-[#FF3823] text-white transition-colors shrink-0"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Clip Actions: Story on Wall & Music Share */}
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = videos.map((v) =>
                            v.id === vid.id ? { ...v, isStoryOnWall: !v.isStoryOnWall } : v
                          );
                          setVideos(updated);
                          onUpdateProfile({
                            ...currentUser,
                            videos: updated,
                          });
                        }}
                        className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          vid.isStoryOnWall
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-800 hover:bg-purple-950 text-purple-300 border border-purple-800/40'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-purple-300" />
                        <span>{vid.isStoryOnWall ? (isArabic ? 'قصة معروضة' : 'Story active') : (isArabic ? 'تحويل لستوري' : 'Mettre en Story')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const track = (vid.musicThemeId ? getTrackById(vid.musicThemeId) : null) || getTrackById(weddingThemeMusicId) || NISFY_MUSIC_CATALOG[0];
                          if (track) {
                            setSelectedTrackForShare(track);
                            setIsShareModalOpen(true);
                          }
                        }}
                        className="py-1 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                        title="Partager la musique"
                      >
                        <Share2 className="w-3 h-3 text-amber-400" />
                        <span>Musique</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Information Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {t.editProfileBtn}
            </h3>
            <p className="text-xs text-slate-500">
              {t.myProfileSubtitle}
            </p>
          </div>

          {saveSuccess && (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-in fade-in flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isArabic ? 'تم حفظ التعديلات بنجاح !' : 'Modifications enregistrées !'}</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar Choices */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t.avatarChoice} :
            </label>
            <div className="flex gap-2.5 overflow-x-auto pb-2">
              {AVATAR_SELECTION.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setAvatar(url);
                    if (!photos.includes(url)) {
                      setPhotos([url, ...photos]);
                    }
                  }}
                  className={`w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    avatar === url
                      ? 'border-[#FF3823] scale-105 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={url}
                    alt="Choice"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Basic Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.pseudoLabel}
              </label>
              <input
                type="text"
                required
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.wilayaResidenceLabel}
              </label>
              <select
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
              >
                <optgroup label={isArabic ? '🇩🇿 الجزائر (الولايات 01 إلى 58)' : '🇩🇿 Algérie (Wilayas 01 à 58)'}>
                  {WILAYAS_69.filter((w) => !w.isDiaspora).map((w) => (
                    <option key={w.code} value={`${w.code} - ${w.name} (${w.arabicName})`}>
                      {w.code} - {w.name} ({w.arabicName})
                    </option>
                  ))}
                </optgroup>
                <optgroup label={isArabic ? '🌍 دياسبورا DZ69 (الولايات 59 إلى 69)' : '🌍 Diaspora DZ69 (Wilayas 59 à 69)'}>
                  {WILAYAS_69.filter((w) => w.isDiaspora).map((w) => (
                    <option key={w.code} value={`${w.code} - ${w.name} (${w.arabicName})`}>
                      {w.code} - {w.name} ({w.arabicName})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t.ageLabel}</label>
              <input
                type="number"
                min={18}
                max={99}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.jobLabel}
              </label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder={isArabic ? 'مثال: مهندس، طبيب، أستاذ...' : 'ex: Graphiste, Développeur, Enseignant...'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.bioLabel}
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF3823] focus:outline-none"
            />
          </div>

          {/* Icebreaker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.icebreakerLabel}
            </label>
            <input
              type="text"
              value={icebreaker}
              onChange={(e) => setIcebreaker(e.target.value)}
              placeholder={isArabic ? 'مثال: ما هو مكانك السري المفضل في مدينتك ؟' : 'ex: Quel est ton endroit secret préféré dans ta ville ?'}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t.interestsChoice} :
            </label>
            <div className="flex flex-wrap gap-1.5">
              {interestOptions.map((item) => {
                const isSelected = interests.includes(item);
                const isMarriage = item === 'Mariage' || item === 'زواج';

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isMarriage
                        ? isSelected
                          ? 'bg-gradient-to-r from-amber-500 via-[#FF6B35] to-[#FF3823] text-white font-black shadow-md shadow-orange-500/30 ring-2 ring-amber-300 scale-105'
                          : 'bg-gradient-to-r from-amber-50 to-orange-50 text-orange-900 border-2 border-orange-300 hover:border-orange-400 font-extrabold shadow-xs hover:scale-102'
                        : isSelected
                        ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isMarriage && <span>💍</span>}
                    <span>{item}</span>
                    <span className="text-[10px] opacity-80">{isSelected ? '✓' : '+'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Floutage Pudique & Révélation Progressive (حياء - Hayaa Mode) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧕</span>
                <h4 className="text-xs font-black text-emerald-950">
                  {isArabic ? 'وضع الحياء (إخفاء الصورة وكشفها تدريجياً)' : 'Mode Floutage Pudique & Hayaa (حياء)'}
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black">
                  Zawaj DZ
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed max-w-xl">
                {isArabic
                  ? 'عند التفعيل، تظهر صورك بشكل ضبابي ومحترم للجميع، ولا يتم كشفها إلا عند النقر عليها أو تبادل الإعجاب برضاك الكامل.'
                  : 'Vos photos restent floutées avec respect lors de la découverte. Elles ne sont révélées que sur demande de visionnage ou après match mutuel.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={hidePhotoInitially}
                onChange={(e) => setHidePhotoInitially(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* 🎵 THÈME MUSICAL & AMBIANCE MARIAGE PERSONNEL (Choix, Partage & Story) */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-orange-500/10 via-[#FF3823]/10 to-sky-500/10 border border-orange-200/80 dark:border-slate-700 space-y-4">
            <MusicSelector
              selectedTrackId={weddingThemeMusicId}
              onSelectTrack={(track) => setWeddingThemeMusicId(track.id)}
              onShareTrack={(track) => {
                setSelectedTrackForShare(track);
                setIsShareModalOpen(true);
              }}
              currentUserPseudo={currentUser.pseudo}
              title={isArabic ? '🎵 الموسيقى والجو المميز لملفي الشخصي' : '🎵 Mon Thème Musical & Ambiance Mariage'}
            />
          </div>

          {/* Mémorisation du compte & Connexion Rapide (1-Clic) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/80 border border-orange-200/80 dark:border-slate-700 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                  </span>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {isArabic
                      ? 'الدخول المباشر والتلقائي (دون إعادة كتابة البيانات)'
                      : 'Connexion Directe 1-Clic & Mémorisation'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-orange-200 dark:bg-orange-900/40 text-orange-900 dark:text-orange-300 text-[10px] font-black">
                    {rememberedOnDevice ? (isArabic ? 'مفعل' : 'Actif') : (isArabic ? 'معطل' : 'Inactif')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  {isArabic
                    ? 'عند الخروج أو فتح التطبيق مرة أخرى، يتعرف Nisfy عليك فوراً ويسمح لك بالدخول بنقرة واحدة باستخدام بريدك أو اسمك المستعار.'
                    : 'Lors de votre prochaine visite, Nisfy vous reconnaît et vous propose la connexion immédiate en 1 clic sans devoir ressaisir vos coordonnées.'}
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={rememberedOnDevice}
                  onChange={(e) => setRememberedOnDevice(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF3823]"></div>
              </label>
            </div>

            {rememberedOnDevice && (
              <div className="pt-2 border-t border-orange-200/60 dark:border-slate-700/60 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  {isArabic ? 'طريقة التعريف المفضلة:' : 'Identifiant mémorisé :'}
                </span>
                <button
                  type="button"
                  onClick={() => setPrefIdentifierType('pseudo')}
                  className={`px-3 py-1 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    prefIdentifierType === 'pseudo'
                      ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>Pseudo (@{pseudo})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrefIdentifierType('email')}
                  className={`px-3 py-1 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    prefIdentifierType === 'email'
                      ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <Mail className="w-3 h-3" />
                  <span>Email ({currentUser.email})</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile PWA Installation Card */}
          {onOpenPwaInstall && (
            <div className="p-4 bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-amber-500/10 rounded-2xl border border-orange-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B0F19] text-[#FF3823] flex items-center justify-center shrink-0 border border-[#FF3823]/40 shadow-sm">
                  <Smartphone className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-slate-900 dark:text-white">
                      {isArabic ? 'تطبيق نصفي على هاتفك (PWA)' : 'Application Mobile Nisfy (PWA)'}
                    </p>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#FF3823]/20 text-[#FF3823] text-[9px] font-bold border border-[#FF3823]/30">
                      100% DZ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isArabic
                      ? 'تثبيت سريع ومباشر بدون متجر، استهلاك بيانات منخفض وتنبيهات فورية'
                      : 'Installation rapide sans App Store ni Play Store, alertes en temps réel'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenPwaInstall}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 hover:opacity-95 transition-all cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{isArabic ? 'تثبيت التطبيق' : 'Installer l’App'}</span>
              </button>
            </div>
          )}

          {/* Support & Admin Assistance Nisfy */}
          <div className="p-4 bg-gradient-to-r from-slate-50 to-orange-50/40 dark:from-slate-800 dark:to-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#FF3823] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">
                  {isArabic ? 'الدعم الفني والإدارة الرسمية' : 'Support & Direction Nisfy'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isArabic ? 'لأي استفسار أو طلب مساعدة، راسلنا على :' : 'Pour toute question ou demande officielle :'}
                </p>
              </div>
            </div>
            <a
              href="mailto:contact@nisfy.app?subject=[NISFY%20SUPPORT]%20Demande%20Utilisateur"
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-orange-50 text-[#FF3823] dark:text-[#FF6B35] font-bold border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 transition-colors shadow-2xs font-mono"
            >
              <span>contact@nisfy.app</span>
            </a>
          </div>

          {/* Actions Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onLogout}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-[#FF3823] hover:bg-orange-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.logout}</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] hover:opacity-95 text-white rounded-2xl text-xs font-black shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveChangesBtn}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <MediaViewerModal
          isOpen={true}
          onClose={() => setSelectedMedia(null)}
          mediaType={selectedMedia.type}
          mediaUrl={selectedMedia.url}
          title={selectedMedia.title}
          authorName={currentUser.pseudo}
          authorAvatar={currentUser.avatar}
          authorCity={currentUser.city}
        />
      )}

      {/* Trust Verification Modal */}
      <TrustVerificationModal
        isOpen={isTrustModalOpen}
        onClose={() => setIsTrustModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={onUpdateProfile}
      />

      {/* Publish Video Modal */}
      {isPublishModalOpen && (
        <PublishVideoModal
          currentUser={currentUser}
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          onPublishVideo={(newVideo) => {
            const updatedVideos = [newVideo, ...videos];
            setVideos(updatedVideos);
            onUpdateProfile({
              ...currentUser,
              videos: updatedVideos,
            });
            setIsPublishModalOpen(false);
          }}
        />
      )}

      {/* Music Share & Story Modal */}
      {isShareModalOpen && selectedTrackForShare && (
        <MusicShareModal
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setSelectedTrackForShare(null);
          }}
          track={selectedTrackForShare}
          currentUser={currentUser}
          onCreateStory={() => {
            setIsShareModalOpen(false);
            setIsPublishModalOpen(true);
          }}
        />
      )}

      {/* YouTube Music Import Modal */}
      <YouTubeMusicImportModal
        isOpen={isYouTubeMusicModalOpen}
        onClose={() => setIsYouTubeMusicModalOpen(false)}
        onSelectTrack={(importedTrack) => {
          setAllTracks(getAllAvailableTracks());
          setWeddingThemeMusicId(importedTrack.id);
        }}
        currentUserPseudo={currentUser.pseudo}
      />
    </div>
  );
}


