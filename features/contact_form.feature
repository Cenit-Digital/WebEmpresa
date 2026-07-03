Feature: Formulario de contacto funcional con Resend
  Como visitante quiero que el formulario envíe de verdad y valide lo mínimo,
  para contactar sin errores; y como empresa, que no sea un canal de spam.

  @s1
  Scenario: Falta el nombre
    Given el formulario con "Correo electrónico" válido y "Nombre" vacío
    When intento enviar
    Then se muestra un error en "Nombre" y no se llama a Resend

  @s2
  Scenario: Falta el correo
    Given el formulario con "Nombre" relleno y "Correo electrónico" vacío
    When intento enviar
    Then se muestra un error en "Correo electrónico" y no se llama a Resend

  @s3
  Scenario: Correo con formato inválido
    Given el formulario con "Nombre" relleno y correo "hola@@mal"
    When intento enviar
    Then se muestra un error de formato de correo y no se llama a Resend

  @s4
  Scenario: Envío válido
    Given el formulario con "Nombre" y "Correo electrónico" válidos
    When lo envío
    Then se llama a Resend con los datos del formulario y se muestra un mensaje de éxito

  @s5
  Scenario: El botón se deshabilita durante el envío
    Given un envío válido en curso
    When observo el botón de envío
    Then está deshabilitado hasta que la petición termina

  @s6
  Scenario: El formulario se limpia tras el éxito
    Given un envío que ha terminado con éxito
    When observo los campos
    Then "Nombre", "Correo electrónico" y "¿Qué necesitas?" están vacíos

  @s7
  Scenario: Tras un fallo se conserva lo escrito
    Given un envío que falla en Resend
    When observo el formulario
    Then se muestra un mensaje de error y los datos introducidos siguen presentes

  @s8
  Scenario: El honeypot descarta el spam
    Given el campo trampa (honeypot) relleno por un bot
    When se intenta enviar
    Then no se llama a Resend y se simula éxito silencioso
