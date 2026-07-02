# Pertenece a WEB-5 (home_sections)
Feature: Hero de la home
  Como visitante de la web de Cénit Digital
  quiero ver de un vistazo qué ofrece Cénit Digital y por dónde empezar
  para decidir si sigo explorando la web.

  @s1
  Scenario: El hero muestra la propuesta de valor
    Given entro en la home
    When la página termina de cargar
    Then veo la etiqueta superior "Soluciones digitales para pymes"
    And veo el titular "Llevamos tu negocio al punto más alto de su presencia digital."
    And veo el subtítulo "Web, automatización con IA, marketing y sistemas de citas — todo bajo una cuota mensual, sin entrada."

  @s2
  Scenario: El botón principal del hero lleva a paquetes
    Given estoy en el hero de la home
    When miro el botón "Ver paquetes"
    Then apunta a "#paquetes"

  @s3
  Scenario: El botón secundario del hero lleva a contacto
    Given estoy en el hero de la home
    When miro el botón "Hablar con nosotros"
    Then apunta a "#contacto"

  @s4
  Scenario Outline: El hero muestra sus cuatro estadísticas
    Given estoy en el hero de la home
    When leo la fila de estadísticas
    Then veo el valor "<valor>" con la etiqueta "<etiqueta>"

    Examples:
      | valor | etiqueta            |
      | 24h   | tiempo de respuesta |
      | +30   | pymes confían       |
      | 100%  | diseño a medida     |
      | 5★    | valoración media    |
