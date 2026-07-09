# project-spec.md — WebEmpresa (Cénit Digital)

Spec conversada por feature. El `spec_partner` amplía este archivo antes de
cada feature `"sdd": true`; el `gherkin_author` lo destila en `features/`.

---

## #1 · infra_base — Repositorio base (WEB-2)

**Propósito.** Dejar el repositorio y el proyecto base del que parte toda la
web, y fijar el stack estándar de empresa.

**Comportamiento.** Proyecto Vite + React + TypeScript con SSG
(vite-react-ssg), SCSS Modules + design tokens, Radix UI, fuentes self-hosted,
y la capa Harness/SDD para el desarrollo asistido por IA.

**Contrato.**

- `pnpm dev` arranca el sitio en local; `pnpm build` prerenderiza a HTML
  estático en `dist/`.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` y `pnpm mutation`
  terminan en verde, sin warnings.
- Cada página lleva su `<title>` y `description` propios en el HTML estático.

**Decisiones.**

- **Vite + React + SCSS + pnpm** en lugar de Next.js + Tailwind (ver `DE-002`,
  supersede a `DE-001`). Razón: preferencia de equipo y simplicidad del build;
  el SEO se preserva con SSG (vite-react-ssg). Alternativa descartada: SPA pura
  (mal SEO para una web corporativa).
- **SSG con vite-react-ssg** en lugar de SPA. Alternativa descartada: Vike
  (más potente pero más complejo de lo necesario aquí).
- **Radix UI + SCSS Modules** en lugar de shadcn/ui (que depende de Tailwind).
- **Stryker + Vitest** como equivalente JS de la prueba de mutación.

**Estado.** `done`.

---

## #2 · nav — Navegación de la cabecera (WEB-4)

**Propósito.** Que cualquier visitante pueda llegar a cualquier sección de la
home desde la cabecera, en escritorio y en móvil.

**Comportamiento.** Logotipo enlazado a `/`; nav de escritorio con
Servicios/Sectores/Paquetes/Contacto + botón "Hablamos"; cabecera `sticky`;
menú móvil (hamburguesa) con panel deslizante que se cierra al pulsar `✕`, al
pulsar un enlace, o al pulsar el fondo.

**Decisiones.**

- El panel móvil del HTML de referencia solo traía Servicios/Contacto/Paquetes
  (omitía Sectores respecto al nav de escritorio). **Resuelto en la puerta
  humana (2026-07-03): Pablo confirma que era un olvido del diseño**, así que
  el panel móvil incluye también "Sectores" y lista los cuatro enlaces en el
  orden del nav de escritorio (Servicios, Sectores, Paquetes, Contacto). `@s5`
  actualizado en consecuencia.
- La forma del logotipo (icono "Órbita") sigue lo ya implementado en
  `Logo.tsx`/`RF-MARCA-001`, no el icono de nav que aparece en el HTML de
  referencia (ese HTML es anterior a la votación del logo — ver nota en
  `RF-MARCA-001`).

**Estado.** `spec_ready`.

---

## #3 · theme_selector — Selector de tema Claro/Oscuro/Sistema (WEB-4)

**Propósito.** Que el visitante pueda leer la web en el modo que prefiera, o
dejar que siga el ajuste de su sistema operativo, sin parpadeos ni sorpresas
al volver a entrar.

**Comportamiento.** Tres estados (Claro/Oscuro/Sistema), persistidos en
`localStorage` bajo `cenit-theme` (ausencia de clave = modo "Sistema"),
aplicados antes del primer pintado (anti-FOUC), y reactivos en vivo a
`prefers-color-scheme` mientras el modo activo es "Sistema".

**Decisiones.**

- Paleta: **Bosque & Limón** (claro) / **Noche & Oro** (oscuro) — confirmado
  por Pablo, corregido en `RF-MARCA-001` (antes decía por error Teal
  Profundo/Océano y Coral). Pendiente aplicar en `src/styles/_tokens.scss`.
- Sin runner de accesibilidad de color específico: se asume que el contraste
  de ambas paletas ya viene validado desde `RF-MARCA-001`.

**Estado.** `spec_ready`.

---

## #4 · footer — Pie de página (WEB-4)

**Propósito.** Que el copyright, el aviso legal y el contacto estén siempre
accesibles desde el pie, en cualquier página.

**Comportamiento.** Copyright con año dinámico; enlace a `/aviso-legal`;
enlace `mailto:` a `hola@cenitdigital.es`.

**Decisiones.** Los enlaces "Privacidad" y "Cookies" que aparecen en el HTML
de referencia no se incluyen aquí: no hay páginas de destino creadas ni
ticket de Jira que las cubra. Quedan fuera de alcance de WEB-4 hasta que se
abra ese ticket.

**Estado.** `spec_ready`.

---

## #5 · layout_accesibilidad — Accesibilidad y SEO de base del layout (WEB-4)

**Propósito.** Que la web sea usable con teclado desde el primer tabulado y
que cada página se identifique correctamente en buscadores.

**Comportamiento.** Enlace "Saltar al contenido" como primer elemento
enfocable, que mueve el foco a `#contenido`; `<title>` propio por ruta
(`buildPageTitle`, ya implementado y testeado en `infra_base`).

**Estado.** `spec_ready`.

---

## #6 · hero — Hero de la home (WEB-5)

