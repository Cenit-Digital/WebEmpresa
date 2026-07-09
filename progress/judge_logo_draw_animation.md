# Veredicto del Juez — #14 · logo_draw_animation

**Fecha:** 2026-07-09
**Feature:** #14 · logo_draw_animation (Animación de dibujado del logo Órbita — nav + hero)
**Contrato:** `features/logo_draw_animation.feature` (@s1..@s18, APROBADO por el humano)
**Fuente de verdad:** `design/logo-draw-animation/README.md` + `CenitLanding.dc.html` (keyframes verbatim); síntesis en `project-spec.md` #14.

## VEREDICTO: APROBADO

`./init.sh` en verde (typecheck 0 · lint 0 warnings · 180 tests passed, 22 files).
Los 18 escenarios tienen test significativo; fidelidad al handoff correcta; R1
respetado; accesibilidad, no-regresión y "sin tokens nuevos" cumplidos.

---

## 1. Fidelidad al handoff (keyframes verbatim)

Cotejados los 8 `@keyframes` de `_logo-draw.scss` (11-19) contra
`CenitLanding.dc.html` (19-26) y `project-spec.md` CO2 (549-556):

- **Porcentajes y valores: coinciden todos.** logoCycleOpacity, heroCycleOpacity,
  ringLoop, waveLoop, dotOutlineLoop, dotFillLoop, cenitLoop, digitalLoop — cada
  keyframe, cada `%` y cada valor son idénticos al handoff.
- **Diferencia cosmética (no material):** el handoff omite ceros (`.42`, `.3`) y
  espacios; la implementación (Prettier/SCSS) escribe `0.42`, `0.3` y añade
  espacios. CSS trata `.42` y `0.42` como idénticos; los valores no cambian. El
  paréntesis del encargo ("carácter a carácter (porcentajes/valores)") queda
  satisfecho: no hay divergencia de porcentaje ni de valor.
- **Duración + repetición:** las 8 `animation` usan `18.3s … infinite` (21-22,
  32-33, 39, 45, 53-54).
