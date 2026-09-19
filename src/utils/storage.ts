import {
  UserProfile,
  ChatMessage,
  CommunityMessage,
  MatchRelation,
  LikeAction,
  RememberedAccount,
  WeddingBookingContract,
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
const STORAGE_DELETED_USERS_KEY = 'nisfy_deleted_user_ids';

export function getDeletedUserIds(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_DELETED_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function markUserAsDeleted(userId: string): void {
  try {
    const existing = getDeletedUserIds();
    if (!existing.includes(userId)) {
      localStorage.setItem(STORAGE_DELETED_USERS_KEY, JSON.stringify([...existing, userId]));
    }
  } catch (e) {
    console.error('Error marking user as deleted', e);
  }
}

export function getRegisteredUsers(): UserProfile[] {
  try {
    const deletedIds = getDeletedUserIds();
    const data = getMigratedItem(STORAGE_KEYS.USERS, 'lovio_registered_users');
    if (!data) {
      const filteredInit = INITIAL_USERS.filter((u) => !deletedIds.includes(u.id));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredInit));
      return filteredInit;
    }
    const saved: UserProfile[] = JSON.parse(data);
    // Deduplicate saved array by user ID to prevent duplicate keys
    const userMap = new Map<string, UserProfile>();
    if (Array.isArray(saved)) {
      saved.forEach((u) => {
        if (u && u.id && !deletedIds.includes(u.id)) {
          userMap.set(u.id, u);
        }
      });
    }
    // Merge any missing initial users by id ONLY if they were not deleted
    INITIAL_USERS.forEach((u) => {
      if (u && u.id && !userMap.has(u.id) && !deletedIds.includes(u.id)) {
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
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && parsed.id) return parsed;
    }
  } catch {
    // ignore
  }

  // Fallback default: ensure app always boots into a valid profile so that
  // the entire application (Accueil, Soldes, Musique, Rencontres, etc.) displays immediately!
  const defaultAdmin = INITIAL_USERS.find((u) => u.email === 'djamalsagui@gmail.com') || INITIAL_USERS[0];
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultAdmin));
  } catch {}
  return defaultAdmin;
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

// 8. Account Withdrawal & Mandatory Reasons Tracking (Droit de retrait)
export interface AccountWithdrawalRecord {
  id: string;
  userId: string;
  userPseudo: string;
  userEmail: string;
  wilayaCode?: string;
  city?: string;
  reasonId: string;
  reasonLabel: string;
  explanation: string;
  withdrawnAt: string;
}

const STORAGE_WITHDRAWALS_KEY = 'nisfy_account_withdrawals';

export function saveAccountWithdrawal(record: AccountWithdrawalRecord): void {
  try {
    const existing = getAccountWithdrawals();
    const updated = [record, ...existing];
    localStorage.setItem(STORAGE_WITHDRAWALS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('nisfy_withdrawals_updated'));
  } catch (e) {
    console.error('Error saving account withdrawal record', e);
  }
}

export function getAccountWithdrawals(): AccountWithdrawalRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_WITHDRAWALS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function deleteRegisteredUser(userId: string): UserProfile[] {
  try {
    // 1. Mark as permanently deleted
    markUserAsDeleted(userId);

    // 2. Filter from users list
    const users = getRegisteredUsers();
    const filtered = users.filter((u) => u.id !== userId);
    saveRegisteredUsers(filtered);

    // 3. Clean remembered account unconditionally
    clearRememberedAccount();

    // 4. Clean user matches & local session items
    localStorage.removeItem(`${STORAGE_KEYS.MATCHES}_${userId}`);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    // 5. Notify any listeners
    window.dispatchEvent(new Event('nisfy_users_updated'));

    return filtered;
  } catch (e) {
    console.error('Error deleting registered user', e);
    return getRegisteredUsers();
  }
}

// 7. Wedding Bookings & Contracts Storage
const STORAGE_WEDDING_BOOKINGS_KEY = 'nisfy_wedding_booking_contracts';

