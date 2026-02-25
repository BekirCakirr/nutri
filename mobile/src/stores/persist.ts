import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

/**
 * Simple persist middleware for Zustand v5 with AsyncStorage.
 * Hydrates state on creation and writes back on every change.
 */
export function createPersistMiddleware<T extends object>(key: string) {
  return (initializer: StateCreator<T>): StateCreator<T> =>
    (set, get, api) => {
      // Hydrate from storage on init
      AsyncStorage.getItem(key).then((stored) => {
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as Partial<T>;
            set(parsed as T);
          } catch {
            // ignore corrupt data
          }
        }
      });

      // Wrap set to persist on every change
      const persistSet: typeof set = (...args) => {
        set(...(args as Parameters<typeof set>));
        const state = get();
        AsyncStorage.setItem(key, JSON.stringify(state)).catch(() => {});
      };

      return initializer(persistSet, get, api);
    };
}
