import type { Badge, Challenge } from '@/types';
import { mockBadges, mockChallenges, mockGamificationData } from '@/mock';

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export interface GamificationStatus {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  totalBadges: number;
}

export async function getGamificationStatus(): Promise<GamificationStatus> {
  await delay();
  return mockGamificationData;
}

export async function getBadges(): Promise<Badge[]> {
  await delay();
  return mockBadges;
}

export async function getChallenges(): Promise<Challenge[]> {
  await delay();
  return mockChallenges;
}

export async function addXP(amount: number): Promise<{ xp: number; level: number; levelUp: boolean }> {
  await delay(300);
  const newXP = mockGamificationData.xp + amount;
  const levelUp = newXP >= mockGamificationData.xpToNextLevel;
  return {
    xp: levelUp ? newXP - mockGamificationData.xpToNextLevel : newXP,
    level: levelUp ? mockGamificationData.level + 1 : mockGamificationData.level,
    levelUp,
  };
}

export async function updateStreak(): Promise<number> {
  await delay(300);
  return mockGamificationData.streak + 1;
}
