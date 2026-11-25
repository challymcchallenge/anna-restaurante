import { getPayload } from 'payload'
import config from '../src/payload.config'
const payload = await getPayload({ config })
const s = (await payload.find({ collection: 'salons', limit: 1, depth: 0, locale: 'all' as never })).docs[0] as any
console.log('salon amenities (all locales):', JSON.stringify(s.amenities?.slice(0, 2)))
const lp = (await payload.find({ collection: 'legal-pages', limit: 1, depth: 0, locale: 'ro' })).docs[0] as any
const lpEn = (await payload.find({ collection: 'legal-pages', limit: 1, depth: 0, locale: 'en' })).docs[0] as any
const first = (d: any) => JSON.stringify(d.content.root.children.find((c: any) => c.children?.length)?.children?.map((x: any) => [x.type, x.format, x.text ?? x.children?.[0]?.text]))
console.log('legal ro:', first(lp).slice(0, 200))
console.log('legal en:', first(lpEn).slice(0, 200))
await payload.update({ collection: 'settings', where: {}, data: { activeLocales: ['ro', 'en', 'it', 'fr', 'de', 'zh', 'sv'] } as any, overrideAccess: true, context: { i18nAuto: true } })
console.log('activeLocales set (local)')
process.exit(0)
