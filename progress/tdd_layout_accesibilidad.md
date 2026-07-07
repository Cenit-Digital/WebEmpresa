# TDD — layout_accesibilidad (#5)

Rama: `feat/design-system`. Baseline: 68 tests verdes.
Contrato: `features/layout_accesibilidad.feature` (@s1–@s4).

## Bitácora de ciclos

### @s1 — El primer elemento enfocable es "Saltar al contenido"

- **ROJO**: `src/components/Layout.test.tsx` renderiza `<Layout/>` en `MemoryRouter`,
  pulsa `Tab` una vez y espera que `document.activeElement` sea el enlace
  "Saltar al contenido". Fallo inicial de infraestructura: `<Head>` de
  vite-react-ssg exige contexto de react-helmet-async y el `Header` interior usa
  `window.matchMedia`.
- **VERDE**: sin cambios de producción — el skip-link ya era el primer elemento
  del DOM. Test hecho ejecutable neutralizando `Head` (`vi.mock` con
  `importOriginal`, dejando `ClientOnly` real) y con stub de `matchMedia`
  (patrón idéntico a `Header.test.tsx`). Escenario ya conforme: queda como
  cerrojo de regresión.

### @s2 — El enlace de salto mueve el foco a #contenido

- **ROJO**: test que enfoca el skip-link, pulsa `Enter` y espera que
  `document.activeElement` sea `#contenido`. Falla: el foco permanecía en el
  `<a>` (jsdom no mueve el foco por navegación de fragmento).
- **VERDE**: en `Layout.tsx`, `<main id="contenido" tabIndex={-1}>` (destino
  enfocable) + handler `onClick` que hace `preventDefault()` y
  `document.getElementById('contenido')?.focus()`. Solución accesible correcta.
- **REFACTOR**: handler extraído como `focusContent` con tipo `MouseEvent<HTMLAnchorElement>`.

### @s2 (mutación) — el `?.` defensivo debe estar cubierto

- **Contexto**: `judge` APROBADO, pero mutación de `Layout.tsx` al 80%; 1
  superviviente en `Layout.tsx:11:5` (OptionalChaining): el mutante convierte
  `document.getElementById('contenido')?.focus()` en `...('contenido').focus()`.
- **ROJO (frente al mutante)**: nuevo test que renderiza el Layout, renombra el
  id de `#contenido` (sin desmontar el nodo, para no corromper el árbol de React)
  de modo que `getElementById('contenido')` devuelva `null`, activa el skip-link
  y comprueba que NO se dispara el evento `error` de `window`. React no propaga
  la excepción del handler de forma síncrona (la reporta como evento `error`),
  por eso se escucha ese evento en lugar de `expect().not.toThrow()`.
- **VERDE**: sin cambios de producción (el `?.` es correcto). Verificado:
  - código actual → 3/3 verdes, 0 errores.
  - con el mutante (`?.` eliminado) → el test @s2-defensivo FALLA con
    `AssertionError` limpia (`onError` llamado 1 vez) → **mutante muerto**.

### @s3 — La home lleva su propio título

- **ROJO (lógica)**: `src/lib/seo.test.ts` importa `buildHomeTitle` inexistente
  → no compila (falla). Dos asserts: literal exacto y composición
  `${SITE.name} — ${SITE.tagline}`.
- **VERDE (lógica)**: `SITE.tagline = 'Soluciones digitales para pymes'` en
  `site.ts`; `buildHomeTitle()` en `seo.ts` = `${SITE.name} — ${SITE.tagline}`
  (orden nombre — tagline, inverso al de páginas interiores).
- **ROJO (página)**: `src/pages/home.test.tsx` renderiza `<Home/>` (con `Head`
  mockeado como passthrough; React 19 iza `<title>` a `document.title`) y espera
  el título exacto. Falla: `document.title` era "Cénit Digital".
- **VERDE (página)**: `home.tsx` pasa de `buildPageTitle()` a `buildHomeTitle()`.

### @s4 — Las páginas interiores llevan su propio título

- **VERDE (lock)**: `src/pages/aviso-legal.test.tsx` renderiza `<LegalNotice/>`
  y fija `document.title === "Aviso legal — Cénit Digital"`. Ya conforme
  (`buildPageTitle('Aviso legal')`): cerrojo de regresión. String exacto también
  cubierto vía `buildPageTitle` en `seo.test.ts`.

## Trazabilidad @s → test

| Escenario | Test                                                                                                                                                                                                |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @s1       | `src/components/Layout.test.tsx` › `@s1 el primer elemento enfocable...`                                                                                                                            |
| @s2       | `src/components/Layout.test.tsx` › `@s2 activar el enlace de salto...` + `@s2 activar el enlace no lanza si #contenido no existe (?. defensivo)` (mata el mutante `Layout.tsx:11` OptionalChaining) |
| @s3       | `src/lib/seo.test.ts` › `buildHomeTitle` (x2) + `src/pages/home.test.tsx` › `@s3 el <title>...`                                                                                                     |
| @s4       | `src/pages/aviso-legal.test.tsx` › `@s4 el <title>...`                                                                                                                                              |

## Ficheros

- Nuevos: `src/components/Layout.test.tsx`, `src/pages/home.test.tsx`,
  `src/pages/aviso-legal.test.tsx`.
- Modificados (test): `src/lib/seo.test.ts`.
- Modificados (producción): `src/components/Layout.tsx` (foco skip-link),
  `src/lib/site.ts` (`tagline`), `src/lib/seo.ts` (`buildHomeTitle`),
  `src/pages/home.tsx` (usa `buildHomeTitle`).

## Verificación final

- `pnpm typecheck`: verde.
- `pnpm lint`: 0 warnings.
- `pnpm test`: 76 tests verdes (14 ficheros). Incluye el test que mata al
  superviviente de `Layout.tsx:11` (OptionalChaining).
- `pnpm build` (SSG): verde. Títulos prerenderizados confirmados por grep:
  - `dist/index.html` → `Cénit Digital — Soluciones digitales para pymes`
  - `dist/aviso-legal/index.html` → `Aviso legal — Cénit Digital`
- `seo.ts` (en `stryker.config.json`, break=100): `buildHomeTitle` cubierto al
  100% con literal exacto + composición. No se editó `stryker.config.json`.

Estado: verde de punta a punta. Pendiente de `judge` + `mutation_tester`.
No se marca `done`.
