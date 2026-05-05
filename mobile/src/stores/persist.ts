import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateCreator } from 'zustand';

const TRANSIENT_KEYS = new Set(['isLoading', 'isHydrating', 'error']);

/**
 * Simple persist middleware for Zustand v5 with AsyncStorage.
 * Hydrates state on creation and writes back on every change.
 * - Filters transient keys (isLoading, error) so they don't bleed across launches.
 * - Functions are skipped automatically by JSON.stringify.
 */
export function createPersistMiddleware<T extends object>(key: string) {
  return (initializer: StateCreator<T>): StateCreator<T> =>
    (set, get, api) => {
      // Hydrate from storage on init
      AsyncStorage.getItem(key)
        .then((stored) => {
          if (!stored) return;
          try {
            const parsed = JSON.parse(stored) as Record<string, unknown>;
            // Filter out transient keys before hydrating
            const filtered: Record<string, unknown> = {};
            for (const k of Object.keys(parsed)) {
              if (!TRANSIENT_KEYS.has(k)) {
                filtered[k] = parsed[k];
              }
            }
            set(filtered as Partial<T> as T);
          } catch {
            // ignore corrupt data
          }
        })
        .catch(() => {});

      // Wrap set to persist on every change
      const persistSet: typeof set = (...args) => {
        set(...(args as Parameters<typeof set>));
        try {
          const state = get() as Record<string, unknown>;
          const toPersist: Record<string, unknown> = {};
          for (const k of Object.keys(state)) {
            const v = state[k];
            // Skip transient keys, functions, and undefined
            if (TRANSIENT_KEYS.has(k)) continue;
            if (typeof v === 'function') continue;
            if (typeof v === 'undefined') continue;
            toPersist[k] = v;
          }
          AsyncStorage.setItem(key, JSON.stringify(toPersist)).catch(() => {});
        } catch {
          // Ignore stringify failures (e.g., cyclic refs)
        }
      };

      return initializer(persistSet, get, api);
    };
}
