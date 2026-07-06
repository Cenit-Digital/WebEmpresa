# Tooling del arnés — skills, hooks y agentes de apoyo

> Qué herramientas de agente hay en el repo, cómo funcionan y **por qué se
> eligieron así**. Regla rectora: **reforzar el harness SDD, no reemplazarlo.**
> El pipeline `spec_partner → gherkin_author → ⏸ humano → tdd_craftsman → judge
→ mutation_tester` sigue siendo la fuente de verdad (ver `docs/workflow.md`).

## 1. Resumen de lo añadido

| Pieza                        | Dónde                                       | Qué es                                                         |
| ---------------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| **ponytail** (6 skills)      | `.claude/skills/ponytail*/`                 | Modo "lazy senior dev": la solución más simple que funciona    |
| Hooks de ponytail            | `.claude/ponytail/hooks/` + `settings.json` | Activan el ruleset cada sesión y en cada subagente             |
| **3 agentes de apoyo**       | `.claude/agents/`                           | `security_reviewer`, `a11y_seo_auditor`, `mentor` (opcionales) |
| Skills de stack (autoskills) | `.agents/skills/` + `skills-lock.json`      | accessibility, seo, react, vite, vitest, ts, etc.              |

Nada de esto altera el código de `src/` ni el pipeline obligatorio.

## 2. ponytail (lazy senior dev)

### Qué hace

Antes de escribir código, para en el primer peldaño de la escalera que se
cumple: ¿hace falta? → ¿ya existe en el repo? → ¿stdlib? → ¿nativo de la
plataforma? → ¿dependencia ya instalada? → ¿una línea? → solo entonces, el
mínimo que funciona. **No** recorta validación en fronteras de confianza,
manejo de errores, seguridad ni accesibilidad. Encaja con la ética del repo
("el código que ningún test pidió no existe").

### Cómo está instalado (en el repo, no como plugin global)

Se **vendorizó** ponytail dentro del repo (ver `.claude/ponytail/NOTICE.md`
para procedencia, versión y las dos adaptaciones mínimas). Motivo: `/plugin
marketplace add` es un comando interactivo del host que un agente no puede
ejecutar; en el repo queda versionado, portable y activo.

- Las 6 skills están en `.claude/skills/ponytail*/SKILL.md` → Claude Code las
  descubre como `/ponytail`, `/ponytail-review`, `/ponytail-audit`,
  `/ponytail-debt`, `/ponytail-gain`, `/ponytail-help`.
- Los hooks (`SessionStart`, `SubagentStart`, `UserPromptSubmit`) están
  cableados en `.claude/settings.json` y **auto-activan** el ruleset (nivel
  `full` por defecto) al empezar cada sesión y en cada subagente.

### Niveles y control

- `/ponytail lite | full | ultra | off` — cambia la intensidad (persiste hasta
  cambiarla o cerrar la sesión).
- `stop ponytail` / `normal mode` — lo desactiva.
- Nivel por defecto: `full`. Se puede fijar con la variable
  `PONYTAIL_DEFAULT_MODE` o `%APPDATA%\ponytail\config.json`.

### Notas de Windows (relevantes aquí)

- Los hooks son **Node/CommonJS**. Como el `package.json` raíz es
  `"type": "module"`, un `package.json` en `.claude/ponytail/` los devuelve a
  CommonJS (si no, fallarían con `require is not defined`).
- `settings.json` incluye variante `commandWindows` (PowerShell) además de la
  POSIX, y el hook de modo tiene un fallback anti-bloqueo por si PowerShell no
  entrega el stdin.
- Comprobación rápida: `node .claude/ponytail/hooks/ponytail-activate.js` debe
  salir 0 y emitir el ruleset.

## 3. Agentes de apoyo (opcionales, solo lectura)

Se añadieron **tres** agentes que **refuerzan** el pipeline sin sustituir sus
puertas (`judge`, `mutation_tester`) ni la puerta humana. Son de **solo
lectura**, reportan al `craftsman_lead` y **no tocan `src/`**:

- **`security_reviewer`** — AppSec adaptado al repo (sitio estático + email
  con Resend): secretos, XSS, honeypot, inyección de cabeceras, `pnpm audit`.
  Puerta opcional para features de frontera de confianza (p. ej. `contact_form`).
- **`a11y_seo_auditor`** — WCAG 2.2 AA + SEO sobre el HTML **prerenderizado**
  (`dist/`): skip-link, landmarks, contraste de tokens, `<Head>` por ruta.
- **`mentor`** — explica el **porqué** de decisiones y patrones, para aprender.
  No implementa.

Los convoca el `craftsman_lead` a demanda; no añaden pasos obligatorios al
pipeline (se respeta "una feature a la vez").

### Por qué NO se añadieron architect / backend-dev / frontend-dev / devops / qa / code-reviewer / tech-writer

La plantilla genérica de "Agent Teams" proponía esos 9 roles. No se adoptaron
porque **duplican o contradicen** el arnés y el stack:

- `code-reviewer` ≈ `judge`; `qa` + dev ≈ `tdd_craftsman`; la "arquitectura por
  conversación" ya la cubren `spec_partner`/`gherkin_author`.
- `backend-dev`, `devops-engineer` asumen `src/server`, `prisma`, `Dockerfile`,
  CI… que **este sitio estático (SSG) no tiene**.

## 4. Skills de stack (autoskills)

Las skills del stack (accessibility, seo, react-best-practices, vite, vitest,
typescript-advanced-types, composition-patterns, frontend-design, nodejs-*,
bash-defensive-patterns) las gestiona **autoskills** (`skills-lock.json`,
`.agents/skills/`). Para más skills, se añaden por ese mecanismo, no a mano.

## 5. Verificación adversarial: por qué NO se montó "Agent Teams" tal cual

La plantilla de partida ("Plantilla universal de Agent Teams") venía
desactualizada. Contrastada con la **documentación oficial**
(https://code.claude.com/docs/en/agent-teams) y el entorno real:

1. **`TeamCreate` y `TeamDelete` ya no existen.** La doc oficial (a partir de
   v2.1.178): _"Both tools no longer exist."_ El `team_name` de la herramienta
   Agent _"is accepted but ignored"_. Toda la mecánica de la plantilla
   (`TeamCreate → spawn → TeamDelete`) apuntaba a primitivas retiradas.
2. **Sigue siendo experimental** y **desactivado por defecto**
   (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`).
3. **El multi-panel no funciona en Windows.** Split-panes _"isn't supported in
   VS Code's integrated terminal, Windows Terminal, or Ghostty"_; tmux
   _"works best on macOS"_. Esta máquina es Windows 11. El modo in-process sí
   funciona, pero no el "equipo visible en paneles".
4. **La estructura de la plantilla contradice el repo:** `src/server`,
   `prisma`, `Dockerfile`, `npm` — cuando aquí no hay backend y se usa `pnpm`.
   Y su modelo de "oleadas en paralelo, 5-6 tareas por teammate" es lo opuesto
   a "una feature a la vez, TDD, puerta humana".

### Si algún día se quiere Agent Teams (con la API actual)

Ya no se "crea un equipo": se activa la variable de entorno y se pide en
lenguaje natural, p. ej. _"lanza 3 teammates para revisar el PR, uno de
seguridad, uno de rendimiento, uno de accesibilidad"_. Es útil para
**investigación y revisión en paralelo**, no para implementar features (eso lo
gobierna el pipeline SDD). Los 3 agentes de `.claude/agents/` de solo lectura
se pueden usar como `subagent_type` de esos teammates.
