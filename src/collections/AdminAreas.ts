import type { CollectionConfig } from 'payload'

import { adminAreaAccess, adminOnly, hiddenForEditors } from '../access/roles'
import { contentFlags, media, select, text, url } from '../fields'

/**
 * Premii și distincții (content-model 5.10, D-10, D-20, ADR-012). Doar Administrator.
 * Cât timp nivelul, anul sau logo-ul lipsesc, elementul rămâne „Provizoriu” și pe site apare
 * spațiul rezervat „[Numele premiului] · nivel și an la confirmare”.
 */
export const AWARD_PLACEMENTS = [
  { value: 'hero', label: 'Hero, lângă tagline' },
  { value: 'wines-section', label: 'Antetul secțiunii Vinuri' },
  { value: 'wines-page', label: 'Antetul paginii de vinuri' },
  { value: 'footer', label: 'Footer' },
]

export const Awards: CollectionConfig = {
  slug: 'awards',
  labels: { singular: 'Premiu', plural: 'Premii și distincții' },
  orderable: true,
  admin: {
    group: 'Setări',
    useAsTitle: 'name',
    defaultColumns: ['name', 'level', 'year', 'active', 'placeholder'],
    hidden: hiddenForEditors,
    description: 'Logo-ul oficial se folosește complet, fără recolorare sau decupare (D-10).',
  },
  access: adminAreaAccess(),
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data) return data
        const confirmed = Boolean(data.level && data.year && data.badge)
        if (!confirmed) data.placeholder = true
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        text({ name: 'name', label: 'Numele premiului', max: 60, required: true, nt: true }),
        text({ name: 'organization', label: 'Organizație', max: 40, required: true, nt: true }),
      ],
    },
    {
      type: 'row',
      fields: [
        text({ name: 'level', label: 'Nivel', max: 40, nt: true, description: 'Gol până la acordare.' }),
        { name: 'year', label: 'An', type: 'number', min: 1990, max: 2100, admin: { description: 'Gol până la acordare.' } },
      ],
    },
    media({
      name: 'badge',
      label: 'Logo oficial',
      kinds: ['badge'],
      format: 'BADGE',
      description: 'Gol până la acordare. Se afișează exact cum a fost încărcat.',
    }),
    text({ name: 'line', label: 'Rând de text', max: 90, localized: true, description: 'Lângă insignă, în antetul secțiunii Vinuri.' }),
    url({ name: 'sourceUrl', label: 'Legătură către sursă' }),
    select({
      name: 'placements',
      label: 'Locuri de afișare',
      hasMany: true,
      required: true,
      options: AWARD_PLACEMENTS,
      defaultValue: AWARD_PLACEMENTS.map((p) => p.value),
    }),
    {
      name: 'structuredData',
      label: 'În datele pentru Google',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Are efect doar când nivelul și anul sunt completate.' },
    },
    ...contentFlags(),
  ],
}

