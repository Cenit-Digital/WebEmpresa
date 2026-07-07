# Veredicto del Juez — contacto_seccion (#10)

**Rama:** `feat/design-system` · **Fecha:** 2026-07-06
**Contrato:** `features/contacto_seccion.feature` (@s1–@s6, SOLO estructura visual)
**Implementación:** `src/components/Contacto.tsx` + `.module.scss`, compuesto en
`src/pages/home.tsx` tras `<Paquetes/>`. **Tests:** `src/components/Contacto.test.tsx`.

## VEREDICTO: APPROVED · 0 hallazgos bloqueantes

El `mutation_tester` (Stryker, break=100%) corre después; esta puerta valida
diseño, cobertura y fidelidad.

---

## 1 · Cobertura de escenarios (@s → test)

| @s  | Requisito                                    | Test                                                                                      | Estado |
| --- | -------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ |
| @s1 | intro contiene "en menos de 24 horas"        | `Contacto.test.tsx:6-14` (texto íntegro de la intro)                                      | OK     |
| @s2 | enlace de teléfono `href` empieza por `tel:` | `:16-22` (`href='tel:+34600000000'` + `/^tel:/`)                                          | OK     |
| @s3 | 5 campos con etiqueta                        | `:24-32` (`getByLabelText` Nombre/Correo electrónico/Teléfono/Sector/¿Qué necesitas?)     | OK     |
| @s4 | Nombre y Correo obligatorios                 | `:34-42` (`toBeRequired` + opcionales `not.toBeRequired`) y `:44-51` (asterisco en label) | OK     |
| @s5 | Sector con las 5 opciones                    | `:53-66` (lista exacta placeholder + 5 sectores)                                          | OK     |
| @s6 | botón "Enviar consulta gratuita"             | `:68-73` (`getByRole button` + `type=submit`)                                             | OK     |

Cada `@s` tiene al menos un test concreto que lo verifica. Ninguno huérfano.

## 2 · Fidelidad de copy vs. referencia (BLOQUEANTE si desvía)

Contrastado contra `design/Cenit Home (referencia) - standalone.html` (sección contacto):

- Eyebrow: ref "Contacto" == impl `Contacto.tsx:23`. OK
- H2: ref "Cuéntanos qué **necesita** tu negocio" (con `<em>` solo de color sobre
  "necesita") — texto íntegro "Cuéntanos qué necesita tu negocio" == impl `:24`
  (aserción exacta en test `:80`). OK — el resalte de color de "necesita" es un
  detalle visual opcional (§4), no una desviación de copy.
- Intro: ref "Primera consulta gratuita y sin compromiso. Te llamamos y te
  respondemos en menos de 24 horas." == impl `:25-28` (1:1). OK
- Botón "Enviar consulta gratuita", teléfono "+34 600 00 00 00"/`tel:+34600000000`,
  opciones de Sector y placeholder "Selecciona tu sector": todos 1:1 con la referencia.

**0 desviaciones de copy.**

## 3 · Honeypot oculto (para #11)

`Contacto.tsx:93-98`: contenedor `.honeypot` con `aria-hidden="true"`, input
`name="empresa"`, `tabIndex={-1}`, `autoComplete="off"`, `<label>` "No rellenar".
SCSS `:113-119` lo saca del viewport (`left:-9999px`, 1×1, overflow hidden).

- No aparece como 6º campo en las queries accesibles de los 5 reales: sus
  `getByLabelText` (Nombre/Correo/Teléfono/Sector/¿Qué necesitas?) no colisionan
  con "No rellenar"; `getByLabelText` lanzaría ante duplicados y la suite pasa.
- No es `required` (verificado en test `:124-134`). No interfiere.

## 4 · Estructura, a11y, tokens y regresiones

- Sección `id="contacto"` + H2 nivel 2: `Contacto.tsx:20,24`; test `:75-82`.
  Prerenderizado confirmado en `dist/index.html` (id, H2, intro, botón, `tel:`).
- Cada control real tiene `<label htmlFor>` asociado (Nombre/Correo/Teléfono/
  Sector/¿Qué necesitas?). El `*` va con `aria-hidden` → fuera del nombre
  accesible (test `:108-113`, `toHaveAccessibleName`). Foco visible vía
  `:focus-visible` (scss `:103-106`).
- **0 hex** en `Contacto.tsx`/`.module.scss`: solo `var(--color-…)` (verificado
  con grep). Cumple regla de oro de `docs/conventions.md` y §6 del Design System
  (form `card-bg`/`radius:20`/`padding:30`/`shadow`; inputs `surface`/`radius:11`/
  `padding:13 14`; focus `primary`; `*` en `primary`).
- `onSubmit`→`preventDefault` sin lógica de envío (validación/envío son #11);
  `noValidate` coherente con "solo estructura". Test `:136-144`.

### Puerta verde (`./init.sh` + build)

- typecheck: OK · lint: **0 warnings** · test: **118 passed** (13 de Contacto).
- `pnpm build` (SSG): verde, sección prerenderizada en `dist/index.html`.

## 5 · Disciplina TDD

`progress/tdd_contacto_seccion.md` documenta Rojo→Verde→Refactor por escenario
(incl. retirada deliberada de `required`/asterisco en @s4 y vaciado del `map` de
opciones en @s5 para observar el rojo real). No hay producción sin test que la
ejerza: el honeypot, anticipado para #11, está cubierto por test dedicado
(`:124-134`); el copy/atributos endurecidos para Stryker tienen sus tests.

## Recorrido CHECKPOINTS.md

- C1 (arnés) — [x] `./init.sh` exit 0, archivos base y docs presentes.
- C2 (estado coherente) — [~] `pnpm test` verde; **observación no bloqueante:**
  `feature_list.json` marca `contacto_seccion` como `spec_ready` pese a estar
  implementada y en juicio; el orquestador debería moverla a `in_progress` (y a
  `done` solo tras esta aprobación + mutación). No afecta al juicio del código.
- C3 (arquitectura) — [x] módulo en `src/components/`; TS estricto, sin `any`,
  sin `console.log`/TODOs.
- C4 (verificación real) — [x] módulo con tests; test/typecheck/lint verdes, 0 warnings.
- C5 (cierre) — [ ] pendiente del orquestador (history.md / estado final).
- C6 (contrato Gherkin) — [x] `.feature` con `@s1–@s6` medibles; mapa `@s→test`
  en la bitácora; sin producción no pedida.
- C7 (mutación) — [ ] pendiente del `mutation_tester`.

## Observaciones no bloqueantes (no condicionan la aprobación)

1. `feature_list.json`: `contacto_seccion` en `spec_ready` mientras está
   implementada/en juicio — corregir bookkeeping de estado (C2/C5).
2. La referencia resalta "necesita" con `<em style="color:var(--color-primary)">`
   (patrón §4); la impl usa H2 plano. Copy idéntico; el resalte es opcional.
