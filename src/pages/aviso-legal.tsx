import { Head } from 'vite-react-ssg'
import { buildPageTitle } from '../lib/seo'
import { SITE } from '../lib/site'

export default function LegalNotice() {
  return (
    <article className="prose">
      <Head>
        <title>{buildPageTitle('Aviso legal')}</title>
        <meta name="description" content={`Aviso legal de ${SITE.name}.`} />
        <link rel="canonical" href={`${SITE.url}/aviso-legal`} />
        <meta property="og:url" content={`${SITE.url}/aviso-legal`} />
      </Head>
      <h1>Aviso legal</h1>
      <p>
        Este sitio web es titularidad de {SITE.name}. Página base pendiente de completar con la
        información legal definitiva (titular, NIF, domicilio social y condiciones de uso).
      </p>
    </article>
  )
}
