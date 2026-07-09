# TDD — nav (BUGFIX/HARDENING: cabecera responsive por CSS puro)

> Corrección del bug de hidratación SSG de la feature `nav` (id 2). El contrato
> observable de `features/nav.feature` (@s1–@s8) se PRESERVA. Se endurecen dos
> garantías (@s9/@s10 de `progress/current.md`): toggle responsive por `@media`
> y guard anti-desbordamiento horizontal. Fuente de verdad: `progress/current.md`.

## Causa raíz (confirmada en navegador por craftsman_lead — no re-investigada)

La cabecera ramificaba el render por JS (`useIsMobile` → `window.matchMedia` +
`useSyncExternalStore`, `getServerSnapshot()=false`), pintando la nav de
escritorio O la barra móvil de forma mutuamente excluyente. En SSG el prerender
hornea la nav de escritorio; hasta que la hidratación corrige, el árbol queda
"pegado" a escritorio → en móvil desaparece la hamburguesa y la página desborda.
Fix: render de AMBOS clústeres + visibilidad por `@media` (sin JS) + guard
`overflow-x: clip` en `html`.

## Ciclos Rojo → Verde → Refactor

### Ciclo A — guard anti-desbordamiento horizontal (@s10)

- **ROJO** — Nuevo `src/styles/overflow-guard.test.ts` (CSS-como-texto): el
  bloque `#root` de `_reset.scss` contiene `overflow-x: clip`, y NO contiene
  `overflow-x: hidden` ni en `html`, ni en `body`, ni en `#root`. Falló: no
  existía el bloque `#root`.
- **VERDE** — Añadido un bloque `#root { overflow-x: clip; }` al final de
  `src/styles/_reset.scss` con comentario (clip recorta la X sin crear scroll
  container → preserva `position: sticky` del header; W3C css-overflow-3).
- **REFACTOR** — `ruleBody` escapa `.`/`#` del selector para tratarlos como
  literales en la RegExp (robusto para `#root`).
- **Corrección empírica FINAL (coordinator, verificado en Chrome 390/1280px con
  addStyleTag + valor computado):** el guard vive en `#root` (punto de montaje
  `<div id="root">` de index.html), NO en `html`/`body`. En `html`/`body` el
  overflow se propaga al viewport → `clip` no frena el scroll (scrollX≠0 con hijo
  de 3000px). `#root` es un div normal que sí recorta su contenido y preserva el
  sticky + scroll vertical. (`#root { overflow-x: hidden }` recorta pero rompe el
  sticky → descartado.) Iteración: `html` → `body` → `#root`.

### Ciclo B — cabecera responsive 100% por CSS (@s2/@s4/@s6)

- **ROJO** — Reescrito `src/components/HeaderNav.test.tsx` al contrato
  CSS-driven: ambos clústeres SIEMPRE presentes; `@s2` los 4 enlaces + Hablamos
  dentro de `nav`; `@s6` orden enlaces → TEMA → Hablamos con `within(nav)` (hay
  dos botones de tema, uno por clúster); `@s4` botón "Menú" siempre presente +
  CSS-como-texto (base: `.nav` visible / `.mobile` oculto; `@media ≤767px`:
  invertido); anti-regresión: dos botones de tema y el móvil junto a "Menú".
  Mock por defecto de `matchMedia` en `beforeEach` (ThemeToggle lo usa en Effect).
  Falló: la impl ramificaba por `matchMedia` (un solo clúster, sin "Menú" en
  escritorio, `.mobile` base a `display:flex`).
- **VERDE** — Reescrito `src/components/HeaderNav.tsx` sin `useIsMobile`: devuelve
  `<div .cluster>` con `<nav .nav>` (enlaces + ClientOnly ThemeToggle + `.cta`
  Hablamos) y `<div .mobile>` (ClientOnly ThemeToggle + MobileMenu). Reescrito
  `HeaderNav.module.scss`: `.mobile` base a `display:none`; `@media (max-width:
  767px)` invierte (`.nav{display:none}` — validado por @s4 — y `.mobile{display:
  flex}`). Verde.
- **REFACTOR** — Sin cambios: componente sin ramas ni duplicación; SCSS mínimo.

### Ciclo C — el clúster envuelve la nav (Header @s5)

- **ROJO** — Actualizado `@s5` de `src/components/Header.test.tsx`: `inner`
  sigue con 2 hijos (marca + clúster), pero ahora `children[1]` es el clúster y
  la `nav` vive DENTRO de él (`cluster.contains(nav)`); el tema (escritorio)
  dentro de `nav`. Falló hasta que HeaderNav devolvió el `.cluster` envolvente.
- **VERDE** — Cubierto por el Ciclo B (Header.tsx no cambia). Verde.
- **REFACTOR** — Sin cambios.

### Limpieza de código muerto

- Borrados `src/lib/useIsMobile.ts` y `src/lib/useIsMobile.test.tsx` (solo los
  usaba HeaderNav; ningún otro import los referencia).
- `stryker.config.json`: retirada la línea `src/lib/useIsMobile.ts` del `mutate`
  (fichero inexistente tras el borrado; Stryker fallaría al mutarlo).

## Trazabilidad @s → test

- `@s2` (enlaces + CTA) → HeaderNav.test `@s2 la nav de escritorio muestra los 4
  enlaces en orden y el CTA "Hablamos" → #contacto`.
- `@s4` (móvil oculta nav + hamburguesa) → HeaderNav.test `@s4 la barra móvil
  expone el botón "Menú"` y `@s4 el CSS invierte la visibilidad en ≤767px` +
  anti-regresión `el botón de tema sigue junto a "Menú"`.
- `@s5` (grupos de la cabecera) → Header.test `@s5 la cabecera tiene dos grupos
  … la nav vive dentro del clúster`.
- `@s6` (orden del clúster) → HeaderNav.test `@s6 la nav ordena: enlaces → tema →
  "Hablamos"`.
- `@s10` (guard global) → overflow-guard.test `@s10 #root usa overflow-x: clip` y
  `@s10 NO reintroduce overflow-x: hidden en html, body ni #root`.

## Ficheros tocados

- `src/components/HeaderNav.tsx` (reescrito: sin `useIsMobile`, dos clústeres).
- `src/components/HeaderNav.module.scss` (reescrito: `.cluster`/`.mobile` base
  oculto; `@media` invierte visibilidad).
- `src/styles/_reset.scss` (aditivo: `overflow-x: clip` en `html`).
- `src/components/HeaderNav.test.tsx` (reescrito al contrato CSS-driven).
- `src/components/Header.test.tsx` (actualizado `@s5`).
- `src/styles/overflow-guard.test.ts` (nuevo).
- `src/lib/useIsMobile.ts` y `src/lib/useIsMobile.test.tsx` (borrados).
- `stryker.config.json` (retirado el `mutate` del fichero borrado).

## Verificación

- `pnpm typecheck` → OK (0 errores). `pnpm lint` → OK (0 warnings).
- `pnpm test` → 22 files, **175 passed / 175** (0 fallos).

## Estado

Verde de punta a punta. Pendiente de `judge` + `mutation_tester` antes de marcar
la feature como `done` (no lo marco yo).
