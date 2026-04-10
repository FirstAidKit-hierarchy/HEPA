export const THEME_STORAGE_KEY = "theme";

export type ThemePreference = "light" | "dark" | "system";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStoredThemePreference(): ThemePreference | null {
  if (!isBrowser()) {
    return null;
  }

  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  return value === "light" || value === "dark" || value === "system" ? value : null;
}

export function getThemePreference(): ThemePreference {
  return getStoredThemePreference() ?? "system";
}

export function getSystemPrefersDark() {
  if (!isBrowser()) {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveThemePreference(preference: ThemePreference | null = getThemePreference()) {
  return preference === "system" || preference === null ? getSystemPrefersDark() : preference === "dark";
}

export function getNextThemePreference(preference: ThemePreference): ThemePreference {
  if (preference === "system") {
    return getSystemPrefersDark() ? "light" : "dark";
  }

  return "system";
}

export function applyResolvedTheme(isDark: boolean) {
  if (!isBrowser()) {
    return;
  }

  document.documentElement.classList.toggle("dark", isDark);
}

export function syncThemePreference() {
  const isDark = resolveThemePreference();
  applyResolvedTheme(isDark);
  return isDark;
}

export function setThemePreference(preference: ThemePreference) {
  if (!isBrowser()) {
    return preference === "dark";
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  const isDark = resolveThemePreference(preference);
  applyResolvedTheme(isDark);
  return isDark;
}
