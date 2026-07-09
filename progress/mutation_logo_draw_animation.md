# Mutación — logo_draw_animation (#14)

- Fecha: 2026-07-09
- Comando: `pnpm exec stryker run --mutate "src/components/Logo.tsx,src/components/Hero.tsx"`
- Alcance: `src/components/Logo.tsx`, `src/components/Hero.tsx`
- Tests: `src/components/Logo.test.tsx`, `src/components/Hero.test.tsx` (+ Footer/Header como no-regresión)
- Umbral (`docs/mutation-testing.md` / `stryker.config.json`): `break: 100`
- Superficie: solo TS mutable (ramas de la prop `animated` en Logo y el círculo
  de contorno del arco en Hero). El resto de la feature es SCSS, no mutable por Stryker.

## Resultado

| Archivo   | Score   | Killed | Survived | Timeout | No cov | Errors |
| --------- | ------- | ------ | -------- | ------- | ------ | ------ |
| All files | 100.00% | 10     | 0        | 5       | 0      | 0      |
| Hero.tsx  | 100.00% | 2      | 0        | 0       | 0      | 0      |
| Logo.tsx  | 100.00% | 8      | 0        | 5       | 0      | 0      |

- Mutantes instrumentados: 16; probados: 15 (killed 10 + timeout 5, ambos cuentan
  como detectados) → killed/total = 15/15.
- El mutante nº 16 no se prueba: está excluido con `// Stryker disable next-line all`
  en `Logo.tsx:28-29` sobre `useId().replace(/:/g, '')`. Justificación de
  equivalencia: React 19 `useId()` no emite `:`, por lo que el `replace` es un
  no-op defensivo; mutar su reemplazo no altera el comportamiento observable.
- Sobrevivientes: **ninguno**.
- Stryker: `Final mutation score of 100.00 is greater than or equal to break threshold 100`.

## Veredicto

**PASS** — 100.00% ≥ 100 (break). Sin mutantes sobrevivientes; no hay trabajo
pendiente para el `tdd_craftsman`.

> Informe HTML: `reports/mutation/index.html`.
