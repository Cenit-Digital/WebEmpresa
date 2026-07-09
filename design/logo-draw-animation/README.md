# Handoff: Animación de "dibujado" del logo Órbita (nav + hero)

## Overview
Animación de trazado ("self-drawing") del icono de marca **Órbita** de Cénit Digital (anillo + onda degradada + punto cénit), aplicada en dos sitios de la landing:

1. **Nav** (cabecera, esquina superior izquierda): icono (40px) + wordmark "cénit digital".
2. **Hero**: el mismo icono en grande (540px), decorativo, semi-transparente, sin wordmark.

El trazo se dibuja solo (sin cursor/pincel), se reproduce **al cargar la página** y **se repite en bucle infinito** con una **pausa larga (~11s)** entre cada repetición. Funciona igual en los dos temas de la marca (claro "Bosque & Limón" / oscuro "Noche & Oro") porque todo el color sale de las custom properties ya existentes — no se ha creado ningún token nuevo.

Se descartaron 2 variantes de ritmo antes de llegar a esta (ver carpeta `exploracion/`): una secuencial clásica (anillo→onda→punto) y otra con la onda dibujándose primero. La aprobada es la **"simultánea a distinto ritmo"**: el anillo se dibuja lento de fondo durante casi todo el trazo, mientras la onda, el punto y el texto van más rápido en primer plano — sensación más dinámica/viva que una secuencia estrictamente uno-tras-otro.

## About the Design Files
Los archivos de esta carpeta (`CenitLanding.dc.html` y `exploracion/Opciones Animación Logo.dc.html`) son **referencias de diseño en HTML** — prototipos que muestran el aspecto y comportamiento exactos, no código de producción para copiar tal cual. Usan un runtime propio del entorno de diseño (`support.js`, `ds-base.js`, atributos `style="…"` inline) que no existe en la app real.

La tarea es **recrear esta animación en el entorno del repo de producción** (`github.com/Cenit-Digital/WebEmpresa` — Vite + React + TS + SCSS), lo más probable dentro de `src/components/Logo.tsx` + su SCSS, reutilizando los tokens de color que ya existen en `src/styles/_tokens.scss`. No hace falta reproducir el HTML inline: lo importante es el **valor exacto de cada keyframe, timing y color**, documentado abajo.

## Fidelity
**Alta fidelidad.** Todos los valores (colores, duraciones, porcentajes de keyframe, curvas de easing) están cerrados y aprobados — no son un boceto. Reprodúcelos con precisión.

## Screens / Views

### 1. Nav — icono + wordmark
- **Dónde**: esquina superior izquierda de la barra de navegación (sticky), dentro del enlace a `#top`.
- **Tamaño icono**: 40×40px, `viewBox="0 0 80 80"`.
- **Wordmark**: "cénit" (Outfit 600, 23px, letter-spacing 1.5px, color `--color-logo-ink`) sobre "digital" (DM Sans, 8px, letter-spacing 5px, minúsculas, color `--color-logo-sub`), en columna, gap 3px. Todo el lockup con `gap: 11px` entre icono y texto.
- **Comportamiento**: al cargar la página, se dibuja el icono y luego se "escribe" el wordmark; se mantiene dibujado ~11s y vuelve a repetirse indefinidamente.

### 2. Hero — icono decorativo grande
- **Dónde**: esquina superior derecha del `<header>`, posición absoluta (`right:-120px; top:-80px`), 540×540px, por detrás del contenido (z-index inferior al texto del hero).
- **Opacidad de reposo**: `.42` (no full opacity) — es un elemento decorativo de fondo, no protagonista.
- **Color**: un único color (`--color-accent`), sin degradado (a diferencia del nav, que sí usa gradiente en la onda).
- **Comportamiento**: mismo ritmo de trazo que el del nav (comparten los mismos `@keyframes` de dashoffset/clip), sin wordmark.

### Footer (fuera de alcance)
El logo del footer (mismo icono + wordmark, ver `<footer>` en el HTML) **no se ha animado** — se dejó estático intencionadamente porque el usuario solo pidió animar nav + hero.

