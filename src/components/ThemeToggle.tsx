import { useEffect, useState } from 'react'
import {
  applyTheme,
  getStoredMode,
  nextMode,
  resolveTheme,
  setMode,
  systemPrefersDark,
  type ThemeMode,
} from '../lib/theme'
import styles from './ThemeToggle.module.scss'

/** Etiqueta legible por modo (nombre accesible del botón). */
const MODE_LABEL: Record<ThemeMode, string> = {
  light: 'Claro',
  dark: 'Oscuro',
  system: 'Sistema',
}

/** Icono (nombre) por modo activo: sol=light, luna=dark, monitor=system. */
type IconName = 'sun' | 'moon' | 'monitor'
const MODE_ICON: Record<ThemeMode, IconName> = {
  light: 'sun',
  dark: 'moon',
  system: 'monitor',
}

/**
 * Icono del modo activo. SVG inline verbatim de la referencia (viewBox 0 0 24 24,
 * 16×16, stroke currentColor, width 2). El `data-icon` es el gancho testeable.
 * Atributos inline (no spread) para clonar la referencia 1:1.
 */
function ThemeIcon({ icon }: { icon: IconName }) {
  if (icon === 'moon') {
    return (
      <svg
        data-icon={icon}
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
      </svg>
    )
  }
  if (icon === 'sun') {
    return (
      <svg
        data-icon={icon}
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    )
  }
  return (
    <svg
      data-icon={icon}
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

export default function ThemeToggle() {
  const [mode, setModeState] = useState<ThemeMode>(getStoredMode)

  // Sincroniza el DOM con el modo activo. En "Sistema" registra un listener de
  // prefers-color-scheme para reaccionar en vivo (@s6); en cualquier otro modo
  // no hay listener (y se limpia al cambiar de modo).
  useEffect(() => {
    applyTheme(resolveTheme(mode, systemPrefersDark()))
    if (mode !== 'system') {
      return
    }
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme(resolveTheme('system', systemPrefersDark()))
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [mode])

  return (
    <button
      type="button"
      aria-label={`Cambiar tema (actual: ${MODE_LABEL[mode]})`}
      className={styles.button}
      onClick={() => {
        const next = nextMode(mode)
        setMode(next)
        setModeState(next)
      }}
    >
      <ThemeIcon icon={MODE_ICON[mode]} />
    </button>
  )
}
