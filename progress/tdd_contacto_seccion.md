# TDD — contacto_seccion (#10)

> Estructura visual de la sección de contacto (SOLO estructura; validación y
> envío son contact_form #11). Contrato: `features/contacto_seccion.feature`
> (@s1–@s6). Rama `feat/design-system`. Diseño: `docs/DESIGN_SYSTEM.md` §5/§6.

## Escenarios

- @s1 la intro contiene "en menos de 24 horas"
- @s2 el enlace de teléfono tiene href que empieza por "tel:"
- @s3 existen los 5 campos: "Nombre", "Correo electrónico", "Teléfono", "Sector", "¿Qué necesitas?"
- @s4 "Nombre" y "Correo electrónico" marcados como obligatorios (required)
- @s5 el desplegable "Sector" incluye "Veterinaria", "Servicios de estética", "Clínica dental", "Fisioterapia", "Otro"
- @s6 el botón de envío tiene texto "Enviar consulta gratuita"

## Bitácora de ciclos (Rojo → Verde → Refactor)

- **@s1** — ROJO: test de intro con "en menos de 24 horas" (import falla, no existe
  `Contacto`). VERDE: `Contacto.tsx` mínimo (section `id="contacto"` + `<p>` intro).
  `Contacto.module.scss` con sección sobre `--color-bg-2`.
- **@s2** — ROJO: test de enlace `tel:` (`getByRole('link', {name:'+34 600 00 00 00'})`,
  href empieza por `tel:`); falla (no había enlace). VERDE: `<a href="tel:+34600000000">`.
- **@s3** — ROJO: test de los 5 campos con etiqueta (`getByLabelText` de Nombre,
  Correo electrónico, Teléfono, Sector, ¿Qué necesitas?); falla (sin formulario).
  VERDE: `<form>` con los 5 controles (input/input/input/select/textarea) + cabecera
  (eyebrow "Contacto", H2), honeypot oculto y botón. `onSubmit` con `preventDefault`.
- **@s4** — ROJO: se retiró temporalmente `required` y el `*` de Nombre/Correo (los
  había adelantado en el verde de @s3) para observar el rojo real; 2 tests fallan
  (`toBeRequired` y asterisco en la etiqueta). VERDE: reañadidos `required` y
  `<span class=required aria-hidden>*</span>` en Nombre y Correo.
- **@s5** — ROJO: se vació el `map` de opciones del `<select>` (dejando solo el
  placeholder) para forzar el rojo; test de lista exacta de opciones falla. VERDE:
  restaurado el `map` sobre `SECTORS` → placeholder + Veterinaria / Servicios de
  estética / Clínica dental / Fisioterapia / Otro.
- **@s6** — ROJO: se cambió el texto del botón a "Enviar" para forzar el rojo; test
  de `getByRole('button', {name:'Enviar consulta gratuita'})` falla. VERDE: texto
  restaurado a "Enviar consulta gratuita".
- **REFACTOR (en verde) + endurecimiento anti-mutación (Stryker break=100%):**
  se inlinearon los espacios de las etiquetas (elimina el literal `{' '}`), se quitó
  `defaultValue=""` del select (uncontrolled → placeholder por defecto; elimina un
  mutante no matable) y se quitó `type="text"` del honeypot. Añadidos tests de copy
  y atributos para matar mutantes: eyebrow "Contacto", H2 exacto, `id="contacto"`,
  `name`/`type` de los 5 campos, `toHaveAccessibleName` (el `*` va con
  `aria-hidden` → fuera del nombre accesible), placeholder deshabilitado con
  `value=""`, honeypot (`name="empresa"`, `tabindex=-1`, `autocomplete="off"`,
  contenedor `aria-hidden="true"`, no `required`) y `preventDefault` en submit
  (`fireEvent.submit` devuelve `false`). SCSS completado a la spec §6 (form card-bg,
  radius 20, padding 30, shadow; inputs surface, radius 11, padding 13 14; focus
  primary; `*` en primary; 0 hex). Compuesto `<Contacto/>` en `home.tsx` tras
  `<Paquetes/>`.

## Notas de diseño / decisiones

- El honeypot usa etiqueta oculta "No rellenar" (asociada por `htmlFor`/`id`) dentro
  de un contenedor `aria-hidden="true"`; no colisiona con las queries accesibles de
  los 5 campos reales. Sin comportamiento en esta feature; listo para #11.
- `<select>` sin `defaultValue`: como el primer `<option>` es el placeholder
  deshabilitado, el navegador lo muestra por defecto sin necesidad de valor inicial.
- `stryker.config.json` ya incluía `src/components/Contacto.tsx` en `mutate` (no se
  tocó el archivo).

## Trazabilidad @s → test

| Escenario                        | Test                                                                                                                                      |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| @s1 intro "en menos de 24 horas" | `src/components/Contacto.test.tsx` › `@s1 la intro contiene la promesa...`                                                                |
| @s2 teléfono como enlace `tel:`  | `src/components/Contacto.test.tsx` › `@s2 ofrece el teléfono como enlace...`                                                              |
| @s3 los 5 campos con etiqueta    | `src/components/Contacto.test.tsx` › `@s3 el formulario muestra sus cinco campos...`                                                      |
| @s4 Nombre/Correo obligatorios   | `src/components/Contacto.test.tsx` › `@s4 ...obligatorios` + `@s4 ...asterisco`                                                           |
| @s5 opciones de Sector           | `src/components/Contacto.test.tsx` › `@s5 el desplegable "Sector"...`                                                                     |
| @s6 texto del botón              | `src/components/Contacto.test.tsx` › `@s6 el botón de envío...`                                                                           |
| Copy/atributos (mutación)        | `... cabecera+id`, `... name y type`, `... asterisco fuera del nombre accesible`, `... placeholder`, `... honeypot`, `... preventDefault` |

## Estado

- Suite completa VERDE: **118 tests** (105 baseline + 13 de Contacto), 19 files.
- `pnpm typecheck` OK, `pnpm lint` 0 warnings, `pnpm build` (SSG) verde; sección
  prerenderizada en `dist/index.html`.
- Ficheros nuevos: `src/components/Contacto.tsx`, `Contacto.module.scss`,
  `Contacto.test.tsx`, `progress/tdd_contacto_seccion.md`. Modificado:
  `src/pages/home.tsx` (+`<Contacto/>`), `progress/current.md`.
- NO marcado `done`: pendiente de `judge` + `mutation_tester` (Stryker break=100%).
