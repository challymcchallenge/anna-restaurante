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
  /**
   * Elementele unei colecții. Valorile pot face trimitere la fișiere din `media`
   * (`{ "$media": "cheie" }`) sau la documente deja create (`{ "$ref": { "collection": "…",
   * "where": { "name": "…" } } }`, de exemplu categoria unui element de galerie, F3 pasul 8).
   */
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
  mediaFill?: {
    collection: CollectionSlug
    match?: Record<string, string>
    field: string
    media: string
    /** D-68: pune fișierul chiar dacă în câmp e altul (o singură dată), când Alin a cerut înlocuirea. */
    replace?: boolean
  }[]
  /**
   * F3 (D-46): o listă reală care înlocuiește exemplele unei colecții (de exemplu lista de vinuri).
   * Se aplică o singură dată pe versiune (jurnalul `list:<colecție>:<versiune>`): șterge doar
   * elementele bifate „Provizoriu” (exemplele de pornire), apoi adaugă rândurile care nu există deja
   * (potrivire pe câmpurile din `matchOn`). Ce a adăugat Administratorul nu se atinge.
   */
  lists?: {
    collection: CollectionSlug
    version: string
    matchOn: string[]
    items: Record<string, unknown>[]
    /** F5: colecții fără „Provizoriu” (de exemplu Redirecționări): nu se șterge nimic, doar se adaugă. */
    keepPlaceholders?: boolean
  }[]
  /**
   * Valori schimbate o singură dată și doar dacă au rămas cele puse de conținutul de pornire
   * (jurnalul `swap:<colecție>:<câmp>`): ce a schimbat Administratorul din panou nu se atinge.
   * `field` poate fi un grup („wines.title”). `fromMedia` / `toMedia` sunt chei din `media`.
   */
  /**
   * F3 (D-51): destinatarii și copiile pe subiect (Setări → Cereri și emailuri), date de Alin.
   * O singură dată pe versiune (jurnalul `requests:<versiune>`). Un subiect se completează doar dacă
   * destinatarii lui actuali sunt goi sau sunt toți în lista nouă: ce a scris altfel Administratorul
   * din panou nu se atinge.
   */
  requestsFill?: {
    version: string
    subjects: Record<string, { active?: boolean; recipients?: string[]; cc?: string[] }>
  }
  /**
   * Fotografiile provizorii scoase de pe site, o singură dată pe versiune (jurnalul `purge:<versiune>`):
   * fișierele din Biblioteca media al căror titlu începe cu `titlePrefix` și al căror credit conține
   * `creditContains`. Întâi elementele de galerie „Provizoriu” care le folosesc, apoi fișierele (cu
   * variantele lor din Storage). Celelalte trimiteri devin goale singure (`ON DELETE set null`).
   * Ce a încărcat Administratorul (alt titlu sau fără creditul acesta) nu se atinge.
   */
  purgeMedia?: { version: string; titlePrefix: string; creditContains: string }
  swaps?: {
    /** Setări, Pagina Acasă sau o colecție (atunci cu `match`, de exemplu întrebarea unei FAQ). */
    collection: CollectionSlug
    match?: Record<string, string>
    field: string
    from?: unknown
    to?: unknown
    fromMedia?: string
    toMedia?: string
    /** A doua schimbare a aceluiași câmp (de exemplu un text final rescris): cheie nouă în jurnal. */
    version?: string
    /**
     * În loc de `from`: se schimbă doar dacă textul de acum conține acest fragment (de exemplu un text
     * lipit din alt site, G11-1). Ce a scris altfel Administratorul nu se atinge.
     */
    whenContains?: string
    /** Alte câmpuri setate odată cu schimbarea (de exemplu „Provizoriu”). */
    alsoSet?: Record<string, unknown>
  }[]
}

// O listă goală (de exemplu „Dotări” necompletate) contează tot ca valoare goală (D-59).
const isEmpty = (v: unknown) => v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0)
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

