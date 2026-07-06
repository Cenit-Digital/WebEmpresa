# TDD — servicios (#7)

> Sección de servicios: cabecera + 6 tarjetas (etiqueta/título/desc/2 features
> con check/Ejemplo) en filas zigzag con mockup decorativo. Contrato:
> `features/servicios.feature` (@s1–@s5). Rama `feat/design-system`.
> Diseño: `docs/DESIGN_SYSTEM.md` §6 (Tarjeta de servicio).

## Escenarios

- @s1 los 6 títulos en orden exacto.
- @s2 las 6 etiquetas en orden exacto.
- @s3 cada tarjeta tiene exactamente 2 características (con check).
- @s4 cada tarjeta tiene un bloque "Ejemplo" con texto descriptivo no vacío.
- @s5 no existe un botón/enlace accesible llamado "Reservar" (vive en el mockup
  decorativo `aria-hidden`).

## Decisiones de diseño / mutación

- Todo el copy testeable (eyebrow, H2, intro, 6 títulos, 6 etiquetas, 6 desc,
  12 features, 6 ejemplos, label "Ejemplo") vive como literal en `Servicios.tsx`
  y se asserta con string exacto → mata mutantes StringLiteral (break=100%).
- Alternancia zigzag por CSS (`:nth-child(even)`), sin lógica aritmética en el
  componente (evita mutantes de operador aritmético/condicional no cubiertos).
- Mockups decorativos e icono de check extraídos a `ServiceMockup.tsx` y
  `CheckIcon.tsx` (NO en `stryker.config.json mutate`): sus literales
  (`points`, "Reservar", dimensiones svg) no generan supervivientes.

## Bitácora de ciclos (Rojo → Verde → Refactor)

- **ROJO inicial** — `Servicios.test.tsx` importa `./Servicios` (inexistente):
  toda la suite del archivo falla al no compilar/importar. Cuenta como fallo.
- **@s1/@s2 VERDE** — `Servicios.tsx` con array `SERVICES` (6) + cabecera; H3 por
  tarjeta (orden natural del map) y etiqueta (span) por tarjeta.
- **@s3 VERDE** — cada tarjeta con `<ul>` de 2 `<li>`, cada uno con `<CheckIcon/>`.
- **@s4 VERDE** — bloque `.example` con label "Ejemplo" + `<p>` de texto real.
- **@s5 VERDE** — `<ServiceMockup/>` decorativo `aria-hidden` con la píldora
  "Reservar" (span, no botón/enlace) sólo en la tarjeta "Desarrollo web".
- **REFACTOR** — copy en un único array de datos; icono y mockups en ficheros
  propios; estilos fieles a §6 (radius 20, surface para "Ejemplo", check primary).

## Trazabilidad @s → test (`src/components/Servicios.test.tsx`)

| Escenario                   | Test                                                                 |
| --------------------------- | -------------------------------------------------------------------- |
| (cabecera) eyebrow/H2/intro | `› muestra la cabecera de sección`                                   |
| (nav) id="servicios"        | `› la sección expone id="servicios"`                                 |
| @s1 6 títulos en orden      | `› @s1 muestra los seis títulos en orden exacto`                     |
| @s2 6 etiquetas en orden    | `› @s2 muestra las seis etiquetas en orden exacto`                   |
| @s3 2 features con check    | `› @s3 cada tarjeta tiene exactamente dos características con check` |
| @s3 copy de las 12 features | `› @s3 muestra el texto exacto de las doce características`          |
| @s4 bloque Ejemplo x6       | `› @s4 cada tarjeta muestra un bloque "Ejemplo" con texto`           |
| @s5 sin control "Reservar"  | `› @s5 el texto "Reservar" del mockup no es un control accesible`    |
| (mutación) desc exactas     | `› muestra la descripción exacta de cada servicio`                   |

## Estado

- Pendiente de `judge` + `mutation_tester`. NO marcado `done`.
</content>
