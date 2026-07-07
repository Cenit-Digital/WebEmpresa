Feature: Fidelidad al diseño de referencia en cabecera y hero
  Como equipo quiero que la cabecera y el hero coincidan con el diseño de
  referencia versionado, para no derivar de la fuente de verdad sin regresar las
  funciones ya conseguidas.

  # Fuente de verdad: design/Cenit Home (referencia).dc.html (spec #13).
  # Aquí se contrata solo la PRESENTACIÓN y el LAYOUT del delta de fidelidad. El
  # COMPORTAMIENTO del tema (data-theme, persistencia, prefers-color-scheme,
  # anti-FOUC) vive en features/theme_selector.feature y NO se duplica aquí.
  # jsdom no hace layout: las propiedades de estilo se afirman sobre el .module.scss
  # (patrón "sticky" de Header.test.tsx).

  @s1
  Scenario: El control de tema es un único botón, no un radiogroup
    Given la cabecera renderizada en escritorio
    When inspecciono el control de tema
    Then existe exactamente un elemento con rol "button" para cambiar el tema
    And no existe ningún elemento con rol "radiogroup" ni rol "radio" en la cabecera

  @s2
  Scenario: Cada activación del botón cicla el modo light → dark → system → light
    Given el mismo botón de tema con el modo activo "Claro"
    When activo el botón de tema tres veces seguidas
    Then el modo activo del botón avanza a "Oscuro", luego a "Sistema" y de nuevo a "Claro"

  @s3
  Scenario: El botón muestra el icono del modo activo
    Given el botón de tema
    When el modo activo es "Claro", luego "Oscuro" y luego "Sistema"
    Then el botón identifica su icono activo como "sol" para Claro, "luna" para Oscuro y "monitor" para Sistema

  @s4
  Scenario: El nombre accesible del botón comunica el modo activo
    Given el botón de tema
    When el modo activo es "Claro", luego "Oscuro" y luego "Sistema"
    Then el nombre accesible del botón incluye respectivamente "Claro", "Oscuro" y "Sistema"

  @s5
  Scenario: La cabecera se organiza en dos grupos y el tema vive dentro del clúster de navegación
    Given la cabecera renderizada
    When inspecciono la estructura de la cabecera
    Then la cabecera contiene exactamente dos grupos: el logo (enlace a "/") y el clúster de navegación
    And el botón de tema está dentro del clúster de navegación, no como tercer hijo suelto de la cabecera

  @s6
  Scenario: El clúster derecho ordena enlaces, botón de tema y "Hablamos"
    Given la cabecera en viewport de escritorio
    When recorro los elementos del clúster de navegación en orden
    Then aparecen los enlaces "Servicios", "Sectores", "Paquetes" y "Contacto", después el botón de tema y por último "Hablamos"
    And el botón de tema aparece entre "Contacto" y "Hablamos"
    And "Hablamos" es el último elemento del clúster

  # (El "hueco central" que reportó el humano queda cubierto por @s5 + @s6: con
  # solo dos grupos y "Hablamos" como último elemento del clúster, la nav deja de
  # quedar aislada en el centro. La referencia usa flex + space-between con DOS
  # grupos, así que la corrección es estructural —2 hijos, no 3—, no de CSS.)

  @s7
  Scenario: El arco decorativo es el primer hijo del hero y está fuera del árbol de accesibilidad
    Given el hero renderizado
    When localizo el primer hijo del hero
    Then es un elemento con atributo "data-hero-arc"
    And tiene "aria-hidden" igual a "true"
    And no es enfocable

  @s8
  Scenario: El SVG del arco contiene círculo, onda y punto
    Given el elemento "data-hero-arc"
    When inspecciono su SVG
    Then contiene un "circle" de contorno, un "path" de onda y un "circle" de punto

  @s9
  Scenario: El hero recorta el arco con overflow:hidden y no genera scroll horizontal
    Given el fichero "Hero.module.scss"
    When leo la regla del ".hero"
    Then incluye "overflow: hidden" para clipar el arco y evitar scroll horizontal