## Interactions & Behavior

### Estructura del trazo (SVG stroke-dasharray/dashoffset + clip-path)
Cada elemento tiene un `stroke-dasharray` fijo mayor que su longitud real de trazo — no hace falta medir el path exacto, solo que el dasharray sea ≥ longitud real:
- **Anillo** (círculo r=30, `stroke-opacity:.5`): `stroke-dasharray:300`. Circunferencia real ≈188.5, 300 es un margen seguro.
- **Onda** (path `M15 46 C25 26 33 26 41 44 C48 59 57 59 65 41`, `stroke-linecap:round`): `stroke-dasharray:300`.
- **Punto cénit**: en vez de aparecer como un círculo relleno de golpe, se traza como **mini-círculo hueco y luego se rellena** (crossfade):
  1. Círculo A (`fill:none`, `stroke:var(--color-zenith)`, `stroke-width:1.6` en nav / `1.3` en hero, `stroke-dasharray:30`) dibuja el contorno vía `stroke-dashoffset`.
  2. Círculo B (superpuesto, mismo cx/cy/r, `fill:var(--color-zenith)`) hace crossfade: `fill-opacity` 0→1 + `transform:scale(.3)→scale(1)` ("pop" sutil).
  3. Círculo A desvanece su `stroke-opacity` 1→0 justo cuando B termina de rellenar, dejando al final un punto relleno idéntico al original (sin resto de contorno).
  4. **Importante**: el círculo B necesita `transform-box:fill-box; transform-origin:center` en su style — si no, el `scale()` no gira/escala alrededor de su propio centro.
- **Wordmark ("cénit" y "digital")**: no se puede trazar letra a letra sin convertir el texto a paths, así que se usa un efecto **máquina de escribir**: `clip-path: inset(0 100% 0 0)` (oculto) → `inset(0 0% 0 0)` (visible), con timing-function `steps(N, end)` — N = nº de caracteres (5 para "cénit", 7 para "digital") — para que la revelación salte carácter a carácter en vez de deslizarse suave.

### Orden y ritmo (variante aprobada: "simultánea a distinto ritmo")
Duración total de UN ciclo: **18.3s**. Todo en un único `animation-duration:18.3s; animation-iteration-count:infinite` por elemento, con **keyframes en porcentaje** (nunca en segundos) para que todos los elementos queden perfectamente sincronizados sin JS.

| Elemento | % inicio | % fin dibujo | Segundos equiv. | Easing |
|---|---|---|---|---|
| Anillo (`ringLoop`) | 0% | 41% | 0 → 7.5s | `cubic-bezier(.25,.46,.45,.94)` (lento, constante, "de fondo") |
| Onda (`waveLoop`) | 0% | 22% | 0 → 4.0s | `cubic-bezier(.4,0,.2,1)` (rápido, en paralelo con el anillo) |
| Punto — contorno (`dotOutlineLoop`) | 22% | 27% | 4.0 → 4.9s | `cubic-bezier(.4,0,.2,1)` |
| Punto — relleno (`dotFillLoop`) | 27% | 30% | 4.9 → 5.5s | `cubic-bezier(.4,0,.2,1)` |
| "cénit" (`cenitLoop`) | 30% | 35% | 5.5 → 6.4s | `steps(5,end)` |
| "digital" (`digitalLoop`) | 36% | 41% | 6.6 → 7.5s | `steps(7,end)` |
| **Pausa (hold)** | 41% | 93% | 7.5 → 17.0s (~9.5s quieto, ya dibujado) | — |
| **Fundido de reset** | 93% | 96% | 17.0 → 17.6s | `ease-in-out` (en el contenedor, ver abajo) |
| **Vacío / reset invisible** | 96% | 97% | 17.6 → 17.75s | — |
| Blank final | 97% | 100% | 17.75 → 18.3s | — |

El anillo termina a la vez que el texto ("digital" también acaba en 41%) — es intencionado: el elemento más lento y el más rápido llegan juntos al mismo punto, dando sensación de llegada conjunta pese al ritmo distinto.

