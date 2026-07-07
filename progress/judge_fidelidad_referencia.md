# Veredicto del Judge — fidelidad_referencia (#13)

**Estado:** APPROVED
**Rama:** feat/design-system
**Contrato:** `features/fidelidad_referencia.feature` (@s1–@s9) + parche de
presentación en `features/theme_selector.feature` (@s3–@s5, modelo de ciclo).
**Fuente de verdad:** `project-spec.md` §#13 (C1–C5 + verbatim de la referencia).
**Fecha:** 2026-07-07

## Verificación del arnés (`./init.sh`)

Verde de punta a punta, exit 0:

- typecheck: sin errores.
- lint: 0 warnings (`eslint .` sin salida, exit 0).
- test: **158 passed**.
- Estado coherente: única feature en `in_progress` (#13); el resto `done`.

## 1 · Cobertura del contrato (cada @s tiene test que MUERDE)

`features/fidelidad_referencia.feature`:

- **@s1** botón único (no radiogroup/radio) → `ThemeToggle.test.tsx:53`.
  Afirma `getAllByRole('button')` length 1 + ausencia de `radiogroup`/`radio`. Muerde.
- **@s2** cada activación cicla light→dark→system→light → `ThemeToggle.test.tsx:114`.
  Tres clics, nombre accesible avanza Claro→Oscuro→Sistema→Claro. Muerde.
- **@s3** icono por modo (sol/luna/monitor) → `ThemeToggle.test.tsx:80`.
  Afirma `data-icon` exacto + recuento de formas (circle/line/path/rect) por modo. Muerde.
- **@s4** nombre accesible con el modo → `ThemeToggle.test.tsx:62`.
  `toHaveAccessibleName('Cambiar tema (actual: Claro/Oscuro/Sistema)')` exacto. Muerde.
- **@s5** cabecera 2 grupos, tema en el clúster → `Header.test.tsx:36`.
  `inner.children` length 2, hijo[0]=`<a href="/">`, hijo[1]=nav, botón de tema `within(nav)`. Muerde.
- **@s6** orden del clúster (enlaces→tema→Hablamos) → `HeaderNav.test.tsx:42`.
  `[Servicios, Sectores, Paquetes, Contacto, TEMA, Hablamos]` exacto. Muerde.
- **@s7** arco = primer hijo, aria-hidden, no enfocable → `Hero.test.tsx:8`.
  `firstElementChild` con `data-hero-arc`, `aria-hidden="true"`, `tabIndex === -1`. Muerde.
- **@s8** SVG: círculo+onda+punto → `Hero.test.tsx:19`.
  2 `circle` + 1 `path` + `path[stroke] === "var(--color-accent)"`. Muerde.
- **@s9** `.hero` overflow:hidden → `Hero.test.tsx:32`.
  Regex acotado a la regla `.hero` (`\.hero\s*\{[^}]*overflow:\s*hidden[^}]*\}`). Muerde.

El mapa `@s → test` de `progress/tdd_fidelidad_referencia.md:107` coincide con los
tests reales.

`features/theme_selector.feature` (parche → modelo de ciclo, verificado por diff):

- Solo el paso `When` de @s3/@s4/@s5 se re-redactó ("elijo la opción X" →
  "avanzo el ciclo… hasta que el modo activo es X"); los `Then` (data-theme +
  persistencia) NO cambian. Cubiertos por `ThemeToggle.test.tsx:132/142/154`
  (integración vía ciclo) + `theme.test.tsx:161/168/175` (`setMode` puro).
- **@s1,@s2,@s6,@s7,@s8 intactos** (comportamiento data-theme / persistencia /
  reacción en vivo / anti-FOUC): `theme.test.tsx` applyInitialTheme @s1/@s2/@s7,
  `initialThemeAttribute` @s8, `ThemeToggle.test.tsx:174/186` reacción+limpieza.

## 2 · No-regresión (crítico) — PRESERVADO

- **WEB-4 de 3 estados:** `git diff src/lib/theme.ts` = **solo aditivo**
  (`MODE_CYCLE` + `nextMode` puro, `theme.ts:63-76`); ninguna función existente
  (`getStoredMode`, `resolveTheme`, `setMode`, `applyInitialTheme`,
  `initialThemeAttribute`) cambia comportamiento.
- **Reacción en vivo + limpieza del listener:** `ThemeToggle.tsx:95-104`
  conserva el `useEffect` (aplica tema; listener solo en `system`; cleanup al
  cambiar de modo). El truco `DARK_QUERY` (`ThemeToggle.test.tsx:16`) mantiene la
  mutación del literal de la query y de la limpieza.
- **Anti-FOUC intacto:** `index.html` **no** figura en el working-tree de esta
  feature (no tocado); `applyInitialTheme`/`initialThemeAttribute` sin cambios.
  El test de orden del script inline sigue verde (`theme.test.tsx:222`).
- **Visibilidad del tema en MÓVIL preservada:** `HeaderNav.tsx:18-25` (rama móvil
  con `<ClientOnly>ThemeToggle</ClientOnly>` + `MobileMenu`); anti-regresión en
  `HeaderNav.test.tsx:72`. No se regresó a la ocultación de la referencia.
- **`nav.ts` intacto** (no modificado): NAV_LINKS + CTA "Hablamos".

## 3 · Fidelidad a la referencia (sin invención)

- **Iconos SVG verbatim** (`ThemeToggle.tsx`): luna (`:45`, path idéntico), sol
  (`:60-68`, circle r5 + 8 líneas), monitor Feather (`:82-84`, rect + 2 líneas =
  única adición aprobada, Decisión A). viewBox 0 0 24 24, 16×16,
  stroke=currentColor, strokeWidth 2. Coincide con `project-spec.md:362-380`.
- **Medidas del botón** (`ThemeToggle.module.scss:1-12`): 38×38, `border: 1px
  solid var(--color-band-border)`, `border-radius: 10px`, `background:
  transparent`, `color: var(--color-text)`. Verbatim de la referencia.
- **Arco** (`Hero.tsx:13-33` + `Hero.module.scss:1-24`): `data-hero-arc`
  primer hijo, `aria-hidden="true"`, `pointer-events:none`; circle r30
  strokeOpacity .5 + path onda `M15 46 C25 26…` + punto r3; `right:-120px
  top:-80px 540×540 opacity .45`; `@media (max-width:820px)` → opacity .1,
  right -160, top -130. Verbatim de `project-spec.md:386-396`.
- **Cabecera:** `Header.module.scss:16` MANTIENE `justify-content: space-between`;
  la corrección es estructural — `Header.tsx` deja **2** hijos (brand +
  `HeaderNav`), no 3. `ThemeToggle` reubicado dentro del clúster.
- **Colores solo vía `var(--color-…)`:** verificado en los cuatro SCSS y en los
  `stroke`/`fill` del SVG del arco. Sin hex sueltos.

## 4 · Calidad (lente de artesano)

- `ThemeToggle` sigue **client-only** al reubicarse: `<ClientOnly>` en las dos
  ramas de `HeaderNav.tsx:21,34`.
- Sin `console.log`, sin `any` injustificado (los `as unknown as` viven solo en
  el mock de `matchMedia` de los tests). Imports ordenados, un componente por
  archivo, SCSS Modules, funciones cortas, nombres reveladores
  (`MODE_CYCLE`/`MODE_LABEL`/`MODE_ICON`, sin números mágicos).
- Respeta `docs/architecture.md`: la lógica de ciclo es pura y vive en `lib/`
  (`nextMode`); los componentes consumen tokens.

## 5 · Checkpoints (`CHECKPOINTS.md`)

- **C1** El arnés está completo — [x] `./init.sh` exit 0.
- **C2** El estado es coherente — [x] una sola feature `in_progress`.
- **C3** El código respeta la arquitectura — [x] módulos previstos, sin `any`
  injustificado, sin `console.log`/TODO.
- **C4** La verificación es real — [x] cada módulo con lógica tiene test;
  158 tests verdes; typecheck + lint sin warnings.
- **C6** Contrato Gherkin — [x] `.feature` + sección en `project-spec.md`; cada
  `Then` medible; cada @s cubierto; sin producción que ningún test rojo pidiera.
- **C5** Cierre de sesión — [ ] (remit del cierre, no del review; la feature
  queda correctamente en `in_progress`).
- **C7** Prueba de mutación — [ ] **pendiente del `mutation_tester`** (puerta
  separada; no la evalúa el judge). La bitácora reporta 100% scoped, a confirmar.

## Veredicto

**APPROVED.** El delta de fidelidad (icono de tema que cicla, cabecera a 2
grupos, arco del hero) reproduce la referencia verbatim sin regresar ninguna
función de WEB-4; el contrato @s1–@s9 y el parche @s3–@s5 de `theme_selector`
están cubiertos por tests que muerden; `./init.sh` verde (typecheck 0 · lint 0
warnings · 158 tests). Queda pendiente la puerta de mutación (`mutation_tester`)
antes de marcar `done`.
