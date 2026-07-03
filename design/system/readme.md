# Cénit Digital — Design System

Sistema de diseño reutilizable de **Cénit Digital** (agencia de soluciones
digitales para pymes, Las Rozas, Madrid). Enlaza un solo archivo — `styles.css`
— y tendrás la marca completa: color (temas claro/oscuro), tipografía, logo,
tokens y componentes.

## Fuentes (de dónde sale esto)

- Diseño definitivo: **"Cenit Digital - Web (final)"** (Claude Design) — la home
  aprobada por el equipo.
- Repo de producción: **github.com/Cenit-Digital/WebEmpresa** (Vite + React + TS
  + SCSS + SSG). Ahí viven `src/styles/_tokens.scss`, `src/components/Logo.tsx`,
  las `features/*.feature` y `docs/DESIGN_SYSTEM.md` (guía extendida).
- Referencia visual montada: `Cenit Home (referencia) — standalone.html`.

## Cómo se consume

```html
<link rel="stylesheet" href="styles.css" />
```

El tema se conmuta con `data-theme` en `<html>`:
- sin atributo o `data-theme="light"` → **Bosque & Limón** (claro).
- `data-theme="dark"` → **Noche & Oro** (oscuro).

Los colores se usan **siempre** con `var(--color-…)`.

## Content fundamentals (voz y copy)

- **Idioma:** español de España. **Tuteo** siempre ("Llevamos **tu** negocio…",
  "Cuéntanos qué necesita tu negocio"). Cercano pero profesional.
- **Enfoque en beneficio**, no en la tecnología: se explica el resultado
  ("aparece el primero en tu zona"), con un **ejemplo real** por servicio.
- **Mayúsculas:** frases en *sentence case*; **eyebrows** en MAYÚSCULAS con
  tracking amplio; la marca en minúsculas (**cénit / digital**).
- **Sin emoji** (salvo el ✓ de checks y el ★ de la valoración). Frases cortas,
  concretas, sin jerga vacía. Ejemplos de eyebrow: "Soluciones digitales para
  pymes", "Lo que hacemos", "A quién ayudamos".

## Visual foundations (resumen)

- **Color:** primario verde bosque (#1E7A4F) + limón (#E3D34A) en claro; oro
  (#C9A84C) + violeta (#7C5CBF) en oscuro. Fondos cálidos desaturados.
- **Tipografía:** Outfit (titulares/wordmark, 600) + DM Sans (texto). Titulares
  con tracking negativo; eyebrows y etiquetas con tracking amplio en versalitas.
- **Tarjetas:** fondo `--color-card-bg`, borde `--color-border` a 1px, radio
  20px, sombra difusa `--shadow`; la destacada usa borde `primary` + insignia.
- **Radios:** 20 (tarjetas), 16 (media), 12 (superficies), 999 (pills).
- **Degradado de marca:** `linear-gradient(135deg, primary, secondary)` — onda
  del logo, cabeceras de sector, mockups.
- **Hover:** enlaces aclaran a `--color-text`; botones `filter:brightness(1.08)`;
  tarjetas de sector `translateY(-4px)` + borde `primary`. **Foco** visible con
  `outline:2px solid var(--color-primary)`.
- **Animación:** reveal on-scroll sutil (fade + subida 26px, ~0.7s ease-out);
  microanimaciones en los mockups (typing, pulso, flujo). Nada estridente.
- Detalle completo en `docs/DESIGN_SYSTEM.md`.

## Iconography

- **Iconos de línea** minimalistas (estilo Feather/Lucide): trazo ~2px, `fill:none`,
  `stroke:currentColor` o `var(--color-primary)`. El check es una `polyline`.
- **Sin librería de iconos** empaquetada; son SVG inline. Si necesitas un set
  amplio, usa Lucide (mismo peso de trazo) y respeta `stroke-width`.
- **Logo "Órbita":** anillo + onda degradada + punto cénit. En `assets/`
  (`icono-orbita-claro.svg`, `logo-cenit-claro.svg`, `logo-cenit-oscuro.svg`) y
  como componente `Logo`. Nunca lo redibujes ni lo recolores con hex fijos.
- **Sin emoji** como iconografía.

## Índice / manifiesto

- `styles.css` — entrada global (solo `@import`).
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`.
- `assets/` — logotipos e icono Órbita (SVG).
- `components/` — `core/` (`Button`, `Tag`, `Logo`, `Card`), `forms/` (`Field`)
  y `patterns/` (`Nav` con menú móvil, `ServiceRow`). Cada uno con `.jsx` +
  `.d.ts` + `.prompt.md`, y una `*.card.html` por grupo.
- `ui_kits/web/` — home completa (`index.html`: nav, hero, servicios, sectores,
  paquetes, contacto, footer) + `README.md`.
- `guidelines/` — tarjetas de especímenes (Color, Type, Spacing, Brand).
- `SKILL.md` — para usar este sistema como Agent Skill en Claude Code.

> **Producción:** el paquete listo para el repo (SCSS, `Logo.tsx`, features
> Gherkin, guía y handoff) está en `cenit-design-system-export/` y en `HANDOFF.md`.

## Caveats

- Las fuentes se declaran con **`@font-face` propio** en `tokens/fonts.css`,
  apuntando a los **mismos archivos `@fontsource`** que usa el repo (servidos
  por jsdelivr, versión 5). Si prefieres los `.woff2` físicamente en el proyecto,
  dímelo y los dejo en `assets/fonts/`.
- La tarjeta de "Components" es una **réplica estática** con los tokens (siempre
  renderiza); los componentes reales se exportan desde los `.jsx` + `.d.ts`.
