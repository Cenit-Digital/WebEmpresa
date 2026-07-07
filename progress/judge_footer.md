# Veredicto Judge — footer (#4)

**Rama:** `feat/design-system`
**Contrato:** `features/footer.feature` (@s1–@s4)
**Diseño:** `docs/DESIGN_SYSTEM.md` §6 (líneas 190–192)
**Fecha:** 2026-07-06

## Resultado: APPROVED

Hallazgos bloqueantes: **0**.

## Cobertura de escenarios (@s → test)

| Escenario | Test                 | Verificación concreta                                                                                                                               |
| --------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| @s1       | `Footer.test.tsx:15` | `getByText('© ${year} Cénit Digital. Todos los derechos reservados.')` con `year = new Date().getFullYear()` calculado en el test (no hardcodeado). |
| @s2       | `Footer.test.tsx:24` | `getByRole('link', { name: 'Aviso legal' })` con `href='/aviso-legal'`, dentro del `nav` accesible "Pie".                                           |
| @s3       | `Footer.test.tsx:33` | `getByRole('link', { name: 'hola@cenitdigital.es' })` con `href='mailto:hola@cenitdigital.es'`.                                                     |
| @s4       | `Footer.test.tsx:40` | `queryByRole('link', {name:/privacidad/i})` y `/cookies/i` → `not.toBeInTheDocument()`.                                                             |

Los 4 escenarios están cubiertos por al menos un test concreto.

## Verificaciones específicas del encargo

1. **@s1 año dinámico**: producción `Footer.tsx:6` usa `new Date().getFullYear()`;
   test `Footer.test.tsx:16` recalcula el año con la misma llamada — no fijo. El
   texto se afirma completo (incluye `"© "` y el sufijo). `SITE.name === 'Cénit
Digital'` confirmado en `src/lib/site.ts:2`, consumido en `Footer.tsx:11`.
2. **@s2**: `Footer.tsx:14` `<Link to="/aviso-legal">Aviso legal</Link>` → href
   `/aviso-legal`. La página destino existe (build renderiza `dist/aviso-legal/index.html`).
3. **@s3**: `Footer.tsx:15` `<a href="mailto:hola@cenitdigital.es">` correcto.
4. **@s4**: el pie no renderiza enlaces Privacidad/Cookies; test negativo real.
5. **Tests reales, no tautológicos**: cada `it` renderiza `<Footer/>` en
   `MemoryRouter` y afirma DOM observable (texto, `href`, pertenencia al `nav`,
   ausencia de enlaces). @s4 es aserción negativa legítima, no tautológica.

## Calidad (lente de artesano)

- Componente corto (20 líneas), un solo propósito; nombres reveladores.
- Sin números mágicos ni duplicación; el año no es literal.
- `Footer.module.scss`: colores solo vía tokens
  (`var(--color-border)`, `var(--color-text)` + `color-mix`); `var(--maxw)` para
  el ancho. Sin hex crudos. Cumple `docs/architecture.md` (Design tokens) y RF-CODE-001.
- Respeta la regla de capas: `components` consume `lib/` (`SITE`), no al revés.

## Disciplina TDD

`progress/tdd_footer.md` documenta Rojo→Verde→Refactor por escenario y el mapa
`@s → test`. `Footer.tsx` preexistía del scaffold del layout; el trabajo de esta
sesión fue **cubrirlo** con tests co-locados (justificado y trazado en la
bitácora). No hay producción sin test que la exija dentro del alcance del contrato.

## Verificación ejecutada

- `./init.sh`: verde — typecheck OK, lint OK, **68 tests passed**.
- `pnpm lint`: sin errores ni warnings.
- `pnpm build` (SSG): verde — prerenderiza `index.html` y `aviso-legal/index.html`.

## Checkpoints

- C1 arnés completo — [x]
- C2 estado coherente — [x] (ver observación 1)
- C3 arquitectura respetada — [x]
- C4 verificación real (68 tests, typecheck+lint verdes sin warnings) — [x]
- C6 contrato Gherkin: cada `@s` tagueado y cubierto; `Then` medibles — [x]
- C7 mutación — pendiente del `mutation_tester` (fuera de esta puerta)

## Observaciones NO bloqueantes (para el lead)

1. **Estado en `feature_list.json`**: footer figura como `spec_ready`
   (`feature_list.json:66`), pero `progress/current.md` lo declara "en curso". El
   lead/`tdd_craftsman` debería moverlo a `in_progress`. No afecta código ni cobertura.
2. **Fidelidad de diseño vs. contrato**: `DESIGN_SYSTEM.md` §6 (190–191) describe
   el footer con logo, `bg:band` y `padding:44px 0`; la implementación no incluye
   logo ni fondo de banda. Ningún escenario firmado (@s1–@s4) lo exige → **no
   bloqueante**: el contrato gobierna. Paridad visual requeriría nuevo escenario.

**Puerta de diseño y cobertura: APROBADA.** Procede el `mutation_tester` (C7).
