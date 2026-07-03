Feature: Sección de paquetes
  Como visitante quiero comparar los tres niveles de servicio y pedir presupuesto
  del que me encaje, para dar el siguiente paso sin fricción.

  # El diseño final NO muestra precios fijos: solo "Solicitar presupuesto".
  # Discrepancia con WEB-5 señalada; no se inventan precios (decisión de producto).

  @s1
  Scenario: Muestra los tres paquetes en orden
    Given la sección de paquetes renderizada
    When leo los nombres de las tarjetas
    Then son, en orden: "Presencia Digital", "Presencia Activa" y "Negocio Conectado"

  @s2
  Scenario: Solo "Presencia Activa" lleva la insignia "Más elegido"
    Given la sección de paquetes renderizada
    When busco la insignia "Más elegido"
    Then aparece exactamente una vez y pertenece a la tarjeta "Presencia Activa"

  @s3
  Scenario: Cada paquete muestra su tagline y su lista de características
    Given una tarjeta de paquete cualquiera
    When leo su contenido
    Then muestra un tagline y una lista de características no vacía

  @s4
  Scenario: Cada paquete lleva su CTA a contacto
    Given cada tarjeta de paquete
    When localizo su botón de acción
    Then es un enlace "Solicitar presupuesto" cuyo href es "#contacto"

  @s5
  Scenario: No se muestran precios fijos
    Given la sección de paquetes renderizada
    When busco símbolos de precio (por ejemplo "€" o "/mes")
    Then no aparece ninguno
