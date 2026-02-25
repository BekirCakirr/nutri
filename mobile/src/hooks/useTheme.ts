import { useMemo } from 'react';
import { useUIStore } from '@/stores';
import { lightTheme, darkTheme, type AppTheme } from '@/theme';

export function useTheme() {
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const currentTheme: AppTheme = useMemo(
    () => (isDark ? darkTheme : lightTheme),
    [isDark],
  );

  return {
    theme,
    isDark,
    colors: currentTheme.colors,
    typography: currentTheme.typography,
    spacing: currentTheme.spacing,
    currentTheme,
    setTheme,
    toggleTheme,
  };
}
