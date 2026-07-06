# TDD — contact_form (#11)

> Comportamiento del formulario de contacto: validación mínima, envío (fetch a
> `/api/contact` vía `sendContactEmail`), honeypot y estados éxito/error.
> Contrato: `features/contact_form.feature` (@s1–@s8). Rama `feat/design-system`.
> Añade lógica a `Contacto.tsx` (#10 dejó la estructura + honeypot oculto).
> Lógica pura extraída a `src/lib/contact.ts` (en `stryker.config.json`, break=100%).

## Escenarios

- @s1 nombre vacío + email válido → error en "Nombre", NO llama a sendContactEmail.
- @s2 nombre relleno + email vacío → error en "Correo electrónico", NO llama.
- @s3 email "hola@@mal" → error de formato, NO llama.
- @s4 nombre y email válidos → LLAMA a sendContactEmail con los datos + mensaje de ÉXITO.
- @s5 durante el envío el botón está DESHABILITADO hasta terminar.
- @s6 tras éxito, Nombre/Correo/¿Qué necesitas? quedan vacíos (reset).
- @s7 si sendContactEmail RECHAZA → mensaje de error y los datos SIGUEN presentes.
- @s8 honeypot ("empresa") relleno → NO llama y éxito silencioso.

## Arquitectura

- **Lógica pura** en `src/lib/contact.ts` (en `stryker.config.json`, break=100%):
  - `type ContactData` + `type ContactError = { field: 'nombre'|'email', message }`.
  - `validateContact(data)`: primer error con prioridad nombre→email(vacío)→email(formato),
    o `null`. Email vía `EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
  - `sendContactEmail(data)`: `fetch('/api/contact', POST, JSON)`; lanza si `!res.ok`.
- **Estado + onSubmit** en `Contacto.tsx` (useState por campo). El módulo de envío
  se MOCKEA en los tests de comportamiento (`vi.mock('../lib/contact', ...)`) dejando
  `validateContact` REAL. `sendContactEmail` se prueba aparte con `global.fetch` mockeado.
- **Tokens de estado** nuevos en `src/styles/_tokens.scss` (claro + oscuro):
  `--color-danger` / `--color-success`. La `.module.scss` usa solo `var(--color-…)` (0 hex).

## Bitácora de ciclos (Rojo → Verde → Refactor)

- **Lib validateContact** — ROJO: `contact.test.ts` (nombre vacío/espacios,
  correo vacío, `hola@@mal`, válido→null, prioridad nombre>correo); falla porque
  `./contact` no existe (no importa). VERDE: `contact.ts` con `validateContact`
  puro (3 ramas + null). Cubre la lógica de @s1/@s2/@s3/@s4.
- **Lib sendContactEmail** — ROJO: 3 casos (POST a `/api/contact` con JSON del
  payload; resuelve si ok; lanza si !ok) con `vi.spyOn(globalThis,'fetch')`; falla
  (símbolo inexistente). VERDE: `sendContactEmail` con `fetch` + `if (!res.ok) throw`.
  Cubre payload/URL/método y ambas ramas ok/!ok (mutación).
- **@s1** — ROJO: `Contacto.behavior.test @s1` (nombre vacío + email válido →
  `aria-invalid` en Nombre + error descrito por `aria-describedby`, `send` NO
  llamado); falla (input no controlado, sin onSubmit real). VERDE: estado
  `nombre`/`email`/`error`, `handleSubmit`→`validateContact`, render del error de
  Nombre con `aria-invalid`/`aria-describedby`/`role="alert"`.
- **@s2/@s3** — ROJO: casos para correo vacío y `hola@@mal` (error en "Correo
  electrónico"); fallan (solo se pintaba el error de Nombre). VERDE: generalizado
  a `emailError`, mismo patrón a11y en el campo email.
- **@s4** — ROJO: datos válidos (5 campos) → `send` llamado 1 vez con el payload
  completo + `role="status"`; falla (no se llamaba a envío). VERDE: campos
  `telefono`/`sector`/`mensaje` controlados, `handleSubmit` async llama a
  `sendContactEmail` y pone `status='success'` (mensaje `role="status"`).
- **@s5** — ROJO: con promesa `deferred()` pendiente, el botón debe estar
  `disabled` hasta resolver; falla (botón siempre habilitado). VERDE:
  `status='sending'` antes del `await` + `disabled={status === 'sending'}`.
- **@s6** — ROJO: tras éxito, Nombre/Correo/¿Qué necesitas? con valor `''`; falla
  (no había reset). VERDE: reset de `nombre`/`email`/`mensaje` tras éxito
  (telefono/sector se conservan a propósito: el contrato solo nombra esos 3).
- **@s7** — ROJO: `send` rechaza → `role="alert"` visible, sin `role="status"`, y
  los datos siguen presentes; falla (rechazo no capturado). VERDE: `try/catch`
  con `status='error'` + `return` (el reset queda tras el `await`, así que un
  fallo conserva lo escrito). Mensaje de error con `role="alert"`.
- **@s8** — ROJO: honeypot `empresa` relleno por bot (`fireEvent.change`) →
  `role="status"` visible pero `send` NO llamado; falla (honeypot sin estado).
  VERDE: estado `empresa` controlado + guardia al inicio de `handleSubmit`
  (`if (empresa !== '') { setStatus('success'); return }`), éxito silencioso.
  (Sin `.trim()`: "relleno" = no vacío; evita una rama sin test para mutación.)

## Reapertura por mutación (mutation_tester)

Stryker sobre `src/lib/contact.ts` dejaba 3 supervivientes (break=100%). Añadidos
3 tests en `contact.test.ts` (cada uno rojo real contra su mutante):

- **`contact.ts:48` (StringLiteral del `Error`)** — `@s7 el error lanzado lleva el
mensaje exacto`: `rejects.toThrow('No se pudo enviar el mensaje.')` mata el
  mutante que vacía el mensaje a `""`.
- **`contact.ts:17` (ancla `^` del regex)** — `@s3 rechaza basura ANTES` con
  `email: 'x hola@mal.com'` → inválido; sin `^` colaría.
- **`contact.ts:17` (ancla `$` del regex)** — `@s3 rechaza basura DESPUÉS` con
  `email: 'hola@mal.com xxx'` → inválido; sin `$` colaría.

Resultado: `pnpm exec stryker run --mutate "src/lib/contact.ts"` → **100.00%**
(44 killed, 4 timeout, 0 survived). `contact.ts` NO se tocó (regex y mensaje ya
eran correctos; solo faltaban tests).

### Fuera de escenario (en verde)

- `src/styles/_tokens.scss`: añadidos `--color-danger`/`--color-success` en ambos
  temas (no rompe `tokens.test` de marca @s7/@s8, que asertan otras variables).
- `Contacto.module.scss`: clases `.fieldError`/`.success`/`.formError` + `:disabled`
  del botón, todas con `var(--color-…)` (0 hex).
- `stryker.config.json` YA incluía `src/lib/contact.ts` y `src/components/Contacto.tsx`
  (no se tocó).

## Trazabilidad @s → test

| Escenario                                             | Test                                                                              |
| ----------------------------------------------------- | --------------------------------------------------------------------------------- |
| @s1 nombre vacío → error Nombre, no envía             | `Contacto.behavior.test.tsx` › `@s1` · `contact.test.ts` › `@s1`                  |
| @s2 correo vacío → error Correo, no envía             | `Contacto.behavior.test.tsx` › `@s2` · `contact.test.ts` › `@s2`                  |
| @s3 `hola@@mal` → error formato, no envía             | `Contacto.behavior.test.tsx` › `@s3` · `contact.test.ts` › `@s3`                  |
| @s4 válido → llama a sendContactEmail + éxito         | `Contacto.behavior.test.tsx` › `@s4` · `contact.test.ts` › `sendContactEmail @s4` |
| @s5 botón deshabilitado durante el envío              | `Contacto.behavior.test.tsx` › `@s5`                                              |
| @s6 reset de Nombre/Correo/¿Qué necesitas? tras éxito | `Contacto.behavior.test.tsx` › `@s6`                                              |
| @s7 fallo → error + datos conservados                 | `Contacto.behavior.test.tsx` › `@s7` · `contact.test.ts` › `sendContactEmail @s7` |
| @s8 honeypot relleno → éxito silencioso sin envío     | `Contacto.behavior.test.tsx` › `@s8`                                              |

## Estado

- `./init.sh` VERDE: typecheck OK, lint 0 warnings, **140 tests** (118 baseline +
  14 lib + 8 comportamiento). `pnpm build` (SSG) VERDE.
- Mutación `src/lib/contact.ts`: **100%** (0 supervivientes). Judge: APROBADO.
- Los 13 tests estructurales de `contacto_seccion` (#10) siguen verdes (inputs
  ahora controlados, sin cambiar labels/names/types/required/opciones/honeypot).
- 0 hex en `Contacto.module.scss` (estados con tokens `--color-danger/-success`).
- NO marcado `done`: pendiente de `judge` + `mutation_tester` (Stryker break=100%
  sobre `src/lib/contact.ts` y `src/components/Contacto.tsx`).

## Endurecimiento de mutación (corrida global, break=100)

La corrida global `pnpm mutation` destapó supervivientes en `Contacto.tsx` que
las corridas por-feature enmascaraban como "timeout". Cerrados con tests honestos

- 2 refactores + 1 disable justificado:

* `Contacto.tsx:19` `useState('')` del Sector → test estructural nuevo: el
  placeholder (`value=""`, "Selecciona tu sector") arranca `selected` y
  `select.value === ''`.
* `Contacto.tsx:23` `useState('idle')` → mutante EQUIVALENTE (`'idle' ≡ ''`: misma
  UI, sin mensaje, botón activo). Documentado con `// Stryker disable next-line
StringLiteral` y comentario; sin test tautológico.
* `Contacto.tsx:55` `emailError` (`field === 'email'`) → @s1 (comportamiento)
  reforzado: con error de NOMBRE, el campo Correo NO queda `aria-invalid` ni
  expone `aria-describedby`.
* `Contacto.tsx:77/102` `{' '}` en los labels (mutante de espacio cosmético) →
  REFACTOR: se elimina el literal `{' '}`; la separación del asterisco pasa a CSS
  (`.required { margin-left: 0.25rem }`). Accesibilidad equivalente
  (`toHaveAccessibleName('Nombre'/'Correo electrónico')` sigue verde).
* `Contacto.tsx:197` `status === 'error'` → test estructural nuevo: en estado
  inicial el mensaje de error de envío NO está en el documento.

Resultado: `Contacto.tsx` 100% (0 supervivientes; 69 killed + 2 timeout).
