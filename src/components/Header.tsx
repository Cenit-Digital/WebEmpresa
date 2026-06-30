import { ClientOnly } from 'vite-react-ssg'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import ContactDialog from './ContactDialog'
import styles from './Header.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Cénit Digital — inicio">
          <Logo />
        </Link>
        <nav className={styles.nav} aria-label="Principal">
          <a href="#servicios">Servicios</a>
          <a href="#proceso">Proceso</a>
          <ContactDialog />
          <ClientOnly>{() => <ThemeToggle />}</ClientOnly>
        </nav>
      </div>
    </header>
  )
}
