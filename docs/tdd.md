# TDD estricto — la disciplina del `tdd_craftsman`

> Un test seguido de su código. **Un test a la vez.** Nunca toda la batería
> por delante.

## Las Tres Leyes del TDD

1. **No escribes producción** salvo para hacer pasar un test que falla.
2. **No escribes más de un test del necesario para fallar** — y que no
   compile o no tipe cuenta como fallar.
3. **No escribes más producción de la necesaria** para pasar ese test.

## El ciclo

```
 ROJO            VERDE                   REFACTOR
 escribe UN  →   el mínimo código    →   limpia en verde:
 test que        que lo pone verde       nombres, duplicación,
 falla                                    funciones cortas
```

- **ROJO** — el test deriva del siguiente `@s` del `.feature`. Verifícalo
  fallando de verdad: `pnpm test`. Un test que pasa a la primera no demuestra
  nada; sospecha del montaje.
- **VERDE** — la implementación **mínima**. Vale "hacer trampa" (devolver una
  constante) si aún no hay test que lo desmienta; el siguiente ciclo fuerza la
  generalización.
- **REFACTOR** — solo en verde. Si algo se pone rojo, no estás refactorizando:
  estás cambiando comportamiento.

## Herramientas

- Runner: **Vitest** (`pnpm test`, `pnpm test:watch`).
- DOM/Componentes: **@testing-library/react** + `jsdom` + `@testing-library/jest-dom`.
- Tests **co-locados**: `src/<área>/<algo>.test.ts(x)` junto al código.

## Trazabilidad obligatoria

Al cerrar, cada `@s` debe estar cubierto por al menos un test. Mapa en
`progress/tdd_<name>.md`:

```markdown
## Trazabilidad

- @s1 (sin argumento → nombre del sitio) → buildPageTitle @s1 …
- @s2 (con título → "<página> — <sitio>") → buildPageTitle @s2 …
```

## Olores que el `judge` busca

- Producción que **ningún test rojo** pidió (viola la Ley 1).
- Tests escritos "a futuro" para escenarios que aún no tocan.
- Refactors hechos en rojo.
- Funciones largas o nombres opacos que sobrevivieron al REFACTOR.
