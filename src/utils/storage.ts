import {
  UserProfile,
  ChatMessage,
  CommunityMessage,
  MatchRelation,
  LikeAction,
  RememberedAccount,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_COMMUNITY_MESSAGES,
  INITIAL_MESSAGES,
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'nisfy_registered_users',
  CURRENT_USER: 'nisfy_current_session',
  CHATS: 'nisfy_private_chats',
  COMMUNITY: 'nisfy_community_feed',
  MATCHES: 'nisfy_matches_list',
  LIKES: 'nisfy_likes_sent',
  REMEMBERED_ACCOUNT: 'nisfy_remembered_account',
};

// Helper for migrating legacy keys seamlessly
function getMigratedItem(key: string, legacyKey?: string): string | null {
  const current = localStorage.getItem(key);
  if (current) return current;
  if (legacyKey) {
    const legacy = localStorage.getItem(legacyKey);
    if (legacy) {
      localStorage.setItem(key, legacy);
      localStorage.removeItem(legacyKey);
      return legacy;
    }
  }
  return null;
}

// 1. Get or initialize registered users
export function getRegisteredUsers(): UserProfile[] {
  try {
    const data = getMigratedItem(STORAGE_KEYS.USERS, 'lovio_registered_users');
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const saved: UserProfile[] = JSON.parse(data);
    // Deduplicate saved array by user ID to prevent duplicate keys
    const userMap = new Map<string, UserProfile>();
    if (Array.isArray(saved)) {
      saved.forEach((u) => {
        if (u && u.id) {
          userMap.set(u.id, u);
        }
      });
    }
    // Merge any missing initial users by id
    INITIAL_USERS.forEach((u) => {
      if (u && u.id && !userMap.has(u.id)) {
        userMap.set(u.id, u);
      }
    });
    const uniqueUsers = Array.from(userMap.values());
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(uniqueUsers));
    return uniqueUsers;
  } catch {
    return INITIAL_USERS;
  }
}

export function saveRegisteredUsers(users: UserProfile[]): void {
  try {
    const userMap = new Map<string, UserProfile>();
    if (Array.isArray(users)) {
      users.forEach((u) => {
        if (u && u.id) {
          userMap.set(u.id, u);
        }
      });
    }
    const uniqueUsers = Array.from(userMap.values());
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(uniqueUsers));
  } catch (e) {
    console.error('Error saving users', e);
  }
}

// 2. Current Logged In User Session
export function getCurrentUser(): UserProfile | null {
  try {
    const data = getMigratedItem(STORAGE_KEYS.CURRENT_USER, 'lovio_current_session');
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Error setting current user', e);
  }
}

// 3. Private Chats
export function getPrivateChats(): Record<string, ChatMessage[]> {
  try {
    const data = getMigratedItem(STORAGE_KEYS.CHATS, 'lovio_private_chats');
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_MESSAGES;
  }
}

export function savePrivateChats(chats: Record<string, ChatMessage[]>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  } catch (e) {
    console.error('Error saving private chats', e);
  }
}

// 4. Community Messages
export function getCommunityMessages(): CommunityMessage[] {
  try {
    const data = getMigratedItem(STORAGE_KEYS.COMMUNITY, 'lovio_community_feed');
    if (!data) {
      localStorage.setItem(
        STORAGE_KEYS.COMMUNITY,
        JSON.stringify(INITIAL_COMMUNITY_MESSAGES)
      );
      return INITIAL_COMMUNITY_MESSAGES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_COMMUNITY_MESSAGES;
  }
}

export function saveCommunityMessages(messages: CommunityMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving community messages', e);
  }
}

// 5. Likes sent by the user
export function getLikesSent(currentUserId: string): LikeAction[] {
  try {
    const data = getMigratedItem(
      `${STORAGE_KEYS.LIKES}_${currentUserId}`,
      `lovio_likes_sent_${currentUserId}`
    );
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLikesSent(currentUserId: string, likes: LikeAction[]): void {
  try {
    localStorage.setItem(
      `${STORAGE_KEYS.LIKES}_${currentUserId}`,
      JSON.stringify(likes)
    );
  } catch (e) {
    console.error('Error saving likes', e);
  }
}

// 6. Matches
export function getMatchesList(currentUserId: string): MatchRelation[] {
  try {
    const data = getMigratedItem(
      `${STORAGE_KEYS.MATCHES}_${currentUserId}`,
      `lovio_matches_list_${currentUserId}`
    );
    if (!data) {
      // Default initial match with Leïla
      const initialMatch: MatchRelation[] = [
        {
          id: 'match_leila',
          user1Id: currentUserId,
          user2Id: 'user_leila',
          matchedAt: 'Aujourd’hui à 11:30',
          lastMessageSnippet: 'Salam ! Enchantée de faire ta connaissance sur la plateforme des 69 wilayas 🇩🇿🌸',
          lastMessageTime: '11:30',
          unreadCount: 1,
        },
      ];
      localStorage.setItem(
        `${STORAGE_KEYS.MATCHES}_${currentUserId}`,
        JSON.stringify(initialMatch)
      );
      return initialMatch;
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveMatchesList(
  currentUserId: string,
  matches: MatchRelation[]
): void {
  try {
    localStorage.setItem(
      `${STORAGE_KEYS.MATCHES}_${currentUserId}`,
      JSON.stringify(matches)
    );
  } catch (e) {
    console.error('Error saving matches', e);
  }
}

// 7. Remembered Account (Fast Login / 1-Click direct connection)
export function getRememberedAccount(): RememberedAccount | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REMEMBERED_ACCOUNT);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveRememberedAccount(account: RememberedAccount | null): void {
  try {
    if (!account) {
      localStorage.removeItem(STORAGE_KEYS.REMEMBERED_ACCOUNT);
    } else {
      localStorage.setItem(
        STORAGE_KEYS.REMEMBERED_ACCOUNT,
        JSON.stringify(account)
      );
    }
  } catch (e) {
    console.error('Error saving remembered account', e);
  }
}

export function clearRememberedAccount(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.REMEMBERED_ACCOUNT);
  } catch (e) {
    console.error('Error clearing remembered account', e);
  }
}
