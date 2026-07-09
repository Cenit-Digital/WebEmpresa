# progress/history.md — bitácora append-only

## 2026-06-30 · #1 infra_base (WEB-2) — bootstrap del repositorio

Scaffolding del stack estándar (Vite + React + TS + SCSS + pnpm + SSG) con
Radix UI, design tokens de RF-MARCA-001, fuentes Outfit + DM Sans, ESLint +
Prettier, Vitest + Testing Library, Stryker y la capa Harness/SDD.
Verificación: typecheck, lint, test (5), build SSG (2 páginas) y mutación
(100%) en verde. Estado: `done`.

## 2026-07-03 · #2 nav (WEB-4) — Navegación de la cabecera

Pipeline SDD completo. Puerta humana: Pablo aprobó los 9 escenarios de
`features/nav.feature`; decisión en la puerta → el panel móvil **incluye
"Sectores"** (era un olvido del diseño de referencia), listando los 4 enlaces
en orden de escritorio (Servicios, Sectores, Paquetes, Contacto). El
`gherkin_author` ajustó `@s5`; decisión registrada en `project-spec.md` #2.

Implementación por TDD estricto (`tdd_craftsman`): lógica pura en `src/lib/`
(`nav.ts` = `NAV_LINKS` + `CTA_LINK`; `useIsMobile.ts` con
`useSyncExternalStore` sobre `matchMedia`), componentes `HeaderNav` (conmuta
escritorio ↔ móvil) y `MobileMenu` (Radix `Dialog`: abrir/✕/enlace-cierra/
backdrop). `Header.tsx` reescrito: monta `HeaderNav`, deja de importar
`ContactDialog` (superado por el contrato) y **preserva** el `ThemeToggle`
(isla `ClientOnly`, feature #3). Sticky ya venía del `Header.module.scss`.

Review (`judge`): APROBADO (9 `@s` con aserciones significativas, TDD
Rojo→Verde→Refactor demostrable). Mutación (`mutation_tester`): primera corrida
97.37% con 1 superviviente (`useIsMobile.ts:4`, literal `MOBILE_QUERY`, por
tautología en el fake de `matchMedia`); el `tdd_craftsman` ancló el fake al
literal `'(max-width: 767px)'`, el `judge` ratificó y la mutación cerró en
**100%** (38/38). Verificación final `./init.sh`: typecheck · lint · test (26)
en verde, 0 warnings. Estado: `done`.

Observación menor no bloqueante (heredada del baseline `ContactDialog`):
hex/rgba sueltos en `HeaderNav.module.scss` y `MobileMenu.module.scss` por
falta de token para blanco-sobre-primario y scrim/sombra — candidato a
`RF-MARCA-001` cuando se definan esos tokens.

## 2026-07-06 · #3–#12 Design System (WEB-4/WEB-5/WEB-6) — home completa 1:1

Sesión del Design System en `feat/design-system`: implementadas por TDD estricto,
en orden del handoff y fieles 1:1 a `design/Cenit Home (referencia).dc.html` +
`docs/DESIGN_SYSTEM.md`, las features #12 marca (logo Órbita + tokens
Bosque&Limón/Noche&Oro), #3 theme_selector (3 estados, `cenit-theme`, reacción en
vivo, anti-FOUC), #2 nav, #4 footer, #5 layout_accesibilidad, #6 hero, #7 servicios,
#8 sectores, #9 paquetes (sin precios), #10 contacto_seccion, #11 contact_form
(Resend vía `api/contact.ts`). Cada una cerró con las tres puertas (TDD Rojo→Verde→
Refactor · judge APROBADO · mutación Stryker 100%). Reconciliado `main` en
`feat/design-system` (PR #2). Verificación 0/0/0: typecheck · lint 0 warnings · 147
tests · build SSG · mutación 100% (356/356). Estado: 12/12 `done`.

## 2026-07-07 · #13 fidelidad_referencia (WEB-4/WEB-5) — restaurar fidelidad cabecera + hero

Pipeline SDD completo sobre `feat/design-system`. Conversación (lead ↔ Pablo): la
home había DERIVADO de la referencia versionada en 3 puntos de cabecera/hero; Pablo
confirmó "restaurar fidelidad" y eligió, para el tema, la **opción A1** (botón de
icono único que CICLA los 3 modos) para no regresar el requisito Jira WEB-4 (3
estados). Spec en `project-spec.md` #13; contrato en
`features/fidelidad_referencia.feature` (9 escenarios) + parche de presentación en
`features/theme_selector.feature` (@s3–@s5 al modelo de ciclo, comportamiento
intacto). El lead corrigió `@s7` del contrato (la referencia usa `space-between` con
2 grupos; la corrección del hueco central es estructural —2 hijos, no 3—, no de CSS).

Implementación por TDD estricto (`tdd_craftsman`): (1) `ThemeToggle` pasa de píldora
`radiogroup` a un único `<button>` que cicla `light→dark→system→light` (iconos
sol/luna/monitor, SVG verbatim de la referencia; monitor de Feather = única adición
aprobada), con `aria-hidden` en los iconos decorativos y nombre accesible que comunica
el modo; `theme.ts` intacto (+`nextMode` puro). (2) Cabecera a 2 grupos: `Header` deja
2 hijos (logo | `HeaderNav`); el clúster derecho ordena `[enlaces · tema · Hablamos]`;
tema preservado en móvil (anti-regresión). (3) Hero recupera el arco decorativo
`data-hero-arc` (círculo+onda+punto), `overflow:hidden` en `.hero`, `aria-hidden`.

Review: `judge` **APROBADO**; `a11y_seo_auditor` **0 bloqueantes** (WCAG 2.1 AA; se
aplicó la mejora de `aria-hidden` en iconos por TDD). Mutación (`mutation_tester`):
**100%** (98/98) acotada a los 4 ficheros tocados (`theme.ts`, `ThemeToggle.tsx`,
`HeaderNav.tsx`, `Hero.tsx`). Verificación final 0/0/0: typecheck · lint 0 warnings ·
**159 tests** · build SSG (2 páginas). Estado: `done`.

## 2026-07-07 · Refinamiento — fidelidad de detalle + responsive móvil (home)

Sesión de refinamiento (no feature nueva; sin puerta Gherkin) sobre
`feat/fidelidad-referencia`, tras importar el Design System de Claude Design
(proyecto `5699b366`) por MCP y montar un banco de comparación headless (Chrome
DevTools Protocol) autónomo. Decisiones aprobadas por Pablo: (1) objetivo =
**home aprobada original** (`docs/reference/Cenit-Home-original.html`), no el
showcase `ui_kits/web/index.html` simplificado —se mantienen las 4 secciones y
las características de paquetes—; (2) móvil = **responsive pro con los tokens**;
(3) proceso = **refinamiento SCSS directo** + tests verdes.

Causa raíz corregida (`_base.scss`): la home iba envuelta en `<main>` con
`max-width`+`padding`, lo que **duplicaba el gutter** (hero estrecho, títulos
partidos en móvil) y **recortaba las bandas de color** en escritorio; `main`
pasa a sangre completa y `.prose` a autónomo (páginas de texto). Tokens
`--gutter`/`--section-y` fluidos con `clamp` (escritorio 26/84 intactos; móvil se
ajusta). Hero responsive (padding/lead/statValue fluidos, stats 2×2 en móvil).
Servicios: fidelidad de detalle (márgenes/tipografía de tarjeta, ratio de
columnas alterno en filas pares) y `ServiceMockup` reconstruido con los **6
mockups distintos** del diseño (navegador · chat · Instagram · mapa · calendario ·
flujo ERP) en vez del genérico repetido, con animaciones y respeto a
`prefers-reduced-motion`. Nav a `14px var(--gutter)`; paddings de tarjeta y
formulario reducidos en móvil (Paquetes/Contacto; Contacto además a 2 columnas
fiel al diseño).

Verificación **0/0/0**: typecheck · lint 0 warnings · **159 tests** · build SSG
(2 páginas) · `pnpm verify` OK. Mutación: **N/A** — ningún fichero de la lista
`mutate` de Stryker fue tocado (los cambios son CSS + el componente decorativo
`ServiceMockup`, excluido de mutación). Verificación visual headless a
320/360/390/414/768/1280 px (0 desbordamiento horizontal) y comparación 1:1 con
la referencia por sección. Sin cambio en `feature_list.json` (features ya
`done`). Estado: refinamiento cerrado.

## 2026-07-08 · Fix de regresión — cabecera móvil (nav prerender SSG + apilado drawer)

Corrección de regresión dentro de la feature #2 `nav` (contrato
`features/nav.feature` **sin cambios**; sus 8 escenarios siguen ciertos). Sin
puerta Gherkin: se endurece la implementación, no el contrato. Reportado por
Pablo: en móvil (~390px) los enlaces "Servicios/Sectores/Paquetes/Contacto"
aparecían "siempre visibles" superpuestos al hero.

