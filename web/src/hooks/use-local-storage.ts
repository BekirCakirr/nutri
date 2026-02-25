import { useState, useCallback, useEffect } from "react";

/**
 * Synchronise a value with localStorage.
 *
 * @param key          - localStorage key.
 * @param initialValue - Fallback when nothing is stored yet.
 * @returns A tuple of [storedValue, setValue, removeValue].
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Read from localStorage (or fall back to initial)
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Persist on change
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const newValue =
          value instanceof Function ? value(storedValue) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);

        // Dispatch a custom event so other tabs / instances can sync
        window.dispatchEvent(
          new StorageEvent("storage", { key, newValue: JSON.stringify(newValue) }),
        );
      } catch (err) {
        console.warn(`useLocalStorage: failed to set "${key}"`, err);
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (err) {
      console.warn(`useLocalStorage: failed to remove "${key}"`, err);
    }
  }, [key, initialValue]);

  // Sync with changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
