// ---------------------------------------------------------------------------
// Gamification Types
// ---------------------------------------------------------------------------

import type { DateRange, Timestamps } from "./common";

/** Badge rarity tier. */
export type BadgeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

/** Badge category. */
export type BadgeCategory =
  | "nutrition"
  | "exercise"
  | "hydration"
  | "consistency"
  | "social"
  | "milestone"
  | "special"
  | "seasonal";

/** Challenge status from the participant's perspective. */
export type ChallengeParticipantStatus = "not_joined" | "active" | "completed" | "failed" | "withdrawn";

/** Challenge type. */
export type ChallengeType =
  | "daily"
  | "weekly"
  | "monthly"
  | "custom"
  | "community"
  | "dietitian_assigned";

/** XP event category. */
export type XPCategory =
  | "meal_logging"
  | "water_tracking"
  | "exercise"
  | "weight_logging"
  | "plan_adherence"
  | "appointment_attendance"
  | "goal_completion"
  | "streak"
  | "challenge"
  | "social"
  | "bonus";

// ── Core entities ──────────────────────────────────────────────────────────

/** A badge definition. */
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  rarity: BadgeRarity;
  category: BadgeCategory;
  /** Criteria to unlock (human-readable). */
  criteria: string;
  /** XP reward on unlock. */
  xpReward: number;
  /** Whether the badge can be earned only once. */
  isOneTime: boolean;
  /** Total users who have earned this. */
  totalEarned: number;
  /** Sort / display order. */
  sortOrder: number;
}

/** A badge earned by a user. */
export interface EarnedBadge {
  id: string;
  userId: string;
  badgeId: string;
  badge: Badge;
  earnedAt: string;
  /** If the badge was earned multiple times, how many? */
  timesEarned: number;
  isNew: boolean;
}

/** An achievement (broader than a single badge). */
export interface Achievement extends Timestamps {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: BadgeCategory;
  /** Total progress required. */
  targetValue: number;
  unit: string;
  xpReward: number;
  badgeId?: string | null;
  /** Tier (e.g. bronze, silver, gold). */
  tier?: AchievementTier | null;
}

/** Achievement tiers. */
export type AchievementTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

/** A user's progress towards an achievement. */
export interface AchievementProgress {
  achievementId: string;
  achievement: Achievement;
  userId: string;
  currentValue: number;
  targetValue: number;
  progressPercent: number;
  isCompleted: boolean;
  completedAt?: string | null;
  tier?: AchievementTier | null;
}

/** A challenge that users can participate in. */
export interface Challenge extends Timestamps {
  id: string;
  title: string;
  description: string;
  iconUrl?: string | null;
  imageUrl?: string | null;
  type: ChallengeType;
  category: BadgeCategory;

  startDate: string;
  endDate: string;
  durationDays: number;

  /** What the user needs to do. */
  goal: ChallengeGoal;

  /** Rewards. */
  xpReward: number;
  badgeId?: string | null;
  badge?: Badge | null;

  /** Participation stats. */
  totalParticipants: number;
  totalCompleted: number;

  /** Created by (dietitian or system). */
  createdBy?: string | null;
  createdByName?: string | null;

  isActive: boolean;
}

/** What the challenge requires. */
export interface ChallengeGoal {
  type: "count" | "streak" | "total" | "percentage";
  metric: string;
  targetValue: number;
  unit: string;
  description: string;
}

/** User's participation in a challenge. */
export interface ChallengeParticipation {
  challengeId: string;
  challenge: Challenge;
  userId: string;
  status: ChallengeParticipantStatus;
  currentValue: number;
  targetValue: number;
  progressPercent: number;
  joinedAt: string;
  completedAt?: string | null;
  rank?: number | null;
}

/** XP event (a single XP-granting action). */
export interface XPEvent extends Timestamps {
  id: string;
  userId: string;
  category: XPCategory;
  amount: number;
  description: string;
  /** Multiplier applied (streak bonus, etc.). */
  multiplier: number;
  /** Related entity. */
  referenceType?: string | null;
  referenceId?: string | null;
}

/** User's current streak info. */
export interface Streak {
  userId: string;
  type: StreakType;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakStartDate: string;
  isActive: boolean;
  /** Days until streak is lost. */
  gracePeriodDays: number;
  /** Bonus XP multiplier for current streak length. */
  currentMultiplier: number;
}

/** Streak type. */
export type StreakType =
  | "meal_logging"
  | "water_tracking"
  | "exercise"
  | "weight_logging"
  | "app_login"
  | "plan_adherence";

/** Level definition. */
export interface Level {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  iconUrl?: string | null;
  color?: string | null;
  perks?: string[];
}

/** User's gamification profile. */
export interface GamificationProfile {
  userId: string;
  totalXP: number;
  currentLevel: Level;
  nextLevel: Level;
  xpToNextLevel: number;
  xpProgressPercent: number;
  earnedBadges: EarnedBadge[];
  totalBadges: number;
  streaks: Streak[];
  activeChallenges: ChallengeParticipation[];
  achievementProgress: AchievementProgress[];
  rank?: LeaderboardEntry | null;
  weeklyXP: number;
  monthlyXP: number;
}

/** Leaderboard entry. */
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatarUrl?: string | null;
  rank: number;
  totalXP: number;
  level: number;
  levelName: string;
  badgeCount: number;
  currentStreak: number;
}

/** Leaderboard with pagination and scope. */
export interface Leaderboard {
  scope: "global" | "dietitian_group" | "friends";
  period: "all_time" | "monthly" | "weekly";
  entries: LeaderboardEntry[];
  userEntry?: LeaderboardEntry | null;
  totalEntries: number;
}

/** XP history for a time period. */
export interface XPHistory {
  userId: string;
  period: DateRange;
  totalXP: number;
  events: XPEvent[];
  dailyBreakdown: Array<{
    date: string;
    totalXP: number;
    byCategory: Partial<Record<XPCategory, number>>;
  }>;
}

/** Reward for reaching a level or milestone. */
export interface Reward {
  id: string;
  type: "badge" | "title" | "theme" | "feature_unlock" | "discount";
  name: string;
  description: string;
  iconUrl?: string | null;
  isRedeemed: boolean;
  redeemedAt?: string | null;
}
