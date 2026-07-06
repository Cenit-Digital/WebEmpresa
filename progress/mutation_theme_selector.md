# Prueba de mutación — feature `theme_selector` (#3)

- Fecha: 2026-07-06
- Rama: feat/design-system
- Herramienta: StrykerJS + runner Vitest (`coverageAnalysis: perTest`)
- Comando ejecutado: `pnpm exec stryker run --mutate "src/lib/theme.ts"`
- Umbral (`stryker.config.json`): `thresholds.break = 100` (100% sobre las líneas tocadas)
- Alcance: lógica pura de la feature, `src/lib/theme.ts` (ya presente en el
  `mutate` de `stryker.config.json`). Tests que la cubren: `src/lib/theme.test.tsx`
  y `src/components/ThemeToggle.test.tsx`.
- Pre-condición: judge APPROVED (`progress/judge_theme_selector.md`).

## Resultado

Encontrado 1 de 208 ficheros a mutar. Instrumentado 1 fichero con **49 mutantes**.
Suite inicial (dry run): **37 tests verdes**. Media de 2.06 tests por mutante.

| Fichero            | Score  | # killed | # timeout | # survived | # no cov | # errors | Umbral | Veredicto |
|--------------------|--------|----------|-----------|------------|----------|----------|--------|-----------|
| `src/lib/theme.ts` | 100.00 | 47       | 2         | 0          | 0        | 0        | 100    | PASA      |
| **All files**      | 100.00 | 47       | 2         | 0          | 0        | 0        | 100    | PASA      |

> Los 2 `timeout` cuentan como mutantes muertos (bucle infinito detectado por el
> runner = defecto detectado). No son supervivientes.

Stryker confirma:
"Final mutation score of 100.00 is greater than or equal to break threshold 100".

Informe HTML: `reports/mutation/index.html`.

## Supervivientes

**Ninguno.** `# survived = 0`. Los 49 mutantes de `src/lib/theme.ts`
(comparaciones, igualdades, booleanos, literales de cadena de la query
`prefers-color-scheme`, `return`, ramas de `try/catch`) fueron detectados por la
suite. Nada que delegar al `tdd_craftsman`.

## Mutantes equivalentes excluidos

Ninguno. No se aplicó ninguna exclusión.

## Veredicto

**PASS** — score **100.00%** en `src/lib/theme.ts`, >= umbral `break=100`. La red
de tests muerde: cada defecto introducido en la lógica pura del selector de tema
hace fallar al menos un test. No hay agujeros en la cobertura de la feature.

Se puede marcar `theme_selector` (#3) como **done** desde la puerta de mutación
(la lógica pura de la feature está validada al 100%). Nota de trazabilidad: la UI
`src/components/ThemeToggle.tsx` figura también en el `mutate` de
`stryker.config.json` y fue validada al 100% en una corrida previa registrada en
el historial de este mismo informe; esta corrida acota expresamente a
`src/lib/theme.ts` según la tarea encargada.
