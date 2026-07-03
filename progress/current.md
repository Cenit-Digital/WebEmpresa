# progress/current.md — sesión activa

> Estado vivo de la sesión. Vacíalo (deja esta plantilla) al cerrar y mueve el
> resumen a `progress/history.md`.

**Feature en curso:** — (sesión de **tooling**, no de feature SDD)
**Escenarios:** —

## Bitácora

- Tooling del arnés (rama `feat/harness-tooling-ponytail`). Decisión: **reforzar
  el harness SDD, no reemplazarlo**. No se tocó `src/` ni tests ni el pipeline.
- **ponytail** vendorizado (`.claude/ponytail/`, MIT v4.8.4) + 6 skills en
  `.claude/skills/` + hooks `SessionStart`/`SubagentStart`/`UserPromptSubmit` en
  `.claude/settings.json`. Activo por defecto (nivel `full`). Verificado en Windows.
- Adaptación clave: `package.json` en `.claude/ponytail/` con `"type":"commonjs"`
  (el repo raíz es `"type":"module"`, que rompería los hooks `require()`).
- **3 agentes de apoyo** (solo lectura, opcionales): `security_reviewer`,
  `a11y_seo_auditor`, `mentor`. No sustituyen `judge`/`mutation_tester`.
- Verificación adversarial de la plantilla "Agent Teams": `TeamCreate`/`TeamDelete`
  retirados (doc oficial v2.1.178), experimental, sin paneles en Windows, estructura
  backend/Prisma incompatible con el sitio SSG. Documentado en `docs/tooling.md`.
- `docs/tooling.md` nuevo; `CLAUDE.md` y `AGENTS.md` actualizados con punteros.
