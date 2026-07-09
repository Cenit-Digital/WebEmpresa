Feature: Revelado en scroll de la sección Servicios
  Como visitante quiero que cada fila de servicio entre en escena al quedar centrada
  en el viewport, para leer la sección fila a fila sin perder contenido si no hay JS.

  # Fuente de verdad: project-spec.md #15 (servicios_scroll_reveal). Síntesis de
  # los 14 comportamientos numerados (@s1..@s14) de esa sección.
  #
  # CLAVE (ver "Contrato observable" del spec): la interpolación de la animación
  # NO es verificable en jsdom (no hay IntersectionObserver real, ni layout, ni
  # transition). El contrato testeable se parte en DOS:
  #   (a) @s1..@s6 — la LÓGICA del hook useReveal, con IntersectionObserver
  #       MOCKEADO al estilo del fakeMatchMedia de useIsMobile.test.tsx: el
  #       mecanismo (data-reveal en el contenedor, data-in-view por fila,
  #       observer.disconnect en cleanup, guard SSR) ES el contrato, y se cita.
  #   (b) @s7..@s13 — el CONTENIDO del SCSS module: se lee Servicios.module.scss
  #       y se asevera la regla, idioma "leer el .scss y aseverar", como
  #       logo_draw_animation.feature. Ningún escenario afirma la interpolación
  #       en el tiempo, solo la DEFINICIÓN de la regla en el fichero.
  #   @s14 — no-regresión de contenido (los 6 servicios siguen visibles).
  #
  # Decisiones del spec asumidas: D1 (IntersectionObserver nativo), D2 (banda
  # central ~-40%/-40%), D3 (bidireccional, no triggerOnce), D4 (zig-zag gratis
  # apoyado en :nth-child(even)), D5 (estado base = final, oculto armado en
  # cliente = R1), D6 (solo opacity + transform), D7 (hook genérico por data-*).

  # ───────────────────── Lógica del hook useReveal (@s1..@s6) ─────────────────

  @s1
  Scenario: Guard SSR/sin soporte: sin IntersectionObserver no arma nada
    Given el contenedor de filas montado en un entorno donde IntersectionObserver no está definido
    When el hook useReveal se ejecuta tras el montaje
    Then el contenedor NO recibe el atributo "data-reveal"
    And ninguna fila recibe "data-in-view", el contenido queda visible y no se lanza ningún error

  @s2
  Scenario: Arma el contenedor tras el montaje
    Given el contenedor de filas montado con IntersectionObserver disponible
    When el hook useReveal completa su efecto de montaje
    Then el contenedor expone el atributo "data-reveal" (puesto imperativamente en useEffect, no en el render)

  @s3
  Scenario: Observa cada fila objetivo
    Given el contenedor con sus N filas ".row" montado con IntersectionObserver disponible
    When el hook useReveal arma el observer
    Then el observer registra exactamente N observaciones, una por cada ".row" hija

  @s4
  Scenario: Conmuta data-in-view al entrar en la banda central
    Given el contenedor armado y una fila observada
    When el observer emite una entrada con "isIntersecting" true para esa fila
    Then la fila expone el atributo "data-in-view"

  @s5
  Scenario: Bidireccional (no triggerOnce): pierde y recupera data-in-view
    Given una fila que ya expone "data-in-view"
    When el observer emite para esa fila una entrada con "isIntersecting" false y luego otra con "isIntersecting" true
    Then la fila pierde "data-in-view" tras la salida y vuelve a exponerlo tras la re-entrada

  @s6
  Scenario: Limpieza: desconecta el observer al desmontar
    Given el contenedor armado con el observer activo
    When el componente que usa useReveal se desmonta
    Then el hook llama a "observer.disconnect()" y no quedan observaciones vivas

  # ─────────────── Contenido del SCSS module Servicios.module.scss ────────────

  @s7
  Scenario: R1 — el estado base es el estado FINAL (visible)
    Given el fichero "src/components/Servicios.module.scss"
    When leo el CSS base (fuera de data-reveal) de ".card", el mockup y ".example"
    Then su estado base es el final: "opacity: 1" y sin "transform" de desplazamiento
    And el estado oculto (opacity 0 + transform) NO está horneado como valor base

  @s8
  Scenario: El estado oculto está gateado tras data-reveal y no-preference
    Given el fichero "src/components/Servicios.module.scss"
    When leo la regla que fija el estado oculto (opacity 0 + transform) de las tres piezas
    Then vive únicamente bajo el contenedor con "data-reveal" y las filas ":not([data-in-view])"
    And esa regla está anidada dentro de "@media (prefers-reduced-motion: no-preference)"

  @s9
  Scenario: Se animan solo opacity y transform
    Given el fichero "src/components/Servicios.module.scss"
    When leo las declaraciones "transition" (o propiedades animadas) de las tres piezas
    Then solo referencian "opacity" y "transform"
    And no animan "top", "left", "margin", "height" ni ninguna otra propiedad que provoque reflow

  @s10
  Scenario: Stagger — la entrada escalona .card, mockup y .example
    Given el fichero "src/components/Servicios.module.scss"
    When leo los "transition-delay" (o delays equivalentes) de las tres piezas
    Then los tres delays son crecientes en el orden ".card" -> mockup -> ".example"

  @s11
  Scenario: Zig-zag por :nth-child(even) invierte la dirección horizontal
    Given el fichero "src/components/Servicios.module.scss"
    When leo la regla de dirección horizontal del estado oculto de ".card" y el mockup
    Then la inversión de dirección de las filas pares cuelga del selector ":nth-child(even)"
    And no existe ningún atributo "data-dir" ni prop de dirección calculada en JS para lograrla

  @s12
  Scenario: prefers-reduced-motion reduce — sin estado oculto ni animación
    Given el fichero "src/components/Servicios.module.scss"
    When compruebo qué reglas quedan activas bajo "(prefers-reduced-motion: reduce)"
    Then el estado oculto (opacity 0 + transform) no aplica, porque solo existe bajo "no-preference"
    And el contenido queda completamente visible sin transición que apagar

  @s13
  Scenario: 0 scroll horizontal — overflow-x clip y fallback vertical en móvil
    Given el fichero "src/components/Servicios.module.scss"
    When leo la regla de la sección ".services" y el breakpoint móvil que ya colapsa a 1 columna
    Then ".services" declara "overflow-x: clip"
    And en el breakpoint móvil las tres piezas usan desplazamiento vertical ("translateY"), sin "translateX" amplio

  # ─────────────────────── No-regresión de contenido (@s14) ───────────────────

  @s14
  Scenario: Contenido intacto — los 6 servicios siguen renderizados
    Given la sección de servicios renderizada
    When leo los títulos, etiquetas, características y bloques "Ejemplo" de las tarjetas
    Then los 6 servicios siguen presentes con su contenido completo (la animación es puramente visual)
