# TDD — sectores (#8)

Rama `feat/design-system`. Contrato: `features/sectores.feature` (@s1–@s3).
Diseño: `docs/DESIGN_SYSTEM.md` §5 (fondo bg-2) y §6 (tarjeta de sector).

## Escenarios

- @s1 — los 4 nombres en orden exacto.
- @s2 — cada tarjeta muestra un párrafo de descripción no vacío.
- @s3 — bajo la rejilla: "Selección inicial — abierta a debate según el plan comercial."

## Bitácora de ciclos

### Ciclo 1 — ROJO

Test `src/components/Sectores.test.tsx` codifica cabecera (eyebrow/H2/intro),
`id="sectores"`, @s1 (4 nombres en orden), @s2 (4 descripciones no vacías/exactas)
y @s3 (nota bajo rejilla). Falla: `Sectores` no existe (no importa/compila).

### Ciclo 1 — VERDE

`Sectores.tsx` (+ `.module.scss`) con la sección `id="sectores"`, cabecera, rejilla
de 4 tarjetas y nota. Iconos decorativos extraídos a `SectorIcon.tsx` (aria-hidden,
fuera de mutate). Compuesto en `home.tsx` tras `<Servicios/>`.

### Ciclo 1 — REFACTOR

Datos de sector en un array tipado `SECTORS`; nombres/descripciones como copy
único. Iconos por índice en `SectorIcon`.

## Trazabilidad @s → test

| Escenario       | Test                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| @s1             | `@s1 muestra los cuatro nombres en orden exacto`                                                               |
| @s2             | `@s2 cada tarjeta muestra un párrafo de descripción no vacío` + `muestra la descripción exacta de cada sector` |
| @s3             | `@s3 muestra la nota de selección inicial bajo la rejilla`                                                     |
| (copy/mutación) | `muestra la cabecera de sección (eyebrow, H2 e intro)`, `la sección expone id="sectores"`                      |
