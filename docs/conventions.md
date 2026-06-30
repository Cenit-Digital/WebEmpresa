# Convenciones — estilo, nombres, estructura

Alineadas con `RF-CODE-001` (Confluence). Objetivo: que cualquiera del equipo
entienda y mantenga el código sin sorpresas.

## Código

- **Lenguaje:** TypeScript en todo el proyecto (sin `any` salvo justificación).
- **Componentes:** funcionales con Hooks; **un componente por archivo**;
  nombre en `PascalCase` (archivo `PascalCase.tsx`).
- **Lógica:** en `src/lib/` como funciones puras (`camelCase`), sin JSX.
- **Ficheros y carpetas:** `kebab-case` para rutas y páginas
  (`aviso-legal.tsx`); `PascalCase` para componentes.
- **Estilos:** **SCSS Modules** (`*.module.scss`) por componente; tokens y
  base globales en `src/styles/` con `@use` (nunca `@import`). Consumir colores
  vía `var(--color-…)`. Evitar CSS global suelto fuera de `styles/`.
- **Formato y linting:** Prettier + ESLint; se ejecutan antes de cada commit
  (`pnpm lint`, `pnpm format`).
- **Accesibilidad y SEO:** HTML semántico, `alt` en imágenes, `<title>` y
  `description` por página, foco visible, primitivas accesibles (Radix).

## Tests

- Vitest, co-locados: `algo.test.ts(x)` junto a `algo.ts(x)`.
- El nombre del test cita el escenario Gherkin: `it('@s1 …')`.
- Componentes con Testing Library; lógica pura con asserts exactos.

## Ramas (Git)

- `main`: siempre desplegable.
- Trabajo por tarea: `tipo/CLAVE-descripcion`, p. ej. `feat/WEB-5-secciones-home`.
- Tipos: `feat`, `fix`, `chore`, `docs`, `refactor`.

## Commits

Conventional Commits con la clave de Jira al final:

```
feat: añade formulario de contacto con Resend (WEB-6)
fix: corrige validación de email del formulario (WEB-6)
```

## Pull Requests

- Una PR por tarea, enlazada a su issue de Jira.
- Verde de CI (typecheck + lint + test + build) antes de fusionar.
- Fusión a `main` solo con la PR revisada y el criterio de aceptación cumplido
  (DoD en `RF-SISTEMA-001`).
