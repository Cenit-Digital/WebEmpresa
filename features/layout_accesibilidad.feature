# Pertenece a WEB-4 (home_layout)
Feature: Accesibilidad y SEO de base del layout
  Como visitante que navega por teclado o lector de pantalla, y como buscador
  quiero un enlace para saltar al contenido y un título propio por página
  para poder usar la web sin depender del ratón y para que cada página se identifique bien en buscadores.

  @s1
  Scenario: El enlace "saltar al contenido" es lo primero enfocable
    Given estoy en cualquier página y navego solo con teclado
    When pulso Tab nada más cargar la página
    Then el primer elemento enfocable es el enlace "Saltar al contenido"

  @s2
  Scenario: Activar el enlace "saltar al contenido" mueve el foco al contenido principal
    Given el enlace "Saltar al contenido" tiene el foco
    When lo activo
    Then el foco pasa al contenedor principal "#contenido"

  @s3
  Scenario: La home usa el título del sitio
    Given estoy en la home
    When compruebo la etiqueta <title>
    Then el título es exactamente "Cénit Digital"

  @s4
  Scenario: Una página interior compone su título con el nombre del sitio
    Given estoy en la página de "Aviso legal"
    When compruebo la etiqueta <title>
    Then el título es exactamente "Aviso legal — Cénit Digital"
