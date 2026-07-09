# Veredicto del juez — nav (BUGFIX/HARDENING: cabecera responsive por CSS)

Feature: nav (id 2) — bugfix/hardening, NO feature nueva.
Fecha: 2026-07-09
Veredicto: APROBADO

El cambio corrige un bug real de hidratacion SSG (render responsive ramificado
por matchMedia) sustituyendolo por un toggle 100% CSS (@media) que preserva el
observable de features/nav.feature. Las puertas duras pasan y los tests siguen
mordiendo. Se aprueba. Quedan tres nits de documentacion (no bloqueantes,
detallados al final).

## 1) Puerta verde (C4)

- pnpm typecheck -> OK, 0 errores.
- pnpm lint -> OK, 0 warnings.
- pnpm test -> 175/175 en 22 ficheros, 0 fallos.

## 2) Contrato @s1-@s8 PRESERVADO (C6)

Mapa escenario -> test biting (cada Then del .feature tiene un test que lo mata):

- @s1 logo -> "/"  : Header.test.tsx:59 (+ :81 logo animado) -> toHaveAttribute('href','/') + accessible name.
- @s2 nav escritorio enlaces + CTA : HeaderNav.test.tsx:38 -> toEqual([...]) array EXACTO de 5 pares [label,href], incluida "Hablamos"->#contacto.
- @s3 sticky top:0 : Header.test.tsx:67 -> CSS-como-texto position: sticky + top: 0.
- @s4 movil: enlaces escritorio no visibles + boton "Menu" : HeaderNav.test.tsx:68 (Menu presente) + :76 (CSS invierte base<->@media).
- @s5 abrir menu -> 4 enlaces en orden : MobileMenu.test.tsx:16 -> toEqual(['Servicios','Sectores','Paquetes','Contacto']).
- @s6 cierra con boton "Cerrar" : MobileMenu.test.tsx:33 -> dialog fuera del documento.
- @s7 cierra al pulsar enlace : MobileMenu.test.tsx:46.
- @s8 cierra al pulsar fondo : MobileMenu.test.tsx:57.

@s4 satisfecho por display:none, no por ausencia del DOM -> correcto: el Then
reza "los enlaces de escritorio NO son visibles", no "no estan en el arbol". Con
render de ambos clusteres, la invisibilidad la garantiza
@media(max-width:767px){.nav{display:none}}, que HeaderNav.test.tsx:95 asevera
literalmente. Sin regresion observable.

## 3) Los tests siguen mordiendo — NO gutted

- @s2 (:45): toEqual de 5 pares exactos -> mata mutaciones de orden y href.
- @s6 (:65): orden exacto ['Servicios','Sectores','Paquetes','Contacto','TEMA','Hablamos'] con within(nav) -> mata reordenamientos y fuga del tema al otro cluster.
- @s4 CSS-como-texto (:91-96): asevera las CUATRO reglas (base .nav=flex, base .mobile=none, @media .nav=none, @media .mobile=flex). Borrar .nav{display:none} del @media o poner .mobile{display:flex} en base -> falla.
- @s4 anti-regresion (:99-111): exige EXACTAMENTE 2 botones de tema (toHaveLength(2)) y que el tema conviva con "Menu" en el mismo cluster -> mas fuerte que el test previo.
- @s10 guard (overflow-guard.test.ts:24,34): #root con overflow-x: clip Y ausencia de overflow-x: hidden en html/body/#root (evita reintroducir el que rompe sticky).

Las aserciones eliminadas eran obligadas de cambiar, no un debilitamiento: el
viejo queryByRole('button',{name:'Menu'}).not.toBeInTheDocument() (escritorio) y
queryByRole('navigation').not.toBeInTheDocument() (movil) codificaban la vieja
ramificacion por JS (clusteres mutuamente excluyentes). Bajo el diseno CSS-driven
ambos clusteres coexisten en el DOM por definicion; esas aserciones serian FALSAS
hoy. Las nuevas codifican el contrato nuevo (correcto) y anaden fuerza donde
pueden. El patron CSS-como-texto es el ya establecido en el repo (Header.test
@s3, logo-draw.test, Hero.test) porque jsdom no hace layout; la verificacion de
layout real la cubre la matriz de navegador (conventions.md Responsive p.4).

