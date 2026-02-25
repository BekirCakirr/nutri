import { useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UseApiState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

interface UseApiReturn<T, A extends unknown[]> extends UseApiState<T> {
  execute: (...args: A) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Generic hook for executing async operations with loading / error tracking.
 *
 * @param asyncFn - The async function to wrap.
 * @returns Object with data, error, isLoading, execute, reset, and setData.
 */
export function useApi<T, A extends unknown[] = []>(
  asyncFn: (...args: A) => Promise<T>,
): UseApiReturn<T, A> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(
    async (...args: A): Promise<T | null> => {
      setState({ data: null, error: null, isLoading: true });
      try {
        const result = await asyncFn(...args);
        setState({ data: result, error: null, isLoading: false });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setState({ data: null, error: message, isLoading: false });
        return null;
      }
    },
    [asyncFn],
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}
