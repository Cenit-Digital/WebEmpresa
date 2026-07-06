# Veredicto del Judge — theme_selector (#3)

**Estado:** APPROVED
**Rama:** feat/design-system
**Contrato:** features/theme_selector.feature (@s1–@s8)
**Fecha:** 2026-07-06

## Verificación del arnés (`./init.sh`)

Verde de punta a punta, exit 0:

- typecheck: sin errores
- lint: 0 warnings
- test: **68 passed** (10 ficheros)

## Cobertura de escenarios (@s → test concreto)

| @s | Escenario | Test que lo verifica | OK |
| --- | --- | --- | --- |
| @s1 | Sin clave + SO oscuro → `dark` | `src/lib/theme.test.tsx` › applyInitialTheme › `@s1` (línea 125) | ✅ |
| @s2 | Sin clave + SO claro → `light` | `src/lib/theme.test.tsx` › applyInitialTheme › `@s2` (línea 131) | ✅ |
| @s3 | Elegir "Claro" fija y persiste | `ThemeToggle.test.tsx` › `@s3` UI (66) + `theme.test.tsx` › setMode › `@s3` (146) | ✅ |
| @s4 | Elegir "Oscuro" fija y persiste | `ThemeToggle.test.tsx` › `@s4` UI (75) + `theme.test.tsx` › setMode › `@s4` (153) | ✅ |
| @s5 | Elegir "Sistema" borra clave y sigue al SO | `ThemeToggle.test.tsx` › `@s5` (83) + `theme.test.tsx` › setMode › `@s5` x2 (160/168) | ✅ |
| @s6 | Sistema reacciona en vivo sin recargar | `ThemeToggle.test.tsx` › `@s6` reacciona (92) + `@s6` limpia listener fuera de Sistema (104) | ✅ |
| @s7 | La preferencia sobrevive a la recarga | `theme.test.tsx` › applyInitialTheme › `@s7` (137) + `ThemeToggle.test.tsx` › `@s7` (58) | ✅ |
| @s8 | Anti-FOUC antes del primer pintado | `theme.test.tsx` › initialThemeAttribute 5 casos (187–205) + regresión que lee `index.html` (207) | ✅ |

Los 8 escenarios tienen al menos un test concreto y medible. Los fakes de
`matchMedia` van keyeados al literal `'(prefers-color-scheme: dark)'`
(anti-tautología: si producción mutara la query, el test muere). Los tests de
@s3/@s5 fijan el SO contrario a la elección, demostrando que la preferencia
del usuario gana al sistema.

Sobre @s8: jsdom no ejecuta el script inline del `index.html`, por lo que la
mecánica anti-FOUC se cubre por dos vías válidas: la función pura
`initialThemeAttribute` (réplica endurecida del script, todas las ramas) y un
test de regresión que confirma que `documentElement.dataset.theme` aparece en
el HTML **antes** del `<script type="module">`. El script inline
(`index.html:13–26`) espeja exactamente la lógica de la función pura. Estrategia
razonable dada la limitación del entorno.

## Disciplina TDD

`progress/tdd_theme_selector.md` documenta ciclos Rojo→Verde→Refactor por
escenario, con nota honesta sobre la restauración de artefactos por OneDrive y
la consolidación posterior. Cada función de producción está exigida por al
menos un test:

- `systemPrefersDark`, `applyTheme`, `getStoredMode`, `resolveTheme`,
  `applyInitialTheme`, `setMode`, `initialThemeAttribute` → todas con tests
  directos (incluidas ramas de error de `localStorage`).
- `ThemeToggle`: radiogroup, aplicación en `useEffect`, alta/baja del listener
  y `choose` → cubiertos.

No se encontró producción que ningún test rojo pidiera. El orphan
`src/lib/theme.test.ts` (sesión previa) ya no existe.

## Calidad (lente de artesano)

- **Arquitectura respetada:** la lógica de negocio vive pura en
  `src/lib/theme.ts` (sin JSX); `ThemeToggle.tsx` solo compone UI. `lib` no
  importa de `components`/`pages`. Conforme a `docs/architecture.md`.
- **`data-theme` siempre resuelto:** `applyTheme` solo acepta `ResolvedTheme`;
  `resolveTheme` mapea `'system'` a `light`/`dark`. Nunca se escribe `'system'`.
- **Persistencia `cenit-theme`:** ausencia/valor inválido → `'system'`
  (`getStoredMode`); `setMode('system')` hace `removeItem`. Contrato de
  ausencia=Sistema correcto.
- **Contrato de errores:** `getStoredMode`/`setMode` envuelven `localStorage`
  en try/catch (navegación privada / storage bloqueado) con fallback a
  Sistema / aplicación en memoria. Tests lo cubren.
- **Colores solo vía tokens:** `ThemeToggle.module.scss` usa exclusivamente
  `var(--color-…)`, 0 hex. Foco visible con
  `outline: 2px solid var(--color-primary)`.
- Funciones cortas, nombres reveladores, sin `any` injustificado, sin
  `console.log`/TODO, sin números mágicos (`STORAGE_KEY` centralizado).

### Observaciones no bloqueantes

1. El literal `'(prefers-color-scheme: dark)'` se repite en `theme.ts:12` y
   `ThemeToggle.tsx:29` (este último necesita la `MediaQueryList` para el
   listener). Duplicación menor de string; podría extraerse a una constante
   compartida. No bloquea.
2. El `radiogroup` es artesanal (role/aria-checked) y no usa la primitiva
   Radix que sugiere `docs/conventions.md` como guía general. Es accesible
   (grupo etiquetado, roles, `aria-checked`, foco visible) y ningún `@s` exige
   navegación por flechas, así que cumple el contrato firmado. Se anota por si
   se quiere endurecer el patrón WAI-ARIA (roving tabindex) más adelante.

## Checkpoints (CHECKPOINTS.md)

- **C1 — Arnés completo:** [x] `./init.sh` exit 0.
- **C2 — Estado coherente:** [x] única feature `in_progress` (#3);
  `progress/current.md` describe la sesión.
- **C3 — Arquitectura:** [x] módulos previstos; TS estricto sin `any`
  injustificado; sin `console.log`/TODO.
- **C4 — Verificación real:** [x] cada módulo con lógica tiene test;
  `pnpm test` 68 verdes; typecheck+lint sin warnings.
- **C5 — Sesión:** [x] `current.md` refleja theme_selector en curso (cierre
  formal — mover a history + commit — es tarea del LEAD).
- **C6 — Contrato Gherkin:** [x] `.feature` con @s1–@s8, cada `Then` medible,
  cada `@s` mapeado a test, sin producción huérfana.
- **C7 — Mutación:** puerta del `mutation_tester` (posterior a esta
  aprobación). El log reclama 100% sobre `src/lib/theme.ts`; queda por validar
  también `ThemeToggle.tsx`, ya incluido en el `mutate` de `stryker.config.json`.

## Conclusión

El diseño y la cobertura merecen sobrevivir. Los 8 escenarios están verificados
con tests concretos y anti-tautológicos; la lógica de negocio está aislada y
pura; el contrato de persistencia y el de errores son correctos; el arnés
termina verde. Las observaciones son menores y no bloquean.

**APPROVED.** Procede la puerta de mutación (`mutation_tester`).
