# Mantenimiento autónomo

> Cómo se mantiene solo lo que rodea al producto —documentación y
> configuración—, de forma acotada y verificable, abriendo Pull Requests que
> **un humano siempre revisa y fusiona a mano**.
>
> El mandato que sigue el bot vive en `.github/AUTONOMOUS.md`. Esta página es la
> cara humana: qué es, qué NO es, cómo se pone en marcha, qué cuesta y por qué es
> seguro.

## Qué es

Un workflow programado (`.github/workflows/autonomous-evolve.yml`) que, lunes,
miércoles y viernes —siempre que no haya ya un PR suyo esperando revisión—,
lanza [Claude Code](https://github.com/anthropics/claude-code-action) dentro de
GitHub Actions con un único encargo: **encontrar UNA tarea real de
mantenimiento, hacerla con verificación real y abrir un Pull Request**. Nunca
fusiona, nunca empuja a `main`.

## Qué NO es (lo importante)

**No construye producto.** No toca `src/`, ni los tests, ni `features/`, ni
`feature_list.json`, ni `progress/`.

No es una limitación técnica: es el diseño del arnés. El pipeline SDD de este
repo (`AGENTS.md` §4) tiene una **puerta humana** en el medio —tú apruebas cada
`features/<name>.feature` antes de que se escriba una línea de producción—, y
`CLAUDE.md` la pone entre las reglas duras. Un bot que corre en un cron no tiene
a quién preguntar: cualquier feature que hiciera sería, por construcción, una
feature que se saltó tu puerta. Así que no se le deja.

Lo que sí hace es exactamente lo que `CLAUDE.md` ya declara como territorio libre
de orquestación: *"Cambios fuera de `src/` y tests (docs, configuración,
`progress/`) → puedes editarlos tú"* (menos `progress/`, que es bitácora de
sesiones humanas y materia prima del bot de memoria).

Tampoco actualiza dependencias (límite 8 del mandato): para eso está Dependabot,
y un bump puede romper producción de formas que la CI no ve.

> **Lo más probable es que la mayoría de los días no abra ningún PR**, y eso es
> el diseño funcionando, no un fallo. El límite 7 del mandato dice literalmente
> que cero propuestas es un resultado válido y frecuente: este repo está sano, y
> preferimos silencio a PRs de ruido.

## Arquitectura (los ficheros)

| Fichero | Rol |
| --- | --- |
| `.github/workflows/autonomous-evolve.yml` | El disparador. Deliberadamente "tonto": guarda, sincroniza memoria, apunta al mandato y para. |
| `.github/AUTONOMOUS.md` | El mandato. Alcance, **límites duros**, política de fusión y formato del PR. La fuente de verdad. |
| `.github/workflows/ci.yml` | La CI. Ejecuta `./init.sh` (el contrato de verificación del repo) + `pnpm build`. Es lo que corre sobre cada PR, suyo y tuyo. |
| `.github/workflows/guard-sensitive-paths.yml` | Guardián. Etiqueta `permissions-change` los PRs que tocan al bot, su correa o la verificación. |
| `.github/CODEOWNERS` | Fuerza revisión del dueño sobre esas rutas (efectivo cuando la protección de rama exige "review from Code Owners"). |

## Requisitos previos

1. **Secret `CLAUDE_CODE_OAUTH_TOKEN`** (*Settings → Secrets and variables →
   Actions*). El mismo token de `claude setup-token` que usan los bots hermanos:
   está ligado a tu cuenta, no al repo, pero **los secrets no se heredan entre
   repos**. ✅ Ya dado de alta.
2. **Secret `ORG_READ_TOKEN`** — fine-grained PAT de solo lectura, para
   sincronizar la memoria organizacional (`SistemaDeMemoriaUncleBob` es
   privado). ✅ Ya dado de alta. Si falta o caduca, el bot **no se rompe**:
   `scripts/sync-memoria.sh` es no bloqueante y el ciclo sigue sin memoria.
