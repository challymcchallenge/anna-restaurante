import type { CollectionSlug, Payload, PayloadRequest } from 'payload'

import { DEFAULT_LOCALE, LOCALE_CODES, type LocaleCode } from '@/lib/locales'

import { chunk, costUsd, translateBatch, translationAvailable, type Item } from './engine'
import {
  collectSegments,
  fromMarkup,
  getAt,
  hasTranslatableFields,
  protectTerms,
  restoreTerms,
  setAt,
  sourceHash,
  stripMarkup,
  translationState,
  type Segment,
  type TranslationState,
} from './segments'

/**
 * Traducerile în panou (F4, D-64): ce documente se traduc, starea lor pe limbă și traducerea unui
 * document sau a întregului site, bucată cu bucată (o cerere HTTP nu poate dura oricât).
 */

export const TARGET_LOCALES = LOCALE_CODES.filter((l) => l !== DEFAULT_LOCALE) as LocaleCode[]

/** Colecțiile care nu țin conținut de site. */
const NOT_CONTENT = new Set(['users', 'tenants', 'submissions', 'redirects'])

export function translatableCollections(payload: Payload): CollectionSlug[] {
  return payload.config.collections
    .filter((c) => !NOT_CONTENT.has(c.slug) && hasTranslatableFields(c.fields as never))
    .map((c) => c.slug as CollectionSlug)
}

const fieldsOf = (payload: Payload, slug: string) =>
  (payload.config.collections.find((c) => c.slug === slug)?.fields ?? []) as never

/** Segmentele unui document deja încărcat în română (adâncime 0). */
export function segmentsOf(payload: Payload, slug: string, doc: unknown): Segment[] {
  return collectSegments(fieldsOf(payload, slug), doc)
}

/**
 * Termenii care nu se traduc (content-model 9): numele restaurantului, tagline-ul, saloanele,
 * camerele, categoriile, serile, linkurile grupului și lista din Setări → Integrări.
 */
export async function glossary(payload: Payload, tenantId: number | string): Promise<string[]> {
  const where = { tenant: { equals: tenantId } }
  const common = { where, depth: 0, limit: 500, pagination: false as const, overrideAccess: true, locale: DEFAULT_LOCALE }
  const [tenant, settings, salons, rooms, cats, events, links] = await Promise.all([
    payload.findByID({ collection: 'tenants', id: tenantId, depth: 0, overrideAccess: true }).catch(() => null),
    payload.find({ collection: 'settings', ...common, limit: 1 }),
    payload.find({ collection: 'salons', ...common }),
    payload.find({ collection: 'room-types', ...common }),
    payload.find({ collection: 'dish-categories', ...common }),
    payload.find({ collection: 'events', ...common }),
    payload.find({ collection: 'group-links', ...common }),
  ])
  const s = settings.docs[0] as unknown as Record<string, unknown> | undefined
  const names = (docs: unknown[], key = 'name') => docs.map((d) => (d as Record<string, unknown>)[key]).filter((v): v is string => typeof v === 'string')
  return [
    (tenant as { name?: string } | null)?.name,
    s?.tagline as string | undefined,
    ...((s?.doNotTranslate as string[] | undefined) ?? []),
    ...names(salons.docs),
    ...names(rooms.docs),
    ...names(cats.docs),
    ...names(events.docs),
    ...names(links.docs),
  ].filter((t): t is string => typeof t === 'string' && t.trim().length > 1)
}

export type DocLocaleState = { locale: LocaleCode; state: TranslationState }

/** Starea fiecărei limbi pe un document. */
export async function documentStates(payload: Payload, slug: CollectionSlug, id: number | string): Promise<{ hash: string; states: DocLocaleState[]; segments: number }> {
  const ro = await payload.findByID({ collection: slug, id, depth: 0, locale: DEFAULT_LOCALE, overrideAccess: true })
  const segments = segmentsOf(payload, slug, ro)
  const hash = sourceHash(segments)
  const states = await Promise.all(
    TARGET_LOCALES.map(async (locale) => {
      const d = (await payload.findByID({ collection: slug, id, depth: 0, locale, fallbackLocale: false, overrideAccess: true })) as unknown as Record<string, unknown>
      return { locale, state: translationState(d.i18nStatus as string, d.i18nSource as string, hash) }
    }),
  )
  return { hash, states, segments: segments.length }
}

