/**
 * Textele fixe ale interfeței publice (etichete, stări, explicații pentru cititoarele de ecran).
 * Conținutul restaurantului vine din panou; aici stau doar cuvintele comune tuturor restaurantelor.
 * În F4 (traduceri, D-28) primesc perechile pe limbă; până atunci, doar româna.
 */
export const UI = {
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
  stay: {
    arrive: 'Sosire',
    depart: 'Plecare',
    guests: 'Oaspeți',
    roomsGuests: 'Camere și oaspeți',
    adults: 'Adulți',
    children: 'Copii',
    continue: 'Continuă',
    close: 'Închide',
    departAfterArrive: 'Plecarea trebuie să fie după sosire.',
    mobileNote: 'Cerere de ofertă, confirmată de hotel',
    chooseArrive: 'Alege data sosirii',
    chooseDepart: 'Alege data plecării',
    prevMonth: 'Luna anterioară',
    nextMonth: 'Luna următoare',
    weekdays: ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'],
    weekdaysLong: ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică'],
    room: (n: number) => `Camera ${n}`,
    addRoom: 'Adaugă cameră',
    removeRoom: 'Șterge camera',
    fewer: (what: string) => `Mai puțini: ${what.toLowerCase()}`,
    more: (what: string) => `Mai mulți: ${what.toLowerCase()}`,
    today: 'azi',
  },
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
  /** Contact și sesizări (F3 pasul 9, S-06, S-07) */
  form: {
    subjectLegend: 'Cu ce te putem ajuta?',
    bookTable: 'Rezerv o masă',
    question: 'Am o întrebare',
    eventType: 'Tipul evenimentului',
    eventTypeHint: 'De exemplu: botez, aniversare, cină de firmă',
    eventDate: 'Data dorită',
    guests: 'Număr de invitați',
    salon: 'Salon preferat',
    salonAny: 'Oricare',
    salonFits: (name: string, n: number) => `Potrivit: ${name} (până la ${n} de invitați)`,
    salonTooMany: (n: number) =>
      `Pentru mai mult de ${n} de invitați, saloanele noastre sunt prea mici. Trimite cererea oricum: îți recomandăm o sală potrivită din Grupul ANNA.`,
    children: 'Număr de copii',
    ages: 'Vârstele copiilor',
    agesHint: 'De exemplu: 6 și 9 ani',
    preferredDate: 'Data dorită',
    allergies: 'Dacă există alergii, le discutăm la confirmare, nu aici.',
    checkIn: 'Sosire',
    checkOut: 'Plecare',
    adults: 'Adulți',
    kids: 'Copii',
    roomType: 'Tip de cameră (opțional)',
    roomAny: 'Oricare',
    hotelNote: (hotel: string) => `Cererea merge la ${hotel}. Hotelul confirmă prin telefon sau email.`,
    questionNote: 'Scrie-ne întrebarea mai jos.',
    name: 'Numele tău',
    phone: 'Telefon',
    email: 'Email',
    details: 'Detalii (opțional)',
    detailsHint: 'Meniu pentru copii, tort adus de noi.',
    questionLabel: 'Întrebarea ta',
    consent: 'Sunt de acord cu prelucrarea datelor pentru a primi un răspuns.',
    submit: 'Trimite cererea',
    sending: 'Se trimite…',
    missing: (n: number) =>
      n === 1 ? 'Mai e un câmp de completat. L-am marcat mai jos.' : `Mai sunt ${n} câmpuri de completat. Le-am marcat mai jos.`,
    errorMark: 'Eroare:',
    doneTitle: 'Am primit cererea ta',
    weCall: 'Te sunăm noi.',
    urgent: 'Dacă este urgent:',
    backHome: 'Înapoi la Acasă',
    faster: 'Mai repede prin telefon',
    complaintLink: 'Ai avut o problemă la noi?',
    complaintCta: 'Trimite o sesizare',
    seeMap: 'Vezi pe hartă',
    showMap: 'Arată harta',
    mapTitle: (name: string) => `Harta: ${name}`,
    mapNote: 'Schiță. Harta reală se încarcă de la Google Maps doar când apeși „Arată harta”.',
    mapLoaded: 'Harta: Google Maps.',
    visitDate: 'Data vizitei',
    reason: 'Motivul',
    description: 'Ce s-a întâmplat',
    waiter: 'Ospătarul (opțional)',
    waiterHint: 'Numele de pe bon, dacă îl știi',
    complaintTitle: 'Sesizări',
    complaintIntro:
      'Ne pare rău că ceva nu a fost cum trebuia. Spune-ne ce s-a întâmplat: răspunde managerul restaurantului.',
    complaintSubmit: 'Trimite sesizarea',
    complaintOff: 'Momentan primim sesizările la telefon:',
    noSubjects: 'Momentan primim cererile la telefon.',
  },
  /** Paginile legale (F3 pasul 10) */
  legalUpdated: (date: string) => `Actualizat la ${date}`,
  legalToc: 'Cuprins',
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
  galleryDialog: 'Galerie: fotografia mărită',
  galleryCount: (i: number, n: number) => `${i} din ${n}`,
  close: 'Închide',
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
  wineSearch: 'Caută un vin, un producător sau o regiune',
  wineSearchShort: 'Vin, producător sau regiune',
  wineNoResults: (q: string) => `Niciun vin nu se potrivește cu „${q}”.`,
  wineNoResultsHint: 'Încearcă alt cuvânt sau vezi toate vinurile.',
  wineClear: 'Vezi toate vinurile',
  wineCount: (n: number) => (n === 1 ? '1 vin' : n < 20 ? `${n} vinuri` : `${n} de vinuri`),
  wineMetaDescription: (restaurant: string, count: string, countries: string[]) =>
    `Lista de vinuri ${restaurant}: ${count}${countries.length ? ` din ${countries.length > 1 ? `${countries.slice(0, -1).join(', ')} și ${countries[countries.length - 1]}` : countries[0]}` : ''}, cu prețul la sticlă și la pahar.`,
  winePageNote: 'Prețurile sunt în lei, pentru sticla de 0,75 l, dacă nu e scris altfel. Vinurile care nu sunt în stoc nu apar în listă.',
  ratingLabel: (n: number) => `Notă ${n} din 5`,
  sources: { google: 'Google', tripadvisor: 'TripAdvisor', facebook: 'Facebook', other: '' } as Record<
    string,
    string
  >,
  prev: 'Înapoi',
  next: 'Înainte',
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
  pause: 'Oprește derularea imaginilor',
  play: 'Pornește derularea imaginilor',
} as const

/** Plural românesc: 1 adult, 2 adulți, 20 de adulți. */
export function plural(n: number, one: string, many: string): string {
  if (n === 1) return `1 ${one}`
  const rest = n % 100
  return n >= 20 && (rest === 0 || rest >= 20) ? `${n} de ${many}` : `${n} ${many}`
}

export const DAY_LABELS: Record<string, string> = {
  mon: 'Luni',
  tue: 'Marți',
  wed: 'Miercuri',
  thu: 'Joi',
  fri: 'Vineri',
  sat: 'Sâmbătă',
  sun: 'Duminică',
}
