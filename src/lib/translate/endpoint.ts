import type { CollectionSlug, Endpoint, PayloadRequest } from 'payload'

import { isAdmin } from '@/access/roles'
import { DEFAULT_LOCALE, isLocale, type LocaleCode } from '@/lib/locales'

import { translationAvailable } from './engine'
import { collectSegments, sourceHash } from './segments'
import {
  documentStates,
  overview,
  TARGET_LOCALES,
  translatableCollections,
  translateBatchRun,
  translateDocument,
  type BatchMode,
} from './service'

/**
 * `POST /api/translate` (F4, D-64): butoanele din panou. Doar utilizatorii autentificați; fiecare
 * acțiune verifică dreptul pe document sau pe restaurant.
 *
 * - `states`   { collection, id }               → starea fiecărei limbi
 * - `doc`      { collection, id, locales? }     → traduce documentul (implicit: tot ce nu e verificat)
 * - `verify`   { collection, id, locale }       → „Verificat de om” pentru limba dată
 * - `overview` { tenantId }                     → cifrele pe limbă (Tabloul de bord)
 * - `batch`    { tenantId, locales?, mode }     → o tură din „Tradu tot site-ul” (doar Administrator)
 */

const json = (body: unknown, status = 200) => Response.json(body, { status })

type Body = {
  action?: string
  collection?: string
  id?: number | string
  locale?: string
  locales?: string[]
  tenantId?: number | string
  mode?: BatchMode
}

/** Poate utilizatorul modifica documentul? (accesul colecției, cu restricția pe restaurant). */
async function canEdit(req: PayloadRequest, collection: CollectionSlug, id: number | string): Promise<boolean> {
  const config = req.payload.collections[collection]?.config
  if (!config) return false
  try {
    // Citirea cu accesul utilizatorului aplică și filtrul pe restaurant (multi-tenant).
    await req.payload.findByID({ collection, id, depth: 0, overrideAccess: false, user: req.user, req })
  } catch {
    return false
  }
  const update = config.access?.update
  if (!update) return Boolean(req.user)
  const result = await update({ req, id } as never)
  return result !== false
}

async function canUseTenant(req: PayloadRequest, tenantId: number | string): Promise<boolean> {
  if (isAdmin(req.user as never)) return true
  const tenants = ((req.user as { tenants?: { tenant: number | { id: number } }[] } | null)?.tenants ?? []).map((t) =>
    typeof t.tenant === 'object' ? t.tenant.id : t.tenant,
  )
  return tenants.map(String).includes(String(tenantId))
}

const asLocales = (list: string[] | undefined): LocaleCode[] =>
  (list?.length ? list : TARGET_LOCALES).filter((l): l is LocaleCode => isLocale(l) && l !== DEFAULT_LOCALE)

export const translateEndpoint: Endpoint = {
  path: '/translate',
  method: 'post',
  handler: async (req) => {
    if (!req.user) return json({ error: 'Autentificare necesară.' }, 401)
    const body = ((await req.json?.()) ?? {}) as Body
    const { payload } = req

    if (body.action === 'overview' || body.action === 'batch') {
      if (!body.tenantId || !(await canUseTenant(req, body.tenantId))) return json({ error: 'Restaurant inaccesibil.' }, 403)
      if (body.action === 'overview') {
        return json({ available: translationAvailable(), overview: await overview(payload, body.tenantId) })
      }
      if (!isAdmin(req.user as never)) return json({ error: 'Doar Administratorul traduce tot site-ul.' }, 403)
      if (!translationAvailable()) return json({ error: 'Lipsește TRANSLATE_API_KEY în Vercel.' }, 400)
      const mode: BatchMode = body.mode === 'all' || body.mode === 'stale' ? body.mode : 'missing'
      // O tură de cel mult ~45 s: panoul repetă cererea până nu mai rămâne nimic.
      return json(await translateBatchRun(payload, { tenantId: body.tenantId, locales: asLocales(body.locales), mode, budgetMs: 45_000 }))
    }

    const collection = body.collection as CollectionSlug | undefined
    if (!collection || body.id == null || !translatableCollections(payload).includes(collection)) {
      return json({ error: 'Document necunoscut.' }, 400)
    }
    if (!(await canEdit(req, collection, body.id))) return json({ error: 'Fără drept de modificare.' }, 403)

    if (body.action === 'states') {
      return json({ available: translationAvailable(), ...(await documentStates(payload, collection, body.id)) })
    }

    if (body.action === 'verify') {
      if (!isLocale(body.locale) || body.locale === DEFAULT_LOCALE) return json({ error: 'Limbă invalidă.' }, 400)
      const ro = await payload.findByID({ collection, id: body.id, depth: 0, locale: DEFAULT_LOCALE, overrideAccess: true })
      const fields = payload.collections[collection].config.fields as never
      await payload.update({
        collection,
        id: body.id,
        locale: body.locale,
        data: { i18nStatus: 'verified', i18nSource: sourceHash(collectSegments(fields, ro)) } as never,
        depth: 0,
        overrideAccess: true,
        context: { i18nAuto: true },
      })
      return json({ ok: true })
    }

    if (body.action === 'doc') {
      if (!translationAvailable()) return json({ error: 'Lipsește TRANSLATE_API_KEY în Vercel.' }, 400)
      let locales = asLocales(body.locales)
      // Implicit nu suprascriem ce a verificat un om; cu limbi date explicit, da (butonul pe limbă).
      if (!body.locales?.length) {
        const { states } = await documentStates(payload, collection, body.id)
        locales = states.filter((s) => s.state !== 'verified' && s.state !== 'stale-verified').map((s) => s.locale)
      }
      return json(await translateDocument(payload, { collection, id: body.id, locales }))
    }

    return json({ error: 'Acțiune necunoscută.' }, 400)
  },
}