export type TranslateOutcome = { locale: LocaleCode; ok: boolean; error?: string; skipped?: number }

export type TranslateReport = { outcomes: TranslateOutcome[]; inputTokens: number; outputTokens: number; costUsd: number }

/**
 * Traduce un document în limbile date și salvează fiecare limbă cu starea „tradus automat”.
 * Bucățile care nu ies bine (marcaje pierdute, prea lungi) rămân netraduse: pe site apare româna.
 */
export async function translateDocument(
  payload: Payload,
  args: {
    collection: CollectionSlug
    id: number | string
    locales: LocaleCode[]
    terms?: string[]
    req?: PayloadRequest
    /** Doar pentru probe locale fără cheie: un traducător înlocuitor. */
    translate?: typeof translateBatch
  },
): Promise<TranslateReport> {
  const { collection, id, locales } = args
  const ro = (await payload.findByID({ collection, id, depth: 0, locale: DEFAULT_LOCALE, overrideAccess: true })) as unknown as Record<string, unknown>
  const segments = segmentsOf(payload, collection, ro)
  const hash = sourceHash(segments)
  const tenantId = (ro.tenant && typeof ro.tenant === 'object' ? (ro.tenant as { id: number }).id : ro.tenant) as number | undefined
  const terms = args.terms ?? (tenantId ? await glossary(payload, tenantId) : [])
  const restaurant = terms[0] ?? 'the restaurant'
  const report: TranslateReport = { outcomes: [], inputTokens: 0, outputTokens: 0, costUsd: 0 }

  // Aceleași bucăți pentru toate limbile: protejate o singură dată.
  const prepared = segments.map((s, i) => {
    const p = protectTerms(s.source, terms)
    return { seg: s, id: `s${i}`, text: p.text, used: p.used }
  })

  for (const locale of locales) {
    try {
      const translated = new Map<string, string>()
      const pending: Item[] = prepared.map((p) => ({ id: p.id, text: p.text, max: p.seg.max }))
      for (const part of chunk(pending)) {
        const r = await (args.translate ?? translateBatch)(part, locale, restaurant)
        report.inputTokens += r.inputTokens
        report.outputTokens += r.outputTokens
        r.texts.forEach((v, k) => translated.set(k, v))
      }

      // Documentul de salvat: doar câmpurile de sus care au text de tradus, copiate din română.
      const data: Record<string, unknown> = {}
      for (const p of prepared) {
        const top = p.seg.path[0] as string
        if (!(top in data)) data[top] = structuredClone(ro[top])
      }
      let skipped = 0
      for (const p of prepared) {
        const raw = translated.get(p.id)
        const restored = raw ? restoreTerms(raw, p.used) : { text: '', ok: false }
        if (!raw || !restored.ok || (p.seg.max && restored.text.length > p.seg.max)) {
          skipped += 1
          // Rămâne gol în limba țintă: pe site se vede româna (fallback), nu un text greșit.
          if (p.seg.kind === 'text') setAt(data, p.seg.path, null)
          continue
        }
        if (p.seg.kind === 'text') {
          setAt(data, p.seg.path, restored.text)
        } else {
          const block = getAt(data, p.seg.path) as { children?: unknown[] } | undefined
          if (!block?.children) continue
          const children = fromMarkup(block.children as never, restored.text) ?? [
            { type: 'text', format: 0, detail: 0, mode: 'normal', style: '', version: 1, text: stripMarkup(restored.text) },
          ]
          setAt(data, [...p.seg.path, 'children'], children)
        }
      }
      data.i18nStatus = 'auto'
      data.i18nSource = hash
      await payload.update({
        collection,
        id,
        locale,
        data: data as never,
        depth: 0,
        overrideAccess: true,
        context: { i18nAuto: true },
        req: args.req,
      })
      report.outcomes.push({ locale, ok: true, skipped })
    } catch (e) {
      report.outcomes.push({ locale, ok: false, error: e instanceof Error ? e.message : String(e) })
    }
  }
  report.costUsd = costUsd(report.inputTokens, report.outputTokens)
  return report
}

export type Overview = Record<LocaleCode, Record<TranslationState, number>> & { documents: number }

