import { Link } from 'react-router-dom'
import { SITE } from '../lib/site'
import styles from './Footer.module.scss'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          © {year} {SITE.name}. Todos los derechos reservados.
        </p>
        <nav className={styles.links} aria-label="Pie">
          <Link to="/aviso-legal">Aviso legal</Link>
          <a href="mailto:hola@cenitdigital.es">hola@cenitdigital.es</a>
        </nav>
      </div>
    </footer>
  )
}
