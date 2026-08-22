export type Gender = 'homme' | 'femme' | 'non-binaire';
export type LookingFor = 'amour' | 'amitie' | 'discussion' | 'tous';
export type MarriageTimeline = 'immediat' | '1-an' | '2-ans' | 'a_discuter' | 'non_specifie';
export type RelocationPreference = 'possible' | 'non' | 'dans_le_pays' | 'a_discuter' | 'a_letranger' | 'ouvert_a_tout';
export type MaritalStatus = 'celibataire' | 'divorce' | 'veuf';
export type ReligiousPractice = 'modere' | 'pratiquant' | 'non_pratiquant';
export type HijabStatus = 'sans_voile' | 'hijab' | 'niqab' | 'non_specifie';
export type SmokingStatus = 'non' | 'occasionnel' | 'regulier';

export interface ProfileVideo {
  id: string;
  url: string;
  title: string;
  thumbnail?: string;
  duration?: number;
  createdAt: string;
  isPresentation?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  password?: string;
  pseudo: string;
  age: number;
  gender: Gender;
  lookingFor: LookingFor;
  city: string;
  wilayaCode?: string;
  avatar: string;
  photos: string[];
  videos?: ProfileVideo[];
  audioBioUrl?: string; // 30s Audio Bio
  audioBioDuration?: number;
  bio: string;
  interests: string[];
  occupation: string;
  height?: number; // cm
  educationLevel?: string;
  familyOrigin?: string; // Kabyle, Chaoui, Mzabite, Touareg, Arabe, etc.
  languagesSpoken?: string[]; // Arabe (Darija), Français, Tamazight, Anglais...
  maritalStatus?: MaritalStatus;
  childrenCount?: number;
  religiousPractice?: ReligiousPractice;
  hijabStatus?: HijabStatus;
  smokingStatus?: SmokingStatus;
  isOnline: boolean;
  
  hasBlueBadge?: boolean;
  isPremium?: boolean;
  badges?: string[];
  marriageIntentions?: string;
  videoPresentation?: string;
  lastActive: string;
  verified: boolean;
  marriageVerified?: boolean; // Verified badge for serious marriage candidates
  marriageTimeline?: MarriageTimeline; // Project timeline
  relocation?: RelocationPreference; // Willing to relocate/move
  hidePhotoInitially?: boolean; // Discreet blur mode until mutual match
  
  // Icebreaker & Matrimonial Score
  icebreaker: string;
  icebreakerOptions?: string[]; // 3 contextual options
  seriousnessScore?: number; // Matrimonial Score (0-100%)
  matchScore?: number; // percentage match
  
  likesCount?: number;
  jasminLikesCount?: number;
  blockedUsers?: string[];
  reportedUsers?: string[];
  savedBookmarks?: string[]; // Saved user IDs
}

export interface LiveComment {
  id: string;
  liveId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isGift?: boolean;
  giftIcon?: string;
  giftName?: string;
}

export interface LiveSession {
  id: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  hostCity: string;
  title: string;
  topic: string;
  viewersCount: number;
  likesCount: number;
  isLive: boolean;
  startedAt: string;
  previewVideoUrl?: string;
  tags: string[];
  pinnedNotice?: string;
}

export interface ChatMessageReaction {
  userId: string;
  emoji: '❤️' | '😂' | '🤲' | '☕' | '🌹';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type?: 'text' | 'image' | 'video' | 'voice' | 'icebreaker' | 'jasmin' | 'lounge_invite';
  mediaUrl?: string;
  voiceDuration?: number; // in seconds
  reactions?: ChatMessageReaction[];
  translatedContent?: string;
}

export interface CommunityMessage {
  id: string;
  roomId?: string; // Thematic Room ID
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorCity: string;
  content: string;
  timestamp: string;
  likes: number;
  likedBy: string[];
  imageUrl?: string;
  videoUrl?: string;
}

