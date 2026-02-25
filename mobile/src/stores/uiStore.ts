import { create } from 'zustand';
import { createPersistMiddleware } from './persist';
import { setLanguage as setI18nLanguage } from '@/i18n';

interface UIState {
  theme: 'light' | 'dark';
  language: 'tr' | 'en';
  isLoading: boolean;
}

interface UIActions {
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'tr' | 'en') => void;
  setLoading: (loading: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>(
  createPersistMiddleware<UIStore>('@nutriai/ui')((set) => ({
    theme: 'light',
    language: 'tr',
    isLoading: false,

    setTheme: (theme) => set({ theme }),

    setLanguage: (language) => {
      setI18nLanguage(language);
      set({ language });
    },

    setLoading: (isLoading) => set({ isLoading }),
  })),
);
