# Veredicto del Juez — hero (#6)

Rama `feat/design-system`. Contrato `features/hero.feature` (@s1–@s6).
Implementación `src/components/Hero.tsx` + `Hero.module.scss`, compuesta en
`src/pages/home.tsx`. Tests `src/components/Hero.test.tsx`. Bitácora
`progress/tdd_hero.md`.

## Resultado: APPROVED

Hallazgos bloqueantes: **0**.

## Cobertura de escenarios (@s → test, real y no tautológico)

| @s  | Requisito                                              | Test                  | Verificación                                                                                                                                                                                                                                                                                                |
| --- | ------------------------------------------------------ | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @s1 | eyebrow "Soluciones digitales para pymes"              | `Hero.test.tsx:6-10`  | `getByText('Soluciones digitales para pymes')` (cadena exacta). Impl `Hero.tsx:14`. OK                                                                                                                                                                                                                      |
| @s2 | H1 (heading nivel 1) texto EXACTO                      | `Hero.test.tsx:12-19` | `getByRole('heading',{level:1})` + `textContent` `.toBe(...)` con la frase completa. Impl `Hero.tsx:15-17` es texto plano sin `<em>`, el nombre accesible es la cadena íntegra. OK                                                                                                                          |
| @s3 | párrafo con "todo bajo una cuota mensual, sin entrada" | `Hero.test.tsx:21-27` | `getByText(/todo bajo una cuota mensual, sin entrada/)`. Impl `Hero.tsx:18-21`. OK                                                                                                                                                                                                                          |
| @s4 | enlace "Ver paquetes" -> `#paquetes`                   | `Hero.test.tsx:29-34` | `getByRole('link',{name:'Ver paquetes'})` + `href` `#paquetes`. Impl `Hero.tsx:23-25`. OK                                                                                                                                                                                                                   |
| @s5 | enlace "Hablar con nosotros" -> `#contacto`            | `Hero.test.tsx:36-41` | `getByRole('link',{name:'Hablar con nosotros'})` + `href` `#contacto`. Impl `Hero.tsx:26-28`. OK                                                                                                                                                                                                            |
| @s6 | 4 parejas valor/etiqueta EXACTAS                       | `Hero.test.tsx:43-59` | Recorre las 4 parejas (`24h`/`tiempo de respuesta`, `+30`/`pymes confían`, `100%`/`diseño a medida`, `5*`/`valoración media`) y exige que valor y etiqueta compartan `parentElement` (misma tarjeta). Impl `STATS` en `Hero.tsx:3-8`, `.stat` con `.statValue`/`.statLabel` hermanos (`Hero.tsx:30-37`). OK |

Cada `@s` tiene al menos un test concreto que afirma algo medible; ninguno es
tautológico (comparaciones contra literales exactos y relación estructural real).

## Disciplina TDD

`progress/tdd_hero.md:19-38` documenta Rojo->Verde por escenario (import fallido,
ausencia de heading, de párrafo, de enlaces, de stats) y un refactor en verde
(retirada de estilos hero muertos de `home.module.scss`). No se observa
producción que ningún test exija: todos los nodos renderizados por `Hero.tsx`
están cubiertos por los asserts.

## Calidad (lente de artesano) y arquitectura

- Función única, corta y declarativa; nombres reveladores; `STATS` como
  `const` tipado (`as const`) sin números mágicos dispersos.
- `Hero.module.scss`: **0 hex** (búsqueda `#[0-9a-fA-F]{3,8}` sin coincidencias);
  colores solo vía `var(--color-…)`, conforme a `docs/conventions.md` y
  `DESIGN_SYSTEM.md` secciones 4/5/6/8. Radios/pesos segun diseño.
- Composición correcta: `Hero` vive dentro de `<main id="contenido">` a través
  del `<Outlet/>` de `Layout.tsx:28-30`; `home.tsx:12` lo inserta.
- Respeta `docs/architecture.md` (componente en `src/components`, composición en
  `src/pages`) y RF-CODE-001 (TS estricto, sin `any`).

## Verificación (`./init.sh`) y regresiones

- typecheck: verde. lint: **0 warnings**. test: **82 passed**. `./init.sh` exit 0.
- `pnpm build` (SSG): verde; hero prerenderizado en `dist/index.html`
  (`Soluciones digitales para pymes` y `Llevamos tu negocio al punto…` presentes,
  dentro de `main id="contenido"`).
- Sin regresiones: `home.test` (título exacto
  `Cénit Digital — Soluciones digitales para pymes`, `home.test.tsx:14-17`,
  intacto) y `Layout.test` siguen verdes dentro de los 82.

## Checkpoints

- C1 arnés completo — [x]
- C2 estado coherente — [x] (ver observación)
- C3 arquitectura — [x]
- C4 verificación real — [x] (82 tests, typecheck/lint verdes)
- C6 contrato Gherkin — [x] (mapa @s->test en `progress/tdd_hero.md`)
- C7 mutación — pendiente del `mutation_tester` (puerta posterior a esta aprobación)

## Observación no bloqueante

`feature_list.json:90` mantiene `hero` en `status: "spec_ready"` mientras la
implementación ya está completa; ningún feature figura en `in_progress`
(la aparición de "in_progress" en la línea 11 es el valor del enum
`valid_status`, no un estado activo). Es bookkeeping del orquestador, fuera del
código de `src/`, y no afecta al veredicto. Debe pasar a `in_progress`/`done`
según el flujo tras mutación.

Diseño y cobertura aprobados. Procede el `mutation_tester` (C7) antes de marcar `done`.
