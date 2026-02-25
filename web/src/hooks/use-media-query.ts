import { useState, useEffect } from "react";

/**
 * Subscribe to a CSS media query and return whether it matches.
 *
 * @param query - A CSS media query string, e.g. "(min-width: 768px)".
 * @returns `true` when the query matches.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mql.matches);

    mql.addEventListener("change", handleChange);
    return () => {
      mql.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}
