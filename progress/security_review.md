# Security Review — Formulario de contacto (WEB-6)

Rama: `feat/design-system` · Fecha: 2026-07-07 · Alcance: frontera de confianza
del formulario (`Contacto.tsx`, `src/lib/contact.ts`, `api/contact.ts`).

Veredicto: **1 BLOQUEANTE (🟡 alto) · 4 MEJORAS**. El único fallo real es que el
endpoint serverless es un **relé de correo abierto sin control antiabuso**. El
resto de la frontera está bien: secretos limpios, errores no filtran detalle, y
la temida inyección de cabeceras NO es explotable con Resend.

---

## 🟡 BLOQUEANTE

### B1 — `/api/contact` es un relé de email abierto: honeypot solo en cliente + sin rate limiting

`api/contact.ts:21-68` · `src/components/Contacto.tsx:34-37`

El honeypot (`empresa`) se comprueba **solo en el cliente** (`Contacto.tsx:34`);
nunca llega al servidor y `api/contact.ts` no lo mira. Un atacante hace
`curl -X POST /api/contact -d '{"nombre":"x","email":"a@b.c"}'` en bucle y:

- salta el honeypot por completo (bot spam directo a tu bandeja `CONTACT_TO`),
- **consume cuota/dinero de Resend** sin límite (no hay rate limiting ni por IP
  ni global),
- puede usar tu dominio verificado para reenviar contenido arbitrario (el `text`
  incluye `mensaje` sin límite).

Cómo se corrige (una línea conceptual): recibir y comprobar el honeypot también
en el server (`if (body.empresa) return 200 ok silencioso`) **y** añadir rate
limiting (Vercel `@vercel/firewall` / Upstash ratelimit por IP, p. ej. 5/min).
El honeypot server-side es el mínimo imprescindible; el rate limit es lo que
frena el abuso automatizado real.

---

## 🟠 MEJORAS

### M1 — Sin validación de formato de email en el servidor

`api/contact.ts:35-38`

El server solo exige presencia (`email === ''`), no formato. `EMAIL_RE` vive solo
en el cliente (`src/lib/contact.ts:17`), que se salta con un POST directo.
`replyTo: email` con basura la rechaza Resend (devuelve `error` → 502), así que no
rompe nada, pero conviene revalidar el formato en la frontera server para no
depender de Resend. Fix: reusar el mismo regex en `api/contact.ts` antes de enviar.

### M2 — Sin límite de longitud en los campos (payload grande)

`api/contact.ts:34-62`

Ningún campo tiene tope. Vercel corta el body ~4.5 MB, así que hay un techo, pero
nada impide un `subject`/`mensaje` de decenas de KB en cada correo. Fix: truncar o
rechazar (`nombre.length > 120`, `mensaje.length > 5000`, etc.) antes de `send()`.

### M3 — Inyección de cabeceras: NO explotable hoy, pero sin defensa en profundidad

`api/contact.ts:52-53` (`replyTo: email`, `subject: ...${nombre}`)

Verificado seguro: el SDK de Resend usa su **API HTTP (JSON)**, no SMTP crudo, y
construye/codifica las cabeceras MIME en su backend. Un `\n`/CRLF o un `Bcc:` en
`nombre`/`email` viaja como valor JSON y se codifica (RFC 2047), no inyecta
cabeceras. Además `to`/`from` salen de env, no del usuario → sin recipient
injection. **No es un fallo actual.** Recomendación (defensa en profundidad, 1
línea): `strip` de `\r\n` en `nombre`/`email` antes de interpolarlos, para que
siga siendo seguro si algún día migran a nodemailer/SMTP.

### M4 — Sin comprobación de `Content-Type` ni CSRF-token (aceptable, se documenta)

`api/contact.ts:23-32`

No hay CORS explícito (bien: same-origin por defecto en navegador) ni token CSRF,
pero **no hace falta**: el endpoint no usa cookies ni sesión, así que no hay estado
autenticado que un CSRF pueda abusar. El vector real "cualquiera puede POST" es
justo B1 (spam), que se mitiga con honeypot server + rate limit, no con CSRF token.
Se deja anotado para que no se re-abra como hallazgo.

---

## ✅ Verificado correcto (sin acción)

- **Secretos:** `RESEND_API_KEY` solo se lee en `api/contact.ts:40`
  (`process.env`, sin prefijo `VITE_`), nunca entra al bundle cliente. Grep de
  `re_*`/`VITE_RESEND`/claves hardcodeadas → 0 resultados. `git ls-files` solo
  trackea `.env.example`; `.env`/`.env.*` gitignored (`.gitignore:16-18`). Sin
  claves reales en repo.
- **Manejo de errores:** `api/contact.ts:66` devuelve `'No se pudo enviar'`
  genérico; el objeto `error` de Resend **no** se filtra al cliente. 400/405/500/502
  bien diferenciados.
- **Method allow-list:** `api/contact.ts:23-25` rechaza todo lo que no sea POST (405).
- **Cuerpo malformado:** `api/contact.ts:28-32` captura JSON inválido → 400.
- **XSS:** ningún `dangerouslySetInnerHTML`; entrada de usuario solo va a `value`
  controlado de inputs React (auto-escapado). Sin riesgo de pintado.
- **Enlaces externos:** los `<a>` del formulario son `tel:`/internos; no hay
  `target="_blank"` en esta frontera.
