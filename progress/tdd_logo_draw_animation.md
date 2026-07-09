# TDD — #14 logo_draw_animation

Bitácora Rojo→Verde→Refactor (un test a la vez) para
`features/logo_draw_animation.feature` (18 escenarios, APROBADO por el humano).

Fuente de verdad de valores: `design/logo-draw-animation/` + `project-spec.md` #14.
Estado base = DIBUJADO (R1). D1 reduced-motion sí; D2 móvil ≤820px reposo .1;
D3 parcial global `src/styles/_logo-draw.scss` + data-attributes; D4 prop `Logo animated`.

Baseline previo: 161 tests verdes (21 files).

## Ciclos

@s8–@s11 (componentes + 8 @keyframes ring/wave/dot/wordmark + shorthands
cenit/digital): ya cerrados en corrida previa. Logo.tsx, Hero.tsx, Header.tsx
verdes e INTACTOS.

Reanudación tras corte (watchdog) que dejó `_logo-draw.scss` incompleto
(keyframes de opacidad vacíos, sin reglas base/móvil/reduced-motion) y sin
tests @s12–@s18.

- @s12 (contenedores/opacidad): test → `logoCycleOpacity` arranca DIBUJADO
  (`0% { opacity: 1 }`, parpadeo `96% { opacity: 0 }`, vuelve `100% { opacity: 1 }`,
  nunca `0% { opacity: 0 }`); `heroCycleOpacity` reposa a `0.42`.
  Prod → rellenados `@keyframes logoCycleOpacity`/`heroCycleOpacity` +
  `[data-logo-anim]`/`[data-hero-arc]`.
- @s13 (shorthands 18.3s + infinite + easings): test → `[data-orbit-ring]`
  `cubic-bezier(0.25,0.46,0.45,0.94)`, `[data-orbit-wave]` `cubic-bezier(0.4,0,0.2,1)`,
  `[data-logo-anim]` `ease-in-out`, todos `18.3s … infinite`.
  Prod → añadidas las reglas de animación de anillo/onda.
- @s14 (R1 base DIBUJADO): test → base `[data-orbit-ring],[data-orbit-wave]`
  `stroke-dashoffset: 0`; `[data-orbit-dot-outline]` base `stroke-opacity: 0`;
  `[data-orbit-dot-fill]` base `fill-opacity: 1`; y NINGUNA regla base hornea
  `stroke-dashoffset: 300` (solo dentro de @keyframes).
  Prod → reglas base con estado dibujado (dasharray/offset/opacity).
- @s15 (transform-box): test → `[data-orbit-dot-fill]` con `transform-box: fill-box`
  y `transform-origin: center`. Prod → añadido al bloque del relleno.
- @s16 (D1 reduced-motion): test → `@media (prefers-reduced-motion: reduce)`
  con `animation: none`. Prod → bloque reduced-motion apagando los 8 selectores.
- @s17 (sin tokens/colores nuevos): test → `_logo-draw.scss` no declara
  `--color-*` ni hex; `Logo.tsx`/`Hero.tsx` usan `var(--color-`.
  Prod → verde sin cambios (el parcial ya trabaja solo con selectores/keyframes).
- @s18 (D2 móvil ≤820px): test → `@media (max-width: 820px)` con
  `animation-name: heroCycleOpacityMobile`; keyframe `heroCycleOpacityMobile`
  `0% { opacity: 0.1 }`; `.arc` a `opacity: 0.1` en el mismo breakpoint.
  Prod → keyframe móvil + media query en el parcial; `Hero.module.scss` `.arc`
  base a `opacity: 0.42` (coherencia con reposo animado; móvil sigue 0.1).

Refactor: parcial ordenado (keyframes → contenedores → trazos → punto →
wordmark → reduced-motion); comentarios de intención por bloque.

Resultado: `pnpm typecheck` OK · `pnpm lint` 0 warnings · `pnpm test` 180/180
(22 files).

## Trazabilidad @s → test

Fichero de tests: `src/styles/logo-draw.test.ts`
(colocado; jsdom no interpola @keyframes/CSS externo → el contrato testeable
es el CONTENIDO del `.scss`, mismo idioma que @s3 de Header).

| @s   | test (it)                                                        |
| ---- | --------------------------------------------------------------- |
| @s8  | los ocho @keyframes viven en el parcial y está enlazado…         |
| @s9  | ringLoop y waveLoop usan los porcentajes exactos del handoff     |
| @s10 | dotOutlineLoop traza el contorno y dotFillLoop hace el "pop"     |
| @s11 | el wordmark se revela carácter a carácter con clip-path + steps  |
| @s12 | los keyframes de opacidad arrancan DIBUJADO (no en 0)…           |
| @s13 | los shorthands usan 18.3s + infinite y los easings exactos       |
| @s14 | R1: el estado BASE (fuera de @keyframes) es DIBUJADO, no oculto  |
| @s15 | el relleno del punto escala desde su propio centro (transform-box) |
| @s16 | D1: prefers-reduced-motion apaga toda la animación              |
| @s17 | no crea tokens ni colores propios: usa los var(--color-…)        |
| @s18 | D2: en móvil (≤820px) el arco del hero reposa a 0.1             |

(@s1–@s7 → tests de Logo/Header/Hero cerrados en corrida previa.)
