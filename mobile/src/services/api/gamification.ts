import type { Badge, Challenge } from '@/types';
import apiClient from './client';

export interface GamificationStatus {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  totalBadges: number;
}

export async function getGamificationStatus(): Promise<GamificationStatus> {
  try {
    const { data } = await apiClient.get('/gamification/status');
    return data.data;
  } catch {
    return { level: 1, xp: 0, xpToNextLevel: 100, streak: 0, totalBadges: 0 };
  }
}

export async function getBadges(): Promise<Badge[]> {
  try {
    const { data } = await apiClient.get('/gamification/badges');
    return data.data || [];
  } catch {
    return [];
  }
}

export async function getChallenges(): Promise<Challenge[]> {
  try {
    const { data } = await apiClient.get('/gamification/challenges');
    return data.data || [];
  } catch {
    return [];
  }
}

export async function addXP(amount: number): Promise<{ xp: number; level: number; levelUp: boolean }> {
  return { xp: amount, level: 1, levelUp: false };
}

export async function updateStreak(): Promise<number> {
  return 0;
}
