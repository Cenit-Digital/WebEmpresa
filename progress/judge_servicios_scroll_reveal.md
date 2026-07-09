# Veredicto del Juez — #15 · servicios_scroll_reveal

**Fecha:** 2026-07-09
**Feature:** #15 · servicios_scroll_reveal (Animación de revelado en scroll de la sección Servicios — WEB-5)
**Contrato:** `features/servicios_scroll_reveal.feature` (@s1..@s14) + `project-spec.md` #15 (CO1..CO6, D1..D7, R1..R6).

## VEREDICTO: APROBADO

`./init.sh` en verde: exit 0 — typecheck sin errores · lint 0 warnings ·
**194 tests passed** (14 nuevos sobre la baseline de 180). Los 14 escenarios
tienen test significativo (no tautológico); contrato cumplido; R1/SSG-safe,
responsive/overflow, a11y, no-regresión y convenciones respetados.

> El `mutation_tester` corre después: yo juzgo diseño y cobertura; la mutación
> mide si los tests muerden. Ambas puertas deben pasar.

---

## Cobertura @s -> test

| @s   | Comportamiento (contrato)                                   | Test                                                              | Estado |
| ---- | ----------------------------------------------------------- | ---------------------------------------------------------------- | ------ |
| @s1  | Guard SSR: sin IntersectionObserver no arma nada, visible   | `useReveal.test.tsx:72` (stub IO=undefined, sin data-reveal/-in-view) | OK |
| @s2  | Arma `data-reveal` en useEffect (presencia + valor `''`)    | `useReveal.test.tsx:83`                                            | OK |
| @s3  | Observa N filas + banda central (rootMargin/threshold 0)    | `useReveal.test.tsx:94` (size 4, rootMargin=símbolo, literal exacto) | OK |
| @s4  | Conmuta `data-in-view` al entrar                            | `useReveal.test.tsx:107`                                           | OK |
| @s5  | Bidireccional (no triggerOnce): pierde y recupera           | `useReveal.test.tsx:117` (true->false->true)                      | OK |
| @s6  | Limpieza: `disconnect()` al desmontar                       | `useReveal.test.tsx:133` (count 0->1, observed 0)                 | OK |
| @s7  | R1: estado base = final visible (oculto no horneado)        | `Servicios.reveal.test.tsx:123` (base sin opacity:0/translateX/Y) | OK |
| @s8  | Oculto gateado tras data-reveal + :not([data-in-view]) + no-preference | `Servicios.reveal.test.tsx:132` (3 piezas)             | OK |
| @s9  | Solo `opacity` + `transform` (sin reflow)                   | `Servicios.reveal.test.tsx:149`                                   | OK |
| @s10 | Stagger .card -> mockup -> .example (delays crecientes)     | `Servicios.reveal.test.tsx:163` (0 < 0.18 < 0.36)                | OK |
| @s11 | Zig-zag por `:nth-child(even)`, sin data-dir/JS             | `Servicios.reveal.test.tsx:177` (+ scss y Servicios.tsx sin data-dir) | OK |
| @s12 | reduce: sin oculto ni animación (todo cuelga de no-preference) | `Servicios.reveal.test.tsx:193`                               | OK |
| @s13 | overflow-x: clip + fallback vertical móvil (translateY)     | `Servicios.reveal.test.tsx:202` (.services clip; móvil translateY, sin translateX) | OK |
| @s14 | Contenido intacto + cableado (ref, 6 filas, wrapper mockup) | `Servicios.reveal.test.tsx:218` (6 títulos/tags/ejemplos; data-reveal; 6 observadas; mockup aria-hidden; emit->data-in-view) | OK |

**14/14 escenarios cubiertos.** Ningún `@s` sin test.

---

## Contrato observable (CO1..CO6) — verificado

- **CO1 Disparo por fila centrado:** `REVEAL_ROOT_MARGIN = '-40% 0px -40% 0px'`
  (`src/lib/useReveal.ts:4`), `threshold: 0`; observa hijos directos de `.rows`.
  Pinado por @s3 contra el símbolo importado (no tautológico) y el literal exacto.
- **CO2 Bidireccional:** `toggleAttribute('data-in-view', entry.isIntersecting)`
  (`useReveal.ts:25`), sin `unobserve`/triggerOnce. @s5 lo tritura (true/false/true).
