# Mutación — feature `servicios` (#7)

- **Fecha**: 2026-07-06
- **Comando**: `pnpm exec stryker run --mutate "src/components/Servicios.tsx"`
- **Alcance**: `src/components/Servicios.tsx` (en `mutate` de `stryker.config.json`).
  Los mockups decorativos `ServiceMockup.tsx` / `CheckIcon.tsx` quedan **fuera**
  de `mutate` por decisión de diseño (decorativos) — no se incluyen.
- **Tests**: `src/components/Servicios.test.tsx` (10 tests, run inicial verde).

## Resultado

| Métrica              | Valor       |
| -------------------- | ----------- |
| Mutation score       | **100.00%** |
| Umbral (`break`)     | 100         |
| Mutantes totales     | 52          |
| Killed               | 38          |
| Timeout (detectados) | 14          |
| **Survived**         | **0**       |
| No cover / errors    | 0 / 0       |

## Supervivientes

Ninguno. No hay agujeros en la red de tests para `Servicios.tsx`.

## Veredicto

**PASS** — 100.00% ≥ 100 (break). Sin mutantes sobrevivientes.
No se excluyó ningún mutante equivalente.

Informe HTML: `reports/mutation/index.html`
