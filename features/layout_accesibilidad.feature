Feature: Accesibilidad y SEO de base del layout
  Como usuario de teclado quiero saltar directo al contenido y que cada página
  se identifique bien, para navegar rápido y aparecer correctamente en buscadores.

  @s1
  Scenario: El primer elemento enfocable es "Saltar al contenido"
    Given la home recién cargada
    When pulso Tab una vez desde el inicio del documento
    Then el elemento con foco es un enlace con texto "Saltar al contenido"

  @s2
  Scenario: El enlace de salto mueve el foco al contenido
    Given el foco en el enlace "Saltar al contenido"
    When lo activo
    Then el destino "#contenido" recibe el foco

  @s3
  Scenario: La home lleva su propio título
    Given la ruta "/"
    When se prerenderiza la página
    Then el <title> del documento es exactamente "Cénit Digital — Soluciones digitales para pymes"

  @s4
  Scenario: Las páginas interiores llevan su propio título
    Given la ruta "/aviso-legal"
    When se prerenderiza la página
    Then el <title> del documento es exactamente "Aviso legal — Cénit Digital"
