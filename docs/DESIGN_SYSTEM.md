# Design System — Cénit Digital

> Fuente de verdad de la marca y la UI de la web corporativa.
> Derivado del diseño definitivo **"Cenit Digital - Web (final)"** (Claude Design)
> y de `RF-MARCA-001`. Este documento manda sobre cualquier valor suelto del
> scaffold previo.
>
> **Decisiones cerradas por el equipo (Pablo + 2):**
>
> - Paleta **CLARA = Bosque & Limón** · Paleta **OSCURA = Noche & Oro**.
> - Tipografía **Outfit** (display) + **DM Sans** (texto) — "Geométrica".
> - Logotipo = icono **"Órbita"** (anillo + onda degradada + punto cénit),
>   adaptativo al tema. Reemplaza el `Logo.tsx` azul/menta anterior.
> - Medidas fieles al diseño: ancho máx. **1180px**, radios de tarjeta **20px**.

Los tokens viven en [`src/styles/_tokens.scss`](../src/styles/_tokens.scss) y la
referencia visual montada, en `Cenit Home (referencia).dc.html` (raíz del repo
de diseño). Regla de oro (`docs/conventions.md`): **los colores se consumen
siempre con `var(--color-…)`; nunca hex sueltos en componentes.**

---

## 1 · Marca / logotipo

Icono **"Órbita"**: un anillo (la órbita), una **onda** con degradado
`primary → secondary` (la trayectoria hacia el cénit) y un **punto** en lo alto
(el cénit). Junto a él, el wordmark en dos líneas: **`cénit`** (Outfit 600) y
**`digital`** (DM Sans, 8px, `letter-spacing:5px`, minúsculas).

- Componente: [`src/components/Logo.tsx`](../src/components/Logo.tsx)
  (`<Logo />`, prop `withWordmark` y `size`).
- **Todos los colores del logo salen de tokens** (`--color-primary`,
  `--color-secondary`, `--color-ring`, `--color-zenith`, `--color-logo-ink`,
  `--color-logo-sub`), así que se adapta solo a claro/oscuro:
  - Claro → anillo/onda verde, punto y remate **limón**, "cénit" tinta oscura.
  - Oscuro → anillo/onda **oro**, punto oro, onda que vira a **violeta**,
    "cénit" marfil.
- `viewBox="0 0 80 80"`. Tamaños: **40px** en cabecera, **38px** en footer.
- El icono lleva `aria-hidden="true"` / `focusable="false"`; el texto accesible
  del enlace lo aporta el propio enlace a inicio.
- Cada instancia genera un `id` de degradado único (`useId`) para no colisionar
  cuando hay dos logos en la misma página (nav + footer).

**No hacer:** no recolorear el logo con hex fijos, no usar el icono azul/menta
anterior, no rotar/inclinar el anillo (es un círculo, no una elipse).

---

## 2 · Temas y mecánica

Dos temas, conmutados con `data-theme` en `<html>`:

| Estado              | `data-theme`      | Paleta             |
| ------------------- | ----------------- | ------------------ |
| Claro (por defecto) | ausente o `light` | **Bosque & Limón** |
| Oscuro              | `dark`            | **Noche & Oro**    |

- Selector de 3 estados **Claro / Oscuro / Sistema** (ver
  `features/theme_selector.feature`). Persistencia en
  `localStorage['cenit-theme']`; **ausencia de clave = "Sistema"**.
- **Anti-FOUC:** el tema se aplica a `<html>` antes del primer pintado (script
  inline en el `index.html`/entry, lee `cenit-theme` y, si es "Sistema",
  `prefers-color-scheme`).
- En modo "Sistema", reacciona en vivo a `prefers-color-scheme`.

---

## 3 · Color — tokens (valores exactos)

Todos definidos en `:root` (claro) y `:root[data-theme='dark']` (oscuro).

