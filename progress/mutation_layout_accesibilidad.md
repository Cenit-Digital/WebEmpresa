# Prueba de mutación — layout_accesibilidad (#5)

- Fecha: 2026-07-06
- Comando: `pnpm exec stryker run --mutate "src/lib/seo.ts,src/components/Layout.tsx"`
- Umbral: `thresholds.break = 100` (100% sobre líneas tocadas)
- Informe HTML: `reports/mutation/index.html`

## Resultado

**FAIL** — score global **92.31%** (12 killed / 13 total, 1 sobreviviente).

| Fichero                     | Score   | Killed | Survived |
| --------------------------- | ------- | ------ | -------- |
| `src/lib/seo.ts`            | 100.00% | 8      | 0        |
| `src/components/Layout.tsx` | 80.00%  | 4      | 1        |

## Supervivientes

### 1. `src/components/Layout.tsx:11:5` — OptionalChaining

```diff
-       document.getElementById('contenido')?.focus()
+       document.getElementById('contenido').focus()
```

- **Mutación:** Stryker elimina el encadenamiento opcional (`?.` → `.`).
- **Por qué sobrevive:** el test `@s2` ("activar el enlace de salto mueve el
  foco al destino #contenido") ejecuta la línea con `#contenido` presente en
  el DOM, así que `getElementById` nunca devuelve `null` y ambas versiones
  (`?.focus()` y `.focus()`) se comportan igual. El comportamiento diferencial
  del `?.` solo emerge cuando el elemento **no existe**: la versión original no
  lanza, la mutada lanzaría `TypeError`.
- **Test que falta (para el `tdd_craftsman`):** un caso rojo que invoque
  `focusContent` (click en "Saltar al contenido") **sin** el elemento
  `#contenido` en el DOM y verifique que no se lanza excepción
  (`expect(...).not.toThrow()`). Ese test mata al mutante.
- **¿Equivalente?** NO. La guarda `?.` tiene comportamiento observable distinto
  (no lanzar vs. lanzar) cuando el destino está ausente; es defecto legítimo,
  no mutante equivalente. No se excluye.

## Veredicto

FAIL — 92.31% < 100%. 1 mutante sobreviviente en `Layout.tsx:11`. Devolver al
`tdd_craftsman` para escribir el test rojo que lo mate y reejecutar el `judge`.
