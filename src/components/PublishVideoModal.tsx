import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Camera,
  Video,
  Upload,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Film,
  Globe,
  Tag,
  Clock,
  Mic,
  MicOff,
  Smile,
  ShieldCheck,
  Heart,
  Eye,
  Layers,
  Music,
  Volume2,
  VolumeX,
  Radio,
} from 'lucide-react';
import { UserProfile, ProfileVideo } from '../types';
import { datingSounds } from '../utils/soundEffects';
import { useLanguage } from '../context/LanguageContext';
import {
  NISFY_MUSIC_CATALOG,
  getAllAvailableTracks,
  getTrackById,
  MusicTrack,
} from '../data/musicThemes';
import { musicAudioEngine } from '../utils/musicAudioEngine';
import { YouTubeMusicImportModal } from './music/YouTubeMusicImportModal';
import { MusicSelector } from './music/MusicSelector';

interface PublishVideoModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onPublishVideo: (newVideo: ProfileVideo) => void;
  initialTrackId?: string;
  initialIsStory?: boolean;
}

const TEMPLATE_VIDEOS = [
  {
    id: 'tpl_1',
    title: 'Présentation Spontanée & Charme DZ 🌺',
    description: 'Une présentation chaleureuse en 15 secondes pour exprimer ma personnalité.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    duration: 15,
    tag: '#Présentation',
  },
  {
    id: 'tpl_2',
    title: 'Salutations d’Extérieur & Démarche Sérieuse 🦁',
    description: 'Message franc et sincère tourné en extérieur pour une démarche matrimoniale.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    duration: 12,
    tag: '#MariageDZ',
  },
  {
    id: 'tpl_3',
    title: 'Sourire d’El Bahia & Ambition 🌊',
    description: 'Énergie positive, présentation de mes passions et de mes valeurs familiales.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    duration: 10,
    tag: '#Sourire',
  },
  {
    id: 'tpl_4',
    title: 'Vue des Ponts & Discussion Malouf 🌉',
    description: 'Partage d’un instant culturel et recherche d’une personne posée.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    duration: 14,
    tag: '#CultureDZ',
  },
];

const QUICK_TAGS = [
  '#MariageDZ',
  '#Présentation',
  '#Diaspora69',
  '#Gaâda',
  '#CuisineDZ',
  '#CultureDZ',
  '#Voyages',
  '#Traditions',
];

