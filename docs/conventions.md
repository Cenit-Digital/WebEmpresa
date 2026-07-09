# Convenciones — estilo, nombres, estructura

Alineadas con `RF-CODE-001` (Confluence). Objetivo: que cualquiera del equipo
entienda y mantenga el código sin sorpresas.

## Código

- **Lenguaje:** TypeScript en todo el proyecto (sin `any` salvo justificación).
- **Componentes:** funcionales con Hooks; **un componente por archivo**;
  nombre en `PascalCase` (archivo `PascalCase.tsx`).
- **Lógica:** en `src/lib/` como funciones puras (`camelCase`), sin JSX.
- **Ficheros y carpetas:** `kebab-case` para rutas y páginas
  (`aviso-legal.tsx`); `PascalCase` para componentes.
- **Estilos:** **SCSS Modules** (`*.module.scss`) por componente; tokens y
  base globales en `src/styles/` con `@use` (nunca `@import`). Consumir colores
  vía `var(--color-…)`. Evitar CSS global suelto fuera de `styles/`.
- **Formato y linting:** Prettier + ESLint; se ejecutan antes de cada commit
  (`pnpm lint`, `pnpm format`).
- **Accesibilidad y SEO:** HTML semántico, `alt` en imágenes, `<title>` y
  `description` por página, foco visible, primitivas accesibles (Radix).

## Responsive (obligatorio)

Reglas nacidas del bug de la cabecera (nav de escritorio "pegada" en móvil por
hidratación). **Aplican a toda feature nueva o cambio de layout:**

1. **El layout responsive se decide con CSS `@media`, NUNCA ramificando el
   render con JavaScript.** Renderiza **ambas** variantes (p. ej. nav de
   escritorio + hamburguesa) y decide cuál se ve con `display`/`@media`. Reserva
   `window.matchMedia`/JS solo para el **comportamiento** (abrir/cerrar un panel,
   `aria-expanded`), nunca para elegir **qué** se pinta. Motivo: usar `matchMedia`
   en la lógica de render es una causa documentada de errores de hidratación en
   SSR/SSG y deja el árbol "pegado" al snapshot de servidor (escritorio) hasta un
   `resize` → en móvil desaparece la hamburguesa y la página desborda.
   Fuentes: react.dev/reference/react-dom/client/hydrateRoot ·
   developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries ·
   web.dev/learn/design/media-queries.
2. **Guard global anti-desbordamiento horizontal:** `#root { overflow-x: clip }`
   (en `src/styles/_reset.scss`). Va en **`#root` (el punto de montaje), no en
   `html`/`body`**: en `html`/`body` el overflow se propaga al viewport y `clip`
   NO frena el scroll horizontal; `#root` es un `div` normal que recorta de
   verdad su contenido desbordado (verificado en navegador: `scrollX=0`,
   `scrollWidth = ancho del viewport`). Usa `clip`, **no** `hidden`: `clip`
   recorta sin crear scroll container y preserva el `position: sticky` de la
   cabecera; `hidden` fuerza el eje contrario a `auto`, vuelve el elemento scroll
   container y rompe el sticky. No introduzcas `overflow-x: hidden` en
   `html`/`body`/`#root`.
   Fuente: w3.org/TR/css-overflow-3 · developer.mozilla.org/en-US/docs/Web/CSS/overflow.
3. **Prohibido el desbordamiento horizontal en cualquier viewport.** Usa unidades
   fluidas (`%`, `clamp()`, `min()/max()`), `max-width: 100%` en media, y evita
   anchos fijos en `px` que superen una pantalla estrecha (~320px).
   Fuente: developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design.
4. **Verificación en navegador real, no solo jsdom** (jsdom no hace layout). Todo
   cambio de layout/nav se prueba en Chrome a una matriz densa de anchos
   (320→1440px), en tema claro y oscuro, y **con y sin JavaScript**: 0
   desbordamiento horizontal (`scrollWidth === innerWidth`) y el control correcto
   visible en cada rango. El `<meta viewport>` debe seguir siendo
   `width=device-width, initial-scale=1` (sin `user-scalable=no`).

## Tests

- Vitest, co-locados: `algo.test.ts(x)` junto a `algo.ts(x)`.
- El nombre del test cita el escenario Gherkin: `it('@s1 …')`.
- Componentes con Testing Library; lógica pura con asserts exactos.

## Ramas (Git)

- `main`: siempre desplegable.
- Trabajo por tarea: `tipo/CLAVE-descripcion`, p. ej. `feat/WEB-5-secciones-home`.
- Tipos: `feat`, `fix`, `chore`, `docs`, `refactor`.

## Commits

Conventional Commits con la clave de Jira al final:

```
feat: añade formulario de contacto con Resend (WEB-6)
fix: corrige validación de email del formulario (WEB-6)
```

## Pull Requests

- Una PR por tarea, enlazada a su issue de Jira.
- Verde de CI (typecheck + lint + test + build) antes de fusionar.
- Fusión a `main` solo con la PR revisada y el criterio de aceptación cumplido
  (DoD en `RF-SISTEMA-001`).
