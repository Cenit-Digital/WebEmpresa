# Veredicto del `judge` — feature #2 `nav` (Navegación de la cabecera, WEB-4)

**Fecha:** 2026-07-03 · **Contrato:** `features/nav.feature` (@s1..@s9) ·
**Bitácora:** `progress/tdd_nav.md`

## Comprobaciones ejecutables

- `./init.sh` → **exit 0** (typecheck · lint · test verdes).
- `pnpm typecheck` → sin errores.
- `pnpm lint` → sin errores **ni warnings** (exit 0, salida vacía).
- `pnpm test` → **26 tests verdes** (7 archivos). **0 líneas de stderr**, sin
  avisos de React/`act()`/deprecación (la etiqueta `stderr |` del reporter
  verbose resultó ser un artefacto de orden: la ejecución limpia arroja 0).
  21 de los 26 son de nav; el resto son `seo` (feature 1) y `ThemeToggle`
  (feature 3), que **no regresionan**.

## Checklist C1–C6 (C7 lo valida el `mutation_tester`)

- **C1 — Arnés completo:** [x] `./init.sh` termina en 0; docs y archivos base
  presentes.
- **C2 — Estado coherente:** [x] solo `nav` en `in_progress`; feature 1 `done`
  con tests que pasan; `progress/current.md` describe la sesión activa.
- **C3 — Arquitectura:** [x] lógica en `src/lib/` pura (`nav.ts` datos,
  `useIsMobile.ts` hook sin JSX); componentes PascalCase, 1 por archivo; TS sin
  `any` injustificado en producción (los `as unknown as typeof window.matchMedia`
  viven solo en tests, justificados para el mock); sin `console.*`, `TODO` ni
  `debugger`. (Observación menor abajo.)
- **C4 — Verificación real:** [x] cada módulo con lógica tiene test co-locado;
  `pnpm test` > 0 y verde; typecheck+lint sin warnings.
- **C5 — Sesión bien cerrada:** [x] `current.md` al día y `tdd_nav.md` con
  bitácora + trazabilidad. (La entrada en `history.md` la cierra el lead.)
- **C6 — Contrato Gherkin:** [x] `.feature` con `@s1..@s9`, cada `Then`
  medible; cada `@s` cubierto por ≥1 test significativo; mapa `@s → test` en
  `tdd_nav.md`; sin producción que ningún test rojo pidiera.

## Estado de cada escenario

- **@s1** (logo → "/") — `Header.test.tsx`: `href="/"` + texto "CÉNIT DIGITAL".
  Significativo. **OK**.
- **@s2** (nav escritorio + CTA) — `nav.test.ts` (datos exactos) +
  `HeaderNav.test.tsx` compara el array de `[label, href]` de los 5 enlaces en
  orden, con CTA "Hablamos" → `#contacto`. **OK**.
- **@s3** (cada enlace desplaza) — `HeaderNav.test.tsx` `it.each` de los 4
  ejemplos; clic real y aserción `window.location.hash === ancla`. **OK**.
- **@s4** (sticky) — `Header.test.tsx`: liga la clase del `banner` y verifica
  `position: sticky`/`top: 0` en el módulo SCSS. Estrategia jsdom razonable y
  documentada; aserción significativa (no trivial). **OK**.
- **@s5** (panel abre + 4 enlaces en orden) — `MobileMenu.test.tsx` verifica
  cierre inicial, apertura y `[Servicios, Sectores, Paquetes, Contacto]` (la
  decisión de la puerta); `HeaderNav.test.tsx` (botón visible / nav oculta en
  móvil); base responsive en `useIsMobile.test.tsx`. **OK**.
- **@s6** (✕ cierra) — `MobileMenu.test.tsx`: abre, comprueba diálogo, pulsa
  "Cerrar menú" (texto ✕), diálogo desaparece. **OK**.
- **@s7** (enlace cierra + navega) — `MobileMenu.test.tsx`: pulsa "Paquetes"
  dentro del panel; asevera **cierre** y `hash === "#paquetes"`. **OK**.
- **@s8** (fondo cierra) — `MobileMenu.test.tsx`: clic en el overlay
  (`data-testid`) cierra el diálogo. Aserción significativa. **OK**.
- **@s9** (menú solo en móvil / escritorio ve la nav) — `HeaderNav.test.tsx`
  (escritorio: nav presente, sin botón "Abrir menú") + `useIsMobile` (`getServer
Snapshot`/`getSnapshot` false). **OK**.