export const INITIAL_WEDDING_BOOKINGS: WeddingBookingContract[] = [
  {
    id: 'wbk-zekri-001',
    bookingCode: 'NISFY-WBK-2026-089',
    vendorId: 'vendor-9',
    vendorName: 'Zekri Auto Location • Voitures de Marque pour Cortèges & Mariage 🚗💍',
    vendorCategory: 'cortege_vehicules',
    vendorPhone: '+213 550 88 44 22',
    vendorWilaya: 'Alger (16) & Toutes Wilayas',
    clientName: 'Karim & Amira Benali',
    clientPhone: '0555 12 34 56',
    clientEmail: 'karim.benali@gmail.com',
    weddingDate: '2026-09-26',
    guestCount: 250,
    totalAmountDzd: 75000,
    depositAmountDzd: 25000,
    remainingAmountDzd: 50000,
    status: 'confirme_signe',
    paymentMethod: 'baridimob',
    selectedOptions: [
      'Mercedes Classe S Berline Noire Cortège VIP',
      'Chauffeur professionnel en costume officiel',
      'Compositions florales et rubans blancs offerts',
      'Service disponible 24/7 sur Alger & Blida'
    ],
    specialNotes: 'Cortège au départ de Kouba vers la salle des fêtes des Eucalyptus.',
    signedAt: '2026-09-10T14:30:00Z',
    signatureClient: 'Karim Benali',
    termsAccepted: true,
    createdAt: '2026-09-08T11:00:00Z'
  },
  {
    id: 'wbk-palais-roses-002',
    bookingCode: 'NISFY-WBK-2026-092',
    vendorId: 'vendor-1',
    vendorName: 'Palais des Roses & Des Étoiles 🏰',
    vendorCategory: 'salle_fetes',
    vendorPhone: '+213 550 12 34 56',
    vendorWilaya: 'Alger (16)',
    clientName: 'Yacine & Sarah Mansouri',
    clientPhone: '0661 78 90 12',
    clientEmail: 'yacine.m@yahoo.fr',
    weddingDate: '2026-10-15',
    guestCount: 350,
    totalAmountDzd: 380000,
    depositAmountDzd: 100000,
    remainingAmountDzd: 280000,
    status: 'acompte_attente',
    paymentMethod: 'ccp',
    selectedOptions: [
      'Salle principale prestige (450 places)',
      'Suite VIP mariée avec loge coiffure',
      'Éclairage LED féerique et fumée lourde'
    ],
    specialNotes: 'Acompte de 100 000 DZD en cours de validation CCP.',
    termsAccepted: true,
    createdAt: '2026-09-12T09:15:00Z'
  }
];

export function getWeddingBookings(): WeddingBookingContract[] {
  try {
    const data = localStorage.getItem(STORAGE_WEDDING_BOOKINGS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Initialize with demo contracts
    localStorage.setItem(STORAGE_WEDDING_BOOKINGS_KEY, JSON.stringify(INITIAL_WEDDING_BOOKINGS));
    return INITIAL_WEDDING_BOOKINGS;
  } catch {
    return INITIAL_WEDDING_BOOKINGS;
  }
}

export function saveWeddingBookings(bookings: WeddingBookingContract[]): void {
  try {
    localStorage.setItem(STORAGE_WEDDING_BOOKINGS_KEY, JSON.stringify(bookings));
    window.dispatchEvent(new Event('nisfy_wedding_bookings_updated'));
  } catch (e) {
    console.error('Error saving wedding bookings', e);
  }
}

export function addWeddingBooking(booking: WeddingBookingContract): WeddingBookingContract[] {
  const current = getWeddingBookings();
  const updated = [booking, ...current];
  saveWeddingBookings(updated);
  return updated;
}

export function updateWeddingBookingStatus(bookingId: string, status: WeddingBookingContract['status']): WeddingBookingContract[] {
  const current = getWeddingBookings();
  const updated = current.map((b) => (b.id === bookingId ? { ...b, status } : b));
  saveWeddingBookings(updated);
  return updated;
}