**Propósito.** Que un visitante entienda en cinco segundos qué ofrece Cénit
Digital y tenga un primer paso claro (ver paquetes o hablar con nosotros).

**Comportamiento.** Eyebrow + titular + subtítulo + dos CTA + fila de 4
estadísticas (24h / +30 / 100% / 5★).

**Estado.** `spec_ready`.

---

## #7 · servicios — Sección de servicios (WEB-5)

**Propósito.** Mostrar el catálogo de servicios con un ejemplo real por
servicio, para que el visitante entienda el resultado, no solo la promesa.

**Comportamiento.** 6 tarjetas (Desarrollo web, Chatbot WhatsApp, Gestión de
RRSS, SEO local, Sistema de citas, Conexión ERP), cada una con etiqueta,
título, descripción, dos características y un bloque "Ejemplo".

**Decisiones.** El texto "Reservar" que aparece en el HTML junto a la primera
tarjeta es decorativo (vive dentro del mockup ilustrado, no es un botón real)
— no se especifica como comportamiento.

**Estado.** `spec_ready`.

---

## #8 · sectores — Sección de sectores (WEB-5)

**Propósito.** Comunicar en qué sectores está especializada Cénit Digital,
para que el visitante se autoidentifique rápido.

**Comportamiento.** 4 tarjetas (Veterinarias, Servicios de estética, Clínicas
dentales, Fisioterapeutas) con nombre y descripción, más la nota "Selección
inicial — abierta a debate según el plan comercial."

**Estado.** `spec_ready`.

---

## #9 · paquetes — Sección de paquetes (WEB-5)

**Propósito.** Que el visitante compare los tres niveles de servicio y pida
presupuesto para el que le encaje.

**Comportamiento.** 3 tarjetas (Presencia Digital, Presencia Activa, Negocio
Conectado) con tagline, lista de características, insignia "Más elegido" solo
en Presencia Activa, y botón "Solicitar presupuesto" en las tres.

**Decisiones.** El diseño final no muestra precios fijos por paquete —solo
"Solicitar presupuesto"—, mientras que el criterio de aceptación de WEB-5 en
Jira dice "precios del plan cargados". No se han inventado precios: si Cénit
Digital quiere precios fijos visibles, es una decisión de producto pendiente,
no un dato que estuviera en el HTML de referencia.

**Estado.** `spec_ready`.

---

## #10 · contacto_seccion — Contenido de la sección de contacto (WEB-5)

**Propósito.** Que el visitante sepa qué le van a pedir antes de escribir, y
vea que hay un canal directo (teléfono) además del formulario.

**Comportamiento.** Intro + promesa de respuesta en 24h + teléfono +
formulario visual con sus 5 campos (Nombre*, Correo electrónico*, Teléfono,
Sector, ¿Qué necesitas?) y las opciones del desplegable de Sector.

**Decisiones.** Esta feature cubre solo la estructura visual del formulario.
La validación, el envío real por Resend y el antispam son `contact_form`
(WEB-6) — separación que sigue la división de los propios criterios de
aceptación de WEB-5 y WEB-6 en Jira.

**Estado.** `spec_ready`.

---

## #11 · contact_form — Formulario de contacto funcional con Resend (WEB-6)

**Propósito.** Que el formulario envíe de verdad, valide lo mínimo necesario,
y no sea un canal abierto de spam.

**Comportamiento.** Validación (Nombre y Correo electrónico obligatorios;
Teléfono, Sector y mensaje opcionales; formato de email válido), envío real
vía Resend, botón deshabilitado durante el envío, formulario que se limpia
tras éxito, mensaje de error con datos conservados tras fallo, y honeypot
antispam.

**Decisiones.**

- **Honeypot** en lugar de rate-limit (Jira permitía cualquiera de los dos).
  Razón: no requiere infraestructura adicional (sin contador por IP) y es
  suficiente para el volumen esperado de un formulario de contacto. Si el
  honeypot no filtra spam suficiente en producción, rate-limit sería el
  siguiente paso, no un sustituto.

**Estado.** `spec_ready`.

---

## #13 · fidelidad_referencia — Fidelidad al diseño de referencia: cabecera (tema icono + Hablamos) y hero (arco)

**Propósito.** La home se construyó "fiel 1:1" a
`design/Cenit Home (referencia).dc.html` (fuente de verdad versionada), pero la
implementación **derivó** en tres puntos de la cabecera y el hero. Esta feature
restaura esa fidelidad sin regresar ninguna función ya conseguida (en
particular, el selector de tema de 3 estados de WEB-4). Nada se inventa: todo
sale de la referencia salvo **una** adición aprobada (el icono "monitor" para el
3.er estado, ver Decisión A).

**Comportamiento.** (1) El selector de tema pasa de una píldora
`role="radiogroup"` con tres botones ("Claro │ Oscuro │ Sistema") a un **único
botón de icono** que **cicla** los tres modos. (2) La cabecera pasa de tres hijos
con `space-between` (que deja un hueco central) a **dos grupos**: logo a la
izquierda y clúster a la derecha con `[enlaces] · [tema] · [Hablamos]`. (3) El
hero recupera el **arco decorativo** (SVG `data-hero-arc`) que hoy está omitido, y
el `.hero` gana `overflow:hidden` para clipar el arco.

---

### Decisión A — Selector de tema: botón de icono único que cicla 3 modos

