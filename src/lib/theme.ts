export const THEME_STORAGE_KEY = "theme";
export const THEME_CHANGE_EVENT = "hepa:theme-change";

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

export function getSystemPrefersDark() {
  if (!isBrowser()) {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveThemePreference(preference: ThemePreference | null = getStoredThemePreference()) {
  if (preference === "dark") {
    return true;
  }

  if (preference === "light") {
    return false;
  }

  return getSystemPrefersDark();
}

export function applyResolvedTheme(isDark: boolean) {
  if (!isBrowser()) {
    return;
  }

  document.documentElement.classList.toggle("dark", isDark);
  window.dispatchEvent(
    new CustomEvent(THEME_CHANGE_EVENT, {
      detail: {
        isDark,
        preference: getStoredThemePreference(),
      },
    }),
  );
}

export function syncThemePreference() {
  const isDark = resolveThemePreference();
  applyResolvedTheme(isDark);
  return isDark;
}

export function setThemePreference(preference: Exclude<ThemePreference, "system">) {
  if (!isBrowser()) {
    return preference === "dark";
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  const isDark = resolveThemePreference(preference);
  applyResolvedTheme(isDark);
  return isDark;
}

