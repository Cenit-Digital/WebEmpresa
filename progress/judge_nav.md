# Veredicto del Juez — feature #2 `nav` (Navegación de la cabecera, WEB-4)

**Contrato juzgado:** `features/nav.feature` (@s1–@s8, contrato NUEVO reabierto en
la puerta humana; sustituye al viejo de 9 escenarios).
**Rama:** `feat/design-system`.
**Resultado:** **APPROVED**.

> El juez valora diseño y cobertura. La mutación (`mutation_tester`) corre
> después y es la otra puerta; ambas deben pasar antes de `done`.

---

## 1 · Puerta dura — `./init.sh`

Verde de punta a punta (exit 0):

- `pnpm typecheck` — sin errores.
- `pnpm lint` — sin warnings.
- `pnpm test` — **64 passed**, 0 fallos, 0 skips.

No se aprueba nada con `init.sh` en rojo: aquí está verde.

## 2 · Cobertura de escenarios (cada @s con test concreto, re-mapeado al NUEVO contrato)

| @s | Comportamiento | Test que lo verifica |
| -- | -------------- | -------------------- |
| @s1 | Logo enlaza a "/" | `Header.test.tsx:31` `@s1 el logotipo enlaza a "/"` — `href="/"` + nombre accesible "Cénit Digital … inicio" (prod: `Header.tsx:12`). |
| @s2 | Nav escritorio + CTA | `HeaderNav.test.tsx:20` (array exacto de 5 enlaces, incl. `Hablamos → #contacto`) y `:37` (no aparece "Menú"); `lib/nav.test.ts:5,14`; base `useIsMobile.test.tsx:47,56`. |
| @s3 | Cabecera sticky | `Header.test.tsx:39` lee `Header.module.scss` (`position: sticky` + `top: 0`) — patrón del repo, jsdom no hace layout (prod: `Header.module.scss:2-3`). |
| @s4 | Móvil oculta escritorio + botón "Menú" | `HeaderNav.test.tsx:45`; base `useIsMobile.test.tsx:51,61,76,82`. |
| @s5 | Abrir panel + 4 enlaces en orden | `MobileMenu.test.tsx:7`. |
| @s6 | Cerrar con botón "Cerrar" | `MobileMenu.test.tsx:24`. |
| @s7 | Enlace del panel cierra | `MobileMenu.test.tsx:37`. |
| @s8 | Fondo (overlay) cierra | `MobileMenu.test.tsx:48`. |

Los 8 escenarios están cubiertos. Los tests citan el `@s` en su nombre y están
re-alineados al contrato nuevo. **Sin restos del contrato viejo**: no aparecen
"Abrir menú", "Cerrar menú", `scrollIntoView`, ni los escenarios eliminados
(desplazamiento por ancla, escritorio-oculta-menú `@s9`). El único match de
"botón de menú" es la descripción legítima de un test (`HeaderNav.test.tsx:37`),
no producción.

## 3 · Disciplina TDD

`progress/tdd_nav.md` documenta Rojo→Verde→Refactor por ciclo, con tabla de delta
explícita respecto al contrato anterior y trazabilidad `@s → test`. Los renombres
de producción (aria-label `Abrir menú`→`Menú`, `Cerrar menú`→`Cerrar`) están
justificados por un test rojo (`@s4`, `@s6`). No detecto producción que ningún
test exija: `nav.ts`, `useIsMobile.ts`, `HeaderNav.tsx` y `MobileMenu.tsx` están
íntegramente ejercitados; `Header.tsx` es composición estática (marca/sticky
cubiertos por @s1/@s3; `Logo`/`ThemeToggle` son de features #12/#3, ya `done`).

## 4 · Calidad (lente de artesano)

- **Nombres accesibles correctos:** trigger `aria-label="Menú"` (glifo ☰) y cierre
  `aria-label="Cerrar"` (glifo ✕). El `aria-label` gana el nombre accesible; los
  glifos son solo iconografía visual, no el nombre del contrato viejo. Correcto.
- **Enlaces correctos:** `#servicios/#sectores/#paquetes/#contacto` y
  `Hablamos → #contacto` (`lib/nav.ts:11-19`); mismo orden en escritorio y panel
  (lista única `NAV_LINKS`, sin duplicación).
- **CTA como enlace:** `<a href="#contacto">` con estilo de botón — casa con el
  `@s2` literal ("existe un **enlace** 'Hablamos'").
- **Foco visible:** cubierto globalmente en `_base.scss:41` (`:focus-visible`
  → `outline: 2px solid var(--color-primary)`), fiel a DESIGN_SYSTEM §7.
- **Logo Órbita + ThemeToggle preservados** en `Header.tsx:12-16`
  (`<Logo/>` dentro del enlace a inicio; `ClientOnly(ThemeToggle)`); sus suites
  siguen verdes dentro de los 64 tests.
- **Colores por token:** `Header.module.scss` usa `--color-band` /
  `--color-band-border` (fiel a §6); `HeaderNav.module.scss` CTA con
  `--color-primary` / `--color-on-primary` / `--radius-pill` (sin `#fff`/`999px`
  sueltos). Funciones cortas, un componente por archivo, sin números mágicos.
- **Arquitectura:** datos puros en `lib/`, componentes en `components/`; `lib` no
  importa de `components`. Respeta `docs/architecture.md`.

### Observación no bloqueante (recomendación, no condición de aprobación)

- `MobileMenu.module.scss:18` usa un scrim literal `rgba(7, 33, 31, 0.55)` para el
  overlay (mismo valor repetido en `ContactDialog.module.scss:13`, de otra
  feature). No es `hex` (la prohibición explícita de §8 es "0 hex") y no existe
  token de scrim; el `box-shadow` en `:34` usa `rgba(0,0,0,.25)`, idiomático y
  coherente con cómo `--shadow` se define en tokens. **No bloquea.** Recomiendo,
  en una limpieza futura, extraer un token `--color-scrim` para matar la
  duplicación del valor mágico entre `MobileMenu` y `ContactDialog`.

## 5 · Checkpoints (CHECKPOINTS.md)

- **C1 — Arnés completo:** [x] `init.sh` exit 0; archivos base presentes.
- **C2 — Estado coherente:** [x] `nav` única en `in_progress`; `current.md` describe la sesión.
- **C3 — Arquitectura:** [x] módulos previstos; TS estricto sin `any`; sin `console.log`/TODOs.
- **C4 — Verificación real:** [x] cada módulo con lógica tiene test; 64 verdes; typecheck+lint sin warnings.
- **C5 — Cierre de sesión:** [ ] N/A para el juez (lo cierra el lead: `history.md`, estado `done`).
- **C6 — Contrato Gherkin:** [x] `.feature` con `@s1..@s8`, cada `Then` medible; mapa `@s → test` en `tdd_nav.md`; sin producción sin test.
- **C7 — Mutación:** [ ] pendiente del `mutation_tester` (puerta posterior).

---

## Veredicto

**APPROVED.** Contrato nuevo íntegramente cubierto y re-mapeado, TDD disciplinado,
`init.sh` verde, calidad conforme al Design System §6/§7 y a `RF-CODE-001`. La
única observación (scrim rgba) es de fidelidad menor y no bloquea. Queda pendiente
la puerta de mutación antes de marcar la feature `done`.