| Token                 | Claro · Bosque & Limón        | Oscuro · Noche & Oro         | Uso                            |
| --------------------- | ----------------------------- | ---------------------------- | ------------------------------ |
| `--color-primary`     | `#1E7A4F`                     | `#C9A84C`                    | Acción, marca, CTAs            |
| `--color-on-primary`  | `#ffffff`                     | `#16121f`                    | Texto sobre `primary`          |
| `--color-secondary`   | `#E3D34A`                     | `#7C5CBF`                    | 2.º color de marca, degradados |
| `--color-accent`      | `#1E7A4F`                     | `#7C5CBF`                    | Eyebrows / detalles            |
| `--color-bg`          | `#F2F4EF`                     | `#12082A`                    | Fondo base                     |
| `--color-bg-2`        | `#e5e7e2`                     | `#281b2e`                    | Fondo de sección alterna       |
| `--color-band`        | `#d5d8d3`                     | `#251c3b`                    | Franja de nav y footer         |
| `--color-band-border` | `rgba(17,32,26,.16)`          | `rgba(247,244,238,.12)`      | Borde de la franja             |
| `--color-surface`     | `#fafbf9`                     | `rgba(247,244,238,.05)`      | Inputs, notas "Ejemplo"        |
| `--color-surface-2`   | `rgba(30,122,79,.10)`         | `rgba(201,168,76,.16)`       | Superficie tintada             |
| `--color-card-bg`     | `#ffffff`                     | `rgba(247,244,238,.045)`     | Fondo de tarjeta               |
| `--color-border`      | `rgba(17,32,26,.14)`          | `rgba(201,168,76,.24)`       | Bordes                         |
| `--color-text`        | `#0f1d17`                     | `#F7F4EE`                    | Texto principal                |
| `--color-text-soft`   | `rgba(17,32,26,.66)`          | `rgba(247,244,238,.66)`      | Texto secundario               |
| `--color-text-faint`  | `rgba(17,32,26,.45)`          | `rgba(247,244,238,.40)`      | Metadatos                      |
| `--color-tag-ink`     | `#175d3c`                     | `#7C5CBF`                    | Texto de etiqueta              |
| `--color-tag-bg`      | `rgba(30,122,79,.13)`         | `rgba(201,168,76,.22)`       | Fondo de etiqueta              |
| `--color-logo-ink`    | `#0f1d17`                     | `#F7F4EE`                    | "cénit"                        |
| `--color-logo-sub`    | `#1E7A4F`                     | `#7C5CBF`                    | "digital"                      |
| `--color-ring`        | `#1E7A4F`                     | `#C9A84C`                    | Anillo del logo                |
| `--color-zenith`      | `#E3D34A`                     | `#C9A84C`                    | Punto cénit del logo           |
| `--color-danger`      | `#B3261E`                     | `#F2B8B5`                    | Error de campo / envío fallido |
| `--color-success`     | `#1E7A4F`                     | `#8FD0A3`                    | Envío correcto                 |
| `--shadow`            | `0 18px 45px rgba(0,0,0,.12)` | `0 22px 55px rgba(0,0,0,.5)` | Elevación de tarjetas          |

Degradado de marca (logo, mockups, cabeceras de sector):
`linear-gradient(135deg, var(--color-primary), var(--color-secondary))`.

**Tokens heredados DEPRECADOS** (solo compatibilidad; no usar en código nuevo):
`--color-soft`, `--color-brand`, `--color-brand-mint` → alias de
`primary`/`secondary`. Migrar y eliminar.

---

## 4 · Tipografía

