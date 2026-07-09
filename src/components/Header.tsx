import { Link } from 'react-router-dom'
import Logo from './Logo'
import HeaderNav from './HeaderNav'
import styles from './Header.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Cénit Digital — inicio">
          <Logo animated />
        </Link>
        <HeaderNav />
      </div>
    </header>
  )
}
