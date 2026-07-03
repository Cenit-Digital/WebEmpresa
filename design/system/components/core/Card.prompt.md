# Card

Tarjeta de contenido base para servicios, sectores y paquetes.

```jsx
<Card tag="IA" title="Chatbot WhatsApp">
  Asistente con IA que atiende 24/7 y agenda citas.
</Card>

<Card featured title="Presencia Activa" footer={<Button href="#contacto">Solicitar presupuesto</Button>}>
  Presencia + marketing para crecer cada mes.
</Card>
```

- `featured` añade borde `--color-primary`, `--shadow` e insignia "Más elegido" (personalizable con `badge`).
- `footer` se ancla abajo — ideal para el CTA, de modo que las tarjetas de una fila igualan altura.
- Padding 32×28, radio `--radius` (20px). Fondo `--color-card-bg`.