La referencia usa un único botón de icono (luna/sol) que alterna Claro↔Oscuro
(**2 estados**, sin "Sistema"). Pero **Jira WEB-4** y la feature #3
(`theme_selector`, ya `done` con mutación 100%) exigen **3 estados**
(Claro/Oscuro/Sistema) con persistencia, reacción en vivo a
`prefers-color-scheme` y anti-FOUC.

**Acuerdo (reconciliación, sin regresión):** un **único botón de icono** que
**cicla** los tres modos en el orden `light → dark → system → light`. Se conserva
**íntegra** la lógica de `src/lib/theme.ts` (no cambia su comportamiento). Solo
cambia la **presentación**: de la píldora `radiogroup` (3 botones) a un botón de
icono único.

- **Icono según el MODO activo:** `light` = sol, `dark` = luna, `system` =
  **monitor** (icono Feather/Lucide "monitor", misma familia que la luna/sol de
  la referencia). Este icono "monitor" es la **única adición aprobada** más allá
  de la referencia, necesaria porque la referencia no tiene 3.er estado.
  - Matiz respecto a la referencia: en la referencia el icono refleja el **tema
    resuelto** (`data-theme`), vía el CSS `[data-theme='light'] [data-moon]{display:none}`
    y `[data-theme='dark'] [data-sun]{display:none}`. En nuestra versión de 3
    estados el icono refleja el **modo activo** (sol/luna/monitor), no el tema
    resuelto — por eso "Sistema" tiene su propio icono aunque resuelva a claro u
    oscuro.
- **Nombre accesible:** el botón debe comunicar el **modo activo** al lector de
  pantalla (p. ej. `aria-label` que incluya "Claro"/"Oscuro"/"Sistema") y ser un
  **único control** (no `radiogroup`). Por qué: la referencia usaba
  `aria-label="Cambiar tema"` + `title` dinámico; mejoramos incluyendo el estado
  en el nombre accesible para que sea **testeable** y accesible.
- **Efecto:** la lógica de WEB-4 (3 estados) **se mantiene**; la feature #3 **no
  regresa** — solo se **re-especifica su presentación**.

**Razón:** honra a la vez la fidelidad visual de la referencia (un icono, no una
píldora) y el contrato de producto de WEB-4 (3 estados). **Alternativa
descartada:** volver a 2 estados (Claro↔Oscuro) para clonar la referencia al pie
de la letra — descartada porque regresaría `theme_selector` (WEB-4, ya `done` con
mutación 100%) y perdería el modo "Sistema" con reacción en vivo. **Segunda
alternativa descartada:** mantener la píldora `radiogroup` actual — descartada
porque incumple la fidelidad visual, que es justo el objetivo de esta feature.

---

### Decisión B — Restaurar la fidelidad del hero y la cabecera a la referencia

El humano confirmó que el "objetivo" = la referencia versionada. Tres
correcciones:

1. **Tema como icono** (Decisión A), ubicado en el **clúster derecho** de la
   cabecera.
2. **Cabecera a 2 grupos:** `logo (izq)` | `clúster derecho`. El clúster derecho
   contiene, **en este orden**: `[enlaces Servicios·Sectores·Paquetes·Contacto]
   · [botón de tema] · [Hablamos]`. Hoy la cabecera tiene **tres** hijos
   (`brand`, `HeaderNav`, `ThemeToggle`) con `justify-content: space-between` en
   `Header.module.scss` → el grupo de nav queda al centro dejando un hueco. La
   corrección: "Hablamos" pasa a la derecha del icono de tema, todo agrupado a la
   derecha, sin hueco central.
3. **Arco decorativo del hero** (hoy **omitido**): añadir el SVG `data-hero-arc`.

**Razón:** la referencia versionada es la fuente de verdad acordada; estas tres
derivaciones son bugs de fidelidad, no decisiones de diseño. **Alternativa
descartada:** dejar la cabecera con `space-between` y "aceptar" el hueco como
estética propia — descartada porque contradice la referencia y el hueco no fue
una decisión, sino una deriva. **Alternativa descartada (arco):** dibujar el arco
con CSS/imagen en vez del SVG de la referencia — descartada porque hay un SVG
verbatim disponible, reproducirlo 1:1 es más fiel y más simple que reinventarlo.

---

### Contrato exacto

**C1 · Ciclo de tema (comportamiento).** El control de tema es un único
`<button>`. Cada activación (click/Enter/Espacio) avanza el modo un paso en el
orden **`light → dark → system → light`** (cíclico). El cambio de modo aplica el
tema resuelto y lo persiste exactamente como hoy (vía `setMode` de `theme.ts`).

**C2 · Icono por modo activo.**

- `light` → icono **sol**.
- `dark` → icono **luna**.
- `system` → icono **monitor**.

**C3 · Nombre accesible.** El botón expone un nombre accesible que incluye el
modo activo ("Claro" / "Oscuro" / "Sistema"), de forma que un lector de pantalla
anuncia el estado actual. Es **un único control** (no `radiogroup`, no
`role="radio"`).

**C4 · Layout de cabecera (2 grupos).** `Header.inner` deja de repartir tres
hijos con `space-between` y pasa a **dos grupos**:

- Grupo izquierdo: logo (enlace a `/`).
- Grupo derecho (clúster, alineado a la derecha, sin hueco central) con el
  **orden exacto**: `enlaces (Servicios, Sectores, Paquetes, Contacto)` →
  `botón de tema` → `Hablamos`.

