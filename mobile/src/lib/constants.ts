// @ts-ignore — __DEV__ is injected by React Native runtime
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

// Physical device: use your LAN IP (same WiFi network required)
// Android emulator: use 10.0.2.2 instead
const DEV_HOST = '192.168.1.3';
export const API_URL = isDev ? `http://${DEV_HOST}:3001/api` : 'https://api.nutriai.app/v1';
export const SOCKET_URL = isDev ? `http://${DEV_HOST}:3001` : 'wss://api.nutriai.app';
export const APP_VERSION = '1.0.0';

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export const MEAL_TYPE_LABELS: Record<string, { tr: string; en: string }> = {
  breakfast: { tr: 'Kahvalt\u0131', en: 'Breakfast' },
  lunch: { tr: '\u00d6\u011fle Yeme\u011fi', en: 'Lunch' },
  dinner: { tr: 'Ak\u015fam Yeme\u011fi', en: 'Dinner' },
  snack: { tr: 'Ara \u00d6\u011f\u00fcn', en: 'Snack' },
};

export const EXERCISE_TYPES = [
  'walking',
  'running',
  'cycling',
  'swimming',
  'yoga',
  'weight_training',
  'pilates',
  'dance',
  'hiking',
  'other',
] as const;

export const EXERCISE_TYPE_LABELS: Record<string, { tr: string; en: string }> = {
  walking: { tr: 'Y\u00fcr\u00fcy\u00fc\u015f', en: 'Walking' },
  running: { tr: 'Ko\u015fu', en: 'Running' },
  cycling: { tr: 'Bisiklet', en: 'Cycling' },
  swimming: { tr: 'Y\u00fczme', en: 'Swimming' },
  yoga: { tr: 'Yoga', en: 'Yoga' },
  weight_training: { tr: 'A\u011f\u0131rl\u0131k', en: 'Weight Training' },
  pilates: { tr: 'Pilates', en: 'Pilates' },
  dance: { tr: 'Dans', en: 'Dance' },
  hiking: { tr: 'Do\u011fa Y\u00fcr\u00fcy\u00fc\u015f\u00fc', en: 'Hiking' },
  other: { tr: 'Di\u011fer', en: 'Other' },
};

export const WATER_GLASS_ML = 200;
export const DAILY_WATER_TARGET = 2500; // ml
export const DEFAULT_CALORIE_TARGET = 2000;

export const ACTIVITY_LEVEL_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const FOOD_CATEGORIES = [
  'fruit',
  'vegetable',
  'grain',
  'protein',
  'dairy',
  'fat',
  'snack',
  'beverage',
  'prepared',
  'other',
] as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@nutriai/auth_token',
  USER: '@nutriai/user',
  THEME: '@nutriai/theme',
  LANGUAGE: '@nutriai/language',
  ONBOARDED: '@nutriai/onboarded',
} as const;