const textNode = (text: string) => ({
  type: 'text',
  text,
  format: 0,
  style: '',
  mode: 'normal',
  detail: 0,
  version: 1,
})
const blockBase = { format: '', indent: 0, version: 1, direction: 'ltr' }

/** Un bloc de text → noduri Lexical. Titlul („## ”, „### ”) ține doar primul rând; restul blocului se citește separat. */
function blockNodes(block: string): unknown[] {
  const [first, ...rest] = block.split('\n')
  const heading = first.match(/^(#{2,3}) (.+)$/)
  if (heading) {
    const node = { type: 'heading', tag: heading[1].length === 2 ? 'h2' : 'h3', ...blockBase, children: [textNode(heading[2])] }
    return rest.length ? [node, ...blockNodes(rest.join('\n'))] : [node]
  }
  const lines = block.split('\n')
  if (lines.every((l) => l.startsWith('- '))) {
    return [
      {
        type: 'list',
        listType: 'bullet',
        start: 1,
        tag: 'ul',
        ...blockBase,
        children: lines.map((l, i) => ({ type: 'listitem', value: i + 1, ...blockBase, children: [textNode(l.slice(2))] })),
      },
    ]
  }
  return [{ type: 'paragraph', ...blockBase, textFormat: 0, textStyle: '', children: [textNode(block)] }]
}

/**
 * Text simplu → document Lexical. Blocurile se despart prin rând gol; un rând care începe cu
 * „## ” sau „### ” la începutul blocului devine titlu (h2, h3), iar un bloc cu toate rândurile
 * „- …” devine listă (F3 pasul 10).
 */
export function toLexical(text: string) {
  return {
    root: {
      type: 'root',
      ...blockBase,
      children: text.split(/\n{2,}/).flatMap(blockNodes),
    },
  }
}

/** Textul simplu al unui document Lexical (paragrafele despărțite de un rând gol), ca în `toLexical`. */
export function lexicalText(doc: unknown): string | null {
  const root = isPlainObject(doc) && isPlainObject(doc.root) ? (doc.root as { children?: unknown[] }) : null
  if (!root) return null
  return (root.children ?? [])
    .map((p) =>
      ((isPlainObject(p) ? (p.children as unknown[]) : []) ?? [])
        .map((t) => (isPlainObject(t) && typeof t.text === 'string' ? t.text : ''))
        .join(''),
    )
    .join('\n\n')
}

/**
 * F5 (G15-1): tot textul unui document Lexical, inclusiv din liste, linkuri și alte noduri imbricate.
 * Folosit la `whenContains`: un fragment dintr-o listă (de exemplu „Web3Forms”) trebuie găsit și el.
 */
export function lexicalDeepText(doc: unknown): string {
  const walk = (node: unknown): string => {
    if (!isPlainObject(node)) return ''
    const own = typeof node.text === 'string' ? node.text : ''
    const kids = Array.isArray(node.children) ? (node.children as unknown[]).map(walk).join(' ') : ''
    return `${own} ${kids}`
  }
  return isPlainObject(doc) ? walk(doc.root).replace(/\s+/g, ' ').trim() : ''
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
    /** Id-urile fișierelor din `media`, după cheie (completate la încărcare). */
    const ids: Record<string, number | string> = {}

    /** `{ "$media": "cheie" }` → id-ul fișierului; `{ "$ref": … }` → id-ul documentului găsit. */
    const resolveRefs = async (value: unknown): Promise<unknown> => {
      if (Array.isArray(value)) return Promise.all(value.map(resolveRefs))
      if (!isPlainObject(value)) return value
      if (typeof value.$media === 'string') {
        const id = ids[value.$media]
        if (id === undefined) throw new Error(`[seed] fișierul „${value.$media}” nu există în media`)
        return id
      }
      if (isPlainObject(value.$ref)) {
        const ref = value.$ref as { collection: CollectionSlug; where: Record<string, string> }
        const { docs: found } = await payload.find({
          collection: ref.collection,
          where: {
            and: [
              { tenant: { equals: tenant.id } },
              ...Object.entries(ref.where).map(([k, v]) => ({ [k]: { equals: v } })),
            ],
          },
          limit: 1,
          depth: 0,
          req,
        })
        if (!found[0]) throw new Error(`[seed] ${ref.collection} ${JSON.stringify(ref.where)} nu există`)
        return found[0].id
      }
      return Object.fromEntries(
        await Promise.all(Object.entries(value).map(async ([k, v]) => [k, await resolveRefs(v)] as const)),
      )
    }

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
        let count = 0
        for (const item of items) {
          let data: unknown
          try {
            data = await resolveRefs(resolveValues(item))
          } catch (error) {
            // Un fișier șters intenționat din panou nu oprește build-ul: elementul se sare.
            payload.logger.warn(`${(error as Error).message}; sar peste un element din ${collection}.`)
            continue
          }
          await payload.create({ collection, data: { ...(data as object), ...base } as any, req, context: ctx })
          count++
        }
        created[collection] = count
      }
      log[collection] = now
    }


    if (seed.settings) await applyOnce('settings', [seed.settings])
    if (seed.homePage) await applyOnce('home-page', [seed.homePage])

    for (const list of seed.lists ?? []) {
      const key = `list:${list.collection}:${list.version}`
      if (log[key]) continue
      const { docs: examples } = list.keepPlaceholders
        ? { docs: [] }
        : await payload.delete({
            collection: list.collection,
            where: { and: [{ tenant: { equals: tenant.id } }, { placeholder: { equals: true } }] },
            req,
            context: ctx,
          })
      const { docs: existing } = await payload.find({
        collection: list.collection,
        where: { tenant: { equals: tenant.id } },
        limit: 2000,
        depth: 0,
        pagination: false,
        req,
      })
      const signature = (doc: Record<string, unknown>) =>
        JSON.stringify(list.matchOn.map((f) => (isEmpty(doc[f]) ? null : doc[f])))
      const known = new Set(existing.map((d) => signature(d as unknown as Record<string, unknown>)))
      let added = 0
      for (const item of list.items) {
        if (known.has(signature(item))) continue
        await payload.create({
          collection: list.collection,
          data: { ...(resolveValues(item) as object), ...base } as any,
          req,
          context: ctx,
        })
        added++
      }
      created[`${list.collection}:lista`] = added
      if (examples.length) created[`${list.collection}:exemple-sterse`] = examples.length
      log[key] = now
    }

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

    // Colecțiile se aplică după încărcarea fișierelor, ca elementele să le poată folosi ($media).
    for (const [collection, items] of Object.entries(seed.collections ?? {}) as [
      CollectionSlug,
      Record<string, unknown>[],
    ][]) {
      await applyOnce(collection, items)
    }

    for (const fill of seed.mediaFill ?? []) {
      const key = `mediaFill:${fill.collection}:${JSON.stringify(fill.match ?? {})}:${fill.field}${fill.replace ? `:${fill.media}` : ''}`
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
      if (fill.replace || isEmpty(container[leaf])) {
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

    for (const swap of seed.swaps ?? []) {
      const key =
        (swap.match
          ? `swap:${swap.collection}:${JSON.stringify(swap.match)}:${swap.field}`
          : `swap:${swap.collection}:${swap.field}`) + (swap.version ? `:${swap.version}` : '')
      if (log[key]) continue
      const from = swap.fromMedia !== undefined ? ids[swap.fromMedia] : swap.from
      const to = swap.toMedia !== undefined ? ids[swap.toMedia] : swap.to
      if (to === undefined || (swap.fromMedia !== undefined && from === undefined)) continue
      const { docs: targets } = await payload.find({
        collection: swap.collection,
        where: {
          and: [
            { tenant: { equals: tenant.id } },
            ...Object.entries(swap.match ?? {}).map(([k, v]) => ({ [k]: { equals: v } })),
          ],
        },
        limit: 1,
        depth: 0,
        req,
      })
      const target = targets[0] as unknown as Record<string, unknown> | undefined
      if (!target) continue
      const [group, leaf] = swap.field.includes('.') ? swap.field.split('.', 2) : [null, swap.field]
      const container = (group ? (target[group] as Record<string, unknown> | undefined) : target) ?? {}
      const current = container[leaf]
      // Text formatat: se compară textul simplu, iar valoarea nouă devine document Lexical.
      const rich = isPlainObject(from) && typeof from.$richText === 'string'
      const same = swap.whenContains
        ? (typeof current === 'string' ? current : lexicalDeepText(current)).includes(swap.whenContains)
        : rich
          ? lexicalText(current) === (from as { $richText: string }).$richText
          : isEmpty(from)
            ? isEmpty(current)
            : current === from
      if (same) {
        const value = resolveValues(to)
        const data = {
          ...(group ? { [group]: { ...container, [leaf]: value } } : { [leaf]: value }),
          ...(swap.alsoSet ?? {}),
        }
        await payload.update({
          collection: swap.collection,
          id: target.id as number,
          data: data as any,
          req,
          context: ctx,
        })
        created.swaps = (created.swaps ?? 0) + 1
      }
      log[key] = now
    }

    if (seed.requestsFill && !log[`requests:${seed.requestsFill.version}`]) {
      const { docs: settingsDocs } = await payload.find({
        collection: 'settings',
        where: { tenant: { equals: tenant.id } },
        limit: 1,
        depth: 0,
        req,
      })
      const current = settingsDocs[0] as unknown as Record<string, unknown> | undefined
      if (current) {
        const requests = { ...((current.requests as Record<string, Record<string, unknown>>) ?? {}) }
        const changed: string[] = []
        for (const [subject, next] of Object.entries(seed.requestsFill.subjects)) {
          const cur = requests[subject] ?? {}
          const existing = (cur.recipients as string[] | null | undefined) ?? []
          if (!existing.every((r) => next.recipients?.includes(r))) continue
          requests[subject] = { ...cur, ...next }
          changed.push(subject)
        }
        if (changed.length) {
          await payload.update({
            collection: 'settings',
            id: current.id as number,
            data: { requests } as any,
            req,
            context: ctx,
          })
          created.requests = changed.length
        }
        log[`requests:${seed.requestsFill.version}`] = now
      }
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

    // D-66: fotografiile demo (Wikimedia) scoase de pe site, la cererea lui Alin. Rulează după tot
    // restul, ca într-o bază nouă să nu rămână nimic din ele.
    if (seed.purgeMedia && !log[`purge:${seed.purgeMedia.version}`]) {
      const { titlePrefix, creditContains } = seed.purgeMedia
      const { docs: demo } = await payload.find({
        collection: 'media',
        where: {
          and: [
            { tenant: { equals: tenant.id } },
            { title: { like: titlePrefix } },
            { credit: { contains: creditContains } },
          ],
        },
        limit: 100,
        depth: 0,
        pagination: false,
        req,
      })
      const ids = demo.filter((m) => String(m.title ?? '').startsWith(titlePrefix)).map((m) => m.id)
      if (ids.length) {
        const gallery = await payload.delete({
          collection: 'gallery',
          where: { and: [{ tenant: { equals: tenant.id } }, { placeholder: { equals: true } }, { file: { in: ids } }] },
          req,
          context: ctx,
        })
        const removed = await payload.delete({ collection: 'media', where: { id: { in: ids } }, req, context: ctx, overrideAccess: true })
        created['purge:gallery'] = gallery.docs.length
        created['purge:media'] = removed.docs.length
      }
      log[`purge:${seed.purgeMedia.version}`] = now
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
