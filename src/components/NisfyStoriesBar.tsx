import React from 'react';
import { Play, Plus, Film, Sparkles, Video, Camera } from 'lucide-react';
import { UserProfile, ProfileVideo } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NisfyStoriesBarProps {
  currentUser: UserProfile;
  users: UserProfile[];
  onOpenStory: (user: UserProfile, videoIndex?: number) => void;
  onAddStory: () => void;
}

export function NisfyStoriesBar({
  currentUser,
  users,
  onOpenStory,
  onAddStory,
}: NisfyStoriesBarProps) {
  const { t, isArabic } = useLanguage();

  const currentUserVideos = currentUser.videos || [];
  const hasUserVideos = currentUserVideos.length > 0;

  // Filter other users who have videos
  const otherUsersWithVideos = users.filter(
    (u) => u.videos && u.videos.length > 0 && u.id !== currentUser.id
  );

  return (
    <div className="w-full bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-xs mb-4 select-none">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white">
            <Film className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
              {isArabic ? 'فيديوهات وقصص نصفي DZ69' : 'Vidéos & Stories des Adhérents NISFY'}
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-100 text-rose-700 uppercase">
                Reels DZ
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddStory}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white text-[11px] font-black flex items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isArabic ? '+ نشر فيديو' : '+ Publier Vidéo'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
        {/* Current User Story Bubble */}
        <div className="flex flex-col items-center gap-1 shrink-0 group">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.75 cursor-pointer">
            {hasUserVideos ? (
              <div
                onClick={() => onOpenStory(currentUser, 0)}
                className="w-full h-full rounded-full p-0.5 bg-gradient-to-tr from-emerald-400 via-teal-500 to-indigo-600 group-hover:scale-105 transition-transform"
              >
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-slate-900">
                  <img
                    src={currentUserVideos[0]?.thumbnail || currentUser.avatar}
                    alt={currentUser.pseudo}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            ) : (
              <div
                onClick={onAddStory}
                className="w-full h-full rounded-full border-2 border-dashed border-rose-300 group-hover:border-rose-500 transition-all flex items-center justify-center p-0.5"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.pseudo}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover group-hover:scale-95 transition-transform"
                />
              </div>
            )}

            {/* Plus / Add overlay button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddStory();
              }}
              title={isArabic ? 'نشر فيديو جديد' : 'Ajouter une nouvelle vidéo'}
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-xs font-black shadow-md transition-transform hover:scale-110 cursor-pointer ring-2 ring-white"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <span
            onClick={hasUserVideos ? () => onOpenStory(currentUser, 0) : onAddStory}
            className="text-[10px] sm:text-[11px] font-bold text-slate-800 max-w-[68px] truncate text-center cursor-pointer group-hover:text-rose-600 transition-colors"
          >
            {hasUserVideos ? (isArabic ? 'قصتي' : 'Ma Story') : (isArabic ? 'نشر +' : 'Ajouter +')}
          </span>
        </div>

        {/* Other Users' Stories */}
        {otherUsersWithVideos.map((user) => {
          const videoCount = user.videos?.length || 0;
          return (
            <div
              key={user.id}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
              onClick={() => onOpenStory(user, 0)}
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.75 bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 group-hover:scale-105 transition-transform shadow-xs">
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-slate-900">
                  <img
                    src={user.videos?.[0]?.thumbnail || user.avatar}
                    alt={user.pseudo}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-slate-900/90 text-white text-[9px] font-black border border-white/30 flex items-center gap-0.5">
                  <Play className="w-2.5 h-2.5 fill-white" />
                  <span>{videoCount}</span>
                </div>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 max-w-[68px] truncate text-center group-hover:text-rose-600 transition-colors">
                {user.pseudo.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
