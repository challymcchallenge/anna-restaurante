/**
 * La build-ul de producție (după seed), doar cu TRANSLATE_API_KEY și doar pentru limbile pornite:
 * 1. la fiecare build: traduce documentele netraduse și pe cele „de retradus” (româna schimbată de
 *    seed, de exemplu o pagină rescrisă sau un câmp devenit traductibil, D-67). Ce a verificat un om
 *    nu se atinge;
 * 2. o singură dată pe versiune: completează traducerile automate în care au rămas bucăți în română.
 * Nu oprește niciodată build-ul: o eroare se scrie în jurnal, iar reparația se reia la build-ul următor.
 * Rulare: pnpm payload run scripts/translate-repair.ts
 */
import { getPayload } from 'payload'

import { DEFAULT_LOCALE, type LocaleCode } from '../src/lib/locales'
import { translationAvailable } from '../src/lib/translate/engine'
import { glossary, incompleteTranslations, translateBatchRun, translateDocument } from '../src/lib/translate/service'
import config from '../src/payload.config'

// „c”: a treia trecere: rezultatele întoarse netraduse se reiau; a doua scurtare (25.11.2026).
const VERSION = '2026-11-25c'
const BUDGET_MS = 240_000

try {
  const payload = await getPayload({ config })
  if (!translationAvailable()) {
    payload.logger.info('[traduceri] fără TRANSLATE_API_KEY: nimic de completat.')
    process.exit(0)
  }
  const started = Date.now()
  const { docs: tenants } = await payload.find({ collection: 'tenants', limit: 100, depth: 0, overrideAccess: true })
  for (const tenant of tenants) {
    const log = ((tenant as { starterContentLog?: Record<string, string> }).starterContentLog ?? {}) as Record<string, string>
    const key = `translateRepair:${VERSION}`
    const settings = await payload.find({ collection: 'settings', where: { tenant: { equals: tenant.id } }, limit: 1, depth: 0, overrideAccess: true })
    const locales = ((settings.docs[0]?.activeLocales as string[] | undefined) ?? []).filter((l) => l !== DEFAULT_LOCALE) as LocaleCode[]
    if (!locales.length) continue

    // 1. Netraduse și „de retradus”, la fiecare build (ture de câte 80 de documente pe limbă).
    let stale = 0
    let staleCost = 0
    for (let round = 0; round < 40 && Date.now() - started < BUDGET_MS; round++) {
      const r = await translateBatchRun(payload, { tenantId: tenant.id, locales, mode: 'missing', budgetMs: 60_000 })
      stale += r.done
      staleCost += r.costUsd
      for (const f of r.failed.slice(0, 5)) payload.logger.warn(`[traduceri] ${f.collection}#${f.id} ${f.locale}: ${f.error}`)
      if (!r.remaining || (!r.done && r.failed.length)) break
    }
    if (stale) payload.logger.info(`[traduceri] ${tenant.name}: ${stale} traduceri noi sau refăcute, ${staleCost.toFixed(4)} USD.`)

    if (log[key]) continue
    const todo = await incompleteTranslations(payload, tenant.id, locales)
    payload.logger.info(`[traduceri] ${tenant.name}: ${todo.length} documente cu bucăți rămase în română (${todo.reduce((n, t) => n + t.paths.length, 0)} bucăți).`)
    const terms = await glossary(payload, tenant.id)
    let cost = 0
    let failed = 0
    for (const t of todo) {
      if (Date.now() - started > BUDGET_MS) {
        failed += 1
        break
      }
      const r = await translateDocument(payload, { collection: t.collection, id: t.id, locales: t.locales, terms })
      cost += r.costUsd
      for (const o of r.outcomes.filter((x) => !x.ok)) {
        failed += 1
        payload.logger.warn(`[traduceri] ${t.collection}#${t.id} ${o.locale}: ${o.error}`)
      }
    }
    const left = await incompleteTranslations(payload, tenant.id, locales)
    payload.logger.info(
      `[traduceri] ${tenant.name}: completat, ${cost.toFixed(4)} USD; rămase în română: ${left.reduce((n, t) => n + t.paths.length, 0)} bucăți${left.length ? ` (${left.flatMap((t) => t.paths.map((p) => `${t.collection}#${t.id} ${p}`)).slice(0, 15).join('; ')})` : ''}.`,
    )
    if (!failed) {
      await payload.update({ collection: 'tenants', id: tenant.id, data: { starterContentLog: { ...log, [key]: new Date().toISOString() } } as never, overrideAccess: true })
    }
  }
  process.exit(0)
} catch (e) {
  console.error('[traduceri] reparația nu a putut rula:', e instanceof Error ? e.message : e)
  process.exit(0)
}
