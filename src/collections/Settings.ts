import type { CollectionConfig, Field } from 'payload'

import { adminAreaAccess, hiddenForEditors } from '../access/roles'
import { emailList, media, select, text, url, validateHexColor, validatePhone } from '../fields'
import { LOCALES } from '../lib/locales'
import { fontOptions } from '../theme/fonts'
import { validateColorField } from '../theme/theme'
import { REQUEST_SUBJECTS } from './AdminAreas'

/**
 * Setări per restaurant (content-model R1–R4). Doar Administrator.
 * Un singur document pe restaurant (pluginul multi-tenant, `isGlobal`).
 * Culorile și fonturile alcătuiesc tema restaurantului (src/theme, docs/design-system.md, D-41, D-42).
 */

const DAYS = [
  { value: 'mon', label: 'Luni' },
  { value: 'tue', label: 'Marți' },
  { value: 'wed', label: 'Miercuri' },
  { value: 'thu', label: 'Joi' },
  { value: 'fri', label: 'Vineri' },
  { value: 'sat', label: 'Sâmbătă' },
  { value: 'sun', label: 'Duminică' },
]

const validateTime = (value: unknown): true | string =>
  !value || (typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$|^24:00$/.test(value))
    ? true
    : 'Format: HH:MM, de exemplu 08:00 sau 24:00.'

const color = (
  name: string,
  label: string,
  extra?: (value: unknown, args: any) => true | string,
): Field => ({
  name,
  label,
  type: 'text',
  admin: { description: 'Format #RRGGBB.', width: '25%' },
  validate: ((value: unknown, args: any) => {
    const basic = validateHexColor(value)
    if (basic !== true) return basic
    return extra ? (extra as any)(value, args) : true
  }) as any,
})

const requestSubject = (value: string, label: string): Field => ({
  name: value,
  label,
  type: 'group',
  fields: [
    {
      name: 'active',
      label: 'Subiect activ',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Oprit = butonul dispare din formular.' },
    },
    emailList({
      name: 'recipients',
      label: 'Destinatari',
      max: 5,
      description: 'Cel mult 5. Obligatoriu când subiectul e activ.',
      validate: ((value: unknown, args: any) =>
        args?.siblingData?.active && (!Array.isArray(value) || value.length === 0)
          ? 'Adaugă cel puțin un destinatar sau oprește subiectul.'
          : true) as any,
    }),
    emailList({
      name: 'cc',
      label: 'Copie',
      max: 5,
      description:
        'Configurată de Administrator; nu apare nicăieri pe site și nu se scrie în cod (D-15).',
    }),
    text({
      name: 'responseTime',
      label: 'Termen de răspuns afișat',
      max: 60,
      localized: true,
      description: 'Apare în confirmare. Gol până la Q-34.',
    }),
  ],
})

