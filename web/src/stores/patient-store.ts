import { create } from "zustand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Patient {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "prefer_not_to_say";
  height: number;
  weight: number;
  activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active";
  goals: string[];
  allergies: string[];
  dietaryRestrictions: string[];
  medicalConditions: string[];
  status: "active" | "inactive" | "pending";
  assignedNutritionistId: string;
  lastVisit: string;
  nextAppointment: string | null;
  adherenceScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface PatientFilters {
  search: string;
  status: "all" | "active" | "inactive" | "pending";
  sortBy: "name" | "lastVisit" | "adherenceScore" | "nextAppointment";
  sortOrder: "asc" | "desc";
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  filters: PatientFilters;
  isLoading: boolean;

  setPatients: (patients: Patient[]) => void;
  selectPatient: (patient: Patient | null) => void;
  updateFilters: (filters: Partial<PatientFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: PatientFilters = {
  search: "",
  status: "all",
  sortBy: "name",
  sortOrder: "asc",
};

export const usePatientStore = create<PatientState>()((set) => ({
  patients: [],
  selectedPatient: null,
  filters: defaultFilters,
  isLoading: false,

  setPatients: (patients) => {
    set({ patients });
  },

  selectPatient: (patient) => {
    set({ selectedPatient: patient });
  },

  updateFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },
}));
