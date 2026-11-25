import Anthropic from '@anthropic-ai/sdk'

import type { LocaleCode } from '@/lib/locales'

/**
 * Motorul de traducere (D-34, D-64): Claude Haiku 5.5 prin API, cu cheia `TRANSLATE_API_KEY` din
 * Vercel (Production și Preview). Primește bucăți scurte de text (cu marcaje `{n}` și `<n>…</n>`) și
 * le întoarce traduse, în același număr și ordine. Ce nu se poate traduce rămâne în română pe site.
 */

export const TRANSLATE_MODEL = 'claude-haiku-5-5'

/** Prețul pe milion de tokeni (cereri sub 100K tokeni), documentația oficială, prețuri din 03.11.2026. */
const USD_PER_MTOK = { input: 0.1, output: 0.5 }

const LANGUAGE: Record<LocaleCode, string> = {
  ro: 'Romanian',
  en: 'English (British spelling)',
  it: 'Italian',
  fr: 'French',
  de: 'German',
  zh: 'Simplified Chinese',
  sv: 'Swedish',
}

/** Tonul pe limbă: cum se adresează un restaurant premium oaspeților (D-64, la fel ca textele fixe). */
const ADDRESS: Record<LocaleCode, string> = {
  ro: '',
  en: 'Address the guest as "you".',
  it: 'Address the guest informally ("tu"), as Italian restaurant websites usually do.',
  fr: 'Address the guest formally ("vous").',
  de: 'Address the guest formally ("Sie").',
  zh: 'Use the polite form "您".',
  sv: 'Address the guest as "du".',
}

export type Item = { id: string; text: string; max?: number }

export type BatchResult = {
  texts: Map<string, string>
  inputTokens: number
  outputTokens: number
}

export function translationAvailable(): boolean {
  return Boolean(process.env.TRANSLATE_API_KEY)
}

let client: Anthropic | null = null
function anthropic(): Anthropic {
  if (!process.env.TRANSLATE_API_KEY) throw new Error('Lipsește TRANSLATE_API_KEY (Vercel → Settings → Environment Variables).')
  client ??= new Anthropic({ apiKey: process.env.TRANSLATE_API_KEY, maxRetries: 3, timeout: 120_000 })
  return client
}

export function costUsd(inputTokens: number, outputTokens: number): number {
  return (inputTokens * USD_PER_MTOK.input + outputTokens * USD_PER_MTOK.output) / 1_000_000
}

function systemPrompt(target: LocaleCode, restaurant: string): string {
  return [
    `You translate the website of ${restaurant}, an Italian restaurant in Târgu Jiu, Romania, from Romanian into ${LANGUAGE[target]}.`,
    'The readers are guests and tourists choosing where to eat, book an event or stay. Write natural, warm, premium copy as a native copywriter would, not a word-for-word rendering. Keep the meaning, facts, numbers, prices, dates, phone numbers, e-mail addresses and URLs exactly.',
    ADDRESS[target],
    'Rules for every item:',
    '- Placeholders like {0}, {1} stand for names that must not be translated. Keep each one exactly once, unchanged, where it fits in the sentence.',
    '- Tags like <1>…</1>, <2>…</2> mark bold, italic or linked words, and <br/> is a line break. Keep every tag exactly once, around the translated words that correspond to the original, and do not add new tags.',
    '- Italian dish names (pizza, risotto, tiramisù…), wine names, producers and regions stay as they are.',
    '- If an item has "max", the translation must have at most that many characters; shorten wording if needed, never cut words.',
    '- Translate every item, even short labels. Do not add explanations, quotes or notes.',
    'Reply with JSON only: {"items":[{"id":"…","text":"…"}]} with the same ids, in the same order.',
  ]
    .filter(Boolean)
    .join('\n')
}

const SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'string' }, text: { type: 'string' } },
        required: ['id', 'text'],
        additionalProperties: false,
      },
    },
  },
  required: ['items'],
  additionalProperties: false,
} as const

