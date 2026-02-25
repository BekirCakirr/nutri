import { useCallback } from 'react';
import { useUIStore } from '@/stores';
import { t as translate, type Language } from '@/i18n';

export function useI18n() {
  const language = useUIStore((state) => state.language);
  const setLanguage = useUIStore((state) => state.setLanguage);

  const t = useCallback(
    (key: string): string => {
      return translate(key);
    },
    [language],
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  }, [language, setLanguage]);

  return {
    language,
    t,
    setLanguage,
    toggleLanguage,
  };
}
