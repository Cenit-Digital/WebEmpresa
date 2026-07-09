import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Feature #14 · logo_draw_animation — contenido del parcial global de la
// animación. jsdom no interpola @keyframes ni aplica CSS externo, así que el
// contrato testeable del CSS es su CONTENIDO: se lee el .scss y se aseveran las
// reglas (mismo idioma que @s3 de Header.test.tsx / @s9 de fidelidad).
function read(relPath: string): string {
  return readFileSync(resolve(process.cwd(), relPath), 'utf8')
}

const DRAW = 'src/styles/_logo-draw.scss'

// Cada @keyframes vive en una única línea en el parcial: localizarla por nombre
// y aseverar subcadenas es robusto (los % anidan sus propias llaves).
function keyframe(name: string): string {
  const scss = read(DRAW)
  const line = scss.split('\n').find((l) => l.trimStart().startsWith(`@keyframes ${name} `))
  if (!line) throw new Error(`@keyframes ${name} no encontrado en ${DRAW}`)
  return line
}

describe('logo-draw.scss — #14 (contenido del parcial global)', () => {
  it('@s8 los ocho @keyframes viven en el parcial y está enlazado desde main.scss', () => {
    const scss = read(DRAW)
    for (const name of [
      'logoCycleOpacity',
      'heroCycleOpacity',
      'ringLoop',
      'waveLoop',
      'dotOutlineLoop',
      'dotFillLoop',
      'cenitLoop',
      'digitalLoop',
    ]) {
      expect(scss).toMatch(new RegExp(`@keyframes\\s+${name}\\b`))
    }

    expect(read('src/styles/main.scss')).toMatch(/@use\s+['"]logo-draw['"]/)
  })

  it('@s9 ringLoop y waveLoop usan los porcentajes exactos del handoff', () => {
    const ring = keyframe('ringLoop')
    expect(ring).toMatch(/0%\s*\{\s*stroke-dashoffset:\s*300\s*\}/)
    expect(ring).toMatch(/41%\s*\{\s*stroke-dashoffset:\s*0\s*\}/)
    expect(ring).toMatch(/96%\s*\{\s*stroke-dashoffset:\s*0\s*\}/)
    expect(ring).toMatch(/97%\s*\{\s*stroke-dashoffset:\s*300\s*\}/)
    expect(ring).toMatch(/100%\s*\{\s*stroke-dashoffset:\s*300\s*\}/)

    const wave = keyframe('waveLoop')
    expect(wave).toMatch(/0%\s*\{\s*stroke-dashoffset:\s*300\s*\}/)
    expect(wave).toMatch(/22%\s*\{\s*stroke-dashoffset:\s*0\s*\}/)
    expect(wave).toMatch(/96%\s*\{\s*stroke-dashoffset:\s*0\s*\}/)
    expect(wave).toMatch(/97%\s*\{\s*stroke-dashoffset:\s*300\s*\}/)
  })

  it('@s10 dotOutlineLoop traza el contorno y dotFillLoop hace el "pop" del relleno', () => {
    const outline = keyframe('dotOutlineLoop')
    // Contorno: arranca oculto (dashoffset 30) y se traza a 0 hacia el 27%.
    expect(outline).toMatch(/0%,\s*22%\s*\{[^}]*stroke-dashoffset:\s*30\b/)
    expect(outline).toMatch(/27%\s*\{[^}]*stroke-dashoffset:\s*0\b/)
    // Y desvanece su stroke-opacity a 0 en el 30% (deja paso al relleno).
    expect(outline).toMatch(/30%\s*\{[^}]*stroke-opacity:\s*0\b/)

    const fill = keyframe('dotFillLoop')
    // Relleno: de fill-opacity 0 + scale(0.3) a fill-opacity 1 + scale(1) en el 30%.
    expect(fill).toMatch(/0%,\s*27%\s*\{[^}]*fill-opacity:\s*0\b[^}]*scale\(0\.3\)/)
    expect(fill).toMatch(/30%\s*\{[^}]*fill-opacity:\s*1\b[^}]*scale\(1\)/)
  })

  it('@s11 el wordmark se revela carácter a carácter con clip-path + steps', () => {
    const cenit = keyframe('cenitLoop')
    // "cénit" abre el clip entre 30% y 35%.
    expect(cenit).toMatch(/0%,\s*30%\s*\{[^}]*clip-path:\s*inset\(0 100% 0 0\)/)
    expect(cenit).toMatch(/35%\s*\{[^}]*clip-path:\s*inset\(0 0% 0 0\)/)

    const digital = keyframe('digitalLoop')
    // "digital" abre el clip entre 36% y 41%.
    expect(digital).toMatch(/0%,\s*36%\s*\{[^}]*clip-path:\s*inset\(0 100% 0 0\)/)
    expect(digital).toMatch(/41%\s*\{[^}]*clip-path:\s*inset\(0 0% 0 0\)/)

    // Revelación por saltos: steps(5,end) para "cénit" (5) y steps(7,end) para "digital" (7).
    const scss = read(DRAW)
    expect(scss).toMatch(/\[data-orbit-cenit\]\s*\{[^}]*animation:\s*cenitLoop[^}]*steps\(5,\s*end\)/)
    expect(scss).toMatch(
      /\[data-orbit-digital\]\s*\{[^}]*animation:\s*digitalLoop[^}]*steps\(7,\s*end\)/,
    )
  })

  it('@s12 los keyframes de opacidad arrancan DIBUJADO (no en 0) y se ocultan solo en el 96%', () => {
    // logoCycleOpacity: base visible (0% opacity 1), parpadeo a 0 en 96%, vuelve a 1 al 100%.
    const logo = keyframe('logoCycleOpacity')
    expect(logo).toMatch(/0%\s*\{\s*opacity:\s*1\s*\}/)
    expect(logo).toMatch(/96%\s*\{\s*opacity:\s*0\s*\}/)
    expect(logo).toMatch(/100%\s*\{\s*opacity:\s*1\s*\}/)
    // Nunca arranca oculto en el 0%.
    expect(logo).not.toMatch(/0%\s*\{\s*opacity:\s*0\s*\}/)

    // heroCycleOpacity: reposo a 0.42 (coherente con .arc), parpadeo a 0 en 96%.
    const hero = keyframe('heroCycleOpacity')
    expect(hero).toMatch(/0%\s*\{\s*opacity:\s*0\.42\s*\}/)
    expect(hero).toMatch(/96%\s*\{\s*opacity:\s*0\s*\}/)
  })

  it('@s13 los shorthands usan 18.3s + infinite y los easings exactos del handoff', () => {
    const scss = read(DRAW)
    expect(scss).toMatch(
      /\[data-orbit-ring\]\s*\{[^}]*animation:\s*ringLoop 18\.3s cubic-bezier\(0\.25, 0\.46, 0\.45, 0\.94\) infinite/,
    )
    expect(scss).toMatch(
      /\[data-orbit-wave\]\s*\{[^}]*animation:\s*waveLoop 18\.3s cubic-bezier\(0\.4, 0, 0\.2, 1\) infinite/,
    )
    expect(scss).toMatch(
      /\[data-logo-anim\]\s*\{[^}]*animation:\s*logoCycleOpacity 18\.3s ease-in-out infinite/,
    )
  })

  it('@s14 R1: el estado BASE (fuera de @keyframes) es DIBUJADO, no oculto', () => {
    const scss = read(DRAW)
    // Anillo y onda: trazados completos en base (dashoffset 0, no 300).
    expect(scss).toMatch(
      /\[data-orbit-ring\],\s*\[data-orbit-wave\]\s*\{[\s\S]*?stroke-dashoffset:\s*0\b/,
    )
    // Contorno del punto: invisible en base (deja ver el relleno).
    expect(scss).toMatch(/\[data-orbit-dot-outline\]\s*\{[\s\S]*?stroke-opacity:\s*0\b/)
    // Relleno del punto: visible en base.
    expect(scss).toMatch(/\[data-orbit-dot-fill\]\s*\{[\s\S]*?fill-opacity:\s*1\b/)

    // El estado OCULTO (dashoffset 300) vive SOLO dentro de los @keyframes:
    // ninguna regla base debe hornearlo (si no, SSG/reduced-motion romperían R1).
    const baseRules = scss
      .split('\n')
      .filter((l) => !l.trimStart().startsWith('@keyframes'))
      .join('\n')
    expect(baseRules).not.toMatch(/stroke-dashoffset:\s*300/)
  })

  it('@s15 el relleno del punto escala desde su propio centro (transform-box)', () => {
    const scss = read(DRAW)
    expect(scss).toMatch(/\[data-orbit-dot-fill\]\s*\{[\s\S]*?transform-box:\s*fill-box/)
    expect(scss).toMatch(/\[data-orbit-dot-fill\]\s*\{[\s\S]*?transform-origin:\s*center/)
  })

  it('@s16 D1: prefers-reduced-motion apaga toda la animación', () => {
    const scss = read(DRAW)
    expect(scss).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/)
    expect(scss).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?animation:\s*none/)
  })

  it('@s17 no crea tokens ni colores propios: usa los var(--color-…) existentes', () => {
    const scss = read(DRAW)
    // El parcial no declara custom properties nuevas ni colores literales.
    expect(scss).not.toMatch(/--color-[\w-]+\s*:/)
    expect(scss).not.toMatch(/#[0-9a-fA-F]{3,6}/)
    // Los colores del SVG salen de los tokens de tema (adaptación claro/oscuro).
    expect(read('src/components/Logo.tsx')).toMatch(/var\(--color-/)
    expect(read('src/components/Hero.tsx')).toMatch(/var\(--color-/)
  })

  it('@s18 D2: en móvil (≤820px) el arco del hero reposa a 0.1', () => {
    const scss = read(DRAW)
    // El shorthand se recicla cambiando solo el keyframe en el breakpoint móvil.
    expect(scss).toMatch(
      /@media\s*\(max-width:\s*820px\)[\s\S]*?animation-name:\s*heroCycleOpacityMobile/,
    )
    const mobile = keyframe('heroCycleOpacityMobile')
    expect(mobile).toMatch(/0%\s*\{\s*opacity:\s*0\.1\s*\}/)
    // Y el estado base del .arc también reposa a 0.1 en el mismo breakpoint.
    expect(read('src/components/Hero.module.scss')).toMatch(
      /@media\s*\(max-width:\s*820px\)[\s\S]*?opacity:\s*0\.1/,
    )
  })
})
