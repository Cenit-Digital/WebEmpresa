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