export const Settings: CollectionConfig = {
  slug: 'settings',
  labels: { singular: 'Setări restaurant', plural: 'Setări restaurant' },
  admin: {
    group: 'Setări',
    useAsTitle: 'tagline',
    hidden: hiddenForEditors,
    description:
      'Identitate, contact, program, integrări și destinatarii emailurilor. Un document pe restaurant.',
  },
  access: adminAreaAccess(),
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identitate',
          fields: [
            text({
              name: 'tagline',
              label: 'Tagline',
              max: 40,
              required: true,
              nt: true,
            }),
            {
              type: 'row',
              fields: [
                media({
                  name: 'logo',
                  label: 'Logo principal',
                  kinds: ['logo'],
                  format: 'LOGO',
                  description: 'Obligatoriu înainte de lansare.',
                }),
                media({
                  name: 'logoDark',
                  label: 'Logo pe fundal închis',
                  kinds: ['logo'],
                  format: 'LOGO',
                  description: 'Dacă lipsește, se folosește cel principal.',
                }),
              ],
            },
            {
              type: 'row',
              fields: [
                media({
                  name: 'logoGroup',
                  label: 'Logo grup',
                  kinds: ['logo'],
                  format: 'LOGO',
                  description: 'În footer.',
                }),
                media({
                  name: 'favicon',
                  label: 'Pictogramă de filă',
                  kinds: ['logo'],
                  description:
                    'SVG sau PNG pătrat, minimum 512 px. Obligatoriu înainte de lansare.',
                }),
              ],
            },
            {
              name: 'colors',
              label: 'Culori',
              type: 'group',
              admin: {
                description:
                  'Tema site-ului (docs/design-system.md). Panoul verifică 5 perechi la minimum 4,5:1 (text/fundal, text/fundal închis, accent/fundal închis, cele două butoane); sub prag nu se poate salva. Gol = valorile direcției B · Carta.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    color('background', 'Fundal (pagini)', (v, { siblingData }) =>
                      validateColorField('background', v, siblingData),
                    ),
                    color('text', 'Text', (v, { siblingData }) =>
                      validateColorField('text', v, siblingData),
                    ),
                    color('surfaceDark', 'Fundal închis (hero, footer)', (v, { siblingData }) =>
                      validateColorField('surfaceDark', v, siblingData),
                    ),
                    color('textOnDark', 'Text pe fundal închis', (v, { siblingData }) =>
                      validateColorField('textOnDark', v, siblingData),
                    ),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    color('accent', 'Accent (butonul principal)', (v, { siblingData }) =>
                      validateColorField('accent', v, siblingData),
                    ),
                    color('accent2', 'Accent secundar (butonul secundar)', (v, { siblingData }) =>
                      validateColorField('accent2', v, siblingData),
                    ),
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                select({
                  name: 'fontHeading',
                  label: 'Font titluri',
                  options: fontOptions('heading'),
                  width: '50%',
                  description: 'Din setul aprobat (G3, D-42). Gol = Belleza.',
                }),
                select({
                  name: 'fontText',
                  label: 'Font text',
                  options: fontOptions('text'),
                  width: '50%',
                  description: 'Din setul aprobat (G3, D-42). Gol = Hanken Grotesk.',
                }),
              ],
            },
            select({
              name: 'defaultTheme',
              label: 'Temă implicită',
              options: [
                { value: 'dark', label: 'Închisă' },
                { value: 'light', label: 'Deschisă' },
              ],
              description:
                'O singură temă la lansare; comutatorul pentru vizitatori vine în R2 (D-33). Alegerea: Q-17.',
            }),
            media({
              name: 'shareImage',
              label: 'Imagine de distribuire implicită',
              format: 'SHARE',
            }),
          ],
        },
        {
          label: 'Contact și program',
          fields: [
            {
              name: 'address',
              label: 'Adresă',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    text({
                      name: 'street',
                      label: 'Stradă și număr',
                      max: 60,
                      required: true,
                      nt: true,
                    }),
                    text({ name: 'city', label: 'Oraș', max: 60, required: true, nt: true }),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    text({ name: 'county', label: 'Județ', max: 60, nt: true }),
                    text({ name: 'country', label: 'Țară', max: 60, required: true, nt: true }),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'lat',
                      label: 'Latitudine',
                      type: 'number',
                      min: -90,
                      max: 90,
                      admin: {
                        step: 0.000001,
                        description: 'Pentru hartă. Obligatoriu înainte de F3.',
                      },
                    },
                    {
                      name: 'lng',
                      label: 'Longitudine',
                      type: 'number',
                      min: -180,
                      max: 180,
                      admin: { step: 0.000001 },
                    },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                text({
                  name: 'phoneReservations',
                  label: 'Telefon rezervări mese',
                  required: true,
                  description: 'În antet, în Contact și ca rezervă a ferestrei ialoc (D-17).',
                  validate: validatePhone as any,
                }),
                text({
                  name: 'phoneEvents',
                  label: 'Telefon evenimente',
                  description: 'În Evenimente private și la „Rezervă salonul” (D-17).',
                  validate: validatePhone as any,
                }),
              ],
            },
            {
              name: 'hours',
              label: 'Program',
              type: 'array',
              maxRows: 7,
              labels: { singular: 'Zi', plural: 'Zile' },
              admin: { description: 'Câte un rând pe zi.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    select({ name: 'day', label: 'Zi', required: true, options: DAYS }),
                    text({ name: 'opens', label: 'Deschis de la', validate: validateTime as any }),
                    text({ name: 'closes', label: 'Până la', validate: validateTime as any }),
                    { name: 'closed', label: 'Închis', type: 'checkbox', defaultValue: false },
                  ],
                },
              ],
            },
            text({ name: 'hoursNote', label: 'Notă la program', max: 120, localized: true }),
            {
              name: 'social',
              label: 'Rețele sociale',
              type: 'group',
              admin: {
                description:
                  'Apar în footer și în Contact, doar dacă sunt completate (D-18, D-30).',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    url({ name: 'facebook', label: 'Facebook' }),
                    url({ name: 'instagram', label: 'Instagram' }),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    url({ name: 'youtube', label: 'YouTube' }),
                    url({ name: 'tiktok', label: 'TikTok' }),
                  ],
                },
                url({ name: 'tripadvisor', label: 'TripAdvisor' }),
              ],
            },
            url({
              name: 'googleReviewUrl',
              label: 'Legătură recenzie Google',
              description: 'Folosită de butonul „Lasă o recenzie”.',
            }),
            {
              name: 'otherNetworks',
              label: 'Alte rețele',
              type: 'array',
              maxRows: 5,
              labels: { singular: 'Rețea', plural: 'Rețele' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    text({ name: 'name', label: 'Nume', max: 30, required: true, nt: true }),
                    url({ name: 'url', label: 'Adresă', required: true }),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Integrări',
          fields: [
            {
              type: 'row',
              fields: [
                text({
                  name: 'ialocId',
                  label: 'ID ialoc',
                  required: true,
                  nt: true,
                  description: 'ID-ul localului în ialoc.ro (D-03).',
                }),
                text({
                  name: 'analyticsId',
                  label: 'ID statistici',
                  nt: true,
                  description: 'Se păstrează contul existent (D-32).',
                }),
              ],
            },
            url({ name: 'digitalMenuUrl', label: 'Adresa meniului digital', required: true }),
            select({
              name: 'activeLocales',
              label: 'Limbi active',
              hasMany: true,
              required: true,
              defaultValue: ['ro'],
              options: LOCALES.map((l) => ({ value: l.code, label: `${l.label} (${l.code})` })),
              description:
                'Româna este implicită. Celelalte limbi se pornesc după traduceri (F4, D-28). Fereastra ialoc are doar ro și en.',
            }),
          ],
        },
        {
          label: 'Cereri și emailuri',
          description:
            'Un rând pe subiect. Subiectul emailului se generează singur: „[Subiect] de pe site-ul [Nume restaurant]” (D-15).',
          fields: [
            {
              name: 'requests',
              type: 'group',
              label: false,
              fields: REQUEST_SUBJECTS.map((s) => requestSubject(s.value, s.label)),
            },
          ],
        },
      ],
    },
  ],
}
