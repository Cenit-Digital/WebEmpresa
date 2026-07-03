Feature: Contenido de la sección de contacto
  Como visitante quiero saber qué me van a pedir y ver que hay un canal directo,
  para escribir con confianza o llamar si lo prefiero.

  # Esta feature cubre solo la ESTRUCTURA visual del formulario.
  # La validación y el envío real son contact_form (WEB-6).

  @s1
  Scenario: Muestra la intro y la promesa de respuesta en 24h
    Given la sección de contacto renderizada
    When leo el texto introductorio
    Then contiene "en menos de 24 horas"

  @s2
  Scenario: Ofrece un teléfono como enlace de llamada
    Given la sección de contacto renderizada
    When localizo el enlace de teléfono
    Then su href empieza por "tel:"

  @s3
  Scenario: El formulario muestra sus cinco campos
    Given el formulario de contacto renderizado
    When leo sus etiquetas de campo
    Then existen campos "Nombre", "Correo electrónico", "Teléfono", "Sector" y "¿Qué necesitas?"

  @s4
  Scenario: Nombre y Correo se marcan como obligatorios
    Given el formulario de contacto renderizado
    When inspecciono los campos "Nombre" y "Correo electrónico"
    Then ambos están marcados como obligatorios (required / asterisco)

  @s5
  Scenario: El desplegable de Sector ofrece las opciones esperadas
    Given el desplegable "Sector"
    When leo sus opciones
    Then incluye "Veterinaria", "Servicios de estética", "Clínica dental", "Fisioterapia" y "Otro"

  @s6
  Scenario: El botón de envío muestra su texto
    Given el formulario de contacto renderizado
    When localizo el botón de envío
    Then su texto es "Enviar consulta gratuita"
