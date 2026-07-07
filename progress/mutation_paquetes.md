# Prueba de mutación — Paquetes (feature #9)

- Fecha: 2026-07-06
- Comando: `pnpm exec stryker run --mutate "src/components/Paquetes.tsx"`
- Alcance (`mutate`): `src/components/Paquetes.tsx` (en `stryker.config.json`).
  `CheckIcon.tsx` NO está en `mutate` (fuera de alcance).
- Tests: `src/components/Paquetes.test.tsx` (+ cobertura desde `pages/home.test.tsx`).
- Umbral: `thresholds.break = 100` (100% sobre las líneas tocadas).

## Resultado

| Archivo      | Score  | Killed | Timeout | Survived | No cov | Errores | Total |
| ------------ | ------ | ------ | ------- | -------- | ------ | ------- | ----- |
| Paquetes.tsx | 100.00 | 34     | 2       | 0        | 0      | 0       | 36    |

- Puntuación de mutación: **100.00%** (34 killed + 2 timeout de 36).
- Dry run: 9 tests, inicial OK.
- Stryker: "Final mutation score of 100.00 is greater than or equal to break threshold 100".

## Supervivientes

Ninguno. No hay agujeros en la red de tests para `Paquetes.tsx`.

## Mutantes equivalentes excluidos

Ninguno.

## Veredicto

**PASS** — 100% ≥ umbral 100%, 0 supervivientes.

Informe HTML: `reports/mutation/index.html`
