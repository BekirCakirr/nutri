// ---------------------------------------------------------------------------
// Dietitian Types
// ---------------------------------------------------------------------------

import type {
  Address,
  ContactInfo,
  DayOfWeek,
  GenericStatus,
  TimeRange,
  Timestamps,
} from "./common";
import type { VerificationStatus, SubscriptionTier } from "./auth";

/** Specialization area for a dietitian. */
export const Specialization = {
  WeightManagement: "weight_management",
  SportsNutrition: "sports_nutrition",
  ClinicalNutrition: "clinical_nutrition",
  PediatricNutrition: "pediatric_nutrition",
  GeriatricNutrition: "geriatric_nutrition",
  DiabetesManagement: "diabetes_management",
  RenalNutrition: "renal_nutrition",
  OncologyNutrition: "oncology_nutrition",
  EatingDisorders: "eating_disorders",
  GastrointestinalHealth: "gastrointestinal_health",
  FoodAllergies: "food_allergies",
  VeganVegetarian: "vegan_vegetarian",
  PregnancyLactation: "pregnancy_lactation",
  HeartHealth: "heart_health",
  MentalHealthNutrition: "mental_health_nutrition",
  Other: "other",
} as const
export type Specialization = (typeof Specialization)[keyof typeof Specialization]

/** Professional credential / certification. */
export interface Credential {
  id: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string | null;
  credentialNumber?: string;
  verificationUrl?: string;
  isVerified: boolean;
}

/** Education record. */
export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  isCurrentlyEnrolled: boolean;
}

/** Working-hours block for a single day. */
export interface WorkingHoursBlock {
  day: DayOfWeek;
  isWorking: boolean;
  slots: TimeRange[];
}

/** Full working-hours schedule. */
export type WorkingHours = WorkingHoursBlock[];

/** Consultation type offered by a dietitian. */
export interface ConsultationType {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  currency: string;
  isOnline: boolean;
  isInPerson: boolean;
}

/** Language spoken by the dietitian (with proficiency). */
export interface LanguageProficiency {
  language: string;
  /** ISO 639-1 code. */
  code: string;
  proficiency: "native" | "fluent" | "conversational" | "basic";
}

// ── Core entity ────────────────────────────────────────────────────────────

/** Full dietitian entity. */
export interface Dietitian extends Timestamps {
  id: string;
  userId: string;
  status: GenericStatus;
  verificationStatus: VerificationStatus;
  subscriptionTier: SubscriptionTier;

  // Profile
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
  bio?: string | null;
  headline?: string | null;
  contact: ContactInfo;
  address?: Address | null;

  // Professional
  licenseNumber: string;
  licenseState?: string;
  licenseExpirationDate?: string;
  specializations: Specialization[];
  credentials: Credential[];
  education: Education[];
  yearsOfExperience: number;
  languages: LanguageProficiency[];

  // Practice
  practiceName?: string | null;
  practiceAddress?: Address | null;
  consultationTypes: ConsultationType[];
  workingHours: WorkingHours;
  acceptingNewPatients: boolean;
  maxPatients?: number | null;
  currentPatientCount: number;

  // Ratings
  averageRating: number;
  totalReviews: number;

  // Settings
  appointmentBufferMinutes: number;
  autoAcceptAppointments: boolean;
  cancellationPolicyHours: number;
  reminderBeforeMinutes: number[];

  // Social
  socialLinks?: SocialLinks;
}

/** Social media links. */
export interface SocialLinks {
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

/** Lightweight dietitian for cards / lists. */
export interface DietitianSummary {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string | null;
  headline?: string | null;
  specializations: Specialization[];
  yearsOfExperience: number;
  averageRating: number;
  totalReviews: number;
  acceptingNewPatients: boolean;
  consultationTypes: ConsultationType[];
  city?: string;
  state?: string;
}

/** Public-facing dietitian profile (patient view). */
export interface DietitianProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
  bio?: string | null;
  headline?: string | null;
  specializations: Specialization[];
  credentials: Credential[];
  education: Education[];
  yearsOfExperience: number;
  languages: LanguageProficiency[];
  consultationTypes: ConsultationType[];
  workingHours: WorkingHours;
  acceptingNewPatients: boolean;
  averageRating: number;
  totalReviews: number;
  socialLinks?: SocialLinks;
  city?: string;
  state?: string;
}

/** Dashboard analytics for the dietitian. */
export interface DietitianDashboard {
  totalPatients: number;
  activePatients: number;
  todayAppointments: number;
  weekAppointments: number;
  unreadMessages: number;
  pendingReviews: number;
  averageAdherence: number;
  recentActivity: DietitianActivity[];
  upcomingAppointments: Array<{
    id: string;
    patientName: string;
    patientAvatarUrl?: string | null;
    dateTime: string;
    type: string;
    durationMinutes: number;
  }>;
  patientGoalProgress: Array<{
    patientId: string;
    patientName: string;
    goalTitle: string;
    progress: number;
  }>;
}

/** Activity log entry. */
export interface DietitianActivity {
  id: string;
  type: "appointment" | "message" | "plan_update" | "patient_added" | "review" | "note";
  title: string;
  description?: string;
  patientId?: string;
  patientName?: string;
  timestamp: string;
}

/** Update profile request. */
export interface UpdateDietitianProfileRequest {
  bio?: string;
  headline?: string;
  specializations?: Specialization[];
  consultationTypes?: ConsultationType[];
  workingHours?: WorkingHours;
  acceptingNewPatients?: boolean;
  maxPatients?: number;
  appointmentBufferMinutes?: number;
  autoAcceptAppointments?: boolean;
  cancellationPolicyHours?: number;
  reminderBeforeMinutes?: number[];
  socialLinks?: Partial<SocialLinks>;
  contact?: Partial<ContactInfo>;
  address?: Partial<Address>;
}

/** Dietitian search filters. */
export interface DietitianFilters {
  search?: string;
  specializations?: Specialization[];
  languages?: string[];
  acceptingNewPatients?: boolean;
  minRating?: number;
  maxPrice?: number;
  isOnline?: boolean;
  isInPerson?: boolean;
  city?: string;
  state?: string;
  pagination: {
    page: number;
    limit: number;
  };
}
