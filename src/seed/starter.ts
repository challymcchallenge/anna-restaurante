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

/**
 * Fișiere de brand pentru Biblioteca media (F2): logo-urile primite de la Alin.
 * `file` e relativ la folderul `seed/`. Fișierul se încarcă o singură dată pe restaurant: dacă există
 * deja un element media cu același „Titlu intern”, se refolosește; dacă a fost încărcat și apoi
 * șters intenționat din panou (jurnalul `media:<key>`), nu se mai pune la loc.
 */
type SeedMedia = {
  key: string
  file: string
  kind: 'logo' | 'photo' | 'badge'
  title: string
  alt?: string
  credit?: string
}

type SeedFile = {
  tenantSlug: string
  settings?: Record<string, unknown>
  homePage?: Record<string, unknown>
  collections?: Partial<Record<CollectionSlug, Record<string, unknown>[]>>
  media?: SeedMedia[]
  /** Câmp din Setări restaurant → `key` din `media`. Se completează doar câmpurile goale. */
  settingsMedia?: Record<string, string>
  /**
   * Valori din Setări completate doar unde câmpul e gol (F2: tema direcției alese, D-41, D-42).
   * Grupurile (de exemplu `colors`) se completează câmp cu câmp; ce a pus Administratorul nu se atinge.
   */
  settingsFill?: Record<string, unknown>
  /**
   * F3: fișiere din `media` puse în câmpuri goale ale altor colecții (posterul hero, fotografia unei
   * categorii sau a unui vin). `field` poate fi un grup („hero.posterDesktop”); `match` alege
   * documentul după câmpuri simple (de exemplu numele). Fiecare rând se aplică o singură dată
   * (jurnalul `mediaFill:…`): un câmp golit intenționat din panou nu se mai completează.
   */
  mediaFill?: { collection: CollectionSlug; match?: Record<string, string>; field: string; media: string }[]
}

const isEmpty = (v: unknown) => v === null || v === undefined || v === ''
const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  Boolean(v) && typeof v === 'object' && !Array.isArray(v)