- **Display / titulares + wordmark:** `--font-display` = **Outfit**.
- **Texto e interfaz:** `--font-sans` = **DM Sans**.
- Self-hosted vía `@fontsource` (importado en `src/main.tsx`).
  Pesos necesarios: **Outfit** 400/500/600/700, **DM Sans** 400/500/**600/700**
  (600/700 se usan en etiquetas y botones — añadir si faltan).

Escala (fiel al diseño; `clamp()` para fluidez):

| Rol                 | Familia · peso | Tamaño                                                     |
| ------------------- | -------------- | ---------------------------------------------------------- |
| H1 hero             | Outfit 600     | `clamp(34px, 5.4vw, 62px)` · line-height 1.04 · `-0.015em` |
| H2 sección          | Outfit 600     | `clamp(28px, 4vw, 44px)` · line-height 1.08 · `-0.01em`    |
| H3 tarjeta servicio | Outfit 600     | 32px                                                       |
| H3 paquete          | Outfit 600     | 25px                                                       |
| H3 sector           | Outfit 600     | 23px                                                       |
| Wordmark "cénit"    | Outfit 600     | 23px · `letter-spacing 1.5px`                              |
| Eyebrow             | DM Sans 600    | 12px · `letter-spacing .22em` · uppercase                  |
| Lead / intro        | DM Sans 400    | 17–19px · line-height 1.7                                  |
| Cuerpo              | DM Sans 400    | 14–15.5px · line-height 1.65–1.7                           |
| Etiqueta (tag pill) | DM Sans 700    | 11px · `letter-spacing .1em` · uppercase                   |
| Nota "Ejemplo"      | DM Sans 700    | 9.5px · `letter-spacing .14em` · uppercase                 |

`em` en cursiva dentro de titulares = `font-style:normal; color:var(--color-primary)`
(resalte de color, no cursiva real).

---

## 5 · Layout y espaciado

| Token           | Valor    | Uso                                                |
| --------------- | -------- | -------------------------------------------------- |
| `--maxw`        | `1180px` | Ancho máximo del contenido centrado                |
| `--gutter`      | `26px`   | Padding horizontal de página                       |
| `--section-y`   | `84px`   | Padding vertical de sección                        |
| `--radius`      | `20px`   | Tarjetas grandes (servicios, paquetes, formulario) |
| `--radius-md`   | `16px`   | Mockups / media                                    |
| `--radius-sm`   | `12px`   | Superficies pequeñas, notas, inputs (11–12px)      |
| `--radius-pill` | `999px`  | Botones y etiquetas                                |

Patrón de contenedor de sección:
`max-width: var(--maxw); margin: 0 auto; padding: 0 var(--gutter);`
Las secciones son **a sangre completa** (su fondo llena el ancho de viewport) con
este contenedor interior. Alternancia de fondo: `--color-bg` ⇄ `--color-bg-2`
(hero/servicios/paquetes usan `bg`; sectores/contacto usan `bg-2`).

---

## 6 · Componentes (specs)

**Botón primario** — `bg:primary`, `color:on-primary`, `padding:14px 28px`,
`radius:999px`, peso 600; hover `filter:brightness(1.08)` (+ `translateY(-1px)`
en el CTA del hero).
**Botón secundario / outline** — `bg:transparent`, borde `1.5px` de `border` o
`primary`, `color:text`/`primary`; hover `border-color:primary`.

**Etiqueta (tag pill)** — `color:tag-ink`, `bg:tag-bg`, `padding:6px 13px`,
`radius:999px`, 11px/700 uppercase `.1em`.

**Tarjeta de servicio** — `bg:card-bg`, borde `border`, `radius:20px`,
`padding:36px 32px`, `shadow`. Fila zigzag `grid` 2 col (`1.05fr 1.15fr`,
invertida en pares), `gap:30px`, alterna tarjeta ↔ mockup. Cada característica:
check SVG (`stroke:primary`) + texto 13.5px. Bajo el mockup, nota **"Ejemplo"**
en superficie `surface`.

**Tarjeta de sector** — `radius:18px`, cabecera de 150px con degradado de marca

- círculos decorativos (`on-primary` a baja opacidad) + icono 62px; cuerpo con
  H3 23px + descripción. Hover: `translateY(-4px)`, `border-color:primary`.

**Tarjeta de paquete** — `radius:20px`, `padding:32px 28px`. La destacada
("Presencia Activa") lleva borde `primary`, `shadow` e insignia **"Más elegido"**
(`bg:primary/on-primary`, absolute `top:-13px left:28px`); las otras dos, borde
`border` y sin sombra. Lista de features con check `primary` y separador
`border`. Botón "Solicitar presupuesto" (primario en la destacada, outline en
las demás). **Sin precios** (decisión de producto pendiente).

**Formulario** — `bg:card-bg`, `radius:20px`, `padding:30px`, `shadow`. Campos:
`bg:surface`, borde `border`, `radius:11px`, `padding:13px 14px`; `focus`
`border-color:primary`. Obligatorios con `*` en `primary`.

**Nav** — sticky, `bg:band`, borde inferior `band-border`. Logo + enlaces
(Servicios/Sectores/Paquetes/Contacto) + toggle de tema + botón "Hablamos".
En móvil los enlaces se ocultan y aparece la hamburguesa → panel deslizante.

**Footer** — `bg:band`, borde superior `band-border`, `padding:44px 0`. Logo +
copyright con año + enlace "Aviso legal". (Sin "Privacidad"/"Cookies" hasta que
existan esas páginas — ver `features/footer.feature`.)

---

## 7 · Responsive

Breakpoints del diseño (mobile-first al implementar, pero estos son los cortes):

- **≤ 880px** — todas las rejillas de 2/3 columnas colapsan a 1 columna
  (filas de servicio, sectores, paquetes, contacto y filas de formulario).
- **≤ 820px** — se ocultan los enlaces de escritorio y aparece la hamburguesa;
  el arco decorativo del hero baja su opacidad y se reposiciona.

Objetivos: hit-targets ≥ 44px, foco visible (`:focus-visible` con
`outline:2px solid var(--color-primary)`), sin scroll horizontal.

---

## 8 · Checklist de fidelidad

- [ ] Colores **solo** vía `var(--color-…)` (0 hex en componentes).
- [ ] Claro = Bosque & Limón, Oscuro = Noche & Oro; toggle 3 estados + anti-FOUC.
- [ ] Logo "Órbita" adaptativo (no el azul/menta), wordmark en dos líneas.
- [ ] Outfit en titulares, DM Sans en texto; pesos 600/700 cargados.
- [ ] Ancho 1180px, radios 20/16/12, sombras por tema.
- [ ] 6 servicios, 4 sectores, 3 paquetes, formulario de 5 campos.
- [ ] Responsive en 880/820; foco visible; contraste AA (validado en RF-MARCA-001).
