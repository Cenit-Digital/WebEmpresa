Feature: Animación de dibujado del logo Órbita (cabecera + hero)
  Como visitante quiero ver el logo Órbita "dibujarse" solo al cargar la página,
  para reforzar la identidad de Cénit Digital sin coste de JS ni estado.

  # Fuente de verdad: design/logo-draw-animation/README.md (handoff) +
  # CenitLanding.dc.html (keyframes verbatim); síntesis en project-spec.md #14.
  #
  # CLAVE (ver "Contrato observable" del spec): la interpolación de la animación
  # NO es verificable en jsdom (no hay layout ni motor de animación). El contrato
  # testeable es DOS cosas: (1) la ESTRUCTURA DOM + ATRIBUTOS de los componentes,
  # y (2) el CONTENIDO del SCSS del parcial global — idioma "leer el .scss y
  # aseverar la regla", como el @s3 de Header.test.tsx y el @s9 de
  # fidelidad_referencia.feature. NINGÚN escenario afirma la interpolación de
  # keyframes en el tiempo, solo su DEFINICIÓN literal en el fichero.
  #
  # Decisiones RECOMENDADAS asumidas del spec: D1 (prefers-reduced-motion: SÍ),
  # D2 (reposo .42; se PRESERVA la atenuación móvil .1 en ≤820px), D3 (parcial
  # global src/styles/_logo-draw.scss + data-attributes), D4 (prop `animated` en
  # Logo). Data-attributes de destino: data-logo-anim / data-hero-arc
  # (contenedores), data-orbit-ring, data-orbit-wave, data-orbit-dot-outline,
  # data-orbit-dot-fill, data-orbit-cenit, data-orbit-digital.

  # ─────────────────────────── Estructura DOM + atributos ───────────────────

  @s1
  Scenario: La cabecera monta el Logo en modo animado
    Given la cabecera renderizada
    When localizo el lockup del logo dentro del enlace de marca
    Then el contenedor del logo tiene el atributo "data-logo-anim"

  @s2
  Scenario: El Logo animado marca el anillo y la onda con sus hooks de dibujo
    Given el componente Logo con la prop animated
    When inspecciono su SVG
    Then el <circle> del anillo tiene el atributo "data-orbit-ring" y stroke-dasharray "300"
    And el <path> de la onda tiene el atributo "data-orbit-wave" y stroke-dasharray "300"

  @s3
  Scenario: El punto del Logo animado son DOS círculos superpuestos (contorno A + relleno B)
    Given el componente Logo con la prop animated
    When cuento los <circle> situados en el punto cénit (cx="40" cy="20")
    Then existen exactamente dos <circle> en esa posición
    And el círculo de contorno A tiene "data-orbit-dot-outline", fill "none", stroke "var(--color-zenith)" y stroke-dasharray "30"
    And el círculo de relleno B tiene "data-orbit-dot-fill" y fill "var(--color-zenith)"

  @s4
  Scenario: El wordmark del Logo animado lleva los hooks de máquina de escribir
    Given el componente Logo con la prop animated y el wordmark visible
    When localizo las palabras "cénit" y "digital"
    Then el elemento de "cénit" tiene el atributo "data-orbit-cenit"
    And el elemento de "digital" tiene el atributo "data-orbit-digital"

  @s5
  Scenario: El Logo del pie permanece estático (no-regresión)
    Given el pie de página renderizado
    When inspecciono el Logo del pie
    Then su contenedor NO tiene el atributo "data-logo-anim"
    And su SVG no tiene ningún atributo "data-orbit-*"
    And el punto cénit es un único <circle> relleno (fill "var(--color-zenith)"), sin círculo de contorno

  @s6
  Scenario: El arco del hero está siempre animado y conserva su accesibilidad
    Given el hero renderizado
    When localizo el elemento "data-hero-arc"
    Then sigue teniendo "aria-hidden" igual a "true" y no es enfocable
    And su SVG contiene el anillo con "data-orbit-ring", la onda con "data-orbit-wave" y los dos círculos del punto con "data-orbit-dot-outline" y "data-orbit-dot-fill"

  @s7
  Scenario: El arco del hero usa un único color --color-accent, sin gradiente
    Given el SVG del arco "data-hero-arc"
    When leo los atributos de color de sus trazos
    Then el anillo, la onda, el contorno del punto y el relleno del punto usan todos "var(--color-accent)"
    And no existe ningún <linearGradient> dentro del arco

  # ─────────────────────── Contenido del SCSS (parcial global) ──────────────

  @s8
  Scenario: Los ocho @keyframes viven en el parcial global y están enlazados
    Given el fichero "src/styles/_logo-draw.scss"
    When leo sus definiciones de "@keyframes"
    Then define exactamente estos ocho por nombre: logoCycleOpacity, heroCycleOpacity, ringLoop, waveLoop, dotOutlineLoop, dotFillLoop, cenitLoop, digitalLoop
    And el parcial está enlazado desde "src/styles/main.scss" mediante "@use"

  @s9
  Scenario: Los keyframes del anillo y la onda usan los porcentajes exactos del handoff
    Given el fichero "src/styles/_logo-draw.scss"
    When leo "ringLoop" y "waveLoop"
    Then "ringLoop" pasa de stroke-dashoffset 300 en 0% a 0 en 41%, se mantiene en 0 hasta 96% y vuelve a 300 en 97% y en 100%
    And "waveLoop" alcanza stroke-dashoffset 0 en 22% con el mismo rebobinado 96%→97%

  @s10
  Scenario: Los keyframes del punto reproducen el trazo del contorno y el "pop" del relleno
    Given el fichero "src/styles/_logo-draw.scss"
    When leo "dotOutlineLoop" y "dotFillLoop"
    Then "dotOutlineLoop" traza el contorno con stroke-dashoffset 30→0 hacia 27% y desvanece stroke-opacity a 0 en 30%
    And "dotFillLoop" pasa de fill-opacity 0 y transform scale(.3) a fill-opacity 1 y transform scale(1) en 30%

  @s11
  Scenario: Los keyframes del wordmark revelan carácter a carácter con steps
    Given el fichero "src/styles/_logo-draw.scss"
    When leo "cenitLoop", "digitalLoop" y los shorthands del wordmark
    Then "cenitLoop" abre el clip-path de inset(0 100% 0 0) a inset(0 0% 0 0) entre 30% y 35%
    And "digitalLoop" lo abre entre 36% y 41%
    And "cénit" usa la timing-function "steps(5, end)" y "digital" usa "steps(7, end)"

  @s12
  Scenario: La opacidad del contenedor esconde el rebobinado sin parpadeo en el primer frame
    Given el fichero "src/styles/_logo-draw.scss"
    When leo "logoCycleOpacity" y "heroCycleOpacity"
    Then el contenedor arranca VISIBLE en 0% (opacity 1 en nav, opacity .42 en hero), nunca en 0
    And cae a opacity 0 solo entre 96% y 97% (rebobinado invisible) y regresa a su opacidad de reposo en 100%

  @s13
  Scenario: Cada shorthand dura 18.3s en bucle infinito con su easing del handoff
    Given el fichero "src/styles/_logo-draw.scss"
    When leo las declaraciones "animation" de los elementos
    Then todas usan la duración "18.3s" y "infinite"
    And el anillo usa el easing "cubic-bezier(.25,.46,.45,.94)" y la onda y el punto usan "cubic-bezier(.4,0,.2,1)"

  @s14
  Scenario: El estado base del trazo es DIBUJADO, no oculto (R1)
    Given el fichero "src/styles/_logo-draw.scss"
    When leo el CSS base (fuera de @keyframes) del anillo, la onda y los dos círculos del punto
    Then el stroke-dashoffset base del anillo y de la onda es 0 (trazo completo), no 300
    And el contorno del punto arranca invisible (stroke-opacity 0) y el relleno arranca visible (fill-opacity 1)
    And el estado oculto (dashoffset máximo, clip-path inset(0 100% 0 0)) vive únicamente en el 0% de los keyframes, no horneado como valor base

  @s15
  Scenario: El punto de relleno escala desde su propio centro (transform-box fill-box)
    Given el fichero "src/styles/_logo-draw.scss"
    When leo la regla del punto de relleno "[data-orbit-dot-fill]"
    Then incluye "transform-box: fill-box" y "transform-origin: center"

  @s16
  Scenario: Con prefers-reduced-motion se desactiva la animación y el logo queda dibujado (D1)
    Given el fichero "src/styles/_logo-draw.scss"
    When leo la media query "(prefers-reduced-motion: reduce)"
    Then aplica "animation: none" a los elementos animados
    And, combinado con el estado base dibujado (R1), el logo queda estático y completamente dibujado (anillo y onda con trazo completo, punto relleno, contorno invisible, wordmark visible)

  @s17
  Scenario: No se crean tokens nuevos y todo el color sale de var(--color-…)
    Given los ficheros "src/styles/_logo-draw.scss", "src/components/Logo.tsx" y "src/components/Hero.tsx"
    When busco valores de color y nuevas custom properties de la animación
    Then el parcial no declara ninguna custom property "--color-*" nueva y "_tokens.scss" no gana tokens para esta feature
    And los trazos usan "var(--color-…)" (ring/zenith/primary/secondary en la cabecera, accent en el hero), de modo que la animación funciona igual en tema claro y oscuro sin conocer el tema

  @s18
  Scenario: El arco del hero conserva la atenuación a .1 en móvil ≤820px (D2)
    Given el arco del hero con opacidad de reposo .42 fijada por el keyframe heroCycleOpacity
    When leo la regla de "(max-width: 820px)" para el arco en el SCSS
    Then la opacidad de reposo del arco se atenúa a .1 en pantallas de 820px o menos
    And, como el keyframe de opacidad gana sobre la propiedad estática "opacity", esa atenuación se logra con un keyframe/animación móvil aparte (o desactivando la animación de opacidad en móvil), no con una sola declaración "opacity" estática
