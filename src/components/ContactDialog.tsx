import { Dialog } from 'radix-ui'
import styles from './ContactDialog.module.scss'

export default function ContactDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className={styles.trigger}>Contacto</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>Hablemos</Dialog.Title>
          <Dialog.Description className={styles.description}>
            Cuéntanos tu proyecto y te respondemos en menos de 24&nbsp;h.
          </Dialog.Description>
          <a className={styles.cta} href="mailto:hola@cenitdigital.es">
            hola@cenitdigital.es
          </a>
          <Dialog.Close className={styles.close} aria-label="Cerrar">
            ×
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
