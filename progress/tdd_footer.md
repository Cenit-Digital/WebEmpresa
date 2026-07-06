# TDD — footer (#4)

Contrato: `features/footer.feature` (@s1–@s4). Diseño: `docs/DESIGN_SYSTEM.md` §6

- footer del `design/Cenit Home (referencia).dc.html`.

`src/components/Footer.tsx` existía como scaffold (copyright + Aviso legal +
correo) y ya satisfacía @s1–@s4, pero **no** montaba la marca "Órbita" ni la
franja del diseño (§6). El trabajo de esta sesión: (1) cubrir el contrato con
tests co-locados que fijan @s1–@s4 y matan los mutantes de `Footer.tsx`, y
(2) un ciclo Rojo→Verde extra para la marca del pie exigida por §6.

## Ciclos Rojo → Verde → Refactor

### §6 — Marca "Órbita" en el pie (logo a 38px)

- ROJO: test que renderiza `<Footer/>` y exige un `svg` con `width/height=38`
  y el wordmark `cénit` visible. Falla: el scaffold no renderizaba logo
  (`container.querySelector('svg')` → `null`). Verificado con `pnpm test`.
- VERDE: se añade `<Logo size={38} />` (componente de la feature `marca`) como
  primer hijo del `.inner`. El `svg` del logo hereda `width=38`/`height=38` y el
  wordmark aporta el texto `cénit`. 5/5 verdes.
- REFACTOR (en verde): `Footer.module.scss` adaptado a §6 — `background:
var(--color-band)`, `border-top: 1px solid var(--color-band-border)`,
  `padding: 44px 0`; `.inner` con `padding: 0 var(--gutter)` y `gap`; texto y
  enlaces en `var(--color-text-soft)`, hover `var(--color-primary)`. Sin hex.
  El SCSS no está bajo test (jsdom no computa CSS Modules); es conformidad de
  diseño, ningún escenario lo afirma.

### @s1 — Copyright con el año actual

- ROJO: test que espera el texto
  `© <año actual dinámico> Cénit Digital. Todos los derechos reservados.`
  (año calculado en el test con `new Date().getFullYear()`, no un literal fijo).
- VERDE: `Footer.tsx` renderiza `© {year} {SITE.name}. …` con
  `year = new Date().getFullYear()` y `SITE.name === 'Cénit Digital'`.
- La aserción del texto completo mata la eliminación de `"© "` y de
  `". Todos los derechos reservados."`; el año dinámico impide acoplar a un año
  fijo. `new Date().getFullYear()` no genera mutantes en Stryker (sin mutator de
  literal numérico ni de `getFullYear`), así que no procede aislarlo en `src/lib`.

### @s2 — Enlace a Aviso legal

- ROJO: localiza el enlace por nombre "Aviso legal" dentro del `nav aria-label="Pie"`
  y exige `href="/aviso-legal"`.
- VERDE: `<Link to="/aviso-legal">Aviso legal</Link>` bajo `MemoryRouter`.

### @s3 — Enlace de contacto por correo

- ROJO: localiza el enlace por nombre `hola@cenitdigital.es` y exige
  `href="mailto:hola@cenitdigital.es"`.
- VERDE: `<a href="mailto:hola@cenitdigital.es">hola@cenitdigital.es</a>`.

### @s4 — Sin enlaces fuera de alcance

- ROJO: verifica que NO hay enlaces "Privacidad" ni "Cookies".
- VERDE: el pie no los renderiza (esas páginas no existen todavía).

## Trazabilidad @s → test

| Escenario  | Test (`src/components/Footer.test.tsx`)                                        |
| ---------- | ------------------------------------------------------------------------------ |
| §6 (marca) | `it('§6 muestra la marca "Órbita" (logo) a 38px en el pie')`                   |
| @s1        | `it('@s1 el copyright muestra "© " + año actual + "Cénit Digital"…')`          |
| @s2        | `it('@s2 el enlace "Aviso legal" apunta a /aviso-legal dentro del nav "Pie"')` |
| @s3        | `it('@s3 el enlace de correo apunta a mailto:hola@cenitdigital.es')`           |
| @s4        | `it('@s4 no existen enlaces "Privacidad" ni "Cookies"')`                       |

## Notas / decisiones

- **Logo:** la referencia envuelve el logo en `<a href="#top">`, pero (a) el
  encargo pide literalmente `<Logo size={38} />` y (b) no existe ancla `#top` en
  esta SPA. Se renderiza el `<Logo />` como marca (icono `aria-hidden`, wordmark
  `cénit digital` como texto accesible), sin enlace inventado.
- **Copyright:** el contrato @s1 pide _contener_ "© " + año + "Cénit Digital"; se
  conserva el texto del scaffold ("… Todos los derechos reservados."), que lo
  satisface. La coletilla "· Las Rozas, Madrid" de la maqueta no está en §6 ni en
  el contrato, no se añade.
- **Año:** determinista en el test (`new Date().getFullYear()`), no un literal.
  Sin mutantes que aislar → no se extrae a `src/lib` (no procede).
- **Stryker:** `Footer.tsx` ya está en `mutate`; no se añaden ficheros nuevos.
- **Colores:** solo `var(--color-…)` en `Footer.module.scss`; el logo usa sus
  propios tokens (no se recolorea).

## Verificación

- **Footer: verde y determinista.** `pnpm test src/components/Footer.test.tsx`
  → 5/5 (repetido varias veces, en aislamiento y junto a `Layout.test.tsx`).
- `pnpm typecheck` y `pnpm lint` → verdes, 0 warnings.
- **`pnpm verify` global: ROJO por tests AJENOS al footer.** Fallos flaky
  (no deterministas, dependen de carga y del orden entre ficheros) en
  `src/components/Layout.test.tsx` (@s2 skip-link focus) y
  `src/pages/home.test.tsx` (`<title>` undefined). Causa raíz: `Layout.test.tsx`
  hace `vi.mock('vite-react-ssg', … Head: () => null)` que contamina a
  `home.test.tsx` (que lee el `<title>` real). Ambos ficheros pasan en
  aislamiento y pertenecen a otras features en curso (`layout_accesibilidad`,
  home), fuera del alcance del footer y fuera de los ficheros que puedo tocar.
  El número de ficheros de test cambió entre corridas (12→13), señal de sesiones
  concurrentes escribiendo en el árbol. **No lo causa el footer.**
