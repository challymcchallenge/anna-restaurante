import type { Dict } from './ro'

import { frClient } from './fr.client'

/** French plural: 0 or 1 is singular (1 adulte, 0 enfant), 2 and more plural (2 adultes). */
const pl = (n: number, one: string, many: string) => (n < 2 ? `${n} ${one}` : `${n} ${many}`)

/** Fixed UI strings, French (F4, D-64). Same shape as ro.ts. */
export const fr: Dict = {
  ...frClient,
  /** Ghilimelele citatelor (recenzii), după limbă. */
  quotes: ['«\u00A0', '\u00A0»'] as [string, string],
  ogLocale: 'fr_FR',
  languageNames: {
    ro: 'roumain',
    en: 'anglais',
    it: 'italien',
    fr: 'français',
    de: 'allemand',
    zh: 'chinois',
    sv: 'suédois',
  },
  /** Article before the language: du roumain, de l’anglais. */
  translatedFrom: (language: string) =>
    `Traduit automatiquement ${/^[aeiouyâàéèêëîïôöûüœ]/i.test(language) ? 'de l’' : 'du '}${language}`,
  legalTranslationNote: 'Ceci est une traduction automatique. Seule la version roumaine fait foi.',
  chooseLanguage: 'Choisir la langue',
  days: {
    mon: 'Lundi',
    tue: 'Mardi',
    wed: 'Mercredi',
    thu: 'Jeudi',
    fri: 'Vendredi',
    sat: 'Samedi',
    sun: 'Dimanche',
  },
  sectionLabels: {
    stay: 'Séjour',
    kitchen: 'La cuisine',
    wines: 'Vins',
    reviews: 'Avis',
    parties: 'Soirées',
    privateEvents: 'Événements privés',
    pizza: 'Cours de pizza',
    hotel: 'Hôtel',
    gallery: 'Galerie',
    contact: 'Contact',
  },
  pageLabels: {
    pagePrivateEvents: 'Événements privés',
    pageParties: 'Soirées',
    pagePizza: 'Cours de pizza',
    pageGallery: 'Galerie',
    pageWines: 'Carte des vins',
    pageContact: 'Contact',
  },
  subjects: {
    privateEvent: 'Événement privé',
    pizzaCourse: 'Cours de pizza pour enfants',
    accommodation: 'Hébergement',
    question: 'Question',
    complaint: 'Réclamation',
  },
  formErrors: {
    phone: 'Indiquez un numéro de téléphone pour que nous puissions vous appeler.',
    email: 'Indiquez votre adresse e-mail, par exemple nom@exemple.fr.',
    consent: 'Cochez la case de consentement pour que nous puissions vous répondre.',
    subject: 'Choisissez l’objet de votre message.',
    eventDate: 'Choisissez la date de l’événement, à partir d’aujourd’hui.',
    guests: 'Indiquez le nombre d’invités.',
    children: 'Indiquez combien d’enfants participeront au cours.',
    preferredDate: 'Choisissez une date à partir d’aujourd’hui.',
    checkIn: 'Choisissez la date d’arrivée, à partir d’aujourd’hui.',
    checkOut: 'Le départ doit être postérieur à l’arrivée.',
    adults: 'Indiquez le nombre d’adultes (au moins un).',
    kids: 'Indiquez le nombre d’enfants (0 s’il n’y en a pas).',
    question: 'Écrivez votre question.',
    visitDate: 'Choisissez la date de votre visite, au plus tard aujourd’hui.',
    reason: 'Choisissez le motif de votre réclamation.',
    description: 'Dites-nous brièvement ce qui s’est passé.',
    tooLong: (max: number) => `${max} caractères maximum.`,
    unavailable: 'Le formulaire n’est pas disponible pour le moment.',
    failed: 'La demande n’a pas pu être envoyée. Réessayez ou appelez-nous.',
  },
  summaryGuests: (n: number) => pl(n, 'invité', 'invités'),
  summaryChildren: (n: number) => pl(n, 'enfant', 'enfants'),
  summaryAdults: (adults: number, kids: number) =>
    `${pl(adults, 'adulte', 'adultes')}${kids ? `, ${pl(kids, 'enfant', 'enfants')}` : ''}`,
  notFoundTitle: 'Page introuvable',
  notFoundText: 'Cette adresse n’existe plus ou a été mal saisie.',
  skipToContent: 'Aller au contenu',
  homeLink: (name: string) => `${name}, page d’accueil`,
  openNav: 'Ouvrir la navigation',
  closeNav: 'Fermer la navigation',
  navLabel: 'Navigation principale',
  moreNav: 'Plus',
  quickActions: 'Actions rapides',
  call: 'Appeler',
  callForBooking: 'Appeler pour réserver',
  newTab: '(s’ouvre dans un nouvel onglet)',
  languageLabel: 'Langue',
  languageCurrent: (label: string) => `Langue : ${label}`,
  example: 'Exemple · à remplacer',
  awardPending: 'niveau et année à confirmer',
  awardPendingLabel: (name: string) =>
    `Emplacement réservé au badge ${name} ; le niveau et l’année seront ajoutés après confirmation`,
  reservationsPhone: 'Réservations de tables',
  eventsPhone: 'Salons et événements',
  pizzaPhone: 'Inscriptions au cours de pizza pour enfants',
  daily: 'Tous les jours',
  closed: 'fermé',
  awardsTitle: 'Prix et distinctions',
  groupTitle: 'Le groupe',
  contactTitle: 'Contact',
  legalTitle: 'Informations',
  complaints: 'Réclamations',
  socialTitle: 'Suivez-nous',
  photoCredits: 'Photos provisoires',
  bottle: 'la bouteille',
  glass: 'le verre',
  currency: 'lei',
  roomsTitle: 'Les chambres',
  hotelReviewsTitle: 'Ce que disent les clients de l’hôtel',
  priceFrom: 'à partir de',
  visitSite: (url: string) => {
    try {
      return `Voir ${new URL(url).hostname.replace(/^www\./, '')}`
    } catch {
      return 'Voir le site de l’hôtel'
    }
  },
  legalUpdated: (date: string) => `Mis à jour le ${date}`,
  legalToc: 'Sommaire',
  amenitiesOf: (salon: string) => `Équipements : ${salon}`,
  homeMeta: (restaurant: string, address: string, hours: string[]) =>
    [`${restaurant}${address ? `, ${address}` : ''}.`, hours.length ? `Horaires : ${hours.join(', ')}.` : '']
      .filter(Boolean)
      .join(' '),
  legalMeta: (title: string, restaurant: string, sections: string[]) => {
    // After the colon the list is lowercase, only for ordinary words (Données collectées → données collectées, RGPD stays).
    const lower = (t: string) => (/^\p{Lu}\p{Ll}/u.test(t) ? t[0].toLocaleLowerCase('fr-FR') + t.slice(1) : t)
    const full = `${title} · ${restaurant}${sections.length ? ` : ${sections.map(lower).join(', ')}` : ''}.`
    return full.length <= 160 ? full : `${full.slice(0, 157).replace(/[\s,:;·]+\S*$/, '')}…`
  },
  galleryFilter: 'Catégorie',
  galleryMeta: (restaurant: string, count: number, categories: string[]) =>
    `Galerie de ${restaurant} : ${pl(count, 'photo', 'photos')}${categories.length ? ` (${categories.join(', ')})` : ''}.`,
  allPhotos: 'Toutes',
  enlarge: (label: string) => (label ? `Agrandir : ${label}` : 'Agrandir la photo'),
  clip: 'Vidéo',
  wineListTitle: 'Carte des vins',
  nonVintage: 'NV',
  nonVintageTitle: 'non millésimé',
  wineFilter: 'Type de vin',
  allWines: 'Tous',
  wineGroups: {
    glass: 'Vins au verre',
    sparkling: 'Vins effervescents',
    white: 'Vins blancs',
    rose: 'Vins rosés',
    red: 'Vins rouges',
    dessert: 'Vins de dessert',
  },
  wineLegend: '0,75 l · lei',
  wineLegendGlass: 'verre · lei',
  wineMetaDescription: (restaurant: string, count: string, countries: string[]) =>
    `Carte des vins de ${restaurant} : ${count}${countries.length ? ` (${countries.length > 1 ? `${countries.slice(0, -1).join(', ')} et ${countries[countries.length - 1]}` : countries[0]})` : ''}, avec le prix à la bouteille et au verre.`,
  winePageNote:
    'Les prix sont en lei, pour une bouteille de 0,75 l, sauf indication contraire. Les vins en rupture de stock n’apparaissent pas dans la liste.',
  ratingLabel: (n: number) => `Note : ${n} sur 5`,
  sources: { google: 'Google', tripadvisor: 'TripAdvisor', facebook: 'Facebook', other: '' },
  home: 'Accueil',
  eventTypes: { dj: 'DJ', artist: 'Artiste', band: 'Groupe', other: '' },
  guest: 'Invité',
  bookTable: 'Réserver une table',
  seeAllEvents: 'Voir toutes les soirées et les archives photo',
  upcomingTitle: 'Prochaines soirées',
  archiveTitle: 'Retour en images',
  archiveIntro: 'Photos des soirées passées.',
  announceOn: 'Nous l’annonçons ici et sur',
  bookForWeekend: 'Réserver une table pour le week-end',
  seeSalons: 'Voir les salons',
  seePhotos: 'Voir les photos du salon',
  upTo: (n: number) => `jusqu’à ${pl(n, 'invité', 'invités')}`,
  callManager: 'Appeler le responsable',
  faqTitle: 'Questions fréquentes',
  aboutCourse: 'Tout sur le cours',
  amenities: 'Équipements',
  courseDetails: { age: 'Âge', duration: 'Durée', price: 'Prix', seats: 'Places' },
  gallery: 'Galerie',
}
