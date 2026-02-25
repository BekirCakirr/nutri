import { create } from 'zustand';
import type { Dietitian } from '@/types';
import * as dietitianApi from '@/services/api/dietitian';

interface DietitianState {
  pairedDietitian: Dietitian | null;
  pairingCode: string | null;
}

interface DietitianActions {
  loadPairedDietitian: () => Promise<void>;
  setPairedDietitian: (dietitian: Dietitian | null) => void;
  requestPairing: (code: string) => Promise<void>;
  unpair: () => Promise<void>;
}

type DietitianStore = DietitianState & DietitianActions;

export const useDietitianStore = create<DietitianStore>((set) => ({
  pairedDietitian: null,
  pairingCode: null,

  loadPairedDietitian: async () => {
    const dietitian = await dietitianApi.getPairedDietitian();
    set({ pairedDietitian: dietitian });
  },

  setPairedDietitian: (dietitian) => set({ pairedDietitian: dietitian }),

  requestPairing: async (code) => {
    set({ pairingCode: code });
    const dietitian = await dietitianApi.requestPairing(code);
    set({ pairedDietitian: dietitian, pairingCode: null });
  },

  unpair: async () => {
    await dietitianApi.unpairDietitian();
    set({ pairedDietitian: null, pairingCode: null });
  },
}));
