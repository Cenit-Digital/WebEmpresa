import styles from './ServiceMockup.module.scss'

type ServiceMockupProps = {
  /** Índice de la tarjeta (0..5); cada servicio tiene su mockup propio. */
  index: number
}

/**
 * Mockup ilustrativo y DECORATIVO de una fila de servicio (`aria-hidden`).
 * Cada índice renderiza un mockup distinto, fiel al diseño de referencia:
 *   0 navegador · 1 chat · 2 Instagram · 3 mapa (SEO) · 4 calendario · 5 flujo ERP.
 * Fuera de `stryker.config.json mutate`: sus rótulos (p. ej. "Reservar") son
 * decoración no testeable y no deben generar supervivientes.
 */
export default function ServiceMockup({ index }: ServiceMockupProps) {
  switch (index) {
    case 1:
      return <ChatMockup />
    case 2:
      return <InstagramMockup />
    case 3:
      return <MapMockup />
    case 4:
      return <CalendarMockup />
    case 5:
      return <ErpMockup />
    default:
      return <BrowserMockup />
  }
}

/** 0 · Desarrollo web — ventana de navegador con maqueta de página. */
function BrowserMockup() {
  return (
    <div className={`${styles.frame} ${styles.browser}`} aria-hidden="true">
      <div className={styles.chrome}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.omnibox} />
      </div>
      <div className={styles.body}>
        <div className={styles.lines}>
          <span className={styles.lineStrong} />
          <span className={styles.line} />
          <span className={styles.lineShort} />
          <span className={styles.pill}>Reservar</span>
        </div>
        <div className={styles.thumb} />
      </div>
    </div>
  )
}

/** 1 · Chatbot WhatsApp — conversación con burbujas e indicador de escritura. */
function ChatMockup() {
  return (
    <div className={`${styles.frame} ${styles.chat}`} aria-hidden="true">
      <div className={styles.chatHead}>
        <span className={styles.chatAvatar}>c</span>
        <div>
          <div className={styles.chatName}>Cénit Bot</div>
          <div className={styles.chatStatus}>● en línea</div>
        </div>
      </div>
      <div className={styles.chatBody}>
        <div className={styles.bubbleIn}>¿Tenéis cita libre el jueves?</div>
        <div className={styles.bubbleOut}>¡Sí! Te he reservado a las 17:30 ✓</div>
        <div className={styles.typing}>
          <span className={styles.typeDot} />
          <span className={styles.typeDot} />
          <span className={styles.typeDot} />
        </div>
      </div>
    </div>
  )
}

/** 2 · Gestión de RRSS — publicación de Instagram con me gusta y comentarios. */
function InstagramMockup() {
  return (
    <div className={`${styles.frame} ${styles.ig}`} aria-hidden="true">
      <div className={styles.igHead}>
        <span className={styles.igAvatar} />
        <div className={styles.igMeta}>
          <div className={styles.igName}>cenitdigital</div>
          <div className={styles.igSub}>Las Rozas · hace 2 h</div>
        </div>
        <span className={styles.igDots}>···</span>
      </div>
      <div className={styles.igMedia}>
        <span className={styles.igWord}>cénit</span>
      </div>
      <div className={styles.igFoot}>
        <span className={styles.igStat}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--color-zenith)">
            <path d="M12 21s-7-4.6-9.3-8.2C1 10 2 6.5 5.2 6.5c2 0 3 1.3 3.8 2.5.8-1.2 1.8-2.5 3.8-2.5 3.2 0 4.2 3.5 2.5 6.3C19 16.4 12 21 12 21z" />
          </svg>
          248
        </span>
        <span className={styles.igStat}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-text-soft)"
            strokeWidth="2"
          >
            <path d="M21 11.5a8.4 8.4 0 0 1-11.6 7.8L3 21l1.7-6.4A8.4 8.4 0 1 1 21 11.5z" />
          </svg>
          32
        </span>
      </div>
    </div>
  )
}

/** 3 · SEO local — mapa con búsqueda, chincheta pulsante y posición #1. */
function MapMockup() {
  return (
    <div className={`${styles.frame} ${styles.map}`} aria-hidden="true">
      <svg className={styles.mapGrid} preserveAspectRatio="none" viewBox="0 0 200 125">
        <g stroke="var(--color-border)" strokeWidth="2.5" fill="none">
          <line x1="0" y1="44" x2="200" y2="34" />
          <line x1="0" y1="88" x2="200" y2="95" />
          <line x1="56" y1="0" x2="62" y2="125" />
          <line x1="132" y1="0" x2="140" y2="125" />
        </g>
      </svg>
      <div className={styles.mapSearch}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2.6"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
        <span>fisioterapeuta cerca de mí</span>
      </div>
      <div className={styles.mapPin}>
        <span className={styles.mapPulse} />
        <svg className={styles.mapPinIcon} width="32" height="32" viewBox="0 0 24 24" fill="var(--color-primary)">
          <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
          <circle cx="12" cy="9" r="2.6" fill="var(--color-on-primary)" />
        </svg>
      </div>
      <div className={styles.mapBadge}>
        <span className={styles.mapRank}>1</span>
        <span className={styles.mapZone}>en tu zona</span>
      </div>
    </div>
  )
}

/** 4 · Sistema de citas — calendario semanal con huecos reservados. */
function CalendarMockup() {
  const slots = [
    { id: 'a1', time: '' },
    { id: 'a2', time: '10:00' },
    { id: 'a3', time: '' },
    { id: 'a4', time: '17:30' },
    { id: 'a5', time: '' },
    { id: 'b1', time: '12:15' },
    { id: 'b2', time: '' },
    { id: 'b3', time: '' },
    { id: 'b4', time: '09:30' },
    { id: 'b5', time: '' },
  ]
  return (
    <div className={`${styles.frame} ${styles.cal}`} aria-hidden="true">
      <div className={styles.calHead}>
        <span className={styles.calMonth}>Octubre</span>
        <span className={styles.calLegend}>
          <span className={styles.calDot} />
          Reservado
        </span>
      </div>
      <div className={styles.calGrid}>
        {['L', 'M', 'X', 'J', 'V'].map((day) => (
          <span key={day} className={styles.calDay}>
            {day}
          </span>
        ))}
        {slots.map((slot) => (
          <span key={slot.id} className={slot.time ? styles.calSlotOn : styles.calSlot}>
            {slot.time}
          </span>
        ))}
      </div>
    </div>
  )
}

/** 5 · Conexión ERP — flujo animado entre "Tu web" y el ERP. */
function ErpMockup() {
  return (
    <div className={`${styles.frame} ${styles.erp}`} aria-hidden="true">
      <div className={styles.erpNode}>
        <div className={styles.erpIcon}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1.8"
          >
            <rect x="3" y="4" width="18" height="14" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
          </svg>
        </div>
        <div className={styles.erpLabel}>Tu web</div>
      </div>
      <div className={styles.erpWire}>
        <span className={styles.erpDot} />
      </div>
      <div className={styles.erpNode}>
        <div className={styles.erpIconPrimary}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-on-primary)"
            strokeWidth="1.8"
          >
            <ellipse cx="12" cy="6" rx="8" ry="3" />
            <path d="M4 6v12c0 1.6 3.6 3 8 3s8-1.4 8-3V6" />
          </svg>
        </div>
        <div className={styles.erpLabel}>ERP</div>
      </div>
    </div>
  )
}
