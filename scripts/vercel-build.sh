#!/usr/bin/env sh
# Build pe Vercel: rulează migrațiile Payload înainte de next build (ADR-001, ADR-003).
# Dacă DATABASE_URI lipsește (variabilele nu sunt încă puse), sare peste migrații
# ca build-ul să poată fi verificat oricum.
set -e
if [ -n "$DATABASE_URI" ] && [ -d src/migrations ]; then
  echo "[vercel-build] payload migrate"
  pnpm payload migrate
else
  echo "[vercel-build] DATABASE_URI lipsă sau fără src/migrations: sar peste migrații"
fi
pnpm build
