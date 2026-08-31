import React, { useState } from 'react';
import { ShieldCheck, MapPin, Briefcase, GraduationCap, Sparkles, ChevronDown, ChevronUp, HeartHandshake, Bookmark } from 'lucide-react';
import { UserProfile } from '../../types';
import { calculateCompatibilityScore } from '../../utils/matchingAlgorithm';

interface ProfileCardProps {
  profile: UserProfile;
  currentUser: UserProfile;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export function ProfileCard({ profile, currentUser, isBookmarked = false, onToggleBookmark }: ProfileCardProps) {
  const [showCompatibilityDetails, setShowCompatibilityDetails] = useState(false);
  // Compatibility
  const compatibility = calculateCompatibilityScore(currentUser, profile);

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 select-none">
      <img
        src={profile.avatar}
        alt={profile.pseudo}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Top badges */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        {profile.hasBlueBadge && (
          <div className="bg-[#38BDF8] text-slate-950 text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
            <ShieldCheck className="w-4 h-4" />
            Vérifié
          </div>
        )}
        {profile.marriageVerified && (
          <div className="bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
            <HeartHandshake className="w-4 h-4" />
            Zawaj Certifié
          </div>
        )}
        {profile.isPremium && (
          <div className="bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
            <Sparkles className="w-4 h-4" />
            Premium
          </div>
        )}
      </div>

      {/* Top Right Controls: Compatibility Badge + Bookmark Button */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {onToggleBookmark && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            className={`p-2.5 rounded-full backdrop-blur-md shadow-lg border transition-all cursor-pointer active:scale-90 ${
              isBookmarked
                ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-300/40'
                : 'bg-black/50 hover:bg-black/70 text-white border-white/20 hover:text-amber-300'
            }`}
            title={isBookmarked ? 'Retirer des favoris' : 'Sauvegarder dans mes favoris'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Compatibility Badge Top Right (Clickable to reveal reasons) */}
        <button
          type="button"
          onClick={() => setShowCompatibilityDetails(!showCompatibilityDetails)}
          className="cursor-pointer active:scale-95 transition-transform"
          title="Voir les détails de compatibilité"
        >
          <div className="bg-gradient-to-br from-[#FF6B35] to-[#FF3823] text-white text-sm font-black px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/30 border-2 border-white/20 flex flex-col items-center leading-none">
            <span>{compatibility.score}%</span>
            <span className="text-[8px] uppercase font-bold tracking-wider mt-0.5 flex items-center gap-0.5">
              Match {showCompatibilityDetails ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
            </span>
          </div>
        </button>
      </div>

      {/* Popover Breakdown of Compatibility */}
      {showCompatibilityDetails && (
        <div className="absolute inset-x-4 top-16 z-30 bg-slate-950/95 backdrop-blur-md rounded-2xl p-4 border border-slate-700 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Pourquoi ce score ({compatibility.score}%) :
            </span>
            <button
              onClick={() => setShowCompatibilityDetails(false)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1.5">
            {compatibility.matchingFactors.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                <span className="flex items-center gap-1.5 truncate">
                  <span>{f.icon || '✓'}</span>
                  <span>{f.labelFr}</span>
                </span>
                <span className="text-emerald-400 font-bold shrink-0">+{f.score} pts</span>
              </div>
            ))}
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] font-bold text-amber-300">
            {compatibility.verdictFr}
          </div>
        </div>
      )}

      {/* Bottom info gradient */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-0" />
      
      <div className="absolute bottom-0 inset-x-0 p-6 z-10 text-white">
        <h2 className="text-3xl font-black mb-1 drop-shadow-md">
          {profile.pseudo}, {profile.age}
        </h2>
        
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-sm font-medium opacity-90 drop-shadow">
            <MapPin className="w-4 h-4 shrink-0 text-[#FF3823]" />
            <span className="truncate">{profile.city} {profile.wilayaCode ? `(${profile.wilayaCode})` : ''}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-medium opacity-90 drop-shadow">
            <Briefcase className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="truncate">{profile.occupation || 'Non spécifié'}</span>
          </div>
          
          {profile.marriageTimeline && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 drop-shadow">
              <span>💍 Objectif mariage :</span>
              <span className="capitalize">{profile.marriageTimeline.replace('-', ' ')}</span>
            </div>
          )}

          {profile.educationLevel && (
            <div className="flex items-center gap-2 text-xs font-medium opacity-90 drop-shadow">
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span className="truncate">{profile.educationLevel}</span>
            </div>
          )}
        </div>

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {profile.interests.slice(0, 4).map((tag, idx) => {
              if (!tag) return null;
              const tagLower = tag.toLowerCase().trim();
              const isCommon = Boolean(
                currentUser?.interests?.some(
                  i => Boolean(i) && i.toLowerCase().trim() === tagLower
                )
              );
              return (
                <span 
                  key={idx} 
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-xl backdrop-blur-sm border ${
                    isCommon 
                      ? 'bg-emerald-500/80 border-emerald-400 text-white' 
                      : 'bg-white/20 border-white/30 text-white'
                  }`}
                >
                  {tag}
                </span>
              );
            })}
            {profile.interests.length > 4 && (
              <span className="text-[11px] font-bold px-2 py-1 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm">
                +{profile.interests.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

