# TDD — meta SEO por ruta (acabado, aditivo)

> Metadatos SEO en el `<Head>` (vite-react-ssg / react-helmet-async) de las
> páginas. Aditivo: no rompe los `<title>` existentes. Solo datos reales de
> `src/lib/site.ts`. Rama `feat/design-system`.

## Alcance

- `src/pages/home.tsx` `<Head>`: meta description, `link rel="canonical"` a
  `SITE.url + '/'`, Open Graph (`og:type=website`, `og:site_name`, `og:locale=es_ES`,
  `og:title` = título de la home, `og:description`, `og:url` = `SITE.url + '/'`),
  `twitter:card=summary`, y JSON-LD `Organization` (NO LocalBusiness: sin dirección
  ni teléfono inventados). El `<title>` original (`buildHomeTitle()`) intacto.
- `src/pages/aviso-legal.tsx` `<Head>`: description propia corta
  (`Aviso legal de Cénit Digital.`), canonical y og:url propios de la ruta
  (`SITE.url + '/aviso-legal'`). No hereda los de la home.
- Sin `og:image` (no hay asset — omitido a propósito).

## Serialización segura del JSON-LD

`JSON.stringify({...}).replace(/</g, '\\u003c')` para que un `</script>` en los
datos no pueda cerrar el script (hoy los datos son estáticos, defensa por diseño).

## Ciclos Rojo→Verde

Tests en los ficheros de página existentes (mock de `Head` como passthrough).
React 19 iza `<meta>`/`<link>`/`<title>` a `document.head`, así que se asertan
con `document.querySelector` (no `container`).

- ROJO/VERDE `home.test.tsx`: meta description = `SITE.description`; canonical y
  og:url = `https://www.cenitdigital.es/`; OG (type/site_name/locale/title/description)
  y twitter:card; JSON-LD `Organization` parseado con `JSON.parse` = objeto exacto.
- ROJO/VERDE `aviso-legal.test.tsx`: description propia, canonical y og:url de la
  ruta `/aviso-legal` (distintos de la home).

## Trazabilidad @s → test

Tarea de acabado sin `.feature` propio (extiende la cobertura SEO de
`layout_accesibilidad` @s3/@s4, que ya fijaban los `<title>`). Los nuevos tests
viven junto a esos, en `src/pages/home.test.tsx` y `src/pages/aviso-legal.test.tsx`.

## Nota — defaults en Layout

`src/components/Layout.tsx` ya tenía un `<Head>` base (description, og:title=nombre,
og:description, og:type, og:url=`SITE.url`). Las páginas lo sobrescriben por clave
(react-helmet): la home aporta canonical, título completo en og:title, `SITE.url + '/'`,
locale, site_name, twitter y JSON-LD; aviso-legal aporta su description/canonical/og:url
de ruta. Los og:title/description/type genéricos que muestra aviso-legal son los
**defaults de sitio del Layout**, no fuga de la home.

## Verificación en `dist` (SSG)

- `dist/index.html`: `<title>` exacto sin cambios, meta description, canonical `/`,
  6 OG, twitter:card, y `<script type="application/ld+json">` con el `Organization`.
- `dist/aviso-legal/index.html`: description propia, canonical y og:url `/aviso-legal`
  (distintos de la home). `<title>` exacto sin cambios.
- `pnpm verify` (typecheck · lint 0 warnings · 147 tests) VERDE. `pnpm build` VERDE.
  `prettier --check` limpio.
