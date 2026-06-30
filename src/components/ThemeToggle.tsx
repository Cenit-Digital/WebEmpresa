import { useState } from 'react'
import styles from './ThemeToggle.module.scss'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'light'
  }
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('cenit-theme', next)
    } catch {
      // Almacenamiento no disponible: el tema se mantiene solo en memoria.
    }
  }

  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-pressed={isDark}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <span aria-hidden="true">{isDark ? '☀' : '☾'}</span>
      <span className={styles.label}>{isDark ? 'Claro' : 'Oscuro'}</span>
    </button>
  )
}
