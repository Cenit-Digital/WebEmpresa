# Pertenece a WEB-4 (home_layout)
Feature: Pie de página
  Como visitante de la web de Cénit Digital
  quiero ver los datos de contacto y el aviso legal en el pie
  para encontrar esa información desde cualquier página.

  @s1
  Scenario: El pie muestra el copyright con el año actual
    Given estoy en cualquier página
    When miro el pie de página
    Then veo el texto "© <año actual> Cénit Digital. Todos los derechos reservados."

  @s2
  Scenario: El pie enlaza al aviso legal
    Given estoy en cualquier página
    When pulso el enlace "Aviso legal" del pie
    Then navego a "/aviso-legal"

  @s3
  Scenario: El pie muestra un enlace de correo de contacto
    Given estoy en cualquier página
    When miro el pie de página
    Then veo un enlace "hola@cenitdigital.es" con destino "mailto:hola@cenitdigital.es"