3. **La GitHub App de Claude** instalada en la organización
   (<https://github.com/apps/claude>). Es lo que hace que el push y el PR del bot
   se creen con el token de la App y que, por tanto, `ci.yml` corra sobre sus
   PRs.

## Puesta en marcha (checklist del dueño)

- [ ] **Proteger `main`** — *Settings → Branches → Add classic branch protection
      rule*, patrón `main`. **Es lo único que falta para que "solo abre PR" deje
      de ser una promesa de prompt.** Este repo es **público**, así que aquí sí
      se aplica (en los privados de la organización, con plan Free, GitHub avisa
      de que *"your rules won't be enforced… until you upgrade this organization
      to GitHub Team or Enterprise"*; por eso `SistemaDeMemoriaUncleBob` y
      `NailsLashStudioWeb` no pueden tenerla).

      **Copia la configuración que ya tiene `TemplateSSDUncleBob`** — está
      probada en la organización y no te bloquea:

    - ✅ *Require a pull request before merging* — esto es lo que impide al bot
      empujar a `main` directamente.
    - ✅ *Require approvals: 1* — impide además que el bot **fusione** su propio
      PR: la doc oficial dice literalmente *"Pull request authors cannot approve
      their own pull requests"*, y el bot no tiene a nadie que le apruebe.
    - ✅ *Require review from Code Owners* — activa el `CODEOWNERS` de este repo.
    - ✅ *Require status checks to pass before merging* → busca y añade
      **`Calidad (init.sh + build SSG)`**.
    - ☐ *Do not allow bypassing the above settings* — **déjalo SIN marcar**, como
      en la plantilla. Por defecto *"the restrictions of a branch protection rule
      don't apply to people with admin permissions to the repository"*: tú sigues
      pudiendo actuar directo en una urgencia (y merges tus propios PRs sin
      necesitar que nadie te apruebe), mientras que el bot —que no es admin— sí
      queda sujeto a la regla. Si algún día marcas esta casilla, siendo el único
      mantenedor te bloquearías a ti mismo: no podrías aprobar tus propios PRs ni
      saltarte el requisito.
    - ☐ *Allow force pushes* y ☐ *Allow deletions* — **sin marcar** (es lo que los
      bloquea). Ojo: estas dos aplican a todo el mundo, admins incluidos.

    > ⚠️ El check requerido se identifica **por su nombre literal**: la API lo
    > llama `context`, *"The name of the required check"*. Si algún día renombras
    > el job `Calidad (init.sh + build SSG)` en `ci.yml`, el check requerido deja
    > de casar y los PRs se quedan esperando un check que nunca llega. Renombra
    > los dos a la vez o no renombres ninguno.
- [ ] Probar sin esperar al lunes: *Actions → «Mantenimiento autónomo» → Run
      workflow*; marca **`forzar`** para saltarte la guarda de PR abierto. Es
      **esperable que no proponga nada**: es el límite 7 haciendo su trabajo.
- [ ] Revisar cada PR con calma (especial atención si lleva
      `permissions-change`) y fusionar —o pedir cambios— a mano.

Las etiquetas `autonomous`, `needs-human-review` y `permissions-change` no hace
falta crearlas a mano: se crean de forma idempotente antes de usarse.

## Cadencia

Cron **lunes, miércoles y viernes a las 06:43 UTC** (`43 6 * * 1,3,5`), con una
guarda: si ya hay un PR suyo abierto, el ciclo se salta y sale en verde sin
gastar nada. **El ritmo lo marcas tú al fusionar (o cerrar), no el calendario.**

> Avisos sobre workflows programados, de la doc oficial de GitHub:
>
> - Solo se disparan desde la **rama por defecto** ("Scheduled workflows will
>   only run on the default branch").
> - Pueden retrasarse en horas de carga alta, y con carga suficiente "some queued
>   jobs may be dropped". Por eso el cron va a las **06:43** y no en punto: la
>   doc recomienda literalmente programar "at a different time of the hour".
> - En un repositorio **público** como este, GitHub **desactiva
>   automáticamente** los workflows programados tras **60 días sin actividad**
>   ("In a public repository, scheduled workflows are automatically disabled when
>   no repository activity has occurred in 60 days"). Si dejas de ver runs,
>   revisa la pestaña *Actions*.

## Coste

Tres cortafuegos de serie (mismo diseño que los bots hermanos):

- `--max-turns 60` — acota las iteraciones del agente.
- `timeout-minutes: 45` — corta cualquier run desbocado por reloj de pared.
- `--max-budget-usd 10` — techo de trabajo por ejecución (con el token de
  suscripción consume cuota del plan, no dólares; sigue actuando como corte).

Minutos de GitHub Actions: este repo es **público**, y la doc oficial dice que
"the use of standard GitHub-hosted runners is free: In public repositories". Este
workflow usa `ubuntu-latest`, que es estándar, así que **no consume la cuota de
la organización** (ojo: los *larger runners* sí se cobran aunque el repo sea
público — no los uses aquí).

## Modelo de seguridad (honesto)

- **Alcance acotado y fusión manual.** El bot no toca producto ni contratos, y
  nada llega a `main` sin que un humano lea el diff y pulse *merge*. Con la
  protección de rama de la checklist, eso deja de ser una instrucción de prompt y
  pasa a estar impuesto por GitHub.
- **Alarma de auto-permisos, con respaldo mecánico.** Si el bot toca su workflow,
  su mandato, `CODEOWNERS`, `init.sh`, `CLAUDE.md` o `AGENTS.md`, debe avisarlo
  en la primera línea del PR (límite 1). Además el guardián etiqueta esos PRs con
  `permissions-change` y `CODEOWNERS` exige tu revisión: la autodeclaración no es
  el único mecanismo.
- **Sin trampas para la CI.** Prohibido borrar/relajar tests o bajar el umbral de
  mutación para forzar el verde (límite 3). Marcar el job de `ci.yml` como
  *required check* cierra el hueco de que un PR borre la CI y se presente en
  verde.
- **El PAT de lectura no llega al agente.** `ORG_READ_TOKEN` solo se expone en el
  step de sincronización de memoria; el agente opera con el token de la GitHub
  App de Claude (escritura solo sobre ESTE repo) y se encuentra
  `.memoria-cache/` ya en disco.
- **Secretos fuera de su alcance.** El límite 4 le prohíbe leer o escribir
  `.env*`. Ninguna clave real vive en el repo (RF-STACK-001) — viven en Vercel y
  en el gestor de contraseñas.
- **Riesgo residual honesto (exfiltración durante el run).** `--disallowedTools`
  corta `curl`/`wget` como defensa en profundidad, **no** como contención
  hermética: con `Bash` disponible existen otras vías de red. La contención real
  es alcance limitado + fusión humana + CI. Para una postura más estricta,
  restringe `--allowedTools` a prefijos concretos (`Bash(git:*),Bash(gh:*),…`)
  aceptando algo más de fricción.

> Sobre el modelo: `--model claude-opus-4-8` está fijado a propósito
> (reproducible). Cuando Anthropic retire Opus 4.8, el run empezará a fallar:
> actualiza el ID en el workflow y aquí. La alternativa es el alias `opus`
> (siempre el Opus vigente), a cambio de posible deriva de comportamiento.

## Referencias oficiales

- Claude Code GitHub Action — guía: <https://code.claude.com/docs/en/github-actions>
- Referencia de flags del CLI: <https://code.claude.com/docs/en/cli-reference>
- Eventos programados (`schedule`): <https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows>
- Facturación de Actions: <https://docs.github.com/en/billing/concepts/product-billing/github-actions>
- Protección de ramas: <https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches>
- pnpm en CI: <https://pnpm.io/continuous-integration>
