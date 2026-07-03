Feature: Marca — logotipo y tokens de tema
  Como equipo quiero un logotipo y unos colores de marca consistentes y ligados
  al tema, para que la identidad de Cénit Digital sea idéntica en toda la web.

  # Logotipo "Órbita" (RF-MARCA-001): anillo + onda degradada + punto cénit.
  # Reemplaza el logo azul/menta anterior. Colores desde tokens (var(--color-…)).

  @s1
  Scenario: El icono renderiza el símbolo "Órbita"
    Given el componente Logo renderizado
    When inspecciono su SVG
    Then contiene un <circle> (anillo), un <path> (onda) y un segundo <circle> (punto)
    And el SVG tiene aria-hidden="true"

  @s2
  Scenario: Muestra el wordmark por defecto
    Given el componente Logo sin props
    When leo su contenido de texto
    Then muestra "cénit" y "digital"

  @s3
  Scenario: Puede ocultarse el wordmark
    Given el componente Logo con withWordmark en false
    When leo su contenido de texto
    Then no muestra "cénit" ni "digital"

  @s4
  Scenario: El tamaño del icono es configurable
    Given el componente Logo con size 38
    When leo el SVG
    Then sus atributos width y height son "38"

  @s5
  Scenario: El degradado tiene id único por instancia
    Given dos componentes Logo en la misma página
    When comparo el id del <linearGradient> de cada uno
    Then los dos ids son distintos

  @s6
  Scenario: Los colores del logo salen de tokens, no de hex fijos
    Given el componente Logo renderizado
    When leo los atributos de color del icono
    Then el anillo usa stroke "var(--color-ring)", el punto usa fill "var(--color-zenith)" y las paradas del degradado usan "var(--color-primary)" y "var(--color-secondary)"

  @s7
  Scenario: El tema claro aplica la paleta Bosque & Limón
    Given <html> sin data-theme (o data-theme="light")
    When leo la variable --color-primary calculada en :root
    Then su valor es "#1E7A4F"

  @s8
  Scenario: El tema oscuro aplica la paleta Noche & Oro
    Given <html> con data-theme="dark"
    When leo la variable --color-primary calculada en :root
    Then su valor es "#C9A84C"