**Diagnóstico verificado EN VIVO por el lead (Chrome + build de producción), no
por tests.** Causa raíz 1: la conmutación móvil/escritorio la decide solo JS
(`useIsMobile` → `useSyncExternalStore`, `getServerSnapshot()=false`); en SSG
(`vite-react-ssg`) el prerender **hornea la nav de ESCRITORIO** en el HTML
estático (`aria-label="Principal"`, 5 enlaces). En móvil, **antes de hidratar**,
esa nav se muestra y **desborda 324px** (medido: 607px de contenido en 283px)
sobre el hero. Los tests no lo cazaban (mockean `matchMedia` → solo prueban el
estado post-hidratación); la sesión responsive previa tampoco, porque midió por
CDP el estado **ya hidratado**. Confirmado con `fetch` del HTML servido
(`desktopNavPresent:true`, `hamburger:false`) y captura del estado pre-hidratación.
Causa raíz 2 (hallada al verificar): con el drawer ABIERTO, `.overlay`/`.panel`
tenían `z-index:auto` vs cabecera sticky `z-index:50` → la cabecera pintaba
sobre el panel, ocultando el título "Menú" y el botón ✕. (Descartado el
falso positivo "Dialog abierto por defecto": medido sin clic,
`aria-expanded="false"`, `data-state="closed"`, panel ausente del DOM.)

