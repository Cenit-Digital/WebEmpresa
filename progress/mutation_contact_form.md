# Prueba de mutación — feature `contact_form` (#11)

- **Fecha:** 2026-07-06
- **Comando:** `pnpm exec stryker run --mutate "src/lib/contact.ts,src/components/Contacto.tsx"`
- **Umbral:** `break: 100` (100% sobre los ficheros del `mutate`)
- **Informe HTML:** `reports/mutation/index.html`

## Veredicto: FAIL

Puntuación global **97.50%** (< 100). Build de mutación en rojo (exit code 1).

## Score por fichero

| Fichero                       | Score   | killed | timeout | survived | no-cov |
| ----------------------------- | ------- | ------ | ------- | -------- | ------ |
| `src/components/Contacto.tsx` | 100.00% | 58     | 14      | 0        | 0      |
| `src/lib/contact.ts`          | 93.75%  | 44     | 1       | 3        | 0      |
| **Total**                     | 97.50%  | 102    | 15      | 3        | 0      |

`Contacto.tsx` mata todos sus mutantes. Los 3 supervivientes están en
`src/lib/contact.ts`.

## Supervivientes (3) — todos en `src/lib/contact.ts`

### 1. `contact.ts:48:21` — StringLiteral

- **Mutación:** `throw new Error('No se pudo enviar el mensaje.')` → `throw new Error("")`
- **Por qué sobrevive:** el test `sendContactEmail @s7 lanza un error cuando la
respuesta no es ok` comprueba que se lanza, pero no asevera el **mensaje** del
  error, así que vaciarlo no rompe ningún test.
- **Test que falta:** en `src/lib/contact.test.ts`, en el caso @s7, aseverar el
  mensaje concreto (p. ej. `await expect(...).rejects.toThrow('No se pudo enviar el mensaje.')`).

### 2. `contact.ts:17:18` — Regex (ancla final)

- **Mutación:** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` → `/^[^\s@]+@[^\s@]+\.[^\s@]+/`
  (se elimina el ancla `$`)
- **Por qué sobrevive:** ninguna entrada de test tiene basura **después** de un
  correo por lo demás válido, por lo que quitar el ancla final no cambia el
  resultado observado.
- **Test que falta:** validar un correo con sufijo inválido tras un dominio
  correcto, p. ej. `validateContact({ nombre: 'X', email: 'ana@web.com bruh' })`
  (o `'ana@web.com\n...'`) debe devolver error en `email`.

### 3. `contact.ts:17:18` — Regex (ancla inicial)

- **Mutación:** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` → `/[^\s@]+@[^\s@]+\.[^\s@]+$/`
  (se elimina el ancla `^`)
- **Por qué sobrevive:** ningún test prueba un correo con basura **antes** de una
  parte por lo demás válida, así que quitar el ancla inicial no cambia el
  resultado.
- **Test que falta:** validar un correo con prefijo inválido, p. ej.
  `validateContact({ nombre: 'X', email: 'hola mundo ana@web.com' })` debe
  devolver error en `email`.

## Nota

Ninguno de los 3 supervivientes es un mutante **equivalente**: cada uno
representa un cambio de comportamiento observable (mensaje de error vacío, o
regex que acepta correos que debería rechazar). No procede exclusión.

## Siguiente paso

Trabajo del `tdd_craftsman`: escribir los tests rojos que maten estos 3
mutantes en `src/lib/contact.test.ts` y volver a pasar por el `judge`. El
`mutation_tester` no edita `src/` ni tests.
