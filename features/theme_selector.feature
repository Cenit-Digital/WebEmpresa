# Pertenece a WEB-4 (home_layout)
# Paleta confirmada (RF-MARCA-001, corregido): claro = Bosque & Limón,
# oscuro = Noche & Oro. No hay detalles de control visual (botón,
# desplegable, grupo de opciones): eso lo decide tdd_craftsman.
Feature: Selector de tema (Claro / Oscuro / Sistema)
  Como visitante de la web de Cénit Digital
  quiero elegir modo claro, oscuro o seguir el ajuste de mi sistema
  para leer la web cómodamente según mis preferencias.

  @s1
  Scenario: Sin elección previa, se aplica el tema del sistema operativo
    Given que no hay valor guardado en localStorage bajo "cenit-theme"
    And el sistema operativo tiene activado el modo oscuro
    When la página termina de cargar
    Then el "data-theme" del documento es "dark"
    And el selector de tema muestra seleccionada la opción "Sistema"

  @s2
  Scenario: Elegir manualmente el modo claro
    When elijo la opción "Claro" en el selector de tema
    Then el "data-theme" del documento es "light"
    And localStorage guarda "cenit-theme" con el valor "light"

  @s3
  Scenario: Elegir manualmente el modo oscuro
    When elijo la opción "Oscuro" en el selector de tema
    Then el "data-theme" del documento es "dark"
    And localStorage guarda "cenit-theme" con el valor "dark"

  @s4
  Scenario: Volver a "Sistema" borra la preferencia manual guardada
    Given que localStorage tiene "cenit-theme" con el valor "dark"
    When elijo la opción "Sistema" en el selector de tema
    Then localStorage ya no tiene la clave "cenit-theme"
    And el "data-theme" del documento coincide con el "prefers-color-scheme" del sistema

  @s5
  Scenario: En modo "Sistema", un cambio del sistema operativo se refleja sin recargar
    Given que el selector de tema tiene seleccionada la opción "Sistema"
    And el sistema operativo está en modo claro
    When el sistema operativo cambia a modo oscuro sin recargar la página
    Then el "data-theme" del documento pasa a "dark" sin recargar

  @s6
  Scenario: La elección manual persiste aunque el sistema esté en el modo contrario
    Given que localStorage tiene "cenit-theme" con el valor "dark"
    And el sistema operativo tiene activado el modo claro
    When vuelvo a entrar en la web
    Then el "data-theme" del documento es "dark"

  @s7
  Scenario: El tema correcto se aplica antes del primer pintado
    Given que localStorage tiene "cenit-theme" con el valor "dark"
    When entro de nuevo en la web
    Then la primera pintura de la página ya se muestra con "data-theme" en "dark"
    And no hay parpadeo con la paleta de modo claro antes de aplicar el oscuro

  @s8
  Scenario: El modo claro aplica los tokens de la paleta Bosque & Limón
    Given que el "data-theme" del documento es "light"
    When leo el valor computado de la variable "--color-primary"
    Then es "#1e7a4f"

  @s9
  Scenario: El modo oscuro aplica los tokens de la paleta Noche & Oro
    Given que el "data-theme" del documento es "dark"
    When leo el valor computado de la variable "--color-primary"
    Then es "#c9a84c"
