Feature: Formulario de contacto funcional con Resend (WEB-6)
  Como responsable de una pyme interesada en Cénit Digital
  quiero enviar mis datos y mi necesidad desde el formulario de contacto
  para recibir respuesta en menos de 24 horas.

  # ── Validación de campos ─────────────────────────────────────────────

  @s1
  Scenario: No se envía sin nombre
    Given que estoy en el formulario de "Contacto"
    And el campo "Nombre" está vacío
    And he escrito "maria@clinicaveterinaria.es" en "Correo electrónico"
    When pulso el botón de enviar
    Then el formulario no se envía
    And veo un aviso de que "Nombre" es obligatorio

  @s2
  Scenario: No se envía sin correo electrónico
    Given que estoy en el formulario de "Contacto"
    And he escrito "María Pérez" en "Nombre"
    And el campo "Correo electrónico" está vacío
    When pulso el botón de enviar
    Then el formulario no se envía
    And veo un aviso de que "Correo electrónico" es obligatorio

  @s3
  Scenario: No se envía con un correo electrónico con formato inválido
    Given que estoy en el formulario de "Contacto"
    And he escrito "María Pérez" en "Nombre"
    And he escrito "esto-no-es-un-email" en "Correo electrónico"
    When pulso el botón de enviar
    Then el formulario no se envía
    And veo un aviso de que el correo electrónico no es válido

  @s4
  Scenario: El teléfono es opcional
    Given que estoy en el formulario de "Contacto"
    And he escrito "María Pérez" en "Nombre"
    And he escrito "maria@clinicaveterinaria.es" en "Correo electrónico"
    And no he escrito ningún "Teléfono"
    When pulso el botón de enviar
    Then el formulario se envía correctamente

  @s5
  Scenario: El sector es opcional
    Given que estoy en el formulario de "Contacto"
    And he escrito "María Pérez" en "Nombre"
    And he escrito "maria@clinicaveterinaria.es" en "Correo electrónico"
    And no he seleccionado ningún "Sector"
    When pulso el botón de enviar
    Then el formulario se envía correctamente

  @s6
  Scenario: El mensaje ("¿Qué necesitas?") es opcional
    Given que estoy en el formulario de "Contacto"
    And he escrito "María Pérez" en "Nombre"
    And he escrito "maria@clinicaveterinaria.es" en "Correo electrónico"
    And no he escrito nada en "¿Qué necesitas?"
    When pulso el botón de enviar
    Then el formulario se envía correctamente

  # ── Envío correcto y correo real vía Resend ─────────────────────────

  @s7
  Scenario: Envío correcto con todos los campos obligatorios rellenos
    Given que estoy en el formulario de "Contacto"
    And he escrito "María Pérez" en "Nombre"
    And he escrito "maria@clinicaveterinaria.es" en "Correo electrónico"
    When pulso el botón de enviar
    Then se envía un correo real a través de Resend con los datos del formulario
    And veo un mensaje de confirmación de envío

  @s8
  Scenario: El botón de enviar se deshabilita mientras se procesa el envío
    Given que estoy en el formulario de "Contacto" con los campos obligatorios rellenos
    When pulso el botón de enviar
    Then el botón de enviar queda deshabilitado hasta que la petición termina
    And no se puede enviar el formulario una segunda vez mientras tanto

  @s9
  Scenario: Tras un envío correcto, el formulario se limpia
    Given que acabo de enviar el formulario correctamente
    When miro el formulario
    Then los campos "Nombre", "Correo electrónico", "Teléfono" y "¿Qué necesitas?" están vacíos

  # ── Errores de envío ─────────────────────────────────────────────────

  @s10
  Scenario: Si Resend devuelve un error, se muestra un aviso y no se pierden los datos
    Given que estoy en el formulario de "Contacto" con los campos obligatorios rellenos
    And el envío del correo por Resend va a fallar
    When pulso el botón de enviar
    Then veo un mensaje de error de envío
    And los campos conservan lo que había escrito

  @s11
  Scenario: Tras un error de envío, puedo reintentar sin volver a escribir los datos
    Given que el envío anterior del formulario falló
    And los campos conservan los datos escritos
    When pulso el botón de enviar de nuevo
    Then se envía un nuevo intento de correo a través de Resend

  # ── Protección antispam (honeypot) ──────────────────────────────────
  # Decisión: honeypot (campo oculto para personas, invisible en el DOM
  # visual pero presente para bots) en lugar de rate-limit, por
  # simplicidad y por no requerir infraestructura adicional. Cualquier
  # envío con el honeypot relleno se descarta.

  @s12
  Scenario: El formulario incluye un campo honeypot oculto a las personas
    Given que estoy en el formulario de "Contacto"
    When miro el formulario con un lector de pantalla o inspecciono el HTML
    Then existe un campo adicional no visible ni anunciado para personas usuarias

  @s13
  Scenario: Un envío con el honeypot relleno se descarta como spam
    Given que estoy en el formulario de "Contacto"
    And he escrito "María Pérez" en "Nombre"
    And he escrito "maria@clinicaveterinaria.es" en "Correo electrónico"
    And el campo honeypot llega relleno con contenido
    When se procesa el envío
    Then no se envía ningún correo a través de Resend
    And no se informa al remitente de que fue descartado como spam
