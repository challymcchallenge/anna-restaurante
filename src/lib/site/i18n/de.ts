import type { Dict } from './ro'

import { deClient } from './de.client'

/** German plural: 1 Erwachsener, 2 Erwachsene. */
const pl = (n: number, one: string, many: string) => (n === 1 ? `1 ${one}` : `${n} ${many}`)

/** Fixed UI strings, German (F4, D-64). Same shape as ro.ts. */
export const de: Dict = {
  ...deClient,
  /** Ghilimelele citatelor (recenzii), după limbă. */
  /** Titlul întrebărilor despre cazare, sub secțiunea Hotel (G10-1). */
  faqStayTitle: 'Fragen zu Ihrem Aufenthalt',
  quotes: ['„', '“'] as [string, string],
  ogLocale: 'de_DE',
  languageNames: {
    ro: 'Rumänisch',
    en: 'Englisch',
    it: 'Italienisch',
    fr: 'Französisch',
    de: 'Deutsch',
    zh: 'Chinesisch',
    sv: 'Schwedisch',
  },
  /** Dative after "aus dem": Rumänisch → aus dem Rumänischen. */
  translatedFrom: (language: string) =>
    /sch$/.test(language)
      ? `Automatisch aus dem ${language}en übersetzt`
      : `Automatisch übersetzt (Original: ${language})`,
  legalTranslationNote: 'Dies ist eine automatische Übersetzung. Maßgeblich ist die rumänische Fassung.',
  chooseLanguage: 'Sprache wählen',
  days: {
    mon: 'Montag',
    tue: 'Dienstag',
    wed: 'Mittwoch',
    thu: 'Donnerstag',
    fri: 'Freitag',
    sat: 'Samstag',
    sun: 'Sonntag',
  },
  sectionLabels: {
    stay: 'Übernachtung',
    kitchen: 'Küche',
    wines: 'Weine',
    reviews: 'Bewertungen',
    parties: 'Partys',
    privateEvents: 'Private Feiern',
    pizza: 'Pizzakurse',
    hotel: 'Hotel',
    gallery: 'Galerie',
    contact: 'Kontakt',
  },
  pageLabels: {
    pagePrivateEvents: 'Private Feiern',
    pageParties: 'Partys',
    pagePizza: 'Pizzakurse',
    pageGallery: 'Galerie',
    pageWines: 'Weinkarte',
    pageContact: 'Kontakt',
  },
  subjects: {
    privateEvent: 'Private Feier',
    pizzaCourse: 'Pizzakurs für Kinder',
    accommodation: 'Übernachtung',
    question: 'Frage',
    complaint: 'Beschwerde',
  },
  formErrors: {
    phone: 'Geben Sie eine Telefonnummer an, damit wir Sie anrufen können.',
    email: 'Geben Sie Ihre E-Mail-Adresse an, zum Beispiel name@beispiel.de.',
    consent: 'Bitte bestätigen Sie die Einwilligung, damit wir Ihnen antworten können.',
    subject: 'Wählen Sie, worum es in Ihrer Nachricht geht.',
    eventDate: 'Wählen Sie das Datum der Veranstaltung, ab heute.',
    guests: 'Geben Sie an, wie viele Gäste kommen.',
    children: 'Geben Sie an, wie viele Kinder am Kurs teilnehmen.',
    preferredDate: 'Wählen Sie ein Datum ab heute.',
    checkIn: 'Wählen Sie das Anreisedatum, ab heute.',
    checkOut: 'Die Abreise muss nach der Anreise liegen.',
    adults: 'Geben Sie an, wie viele Erwachsene kommen (mindestens einer).',
    kids: 'Geben Sie an, wie viele Kinder kommen (0, wenn keine Kinder kommen).',
    question: 'Schreiben Sie Ihre Frage.',
    visitDate: 'Wählen Sie das Datum Ihres Besuchs, spätestens heute.',
    reason: 'Wählen Sie den Grund Ihrer Beschwerde.',
    description: 'Beschreiben Sie kurz, was passiert ist.',
    tooLong: (max: number) => `Höchstens ${max} Zeichen.`,
    unavailable: 'Das Formular ist derzeit nicht verfügbar.',
    failed: 'Die Anfrage konnte nicht gesendet werden. Versuchen Sie es erneut oder rufen Sie uns an.',
  },
  summaryGuests: (n: number) => pl(n, 'Gast', 'Gäste'),
  summaryChildren: (n: number) => pl(n, 'Kind', 'Kinder'),
  summaryAdults: (adults: number, kids: number) =>
    `${pl(adults, 'Erwachsener', 'Erwachsene')}${kids ? `, ${pl(kids, 'Kind', 'Kinder')}` : ''}`,
  notFoundTitle: 'Seite nicht gefunden',
  notFoundText: 'Diese Adresse existiert nicht mehr oder wurde falsch eingegeben.',
  skipToContent: 'Zum Inhalt springen',
  homeLink: (name: string) => `${name}, Startseite`,
  openNav: 'Navigation öffnen',
  closeNav: 'Navigation schließen',
  navLabel: 'Hauptnavigation',
  moreNav: 'Mehr',
  quickActions: 'Schnellaktionen',
  call: 'Anrufen',
  callForBooking: 'Zum Reservieren anrufen',
  newTab: '(öffnet in neuem Tab)',
  languageLabel: 'Sprache',
  languageCurrent: (label: string) => `Sprache: ${label}`,
  example: 'Beispiel · wird ersetzt',
  awardPending: 'Stufe und Jahr nach Bestätigung',
  awardPendingLabel: (name: string) =>
    `Platzhalter für das Abzeichen ${name}; Stufe und Jahr werden nach Bestätigung ergänzt`,
  reservationsPhone: 'Tischreservierungen',
  eventsPhone: 'Säle und Veranstaltungen',
  pizzaPhone: 'Anmeldung zum Pizzakurs für Kinder',
  daily: 'Täglich',
  closed: 'geschlossen',
  awardsTitle: 'Preise und Auszeichnungen',
  groupTitle: 'Die Gruppe',
  contactTitle: 'Kontakt',
  legalTitle: 'Informationen',
  complaints: 'Beschwerden',
  socialTitle: 'Folgen Sie uns',
  photoCredits: 'Vorläufige Fotos',
  bottle: 'pro Flasche',
  glass: 'pro Glas',
  currency: 'lei',
  roomsTitle: 'Die Zimmer',
  hotelReviewsTitle: 'Das sagen die Hotelgäste',
  priceFrom: 'ab',
  visitSite: (url: string) => {
    try {
      return `${new URL(url).hostname.replace(/^www\./, '')} besuchen`
    } catch {
      return 'Website des Hotels besuchen'
    }
  },
  legalUpdated: (date: string) => `Aktualisiert am ${date}`,
  legalToc: 'Inhalt',
  amenitiesOf: (salon: string) => `Ausstattung: ${salon}`,
  homeMeta: (restaurant: string, address: string, hours: string[]) =>
    [`${restaurant}${address ? `, ${address}` : ''}.`, hours.length ? `Öffnungszeiten: ${hours.join(', ')}.` : '']
      .filter(Boolean)
      .join(' '),
  legalMeta: (title: string, restaurant: string, sections: string[]) => {
    const full = `${title} · ${restaurant}${sections.length ? `: ${sections.join(', ')}` : ''}.`
    return full.length <= 160 ? full : `${full.slice(0, 157).replace(/[\s,:;·]+\S*$/, '')}…`
  },
  galleryFilter: 'Kategorie',
  galleryMeta: (restaurant: string, count: number, categories: string[]) =>
    `Galerie von ${restaurant}: ${pl(count, 'Foto', 'Fotos')}${categories.length ? ` (${categories.join(', ')})` : ''}.`,
  allPhotos: 'Alle',
  enlarge: (label: string) => (label ? `Vergrößern: ${label}` : 'Foto vergrößern'),
  clip: 'Video',
  wineListTitle: 'Weinkarte',
  nonVintage: 'NV',
  nonVintageTitle: 'ohne Jahrgang (non-vintage)',
  wineFilter: 'Weinart',
  allWines: 'Alle',
  wineGroups: {
    glass: 'Offene Weine',
    sparkling: 'Schaumweine',
    white: 'Weißweine',
    rose: 'Roséweine',
    red: 'Rotweine',
    dessert: 'Dessertweine',
  },
  wineLegend: '0,75 l · lei',
  wineLegendGlass: 'Glas · lei',
  wineMetaDescription: (restaurant: string, count: string, countries: string[]) =>
    `Weinkarte von ${restaurant}: ${count}${countries.length ? ` aus ${countries.length > 1 ? `${countries.slice(0, -1).join(', ')} und ${countries[countries.length - 1]}` : countries[0]}` : ''}, mit Preisen pro Flasche und pro Glas.`,
  winePageNote:
    'Die Preise sind in Lei angegeben und gelten für die 0,75-l-Flasche, sofern nicht anders vermerkt. Weine, die nicht vorrätig sind, erscheinen nicht in der Liste.',
  ratingLabel: (n: number) => `Bewertung: ${n} von 5`,
  sources: { google: 'Google', tripadvisor: 'TripAdvisor', facebook: 'Facebook', other: '' },
  home: 'Startseite',
  eventTypes: { dj: 'DJ', artist: 'Künstler', band: 'Band', other: '' },
  guest: 'Gast',
  bookTable: 'Tisch reservieren',
  seeAllEvents: 'Alle Abende und das Fotoarchiv ansehen',
  upcomingTitle: 'Die nächsten Abende',
  archiveTitle: 'Rückblick',
  archiveIntro: 'Fotos vergangener Abende.',
  announceOn: 'Ankündigungen hier und auf',
  bookForWeekend: 'Tisch fürs Wochenende reservieren',
  seeSalons: 'Säle ansehen',
  seePhotos: 'Fotos des Saals ansehen',
  upTo: (n: number) => `bis zu ${pl(n, 'Gast', 'Gäste')}`,
  callManager: 'Manager anrufen',
  faqTitle: 'Häufige Fragen',
  aboutCourse: 'Alles über den Kurs',
  amenities: 'Ausstattung',
  courseDetails: { age: 'Alter', duration: 'Dauer', price: 'Preis', seats: 'Plätze' },
  gallery: 'Galerie',
}
