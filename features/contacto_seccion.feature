# Pertenece a WEB-5 (home_sections). El envío funcional del formulario
# (validación, Resend, antispam) es WEB-6 — ver contact_form.feature.
Feature: Contenido de la sección de contacto
  Como visitante de la web de Cénit Digital
  quiero ver cómo contactar y qué datos me van a pedir
  para decidirme a escribir sin sorpresas.

  @s1
  Scenario: Intro de la sección de contacto
    Given estoy en la sección "Contacto"
    When leo la introducción
    Then veo el titular "Cuéntanos qué necesita tu negocio"
    And veo el texto "Primera consulta gratuita y sin compromiso. Te llamamos y te respondemos en menos de 24 horas."

  @s2
  Scenario: La sección de contacto muestra el teléfono
    Given estoy en la sección "Contacto"
    When miro la sección
    Then veo el teléfono "+34 600 00 00 00"

  @s3
  Scenario: El formulario muestra todos sus campos
    Given estoy en la sección "Contacto"
    When miro el formulario
    Then veo los campos "Nombre", "Correo electrónico", "Teléfono", "Sector" y "¿Qué necesitas?"

  @s4
  Scenario: Los campos obligatorios están marcados
    Given estoy en la sección "Contacto"
    When miro el formulario
    Then los campos "Nombre" y "Correo electrónico" están marcados como obligatorios
    And los campos "Teléfono", "Sector" y "¿Qué necesitas?" no lo están

  @s5
  Scenario: El desplegable de sector ofrece las opciones del negocio
    Given estoy en el formulario de la sección "Contacto"
    When abro el desplegable "Sector"
    Then veo las opciones "Veterinaria", "Servicios de estética", "Clínica dental", "Fisioterapia" y "Otro"
    And la opción visible por defecto es "Selecciona tu sector"
