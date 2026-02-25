import { create } from 'zustand';
import type { Profile, DietaryPreference, FamilyMember } from '@/types';
import * as familyApi from '@/services/api/family';

interface ProfileState {
  profile: Profile | null;
  allergies: string[];
  preferences: DietaryPreference[];
  familyMembers: FamilyMember[];
}

interface ProfileActions {
  setProfile: (profile: Profile) => void;
  updateProfile: (data: Partial<Profile>) => void;
  addAllergy: (allergy: string) => void;
  removeAllergy: (allergy: string) => void;
  setPreferences: (preferences: DietaryPreference[]) => void;
  loadFamilyMembers: () => Promise<void>;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => Promise<void>;
  removeFamilyMember: (id: string) => Promise<void>;
  updateFamilyMember: (id: string, data: Partial<FamilyMember>) => Promise<void>;
}

type ProfileStore = ProfileState & ProfileActions;

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  allergies: [],
  preferences: [],
  familyMembers: [],

  setProfile: (profile) =>
    set({
      profile,
      allergies: profile.allergies,
      preferences: profile.preferences,
      familyMembers: profile.familyMembers,
    }),

  updateProfile: (data) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...data } : null,
    })),

  addAllergy: (allergy) =>
    set((state) => {
      if (state.allergies.includes(allergy)) return state;
      const allergies = [...state.allergies, allergy];
      return {
        allergies,
        profile: state.profile ? { ...state.profile, allergies } : null,
      };
    }),

  removeAllergy: (allergy) =>
    set((state) => {
      const allergies = state.allergies.filter((a) => a !== allergy);
      return {
        allergies,
        profile: state.profile ? { ...state.profile, allergies } : null,
      };
    }),

  setPreferences: (preferences) =>
    set((state) => ({
      preferences,
      profile: state.profile ? { ...state.profile, preferences } : null,
    })),

  loadFamilyMembers: async () => {
    const familyMembers = await familyApi.getFamilyMembers();
    set({ familyMembers });
  },

  addFamilyMember: async (member) => {
    const newMember = await familyApi.addFamilyMember(member);
    set((state) => {
      const familyMembers = [...state.familyMembers, newMember];
      return {
        familyMembers,
        profile: state.profile ? { ...state.profile, familyMembers } : null,
      };
    });
  },

  removeFamilyMember: async (id) => {
    await familyApi.removeFamilyMember(id);
    set((state) => {
      const familyMembers = state.familyMembers.filter((m) => m.id !== id);
      return {
        familyMembers,
        profile: state.profile ? { ...state.profile, familyMembers } : null,
      };
    });
  },

  updateFamilyMember: async (id, data) => {
    const updated = await familyApi.updateFamilyMember(id, data);
    set((state) => {
      const familyMembers = state.familyMembers.map((m) =>
        m.id === id ? updated : m,
      );
      return {
        familyMembers,
        profile: state.profile ? { ...state.profile, familyMembers } : null,
      };
    });
  },
}));