/** Câmpurile din `fill` care lipsesc în `current`; grupurile se întorc întregi, cu valorile existente păstrate. */
function fillEmpty(
  current: Record<string, unknown>,
  fill: Record<string, unknown>,
  prefix = '',
): { patch: Record<string, unknown>; paths: string[] } {
  const patch: Record<string, unknown> = {}
  const paths: string[] = []
  for (const [key, value] of Object.entries(fill)) {
    if (isPlainObject(value)) {
      const currentGroup = isPlainObject(current[key])
        ? (current[key] as Record<string, unknown>)
        : {}
      const inner = fillEmpty(currentGroup, value, `${prefix}${key}.`)
      if (inner.paths.length) {
        patch[key] = { ...currentGroup, ...inner.patch }
        paths.push(...inner.paths)
      }
    } else if (isEmpty(current[key])) {
      patch[key] = value
      paths.push(prefix + key)
    }
  }
  return { patch, paths }
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
        children: [
          {
            type: 'text',
            text: paragraph,
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0,
            version: 1,
          },
        ],
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
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Bucharest',
        hour: '2-digit',
        hour12: false,
      }).format(probe),
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
    if (typeof obj.$inDays === 'number')
      return relativeDate(obj as { $inDays: number; time?: string })
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

  for (const file of fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()) {
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
    const log: Record<string, string> = {
      ...((tenant.starterContentLog as Record<string, string>) ?? {}),
    }
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
      const { totalDocs } = await payload.count({
        collection,
        where: { tenant: { equals: tenant.id } },
        req,
      })
      if (totalDocs === 0) {
        for (const item of items) {
          await payload.create({
            collection,
            data: { ...(resolveValues(item) as object), ...base } as any,
            req,
            context: ctx,
          })
        }
        created[collection] = items.length
      }
      log[collection] = now
    }

    if (seed.settings) await applyOnce('settings', [seed.settings])
    if (seed.homePage) await applyOnce('home-page', [seed.homePage])
    for (const [collection, items] of Object.entries(seed.collections ?? {}) as [
      CollectionSlug,
      Record<string, unknown>[],
    ][]) {
      await applyOnce(collection, items)
    }

    const ids: Record<string, number | string> = {}
    if (seed.media?.length) {
      for (const item of seed.media) {
        const { docs: found } = await payload.find({
          collection: 'media',
          where: { and: [{ tenant: { equals: tenant.id } }, { title: { equals: item.title } }] },
          limit: 1,
          depth: 0,
          req,
        })
        if (found[0]) {
          ids[item.key] = found[0].id
          continue
        }
        if (log[`media:${item.key}`]) continue
        const doc = await payload.create({
          collection: 'media',
          data: {
            kind: item.kind,
            title: item.title,
            alt: item.alt,
            credit: item.credit,
            ...base,
          } as any,
          filePath: path.join(dir, item.file),
          req,
          context: ctx,
        })
        ids[item.key] = doc.id
        created.media = (created.media ?? 0) + 1
        log[`media:${item.key}`] = now
      }
      if (seed.settingsMedia) {
        const { docs: settingsDocs } = await payload.find({
          collection: 'settings',
          where: { tenant: { equals: tenant.id } },
          limit: 1,
          depth: 0,
          req,
        })
        const current = settingsDocs[0] as unknown as Record<string, unknown> | undefined
        if (current) {
          const patch: Record<string, unknown> = {}
          for (const [field, key] of Object.entries(seed.settingsMedia)) {
            if (!current[field] && ids[key] !== undefined) patch[field] = ids[key]
          }
          if (Object.keys(patch).length) {
            await payload.update({
              collection: 'settings',
              id: current.id as number,
              data: patch as any,
              req,
              context: ctx,
            })
            created.settingsMedia = Object.keys(patch).length
            log[`settingsMedia:${Object.keys(patch).sort().join(',')}`] = now
          }
        }
      }
    }

    for (const fill of seed.mediaFill ?? []) {
      const key = `mediaFill:${fill.collection}:${JSON.stringify(fill.match ?? {})}:${fill.field}`
      if (log[key] || ids[fill.media] === undefined) continue
      const { docs: targets } = await payload.find({
        collection: fill.collection,
        where: {
          and: [
            { tenant: { equals: tenant.id } },
            ...Object.entries(fill.match ?? {}).map(([k, v]) => ({ [k]: { equals: v } })),
          ],
        },
        limit: 1,
        depth: 0,
        req,
      })
      const target = targets[0] as unknown as Record<string, unknown> | undefined
      if (!target) continue
      const [group, leaf] = fill.field.includes('.') ? fill.field.split('.', 2) : [null, fill.field]
      const container = (group ? (target[group] as Record<string, unknown> | undefined) : target) ?? {}
      if (isEmpty(container[leaf])) {
        // Grupul se trimite întreg, cu valorile existente, ca nimic din el să nu se piardă.
        const data = group ? { [group]: { ...container, [leaf]: ids[fill.media] } } : { [leaf]: ids[fill.media] }
        await payload.update({
          collection: fill.collection,
          id: target.id as number,
          data: data as any,
          req,
          context: ctx,
        })
        created.mediaFill = (created.mediaFill ?? 0) + 1
      }
      log[key] = now
    }

    if (seed.settingsFill) {
      const { docs: settingsDocs } = await payload.find({
        collection: 'settings',
        where: { tenant: { equals: tenant.id } },
        limit: 1,
        depth: 0,
        req,
      })
      const current = settingsDocs[0] as unknown as Record<string, unknown> | undefined
      if (current) {
        const { patch, paths } = fillEmpty(current, seed.settingsFill)
        if (paths.length) {
          await payload.update({
            collection: 'settings',
            id: current.id as number,
            data: patch as any,
            req,
            context: ctx,
          })
          created.settingsFill = paths.length
          log[`settingsFill:${paths.sort().join(',')}`] = now
        }
      }
    }

    if (Object.keys(log).length === alreadyLogged) {
      payload.logger.info(`[seed] ${seed.tenantSlug}: nimic nou de aplicat.`)
      continue
    }
    await payload.update({
      collection: 'tenants',
      id: tenant.id,
      data: {
        starterContentAt: Object.keys(created).length ? now : (tenant.starterContentAt ?? now),
        starterContentLog: log,
      },
      req,
    })
    payload.logger.info(`[seed] ${seed.tenantSlug}: ${JSON.stringify(created)}`)
    report.push({ tenant: seed.tenantSlug, created })
  }
  return report
}
