# Veredicto Judge — servicios (#7)

**Rama:** `feat/design-system` · **Fecha:** 2026-07-06
**Contrato:** `features/servicios.feature` (@s1–@s5)
**Referencia:** `design/Cenit Home (referencia) - standalone.html` (sección servicios)

## Resultado: APPROVED — 0 hallazgos bloqueantes

---

## 1. Cobertura de escenarios (@s → test)

| @s  | Verificación                                 | Test                                                                                                                             | Estado |
| --- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------ |
| @s1 | 6 títulos en orden exacto                    | `Servicios.test.tsx:69` (`@s1 muestra los seis títulos en orden exacto`) — `getAllByRole('heading',{level:3})` == TITLES         | OK     |
| @s2 | 6 etiquetas en orden                         | `Servicios.test.tsx:76` — presencia + orden por `compareDocumentPosition`                                                        | OK     |
| @s3 | exactamente 2 features con check por tarjeta | `Servicios.test.tsx:87` — 6 listas, 2 `<li>` cada una, `svg` en cada item                                                        | OK     |
| @s3 | copy de las 12 features                      | `Servicios.test.tsx:101` — string exacto                                                                                         | OK     |
| @s4 | bloque "Ejemplo" + texto x6                  | `Servicios.test.tsx:109` — `getAllByText('Ejemplo')` len 6 + 6 textos                                                            | OK     |
| @s5 | sin control accesible "Reservar"             | `Servicios.test.tsx:118` — `queryByRole('button'/'link',{name:'Reservar'})` == null; píldora es `<span>` en mockup `aria-hidden` | OK     |

Cada `@s` tiene al menos un test concreto que lo verifica. Sin `@s` huérfano.

## 2. Fidelidad de copy (anti-alucinación)

Comparación 1:1 del componente `src/components/Servicios.tsx` contra la sección
servicios del HTML de referencia (líneas 203–604). Coincidencia EXACTA en:

- Cabecera: eyebrow "Lo que hacemos" (ref:203), H2 "Servicios que transforman
  negocios locales" (ref:205-207, `<em>` sobre "transforman" — sin efecto en
  textContent), intro (ref:209).
- Las 6 descripciones (ref:220,313,338,451,476,591).
- Las 12 características (ref:227/233, 320/326, 345/351, 458/464, 483/489, 598/604).
- Los 6 "Ejemplo" (ref:267,304,391,442,541,582).

Ninguna palabra cambiada, inventada ni omitida. 0 desviaciones.

## 3. Disciplina TDD

`progress/tdd_servicios.md` documenta Rojo (import inexistente) → Verde por
escenario → Refactor. Todo el copy testeable vive como literal y se asserta con
string exacto. Mockups (`ServiceMockup.tsx`) y check (`CheckIcon.tsx`) son
decorativos, `aria-hidden`, y quedan fuera de `mutate` justificadamente. No se
observa producción que ningún test exija: cada literal público (títulos, tags,
desc, features, ejemplos, cabecera) tiene assert.

## 4. Calidad / arquitectura

- Sección con `id="servicios"` (`Servicios.tsx:66`) y un H2 (`:69`). Verificado
  también por test `id="servicios"` (`Servicios.test.tsx:63`).
- Colores: 0 hex en `Servicios.module.scss`, `ServiceMockup.module.scss`,
  `CheckIcon.module.scss` — solo `var(--color-…)`.
- Funciones cortas, datos en array `SERVICES`, sin duplicación ni números
  mágicos en lógica; zigzag por CSS (`:nth-child(even)`), sin aritmética en JS.
- Compuesto en `src/pages/home.tsx:13`.

## 5. Verificación (init.sh + build)

- typecheck: OK (sin errores)
- lint: OK (0 warnings)
- test: OK — 91 passed
- build SSG: OK — `dist/index.html` prerenderizado (18.70 KiB)

## Checkpoints

- C4 — [x] test > 0 y verdes; typecheck/lint verdes sin warnings
- C6 — [x] cada `@s` cubierto; sin producción no pedida; mapa `@s → test` presente

## Nota

El `mutation_tester` corre después de esta aprobación (C7). Este veredicto cubre
diseño, cobertura y fidelidad; la mordida de los tests la valida la mutación.
