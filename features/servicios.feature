# Pertenece a WEB-5 (home_sections)
# Nota: el "Reservar" que aparece en el HTML junto al primer servicio es
# decorativo (vive dentro de la ilustración de mockup, no es un botón
# real de la web) — no se incluye como escenario.
Feature: Sección de servicios
  Como visitante de la web de Cénit Digital
  quiero ver los servicios que ofrece Cénit Digital, con un ejemplo real de cada uno
  para entender qué puede hacer por mi negocio.

  @s1
  Scenario: Intro de la sección de servicios
    Given estoy en la sección "Servicios"
    When leo la introducción
    Then veo la etiqueta "Lo que hacemos"
    And veo el titular "Servicios que transforman negocios locales"

  @s2
  Scenario Outline: Cada tarjeta de servicio muestra su etiqueta, título, descripción y ejemplo
    Given estoy en la sección "Servicios"
    When leo la tarjeta con la etiqueta "<etiqueta>"
    Then el título de la tarjeta es "<titulo>"
    And la descripción contiene "<descripcion_contiene>"
    And la tarjeta muestra un bloque "Ejemplo" con el texto "<ejemplo>"

    Examples:
      | etiqueta    | titulo            | descripcion_contiene                                    | ejemplo                                                                      |
      | Presencia   | Desarrollo web    | Webs rápidas, con SEO nativo y diseño profesional        | Tienda online con reservas para una clínica veterinaria, lista en 3 semanas. |
      | IA          | Chatbot WhatsApp  | Asistente con IA que atiende a tus clientes 24/7          | El bot responde y agenda solo; deriva a una persona cuando hace falta.       |
      | Marketing   | Gestión de RRSS   | Contenido semanal, publicación y gestión de comentarios   | Calendario de contenidos + informe mensual de alcance e interacción.        |
      | Visibilidad | SEO local         | Posicionamiento en Google Maps y búsquedas locales        | Apareces en el top del mapa cuando buscan tu servicio cerca.                |
      | Operativa   | Sistema de citas  | Reservas online, recordatorios automáticos por WhatsApp   | Menos llamadas y cero huecos: el cliente reserva 24/7 desde el móvil.       |
      | Integración | Conexión ERP      | Conectamos tu web o chatbot con tu ERP                    | Tu web habla con tu ERP: presupuesto y stock sin teclear nada.              |

  @s3
  Scenario Outline: Cada tarjeta de servicio muestra sus dos características
    Given estoy en la sección "Servicios"
    When leo la tarjeta titulada "<titulo>"
    Then veo las características "<feature_1>" y "<feature_2>"

    Examples:
      | titulo           | feature_1                           | feature_2                               |
      | Desarrollo web    | Diseño 100% a medida y responsive   | Dominio, hosting y SSL incluidos        |
      | Chatbot WhatsApp   | Atiende y agenda 24/7               | Deriva a una persona cuando hace falta  |
      | Gestión de RRSS    | Calendario de contenidos mensual    | Informe de alcance e interacción        |
      | SEO local          | Ficha de Google Business optimizada | Informe mensual de posiciones           |
      | Sistema de citas   | Reservas online 24/7                | Recordatorios automáticos               |
      | Conexión ERP       | Integración con Holded, Odoo y más  | Stock y pedidos en tiempo real          |