Es decir: el `ThemeToggle` se reubica **dentro** del clúster de navegación
(entre los enlaces y "Hablamos"), no como tercer hijo suelto de la cabecera.

**C5 · Arco del hero.**

- Se añade un contenedor `data-hero-arc` como **primer** hijo del hero,
  posicionado en la esquina **superior derecha** y **detrás** del texto.
- Posicionamiento (referencia): `position:absolute; right:-120px; top:-80px;
  width:540px; height:540px; opacity:.45; z-index:1; pointer-events:none;`.
- El texto del hero va por encima (`z-index:2`, ya presente en `.inner`).
- El `.hero` gana **`overflow:hidden`** (hoy solo tiene `position:relative` +
  `background`) para clipar el arco y **evitar scroll horizontal**.
- El arco es puramente **decorativo** → `aria-hidden="true"`; no aporta contenido
  ni foco.
- **Responsive (≤820px):** `opacity:.10; right:-160px; top:-130px`.

---

### Verdad VERBATIM de la referencia (trazabilidad — no inventar)

> Estos fragmentos salen de `design/Cenit Home (referencia).dc.html` y se
> incluyen para que `gherkin_author` y `tdd_craftsman` no reinventen medidas ni
> paths de SVG.

**Botón de tema (referencia, dentro de `data-desktop-links`):**

```html
<button aria-label="Cambiar tema" title="{{ modeLabel }}"
  style="width:38px; height:38px; display:flex; align-items:center; justify-content:center; border:1px solid var(--color-band-border); background:transparent; border-radius:10px; cursor:pointer; color:var(--color-text);">
  <svg data-moon viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
  <svg data-sun viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
</button>
```

CSS de visibilidad por tema (referencia):
`[data-theme='light'] [data-moon]{display:none}` y
`[data-theme='dark'] [data-sun]{display:none}` — en la referencia el icono
refleja el **tema resuelto**. En nuestra versión de 3 estados el icono refleja el
**modo activo** (sol/luna/monitor), ver Decisión A.

**Icono "monitor" a añadir** (Feather "monitor"; `viewBox="0 0 24 24"`, `stroke="currentColor"`,
`stroke-width="2"`, 16×16 — única adición aprobada más allá de la referencia):

```html
<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
```

**Arco del hero (referencia)** — dentro de un hero con `overflow:hidden`:

```html
<div data-hero-arc style="position:absolute; right:-120px; top:-80px; width:540px; height:540px; opacity:.45; z-index:1; pointer-events:none;">
  <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none">
    <circle cx="40" cy="40" r="30" fill="none" stroke="var(--color-accent)" stroke-width="1" stroke-opacity=".5"/>
    <path d="M15 46 C25 26 33 26 41 44 C48 59 57 59 65 41" fill="none" stroke="var(--color-accent)" stroke-width="1.4" stroke-linecap="round"/>
    <circle cx="40" cy="20" r="3" fill="var(--color-accent)"/>
  </svg>
</div>
```

Responsive (referencia):
`@media (max-width:820px){ [data-hero-arc]{opacity:.10; right:-160px; top:-130px} }`.
El hero de la referencia es `<header style="position:relative; overflow:hidden; background:var(--color-bg);">`.
Nuestro `.hero` hoy es `{position:relative; background:var(--color-bg)}` **sin**
`overflow:hidden` → hay que **añadir** `overflow:hidden`.

**Cabecera de referencia (estructura):** `<nav sticky>` → `<div flex space-between>`:
`<a brand>logo</a>` + `<div data-desktop-links flex gap:24px>` con, en orden,
`[Servicios · Sectores · Paquetes · Contacto · botón-tema · Hablamos]` +
`<button data-hamb>` (hamburguesa, solo móvil ≤820px). Es decir: logo a la
izquierda, todo lo demás agrupado a la derecha.

---

### Casos límite

- **Móvil (≤820px) — anti-regresión de visibilidad del tema.** La referencia
  **oculta** el tema en móvil, pero la implementación actual lo **muestra** en
  móvil (junto al botón "Menú"). **No se regresa** esa función: en escritorio el
  toggle va en el clúster derecho (fidelidad); en **móvil el control de tema se
  mantiene visible y funcional junto al botón "Menú"** (comportamiento actual
  preservado). Este matiz es deliberado y debe conservarse.
- **SSG / ClientOnly.** `ThemeToggle` es **client-only** (usa `localStorage` y
  `matchMedia`). Hoy va envuelto en `<ClientOnly>` de `vite-react-ssg` en
  `Header`. Al reubicarlo dentro del clúster de `HeaderNav`, **debe conservar** la
  protección `ClientOnly` (no debe renderizarse durante el prerender SSG).
- **Anti-FOUC intacto.** El script inline de `index.html` y
  `applyInitialTheme`/`initialThemeAttribute` de `theme.ts` **no se tocan**. El
  tema inicial se sigue aplicando antes del primer pintado; el cambio de
  presentación no introduce parpadeo.
- **Arco y overflow.** Sin `overflow:hidden` en `.hero`, el arco desbordaría por
  la derecha y provocaría scroll horizontal. El caso límite "el arco no debe
  generar scroll horizontal" queda cubierto por `overflow:hidden`.

---

### Restricciones de implementación (para gherkin_author / tdd_craftsman)

