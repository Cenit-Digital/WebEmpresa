# project-spec.md — WebEmpresa (Cénit Digital)

Spec conversada por feature. El `spec_partner` amplía este archivo antes de
cada feature `"sdd": true`; el `gherkin_author` lo destila en `features/`.

---

## #1 · infra_base — Repositorio base (WEB-2)

**Propósito.** Dejar el repositorio y el proyecto base del que parte toda la
web, y fijar el stack estándar de empresa.

**Comportamiento.** Proyecto Vite + React + TypeScript con SSG
(vite-react-ssg), SCSS Modules + design tokens, Radix UI, fuentes self-hosted,
y la capa Harness/SDD para el desarrollo asistido por IA.

**Contrato.**

- `pnpm dev` arranca el sitio en local; `pnpm build` prerenderiza a HTML
  estático en `dist/`.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` y `pnpm mutation`
  terminan en verde, sin warnings.
- Cada página lleva su `<title>` y `description` propios en el HTML estático.

**Decisiones.**

- **Vite + React + SCSS + pnpm** en lugar de Next.js + Tailwind (ver `DE-002`,
  supersede a `DE-001`). Razón: preferencia de equipo y simplicidad del build;
  el SEO se preserva con SSG (vite-react-ssg). Alternativa descartada: SPA pura
  (mal SEO para una web corporativa).
- **SSG con vite-react-ssg** en lugar de SPA. Alternativa descartada: Vike
  (más potente pero más complejo de lo necesario aquí).
- **Radix UI + SCSS Modules** en lugar de shadcn/ui (que depende de Tailwind).
- **Stryker + Vitest** como equivalente JS de la prueba de mutación.

**Estado.** `done`.

---

## Próximas features

`home_layout` (WEB-4), `home_sections` (WEB-5) y `contact_form` (WEB-6) están
`pending`. Cada una pasará por `spec_partner` → `gherkin_author` → puerta
humana → TDD → judge → mutación antes de cerrarse.
