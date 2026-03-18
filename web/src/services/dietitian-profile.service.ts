import api from "@/lib/axios";

export interface DietitianProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  title?: string;
  licenseNumber?: string;
  specializations: string[];
  university?: string;
  experienceYears?: number;
  bio?: string;
  profilePhotoUrl?: string;
  clinicName?: string;
  clinicAddress?: string;
  city?: string;
  offersOnline: boolean;
  offersInPerson: boolean;
  sessionPriceTl?: number;
  availableDays: string[];
  sessionDurationMin: number;
  inviteCode?: string;
  isApproved: boolean;
  ratingAvg: number;
  ratingCount: number;
  email?: string;
}

export interface WorkingHourEntry {
  day: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface Specialization {
  id: string;
  name: string;
  description?: string;
}

export async function getProfile(): Promise<DietitianProfile> {
  const { data } = await api.get("/dietitians/me");
  return data as DietitianProfile;
}

export async function updateProfile(profileData: Partial<DietitianProfile>): Promise<DietitianProfile> {
  const { data } = await api.put("/dietitians/me", profileData);
  return data as DietitianProfile;
}

export async function updateWorkingHours(
  hours: WorkingHourEntry[],
): Promise<DietitianProfile> {
  const availableDays = hours.filter((h) => h.isActive).map((h) => h.day);
  const availableHours = Object.fromEntries(
    hours.filter((h) => h.isActive).map((h) => [h.day, { start: h.startTime, end: h.endTime }]),
  );
  const { data } = await api.put("/dietitians/me", { availableDays, availableHours });
  return data as DietitianProfile;
}

export async function getSpecializations(): Promise<Specialization[]> {
  return [
    { id: "klinik", name: "Klinik Beslenme" },
    { id: "spor", name: "Spor Beslenmesi" },
    { id: "pediatri", name: "Cocuk Beslenmesi" },
    { id: "gebelik", name: "Gebelik Beslenmesi" },
    { id: "obezite", name: "Obezite Tedavisi" },
    { id: "diyabet", name: "Diyabet Yonetimi" },
    { id: "alerji", name: "Besin Alerjileri" },
    { id: "vegan", name: "Vegan/Vejetaryen Beslenme" },
    { id: "onkoloji", name: "Onkoloji Beslenmesi" },
    { id: "geriatri", name: "Geriatri Beslenmesi" },
  ];
}
