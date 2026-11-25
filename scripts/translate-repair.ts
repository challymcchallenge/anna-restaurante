/**
 * La build-ul de producție (după seed): completează o singură dată traducerile automate în care au
 * rămas bucăți în română (F4, completarea traducerilor). Rulează doar cu TRANSLATE_API_KEY și doar pentru limbile pornite.
 * Nu oprește niciodată build-ul: o eroare se scrie în jurnal, iar reparația se reia la build-ul următor.
 * Rulare: pnpm payload run scripts/translate-repair.ts
 */
import { getPayload } from 'payload'

import { DEFAULT_LOCALE, type LocaleCode } from '../src/lib/locales'
import { translationAvailable } from '../src/lib/translate/engine'
import { glossary, incompleteTranslations, translateDocument } from '../src/lib/translate/service'
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
    if (log[key]) continue
    const settings = await payload.find({ collection: 'settings', where: { tenant: { equals: tenant.id } }, limit: 1, depth: 0, overrideAccess: true })
    const locales = ((settings.docs[0]?.activeLocales as string[] | undefined) ?? []).filter((l) => l !== DEFAULT_LOCALE) as LocaleCode[]
    if (!locales.length) continue
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
