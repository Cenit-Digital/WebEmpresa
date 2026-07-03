# TDD — theme_selector (#3)

Rama `feat/design-system`. Contrato: `features/theme_selector.feature` (@s1–@s8).
Diseño: `docs/DESIGN_SYSTEM.md` §2 y §6.

Modelo: 3 estados `ThemeMode = 'light' | 'dark' | 'system'`.
Persistencia `localStorage['cenit-theme']` con SOLO `'light'|'dark'`; ausencia = "Sistema".

Arquitectura: lógica pura en `src/lib/theme.ts` (testeable + mordible por Stryker),
componente `src/components/ThemeToggle.tsx` = control accesible de 3 opciones
(`radiogroup` con 3 `radio`: "Claro"/"Oscuro"/"Sistema").

## Bitácora de ciclos (Rojo → Verde → Refactor)

(se rellena por ciclo)

## Trazabilidad @s → test

(se rellena al cerrar)

## Método @s8 (anti-FOUC)

(se documenta)
