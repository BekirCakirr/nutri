// ---------------------------------------------------------------------------
// Dietitian Profile Service
// ---------------------------------------------------------------------------

import { simulateApiCall } from "@/mock";

// ── Types ────────────────────────────────────────────────────────────────────

export interface DietitianProfile {
  id: string;
  userId: string;
  bio: string;
  specializations: string[];
  licenseNumber: string;
  experience: number;
  education: { degree: string; institution: string; year: number }[];
  workingHours: WorkingHourEntry[];
  consultationFee: number;
  currency: string;
  acceptingNewPatients: boolean;
  languages: string[];
  rating: number;
  totalReviews: number;
}

export interface WorkingHourEntry {
  day: string;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

export interface Specialization {
  id: string;
  name: string;
  description: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const mockProfile: DietitianProfile = {
  id: "dp-001",
  userId: "usr_001",
  bio: "10 yillik deneyime sahip klinik diyetisyen. Spor beslenmesi ve diyabet yonetimi konularinda uzman.",
  specializations: ["sports-nutrition", "weight-management", "diabetes"],
  licenseNumber: "RDN-2024-0456",
  experience: 10,
  education: [
    { degree: "Beslenme ve Diyetetik", institution: "Hacettepe Universitesi", year: 2014 },
    { degree: "Klinik Beslenme Yuksek Lisans", institution: "Istanbul Universitesi", year: 2017 },
  ],
  workingHours: [
    { day: "monday", isAvailable: true, startTime: "09:00", endTime: "18:00" },
    { day: "tuesday", isAvailable: true, startTime: "09:00", endTime: "18:00" },
    { day: "wednesday", isAvailable: true, startTime: "09:00", endTime: "18:00" },
    { day: "thursday", isAvailable: true, startTime: "09:00", endTime: "18:00" },
    { day: "friday", isAvailable: true, startTime: "09:00", endTime: "17:00" },
    { day: "saturday", isAvailable: true, startTime: "10:00", endTime: "14:00" },
    { day: "sunday", isAvailable: false, startTime: "", endTime: "" },
  ],
  consultationFee: 500,
  currency: "TRY",
  acceptingNewPatients: true,
  languages: ["Turkce", "Ingilizce"],
  rating: 4.8,
  totalReviews: 42,
};

const mockSpecializations: Specialization[] = [
  { id: "sp-001", name: "sports-nutrition", description: "Spor Beslenmesi" },
  { id: "sp-002", name: "weight-management", description: "Kilo Yonetimi" },
  { id: "sp-003", name: "diabetes", description: "Diyabet Beslenmesi" },
  { id: "sp-004", name: "pediatric", description: "Cocuk Beslenmesi" },
  { id: "sp-005", name: "prenatal", description: "Gebelik Beslenmesi" },
  { id: "sp-006", name: "eating-disorders", description: "Yeme Bozukluklari" },
  { id: "sp-007", name: "renal", description: "Bobrek Hastaliklari Beslenmesi" },
  { id: "sp-008", name: "cardiac", description: "Kardiyolojik Beslenme" },
  { id: "sp-009", name: "oncology", description: "Onkoloji Beslenmesi" },
  { id: "sp-010", name: "geriatric", description: "Geriatrik Beslenme" },
];

// ── Public API ───────────────────────────────────────────────────────────────

export async function getProfile(): Promise<DietitianProfile> {
  return simulateApiCall({ ...mockProfile }, 300);
}

export async function updateProfile(
  data: Partial<DietitianProfile>,
): Promise<DietitianProfile> {
  return simulateApiCall({ ...mockProfile, ...data }, 400);
}

export async function updateWorkingHours(
  hours: WorkingHourEntry[],
): Promise<DietitianProfile> {
  return simulateApiCall({ ...mockProfile, workingHours: hours }, 400);
}

export async function getSpecializations(): Promise<Specialization[]> {
  return simulateApiCall([...mockSpecializations], 300);
}
