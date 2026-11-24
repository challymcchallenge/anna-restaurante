import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'

import { contentAccess } from '../access/roles'
import { contentFlags, media, select, text, textarea } from '../fields'

/**
 * Vinuri (content-model 5.2, ADR-011, D-14). Câmpurile urmează lista reală a restaurantului
 * (D-46): producător, vin, denumire de origine, an (gol = NV), volum, preț.
 */
export const WINE_TYPES = [
  { value: 'sparkling', label: 'Spumant' },
  { value: 'white', label: 'Alb' },
  { value: 'rose', label: 'Rosé' },
  { value: 'red', label: 'Roșu' },
  { value: 'dessert', label: 'Desert' },
]

/** Recomandate pe Acasă: cel mult 5 din fiecare tip (D-46). */
export const MAX_FEATURED_PER_TYPE = 5

export const Wines: CollectionConfig = {
  slug: 'wines',
  labels: { singular: 'Vin', plural: 'Vinuri' },
  orderable: true,
  admin: {
    group: 'Conținut',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'priceBottle', 'featured', 'available', 'placeholder'],
    description:
      'Lista de la /catalog-vinuri, grupată pe tip, apoi pe țară și regiune, în ordinea de aici. Cele bifate „Recomandat” apar pe Acasă (cel mult 5 din fiecare tip).',
  },
  access: contentAccess,
  hooks: {
    beforeValidate: [
      // Cel mult 5 vinuri recomandate din fiecare tip, pe restaurant.
      async ({ data, originalDoc, req }) => {
        if (!data?.featured) return data
        const tenant = data.tenant ?? originalDoc?.tenant
        const tenantId = typeof tenant === 'object' ? tenant?.id : tenant
        const type = data.type ?? originalDoc?.type
        const { totalDocs } = await req.payload.count({
          collection: 'wines',
          req,
          overrideAccess: true,
          where: {
            and: [
              { featured: { equals: true } },
              ...(type ? [{ type: { equals: type } }] : []),
              ...(tenantId ? [{ tenant: { equals: tenantId } }] : []),
              ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
            ],
          },
        })
        if (totalDocs >= MAX_FEATURED_PER_TYPE) {
          const label = WINE_TYPES.find((t) => t.value === type)?.label ?? ''
          throw new ValidationError({
            errors: [
              {
                path: 'featured',
                message: `Sunt deja ${MAX_FEATURED_PER_TYPE} vinuri recomandate de tipul ${label}. Debifează unul înainte.`,
              },
            ],
          })
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        text({
          name: 'producer',
          label: 'Producător',
          max: 50,
          nt: true,
          description: 'Apare îngroșat, înaintea numelui: „Dom Pérignon” Vintage Brut.',
        }),
        text({ name: 'name', label: 'Vin', max: 60, required: true, nt: true }),
      ],
    },
    {
      type: 'row',
      fields: [
        select({ name: 'type', label: 'Tip', required: true, options: WINE_TYPES }),
        text({
          name: 'appellation',
          label: 'Denumire de origine',
          max: 60,
          nt: true,
          description: 'Ca pe etichetă: A.O.C. Champagne, D.O.C.G. Barolo, D.O.C. – C.M.D. Recaș.',
        }),
      ],
    },
    {
      type: 'row',
      fields: [
        text({ name: 'country', label: 'Țară', max: 30, localized: true }),
        text({
          name: 'region',
          label: 'Regiune',
          max: 50,
          nt: true,
          description: 'Grupează lista sub țară: Champagne, Toscana, Banat.',
        }),
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
          admin: { description: 'Patru cifre; gol = fără an (pe site apare „NV”).', step: 1 },
        },
        text({ name: 'grapes', label: 'Soiuri', max: 80, nt: true }),
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
          admin: { description: 'Gol = nu se servește la pahar. Cu preț, vinul apare și la „Vinuri la pahar”.' },
        },
      ],
    },
    textarea({ name: 'description', label: 'Descriere scurtă', max: 160, localized: true }),
    media({
      name: 'photo',
      label: 'Fotografie',
      format: 'CARD-P',
      description: 'Pentru portalul de vinuri (D-14); lista de pe site nu arată fotografii (D-46).',
    }),
    {
      type: 'row',
      fields: [
        {
          name: 'featured',
          label: 'Recomandat',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Apare în lista de pe Acasă; cel mult 5 din fiecare tip.' },
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
      description: 'Pentru legarea ulterioară cu portalul de vinuri (D-14); la import, rândul din inventar.',
    }),
    ...contentFlags(),
  ],
}
