# Prueba de mutación — validar que los tests muerden

> Una suite verde dice "el código no explota con estas entradas". **No** dice
> "los tests fallarían si el código estuviera mal". La mutación lo mide al
> revés: introduce un defecto y observa si algún test falla.

- Si **algún test falla** → mutante **muerto** (killed). Bien.
- Si **todos pasan** → mutante **sobrevive** (survived). Hay un agujero.

**Puntuación de mutación** = `killed / total`.

## La herramienta: Stryker

Usamos **StrykerJS** con el runner de Vitest (`@stryker-mutator/vitest-runner`).
Configuración en `stryker.config.json`.

```bash
pnpm mutation          # corre Stryker sobre el glob `mutate`
```

Stryker aplica un catálogo de mutaciones (comparación `<=`→`<`, igualdad
`===`→`!==`, aritmética, booleanos, literales de cadena, `return x`→
`return undefined`, …), reejecuta la suite por cada mutante y reporta
`killed/total = score`. El informe HTML queda en `reports/mutation/`.

## El umbral

- `stryker.config.json` fija `thresholds.break: 100`: la build **falla** por
  debajo del 100% sobre los archivos del `mutate`.
- El `mutate` apunta a los archivos **tocados por la feature**. El
  `tdd_craftsman` añade los suyos al glob; el `mutation_tester` valida.
- Un mutante **equivalente** genuino (no cambia el comportamiento observable)
  puede excluirse, pero **solo** con justificación explícita en
  `progress/mutation_<name>.md`. Abusar de esta vía es hacer trampa al juez.

## Quién hace qué

- El `mutation_tester` **mide** y reporta; no edita código.
- Un mutante sobreviviente es trabajo del `tdd_craftsman`: escribe el test
  rojo que lo mata y vuelve a pasar por el `judge`.
