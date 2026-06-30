# CHECKPOINTS — Evaluación del estado final

> En sistemas multi-agente no se evalúa el camino, se evalúa el destino.
> Checkpoints objetivos que un juez (humano o IA) usa para decidir si el
> proyecto está sano.

## C1 — El arnés está completo

- [ ] Existen `AGENTS.md`, `CLAUDE.md`, `init.sh`, `feature_list.json`,
      `progress/current.md`.
- [ ] Existen los docs: `docs/workflow.md`, `tdd.md`, `gherkin.md`,
      `mutation-testing.md`, `architecture.md`, `conventions.md`,
      `verification.md`.
- [ ] `./init.sh` termina con exit code 0.

## C2 — El estado es coherente

- [ ] Como mucho una feature en `in_progress` en `feature_list.json`.
- [ ] Toda feature `done` tiene tests asociados que pasan.
- [ ] `progress/current.md` describe la sesión activa (sin basura previa).

## C3 — El código respeta la arquitectura

- [ ] `src/` solo contiene los módulos previstos en `docs/architecture.md`.
- [ ] TypeScript estricto sin `any` injustificado (RF-CODE-001).
- [ ] No hay `console.log` de debug ni TODOs sin contexto.

## C4 — La verificación es real

- [ ] Cada módulo con lógica tiene al menos un test (`*.test.ts(x)`).
- [ ] `pnpm test` muestra > 0 tests y todos verdes.
- [ ] `pnpm typecheck` y `pnpm lint` en verde, sin warnings.

## C5 — La sesión se cerró bien

- [ ] Sin archivos temporales sospechosos fuera del `.gitignore`.
- [ ] `progress/history.md` tiene una entrada por la última sesión.
- [ ] La última feature trabajada está reflejada en su estado correcto.

## C6 — Contrato Gherkin (BDD)

- [ ] Toda feature `"sdd": true` en `spec_ready`/`in_progress`/`done` tiene
      su `features/<name>.feature` y una sección en `project-spec.md`.
- [ ] El `.feature` usa escenarios tagueados `@s1`, `@s2`, … y cada `Then`
      afirma algo medible.
- [ ] Cada `@s` está cubierto por al menos un test (mapa `@s → test` en
      `progress/tdd_<name>.md`).
- [ ] No hay producción que ningún test rojo haya pedido.

## C7 — Prueba de mutación

- [ ] La feature `done` superó la mutación (`pnpm mutation`) por encima del
      umbral de `docs/mutation-testing.md` (`break: 100` sobre lo tocado).
- [ ] Cualquier mutante sobreviviente queda documentado en
      `progress/mutation_<name>.md` (matado con un test, o justificado equivalente).

---

**Quién evalúa:** el `judge` recorre C1–C6 y el `mutation_tester` valida C7.
Se rechaza el cierre si quedan casillas vacías.
