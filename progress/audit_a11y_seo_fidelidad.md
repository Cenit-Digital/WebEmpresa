# Auditoría A11y (WCAG 2.1 AA) + SEO — #13 fidelidad_referencia

Solo lectura. `pnpm build` OK; auditado sobre el HTML **prerenderizado** de `dist/`
además del código. Ámbito: `ThemeToggle`, `Header`, `HeaderNav`, `Hero`.

## Veredicto
**0 bloqueantes · 2 mejoras.** Nada incumple WCAG AA ni rompe la indexación.
Los 4 puntos del encargo (botón de tema, arco del hero, cabecera/nav, SEO) son
**conformes**. Dos observaciones menores (defensa en profundidad / robustez de
borde), no bloqueantes.

---

## 1. Botón de tema (`ThemeToggle.tsx`)

### Conforme
- **Nombre accesible que comunica el modo activo** — `aria-label={\`Cambiar tema
  (actual: ${MODE_LABEL[mode]})\`}` (`ThemeToggle.tsx:109`) resuelve a
  "Claro"/"Oscuro"/"Sistema". Cumple **4.1.2** y satisface @s4.
- **Operable por teclado** — es un `<button type="button">` nativo
  (`ThemeToggle.tsx:107-108`); Enter/Espacio funcionan de fábrica. Cumple **2.1.1**.
- **`:focus-visible` con contraste suficiente** — outline `2px var(--color-primary)`
  offset 2px (`ThemeToggle.module.scss:18-21`). Medido contra la franja de cabecera:
  **3.69:1 en claro** (`#1e7a4f` vs `#d5d8d3`) y **6.99:1 en oscuro**
  (`#c9a84c` vs `#251c3b`). Ambos ≥ 3:1. Cumple **1.4.11 / 2.4.11**.
- **Contraste del icono** — `stroke="currentColor"` heredando `color: var(--color-text)`
  (`ThemeToggle.module.scss:11`): `#0f1d17` sobre franja clara y `#f7f4ee` sobre
  franja noche, muy por encima de 3:1 en ambos temas. Cumple **1.4.11**.
- **Patrón "botón que cicla" (anuncio de estado)** — el **nombre accesible dinámico
  basta y es lo mínimo conforme**. NO añadir `aria-pressed` (sería **incorrecto**:
  es booleano para toggles de 2 estados, no para un ciclo de 3). `aria-live` es
  innecesario (YAGNI): el estado es el propio nombre accesible, programáticamente
  determinable (**4.1.2**). Recomendación: dejarlo como está.

### Mejora (no bloqueante)
- **[MEJORA] SVG de icono sin `aria-hidden`** — `ThemeToggle.tsx:36,51,73`. Los tres
  `<svg>` son decorativos (llevan solo `data-icon`, sin `role`/`title`), y el nombre
  del botón ya viene del `aria-label` (que prevalece). Pero algún lector de pantalla
  puede exponer el `<svg>` sin nombre como nodo "imagen/gráfico" suelto dentro del
  botón. **Recomendación mínima:** añadir `aria-hidden="true"` a cada `<svg>` para
  sacarlos del árbol de accesibilidad. Ref. **1.1.1 / 4.1.2** (defensa en profundidad;
  el control ya tiene rol y nombre correctos, por eso es mejora y no bloqueante).
- **[MEJORA] Borde en reposo por debajo de 3:1** — `ThemeToggle.module.scss:7`,
  `border: 1px solid var(--color-band-border)`. En claro `rgba(17,32,26,0.16)` sobre
  la franja `#d5d8d3` da **~1.34:1**. **1.4.11** exime el borde si no es necesario
  para identificar el componente; aquí el **icono** aporta la affordance, por eso no
  bloquea. **Recomendación mínima:** confiar en el icono como indicador de presencia
  (dejarlo), o subir el token del borde si se quiere que el contorno sea el límite del
  control. En hover pasa a `--color-primary` y en foco hay outline: solo el reposo es
  tenue.

---

## 2. Arco del hero (`Hero.tsx` / `Hero.module.scss`) — Conforme
- **Fuera del árbol de accesibilidad** — `data-hero-arc aria-hidden="true"`
  (`Hero.tsx:13`); confirmado en el HTML prerenderizado (`dist/index.html`:
  `data-hero-arc="true" aria-hidden="true"`). El SVG interior queda oculto por
  herencia del `aria-hidden` del contenedor; no interfiere con la lectura del H1/CTA.
- **No enfocable** — es un `<div>` sin `tabindex` con SVG no interactivo; fuera del
  orden de tabulación. Satisface @s7.
- **`pointer-events: none`** — `Hero.module.scss:15`. No captura clics del contenido.
- **Sin scroll horizontal (Reflow 1.4.10)** — el arco (`width:540px`, `right:-120px`,
  `top:-80px`, `Hero.module.scss:7-16`) queda clipado por `overflow: hidden` del
  `.hero` (`Hero.module.scss:2`). Satisface @s9 y **1.4.10**.

## 3. Cabecera / navegación (`Header.tsx` / `HeaderNav.tsx`) — Conforme
- **Landmark `nav` con nombre** — `<nav aria-label="Principal">` (`HeaderNav.tsx:28`);
  presente en el HTML prerenderizado. No colisiona con el `nav aria-label="Pie"` del
  footer (landmarks distinguibles, **1.3.1 / 2.4.1**).
- **Orden de tabulación lógico** — el DOM es enlaces → `ThemeToggle` → "Hablamos"
  (`HeaderNav.tsx:29-37`); el foco sigue el DOM. Cumple **2.4.3** y satisface @s6.
- **"Hablamos" alcanzable** — `<a href="#contacto">` (`HeaderNav.tsx:35`), último del
  clúster; alcanzable por teclado.
- **Tema alcanzable en móvil** — rama móvil `ThemeToggle` + `MobileMenu`
  (`HeaderNav.tsx:20-24`); sigue en el orden de foco.
- **Estructura de dos grupos** — `Header.tsx:9-14` renderiza exactamente logo + nav
  (satisface @s5); sin cambios de contenido indexable ni de jerarquía de encabezados.
- Nota (no defecto): `ThemeToggle` va en `<ClientOnly>`, así que no aparece en el
  prerender y se inserta tras la hidratación. Correcto: el conmutador es mejora
  progresiva (depende de `localStorage`/`matchMedia`); sin JS no hay control pero no
  se pierde contenido → no es fallo WCAG.

## 4. SEO — Conforme
- **`<title>` propio por ruta** — `dist/index.html`:
  `Cénit Digital — Soluciones digitales para pymes` (no el default genérico del
  Layout). `<html lang="es">` presente.
- **Una sola `<h1>` por página** — recuento = 1; secuencia de encabezados sin saltos
  (`h1 → h2 → h3 … h2 …`, verificado en `dist/index.html`). Cumple **1.3.1 / 2.4.6**.
- **Open Graph + canonical** — `og:type/site/locale/title/description/url` y
  `canonical` presentes en el `<head>` prerenderizado.
- **Enlace "saltar al contenido"** — presente como primer elemento enfocable
  (`Layout.tsx:24`, estilos `_base.scss:46-59`); apunta a `<main id="contenido">`.
- Los cambios de #13 no alteran contenido indexable ni la jerarquía de headings.

---

### Resumen de severidades
| Sev. | # | Ítems |
|------|---|-------|
| Bloqueante | 0 | — |
| Mejora | 2 | SVG sin `aria-hidden` (`ThemeToggle.tsx:36,51,73`); borde en reposo <3:1 (`ThemeToggle.module.scss:7`) |