/** Redirecționări de pe adresele vechi (content-model R5, ADR-013, D-19). Doar Administrator. */
export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: { singular: 'Redirecționare', plural: 'Redirecționări' },
  admin: {
    group: 'Setări',
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'permanent', 'active'],
    hidden: hiddenForEditors,
  },
  access: adminAreaAccess(),
  fields: [
    text({
      name: 'from',
      label: 'De la',
      required: true,
      nt: true,
      description: 'Adresa veche, relativă. Exemplu: /valori-nutritionale',
      validate: ((value: unknown) =>
        typeof value === 'string' && /^\/[^\s]*$/.test(value)
          ? true
          : 'Adresa trebuie să înceapă cu „/”, fără spații.') as any,
    }),
    text({
      name: 'to',
      label: 'Către',
      required: true,
      description: 'Adresă nouă (relativă, cu „/”) sau externă (https://…).',
      validate: ((value: unknown) =>
        typeof value === 'string' && (/^\/\S*$/.test(value) || /^https?:\/\/\S+$/i.test(value))
          ? true
          : 'Folosește o adresă care începe cu „/” sau cu https://') as any,
    }),
    {
      name: 'permanent',
      label: 'Permanentă (301)',
      type: 'checkbox',
      defaultValue: true,
    },
    { name: 'active', label: 'Activ', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}

export const REQUEST_SUBJECTS = [
  { value: 'privateEvent', label: 'Eveniment privat' },
  { value: 'pizzaCourse', label: 'Curs de pizza pentru copii' },
  { value: 'accommodation', label: 'Cazare' },
  { value: 'question', label: 'Întrebare' },
  { value: 'complaint', label: 'Sesizare' },
] as const

/**
 * Cereri primite (content-model 7, ADR-009). Le creează formularele site-ului (F3), nu personalul.
 * Fiecare cerere se salvează întâi aici, apoi pleacă pe email. Ecranul de lucru cu stări vine în R2 (F-52).
 * [PRESUPUNERE] Doar Administratorul le vede: conțin date personale; destinatarii primesc emailul.
 */
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  labels: { singular: 'Cerere primită', plural: 'Cereri primite' },
  admin: {
    group: 'Cereri',
    useAsTitle: 'name',
    defaultColumns: ['createdAt', 'subject', 'name', 'phone', 'emailSent', 'status'],
    hidden: hiddenForEditors,
    description: 'Create de formularele site-ului. Fiecare cerere rămâne aici chiar dacă emailul nu a plecat.',
  },
  defaultSort: '-createdAt',
  access: {
    read: adminOnly,
    // Doar serverul creează cereri (formularele din F3, prin Local API).
    create: () => false,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      type: 'row',
      fields: [
        select({ name: 'subject', label: 'Subiect', required: true, options: [...REQUEST_SUBJECTS] }),
        select({
          name: 'status',
          label: 'Stare',
          required: true,
          defaultValue: 'new',
          options: [
            { value: 'new', label: 'Nouă' },
            { value: 'in-progress', label: 'În lucru' },
            { value: 'resolved', label: 'Rezolvată' },
          ],
        }),
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Nume', type: 'text', maxLength: 80 },
        { name: 'phone', label: 'Telefon', type: 'text', required: true, maxLength: 30 },
        { name: 'email', label: 'Email', type: 'email', required: true },
      ],
    },
    { name: 'message', label: 'Mesaj', type: 'textarea', maxLength: 2000 },
    {
      name: 'details',
      label: 'Detalii pe subiect',
      type: 'group',
      fields: [
        // Eveniment privat
        { name: 'eventType', label: 'Tip de eveniment', type: 'text', maxLength: 60, admin: { condition: (d) => d?.subject === 'privateEvent' } },
        { name: 'eventDate', label: 'Data evenimentului', type: 'date', admin: { condition: (d) => d?.subject === 'privateEvent' } },
        { name: 'guests', label: 'Număr de invitați', type: 'number', min: 1, admin: { condition: (d) => d?.subject === 'privateEvent' } },
        { name: 'salon', label: 'Salon', type: 'relationship', relationTo: 'salons', admin: { condition: (d) => d?.subject === 'privateEvent' } },
        // Curs de pizza
        { name: 'children', label: 'Număr de copii', type: 'number', min: 1, admin: { condition: (d) => d?.subject === 'pizzaCourse' } },
        { name: 'ages', label: 'Vârste', type: 'text', maxLength: 60, admin: { condition: (d) => d?.subject === 'pizzaCourse' } },
        { name: 'preferredDate', label: 'Data dorită', type: 'date', admin: { condition: (d) => d?.subject === 'pizzaCourse' } },
        // Cazare
        { name: 'checkIn', label: 'Sosire', type: 'date', admin: { condition: (d) => d?.subject === 'accommodation' } },
        { name: 'checkOut', label: 'Plecare', type: 'date', admin: { condition: (d) => d?.subject === 'accommodation' } },
        { name: 'adults', label: 'Adulți', type: 'number', min: 1, admin: { condition: (d) => d?.subject === 'accommodation' } },
        { name: 'kids', label: 'Copii', type: 'number', min: 0, admin: { condition: (d) => d?.subject === 'accommodation' } },
        { name: 'roomType', label: 'Tip de cameră', type: 'relationship', relationTo: 'room-types', admin: { condition: (d) => d?.subject === 'accommodation' } },
        // Sesizare
        { name: 'visitDate', label: 'Data vizitei', type: 'date', admin: { condition: (d) => d?.subject === 'complaint' } },
        { name: 'reason', label: 'Motiv', type: 'relationship', relationTo: 'complaint-reasons', admin: { condition: (d) => d?.subject === 'complaint' } },
        { name: 'waiter', label: 'Ospătar (opțional)', type: 'text', maxLength: 60, admin: { condition: (d) => d?.subject === 'complaint' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'consent', label: 'Acord pentru prelucrarea datelor', type: 'checkbox', required: true },
        { name: 'consentAt', label: 'Momentul acordului', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'emailSent', label: 'Email trimis', type: 'checkbox', defaultValue: false, admin: { readOnly: true } },
        { name: 'emailError', label: 'Eroare la trimitere', type: 'text', admin: { readOnly: true } },
      ],
    },
  ],
}

