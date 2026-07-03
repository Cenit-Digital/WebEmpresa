# Button

Botón de acción de Cénit Digital. Úsalo para CTAs (hero, paquetes, formulario) y acciones de navegación.

```jsx
<Button href="#paquetes">Ver paquetes</Button>
<Button variant="secondary" href="#contacto">Hablar con nosotros</Button>
<Button variant="ghost" size="sm">Cancelar</Button>
```

- `variant`: `primary` (relleno, la acción principal), `secondary` (contorno en primary), `ghost` (neutro con borde suave).
- `size`: `md` (CTAs, por defecto) o `sm` (barra de navegación).
- Con `href` se renderiza como `<a>`; sin él, como `<button>`.
- Radio siempre pill (999px). En hover el diseño aplica `filter:brightness(1.08)`.
