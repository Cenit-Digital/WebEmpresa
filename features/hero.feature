Feature: Hero de la home
  Como visitante quiero entender en cinco segundos qué ofrece Cénit Digital y
  tener un primer paso claro, para decidir si sigo leyendo o hablo con ellos.

  @s1
  Scenario: Muestra el eyebrow de contexto
    Given la home renderizada
    When leo la parte superior del hero
    Then se muestra el texto "Soluciones digitales para pymes"

  @s2
  Scenario: Muestra el titular principal como H1
    Given la home renderizada
    When localizo el encabezado de nivel 1
    Then su texto es "Llevamos tu negocio al punto más alto de su presencia digital."

  @s3
  Scenario: Muestra el subtítulo de propuesta de valor
    Given el hero renderizado
    When leo el párrafo bajo el titular
    Then contiene "todo bajo una cuota mensual, sin entrada"

  @s4
  Scenario: CTA primario hacia paquetes
    Given el hero renderizado
    When localizo el enlace "Ver paquetes"
    Then su href es "#paquetes"

  @s5
  Scenario: CTA secundario hacia contacto
    Given el hero renderizado
    When localizo el enlace "Hablar con nosotros"
    Then su href es "#contacto"

  @s6
  Scenario: Muestra las cuatro estadísticas
    Given el hero renderizado
    When inspecciono la fila de estadísticas
    Then aparecen las parejas valor/etiqueta: "24h" / "tiempo de respuesta", "+30" / "pymes confían", "100%" / "diseño a medida" y "5★" / "valoración media"