- **`src/lib/theme.ts`:** NO cambia su comportamiento. Se le puede **añadir** una
  función **pura** `nextMode(mode): ThemeMode` que implemente el ciclo
  `light → dark → system → light` (testeable, objetivo mutación 100%). Es la
  única adición permitida en `theme.ts`.
- **`src/lib/nav.ts`** (`NAV_LINKS`, `CTA_LINK` "Hablamos"): NO cambia. El **copy
  del hero NO cambia** (eyebrow, titular, subtítulo, CTAs, estadísticas
  intactos).
- **`ThemeToggle`** debe seguir siendo **client-only** (envuelto en `ClientOnly`)
  al reubicarse dentro de `HeaderNav`.
- **Componentes tocados previsibles:** `ThemeToggle.tsx` (+scss), `Header.tsx`,
  `HeaderNav.tsx` (+scss), `Hero.tsx` (+`Hero.module.scss`) y `theme.ts` (solo
  `+nextMode`). Los tests co-locados se actualizan por TDD.
- **`theme_selector.feature`:** sus escenarios de **comportamiento** (sobre
  `data-theme` / persistencia / reacción a `prefers-color-scheme` / anti-FOUC) NO
  cambian; solo se **re-redacta la presentación** (el escenario "presenta un
  radiogroup" pasa a "presenta un botón de icono que cicla", y "elijo la opción
  X" pasa al modelo de **ciclo**). Esta re-redacción la hará `gherkin_author`; no
  es parte de esta destilación.

---

### Qué NO cambia (garantías de no-regresión)

- **Lógica de `theme.ts`:** 3 estados, persistencia en `cenit-theme`, reacción en
  vivo a `prefers-color-scheme` en modo "Sistema", anti-FOUC. Intactos (solo se
  añade `nextMode`).
- **`nav.ts`:** enlaces y CTA "Hablamos". Intactos.
- **Copy del hero:** eyebrow, titular, subtítulo, dos CTA, cuatro estadísticas.
  Intactos.
- **Visibilidad del tema en móvil:** se mantiene (no se regresa a la ocultación
  de la referencia).
- **Feature #3 `theme_selector`:** no regresa; solo se re-especifica su
  presentación.

**Estado.** `pending`.

---

## #14 · logo_draw_animation — Animación de dibujado del logo Órbita (nav + hero)

**Propósito.** Dar vida a la marca con una animación CSS pura de "dibujado"
(self-drawing) del icono Órbita (anillo + onda + punto cénit), que se traza
sola al cargar la página y se repite en bucle infinito con una pausa larga.
Refuerza la identidad sin coste de JS ni estado. Fuente de verdad:
`design/logo-draw-animation/README.md` (handoff) + `CenitLanding.dc.html`
(keyframes verbatim). Aprobado como "alta fidelidad, todos los valores
cerrados": aquí se **sintetiza** el handoff; lo que quede sin cerrar se marca
como decisión para la puerta humana.

**Alcance.** Se anima en **dos** sitios:

1. **Cabecera** — `Logo` animado: icono 40px (`viewBox="0 0 80 80"`) +
   wordmark "cénit / digital" con efecto **máquina de escribir**. Usa gradiente
   de marca en la onda (`--color-primary → --color-secondary`), `--color-ring`
   en el anillo y `--color-zenith` en el punto.
2. **Hero** — el arco decorativo (`data-hero-arc` en `Hero.tsx`, 540px, esquina
   superior derecha, detrás del texto, `aria-hidden`), **sin wordmark**, en un
   **único color** `--color-accent` (sin gradiente) y opacidad de reposo `.42`.

**Fuera de alcance.** El logo del **Footer permanece estático** (no se anima).
No se crean tokens nuevos. No se introduce estado React ni JS.

---

### Comportamiento

Un ciclo dura **18.3s** y se repite con `animation-iteration-count: infinite`.
Variante aprobada: **"simultánea a distinto ritmo"** — el anillo se dibuja lento
de fondo durante casi todo el trazo (0→41%), mientras onda, punto y texto van
más rápidos en primer plano; anillo y "digital" llegan juntos al 41%
(sensación de llegada conjunta). Tras el trazo hay una **pausa (hold) ~9.5s**
con el logo ya dibujado, y un **rebobinado invisible** entre 96–97% que reinicia
todos los trazos a su estado oculto sin que el usuario lo vea.

Todos los `@keyframes` van **en porcentaje** (nunca en segundos) y todos los
elementos comparten `animation-duration: 18.3s`, de modo que quedan sincronizados
sin JS. Funciona igual en claro/oscuro porque todo el color sale de
`var(--color-…)`.

---

### Contrato observable

> Nota para `gherkin_author`/`tdd_craftsman`: la animación en sí (interpolación
> de keyframes) **no es verificable en jsdom**. El contrato *testeable* es la
> **estructura DOM + atributos**: presencia de los `data-attributes` de destino,
> `stroke-dasharray` correctos, existencia del círculo de contorno del punto, el
> efecto de la prop `animated` de `Logo`, la regla `prefers-reduced-motion`, y
> que el Footer siga estático. Los valores de keyframe/timing se documentan aquí
> **verbatim** para fidelidad, no para aserción numérica en test unitario.

**CO1 · Timing (un ciclo = 18.3s, en %).** Tabla del handoff (elemento · %
inicio · % fin de dibujo · segundos equiv. · easing). El easing es la
`animation-timing-function` del *shorthand* de cada elemento (no vive dentro del
`@keyframes`):

| Elemento (keyframe) | % inicio | % fin dibujo | Seg. equiv. | Easing (timing-function del shorthand) |
|---|---|---|---|---|
| Anillo (`ringLoop`) | 0% | 41% | 0 → 7.5s | `cubic-bezier(.25,.46,.45,.94)` (lento, de fondo) |
| Onda (`waveLoop`) | 0% | 22% | 0 → 4.0s | `cubic-bezier(.4,0,.2,1)` (rápido, en paralelo) |
| Punto — contorno (`dotOutlineLoop`) | 22% | 27% | 4.0 → 4.9s | `cubic-bezier(.4,0,.2,1)` |
| Punto — relleno (`dotFillLoop`) | 27% | 30% | 4.9 → 5.5s | `cubic-bezier(.4,0,.2,1)` |
| "cénit" (`cenitLoop`) | 30% | 35% | 5.5 → 6.4s | `steps(5,end)` |
| "digital" (`digitalLoop`) | 36% | 41% | 6.6 → 7.5s | `steps(7,end)` |
| Pausa (hold) | 41% | 93% | 7.5 → 17.0s (~9.5s quieto) | — |
| Fundido de reset (contenedor) | 93% | 96% | 17.0 → 17.6s | `ease-in-out` |
| Vacío / reset invisible | 96% | 97% | 17.6 → 17.75s | — |
| Blank final | 97% | 100% | 17.75 → 18.3s | — |

Shorthands por elemento: contenedores `…CycleOpacity 18.3s ease-in-out infinite`;
resto `…Loop 18.3s <easing de la tabla> infinite`.

**CO2 · Los 8 `@keyframes` (verbatim de `CenitLanding.dc.html`).** Reprodúcelos
al carácter:

```css
@keyframes logoCycleOpacity { 0%{opacity:1} 93%{opacity:1} 96%{opacity:0} 97%{opacity:0} 100%{opacity:1} }
@keyframes heroCycleOpacity { 0%{opacity:.42} 93%{opacity:.42} 96%{opacity:0} 97%{opacity:0} 100%{opacity:.42} }
@keyframes ringLoop { 0%{stroke-dashoffset:300} 41%{stroke-dashoffset:0} 96%{stroke-dashoffset:0} 97%{stroke-dashoffset:300} 100%{stroke-dashoffset:300} }
@keyframes waveLoop { 0%{stroke-dashoffset:300} 22%{stroke-dashoffset:0} 96%{stroke-dashoffset:0} 97%{stroke-dashoffset:300} 100%{stroke-dashoffset:300} }
@keyframes dotOutlineLoop { 0%,22%{stroke-dashoffset:30;stroke-opacity:1} 27%{stroke-dashoffset:0;stroke-opacity:1} 30%{stroke-opacity:0} 96%{stroke-opacity:0} 97%{stroke-opacity:1;stroke-dashoffset:30} 100%{stroke-opacity:1;stroke-dashoffset:30} }
@keyframes dotFillLoop { 0%,27%{fill-opacity:0;transform:scale(.3)} 30%{fill-opacity:1;transform:scale(1)} 96%{fill-opacity:1;transform:scale(1)} 97%{fill-opacity:0;transform:scale(.3)} 100%{fill-opacity:0;transform:scale(.3)} }
@keyframes cenitLoop { 0%,30%{clip-path:inset(0 100% 0 0)} 35%{clip-path:inset(0 0% 0 0)} 96%{clip-path:inset(0 0% 0 0)} 97%{clip-path:inset(0 100% 0 0)} 100%{clip-path:inset(0 100% 0 0)} }
@keyframes digitalLoop { 0%,36%{clip-path:inset(0 100% 0 0)} 41%{clip-path:inset(0 0% 0 0)} 96%{clip-path:inset(0 0% 0 0)} 97%{clip-path:inset(0 100% 0 0)} 100%{clip-path:inset(0 100% 0 0)} }
```

**CO3 · Estructura del trazo (SVG dasharray/dashoffset + clip-path).**

- **Anillo** (`circle r=30`, `stroke-opacity:.5`): `stroke-dasharray:300`
  (circunferencia real ≈188.5; 300 = margen seguro). Se traza vía
  `stroke-dashoffset` 300→0.
- **Onda** (`path M15 46 C25 26 33 26 41 44 C48 59 57 59 65 41`,
  `stroke-linecap:round`): `stroke-dasharray:300`, dashoffset 300→0.
- **Punto cénit = DOS círculos** superpuestos (mismo `cx=40 cy=20`):
  1. **Círculo A** (contorno): `fill:none`, `stroke:var(--color-zenith)`
     (nav) / `var(--color-accent)` (hero), `stroke-width:1.6` (nav) / `1.3`
     (hero), `stroke-dasharray:30`. Se traza vía `stroke-dashoffset` 30→0
     (`dotOutlineLoop`) y luego desvanece su `stroke-opacity` 1→0 en 30%.
  2. **Círculo B** (relleno): mismo cx/cy/r, `fill:var(--color-zenith|accent)`.
     Crossfade `fill-opacity` 0→1 + "pop" `transform:scale(.3)→scale(1)`
     (`dotFillLoop`). **Requiere `transform-box:fill-box; transform-origin:center`**
     en su `style` para que el `scale()` gire alrededor de su propio centro
     (verificado en MDN por el lead). Sin esto, el pop se descoloca.
  - Estado final: A invisible (stroke-opacity 0), B relleno → punto idéntico al
    original, sin resto de contorno.
- **Wordmark** (efecto máquina de escribir, no se traza letra a letra):
  `clip-path: inset(0 100% 0 0)` (oculto) → `inset(0 0% 0 0)` (visible), con
  `steps(5,end)` para "cénit" (5 caracteres) y `steps(7,end)` para "digital"
  (7 caracteres) — revelación carácter a carácter, no deslizamiento suave.

**CO4 · Radios y grosores (ya existentes en el logo, no cambian).** Anillo `r=30`
`stroke-width` 1.8 (nav) / 1 (hero); onda `stroke-width` 3.2 (nav) / 1.4 (hero);
punto `r` 3.8 (nav) / 3 (hero); contorno del punto `stroke-width` 1.6 (nav) /
1.3 (hero).

**CO5 · Truco del bucle sin salto visual.** Un `@keyframes infinite` NO interpola
entre 100% y 0%; si difieren, hay salto. Por eso:

- Cada propiedad de dibujo (dashoffset / clip-path / fill-opacity) tiene **el
  mismo valor en 0% y en 100%** (el estado oculto), y el "rebobinado" ocurre de
  golpe entre 96→97%.
- El **contenedor** (el enlace del logo en nav; el `div[data-hero-arc]` en hero)
  anima su `opacity` (`logoCycleOpacity` / `heroCycleOpacity`): visible durante
  dibujo+pausa, **cae a 0 entre 96–97%** (oculta el rebobinado, ~0.2s), y vuelve
  a su opacidad visible antes del 100%.
- **El contenedor NO empieza en opacity:0 en 0%** (aunque parezca simétrico):
  el primer pintado podría caer ahí y verse el nav sin logo. El contenedor
  arranca visible en 0%; lo oculto al inicio es el trazo (dashoffset máximo), no
  el contenedor.

**CO6 · Colores.** SOLO tokens existentes, sin crear ninguno:
`--color-primary`/`--color-secondary` (gradiente de la onda del nav),
`--color-ring`, `--color-zenith` (nav), `--color-accent` (color único del hero),
`--color-logo-ink`/`--color-logo-sub` (wordmark). Funciona en ambos temas sin
que la animación sepa el tema (todo vía `var(--color-…)`; el tema lo conmuta
`data-theme` en `<html>`, mecanismo ya existente).

**CO7 · Sin estado nuevo.** Animación CSS pura. Sin JS, sin estado React, sin
`ClientOnly`. Arranca sola al montar. La prerenderización SSG emite el SVG en su
estado base (dibujado, ver Restricción R1), y la animación corre en cliente.

---

### Casos límite

- **`prefers-reduced-motion: reduce`** → todas las animaciones `animation: none`;
  el logo se muestra **estático, completamente dibujado** (anillo/onda con
  dashoffset 0, punto relleno, contorno invisible, wordmark visible, contenedor
  a su opacidad de reposo). Ver Decisión D1 (recomendado: sí) y Restricción R1.
- **Primer frame / FOUC.** El contenedor arranca visible (0% = opacity 1/.42);
  nunca se ve "nav sin logo". Ver CO5.
- **Bucle infinito sin salto.** Cubierto por CO5 (valores iguales 0%↔100% +
  parpadeo de opacidad 96–97%).
- **Footer estático.** El `Logo` del Footer NO recibe animación (prop `animated`
  ausente → `false`). Debe seguir renderizando el icono relleno estático.
- **Móvil.** El arco del hero hoy se atenúa a `.1` en `≤820px`. La animación fija
  la opacidad de reposo del contenedor vía keyframe (.42), que **gana** sobre la
  propiedad `opacity` durante la animación → una media query sobre `opacity` NO
  surtiría efecto mientras la animación corre. Ver Decisión D2 (implica keyframe
  móvil aparte si se preserva el `.1`).

---

### Decisiones para la puerta humana

> El handoff está cerrado en valores, pero deja abiertos estos cuatro puntos
> (accesibilidad + reconciliación con el código actual + estrategia técnica).
> Ninguno se resuelve por cuenta propia: van a la puerta humana.

**D1 · `prefers-reduced-motion` (accesibilidad).** No está en el handoff, pero es
base de accesibilidad y el repo **ya lo respeta** (`ServiceMockup.module.scss`
usa `@media (prefers-reduced-motion: reduce){ … animation: none }`). El
`feature_list.json` de #14 ya lo exige en su acceptance.
**Propuesta (recomendada: SÍ):** con `reduce`, desactivar la animación y mostrar
el logo estático completamente dibujado. **Alternativa descartada:** dejar la
animación siempre activa — descartada porque incumple accesibilidad y el propio
criterio de aceptación de la feature. **A confirmar por el humano.**

**D2 · Opacidad del arco del hero en móvil.** Discrepancia entre el estado actual
y el handoff:
- Hoy `Hero.module.scss` fija `.arc { opacity: .45 }` y la reduce a `.1` en
  `≤820px` (decisión previa de #13, verificada).
- El handoff usa `.42` de reposo (keyframe `heroCycleOpacity`) y **no menciona
  móvil**.

Dos sub-decisiones:
1. **Reposo desktop `.45 → .42`.** La animación fija `.42` en el keyframe, que
   supersede el `.45` estático actual. Recomendado: adoptar `.42` (literal del
   handoff) como opacidad de reposo del contenedor animado.
2. **Reducción móvil `.1`.** **Propuesta (recomendada): PRESERVAR** la atenuación
   a `.1` en `≤820px` (no regresa una mejora responsive ya tomada). Como el
   keyframe gana sobre la propiedad `opacity`, preservarla exige un **keyframe
   móvil aparte** (p. ej. `heroCycleOpacityMobile` con `.1` en reposo) activado
   por media query, o no animar la opacidad en móvil. **Alternativa descartada:**
   usar `.42` en todos los anchos (literal del handoff) — descartada porque
   regresaría la atenuación móvil de #13 y el arco pesaría demasiado en pantallas
   pequeñas. **A confirmar por el humano.**

**D3 · Estrategia de keyframes compartidos (decisión de implementación).** Logo y
Hero comparten `ringLoop`/`waveLoop`/`dotOutlineLoop`/`dotFillLoop`. Como
**CSS Modules hashea los nombres de `@keyframes`**, definirlos por separado en
`Logo.module.scss` y `Hero.module.scss` los renombraría distinto y romperían al
cruzarse. **Propuesta:** definir los 8 keyframes + las clases/atributos de
animación en un **parcial global** `src/styles/_logo-draw.scss`, incluido vía
`@use` en `src/styles/main.scss`, y aplicarlos por **`data-attributes`** (p. ej.
`data-orbit-ring`, `data-orbit-wave`, `data-orbit-dot-outline`,
`data-orbit-dot-fill`, `data-orbit-cenit`, `data-orbit-digital`, y a nivel de
contenedor `data-logo-anim` / `data-hero-arc`), de modo que ambos componentes
los usen sin duplicar y sin depender del hashing de Modules. **Alternativa
descartada:** keyframes `:global(...)` dentro de cada módulo — funciona pero
duplica definiciones y dispersa la fuente de verdad; el parcial global es más
DRY y encaja con `docs/conventions.md` (tokens/base globales en `src/styles/`
vía `@use`). **A confirmar por el humano.**

**D4 · API de `Logo` (decisión de implementación).** Añadir prop
**`animated?: boolean` (default `false`)**. Header renderiza `<Logo animated />`;
Footer sigue con `<Logo size={38} />` estático **sin cambios**. Cuando `animated`
es `true`, el componente aplica los `data-attributes` de animación (D3) y añade
el círculo de contorno del punto (círculo A de CO3); cuando es `false`, el SVG
actual se mantiene intacto (icono relleno estático). **Alternativa descartada:**
un componente `LogoAnimated` separado — descartada porque duplicaría el SVG y su
`gradId` único; una prop es el diff mínimo y mantiene una sola fuente del icono.
**A confirmar por el humano.**

---

### Restricciones de implementación (para gherkin_author / tdd_craftsman)

- **R1 · Estado base = DIBUJADO, no oculto.** El estado oculto vive en el
  keyframe `0%` (dashoffset 300/30, `fill-opacity:0`, `clip-path:inset(0 100% 0 0)`,
  `stroke-opacity` del contorno). El **CSS base** de los elementos debe ser el
  **estado dibujado** (dashoffset 0, punto relleno, contorno invisible, wordmark
  visible, contenedor a opacidad de reposo). Así, con `animation: none`
  (reduced-motion o sin soporte), el logo se ve **completo** y la SSG prerenderiza
  un logo válido. ⚠️ NO hornear `stroke-dashoffset:300` como valor base (como hace
  el prototipo HTML con `style` inline): rompería reduced-motion y el fallback SSG.
- **R2 · El arco del hero necesita el círculo de contorno.** Hoy `Hero.tsx` tiene
  un único `<circle … fill="var(--color-accent)" />`. Para el trazo+relleno del
  punto hay que **añadir el círculo A** (contorno con `stroke-dasharray:30`) además
  del B (relleno con `transform-box:fill-box; transform-origin:center`).
- **R3 · Sin tokens nuevos.** `stroke-dasharray:300/30`, `18.3s`, y los radios/
  grosores son constantes de la animación, no tokens de marca — van en el
  SCSS/SVG, no en `_tokens.scss`.
- **R4 · Sin JS ni estado.** Nada de `useEffect`/`useState`/timers para la
  animación. No requiere `ClientOnly`.
- **R5 · Lista de mutación** (acceptance de #14): superficie TS a mutar =
  `Logo.tsx` (rama de la prop `animated`) y `Hero.tsx` (el círculo A añadido). Los
  escenarios deben aserir DOM observable: presencia de `data-attributes`, del
  círculo de contorno, del efecto de `animated`, de la regla reduced-motion y de
  que el Footer no anima.

---

### Qué NO cambia (garantías de no-regresión)

- **Footer:** su `Logo size={38}` permanece estático (sin `animated`).
- **Icono Órbita / `gradId` único por instancia** (`Logo.tsx`): la forma, paths y
  el degradado único por instancia se conservan.
- **Copy y estructura del hero** (#6 / #13): eyebrow, titular, subtítulo, CTAs,
  estadísticas y el resto del arco (posición, `aria-hidden`, `overflow:hidden`)
  intactos; solo se le añade la animación y el círculo A.
- **Tokens de color** (`_tokens.scss`): sin cambios, sin adiciones.
- **Tema claro/oscuro:** el logo sigue adaptándose solo vía `var(--color-…)`.

**Estado.** `pending`.