function shortenPrompt(target: LocaleCode): string {
  return [
    `Each item is a ${LANGUAGE[target]} text from a restaurant website that is too long for its field.`,
    'Rewrite each one in the same language with at most "max" characters (count every character, including spaces), keeping the meaning and the warm, premium tone. Drop filler words before facts.',
    'Keep every placeholder like {0} and every tag like <1>…</1> or <br/> exactly once, unchanged.',
    'Reply with JSON only: {"items":[{"id":"…","text":"…"}]} with the same ids, in the same order.',
  ].join('\n')
}

/** A treia încercare pentru textele prea lungi: modelul primește propria traducere și limita exactă. */
export async function shortenBatch(items: Item[], target: LocaleCode): Promise<BatchResult> {
  if (!items.length) return { texts: new Map(), inputTokens: 0, outputTokens: 0 }
  const response = await anthropic().messages.create({
    model: TRANSLATE_MODEL,
    max_tokens: 8000,
    thinking: { type: 'disabled' },
    output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA as unknown as Record<string, unknown> } },
    system: shortenPrompt(target),
    messages: [{ role: 'user', content: JSON.stringify({ items: items.map((i) => ({ id: i.id, text: i.text, max: i.max })) }) }],
  })
  const usage = { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens }
  if (response.stop_reason !== 'end_turn') return { texts: new Map(), ...usage }
  const text = response.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('')
  const texts = new Map<string, string>()
  try {
    for (const it of (JSON.parse(text).items ?? []) as { id: string; text: string }[]) texts.set(it.id, it.text)
  } catch {
    // Răspuns nevalid: bucățile rămân în română.
  }
  return { texts, ...usage }
}

/** O cerere: până la ~40 de bucăți sau ~6.000 de caractere (le împarte apelantul, `chunk`). */
export async function translateBatch(items: Item[], target: LocaleCode, restaurant: string): Promise<BatchResult> {
  if (!items.length) return { texts: new Map(), inputTokens: 0, outputTokens: 0 }
  const response = await anthropic().messages.create({
    model: TRANSLATE_MODEL,
    max_tokens: 16000,
    // Traducerea nu are nevoie de raționament: fără gândire și efort scăzut (cost și timp mai mici).
    thinking: { type: 'disabled' },
    output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA as unknown as Record<string, unknown> } },
    system: systemPrompt(target, restaurant),
    messages: [
      {
        role: 'user',
        content: JSON.stringify({ items: items.map((i) => (i.max ? { id: i.id, text: i.text, max: i.max } : { id: i.id, text: i.text })) }),
      },
    ],
  })
  const usage = { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens }
  if (response.stop_reason === 'refusal') {
    throw new Error(`Traducerea a fost refuzată de model (${response.stop_details?.category ?? 'fără categorie'}).`)
  }
  if (response.stop_reason === 'max_tokens') throw new Error('Răspuns trunchiat (max_tokens); bucată prea mare.')
  const text = response.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('')
  let parsed: { items?: { id: string; text: string }[] }
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Răspunsul nu e JSON valid.')
  }
  const texts = new Map<string, string>()
  for (const it of parsed.items ?? []) if (typeof it?.id === 'string' && typeof it.text === 'string') texts.set(it.id, it.text)
  return { texts, ...usage }
}

/** Împarte bucățile în cereri de cel mult `maxItems` bucăți și `maxChars` caractere. */
export function chunk(items: Item[], maxItems = 40, maxChars = 6000): Item[][] {
  const out: Item[][] = []
  let cur: Item[] = []
  let chars = 0
  for (const it of items) {
    if (cur.length && (cur.length >= maxItems || chars + it.text.length > maxChars)) {
      out.push(cur)
      cur = []
      chars = 0
    }
    cur.push(it)
    chars += it.text.length
  }
  if (cur.length) out.push(cur)
  return out
}
