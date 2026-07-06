import SectorIcon from './SectorIcon'
import styles from './Sectores.module.scss'

type Sector = {
  name: string
  description: string
}

const SECTORS: readonly Sector[] = [
  {
    name: 'Veterinarias',
    description:
      'Webs y reservas para clínicas veterinarias: fichas de servicios, citas online y recordatorios para que ningún paciente se quede sin revisión.',
  },
  {
    name: 'Servicios de estética',
    description:
      'Presencia digital para centros de estética y belleza: catálogo de tratamientos, reservas online y campañas que llenan la agenda.',
  },
  {
    name: 'Clínicas dentales',
    description:
      'Captación de pacientes para clínicas dentales: SEO local, reseñas y un sistema de citas que reduce las ausencias de última hora.',
  },
  {
    name: 'Fisioterapeutas',
    description:
      'Webs para fisioterapeutas y osteópatas: explica tus terapias, posiciónate en tu zona y deja que tus pacientes reserven solos.',
  },
]

export default function Sectores() {
  return (
    <section id="sectores" className={styles.sectors}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>A quién ayudamos</p>
          <h2 className={styles.title}>
            Sectores con los que <em className={styles.highlight}>trabajamos</em>
          </h2>
          <p className={styles.intro}>
            Nos especializamos en pocos sectores para conocerlos a fondo. Hablamos el idioma de tu
            negocio y sabemos qué necesita tu cliente.
          </p>
        </div>

        <div className={styles.grid}>
          {SECTORS.map((sector, index) => (
            <article key={sector.name} className={styles.card}>
              <div className={styles.cardHead} aria-hidden="true">
                <span className={styles.ringLarge} />
                <span className={styles.ringSmall} />
                <SectorIcon index={index} />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{sector.name}</h3>
                <p className={styles.description}>{sector.description}</p>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.note}>Selección inicial — abierta a debate según el plan comercial.</p>
      </div>
    </section>
  )
}
