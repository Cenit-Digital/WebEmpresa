import { Head } from 'vite-react-ssg'
import Contacto from '../components/Contacto'
import Hero from '../components/Hero'
import Paquetes from '../components/Paquetes'
import Sectores from '../components/Sectores'
import Servicios from '../components/Servicios'
import { buildHomeTitle } from '../lib/seo'
import { SITE } from '../lib/site'

const HOME_URL = `${SITE.url}/`

// JSON-LD Organization (no LocalBusiness: no inventamos dirección ni teléfono).
// Se escapa "<" para que un cierre de </script> en los datos no pueda romper el
// documento (serialización segura, aunque hoy los datos sean estáticos).
const ORGANIZATION_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
}).replace(/</g, '\\u003c')

export default function Home() {
  const title = buildHomeTitle()

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={SITE.description} />
        <link rel="canonical" href={HOME_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE.name} />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={SITE.description} />
        <meta property="og:url" content={HOME_URL} />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{ORGANIZATION_LD}</script>
      </Head>
      <Hero />
      <Servicios />
      <Sectores />
      <Paquetes />
      <Contacto />
    </>
  )
}
