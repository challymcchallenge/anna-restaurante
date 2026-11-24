/**
 * Setul aprobat de fonturi (content-model G3, D-42). Global: livrat odată cu site-ul, nu încărcat din panou.
 * Fiecare restaurant alege din el un font pentru titluri și unul pentru text (Setări restaurant → Identitate).
 *
 * Toate sunt OFL 1.1, găzduite pe site (`public/fonts/`, din pachetele @fontsource 5.3.0).
 * Diacriticele românești (ș ț cu virgulă U+0218–021B, ă â î) au fost verificate în fișiere cu fontTools
 * pe 24.11.2026 (docs/2026_11_24_Trattoria_GATE2.md, secțiunea 5). Un font nou intră în set doar după
 * aceeași verificare.
 */

export type FontRole = 'heading' | 'text'

export type ApprovedFont = {
  id: string
  label: string
  role: FontRole
  /** Numele din `font-family`. */
  family: string
  /** Fonturi de rezervă, până se încarcă fișierul. */
  fallback: string
  weights: number[]
  /** Cu ce seamănă (pentru panou). */
  note: string
}

export const APPROVED_FONTS: ApprovedFont[] = [
  {
    id: 'belleza',
    label: 'Belleza',
    role: 'heading',
    family: 'Belleza',
    fallback: "'Optima', 'Candara', 'Segoe UI', sans-serif",
    weights: [400],
    note: 'Cel mai apropiat de Optima (vineyard.co.za)',
  },
  {
    id: 'tenor-sans',
    label: 'Tenor Sans',
    role: 'heading',
    family: 'Tenor Sans',
    fallback: "'Optima', 'Candara', 'Segoe UI', sans-serif",
    weights: [400],
    note: 'Optima mai lată, ca o inscripție',
  },
  {
    id: 'hanken-grotesk',
    label: 'Hanken Grotesk',
    role: 'text',
    family: 'Hanken Grotesk',
    fallback: "'Segoe UI', system-ui, -apple-system, sans-serif",
    weights: [400, 500, 600],
    note: 'Cel mai apropiat de PP Mori (vineyard.co.za)',
  },
  {
    id: 'host-grotesk',
    label: 'Host Grotesk',
    role: 'text',
    family: 'Host Grotesk',
    fallback: "'Segoe UI', system-ui, -apple-system, sans-serif",
    weights: [400, 500, 600],
    note: 'Grotesk cald, alternativă la PP Mori',
  },
]

/** Fonturile direcției B · Carta (D-41), folosite cât timp Setările nu aleg altele. */
export const DEFAULT_FONTS: Record<FontRole, string> = {
  heading: 'belleza',
  text: 'hanken-grotesk',
}

export function fontOptions(role: FontRole) {
  return APPROVED_FONTS.filter((f) => f.role === role).map((f) => ({
    value: f.id,
    label: `${f.label} · ${f.note}`,
  }))
}

export function findFont(id: string | null | undefined, role: FontRole): ApprovedFont {
  return (
    APPROVED_FONTS.find((f) => f.id === id && f.role === role) ??
    (APPROVED_FONTS.find((f) => f.id === DEFAULT_FONTS[role]) as ApprovedFont)
  )
}

/** Intervalele Unicode ale subseturilor @fontsource (latin și latin-ext, unde stau ș ț ă â î). */
const RANGES = {
  latin:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  'latin-ext':
    'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
} as const

/** Fișierele unui font, așa cum sunt servite din `public/fonts/`. */
export function fontFiles(font: ApprovedFont) {
  return font.weights.flatMap((weight) =>
    (Object.keys(RANGES) as (keyof typeof RANGES)[]).map((subset) => ({
      weight,
      subset,
      url: `/fonts/${font.id}-${subset}-${weight}-normal.woff2`,
      unicodeRange: RANGES[subset],
    })),
  )
}

/** Regulile @font-face pentru fonturile alese de un restaurant (doar ele se descarcă). */
export function fontFaceCss(fonts: ApprovedFont[]): string {
  return fonts
    .flatMap((font) =>
      fontFiles(font).map(
        (f) =>
          `@font-face{font-family:'${font.family}';src:url('${f.url}') format('woff2');font-weight:${f.weight};font-style:normal;font-display:swap;unicode-range:${f.unicodeRange}}`,
      ),
    )
    .join('\n')
}
