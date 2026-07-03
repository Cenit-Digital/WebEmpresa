Feature: Sección de sectores
  Como visitante quiero ver en qué sectores está especializada Cénit Digital,
  para autoidentificarme rápido si mi negocio encaja.

  @s1
  Scenario: Muestra los cuatro sectores
    Given la sección de sectores renderizada
    When leo los nombres de las tarjetas
    Then son: "Veterinarias", "Servicios de estética", "Clínicas dentales" y "Fisioterapeutas"

  @s2
  Scenario: Cada sector muestra su descripción
    Given una tarjeta de sector cualquiera
    When leo su cuerpo
    Then muestra un párrafo de descripción no vacío

  @s3
  Scenario: Muestra la nota de selección inicial
    Given la sección de sectores renderizada
    When leo el texto bajo la rejilla
    Then contiene "Selección inicial — abierta a debate según el plan comercial."
