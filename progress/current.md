# progress/current.md — sesión activa

> Estado vivo de la sesión. Vacíalo (deja esta plantilla) al cerrar y mueve el
> resumen a `progress/history.md`.

**Feature en curso:** theme_selector (#3)
**Escenarios:** features/theme_selector.feature (@s1–@s8)

## Bitácora

- **Integración del Design System** (rama `feat/design-system`). Objetivo:
  implementar TODO el sistema por TDD, feature a feature, en orden del handoff.
  Puerta humana sobre los `.feature` delegada.
- **Zip "Listo" integrado**: el paquete completo del Design System de Claude
  Design (tokens CSS, componentes `.jsx` de referencia, guidelines, UI kit,
  `.dc.html`, assets) colocado como material de referencia en `design/system/`
  y `design/Cenit Home (referencia).dc.html`. Verificado: `tokens/colors.css`
  coincide 1:1 con `docs/DESIGN_SYSTEM.md §3`; `cenit-design-system-export/`
  idéntico a lo ya integrado. `design/` excluido de eslint/prettier.
- **marca (#12): DONE.** 35 tests verdes, judge APROBADO (progress/judge_marca.md),
  mutación Logo.tsx 100% (progress/mutation_marca.md, tras matar el superviviente
  del stroke del path). `_tokens.scss`/`_base.scss`/`main.tsx`/`Logo.*` 1:1 con
  `design/fundamentos/`. Tema oscuro migrado a Noche & Oro.
- **Orden restante:** theme_selector → nav → footer → layout_accesibilidad →
  hero → servicios → sectores → paquetes → contacto_seccion → contact_form.
- Cierre: `pnpm verify` global verde (0 fallos/0 warnings) + commit & push.

## Estado por feature (nuevos contratos del handoff)
- footer: impl ya conforme, faltan tests @s1–@s4.
- layout_accesibilidad: skip-link/#contenido ya en Layout; faltan tests + verificar títulos exactos.
- nav: casi hecho; contrato nuevo pide nombres accesibles "Menú"/"Cerrar" y @s1–@s8.
- theme_selector: rework 2→3 estados (Claro/Oscuro/Sistema). EN CURSO.
- hero/servicios/sectores/paquetes/contacto_seccion/contact_form: home es placeholder, construir por TDD.
