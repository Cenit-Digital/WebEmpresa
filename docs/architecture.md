# Arquitectura — qué significa "buen trabajo" aquí

WebEmpresa es la web corporativa de Cénit Digital y el **repositorio base**
del stack estándar de empresa. Sitio estático generado (SSG) con islas de
interactividad en cliente.

## Stack

| Capa           | Herramienta                                                 |
| -------------- | ----------------------------------------------------------- |
| Framework      | React 19 + TypeScript                                       |
| Bundler / dev  | Vite 7                                                      |
| SSG / rutas    | vite-react-ssg + react-router-dom v6                        |
| Estilos        | SCSS (SCSS Modules) + design tokens (CSS custom properties) |
| Primitivas UI  | Radix UI (`radix-ui`)                                       |
| Fuentes        | @fontsource (Outfit, DM Sans)                               |
| Tests          | Vitest + Testing Library + jsdom                            |
| Mutación       | StrykerJS (vitest-runner)                                   |
| Lint / formato | ESLint 9 (flat) + Prettier                                  |
| Gestor         | pnpm                                                        |

(Norma de empresa: `RF-STACK-001` y `DE-002` en Confluence.)

## Capas y dependencias

```
src/
├── main.tsx          # entrada: ViteReactSSG(routes) + estilos + fuentes
├── App.tsx           # definición de rutas (RouteRecord[])
├── pages/            # una página por ruta; SEO con <Head>
├── components/       # componentes de UI reutilizables (PascalCase, 1 por archivo)
├── lib/              # lógica pura y utilidades (sin JSX, fácil de testear y mutar)
└── styles/           # tokens, reset y base globales (@use)
```

Regla de dependencias: `pages` usa `components` y `lib`; `components` usa
`lib`; `lib` no importa de `components` ni de `pages` (lógica pura, aislada y
testeable). La lógica con valor de negocio vive en `lib/` para poder testearla
y mutarla sin renderizar.

## SSG y SEO

- El build (`pnpm build`) prerenderiza cada ruta a HTML estático: el contenido
  viaja en el HTML (bueno para SEO y para no-JS).
- El SEO por página (`<title>`, `description`, Open Graph) se declara con
  `<Head>` (de vite-react-ssg) en cada página; `Layout` aporta los valores por
  defecto comunes.
- La interactividad que depende del navegador (p. ej. el conmutador de tema)
  se envuelve en `<ClientOnly>` para evitar desajustes de hidratación.

## Design tokens

Los colores y la tipografía salen de `RF-MARCA-001` (Confluence) y viven en
`src/styles/_tokens.scss` como **CSS custom properties**: modo claro (Teal
Profundo) en `:root`, modo oscuro (Océano y Coral) en `:root[data-theme='dark']`,
y la marca (Azul Noche y Menta) común. Los componentes consumen `var(--color-…)`,
nunca hex sueltos.
