import { createHash } from 'crypto'

/**
 * Traducerile automate (F4, ADR-007, D-34, D-64), partea fără rețea: ce se traduce dintr-un document
 * și cum se pune la loc. Funcții pure, testate în `tests/int/f4-traduceri.int.spec.ts`.
 *
 * - Se traduc doar câmpurile marcate „se traduce” (`localized: true`) de tip text, textarea și text
 *   formatat (Lexical). Restul (nume, prețuri, imagini) rămâne comun tuturor limbilor.
 * - Textul formatat se trimite pe blocuri (paragraf, titlu, element de listă), cu formatările și
 *   linkurile marcate `<1>…</1>`, ca traducerea să le păstreze.
 * - Termenii care nu se traduc (nume proprii, saloane, tagline) devin `{0}`, `{1}` … înainte de
 *   traducere și se pun la loc după (testul F0: fără marcaje, 4 limbi din 6 traduceau numele).
 */

export type Path = (string | number)[]

export type Segment = {
  path: Path
  kind: 'text' | 'rich'
  /** Textul de tradus (la `rich`: blocul cu marcaje `<n>…</n>`). */
  source: string
  /** Limita de caractere a câmpului (doar la text și textarea). */
  max?: number
}

type AnyField = {
  type: string
  name?: string
  localized?: boolean
  maxLength?: number
  fields?: AnyField[]
  tabs?: (AnyField & { name?: string; fields: AnyField[] })[]
  blocks?: { slug: string; fields: AnyField[] }[]
}

/** Are colecția cel puțin un câmp „se traduce” de tip text? */
export function hasTranslatableFields(fields: AnyField[]): boolean {
  for (const f of fields) {
    if (f.localized && (f.type === 'text' || f.type === 'textarea' || f.type === 'richText')) return true
    if (f.fields && hasTranslatableFields(f.fields)) return true
    if (f.tabs && f.tabs.some((t) => hasTranslatableFields(t.fields))) return true
    if (f.blocks && f.blocks.some((b) => hasTranslatableFields(b.fields))) return true
  }
  return false
}

/** Câmpurile de stare (`i18nStatus`, `i18nSource`) nu se traduc. */
const SKIP = new Set(['i18nStatus', 'i18nSource'])

/** Toate segmentele de tradus dintr-un document (în română), în ordinea câmpurilor. */
export function collectSegments(fields: AnyField[], data: unknown, base: Path = [], inLocalized = false): Segment[] {
  const out: Segment[] = []
  if (!data || typeof data !== 'object') return out
  const obj = data as Record<string, unknown>
  for (const f of fields) {
    if (f.name && SKIP.has(f.name)) continue
    const localized = inLocalized || Boolean(f.localized)
    switch (f.type) {
      case 'text':
      case 'textarea': {
        const v = f.name ? obj[f.name] : undefined
        if (localized && f.name && typeof v === 'string' && v.trim()) {
          out.push({ path: [...base, f.name], kind: 'text', source: v, max: f.maxLength })
        }
        break
      }
      case 'richText': {
        const v = f.name ? obj[f.name] : undefined
        if (localized && f.name && v && typeof v === 'object') {
          out.push(...richSegments(v, [...base, f.name]))
        }
        break
      }
      case 'group': {
        if (f.name) out.push(...collectSegments(f.fields ?? [], obj[f.name], [...base, f.name], localized))
        else out.push(...collectSegments(f.fields ?? [], obj, base, localized))
        break
      }
      case 'row':
      case 'collapsible':
        out.push(...collectSegments(f.fields ?? [], obj, base, localized))
        break
      case 'tabs':
        for (const tab of f.tabs ?? []) {
          if (tab.name) out.push(...collectSegments(tab.fields, obj[tab.name], [...base, tab.name], localized || Boolean(tab.localized)))
          else out.push(...collectSegments(tab.fields, obj, base, localized))
        }
        break
      case 'array': {
        const rows = f.name ? obj[f.name] : undefined
        if (Array.isArray(rows)) {
          rows.forEach((row, i) => out.push(...collectSegments(f.fields ?? [], row, [...base, f.name as string, i], localized)))
        }
        break
      }
      case 'blocks': {
        const rows = f.name ? obj[f.name] : undefined
        if (Array.isArray(rows)) {
          rows.forEach((row, i) => {
            const block = f.blocks?.find((b) => b.slug === (row as { blockType?: string })?.blockType)
            if (block) out.push(...collectSegments(block.fields, row, [...base, f.name as string, i], localized))
          })
        }
        break
      }
      default:
        break
    }
  }
  return out
}

