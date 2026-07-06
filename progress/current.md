# progress/current.md — sesión activa

> Estado vivo de la sesión. Vacíalo (deja esta plantilla) al cerrar y mueve el
> resumen a `progress/history.md`.

**Feature en curso:** — (Design System COMPLETO: 12/12 features `done`)
**Escenarios:** —

## Bitácora — Integración del Design System (rama `feat/design-system`)

Objetivo cumplido: implementar TODO el sistema por TDD, feature a feature, en el
orden del handoff, fiel 1:1 al diseño (`design/Cenit Home (referencia) - standalone.html`

- `docs/DESIGN_SYSTEM.md`). Puerta humana sobre los `.feature` delegada.

### Estado final: 12/12 features `done`

Cada feature cerró con las tres puertas (TDD Rojo→Verde→Refactor · judge APROBADO
· mutación Stryker 100%, break=100). Bitácoras en `progress/tdd_*`, veredictos en
`progress/judge_*`, mutación en `progress/mutation_*`.

1. **marca** (#12) — logo Órbita + tokens Bosque&Limón/Noche&Oro.
2. **theme_selector** (#3) — selector 3 estados (Claro/Oscuro/Sistema), `cenit-theme`,
   reacción en vivo a `prefers-color-scheme`, anti-FOUC. Lógica en `src/lib/theme.ts`.
3. **nav** (#2) — cabecera sticky, enlaces + CTA "Hablamos", menú móvil Radix
   ("Menú"/"Cerrar", cierre por enlace/fondo).
4. **footer** (#4) — copyright con año, Aviso legal, mailto.
5. **layout_accesibilidad** (#5) — skip-link con foco a `#contenido`, títulos por
   ruta (`buildHomeTitle`), verificados en `dist`.
6. **hero** (#6) — eyebrow, H1, subtítulo, 2 CTA, 4 stats.
7. **servicios** (#7) — 6 tarjetas (copy 1:1), zigzag, mockups decorativos.
8. **sectores** (#8) — 4 tarjetas (copy 1:1) + nota de selección.
9. **paquetes** (#9) — 3 paquetes (copy 1:1), insignia "Más elegido", SIN precios.
10. **contacto_seccion** (#10) — sección `#contacto`, formulario de 5 campos,
    honeypot oculto.
11. **contact_form** (#11) — validación + estados éxito/error + honeypot; envío por
    `src/lib/contact.ts` → `POST /api/contact` (Vercel Function con Resend,
    `api/contact.ts`). Envío mockeado en test.

### Estado del árbol

- `pnpm verify` (typecheck · lint 0 warnings · **140 tests**) VERDE. `pnpm build`
  (SSG) VERDE con las 5 secciones prerenderizadas y títulos exactos. `format:check`
  VERDE. Mutación por feature 100% en los 11 ficheros de `stryker.config.json`.
- Home compone: `<Hero/> <Servicios/> <Sectores/> <Paquetes/> <Contacto/>`.
- Infra de envío real: `api/contact.ts` (Resend, docs oficiales) + dep `resend`;
  requiere `RESEND_API_KEY` (+ dominio verificado) en Vercel — ver README.
- Limpieza: `ContactDialog` (scaffold muerto) eliminado; README actualizado
  (paleta nueva + Resend). `design/system/` (zip "Listo") integrado como referencia.

### Pendiente (no técnico)

- Reconciliar la divergencia de la rama con `origin/feat/design-system` antes del
  push definitivo (decisión de Pablo; hubo commits en paralelo entre sesiones).
- Opcional (visual, no bloqueante): resaltar con `<em>` de color la palabra
  destacada de las H2 de `hero`/`paquetes`/`contacto` para igualar el matiz del
  diseño (mismo texto; `servicios`/`sectores` ya lo hacen).
