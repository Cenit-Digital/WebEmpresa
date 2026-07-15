# AGENTS.md — Mapa de navegación para agentes de IA

> Punto de entrada para cualquier agente que trabaje en este repositorio.
> NO es una biblia de reglas: es un **mapa**. Lee solo lo que necesites,
> cuando lo necesites (divulgación progresiva).
>
> Stack: **Vite + React + TypeScript + SCSS + pnpm + SSG** (vite-react-ssg).
> Proceso: **Harness / SDD** — conversación → Gherkin → TDD → review →
> mutación. Ver `docs/workflow.md`.

## 1. Antes de empezar (obligatorio)

1. Ejecuta `./init.sh` (o `pnpm verify`). Si falla, **para** y resuelve el
   entorno antes de tocar código.
2. Lee `progress/current.md` (estado de la última sesión).
3. Lee `feature_list.json`. Toda feature `"sdd": true` recorre el pipeline.
4. Lee `docs/workflow.md` antes de coordinar.

## 2. Mapa del repositorio

| Archivo / carpeta          | Qué contiene                                                              | Cuándo leerlo                     |
| -------------------------- | ------------------------------------------------------------------------- | --------------------------------- |
| `feature_list.json`        | Tareas con estado (`pending`/`spec_ready`/`in_progress`/`done`/`blocked`) | Siempre                           |
| `progress/current.md`      | Estado de la sesión actual                                                | Siempre                           |
| `progress/history.md`      | Bitácora append-only                                                      | Si necesitas contexto             |
| `scripts/sync-memoria.sh`  | Memoria organizacional: patrones validados de la org en `.memoria-cache/` | Al arrancar sesión (paso 2bis)    |
| `project-spec.md`          | Spec conversada por feature                                               | Antes de Gherkin o de implementar |
| `features/<name>.feature`  | Escenarios Gherkin (contrato aprobado por el humano)                      | Antes del ciclo TDD               |
| `docs/workflow.md`         | El pipeline completo                                                      | Antes de coordinar                |
| `docs/tdd.md`              | Las Tres Leyes; Rojo-Verde-Refactor (Vitest)                              | Antes de escribir código          |
| `docs/gherkin.md`          | Cómo escribir `.feature`; de Gherkin a test                               | Antes de redactar escenarios      |
| `docs/mutation-testing.md` | Stryker; umbral; cómo correr la mutación                                  | Antes de validar la suite         |
| `docs/architecture.md`     | Capas del proyecto y qué es "buen trabajo"                                | Antes de implementar              |
| `docs/conventions.md`      | Estilo, nombres, estructura (alineado a RF-CODE-001)                      | Antes de escribir código          |
| `docs/verification.md`     | Cómo demostrar que funciona                                               | Antes de declarar `done`          |
| `docs/tooling.md`          | Skills (ponytail), hooks y agentes de apoyo; verificación adversarial     | Para entender el tooling          |
| `docs/autonomous.md`       | El bot de mantenimiento: qué puede tocar y qué NO (nunca `src/`)          | Si eres ese bot, o lo revisas     |
| `CHECKPOINTS.md`           | Criterios objetivos de "estado final correcto"                            | Para auto-evaluarte               |
| `.claude/agents/`          | Subagentes: 6 del pipeline + 3 de apoyo (opcionales, solo lectura)        | Si orquestas                      |
| `src/`                     | Código de la aplicación (React + TS + SCSS)                               | Para implementar                  |
| `src/**/*.test.ts(x)`      | Tests (Vitest + Testing Library), co-locados                              | Para verificar                    |

## 3. Reglas duras (no negociables)

- **Una sola feature a la vez.**
- **No declares `done`** sin tests verdes **y** umbral de mutación superado
  (`pnpm test` y `pnpm mutation`).
- **No saltes** la conversación de spec ni la destilación Gherkin para
  features `"sdd": true`.
- **No saltes la puerta humana** sobre los `.feature`.
- **TDD estricto: un test a la vez** (`docs/tdd.md`).
- **Documenta** en `progress/current.md` mientras trabajas.
- **Deja el repo limpio** antes de cerrar (sin `console.log` de debug, sin TODOs sin contexto).
- **Si no sabes algo, busca en `docs/`** antes de inventarlo.

## 4. Pipeline

```
pending → [spec_partner] → project-spec.md
        → [gherkin_author] → features/<name>.feature (spec_ready)
        → ⏸ HUMANO APRUEBA
        → in_progress → [tdd_craftsman] Rojo-Verde-Refactor
        → [judge] review → [mutation_tester] Stryker → done
```

## 5. Cierre de sesión

1. `./init.sh` verde (typecheck + lint + test).
2. Mutación sobre lo tocado por encima del umbral.
3. Si la tarea acabó: `status: "done"` en `feature_list.json`.
4. Mueve el resumen de `progress/current.md` a `progress/history.md`.
5. Vacía `progress/current.md` (deja la plantilla).

## 6. Si te bloqueas

Relee la sección de `docs/` correspondiente. Si una herramienta no hace lo
que esperas, **no inventes un workaround**: documenta el bloqueo en
`progress/current.md` y para.
