import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  THEME_STORAGE_KEY,
  getStoredThemePreference,
  resolveThemePreference,
  setThemePreference,
  syncThemePreference,
} from "@/lib/theme";

type ThemeContextValue = {
  isDark: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(resolveThemePreference);

  useEffect(() => {
    setIsDark(syncThemePreference());

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => setIsDark(syncThemePreference());

    const handleSystemThemeChange = () => {
      const storedPreference = getStoredThemePreference();

      if (!storedPreference || storedPreference === "system") {
        syncTheme();
      }
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (!event.key || event.key === THEME_STORAGE_KEY) {
        syncTheme();
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      theme: isDark ? "dark" : "light",
      toggleTheme: () => {
        setIsDark(setThemePreference(isDark ? "light" : "dark"));
      },
    }),
    [isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }

  return context;
};
