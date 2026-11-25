import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, CollectionConfig, Field } from 'payload'

import { DEFAULT_LOCALE, type LocaleCode } from '@/lib/locales'

import { translationAvailable } from './engine'
import { collectSegments, hasTranslatableFields, sourceHash } from './segments'

/**
 * Starea traducerii pe fiecare document (F4, D-64), ca două câmpuri pe limbă, în bara laterală:
 * - `i18nStatus`: gol (netradus), „Tradus automat” sau „Verificat de om”;
 * - `i18nSource`: amprenta textului românesc din momentul traducerii (ascunsă). Dacă româna se
 *   schimbă, amprenta nu mai corespunde: „de retradus” sau „de reverificat”.
 * Panoul „Traduceri” (componentă proprie) arată starea tuturor limbilor și butoanele.
 */
export const translationFields = (): Field[] => [
  {
    name: 'translationPanel',
    type: 'ui',
    admin: {
      position: 'sidebar',
      components: { Field: '/components/admin/TranslationPanel#TranslationPanel' },
    },
  },
  {
    name: 'i18nStatus',
    label: 'Starea traducerii',
    type: 'select',
    localized: true,
    options: [
      { value: 'auto', label: 'Tradus automat' },
      { value: 'verified', label: 'Verificat de om' },
    ],
    admin: { hidden: true },
  },
  {
    name: 'i18nSource',
    type: 'text',
    localized: true,
    admin: { hidden: true },
  },
]

const changedTexts = (fields: never, a: unknown, b: unknown) => {
  const x = collectSegments(fields, a)
  const y = collectSegments(fields, b)
  return sourceHash(x) !== sourceHash(y)
}

/**
 * O corectură făcută de om într-o limbă (alta decât româna) înseamnă „Verificat de om” (DESI 9):
 * traducerea automată nu o mai suprascrie.
 */
const markHumanEdit: CollectionBeforeChangeHook = async ({ collection, context, data, operation, originalDoc, req }) => {
  if (context?.i18nAuto || operation !== 'update' || !originalDoc) return data
  const locale = (req.locale ?? DEFAULT_LOCALE) as string
  if (locale === DEFAULT_LOCALE || locale === 'all') return data
  const fields = collection.fields as never
  if (!changedTexts(fields, { ...originalDoc, ...data }, originalDoc)) return data
  const ro = await req.payload.findByID({ collection: collection.slug as never, id: originalDoc.id, locale: DEFAULT_LOCALE, depth: 0, overrideAccess: true, req })
  return { ...data, i18nStatus: 'verified', i18nSource: sourceHash(collectSegments(fields, ro)) }
}

/**
 * Româna s-a schimbat (sau documentul e nou): după răspuns, limbile pornite care sunt netraduse sau
 * „tradus automat” se (re)traduc singure (D-64, F4-2). Cele verificate de om nu se ating: apar
 * „de reverificat” în panou. În scripturi și la build (în afara unei cereri), nu se întâmplă nimic.
 */
const retranslateAfterSave: CollectionAfterChangeHook = async ({ collection, context, doc, previousDoc, req }) => {
  if (context?.i18nAuto || !translationAvailable()) return doc
  const locale = (req.locale ?? DEFAULT_LOCALE) as string
  if (locale !== DEFAULT_LOCALE) return doc
  const fields = collection.fields as never
  if (previousDoc && !changedTexts(fields, doc, previousDoc)) return doc
  if (!collectSegments(fields, doc).length) return doc
  const tenantId = (doc.tenant && typeof doc.tenant === 'object' ? doc.tenant.id : doc.tenant) as number | undefined
  if (!tenantId) return doc
  try {
    const { after } = await import('next/server')
    after(async () => {
      const { documentStates, translateDocument } = await import('./service')
      const payload = req.payload
      const settings = await payload.find({ collection: 'settings', where: { tenant: { equals: tenantId } }, limit: 1, depth: 0, overrideAccess: true })
      const active = ((settings.docs[0]?.activeLocales as string[] | undefined) ?? []).filter((l) => l !== DEFAULT_LOCALE)
      if (!active.length) return
      const { states } = await documentStates(payload, collection.slug as never, doc.id)
      const locales = states
        .filter((s) => active.includes(s.locale) && (s.state === 'none' || s.state === 'stale-auto' || s.state === 'auto'))
        .map((s) => s.locale as LocaleCode)
      if (!locales.length) return
      const report = await translateDocument(payload, { collection: collection.slug as never, id: doc.id, locales })
      const failed = report.outcomes.filter((o) => !o.ok)
      payload.logger.info(
        `[traduceri] ${collection.slug}#${doc.id}: ${report.outcomes.length - failed.length}/${report.outcomes.length} limbi, ${report.costUsd.toFixed(4)} USD${failed.length ? `; erori: ${failed.map((f) => `${f.locale} ${f.error}`).join('; ')}` : ''}`,
      )
    })
  } catch {
    // `after` există doar într-o cerere Next (panou, API). Seed-ul de la build nu traduce.
  }
  return doc
}

/** Adaugă câmpurile de stare și regulile automate colecțiilor care au texte de tradus. */
export function withTranslation(collection: CollectionConfig): CollectionConfig {
  if (!hasTranslatableFields(collection.fields as never)) return collection
  return {
    ...collection,
    fields: [...collection.fields, ...translationFields()],
    hooks: {
      ...collection.hooks,
      beforeChange: [...(collection.hooks?.beforeChange ?? []), markHumanEdit],
      afterChange: [...(collection.hooks?.afterChange ?? []), retranslateAfterSave],
    },
  }
}
