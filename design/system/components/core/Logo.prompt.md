# Logo

Logotipo de Cénit Digital: icono "Órbita" (anillo + onda degradada + punto cénit) con wordmark opcional. Se adapta solo al tema activo.

```jsx
<Logo />                        // cabecera (40px, con wordmark)
<Logo size={38} />              // footer
<Logo withWordmark={false} />   // solo el icono (favicon, avatar)
```

- Todos los colores salen de tokens (`--color-primary`, `--color-secondary`, `--color-ring`, `--color-zenith`, `--color-logo-ink`, `--color-logo-sub`): no lo recolores con hex fijos.
- El icono es `aria-hidden`; envuélvelo en un enlace a inicio con texto accesible.
- Cada instancia usa un id de degradado único (seguro con varios logos por página).
