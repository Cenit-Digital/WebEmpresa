# El flujo Harness / SDD (estilo Uncle Bob)

> Conversar la spec, destilarla en escenarios Gherkin, tallar el código con
> TDD estricto, podar con juicio y validar con prueba de mutación. El código
> de cada feature es lo de menos; lo que da calidad es el _proceso_.

## El pipeline de un vistazo

```
pending
  │  spec_partner    — CONVERSACIÓN  ─────────►  project-spec.md
  │  gherkin_author  — DESTILACIÓN   ─────────►  features/<name>.feature
  ▼  ⏸  PUERTA HUMANA: el humano aprueba los escenarios (el contrato)
in_progress
  │  tdd_craftsman   — ROJO → VERDE → REFACTOR ►  src/ + *.test.ts(x)
  │  judge           — REVIEW                  ►  progress/judge_<name>.md
  │  mutation_tester — MUTACIÓN (Stryker)      ►  progress/mutation_<name>.md
  ▼
done
```

Una sola feature a la vez. Una sola puerta de aprobación humana: sobre los
escenarios Gherkin, **antes** de escribir producción.

## Por qué este orden

1. **La spec nace de una conversación, no de un dictado.** El `spec_partner`
   debate casos límite, contratos y alternativas. El resultado,
   `project-spec.md`, es el acuerdo razonado.
2. **Gherkin convierte la prosa en contrato ejecutable.** Cada comportamiento
   es un `Scenario` con `Given/When/Then`. Esto es lo que el humano firma.
3. **La puerta humana va sobre el contrato, no sobre el código.** Aprobar el
   `.feature` es barato; aprobar tarde (con código hecho) es caro.
4. **TDD estricto: un test a la vez** (`docs/tdd.md`). El código que ningún
   test pidió no existe.
5. **El review es el juego entero.** Generar borradores es barato; el juicio
   que poda es el valor escaso. El `judge` no edita: poda.
6. **La validación es compute-bound.** Una suite verde solo dice que el código
   no explota. La mutación (Stryker) introduce defectos y exige que algún test
   falle. Cara en CPU, pero es la medida real de si la red atrapa peces.

## Mapa de artefactos (quién escribe qué)

| Archivo                       | Lo escribe           | Contiene                                         |
| ----------------------------- | -------------------- | ------------------------------------------------ |
| `project-spec.md`             | spec_partner         | Spec conversada: propósito, contrato, decisiones |
| `features/<name>.feature`     | gherkin_author       | Escenarios Gherkin `@s1..@sn` (contrato firmado) |
| `src/`, `*.test.ts(x)`        | tdd_craftsman        | Código y tests, tallados por TDD                 |
| `progress/tdd_<name>.md`      | tdd_craftsman        | Bitácora de ciclos + mapa `@s → test`            |
| `progress/judge_<name>.md`    | judge                | Veredicto de review + checkpoints                |
| `progress/mutation_<name>.md` | mutation_tester      | Score de mutación + mutantes sobrevivientes      |
| `feature_list.json`           | lead / tdd_craftsman | `pending → spec_ready → in_progress → done`      |
