# ponytail — vendorizado en el repositorio

Este directorio contiene una copia **íntegra** de [ponytail](https://github.com/DietrichGebert/ponytail)
(el "lazy senior dev"), incorporada al repo en lugar de instalarla como plugin
de Claude Code. Motivo: el plugin requiere `/plugin marketplace add …`, que es
un comando interactivo del host que un agente no puede ejecutar; vendorizarlo
lo deja **versionado, portable y activo** sin depender de una instalación
global de la máquina.

## Procedencia

- **Fuente:** https://github.com/DietrichGebert/ponytail
- **Versión:** 4.8.4 (`.claude-plugin/plugin.json`)
- **Commit:** `40e50d9e03242aa5dd53ac771950f9127362b25f`
- **Licencia:** MIT (ver `LICENSE` en este directorio). Copyright (c) 2026 DietrichGebert.

## Qué se copió

- `hooks/*.js` — los hooks de ciclo de vida (Node, CommonJS), tal cual upstream.
- `hooks/ponytail-statusline.{ps1,sh}` — badge opcional de la statusline (no lo cablea nadie por defecto).
- Las 6 skills viven en `../skills/ponytail*/SKILL.md` (ubicación que Claude Code
  descubre nativamente, para que `/ponytail`, `/ponytail-review`, etc. funcionen).

## Adaptaciones mínimas (documentadas, no ocultas)

Solo **dos** cambios respecto a upstream, ambos necesarios para vendorizar dentro
de un paquete `"type": "module"`:

1. **`package.json` (nuevo, este directorio):** `{"type":"commonjs"}`. El
   `package.json` raíz del repo declara `"type": "module"`, lo que haría que
   Node tratara estos hooks (`require()`) como ESM y fallaran con
   `require is not defined`. Node usa el `package.json` más cercano, así que
   este archivo devuelve `.claude/ponytail/**/*.js` a CommonJS sin tocar la
   lógica de los hooks.

2. **`hooks/ponytail-instructions.js` (`SKILL_PATH`):** upstream resolvía la
   skill con un solo `..` (los hooks eran hermanos de `skills/`). Aquí los hooks
   están en `.claude/ponytail/hooks/` y la skill canónica en
   `.claude/skills/ponytail/`, así que la ruta usa dos `..`. Si fallara la
   lectura, `getFallbackInstructions()` mantiene el ruleset vivo igualmente.

## Cómo está cableado

Los hooks se registran en `.claude/settings.json` (eventos `SessionStart`,
`SubagentStart`, `UserPromptSubmit`), con variante `commandWindows` (PowerShell)
además de la POSIX. Detalle completo y notas de uso en `docs/tooling.md`.

## Actualizar

Volver a clonar upstream a la versión deseada, copiar `hooks/` y `skills/`
encima, y reaplicar las dos adaptaciones de arriba. Verificar con:

```bash
node .claude/ponytail/hooks/ponytail-activate.js   # debe salir 0 y emitir el ruleset
```
