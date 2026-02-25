import { useCallback } from 'react';
import { useGamificationStore } from '@/stores';
import type { Badge } from '@/types';

export function useGamification() {
  const store = useGamificationStore();

  const loadAll = useCallback(async () => {
    await Promise.all([
      store.loadStatus(),
      store.loadBadges(),
      store.loadChallenges(),
    ]);
  }, [store.loadStatus, store.loadBadges, store.loadChallenges]);

  const addXP = useCallback(
    async (amount: number) => {
      await store.addXP(amount);
    },
    [store.addXP],
  );

  const updateStreak = useCallback(async () => {
    await store.updateStreak();
  }, [store.updateStreak]);

  const unlockedBadges = store.badges.filter((b) => b.unlockedAt);
  const lockedBadges = store.badges.filter((b) => !b.unlockedAt);
  const xpProgress = store.xpToNextLevel > 0
    ? store.xp / store.xpToNextLevel
    : 0;

  return {
    level: store.level,
    xp: store.xp,
    xpToNextLevel: store.xpToNextLevel,
    xpProgress,
    badges: store.badges,
    unlockedBadges,
    lockedBadges,
    streak: store.streak,
    activeChallenges: store.activeChallenges,
    loadAll,
    loadStatus: store.loadStatus,
    loadBadges: store.loadBadges,
    loadChallenges: store.loadChallenges,
    addXP,
    unlockBadge: store.unlockBadge,
    updateStreak,
  };
}
