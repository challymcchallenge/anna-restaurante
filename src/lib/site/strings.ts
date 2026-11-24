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
  ratingLabel: (n: number) => `Notă ${n} din 5`,
  sources: { google: 'Google', tripadvisor: 'TripAdvisor', facebook: 'Facebook', other: '' } as Record<
    string,
    string
  >,
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
