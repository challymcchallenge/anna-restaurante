import fs from 'fs'
import path from 'path'
import type { CollectionSlug, Payload, PayloadRequest } from 'payload'

/**
 * Conținut de pornire (F1, PLAN pasul 5). Citește fișierele `seed/<slug-restaurant>.json` (date, nu cod)
 * și le aplică restaurantului cu acel slug.
 *
 * Rulează după toate migrațiile (scripts/seed-starter.ts, apelat din scripts/vercel-build.sh), nu ca
 * migrație: folosește API-ul Payload, care presupune schema completă.
 * Fiecare colecție se aplică o singură dată pe restaurant (jurnalul `starterContentLog`): o colecție
 * nouă adăugată mai târziu în fișier se aplică la următorul build, iar una golită intenționat din panou
 * nu se mai completează. Dacă restaurantul are deja elemente într-o colecție, aceasta doar se notează.
 * Restaurantele fără fișier nu primesc nimic.
 */

type SeedFile = {
  tenantSlug: string
  settings?: Record<string, unknown>
  homePage?: Record<string, unknown>
  collections?: Partial<Record<CollectionSlug, Record<string, unknown>[]>>
}

/** Text simplu → document Lexical (paragrafe separate prin rând gol). */
export function toLexical(text: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: text.split(/\n{2,}/).map((paragraph) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        textStyle: '',
        children: [{ type: 'text', text: paragraph, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
      })),
    },
  }
}

/** Data relativă: `{ "$inDays": 18, "time": "20:00" }` → ISO, ora României. */
function relativeDate(spec: { $inDays: number; time?: string }) {
  const [h, m] = (spec.time ?? '20:00').split(':').map(Number)
  const day = new Date(Date.now() + spec.$inDays * 86_400_000)
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest' }).format(day)
  // Ora României: UTC+2 iarna, UTC+3 vara.
  const probe = new Date(`${ymd}T12:00:00Z`)
  const offsetH =
    Number(
      new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Bucharest', hour: '2-digit', hour12: false }).format(probe),
    ) - 12
  const utc = new Date(`${ymd}T00:00:00Z`)
  utc.setUTCHours(h - offsetH, m, 0, 0)
  return utc.toISOString()
}

function resolveValues(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(resolveValues)
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (typeof obj.$richText === 'string') return toLexical(obj.$richText)
    if (typeof obj.$inDays === 'number') return relativeDate(obj as { $inDays: number; time?: string })
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([key]) => key !== '$comment')
        .map(([key, v]) => [key, resolveValues(v)]),
    )
  }
  return value
}

export async function seedStarterContent({
  payload,
  req,
  dir = path.resolve(process.cwd(), 'seed'),
}: {
  payload: Payload
  req?: PayloadRequest
  dir?: string
}): Promise<{ tenant: string; created: Record<string, number> }[]> {
  if (!fs.existsSync(dir)) return []
  const report: { tenant: string; created: Record<string, number> }[] = []

  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
    const seed = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')) as SeedFile
    const { docs } = await payload.find({
      collection: 'tenants',
      where: { slug: { equals: seed.tenantSlug } },
      limit: 1,
      depth: 0,
      req,
    })
    const tenant = docs[0]
    if (!tenant) {
      payload.logger.info(`[seed] ${file}: restaurantul „${seed.tenantSlug}” nu există; sar peste.`)
      continue
    }
    const log: Record<string, string> = { ...((tenant.starterContentLog as Record<string, string>) ?? {}) }
    const created: Record<string, number> = {}
    const base = { tenant: tenant.id }
    const ctx = { seed: true }
    const now = new Date().toISOString()
    const alreadyLogged = Object.keys(log).length

    /**
     * O colecție se aplică o singură dată: dacă apare în jurnal, nu se mai atinge (poate fi golită
     * intenționat din panou). Dacă restaurantul are deja elemente în ea, doar se notează în jurnal.
     */
    const applyOnce = async (collection: CollectionSlug, items: Record<string, unknown>[]) => {
      if (log[collection]) return
      const { totalDocs } = await payload.count({ collection, where: { tenant: { equals: tenant.id } }, req })
      if (totalDocs === 0) {
        for (const item of items) {
          await payload.create({ collection, data: { ...(resolveValues(item) as object), ...base } as any, req, context: ctx })
        }
        created[collection] = items.length
      }
      log[collection] = now
    }

    if (seed.settings) await applyOnce('settings', [seed.settings])
    if (seed.homePage) await applyOnce('home-page', [seed.homePage])
    for (const [collection, items] of Object.entries(seed.collections ?? {}) as [CollectionSlug, Record<string, unknown>[]][]) {
      await applyOnce(collection, items)
    }

    if (Object.keys(log).length === alreadyLogged) {
      payload.logger.info(`[seed] ${seed.tenantSlug}: nimic nou de aplicat.`)
      continue
    }
    await payload.update({
      collection: 'tenants',
      id: tenant.id,
      data: { starterContentAt: Object.keys(created).length ? now : (tenant.starterContentAt ?? now), starterContentLog: log },
      req,
    })
    payload.logger.info(`[seed] ${seed.tenantSlug}: ${JSON.stringify(created)}`)
    report.push({ tenant: seed.tenantSlug, created })
  }
  return report
}
