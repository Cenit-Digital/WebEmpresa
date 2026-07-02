# project-spec.md — WebEmpresa (Cénit Digital)

Spec conversada por feature. El `spec_partner` amplía este archivo antes de
cada feature `"sdd": true`; el `gherkin_author` lo destila en `features/`.

---

## #1 · infra_base — Repositorio base (WEB-2)

**Propósito.** Dejar el repositorio y el proyecto base del que parte toda la
web, y fijar el stack estándar de empresa.

**Comportamiento.** Proyecto Vite + React + TypeScript con SSG
(vite-react-ssg), SCSS Modules + design tokens, Radix UI, fuentes self-hosted,
y la capa Harness/SDD para el desarrollo asistido por IA.

**Contrato.**

- `pnpm dev` arranca el sitio en local; `pnpm build` prerenderiza a HTML
  estático en `dist/`.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` y `pnpm mutation`
  terminan en verde, sin warnings.
- Cada página lleva su `<title>` y `description` propios en el HTML estático.

**Decisiones.**

- **Vite + React + SCSS + pnpm** en lugar de Next.js + Tailwind (ver `DE-002`,
  supersede a `DE-001`). Razón: preferencia de equipo y simplicidad del build;
  el SEO se preserva con SSG (vite-react-ssg). Alternativa descartada: SPA pura
  (mal SEO para una web corporativa).
- **SSG con vite-react-ssg** en lugar de SPA. Alternativa descartada: Vike
  (más potente pero más complejo de lo necesario aquí).
- **Radix UI + SCSS Modules** en lugar de shadcn/ui (que depende de Tailwind).
- **Stryker + Vitest** como equivalente JS de la prueba de mutación.

**Estado.** `done`.

---

## #2 · nav — Navegación de la cabecera (WEB-4)

**Propósito.** Que cualquier visitante pueda llegar a cualquier sección de la
home desde la cabecera, en escritorio y en móvil.

**Comportamiento.** Logotipo enlazado a `/`; nav de escritorio con
Servicios/Sectores/Paquetes/Contacto + botón "Hablamos"; cabecera `sticky`;
menú móvil (hamburguesa) con panel deslizante que se cierra al pulsar `✕`, al
pulsar un enlace, o al pulsar el fondo.

**Decisiones.**

- El panel móvil del HTML de referencia solo traía Servicios/Contacto/Paquetes
  (omitía Sectores respecto al nav de escritorio). **Resuelto en la puerta
  humana (2026-07-03): Pablo confirma que era un olvido del diseño**, así que
  el panel móvil incluye también "Sectores" y lista los cuatro enlaces en el
  orden del nav de escritorio (Servicios, Sectores, Paquetes, Contacto). `@s5`
  actualizado en consecuencia.
- La forma del logotipo (icono "Órbita") sigue lo ya implementado en
  `Logo.tsx`/`RF-MARCA-001`, no el icono de nav que aparece en el HTML de
  referencia (ese HTML es anterior a la votación del logo — ver nota en
  `RF-MARCA-001`).

**Estado.** `spec_ready`.

---

## #3 · theme_selector — Selector de tema Claro/Oscuro/Sistema (WEB-4)

**Propósito.** Que el visitante pueda leer la web en el modo que prefiera, o
dejar que siga el ajuste de su sistema operativo, sin parpadeos ni sorpresas
al volver a entrar.

**Comportamiento.** Tres estados (Claro/Oscuro/Sistema), persistidos en
`localStorage` bajo `cenit-theme` (ausencia de clave = modo "Sistema"),
aplicados antes del primer pintado (anti-FOUC), y reactivos en vivo a
`prefers-color-scheme` mientras el modo activo es "Sistema".

**Decisiones.**

- Paleta: **Bosque & Limón** (claro) / **Noche & Oro** (oscuro) — confirmado
  por Pablo, corregido en `RF-MARCA-001` (antes decía por error Teal
  Profundo/Océano y Coral). Pendiente aplicar en `src/styles/_tokens.scss`.
- Sin runner de accesibilidad de color específico: se asume que el contraste
  de ambas paletas ya viene validado desde `RF-MARCA-001`.

**Estado.** `spec_ready`.

---

## #4 · footer — Pie de página (WEB-4)

**Propósito.** Que el copyright, el aviso legal y el contacto estén siempre
accesibles desde el pie, en cualquier página.

**Comportamiento.** Copyright con año dinámico; enlace a `/aviso-legal`;
enlace `mailto:` a `hola@cenitdigital.es`.

**Decisiones.** Los enlaces "Privacidad" y "Cookies" que aparecen en el HTML
de referencia no se incluyen aquí: no hay páginas de destino creadas ni
ticket de Jira que las cubra. Quedan fuera de alcance de WEB-4 hasta que se
abra ese ticket.

**Estado.** `spec_ready`.

---

## #5 · layout_accesibilidad — Accesibilidad y SEO de base del layout (WEB-4)

**Propósito.** Que la web sea usable con teclado desde el primer tabulado y
que cada página se identifique correctamente en buscadores.

**Comportamiento.** Enlace "Saltar al contenido" como primer elemento
enfocable, que mueve el foco a `#contenido`; `<title>` propio por ruta
(`buildPageTitle`, ya implementado y testeado en `infra_base`).

