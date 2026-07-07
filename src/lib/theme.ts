/** Tema resuelto que se escribe en `data-theme` del `<html>`. */
export type ResolvedTheme = 'light' | 'dark'

/** Modo elegido por el usuario. `'system'` sigue a `prefers-color-scheme`. */
export type ThemeMode = ResolvedTheme | 'system'

/** Clave de persistencia. Solo guarda `'light'`|`'dark'`; ausencia = `'system'`. */
const STORAGE_KEY = 'cenit-theme'

/** ¿El sistema operativo prefiere esquema oscuro? */
export function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** Aplica el tema resuelto al `<html>`. */
export function applyTheme(theme: ResolvedTheme): void {
  document.documentElement.dataset.theme = theme
}

/** Modo persistido; ausencia o valor inválido → `'system'`. */
export function getStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
    return 'system'
  } catch {
    return 'system'
  }
}

/** Resuelve el modo a un tema concreto usando la preferencia del sistema. */
export function resolveTheme(mode: ThemeMode, prefersDark: boolean): ResolvedTheme {
  if (mode === 'system') {
    return prefersDark ? 'dark' : 'light'
  }
  return mode
}

/** Resuelve y aplica el tema en la carga (modo persistido + sistema). */
export function applyInitialTheme(): void {
  applyTheme(resolveTheme(getStoredMode(), systemPrefersDark()))
}

/**
 * Fija el modo elegido: persiste `'light'`|`'dark'`, elimina la clave en
 * `'system'`, y aplica el tema resuelto. Si el almacenamiento falla, aplica igual.
 */
export function setMode(mode: ThemeMode): void {
  try {
    if (mode === 'system') {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, mode)
    }
  } catch {
    // Almacenamiento no disponible: el tema se aplica solo en memoria.
  }
  applyTheme(resolveTheme(mode, systemPrefersDark()))
}

/**
 * Réplica pura de la lógica del script anti-FOUC del `index.html` (@s8): decide
 * el `data-theme` inicial a partir del valor bruto de `localStorage` y de la
 * preferencia del sistema. Valores distintos de `'light'`/`'dark'` = "Sistema".
 */
export function initialThemeAttribute(stored: string | null, prefersDark: boolean): ResolvedTheme {
  if (stored === 'dark' || stored === 'light') {
    return stored
  }
  return prefersDark ? 'dark' : 'light'
}