### El truco del bucle sin salto visual
Un `@keyframes` con `iteration-count:infinite` NO interpola entre el 100% de una vuelta y el 0% de la siguiente — si esos dos valores no coinciden, hay un salto brusco visible. Por eso:
- Cada propiedad de dibujo (dashoffset / clip-path / fill-opacity) tiene **el mismo valor en 0% y en 100%** (el estado "oculto").
- El contenedor de todo el lockup (el `<a>` del nav, el `<div>` decorativo del hero) anima su `opacity` con `logoCycleOpacity` / `heroCycleOpacity`: se mantiene visible (`1` en nav, `.42` en hero) durante el dibujo + la pausa, **cae a 0 brevemente entre el 96% y el 97%** — momento exacto en que cada trazo "rebobina" de golpe a su estado oculto — y vuelve a su opacidad visible antes de llegar al 100%. Ese parpadeo de opacidad 0 dura ~0.2s y oculta el "rebobinado" instantáneo; el usuario nunca lo ve.
- **Ojo con el primer frame**: el contenedor **no** debe empezar en `opacity:0` en el 0% (aunque parezca simétrico) — el primer pintado de la página puede caer justo ahí y se vería el nav sin logo un instante. El contenedor arranca visible desde 0%; lo que está oculto al principio es el propio trazo (dashoffset al máximo), no el contenedor.

### Colores usados (custom properties existentes — no crear ninguno nuevo)
`--color-primary`, `--color-secondary` (degradado de la onda en el nav), `--color-ring`, `--color-zenith`, `--color-accent` (color único de la onda/anillo/punto en el hero), `--color-logo-ink`, `--color-logo-sub`. Valores actuales por tema (ya definidos en `_tokens.scss` / `colors.css`, incluidos aquí solo como referencia):

- **Claro** — primary `#1e7a4f`, secondary `#e3d34a`, ring `#1e7a4f`, zenith `#e3d34a`, accent `#1e7a4f`, logo-ink `#0f1d17`, logo-sub `#1e7a4f`.
- **Oscuro** — primary `#c9a84c`, secondary `#7c5cbf`, ring `#c9a84c`, zenith `#c9a84c`, accent `#7c5cbf`, logo-ink `#f7f4ee`, logo-sub `#7c5cbf`.

## State Management
Ninguno nuevo. Es una animación CSS pura (`@keyframes` + `animation`), sin JS ni estado de React — arranca sola al montar. El cambio de tema claro/oscuro reutiliza el mecanismo que ya existe en el proyecto (`data-theme` en `<html>`); la animación no necesita saber en qué tema está porque todo su color viene de `var(--color-*)`.

## Design Tokens
No se ha introducido ningún token nuevo. Valores "mágicos" propios de esta animación (no son tokens de marca, son constantes de la animación en sí):
- `stroke-dasharray`: `300` (anillo y onda), `30` (contorno del punto).
- Radios: anillo `r=30`, punto `r=3.8` (nav) / `r=3` (hero) — ya existentes en el logo original.
- Grosores de trazo: anillo `1.8` (nav) / `1` (hero), onda `3.2` (nav) / `1.4` (hero), contorno del punto `1.6` (nav) / `1.3` (hero) — ya existentes.
- Duración de ciclo: `18.3s`. Pausa visible: ~9.5s.

## Assets
No hay assets nuevos. El icono es 100% SVG inline (paths ya existentes en `Logo.tsx` / `assets/icono-orbita-*.svg` del design system) — la animación solo añade `stroke-dasharray` + `style` con `animation` a los elementos SVG que ya existían, y una capa extra (círculo de contorno) para el efecto de trazo+relleno del punto. No se ha creado ni pedido ninguna imagen o icono nuevo.

## Files
- `CenitLanding.dc.html` — landing completa con la animación ya aplicada (nav + hero). Busca los bloques `<!-- NAV -->` y `<!-- HERO -->`, y el `@keyframes` dentro de `<helmet><style>` al principio del archivo.
- `exploracion/Opciones Animación Logo.dc.html` — las 3 variantes de ritmo comparadas antes de elegir esta (por si sirve de contexto de por qué se descartaron las otras dos).
