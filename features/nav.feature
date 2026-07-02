# Pertenece a WEB-4 (home_layout)
Feature: Navegación de la cabecera
  Como visitante de la web de Cénit Digital
  quiero un logotipo que me lleve a inicio y una navegación clara
  para moverme por la web desde cualquier sección.

  @s1
  Scenario: El logotipo enlaza a inicio
    Given estoy en cualquier página de la web
    When miro la cabecera
    Then veo el logotipo "CÉNIT DIGITAL" enlazando a "/"

  @s2
  Scenario: Los enlaces de navegación de escritorio apuntan a sus secciones
    Given estoy en la home en una pantalla de escritorio
    When miro la cabecera
    Then veo, en este orden, los enlaces "Servicios", "Sectores", "Paquetes" y "Contacto"
    And apuntan a "#servicios", "#sectores", "#paquetes" y "#contacto" respectivamente
    And veo el botón "Hablamos" apuntando a "#contacto"

  @s3
  Scenario Outline: Cada enlace de navegación desplaza a su sección
    Given estoy en la home
    When pulso el enlace "<enlace>" de la navegación de escritorio
    Then la página se desplaza a la sección "<ancla>"

    Examples:
      | enlace    | ancla      |
      | Servicios | #servicios |
      | Sectores  | #sectores  |
      | Paquetes  | #paquetes  |
      | Contacto  | #contacto  |

  @s4
  Scenario: La cabecera permanece fija al hacer scroll
    Given estoy en la home
    When hago scroll hacia abajo más allá de la cabecera
    Then la cabecera se sigue mostrando en la parte superior de la ventana

  # ── Menú móvil ───────────────────────────────────────────────────────
  # El diseño de referencia omitía "Sectores" en el panel móvil, pero Pablo
  # confirmó en la puerta que fue un olvido del diseño: el panel móvil
  # incluye "Sectores" y lista los cuatro enlaces en el mismo orden que el
  # nav de escritorio (Servicios, Sectores, Paquetes, Contacto).

  @s5
  Scenario: El botón de menú abre el panel móvil
    Given estoy en la home en una pantalla de móvil
    And el panel de menú móvil está cerrado
    When pulso el botón de menú
    Then el panel de menú móvil se muestra
    And veo dentro, en este orden, los enlaces "Servicios", "Sectores", "Paquetes" y "Contacto"

  @s6
  Scenario: El botón "✕" cierra el panel móvil
    Given el panel de menú móvil está abierto
    When pulso el botón "✕"
    Then el panel de menú móvil se oculta

  @s7
  Scenario: Pulsar un enlace del panel móvil lo cierra y navega a la sección
    Given el panel de menú móvil está abierto
    When pulso el enlace "Paquetes" dentro del panel
    Then el panel de menú móvil se oculta
    And la página se desplaza a la sección "#paquetes"

  @s8
  Scenario: Pulsar fuera del panel (el fondo) lo cierra
    Given el panel de menú móvil está abierto
    When pulso fuera del panel, sobre el fondo oscurecido
    Then el panel de menú móvil se oculta

  @s9
  Scenario: El botón de menú solo es visible en pantallas pequeñas
    Given estoy en la home en una pantalla de escritorio
    When miro la cabecera
    Then el botón de menú móvil no está visible
    And en su lugar veo los enlaces de navegación de escritorio
