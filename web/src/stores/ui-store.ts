import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BreadcrumbItem, ThemeMode } from "@/types/common";

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface UiState {
  sidebarOpen: boolean;
  theme: ThemeMode;
  breadcrumbs: BreadcrumbItem[];

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: "system",
      breadcrumbs: [],

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      setTheme: (theme) => {
        set({ theme });
      },

      setBreadcrumbs: (breadcrumbs) => {
        set({ breadcrumbs });
      },
    }),
    {
      name: "nutriai-ui",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
      }),
    },
  ),
);