- **CO3 Coreografía zig-zag + stagger:** `.card`/`.mockup`/`.example` con
  `translateX(-44px)`/`translateX(44px)`/`translateY(34px)`
  (`Servicios.module.scss:206-219`); inversión par en `:nth-child(even)`
  (líneas 224-230); stagger `0 / 0.18s / 0.36s` (191-201). Solo opacity+transform.
- **CO4 SSG-safe (R1):** base = final visible; el oculto vive SOLO bajo
  `[data-reveal] .row:not([data-in-view])` dentro de
  `@media (prefers-reduced-motion: no-preference)` (179-231). `data-reveal` se
  arma imperativamente en `useEffect` (`useReveal.ts:30`) -> sin hydration mismatch.
- **CO5 reduce:** no existe bloque `prefers-reduced-motion: reduce`; con el
  no-preference retirado no queda `transition` que apagar. @s12.
- **CO6 Hook mínimo reutilizable:** genérico por `data-*` (16-35), guard
  `typeof IntersectionObserver === 'undefined'` (`useReveal.ts:20`),
  `disconnect()` en cleanup (línea 32). Cableado solo a Servicios; hook disponible.

**Duración >1s:** `transition: ... 1.2s ...` (`Servicios.module.scss:185-187`),
1.2s > 1s. El valor fino es calibración visual del lead (así lo fija el spec);
las reglas — no el valor — quedan pinadas por @s9/@s10.

## Disciplina TDD

Bitácora `progress/tdd_servicios_scroll_reveal.md` documenta Rojo->Verde->Refactor
por ciclo, con triangulación explícita en @s5 (debilitar el toggle a `true` fijo
rompe @s5 -> obliga a `entry.isIntersecting`). No detecto producción que ningún
test exija: cada regla del SCSS de revelado está aseverada (@s7-@s13) y el cableado
de `Servicios.tsx` (ref + wrapper `.mockup`) por @s14. El único
`// Stryker disable next-line all` (`useReveal.ts:18`) cubre el guard defensivo
`if (!root) return` (no observable; `ref.current` siempre presente en el efecto),
mismo recurso que `Logo.tsx`; lo valida el mutation_tester en C7.

## Calidad / convenciones

- Hook en `src/lib/` camelCase, sin JSX, SSR-safe (RF-CODE-001 / arquitectura). OK.
- SCSS Module; sin tokens/colores nuevos (`_tokens.scss` intacto); duraciones y
  desplazamientos son constantes de animación, no tokens de marca (R6). OK.
- Sin dependencias nuevas (IntersectionObserver nativo, D1). OK.
- Sin `console.log`/TODOs; funciones cortas, nombres reveladores. OK.
- `src/lib/useReveal.ts` añadido a `mutate` de `stryker.config.json:17` (R5). OK.
- No-regresión: `Servicios.test.tsx` (6 servicios, tags, títulos, ejemplos, 12
  características, descripciones) sigue verde dentro de los 194. OK.

## Checkpoints

- **C1** init.sh exit 0. [x]
- **C2** Una sola feature `in_progress` (#15); no-regresión verde. [x]
- **C3** `src/` respeta arquitectura (hook en `lib`, componente en `components`);
  sin `any`, sin console.log/TODO. [x]
- **C4** typecheck/lint 0/0; `pnpm test` > 0 y verde (194). [x]
- **C6** `.feature` con @s1..@s14 medibles; mapa @s->test completo; sin producción
  huérfana. [x]
- **C7** (mutación) — la valida el `mutation_tester`. Pendiente por diseño.

## Hallazgos

- **Bloqueantes: 0.**
- **Menor (no bloqueante, housekeeping del lead, fuera del código):**
  `progress/current.md` está desactualizado — declara "Fase 1 (conversación de
  spec) -> destilando a Gherkin" y baseline "180 tests", cuando el TDD ya está
  cerrado (194). No afecta al veredicto; conviene refrescarlo al cerrar la sesión.

---

**Puerta de review: APROBADA.** Procede el `mutation_tester` (C7, umbral 100%
sobre `useReveal.ts` + `Servicios.tsx`). No marcar `done` hasta que la mutación
pase.