export interface MatchRelation {
  id: string;
  user1Id: string;
  user2Id: string;
  matchedAt: string;
  lastMessageSnippet?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface LikeAction {
  fromUserId: string;
  toUserId: string;
  isSuperLike: boolean;
  isJasmin?: boolean;
  type?: 'like' | 'superlike' | 'jasmin';
  timestamp: string;
}

export type ActiveTab = 'discover' | 'feed' | 'customs' | 'marketplace' | 'matches' | 'chat' | 'lounge' | 'map' | 'profile' | 'live' | 'chef_nadjet';

export interface WilayaCustom {
  id: string;
  regionNameFr: string;
  regionNameAr: string;
  wilayaCodes: string[];
  wilayaNames: string[];
  traditionalOutfits: {
    nameFr: string;
    nameAr: string;
    descriptionFr: string;
    descriptionAr: string;
    imageUrl: string;
  }[];
  khetbaTraditions: {
    titleFr: string;
    titleAr: string;
    detailsFr: string;
    detailsAr: string;
  };
  mahrAndChoura: {
    mahrCustomFr: string;
    mahrCustomAr: string;
    trousseauItemsFr: string[];
    trousseauItemsAr: string[];
  };
  ceremonyRituals: {
    hennaNightFr: string;
    hennaNightAr: string;
    cortegeTraditionFr: string;
    cortegeTraditionAr: string;
    signatureDishFr: string;
    signatureDishAr: string;
  };
  matrimonialProverbFr: string;
  matrimonialProverbAr: string;
}

export type WeddingVendorCategory =
  | 'salle_fetes'
  | 'neggafa_tenues'
  | 'photographe_video'
  | 'traiteur_repas'
  | 'patisserie_gateaux'
  | 'zorna_orchestre'
  | 'decoration_fleurs'
  | 'voyage_noces';

export interface WeddingVendor {
  id: string;
  name: string;
  category: WeddingVendorCategory;
  wilayaCode: string;
  wilayaName: string;
  rating: number;
  reviewsCount: number;
  priceRange: '€' | '€€' | '€€€' | 'DZD Modéré' | 'DZD Premium' | 'DZD Prestige';
  priceStartingAt: string;
  verified: boolean;
  avatarUrl: string;
  photos: string[];
  phone: string;
  instagram?: string;
  descriptionFr: string;
  descriptionAr: string;
  services: string[];
  isFeatured?: boolean;
}

export interface HayaaSettings {
  enabled: boolean;
  blurLevel: 'soft' | 'strong' | 'silhouette';
  revealPolicy: 'on_mutual_like' | 'on_request' | 'after_chat';
  revealedUserIds: string[];
}

export type SocialPostCategory = 'cuisine' | 'voyage' | 'documentaire' | 'selfie' | 'mariage';

export type SocialEmojiReaction = '😂' | '😍' | '😮' | '🤩' | '😢' | '😡' | '❤️';

export interface SocialComment {
  id: string;
  postId: string;
  authorId: string;
  authorPseudo: string;
  authorAvatar: string;
  authorCity?: string;
  content: string;
  timestamp: string;
  likes: number;
  likedBy?: string[];
  emojiReaction?: SocialEmojiReaction;
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorPseudo: string;
  authorAvatar: string;
  authorCity: string;
  authorWilayaCode?: string;
  authorVerified?: boolean;
  category: SocialPostCategory;
  videoUrl: string;
  posterUrl?: string;
  title: string;
  description: string;
  tags: string[];
  locationName?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  likedBy: string[];
  bookmarkedBy: string[];
  createdAt: string;
  duration?: number;
  musicTitle?: string;
  comments?: SocialComment[];
}

export interface UserBadge {
  id: string;
  titleFr: string;
  titleAr: string;
  icon: string;
  descriptionFr: string;
  descriptionAr: string;
  unlocked: boolean;
  category: 'social' | 'travel' | 'doc' | 'general';
}

export interface UserImpactStats {
  xp: number;
  level: string;
  viewsTotal: number;
  likesReceived: number;
  commentsReceived: number;
  sharesTotal: number;
  wilayaRank: number;
  badges: UserBadge[];
}

export interface SearchFilter {
  gender: 'tous' | Gender;
  minAge: number;
  maxAge: number;
  city: string;
  onlyOnline: boolean;
  onlyMarriage: boolean;
  onlyVerified: boolean;
  interest: string;
  lookingFor: LookingFor | 'tous';
  hasVideo?: boolean;
  familyOrigin?: string;
  educationLevel?: string;
  maritalStatus?: string;
}

export interface RememberedAccount {
  userId: string;
  identifier: string;
  type: 'email' | 'pseudo';
  pseudo: string;
  email: string;
  avatar: string;
  city: string;
  wilayaCode?: string;
  gender: Gender;
  savedAt: string;
  autoConnect?: boolean;
}

