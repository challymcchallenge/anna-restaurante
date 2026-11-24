import type { HomePage } from '@/payload-types'

/**
 * Secțiunile paginii Acasă (content-model 4, D-11). Tipurile sunt fixe; din panou se pornesc,
 * se opresc, se ordonează și primesc eticheta din meniu. Navigarea se construiește de aici:
 * o secțiune oprită dispare și din meniu.
 *
 * `built`: secțiunile construite până acum în F3. Celelalte apar pe site și în meniu pe măsură
 * ce se construiesc (PLAN F3, pașii 4–9), fără altă schimbare.
 */
export const SECTIONS = [
  { key: 'hero', id: 'acasa', built: true },
  { key: 'stay', id: 'cazare', built: true },
  { key: 'kitchen', id: 'bucataria', built: true },
  { key: 'wines', id: 'vinuri', built: true },
  { key: 'reviews', id: 'recenzii', built: true },
  { key: 'parties', id: 'petreceri', built: true },
  { key: 'privateEvents', id: 'evenimente-private', built: true },
  { key: 'pizza', id: 'cursuri-pizza', built: true },
  { key: 'hotel', id: 'hotel', built: true },
  { key: 'gallery', id: 'galerie', built: true },
  { key: 'contact', id: 'contact', built: true },
] as const

export type SectionKey = (typeof SECTIONS)[number]['key']

type SectionData = {
  enabled?: boolean | null
  placeholder?: boolean | null
  order?: number | null
  menuLabel?: string | null
}

export function section<K extends SectionKey>(home: HomePage | null, key: K) {
  return (home?.[key] ?? null) as (HomePage[K] & SectionData) | null
}

export const isOn = (home: HomePage | null, key: SectionKey) => {
  const s = section(home, key)
  // Implicit pornită (content-model 4): doar o bifă „Pornită” scoasă explicit o ascunde.
  return s ? s.enabled !== false : false
}

/** Secțiunile de afișat, în ordinea din panou (la egalitate, ordinea din content-model). */
export function orderedSections(home: HomePage | null) {
  return SECTIONS.map((s, index) => ({ ...s, index, data: section(home, s.key) }))
    .filter((s) => s.built && isOn(home, s.key))
    .sort(
      (a, b) =>
        (a.data?.order ?? 1000 + a.index) - (b.data?.order ?? 1000 + b.index) || a.index - b.index,
    )
}

/** Numele secțiunilor, pentru panou (meniul de navigare) și ca etichetă de rezervă. */
export const SECTION_LABELS: Record<Exclude<SectionKey, 'hero'>, string> = {
  stay: 'Cazare (bara din hero)',
  kitchen: 'Bucătăria',
  wines: 'Vinuri',
  reviews: 'Recenzii',
  parties: 'Petreceri',
  privateEvents: 'Evenimente private',
  pizza: 'Cursuri de pizza',
  hotel: 'Hotel',
  gallery: 'Galerie',
  contact: 'Contact',
}

/** Paginile proprii care pot sta în meniu, cu adresa și numele lor implicit. */
export const NAV_PAGES = {
  pagePrivateEvents: { href: '/evenimente-private', label: 'Evenimente private' },
  pageParties: { href: '/petreceri', label: 'Petreceri' },
  pagePizza: { href: '/cursuri-pizza-copii', label: 'Cursuri de pizza' },
  pageGallery: { href: '/galerie', label: 'Galerie' },
  pageWines: { href: '/catalog-vinuri', label: 'Lista de vinuri' },
  pageContact: { href: '/contact', label: 'Contact' },
} as const

type NavPage = keyof typeof NAV_PAGES
export type NavTarget = Exclude<SectionKey, 'hero'> | NavPage
export type NavDisplay = 'header' | 'more' | 'hidden'

/** Țintele din „Setări → Meniu de navigare”: secțiunile de pe Acasă, apoi paginile proprii. */
export const NAV_TARGET_OPTIONS: { value: NavTarget; label: string }[] = [
  ...(Object.entries(SECTION_LABELS) as [Exclude<SectionKey, 'hero'>, string][]).map(([value, label]) => ({
    value,
    label: `Acasă · ${label}`,
  })),
  ...(Object.entries(NAV_PAGES) as [NavPage, { label: string }][]).map(([value, p]) => ({
    value,
    label: `Pagina ${p.label}`,
  })),
]

