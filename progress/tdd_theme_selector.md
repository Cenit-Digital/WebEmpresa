# TDD — theme_selector (#3)

> Selector de tema 3 estados **Claro / Oscuro / Sistema**. Contrato:
> `features/theme_selector.feature` (@s1–@s8). Rama `feat/design-system`.
> Baseline: 35 tests verdes (feature `marca` cerrada).

## Modelo (del contrato)

- Persistencia en `localStorage['cenit-theme']` con valores SOLO `'light'`/`'dark'`.
- **Ausencia de la clave = modo "Sistema"** (sigue a `prefers-color-scheme`).
- `data-theme` en `<html>` es SIEMPRE el tema resuelto (`'light'`/`'dark'`),
  nunca `'system'`; en Sistema se resuelve con `matchMedia('(prefers-color-scheme: dark)')`.

## Arquitectura

- `src/lib/theme.ts` — lógica pura (testable + mutación break=100; el LEAD la
  añadirá al `mutate` de `stryker.config.json`): `systemPrefersDark()`, `getStoredMode()`
  (ausencia/valor inválido → `'system'`), `resolveTheme(mode, prefersDark)`,
  `applyTheme(theme)`, `applyInitialTheme()` (carga, @s1/@s2/@s7),
  `setMode(mode)` (persiste/borra + aplica, @s3/@s4/@s5), y
  `initialThemeAttribute(stored, prefersDark)` (réplica pura y endurecida del
  script anti-FOUC, @s8).
- `src/components/ThemeToggle.tsx` — `radiogroup` accesible de 3 opciones
  (Claro/Oscuro/Sistema, `aria-checked` en el modo activo). En `useEffect`
  aplica el tema resuelto y, solo mientras el modo es `'system'`, registra un
  listener de `matchMedia('change')` para reaccionar en vivo sin recargar (@s6);
  se limpia al cambiar de modo. Sin cambio de API (no recibe props): sigue
  integrado en el `Header` dentro de `<ClientOnly>`.
- `index.html` — script inline anti-FOUC (pre-existe de `infra_base`): lee
  `cenit-theme` y, si falta, `prefers-color-scheme`, y fija `data-theme` en
  `<html>` antes del `<script type="module">`. jsdom no ejecuta ese script en el
  primer render, así que @s8 se cubre por dos vías: la función pura
  `initialThemeAttribute` (todas las ramas) y un test que lee `index.html`
  (patrón `Header.test @s4`, `readFileSync`) verificando que el script fija
  `data-theme` ANTES del módulo de la app.

## Bitácora de ciclos (Rojo → Verde → Refactor)

> Nota de entorno: el repo vive en OneDrive y durante la sesión el sincronizador
> restauró artefactos de una iteración previa de ESTA misma feature (ficheros
> `theme.*`/`ThemeToggle.*` reapareciendo). Se descartaron variantes corruptas
> (una `theme.test.tsx` con un `</content>` colado) y se consolidó la
> implementación coherente, verificándola escenario a escenario contra el
> contrato y dejándola verde de punta a punta. Los ciclos R-V-R que rige el
> diseño resultante son:

- **@s1/@s2** — ROJO: `applyInitialTheme` con `matchMedia` mockeado (fake keyeado
  al literal de la query, anti-tautología) → sin clave, sistema oscuro/claro
  espera `data-theme` `dark`/`light`; falla (función inexistente). VERDE:
  `systemPrefersDark` + `applyTheme` + `resolveTheme('system', …)` compuestos en
  `applyInitialTheme`. REFACTOR: extraídas las funciones puras del `lib`.
- **@s7** — ROJO: `applyInitialTheme` con `cenit-theme='dark'` y sistema claro
  espera `dark` (la preferencia gana al SO); falla si sólo se mira `matchMedia`.
  VERDE: `getStoredMode` lee `localStorage` (ausencia/valor inválido → `'system'`)
  y `resolveTheme('dark', …)` devuelve `'dark'` ignorando el SO.
- **@s3/@s4** — ROJO: `setMode('light'|'dark')` debe persistir en `cenit-theme`
  y aplicar `data-theme`; falla (sin `setMode`). VERDE: `setMode` guarda y
  `applyTheme(resolveTheme(mode, systemPrefersDark()))`. UI: en
  `ThemeToggle.test` se pulsa el radio `Claro`/`Oscuro` y se comprueban
  `data-theme` + `localStorage` + `aria-checked`.
