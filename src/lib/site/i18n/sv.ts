import type { Dict } from './ro'

import { svClient } from './sv.client'

/** Swedish plural: 1 vuxen, 2 vuxna. */
const pl = (n: number, one: string, many: string) => (n === 1 ? `1 ${one}` : `${n} ${many}`)

/** Fixed UI strings, Swedish (F4, D-64). Same shape as ro.ts. */
export const sv: Dict = {
  ...svClient,
  /** Ghilimelele citatelor (recenzii), după limbă. */
  /** Titlul întrebărilor despre cazare, sub secțiunea Hotel (G10-1). */
  faqStayTitle: 'Frågor om vistelsen',
  /** Tipurile de vin (filtrele listei de vinuri). */
  wineTypes: { sparkling: 'Mousserande', white: 'Vitt', rose: 'Rosé', red: 'Rött', dessert: 'Dessertvin' } as Record<string, string>,
  quotes: ['”', '”'] as [string, string],
  ogLocale: 'sv_SE',
  languageNames: {
    ro: 'rumänska',
    en: 'engelska',
    it: 'italienska',
    fr: 'franska',
    de: 'tyska',
    zh: 'kinesiska',
    sv: 'svenska',
  },
  translatedFrom: (language: string) => `Automatiskt översatt från ${language}`,
  legalTranslationNote: 'Detta är en automatisk översättning. Den rumänska versionen har företräde.',
  chooseLanguage: 'Välj språk',
  days: {
    mon: 'Måndag',
    tue: 'Tisdag',
    wed: 'Onsdag',
    thu: 'Torsdag',
    fri: 'Fredag',
    sat: 'Lördag',
    sun: 'Söndag',
  },
  sectionLabels: {
    stay: 'Boende',
    kitchen: 'Köket',
    wines: 'Viner',
    reviews: 'Omdömen',
    parties: 'Fester',
    privateEvents: 'Privata evenemang',
    pizza: 'Pizzakurser',
    hotel: 'Hotell',
    gallery: 'Galleri',
    contact: 'Kontakt',
  },
  pageLabels: {
    pagePrivateEvents: 'Privata evenemang',
    pageParties: 'Fester',
    pagePizza: 'Pizzakurser',
    pageGallery: 'Galleri',
    pageWines: 'Vinlista',
    pageContact: 'Kontakt',
  },
  subjects: {
    privateEvent: 'Privat evenemang',
    pizzaCourse: 'Pizzakurs för barn',
    accommodation: 'Boende',
    question: 'Fråga',
    complaint: 'Klagomål',
  },
  formErrors: {
    phone: 'Skriv ett telefonnummer så att vi kan ringa dig.',
    email: 'Skriv din e-postadress, till exempel namn@exempel.se.',
    consent: 'Kryssa i samtycket så att vi kan svara dig.',
    subject: 'Välj vad du skriver till oss om.',
    eventDate: 'Välj datum för evenemanget, från i dag och framåt.',
    guests: 'Skriv hur många gäster det blir.',
    children: 'Skriv hur många barn som kommer till kursen.',
    preferredDate: 'Välj ett datum från i dag och framåt.',
    checkIn: 'Välj ankomstdatum, från i dag och framåt.',
    checkOut: 'Avresan måste vara efter ankomsten.',
    adults: 'Skriv hur många vuxna som kommer (minst en).',
    kids: 'Skriv hur många barn som kommer (0 om inga barn kommer).',
    question: 'Skriv din fråga.',
    visitDate: 'Välj datum för besöket, senast i dag.',
    reason: 'Välj anledning till klagomålet.',
    description: 'Berätta kort vad som hände.',
    tooLong: (max: number) => `Högst ${max} tecken.`,
    unavailable: 'Formuläret är inte tillgängligt just nu.',
    failed: 'Förfrågan kunde inte skickas. Försök igen eller ring oss.',
  },
  summaryGuests: (n: number) => pl(n, 'gäst', 'gäster'),
  summaryChildren: (n: number) => pl(n, 'barn', 'barn'),
  summaryAdults: (adults: number, kids: number) =>
    `${pl(adults, 'vuxen', 'vuxna')}${kids ? `, ${pl(kids, 'barn', 'barn')}` : ''}`,
  notFoundTitle: 'Sidan finns inte',
  notFoundText: 'Adressen finns inte längre eller har skrivits fel.',
  skipToContent: 'Hoppa till innehållet',
  homeLink: (name: string) => `${name}, startsida`,
  openNav: 'Öppna navigeringen',
  closeNav: 'Stäng navigeringen',
  navLabel: 'Huvudnavigering',
  moreNav: 'Mer',
  quickActions: 'Snabbval',
  callForBooking: 'Ring för bokning',
  newTab: '(öppnas i en ny flik)',
  languageLabel: 'Språk',
  languageCurrent: (label: string) => `Språk: ${label}`,
  example: 'Exempel · ska ersättas',
  awardPending: 'nivå och år vid bekräftelse',
  awardPendingLabel: (name: string) =>
    `Plats reserverad för märket ${name}; nivå och år fylls i vid bekräftelse`,
  reservationsPhone: 'Bordsbokning',
  eventsPhone: 'Salar och evenemang',
  pizzaPhone: 'Anmälan till pizzakurs för barn',
  daily: 'Dagligen',
  closed: 'stängt',
  awardsTitle: 'Priser och utmärkelser',
  groupTitle: 'Gruppen',
  contactTitle: 'Kontakt',
  legalTitle: 'Information',
  complaints: 'Klagomål',
  /** F5 (D-79): linkul din footer care redeschide bannerul de cookies. */
  cookieSettings: 'Cookieinställningar',
  socialTitle: 'Följ oss',
  photoCredits: 'Tillfälliga foton',
  bottle: 'per flaska',
  glass: 'per glas',
  currency: 'lei',
  roomsTitle: 'Rummen',
  hotelReviewsTitle: 'Det säger hotellets gäster',
  priceFrom: 'från',
  visitSite: (url: string) => {
    try {
      return `Besök ${new URL(url).hostname.replace(/^www\./, '')}`
    } catch {
      return 'Besök hotellets webbplats'
    }
  },
  legalUpdated: (date: string) => `Uppdaterad ${date}`,
  legalToc: 'Innehåll',
  amenitiesOf: (salon: string) => `Utrustning: ${salon}`,
  homeMeta: (restaurant: string, address: string, hours: string[]) =>
    [`${restaurant}${address ? `, ${address}` : ''}.`, hours.length ? `Öppettider: ${hours.join(', ')}.` : '']
      .filter(Boolean)
      .join(' '),
  legalMeta: (title: string, restaurant: string, sections: string[]) => {
    // After the colon the list is lowercase, only for ordinary words (Personuppgifter → personuppgifter, GDPR stays).
    const lower = (t: string) => (/^\p{Lu}\p{Ll}/u.test(t) ? t[0].toLocaleLowerCase('sv-SE') + t.slice(1) : t)
    const full = `${title} · ${restaurant}${sections.length ? `: ${sections.map(lower).join(', ')}` : ''}.`
    return full.length <= 160 ? full : `${full.slice(0, 157).replace(/[\s,:;·]+\S*$/, '')}…`
  },
  galleryFilter: 'Kategori',
  galleryMeta: (restaurant: string, count: number, categories: string[]) =>
    `Galleri för ${restaurant}: ${pl(count, 'foto', 'foton')}${categories.length ? ` (${categories.join(', ')})` : ''}.`,
  allPhotos: 'Alla',
  enlarge: (label: string) => (label ? `Förstora: ${label}` : 'Förstora fotot'),
  clip: 'Video',
  wineListTitle: 'Vinlista',
  nonVintage: 'NV',
  nonVintageTitle: 'utan årgång (non-vintage)',
  wineFilter: 'Vintyp',
  allWines: 'Alla',
  wineGroups: {
    glass: 'Viner på glas',
    sparkling: 'Mousserande viner',
    white: 'Vita viner',
    rose: 'Roséviner',
    red: 'Röda viner',
    dessert: 'Dessertviner',
  },
  wineLegend: '0,75 l · lei',
  wineLegendGlass: 'glas · lei',
  wineMetaDescription: (restaurant: string, count: string, countries: string[]) =>
    `Vinlista för ${restaurant}: ${count}${countries.length ? ` från ${countries.length > 1 ? `${countries.slice(0, -1).join(', ')} och ${countries[countries.length - 1]}` : countries[0]}` : ''}, med pris per flaska och per glas.`,
  wineDownloadPdf: 'Ladda ner PDF',
  winePageNote:
    'Priserna anges i lei för en flaska på 0,75 l, om inget annat anges. Viner som inte finns i lager visas inte i listan.',
  ratingLabel: (n: number) => `Betyg ${n} av 5`,
  sources: { google: 'Google', tripadvisor: 'TripAdvisor', facebook: 'Facebook', other: '' },
  home: 'Hem',
  eventTypes: { dj: 'DJ', artist: 'Artist', band: 'Band', other: '' },
  guest: 'Gäst',
  bookTable: 'Boka bord',
  seeAllEvents: 'Se alla kvällar och fotoarkivet',
  upcomingTitle: 'Kommande kvällar',
  archiveTitle: 'Tillbakablick',
  archiveIntro: 'Foton från tidigare kvällar.',
  announceOn: 'Vi annonserar den här och på',
  bookForWeekend: 'Boka bord till helgen',
  seeSalons: 'Se salarna',
  seePhotos: 'Se foton av salen',
  upTo: (n: number) => `upp till ${pl(n, 'gäst', 'gäster')}`,
  callManager: 'Ring restaurangchefen',
  faqTitle: 'Vanliga frågor',
  aboutCourse: 'Allt om kursen',
  amenities: 'Utrustning',
  courseDetails: { age: 'Ålder', duration: 'Längd', price: 'Pris', seats: 'Platser' },
  gallery: 'Galleri',
}
