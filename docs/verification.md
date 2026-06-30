# Verificación — cómo demostrar que funciona

Antes de declarar una feature `done`, todo esto tiene que estar en verde.

## Comandos

```bash
pnpm typecheck     # tsc --noEmit, 0 errores
pnpm lint          # eslint ., 0 errores y 0 warnings
pnpm test          # vitest run, todos verdes
pnpm build         # vite-react-ssg build, prerenderiza sin warnings
pnpm mutation      # stryker, score >= umbral (break 100 sobre lo tocado)
pnpm verify        # = ./init.sh: entorno + base + typecheck + lint + test
```

## Criterios (resumen de CHECKPOINTS.md)

- `./init.sh` termina con **exit 0**.
- Cada `@s` del `.feature` tiene su test (mapa en `progress/tdd_<name>.md`).
- No hay producción que ningún test rojo haya pedido.
- La mutación de los archivos tocados está por encima del umbral.
- Sin `console.log` de debug, sin TODOs sin contexto, repo limpio.

## Definition of Done (RF-SISTEMA-001)

- [ ] Criterio de aceptación cumplido.
- [ ] Código en `main` y desplegado (preview de Vercel revisado).
- [ ] Sin errores nuevos en Sentry.
- [ ] Documentación en Confluence creada/actualizada y enlazada al ticket.
