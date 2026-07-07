import type { MouseEvent } from 'react'
import { Head } from 'vite-react-ssg'
import { Outlet } from 'react-router-dom'
import { SITE } from '../lib/site'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  function focusContent(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    document.getElementById('contenido')?.focus()
  }

  return (
    <>
      <Head>
        <html lang="es" />
        <meta name="description" content={SITE.description} />
        <meta property="og:title" content={SITE.name} />
        <meta property="og:description" content={SITE.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE.url} />
      </Head>
      <a className="skip-link" href="#contenido" onClick={focusContent}>
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
