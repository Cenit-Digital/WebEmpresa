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
├── api/
│   └── contact.ts            # Vercel Function: envío del formulario con Resend
├── design/                   # referencia 1:1 del diseño + design system (no producción)
├── src/
│   ├── main.tsx              # entrada: ViteReactSSG(routes) + estilos + fuentes
│   ├── App.tsx               # definición de rutas (RouteRecord[])
│   ├── pages/                # una página por ruta; SEO con <Head>
│   ├── components/           # UI reutilizable (1 componente por archivo)
│   ├── lib/                  # lógica pura y testeable (sin JSX)
│   └── styles/               # _tokens.scss, _reset.scss, _base.scss, main.scss
├── public/                   # estáticos (favicon.svg, robots.txt, sitemap.xml)
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
├── .github/workflows/        # ci.yml (init.sh + build) · autonomous-evolve.yml
│                             #   (bot de mantenimiento, solo PR) · guardián
├── .github/AUTONOMOUS.md     # mandato del bot (ver docs/autonomous.md)
└── .claude/agents/           # 6 del pipeline (craftsman_lead, spec_partner,
                              #   gherkin_author, tdd_craftsman, judge, mutation_tester)
                              #   + 3 de apoyo, solo lectura (security_reviewer,
                              #   a11y_seo_auditor, mentor)
```

## Design tokens (identidad de marca)

Los colores y la tipografía provienen de **RF-MARCA-001** / el design system
(`docs/DESIGN_SYSTEM.md`) y viven en `src/styles/_tokens.scss` como **CSS custom
properties**:

- **Modo claro = Bosque & Limón** en `:root`; **modo oscuro = Noche & Oro** en
  `:root[data-theme='dark']`. Logotipo **"Órbita"** adaptativo (`Logo.tsx`).
- Los componentes consumen `var(--color-…)`, nunca hex sueltos.
- El tema se aplica antes del primer pintado (script en `index.html`) y se
  conmuta con el selector de 3 estados **Claro / Oscuro / Sistema** de la
  cabecera (`ThemeToggle`, persistido en `localStorage['cenit-theme']`;
  ausencia de clave = "Sistema", que sigue a `prefers-color-scheme` en vivo).
- Referencia visual 1:1 del diseño: `design/Cenit Home (referencia) - standalone.html`
  y el paquete `design/system/`.

## Formulario de contacto (Resend)

La sección de contacto (`#contacto`) envía el mensaje a la función serverless
`api/contact.ts` (Vercel), que usa **Resend** para mandar el correo. El cliente
(`src/lib/contact.ts`) valida y hace `POST /api/contact`. La frontera de confianza
está endurecida en el servidor (ver `progress/security_review.md`): honeypot,
validación de formato de correo, topes de longitud, saneado CRLF y **rate limiting
por IP** con `@vercel/firewall`.

Para que el envío funcione en producción:

1. En Resend, verifica el dominio remitente y crea una API key.
2. En las variables de entorno de Vercel define `RESEND_API_KEY` (obligatoria) y,
   si quieres personalizar, `CONTACT_TO` (destino, por defecto
   `hola@cenitdigital.es`) y `RESEND_FROM` (remitente del dominio verificado).
3. **Rate limiting**: en el dashboard de Vercel → **Firewall** → nueva regla con
   **Rate limit ID** `contact-form` (el que consume `checkRateLimit` en
   `api/contact.ts`). Sin esa regla, `checkRateLimit` es un no-op seguro (no
   limita, pero no rompe). Ref. oficial: Vercel WAF → Rate Limiting SDK.

En local, `pnpm dev` no ejecuta las funciones de `/api` (usa `vercel dev` para
probarlas); los tests cubren el comportamiento del formulario mockeando el envío.

## Accesibilidad — pendiente de decisión de diseño

La auditoría (`progress/audit_a11y_seo.md`) señala **3 puntos de contraste (WCAG
1.4.3 AA)** en el **tema oscuro**, heredados de los valores de token del diseño
(violeta `#7c5cbf` en eyebrows/etiquetas y `--color-text-faint` en notas, sobre
el fondo Noche & Oro). Corregirlos implica **ajustar la paleta de marca**, que es
una decisión de diseño (no se toca de forma automática para respetar la réplica
1:1). Recomendación mínima para cumplir AA sin cambiar la identidad: aclarar el
violeta de esos usos pequeños en oscuro (o usar el oro `--color-primary` del tema
oscuro para eyebrows/etiquetas). El resto del contraste (botones, texto principal,
feedback) cumple AA.

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
auto-verifica con `./init.sh`, y la **CI** (`.github/workflows/ci.yml`) ejecuta
ese mismo `init.sh` más el build SSG en cada PR y en cada push a `main`.

## Mantenimiento autónomo

Lunes, miércoles y viernes, un bot busca **una** tarea real de mantenimiento
**fuera** de `src/` y los tests —documentación desfasada, configuración
incoherente— y abre un PR. Nunca fusiona, nunca toca producto: el pipeline SDD
tiene una puerta humana que un cron no puede cruzar. Lo normal es que la mayoría
de los días no proponga nada. Ver `docs/autonomous.md` y `.github/AUTONOMOUS.md`.

## Git

- Ramas: `tipo/CLAVE-descripcion` (p. ej. `feat/WEB-5-secciones-home`).
- Commits: Conventional Commits + clave de Jira: `feat: … (WEB-6)`.
- `main` siempre desplegable; una PR por tarea enlazada a su issue.

## Licencia

Software propietario de Cénit Digital. Todos los derechos reservados.
