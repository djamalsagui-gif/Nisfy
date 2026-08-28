import React, { useState, useEffect } from 'react';
import { Upload, X, MapPin, Tag, Music, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAppStore } from '../../stores/appStore';
import { NISFY_MUSIC_CATALOG, getAllAvailableTracks, getTrackById, MusicTrack } from '../../data/musicThemes';
import { musicAudioEngine } from '../../utils/musicAudioEngine';
import { YouTubeMusicImportModal } from '../music/YouTubeMusicImportModal';

interface PublishVideoModalProps {
  onClose: () => void;
  onPublish: (data: any) => void;
  initialTrackId?: string;
  initialIsStory?: boolean;
}

export function PublishVideoModal({ onClose, onPublish, initialTrackId, initialIsStory = false }: PublishVideoModalProps) {
  const { isArabic } = useLanguage();
  const addXp = useAppStore((state) => state.addXp);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('selfie');
  const [selectedMusicThemeId, setSelectedMusicThemeId] = useState(initialTrackId || 'track-zorna-cortege');
  const [isStoryOnWall, setIsStoryOnWall] = useState(initialIsStory);
  const [previewPlayingId, setPreviewPlayingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [allTracks, setAllTracks] = useState<MusicTrack[]>([]);

  useEffect(() => {
    setAllTracks(getAllAvailableTracks());
    const handleUpdate = () => {
      setAllTracks(getAllAvailableTracks());
    };
    window.addEventListener('nisfy_custom_tracks_updated', handleUpdate);
    return () => window.removeEventListener('nisfy_custom_tracks_updated', handleUpdate);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    const chosenTrack = getTrackById(selectedMusicThemeId);

    // Simulate upload
    setTimeout(() => {
      addXp(100); // 100 XP for publishing
      onPublish({
        title,
        description,
        category,
        musicThemeId: selectedMusicThemeId,
        musicTitle: chosenTrack ? `${chosenTrack.title} • ${chosenTrack.artist}` : undefined,
        musicThemeUrl: chosenTrack?.audioUrl,
        youtubeId: chosenTrack?.youtubeId,
        isStoryOnWall: isStoryOnWall,
      });
      setIsUploading(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{isArabic ? 'نشر فيديو وستوري' : 'Publier une vidéo ou Story'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF3823]/10 text-[#FF3823] font-extrabold">DZ</span>
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <form id="publish-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Dropzone */}
            <div className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-500 gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-[#FF3823]" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isArabic ? 'اختر فيديو (15-60 ثانية)' : 'Sélectionner une vidéo (15-60s)'}
              </p>
              <p className="text-[10px] text-slate-400">MP4, WebM ou MOV</p>
            </div>

            {/* 🎵 Music Selector */}
            <div className="p-3 bg-orange-50/80 dark:bg-orange-950/30 rounded-2xl border border-orange-200 dark:border-orange-800/50 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[#FF6B35]" />
                  <span>{isArabic ? 'الموسيقى المرافقة للمقطع' : 'Musique du Clip / Story'}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsYouTubeModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF3823] hover:opacity-95 text-white text-[10px] font-black flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span>{isArabic ? '+ يوتيوب' : '+ YouTube'}</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {allTracks.map((track) => {
                  const isSelected = selectedMusicThemeId === track.id;
                  const isPlaying = previewPlayingId === track.id;

                  return (
                    <div
                      key={track.id}
                      onClick={() => setSelectedMusicThemeId(track.id)}
                      className={`p-2 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-orange-500/20 border-[#FF3823] ring-1 ring-[#FF3823]/40 text-slate-900 dark:text-white font-bold'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span>{track.icon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-bold truncate">{track.title}</p>
                            {track.isCustomImport && (
                              <span className="text-[8px] font-black px-1 rounded-sm bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">YT</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{track.artist}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isPlaying) {
                            musicAudioEngine.stop();
                            setPreviewPlayingId(null);
                          } else {
                            musicAudioEngine.play(track);
                            setPreviewPlayingId(track.id);
                          }
                        }}
                        className={`p-1 rounded-lg text-xs transition-all shrink-0 ${
                          isPlaying
                            ? 'bg-[#FF3823] text-white animate-pulse'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-orange-400 hover:text-white'
                        }`}
                      >
                        {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Story on Wall Checkbox */}
            <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 cursor-pointer">
              <input
                type="checkbox"
                checked={isStoryOnWall}
                onChange={(e) => setIsStoryOnWall(e.target.checked)}
                className="w-4 h-4 text-[#FF3823] rounded focus:ring-[#FF3823] cursor-pointer"
              />
              <div>
                <span className="text-xs font-black text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
                  <span>{isArabic ? 'نشر كستوري على حائطي وواجهتي' : 'Publier comme Story sur mon mur'}</span>
                </span>
                <span className="text-[10px] text-purple-700 dark:text-purple-300 block">
                  {isArabic ? 'ستظهر في أعلى شريط الستوري 24 ساعة لجميع المتابعين' : 'Sera visible 24h dans la barre des stories du feed'}
                </span>
              </div>
            </label>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catégorie
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#FF3823] outline-none"
              >
                <option value="mariage">💍 Mariage & Zawaj</option>
                <option value="cuisine">🍳 Cuisine DZ</option>
                <option value="voyage">✈️ Voyage & Découverte</option>
                <option value="documentaire">🎬 Documentaire & Culture</option>
                <option value="selfie">🤳 Selfie & Présentation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Titre
              </label>
              <input 
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#FF3823] outline-none text-slate-900 dark:text-white"
                placeholder="Un titre accrocheur..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description & Hashtags
              </label>
              <textarea 
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#FF3823] outline-none text-slate-900 dark:text-white resize-none"
                placeholder="Racontez l'histoire de votre vidéo... #Nisfy"
              />
            </div>
            
            <div className="flex gap-2">
              <button type="button" className="flex-1 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Lieu DZ
              </button>
              <button type="button" className="flex-1 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                #ZawajDZ
              </button>
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            type="submit"
            form="publish-form"
            disabled={isUploading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF3823] text-white font-black shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isUploading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{isArabic ? 'نشر الفيديو / الستوري' : 'Publier le Clip / Story'} (+100 XP)</span>
            )}
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
        currentUserPseudo="Membre DZ"
      />
    </div>
  );
}
