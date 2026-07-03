Feature: Pie de página
  Como visitante quiero tener siempre a mano el copyright, el aviso legal y un
  contacto directo, para confiar en quién está detrás de la web.

  @s1
  Scenario: Copyright con el año actual
    Given la home renderizada
    When leo el texto del pie
    Then contiene "© " seguido del año actual y "Cénit Digital"

  @s2
  Scenario: Enlace a Aviso legal
    Given el pie renderizado
    When localizo el enlace "Aviso legal"
    Then su href es "/aviso-legal"

  @s3
  Scenario: Enlace de contacto por correo
    Given el pie renderizado
    When localizo el enlace de correo
    Then su href es "mailto:hola@cenitdigital.es"

  @s4
  Scenario: No se muestran enlaces fuera de alcance
    Given el pie renderizado
    When busco enlaces "Privacidad" o "Cookies"
    Then no existe ninguno de esos enlaces (no hay páginas de destino todavía)
