import { ClientOnly } from 'vite-react-ssg'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import HeaderNav from './HeaderNav'
import styles from './Header.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Cénit Digital — inicio">
          <Logo />
        </Link>
        <HeaderNav />
        <ClientOnly>{() => <ThemeToggle />}</ClientOnly>
      </div>
    </header>
  )
}
