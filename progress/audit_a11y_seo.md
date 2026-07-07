# Auditoría A11y (WCAG 2.1/2.2 AA) y SEO — Cénit Digital

Rama `feat/design-system`. Solo lectura. Verificado sobre HTML **prerenderizado**
(`dist/index.html`, `dist/aviso-legal/index.html`) tras `pnpm build`, no solo DOM
de dev. El contenido viaja completo en el HTML estático (hero, servicios, sectores,
paquetes, formulario, footer) — SSG correcto.

## Veredicto

Base de accesibilidad **excelente**: landmarks, labels, roles de estado, foco
visible, skip-link y Radix Dialog bien resueltos. Los bloqueantes son de
**contraste de color en tema oscuro** (tokens violeta sobre fondo noche).

---

## BLOQUEANTES (incumplen WCAG AA)

### B1 · Contraste de etiquetas (tag pill + nota "Ejemplo") en tema OSCURO — SC 1.4.3 (AA)

- `src/styles/_tokens.scss:108` — `--color-tag-ink: #7c5cbf` (violeta) sobre
  `--color-tag-bg: rgba(201,168,76,.22)` compuesto sobre `--color-bg:#12082a`.
- Consumido en `src/components/Servicios.module.scss:66` (`.tag`, 11px/700) y
  `:127` (`.exampleLabel` "Ejemplo", 9.5px/700).
- Ratio calculado ≈ **2.6:1**. Texto normal exige 4.5:1. Falla claramente.
- Render afectado en `dist/index.html` (tags "Presencia", "IA", … y "Ejemplo").

### B2 · Contraste de eyebrows en tema OSCURO — SC 1.4.3 (AA)

- `src/styles/_tokens.scss:90` — `--color-accent: #7c5cbf` (violeta) sobre
  `--color-bg:#12082a`.
- Consumido en `Hero.module.scss:18`, `Servicios.module.scss:15`,
  `Sectores.module.scss:20`, `Paquetes.module.scss:15`, `Contacto.module.scss:23`
  (todas `.eyebrow`, 12px/600, no es "texto grande").
- Ratio calculado ≈ **3.8:1** < 4.5:1. Falla. (En claro, `#1e7a4f` sobre `#f2f4ef`
  ≈ 4.8:1: pasa por poco.)

### B3 · Contraste de texto "faint" (nota de sectores) — SC 1.4.3 (AA)

- `src/styles/_tokens.scss:54` (claro `rgba(17,32,26,.45)`) y `:105`
  (oscuro `rgba(247,244,238,.40)`).
- Consumido en `Sectores.module.scss:123` (`.note` "Selección inicial…", texto real).
- Ratio calculado ≈ **2.8:1** en claro y **3.5:1** en oscuro < 4.5:1. Falla.
  (El uso en `ServiceMockup.module.scss:74` es decoración `aria-hidden`: no cuenta.)

> Nota: la checklist del design system (§8) afirma "contraste AA validado en
> RF-MARCA-001". Los valores calculados aquí lo contradicen para los tokens
> violeta/faint. Recomiendo re-validar con herramienta (axe / APCA / TPGi) antes
> de cerrar; los tres casos son texto informativo real, no decoración.

---

## MEJORAS (no bloquean indexación ni AA, estándar profesional)

### SEO

- **M1 · Falta `og:image`** y dimensiones — al compartir en redes no hay tarjeta
  con imagen. `Layout.tsx:16-23` define OG básico pero sin imagen.
- **M2 · Falta Twitter/X Card** (`twitter:card`, `twitter:title`…). `Layout.tsx`.
- **M3 · Falta `<link rel="canonical">`** por ruta. Recomendado para SSG.
- **M4 · OG por ruta no específico:** `Layout.tsx:19-22` fija `og:title`,
  `og:description` y `og:url` globales. `dist/aviso-legal/index.html` hereda
  `og:title="Cénit Digital"`, la description de la home y `og:url` = raíz del
  sitio (incorrecto para esa página). El `<title>` sí es propio ("Aviso legal —…").
- **M5 · Falta `sitemap.xml`** (no está en `public/` ni `dist/`).
- **M6 · Falta `robots.txt`** (no está en `public/` ni `dist/`).
- **M7 · Sin datos estructurados (JSON-LD `LocalBusiness`/`Organization`).** Alto
  valor para SEO local dado el posicionamiento ("pymes del noroeste de Madrid").
- **M8 · `meta description` única para todas las rutas** (`site.ts:4` vía
  `Layout.tsx:18`). `aviso-legal` describe la home. Debería ser propia por página.
