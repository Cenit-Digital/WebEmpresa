# Mutación — Hero (#6)

- Fecha: 2026-07-06
- Comando: `pnpm exec stryker run --mutate "src/components/Hero.tsx"`
- Alcance: `src/components/Hero.tsx`
- Tests: `src/components/Hero.test.tsx`
- Umbral (`docs/mutation-testing.md` / `stryker.config.json`): `break: 100`

## Resultado

| Archivo  | Score   | Killed | Survived | Timeout | No cov | Errors |
| -------- | ------- | ------ | -------- | ------- | ------ | ------ |
| Hero.tsx | 100.00% | 2      | 0        | 0       | 0      | 0      |

- Mutantes generados: 2 (ambos con cobertura, ambos muertos).
- Sobrevivientes: **ninguno**.
- Stryker: `Final mutation score of 100.00 is greater than or equal to break threshold 100`.

## Veredicto

**PASS** — 100% ≥ 100 (break). No hay mutantes sobrevivientes; no hay trabajo
pendiente para el `tdd_craftsman`.

> Informe HTML: `reports/mutation/index.html`.
