Feature: Selector de tema Claro/Oscuro/Sistema
  Como visitante quiero leer la web en claro, oscuro o siguiendo mi sistema,
  para elegir el modo que me resulte cómodo sin parpadeos ni sorpresas.

  # Paleta CLARA = Bosque & Limón · OSCURA = Noche & Oro (RF-MARCA-001).
  # Persistencia en localStorage['cenit-theme']; ausencia de clave = "Sistema".
  # PRESENTACIÓN del control (un único botón de icono que cicla los 3 modos) se
  # especifica en features/fidelidad_referencia.feature (feature #13). Aquí se
  # contrata solo el COMPORTAMIENTO (data-theme + persistencia). Ambos contratos
  # deben coincidir: el "elijo la opción X" de antes es hoy avanzar el ciclo del
  # botón único hasta que el modo activo es X.

  @s1
  Scenario: Sin preferencia guardada, sigue al sistema (oscuro)
    Given no existe la clave "cenit-theme" en localStorage y el sistema prefiere esquema oscuro
    When se carga la página
    Then el atributo "data-theme" de <html> es "dark"

  @s2
  Scenario: Sin preferencia guardada, sigue al sistema (claro)
    Given no existe la clave "cenit-theme" en localStorage y el sistema prefiere esquema claro
    When se carga la página
    Then el atributo "data-theme" de <html> es "light"

  @s3
  Scenario: Elegir "Claro" fija el tema y lo persiste
    Given el selector de tema visible
    When avanzo el ciclo del botón de tema hasta que el modo activo es "Claro"
    Then el atributo "data-theme" de <html> es "light"
    And localStorage["cenit-theme"] es "light"

  @s4
  Scenario: Elegir "Oscuro" fija el tema y lo persiste
    Given el selector de tema visible
    When avanzo el ciclo del botón de tema hasta que el modo activo es "Oscuro"
    Then el atributo "data-theme" de <html> es "dark"
    And localStorage["cenit-theme"] es "dark"

  @s5
  Scenario: Elegir "Sistema" borra la preferencia y vuelve a seguir al SO
    Given una preferencia "dark" guardada y el sistema prefiere esquema claro
    When avanzo el ciclo del botón de tema hasta que el modo activo es "Sistema"
    Then no existe la clave "cenit-theme" en localStorage
    And el atributo "data-theme" de <html> es "light"

  @s6
  Scenario: En modo Sistema reacciona en vivo al cambio del SO
    Given el modo activo es "Sistema" con el sistema en esquema claro
    When el sistema cambia a esquema oscuro
    Then el atributo "data-theme" de <html> pasa a "dark" sin recargar

  @s7
  Scenario: La preferencia sobrevive a la recarga
    Given una preferencia "dark" guardada
    When recargo la página
    Then el atributo "data-theme" de <html> es "dark"

  @s8
  Scenario: El tema se aplica antes del primer pintado (anti-FOUC)
    Given una preferencia "dark" guardada
    When el documento hace su primer render
    Then <html> ya tiene "data-theme" igual a "dark" en el primer pintado (sin destello claro)
