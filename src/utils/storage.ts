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
  USERS: 'lovio_registered_users',
  CURRENT_USER: 'lovio_current_session',
  CHATS: 'lovio_private_chats',
  COMMUNITY: 'lovio_community_feed',
  MATCHES: 'lovio_matches_list',
  LIKES: 'lovio_likes_sent',
  REMEMBERED_ACCOUNT: 'nisfy_remembered_account',
};

// 1. Get or initialize registered users
export function getRegisteredUsers(): UserProfile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const saved: UserProfile[] = JSON.parse(data);
    // Merge any missing initial users by id
    const existingIds = new Set(saved.map((u) => u.id));
    const missing = INITIAL_USERS.filter((u) => !existingIds.has(u.id));
    if (missing.length > 0) {
      const merged = [...saved, ...missing];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(merged));
      return merged;
    }
    return saved;
  } catch {
    return INITIAL_USERS;
  }
}

export function saveRegisteredUsers(users: UserProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users', e);
  }
}

// 2. Current Logged In User Session
export function getCurrentUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
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
    const data = localStorage.getItem(STORAGE_KEYS.CHATS);
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
    const data = localStorage.getItem(STORAGE_KEYS.COMMUNITY);
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
    const data = localStorage.getItem(`${STORAGE_KEYS.LIKES}_${currentUserId}`);
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
    const data = localStorage.getItem(`${STORAGE_KEYS.MATCHES}_${currentUserId}`);
    if (!data) {
      // Default initial match with Claire
      const initialMatch: MatchRelation[] = [
        {
          id: 'match_claire',
          user1Id: currentUserId,
          user2Id: 'user_claire',
          matchedAt: 'Aujourd’hui à 11:30',
          lastMessageSnippet: 'Tu es plutôt escapade citadine ou nature sauvage... ?',
          lastMessageTime: '11:32',
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
