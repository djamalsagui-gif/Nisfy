import React, { useState, useRef } from 'react';
import {
  Heart,
  X,
  MessageCircle,
  MapPin,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldAlert,
  Calendar,
  Compass,
  Play,
  Pause,
  Bookmark,
  Volume2,
  GraduationCap,
  Users,
  Flame,
  Languages,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile, ProfileVideo } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { MediaViewerModal } from './MediaViewerModal';
import { datingSounds } from '../utils/soundEffects';
import { calculateCompatibilityScore } from '../utils/matchingAlgorithm';

interface ProfileCardProps {
  key?: React.Key;
  profile: UserProfile;
  currentUser?: UserProfile;
  onLike: (profile: UserProfile) => void;
  onDislike: (profile: UserProfile) => void;
  onSuperLike: (profile: UserProfile, isJasmin?: boolean) => void;
  onStartDirectChat: (profile: UserProfile, initialMessage?: string) => void;
  onReportUser?: (profile: UserProfile) => void;
  onBlockUser?: (profile: UserProfile) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (profile: UserProfile) => void;
}

export function ProfileCard({
  profile,
  currentUser,
  onLike,
  onDislike,
  onSuperLike,
  onStartDirectChat,
  onReportUser,
  onBlockUser,
  isBookmarked = false,
  onToggleBookmark,
}: ProfileCardProps) {
  const { t, isArabic } = useLanguage();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isPhotoRevealed, setIsPhotoRevealed] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState<ProfileVideo | null>(null);

  // Dynamic compatibility calculation
  const compatibility = currentUser
    ? calculateCompatibilityScore(currentUser, profile)
    : {
        score: profile.matchScore || 88,
        matchingFactors: [],
        verdictFr: 'Très forte affinité culturelle et personnelle.',
        verdictAr: 'توافق شخصي وثقافي عالٍ جداً.',
      };

  // Audio Bio State
  const [isPlayingAudioBio, setIsPlayingAudioBio] = useState(false);
  const [audioBioProgress, setAudioBioProgress] = useState(0);
  const audioBioRef = useRef<HTMLAudioElement | null>(null);

  const photos =
    profile.photos && profile.photos.length > 0
      ? profile.photos
      : [profile.avatar];

  const videos = profile.videos || [];
  const mainVideo = videos.length > 0 ? videos[0] : null;

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const isDiscreet = profile.hidePhotoInitially && !isPhotoRevealed;

  const toggleAudioBio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioBioRef.current) return;

    if (isPlayingAudioBio) {
      audioBioRef.current.pause();
      setIsPlayingAudioBio(false);
    } else {
      audioBioRef.current.play().then(() => {
        setIsPlayingAudioBio(true);
      }).catch(() => {
        setIsPlayingAudioBio(false);
      });
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioBioRef.current) {
      const current = audioBioRef.current.currentTime;
      const duration = audioBioRef.current.duration || profile.audioBioDuration || 15;
      setAudioBioProgress((current / duration) * 100);
    }
  };

  const handleAudioEnded = () => {
    setIsPlayingAudioBio(false);
    setAudioBioProgress(0);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 flex flex-col transition-all relative">
      {/* Photo Carousel Area */}
      <div className="relative aspect-[3/4] w-full bg-slate-900 overflow-hidden select-none group">
        <img
          src={photos[photoIndex]}
          alt={profile.pseudo}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-102 ${
            isDiscreet ? 'blur-xl scale-110' : ''
          }`}
        />

        {/* Discreet Blur Overlay Button */}
        {isDiscreet && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-15">
            <span className="text-3xl mb-2">🔒</span>
            <p className="text-white text-xs font-bold mb-3 max-w-[220px]">
              {t.blurPhotoHint}
            </p>
            <button
              type="button"
              onClick={() => setIsPhotoRevealed(true)}
              className="px-4 py-2 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-lg hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
            >
              <Eye className="w-4 h-4 text-rose-500" />
              <span>{t.revealPhotoBtn}</span>
            </button>
          </div>
        )}

        {/* Photo Index Indicators */}
        {photos.length > 1 && !isDiscreet && (
          <div className="absolute top-3 inset-x-4 flex gap-1.5 z-20">
            {photos.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i === photoIndex ? 'bg-white shadow' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Previous / Next Photo Buttons */}
        {photos.length > 1 && !isDiscreet && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/90 hover:bg-black/70 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/90 hover:bg-black/70 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Top Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 max-w-[75%]">
          {profile.isOnline && (
            <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-emerald-400 text-[10px] font-extrabold flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {t.online}
            </span>
          )}

          {profile.marriageVerified && (
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white text-[10px] font-black flex items-center gap-1 shadow-md ring-1 ring-amber-300">
              💍 {t.marriageBadge}
            </span>
          )}

          {mainVideo && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveVideoModal(mainVideo);
              }}
              className="px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-rose-600 text-white text-[10px] font-black flex items-center gap-1 shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>{t.watchVideoBtn}</span>
            </button>
          )}

          {/* Compatibility Score Badge */}
          <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 backdrop-blur-md text-white text-[10px] font-black flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3 text-amber-300" />
            {compatibility.score}% {isArabic ? 'توافق' : 'Affinité'}
          </span>
        </div>

        {/* Top Right Actions (Bookmark & More) */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
          {onToggleBookmark && (
            <button
              type="button"
              onClick={() => onToggleBookmark(profile)}
              className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-black/40 text-white hover:bg-black/70'
              }`}
              title={isBookmarked ? 'Retirer des favoris' : 'Sauvegarder ce profil'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowActionMenu(!showActionMenu)}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all cursor-pointer"
            title="Options"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          {showActionMenu && (
            <div className="absolute right-0 top-10 w-36 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl py-1 text-xs z-30">
              {onReportUser && (
                <button
                  type="button"
                  onClick={() => {
                    setShowActionMenu(false);
                    onReportUser(profile);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-amber-400 font-semibold cursor-pointer"
                >
                  ⚠️ {t.reportUserBtn}
                </button>
              )}
              {onBlockUser && (
                <button
                  type="button"
                  onClick={() => {
                    setShowActionMenu(false);
                    onBlockUser(profile);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-rose-400 font-semibold cursor-pointer"
                >
                  🚫 {t.blockUserBtn}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

        {/* Basic Info at Bottom of Image */}
        <div className="absolute bottom-4 inset-x-4 text-white z-10 space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight drop-shadow-md">
              {profile.pseudo}, <span className="font-normal opacity-95">{profile.age}</span>
            </h2>
            {profile.verified && (
              <CheckCircle2 className="w-5 h-5 text-sky-400 fill-sky-400/20" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {profile.city}
            </span>
            {profile.occupation && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-indigo-300" />
                {profile.occupation}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details & Content */}
      <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
        {/* Matrimonial Score Bar */}
        {profile.seriousnessScore !== undefined && (
          <div className="p-2.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">
                💍
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
                  {isArabic ? 'مؤشر الجدية والزواج' : 'Score Matrimonial'}
                </span>
                <span className="text-[11px] font-bold text-slate-200">
                  {isArabic ? 'التزام تام بمشروع الحلال' : 'Candidature Zawaj Très Sérieuse'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                  style={{ width: `${profile.seriousnessScore}%` }}
                />
              </div>
              <span className="text-xs font-black text-emerald-400">
                {profile.seriousnessScore}%
              </span>
            </div>
          </div>
        )}

        {/* 30s Audio Bio Player */}
        {profile.audioBioUrl && (
          <div className="p-3 bg-gradient-to-r from-rose-50 via-pink-50 to-indigo-50 rounded-2xl border border-rose-200/80 flex items-center gap-3">
            <audio
              ref={audioBioRef}
              src={profile.audioBioUrl}
              onTimeUpdate={handleAudioTimeUpdate}
              onEnded={handleAudioEnded}
              onError={() => {
                setIsPlayingAudioBio(false);
              }}
              preload="none"
            />
            <button
              type="button"
              onClick={toggleAudioBio}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/30 hover:scale-105 transition-transform shrink-0 cursor-pointer"
            >
              {isPlayingAudioBio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-rose-900 mb-1">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-rose-600" />
                  {isArabic ? 'الرسالة الصوتية (Bio Vocale)' : 'Bio Vocale Authentique'}
                </span>
                <span className="text-slate-500 font-mono">
                  {profile.audioBioDuration || 15}s
                </span>
              </div>
              {/* Waveform Visualization Bars */}
              <div className="flex items-center gap-0.5 h-4">
                {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 65, 30, 85, 40, 75, 55, 90, 35, 60].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-200 ${
                      isPlayingAudioBio
                        ? 'bg-rose-500 animate-pulse'
                        : 'bg-rose-300/70'
                    }`}
                    style={{
                      height: `${isPlayingAudioBio ? Math.max(20, (h * (Math.sin(Date.now() / 200 + i) + 1.2)) / 2) : h}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Marriage Project Details Pill */}
        {(profile.marriageTimeline || profile.relocation || profile.familyOrigin) && (
          <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-wrap items-center gap-2 text-xs">
            {profile.familyOrigin && (
              <span className="flex items-center gap-1 text-slate-800 font-bold text-[11px]">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>{profile.familyOrigin}</span>
              </span>
            )}

            {profile.marriageTimeline && (
              <span className="flex items-center gap-1 text-rose-800 font-bold text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-rose-600" />
                <span>
                  {profile.marriageTimeline === 'immediat'
                    ? isArabic ? 'زواج فوري' : 'Zawaj Immédiat'
                    : profile.marriageTimeline === '1-an'
                    ? isArabic ? 'خلال سنة' : 'Zawaj < 1 an'
                    : isArabic ? 'خلال سنتين' : 'Zawaj < 2 ans'}
                </span>
              </span>
            )}

            {profile.relocation && (
              <span className="flex items-center gap-1 text-indigo-700 font-semibold text-[11px]">
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                <span>
                  {profile.relocation === 'possible'
                    ? isArabic ? 'مستعد للتنقل' : 'Mobile'
                    : isArabic ? 'في نفس البلد' : 'Local'}
                </span>
              </span>
            )}

            {profile.educationLevel && (
              <span className="flex items-center gap-1 text-slate-600 font-medium text-[11px]">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                <span>{profile.educationLevel}</span>
              </span>
            )}
          </div>
        )}

        {/* Bio */}
        <div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {profile.bio}
          </p>

          {/* Interests Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {profile.interests.map((interest) => {
              const isMarriage = interest.toLowerCase().includes('mariage') || interest.includes('زواج');
              return (
                <span
                  key={interest}
                  className={`px-2.5 py-0.5 rounded-xl text-[11px] font-bold border ${
                    isMarriage
                      ? 'bg-gradient-to-r from-amber-100 to-rose-100 text-rose-800 border-rose-300 font-black shadow-2xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200/60'
                  }`}
                >
                  {isMarriage ? `💍 ${interest}` : interest}
                </span>
              );
            })}
          </div>
        </div>

        {/* Interactive 3-Choice Icebreaker Prompt Box */}
        {profile.icebreaker && (
          <div className="p-3.5 bg-gradient-to-r from-rose-50 via-indigo-50/50 to-pink-50 rounded-2xl border border-rose-200/80 text-xs space-y-2">
            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-rose-600 tracking-wider">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {t.icebreakerTitle}
              </span>
              <span className="text-slate-400 font-semibold lowercase">
                {isArabic ? 'اختر إجابة للبدء' : 'cliquez pour répondre'}
              </span>
            </div>

            <p className="text-slate-900 font-bold italic">« {profile.icebreaker} »</p>

            {/* Clickable Quick Choice Options */}
            {profile.icebreakerOptions && profile.icebreakerOptions.length > 0 && (
              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {profile.icebreakerOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onStartDirectChat(
                        profile,
                        isArabic
                          ? `سلام ${profile.pseudo} ! بخصوص سؤالك "${profile.icebreaker}" : أختار 👉 ${opt} ✨`
                          : `Salam ${profile.pseudo} ! Concernant ton brise-glace "${profile.icebreaker}" : je vote 👉 ${opt} ✨`
                      );
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-xl bg-white/90 hover:bg-rose-50 border border-rose-100 hover:border-rose-300 text-slate-700 hover:text-rose-700 font-semibold text-[11px] transition-all flex items-center justify-between group/opt cursor-pointer"
                  >
                    <span>{opt}</span>
                    <span className="text-rose-500 font-bold opacity-0 group-hover/opt:opacity-100 transition-opacity">
                      💬 Répondre
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between gap-2.5 border-t border-slate-100">
          {/* Dislike / Pass */}
          <button
            type="button"
            onClick={() => onDislike(profile)}
            className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
            title={t.dislikeBtn}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Super Like Jasmin Flower 🌸 */}
          <button
            type="button"
            onClick={() => onSuperLike(profile, true)}
            className="px-3 h-11 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-100 hover:from-pink-100 hover:to-rose-200 text-pink-700 border border-pink-300 flex items-center justify-center gap-1 font-black text-xs transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
            title={t.jasminSuperLikeBtn}
          >
            <span className="text-base">🌸</span>
            <span className="hidden sm:inline">{isArabic ? 'ياسمين' : 'Jasmin'}</span>
          </button>

          {/* Direct Message */}
          <button
            type="button"
            onClick={() => onStartDirectChat(profile)}
            className="w-11 h-11 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
            title={t.directMessage}
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          {/* Heart / Like */}
          <button
            type="button"
            onClick={() => onLike(profile)}
            className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white flex items-center justify-center gap-1.5 font-black text-xs sm:text-sm shadow-md shadow-rose-500/25 transition-all hover:scale-102 active:scale-95 cursor-pointer"
            title={t.likeBtn}
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>{t.likeBtn}</span>
          </button>
        </div>
      </div>

      {/* Video Player Modal */}
      {activeVideoModal && (
        <MediaViewerModal
          isOpen={true}
          onClose={() => setActiveVideoModal(null)}
          mediaType="video"
          mediaUrl={activeVideoModal.url}
          title={activeVideoModal.title}
          authorName={profile.pseudo}
          authorAvatar={profile.avatar}
          authorCity={profile.city}
          videoDetails={activeVideoModal}
        />
      )}
    </div>
  );
}
