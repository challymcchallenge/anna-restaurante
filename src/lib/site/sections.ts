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
  { key: 'gallery', id: 'galerie', built: false },
  { key: 'contact', id: 'contact', built: false },
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

export function navItems(home: HomePage | null): NavItem[] {
  const items = orderedSections(home)
    .filter((s) => s.key !== 'hero' && s.data?.menuLabel)
    .map((s) => ({ id: s.id, href: `/#${s.id}`, label: s.data?.menuLabel as string }))

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
  return items.map((i, n) => ({ ...i, tier: lg[n] ? 1 : xl[n] ? 2 : 3 }))
}
