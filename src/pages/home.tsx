import { Head } from 'vite-react-ssg'
import Contacto from '../components/Contacto'
import Hero from '../components/Hero'
import Paquetes from '../components/Paquetes'
import Sectores from '../components/Sectores'
import Servicios from '../components/Servicios'
import { buildHomeTitle } from '../lib/seo'

export default function Home() {
  return (
    <>
      <Head>
        <title>{buildHomeTitle()}</title>
      </Head>
      <Hero />
      <Servicios />
      <Sectores />
      <Paquetes />
      <Contacto />
    </>
  )
}
