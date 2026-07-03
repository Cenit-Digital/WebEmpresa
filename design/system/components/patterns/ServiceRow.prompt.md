# ServiceRow

Fila de servicio en zigzag: tarjeta descriptiva + mockup ilustrativo + nota "Ejemplo". Base de la sección de servicios de la home.

```jsx
<ServiceRow
  tag="IA"
  title="Chatbot WhatsApp"
  desc="Asistente con IA que atiende 24/7, resuelve dudas y agenda citas."
  features={['Atiende y agenda 24/7', 'Deriva a una persona cuando hace falta']}
  example="El bot responde y agenda solo; deriva cuando hace falta."
  mockup={<MiMockupChat />}
  reverse
/>
```

- `reverse` alterna el lado del mockup (para el ritmo zigzag). En móvil apila a una columna.
- `mockup` es libre: pásale el panel ilustrado que quieras (ocupa un recuadro 16:10 con borde y sombra).
- Cada característica se lista con un check en `--color-primary`.
