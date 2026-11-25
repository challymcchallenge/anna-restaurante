import { getPayload } from 'payload'
import config from '../src/payload.config'
import { overview, translateBatchRun } from '../src/lib/translate/service'
const payload = await getPayload({ config })
const tenant = (await payload.find({ collection: 'tenants', limit: 1, depth: 0 })).docs[0]
let calls = 0
const fake = async (items: { id: string; text: string }[], locale: string) => {
  calls++
  await new Promise((r) => setTimeout(r, 1500))
  return { texts: new Map(items.map((i) => [i.id, `[${locale.toUpperCase()}] ${i.text}`])), inputTokens: 0, outputTokens: 0 }
}
const t0 = Date.now()
for (let round = 1; round <= 40; round++) {
  const r = await translateBatchRun(payload, { tenantId: tenant.id, locales: ['it', 'fr'], mode: 'missing', budgetMs: 45_000, translate: fake as never })
  console.log(`tura ${round}: ${r.locale} done ${r.done} failed ${r.failed.length} remaining ${r.remaining} (${((Date.now() - t0) / 1000).toFixed(0)} s, ${calls} cereri)`)
  if (r.failed.length) console.log(r.failed.slice(0, 3))
  if (!r.remaining) break
}
const ov = await overview(payload, tenant.id)
console.log(JSON.stringify({ it: ov.it, fr: ov.fr, en: ov.en, docs: ov.documents }))
process.exit(0)
