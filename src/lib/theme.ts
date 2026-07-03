export type ThemeMode = 'light' | 'dark' | 'system'
export type Theme = 'light' | 'dark'

export const STORAGE_KEY = 'cenit-theme'

export function getStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
  } catch {
    // Almacenamiento no disponible: se asume modo "Sistema".
  }
  return 'system'
}

export function resolveTheme(mode: ThemeMode, systemPrefersDark: boolean): Theme {
  if (mode === 'system') {
    return systemPrefersDark ? 'dark' : 'light'
  }
  return mode
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}
