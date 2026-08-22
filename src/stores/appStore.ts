import { create } from 'zustand';

interface AppState {
  xp: number;
  level: number;
  addXp: (amount: number) => void;
  // Modals
  isAuthModalOpen: boolean;
  setAuthModalOpen: (isOpen: boolean) => void;
  isVerificationModalOpen: boolean;
  setVerificationModalOpen: (isOpen: boolean) => void;
}

const calculateLevel = (xp: number) => {
  if (xp >= 5000) return 4; // Légende
  if (xp >= 2000) return 3; // Influenceur
  if (xp >= 500) return 2; // Créateur
  if (xp >= 100) return 1; // Explorateur
  return 0; // Débutant
};

export const useAppStore = create<AppState>((set) => ({
  xp: 0,
  level: 0,
  addXp: (amount) =>
    set((state) => {
      const newXp = state.xp + amount;
      return { xp: newXp, level: calculateLevel(newXp) };
    }),
  isAuthModalOpen: false,
  setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
  isVerificationModalOpen: false,
  setVerificationModalOpen: (isOpen) => set({ isVerificationModalOpen: isOpen }),
}));
