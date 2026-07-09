# Mutación — feature #15 `servicios_scroll_reveal`

**Veredicto: PASS** — puntuación **100.00%**, umbral `break: 100` cumplido.

Fecha: 2026-07-09 · Herramienta: StrykerJS 9.6 (runner Vitest, `coverageAnalysis: perTest`).
Comando (acotado a los ficheros de la feature):

```bash
pnpm exec stryker run --mutate "src/lib/useReveal.ts,src/components/Servicios.tsx"
```

## Puntuación por fichero

| Fichero | Score | Killed | Timeout | Survived | No cov |
|---|---|---|---|---|---|
| `src/components/Servicios.tsx` | **100.00%** | 52 | 0 | 0 | 0 |
| `src/lib/useReveal.ts` | **100.00%** | 11 | 4 | 0 | 0 |
| **Total** | **100.00%** | **63** | **4** | **0** | **0** |

- Mutantes generados: 70 · testeados: 67 · **sobrevivientes: 0**.
- Los 4 *timeout* (todos en `useReveal.ts`) cuentan como **muertos**: el mutante
  provoca un bucle/observación que no termina y Stryker lo detecta. No son agujeros.

## Mutantes sobrevivientes

**Ninguno.** No hay trabajo pendiente para el `tdd_craftsman`.

## Mutantes excluidos (70 generados − 67 testeados = 3)

Los 3 mutantes no testeados están **deshabilitados a propósito** por el
comentario ya presente en producción (`useReveal.ts` líneas 18-19):

```ts
// Stryker disable next-line all
if (!root) return
```

Justificación (equivalente/defensivo genuino): `ref.current` está garantizado no
nulo tras el montaje del efecto en React (el `ref` se cablea al DOM antes de que
corra `useEffect`), por lo que la rama `!root` es un guard defensivo inalcanzable
en el test. Mutarlo no cambia el comportamiento observable y no se puede matar sin
falsear el entorno. Exclusión heredada del `tdd_craftsman`, no introducida aquí.

## Informe

HTML: `reports/mutation/index.html`.