- **M9 · `theme-color` obsoleto:** `index.html:7` usa `#0E8A82` (teal del logo
  azul/menta anterior, ya retirado). No coincide con marca verde `#1e7a4f` ni oro
  `#c9a84c`. Se refleja en `dist/index.html:5`.

### A11y (mejoras, no fallos AA duros)

- **M10 · `ThemeToggle` no se renderiza en SSR** (`Header.tsx:16`, `ClientOnly`):
  sin JS no hay conmutador de tema. Aceptable como mejora progresiva; anotarlo.
- **M11 · Patrón `radiogroup` del `ThemeToggle`** (`ThemeToggle.tsx:41-53`): los
  tres `role="radio"` son cada uno tab-stop. El patrón ARIA espera un único
  tab-stop + navegación con flechas (roving `tabindex`). No es fallo AA duro
  (cada botón tiene nombre y `aria-checked`), pero desvía del patrón esperado.
- **M12 · Tamaño de objetivo (SC 2.5.8, WCAG 2.2 AA):** enlaces de nav de
  escritorio sin padding vertical (`HeaderNav.module.scss:7-9`, alto ≈ line-box)
  y botón de cierre del panel móvil (`MobileMenu.module.scss:52-61`, sin tamaño
  explícito, área ≈ glifo ✕ ~22px) quedan por debajo del objetivo de 44px del
  propio design system (§7) y del mínimo 24px de WCAG 2.2. El trigger ☰ (40px) y
  las opciones de tema (~27px) cumplen. No aplica a WCAG 2.1 AA (2.5.5 es AAA).

---

## Comprobado y CORRECTO (no requiere acción)

- **Landmarks:** `header` / `nav aria-label="Principal"` / `main#contenido` /
  `footer` / `nav aria-label="Pie"`; navs diferenciados por etiqueta. `Layout.tsx`,
  `HeaderNav.tsx`, `Footer.tsx`.
- **Skip-link** primer elemento enfocable, mueve foco a `main[tabindex="-1"]`.
  `Layout.tsx:24-28`, `_base.scss:46-59`.
- **Jerarquía de encabezados:** un solo `<h1>` (hero), `h2` por sección, `h3` en
  tarjetas; sin saltos. Confirmado en `dist/index.html`. `aviso-legal` con su `h1`.
- **`lang="es"`** en `<html>` (raíz y prerenderizado). `Layout.tsx:17`, `index.html:2`.
- **Formulario:** todos los controles con `<label htmlFor>` asociado
  (`Contacto.tsx:80,105,130,144,166`); `aria-invalid` + `aria-describedby` en
  error (`:94-95,119-120`); `role="alert"` en errores de campo/envío
  (`:98,123,202`); `role="status"` en éxito (`:197`); honeypot `aria-hidden` +
  `tabIndex=-1` fuera del árbol accesible (`:180-190`); `select` con opción
  placeholder deshabilitada. Obligatorios con `required` nativo (el `*` es
  `aria-hidden`, pero AT anuncia "required").
- **Imágenes/SVG:** no hay `<img>`. Todos los SVG son decorativos con
  `aria-hidden="true"` + `focusable="false"` (Logo, CheckIcon, SectorIcon,
  ServiceMockup); cabeceras de sector `aria-hidden`. Nada informativo sin alt.
- **Foco visible global:** `:focus-visible { outline:2px solid var(--color-primary) }`
  (`_base.scss:41-44`) + overrides en inputs y toggle. Cumple SC 2.4.7.
- **Menú móvil (Radix Dialog):** `Dialog.Title` "Menú" etiqueta el diálogo,
  overlay con cierre por fondo, gestión de foco/`Escape` de fábrica, trigger y
  cierre con `aria-label`. `MobileMenu.tsx`.
- **Contraste OK:** botones primarios (blanco/#1e7a4f ≈ 5.4:1 claro; #16121f/oro
  ≈ 7.9:1 oscuro); texto principal y `text-soft` (≈ 5.3:1) en ambos temas;
  feedback de formulario (`--color-danger`/`--color-success`) legibles.
- **`<title>` propio por ruta** vía `<Head>` (home `home.tsx:12-14`; aviso-legal
  `aviso-legal.tsx:8-10`). Sin reutilización del default. Verificado en `dist/`.
- **Colores vía tokens** (`var(--color-…)`), sin hex sueltos en componentes; el
  logo hereda tema por CSS vars incluso dentro del SVG prerenderizado.

---

## Resumen

- **Bloqueantes: 3** (todos contraste de color; B1/B2 solo tema oscuro, B3 ambos).
- **Mejoras: 12**.