/* ---------------- Text formatat (Lexical) ---------------- */

type LexNode = {
  type: string
  text?: string
  format?: number | string
  children?: LexNode[]
  [k: string]: unknown
}

/** Blocurile cu text: paragrafe, titluri, citate și fiecare element de listă. */
function richSegments(value: unknown, base: Path): Segment[] {
  const out: Segment[] = []
  const root = (value as { root?: LexNode }).root
  if (!root?.children) return out
  const walk = (node: LexNode, path: Path) => {
    if (node.type === 'list') {
      node.children?.forEach((child, i) => walk(child, [...path, 'children', i]))
      return
    }
    if (!node.children?.length) return
    // Un element de listă care conține o listă: textul lui și lista dinăuntru, separat.
    if (node.type === 'listitem' && node.children.some((c) => c.type === 'list')) {
      node.children.forEach((child, i) => {
        if (child.type === 'list') walk(child, [...path, 'children', i])
      })
      return
    }
    const markup = toMarkup(node.children)
    if (markup.replace(/<\/?\d+>|<br\/>/g, '').trim()) out.push({ path, kind: 'rich', source: markup })
  }
  root.children.forEach((child, i) => walk(child, [...base, 'root', 'children', i]))
  return out
}

/** Copiii unui bloc → text cu marcaje: textul simplu rămâne, cel formatat sau cu link devine `<n>…</n>`. */
export function toMarkup(children: LexNode[]): string {
  let n = 0
  return children
    .map((c) => {
      if (c.type === 'linebreak') return '<br/>'
      if (c.type === 'text' && !Number(c.format)) return escapeMarkup(c.text ?? '')
      const text = c.type === 'text' ? (c.text ?? '') : inlineText(c)
      n += 1
      return `<${n}>${escapeMarkup(text)}</${n}>`
    })
    .join('')
}

const inlineText = (node: LexNode): string =>
  typeof node.text === 'string' ? node.text : (node.children ?? []).map(inlineText).join('')

/** `<` și `>` din text (rar) nu trebuie confundate cu marcajele. */
const escapeMarkup = (s: string) => s.replace(/</g, '‹').replace(/>/g, '›')
const unescapeMarkup = (s: string) => s.replace(/‹/g, '<').replace(/›/g, '>')

/**
 * Pune traducerea înapoi în copiii blocului: fiecare `<n>…</n>` își recapătă formatarea sau linkul,
 * textul dintre ele devine text simplu. Dacă marcajele nu se potrivesc (lipsă, dublate), întoarce
 * `null`, iar apelantul folosește textul fără formatare.
 */
export function fromMarkup(original: LexNode[], translated: string): LexNode[] | null {
  const formatted: LexNode[] = []
  for (const c of original) {
    if (c.type === 'linebreak') continue
    if (c.type === 'text' && !Number(c.format)) continue
    formatted.push(c)
  }
  const plainTemplate = original.find((c) => c.type === 'text' && !Number(c.format))
  const plain = (text: string): LexNode => ({
    ...(plainTemplate ?? { type: 'text', detail: 0, mode: 'normal', style: '', version: 1 }),
    type: 'text',
    format: 0,
    text: unescapeMarkup(text),
  })
  const out: LexNode[] = []
  const seen = new Set<number>()
  const re = /<(\d+)>([\s\S]*?)<\/\1>|<br\/>/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(translated))) {
    if (m.index > last) out.push(plain(translated.slice(last, m.index)))
    if (m[0] === '<br/>') {
      out.push({ type: 'linebreak', version: 1 })
    } else {
      const i = Number(m[1])
      const node = formatted[i - 1]
      if (!node || seen.has(i)) return null
      seen.add(i)
      out.push(withText(node, unescapeMarkup(m[2])))
    }
    last = m.index + m[0].length
  }
  if (last < translated.length) out.push(plain(translated.slice(last)))
  // Orice marcaj rămas netratat (de exemplu `<3>` fără închidere) = potrivire eșuată.
  if (out.some((n) => n.type === 'text' && /<\/?\d+>/.test(n.text ?? ''))) return null
  if (seen.size !== formatted.length) return null
  return out.filter((n) => n.type !== 'text' || (n.text ?? '') !== '')
}

