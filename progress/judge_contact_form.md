# Veredicto del juez — contact_form (#11)

**Resultado: APPROVED** · Hallazgos bloqueantes: **0**
Rama `feat/design-system` · Contrato `features/contact_form.feature` (@s1–@s8).
Fecha de revisión: 2026-07-06.

> Tras esta aprobación corre el `mutation_tester` (Stryker, break=100% sobre
> `src/lib/contact.ts` y `src/components/Contacto.tsx`). Ambas puertas deben pasar
> antes de marcar `done`.

## 1 · Verificación del arnés (`./init.sh`)

VERDE. `typecheck` OK · `lint` sin errores ni warnings · **137 tests passed**
(118 baseline + 11 lib + 8 comportamiento). `pnpm build` (SSG) VERDE:
`dist/index.html` y `dist/aviso-legal/index.html` renderizados. Los 19 tests de
la feature (`contact.test.ts` + `Contacto.behavior.test.tsx`) pasan.

## 2 · Cobertura de escenarios (@s → test real y no tautológico)

| @s  | Contrato                                       | Test                                                                                                                             | Veredicto |
| --- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------- |
| @s1 | nombre vacío → error en Nombre, NO envía       | `Contacto.behavior.test.tsx` @s1 (`aria-invalid=true` + `aria-describedby` con texto, `send` no llamado) · `contact.test.ts` @s1 | OK        |
| @s2 | correo vacío → error en Correo, NO envía       | behavior @s2 · lib @s2 (incl. correo de espacios)                                                                                | OK        |
| @s3 | `hola@@mal` → error de formato, NO envía       | behavior @s3 (texto exacto) · lib @s3 (mensaje distinto del de vacío)                                                            | OK        |
| @s4 | válido → SÍ llama con los datos + éxito        | behavior @s4 (`send` 1 vez con payload de 5 campos + `role=status`) · lib @s4 (POST `/api/contact`, JSON, headers)               | OK        |
| @s5 | botón deshabilitado durante envío pendiente    | behavior @s5 con `deferred()`: `toBeDisabled` con promesa pendiente, `toBeEnabled` tras resolver                                 | OK        |
| @s6 | tras éxito, Nombre/Correo/Mensaje vacíos       | behavior @s6 (`toHaveValue('')` en los tres)                                                                                     | OK        |
| @s7 | fallo → error + datos preservados              | behavior @s7 (`role=alert`, sin `role=status`, valores intactos) · lib @s7 (`rejects` si `!res.ok`)                              | OK        |
| @s8 | honeypot relleno → NO envía + éxito silencioso | behavior @s8 (`fireEvent.change` honeypot → `role=status` y `send` no llamado)                                                   | OK        |

Todos los `Then` afirman algo medible. Ninguno es tautológico:

- El mock es correcto: `vi.mock('../lib/contact', …)` mantiene `validateContact`
  REAL y sustituye solo `sendContactEmail` por `vi.fn()`; "llamar a Resend" =
  llamar a `sendContactEmail` (Contacto.tsx:43). `sendContactEmail` se prueba
  aparte con `fetch` espiado (contact.test.ts:66–92), asertando URL, método,
  headers, cuerpo JSON y ambas ramas ok/!ok.
- @s5 usa una promesa controlable (`deferred()`) para observar el `disabled`
  real durante el estado `sending` (Contacto.tsx:41,182), no un mock instantáneo.

## 3 · Disciplina TDD

`progress/tdd_contact_form.md` documenta Rojo→Verde→Refactor por ciclo (lib
`validateContact`, lib `sendContactEmail`, y @s1..@s8) con el fallo inicial
concreto de cada uno. El mapa `@s → test` es fiel a lo que hay en disco. No se
observa producción que ningún test exija:

- Estados `idle/sending/success/error` todos ejercitados (@s4/@s5/@s6/@s7/@s8).
- `telefono`/`sector` controlados: cubiertos por el payload asertado en @s4.
- `reset` de nombre/email/mensaje: @s6. Preservación tras fallo: @s7.
- Guardia honeypot: @s8.

## 4 · Calidad (lente de artesano) y arquitectura

- Lógica pura en `src/lib/contact.ts` (sin JSX), UI en `src/components/Contacto.tsx`:
  respeta la regla de capas de `docs/architecture.md` (`components → lib`).
- `validateContact` con prioridad clara nombre→email(vacío)→email(formato) y
  `null`; `EMAIL_RE` con nombre revelador; sin números mágicos ni duplicación.
- `handleSubmit` corto y legible; contrato de errores correcto (`throw` si
  `!res.ok`, `try/catch` que fija `status='error'` y hace `return` antes del
  reset, conservando lo escrito).
- Accesibilidad conforme: `aria-invalid`/`aria-describedby` en campos inválidos,
  `role="alert"` en errores de campo y de envío, `role="status"` en éxito;
  el `*` queda fuera del nombre accesible (verificado por `contacto_seccion`).

## 5 · Regresión de marca y tokens

- `src/styles/_tokens.scss`: `--color-primary` sigue `#1e7a4f` (claro) /
  `#c9a84c` (oscuro). El test fs de marca (`tokens.test.ts` @s7/@s8) sigue verde.
- Nuevos `--color-danger`/`--color-success` definidos en `:root` (líneas 67–68:
  `#b3261e` / `#1e7a4f`) y en `:root[data-theme='dark']` (líneas 118–119:
  `#f2b8b5` / `#8fd0a3`), con contraste razonable sobre card claro / fondo noche.
  No alteran ningún valor de la paleta de marca.
- `Contacto.module.scss`: **0 hex** (grep sin coincidencias); estados vía
  `var(--color-danger)`/`var(--color-success)`.
- Los 13 tests estructurales de `contacto_seccion` (#10, @s1–@s6) siguen verdes
  (inputs ahora controlados sin alterar labels/names/types/required/opciones/honeypot).

## 6 · Recorrido de CHECKPOINTS.md

- C2 — [x] Estado coherente (una sola feature fuera de `done`).
- C3 — [x] Arquitectura respetada; TS estricto sin `any`; sin `console.log`/TODO.
- C4 — [x] Cada módulo con lógica tiene test; `pnpm test` 137 verdes; typecheck y
  lint sin warnings.
- C6 — [x] `.feature` con `@s1..@s8`, cada `Then` medible; cada `@s` cubierto
  (mapa en `tdd_contact_form.md`); sin producción no exigida por un test.
- C7 — [ ] Pendiente del `mutation_tester` (fuera de mi puerta).

## Observaciones no bloqueantes (para el lead / tdd; no afectan la aprobación)

1. `feature_list.json` marca contact_form (#11) como `spec_ready`, no
   `in_progress`. El trabajo está completo; el lead debería moverlo a
   `in_progress` (y luego a `done` tras mutación) para coherencia con el pipeline.
2. `Contacto.tsx:30` usa `empresa !== ''` mientras la bitácora describe
   `empresa.trim() !== ''`. El comportamiento probado (@s8) es correcto; es solo
   una discrepancia de la bitácora, sin impacto funcional.

**Salida:** APPROVED
