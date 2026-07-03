Feature: Sección de servicios
  Como visitante quiero ver el catálogo de servicios con un ejemplo real por
  servicio, para entender el resultado y no solo la promesa.

  @s1
  Scenario: Muestra los seis servicios en orden
    Given la sección de servicios renderizada
    When leo los títulos de las tarjetas
    Then son, en orden: "Desarrollo web", "Chatbot WhatsApp", "Gestión de RRSS", "SEO local", "Sistema de citas" y "Conexión ERP"

  @s2
  Scenario: Cada servicio muestra su etiqueta de categoría
    Given la sección de servicios renderizada
    When leo la etiqueta de cada tarjeta
    Then son, respectivamente: "Presencia", "IA", "Marketing", "Visibilidad", "Operativa" e "Integración"

  @s3
  Scenario: Cada servicio muestra dos características
    Given una tarjeta de servicio cualquiera
    When cuento sus características (con check)
    Then hay exactamente dos

  @s4
  Scenario: Cada servicio muestra un bloque "Ejemplo"
    Given una tarjeta de servicio cualquiera
    When busco su nota inferior
    Then existe un bloque etiquetado "Ejemplo" con un texto descriptivo

  @s5
  Scenario: El texto "Reservar" del mockup es decorativo
    Given la tarjeta "Desarrollo web" con su mockup ilustrado
    When busco un botón accesible con nombre "Reservar"
    Then no existe (el texto vive dentro del mockup, no es un control real)
