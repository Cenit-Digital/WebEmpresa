# TDD — marca (#12)

> Logo "Órbita" adaptativo + tokens de tema Bosque&Limón (claro) / Noche&Oro
> (oscuro). Contrato: `features/marca.feature` (@s1–@s8). Rama `feat/design-system`.
> Implementación objetivo (fiel al diseño): `design/fundamentos/`.

## Escenarios

- @s1 icono renderiza el símbolo "Órbita" (circle anillo + path onda + circle punto, aria-hidden)
- @s2 muestra el wordmark por defecto ("cénit" / "digital")
- @s3 puede ocultarse el wordmark (withWordmark=false)
- @s4 el tamaño del icono es configurable (size=38 → width/height "38")
- @s5 el degradado tiene id único por instancia (dos `<linearGradient>` distintos)
- @s6 los colores del logo salen de tokens (ring/zenith/primary/secondary)
- @s7 tema claro → `--color-primary: #1e7a4f` en `:root`
- @s8 tema oscuro → `--color-primary: #c9a84c` en `:root[data-theme='dark']`

## Bitácora de ciclos (Rojo → Verde → Refactor)

- **@s1** — ROJO: `Logo.test @s1` (svg con 2 `<circle>` + `<path>` + aria-hidden);
  falla contra el Logo azul/menta (sin `<path>`). VERDE: reescrito
  `Logo.tsx` como icono Órbita mínimo (anillo, onda, punto; `currentColor`
  provisional). Colateral: `Header.test @s1` deja de comprobar el texto
  "CÉNIT DIGITAL" (el wordmark cambió) → se actualiza esa única aserción al
  nombre accesible del enlace (`toHaveAccessibleName(/cénit digital/i)`).
- **@s2** — ROJO: `Logo.test @s2` (por defecto muestra "cénit" y "digital");
  falla (sin wordmark). VERDE: añadido `<span>` wordmark (`.name`/`.sub`) y
  portado `Logo.module.scss` con esas clases.
- **@s3** — ROJO: `Logo.test @s3` (`withWordmark={false}` oculta el wordmark);
  falla (siempre visible). VERDE: prop `withWordmark` (default true) que
  condiciona el render del wordmark.
- **@s4** — ROJO: `Logo.test @s4` (`size={38}` → width/height "38"); falla
  (hardcode 40). VERDE: prop `size` (default 40) en `width`/`height`.
- **@s5** — ROJO: `Logo.test @s5` (dos logos → dos `<linearGradient>` con id
  distinto); falla (no había gradiente). VERDE: `useId()` + `<defs>` con
  `<linearGradient id={gradId}>` y la onda con `stroke="url(#gradId)"`.
- **@s6** — ROJO: `Logo.test @s6` (anillo `stroke=var(--color-ring)`, punto
  `fill=var(--color-zenith)`, paradas `var(--color-primary/secondary)`); falla
  (`currentColor`). VERDE: colores desde tokens. REFACTOR: comentario de
  cabecera alineado al target → `Logo.tsx` idéntico a
  `design/fundamentos/components/Logo.tsx`.
- **@s6 (kill-mutant Logo.tsx:59)** — Reapertura por Stryker (break=100%):
  superviviente en `Logo.tsx:59`, el mutante convierte `stroke={`url(#${gradId})`}`
  del `<path>` de la onda en `stroke=""` y ningún test lo detectaba (@s5 solo
  compara ids; @s6 no asertaba el stroke del path). ROJO real: nuevo caso
  `Logo.test @s6` (`la onda (path) pinta su trazo con el degradado de su
  instancia`) que asserta `wave` con `stroke=url(#<id del linearGradient>)`;
  verificado que FALLA con el mutante (`stroke=""`) y pasa con el código actual.
  VERDE: **sin tocar `Logo.tsx`** (sigue idéntico 1:1 al target). Mata al
  mutante de `Logo.tsx:59`.
- **@s7** — ROJO: `tokens.test @s7` (`:root` claro define `--color-primary:
  #1e7a4f`); falla (paleta Teal vieja #0e8a82). VERDE: portado el bloque
  `:root` claro (Bosque & Limón) con alias deprecados; bloque dark antiguo
  conservado para mantener @s8 en rojo.
- **@s8** — ROJO: `tokens.test @s8` (`:root[data-theme='dark']` define
  `--color-primary: #c9a84c`); falla (dark viejo #1e6fa8). VERDE: portado el
  bloque dark (Noche & Oro) → `_tokens.scss` idéntico al target.

### Fundamentos del handoff sin @s dedicado (portados en verde)

- `src/styles/_base.scss` y `src/main.tsx` (DM Sans 600/700) portados 1:1 desde
  `design/fundamentos/` como parte del deliverable de marca. No hay escenario
  que los cubra (son estilos base + carga de fuentes, sin lógica); se dejan
  idénticos al diseño aprobado.
- `stryker.config.json`: añadido `src/components/Logo.tsx` a `mutate`.

## Trazabilidad @s → test

| Escenario | Test |
| --- | --- |
| @s1 icono Órbita (anillo+onda+punto, aria-hidden) | `src/components/Logo.test.tsx` › `@s1` |
| @s2 wordmark por defecto ("cénit"/"digital") | `src/components/Logo.test.tsx` › `@s2` |
| @s3 oculta wordmark (`withWordmark=false`) | `src/components/Logo.test.tsx` › `@s3` |
| @s4 tamaño configurable (`size=38`) | `src/components/Logo.test.tsx` › `@s4` |
| @s5 id de degradado único por instancia | `src/components/Logo.test.tsx` › `@s5` |
| @s6 colores del logo desde tokens | `src/components/Logo.test.tsx` › `@s6` (colores) |
| @s6 onda (path) consume el degradado — mata mutante `Logo.tsx:59` | `src/components/Logo.test.tsx` › `@s6` (la onda pinta su trazo con el degradado) |
| @s7 tema claro `--color-primary: #1e7a4f` | `src/styles/tokens.test.ts` › `@s7` |
| @s8 tema oscuro `--color-primary: #c9a84c` | `src/styles/tokens.test.ts` › `@s8` |

## Estado

- `pnpm verify` VERDE (typecheck + lint + test), 35 tests, 0 warnings, exit 0.
- Ficheros de src idénticos a `design/fundamentos/` (Logo.tsx, Logo.module.scss,
  _tokens.scss, _base.scss, main.tsx). Sin discrepancias con el `.feature`.
- Reapertura por mutación: cubierto el superviviente de `Logo.tsx:59` (stroke del
  path de la onda) con un caso @s6 adicional. `Logo.tsx` NO se tocó (diff con el
  target sigue vacío).
- NO marcado `done`: pendiente de re-verificación de `mutation_tester` (Stryker
  break=100% sobre `Logo.tsx`).
