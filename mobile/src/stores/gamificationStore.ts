import { create } from 'zustand';
import type { Badge, Challenge } from '@/types';
import * as gamificationApi from '@/services/api/gamification';

interface GamificationState {
  level: number;
  xp: number;
  xpToNextLevel: number;
  badges: Badge[];
  streak: number;
  activeChallenges: Challenge[];
}

interface GamificationActions {
  loadStatus: () => Promise<void>;
  loadBadges: () => Promise<void>;
  loadChallenges: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  unlockBadge: (badge: Badge) => void;
  updateStreak: () => Promise<void>;
}

type GamificationStore = GamificationState & GamificationActions;

export const useGamificationStore = create<GamificationStore>((set) => ({
  level: 1,
  xp: 0,
  xpToNextLevel: 500,
  badges: [],
  streak: 0,
  activeChallenges: [],

  loadStatus: async () => {
    const status = await gamificationApi.getGamificationStatus();
    set({
      level: status.level,
      xp: status.xp,
      xpToNextLevel: status.xpToNextLevel,
      streak: status.streak,
    });
  },

  loadBadges: async () => {
    const badges = await gamificationApi.getBadges();
    set({ badges });
  },

  loadChallenges: async () => {
    const activeChallenges = await gamificationApi.getChallenges();
    set({ activeChallenges });
  },

  addXP: async (amount) => {
    const result = await gamificationApi.addXP(amount);
    set({
      xp: result.xp,
      level: result.level,
    });
  },

  unlockBadge: (badge) =>
    set((state) => ({
      badges: state.badges.map((b) =>
        b.id === badge.id ? { ...b, unlockedAt: new Date().toISOString() } : b,
      ),
    })),

  updateStreak: async () => {
    const streak = await gamificationApi.updateStreak();
    set({ streak });
  },
}));
