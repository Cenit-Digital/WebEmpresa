# TDD — nav (endurecimiento responsive de la cabecera móvil)

> Corrección de DOS defectos de regresión en la cabecera móvil de la feature
> `nav`. El contrato `features/nav.feature` NO cambia: sus 8 escenarios siguen
> siendo ciertos. Cambios **solo CSS**, aditivos, sin tocar la lógica de
> componentes ni el diseño de escritorio.

## Causa raíz (verificada en vivo por el lead — no re-investigada)

1. La conmutación móvil/escritorio la decide solo JS (`useIsMobile` →
   `useSyncExternalStore` con `getServerSnapshot()=false`). En SSG
   (`vite-react-ssg`) el prerender hornea la nav de escritorio
   (`nav[aria-label="Principal"]`, `.nav` de `HeaderNav.module.scss`) en el HTML
   estático. En móvil, antes de hidratar, esa nav se muestra y desborda
   horizontalmente sobre el hero. No había red CSS que lo tapara.
2. Con el menú móvil abierto, `.overlay` y `.panel` de `MobileMenu.module.scss`
   tenían `z-index:auto` (=0), pero la cabecera sticky (`.header` de
   `Header.module.scss`) tiene `z-index:50`. Por apilado CSS la cabecera pintaba
   por encima del panel, ocultando el título "Menú" y el botón ✕.

## Ciclos Rojo → Verde → Refactor

### Ciclo 1 — ocultar la nav de escritorio en móvil (red CSS prerender)

- **ROJO** — En `src/components/HeaderNav.test.tsx`, test `@s4`: lee
  `src/components/HeaderNav.module.scss` (`readFileSync` +
  `resolve(process.cwd(), …)`, mismo idioma que el test `@s3` de
  `Header.test.tsx`) y asevera que existe un bloque `@media (max-width: 767px)`
  con `.nav { display: none }`. Falló: 1 failed / 159 passed (no había `@media`).
- **VERDE** — Añadido al final de `src/components/HeaderNav.module.scss`:
  ```scss
  @media (max-width: 767px) {
    .nav {
      display: none;
    }
  }
  ```
  Breakpoint idéntico a `MOBILE_QUERY = '(max-width: 767px)'` de
  `src/lib/useIsMobile.ts`. Verde: 160 passed.
- **REFACTOR** — Sin cambios: test mínimo y directo, sin duplicación.

### Ciclo 2 — apilar el drawer por encima de la cabecera

- **ROJO** — En `src/components/MobileMenu.test.tsx`, test `@s5..@s8`: helper
  `zIndexOf(scssPath, selector)` que parsea el `z-index` numérico de un bloque
  `.selector { … }`. Lee `.header` de `Header.module.scss` (comprueba
  `=== 50`, para no ser tautológico) y `.overlay`/`.panel` de
  `MobileMenu.module.scss`, y asevera que ambos son numéricamente MAYORES que
  el de la cabecera. Falló: `expected NaN to be greater than 50` (overlay/panel
  sin `z-index`). `headerZ` parseó a 50 correctamente → comparación con sentido.
- **VERDE** — Añadido `z-index: 100;` a `.overlay` y a `.panel` en
  `src/components/MobileMenu.module.scss` (100 > 50), con comentario. Verde.
- **REFACTOR** — Sin cambios: helper `zIndexOf` ya extrae la duplicación de
  lectura/parseo; los tres asserts son legibles.

## Trazabilidad @s → test

- `@s4` (En móvil se oculta la nav de escritorio) → `HeaderNav.test.tsx`:
  `@s4 en móvil el CSS oculta la nav de escritorio también en el HTML estático
  (prerender SSG)` — refuerza el escenario en el HTML pre-hidratación, no solo
  en el estado post-hidratación (que ya cubría el `@s4` con `matchMedia`).
- `@s5..@s8` (panel móvil abierto y usable) → `MobileMenu.test.tsx`:
  `@s5..@s8 el overlay y el panel se apilan por encima de la cabecera sticky` —
  garantiza que el drawer no queda tapado por la cabecera sticky, condición
  necesaria para que título/✕/enlaces/fondo del panel sean interactuables.

## Ficheros tocados

- `src/components/HeaderNav.module.scss` (producción, aditivo: `@media`).
- `src/components/MobileMenu.module.scss` (producción, aditivo: `z-index`).
- `src/components/HeaderNav.test.tsx` (test nuevo `@s4`).
- `src/components/MobileMenu.test.tsx` (test nuevo `@s5..@s8`).

`stryker.config.json`: sin cambios — no se crearon ficheros `.ts/.tsx` nuevos;
Stryker no muta SCSS y `HeaderNav.tsx` / `MobileMenu.tsx` ya están en `mutate`.

## Verificación final

- `pnpm typecheck` → OK (0 errores).
- `pnpm lint` → OK (0 warnings).
- `pnpm test` → 21 files, **161 passed / 161** (0 fallos).

## Estado

Verde de punta a punta. Pendiente de `judge` + `mutation_tester` antes de
marcar la feature como `done` (no lo marco yo).