Fix por TDD estricto (`tdd_craftsman`), **solo CSS, aditivo**: (1)
`HeaderNav.module.scss` `@media (max-width:767px){ .nav{ display:none } }`
(breakpoint idéntico a `MOBILE_QUERY`); (2) `MobileMenu.module.scss`
`z-index:100` en `.overlay` y `.panel` (>50). Tests de regresión no tautológicos
(`@s4` lee el SCSS y aserta la media query; `@s5..@s8` compara los z-index
numéricos contra el 50 real de la cabecera). Review `judge`: **APROBADO** (riesgo
`.skip-link` z-index:100 analizado y no bloqueante: el portal de Radix vence por
orden del DOM y el foco queda atrapado en el diálogo).

Verificación final **0/0/0**: typecheck · lint 0 warnings · **161 tests** ·
build SSG. Verificación en vivo del **estado prerender** a 375/390/414px
(`display:none` de la nav de escritorio, 0 overflow) y 768px (escritorio intacto,
nav visible), y del ciclo hidratado: hamburguesa abre; cierra por ✕ / fondo /
enlace (navega a `#servicios`); drawer por encima de la cabecera (`elementFromPoint`
sobre ✕ devuelve el botón "Cerrar"). Mutación acotada a los 2 componentes
adyacentes como confirmación (no se tocó ningún `.tsx` de la lista `mutate`; el
cambio es CSS). Sin cambio en `feature_list.json` (#2 ya `done`).

## 2026-07-09 · #14 logo_draw_animation — Animación de dibujado del logo Órbita (nav + hero)

Pipeline SDD completo desde el handoff `design/logo-draw-animation/` (README +
`CenitLanding.dc.html`, keyframes verbatim). Conversación/spec (`spec_partner` →
`project-spec.md` #14) con 4 decisiones a puerta humana; contrato
(`gherkin_author` → `features/logo_draw_animation.feature`, 18 escenarios).
**Puerta humana:** Pablo APROBÓ el contrato y eligió D2 = **preservar la
atenuación del arco a `.1` en móvil ≤820px** ("adáptalo responsive"); D1 sí
`prefers-reduced-motion`, D3 parcial global, D4 prop `Logo animated` por defecto.

Implementación (`tdd_craftsman`, TDD; una corrida se cortó por watchdog del
stream y se completó con una continuación determinista): parcial global
`src/styles/_logo-draw.scss` (8 `@keyframes` verbatim + `heroCycleOpacityMobile`
+ reglas por `data-attributes` + `prefers-reduced-motion`), `@use` en
`main.scss`; `Logo.tsx` gana prop `animated` (data-attributes + punto en DOS
círculos: contorno A que se traza + relleno B con `transform-box:fill-box` para
el "pop"); `Header` monta `<Logo animated />`; `Hero.tsx` añade el círculo A al
arco (siempre animado); `Hero.module.scss` `.arc` reposo .45→.42. **R1**: estado
BASE = DIBUJADO (el oculto vive solo en el 0% de cada keyframe) → reduced-motion
y prerender SSG muestran el logo completo. Sin JS ni estado; sin tokens nuevos;
Footer estático (sin `animated`).

Review: `judge` **APROBADO** (keyframes fieles al handoff salvo normalización
Prettier sin cambio de valor; R1, reduced-motion, Footer estático, sin tokens
nuevos, 18 `@s` no tautológicos con ambas ramas de `animated`). Mutación
(`mutation_tester`, Stryker acotado a `Logo.tsx`+`Hero.tsx`): **100%** (15/15,
0 supervivientes). Verificación EN VIVO (Chrome, dev + build): animaciones
corriendo con nombres/duración (18.3s)/easings correctos; dibujado visual
(t=3s icono parcial → t=8s icono+wordmark completos); temas claro (verde/limón)
y oscuro (oro/violeta) por tokens; reduced-motion/base R1 → logo completo
(dashoffset 0, punto relleno, wordmark visible); responsive del arco
(`heroCycleOpacityMobile` .1 a 298px / `heroCycleOpacity` .42 a 900px); 0
overflow horizontal; SSG: HTML prerenderizado con `data-logo-anim` (solo nav,
Footer sin hooks) + arco, CSS construido con keyframes + reduced-motion +
`transform-box:fill-box`. Verificación final **0/0/0**: typecheck · lint 0
warnings · **180 tests** · build SSG (2 páginas). Estado: `done`.

## 2026-07-09 · #15 servicios_scroll_reveal (WEB-5) — Revelado en scroll de la sección Servicios

Pipeline SDD completo sobre `feat/servicios-scroll-reveal` (creada desde `main`
@ ad84eaa, actualizada por Pablo). Conversación/spec (`spec_partner` →
`project-spec.md` #15) tras fijar 3 decisiones con Pablo a puerta humana (vía
preguntas del lead): **(1) coreografía "convergencia zig-zag"** (cada una de las
3 piezas de la fila —`.card`, mockup, `.example`— entra desde su lado exterior
apoyándose en el `:nth-child(even)` que ya invierte columnas → cada fila difiere
sola); **(2) disparo centrado** (banda central `-40% 0px -40% 0px`, ni antes ni
después); **(3) bidireccional** (se re-anima al bajar y subir, no `triggerOnce`).
Contrato (`gherkin_author` → `features/servicios_scroll_reveal.feature`, 14
escenarios). **Puerta humana:** Pablo APROBÓ el contrato tal cual.

Implementación (`tdd_craftsman`, TDD estricto Rojo→Verde→Refactor): hook
reutilizable `src/lib/useReveal.ts` (IntersectionObserver mínimo, genérico vía
`data-*`: arma `data-reveal` en el contenedor en `useEffect` y conmuta
`data-in-view` por hijo; guard SSR `typeof IntersectionObserver === 'undefined'`;
`disconnect()` en cleanup; guard defensivo `if (!root)` con `// Stryker disable`).
`Servicios.tsx` cablea el `ref` en `.rows` y envuelve el mockup en `.mockup`.
`Servicios.module.scss`: **R1** (estado base = final visible; el oculto —`opacity:0`
+ `translateX(±44px)`/`translateY(34px)`— vive SOLO bajo `[data-reveal] .row:not(
[data-in-view])` dentro de `@media (prefers-reduced-motion: no-preference)`),
transición **1.2 s** (>1 s) `opacity`+`transform`, stagger 0/0.18/0.36 s
(card→mockup→example), inversión zig-zag por `:nth-child(even)`, **`overflow-x:
clip`** en `.services` y **fallback vertical (`translateY`) en ≤880px** (0 scroll
horizontal). Sin dependencias ni tokens nuevos; contenido intacto.

Review: `judge` **APROBADO** (14/14 `@s` no tautológicos; el fake de
`IntersectionObserver` fija `rootMargin` contra el símbolo importado y el literal;
`@s5` triangula el toggle bidireccional; R1/SSG/responsive/a11y/convenciones OK).
`a11y_seo_auditor` **0 bloqueantes** (reduced-motion gateado, contenido siempre en
DOM/HTML estático, foco/orden intactos, transforms ≤44px sin parpadeos; observó una
animación decorativa infinita PREEXISTENTE en `ServiceMockup` de #2, fuera de
alcance). Mutación (`mutation_tester`, Stryker acotado a `useReveal.ts`+
`Servicios.tsx`): **100%** (63 killed + 4 timeout / 67; 0 supervivientes).

Verificación EN VIVO (Chrome, dev server): revelado real confirmado con scroll
físico (`data-in-view` + `opacity 0→1` en la fila centrada, resto oculto),
**zig-zag** visible (fila 0 texto-izq/mockup-der, fila 1 invertida), transición de
1.2 s capturada a medio fundido; móvil 390px en 1 columna con revelado `translateY`
y cabecera hamburguesa OK. Barrido de **0 scroll horizontal en 11 anchos
(320→1920px)** vía iframe same-origin; **0 errores/0 warnings de consola**. (Nota de
banco: `window.scrollTo` es no-op en este contexto de automatización; el scroll
físico —el del usuario— dispara el observer correctamente.) Verificación final
**0/0/0**: typecheck · lint 0 warnings · **194 tests** (+14) · `pnpm verify` OK.
Estado: `done`.
