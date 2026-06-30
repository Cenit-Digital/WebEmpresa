import { Head } from 'vite-react-ssg'
import { buildPageTitle } from '../lib/seo'
import styles from './home.module.scss'

export default function Home() {
  return (
    <>
      <Head>
        <title>{buildPageTitle()}</title>
      </Head>
      <section className={styles.hero}>
        <p className={styles.kicker}>Estudio digital</p>
        <h1 className={styles.title}>
          Llevamos tu negocio a su <span className={styles.accent}>cénit</span> digital.
        </h1>
        <p className={styles.lead}>
          Webs rápidas, SEO que posiciona y automatizaciones con IA para pymes del noroeste de
          Madrid.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#contacto">
            Empezar un proyecto
          </a>
          <a className={styles.secondary} href="#servicios">
            Ver servicios
          </a>
        </div>
      </section>

      <section id="servicios" className={styles.services}>
        <h2>Servicios</h2>
        <ul className={styles.grid}>
          <li>
            <h3>Webs a medida</h3>
            <p>Sitios rápidos y accesibles con un SEO técnico impecable.</p>
          </li>
          <li>
            <h3>SEO y contenidos</h3>
            <p>Posicionamiento sostenible centrado en el negocio local.</p>
          </li>
          <li>
            <h3>Automatización e IA</h3>
            <p>Chatbots y flujos que ahorran horas cada semana.</p>
          </li>
        </ul>
      </section>
    </>
  )
}
