import { create } from 'zustand';

/**
 * Onboarding store — collects all user inputs across the multi-step
 * onboarding flow. Lives only in memory (not persisted) since the data
 * is finalized via PUT /patients/me at the end of the flow.
 */

export interface OnboardingData {
  // Step 1 — BasicInfo
  birthDate: string;          // formatted DD/MM/YYYY (UI) — converted to ISO before submit
  gender: 'male' | 'female' | 'other' | '';
  heightCm: number | null;
  currentWeightKg: number | null;

  // Step 2 — Goal
  goalType: 'lose' | 'gain' | 'maintain' | 'health' | 'muscle' | '';
  targetWeightKg: number | null;

  // Step 3 — Allergies (local only — backend has separate endpoint)
  allergyIds: string[];

  // Step 4 — Diet preference (single value mapped to backend `diet_type`)
  dietPreference: string;

  // Step 5 — Lifestyle / activity level
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | '';

  // Step 6 — Dietitian invite code (optional)
  inviteCode: string;
}

interface OnboardingActions {
  setBasicInfo: (data: Partial<Pick<OnboardingData, 'birthDate' | 'gender' | 'heightCm' | 'currentWeightKg'>>) => void;
  setGoal: (goalType: OnboardingData['goalType'], targetWeightKg?: number | null) => void;
  setAllergies: (ids: string[]) => void;
  setDietPreference: (id: string) => void;
  setActivityLevel: (level: OnboardingData['activityLevel']) => void;
  setInviteCode: (code: string) => void;
  reset: () => void;
}

type OnboardingStore = OnboardingData & OnboardingActions;

const initialState: OnboardingData = {
  birthDate: '',
  gender: '',
  heightCm: null,
  currentWeightKg: null,
  goalType: '',
  targetWeightKg: null,
  allergyIds: [],
  dietPreference: '',
  activityLevel: '',
  inviteCode: '',
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  ...initialState,

  setBasicInfo: (data) => set((s) => ({ ...s, ...data })),
  setGoal: (goalType, targetWeightKg) => set({ goalType, targetWeightKg: targetWeightKg ?? null }),
  setAllergies: (ids) => set({ allergyIds: ids }),
  setDietPreference: (id) => set({ dietPreference: id }),
  setActivityLevel: (level) => set({ activityLevel: level }),
  setInviteCode: (code) => set({ inviteCode: code }),
  reset: () => set(initialState),
}));

/**
 * Convert UI birth date "DD/MM/YYYY" to ISO "YYYY-MM-DD".
 * Returns undefined if the input is malformed so we don't send garbage to the API.
 */
export function birthDateToISO(input: string): string | undefined {
  const trimmed = (input || '').trim();
  if (!trimmed) return undefined;
  const parts = trimmed.split('/');
  if (parts.length !== 3) return undefined;
  const [d, m, y] = parts;
  if (!d || !m || !y) return undefined;
  if (y.length !== 4) return undefined;
  const dd = d.padStart(2, '0');
  const mm = m.padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

/**
 * Compute BMI (metric).
 */
export function calculateBMI(heightCm: number | null, weightKg: number | null): number {
  if (!heightCm || !weightKg) return 0;
  const m = heightCm / 100;
  if (m <= 0) return 0;
  return weightKg / (m * m);
}

/**
 * Mifflin-St Jeor BMR + activity multiplier → TDEE, then apply goal modifier.
 * Falls back to a sane default if inputs are missing.
 */
export function calculateDailyCalories(data: OnboardingData): number {
  const { heightCm, currentWeightKg, gender, birthDate, activityLevel, goalType } = data;
  if (!heightCm || !currentWeightKg) return 2000;

  // Estimate age from birthDate (best effort — defaults to 30)
  let age = 30;
  const iso = birthDateToISO(birthDate);
  if (iso) {
    const born = new Date(iso);
    if (!Number.isNaN(born.getTime())) {
      const diffMs = Date.now() - born.getTime();
      age = Math.max(15, Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000)));
    }
  }

  const bmr =
    gender === 'female'
      ? 10 * currentWeightKg + 6.25 * heightCm - 5 * age - 161
      : 10 * currentWeightKg + 6.25 * heightCm - 5 * age + 5;

  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const tdee = bmr * (multipliers[activityLevel] ?? 1.375);

  let goalAdj = 0;
  if (goalType === 'lose') goalAdj = -500;
  else if (goalType === 'gain' || goalType === 'muscle') goalAdj = 300;

  return Math.max(1200, Math.round(tdee + goalAdj));
}
