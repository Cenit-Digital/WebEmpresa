# Veredicto del Juez — sectores (#8)

Rama `feat/design-system`. Contrato: `features/sectores.feature` (@s1–@s3).
Diseño: `docs/DESIGN_SYSTEM.md` §5 (fondo bg-2) y §6 (tarjeta de sector).
Referencia de copy: `design/Cenit Home (referencia) - standalone.html` (sección sectores).

## VEREDICTO: APPROVED — 0 hallazgos bloqueantes

---

## 1 · Cobertura de escenarios (@s → test)

| @s  | Then del contrato                                                                           | Test que lo verifica                                                                                                             | Estado |
| --- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------ |
| @s1 | 4 nombres en orden: Veterinarias, Servicios de estética, Clínicas dentales, Fisioterapeutas | `Sectores.test.tsx:36` `@s1 muestra los cuatro nombres en orden exacto` (`getAllByRole heading level 3` → `toEqual(NAMES)`)      | OK     |
| @s2 | cada tarjeta con descripción no vacía                                                       | `Sectores.test.tsx:43` `@s2 cada tarjeta muestra un párrafo de descripción no vacío` (+ `:54` descripción exacta de cada sector) | OK     |
| @s3 | nota "Selección inicial — abierta a debate según el plan comercial." bajo la rejilla        | `Sectores.test.tsx:62` `@s3 muestra la nota de selección inicial bajo la rejilla`                                                | OK     |

Cabecera e `id` cubiertos: `:17` (eyebrow/H2/intro) y `:30` (`section#sectores`).
Ningún `@s` queda sin test.

## 2 · Fidelidad de copy (anti-alucinación) — CONTRA la referencia HTML

Comparado literal (grep `-o` sobre la línea 183 del standalone). Coinciden byte a byte:

- Eyebrow `A quién ayudamos` — OK
- H2 `Sectores con los que trabajamos` (con `<em>trabajamos</em>`) — OK
- Intro `Nos especializamos en pocos sectores para conocerlos a fondo. Hablamos el idioma de tu negocio y sabemos qué necesita tu cliente.` — OK
- Veterinarias — `Webs y reservas para clínicas veterinarias: fichas de servicios, citas online y recordatorios para que ningún paciente se quede sin revisión.` — OK
- Servicios de estética — `Presencia digital para centros de estética y belleza: catálogo de tratamientos, reservas online y campañas que llenan la agenda.` — OK
- Clínicas dentales — `Captación de pacientes para clínicas dentales: SEO local, reseñas y un sistema de citas que reduce las ausencias de última hora.` — OK
- Fisioterapeutas — `Webs para fisioterapeutas y osteópatas: explica tus terapias, posiciónate en tu zona y deja que tus pacientes reserven solos.` — OK
- Nota — `Selección inicial — abierta a debate según el plan comercial.` — OK

Sin desviaciones. Los cuatro strings del array `SECTORS` (`Sectores.tsx:9-30`) coinciden con `DESCRIPTIONS` del test y con la referencia.

## 3 · Estructura, color y diseño (§6)

- `section id="sectores"` con `<h2>` (`Sectores.tsx:34,38`). OK.
- Colores: 0 hex en `Sectores.tsx`, `Sectores.module.scss` y `SectorIcon.tsx` (grep de `#[0-9a-fA-F]{3,8}` sin coincidencias). Todo vía `var(--color-…)`. El degradado de cabecera usa `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` (`.module.scss:73`), conforme a §3/§6. OK.
- §6 tarjeta de sector: `radius:18px`, cabecera 150px con degradado + círculos `on-primary` a baja opacidad + icono 62px, cuerpo H3 23px + descripción, hover `translateY(-4px)` + `border-color:primary`. Todo presente en el SCSS. OK.
- §5: sección con fondo `var(--color-bg-2)` (`.module.scss:2`). OK.
- Compuesto en `home.tsx:15` tras `<Servicios/>`. OK.

## 4 · Disciplina TDD (bitácora)

`progress/tdd_sectores.md` documenta Rojo→Verde→Refactor del ciclo 1 y el mapa `@s → test`. El icono decorativo se extrae a `SectorIcon.tsx` (`aria-hidden`, excluido de `stryker.config.json mutate`); `Sectores.tsx` sí está en `mutate`. No hay producción de comportamiento que ningún test exija: el copy está fijado por tests exactos y el resto es marcado/decoración.

## 5 · Calidad (lente de artesano)

- Componente funcional único por archivo, `SECTORS: readonly Sector[]` tipado, nombres reveladores, sin duplicación de copy (fuente única). OK.
- `SectorIcon` selecciona pictograma por índice; literales SVG documentados como decoración. OK.
- Nota: `radius:18px` es específico de la tarjeta de sector en §6 (no existe token de 18px); es fidelidad al diseño, no número mágico injustificado.

## 6 · Verificación (`./init.sh` + build)

- typecheck: verde.
- lint: verde, 0 warnings (sin salida).
- test: **97 passed**, todos verdes.
- build (SSG): verde — `dist/index.html` 22.71 KiB renderizado.

## CHECKPOINTS

- C1 arnés completo — [x]
- C2 estado coherente — [~] (ver observación)
- C3 arquitectura respetada — [x] (component en `components/`, sin `any`, sin `console.log`/TODO)
- C4 verificación real — [x] (97 tests verdes, typecheck/lint limpios)
- C6 contrato Gherkin — [x] (cada `@s` con test; sin producción sin test)
- C7 mutación — [ ] pendiente del `mutation_tester` (puerta posterior)

## Observación NO bloqueante (para el craftsman_lead)

`feature_list.json` marca `sectores` (#8) como `status: "spec_ready"` y hay **0** features en `in_progress`. La implementación, tests y bitácora ya existen y pasan la review, por lo que el estado debería reflejar el punto del pipeline (in_progress → tras mutación, done). Es una incoherencia de etiqueta de proceso que corrige el lead; no afecta al juicio de código/cobertura y no bloquea esta aprobación.
