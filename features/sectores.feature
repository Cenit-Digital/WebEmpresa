# Pertenece a WEB-5 (home_sections)
Feature: Sección de sectores
  Como visitante de la web de Cénit Digital
  quiero ver en qué sectores está especializada Cénit Digital
  para saber si mi negocio encaja con lo que ofrecen.

  @s1
  Scenario: Intro de la sección de sectores
    Given estoy en la sección "Sectores"
    When leo la introducción
    Then veo la etiqueta "A quién ayudamos"
    And veo el titular "Sectores con los que trabajamos"

  @s2
  Scenario Outline: Cada tarjeta de sector muestra su nombre y descripción
    Given estoy en la sección "Sectores"
    When leo la tarjeta "<nombre>"
    Then la descripción contiene "<descripcion_contiene>"

    Examples:
      | nombre                | descripcion_contiene                                  |
      | Veterinarias           | Webs y reservas para clínicas veterinarias            |
      | Servicios de estética  | Presencia digital para centros de estética y belleza  |
      | Clínicas dentales      | Captación de pacientes para clínicas dentales         |
      | Fisioterapeutas        | Webs para fisioterapeutas y osteópatas                |

  @s3
  Scenario: La sección de sectores muestra la nota de selección inicial
    Given estoy en la sección "Sectores"
    When leo el pie de la sección
    Then veo el texto "Selección inicial — abierta a debate según el plan comercial."
