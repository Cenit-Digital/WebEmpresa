#!/usr/bin/env bash
# init.sh — Verificación e inicialización del entorno (WebEmpresa).
# El agente lo ejecuta al comenzar una sesión y antes de declarar nada `done`.
# Si falla, la sesión no debe avanzar.
set -u
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[0;33m'; NC='\033[0m'
ok()   { printf "${GREEN}[OK]${NC}    %s\n" "$1"; }
warn() { printf "${YELLOW}[WARN]${NC}  %s\n" "$1"; }
fail() { printf "${RED}[FAIL]${NC}  %s\n" "$1"; }
EXIT_CODE=0

echo "── 1. Entorno ──────────────────────────────────────────"
command -v node >/dev/null 2>&1 || { fail "node no está instalado"; exit 1; }
ok "node -> $(node --version)"
if node -e 'process.exit(parseInt(process.versions.node,10) >= 22 ? 0 : 1)'; then
  ok "Node >= 22"
else
  fail "Se requiere Node >= 22"; EXIT_CODE=1
fi
command -v pnpm >/dev/null 2>&1 || { fail "pnpm no está instalado (ejecuta: corepack enable pnpm)"; exit 1; }
ok "pnpm -> $(pnpm --version)"
[ -d node_modules ] || { fail "Faltan dependencias: ejecuta 'pnpm install'"; exit 1; }
ok "node_modules presente"

echo ""
echo "── 2. Archivos base del arnés ──────────────────────────"
for f in AGENTS.md CLAUDE.md CHECKPOINTS.md feature_list.json progress/current.md \
         docs/workflow.md docs/tdd.md docs/gherkin.md docs/mutation-testing.md \
         docs/architecture.md docs/conventions.md docs/verification.md stryker.config.json; do
  if [ -f "$f" ]; then ok "Existe $f"; else fail "Falta archivo base: $f"; EXIT_CODE=1; fi
done

echo ""
echo "── 3. feature_list.json y escenarios ───────────────────"
node - <<'NODE'
const fs = require('fs')
try {
  const d = JSON.parse(fs.readFileSync('feature_list.json', 'utf8'))
  const valid = new Set(['pending', 'spec_ready', 'in_progress', 'done', 'blocked'])
  const inProg = d.features.filter((f) => f.status === 'in_progress')
  if (inProg.length > 1) { console.log(`[FAIL]  ${inProg.length} features en in_progress (máximo 1)`); process.exit(1) }
  const needSpec = new Set(['spec_ready', 'in_progress', 'done'])
  const errs = []
  for (const f of d.features) {
    if (!valid.has(f.status)) { console.log(`[FAIL]  estado inválido en #${f.id}: ${f.status}`); process.exit(1) }
    if (f.sdd && needSpec.has(f.status)) {
      const ff = `features/${f.name}.feature`
      if (!fs.existsSync(ff)) errs.push(`#${f.id} (${f.name}) en ${f.status} sin ${ff}`)
    }
  }
  if (errs.length) { errs.forEach((e) => console.log(`[FAIL]  ${e}`)); process.exit(1) }
  console.log(`[OK]    feature_list.json válido (${d.features.length} features)`)
} catch (e) { console.log(`[FAIL]  feature_list.json inválido: ${e.message}`); process.exit(1) }
NODE
[ $? -ne 0 ] && EXIT_CODE=1

echo ""
echo "── 4. Calidad (typecheck · lint · test) ────────────────"
if pnpm -s typecheck; then ok "typecheck sin errores"; else fail "typecheck con errores"; EXIT_CODE=1; fi
if pnpm -s lint; then ok "lint sin errores"; else fail "lint con errores"; EXIT_CODE=1; fi
if pnpm -s test >/tmp/we_test.log 2>&1; then ok "tests verdes ($(grep -oE '[0-9]+ passed' /tmp/we_test.log | tail -1))"; else fail "tests rotos (ver salida de 'pnpm test')"; EXIT_CODE=1; fi

echo ""
echo "── 5. Resumen ──────────────────────────────────────────"
if [ $EXIT_CODE -eq 0 ]; then
  ok "Entorno listo. Puedes empezar a trabajar."
else
  fail "Entorno NO está listo. Resuelve los errores antes de avanzar."
fi
exit $EXIT_CODE
