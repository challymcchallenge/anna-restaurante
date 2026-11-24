import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'

import { contentAccess } from '../access/roles'
import { contentFlags, media, select, text, textarea } from '../fields'

/** Vinuri (content-model 5.2, ADR-011, D-14). Câmpurile sunt propunerea DESI (Q-35), de confirmat cu lista reală. */
export const WINE_TYPES = [
  { value: 'sparkling', label: 'Spumant' },
  { value: 'white', label: 'Alb' },
  { value: 'rose', label: 'Rosé' },
  { value: 'red', label: 'Roșu' },
  { value: 'dessert', label: 'Desert' },
]

const MAX_FEATURED = 10

export const Wines: CollectionConfig = {
  slug: 'wines',
  labels: { singular: 'Vin', plural: 'Vinuri' },
  orderable: true,
  admin: {
    group: 'Conținut',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'priceBottle', 'featured', 'available', 'placeholder'],
    description: 'Catalogul de la /catalog-vinuri. Cele bifate „Recomandat” apar în sliderul de pe Acasă (cel mult 10).',
  },
  access: contentAccess,
  hooks: {
    beforeValidate: [
      // Cel mult 10 vinuri recomandate pe restaurant.
      async ({ data, originalDoc, req }) => {
        if (!data?.featured) return data
        const tenant = data.tenant ?? originalDoc?.tenant
        const tenantId = typeof tenant === 'object' ? tenant?.id : tenant
        const { totalDocs } = await req.payload.count({
          collection: 'wines',
          req,
          overrideAccess: true,
          where: {
            and: [
              { featured: { equals: true } },
              ...(tenantId ? [{ tenant: { equals: tenantId } }] : []),
              ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
            ],
          },
        })
        if (totalDocs >= MAX_FEATURED) {
          throw new ValidationError({
            errors: [
              {
                path: 'featured',
                message: `Sunt deja ${MAX_FEATURED} vinuri recomandate. Debifează unul înainte.`,
              },
            ],
          })
        }
        return data
      },
    ],
  },
  fields: [
    text({ name: 'name', label: 'Nume', max: 60, required: true, nt: true }),
    {
      type: 'row',
      fields: [
        text({ name: 'producer', label: 'Producător', max: 50, nt: true }),
        select({ name: 'type', label: 'Tip', required: true, options: WINE_TYPES }),
      ],
    },
    {
      type: 'row',
      fields: [
        text({ name: 'country', label: 'Țară', max: 30, localized: true }),
        text({ name: 'region', label: 'Regiune sau denumire de origine', max: 50, nt: true }),
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'vintage',
          label: 'An',
          type: 'number',
          min: 1900,
          max: 2100,
          admin: { description: 'Patru cifre; gol = fără an.', step: 1 },
        },
        text({ name: 'grapes', label: 'Soiuri', max: 60, nt: true }),
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'priceBottle',
          label: 'Preț la sticlă (RON)',
          type: 'number',
          required: true,
          min: 0,
        },
        select({
          name: 'volume',
          label: 'Volum',
          required: true,
          defaultValue: '0.75',
          options: [
            { value: '0.375', label: '0,375 l' },
            { value: '0.75', label: '0,75 l' },
            { value: '1.5', label: '1,5 l' },
          ],
        }),
        {
          name: 'priceGlass',
          label: 'Preț la pahar (RON)',
          type: 'number',
          min: 0,
          admin: { description: 'Gol = nu se servește la pahar.' },
        },
      ],
    },
    textarea({ name: 'description', label: 'Descriere scurtă', max: 160, localized: true }),
    media({ name: 'photo', label: 'Fotografie', format: 'CARD-P' }),
    {
      type: 'row',
      fields: [
        {
          name: 'featured',
          label: 'Recomandat',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Apare în sliderul de pe Acasă; cel mult 10.' },
        },
        {
          name: 'available',
          label: 'Disponibil',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Oprit = rămâne în panou, dispare din listă.' },
        },
      ],
    },
    text({
      name: 'externalCode',
      label: 'Cod extern',
      max: 40,
      nt: true,
      description: 'Pentru legarea ulterioară cu portalul de vinuri (D-14).',
    }),
    ...contentFlags(),
  ],
}
