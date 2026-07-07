# TDD — paquetes (#9)

Contrato: `features/paquetes.feature` (@s1–@s5). Diseño: `docs/DESIGN_SYSTEM.md §6`.
Decisión de producto: **sin precios** (ni "€" ni "/mes").

## Trazabilidad @s → test

| Escenario              | Test (`Paquetes.test.tsx`)                                                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| @s1 nombres en orden   | `@s1 muestra los tres paquetes en orden exacto`                                                                                              |
| @s2 insignia única     | `@s2 la insignia "Más elegido" aparece una vez y es de "Presencia Activa"`                                                                   |
| @s3 tagline + features | `@s3 cada tarjeta tiene su tagline y una lista de características no vacía`                                                                  |
| @s4 CTA a contacto     | `@s4 cada tarjeta lleva un enlace "Solicitar presupuesto" a "#contacto"`                                                                     |
| @s5 sin precios        | `@s5 no aparece ningún símbolo de precio (€ ni /mes)`                                                                                        |
| copy/mutación          | `muestra la cabecera (eyebrow, H2, intro)`, `muestra los taglines exactos`, `muestra las 15 características exactas`, `expone id="paquetes"` |

## Bitácora Rojo-Verde-Refactor

- **Ciclo 1 (@s1).** ROJO: `@s1 muestra los tres paquetes en orden exacto`
  (`getAllByRole('heading', {level:3})` → `['Presencia Digital','Presencia Activa','Negocio Conectado']`).
  Falla por import (Paquetes inexistente). VERDE: `Paquetes.tsx` data-driven
  (`PAQUETES[]` + `.module.scss`), sección `id="paquetes"`, H2, tarjetas con H3.
- **Ciclo 2 (@s2–@s5 + copy).** ROJO/VERDE incremental sobre el mismo componente:
  insignia única `Más elegido` en "Presencia Activa" (@s2), tagline + lista no
  vacía con check svg por tarjeta (@s3), 3 enlaces "Solicitar presupuesto"
  `href="#contacto"` (@s4), ausencia de "€" y "/mes" (@s5). Asserts de copy
  exacto para mutación: eyebrow "Paquetes", H2 "Elige tu paquete", intro, 3
  nombres, 3 taglines, 15 características, `id="paquetes"`.
- **REFACTOR (en verde).** Eliminado el doble condicional de estilo sobre
  `featured` (clases `cardFeatured`/`ctaPrimary`/`ctaOutline`) que dejaba mutantes
  de branch no testeables. Ahora hay UN solo condicional JS —la insignia, cubierto
  por @s2— y el borde/sombra de la destacada + el botón primario se derivan en CSS
  con `.card:has(.badge)`. `CheckIcon` reutilizado (fuera de mutate).

## Resultado

- Suite: **105 verdes** (97 baseline + 8 de paquetes).
- `pnpm typecheck` OK · `pnpm lint` 0 warnings · `pnpm build` (SSG) OK.
- Verificado en `dist/index.html`: `id="paquetes"`, 1× "Más elegido", 3×
  "Solicitar presupuesto", sin "€" ni "/mes".
- Composición: `home.tsx` renderiza `<Paquetes/>` tras `<Sectores/>`.
- Pendiente: `judge` + `mutation_tester`. NO marcado `done`.

## Nota de acabado — resalte <em> de color en el H2 (fidelidad al diseño)

Se resalta la palabra destacada del titular con `<em className={styles.highlight}>`

- regla `.highlight { font-style: normal; color: var(--color-primary); }` en el
  `.module.scss` (mismo patrón que Sectores). Espacios JSX LITERALES alrededor del
  `<em>` (nunca `{' '}`) para no crear StringLiterals mutables que sobrevivan.
  El texto accesible del H2 (accessible name) no cambia: los tests siguen usando
  `getByRole('heading', { level: 2 })` + `.textContent` exacto y quedan verdes.
  Mutación Stryker 100% (0 supervivientes) reconfirmada en el fichero.
