# Veredicto del Juez — layout_accesibilidad (#5)

**Resultado: APPROVED**
Rama: `feat/design-system`. Contrato: `features/layout_accesibilidad.feature` (@s1–@s4).
Hallazgos bloqueantes: **0**.

## Cobertura de escenarios (@s → test real)

| @s  | Escenario                             | Test que lo verifica                                                                                                                                        | Verificación                                                                                                                                                                                                                                                                                                                                                                      |
| --- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @s1 | Skip-link es el PRIMER enfocable      | `src/components/Layout.test.tsx:38`                                                                                                                         | `user.tab()` una vez desde el inicio → `document.activeElement` === enlace "Saltar al contenido" (`:45`). Prueba real de "primer tabbable": si algo enfocable precediera al skip-link, el primer Tab caería en ese otro elemento y fallaría. El skip-link es el primer nodo del DOM (`Layout.tsx:24`, antes de `<Header/>`), un `<a href>` sin `tabIndex` → tabbable por defecto. |
| @s2 | Activar salto mueve foco a #contenido | `src/components/Layout.test.tsx:48`                                                                                                                         | Enfoca el skip-link, pulsa `{Enter}` y afirma `document.activeElement` === `#contenido` (`:56-57`). No es "que exista": mide el foco real. Producción: `focusContent` con `preventDefault()` + `getElementById('contenido').focus()` (`Layout.tsx:9-12`) sobre `<main id="contenido" tabIndex={-1}>` (`:28`) — destino programáticamente enfocable. Correcto y accesible.         |
| @s3 | `<title>` de "/" exacto               | `src/lib/seo.test.ts:20` (literal exacto) + `:24` (composición `${SITE.name} — ${SITE.tagline}`) + `src/pages/home.test.tsx:14` (render → `document.title`) | Cadena exacta "Cénit Digital — Soluciones digitales para pymes".                                                                                                                                                                                                                                                                                                                  |
| @s4 | `<title>` de "/aviso-legal" exacto    | `src/pages/aviso-legal.test.tsx:14` + `src/lib/seo.test.ts:10`                                                                                              | Cadena exacta "Aviso legal — Cénit Digital".                                                                                                                                                                                                                                                                                                                                      |

## Re-confirmación en HTML prerenderizado (grep propio, tras `pnpm build`)

- `dist/index.html:1` → `<title data-rh="true">Cénit Digital — Soluciones digitales para pymes</title>` ✔ exacto (guion largo U+2014).
- `dist/aviso-legal/index.html:1` → `<title data-rh="true">Aviso legal — Cénit Digital</title>` ✔ exacto.

Los tests de página mockean `<Head>` como passthrough (React 19 iza `<title>` a `document.title`); la evidencia real de prerenderizado la aporta el grep sobre `dist/` — coincide 1:1. No queda sólo en el mock.

## Disciplina TDD

- Bitácora `progress/tdd_layout_accesibilidad.md` documenta Rojo→Verde(→Refactor) por escenario, incluida la extracción de `focusContent` en verde (@s2).
- @s1 y @s4 son "cerrojos de regresión" sobre comportamiento ya conforme; declarados como tal, sin producción nueva. Legítimo.
- No hay producción que ningún test exija: `buildHomeTitle` (`seo.ts:22`) ↔ `seo.test.ts`; `SITE.tagline` (`site.ts:3`) ↔ test de composición; `home.tsx` usa `buildHomeTitle` ↔ `home.test.tsx`; skip-link/`focusContent` ↔ Layout.test. El bloque `<Head>` de metadatos en `Layout.tsx:16-23` es preexistente (infra_base), fuera del alcance de esta feature.

## Calidad (lente de artesano)

- Funciones cortas y nombres reveladores (`focusContent`, `buildHomeTitle`). Sin duplicación ni números mágicos. `#contenido` como fragmento acordado con `<main>`.
- Arquitectura respetada: lógica pura en `lib/` (`seo.ts`, `site.ts`), UI en `components/`, SEO por página con `<Head>` en `pages/`. `lib` no importa de `components`/`pages`.
- Accesibilidad: skip-link con patrón off-screen visible al foco (`_base.scss:46-59`), foco visible global. Sin `any`.
- Tests no tautológicos: afirman `document.activeElement` y cadenas exactas; fallarían ante cualquier regresión de orden de foco, destino o título.

## Verificación (`./init.sh` + build)

- `./init.sh`: VERDE — typecheck sin errores, lint 0 warnings, 75 tests (14 ficheros) verdes.
- `pnpm build` (SSG): VERDE, ambas rutas prerenderizadas.
- Sin regresiones: suites de marca / theme_selector / nav / footer entre los 14 ficheros verdes.

## Checkpoints

- C3 (arquitectura): [x]
- C4 (verificación real): [x] typecheck/lint/test verdes, sin warnings
- C6 (contrato Gherkin): [x] cada @s con test; sin producción no pedida
- C7 (mutación): [ ] pendiente — la corre `mutation_tester` tras esta aprobación

## Observación no bloqueante (para el lead)

`feature_list.json` tiene `layout_accesibilidad` (#5) en `spec_ready` mientras `footer` (#4) figura en `in_progress`. La feature juzgada ya está implementada y verde: conviene alinear el estado (#5 → `in_progress`) antes de continuar. No afecta a la calidad técnica de la feature ni al veredicto; es corrección de bookkeeping, competencia del lead (el juez no edita estado).

---

**APPROVED** — pasa a `mutation_tester` (C7). Sin cambios solicitados.
