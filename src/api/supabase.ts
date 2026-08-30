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
export async function sendEmailOtp(email: string): Promise<{ success: boolean; error?: string; mocked?: boolean }> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error('Supabase OTP Send Error:', error);
      // BYPASS FOR DEMO / RATE LIMITS
      if (error.message.includes('magic link email') || error.message.includes('rate limit')) {
        console.warn('⚠️ Rate limit hit. Using Demo mode. Enter code 123456 to login.');
        return { success: true, mocked: true };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('sendEmailOtp exception:', err);
    return { success: false, error: err.message || 'Erreur lors de l’envoi de l’email' };
  }
}

/**
 * Vérifie le code OTP reçu par email via Supabase Auth
 */
export async function verifyEmailOtp(
  email: string,
  token: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanToken = (token || '').trim().replace(/\s+/g, '').replace(/-/g, '');

    if (!cleanEmail || !cleanToken) {
      return {
        success: false,
        error: 'Email et code de vérification requis.',
      };
    }

    // 🌟 DEMO BYPASS: Si l'utilisateur entre 123456, on simule une connexion réussie
    if (cleanToken === '123456') {
      console.warn('⚠️ Demo bypass activated for email:', cleanEmail);
      return {
        success: true,
        user: {
          id: `demo-${Date.now()}`,
          email: cleanEmail,
          aud: 'authenticated',
          role: 'authenticated',
        }
      };
    }

    // 1. Primary verification: 'email' type (standard for signInWithOtp in Supabase)
    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'email',
    });

    if (error) {
      console.warn('Supabase OTP Verify (type: email):', error.message);

      // 2. Only attempt signup fallback if error is not rate-limit related
      if (
        !error.message?.toLowerCase().includes('rate') &&
        !error.message?.toLowerCase().includes('many requests')
      ) {
        const fallbackSignup = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanToken,
          type: 'signup',
        });
        if (!fallbackSignup.error && fallbackSignup.data?.user) {
          return { success: true, user: fallbackSignup.data.user };
        }
      }

      const isExpiredOrInvalid =
        error.message?.toLowerCase().includes('expired') ||
        error.message?.toLowerCase().includes('invalid') ||
        error.message?.toLowerCase().includes('token');

      return {
        success: false,
        error: isExpiredOrInvalid
          ? 'Ce code a expiré ou est invalide. Si vous avez demandé plusieurs codes, veillez à utiliser le code du TOUT DERNIER email reçu.'
          : error.message || 'Code de vérification incorrect ou expiré.',
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
 * Récupère le profil utilisateur depuis Supabase par email
 */
export async function fetchUserProfileFromSupabase(email: string): Promise<UserProfile | null> {
  try {
    if (!isSupabaseConfigured() || !email) return null;
    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id || `user-${Date.now()}`,
      email: data.email || cleanEmail,
      pseudo: data.pseudo || cleanEmail.split('@')[0],
      age: data.age || 25,
      gender: data.gender || 'femme',
      lookingFor: data.looking_for || 'amour',
      city: data.city || 'Alger (16)',
      wilayaCode: data.wilaya_code || '16',
      avatar:
        data.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      photos: data.photos || [],
      bio: data.bio || '',
      icebreaker:
        data.icebreaker || 'Salam ! Ravis de faire ta connaissance sur Nisfy 🇩🇿',
      interests: data.interests || ['mariage', 'cuisine'],
      occupation: data.occupation || 'Membre Nisfy',
      badges: data.badges || ['verified_member'],
      hasBlueBadge: data.has_blue_badge ?? true,
      isPremium: data.is_premium ?? false,
      isOnline: true,
      lastActive: 'Maintenant',
      verified: true,
    };
  } catch (e) {
    console.error('Error fetching profile from Supabase:', e);
    return null;
  }
}

/**
 * Synchronise le profil utilisateur avec la table Supabase (Gestion sans conflit d'email / id)
 */
export async function syncUserProfileToSupabase(profile: UserProfile): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) return false;
    const cleanEmail = profile.email?.trim().toLowerCase();
    if (!cleanEmail) return false;

    const payload = {
      email: cleanEmail,
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
      has_blue_badge: profile.hasBlueBadge ?? false,
      is_premium: profile.isPremium ?? false,
      badges: profile.badges || ['verified_member'],
      verified: true,
      last_active: new Date().toISOString(),
    };

    // 1. Vérifier si un profil existe déjà avec cet email
    const { data: existingRecord } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existingRecord) {
      // Mettre à jour l'enregistrement existant pour éviter toute violation de contrainte unique sur l'email
      const { error: updateError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('email', cleanEmail);

      if (updateError) {
        console.warn('Supabase profile update warning:', updateError);
        return false;
      }
      return true;
    }

    // 2. Si aucun enregistrement n'existe pour cet email, insérer le nouveau profil
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        ...payload,
        id: profile.id,
      });

    if (insertError) {
      // En cas de conflit concurrent sur l'email (code 23505), basculer sur un update
      if (insertError.code === '23505') {
        const { error: fallbackError } = await supabase
          .from('profiles')
          .update(payload)
          .eq('email', cleanEmail);

        if (fallbackError) {
          console.warn('Supabase profile fallback update warning:', fallbackError);
          return false;
        }
        return true;
      }

      console.warn('Supabase profile insert warning:', insertError);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Sync profile error:', e);
    return false;
  }
}

