# Veredicto del Juez — nav (corrección de regresión responsive)

**Veredicto: APROBADO**

Alcance: revisión de la corrección de regresión responsive de la feature `nav`.
Cambios **solo CSS, aditivos**; el contrato `features/nav.feature` NO cambia y
sus 8 escenarios siguen siendo ciertos. No he editado código: solo dictamino.

## Los 6 puntos exigidos

1. **Breakpoint coherente — OK.** `src/components/HeaderNav.module.scss:35`
   usa `@media (max-width: 767px)`, idéntico a
   `MOBILE_QUERY = '(max-width: 767px)'` en `src/lib/useIsMobile.ts:4`. El
   comentario de `HeaderNav.module.scss:29-34` documenta el acoplamiento.

2. **Desktop y lógica intactos — OK.** El `@media` solo aplica
   `.nav { display: none }` a ≤767px; a ≥768px `.nav` conserva su
   `display: flex` (`HeaderNav.module.scss:1-5`). El clúster móvil usa `.mobile`
   (`HeaderNav.module.scss:7-11`), no tocado. Los `z-index: 100` de `.overlay`
   (`MobileMenu.module.scss:17-22`) y `.panel` (`:24-39`) son `position: fixed`
   y solo afectan al drawer abierto. `HeaderNav.tsx` y `MobileMenu.tsx` sin
   cambios de lógica.

3. **Tests significativos, NO tautológicos — OK.**
   - `src/components/MobileMenu.test.tsx:68-78` (`@s5..@s8`): el helper
     `zIndexOf` (`:9-13`) lee el z-index REAL de `.header` en
     `Header.module.scss`, lo asevera `toBe(50)` (guardia anti-tautología: si la
     cabecera cambiara su 50, el test avisa) y compara `overlayZ`/`panelZ`
     numéricamente `> headerZ` contra ese 50 real, no contra un literal
     hardcodeado. Comparación con sentido, tal y como se pedía.
   - `src/components/HeaderNav.test.tsx:74-83` (`@s4` estático): acopla el
     breakpoint 767px EXACTO al CSS prerenderizado; si se escribiera 768px el
     test fallaría. Refuerza el HTML pre-hidratación (SSG), no el estado
     post-hidratación que ya cubría el `@s4` con `matchMedia`.

4. **Cobertura de los 8 `@s` de `nav.feature` — OK.**
   - @s1 → `Header.test.tsx:56`
   - @s2 → `HeaderNav.test.tsx:27` (+ `:58` no-hamburguesa)
   - @s3 → `Header.test.tsx:64`
   - @s4 → `HeaderNav.test.tsx:66` (post-hidratación) + `:74` (HTML estático, nuevo)
   - @s5 → `MobileMenu.test.tsx:16`
   - @s6 → `MobileMenu.test.tsx:33`
   - @s7 → `MobileMenu.test.tsx:46`
   - @s8 → `MobileMenu.test.tsx:57`
   - refuerzo apilado @s5..@s8 → `MobileMenu.test.tsx:68` (nuevo)
   Contrato sin cambios; ningún escenario roto.

5. **Verde y limpio — OK.** `./init.sh` termina con exit 0: typecheck sin
   errores, `pnpm lint` 0 warnings (exit 0), `pnpm test` 21 files / **161
   passed / 161**. Sin `console.log`/`TODO`/`FIXME` en `src/components`.

6. **Riesgo de apilado y a11y — revisado, sin bloqueo.**
   - `.skip-link` (`src/styles/_base.scss:47-56`) tiene `z-index: 100`, IGUAL
     que `.overlay`/`.panel` (100). Empate de z-index. No es un problema
     funcional: (a) el `Dialog` de Radix se pinta vía `Dialog.Portal`
     (`MobileMenu.tsx:16`), que se añade al final de `body`, DESPUÉS del
     skip-link → con z-index empatado gana el orden del DOM y el drawer pinta
     por encima; (b) con el drawer abierto Radix atrapa el foco dentro del
     diálogo, y el skip-link solo es visible en `:focus` (`_base.scss:58-60`),
     así que no puede aflorar mientras el menú está abierto. Fragilidad latente
     (el drawer vence por orden del DOM, no por z-index estrictamente mayor),
     segura en la práctica porque Radix siempre portaliza al final de `body`.
     Sugerencia no bloqueante: si se quiere robustez total, dar al drawer un
     valor estrictamente mayor que el skip-link (o tokenizar la escala de capas).
   - Ocultar `.nav` con `display:none` a ≤767px en el HTML prerenderizado no
     introduce regresión de accesibilidad: `display:none` la saca del árbol de
     accesibilidad y del foco; tras hidratar, `HeaderNav` renderiza la rama
     móvil (`MobileMenu`) y la nav de escritorio desaparece del DOM.
   - La cabecera (z-index:50) queda oscurecida por el overlay (100): el título
     "Menú" y el botón ✕ quedan visibles e interactuables, que es justo el
     defecto que se corrige.

## Disciplina TDD

`progress/tdd_nav_responsive.md` documenta dos ciclos Rojo→Verde→Refactor con
el fallo real citado (`1 failed / 159 passed` en el @s4; `expected NaN to be
greater than 50` en el z-index). Ambas líneas de producción CSS están exigidas
por un test que fallaba antes: no hay producción que ningún test rojo pidiera.

## Checkpoints

- C2 — Estado coherente: [x] (una sola feature en foco; contrato intacto).
- C3 — Arquitectura/RF-CODE-001: [x] (SCSS Modules, sin `any`, sin console/TODO).
- C4 — Verificación real: [x] (`init.sh` verde; 161 tests > 0, sin warnings).
- C6 — Contrato Gherkin: [x] (los 8 `@s` con test; mapa en
  `progress/tdd_nav_responsive.md`; sin producción sin test).
- C7 — Mutación: pendiente del `mutation_tester` (puerta posterior).

## Nota de proceso (no bloqueante, no la corrijo)

La feature `nav` figura como `status: "done"` en `feature_list.json` (id 2) y no
como `in_progress`; esta es una pasada de corrección de regresión sobre una
feature ya cerrada. La disciplina de review se cumple; dejo la anotación para
que el `craftsman_lead` decida el reflejo de estado. No es mi competencia editarlo.

**Conclusión: APROBADO.** Diseño y cobertura correctos; `./init.sh` verde; los
tests nuevos muerden numéricamente contra el 50 real de la cabecera; contrato
`nav.feature` sin cambios. Queda la puerta del `mutation_tester` (SCSS no se
muta; `HeaderNav.tsx`/`MobileMenu.tsx` ya están en `mutate`).
