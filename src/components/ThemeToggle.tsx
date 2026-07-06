import { useEffect, useState } from 'react'
import {
  applyTheme,
  getStoredMode,
  resolveTheme,
  setMode,
  systemPrefersDark,
  type ThemeMode,
} from '../lib/theme'
import styles from './ThemeToggle.module.scss'

const OPTIONS: { mode: ThemeMode; label: string }[] = [
  { mode: 'light', label: 'Claro' },
  { mode: 'dark', label: 'Oscuro' },
  { mode: 'system', label: 'Sistema' },
]

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

  function choose(next: ThemeMode) {
    setMode(next)
    setModeState(next)
  }

  return (
    <div role="radiogroup" aria-label="Tema" className={styles.group}>
      {OPTIONS.map((option) => (
        <button
          key={option.mode}
          type="button"
          role="radio"
          aria-checked={mode === option.mode}
          className={styles.option}
          onClick={() => choose(option.mode)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
