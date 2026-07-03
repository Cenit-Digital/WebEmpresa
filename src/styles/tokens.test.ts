import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// jsdom no resuelve custom properties de hojas de estilo con getComputedStyle,
// así que verificamos el contrato de tokens directamente sobre la fuente SCSS
// (mismo patrón que Header.test @s4).
const tokens = readFileSync(resolve(process.cwd(), 'src/styles/_tokens.scss'), 'utf8')

/** Devuelve el cuerpo del bloque `:root { … }` claro (sin el bloque dark). */
function lightRoot(): string {
  const start = tokens.indexOf(':root {')
  const dark = tokens.indexOf(":root[data-theme='dark']")
  return tokens.slice(start, dark === -1 ? undefined : dark)
}

/** Devuelve el cuerpo del bloque `:root[data-theme='dark'] { … }`. */
function darkRoot(): string {
  return tokens.slice(tokens.indexOf(":root[data-theme='dark']"))
}

describe('tokens de tema (marca)', () => {
  it('@s7 el tema claro (Bosque & Limón) define --color-primary: #1e7a4f', () => {
    expect(lightRoot()).toMatch(/--color-primary:\s*#1e7a4f/i)
  })

  it('@s8 el tema oscuro (Noche & Oro) define --color-primary: #c9a84c', () => {
    expect(darkRoot()).toMatch(/--color-primary:\s*#c9a84c/i)
  })
})
