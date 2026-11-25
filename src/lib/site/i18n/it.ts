import type { Dict } from './ro'

import { itClient } from './it.client'

/** Plurale italiano: 1 adulto, 2 adulti. */
const pl = (n: number, one: string, many: string) => (n === 1 ? `1 ${one}` : `${n} ${many}`)

/** Fixed UI strings, Italian (F4, D-64). Same shape as ro.ts. */
export const it: Dict = {
  ...itClient,
  /** Ghilimelele citatelor (recenzii), după limbă. */
  /** Titlul întrebărilor despre cazare, sub secțiunea Hotel (G10-1). */
  faqStayTitle: 'Domande sul soggiorno',
  /** Tipurile de vin (filtrele listei de vinuri). */
  wineTypes: { sparkling: 'Spumante', white: 'Bianco', rose: 'Rosato', red: 'Rosso', dessert: 'Dessert' } as Record<string, string>,
  quotes: ['«', '»'] as [string, string],
  ogLocale: 'it_IT',
  languageNames: {
    ro: 'rumeno',
    en: 'inglese',
    it: 'italiano',
    fr: 'francese',
    de: 'tedesco',
    zh: 'cinese',
    sv: 'svedese',
  },
  /** Article before the language: dal rumeno, dall’inglese, dallo svedese. */
  translatedFrom: (language: string) => {
    const from = /^[aeiouàèéìòù]/i.test(language) ? 'dall’' : /^(s[^aeiou]|z|gn|ps|x|y)/i.test(language) ? 'dallo ' : 'dal '
    return `Tradotto automaticamente ${from}${language}`
  },
  legalTranslationNote: 'Questa è una traduzione automatica. Fa fede la versione in rumeno.',
  chooseLanguage: 'Scegli la lingua',
  days: {
    mon: 'Lunedì',
    tue: 'Martedì',
    wed: 'Mercoledì',
    thu: 'Giovedì',
    fri: 'Venerdì',
    sat: 'Sabato',
    sun: 'Domenica',
  },
  sectionLabels: {
    stay: 'Soggiorno',
    kitchen: 'La cucina',
    wines: 'Vini',
    reviews: 'Recensioni',
    parties: 'Feste',
    privateEvents: 'Eventi privati',
    pizza: 'Corsi di pizza',
    hotel: 'Hotel',
    gallery: 'Galleria',
    contact: 'Contatti',
  },
  pageLabels: {
    pagePrivateEvents: 'Eventi privati',
    pageParties: 'Feste',
    pagePizza: 'Corsi di pizza',
    pageGallery: 'Galleria',
    pageWines: 'Carta dei vini',
    pageContact: 'Contatti',
  },
  subjects: {
    privateEvent: 'Evento privato',
    pizzaCourse: 'Corso di pizza per bambini',
    accommodation: 'Soggiorno',
    question: 'Domanda',
    complaint: 'Segnalazione',
  },
  formErrors: {
    phone: 'Scrivi un numero di telefono, così possiamo chiamarti.',
    email: 'Scrivi il tuo indirizzo email, per esempio nome@esempio.it.',
    consent: 'Spunta il consenso, così possiamo risponderti.',
    subject: 'Scegli l’argomento del tuo messaggio.',
    eventDate: 'Scegli la data dell’evento, da oggi in poi.',
    guests: 'Scrivi quanti invitati ci saranno.',
    children: 'Scrivi quanti bambini partecipano al corso.',
    preferredDate: 'Scegli una data da oggi in poi.',
    checkIn: 'Scegli la data di arrivo, da oggi in poi.',
    checkOut: 'La partenza deve essere dopo l’arrivo.',
    adults: 'Scrivi quanti adulti vengono (almeno uno).',
    kids: 'Scrivi quanti bambini vengono (0 se non ci sono bambini).',
    question: 'Scrivi la tua domanda.',
    visitDate: 'Scegli la data della visita, al più tardi oggi.',
    reason: 'Scegli il motivo della segnalazione.',
    description: 'Raccontaci in breve cosa è successo.',
    tooLong: (max: number) => `Al massimo ${max} caratteri.`,
    unavailable: 'Il modulo non è disponibile al momento.',
    failed: 'Non è stato possibile inviare la richiesta. Riprova o chiamaci.',
  },
  summaryGuests: (n: number) => pl(n, 'invitato', 'invitati'),
  summaryChildren: (n: number) => pl(n, 'bambino', 'bambini'),
  summaryAdults: (adults: number, kids: number) =>
    `${pl(adults, 'adulto', 'adulti')}${kids ? `, ${pl(kids, 'bambino', 'bambini')}` : ''}`,
  notFoundTitle: 'Pagina non trovata',
  notFoundText: 'L’indirizzo non esiste più o è stato scritto in modo errato.',
  skipToContent: 'Vai al contenuto',
  homeLink: (name: string) => `${name}, pagina iniziale`,
  openNav: 'Apri la navigazione',
  closeNav: 'Chiudi la navigazione',
  navLabel: 'Navigazione principale',
  moreNav: 'Altro',
  quickActions: 'Azioni rapide',
  callForBooking: 'Chiama per prenotare',
  newTab: '(si apre in una nuova scheda)',
  languageLabel: 'Lingua',
  languageCurrent: (label: string) => `Lingua: ${label}`,
  example: 'Esempio · da sostituire',
  awardPending: 'livello e anno alla conferma',
  awardPendingLabel: (name: string) =>
    `Spazio riservato al badge ${name}; livello e anno verranno aggiunti alla conferma`,
  reservationsPhone: 'Prenotazioni tavoli',
  eventsPhone: 'Sale ed eventi',
  pizzaPhone: 'Iscrizioni al corso di pizza per bambini',
  daily: 'Tutti i giorni',
  closed: 'chiuso',
  awardsTitle: 'Premi e riconoscimenti',
  groupTitle: 'Il gruppo',
  contactTitle: 'Contatti',
  legalTitle: 'Informazioni',
  complaints: 'Segnalazioni',
  socialTitle: 'Seguici',
  photoCredits: 'Foto provvisorie',
  bottle: 'alla bottiglia',
  glass: 'al calice',
  currency: 'lei',
  roomsTitle: 'Le camere',
  hotelReviewsTitle: 'Cosa dicono gli ospiti dell’hotel',
  priceFrom: 'da',
  visitSite: (url: string) => {
    try {
      return `Visita ${new URL(url).hostname.replace(/^www\./, '')}`
    } catch {
      return 'Visita il sito dell’hotel'
    }
  },
  legalUpdated: (date: string) => `Aggiornato il ${date}`,
  legalToc: 'Indice',
  amenitiesOf: (salon: string) => `Dotazioni: ${salon}`,
  homeMeta: (restaurant: string, address: string, hours: string[]) =>
    [`${restaurant}${address ? `, ${address}` : ''}.`, hours.length ? `Orari: ${hours.join(', ')}.` : '']
      .filter(Boolean)
      .join(' '),
  legalMeta: (title: string, restaurant: string, sections: string[]) => {
    // After the colon the list is lowercase, only for ordinary words (Cookie tecnici → cookie tecnici, GDPR stays).
    const lower = (t: string) => (/^\p{Lu}\p{Ll}/u.test(t) ? t[0].toLocaleLowerCase('it-IT') + t.slice(1) : t)
    const full = `${title} · ${restaurant}${sections.length ? `: ${sections.map(lower).join(', ')}` : ''}.`
    return full.length <= 160 ? full : `${full.slice(0, 157).replace(/[\s,:;·]+\S*$/, '')}…`
  },
  galleryFilter: 'Categoria',
  galleryMeta: (restaurant: string, count: number, categories: string[]) =>
    `Galleria di ${restaurant}: ${count} foto${categories.length ? ` (${categories.join(', ')})` : ''}.`,
  allPhotos: 'Tutte',
  enlarge: (label: string) => (label ? `Ingrandisci: ${label}` : 'Ingrandisci la foto'),
  clip: 'Video',
  wineListTitle: 'Carta dei vini',
  nonVintage: 'NV',
  nonVintageTitle: 'senza annata (non-vintage)',
  wineFilter: 'Tipo di vino',
  allWines: 'Tutti',
  wineGroups: {
    glass: 'Vini al calice',
    sparkling: 'Vini spumanti',
    white: 'Vini bianchi',
    rose: 'Vini rosati',
    red: 'Vini rossi',
    dessert: 'Vini da dessert',
  },
  wineLegend: '0,75 l · lei',
  wineLegendGlass: 'calice · lei',
  wineMetaDescription: (restaurant: string, count: string, countries: string[]) =>
    `Carta dei vini di ${restaurant}: ${count}${countries.length ? ` (${countries.length > 1 ? `${countries.slice(0, -1).join(', ')} e ${countries[countries.length - 1]}` : countries[0]})` : ''}, con il prezzo alla bottiglia e al calice.`,
  wineDownloadPdf: 'Scarica il PDF',
  winePageNote:
    'I prezzi sono in lei, per la bottiglia da 0,75 l, salvo diversa indicazione. I vini non disponibili non compaiono nella lista.',
  ratingLabel: (n: number) => `Voto ${n} su 5`,
  sources: { google: 'Google', tripadvisor: 'TripAdvisor', facebook: 'Facebook', other: '' },
  home: 'Home',
  eventTypes: { dj: 'DJ', artist: 'Artista', band: 'Band', other: '' },
  guest: 'Ospite',
  bookTable: 'Prenota un tavolo',
  seeAllEvents: 'Vedi tutte le serate e l’archivio fotografico',
  upcomingTitle: 'Le prossime serate',
  archiveTitle: 'Com’è andata',
  archiveIntro: 'Foto delle serate passate.',
  announceOn: 'La annunciamo qui e su',
  bookForWeekend: 'Prenota un tavolo per il weekend',
  seeSalons: 'Vedi le sale',
  seePhotos: 'Vedi le foto della sala',
  upTo: (n: number) => `fino a ${pl(n, 'invitato', 'invitati')}`,
  callManager: 'Chiama il manager',
  faqTitle: 'Domande frequenti',
  aboutCourse: 'Tutto sul corso',
  amenities: 'Dotazioni',
  courseDetails: { age: 'Età', duration: 'Durata', price: 'Prezzo', seats: 'Posti' },
  gallery: 'Galleria',
}
