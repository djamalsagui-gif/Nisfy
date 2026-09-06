import React, { useState, useMemo, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Key,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Lock,
  UserX,
  MessageSquare,
  Calendar,
  MapPin,
  Megaphone,
} from 'lucide-react';
import {
  AdminSecurityConfig,
  getAdminSecurityConfig,
  checkIsAdmin,
} from '../../utils/adsManager';
import { UserProfile } from '../../types';
import { SimpleAdManager } from './SimpleAdManager';
import {
  getAccountWithdrawals,
  AccountWithdrawalRecord,
} from '../../utils/storage';

interface AdminAdvertisersViewProps {
  currentUser: UserProfile;
  onBack: () => void;
  onViewPublicAd?: (adId: string) => void;
}

export function AdminAdvertisersView({
  currentUser,
  onBack,
  onViewPublicAd,
}: AdminAdvertisersViewProps) {
  // 1. Authentication & Security Access State
  const [adminConfig] = useState<AdminSecurityConfig>(() =>
    getAdminSecurityConfig()
  );

  const isMasterUser = useMemo(() => {
    return checkIsAdmin(currentUser.email);
  }, [currentUser.email]);

  const [pinEntered, setPinEntered] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => isMasterUser);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState<'ads' | 'withdrawals'>('ads');
  const [withdrawalsList, setWithdrawalsList] = useState<AccountWithdrawalRecord[]>(() =>
    getAccountWithdrawals()
  );

  useEffect(() => {
    const refreshWithdrawals = () => {
      setWithdrawalsList(getAccountWithdrawals());
    };
    refreshWithdrawals();
    window.addEventListener('nisfy_withdrawals_updated', refreshWithdrawals);
    return () => {
      window.removeEventListener('nisfy_withdrawals_updated', refreshWithdrawals);
    };
  }, [adminTab]);

  // Authenticate with PIN
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinEntered.trim() === adminConfig.masterPin || pinEntered.trim() === '7788') {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Code PIN administrateur incorrect (Défaut: 7788)');
    }
  };

  // Reset all ads, contracts, payments to start completely from zero
  const handleResetAllData = () => {
    try {
      localStorage.removeItem('nisfy_managed_advertisements');
      localStorage.removeItem('nisfy_managed_contracts');
      localStorage.removeItem('nisfy_managed_payments');
      localStorage.removeItem('nisfy_ads_stats');
      
      // Dispatch events to refresh
      window.dispatchEvent(new Event('nisfy_ads_updated'));
      window.dispatchEvent(new Event('nisfy_contracts_updated'));
      window.dispatchEvent(new Event('nisfy_payments_updated'));

      setShowResetConfirm(false);
      setResetSuccess('Toutes les données publicitaires ont été réinitialisées à zéro.');
      setTimeout(() => {
        setResetSuccess(null);
        window.location.reload();
      }, 1200);
    } catch {
      alert('Erreur lors de la réinitialisation.');
    }
  };

  // --- LOCKED SCREEN: PIN AUTHENTICATION ---
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#FF3823]/10 text-[#FF3823] flex items-center justify-center mx-auto ring-8 ring-[#FF3823]/5">
          <Shield className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Espace d'Administration & Gestion Publicitaire
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Système rigoureux de gestion des demandes, contrats (11 articles), paiements et suivi.
          </p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 text-left mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#FF3823]" />
              <span>Code PIN d'Accès Sécurisé</span>
            </label>
            <input
              type="password"
              maxLength={6}
              value={pinEntered}
              onChange={(e) => setPinEntered(e.target.value)}
              placeholder="Ex: 7788"
              className="w-full text-center tracking-[0.3em] font-mono text-xl py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
              autoFocus
            />
          </div>

          {authError && (
            <p className="text-xs font-bold text-[#FF3823] bg-orange-50 dark:bg-orange-950/40 p-2.5 rounded-xl border border-orange-200 dark:border-orange-900">
              {authError}
            </p>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF3823] hover:opacity-95 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Déverrouiller l'Espace Admin</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à l'accueil</span>
            </button>
          </div>
        </form>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
          Code PIN par défaut : <span className="font-mono font-bold text-[#FF3823]">7788</span>
        </div>
      </div>
    );
  }

  // --- UNLOCKED ADMIN DASHBOARD ---
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Admin Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="Retour"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Système de Gestion Publicitaire & Contrats
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Admin Actif
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Processus rigoureux en 4 étapes : Réception → Contrat (11 Articles) → Paiement & Lancement → Suivi
            </p>
          </div>
        </div>

        {/* Global Action: Tabs and Reset */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setAdminTab('ads')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                adminTab === 'ads'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Pubs & Contrats</span>
            </button>

            <button
              onClick={() => setAdminTab('withdrawals')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                adminTab === 'withdrawals'
                  ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Retraits & Motifs</span>
              {withdrawalsList.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-black">
                  {withdrawalsList.length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-2 rounded-xl border border-[#FF3823]/30 bg-orange-50 dark:bg-orange-950/30 text-[#FF3823] dark:text-[#FF6B35] hover:bg-orange-100 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Vider les données pour repartir à zéro"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Repartir à Zéro</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {resetSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{resetSuccess}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: 4-STEP RIGOROUS ADS WORKFLOW ENGINE               */}
      {/* ======================================================== */}
      {adminTab === 'ads' && (
        <SimpleAdManager
          onViewPublicAd={onViewPublicAd}
          onBack={onBack}
        />
      )}

      {/* ======================================================== */}
      {/* TAB 2: AUDIT DES RETRAITS ET MOTIFS DE DÉPART            */}
      {/* ======================================================== */}
      {adminTab === 'withdrawals' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <UserX className="w-5 h-5 text-red-500" />
                <span>Registre des Retraits d'Utilisateurs & Explications</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Conformément à la directive, chaque départ nécessite une explication obligatoire pour vous aider à mesurer la satisfaction et adapter Nisfy.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-black">
                {withdrawalsList.length} retraits enregistrés
              </span>
            </div>
          </div>

          {withdrawalsList.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-xl">
                🤲
              </div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">
                Aucun compte n'a encore été supprimé
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Lorsqu'un membre exercera son droit de retrait, son motif principal et son explication détaillée apparaîtront ici en temps réel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {withdrawalsList.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center justify-center">
                        {rec.userPseudo.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">
                          {rec.userPseudo}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>{rec.userEmail}</span>
                          {rec.city && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5" />
                                {rec.city}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(rec.withdrawnAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/30">
                    <div className="text-[10px] font-black uppercase tracking-wider text-[#FF3823] mb-0.5">
                      Motif sélectionné :
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {rec.reasonLabel}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                      <MessageSquare className="w-3 h-3 text-[#FF3823]" />
                      <span>Explication fournie par le membre :</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic whitespace-pre-wrap leading-relaxed">
                      "{rec.explanation}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#FF3823]/30 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/50 text-[#FF3823] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Réinitialiser et repartir à zéro ?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Cette action supprimera toutes les demandes de test, contrats et transactions enregistrées dans le navigateur pour vous permettre de configurer votre suivi rigoureux depuis une base propre.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleResetAllData}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF3823] hover:opacity-95 text-white font-black text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Oui, tout réinitialiser</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
