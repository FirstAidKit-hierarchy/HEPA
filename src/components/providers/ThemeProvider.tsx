import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  THEME_STORAGE_KEY,
  getStoredThemePreference,
  getNextThemePreference,
  getThemePreference,
  resolveThemePreference,
  setThemePreference,
  syncThemePreference,
  type ThemePreference,
} from "@/lib/theme";

type ThemeContextValue = {
  isDark: boolean;
  theme: "light" | "dark";
  preference: ThemePreference;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeState, setThemeState] = useState(() => ({
    preference: getThemePreference(),
    isDark: resolveThemePreference(),
  }));

  useEffect(() => {
    const syncTheme = () => {
      setThemeState({
        preference: getThemePreference(),
        isDark: syncThemePreference(),
      });
    };

    syncTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

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

  const toggleTheme = () => {
    const nextPreference = getNextThemePreference(themeState.preference);

    setThemeState({
      preference: nextPreference,
      isDark: setThemePreference(nextPreference),
    });
  };

  const value: ThemeContextValue = {
    isDark: themeState.isDark,
    theme: themeState.isDark ? "dark" : "light",
    preference: themeState.preference,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }

  return context;
};
