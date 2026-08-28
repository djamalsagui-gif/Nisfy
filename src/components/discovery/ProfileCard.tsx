import React from 'react';
import { ShieldCheck, MapPin, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';
import { calculateCompatibilityScore } from '../../utils/matchingAlgorithm';

interface ProfileCardProps {
  profile: UserProfile;
  currentUser: UserProfile;
}

export function ProfileCard({ profile, currentUser }: ProfileCardProps) {
  // Compatibility
  const compatibility = calculateCompatibilityScore(currentUser, profile);

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-slate-900">
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
        {profile.isPremium && (
          <div className="bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
            <Sparkles className="w-4 h-4" />
            Premium
          </div>
        )}
      </div>

      {/* Compatibility Badge Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-gradient-to-br from-[#FF6B35] to-[#FF3823] text-white text-sm font-black px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/30 border-2 border-white/20 flex flex-col items-center leading-none">
          <span>{compatibility.score}%</span>
          <span className="text-[9px] uppercase font-semibold">Match</span>
        </div>
      </div>

      {/* Bottom info gradient */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-0" />
      
      <div className="absolute bottom-0 inset-x-0 p-6 z-10 text-white">
        <h2 className="text-3xl font-black mb-1 drop-shadow-md">
          {profile.pseudo}, {profile.age}
        </h2>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm font-medium opacity-90 drop-shadow">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{profile.city}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-medium opacity-90 drop-shadow">
            <Briefcase className="w-4 h-4 shrink-0" />
            <span className="truncate">{profile.occupation || 'Non spécifié'}</span>
          </div>
          
          {profile.educationLevel && (
            <div className="flex items-center gap-2 text-sm font-medium opacity-90 drop-shadow">
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span className="truncate">{profile.educationLevel}</span>
            </div>
          )}
        </div>

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.interests.slice(0, 4).map((tag, idx) => {
              const isCommon = currentUser.interests?.some(
                i => i.toLowerCase() === tag.toLowerCase()
              );
              return (
                <span 
                  key={idx} 
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-sm border ${
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
              <span className="text-xs font-bold px-2 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm">
                +{profile.interests.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
