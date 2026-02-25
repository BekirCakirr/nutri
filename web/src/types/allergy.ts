// ---------------------------------------------------------------------------
// Allergy / Food Sensitivity Types
// ---------------------------------------------------------------------------

import type { Timestamps } from "./common";

/** Top-level allergen category. */
export enum AllergenCategory {
  FoodAllergen = "food_allergen",
  FoodIntolerance = "food_intolerance",
  DrugAllergen = "drug_allergen",
  Environmental = "environmental",
  Other = "other",
}

/** Severity classification. */
export enum AllergySeverity {
  Mild = "mild",
  Moderate = "moderate",
  Severe = "severe",
  Anaphylactic = "anaphylactic",
}

/** How the allergy was identified. */
export type AllergyDiagnosisMethod =
  | "self_reported"
  | "skin_prick_test"
  | "blood_test"
  | "elimination_diet"
  | "oral_food_challenge"
  | "physician_diagnosed"
  | "unknown";

/** Reaction type experienced. */
export type ReactionType =
  | "skin_rash"
  | "hives"
  | "itching"
  | "swelling"
  | "breathing_difficulty"
  | "wheezing"
  | "nausea"
  | "vomiting"
  | "diarrhea"
  | "abdominal_pain"
  | "bloating"
  | "headache"
  | "dizziness"
  | "anaphylaxis"
  | "other";

// ── Core entities ──────────────────────────────────────────────────────────

/** An allergen in the platform's database. */
export interface Allergen extends Timestamps {
  id: string;
  name: string;
  code: string;
  category: AllergenCategory;
  description?: string | null;
  iconUrl?: string | null;
  /** Common food items that contain this allergen. */
  commonSources: string[];
  /** Alternative names / synonyms. */
  aliases: string[];
  /** Regulatory status (e.g. "EU top-14", "US top-9"). */
  regulatoryLabels: string[];
  /** Cross-reactive allergens. */
  crossReactiveAllergenIds: string[];
  /** Is it one of the major allergens? */
  isMajor: boolean;
}

/** Lightweight allergen for dropdowns / tags. */
export interface AllergenSummary {
  id: string;
  name: string;
  code: string;
  category: AllergenCategory;
  iconUrl?: string | null;
  isMajor: boolean;
}

/** A patient's specific allergy / intolerance record. */
export interface AllergyInfo extends Timestamps {
  id: string;
  patientId: string;
  allergenId: string;
  allergen: AllergenSummary;
  severity: AllergySeverity;
  diagnosisMethod: AllergyDiagnosisMethod;
  diagnosedDate?: string | null;
  diagnosedBy?: string | null;
  reactions: ReactionType[];
  /** Free-text reaction details. */
  reactionDescription?: string | null;
  /** Is this still active (vs. outgrown)? */
  isActive: boolean;
  /** Threshold if known (mg). */
  thresholdMg?: number | null;
  /** Action plan in case of exposure. */
  actionPlan?: AllergyActionPlan | null;
  /** Associated medications (e.g. EpiPen). */
  medications?: AllergyMedication[];
  notes?: string | null;
  /** Last confirmed / reviewed date. */
  lastConfirmedAt?: string | null;
}

/** Emergency action plan for an allergy. */
export interface AllergyActionPlan {
  mildReactionSteps: string[];
  severeReactionSteps: string[];
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  hospitalPreference?: string | null;
  notes?: string | null;
}

/** Medication related to allergy management. */
export interface AllergyMedication {
  name: string;
  type: "antihistamine" | "epinephrine" | "corticosteroid" | "other";
  dosage: string;
  instructions: string;
  expirationDate?: string | null;
}

// ── Alert / safety ─────────────────────────────────────────────────────────

/** Allergen warning returned when a food or recipe is checked. */
export interface AllergenAlert {
  allergenId: string;
  allergenName: string;
  severity: AllergySeverity;
  /** Where the allergen was found (ingredient name, etc.). */
  source: string;
  /** Definite or possible (cross-contamination). */
  certainty: "definite" | "possible" | "trace";
  message: string;
}

/** Safety check result for a food / recipe / meal plan. */
export interface AllergenCheckResult {
  isAllSafe: boolean;
  alerts: AllergenAlert[];
  checkedAllergenIds: string[];
  /** Suggested safe alternatives. */
  alternatives?: Array<{
    unsafeItemName: string;
    safeAlternatives: Array<{ name: string; foodItemId?: string }>;
  }>;
}

// ── Requests ───────────────────────────────────────────────────────────────

/** Add an allergy to a patient. */
export interface CreateAllergyRequest {
  patientId: string;
  allergenId: string;
  severity: AllergySeverity;
  diagnosisMethod?: AllergyDiagnosisMethod;
  diagnosedDate?: string;
  diagnosedBy?: string;
  reactions?: ReactionType[];
  reactionDescription?: string;
  thresholdMg?: number;
  notes?: string;
  medications?: Omit<AllergyMedication, never>[];
  actionPlan?: AllergyActionPlan;
}

/** Update an allergy record. */
export interface UpdateAllergyRequest extends Partial<CreateAllergyRequest> {
  id: string;
  isActive?: boolean;
}

/** Check a set of food items for allergens. */
export interface AllergenCheckRequest {
  patientId: string;
  foodItemIds?: string[];
  recipeIds?: string[];
  ingredientNames?: string[];
}

/** Common allergen presets for quick onboarding. */
export interface AllergenPreset {
  id: string;
  label: string;
  description: string;
  allergenIds: string[];
}
