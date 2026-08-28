import React, { useState } from 'react';
import { ShieldCheck, X, Camera, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onVerificationSuccess: (updatedUser: UserProfile) => void;
}

export function VerificationModal({ isOpen, onClose, currentUser, onVerificationSuccess }: VerificationModalProps) {
  const { isArabic } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Info, 2: Upload, 3: Success
  const [isUploading, setIsUploading] = useState(false);
  
  if (!isOpen) return null;

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setStep(3);
    }, 2000);
  };

  const handleFinish = () => {
    onVerificationSuccess({
      ...currentUser,
      hasBlueBadge: true,
      badges: [...(currentUser.badges || []), 'verified']
    });
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isArabic ? 'توثيق الحساب' : 'Vérification Profil'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-sky-50 dark:bg-sky-950/40 rounded-full flex items-center justify-center mx-auto border-2 border-sky-200 dark:border-sky-800">
                <ShieldCheck className="w-10 h-10 text-[#38BDF8]" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Obtenez le Badge Bleu
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Prouvez que vous êtes une vraie personne pour gagner la confiance de la communauté Nisfy.
                </p>
              </div>

              <div className="space-y-3 text-left bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>Étape 1:</strong> Prenez en photo votre CNI (les données sensibles seront floutées).
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>Étape 2:</strong> Prenez un selfie clair pour comparaison.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 px-4 rounded-xl shadow-md shadow-orange-500/20 text-sm font-bold text-white bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] hover:opacity-95 transition-all cursor-pointer"
              >
                Commencer
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-center font-bold text-slate-900 dark:text-white">
                Documents requis
              </h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Carte d'identité (Recto)
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Photo claire et nette</p>
                </div>

                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Selfie
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Visage bien éclairé</p>
                </div>
              </div>

              <button
                onClick={handleSimulateUpload}
                disabled={isUploading}
                className="w-full py-3 px-4 rounded-xl shadow-md shadow-orange-500/20 text-sm font-bold text-white bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] hover:opacity-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
                    Analyse de l'identité...
                  </>
                ) : (
                  'Envoyer pour vérification'
                )}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="w-24 h-24 bg-sky-50 dark:bg-sky-950/40 rounded-full flex items-center justify-center mx-auto border-4 border-white dark:border-slate-900 shadow-xl relative">
                <ShieldCheck className="w-12 h-12 text-[#38BDF8]" />
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 rounded-full p-1 shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-[#38BDF8]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Identité Vérifiée !
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Félicitations {currentUser.pseudo}, votre profil arbore désormais le badge de confiance Nisfy.
                </p>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3 px-4 rounded-xl shadow-md shadow-orange-500/20 text-sm font-bold text-white bg-gradient-to-r from-[#FF6B35] via-[#FF3823] to-[#E11D48] hover:opacity-95 transition-all cursor-pointer"
              >
                Continuer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
