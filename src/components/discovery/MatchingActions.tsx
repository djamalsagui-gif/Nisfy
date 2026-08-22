import React from 'react';
import { X, Heart, Star, Flower2 } from 'lucide-react';
import useSound from 'use-sound';

interface MatchingActionsProps {
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onJasmin: () => void;
}

export function MatchingActions({ onPass, onLike, onSuperLike, onJasmin }: MatchingActionsProps) {
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
    <div className="flex items-center justify-center gap-4 mt-6 mb-8 px-4">
      {/* Pass */}
      <button 
        onClick={() => handleAction(onPass, playPass)}
        className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-transform text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Like (Emerald) */}
      <button 
        onClick={() => handleAction(onLike, playLike)}
        className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-transform text-white"
      >
        <Heart className="w-8 h-8 fill-current" />
      </button>

      {/* Super Like (Gold) */}
      <button 
        onClick={() => handleAction(onSuperLike, playSuperLike)}
        className="w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95 transition-transform text-white"
      >
        <Star className="w-6 h-6 fill-current" />
      </button>

      {/* Jasmin (Golden Flower) */}
      <button 
        onClick={() => handleAction(onJasmin, playSuperLike)}
        className="w-12 h-12 bg-gradient-to-tr from-amber-200 to-amber-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform text-white"
      >
        <Flower2 className="w-5 h-5" />
      </button>
    </div>
  );
}
