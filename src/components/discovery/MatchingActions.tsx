import React from 'react';
import { X, Heart, Sparkles, Flower2, Bookmark } from 'lucide-react';
import useSound from 'use-sound';

interface MatchingActionsProps {
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onJasmin?: () => void;
  isBookmarked?: boolean;
  onBookmark?: () => void;
}

export function MatchingActions({
  onPass,
  onLike,
  onSuperLike,
  onJasmin,
  isBookmarked = false,
  onBookmark,
}: MatchingActionsProps) {
  const [playLike] = useSound('/sounds/like.mp3', { volume: 0.5 });
  const [playSuperLike] = useSound('/sounds/superlike.mp3', { volume: 0.5 });
  const [playPass] = useSound('/sounds/pass.mp3', { volume: 0.5 });

  const handleAction = (action: () => void, sound?: any) => {
    try {
      if (sound) sound();
    } catch (e) {}
    action();
  };

  return (
    <div className="flex items-center justify-center gap-3.5 sm:gap-5 mt-5 mb-6 px-4 select-none">
      {/* Pass - Soft Sleek with Sky Blue hover */}
      <button 
        onClick={() => handleAction(onPass, playPass)}
        title="Passer"
        className="w-12 h-12 sm:w-14 sm:h-14 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:shadow-lg border border-slate-200/80 dark:border-slate-700/80 hover:border-sky-300 dark:hover:border-sky-500/50 hover:scale-105 active:scale-95 transition-all text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 cursor-pointer group"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-90" />
      </button>

      {/* Bookmark / Favori */}
      {onBookmark && (
        <button
          onClick={onBookmark}
          title={isBookmarked ? 'Retirer des favoris' : 'Enregistrer dans mes favoris'}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border ${
            isBookmarked
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/30 ring-2 ring-amber-300/40'
              : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-400 dark:text-slate-300 hover:text-amber-500 border-slate-200/80 dark:border-slate-700/80'
          }`}
        >
          <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      )}

      {/* Coup de Cœur / Jasmin - Golden Glow */}
      <button 
        onClick={() => handleAction(onJasmin || onSuperLike, playSuperLike)}
        title="Jasmin d'Or / Coup de Cœur"
        className="w-12 h-12 sm:w-13 sm:h-13 bg-gradient-to-tr from-amber-400 via-amber-300 to-sky-300 rounded-full flex items-center justify-center shadow-md hover:shadow-amber-400/30 hover:scale-105 active:scale-95 transition-all text-slate-900 cursor-pointer border border-white/40"
      >
        <Flower2 className="w-5 h-5 fill-amber-900/20" />
      </button>

      {/* Like - Signature Nisfy Red-Orange with soft sky accent glow */}
      <button 
        onClick={() => handleAction(onLike, playLike)}
        title="Aimer"
        className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-[#FF6B35] via-[#FF3823] to-[#E11D48] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all text-white cursor-pointer ring-2 ring-sky-300/30 dark:ring-sky-400/20"
      >
        <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
      </button>
    </div>
  );
}

