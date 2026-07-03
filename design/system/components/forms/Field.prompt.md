# Field

Campo de formulario (etiqueta + control) para el formulario de contacto y similares.

```jsx
<Field label="Nombre" required placeholder="Tu nombre" />
<Field label="Correo electrónico" type="email" required placeholder="tu@email.com" />
<Field label="Sector" as="select" options={['Selecciona tu sector','Veterinaria','Servicios de estética','Clínica dental','Fisioterapia','Otro']} />
<Field label="¿Qué necesitas?" as="textarea" placeholder="Cuéntanos tu proyecto..." />
```

- `as`: `input` (por defecto), `textarea` o `select`.
- `required` pinta el asterisco en `--color-primary` y marca el control.
- Control sobre `--color-surface`, borde `--color-border`, radio 11px. En foco, el diseño cambia el borde a `--color-primary`.
