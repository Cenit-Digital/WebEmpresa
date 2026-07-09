import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Guard anti-desbordamiento horizontal (@s10). jsdom no aplica CSS externo, así
// que el contrato testeable del reset es su CONTENIDO: se lee el .scss y se
// aseveran las reglas (mismo idioma que @s3 de Header.test.tsx / logo-draw).
function read(relPath: string): string {
  return readFileSync(resolve(process.cwd(), relPath), 'utf8')
}

// Cuerpo del primer bloque `selector { … }` (los de _reset no anidan llaves).
// Escapa `.`/`#` del selector para tratarlos como literales en la RegExp.
function ruleBody(scss: string, selector: string): string {
  const escaped = selector.replace(/[.#]/g, '\\$&')
  const match = scss.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))
  if (!match) throw new Error(`bloque ${selector} { … } no encontrado en _reset.scss`)
  return match[1]
}

const RESET = 'src/styles/_reset.scss'

describe('_reset.scss — guard anti-desbordamiento horizontal (@s10)', () => {
  it('@s10 el bloque #root usa overflow-x: clip (recorta la X sin crear scroll container → conserva sticky)', () => {
    // `clip` recorta el desbordamiento sin volverse contenedor de scroll, con lo
    // que la cabecera `position: sticky` (@s3) sigue anclada. `hidden` sí lo
    // rompería. Va en `#root` (punto de montaje de la app), no en `html`/`body`:
    // ahí el overflow se propaga al viewport y `clip` no frena el scroll
    // (verificado en Chrome). `#root` es un div normal que sí recorta su contenido.
    const root = ruleBody(read(RESET), '#root')
    expect(root).toMatch(/overflow-x:\s*clip/)
  })

  it('@s10 NO reintroduce overflow-x: hidden en html, body ni #root (rompería position: sticky)', () => {
    const scss = read(RESET)
    expect(ruleBody(scss, 'html')).not.toMatch(/overflow-x:\s*hidden/)
    expect(ruleBody(scss, 'body')).not.toMatch(/overflow-x:\s*hidden/)
    expect(ruleBody(scss, '#root')).not.toMatch(/overflow-x:\s*hidden/)
  })
})
