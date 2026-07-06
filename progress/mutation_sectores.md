# Prueba de mutación — Sectores (#8)

- **Fecha:** 2026-07-06
- **Comando:** `pnpm exec stryker run --mutate "src/components/Sectores.tsx"`
- **Archivo mutado:** `src/components/Sectores.tsx` (SectorIcon.tsx excluido: decorativo, no está en `mutate`)
- **Tests:** `src/components/Sectores.test.tsx` (+ cobertura cruzada en `pages/home.test.tsx`)
- **Umbral:** `break: 100` (100% sobre las líneas tocadas)

## Resultado

| Métrica            | Valor       |
| ------------------ | ----------- |
| Mutantes generados | 15          |
| Killed             | 15          |
| Survived           | 0           |
| Timeout            | 0           |
| Sin cobertura      | 0           |
| Errores            | 0           |
| **Score**          | **100.00%** |

Final mutation score 100.00 ≥ break threshold 100.

## Supervivientes

Ninguno.

## Veredicto

**PASS** — score 100% ≥ umbral 100%, 0 supervivientes.

Informe HTML: `reports/mutation/index.html`.
