import { contrastRatio, validateHexColor } from '../fields'
import { DEFAULT_FONTS, findFont, fontFaceCss, type ApprovedFont } from './fonts'

/**
 * Tema pe restaurant (ADR-002, content-model R1, docs/design-system.md).
 * Culorile și fonturile se citesc din „Setări restaurant”; ce lipsește se completează cu valorile
 * direcției B · Carta, aleasă de Alin la GATE 2 (D-41). Nimic specific Trattoriei nu stă în componente:
 * componentele folosesc doar variabilele CSS de mai jos.
 */

export type ThemeColors = {
  /** Fundalul paginilor (hârtie). */
  background: string
  /** Textul pe fundalul paginilor. */
  text: string
  /** Fundalul închis: hero, footer, bara de jos pe telefon (coperta). */
  surfaceDark: string
  /** Textul pe fundalul închis. */
  textOnDark: string
  /** Accent: butonul principal, liniile de folio, etichetele pe fundalul închis. */
  accent: string
  /** Accent secundar: butonul secundar, pe fundalul paginilor. */
  accent2: string
}

/** Direcția B · Carta, cu butoanele verzi cerute la GO (D-41). Contrastele sunt în CONTRAST_PAIRS. */
export const DEFAULT_THEME_COLORS: ThemeColors = {
  background: '#F5EDE0',
  text: '#241A17',
  surfaceDark: '#1C1416',
  textOnDark: '#F3E9DA',
  accent: '#D6AE66',
  accent2: '#14613F',
}

export const COLOR_LABELS: Record<keyof ThemeColors, string> = {
  background: 'fundal',
  text: 'text',
  surfaceDark: 'fundal închis',
  textOnDark: 'text pe fundal închis',
  accent: 'accent',
  accent2: 'accent secundar',
}

/**
 * Perechile care trebuie să aibă minimum 4,5:1 (text normal, WCAG AA). Panoul nu lasă salvarea sub prag.
 * Butonul principal: text `surfaceDark` pe `accent`. Butonul secundar: text `background` pe `accent2`.
 */
export const CONTRAST_PAIRS: { fg: keyof ThemeColors; bg: keyof ThemeColors; label: string }[] = [
  { fg: 'text', bg: 'background', label: 'între text și fundal' },
  {
    fg: 'textOnDark',
    bg: 'surfaceDark',
    label: 'între textul pe fundal închis și fundalul închis',
  },
  { fg: 'accent', bg: 'surfaceDark', label: 'între accent și fundalul închis (etichete, linii)' },
  { fg: 'surfaceDark', bg: 'accent', label: 'pe butonul principal (fundal închis pe accent)' },
  { fg: 'background', bg: 'accent2', label: 'pe butonul secundar (fundal pe accent secundar)' },
]

export const MIN_CONTRAST = 4.5

const fmt = (n: number) => n.toFixed(2).replace('.', ',')

/** Culorile completate cu valorile implicite unde lipsesc sau sunt invalide. */
export function resolveColors(
  colors?: Partial<Record<keyof ThemeColors, unknown>> | null,
): ThemeColors {
  const out = { ...DEFAULT_THEME_COLORS }
  for (const key of Object.keys(out) as (keyof ThemeColors)[]) {
    const v = colors?.[key]
    if (typeof v === 'string' && v && validateHexColor(v) === true) out[key] = v.toUpperCase()
  }
  return out
}

/** Raportul de contrast pe toate perechile. */
export function contrastReport(colors: ThemeColors) {
  return CONTRAST_PAIRS.map((p) => {
    const ratio = contrastRatio(colors[p.fg], colors[p.bg])
    return { ...p, ratio, ok: ratio >= MIN_CONTRAST }
  })
}

/**
 * Validarea unui câmp de culoare din Setări: verifică toate perechile în care apare câmpul,
 * față de valorile completate în același grup. Mesajul păstrează forma „Contrast X:1 … minimum 4,5:1”.
 */
export function validateColorField(
  field: keyof ThemeColors,
  value: unknown,
  siblings: Record<string, unknown> | undefined,
): true | string {
  if (!value || validateHexColor(value) !== true) return true
  for (const p of CONTRAST_PAIRS) {
    if (p.fg !== field && p.bg !== field) continue
    const other = p.fg === field ? p.bg : p.fg
    const otherValue = siblings?.[other]
    if (!otherValue || validateHexColor(otherValue) !== true) continue
    const fg = p.fg === field ? String(value) : String(otherValue)
    const bg = p.bg === field ? String(value) : String(otherValue)
    const ratio = contrastRatio(fg, bg)
    if (ratio < MIN_CONTRAST) return `Contrast ${fmt(ratio)}:1 ${p.label}; minimum 4,5:1.`
  }
  return true
}

export type ThemeSettings = {
  colors?: Partial<Record<keyof ThemeColors, unknown>> | null
  fontHeading?: string | null
  fontText?: string | null
}

/** Variabilele CSS ale unui restaurant. Componentele site-ului public folosesc doar aceste nume. */
export function themeCssVars(settings: ThemeSettings | null | undefined): Record<string, string> {
  const c = resolveColors(settings?.colors)
  const heading = findFont(settings?.fontHeading ?? DEFAULT_FONTS.heading, 'heading')
  const text = findFont(settings?.fontText ?? DEFAULT_FONTS.text, 'text')
  return {
    '--c-bg': c.background,
    '--c-text': c.text,
    // Text secundar: 70% text peste fundal (≥ 4,5:1 cu valorile implicite; testat).
    '--c-text-2': `color-mix(in srgb, ${c.text} 70%, ${c.background})`,
    '--c-dark': c.surfaceDark,
    '--c-on-dark': c.textOnDark,
    '--c-on-dark-2': `color-mix(in srgb, ${c.textOnDark} 75%, ${c.surfaceDark})`,
    '--c-accent': c.accent,
    // Folio pe hârtie (etichete, rame): 45% accent spre text; cu valorile implicite ≈ #745D3B, 5,39:1 (testat).
    '--c-accent-ink': `color-mix(in srgb, ${c.accent} 45%, ${c.text})`,
    '--c-on-accent': c.surfaceDark,
    '--c-accent-2': c.accent2,
    '--c-on-accent-2': c.background,
    '--font-display': `'${heading.family}', ${heading.fallback}`,
    '--font-text': `'${text.family}', ${text.fallback}`,
  }
}

/** Fonturile de încărcat pentru un restaurant (titluri + text). */
export function themeFonts(settings: ThemeSettings | null | undefined): ApprovedFont[] {
  return [
    findFont(settings?.fontHeading ?? DEFAULT_FONTS.heading, 'heading'),
    findFont(settings?.fontText ?? DEFAULT_FONTS.text, 'text'),
  ]
}

/** Blocul <style> cu fonturile și variabilele, pentru <head> în F3. */
export function themeStyleSheet(settings: ThemeSettings | null | undefined): string {
  const vars = Object.entries(themeCssVars(settings))
    .map(([k, v]) => `${k}:${v}`)
    .join(';')
  // Chineza (F4-5, D-64): fonturile temei n-au semne chinezești; după ele vine fontul sistemului, fără
  // font web în plus. Literele latine (nume, prețuri) rămân în fonturile temei.
  const [heading, text] = themeFonts(settings)
  const cjk = `'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', 'Noto Sans SC'`
  const zh = `html:lang(zh){--font-display:'${heading.family}', ${cjk}, ${heading.fallback};--font-text:'${text.family}', ${cjk}, ${text.fallback}}`
  return `${fontFaceCss(themeFonts(settings))}\n:root{${vars}}\n${zh}`
}
