#!/usr/bin/env sh
# Build pe Vercel: rulează migrațiile Payload înainte de next build (ADR-001, ADR-003).
# Migrațiile și conținutul de pornire rulează DOAR la build-ul de producție (VERCEL_ENV=production):
# build-urile de previzualizare folosesc aceeași bază de date, iar pe 24.11.2026 (F2) un preview
# pornit în paralel cu producția a încercat aceeași migrație (a picat fără efecte; vezi GATE 2).
# Dacă DATABASE_URI lipsește (variabilele nu sunt încă puse), sare peste migrații
# ca build-ul să poată fi verificat oricum.
set -e
if [ "$VERCEL_ENV" = "production" ] && [ -n "$DATABASE_URI" ] && [ -d src/migrations ]; then
  echo "[vercel-build] payload migrate"
  pnpm payload migrate
  # Conținutul de pornire (seed/*.json), o singură dată pe restaurant, după toate migrațiile (F1).
  echo "[vercel-build] conținut de pornire"
  pnpm payload run scripts/seed-starter.ts
  # F4 (F4, completarea traducerilor): traducerile automate cu bucăți rămase în română se completează o singură dată.
  echo "[vercel-build] traduceri: completare"
  pnpm payload run scripts/translate-repair.ts || echo "[vercel-build] traduceri: completarea nu a rulat, build-ul continuă"
else
  echo "[vercel-build] VERCEL_ENV=${VERCEL_ENV:-nesetat}: fără migrații și fără conținut de pornire (doar la producție)"
fi
pnpm build
