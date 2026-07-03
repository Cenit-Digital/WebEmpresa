Feature: Navegación de la cabecera
  Como visitante quiero llegar a cualquier sección desde la cabecera, en
  escritorio y en móvil, para moverme por la home sin perderme.

  @s1
  Scenario: El logotipo enlaza a inicio
    Given la home renderizada
    When localizo el logotipo de la cabecera
    Then es un enlace cuyo href es "/"

  @s2
  Scenario: La navegación de escritorio muestra los enlaces y el CTA
    Given la home en viewport de escritorio
    When inspecciono la navegación de la cabecera
    Then existen enlaces con nombre "Servicios", "Sectores", "Paquetes" y "Contacto" cuyos href son "#servicios", "#sectores", "#paquetes" y "#contacto"
    And existe un enlace "Hablamos" cuyo href es "#contacto"

  @s3
  Scenario: La cabecera permanece fija al hacer scroll
    Given la home renderizada
    When leo el estilo calculado de la cabecera
    Then su "position" es "sticky" y su "top" es "0px"

  @s4
  Scenario: En móvil se oculta la nav de escritorio y aparece la hamburguesa
    Given la home en viewport de 375px de ancho
    When inspecciono la cabecera
    Then los enlaces de escritorio no son visibles
    And existe un botón con nombre accesible "Menú"

  @s5
  Scenario: Al abrir el menú móvil aparecen los cuatro enlaces en orden
    Given la home en viewport móvil con el menú cerrado
    When pulso el botón "Menú"
    Then se muestra un panel con enlaces "Servicios", "Sectores", "Paquetes" y "Contacto" en ese orden

  @s6
  Scenario: El menú móvil se cierra con el botón de cierre
    Given el menú móvil abierto
    When pulso el botón con nombre accesible "Cerrar"
    Then el panel del menú deja de estar en el documento

  @s7
  Scenario: El menú móvil se cierra al pulsar un enlace
    Given el menú móvil abierto
    When pulso el enlace "Servicios" del panel
    Then el panel del menú deja de estar en el documento

  @s8
  Scenario: El menú móvil se cierra al pulsar el fondo
    Given el menú móvil abierto
    When pulso sobre el fondo oscurecido (fuera del panel)
    Then el panel del menú deja de estar en el documento
