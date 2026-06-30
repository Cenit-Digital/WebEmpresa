# Gherkin — el contrato ejecutable

Los archivos viven en `features/<name>.feature`, donde `<name>` coincide con
el campo `name` de `feature_list.json`. Son lo que el humano aprueba en la
puerta y el mapa que el `tdd_craftsman` recorre.

## Estructura

```gherkin
Feature: <propósito en una frase>
  Como <rol> quiero <capacidad> para <beneficio>.   # contexto opcional

  @s1
  Scenario: <comportamiento observable>
    Given <estado de partida>
    When <acción concreta>
    Then <resultado medible: texto en pantalla / estado / error>

  @s2
  Scenario: <caso límite o error>
    Given ...
    When ...
    Then ...
```

## Reglas duras

- **Un `Scenario` por comportamiento observable**, incluidos los errores.
- **Tags estables** `@s1`, `@s2`, … Son el identificador que el
  `tdd_craftsman` (mapa `@s → test`) y el `judge` (cobertura) citan.
- **Cada `Then` afirma algo medible.** Prohibido "funciona". Vale: "Then el
  `<title>` es exactamente `Aviso legal — Cénit Digital`", "Then se muestra el
  rol `button`", "Then `data-theme` del documento es `dark`".
- **Un solo `When` por escenario.**
- **Sin detalles de implementación.** El `.feature` describe comportamiento.

## De Gherkin a test (Vitest)

No usamos un runner BDD (cucumber) por defecto para no añadir peso: cada
`Scenario` se traduce **a mano** a un test de Vitest cuyo nombre cita el
escenario con su tag. El `it()` empieza por `@sN`:

```ts
it('@s1 sin argumento devuelve solo el nombre del sitio', () => {
  /* … */
})
```

Así el `.feature` sigue siendo la fuente de verdad legible por el humano y la
trazabilidad `@s → test` es directa (buscable por el `judge`). Si en algún
módulo se prefiere un runner Gherkin real, documéntalo en `project-spec.md`.
