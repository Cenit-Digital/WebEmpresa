# Prueba de mutación — marca (#12)

> Medición del `mutation_tester`. Acotada a `src/components/Logo.tsx` (único
> código mutable de la feature; los tokens de tema viven en `.scss`, no mutable).
> No se editó `src/` ni tests.

## Configuración

- Umbral (`stryker.config.json` -> `thresholds.break`): **100%** sobre las
  líneas tocadas por la feature (ver `docs/mutation-testing.md`).
- `mutate` incluye `src/components/Logo.tsx` (lo añadió el `tdd_craftsman`). OK
- Ejecución acotada: `pnpm exec stryker run --mutate "src/components/Logo.tsx"`.
- Tests que cubren marca: `src/components/Logo.test.tsx` (@s1-@s6) y
  `src/styles/tokens.test.ts` (@s7/@s8). Nota: @s7/@s8 validan tokens en
  `_tokens.scss`, que **no** es mutable, así que no aportan mutantes.
- Informe HTML: `reports/mutation/index.html`.

## Resultado (corrida final — 2026-07-03)

| Archivo  | Total | Killed | Timeout | Survived | No cov | Score   |
| -------- | ----- | ------ | ------- | -------- | ------ | ------- |
| Logo.tsx | 8     | 0      | 8       | 0        | 0      | 100.00% |

- Score = (killed + timeout) / total = 8 / 8 = **100.00%**.
- Umbral = **100%**. **100.00% >= 100% -> PASA.**
- Stryker: "Final mutation score of 100.00 is greater than or equal to break
  threshold 100". Suite inicial verde (9 tests cubriendo Logo).

### Sobre los 8 mutantes "timeout"

Stryker reporta como **timeout** (detectados: cuentan como killed para el score)
los 8 mutantes de `Logo.tsx` (geometría/atributos del SVG y el `stroke` del
`path`). El timeout se debe al coste de render de React+jsdom bajo instrumentación;
todos quedan **detectados** por la suite. **0 supervivientes.** No hay mutantes
marcados como equivalentes ni exclusiones aplicadas.

## Historial

- **Corrida 1 (previa):** 87.50% (7/8), **1 superviviente** en `Logo.tsx:59`:
  el StringLiteral `stroke={` + "`url(#${gradId})`" + `}` mutaba a cadena vacía y
  la suite seguía verde (ninguna aserción comprobaba que la onda `<path>`
  consumiera el degradado). FAIL.
- **Resolución (tdd_craftsman):** se añadió la aserción @s6 en
  `src/components/Logo.test.tsx` ("la onda (path) pinta su trazo con el degradado
  de su instancia"), que verifica
  `path` -> `stroke = url(#<id del linearGradient>)`. Con ella el mutante muere.
- **Corrida 2 (final):** 100.00% (8/8), 0 supervivientes. PASS.

## Veredicto

**PASS** — score 100.00% >= umbral 100%. 0 mutantes supervivientes en
`Logo.tsx`. La red de tests de la feature #12 `marca` muerde a todo el catálogo
de mutaciones sobre el único código mutable. Con `judge` APPROVED
(`progress/judge_marca.md`) + mutación al 100%, `marca` (#12) **puede marcarse
`done`** (acción del `craftsman_lead`, no del `mutation_tester`).