export const NAV_DISPLAY_OPTIONS: { value: NavDisplay; label: string }[] = [
  { value: 'header', label: 'În antet (cât încape)' },
  { value: 'more', label: 'Doar în „Mai mult”' },
  { value: 'hidden', label: 'Ascuns' },
]

/** Un rând din „Setări → Meniu de navigare”. */
export type NavEntry = { target?: string | null; label?: string | null; display?: string | null }

export type NavItem = {
  id: string
  href: string
  label: string
  /** 1: în antet de la 1024 px; 2: în antet de la 1280 px; 3: doar în panoul de navigare. */
  tier: 1 | 2 | 3
}

/**
 * Lățimea disponibilă pentru linkurile din antet, din macheta B (titlurile în majuscule, 13 px,
 * spațiere 0,12 em ≈ 9,6 px pe literă, 24 px între linkuri): stânga logo-ului, minus butonul
 * „Mai mult”. Ce nu încape stă în panoul de navigare. Verificat pe capturi la 1024 și 1440 px.
 */
const CHAR_PX = 9.6
const GAP_PX = 24
const MORE_PX = 120
const BUDGET = { lg: 380, xl: 508 } as const

type Candidate = { id: string; href: string; label: string; moreOnly: boolean }

/** Meniul automat: secțiunile pornite, cu etichetă în meniu, în ordinea de pe Acasă. */
function autoItems(home: HomePage | null): Candidate[] {
  return orderedSections(home)
    .filter((s) => s.key !== 'hero' && s.data?.menuLabel)
    .map((s) => ({ id: s.id, href: `/#${s.id}`, label: s.data?.menuLabel as string, moreOnly: false }))
}

/**
 * Meniul din „Setări → Meniu de navigare” (D-60): ordinea rândurilor, eticheta (gol = cea din
 * Pagina Acasă sau numele paginii), afișarea. O secțiune oprită nu apare, ca să nu ducă nicăieri.
 */
function settingsItems(home: HomePage | null, nav: NavEntry[]): Candidate[] {
  const out: Candidate[] = []
  for (const entry of nav) {
    if (!entry?.target || entry.display === 'hidden') continue
    const moreOnly = entry.display === 'more'
    const custom = entry.label?.trim()
    if (entry.target in NAV_PAGES) {
      const page = NAV_PAGES[entry.target as NavPage]
      out.push({ id: entry.target, href: page.href, label: custom || page.label, moreOnly })
      continue
    }
    const meta = SECTIONS.find((s) => s.key === entry.target)
    if (!meta || meta.key === 'hero' || !meta.built || !isOn(home, meta.key)) continue
    const label = custom || section(home, meta.key)?.menuLabel || SECTION_LABELS[meta.key]
    out.push({ id: meta.id, href: `/#${meta.id}`, label, moreOnly })
  }
  return out
}

export function navItems(home: HomePage | null, nav?: NavEntry[] | null): NavItem[] {
  const all = nav?.length ? settingsItems(home, nav) : autoItems(home)
  // Lățimile se socotesc doar pe cele care pot sta în antet; cele „Doar în «Mai mult»” stau în panou.
  const items = all.filter((i) => !i.moreOnly)

  const width = (label: string) => label.length * CHAR_PX + GAP_PX
  const fits = (budget: number) => {
    const total = items.reduce((sum, i) => sum + width(i.label), 0)
    // Dacă încap toate, nu e nevoie de „Mai mult”.
    const room = total <= budget ? budget : budget - MORE_PX
    let used = 0
    let open = true
    // Doar primele în ordine: după primul care nu încape, restul merg în panou.
    return items.map((i) => {
      used += width(i.label)
      open = open && used <= room
      return open
    })
  }
  const lg = fits(BUDGET.lg)
  const xl = fits(BUDGET.xl)
  const tierOf = new Map<Candidate, NavItem['tier']>()
  items.forEach((i, n) => tierOf.set(i, lg[n] ? 1 : xl[n] ? 2 : 3))
  return all.map((c) => ({ id: c.id, href: c.href, label: c.label, tier: tierOf.get(c) ?? 3 }))
}
