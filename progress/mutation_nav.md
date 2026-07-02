# Prueba de mutación — feature #2 `nav` (Navegación de la cabecera, WEB-4)

Herramienta: StrykerJS + runner Vitest (`coverageAnalysis: perTest`).
Comando: `pnpm mutation`. Umbral: `thresholds.break: 100` -> **100% exigido**
sobre el glob `mutate`. Informe HTML: `reports/mutation/index.html`.

Glob `mutate`: `src/lib/nav.ts`, `src/lib/useIsMobile.ts`,
`src/components/HeaderNav.tsx`, `src/components/MobileMenu.tsx`, `src/lib/seo.ts`.

## Veredicto (corrida final)

**APROBADO.** Puntuación global **100.00%** (38 detectados / 38). Stryker cerró
con exit code 0 (`Final mutation score of 100.00 is greater than or equal to
break threshold 100`). **0 supervivientes.** Duración ~1 min 22 s.

## Puntuación por archivo (corrida final)

Nota: el "score" de Stryker cuenta como *detectados* tanto los `killed` como los
`timeout`. Fórmula: `(killed + timeout) / total`.

| Archivo                   | Score       | killed | timeout | survived | total |
|---------------------------|-------------|--------|---------|----------|-------|
| **All files**             | **100.00%** | 34     | 4       | 0        | 38    |
| components/HeaderNav.tsx  | 100.00%     | 5      | 0       | 0        | 5     |
| components/MobileMenu.tsx | 100.00%     | 2      | 0       | 0        | 2     |
| lib/nav.ts                | 100.00%     | 16     | 0       | 0        | 16    |
| lib/seo.ts                | 100.00%     | 6      | 0       | 0        | 6     |
| lib/useIsMobile.ts        | 100.00%     | 5      | 4       | 0        | 9     |

Todos los archivos del glob al 100%. Los 4 `timeout` de `useIsMobile.ts`
cuentan como detectados (mutantes en la suscripción/hook que provocan
cuelgue/re-render) y no son accionables. Componentes TSX (glifos de menú/cierre,
título "Menú", aria-labels "Abrir menú"/"Cerrar menú"/"Principal", `data-testid`
`mobile-menu-overlay`, condicional `isMobile` de `HeaderNav`) y datos
(`nav.ts`, `seo.ts`) sin supervivientes, como en la corrida anterior.

## Cierre del superviviente #1

- **Mutante:** `src/lib/useIsMobile.ts:4:29` — StringLiteral
  `MOBILE_QUERY = '(max-width: 767px)'` -> `MOBILE_QUERY = ""`.
- **Estado: MUERTO.** En la corrida anterior sobrevivía por una tautología del
  fake de `matchMedia`, que comparaba la query recibida contra la **constante
  importada** (`query === MOBILE_QUERY`): mutar la constante movía en bloque la
  lectura de producción y el valor esperado del test, así que ningún test
  fallaba.
- **Fix (test-only, producción intacta):** el `tdd_craftsman` ancló el fake al
  literal codificado `query === '(max-width: 767px)'` en
  `src/lib/useIsMobile.test.tsx` y depuró `MOBILE_QUERY` del import. Ahora, con
  el mutante `MOBILE_QUERY = ""`, producción llama `window.matchMedia("")`, el
  fake devuelve `matches: false`, y falla el test
  `useIsMobile @s5 getSnapshot devuelve matches de la MOBILE_QUERY (true en
  móvil)` (marcado `killed 1` en la corrida final). El `judge` ratificó el
  cambio: sigue APROBADO, suite en verde (26 tests).
- **Equivalentes excluidos:** 0. No se aplicó ninguna exclusión.

## Resumen

- Global: **100.00%** (38/38) — cumple `break: 100`, build verde (exit 0).
- Supervivientes: **0**. Superviviente #1 (`MOBILE_QUERY -> ""`) confirmado
  muerto.
- **Veredicto: APROBADO.** La red de tests de la feature #2 `nav` muerde al
  100% sobre el glob.

### Historial

- Corrida 1: 97.37% (37/38), 1 superviviente en `useIsMobile.ts:4`. RECHAZADO.
- Corrida 2 (final): 100.00% (38/38), 0 supervivientes. APROBADO.
