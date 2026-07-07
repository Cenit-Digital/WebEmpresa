# Prueba de mutación — fidelidad_referencia (#13)

**Estado:** PASS
**Umbral:** 100% (`thresholds.break: 100`) sobre los ficheros tocados por la feature.
**Herramienta:** StrykerJS 9.6.0 + vitest-runner, `coverageAnalysis: perTest`.
**Fecha:** 2026-07-07
**Rama:** feat/design-system

## Alcance (acotado a los 4 ficheros de #13)

Ejecución con override de CLI (no los 16 del `mutate` del config; los otros 12 no
se tocaron y ya estaban en 100%):

```
pnpm exec stryker run --mutate "src/lib/theme.ts,src/components/ThemeToggle.tsx,src/components/HeaderNav.tsx,src/components/Hero.tsx"
```

Stryker instrumentó 4 ficheros con **98 mutantes**. Test run inicial verde
(66 tests cubren estos ficheros). Informe HTML: `reports/mutation/index.html`.

## Resultado global

**Mutation score = 100.00%** — `killed+timeout / total = 98/98`.
**0 sobrevivientes · 0 sin cobertura · 0 errores.** break(100) satisfecho.

| Fichero            | Score  | # killed | # timeout | # survived | # no cov |
|--------------------|--------|----------|-----------|------------|----------|
| src/lib/theme.ts            | 100.00 | 54 | 0 | 0 | 0 |
| src/components/ThemeToggle.tsx | 100.00 | 35 | 0 | 0 | 0 |
| src/components/Hero.tsx        | 100.00 |  2 | 0 | 0 | 0 |
| src/components/HeaderNav.tsx   | 100.00 |  2 | 5 | 0 | 0 |
| **All files**               | **100.00** | **93** | **5** | **0** | **0** |

> Los 5 mutantes `timeout` (todos en `HeaderNav.tsx`) cuentan como muertos: el
> mutante provoca timeout del runner = detectado. No son sobrevivientes.

## Mutantes sobrevivientes

Ninguno. Nada que delegar al `tdd_craftsman`.

## Mutantes equivalentes excluidos

Ninguno. No se aplicó ninguna exclusión ni `// Stryker disable`.

## Veredicto

**PASS.** 100% sobre los 4 ficheros tocados por #13, 0 sobrevivientes. La puerta
de mutación (C7) queda satisfecha; la feature puede marcarse `done`.
