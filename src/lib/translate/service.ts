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

type Prepared = {
  collection: CollectionSlug
  id: number | string
  ro: Record<string, unknown>
  hash: string
  parts: { seg: Segment; key: string; text: string; used: string[] }[]
}

/** Segmentele unui document, cu termenii protejați; cheile sunt unice între documente (`d3:s7`). */
function prepare(payload: Payload, collection: CollectionSlug, ro: Record<string, unknown>, terms: string[], n: number): Prepared {
  const segments = segmentsOf(payload, collection, ro)
  return {
    collection,
    id: ro.id as number | string,
    ro,
    hash: sourceHash(segments),
    parts: segments.map((seg, i) => {
      const p = protectTerms(seg.source, terms)
      return { seg, key: `d${n}:s${i}`, text: p.text, used: p.used }
    }),
  }
}

type Translator = typeof translateBatch

/** Rulează sarcinile câte `limit` deodată. */
async function pool<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const out: T[] = []
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, tasks.length) }, async () => {
      while (next < tasks.length) {
        const i = next++
        out[i] = await tasks[i]()
      }
    }),
  )
  return out
}

/**
 * Traduce bucățile mai multor documente într-o limbă, grupate în cereri comune (~40 de bucăți) și
 * câte 4 cereri în paralel. A doua încercare pentru bucățile care n-au ieșit bine. Întoarce textul
 * bun pe cheie; ce lipsește rămâne în română.
 */
async function translateParts(
  docs: Prepared[],
  locale: LocaleCode,
  restaurant: string,
  translate: Translator,
  usage: { input: number; output: number },
): Promise<Map<string, string>> {
  const all = docs.flatMap((d) => d.parts)
  const raw = new Map<string, string>()
  const ask = async (items: Item[]) => {
    const results = await pool(
      chunk(items).map((part) => () => translate(part, locale, restaurant)),
      4,
    )
    for (const r of results) {
      usage.input += r.inputTokens
      usage.output += r.outputTokens
      r.texts.forEach((v, k) => raw.set(k, v))
    }
  }
  const good = (p: Prepared['parts'][number]) => {
    const t = raw.get(p.key)
    if (!t) return null
    const restored = restoreTerms(t, p.used)
    if (!restored.ok || (p.seg.max && restored.text.length > p.seg.max)) return null
    return restored.text
  }
  await ask(all.map((p) => ({ id: p.key, text: p.text, max: p.seg.max })))
  const retry = all.filter((p) => good(p) === null)
  if (retry.length) await ask(retry.map((p) => ({ id: p.key, text: p.text, max: p.seg.max ? Math.floor(p.seg.max * 0.9) : undefined })))
  const out = new Map<string, string>()
  for (const p of all) {
    const t = good(p)
    if (t !== null) out.set(p.key, t)
  }
  return out
}

/** Salvează limba unui document: câmpurile de sus cu text, copiate din română, cu textele traduse. */
async function writeDoc(payload: Payload, doc: Prepared, locale: LocaleCode, texts: Map<string, string>, req?: PayloadRequest): Promise<number> {
  const data: Record<string, unknown> = {}
  for (const p of doc.parts) {
    const top = p.seg.path[0] as string
    if (!(top in data)) data[top] = structuredClone(doc.ro[top])
  }
  let skipped = 0
  for (const p of doc.parts) {
    const text = texts.get(p.key)
    if (text === undefined) {
      // Rămâne textul românesc (același pe care site-ul l-ar arăta oricum): câmpurile obligatorii nu
      // pot rămâne goale, iar un text greșit e mai rău decât unul netradus.
      skipped += 1
      continue
    }
    if (p.seg.kind === 'text') {
      setAt(data, p.seg.path, text)
    } else {
      const block = getAt(data, p.seg.path) as { children?: unknown[] } | undefined
      if (!block?.children) continue
      const children = fromMarkup(block.children as never, text) ?? [
        { type: 'text', format: 0, detail: 0, mode: 'normal', style: '', version: 1, text: stripMarkup(text) },
      ]
      setAt(data, [...p.seg.path, 'children'], children)
    }
  }
  data.i18nStatus = 'auto'
  data.i18nSource = doc.hash
  await payload.update({
    collection: doc.collection,
    id: doc.id,
    locale,
    data: data as never,
    depth: 0,
    overrideAccess: true,
    context: { i18nAuto: true },
    req,
  })
  return skipped
}

