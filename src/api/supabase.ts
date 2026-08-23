import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

const SUPABASE_PROJECT_URL = 'https://wvrxsqjuwxubuainxxmp.supabase.co';
const SUPABASE_ANON_PUBLIC_KEY = 'sb_publishable_AcQjoPrZxNHiKqnOUTp1LQ_GAtdUefK';

const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL || SUPABASE_PROJECT_URL;
const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_PUBLIC_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    !supabaseUrl.includes('placeholder') &&
    Boolean(supabaseAnonKey) &&
    !supabaseAnonKey.includes('placeholder')
  );
};

/**
 * Envoie un code OTP de vérification par email via Supabase Auth
 */
export async function sendEmailOtp(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error('Supabase OTP Send Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('sendEmailOtp exception:', err);
    return { success: false, error: err.message || 'Erreur lors de l’envoi de l’email' };
  }
}

/**
 * Vérifie le code OTP reçu par email de manière stricte via Supabase
 */
export async function verifyEmailOtp(
  email: string,
  token: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    // Attempt verification with standard 'email' type (signInWithOtp default)
    let { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    // If that fails, attempt with 'signup' type (in case shouldCreateUser triggered signup template)
    if (error) {
      const fallbackSignup = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      });
      if (!fallbackSignup.error && fallbackSignup.data?.user) {
        data = fallbackSignup.data;
        error = null;
      }
    }

    // If still fails, attempt with 'magiclink' type
    if (error) {
      const fallbackMagic = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'magiclink',
      });
      if (!fallbackMagic.error && fallbackMagic.data?.user) {
        data = fallbackMagic.data;
        error = null;
      }
    }

    if (error) {
      console.error('Supabase OTP Verify Error:', error);
      return {
        success: false,
        error: error.message || 'Code de vérification incorrect ou expiré.',
      };
    }

    if (!data?.user) {
      return {
        success: false,
        error: 'Échec de la validation de l’email.',
      };
    }

    return { success: true, user: data.user };
  } catch (err: any) {
    console.error('verifyEmailOtp exception:', err);
    return { success: false, error: err.message || 'Code de vérification invalide' };
  }
}

/**
 * Synchronise le profil utilisateur avec la table Supabase
 */
export async function syncUserProfileToSupabase(profile: UserProfile): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase.from('profiles').upsert(
      {
        id: profile.id,
        email: profile.email,
        pseudo: profile.pseudo,
        age: profile.age,
        gender: profile.gender,
        looking_for: profile.lookingFor,
        city: profile.city,
        wilaya_code: profile.wilayaCode,
        avatar: profile.avatar,
        photos: profile.photos || [],
        bio: profile.bio || '',
        interests: profile.interests || [],
        occupation: profile.occupation || '',
        is_online: true,
        has_blue_badge: profile.hasBlueBadge || false,
        is_premium: profile.isPremium || false,
        badges: profile.badges || ['verified_member'],
        verified: true,
        last_active: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error('Error syncing profile to Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Sync profile error:', e);
    return false;
  }
}