- **Easings:** anillo `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (32); onda y punto
  `cubic-bezier(0.4, 0, 0.2, 1)` (33, 39, 45); wordmark `steps(5, end)` /
  `steps(7, end)` (53-54); contenedores `ease-in-out` (21-22).
- **Wordmark clip-path:** base `inset(0 0% 0 0)` visible (51); keyframes de
  `inset(0 100% 0 0)` a `inset(0 0% 0 0)` (18-19).
- **Punto = 2 círculos + transform-box:fill-box:** `Logo.tsx` 78-90 (rama
  `animated`) y `Hero.tsx` 34-43 (contorno A + relleno B);
  `[data-orbit-dot-fill]` con `transform-box: fill-box; transform-origin: center`
  (43-44).
- **Radios/grosores (CO4):** nav ring 1.8 / wave 3.2 / dot r3.8 sw1.6; hero ring 1
  / wave 1.4 / dot r3 sw1.3. Verificados en `Logo.tsx` y `Hero.tsx`.

## 2. R1 — Estado base = DIBUJADO

- `[data-orbit-ring], [data-orbit-wave]` base `stroke-dashoffset: 0` (27-31).
- `[data-orbit-dot-outline]` base `stroke-opacity: 0` (contorno invisible, 38).
- `[data-orbit-dot-fill]` base `fill-opacity: 1` (relleno visible, 42).
- Wordmark base `clip-path: inset(0 0% 0 0)` (visible, 51).
- El estado oculto (`300` / `inset(0 100% 0 0)`) vive SOLO en el `0%` de los
  keyframes; ninguna regla base hornea `stroke-dashoffset: 300`. Aserido de forma
  activa por `logo-draw.test.ts` @s14 (línea 136). Esto hace correctos el prerender
  SSG y el fallback reduced-motion.

## 3. Accesibilidad

`@media (prefers-reduced-motion: reduce) { … animation: none }` cubre los 8
selectores (56-67). Con R1, el logo queda estático y completo.

## 4. No-regresión

- **Footer estático:** `Footer.tsx` 11 monta `<Logo size={38} />` sin `animated`;
  `Footer.test.tsx` @s5 verifica ausencia de `data-logo-anim`/`data-orbit-*` y
  punto = 1 solo `<circle>` relleno.
- **Header animado:** `Header.tsx` 11 monta `<Logo animated />`.
- **Hero arco:** `aria-hidden="true"` y no enfocable (`Hero.tsx` 13,
  `Hero.test.tsx` @s6/@s7), posición absoluta y `overflow: hidden` del `.hero`
  (`Hero.module.scss` 3, 8-16; `Hero.test.tsx` @s9).

## 5. Sin tokens nuevos

- `_tokens.scss` no aparece en `git status` (sin cambios para esta feature).
- `_logo-draw.scss` sin `--color-*` ni hex; color vía `var(--color-…)`: nav =
  gradiente primary→secondary + ring + zenith (`Logo.tsx`); hero = único
  `--color-accent` sin `<linearGradient>` (`Hero.tsx`, `Hero.test.tsx` @s7).
  Aserido por `logo-draw.test.ts` @s17.

## 6. Cobertura de los 18 escenarios (mapa @s -> test)

| @s | test | fichero |
| --- | --- | --- |
| @s1 | cabecera monta Logo animado (data-logo-anim) | Header.test.tsx |
| @s2 | Logo animado marca anillo y onda | Logo.test.tsx |
| @s3 | punto = DOS círculos (contorno+relleno) | Logo.test.tsx |
| @s4 | wordmark con hooks máquina de escribir | Logo.test.tsx |
| @s5 | Footer estático + Logo default sin hooks | Footer.test.tsx + Logo.test.tsx |
| @s6 | arco hero animado y accesible | Hero.test.tsx |
| @s7 | arco hero color único accent, sin gradiente | Hero.test.tsx |
| @s8 | 8 keyframes + @use en main.scss | logo-draw.test.ts |
| @s9 | ringLoop/waveLoop % exactos | logo-draw.test.ts |
| @s10 | dotOutlineLoop/dotFillLoop | logo-draw.test.ts |
| @s11 | wordmark clip-path + steps(5)/steps(7) | logo-draw.test.ts |
| @s12 | opacidad arranca DIBUJADO, nunca 0% opacity 0 | logo-draw.test.ts |
| @s13 | 18.3s + infinite + easings exactos | logo-draw.test.ts |
| @s14 | R1 base dibujado; oculto solo en @keyframes | logo-draw.test.ts |
| @s15 | transform-box: fill-box + origin center | logo-draw.test.ts |
| @s16 | reduced-motion animation: none | logo-draw.test.ts |
| @s17 | sin tokens/colores nuevos; var(--color-…) | logo-draw.test.ts |
| @s18 | móvil <=820px reposo .1 (keyframe aparte) | logo-draw.test.ts |

Tests significativos y no tautológicos: los de SCSS localizan el keyframe por
nombre y aseveran %+valor por regex (fallan si cambia un valor); @s14 comprueba
además el invariante negativo (base sin `dashoffset: 300`); los de componente
consultan `data-attributes` y sus valores. Ambas ramas de `animated` cubiertas
(true: @s2/@s3/@s4/@s6/@s7; false: @s5 en Logo y Footer).

## 7. Limpieza

Sin `console.log` / `TODO` / `FIXME` / `debugger` en `src/` (grep vacío).
`pnpm lint` (`eslint .`) exit 0 con salida vacía = 0 errores y 0 warnings.
TypeScript sin `any` injustificado; funciones cortas; nombres reveladores.

---

## Observaciones (no bloqueantes)

- **Keyframe extra `heroCycleOpacityMobile` (13):** no está en el handoff, pero lo
  EXIGE @s18/D2 (atenuación móvil `.1` con keyframe aparte porque el keyframe de
  opacidad gana sobre `opacity` estática). No es "producción sin test":
  `logo-draw.test.ts` @s18 lo aserta. La tensión aparente con "define exactamente
  estos ocho" de @s8 se resuelve porque @s8 valida presencia por nombre (no
  exclusividad) y @s18 añade el noveno de forma explícita en el mismo contrato
  aprobado.
- **Normalización Prettier de ceros a la izquierda** en keyframes (`.42`->`0.42`,
  `.3`->`0.3`): cosmética, sin cambio de valor.

---

## Checkpoints (CHECKPOINTS.md)

- **C2 · Estado coherente:** [x] única feature `in_progress` (#14); `current.md` OK.
- **C3 · Arquitectura:** [x] parcial global en `styles/` + `data-attributes` (D3);
  TS sin `any`; sin `console.log`/TODO.
- **C4 · Verificación real:** [x] `pnpm test` 180 verdes; typecheck y lint verdes
  sin warnings.
- **C6 · Contrato Gherkin:** [x] `@s1..@s18` con `Then` medibles; cada `@s`
  cubierto; sin producción sin test.
- **C7 · Mutación:** [ ] pendiente — la ejecuta `mutation_tester` tras esta aprobación.