/**
 * Traduce un document în limbile date și salvează fiecare limbă cu starea „tradus automat”.
 * Bucățile care nu ies bine (marcaje pierdute, prea lungi) rămân în română.
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
    translate?: Translator
  },
): Promise<TranslateReport> {
  const { collection, id, locales } = args
  const ro = (await payload.findByID({ collection, id, depth: 0, locale: DEFAULT_LOCALE, overrideAccess: true })) as unknown as Record<string, unknown>
  const tenantId = (ro.tenant && typeof ro.tenant === 'object' ? (ro.tenant as { id: number }).id : ro.tenant) as number | undefined
  const terms = args.terms ?? (tenantId ? await glossary(payload, tenantId) : [])
  const doc = prepare(payload, collection, ro, terms, 0)
  const usage = { input: 0, output: 0 }
  const outcomes = await Promise.all(
    locales.map(async (locale): Promise<TranslateOutcome> => {
      try {
        const texts = await translateParts([doc], locale, terms[0] ?? 'the restaurant', args.translate ?? translateBatch, usage)
        const skipped = await writeDoc(payload, doc, locale, texts, args.req)
        return { locale, ok: true, skipped }
      } catch (e) {
        return { locale, ok: false, error: e instanceof Error ? e.message : String(e) }
      }
    }),
  )
  return { outcomes, inputTokens: usage.input, outputTokens: usage.output, costUsd: costUsd(usage.input, usage.output) }
}

export type Overview = Record<LocaleCode, Record<TranslationState, number>> & { documents: number }

type WorkItem = { collection: CollectionSlug; id: number | string; locale: LocaleCode; state: TranslationState }

/** Toate documentele restaurantului și starea lor pe limbă (Tabloul de bord, „Tradu tot site-ul”). */
export async function siteStates(
  payload: Payload,
  tenantId: number | string,
): Promise<{ items: WorkItem[]; documents: number; docs: Map<string, unknown> }> {
  const items: WorkItem[] = []
  const docs = new Map<string, unknown>()
  let documents = 0
  for (const collection of translatableCollections(payload)) {
    const base = { where: { tenant: { equals: tenantId } }, depth: 0, limit: 2000, pagination: false as const, overrideAccess: true }
    const ro = await payload.find({ collection, ...base, locale: DEFAULT_LOCALE })
    const hashes = new Map<string | number, string>()
    for (const d of ro.docs as unknown as { id: string | number }[]) {
      const segs = segmentsOf(payload, collection, d)
      if (segs.length) {
        hashes.set(d.id, sourceHash(segs))
        docs.set(`${collection}:${d.id}`, d)
      }
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
  return { items, documents, docs }
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
 * „Tradu tot site-ul” pe ture: o tură ia cel mult `maxDocs` documente care au nevoie de traducere
 * într-o singură limbă (netraduse și „de retradus”; cu `all`, și cele traduse automat), le traduce
 * în cereri comune și le salvează până la `budgetMs`. Panoul repetă tura până nu mai rămâne nimic.
 * Un text „verificat de om” nu se suprascrie niciodată aici (D-64, F4-2).
 */
export async function translateBatchRun(
  payload: Payload,
  args: {
    tenantId: number | string
    locales: LocaleCode[]
    mode: BatchMode
    budgetMs: number
    maxDocs?: number
    req?: PayloadRequest
    translate?: Translator
  },
): Promise<{ done: number; failed: { collection: string; id: string | number; locale: string; error: string }[]; remaining: number; costUsd: number; locale?: string }> {
  if (!args.translate && !translationAvailable()) throw new Error('Lipsește TRANSLATE_API_KEY.')
  const started = Date.now()
  const { items, docs } = await siteStates(payload, args.tenantId)
  const wanted = (st: TranslationState) => st === 'none' || st === 'stale-auto' || (args.mode === 'all' && st === 'auto')
  const todo = items.filter((i) => args.locales.includes(i.locale) && wanted(i.state))
  if (!todo.length) return { done: 0, failed: [], remaining: 0, costUsd: 0 }
  const locale = todo[0].locale
  const slice = todo.filter((i) => i.locale === locale).slice(0, args.maxDocs ?? 80)
  const terms = await glossary(payload, args.tenantId)
  const prepared = slice.map((w, n) => prepare(payload, w.collection, docs.get(`${w.collection}:${w.id}`) as Record<string, unknown>, terms, n))
  const usage = { input: 0, output: 0 }
  const failed: { collection: string; id: string | number; locale: string; error: string }[] = []
  let done = 0
  let texts = new Map<string, string>()
  try {
    texts = await translateParts(prepared, locale, terms[0] ?? 'the restaurant', args.translate ?? translateBatch, usage)
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e)
    return { done: 0, failed: slice.map((w) => ({ collection: w.collection, id: w.id, locale, error })), remaining: todo.length, costUsd: costUsd(usage.input, usage.output), locale }
  }
  let written = 0
  for (const doc of prepared) {
    if (Date.now() - started > args.budgetMs) break
    written += 1
    try {
      await writeDoc(payload, doc, locale, texts, args.req)
      done += 1
    } catch (e) {
      failed.push({ collection: doc.collection, id: doc.id, locale, error: e instanceof Error ? e.message : String(e) })
    }
  }
  return { done, failed, remaining: todo.length - written, costUsd: costUsd(usage.input, usage.output), locale }
}
