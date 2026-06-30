# WebEmpresa — Web corporativa de Cénit Digital

Repositorio **base** del stack estándar de software de Cénit Digital. Sirve
para la web propia y, sobre la misma base, para los proyectos de cliente.

> Stack: **Vite + React + TypeScript + SCSS + pnpm**, con **SSG** (HTML
> estático para buen SEO) y proceso de desarrollo **Harness / SDD**.
> Documentación: `RF-INFRA-001`, `RF-STACK-001`, `RF-CODE-001`, `DE-002`,
> `GU-HARNESS-001` y `RF-MARCA-001` en el espacio **DDS** de Confluence.

## Stack

| Capa            | Herramienta                             |
| --------------- | --------------------------------------- |
| Framework       | React 19 + TypeScript 5                 |
| Bundler / dev   | Vite 7                                  |
| SSG / rutas     | vite-react-ssg + react-router-dom v6    |
| Estilos         | SCSS Modules + design tokens (CSS vars) |
| Primitivas UI   | Radix UI (`radix-ui`)                   |
| Tipografía      | @fontsource — Outfit + DM Sans          |
| Tests           | Vitest + Testing Library + jsdom        |
| Mutación        | StrykerJS (vitest-runner)               |
| Lint / formato  | ESLint 9 (flat config) + Prettier       |
| Gestor paquetes | pnpm                                    |

## Requisitos

- **Node.js >= 22** (ver `.nvmrc`).
- **pnpm** (recomendado vía Corepack):

```bash
corepack enable pnpm
```

## Arranque rápido

```bash
pnpm install          # instala dependencias
cp .env.example .env.local   # rellena tus claves (nunca se suben al repo)
pnpm dev              # desarrollo en http://localhost:5173
```

Build de producción (genera HTML estático en `dist/`):

```bash
pnpm build
pnpm preview          # sirve el build para comprobarlo en local
```

## Scripts

| Script           | Qué hace                                                |
| ---------------- | ------------------------------------------------------- |
| `pnpm dev`       | Servidor de desarrollo (CSR).                           |
| `pnpm dev:ssr`   | Desarrollo con SSR (más fiel a producción).             |
| `pnpm build`     | Build SSG (prerenderiza cada ruta a HTML).              |
| `pnpm preview`   | Sirve el `dist/` generado.                              |
| `pnpm typecheck` | `tsc --noEmit`.                                         |
| `pnpm lint`      | ESLint.                                                 |
| `pnpm format`    | Prettier (escribe). `pnpm format:check` solo comprueba. |
| `pnpm test`      | Vitest (una pasada). `pnpm test:watch` en modo watch.   |
| `pnpm coverage`  | Cobertura de tests.                                     |
| `pnpm mutation`  | Prueba de mutación con Stryker.                         |
| `pnpm verify`    | `./init.sh`: entorno + base + typecheck + lint + test.  |

## Estructura

```
.
├── index.html                # plantilla raíz (script de tema anti-FOUC)
├── src/
│   ├── main.tsx              # entrada: ViteReactSSG(routes) + estilos + fuentes
│   ├── App.tsx               # definición de rutas (RouteRecord[])
│   ├── pages/                # una página por ruta; SEO con <Head>
│   ├── components/           # UI reutilizable (1 componente por archivo)
│   ├── lib/                  # lógica pura y testeable (sin JSX)
│   └── styles/               # _tokens.scss, _reset.scss, _base.scss, main.scss
├── public/                   # estáticos (favicon.svg)
├── vite.config.ts            # Vite + plugin React (SWC) + ssgOptions
├── vitest.config.ts          # Vitest (jsdom) + setup
├── stryker.config.json       # prueba de mutación
├── eslint.config.js          # ESLint 9 (flat)
├── pnpm-workspace.yaml       # ajustes pnpm (allowBuilds, peers)
├── .env.example              # plantilla de variables de entorno
│
├── CLAUDE.md · AGENTS.md · CHECKPOINTS.md   # arnés para agentes de IA
├── feature_list.json · project-spec.md      # backlog y spec del SDD
├── features/ · progress/                    # contratos Gherkin y bitácoras
├── docs/                     # workflow, tdd, gherkin, mutation, architecture…
└── .claude/agents/           # craftsman_lead, spec_partner, gherkin_author,
                              #   tdd_craftsman, judge, mutation_tester
```

## Design tokens (identidad de marca)

Los colores y la tipografía provienen de **RF-MARCA-001** y viven en
`src/styles/_tokens.scss` como **CSS custom properties**:

- **Modo claro** (Teal Profundo) en `:root`; **modo oscuro** (Océano y Coral)
  en `:root[data-theme='dark']`; **marca** (Azul Noche y Menta) común.
- Los componentes consumen `var(--color-…)`, nunca hex sueltos.
- El tema se aplica antes del primer pintado (script en `index.html`) y se
  conmuta con el botón de la cabecera (`ThemeToggle`, persistido en
  `localStorage`).

## Variables de entorno

Definidas en `.env.example`. Regla de oro (**RF-STACK-001**): **ninguna clave
real se sube al repositorio**; se guardan en el gestor de contraseñas del
equipo y en las variables de entorno de Vercel. Vite solo expone al cliente
las que llevan prefijo `VITE_`.

## Desarrollo asistido por IA — Harness / SDD

Este repo sigue el proceso **Spec-Driven Development** (conversación → Gherkin
→ TDD → review → mutación). Una feature nueva recorre:

```
pending → spec (project-spec.md) → escenarios (features/<name>.feature)
        → ⏸ aprobación humana → TDD (un test a la vez)
        → review (judge) → mutación (Stryker) → done
```

Detalle en `docs/workflow.md` y en `GU-HARNESS-001` (Confluence). El arnés se
auto-verifica con `./init.sh`.

## Git

- Ramas: `tipo/CLAVE-descripcion` (p. ej. `feat/WEB-5-secciones-home`).
- Commits: Conventional Commits + clave de Jira: `feat: … (WEB-6)`.
- `main` siempre desplegable; una PR por tarea enlazada a su issue.

## Licencia

Software propietario de Cénit Digital. Todos los derechos reservados.