type WorkItem = { collection: CollectionSlug; id: number | string; locale: LocaleCode; state: TranslationState }

/** Toate documentele restaurantului și starea lor pe limbă (Tabloul de bord, „Tradu tot site-ul”). */
export async function siteStates(payload: Payload, tenantId: number | string): Promise<{ items: WorkItem[]; documents: number }> {
  const items: WorkItem[] = []
  let documents = 0
  for (const collection of translatableCollections(payload)) {
    const base = { where: { tenant: { equals: tenantId } }, depth: 0, limit: 2000, pagination: false as const, overrideAccess: true }
    const ro = await payload.find({ collection, ...base, locale: DEFAULT_LOCALE })
    const hashes = new Map<string | number, string>()
    for (const d of ro.docs as unknown as { id: string | number }[]) {
      const segs = segmentsOf(payload, collection, d)
      if (segs.length) hashes.set(d.id, sourceHash(segs))
    }
    documents += hashes.size
    if (!hashes.size) continue
    for (const locale of TARGET_LOCALES) {
      const t = await payload.find({
        collection,
        ...base,
        locale,
        fallbackLocale: false,
        select: { i18nStatus: true, i18nSource: true } as never,
      })
      const byId = new Map((t.docs as unknown as Record<string, unknown>[]).map((d) => [d.id as string | number, d]))
      for (const [id, hash] of hashes) {
        const d = byId.get(id)
        items.push({ collection, id, locale, state: translationState(d?.i18nStatus as string, d?.i18nSource as string, hash) })
      }
    }
  }
  return { items, documents }
}

export async function overview(payload: Payload, tenantId: number | string): Promise<Overview> {
  const { items, documents } = await siteStates(payload, tenantId)
  const empty = (): Record<TranslationState, number> => ({ none: 0, auto: 0, verified: 0, 'stale-auto': 0, 'stale-verified': 0 })
  const out = Object.fromEntries(TARGET_LOCALES.map((l) => [l, empty()])) as unknown as Overview
  out.documents = documents
  for (const i of items) out[i.locale][i.state] += 1
  return out
}

export type BatchMode = 'missing' | 'stale' | 'all'

/**
 * „Tradu tot site-ul” pe bucăți: traduce documentele care au nevoie (netraduse și cele „de retradus”;
 * cu `all`, și pe cele traduse automat), până la `budgetMs`, apoi spune câte au rămas. Panoul repetă
 * cererea până la 0. Un text „verificat de om” nu se suprascrie niciodată aici (D-64, F4-2).
 */
export async function translateBatchRun(
  payload: Payload,
  args: { tenantId: number | string; locales: LocaleCode[]; mode: BatchMode; budgetMs: number; req?: PayloadRequest },
): Promise<{ done: number; failed: { collection: string; id: string | number; locale: string; error: string }[]; remaining: number; costUsd: number }> {
  if (!translationAvailable()) throw new Error('Lipsește TRANSLATE_API_KEY.')
  const started = Date.now()
  const { items } = await siteStates(payload, args.tenantId)
  const wanted = (s: TranslationState) =>
    s === 'none' || s === 'stale-auto' || (args.mode === 'all' && s === 'auto')
  const todo = items.filter((i) => args.locales.includes(i.locale) && wanted(i.state))
  // Grupate pe document: o singură încărcare și același glosar pentru toate limbile lui.
  const byDoc = new Map<string, WorkItem[]>()
  for (const i of todo) {
    const k = `${i.collection}:${i.id}`
    byDoc.set(k, [...(byDoc.get(k) ?? []), i])
  }
  const terms = await glossary(payload, args.tenantId)
  let done = 0
  let cost = 0
  const failed: { collection: string; id: string | number; locale: string; error: string }[] = []
  let handled = 0
  for (const group of byDoc.values()) {
    if (Date.now() - started > args.budgetMs) break
    const { collection, id } = group[0]
    const r = await translateDocument(payload, { collection, id, locales: group.map((g) => g.locale), terms, req: args.req })
    cost += r.costUsd
    for (const o of r.outcomes) {
      if (o.ok) done += 1
      else failed.push({ collection, id, locale: o.locale, error: o.error ?? '' })
    }
    handled += group.length
  }
  return { done, failed, remaining: todo.length - handled, costUsd: cost }
}
