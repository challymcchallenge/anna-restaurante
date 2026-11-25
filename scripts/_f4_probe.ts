/**
 * Probă locală (temporară): traduce TOATE documentele restaurantului cu un traducător fals
 * („[EN] …”), ca să verificăm scrierea în baza de date pe toate colecțiile, fără cheie API.
 */
import { getPayload } from 'payload'

import config from '../src/payload.config'
import { documentStates, translatableCollections, translateDocument } from '../src/lib/translate/service'

const uri = process.env.DATABASE_URI || ''
if (!/@(localhost|127\.0\.0\.1)(:\d+)?\//.test(uri)) throw new Error('Doar local.')

const payload = await getPayload({ config })
const fake = async (items: { id: string; text: string }[], locale: string) => ({
  texts: new Map(items.map((i) => [i.id, `[${locale.toUpperCase()}] ${i.text}`])),
  inputTokens: 0,
  outputTokens: 0,
})
let ok = 0
let fail = 0
const errors: string[] = []
for (const collection of translatableCollections(payload)) {
  const { docs } = await payload.find({ collection, limit: 1000, pagination: false, depth: 0, overrideAccess: true })
  for (const d of docs) {
    const r = await translateDocument(payload, { collection, id: d.id, locales: ['en'], translate: fake as never })
    for (const o of r.outcomes) {
      if (o.ok) ok++
      else {
        fail++
        if (errors.length < 10) errors.push(`${collection}#${d.id}: ${o.error}`)
      }
    }
  }
  payload.logger.info(`${collection}: ${docs.length} documente`)
}
payload.logger.info(`OK ${ok}, erori ${fail}`)
for (const e of errors) payload.logger.info(e)
const home = await payload.find({ collection: 'home-page', limit: 1, depth: 0, locale: 'en' })
const h = home.docs[0] as unknown as Record<string, any>
payload.logger.info(`hero.subtitle en: ${h.hero?.subtitle}`)
const roHome = await payload.find({ collection: 'home-page', limit: 1, depth: 0, locale: 'ro' })
payload.logger.info(`hero.subtitle ro: ${(roHome.docs[0] as any).hero?.subtitle}`)
const st = await documentStates(payload, 'home-page', h.id)
payload.logger.info(`stări: ${JSON.stringify(st.states)}`)
process.exit(0)