/** Același nod (formatare, link) cu alt text. Un link își păstrează adresa și primul copil ca model. */
function withText(node: LexNode, text: string): LexNode {
  if (node.type === 'text') return { ...node, text }
  const first = node.children?.find((c) => c.type === 'text') ?? { type: 'text', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }
  return { ...node, children: [{ ...first, text }] }
}

/** Textul fără marcaje (rezerva când marcajele nu se potrivesc). */
export function stripMarkup(s: string): string {
  return unescapeMarkup(s.replace(/<br\/>/g, '\n').replace(/<\/?\d+>/g, ''))
}

/* ---------------- Termeni protejați ---------------- */

/**
 * Înlocuiește termenii care nu se traduc cu `{0}`, `{1}` … (cel mai lung întâi, ca „Salon Vittoria”
 * să nu fie rupt de „Vittoria”). `restore` îi pune la loc și spune dacă toți au supraviețuit.
 */
export function protectTerms(text: string, terms: string[]): { text: string; used: string[] } {
  const sorted = [...new Set(terms.map((t) => t.trim()).filter((t) => t.length > 1))].sort((a, b) => b.length - a.length)
  const used: string[] = []
  let out = text
  for (const term of sorted) {
    if (!out.includes(term)) continue
    const marker = `{${used.length}}`
    used.push(term)
    out = out.split(term).join(marker)
  }
  return { text: out, used }
}

export function restoreTerms(text: string, used: string[]): { text: string; ok: boolean } {
  let ok = true
  let out = text
  used.forEach((term, i) => {
    const marker = `{${i}}`
    if (!out.includes(marker)) ok = false
    out = out.split(marker).join(term)
  })
  // Un marcaj inventat (de exemplu `{7}` când avem 3 termeni) = rezultat greșit.
  if (/\{\d+\}/.test(out)) ok = false
  return { text: out, ok }
}

/* ---------------- Scriere și amprentă ---------------- */

/** Valoarea de la `path` într-un obiect (sau `undefined`). */
export function getAt(obj: unknown, path: Path): unknown {
  return path.reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string | number, unknown>)[k] : undefined), obj)
}

/** Scrie `value` la `path` (obiectul trebuie să aibă deja drumul până acolo). */
export function setAt(obj: unknown, path: Path, value: unknown): void {
  let o = obj as Record<string | number, unknown>
  for (const k of path.slice(0, -1)) {
    if (!o[k] || typeof o[k] !== 'object') o[k] = typeof path[path.indexOf(k) + 1] === 'number' ? [] : {}
    o = o[k] as Record<string | number, unknown>
  }
  o[path[path.length - 1]] = value
}

/**
 * Amprenta textului românesc: se schimbă doar când se schimbă un text de tradus. Salvată la fiecare
 * traducere, arată mai târziu dacă traducerea e „de reverificat” (DESI, A-24; D-64, F4-2).
 */
export function sourceHash(segments: Segment[]): string {
  const h = createHash('sha256')
  for (const s of segments) h.update(`${s.path.join('.')}\u0000${s.source}\u0001`)
  return h.digest('hex').slice(0, 16)
}

export type TranslationState = 'none' | 'auto' | 'verified' | 'stale-auto' | 'stale-verified'

/** Starea unei limbi pe un document: netradus, tradus automat, verificat de om, de retradus, de reverificat. */
export function translationState(status: string | null | undefined, savedHash: string | null | undefined, currentHash: string): TranslationState {
  if (status !== 'auto' && status !== 'verified') return 'none'
  if (savedHash !== currentHash) return status === 'auto' ? 'stale-auto' : 'stale-verified'
  return status
}

export const STATE_LABELS: Record<TranslationState, string> = {
  none: 'Netradus',
  auto: 'Tradus automat',
  verified: 'Verificat de om',
  'stale-auto': 'De retradus (româna s-a schimbat)',
  'stale-verified': 'De reverificat (româna s-a schimbat)',
}