- **@s5** — ROJO: con `cenit-theme='dark'` y sistema claro, `setMode('system')`
  debe **borrar** la clave y dejar `data-theme='light'`; falla si `system`
  guardara valor. VERDE: rama `mode === 'system'` → `removeItem`, luego resuelve
  del SO. UI: pulsar el radio `Sistema`.
- **@s6** — ROJO: en modo Sistema (sin clave, SO claro), un cambio de
  `prefers-color-scheme` a oscuro debe pasar `data-theme` a `dark` sin recargar;
  falla sin listener. VERDE: `useEffect` registra `matchMedia('change')` solo en
  `'system'` y re-aplica el tema resuelto. 2.º test: fuera de Sistema NO hay
  listener (se limpia) y no reacciona al SO.
- **@s8** — ROJO: `initialThemeAttribute(stored, prefersDark)` (réplica pura del
  script inline) para `'dark'`/`'light'`/`null+SO`/valor inválido; falla sin la
  función. VERDE: valida `'light'`/`'dark'` y, si no, resuelve por el SO (nunca
  escribe basura). Regresión: test que lee `index.html` y exige que el script
  fije `data-theme` antes del `<script type="module">`.
- **REFACTOR** transversal: tipos `ResolvedTheme`/`ThemeMode`, `STORAGE_KEY` y
  literal de query centralizados; comentarios de intención; colores del selector
  solo vía `var(--color-…)`.

## Trazabilidad @s → test

| @s | Escenario | Test |
| --- | --- | --- |
| @s1 | Sin clave + sistema oscuro → `dark` | `src/lib/theme.test.tsx` › applyInitialTheme › `@s1` |
| @s2 | Sin clave + sistema claro → `light` | `src/lib/theme.test.tsx` › applyInitialTheme › `@s2` |
| @s3 | Elegir "Claro" fija y persiste | `src/components/ThemeToggle.test.tsx` › `@s3` (UI) · `src/lib/theme.test.tsx` › setMode › `@s3` (lógica) |
| @s4 | Elegir "Oscuro" fija y persiste | `src/components/ThemeToggle.test.tsx` › `@s4` (UI) · `src/lib/theme.test.tsx` › setMode › `@s4` (lógica) |
| @s5 | Elegir "Sistema" borra la clave y sigue al SO | `src/components/ThemeToggle.test.tsx` › `@s5` (UI) · `src/lib/theme.test.tsx` › setMode › `@s5` (lógica) |
| @s6 | Sistema reacciona en vivo sin recargar | `src/components/ThemeToggle.test.tsx` › `@s6` (reacciona) + `@s6` (limpia listener fuera de Sistema) |
| @s7 | La preferencia sobrevive a la recarga | `src/lib/theme.test.tsx` › applyInitialTheme › `@s7` · `src/components/ThemeToggle.test.tsx` › `@s7` (aria-checked) |
| @s8 | Tema aplicado antes del primer pintado (anti-FOUC) | `src/lib/theme.test.tsx` › initialThemeAttribute (5 casos puros) + test que lee `index.html` (script antes de `type="module"`) |

## Estado

- Suite completa **verde**: 10 ficheros, **67 tests** (27 en `theme.test.tsx`, 8
  en `ThemeToggle.test.tsx`). typecheck ✅ · lint 0 warnings ✅ · `pnpm build` ✅.
- **Mutación `src/lib/theme.ts` = 100.00%** verificada con
  `npx stryker run --mutate src/lib/theme.ts` (47 killed + 2 timeout, 0
  survived, 0 no-cover). NO se editó `stryker.config.json`: el LEAD añade
  `src/lib/theme.ts` (+ `ThemeToggle.tsx`) al `mutate` al cerrar la feature.
- `index.html`: script anti-FOUC endurecido para espejar `initialThemeAttribute`
  (solo acepta `'light'`/`'dark'`; cualquier otro valor o ausencia = Sistema).
- Orphan `src/lib/theme.test.ts` (sesión previa, importaba `applyActiveTheme`
  inexistente) **eliminado**.
- Colores del selector solo vía `var(--color-…)`; foco visible con
  `outline: 2px solid var(--color-primary)`.
- NO marcado `done`: pendiente de `judge` + `mutation_tester`.