export function PublishVideoModal({
  currentUser,
  isOpen,
  onClose,
  onPublishVideo,
  initialTrackId,
  initialIsStory = false,
}: PublishVideoModalProps) {
  const { t, isArabic } = useLanguage();

  // Mode: 'record' | 'upload' | 'templates'
  const [tabMode, setTabMode] = useState<'record' | 'upload' | 'templates'>('record');

  // Video data state
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoThumbnail, setVideoThumbnail] = useState<string>(currentUser.avatar);
  const [title, setTitle] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>(initialIsStory ? '#StoryWall' : '#MariageDZ');
  const [duration, setDuration] = useState<number>(15);
  const [isPrimaryPresentation, setIsPrimaryPresentation] = useState<boolean>(
    !currentUser.videos || currentUser.videos.length === 0
  );

  // 🎵 Music & Story on Wall State
  const [selectedMusicThemeId, setSelectedMusicThemeId] = useState<string>(
    initialTrackId || currentUser.weddingThemeMusicId || 'track-zorna-cortege'
  );
  const [isStoryOnWall, setIsStoryOnWall] = useState<boolean>(initialIsStory);
  const [previewTrackPlayingId, setPreviewTrackPlayingId] = useState<string | null>(null);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState<boolean>(false);
  const [allTracks, setAllTracks] = useState<MusicTrack[]>([]);

  useEffect(() => {
    setAllTracks(getAllAvailableTracks());
    const handleUpdate = () => {
      setAllTracks(getAllAvailableTracks());
    };
    window.addEventListener('nisfy_custom_tracks_updated', handleUpdate);
    return () => window.removeEventListener('nisfy_custom_tracks_updated', handleUpdate);
  }, []);

  // Live recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [hasRecordedVideo, setHasRecordedVideo] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<'normal' | 'warm' | 'cinema' | 'vintage'>('normal');

  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const videoRecordedRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera when unmounting or switching tabs
  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen && tabMode === 'record' && !hasRecordedVideo) {
      startCamera();
    } else {
      stopCameraStream();
    }
    return () => {
      stopCameraStream();
    };
  }, [isOpen, tabMode, hasRecordedVideo]);

  // Start webcam preview
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
          audio: true,
        });
        mediaStreamRef.current = stream;
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
          videoPreviewRef.current.play().catch(() => {});
        }
      } else {
        setCameraError(
          isArabic
            ? 'الكاميرا غير مدعومة في متصفحك. يمكنك رفع ملف فيديو بدلاً من ذلك.'
            : 'Caméra non accessible. Vous pouvez téléverser un fichier vidéo ou utiliser un modèle.'
        );
      }
    } catch (err: any) {
      setCameraError(
        isArabic
          ? 'تعذر الوصول إلى الكاميرا أو تم رفض الإذن. يمكنك استخدام خاصية رفع الفيديو أو القوالب.'
          : 'Impossible d’accéder à la caméra. Utilisez le téléversement de fichier ou nos modèles prêts à l’emploi.'
      );
    }
  };

  // Start actual recording
  const startRecording = () => {
    if (!mediaStreamRef.current) {
      startCamera();
      return;
    }

    try {
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(mediaStreamRef.current);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const generatedUrl = URL.createObjectURL(blob);
        setVideoUrl(generatedUrl);
        setVideoThumbnail(currentUser.avatar);
        setHasRecordedVideo(true);
        setDuration(recordingSeconds || 10);
        stopCameraStream();
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);

      datingSounds.playTapSound();
    } catch (err) {
      console.error(err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRecording(false);
    datingSounds.playLikeSound();
  };

  // Reset recording to record again
  const handleResetRecording = () => {
    setHasRecordedVideo(false);
    setVideoUrl('');
    setRecordingSeconds(0);
    startCamera();
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setVideoUrl(fileUrl);
    setVideoThumbnail(currentUser.avatar);
    setDuration(15);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
    datingSounds.playTapSound();
  };

  // Handle template selection
  const handleSelectTemplate = (tpl: typeof TEMPLATE_VIDEOS[0]) => {
    setVideoUrl(tpl.url);
    setVideoThumbnail(tpl.thumbnail);
    setTitle(tpl.title);
    setSelectedTag(tpl.tag);
    setDuration(tpl.duration);
    datingSounds.playTapSound();
  };

  // Submit & Publish Video
  const handlePublish = () => {
    if (!videoUrl) {
      alert(
        isArabic
          ? 'يرجى تسجيل فيديو أو اختيار ملف للنشر'
          : 'Veuillez enregistrer une vidéo ou sélectionner un fichier avant de publier.'
      );
      return;
    }

    const finalTitle =
      title.trim() ||
      (isArabic
        ? `قصة وستوري ${currentUser.pseudo} 🇩🇿`
        : `Présentation vidéo de ${currentUser.pseudo} 🇩🇿`);

    const chosenTrack = getTrackById(selectedMusicThemeId);

    const newVideo: ProfileVideo = {
      id: `vid_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      url: videoUrl,
      title: `${finalTitle} ${selectedTag}`,
      thumbnail: videoThumbnail || currentUser.avatar,
      duration: duration || 15,
      createdAt: 'À l’instant',
      isPresentation: isPrimaryPresentation,
      musicThemeId: selectedMusicThemeId,
      musicThemeArtist: chosenTrack ? `${chosenTrack.title} - ${chosenTrack.artist}` : undefined,
      isStoryOnWall: isStoryOnWall,
    };

    onPublishVideo(newVideo);

    // Celebration
    datingSounds.playMatchSound();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#6366f1', '#10b981'],
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>{isArabic ? 'نشر فيديو وستوري في نصفي' : 'Publier une Vidéo NISFY'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white uppercase tracking-wider">
                  DZ69
                </span>
              </h2>
              <p className="text-[11px] text-white/80">
                {isArabic
                  ? 'حق حصري لكل عضو: شارك فيديو قصير مرئي لكل مجتمع نصفي'
                  : 'Visible par l’ensemble des membres de la communauté NISFY'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center border-b border-slate-100 bg-slate-50 px-5 pt-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setTabMode('record');
              datingSounds.playTapSound();
            }}
            className={`pb-2.5 px-3 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
              tabMode === 'record'
                ? 'border-[#FF3823] text-[#FF3823] bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{isArabic ? 'تسجيل مباشر للكاميرا' : 'Enregistrer Selfie'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTabMode('upload');
              stopCameraStream();
              datingSounds.playTapSound();
            }}
            className={`pb-2.5 px-3 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
              tabMode === 'upload'
                ? 'border-[#FF3823] text-[#FF3823] bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{isArabic ? 'رفع فيديو من الجهاز' : 'Importer Fichier'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTabMode('templates');
              stopCameraStream();
              datingSounds.playTapSound();
            }}
            className={`pb-2.5 px-3 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
              tabMode === 'templates'
                ? 'border-[#FF3823] text-[#FF3823] bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{isArabic ? 'قوالب وفيديوهات جاهزة' : 'Modèles DZ'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: RECORD WITH WEBCAM */}
          {tabMode === 'record' && (
            <div className="space-y-4">
              {!hasRecordedVideo ? (
                <div className="relative aspect-video sm:aspect-4/3 max-w-md mx-auto rounded-2xl bg-slate-950 overflow-hidden shadow-lg border border-slate-800 flex items-center justify-center">
                  <video
                    ref={videoPreviewRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transform -scale-x-100 ${
                      selectedFilter === 'warm'
                        ? 'sepia-[0.3] saturate-125'
                        : selectedFilter === 'cinema'
                        ? 'contrast-125 saturate-110 brightness-95'
                        : selectedFilter === 'vintage'
                        ? 'sepia-[0.6] contrast-110'
                        : ''
                    }`}
                  />

                  {cameraError && (
                    <div className="absolute inset-0 bg-slate-900/90 p-6 flex flex-col items-center justify-center text-center text-white space-y-3 z-20">
                      <Camera className="w-10 h-10 text-[#FF3823] opacity-60" />
                      <p className="text-xs text-slate-300 max-w-xs">{cameraError}</p>
                      <button
                        type="button"
                        onClick={() => setTabMode('templates')}
                        className="px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF3823] rounded-xl text-xs font-bold text-white shadow-md cursor-pointer"
                      >
                        {isArabic ? 'اختيار قالب فيديو جاهز' : 'Choisir un modèle prêt à l’emploi'}
                      </button>
                    </div>
                  )}

                  {/* Recording Status Overlay */}
                  {isRecording && (
                    <div className="absolute top-3 left-3 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white border border-[#FF3823]/40">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF3823] animate-ping" />
                      <span className="text-xs font-black">
                        REC 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} / 60s
                      </span>
                    </div>
                  )}

                  {/* Filter selector pill on video */}
                  {!isRecording && !cameraError && (
                    <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1 bg-black/50 backdrop-blur-md p-1 rounded-xl text-white text-[10px] font-bold">
                      <span className="px-1 text-slate-300">Filtre:</span>
                      {(['normal', 'warm', 'cinema', 'vintage'] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setSelectedFilter(f)}
                          className={`px-2 py-0.5 rounded-lg capitalize cursor-pointer transition-colors ${
                            selectedFilter === f ? 'bg-[#FF3823] text-white' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Review recorded video */
                <div className="relative aspect-video sm:aspect-4/3 max-w-md mx-auto rounded-2xl bg-slate-950 overflow-hidden shadow-lg border border-slate-800 flex items-center justify-center">
                  <video
                    ref={videoRecordedRef}
                    src={videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleResetRecording}
                    className="absolute top-3 right-3 z-30 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'إعادة التسجيل' : 'Recommencer'}</span>
                  </button>
                </div>
              )}

              {/* Record Action Controls */}
              {!hasRecordedVideo && !cameraError && (
                <div className="flex items-center justify-center gap-4 py-2">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF3823] hover:opacity-95 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/30 transition-transform active:scale-95 cursor-pointer"
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white animate-pulse" />
                      <span>{isArabic ? 'بدء تسجيل الفيديو (حتى 60 ثانية)' : 'Lancer l’Enregistrement (jusqu’à 60s)'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-6 py-3 rounded-full bg-slate-900 hover:bg-black text-white font-black text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer ring-2 ring-[#FF3823]"
                    >
                      <span className="w-3 h-3 bg-[#FF3823] rounded-sm" />
                      <span>{isArabic ? 'إنهاء وحفظ الفيديو' : 'Terminer & Valider la Vidéo'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPLOAD VIDEO FILE */}
          {tabMode === 'upload' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-orange-300 hover:border-[#FF3823] bg-orange-50/40 rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
              >
                <div className="w-16 h-16 rounded-full bg-orange-100 text-[#FF3823] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-black text-slate-800">
                  {isArabic ? 'اختر ملف فيديو من هاتفك أو حاسوبك' : 'Sélectionnez un fichier vidéo (MP4, WebM, MOV)'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  {isArabic
                    ? 'فيديوهات عمودية أو أفقية قصيرة (10 إلى 60 ثانية) للتعريف بنفسك'
                    : 'Format court recommandé (10s à 60s) pour un maximum de visibilité auprès des adhérents.'}
                </p>
                <span className="mt-4 px-4 py-2 rounded-xl bg-white border border-orange-200 text-[#FF3823] text-xs font-bold shadow-xs">
                  {isArabic ? 'تصفح الملفات' : 'Parcourir les fichiers'}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {videoUrl && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isArabic ? 'تم تحميل الفيديو بنجاح !' : 'Vidéo chargée avec succès !'}</span>
                  </div>
                  <video src={videoUrl} className="w-16 h-12 rounded-lg object-cover bg-black" />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: READY-TO-USE TEMPLATES */}
          {tabMode === 'templates' && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-600">
                {isArabic ? 'نماذج فيديوهات جزائرية ملهمة :' : 'Sélectionnez un clip modèle inspirant :'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TEMPLATE_VIDEOS.map((tpl) => {
                  const isSelected = videoUrl === tpl.url;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex gap-3 items-center group ${
                        isSelected
                          ? 'border-[#FF3823] bg-orange-50/60 shadow-md ring-2 ring-[#FF6B35]/40'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src={tpl.thumbnail}
                          alt={tpl.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-[#FF3823] uppercase">
                            {tpl.tag}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {tpl.duration}s
                          </span>
                        </div>
                        <h4 className="text-xs font-extrabold text-slate-900 truncate mt-0.5">
                          {tpl.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {tpl.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Metadata Section (Title, Tags, Main Badge) */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                {isArabic ? 'عنوان أو رسالة الفيديو' : 'Titre ou phrase d’accroche'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  isArabic
                    ? 'مثال: السلام عليكم ! تقديمي في 15 ثانية للزواج الجاد 💍'
                    : 'Ex: Salam ! Ma présentation en 15s pour un projet sérieux 💍'
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#FF3823] focus:outline-none"
              />
            </div>

            {/* Quick Hashtags */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#FF3823]" />
                <span>{isArabic ? 'الوسم / الموضوع :' : 'Thème & Hashtag principal :'}</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-[#FF3823] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 🎵 CHOIX DE LA MUSIQUE / AMBIANCE DU CLIP */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-sky-500/10 border border-orange-300 dark:border-orange-700/50 space-y-2">
              <MusicSelector
                selectedTrackId={selectedMusicThemeId}
                onSelectTrack={(track) => setSelectedMusicThemeId(track.id)}
                currentUserPseudo={currentUser.pseudo}
                compact={true}
                title={isArabic ? '🎵 إضافة موسيقى للمقطع / الستوري' : '🎵 Musique & Ambiance Thématique du Clip'}
              />
            </div>

            {/* Story on Wall Toggle (Faire d'un clip une story sur son mur) */}
            <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/80 cursor-pointer">
              <input
                type="checkbox"
                checked={isStoryOnWall}
                onChange={(e) => setIsStoryOnWall(e.target.checked)}
                className="w-4 h-4 text-[#FF3823] rounded focus:ring-[#FF3823] cursor-pointer"
              />
              <div>
                <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                  <span>✨ {isArabic ? 'نشر كستوري على حائطي وواجهتي' : 'Publier en Story sur mon Mur & Feed'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 text-[10px] font-black">Story 24h</span>
                </span>
                <span className="text-[11px] text-purple-700 block">
                  {isArabic
                    ? 'سيظهر المقطع في شريط الستوري الدائري العلوي لجميع المتابعين والأعضاء مع الموسيقى'
                    : 'Le clip apparaîtra dans la barre des Stories Nisfy en haut du fil d’actualité.'}
                </span>
              </div>
            </label>

            {/* Primary Presentation Toggle */}
            <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrimaryPresentation}
                onChange={(e) => setIsPrimaryPresentation(e.target.checked)}
                className="w-4 h-4 text-[#FF3823] rounded focus:ring-[#FF3823] cursor-pointer"
              />
              <div>
                <span className="text-xs font-black text-amber-900 block">
                  {isArabic ? 'تعيين كفيديو تعريفي رئيسي للملف الشخصي' : 'Définir comme vidéo de présentation principale'}
                </span>
                <span className="text-[11px] text-amber-700 block">
                  {isArabic
                    ? 'سيظهر زر الفيديو مباشرة على بطاقة ملفك في صفحة الاستكشاف'
                    : 'Ce badge vidéo s’affichera sur votre carte de découverte pour attirer l’attention.'}
                </span>
              </div>
            </label>

            {/* Global Visibility Badge */}
            <div className="flex items-center gap-2 text-slate-500 text-[11px] px-1">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                {isArabic
                  ? 'رؤية عامة: سيشاهد جميع أعضاء نصفي هذا الفيديو فور نشره'
                  : 'Visibilité publique : vidéo accessible à l’ensemble des membres NISFY.'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {isArabic ? 'إلغاء' : 'Annuler'}
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={!videoUrl}
            className={`px-6 py-2.5 rounded-2xl text-xs font-black text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
              videoUrl
                ? 'bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] hover:opacity-95 shadow-orange-500/25 active:scale-95'
                : 'bg-slate-300 cursor-not-allowed opacity-60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isArabic ? 'نشر الفيديو لجميع الأعضاء 🇩🇿' : 'Publier la Vidéo sur NISFY 🇩🇿'}</span>
          </button>
        </div>
      </div>

      {/* YouTube Music Import Modal */}
      <YouTubeMusicImportModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        onSelectTrack={(importedTrack) => {
          setAllTracks(getAllAvailableTracks());
          setSelectedMusicThemeId(importedTrack.id);
        }}
        currentUserPseudo={currentUser.pseudo}
      />
    </div>
  );
}
