/**
 * Textele fixe ale interfeței publice, în română (limba de bază, D-28). Conținutul restaurantului vine
 * din panou; aici stau doar cuvintele comune tuturor restaurantelor. Celelalte limbi (F4, D-64) au
 * aceeași formă: `en.ts`, `it.ts`, `fr.ts`, `de.ts`, `zh.ts`, `sv.ts`.
 *
 * `roClient` = textele folosite de componentele care rulează în browser (formulare, calendar, galerie,
 * căutarea de vinuri). Le ținem separat ca în browser să ajungă doar ele, nu tot dicționarul.
 */

import { plural, roClient, type ClientDict } from './ro.client'

export { plural, roClient }
export type { ClientDict }

export const ro = {
  ...roClient,
  /** Ghilimelele citatelor (recenzii), după limbă. */
  quotes: ['„', '”'] as [string, string],
  /** Open Graph (`og:locale`). */
  ogLocale: 'ro_RO',
  /** Numele limbilor, în limba paginii (mențiunea „tradus din …”). */
  languageNames: {
    ro: 'română',
    en: 'engleză',
    it: 'italiană',
    fr: 'franceză',
    de: 'germană',
    zh: 'chineză',
    sv: 'suedeză',
  } as Record<string, string>,
  /** F4-3 (D-64): sub o recenzie tradusă automat. */
  translatedFrom: (language: string) => `Tradus automat din ${language}`,
  /** F4-4 (D-64): pe paginile legale traduse. Gol în română. */
  legalTranslationNote: '',
  chooseLanguage: 'Alege limba',
  /** Zilele săptămânii în program (Setări → Program). */
  days: {
    mon: 'Luni',
    tue: 'Marți',
    wed: 'Miercuri',
    thu: 'Joi',
    fri: 'Vineri',
    sat: 'Sâmbătă',
    sun: 'Duminică',
  } as Record<string, string>,
  /** Eticheta de rezervă a secțiunilor din meniu, când „Etichetă în meniu” e goală. */
  sectionLabels: {
    stay: 'Cazare',
    kitchen: 'Bucătăria',
    wines: 'Vinuri',
    reviews: 'Recenzii',
    parties: 'Petreceri',
    privateEvents: 'Evenimente private',
    pizza: 'Cursuri de pizza',
    hotel: 'Hotel',
    gallery: 'Galerie',
    contact: 'Contact',
  } as Record<string, string>,
  /** Numele implicit al paginilor proprii din meniu. */
  pageLabels: {
    pagePrivateEvents: 'Evenimente private',
    pageParties: 'Petreceri',
    pagePizza: 'Cursuri de pizza',
    pageGallery: 'Galerie',
    pageWines: 'Lista de vinuri',
    pageContact: 'Contact',
  } as Record<string, string>,
  /** Subiectele formularului de contact (aceleași chei ca în Setări → Cereri și emailuri). */
  subjects: {
    privateEvent: 'Eveniment privat',
    pizzaCourse: 'Curs de pizza pentru copii',
    accommodation: 'Cazare',
    question: 'Întrebare',
    complaint: 'Sesizare',
  } as Record<string, string>,
  /** Mesajele de lângă câmpuri, după trimiterea formularului (validarea e pe server). */
  formErrors: {
    phone: 'Scrie un număr de telefon, ca să te putem suna.',
    email: 'Scrie adresa de email, de exemplu nume@exemplu.ro.',
    consent: 'Bifează acordul, ca să-ți putem răspunde.',
    subject: 'Alege despre ce ne scrii.',
    eventDate: 'Alege data evenimentului, de azi încolo.',
    guests: 'Scrie câți invitați vor fi.',
    children: 'Scrie câți copii vin la curs.',
    preferredDate: 'Alege o dată de azi încolo.',
    checkIn: 'Alege data sosirii, de azi încolo.',
    checkOut: 'Plecarea trebuie să fie după sosire.',
    adults: 'Scrie câți adulți vin (cel puțin unul).',
    kids: 'Scrie câți copii vin (0 dacă nu vin copii).',
    question: 'Scrie întrebarea ta.',
    visitDate: 'Alege data vizitei, cel târziu azi.',
    reason: 'Alege motivul sesizării.',
    description: 'Spune-ne pe scurt ce s-a întâmplat.',
    tooLong: (max: number) => `Cel mult ${max} de caractere.`,
    unavailable: 'Formularul nu e disponibil acum.',
    failed: 'Cererea nu s-a putut trimite. Încearcă din nou sau sună-ne.',
  },
  /** Rezumatul din confirmarea cererii. */
  summaryGuests: (n: number) => plural(n, 'invitat', 'invitați'),
  summaryChildren: (n: number) => plural(n, 'copil', 'copii'),
  summaryAdults: (adults: number, kids: number) =>
    `${plural(adults, 'adult', 'adulți')}${kids ? `, ${plural(kids, 'copil', 'copii')}` : ''}`,
  notFoundTitle: 'Pagina nu există',
  notFoundText: 'Adresa nu mai există sau a fost scrisă greșit.',
  skipToContent: 'Sari la conținut',
  homeLink: (name: string) => `${name}, pagina de start`,
  openNav: 'Deschide navigarea',
  closeNav: 'Închide navigarea',
  navLabel: 'Navigare principală',
  moreNav: 'Mai mult',
  quickActions: 'Acțiuni rapide',
  call: 'Sună',
  callForBooking: 'Sună pentru rezervare',
  newTab: '(se deschide în filă nouă)',
  languageLabel: 'Limba',
  languageCurrent: (label: string) => `Limba: ${label}`,
  example: 'Exemplu · de înlocuit',
  awardPending: 'nivel și an la confirmare',
  awardPendingLabel: (name: string) =>
    `Spațiu rezervat pentru insigna ${name}; nivelul și anul se completează la confirmare`,
  reservationsPhone: 'Rezervări mese',
  eventsPhone: 'Saloane și evenimente',
  pizzaPhone: 'Înscrieri curs pizza copii',
  daily: 'Zilnic',
  closed: 'închis',
  awardsTitle: 'Premii și distincții',
  groupTitle: 'Grupul',
  contactTitle: 'Contact',
  legalTitle: 'Informații',
  complaints: 'Sesizări',
  socialTitle: 'Urmărește-ne',
  photoCredits: 'Fotografii provizorii',
  bottle: 'sticla',
  glass: 'paharul',
  currency: 'lei',
  /** Cazare · Hotel ANNA (F3 pasul 7) */
  roomsTitle: 'Camerele',
  hotelReviewsTitle: 'Ce spun oaspeții hotelului',
  priceFrom: 'de la',
  visitSite: (url: string) => {
    try {
      return `Vezi ${new URL(url).hostname.replace(/^www\./, '')}`
    } catch {
      return 'Vezi site-ul hotelului'
    }
  },
  /** Paginile legale (F3 pasul 10) */
  legalUpdated: (date: string) => `Actualizat la ${date}`,
  legalToc: 'Cuprins',
  amenitiesOf: (salon: string) => `Dotări: ${salon}`,
  /** Descrierea paginii legale pentru motoarele de căutare: titlul, restaurantul și secțiunile, cel mult 160 de caractere. */
  /** Descrierea Acasă când subtitlul din hero e gol (F3 pasul 12): numele, adresa și programul din Setări. */
  homeMeta: (restaurant: string, address: string, hours: string[]) =>
    [`${restaurant}${address ? `, ${address}` : ''}.`, hours.length ? `Program: ${hours.join(', ')}.` : ''].filter(Boolean).join(' '),
  legalMeta: (title: string, restaurant: string, sections: string[]) => {
    // Doar prima literă devine mică, și doar la un cuvânt obișnuit („Hotel ANNA” → „hotel ANNA”, „ANPC” rămâne).
    const lower = (t: string) => (/^\p{Lu}\p{Ll}/u.test(t) ? t[0].toLocaleLowerCase('ro-RO') + t.slice(1) : t)
    const full = `${title} · ${restaurant}${sections.length ? `: ${sections.map(lower).join(', ')}` : ''}.`
    return full.length <= 160 ? full : `${full.slice(0, 157).replace(/[\s,:;·]+\S*$/, '')}…`
  },
  /** Galeria (F3 pasul 8) */
  galleryFilter: 'Categoria',
  galleryMeta: (restaurant: string, count: number, categories: string[]) =>
    `Galeria ${restaurant}: ${count === 1 ? '1 fotografie' : count < 20 ? `${count} fotografii` : `${count} de fotografii`}${categories.length ? ` (${categories.join(', ')})` : ''}.`,
  allPhotos: 'Toate',
  enlarge: (label: string) => (label ? `Mărește: ${label}` : 'Mărește fotografia'),
  clip: 'Clip',
  /** Lista de vinuri (D-46) */
  wineListTitle: 'Lista de vinuri',
  nonVintage: 'NV',
  nonVintageTitle: 'fără an (non-vintage)',
  wineFilter: 'Tipul de vin',
  allWines: 'Toate',
  wineGroups: {
    glass: 'Vinuri la pahar',
    sparkling: 'Vinuri spumante',
    white: 'Vinuri albe',
    rose: 'Vinuri rosé',
    red: 'Vinuri roșii',
    dessert: 'Vinuri de desert',
  } as Record<string, string>,
  wineLegend: '0,75 l · lei',
  wineLegendGlass: 'pahar · lei',
  wineMetaDescription: (restaurant: string, count: string, countries: string[]) =>
    `Lista de vinuri ${restaurant}: ${count}${countries.length ? ` din ${countries.length > 1 ? `${countries.slice(0, -1).join(', ')} și ${countries[countries.length - 1]}` : countries[0]}` : ''}, cu prețul la sticlă și la pahar.`,
  winePageNote: 'Prețurile sunt în lei, pentru sticla de 0,75 l, dacă nu e scris altfel. Vinurile care nu sunt în stoc nu apar în listă.',
  ratingLabel: (n: number) => `Notă ${n} din 5`,
  sources: { google: 'Google', tripadvisor: 'TripAdvisor', facebook: 'Facebook', other: '' } as Record<
    string,
    string
  >,
  home: 'Acasă',
  eventTypes: { dj: 'DJ', artist: 'Artist', band: 'Formație', other: '' } as Record<string, string>,
  guest: 'Invitat',
  bookTable: 'Rezervă masă',
  seeAllEvents: 'Vezi toate serile și arhiva foto',
  upcomingTitle: 'Următoarele seri',
  archiveTitle: 'Cum a fost',
  archiveIntro: 'Fotografii din serile trecute.',
  announceOn: 'O anunțăm aici și pe',
  bookForWeekend: 'Rezervă o masă pentru weekend',
  seeSalons: 'Vezi saloanele',
  seePhotos: 'Vezi fotografiile salonului',
  upTo: (n: number) => `până la ${plural(n, 'invitat', 'invitați')}`,
  callManager: 'Sună managerul',
  faqTitle: 'Întrebări frecvente',
  aboutCourse: 'Totul despre curs',
  amenities: 'Dotări',
  courseDetails: { age: 'Vârstă', duration: 'Durată', price: 'Preț', seats: 'Locuri' } as Record<string, string>,
  gallery: 'Galerie',
}

/** Forma comună a dicționarelor; celelalte limbi o respectă exact. */
export type Dict = typeof ro
