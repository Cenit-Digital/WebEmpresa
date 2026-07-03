# Nav

Cabecera sticky de Cénit Digital: logo enlazado a inicio, enlaces de sección, toggle de tema y CTA "Hablamos". En móvil (≤820px) colapsa a hamburguesa con panel deslizante.

```jsx
<Nav />
<Nav ctaLabel="Empezar" ctaHref="#contacto" onToggleTheme={miToggle} />
```

- Responsive por JS (`matchMedia`): en escritorio muestra los enlaces; en móvil, la hamburguesa → panel que cierra al pulsar enlace, aspa o fondo.
- Si no pasas `onToggleTheme`, alterna `data-theme` en `<html>` (claro ⇄ oscuro).
- Compone el componente `Logo`. Fondo `--color-band`.