## Olores TDD

Ninguno material. La bitácora evidencia Rojo→Verde→Refactor por ciclo y
documenta honestamente dos autocorrecciones (ciclos 2 y 6: se **podó**
producción que se había adelantado a su test, para que cada trozo naciera de un
rojo) — refuerza las Tres Leyes, no las viola: al cerrar no queda producción sin
test. No hay tests "a futuro", refactors en rojo, funciones largas ni nombres
opacos. `ThemeToggle` (isla `ClientOnly`, feature 3) se **preserva** en
`Header.tsx:16` y sus tests siguen verdes: sin regresión.

## Stryker

`stryker.config.json` incluye `nav.ts`, `useIsMobile.ts`, `HeaderNav.tsx`,
`MobileMenu.tsx` y **conserva** `seo.ts`. `Header.tsx` queda fuera del glob:
justificado (composición estática sin lógica condicional + isla
`ClientOnly(ThemeToggle)` de otra feature). Razonable; el umbral `break: 100`
sobre lo tocado lo valida el `mutation_tester` (C7).

## Observaciones menores (no bloqueantes)

- Colores hardcodeados en SCSS: `HeaderNav.module.scss:14` (`color: #fff`),
  `MobileMenu.module.scss:18` (`rgba(7,33,31,.55)`) y `:34`
  (`rgba(0,0,0,.25)`). Convención `docs/conventions.md` pide `var(--color-…)`,
  pero **no existe token** para blanco-sobre-primario ni para scrim/sombra, y el
  baseline ya `done` (feature 1: `ContactDialog.module.scss:4,13,27` y
  `_base.scss:46`) usa **exactamente** estos mismos patrones. No regresiona la
  línea base; queda como deuda para un futuro `--color-on-primary`/`--color-scrim`.
- El mock de `matchMedia` se repite en tres tests (patrón local co-locado);
  aceptable.

## Veredicto

**APROBADO.** El contrato @s1..@s9 está cubierto con aserciones significativas,
la disciplina TDD es demostrable y verde, la arquitectura y las convenciones se
respetan (con la única observación menor, alineada con el baseline). `./init.sh`
en verde, 26 tests, 0 warnings. Pasa a `mutation_tester` (C7).

---

## Re-review (post-mutación) — 2026-07-03

**Contexto:** tras mi aprobación, el `mutation_tester` reportó 1 superviviente
(score 97.37% < `break: 100`): `MOBILE_QUERY = '(max-width: 767px)' → ""` en
`src/lib/useIsMobile.ts:4`. El `tdd_craftsman` lo cerró con un cambio
**test-only**. Único diff desde mi aprobación: `src/lib/useIsMobile.test.tsx`.

**Verificado:**

1. `pnpm typecheck` (exit 0) · `pnpm lint` (exit 0, sin warnings) · `pnpm test`
   → **26 tests verdes** (7 archivos). Sin regresión.
2. El endurecimiento es una aserción **legítima**, no un olor: el fake
   (`useIsMobile.test.tsx:20`) ancla `matches` al breakpoint **codificado a
   mano** `'(max-width: 767px)'` en vez del símbolo importado. Rompe la
   tautología "el test importa la misma constante que verifica": ahora, si
   producción muta `MOBILE_QUERY → ""`, `window.matchMedia("")` no coincide con
   el literal, el fake devuelve `false` y `@s5 getSnapshot` / `@s5 useIsMobile
móvil` / `@s9 reacciona` se ponen rojos → el mutante muere. Pinar el
   breakpoint del contrato no es sobre-ajuste: es exactamente el comportamiento
   que producción debe cumplir (consultar la media query correcta).
3. `MOBILE_QUERY` **ya no se importa** en ningún test (línea 4 depurada): sin
   import muerto. Confirmado por grep en `src/`.
4. **Producción intacta:** `useIsMobile.ts` sin cambios (`MOBILE_QUERY`
   exportado y usado en :8 y :15; el literal del test coincide byte a byte). El
   resto de la cobertura @s1..@s9 no se tocó.
5. Ciclo extra registrado en `progress/tdd_nav.md` (#16) con causa raíz
   (tautología), arreglo y verificación Rojo→Verde documentada.

**Veredicto de re-review: RATIFICADO — sigue APROBADO.** El cambio es
test-only, endurece la red sin alterar producción ni el contrato, y no
introduce olor. Listo para revalidar la mutación (esperado 100% sobre lo
tocado).
