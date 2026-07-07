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
