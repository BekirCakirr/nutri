/**
 * Mifflin-St Jeor BMR calculation.
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: "male" | "female"
): number {
  if (gender === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.55;
  return bmr * multiplier;
}

export function calculateMacroTargets(
  dailyCalories: number,
  goalType: string
): { proteinG: number; carbsG: number; fatG: number } {
  // Protein: 25-35%, Carbs: 40-50%, Fat: 20-30% (varies by goal)
  let proteinPct: number;
  let carbsPct: number;
  let fatPct: number;

  switch (goalType) {
    case "weight_loss":
      proteinPct = 0.3;
      carbsPct = 0.4;
      fatPct = 0.3;
      break;
    case "muscle_gain":
    case "sports_performance":
      proteinPct = 0.35;
      carbsPct = 0.45;
      fatPct = 0.2;
      break;
    case "weight_gain":
      proteinPct = 0.25;
      carbsPct = 0.5;
      fatPct = 0.25;
      break;
    default:
      proteinPct = 0.25;
      carbsPct = 0.5;
      fatPct = 0.25;
  }

  return {
    proteinG: Math.round((dailyCalories * proteinPct) / 4),
    carbsG: Math.round((dailyCalories * carbsPct) / 4),
    fatG: Math.round((dailyCalories * fatPct) / 9),
  };
}
