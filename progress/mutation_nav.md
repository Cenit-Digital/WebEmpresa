# Prueba de mutación — feature `nav` (#2)

Fecha: 2026-07-06 (re-validación fresca del `mutation_tester`)
Herramienta: StrykerJS 9.6 + runner Vitest (`coverageAnalysis: perTest`)
Rama: `feat/design-system`
Umbral (`stryker.config.json` -> `thresholds.break`): **100%** sobre los
archivos del `mutate` (ver `docs/mutation-testing.md`). No se editó `src/` ni tests.

## Pre-condiciones verificadas

- `judge` APPROVED -> `progress/judge_nav.md` (init.sh verde, 64 tests, @s1–@s8 cubiertos).
- Los 4 ficheros mutables de nav están en el `mutate` de `stryker.config.json`:
  `src/lib/nav.ts`, `src/lib/useIsMobile.ts`, `src/components/HeaderNav.tsx`,
  `src/components/MobileMenu.tsx`.

## Comando (acotado a los 4 ficheros de la feature)

```bash
pnpm exec stryker run --mutate "src/lib/nav.ts,src/lib/useIsMobile.ts,src/components/HeaderNav.tsx,src/components/MobileMenu.tsx"
```

- 4 ficheros mutados, **32 mutantes** instrumentados.
- Test run inicial: **17 tests**, éxito (dry run verde).
- Media: 1.38 tests por mutante.

## Resultado por fichero

| Fichero                       | Score       | Killed | Timeout | Survived | No cov |
| ----------------------------- | ----------- | ------ | ------- | -------- | ------ |
| src/components/HeaderNav.tsx  | 100.00%     | 5      | 0       | 0        | 0      |
| src/components/MobileMenu.tsx | 100.00%     | 2      | 0       | 0        | 0      |
| src/lib/nav.ts                | 100.00%     | 16     | 0       | 0        | 0      |
| src/lib/useIsMobile.ts        | 100.00%     | 5      | 4       | 0        | 0      |
| **All files**                 | **100.00%** | 28     | 4       | 0        | 0      |

> Los 4 timeouts de `useIsMobile.ts` cuentan como mutantes **muertos** (killed) a
> efectos de score: la suscripción/lectura del store con `matchMedia` mockeado
> hace que el defecto no termine, y la suite lo detecta. No son supervivientes.

## Mutantes supervivientes

**Ninguno.** 0 supervivientes sobre 32 mutantes (28 killed + 4 timeout).
0 mutantes sin cobertura. No aplica exclusión de equivalentes (no hubo
supervivientes que justificar).

## Veredicto

Score total **100.00% >= break 100** (umbral). Stryker confirma:
`Final mutation score of 100.00 is greater than or equal to break threshold 100`.

**PASS.** La red de tests de la feature #2 `nav` muerde a todo el catálogo de
mutaciones sobre su código mutable. Con `judge` APPROVED (`progress/judge_nav.md`)

- mutación al 100%, la feature `nav` (#2) **puede marcarse `done`** (acción del
  `craftsman_lead`, no del `mutation_tester`).

Informe HTML: `reports/mutation/index.html`