**Estado.** `spec_ready`.

---

## #6 · hero — Hero de la home (WEB-5)

**Propósito.** Que un visitante entienda en cinco segundos qué ofrece Cénit
Digital y tenga un primer paso claro (ver paquetes o hablar con nosotros).

**Comportamiento.** Eyebrow + titular + subtítulo + dos CTA + fila de 4
estadísticas (24h / +30 / 100% / 5★).

**Estado.** `spec_ready`.

---

## #7 · servicios — Sección de servicios (WEB-5)

**Propósito.** Mostrar el catálogo de servicios con un ejemplo real por
servicio, para que el visitante entienda el resultado, no solo la promesa.

**Comportamiento.** 6 tarjetas (Desarrollo web, Chatbot WhatsApp, Gestión de
RRSS, SEO local, Sistema de citas, Conexión ERP), cada una con etiqueta,
título, descripción, dos características y un bloque "Ejemplo".

**Decisiones.** El texto "Reservar" que aparece en el HTML junto a la primera
tarjeta es decorativo (vive dentro del mockup ilustrado, no es un botón real)
— no se especifica como comportamiento.

**Estado.** `spec_ready`.

---

## #8 · sectores — Sección de sectores (WEB-5)

**Propósito.** Comunicar en qué sectores está especializada Cénit Digital,
para que el visitante se autoidentifique rápido.

**Comportamiento.** 4 tarjetas (Veterinarias, Servicios de estética, Clínicas
dentales, Fisioterapeutas) con nombre y descripción, más la nota "Selección
inicial — abierta a debate según el plan comercial."

**Estado.** `spec_ready`.

---

## #9 · paquetes — Sección de paquetes (WEB-5)

**Propósito.** Que el visitante compare los tres niveles de servicio y pida
presupuesto para el que le encaje.

**Comportamiento.** 3 tarjetas (Presencia Digital, Presencia Activa, Negocio
Conectado) con tagline, lista de características, insignia "Más elegido" solo
en Presencia Activa, y botón "Solicitar presupuesto" en las tres.

**Decisiones.** El diseño final no muestra precios fijos por paquete —solo
"Solicitar presupuesto"—, mientras que el criterio de aceptación de WEB-5 en
Jira dice "precios del plan cargados". No se han inventado precios: si Cénit
Digital quiere precios fijos visibles, es una decisión de producto pendiente,
no un dato que estuviera en el HTML de referencia.

**Estado.** `spec_ready`.

---

## #10 · contacto_seccion — Contenido de la sección de contacto (WEB-5)

**Propósito.** Que el visitante sepa qué le van a pedir antes de escribir, y
vea que hay un canal directo (teléfono) además del formulario.

**Comportamiento.** Intro + promesa de respuesta en 24h + teléfono +
formulario visual con sus 5 campos (Nombre*, Correo electrónico*, Teléfono,
Sector, ¿Qué necesitas?) y las opciones del desplegable de Sector.

**Decisiones.** Esta feature cubre solo la estructura visual del formulario.
La validación, el envío real por Resend y el antispam son `contact_form`
(WEB-6) — separación que sigue la división de los propios criterios de
aceptación de WEB-5 y WEB-6 en Jira.

**Estado.** `spec_ready`.

---

## #11 · contact_form — Formulario de contacto funcional con Resend (WEB-6)

**Propósito.** Que el formulario envíe de verdad, valide lo mínimo necesario,
y no sea un canal abierto de spam.

**Comportamiento.** Validación (Nombre y Correo electrónico obligatorios;
Teléfono, Sector y mensaje opcionales; formato de email válido), envío real
vía Resend, botón deshabilitado durante el envío, formulario que se limpia
tras éxito, mensaje de error con datos conservados tras fallo, y honeypot
antispam.

**Decisiones.**

- **Honeypot** en lugar de rate-limit (Jira permitía cualquiera de los dos).
  Razón: no requiere infraestructura adicional (sin contador por IP) y es
  suficiente para el volumen esperado de un formulario de contacto. Si el
  honeypot no filtra spam suficiente en producción, rate-limit sería el
  siguiente paso, no un sustituto.

**Estado.** `spec_ready`.
