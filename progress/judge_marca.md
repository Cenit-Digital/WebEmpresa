# Veredicto del Judge — marca (#12)

> Feature: `marca` (#12), única `in_progress`. Rama `feat/design-system`.
> Contrato: `features/marca.feature` (@s1–@s8). Bitácora: `progress/tdd_marca.md`.
> Fuente de verdad de diseño: `docs/DESIGN_SYSTEM.md` + `design/fundamentos/`.

## VEREDICTO: APPROVED

`./init.sh` termina verde (typecheck + lint + test, 34 passed, exit 0). Los 8
escenarios están cubiertos por tests concretos, hay disciplina TDD verificable y
la calidad respeta arquitectura y `DESIGN_SYSTEM.md`. Se aprueba para pasar a la
puerta de mutación (`mutation_tester`).

---

## 1 · Cobertura de escenarios (@s -> test)

| @s | Escenario | Test que lo verifica | Then medible |
| --- | --- | --- | --- |
| @s1 | icono "Órbita" (2 circle + path, aria-hidden) | src/components/Logo.test.tsx:6 | querySelectorAll('circle') = 2, path != null, aria-hidden="true" |
| @s2 | wordmark por defecto ("cénit"/"digital") | src/components/Logo.test.tsx:17 | getByText('cénit') y getByText('digital') |
| @s3 | oculta wordmark con withWordmark=false | src/components/Logo.test.tsx:24 | queryByText no en el documento |
| @s4 | tamaño configurable (size=38) | src/components/Logo.test.tsx:31 | width/height = "38" |
| @s5 | id de degradado único por instancia | src/components/Logo.test.tsx:39 | 2 linearGradient, ids truthy y distintos |
| @s6 | colores desde tokens (ring/zenith/primary/secondary) | src/components/Logo.test.tsx:55 | stroke/fill/stop-color = var(--color-…) exactos |
| @s7 | claro -> --color-primary: #1e7a4f | src/styles/tokens.test.ts:23 | regex sobre bloque :root claro |
| @s8 | oscuro -> --color-primary: #c9a84c | src/styles/tokens.test.ts:27 | regex sobre bloque :root[data-theme=dark] |

8/8 cubiertos. Ningún @s queda sin test.

Nota @s7/@s8: jsdom no resuelve custom properties con getComputedStyle, así que
el contrato de tokens se verifica leyendo la fuente SCSS (mismo patrón declarado
y ya usado en Header.test @s4). Elección razonada, no un atajo: la aserción sigue
siendo medible y afirma el valor exacto del diseño.

## 2 · Disciplina TDD

- Bitácora Rojo->Verde->Refactor completa y honesta en progress/tdd_marca.md
  (ll. 20-48): cada @s deriva del .feature, cada ROJO nombra por qué falla contra
  el estado previo (logo azul/menta sin path, paleta Teal #0e8a82, dark #1e6fa8).
- Un-test-a-la-vez correcto: en @s7 se conserva a propósito el bloque dark antiguo
  "para mantener @s8 en rojo" — evidencia de que no se escribió producción por
  delante del test.
- Blast-radius declarado y legítimo: el nuevo wordmark ("cénit"/"digital", antes
  "CÉNIT DIGITAL") obliga a actualizar UNA sola aserción de Header.test @s1 a
  toHaveAccessibleName(/cénit digital/i) (Header.tsx:12 aporta el aria-label
  "Cénit Digital — inicio"). Consecuencia esperada del cambio de logo, no un test
  debilitado para ocultar un fallo.
- Producción sin test que la exija: NO la hay en la lógica. Todos los elementos
  de Logo.tsx (anillo, onda, punto, degradado, wordmark, size, withWordmark) los
  ejerce @s1–@s6.
  - _base.scss y main.tsx (fuentes DM Sans 600/700) se portan como fundamentos
    del handoff sin @s dedicado; son CSS base y carga de assets SIN lógica, y así
    se declara en la bitácora (ll. 50-55). No procede test unitario. No viola la
    Ley 1.
  - Los atributos numéricos de geometría SVG (cx/cy/r/d/strokeWidth/offset/x1…)
    no se asertan por escenario. Es arte vectorial estático, no lógica; la
    bitácora ya los señala como posibles supervivientes para el mutation_tester.
    Esa es la puerta correcta, no esta.

## 3 · Calidad (lente de artesano)

- Color solo vía var(--color-…) en componentes: Logo.tsx y Logo.module.scss no
  contienen ni un hex; consumen --color-ring, --color-zenith, --color-primary,
  --color-secondary, --color-logo-ink, --color-logo-sub. Los únicos hex viven en
  _tokens.scss (fuente de verdad).
- Logo "Órbita" fiel a DESIGN_SYSTEM.md: anillo circle r=30, onda path con
  degradado primary->secondary, punto cénit circle cy=20; viewBox="0 0 80 80",
  aria-hidden/focusable="false"; size (default 40) y withWordmark (default true);
  wordmark en dos líneas 23px/8px. Coincide con §1 del design system.
- useId por instancia: Logo.tsx:19 genera cenit-wave-<id> sin ":" (selector
  válido) -> evita colisión nav+footer. Verificado por @s5.
- Tokens Bosque & Limón / Noche & Oro: contrastados 1:1 contra la tabla §3 del
  design system (primary #1e7a4f/#c9a84c, secondary #e3d34a/#7c5cbf, ring,
  zenith, etc.). Sin discrepancias.
- Alias deprecados presentes: --color-soft, --color-brand, --color-brand-mint
  (_tokens.scss:73-75) como alias de primary/secondary para no romper el
  scaffold. Correcto y documentado.
- Fidelidad 1:1 con el diseño aprobado: diff de los 5 ficheros portados (Logo.tsx,
  Logo.module.scss, _tokens.scss, _base.scss, main.tsx) contra design/fundamentos/
  -> IDÉNTICOS.
- Funciones cortas, un componente por archivo, nombres reveladores, sin
  duplicación, sin console.log/TODO, TS sin any. Respeta docs/architecture.md
  (Logo en components/, sin cruces de capa).

## 4 · ./init.sh

VERDE — exit 0: typecheck sin errores · lint sin errores · 34 tests passed.

Observación (no bloqueante): una primera pasada de ./init.sh falló en lint por un
ENOENT sobre .vite-react-ssg-temp (directorio temporal de build de vite-react-ssg
que aparece/desaparece durante el escaneo de ESLint). Es una condición de carrera
con un artefacto de build, NO un defecto de la feature: pnpm lint reejecutado en
estado limpio da exit 0, y ./init.sh completo vuelve verde de forma reproducible.
Sugerencia de higiene para el lead (fuera de esta feature): añadir
.vite-react-ssg-temp a ignores en eslint.config.js, junto a dist/coverage/.stryker-tmp.

## 5 · Checkpoints (CHECKPOINTS.md)

- C1 — Arnés completo: [x] archivos base; [x] docs; [x] ./init.sh exit 0.
- C2 — Estado coherente: [x] una sola in_progress (marca #12); [x] features done
  con tests que pasan; [x] progress/current.md describe la sesión activa.
- C3 — Arquitectura: [x] src/ dentro de lo previsto; [x] TS estricto sin any
  injustificado; [x] sin console.log/TODO en el código de la feature.
- C4 — Verificación real: [x] módulos con lógica con test; [x] pnpm test 34 > 0 y
  verdes; [x] typecheck + lint en verde, sin warnings.
- C5 — Cierre de sesión: [x] sin temporales versionados; [ ] progress/history.md
  lo cierra el lead al finalizar la sesión (fuera del alcance del judge);
  [x] feature en su estado correcto (in_progress).
- C6 — Contrato Gherkin: [x] marca sdd:true con features/marca.feature;
  [x] escenarios @s1..@s8 tagueados con Then medibles; [x] mapa @s -> test en
  progress/tdd_marca.md; [x] sin producción que ningún test rojo pidiera.
- C7 — Mutación: [ ] pendiente — la valida el mutation_tester DESPUÉS de esta
  aprobación (Logo.tsx ya está en mutate de stryker.config.json).

## 6 · Observaciones fuera de alcance (no bloquean)

- #fff suelto en src/pages/home.module.scss:47,
  src/components/ContactDialog.module.scss:4 y
  src/components/HeaderNav.module.scss:14. Provienen del scaffold (WEB-2, commit
  16cbbe3) y de nav (WEB-4, commit 58a06e6), NO de la feature marca. Deben
  migrarse a var(--color-on-primary) cuando se converjan sus features (nav está
  reabierto a spec_ready; contacto/home pendientes). Deuda de esas features, no
  de esta.

---

Resultado: APPROVED. Procede lanzar mutation_tester (C7). No marcar done hasta
que la mutación supere el umbral de docs/mutation-testing.md.
