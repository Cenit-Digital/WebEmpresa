# progress/history.md — bitácora append-only

## 2026-06-30 · #1 infra_base (WEB-2) — bootstrap del repositorio

Scaffolding del stack estándar (Vite + React + TS + SCSS + pnpm + SSG) con
Radix UI, design tokens de RF-MARCA-001, fuentes Outfit + DM Sans, ESLint +
Prettier, Vitest + Testing Library, Stryker y la capa Harness/SDD.
Verificación: typecheck, lint, test (5), build SSG (2 páginas) y mutación
(100%) en verde. Estado: `done`.

## 2026-07-03 · #2 nav (WEB-4) — Navegación de la cabecera

Pipeline SDD completo. Puerta humana: Pablo aprobó los 9 escenarios de
`features/nav.feature`; decisión en la puerta → el panel móvil **incluye
"Sectores"** (era un olvido del diseño de referencia), listando los 4 enlaces
en orden de escritorio (Servicios, Sectores, Paquetes, Contacto). El
`gherkin_author` ajustó `@s5`; decisión registrada en `project-spec.md` #2.

Implementación por TDD estricto (`tdd_craftsman`): lógica pura en `src/lib/`
(`nav.ts` = `NAV_LINKS` + `CTA_LINK`; `useIsMobile.ts` con
`useSyncExternalStore` sobre `matchMedia`), componentes `HeaderNav` (conmuta
escritorio ↔ móvil) y `MobileMenu` (Radix `Dialog`: abrir/✕/enlace-cierra/
backdrop). `Header.tsx` reescrito: monta `HeaderNav`, deja de importar
`ContactDialog` (superado por el contrato) y **preserva** el `ThemeToggle`
(isla `ClientOnly`, feature #3). Sticky ya venía del `Header.module.scss`.

Review (`judge`): APROBADO (9 `@s` con aserciones significativas, TDD
Rojo→Verde→Refactor demostrable). Mutación (`mutation_tester`): primera corrida
97.37% con 1 superviviente (`useIsMobile.ts:4`, literal `MOBILE_QUERY`, por
tautología en el fake de `matchMedia`); el `tdd_craftsman` ancló el fake al
literal `'(max-width: 767px)'`, el `judge` ratificó y la mutación cerró en
**100%** (38/38). Verificación final `./init.sh`: typecheck · lint · test (26)
en verde, 0 warnings. Estado: `done`.

Observación menor no bloqueante (heredada del baseline `ContactDialog`):
hex/rgba sueltos en `HeaderNav.module.scss` y `MobileMenu.module.scss` por
falta de token para blanco-sobre-primario y scrim/sombra — candidato a
`RF-MARCA-001` cuando se definan esos tokens.

## 2026-07-06 · #3–#12 Design System (WEB-4/WEB-5/WEB-6) — home completa 1:1

Sesión del Design System en `feat/design-system`: implementadas por TDD estricto,
en orden del handoff y fieles 1:1 a `design/Cenit Home (referencia).dc.html` +
`docs/DESIGN_SYSTEM.md`, las features #12 marca (logo Órbita + tokens
Bosque&Limón/Noche&Oro), #3 theme_selector (3 estados, `cenit-theme`, reacción en
vivo, anti-FOUC), #2 nav, #4 footer, #5 layout_accesibilidad, #6 hero, #7 servicios,
#8 sectores, #9 paquetes (sin precios), #10 contacto_seccion, #11 contact_form
(Resend vía `api/contact.ts`). Cada una cerró con las tres puertas (TDD Rojo→Verde→
Refactor · judge APROBADO · mutación Stryker 100%). Reconciliado `main` en
`feat/design-system` (PR #2). Verificación 0/0/0: typecheck · lint 0 warnings · 147
tests · build SSG · mutación 100% (356/356). Estado: 12/12 `done`.

## 2026-07-07 · #13 fidelidad_referencia (WEB-4/WEB-5) — restaurar fidelidad cabecera + hero

Pipeline SDD completo sobre `feat/design-system`. Conversación (lead ↔ Pablo): la
home había DERIVADO de la referencia versionada en 3 puntos de cabecera/hero; Pablo
confirmó "restaurar fidelidad" y eligió, para el tema, la **opción A1** (botón de
icono único que CICLA los 3 modos) para no regresar el requisito Jira WEB-4 (3
estados). Spec en `project-spec.md` #13; contrato en
`features/fidelidad_referencia.feature` (9 escenarios) + parche de presentación en
`features/theme_selector.feature` (@s3–@s5 al modelo de ciclo, comportamiento
intacto). El lead corrigió `@s7` del contrato (la referencia usa `space-between` con
2 grupos; la corrección del hueco central es estructural —2 hijos, no 3—, no de CSS).

Implementación por TDD estricto (`tdd_craftsman`): (1) `ThemeToggle` pasa de píldora
`radiogroup` a un único `<button>` que cicla `light→dark→system→light` (iconos
sol/luna/monitor, SVG verbatim de la referencia; monitor de Feather = única adición
aprobada), con `aria-hidden` en los iconos decorativos y nombre accesible que comunica
el modo; `theme.ts` intacto (+`nextMode` puro). (2) Cabecera a 2 grupos: `Header` deja
2 hijos (logo | `HeaderNav`); el clúster derecho ordena `[enlaces · tema · Hablamos]`;
tema preservado en móvil (anti-regresión). (3) Hero recupera el arco decorativo
`data-hero-arc` (círculo+onda+punto), `overflow:hidden` en `.hero`, `aria-hidden`.

Review: `judge` **APROBADO**; `a11y_seo_auditor` **0 bloqueantes** (WCAG 2.1 AA; se
aplicó la mejora de `aria-hidden` en iconos por TDD). Mutación (`mutation_tester`):
**100%** (98/98) acotada a los 4 ficheros tocados (`theme.ts`, `ThemeToggle.tsx`,
`HeaderNav.tsx`, `Hero.tsx`). Verificación final 0/0/0: typecheck · lint 0 warnings ·
**159 tests** · build SSG (2 páginas). Estado: `done`.
