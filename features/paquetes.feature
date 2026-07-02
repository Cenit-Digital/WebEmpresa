# Pertenece a WEB-5 (home_sections)
# Nota: el diseño final no muestra precios fijos por paquete (solo la
# llamada a "Solicitar presupuesto"), a diferencia del criterio de
# aceptación de WEB-5 en Jira ("precios del plan cargados"). No invento
# precios; si Cénit Digital quiere precios fijos visibles, es una
# decisión de producto pendiente de confirmar, no un dato del HTML.
Feature: Sección de paquetes
  Como visitante de la web de Cénit Digital
  quiero ver los paquetes disponibles y lo que incluye cada uno
  para elegir el que mejor encaja con mi negocio y pedir presupuesto.

  @s1
  Scenario: Intro de la sección de paquetes
    Given estoy en la sección "Paquetes"
    When leo la introducción
    Then veo el titular "Elige tu paquete"
    And veo el texto "Tres niveles según lo que necesite tu negocio. Te preparamos un presupuesto a medida, sin entrada y sin sorpresas."

  @s2
  Scenario Outline: Cada paquete muestra su nombre y su descripción breve
    Given estoy en la sección "Paquetes"
    When leo el paquete "<nombre>"
    Then la descripción breve es "<tagline>"

    Examples:
      | nombre            | tagline                                              |
      | Presencia Digital  | Lo esencial para existir online y que te encuentren. |
      | Presencia Activa   | Presencia + marketing para crecer cada mes.          |
      | Negocio Conectado  | Automatiza la operativa de punta a punta.            |

  @s3
  Scenario Outline: Cada paquete muestra su lista de características
    Given estoy en la sección "Paquetes"
    When leo el paquete "<nombre>"
    Then veo las características "<caracteristicas>"

    Examples:
      | nombre            | caracteristicas                                                                                          |
      | Presencia Digital  | Web hasta 6 páginas, Dominio .es incluido, Hosting y SSL, SEO básico on-page, Ficha Google Business       |
      | Presencia Activa   | Todo Presencia Digital, RRSS (2 redes, semanal), Email marketing mensual, Gestión de reputación, SEO local avanzado |
      | Negocio Conectado  | Todo Presencia Activa, Chatbot WhatsApp IA, Sistema de citas online, Dashboard de métricas, Automatización de procesos |

  @s4
  Scenario: Solo el paquete "Presencia Activa" lleva la insignia "Más elegido"
    Given estoy en la sección "Paquetes"
    When miro las tres tarjetas de paquete
    Then solo la tarjeta "Presencia Activa" muestra la insignia "Más elegido"

  @s5
  Scenario Outline: Cada paquete tiene un botón "Solicitar presupuesto"
    Given estoy en la sección "Paquetes"
    When miro el paquete "<nombre>"
    Then veo el botón "Solicitar presupuesto"

    Examples:
      | nombre            |
      | Presencia Digital  |
      | Presencia Activa   |
      | Negocio Conectado  |
