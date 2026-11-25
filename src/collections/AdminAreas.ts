import type { Access, CollectionConfig, Field, FieldAccess } from 'payload'

import { normalizeOldPath } from '@/lib/redirect-path'

import { adminAreaAccess, adminOnly, hiddenForEditors, isAdmin } from '../access/roles'
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
      // D-67: orice imagine (logo oficial, fotografie, PNG, JPEG, WebP, AVIF, SVG; HEIC se convertește).
      kinds: ['badge', 'logo', 'photo'],
      format: 'BADGE',
      description: 'Gol până la acordare. Orice imagine: fișierul oficial, un logo sau o fotografie.',
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
    {
      ...text({
        name: 'from',
        label: 'De la',
        required: true,
        nt: true,
        description:
          'Adresa veche, relativă. Exemplu: /valori-nutritionale sau /gallery/locatie (se salvează cu litere mici, fără „/” la final).',
        validate: ((value: unknown) =>
          typeof value === 'string' && /^\/[^\s]*$/.test(value)
            ? true
            : 'Adresa trebuie să înceapă cu „/”, fără spații.') as any,
      }),
      // F5 (G7-2): aceeași formă la salvare și la căutare.
      hooks: {
        beforeValidate: [
          ({ value }: { value?: unknown }) =>
            typeof value === 'string' && value.startsWith('/') ? normalizeOldPath(value) : value,
        ],
      },
    } as Field,
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
 * Subiectele pe care le vede și Editorul (D-37, GATE 1): Social Media Managerul se ocupă de
 * cursurile de pizza pentru copii (înscrieri) și de mesaje (Întrebare). Celelalte (cazare,
 * evenimente private, sesizări) rămân la Administrator și la destinatarii de email.
 */
export const EDITOR_REQUEST_SUBJECTS = ['pizzaCourse', 'question'] as const

const submissionsAccess: Access = ({ req }) => {
  if (!req.user) return false
  if (isAdmin(req.user as { role?: 'administrator' | 'editor' })) return true
  return { subject: { in: [...EDITOR_REQUEST_SUBJECTS] } }
}

/** Datele trimise de vizitator nu se modifică din panou; se schimbă doar „Stare”. */
const submittedData: { update: FieldAccess } = { update: () => false }

/**
 * Cereri primite (content-model 7, ADR-009). Le creează formularele site-ului (F3), nu personalul.
 * Fiecare cerere se salvează întâi aici, apoi pleacă pe email. Ecranul de lucru cu stări vine în R2 (F-52).
 * Administratorul vede toate cererile; Editorul doar cursurile de pizza și întrebările (D-37).
 */
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  labels: { singular: 'Cerere primită', plural: 'Cereri primite' },
  admin: {
    group: 'Cereri',
    useAsTitle: 'name',
    defaultColumns: ['createdAt', 'subject', 'name', 'phone', 'emailSent', 'status'],
    description:
      'Create de formularele site-ului. Fiecare cerere rămâne aici chiar dacă emailul nu a plecat. Din panou se schimbă doar „Stare”.',
  },
  defaultSort: '-createdAt',
  access: {
    read: submissionsAccess,
    // Doar serverul creează cereri (formularele din F3, prin Local API).
    create: () => false,
    update: submissionsAccess,
    delete: adminOnly,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { ...select({ name: 'subject', label: 'Subiect', required: true, options: [...REQUEST_SUBJECTS] }), access: submittedData },
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
        { name: 'name', label: 'Nume', type: 'text', maxLength: 80, access: submittedData },
        { name: 'phone', label: 'Telefon', type: 'text', required: true, maxLength: 30, access: submittedData },
        { name: 'email', label: 'Email', type: 'email', required: true, access: submittedData },
      ],
    },
    { name: 'message', label: 'Mesaj', type: 'textarea', maxLength: 2000, access: submittedData },
    {
      name: 'details',
      label: 'Detalii pe subiect',
      type: 'group',
      access: submittedData,
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
        { name: 'consent', label: 'Acord pentru prelucrarea datelor', type: 'checkbox', required: true, access: submittedData },
        { name: 'consentAt', label: 'Momentul acordului', type: 'date', access: submittedData, admin: { date: { pickerAppearance: 'dayAndTime' } } },
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

