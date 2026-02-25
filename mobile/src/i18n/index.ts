import tr from './tr.json';
import en from './en.json';

type Language = 'tr' | 'en';
type TranslationMap = typeof tr;

const translations: Record<Language, TranslationMap> = { tr, en };

let currentLanguage: Language = 'tr';

export function setLanguage(lang: Language): void {
  currentLanguage = lang;
}

export function getLanguage(): Language {
  return currentLanguage;
}

/**
 * Retrieve a translated string by dot-separated key path.
 * Example: t('common.save') -> "Kaydet"
 */
export function t(key: string): string {
  const keys = key.split('.');
  let result: unknown = translations[currentLanguage];

  for (const k of keys) {
    if (result && typeof result === 'object' && k in (result as Record<string, unknown>)) {
      result = (result as Record<string, unknown>)[k];
    } else {
      // Fallback to Turkish if key not found in current language
      let fallback: unknown = translations.tr;
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object' && fk in (fallback as Record<string, unknown>)) {
          fallback = (fallback as Record<string, unknown>)[fk];
        } else {
          return key;
        }
      }
      return typeof fallback === 'string' ? fallback : key;
    }
  }

  return typeof result === 'string' ? result : key;
}

export { tr, en };
export type { Language, TranslationMap };
