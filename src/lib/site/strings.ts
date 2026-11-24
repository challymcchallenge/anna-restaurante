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
    adults: 'Adulți',
    children: 'Copii',
    continue: 'Continuă',
    close: 'Închide',
    departAfterArrive: 'Plecarea trebuie să fie după sosire.',
    mobileNote: 'Cerere de ofertă, confirmată de hotel',
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

export const DAY_LABELS: Record<string, string> = {
  mon: 'Luni',
  tue: 'Marți',
  wed: 'Miercuri',
  thu: 'Joi',
  fri: 'Vineri',
  sat: 'Sâmbătă',
  sun: 'Duminică',
}
