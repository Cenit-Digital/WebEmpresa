# TDD — hero (#6)

Rama `feat/design-system`. Contrato: `features/hero.feature` (@s1–@s6).
Diseño: `docs/DESIGN_SYSTEM.md` §4/§5/§6 + `design/Cenit Home (referencia) - standalone.html`.

## Trazabilidad @s → test

| Escenario          | Test (`src/components/Hero.test.tsx`)                          |
| ------------------ | -------------------------------------------------------------- |
| @s1 eyebrow        | "@s1 muestra el eyebrow de contexto"                           |
| @s2 H1             | "@s2 muestra el titular principal como H1 con el texto exacto" |
| @s3 subtítulo      | "@s3 muestra el subtítulo con la propuesta de valor"           |
| @s4 CTA primario   | "@s4 el CTA primario apunta a #paquetes"                       |
| @s5 CTA secundario | "@s5 el CTA secundario apunta a #contacto"                     |
| @s6 estadísticas   | "@s6 muestra las cuatro parejas valor/etiqueta"                |

## Bitácora de ciclos

- **@s1 eyebrow** — ROJO: `Hero.test.tsx` no importa (`Hero` inexistente).
  VERDE: `Hero.tsx` con `<section>`/`<div.inner>` + `<p.eyebrow>`
  "Soluciones digitales para pymes". `Hero.module.scss` (`.hero`, `.inner`,
  `.eyebrow`) con tokens `--maxw`/`--gutter`/`--color-accent`.
- **@s2 H1** — ROJO: no hay heading nivel 1. VERDE: `<h1.title>` con texto
  exacto (assert `textContent` === cadena completa para matar mutantes).
  Estilo `.title` Outfit 600 `clamp(34px,5.4vw,62px)` / lh 1.04 / -0.015em.
- **@s3 subtítulo** — ROJO: no existe el párrafo. VERDE: `<p.lead>` con texto
  fiel del diseño que contiene "todo bajo una cuota mensual, sin entrada".
- **@s4 + @s5 CTAs** — ROJO: sin enlaces "Ver paquetes"/"Hablar con nosotros".
  VERDE: `<div.actions>` con `<a href="#paquetes">` (primario) y
  `<a href="#contacto">` (secundario). Estilos botón §6 con `--radius-pill`.
- **@s6 estadísticas** — ROJO: sin fila de stats. VERDE: array `STATS` mapeado
  a 4 `<div.stat>` con valor/etiqueta; test verifica que valor y etiqueta
  comparten `parentElement` (misma tarjeta). Estilos `.stats`/`.statValue`/
  `.statLabel`.
- **Composición** — `home.tsx` sustituye el `<section.hero>` placeholder por
  `<Hero/>`; sección `servicios` placeholder intacta. Eliminados los estilos
  hero muertos de `home.module.scss` (refactor en verde; también retirado el
  único `#fff` que quedaba allí).

## Verificación final

- Suite: **82 tests** verdes (76 baseline + 6 nuevos), 15 files.
- `pnpm typecheck` OK · `pnpm lint` 0 warnings · `pnpm build` (SSG) OK
  (hero prerenderizado en `dist/index.html`).
- `Hero.module.scss`: **0 hex**, colores solo vía `var(--color-…)`.
- `Hero.tsx` ya en `stryker.config.json` (no editado). Pendiente `judge` +
  `mutation_tester` antes de marcar `done`.
