# HANDOFF — Design System de Cénit Digital → Claude Code (Harness/SDD)

Este paquete lleva el diseño definitivo ("Cenit Digital - Web (final)") al repo
`WebEmpresa` con fidelidad 1:1. Está pensado para tu flujo **Harness/SDD**:
fundamentos como código + **todas las features en Gherkin** listas para la puerta
humana y el `tdd_craftsman`.

Decisiones ya cerradas y aplicadas aquí:
- **Claro = Bosque & Limón · Oscuro = Noche & Oro.**
- **Outfit + DM Sans** (ya son dependencias del repo).
- **Logo = icono "Órbita"** del diseño (anillo + onda degradada + punto),
  adaptativo al tema. **Sustituye** al `Logo.tsx` azul/menta anterior.
- Medidas fieles: ancho **1180px**, radios **20/16/12**.

---

## 1 · Qué hay y dónde va (mismas rutas del repo)

Copia cada archivo a la **misma ruta** en `WebEmpresa`:

```
src/styles/_tokens.scss            ← REEMPLAZA (paleta nueva + set completo de tokens)
src/styles/_base.scss              ← REEMPLAZA (suavizado + titulares fieles)
src/components/Logo.tsx            ← REEMPLAZA (icono "Órbita", useId, tokens)
src/components/Logo.module.scss    ← REEMPLAZA
src/main.tsx                       ← REEMPLAZA (añade DM Sans 600/700)
docs/DESIGN_SYSTEM.md              ← NUEVO (guía: la fuente de verdad escrita)
features/marca.feature             ← NUEVO
features/nav.feature               ← NUEVO
features/theme_selector.feature    ← NUEVO
features/footer.feature            ← NUEVO
features/layout_accesibilidad.feature ← NUEVO
features/hero.feature              ← NUEVO
features/servicios.feature         ← NUEVO
features/sectores.feature          ← NUEVO
features/paquetes.feature          ← NUEVO
features/contacto_seccion.feature  ← NUEVO
features/contact_form.feature      ← NUEVO
```

Además, como **referencia visual de montaje** (no va al repo de producción):
`Cenit Home (referencia).dc.html` — la home completa con el sistema ya fijado.
Sirve para comparar píxel a píxel y para exportarla (HTML/PDF) si quieres.

---

## 2 · Notas de integración (para que compile en verde)

- **Fuentes:** `_tokens.scss` usa DM Sans 600/700 (etiquetas y botones). El
  `src/main.tsx` de este paquete ya importa esos pesos; requiere
  `@fontsource/dm-sans` (ya está en `package.json`).
- **Tokens:** todo se consume con `var(--color-…)` (regla de `conventions.md`).
  Los alias `--color-soft` / `--color-brand` / `--color-brand-mint` quedan como
  **deprecados** solo para no romper el scaffold; migra sus usos a los tokens
  nuevos y elimínalos.
- **RF-MARCA-001 (Confluence):** actualiza la ficha para que el logo oficial sea
  el "Órbita" del diseño (no el azul/menta) y la paleta sea Bosque&Limón /
  Noche&Oro. El `project-spec.md` ya recoge la corrección de paleta; falta el
  logo.
- **`_tokens.scss` estaba "pendiente aplicar"** (aún tenía Teal/Océano): este
  archivo es justo esa aplicación.

---

## 3 · Cómo meterlo en el flujo Harness/SDD

Dos categorías:

**A) Fundamentos (marca):** tokens + Logo. Tienen comportamiento testeable
(colores calculados, símbolo, wordmark), así que van como una feature nueva
`marca` con su `features/marca.feature`. Añádela a `feature_list.json`:

```json
{ "id": 12, "name": "marca", "title": "Marca: logotipo y tokens de tema (WEB-4)",
  "description": "Logo \"Órbita\" adaptativo + tokens Bosque&Limón/Noche&Oro en _tokens.scss.",
  "acceptance": ["Todos los escenarios de features/marca.feature pasan"],
  "sdd": true, "status": "spec_ready" }
```

**B) Features de UI:** ya te dejo el `.feature` de cada una
(`nav`, `theme_selector`, `footer`, `layout_accesibilidad`, `hero`, `servicios`,
`sectores`, `paquetes`, `contacto_seccion`, `contact_form`). Están destiladas en
el formato de `docs/gherkin.md` (keywords en inglés, contenido en español, tags
`@sN`, cada `Then` medible, un `When` por escenario). `theme_selector` sube el
toggle actual de 2 estados a **3 (Claro/Oscuro/Sistema)** con `cenit-theme` y
anti-FOUC.

**Orden recomendado:** `marca` → `theme_selector` → `nav`/`footer`/
`layout_accesibilidad` → `hero` → `servicios`/`sectores`/`paquetes` →
`contacto_seccion` → `contact_form`.

Cada `.feature` pasa por tu **puerta de aprobación humana** antes de implementar.
El `tdd_craftsman` traduce cada `@sN` a un test Vitest (`it('@sN …')`) y luego
implementa contra `docs/DESIGN_SYSTEM.md` + la referencia visual.

---

## 4 · Prompt para arrancar en Claude Code

Pega esto en el repo (Claude Code entra como `craftsman_lead`):

> Integra el design system de `docs/DESIGN_SYSTEM.md`. Ya están los fundamentos
> (`src/styles/_tokens.scss`, `src/styles/_base.scss`, `src/components/Logo.*`,
> `src/main.tsx`) y **todas** las features en `features/*.feature`. Añade la
> feature `marca` (#12) a `feature_list.json`. Luego, una a una y en el orden del
> HANDOFF: ábreme la puerta humana sobre el `.feature`, y tras aprobarlo lanza el
> `tdd_craftsman` para implementarla al 100% fiel a `DESIGN_SYSTEM.md` y a la
> referencia visual. No inventes precios en `paquetes`. Ejecuta `pnpm verify`
> tras cada feature y no marques `done` sin `judge` + mutación por encima del
> umbral.

---

## 5 · Verificación de fidelidad

- Abre `Cenit Home (referencia).dc.html` (claro y oscuro con el toggle de la
  cabecera) y compárala con lo implementado, sección a sección.
- Repasa el **checklist** final de `docs/DESIGN_SYSTEM.md §8`.
- `pnpm typecheck && pnpm lint && pnpm test && pnpm build` en verde, 0 warnings.