## 4) Calidad y limpieza (C3, lente de artesano)

- Codigo muerto eliminado: src/lib/useIsMobile.ts + .test.tsx borrados; grep
  useIsMobile src/ -> 0 referencias; stryker.config.json:16 retira el fichero del
  mutate (Stryker fallaria al mutar un inexistente). Correcto.
- Colores via token: .cta usa var(--color-primary) / var(--color-on-primary)
  (HeaderNav.module.scss:18-19). Sin colores literales. Sin numeros magicos nuevos.
- overflow-x: clip (no hidden) en #root (_reset.scss:46-48) -> recorta sin crear
  scroll container, preserva position: sticky (@s3). Ubicacion en #root coincide
  con docs/conventions.md Responsive p.2 y esta verificada en navegador.
- Componente corto, sin ramas, un componente por archivo; comentario cita
  docs/conventions.md Responsive y explica la causa raiz de hidratacion.
- Meta viewport intacto: index.html:5 = width=device-width, initial-scale=1.0
  (sin user-scalable=no). Sin regresion.
- Sin console.log, sin TODOs, sin any.

## 5) Disciplina TDD (C6)

progress/tdd_nav_css_responsive.md documenta Rojo->Verde->Refactor por ciclo
(A: guard @s10; B: cabecera CSS @s2/@s4/@s6; C: cluster @s5). No hay produccion
que ningun test rojo pidiera: #root{overflow-x:clip}, las reglas @media y el
.cluster envolvente estan todos exigidos por un test (overflow-guard @s10,
HeaderNav @s4, Header @s5 respectivamente).

## 6) Recorrido CHECKPOINTS

- C1 arnes completo — [x]
- C2 estado coherente — [x] (nav unica en curso; current.md describe la sesion)
- C3 arquitectura/limpieza — [x] (sin any, sin dead code, sin console.log)
- C4 verificacion real — [x] (typecheck/lint/test verde, 175 tests > 0)
- C6 contrato Gherkin — [x] (cada @s1-@s8 con test que muerde). Ver nits N1/N3.
- C5/C7 — fuera de mi alcance (cierre de sesion / mutacion: los valida el
  mutation_tester DESPUES de esta aprobacion; ambas puertas deben pasar).

## Nits (deuda de documentacion — NO bloqueantes, no motivan rechazo)

- N1 — Divergencia de tags @s5/@s6 (preexistente). Header.test.tsx:36 (@s5 "dos
  grupos") y HeaderNav.test.tsx:54 (@s6 "orden del cluster") reutilizan tags que
  en features/nav.feature significan "abrir menu" (@s5) y "cerrar con boton"
  (@s6). No hay hueco de cobertura: MobileMenu.test.tsx posee los @s5-@s8 con el
  significado del .feature. La colision es anterior a este bugfix. Recomendado:
  desambiguar los tags estructurales en una limpieza futura.
- N2 — Mencion stale a html en docs de progreso. progress/current.md:35 (F2) y
  :81-88 (spec), y progress/tdd_nav_css_responsive.md:16,93 dicen guard en
  html{overflow-x:clip}, pero la convencion autoritativa docs/conventions.md
  Responsive p.2 y la implementacion + test usan #root. El CODIGO es correcto
  (#root, verificado en navegador); tdd_...:31-37 documenta la correccion
  empirica final a #root, asi que es trazable, solo inconsistente en sus
  lineas-resumen. Deuda doc, no defecto de codigo.
- N3 — @s10 reutilizado sin escenario en el .feature. overflow-guard.test.ts usa
  @s10, tag que tambien pertenece a la feature de fidelidad/logo
  (logo-draw.test.ts:58). current.md habla de "garantias @s9/@s10 anadidas" pero
  features/nav.feature NO se extendio con esos escenarios. Al ser hardening (se
  preserva el observable, no se anade Gherkin), los guards son redes de seguridad
  extra aceptables; idealmente nav.feature ganaria los escenarios o el guard
  usaria un tag propio de nav.

Ninguno es condicion de rechazo dura: arnes en verde, todo @s del .feature con
test que muerde, y sin produccion que ningun test exija.

Veredicto: APROBADO. Pasa a mutation_tester (C7) antes de marcar done.
